import { Amplify } from 'aws-amplify';
import config from './src/aws-exports';
// Amplify.configure(config);
Amplify.configure({
  ...config,
  authenticationFlowType: 'CUSTOM_AUTH',
});
