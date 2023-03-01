import { useAuthenticator } from '@aws-amplify/ui-react';
import { Button, Grid, Typography } from '@mui/material';
import { useRouter } from 'next/router';
function Home() {
  const router = useRouter();

  const { user, signOut } = useAuthenticator((context) => [context.user]);

  const onLogOut = () => {
    signOut();
  };
  return (
    <Grid
      container
      sx={{ height: '100vh', justifyContent: 'center', alignItems: 'center' }}
    >
      <Grid item xs={10} md={4}>
        <Typography textAlign='center' variant='h2'>
          HOME
        </Typography>
        <Typography textAlign='center' variant='h4'>
          {user?.username}
        </Typography>
        <Button
          fullWidth
          sx={{ backgroundColor: '#77C115' }}
          variant='contained'
          onClick={onLogOut}
        >
          Log Out
        </Button>
      </Grid>
    </Grid>
  );
}

export default Home;
