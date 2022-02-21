# ValidationExceptionCatchTest

```mermaid
stateDiagram-v2
state "ExecutionStarted" as 0001
0000 --> 0001
state "ParallelStateEntered\nValidation" as 0002
0000 --> 0002
state "ParallelStateStarted" as 0003
0002 --> 0003
state "TaskStateEntered\nCheck Address" as 0004
0003 --> 0004
state "TaskScheduled" as 0005
0004 --> 0005
state "TaskStarted" as 0006
0005 --> 0006
state "TaskFailed" as 0007
0006 --> 0007
state "ParallelStateFailed" as 0008
0007 --> 0008
state "TaskStateEntered\nCheck Identity" as 0009
0003 --> 0009
state "TaskScheduled" as 0010
0009 --> 0010
state "TaskStarted" as 0011
0010 --> 0011
state "TaskSucceeded" as 0012
0011 --> 0012
state "TaskStateExited\nCheck Identity" as 0013
0012 --> 0013
state 0014 <<join>>
0008 --> 0014
0013 --> 0014
state "TaskStateExited\nValidation" as 0015
0002 --> 0015
state "TaskStateEntered\nValidationException" as 0016
0015 --> 0016
state "TaskScheduled" as 0017
0016 --> 0017
state "TaskStarted" as 0018
0017 --> 0018
state "TaskSucceeded" as 0019
0018 --> 0019
state "TaskStateExited\nValidationException" as 0020
0019 --> 0020
state "ExecutionSucceeded" as 0021
0020 --> 0021
state 0022 <<join>>
0014 --> 0022
0021 --> 0022
state 0023 <<join>>
0001 --> 0023
0022 --> 0023
```