import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import Image from 'next/image';
import ButtonBase from '@mui/material/ButtonBase';
import Paper from '@mui/material/Paper';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DetailsIcon from '@mui/icons-material/Details';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import ProjectScopeDialog from './components/project_scope_details';
import EnvironmentalImpactDialog from './components/environment_impact_details';
import SustainabilityGoalsDialog from './components/sustainability_goals';
import IntegrationDialog from './components/integration_with_other_tools';
import ManagersList from './components/assign_project';
import CertificationCard from './components/certification_card';
import DownloadForm from './components/file';
import { InsertDriveFile as FileIcon } from '@mui/icons-material';



import {
  Alert,
  AppBar,
  Avatar,
  Backdrop,
  Box, CircularProgress, CssBaseline, Drawer, FormControl, Grid, List, ListItem, ListItemIcon, ListItemText, MenuItem, Select, ThemeProvider, Toolbar, Typography, createTheme
} from '@mui/material';
import dashboardLogo from '../../assets/dashboard-logo/dashboard-logo.png';
import { getUserAgainstId } from 'provider/redux/actions/user';
import { getProjectById } from 'provider/redux/actions/project';

const Project = () => {
  const router = useRouter();
  const { projectId, id }: any = router.query;
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
  const drawerWidth = 200;
  const [user, setUser] = useState<any>();
  const [project, setProject] = useState<any>();
  const [company, setCompany] = useState<any>();
  const [selectedDetail, setSelectedDetail] = useState<any>('');
  const [assign, setAssign] = useState<any>(false);
  const [file, setFile] = useState<any>(false);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');
  const [creditButton, setCreditButton] = React.useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleHomeClick = () => {
    router.push(`/user-dashboard/${id}`);
  }
  const handleLogout = () => {

    localStorage.removeItem('jwtToken');
    router.push('/user-login');
  };
  const dispatch = useDispatch();

  useEffect(() => {
    if (id && projectId) {
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
  }, [id, projectId])
  const isAdmin = () => {
    return user?.roles?.some((role: { role_name: string; }) => role.role_name === "Admin");
  };
  useEffect(() => {
    
    if (id && projectId) {
      setIsLoading(true);
      dispatch<any>(getProjectById(projectId))
        .then(unwrapResult)
        .then((res: any) => {
          if (res) {
            setIsLoading(false);
            setProject(res);
            setCompany(res.company);
          }
        })
        .catch((err: any) => {
          setIsLoading(false);
          console.log(err);
        });
    }
  }, [id, projectId])

  function getFirstLetter(name: string) {
    if (!name || typeof name !== 'string') {
      return '';
    }
    return name.charAt(0);
  }
  const cardButtonStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    width: '100%',
    height: '100%'
  };
  const handleInfoChange = (event: any, projectId: any) => {
    setSelectedDetail(event.target.value);
  };

  const handleProjectDetails = () => {
    router.push(`/project-details/${projectId}`);
  };
  const handleTaskDetails = () => {
    router.push(`/tasks-details/${projectId}?user_id=${id}`);
  };

  useEffect(() => {
    const pid = localStorage.getItem('pid');
    if (!!pid) {
      setCreditButton(true);
    }
  }, [])
  useEffect(() => {
    const timer = setTimeout(() => {
      setError('');
      setSuccess('');
    }, 2000);
    return () => clearTimeout(timer);
  }, [error, success]);
  return (
    <Box>
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
                <ListItem button onClick={() => { handleTaskDetails() }}>
                  <ListItemIcon>
                    <DetailsIcon />
                  </ListItemIcon>
                  <ListItemText primary="Tasks Details" />
                </ListItem>
                {
                  !isAdmin() &&
                  <ListItem button onClick={() => { setCreditButton(true), setSelectedDetail(''), setAssign(false), setFile(false) }}>
                    <ListItemIcon>
                      <AssignmentIcon />
                    </ListItemIcon>
                    <ListItemText primary="Certification" />
                  </ListItem>
                }
                <ListItem button onClick={() => handleProjectDetails()} >
                  <ListItemIcon>
                    <DetailsIcon />
                  </ListItemIcon>
                  <ListItemText primary="Project Details" />
                </ListItem>
                {
                  !isAdmin() &&
                  <ListItem button onClick={() => { setCreditButton(false), setSelectedDetail(''), setAssign(true), setFile(false) }}>
                    <ListItemIcon>
                      <AssignmentTurnedInIcon />
                    </ListItemIcon>
                    <ListItemText primary="Assign Project" />
                  </ListItem>
                }
                {
                  project?.projectDetails?.length !== 0 &&
                  <ListItem button onClick={() => { setCreditButton(false), setSelectedDetail(''), setAssign(false), setFile(true) }}>
                    <ListItemIcon>
                      <FileIcon />
                    </ListItemIcon>
                    <ListItemText primary="File" />
                  </ListItem>
                }
                <ListItem button onClick={handleLogout}>
                  <ListItemIcon>
                    <LogoutIcon />
                  </ListItemIcon>
                  <ListItemText primary="Logout" />
                </ListItem>
              </List>
            </Box>
          </Drawer>
          <Box component="main" sx={{ flexGrow: 1, p: 3, width: `calc(100% - ${drawerWidth}px)` }}>
            <Toolbar />
            {project && (
              <Box>
                <Typography variant="h4" gutterBottom>{project.project_name}</Typography>
                <Typography variant="body1" gutterBottom>Company: {company?.name}</Typography>
                <Typography variant="body1" gutterBottom>Start Date: {new Date(project.project_start_date).toLocaleDateString()}</Typography>
                <Typography variant="body1" gutterBottom>End Date: {new Date(project.estimated_end_date).toLocaleDateString()}</Typography>
                <Typography variant="body1" gutterBottom>Phone: {company?.business_phone_number}</Typography>
                <Typography variant="body1" gutterBottom>Id: {project.id}</Typography>

                {selectedDetail === '' && !assign && !creditButton && !file && <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                  <Grid container spacing={2}>

                    {!isAdmin() && <Grid item xs={6} sm={3}>
                      <ButtonBase
                        sx={cardButtonStyles}
                        onClick={() => setCreditButton(true)}
                      >
                        <Paper sx={{ width: '100%', height: '100%', textAlign: 'center', padding: 2 }}>
                          <Typography variant="h5" component="div">Add Certification</Typography>
                        </Paper>
                      </ButtonBase>
                    </Grid>}
                    {
                      !isAdmin() &&
                      <Grid item xs={6} sm={3}>
                        <ButtonBase
                          sx={cardButtonStyles}
                          onClick={() => setAssign(true)}
                        >
                          <Paper sx={{ width: '100%', height: '100%', textAlign: 'center', padding: 2 }}>
                            <Typography variant="h5" component="div">Assign Project</Typography>
                          </Paper>
                        </ButtonBase>
                      </Grid>
                    }
                    <Grid item xs={6} sm={3}>
                      <ButtonBase
                        sx={cardButtonStyles}
                        onClick={() => handleProjectDetails()}
                      >
                        <Paper sx={{ width: '100%', height: '100%', textAlign: 'center', padding: 2 }}>
                          <Typography variant="h5" component="div">See Project Details</Typography>
                        </Paper>
                      </ButtonBase>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <ButtonBase sx={cardButtonStyles} onClick={() => handleTaskDetails()}>
                        <Paper sx={{ width: '100%', height: '100%', textAlign: 'center', padding: 2 }}>
                          <Typography variant="h5" component="div">Tasks Details</Typography>
                        </Paper>
                      </ButtonBase>
                    </Grid>
                    {
                      !isAdmin() &&
                      <Grid item xs={6} sm={3}>
                        <FormControl fullWidth sx={{ minWidth: 120 }}>
                          <Select
                            defaultValue=""
                            id={`additional-info-select-${project.id}`}
                            value={selectedDetail || ""}
                            onChange={(event) => handleInfoChange(event, project.id)}
                            displayEmpty
                            sx={{ width: '100%', height: '100%', textAlign: 'center', fontSize: 23, backgroundColor: 'white' }}
                          >
                            <MenuItem value="" disabled>
                              Select Details
                            </MenuItem>
                            <MenuItem value="project-scope">Project Scope Details</MenuItem>
                            <MenuItem value="environment-impact">Environment Impact Details</MenuItem>
                            <MenuItem value="sustainability-goals">Sustainability Goals and Standards</MenuItem>
                            <MenuItem value="integration-tools">Integration with Other Tools and Data Import</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                    }
                  </Grid>
                </Box>
                }
              </Box>
            )}
          </Box>

        </Box>
      </ThemeProvider>
      {selectedDetail === 'project-scope' && <ProjectScopeDialog project_id={projectId} user_id={id} setSelectedDetail={setSelectedDetail} />}
      {selectedDetail === 'environment-impact' && <EnvironmentalImpactDialog project_id={projectId} user_id={id} setSelectedDetail={setSelectedDetail} />}
      {selectedDetail === 'sustainability-goals' && <SustainabilityGoalsDialog project_id={projectId} user_id={id} setSelectedDetail={setSelectedDetail} />}
      {selectedDetail === 'integration-tools' && <IntegrationDialog project_id={projectId} user_id={id} setSelectedDetail={setSelectedDetail} />}
      {assign && <ManagersList setAssign={setAssign} project_id={projectId} user_id={user?.canonical_id} setSuccess={setSuccess} setError={setError} />}
      {creditButton && <CertificationCard setCreditButton={setCreditButton} project_id={projectId} />}
      {file && <DownloadForm project_id={projectId} setFile={setFile} />}
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
    </Box>
  );
};

export default Project;
