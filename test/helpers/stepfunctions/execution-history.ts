import { HistoryEvent } from '@aws-sdk/client-sfn';

const typeMaps = {
  ActivityFailed: 'activityFailedEventDetails',
  ActivityScheduled: 'activityScheduledEventDetails',
  ActivityScheduleFailed: 'activityScheduleFailedEventDetails',
  ActivityStarted: 'activityStartedEventDetails',
  ActivitySucceeded: 'activitySucceededEventDetails',
  ActivityTimedOut: 'activityTimedOutEventDetails',
  ChoiceStateEntered: 'stateEnteredEventDetails',
  ChoiceStateExited: 'stateExitedEventDetails',
  ExecutionAborted: 'executionAbortedEventDetails',
  ExecutionFailed: 'executionFailedEventDetails',
  ExecutionStarted: 'executionStartedEventDetails',
  ExecutionSucceeded: 'executionSucceededEventDetails',
  ExecutionTimedOut: 'executionTimedOutEventDetails',
  FailStateEntered: '',
  LambdaFunctionFailed: 'lambdaFunctionFailedEventDetails',
  LambdaFunctionScheduled: 'lambdaFunctionScheduledEventDetails',
  LambdaFunctionScheduleFailed: 'lambdaFunctionScheduleFailedEventDetails',
  LambdaFunctionStarted: '',
  LambdaFunctionStartFailed: 'lambdaFunctionStartFailedEventDetails',
  LambdaFunctionSucceeded: 'lambdaFunctionSucceededEventDetails',
  LambdaFunctionTimedOut: 'lambdaFunctionTimedOutEventDetails',
  MapIterationAborted: 'mapIterationAbortedEventDetails',
  MapIterationFailed: 'mapIterationFailedEventDetails',
  MapIterationStarted: 'mapIterationStartedEventDetails',
  MapIterationSucceeded: 'mapIterationSucceededEventDetails',
  MapStateAborted: '',
  MapStateEntered: '', // TODO: probably maps to stateEnteredEventDetails
  MapStateExited: '', // TODO: probably maps to stateExitedEventDetails
  MapStateFailed: '',
  MapStateStarted: 'mapStateStartedEventDetails',
  MapStateSucceeded: '',
  ParallelStateAborted: '',
  ParallelStateEntered: 'stateEnteredEventDetails',
  ParallelStateExited: 'stateExitedEventDetails',
  ParallelStateFailed: '',
  ParallelStateStarted: '',
  ParallelStateSucceeded: '',
  PassStateEntered: '',
  PassStateExited: '',
  SucceedStateEntered: '',
  SucceedStateExited: '',
  TaskFailed: 'taskFailedEventDetails',
  TaskScheduled: 'taskScheduledEventDetails',
  TaskStarted: 'taskStartedEventDetails',
  TaskStartFailed: 'taskStartFailedEventDetails',
  TaskStateAborted: '',
  TaskStateEntered: 'stateEnteredEventDetails',
  TaskStateExited: 'stateExitedEventDetails',
  TaskSubmitFailed: 'taskSubmitFailedEventDetails',
  TaskSubmitted: 'taskSubmittedEventDetails',
  TaskSucceeded: 'taskSucceededEventDetails',
  TaskTimedOut: 'taskTimedOutEventDetails',
  WaitStateAborted: '',
  WaitStateEntered: '',
  WaitStateExited: '',
} as { [key: string]: string };

type NextEventIdsMap = {
  [key: string]: string[];
};

type EventsById = {
  [eventId: string]: HistoryEvent;
};

export const optimizeExecutionHistory = (rawEvents: HistoryEvent[]) => {
  // TODO: think of an efficient way to do this
  const { nextEventIds: nextEventIdsMap, eventsById: normalizedEvents } =
    rawEvents.reduce(
      (obj, e) => {
        const { nextEventIds, eventsById: normalizedEvents } = obj;

        const id = e.id!.toString();
        const previousId = e.previousEventId!.toString();

        if (nextEventIds[previousId]) {
          nextEventIds[previousId].push(id);
        } else {
          nextEventIds[previousId] = [id];
        }

        normalizedEvents[id] = e;

        return obj;
      },
      { nextEventIds: {}, eventsById: {} } as {
        nextEventIds: NextEventIdsMap;
        eventsById: EventsById;
      }
    );

  // console.log('next events', JSON.stringify(nextEvents));

  let [results, nextKey] = findNext('0', normalizedEvents, nextEventIdsMap);
  while (nextKey) {
    const [res, next] = findNext(nextKey, normalizedEvents, nextEventIdsMap);
    results = results.concat(res);
    nextKey = next;
  }

  // console.log('results', JSON.stringify(results));
  return results;
};

function findNext(
  key: string,
  eventsById: EventsById,
  nextEventIdsMap: NextEventIdsMap
): [any[], string?] {
  let events = [] as any[];
  const initialEvent = eventsById[key];
  if (initialEvent) {
    const detail = getEventDetail(initialEvent);
    events.push({ type: initialEvent.type!, ...(detail && { detail }) });
  }

  let nextEventIds = nextEventIdsMap[key];
  while (nextEventIds && nextEventIds.length > 0) {
    if (nextEventIds.length > 1) {
      // if there are more than 2 events next, it is a parallel.
      // parallel events are described as objects
      const results = {} as { [key: string]: any[] };
      let continueKey: string | undefined = ''; // only one continue key should happen. I think...
      for (let nextEventId of nextEventIds) {
        let [subsequentEvents, nextKey] = findNext(
          nextEventId,
          eventsById,
          nextEventIdsMap
        );
        if (nextKey) {
          continueKey = nextKey;
        }

        const targetEvent = eventsById[nextEventId];
        const name =
          targetEvent.stateEnteredEventDetails?.name ||
          targetEvent.stateExitedEventDetails?.name;

        results[`${targetEvent.type}${name ? ` ${name}` : ''}`] =
          subsequentEvents; // TODO: not sure if this naming convention has collisions or not
      }
      events.push(results);

      while (continueKey) {
        const [res, next] = findNext(continueKey, eventsById, nextEventIdsMap);
        events = events.concat(res);
        continueKey = next;
      }
      // if (continueKey) return [events, continueKey]; // if there was a continueKey. End the array here.

      break;
    }

    const nextEventId = nextEventIds[0];
    const targetEvent = eventsById[nextEventId];
    if (targetEvent.type === 'ParallelStateSucceeded') {
      // Parallel screws things( from snapshot perspectives) because of inconsistent order.
      // Break the sequence here with a nextEventId
      return [events, nextEventId];
    }

    const detail = getEventDetail(targetEvent);
    events.push({ type: targetEvent.type, ...(detail && { detail }) });
    nextEventIds = nextEventIdsMap[nextEventId];
  }
  return [events];
}

function getEventDetail(event: HistoryEvent): any {
  return (event as any)[typeMaps[event.type!]];
}
