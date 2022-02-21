# RetryPath

```mermaid
stateDiagram-v2
state "ExecutionStarted" as 0001
0000 --> 0001
state "TaskStateEntered\nLambdaState" as 0002
0000 --> 0002
state "TaskScheduled" as 0003
0002 --> 0003
state "TaskStarted" as 0004
0003 --> 0004
state "TaskFailed" as 0005
0004 --> 0005
state "TaskScheduled" as 0006
0005 --> 0006
state "TaskStarted" as 0007
0006 --> 0007
state "TaskFailed" as 0008
0007 --> 0008
state "TaskScheduled" as 0009
0008 --> 0009
state "TaskStarted" as 0010
0009 --> 0010
state "TaskFailed" as 0011
0010 --> 0011
state "TaskScheduled" as 0012
0011 --> 0012
state "TaskStarted" as 0013
0012 --> 0013
state "TaskSucceeded" as 0014
0013 --> 0014
state "TaskStateExited\nLambdaState" as 0015
0014 --> 0015
state "TaskStateEntered\nSqsState" as 0016
0015 --> 0016
state "TaskScheduled" as 0017
0016 --> 0017
state "TaskStarted" as 0018
0017 --> 0018
state "TaskSucceeded" as 0019
0018 --> 0019
state "TaskStateExited\nSqsState" as 0020
0019 --> 0020
state "ExecutionSucceeded" as 0021
0020 --> 0021
state 0022 <<join>>
0001 --> 0022
0021 --> 0022
```