import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';

const AWS_PARTITION = process.env.AWS_PARTITION || 'aws';
const AWS_URL_SUFFIX = process.env.AWS_URL_SUFFIX || 'amazonaws.com';

// 99% copied from
// https://github.com/nathanagez/aws-cdk-state-machine-asl
export const extractStateMachineAsls = (stack: cdk.Stack) => {
  const { Resources: resources = {} } = Template.fromStack(stack).toJSON();

  const stateMachineResources = Object.keys(resources)
    .filter((resourceKey) => {
      const resource = resources[resourceKey];
      return resource && resource.Type === 'AWS::StepFunctions::StateMachine';
    })
    .map((resource) => resources[resource]);

  return stateMachineResources.map((resource) => {
    const definitionString = resource.Properties.DefinitionString;
    const [delimiter, values] = definitionString['Fn::Join'];
    const resolvedExpressions = resolveExpressions(values);
    return resolvedExpressions.join(delimiter);
  });
};

const resolveExpressions = (expressions: any) => {
  const resolvers = [
    {
      name: 'Ref',
      resolve: ref,
    },
  ];
  return expressions.map((expression: any) => {
    if (typeof expression === 'string') return expression;

    for (const resolver of resolvers) {
      if (expression.hasOwnProperty(resolver.name)) {
        return resolver.resolve(expression[resolver.name]);
      }
    }
    return expression;
  });
};

function ref(value: any) {
  switch (value) {
    case 'AWS::Partition':
      return AWS_PARTITION;
    case 'AWS::URLSuffix':
      return AWS_URL_SUFFIX;
    default:
      console.warn(`Could not resolve expression: ${value}`);
      return value; // unresolved
  }
}
