import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Backdrop,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  FormControl,
  InputLabel,
  OutlinedInput,
  Chip,
  MenuItem,
  DialogActions,
  Select,
  Alert
} from '@mui/material';
import { addNewUser, getAllUser } from 'provider/redux/actions/user';
import { useDispatch } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import { assignProject } from 'provider/redux/actions/project';

function ManagersList({ setAssign, project_id, user_id, setError, setSuccess }: any) {
  const [allUsers, setAllUsers] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [noManagerAvailable, setNoManagerAvailable] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [manageState, setManageState] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [adminEmailError, setAdminEmailError] = useState('');
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [roleError, setRoleError] = useState('');




  const handleAssign = (manager: any) => {
    setIsLoading(true);
    const payload = {
      user_id: manager.id,
      project_id: project_id,
      previous_user_id: user_id
    }
    dispatch<any>(assignProject(payload))
      .then(unwrapResult)
      .then((res: any) => {
        setIsLoading(false);
        setManageState((prev: any) => !prev);
      })
      .catch((err: any) => {
        console.log(err);
        setIsLoading(false);
      })
  };

  const handleCancel = () => {
    setAssign(false);
  };

  const dispatch = useDispatch();
  const [newFilteredUsers, setNewFilteredUsers] = useState<any>([])
  useEffect(() => {
    setIsLoading(true);
    dispatch<any>(getAllUser(user_id))
      .then(unwrapResult)
      .then((res: any) => {
        if (res) {
          const filteredUsers = res.filter((user: any) =>
            user.is_on_boarded === true &&
            user.canonical_id !== user_id &&
            user.roles.some((role: any) =>
              role.role_name === 'Project Manager' || role.role_name === 'Sustainability Manager'
            ) &&
            !user.projects.some((projectObj: any) =>
              projectObj.project && Number(projectObj.project.id) === Number(project_id)
            )
          );
          setNewFilteredUsers(filteredUsers);
          setIsLoading(false);
          if (filteredUsers.length === 0) {
            setNoManagerAvailable(true);
          } else {
            setAllUsers(filteredUsers);
          }
        }
      })
      .catch((err: any) => {
        setIsLoading(false);
        console.log(err);
      });
  }, [manageState]);

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };
  const handleBackdropClick = (event: any) => {
    event.stopPropagation();
  };

  const validateEmail = () => {
    if (!/\S+@\S+\.\S+/.test(userEmail)) {
      setAdminEmailError("Please enter a valid email address.");
      return false;
    }
    setAdminEmailError('');
    return true;
  };
  const validateRole = () => {
    if (selectedRoles.length === 0) {
      setRoleError("Please select at least one role.");
      return false;
    }
    return true;
  };
  const handleRoleChange = (event: any) => {

    setSelectedRoles(event.target.value);
    setRoleError('');
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
      user_id: user_id,
      project_id: project_id,
      email: userEmail,
      roles: FinalRole
    }
    dispatch<any>(addNewUser(payload))
      .then(unwrapResult)
      .then((res: any) => {
        if (res) {
          setSuccess("Successfully Assigned and Added..");
          setIsLoading(false);
          setUserEmail('');
          setSelectedRoles([]);
          handleDialogClose();
        }
      })
      .catch((err: any) => {
        setIsLoading(false);
        console.log(err);
        setError('Email Already Exist');
      })

  };
  return (
    <Box sx={{
      maxWidth: 'md',
      mx: 'auto',
      p: 3,
      border: '1px solid #ddd',
      borderRadius: '4px',
      bgcolor: 'background.paper'
    }}>

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
            label="User Email"
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

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Managers
        </Typography>
        <Button
          variant="contained"
          style={{ backgroundColor: '#1A1A1A', color: '#FFFFFF' }}
          onClick={() => setIsDialogOpen(true)}
        >
          New User
        </Button>
      </Box>
      {noManagerAvailable ? (
        <Typography variant="body1" gutterBottom>
          No Manager Available
        </Typography>
      ) : (
        <List>
          {allUsers?.map((manager: any) => (
            <React.Fragment key={manager.id}>
              <ListItem
                secondaryAction={
                  <Button variant="contained" onClick={() => handleAssign(manager)} style={{ backgroundColor: '#1A1A1A', color: '#FFFFFF' }}
                  >
                    Assign
                  </Button>
                }
              >
                <ListItemText
                  primary={manager.full_name}
                  secondary={manager.roles.map((role: any) => role.role_name).join(', ')}
                />
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      )}
      <Box mt={2} display="flex" justifyContent="end">
        <Button
          onClick={handleCancel}
          style={{ backgroundColor: '#1A1A1A', color: '#FFFFFF' }}
        >
          Back
        </Button>
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
    </Box>
  );
}

export default ManagersList;
