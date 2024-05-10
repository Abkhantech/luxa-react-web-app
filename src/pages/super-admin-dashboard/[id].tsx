"use client";

import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Container, CircularProgress, ListItem, ListItemText, List, Alert, Card, CardHeader, CardContent, Grid, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, Backdrop } from '@mui/material';
import { useDispatch } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import InputAdornment from '@mui/material/InputAdornment';
import { addCompanyAdmin, getSuperAdminById } from '../../provider/redux/actions/superAdmin';
import { useRouter } from 'next/router';
import { getAll, getAllUser } from '../../provider/redux/actions/user';


function SuperAdminDashboard() {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [adminEmailError, setAdminEmailError] = useState('');
  const [businessPhoneNumberError, setBusinessPhoneNumberError] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [industryType, setIndustryType] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [businessPhoneNumber, setBusinessPhoneNumber] = useState('');
  const [superAdminEmail, setSuperAdminEmial] = useState('');
  const [addedAdmins, setAddedAdmins] = useState([]);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');
  const router = useRouter();
  const { id } = router.query;
  const dispatch = useDispatch();

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const validateEmail = () => {
    if (!/\S+@\S+\.\S+/.test(adminEmail)) {
      setAdminEmailError("Please enter a valid email address.");
      return false;
    }
    setAdminEmailError('');
    return true;
  };

  const validatePhoneNumber = () => {
    if (!/^\d{10}$/.test(businessPhoneNumber)) {
      setBusinessPhoneNumberError("Please enter a valid 10-digit US phone number.");
      return false;
    }
    setBusinessPhoneNumberError('');
    return true;
  };
  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleAddAdmin = () => {
    if (!validateEmail() || !validatePhoneNumber()) {
      return;
    }
    setError('');
    setSuccess('')
    setIsLoading(true);

    const payload = {
      email: adminEmail,
      company: {
        name: companyName,
        industry_type: industryType,
        address: companyAddress,
        business_phone_number: `+1${businessPhoneNumber}`
      }
    }

    dispatch<any>(addCompanyAdmin(payload))
      .then(unwrapResult)
      .then((res: any) => {
        if (res) {
          setSuccess("Successfully Added..");
          handleDialogClose();
          setIsLoading(false);
          getAllUsers();
          setAdminEmail('');
          setCompanyAddress('');
          setCompanyName('');
          setBusinessPhoneNumber('');
          setIndustryType('');
        }
      })
      .catch((err: any) => {
        setIsLoading(false);
        console.log(err);
        setError('Bussiness Phone Number Or Email Already Exist');
      })

  };
  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    router.push('/super-admin-login');
  };

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (id && token) {
      setIsLoading(true);
      dispatch<any>(getSuperAdminById(id))
        .then(unwrapResult)
        .then((res: any) => {
          setIsLoading(false);
          if (res) {
            setSuperAdminEmial(res.email);
          }
        })
        .catch((err: any) => {
          setIsLoading(false);
          console.log(err);
        });
    }
  }, [id])
  const getAllUsers = () => {
    setIsLoading(true);
    dispatch<any>(getAll())
      .then(unwrapResult)
      .then((res: any) => {
        setIsLoading(false);
        if (res) {
          setAddedAdmins(res);
        }
      })
      .catch((err: any) => {
        setIsLoading(false);
        console.log(err);
      });
  }
  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      getAllUsers();
    }

  }, [])
  useEffect(() => {
    const timer = setTimeout(() => {
      setError('');
      setSuccess('');
    }, 2000);
    return () => clearTimeout(timer);
  }, [error, success]);

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      router.push('/super-admin-login');
    }
  }, [])
  const handleBackdropClick = (event: any) => {
    event.stopPropagation();
  };
  return (
    <>

      <AppBar position="static" style={{ backgroundColor: '#1A1A1A' }}>
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1, color: '#FFFFFF' }}>
            Super Admin Dashboard
          </Typography>
          <Typography variant="h6" style={{ color: '#8D8D8D', marginRight: '20px' }}>
            {superAdminEmail}
          </Typography>
          <Button color="inherit" onClick={handleLogout}>Logout</Button>
        </Toolbar>
      </AppBar>
      {error && (
        <Alert severity="error" sx={{ width: '98%', mb: 2, alignItems: 'center' }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ width: '98%', mb: 2, alignItems: 'center' }}>
          {success}
        </Alert>
      )}
      <Container maxWidth="md" style={{ marginTop: '20px' }}>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h5" style={{ marginTop: '20px', marginBottom: '20px' }}>
              All Company Admins
            </Typography>
          </Grid>
          <Grid item>
            <Button variant="contained" style={{ backgroundColor: '#1A1A1A', color: '#FFFFFF' }} onClick={handleDialogOpen}>
              Add Admin
            </Button>
          </Grid>
        </Grid>
        <TableContainer component={Paper} elevation={3}>
          <Table sx={{ minWidth: 750 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell style={{ fontWeight: 'bold' }}>Company Name</TableCell>
                <TableCell align="left" style={{ fontWeight: 'bold' }}>Industry</TableCell>
                <TableCell align="left" style={{ fontWeight: 'bold' }}>Email</TableCell>
                <TableCell align="left" style={{ fontWeight: 'bold' }}>Phone Number</TableCell>
                <TableCell align="left" style={{ fontWeight: 'bold' }}>Address</TableCell>
                <TableCell align="left" style={{ fontWeight: 'bold' }}>Onboarding Invitation</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {addedAdmins.map((admin: any) => (
                <TableRow key={admin.email} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component="th" scope="row">{admin.company.name}</TableCell>
                  <TableCell align="left">{admin.company.industry_type}</TableCell>
                  <TableCell align="left">{admin.email}</TableCell>
                  <TableCell align="left">{admin.company.business_phone_number}</TableCell>
                  <TableCell align="left">{admin.company.address}</TableCell>
                  <TableCell align="left">{admin.is_on_boarded ? "Accepted" : "Pending"}</TableCell>

                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>

      <Dialog open={isDialogOpen} onClose={handleDialogClose} onClick={handleBackdropClick}>
        <DialogTitle>Add New Admin</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="adminEmail"
            label="Admin Email"
            type="email"
            fullWidth
            variant="standard"
            value={adminEmail}
            onChange={(e) => setAdminEmail(e.target.value)}
            onBlur={validateEmail}
            error={Boolean(adminEmailError)}
            helperText={adminEmailError}
          />
          <TextField
            margin="dense"
            id="companyName"
            label="Company Name"
            type="text"
            fullWidth
            variant="standard"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
          <TextField
            margin="dense"
            id="industryType"
            label="Industry Type"
            type="text"
            fullWidth
            variant="standard"
            value={industryType}
            onChange={(e) => setIndustryType(e.target.value)}
          />
          <TextField
            margin="dense"
            id="companyAddress"
            label="Company Address"
            type="text"
            fullWidth
            variant="standard"
            value={companyAddress}
            onChange={(e) => setCompanyAddress(e.target.value)}
          />
          <TextField
            margin="dense"
            id="businessPhoneNumber"
            label="Business Phone Number"
            type="text"
            fullWidth
            variant="standard"
            value={businessPhoneNumber}
            onChange={(e) => setBusinessPhoneNumber(e.target.value)}
            onBlur={validatePhoneNumber}
            error={Boolean(businessPhoneNumberError)}
            helperText={businessPhoneNumberError}
            InputProps={{
              startAdornment: <InputAdornment position="start">+1</InputAdornment>,
            }}
          />

        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} style={{ color: '#8D8D8D' }}>Cancel</Button>
          <Button onClick={handleAddAdmin} style={{ backgroundColor: '#1A1A1A', color: '#FFFFFF' }} disabled={isLoading}>
            Add
          </Button>

        </DialogActions>
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
      </Dialog>

    </>
  );
}

export default SuperAdminDashboard;