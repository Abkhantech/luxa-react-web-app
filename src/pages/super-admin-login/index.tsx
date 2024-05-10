"use client";

import * as React from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';
import { useDispatch } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import { useRouter } from 'next/navigation';
import { loginSuperAdmin } from '../../provider/redux/actions/superAdmin';
import { Alert, Backdrop } from '@mui/material';
const AdminLogin = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [emailError, setEmailError] = React.useState('');
  const [passwordError, setPasswordError] = React.useState('');
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

  const handleLogin = (event: any) => {
    setIsLoading(true);
    event.preventDefault();
    setError('');
    if (validateEmail() && validatePassword()) {
      setIsLoading(true);
      const payload = { email, password };

      dispatch<any>(loginSuperAdmin(payload))
        .then(unwrapResult)
        .then((res: any) => {
          setIsLoading(false);
          if (res) {
            router.push(`/super-admin-dashboard/${res.superAdmin?.canonical_id}`);
          }
        })
        .catch((err: any) => {
          setIsLoading(false);
          setError(err);
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
  React.useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (!!token) {
      const tokenObj = decodeToken(token);
      router.push(`/super-admin-dashboard/${tokenObj?.canonical_id}`);
    }
  }, [])



  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          color: '#1A1A1A',
        }}
      >
        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {error}
          </Alert>
        )}
        <Typography component="h1" variant="h5" sx={{ color: '#1A1A1A' }}>
          Super Admin Sign in
        </Typography>

        <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1 }} >
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => { setEmail(e.target.value), setError("") }}
            error={Boolean(emailError)}
            helperText={emailError}
            onBlur={validateEmail}
            sx={{
              '& label.Mui-focused': {
                color: '#8D8D8D',
              },
              '& .MuiOutlinedInput-root': {
                '&.Mui-focused fieldset': {
                  borderColor: '#8D8D8D',
                },
              },
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => { setPassword(e.target.value), setError("") }}
            error={Boolean(passwordError)}
            helperText={passwordError}
            onBlur={validatePassword}
            sx={{
              '& label.Mui-focused': {
                color: '#8D8D8D',
              },
              '& .MuiOutlinedInput-root': {
                '&.Mui-focused fieldset': {
                  borderColor: '#8D8D8D',
                },
              },
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isLoading}
            sx={{
              mt: 3,
              mb: 2,
              backgroundColor: '#1A1A1A',
              color: '#FFFFFF',
              '&:hover': {
                backgroundColor: '#333333',
              },
            }}
          >
            Sign In
          </Button>
        </Box>
      </Box>
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
    </Container>

  );
};

export default AdminLogin;