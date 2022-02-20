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
  const { nextEventIds, normalizedEvents } = rawEvents.reduce(
    (obj, e) => {
      const { nextEventIds, normalizedEvents } = obj;

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
    { nextEventIds: {}, normalizedEvents: {} } as {
      nextEventIds: NextEventIdsMap;
      normalizedEvents: EventsById;
    }
  );

  // console.log('next events', JSON.stringify(nextEvents));

  let [results, nextKey] = findNext('0', normalizedEvents, nextEventIds);
  while (nextKey) {
    const [res, next] = findNext(nextKey, normalizedEvents, nextEventIds);
    results = results.concat(res);
    nextKey = next;
  }

  // console.log('results', JSON.stringify(results));
  return results;
};

function findNext(
  key: string,
  normalizedEvents: EventsById,
  nextEventIds: NextEventIdsMap
): [any[], string?] {
  const events = [] as any[];
  const initialEvent = normalizedEvents[key];
  if (initialEvent) {
    const detail = (initialEvent as any)[typeMaps[initialEvent.type!]];
    events.push({ type: initialEvent.type, detail });
  }

  let next = nextEventIds[key];
  while (next) {
    if (next.length > 1) {
      // parallel
      const results = {} as { [key: string]: string[] };
      let continueKey = ''; // only one continue key should happen. I think...
      for (let k of next) {
        let [ns, nextKey] = findNext(k, normalizedEvents, nextEventIds);
        if (nextKey && !continueKey) {
          continueKey = nextKey;
        }

        const targetEvent = normalizedEvents[k];
        const name =
          targetEvent.stateEnteredEventDetails?.name ||
          targetEvent.stateExitedEventDetails?.name;
        results[`${targetEvent.type}${name || ''}`] = ns; // TODO: not sure if this has collisions or not
      }
      events.push(results);
      if (continueKey) return [events, continueKey];

      break;
    }

    const nextKey = next[0];
    const targetEvent = normalizedEvents[nextKey];
    if (targetEvent.type === 'ParallelStateSucceeded') {
      // Parallel screws things because of inconsistent order.
      // Break the sequence here
      return [events, nextKey];
    }

    const detail = (targetEvent as any)[typeMaps[targetEvent.type!]];
    events.push({ type: targetEvent.type, detail });
    next = nextEventIds[nextKey];
  }
  return [events];
}
