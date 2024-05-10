"use client";
import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  Grid,
  Card,
  CardContent,
  Container,
  CssBaseline,
  createTheme,
  ThemeProvider,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  FormControl,
  OutlinedInput,
  InputLabel,
  Chip,
  MenuItem,
  DialogActions,
  CircularProgress,
  Select,
  FormHelperText,
  Backdrop,
  Paper,
  DialogContentText,
  IconButton
} from '@mui/material';
import dashboardLogo from '../../assets/dashboard-logo/dashboard-logo.png';
import HomeIcon from '@mui/icons-material/Home';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useDispatch } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import { getUserAgainstId, registerUser } from '../../provider/redux/actions/user';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { State, City } from "country-state-city";
import { createProject, getProjectAgainestUser } from 'provider/redux/actions/project';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Badge from '@mui/material/Badge';
import CloseIcon from '@mui/icons-material/Close';
import { formatDistanceToNow } from 'date-fns';
import { getAllNotificationAgainestUser, updateNotificationIsViewedStatus } from 'provider/redux/actions/notification';
import { io } from 'socket.io-client';

export default function Dashboard() {
  const thisUrl = process.env.NEXT_PUBLIC_API_URL || '';
  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    router.push('/user-login');
  };

  const drawerWidth = 200;

  const theme = createTheme({
    palette: {
      background: {
        default: '#D4D4D4',
      },
      primary: {
        main: '#414141',
      },
      secondary: {
        main: '#1A1A1A',
      },
      text: {
        primary: '#1A1A1A',
        secondary: '#FFFFFF',
      },
    },
  });
  const { id } = router.query;
  const [user, setUser] = useState<any>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [adminEmailError, setAdminEmailError] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');
  const [projectName, setProjectName] = useState('');
  const [projectStartDate, setProjectStartDate] = useState('');
  const [projectEndDate, setProjectEndDate] = useState('');
  const [projectAddress, setProjectAddress] = useState('');
  const [projectCity, setProjectCity] = useState<any>([]);
  const [projectState, setProjectState] = useState<any>([]);
  const [slectedProjectCity, setSlectedProjectCity] = useState<any>();
  const [slectedProjectState, setSlectedProjectState] = useState<any>();
  const [projectNameError, setProjectNameError] = useState('');
  const [projectStartDateError, setProjectStartDateError] = useState('');
  const [projectEndDateError, setProjectEndDateError] = useState('');
  const [projectAddressError, setProjectAddressError] = useState('');
  const [projectStateError, setProjectStateError] = useState('');
  const [projectCityError, setProjectCityError] = useState('');
  const [stateManger, setStateManager] = useState(false);
  const [allProjects, setAllProjects] = useState<any>([]);
  const [notifications, setNotifications] = useState<any>([]);
  const [unSeenNotificationCount, setUnSeenNotificationCount] = useState<number>();
  const [refresh, setRefresh] = useState<boolean>(false);
  const [projectRefresh, setProjectRefresh] = useState<boolean>(false);
  const [open, setOpen] = useState(false);


  const handleProjectAdd = () => {

    setError('');
    setSuccess('');

    let isValid = true;

    setProjectNameError('');
    setProjectStartDateError('');
    setProjectEndDateError('');
    setProjectAddressError('');
    setProjectStateError('');
    setProjectCityError('');

    if (!slectedProjectState) {
      setProjectStateError('State is required');
      isValid = false;
    }
    if (!slectedProjectCity) {
      setProjectCityError('City is required');
      isValid = false;
    }

    if (!projectName) {
      setProjectNameError('Project Name is required');
      isValid = false;
    }
    if (!projectStartDate) {
      setProjectStartDateError('Start Date is required');
      isValid = false;
    }
    if (!projectEndDate) {
      setProjectEndDateError('End Date is required');
      isValid = false;
    } else if (projectStartDate && projectEndDate && new Date(projectStartDate) >= new Date(projectEndDate)) {
      setProjectEndDateError('End Date must be after Start Date');
      isValid = false;
    }
    if (!projectAddress) {
      setProjectAddressError('Address is required');
      isValid = false;
    }
    const state = slectedProjectState?.name;
    const city = slectedProjectCity?.name;
    if (isValid) {
      setIsLoading(true);
      const payload = {
        user_canonical_id: id,
        project_name: projectName,
        project_start_date: projectStartDate,
        estimated_end_date: projectEndDate,
        locations: {
          city: city,
          state: state,
          address: projectAddress
        }
      }
      dispatch<any>(createProject(payload))
        .then(unwrapResult)
        .then((res: any) => {
          if (res) {
            setSuccess("Successfully Added..");
            handleDialogClose();
            setIsLoading(false);
            handleProjectDialogClose();
            setProjectAddress('');
            setSlectedProjectCity('');
            setSlectedProjectState('');
            setProjectEndDate('');
            setProjectStartDate('');
            setProjectName('');
            setStateManager((prev) => !prev)
          }
        })
        .catch((err: any) => {
          setIsLoading(false);
          setError(err);
          console.log(err);
        })
    }

  };
  const validateRole = () => {
    if (selectedRoles.length === 0) {
      setRoleError("Please select at least one role.");
      return false;
    }
    return true;
  };

  const [roleError, setRoleError] = useState('');
  const handleRoleChange = (event: any) => {
    setSelectedRoles(event.target.value);
    setRoleError('');
  };
  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };
  useEffect(() => {
    if (id) {
      setIsLoading(true);
      dispatch<any>(getUserAgainstId(id))
        .then(unwrapResult)
        .then((res: any) => {
          setIsLoading(false);
          if (res) {
            setUser(res);
          }
        })
        .catch((err: any) => {
          setIsLoading(false);
          console.log(err);
        });
    }
  }, [id])

  const validateEmail = () => {
    if (!/\S+@\S+\.\S+/.test(userEmail)) {
      setAdminEmailError("Please enter a valid email address.");
      return false;
    }
    setAdminEmailError('');
    return true;
  };

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      router.push('/user-login');
    }
  }, [])
  const isAdmin = () => {
    return user?.roles?.some((role: { role_name: string; }) => role.role_name === "Admin");
  };
  const isProjectManager = () => {
    return user?.roles?.some((role: { role_name: string; }) => role.role_name === "Project Manager" || role.role_name === "Sustainability Manager");
  };
  const handleAddUser = () => {
    setIsDialogOpen(true);
  };
  const handleAddProject = () => {

    setIsProjectDialogOpen(true);

  };

  const handleAddAdmin = () => {
    if (!validateEmail() || !validateRole()) {
      return;
    }
    setError('');
    setSuccess('')
    setIsLoading(true);
    let FinalRole: { role_name: string; }[] = [];
    if (selectedRoles.length !== 0) {
      FinalRole = selectedRoles.map((role) => {
        return { role_name: role };
      });
    }
    const payload = {
      admin_id: id,
      email: userEmail,
      roles: FinalRole
    }

    dispatch<any>(registerUser(payload))
      .then(unwrapResult)
      .then((res: any) => {
        if (res) {
          setSuccess("Successfully Added..");
          handleDialogClose();
          setIsLoading(false);
          setUserEmail('');

        }
      })
      .catch((err: any) => {
        setIsLoading(false);
        console.log(err);
        setError('Email Already Exist');
      })

  };
  useEffect(() => {
    const timer = setTimeout(() => {
      setError('');
      setSuccess('');
    }, 2000);
    return () => clearTimeout(timer);
  }, [error, success]);

  useEffect(() => {
    if (user) {
      setIsLoading(true);
      dispatch<any>(getProjectAgainestUser(user?.company?.id))
        .then(unwrapResult)
        .then((res: any) => {
          if (res) {
            setIsLoading(false);
            if (isAdmin()) {
              setAllProjects(res);
            }
            else {
              const filteredProjects = res.filter((project: any) =>
                project.users.some((user: any) => user.user.canonical_id === id)
              );
              setAllProjects(filteredProjects);
            }
          }
        })
        .catch((err: any) => {
          setIsLoading(false);
          console.log(err);
        })
    }
  }, [stateManger, user, projectRefresh]);

  function getFirstLetter(name: string) {
    if (!name || typeof name !== 'string') {
      return '';
    }
    return name.charAt(0);
  }
  const handleHomeClick = () => {
    router.push(`/user-dashboard/${id}`);
  }
  const handleBackdropClick = (event: any) => {

    event.stopPropagation();
  };
  const handleProjectDialogClose = () => {
    setIsProjectDialogOpen(false);
  };

  useEffect(() => {
    setProjectState(State.getStatesOfCountry("US"));
  }, []);
  useEffect(() => {
    if (slectedProjectState !== null) {
      setProjectCity(City.getCitiesOfState("US", slectedProjectState?.isoCode));
    }
  }, [slectedProjectState]);

  function formatDate(dateString: any) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  }
  const handleProjectClick = (projectId: any) => {
    router.push(`/project/${id}?projectId=${projectId}`);
  };


  const handleNotifications = () => {
    setOpen(true);
    if (unSeenNotificationCount !== 0) {
      setIsLoading(true);
      dispatch<any>(updateNotificationIsViewedStatus(id))
        .then(unwrapResult)
        .then((res: any) => {
          setUnSeenNotificationCount(0);
          setIsLoading(false);

        })
        .catch((err: any) => {
          setIsLoading(false);
          console.log(err);
        });
    }

  };

  const handleClose = () => {
    setOpen(false);
  };
  useEffect(() => {

    if (id) {
      setIsLoading(true);
      dispatch<any>(getAllNotificationAgainestUser(id))
        .then(unwrapResult)
        .then((res: any) => {
          setIsLoading(false);
          const unviewedNotificationsCount = res.filter((notification: any) => !notification.is_viewed).length;
          setUnSeenNotificationCount(unviewedNotificationsCount);
          setNotifications(res);
        })
        .catch((err: any) => {
          setIsLoading(false);
          console.log(err);
        });

    }
  }, [id, refresh])


  useEffect(() => {
    const socket = io(thisUrl);

    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    socket.on('connect_error', error => {
      console.error('WebSocket connection error:', error);
    });

    socket.on('newNotification', newNotification => {
      if (newNotification?.receiver?.canonical_id === id) {
        setNotifications((prevNotifications: any) => [newNotification, ...prevNotifications]);
        setRefresh((prev: any) => !prev);
      }

    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const socket = io(thisUrl);

    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    socket.on('connect_error', error => {
      console.error('WebSocket connection error:', error);
    });

    socket.on('sendProjectAssignment', project_user => {

      if (project_user?.user?.canonical_id === id) {
        setProjectRefresh((prev: any) => !prev)
      }
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ display: 'flex' }}>
          <AppBar
            position="fixed"
            sx={{
              width: `calc(100% - ${drawerWidth}px)`,
              ml: `${drawerWidth}px`,
              backgroundColor: '#FFFFFF',
              color: 'text.primary',
              '& .MuiToolbar-root': {
                minHeight: '64px',
                padding: '0 24px',
              },
            }}
            color="secondary"
          >
            <Toolbar sx={{ justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Image src={dashboardLogo} alt="Dashboard Logo" width={200} height={66} />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main' }}>{getFirstLetter(user?.full_name)}</Avatar>
                <Box>
                  <Typography variant="subtitle1" component="div">{user?.full_name}</Typography>
                  {user?.roles.map((role: any, index: any) => (
                    <Typography key={index} variant="caption" component="div">
                      {role.role_name + " "}
                    </Typography>
                  ))}
                </Box>
              </Box>
            </Toolbar>
          </AppBar>
          <Drawer
            variant="permanent"
            sx={{
              width: drawerWidth,
              flexShrink: 0,
              [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
            }}
          >
            <Toolbar />
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
            <Box sx={{ overflow: 'auto' }}>
              <List>
                <ListItem button onClick={handleHomeClick}>
                  <ListItemIcon>
                    <HomeIcon />
                  </ListItemIcon>
                  <ListItemText primary="Home" />
                </ListItem>
                <ListItem button onClick={handleNotifications}>
                  <ListItemIcon>
                    <Badge badgeContent={unSeenNotificationCount} color="secondary">
                      <NotificationsIcon />
                    </Badge>
                  </ListItemIcon>
                  <ListItemText primary="Notifications" />
                </ListItem>
                <ListItem button onClick={handleLogout}>
                  <ListItemIcon>
                    <ExitToAppIcon />
                  </ListItemIcon>
                  <ListItemText primary="Logout" />
                </ListItem>
              </List>
            </Box>
          </Drawer>
          <Box component="main" sx={{ flexGrow: 1, p: 3, width: `calc(100% - ${drawerWidth}px)` }}>
            <Toolbar />
            <Container maxWidth="lg">
              <Box sx={{ my: 4 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 3,
                  }}
                >
                  <Typography variant="h4" component="h1" sx={{ color: 'text.primary' }}>
                    Welcome, {user?.full_name} 👋
                  </Typography>
                  {isProjectManager() && (<Button variant="contained" color="primary" onClick={handleAddProject}>
                    Add New Project
                  </Button>)}
                  {isAdmin() && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleAddUser}>
                      Add User
                    </Button>
                  )}
                </Box>
                {allProjects.length !== 0 &&
                  <>
                    <Grid container spacing={2}>
                      {allProjects.map((project: any) => (
                        <Grid item xs={12} sm={6} md={4} key={project.id}>
                          <Paper
                            sx={{
                              padding: 1,
                              marginBottom: 1,
                              cursor: 'pointer',
                              '&:hover': {
                                backgroundColor: '#f5f5f5',
                              },
                              '&:active': {
                                backgroundColor: '#e0e0e0',
                              },
                            }}
                            onClick={() => {
                              handleProjectClick(project.id);
                            }}
                            elevation={3}
                          >
                            <Typography variant="subtitle1" component="div" sx={{ fontWeight: 'bold' }}>
                              {project.project_name}
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                              <Typography variant="body2">Company: {project.company.name}</Typography>
                              <Typography variant="body2">Start Date: {formatDate(project.project_start_date)}</Typography>
                              <Typography variant="body2">End Date: {formatDate(project.estimated_end_date)}</Typography>
                              <Typography variant="body2">Phone: {project.company.business_phone_number}</Typography>
                              <Typography variant="body2">Id: {project.id}</Typography>
                            </Box>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  </>
                }


                {isProjectManager() && allProjects.length === 0 && (<Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Card sx={{ backgroundColor: '#FFFFFF' }}>
                      <CardContent>
                        <Typography variant="subtitle1" sx={{ color: 'text.primary' }}>
                          Are you new here?
                        </Typography>
                        <Typography variant="h6" sx={{ color: 'text.primary', mb: 2 }}>
                          Don't worry, start a new project to get an idea of the insights of your new construction project.
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
                )}
              </Box>
            </Container>
          </Box>
        </Box>
      </ThemeProvider>
      <Dialog
        open={isDialogOpen}
        onClose={handleDialogClose}
        onClick={handleBackdropClick}
        PaperProps={{
          style: {
            minWidth: '500px',
            maxWidth: '80%',
          },
        }}

      >

        <DialogTitle>Add Company User</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="adminEmail"
            label="Admin Email"
            type="email"
            fullWidth
            variant="standard"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            onBlur={validateEmail}
            error={Boolean(adminEmailError)}
            helperText={adminEmailError}
          />
          <FormControl fullWidth margin="dense" variant="standard">
            <InputLabel id="role-select-label">Role</InputLabel>
            <Select

              labelId="role-select-label"
              id="role-select"
              multiple
              value={selectedRoles}
              onChange={handleRoleChange}
              input={<OutlinedInput id="select-multiple-chip" label="Role" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
              error={Boolean(roleError)}
            >
              <MenuItem value="Sub Contractor">Sub Contractor</MenuItem>
              <MenuItem value="Sustainability Manager">Sustainability Manager</MenuItem>
              <MenuItem value="Project Manager">Project Manager</MenuItem>
            </Select>
            {roleError && <Typography color="error" variant="caption">{roleError}</Typography>}
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} style={{ color: '#8D8D8D' }}>Cancel</Button>
          <Button onClick={handleAddAdmin} style={{ backgroundColor: '#1A1A1A', color: '#FFFFFF' }} disabled={isLoading}>
            Add
          </Button>

        </DialogActions>
      </Dialog>
      <Dialog
        open={isProjectDialogOpen}
        onClose={handleProjectDialogClose}
        onClick={handleBackdropClick}
        PaperProps={{
          style: {
            minWidth: '500px',
            maxWidth: '80%',
            backgroundColor: '#FFFFFF',
          },
        }}
      >
        <DialogTitle>Add New Project</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="project-name"
            label="Project Name"
            type="text"
            fullWidth
            variant="outlined"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            error={Boolean(projectNameError)}
            helperText={projectNameError}

          />
          <TextField
            margin="dense"
            id="project-start-date"
            label="Project Start Date"
            type="date"
            fullWidth
            variant="outlined"
            value={projectStartDate}
            onChange={(e) => setProjectStartDate(e.target.value)}
            error={Boolean(projectStartDateError)}
            helperText={projectStartDateError}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            margin="dense"
            id="project-end-date"
            label="Estimated End Date"
            type="date"
            fullWidth
            variant="outlined"
            value={projectEndDate}
            onChange={(e) => setProjectEndDate(e.target.value)}
            error={Boolean(projectEndDateError)}
            helperText={projectEndDateError}

            InputLabelProps={{
              shrink: true,
            }}
          />
          <FormControl fullWidth margin="dense" variant="outlined">
            <InputLabel id="project-state-label">State</InputLabel>
            <Select
              labelId="project-state-label"
              id="project-state"
              value={slectedProjectState}
              onChange={(e) => setSlectedProjectState(e.target.value)}
              label="State"
            >

              {projectState &&
                projectState?.map((thisState: any) => {
                  return (
                    <MenuItem key={thisState.name} value={thisState}>
                      {thisState.name}
                    </MenuItem>
                  );
                })}
            </Select>
            <FormHelperText>{projectStateError}</FormHelperText>
          </FormControl>
          <FormControl fullWidth margin="dense" variant="outlined">
            <InputLabel id="project-city-label">City</InputLabel>
            <Select
              labelId="project-city-label"
              id="project-city"
              value={slectedProjectCity}
              onChange={(e) => setSlectedProjectCity(e.target.value)}
              label="City"
            >

              {projectCity &&
                projectCity?.map((thisCity: any) => {
                  return (
                    <MenuItem key={thisCity?.name} value={thisCity}>
                      {thisCity?.name}
                    </MenuItem>
                  );
                })}
            </Select>
            <FormHelperText>{projectCityError}</FormHelperText>
          </FormControl>
          <TextField
            margin="dense"
            id="project-address"
            label="Address"
            type="text"
            fullWidth
            variant="outlined"
            value={projectAddress}
            onChange={(e) => setProjectAddress(e.target.value)}
            error={Boolean(projectAddressError)}
            helperText={projectAddressError}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleProjectDialogClose} style={{ color: '#8D8D8D' }}>
            Back
          </Button>
          <Button
            onClick={() => {
              handleProjectAdd()
            }}
            style={{ backgroundColor: '#1A1A1A', color: '#FFFFFF' }}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          Notifications
          <IconButton onClick={handleClose} sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>

          {notifications.length !== 0 ? notifications?.map((notification: any, index: any) => (
            <Typography key={index} sx={{ marginY: 1 }}>
              - {notification.description}
              <Typography component="span" sx={{ color: 'green', marginLeft: 1, fontStyle: 'italic' }}>
                {formatDistanceToNow(new Date(notification.created_at))} ago
              </Typography>
            </Typography>
          )) : 'No new notifications for you.'}
        </DialogContent>
      </Dialog>
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
    </div>
  );

}
