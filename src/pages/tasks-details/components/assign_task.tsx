import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
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
} from '@mui/material';
import { addNewUser, getAllUser } from 'provider/redux/actions/user';
import { useDispatch } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import { assignTask } from 'provider/redux/actions/task';

function AssignTask({ project_id, setAssignTask, user_id, selectedTaskId, setError, setSuccess, setTaskRefresher }: any) {
  const [allUsers, setAllUsers] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [noManagerAvailable, setNoManagerAvailable] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [adminEmailError, setAdminEmailError] = useState('');
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [roleError, setRoleError] = useState('');
  const [selectedManager, setSelectedManager] = useState<any>();

  const handleAssign = () => {
    setIsLoading(true);
    const payload = {
      project_id: project_id,
      assigned_user: selectedManager,
      task_id: selectedTaskId,
    };
    dispatch<any>(assignTask(payload))
      .then(unwrapResult)
      .then((res: any) => {
        setIsLoading(false);
        setSuccess('Task has been successfully assigned.')
        setTaskRefresher((prev: any) => !prev);
        setAssignTask(false);
      })
      .catch((err: any) => {
        setIsLoading(false);
        setError('Task not assigned.')
      });
  };

  const handleCancel = () => {
    setAssignTask(false);
  };

  const dispatch = useDispatch();

  useEffect(() => {
    setIsLoading(true);
    dispatch<any>(getAllUser(user_id))
      .then(unwrapResult)
      .then((res: any) => {
        if (res) {
          const filteredUsers = res.filter((user: any) =>
            user.is_on_boarded &&
            user.canonical_id !== user_id &&
            user.roles.some((role: any) => role.role_name === 'Project Manager' || role.role_name === 'Sustainability Manager')
          );
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
      });
  }, []);

  const handleDialogClose = () => {
    setIsDialogOpen(false);
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
    setSuccess('');
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
      roles: FinalRole,
      task_id: selectedTaskId
    };
    dispatch<any>(addNewUser(payload))
      .then(unwrapResult)
      .then((res: any) => {
        if (res) {
          setSuccess("Successfully Assigned and Added..");
          setIsLoading(false);
          setUserEmail('');
          setSelectedRoles([]);
          setTaskRefresher((prev: any) => !prev);
          handleDialogClose();
          setAssignTask(false);
        }
      })
      .catch((err: any) => {
        setIsLoading(false);
        setError('Email Already Exist');
      });
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

      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
        Assign Task
      </Typography>

      <Dialog
        open={isDialogOpen}
        onClose={handleDialogClose}
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
        <FormControl fullWidth margin="dense" variant="outlined">
          <InputLabel id="manager-select-label">Select Manager</InputLabel>
          <Select
            labelId="manager-select-label"
            id="manager-select"
            value={selectedManager ? selectedManager.id : ''}
            onChange={(e) => {
              const selectedValue = allUsers.find((user: { id: any; }) => user.id === e.target.value);
              setSelectedManager(selectedValue);
            }}
            label="Select Manager"
          >
            {allUsers?.map((user: any) => (
              <MenuItem key={user.id} value={user.id}>
                {user.full_name},
                {user.roles.map((role: any, index: any) => (
                  <span key={index}>{` ${role.role_name}${index < user.roles.length - 1 ? ', ' : ''}`}</span>
                ))}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
      <Box mt={2} display="flex" justifyContent="end">
        <Button
          onClick={handleCancel}
          style={{ color: '#8D8D8D', marginRight: '8px' }}
        >
     Back
        </Button>
        {!!selectedManager && <Button
          onClick={handleAssign}
          style={{ backgroundColor: '#1A1A1A', color: '#FFFFFF' }}
          disabled={isLoading}
        >
          Assign
        </Button>}
      </Box>
      {isLoading && (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={isLoading}
          onClick={() => setIsLoading(true)}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
    </Box>
  );
}

export default AssignTask;
