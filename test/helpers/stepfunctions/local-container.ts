import { GenericContainer } from 'testcontainers';

export const createStepFunctionsLocalContainer = async (
  mockConfigPath: string
) => {
  const container = await new GenericContainer('amazon/aws-stepfunctions-local')
    .withExposedPorts(8083)
    .withBindMount(
      mockConfigPath,
      '/home/StepFunctionsLocal/MockConfigFile.json',
      'ro'
    )
    .withEnv('SFN_MOCK_CONFIG', '/home/StepFunctionsLocal/MockConfigFile.json')
    // .withEnv('AWS_ACCESS_KEY_ID', process.env.AWS_ACCESS_KEY_ID as string)
    // .withEnv(
    //   'AWS_SECRET_ACCESS_KEY',
    //   process.env.AWS_SECRET_ACCESS_KEY as string
    // )
    // For federated credentials (for example, SSO), this environment variable is required.
    // .withEnv('AWS_SESSION_TOKEN', process.env.AWS_SESSION_TOKEN as string)
    // .withEnv('AWS_DEFAULT_REGION', process.env.AWS_REGION)
    .start();
  return container;
};
