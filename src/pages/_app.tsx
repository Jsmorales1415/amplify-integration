import '@/styles/globals.css';
import type { AppProps } from 'next/app';
// import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react';
// import '@aws-amplify/ui-react/styles.css';
// import '../../configureAmplify';
import { Box, Button, Typography } from '@mui/material';

const components = {
  SignIn: {
    Header() {
      return (
        <Typography
          variant="h2"
          fontWeight="bold"
          textAlign="center"
          color="black"
          pt={5}
        >
          Sign In
        </Typography>
      );
    },
    Footer() {
      const { toResetPassword } = useAuthenticator();
      return (
        <Box textAlign="center" pb={5} px={4}>
          <Button
            onClick={toResetPassword}
            variant="text"
            sx={{ textTransform: 'none' }}
            fullWidth
          >
            Reset Password
          </Button>
        </Box>
      );
    },
  },
  ResetPassword: {
    Header() {
      return (
        <Typography
          variant="h3"
          fontWeight="bold"
          textAlign="center"
          color="black"
          pt={5}
          pb={3}
        >
          Reset Password
        </Typography>
      );
    },
  },
};

function App({ Component, pageProps }: AppProps) {
  return (
    // <Authenticator
    // formFields={formFields}
    // components={components}
    // hideSignUp={true}
    // variation="modal"
    // >
    <Component {...pageProps} />
    // </Authenticator>
  );
}

// export default withAuthenticator(App, { variation: 'modal' });
export default App;
