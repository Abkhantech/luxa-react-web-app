"use client";

import React, { useEffect, useState } from 'react';
import { Box, Container, Grid, Typography, TextField, Button, Checkbox, FormControlLabel, Paper, CircularProgress, Alert, Backdrop } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useDispatch } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import { useRouter } from 'next/navigation';
import { userLogin } from '../../provider/redux/actions/user';
import logo from '../../assets/logo/logo.png';
import Image from 'next/image';
const buttonBackground = 'linear-gradient(90deg, #016838 0%, #57A32F 50%, #97CF29 100%)';
const theme = createTheme({
  palette: {
    primary: {
      main: '#57A32F',
    },
    background: {
      default: '#8D8D8D',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          backgroundImage: buttonBackground,
          color: '#fff',
          '&:hover': {
            backgroundImage: buttonBackground,
          },
        },
      },
    },
  },
});


export default function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [emailError, setEmailError] = React.useState('');
  const [passwordError, setPasswordError] = React.useState('')
  const [error, setError] = React.useState('');
  const dispatch = useDispatch();
  const router = useRouter();
  const validateEmail = () => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!email) {
      setEmailError('Email is required');
      return false;
    } else if (!emailRegex.test(email)) {
      setEmailError('Invalid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePassword = () => {
    if (!password) {
      setPasswordError('Password is required');
      return false;
    }
    setPasswordError('');
    return true;
  };
  const handleSubmit = (event: any) => {
    event.preventDefault();
    setError('');
    if (validateEmail() && validatePassword()) {
      setIsLoading(true);
      const payload = { email, password };

      dispatch<any>(userLogin(payload))
        .then(unwrapResult)
        .then((res: any) => {
          if (res) {
            router.push(`/user-dashboard/${res.user?.canonical_id}`);
          }
        })
        .catch((err: any) => {
          setError(err);
          console.log(err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };
  const decodeToken = (token: any) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) =>
        '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));

      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };
  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (!!token) {
      const tokenObj = decodeToken(token);
      router.push(`/user-dashboard/${tokenObj?.canonical_id}`);
    }
  }, [])
  return (
    <ThemeProvider theme={theme}>
      <Container>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ marginY: 4 }}>
              <Typography variant="h4" sx={{ marginTop: 2, marginBottom: 1 }}>
                Welcome to
              </Typography>
              <Typography variant="h4" component="span" sx={{
                backgroundImage: buttonBackground,
                color: '#fff',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'block',
                marginBottom: 3
              }}>
                LUXA
              </Typography>
            </Box>
            <Box component="form" noValidate autoComplete="off" sx={{ mt: 1, backgroundColor: '#FFFFFF', flex: 1 }} onSubmit={handleSubmit}>
              {error && (
                <Alert severity="error" sx={{ width: '94%', mb: 2 }}>
                  {error}
                </Alert>
              )}
              <TextField
                fullWidth
                label="Email"
                margin="normal"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={Boolean(emailError)}
                helperText={emailError}
                onBlur={validateEmail}
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                margin="normal"
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={Boolean(passwordError)}
                helperText={passwordError}
                onBlur={validatePassword}
              />
              <FormControlLabel
                control={<Checkbox name="remember" color="primary" />}
                label="Remember me"
              />
              <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} type="submit">
                Login
              </Button>
            </Box>
          </Grid>


          <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column' }}>
            <Paper elevation={0} sx={{ padding: 2, flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: theme.palette.background.default }}>
              <Typography variant="h5" gutterBottom>About Luxa</Typography>
              <Typography paragraph>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.</Typography>
              <Typography variant="h5" gutterBottom>Features Luxa</Typography>
              <ul>
                <li>
                  <Typography paragraph>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five
                    centuries, but also the leap into electronic typesetting, remaining essentially unchanged.</Typography>
                </li>
                <li>
                  <Typography paragraph>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</Typography>
                </li>
                <li>
                  <Typography paragraph> Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since.
                  </Typography>
                </li>
              </ul>
            </Paper>
          </Grid>
        </Grid>
      </Container>
      {isLoading && (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={isLoading}
          onClick={() => {
            setIsLoading(true);
          }}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
    </ThemeProvider>
  );
}
