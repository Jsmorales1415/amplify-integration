import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Auth } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import '../../configureAmplify';

function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default withAuthenticator(App, { variation: 'modal' });
// export default App;
