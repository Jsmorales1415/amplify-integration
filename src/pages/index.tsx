import Image from 'next/image';
import { Inter } from '@next/font/google';
import { Auth } from 'aws-amplify';
import { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useRouter } from 'next/router';

const inter = Inter({ subsets: ['latin'] });

const NOTSIGNIN = 'You are NOT logged in';
const SIGNEDIN = 'You have logged in successfully';
const SIGNEDOUT = 'You have logged out successfully';
const WAITINGFOROTP = 'Enter OTP number';
const VERIFYNUMBER = 'Verifying number (Country code +XX needed)';

export default function Home() {
  const [message, setMessage] = useState('Welcome to Demo');
  const [number, setNumber] = useState('');
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [otp, setOtp] = useState('');

  const router = useRouter();

  const verifyAuth = () => {
    Auth.currentAuthenticatedUser()
      .then((user) => {
        setUser(user);
        setMessage(SIGNEDIN);
        setSession(null);
      })
      .catch((err) => {
        console.error(err);
        setMessage(NOTSIGNIN);
      });
  };

  const signIn = () => {
    setMessage(VERIFYNUMBER);
    Auth.signIn(number)
      .then((result) => {
        setSession(result);
        setMessage(WAITINGFOROTP);
      })
      .catch((e) => {
        if (e.code === 'UserNotFoundException') {
          console.log('User not found');
        } else if (e.code === 'UsernameExistsException') {
          setMessage(WAITINGFOROTP);
          signIn();
        } else {
          console.log(e.code);
          console.error(e);
        }
      });
  };

  const signOut = () => {
    if (user) {
      Auth.signOut();
      setUser(null);
      setOtp('');
      setMessage(SIGNEDOUT);
    } else {
      setMessage(NOTSIGNIN);
    }
  };

  const verifyOtp = () => {
    Auth.sendCustomChallengeAnswer(session, otp)
      .then((user) => {
        setUser(user);
        setMessage(SIGNEDIN);
        setSession(null);
      })
      .catch((err) => {
        setMessage(err.message);
        setOtp('');
        console.log(err);
      });
  };

  return (
    <Box className="App">
      <header className="App-header">
        <Image
          src="/vercel.svg"
          alt="Vercel Logo"
          width={100}
          height={24}
          priority
        />
        <Typography variant='h5' sx={{ my: 5 }}>{message}</Typography>
        {!user && !session && (
          <Box >
            <TextField
              variant="outlined"
              sx={{ mr: 5 }}
              placeholder="Phone Number (+XX)"
              onChange={(event) => setNumber(event.target.value)}
            />
            <Button variant='contained' onClick={signIn}>Get OTP</Button>
          </Box>
        )}
        {!user && session && (
          <Box sx={{ mt: 5 }}>
            <TextField
              variant="outlined"
              placeholder="Your OTP"
              onChange={(event) => setOtp(event.target.value)}
              value={otp}
            />
            <Button variant='contained' onClick={verifyOtp}>Confirm </Button>
          </Box>
        )}
        <Box sx={{ mt: 5 }}>
          <Button variant='contained' onClick={verifyAuth} sx={{ mr: 13 }}>Am I sign in?</Button>
          <Button variant='contained' onClick={signOut}>Sign Out</Button>
        </Box>
        <Button variant='contained' color='success' sx={{ mt: 5}} onClick={() => {
          router.push('/activities')
        }}>Go to Activities</Button>
      </header>
    </Box>
  );
}
