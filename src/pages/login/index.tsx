import { Button, Grid } from '@mui/material';
import { Auth } from 'aws-amplify';
import { useRouter } from 'next/router';
import { SetStateAction, useState } from 'react';
import { IUserLoginForm, LogIn } from '../../components/auth/log-in';
import { ResetPassword } from '../../components/auth/reset-password';

const LogInPage = () => {
  const router = useRouter();

  const [needToChangePassword, setNeedToChangePassword] = useState(false);

  const [loggedUser, setLoggedUser] = useState();

  const onLogIn = async ({ email, password }: IUserLoginForm) => {
    try {
      const user = await Auth.signIn(email, password);
      console.log({ user });
      if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
        setNeedToChangePassword(true);
        // Auth.completeNewPassword
        setLoggedUser(user);
        return;
      }
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (error) {
      console.log('error signing in', error);
    }
  };

  const onResetPassword = (password: string) => {
    Auth.completeNewPassword(
      loggedUser, // the Cognito User Object
      password // the new password
    )
      .then((user) => {
        setNeedToChangePassword(false);
        router.push('/');
        // at this time the user is logged in if no MFA required
        console.log(user);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <Grid
      container
      sx={{ height: '100vh', justifyContent: 'center', alignItems: 'center' }}
    >
      <Grid item xs={10} md={4}>
        {needToChangePassword ? (
          <ResetPassword onResetPassword={onResetPassword} />
        ) : (
          <LogIn onSignIn={onLogIn} />
        )}
      </Grid>
    </Grid>
  );
};

export default LogInPage;
