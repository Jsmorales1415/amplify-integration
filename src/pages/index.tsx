import Head from 'next/head';
import Image from 'next/image';
import logo from '../../public/next.svg';
import { Inter } from '@next/font/google';
import styles from '@/styles/Home.module.css';
import { Auth } from 'aws-amplify';
import { useState } from 'react';

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
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>{message}</p>
        {!user && !session && (
          <div>
            <input
              placeholder="Phone Number (+XX)"
              onChange={(event) => setNumber(event.target.value)}
            />
            <button onClick={signIn}>Get OTP</button>
          </div>
        )}
        {!user && session && (
          <div>
            <input
              placeholder="Your OTP"
              onChange={(event) => setOtp(event.target.value)}
              value={otp}
            />
            <button onClick={verifyOtp}>Confirm </button>
          </div>
        )}
        <div>
          <button onClick={verifyAuth}>Am I sign in?</button>
          <button onClick={signOut}>Sign Out</button>
        </div>
      </header>
    </div>
  );
}
