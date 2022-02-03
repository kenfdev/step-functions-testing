# PoC Step Functions integration testing with Step Functions Local

credits got to the following repository:

https://github.com/nathanagez/aws-cdk-state-machine-asl

This repository takes a step further and creates the CDK within Jest and sends the ASL to Step Functions Local via the AWS SDK.

## How to run the test


```
# install the dependencies
npm install # whatsoever

# Spin up the Step Functions Local
docker-compose up

# run the test
npm test
```

## Reference

- [Using Mocked Service Integrations - AWS Step Functions](https://docs.aws.amazon.com/step-functions/latest/dg/sfn-local-test-sm-exec.html)
- [Mocking service integrations with AWS Step Functions Local | AWS Compute Blog](https://aws.amazon.com/jp/blogs/compute/mocking-service-integrations-with-aws-step-functions-local/)
- [aws-stepfunctions-examples/sam/app-local-testing-mock-config at main · aws-samples/aws-stepfunctions-examples](https://github.com/aws-samples/aws-stepfunctions-examples/tree/main/sam/app-local-testing-mock-config/)