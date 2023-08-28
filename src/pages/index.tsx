import { useAuthenticator } from '@aws-amplify/ui-react';
import { Button, Grid, Typography } from '@mui/material';
import { useRouter } from 'next/router';
function Home() {
  const router = useRouter();

  const { user, signOut } = useAuthenticator((context) => [context.user]);

  const createBillingSession = async () => {
    try {
      fetch('http://localhost:3001/create-portal-session', {
        method: 'POST',
        // We convert the React state to JSON and send it as the POST body
        body: JSON.stringify({
          customerId: 'cus_OIxrqU6H0P6Lkj',
        }),
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }).then(function (response) {
        console.log(response);
        return response.json();
      });
    } catch (error) {
      console.log(error);
    }
  };

  const onLogOut = () => {
    signOut();
  };
  return (
    <Grid
      container
      sx={{ height: '100vh', justifyContent: 'center', alignItems: 'center' }}
    >
      <Grid item xs={10} md={4}>
        <Typography textAlign="center" variant="h2">
          HOME
        </Typography>
        <Typography textAlign="center" variant="h4">
          {user?.username}
        </Typography>
        <Button
          fullWidth
          sx={{ backgroundColor: '#77C115' }}
          variant="contained"
          onClick={onLogOut}
        >
          Log Out
        </Button>

        <Button onClick={createBillingSession}>Manage billing</Button>
      </Grid>
    </Grid>
  );
}

export default Home;
