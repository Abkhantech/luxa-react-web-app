"use client";
import React, { useEffect, useState } from 'react';
import { Container, Grid, TextField, Button, Typography, InputAdornment, CircularProgress, Backdrop } from '@mui/material';
import { useDispatch } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import { UpdateUserAgainstId, getUserAgainstId } from '../../provider/redux/actions/user';
import { useRouter } from 'next/router';
const SignUpPage = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [fullNameError, setFullNameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [phoneNumberError, setPhoneNumberError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const { id } = router.query;
  const validateFullName = () => {
    if (/\d/.test(fullName)) {
      setFullNameError("Full name cannot contain numbers");
      return false;
    } else if (fullName.trim() === '') {
      setFullNameError("Full Name is required");
      return false;
    }
    setFullNameError('');
    return true;
  };
  const validatePassword = () => {
    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      return false;
    }
    setPasswordError('');
    return true;
  };
  const validatePhoneNumber = () => {
    if (!/^\d{10}$/.test(phoneNumber)) {
      setPhoneNumberError("Please enter a valid 10-digit US phone number.");
      return false;
    }
    setPhoneNumberError('');
    return true;
  };
  const validateConfirmPassword = () => {
    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      return false;
    } else if (confirmPassword.trim() === '') {
      setConfirmPasswordError("Confirm Password is required");
      return false;
    }
    setConfirmPasswordError('');
    return true;
  };
  const handleSubmit = (event: any) => {

    event.preventDefault();
    const isFullNameValid = validateFullName();
    const isPasswordValid = validatePassword();
    const isConfirmPasswordValid = validateConfirmPassword();
    const isPhoneNumbervalid = validatePhoneNumber();
    if (!isFullNameValid || !isPasswordValid || !isConfirmPasswordValid || !isPhoneNumbervalid) {
      return;
    }
    setIsLoading(true);
    const formData = { fullName, password, confirmPassword, phoneNumber: `+1${phoneNumber}` };
    const payload = {
      id: id, user: {
        full_name: fullName,
        mobile_number: phoneNumber,
        password: password,
        confirm_password: confirmPassword,
        username: username
      }
    }
    dispatch<any>(UpdateUserAgainstId(payload))
      .then(unwrapResult)
      .then((res: any) => {
        if (res) {
          setIsLoading(false);
          router.push('/user-login');
        }
      })
      .catch((err: any) => {
        setIsLoading(false);
        console.log(err);
      })
  };
  useEffect(() => {
    if (id) {
      setIsLoading(true);
      dispatch<any>(getUserAgainstId(id))
        .then(unwrapResult)
        .then((res: any) => {
          if (res) {
            setIsLoading(false);
            setEmail(res.email);
            setCompany(res.company?.name);
            setRole(res.roles[0]?.role_name);
          }
        })
        .catch((err: any) => {
          setIsLoading(false);
          console.log(err);
        })
    }

  }, [id])
  return (
    <Container maxWidth="sm" style={{ backgroundColor: '#FFFFFF', padding: '20px', borderRadius: '8px' }}>
      <Typography variant="h4" gutterBottom style={{ textAlign: 'center', color: '#1A1A1A' }}>
        LUXA
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Full Name"
              variant="outlined"
              margin="normal"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              onBlur={validateFullName}
              error={Boolean(fullNameError)}
              helperText={fullNameError}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Username"
              variant="outlined"
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}

            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="password"
              label="Password"
              variant="outlined"
              margin="normal"
              onChange={(e) => setPassword(e.target.value)}
              onBlur={validatePassword}
              error={Boolean(passwordError)}
              helperText={passwordError}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="password"
              label="Confirm Password"
              variant="outlined"
              margin="normal"
              onChange={(e) => setConfirmPassword(e.target.value)}
              onBlur={validateConfirmPassword}
              error={Boolean(confirmPasswordError)}
              helperText={confirmPasswordError}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              margin="normal"
              value={email}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="PhoneNumber"
              label="Phone Number"
              type="text"
              fullWidth
              variant="outlined"
              margin="normal"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              onBlur={validatePhoneNumber}
              error={Boolean(phoneNumberError)}
              helperText={phoneNumberError}
              InputProps={{
                startAdornment: <InputAdornment position="start">+1</InputAdornment>,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Company"
              variant="outlined"
              margin="normal"
              value={company}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Role"
              variant="outlined"
              margin="normal"
              value={role}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
        </Grid>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          style={{ marginTop: '16px', backgroundColor: '#1A1A1A', color: '#FFFFFF' }}
          disabled={isLoading}
        >
          Sign Up
        </Button>
      </form>
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

export default SignUpPage;