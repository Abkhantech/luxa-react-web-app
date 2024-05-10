import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  FormHelperText,
  Backdrop
} from '@mui/material';
import { useDispatch } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import { updateProject } from 'provider/redux/actions/project';

function ProjectScopeForm({ project_id, user_id, setSelectedDetail }: any) {
  const [projectSize, setProjectSize] = useState('');
  const [numberOfFloors, setNumberOfFloors] = useState('');
  const [projectType, setProjectType] = useState('');
  const [budget, setBudget] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  const [errors, setErrors] = useState({
    projectSize: false,
    numberOfFloors: false,
    projectType: false,
    budget: false,
  });
  const buttonStyles = {
    add: {
      bgcolor: '#4caf50',
      color: '#ffffff',
      '&:hover': {
        bgcolor: '#43a047'
      },
      textTransform: 'none',
    },
    cancel: {
      color: '#757575',
      borderColor: '#bdbdbd',
      '&:hover': {
        borderColor: '#9e9e9e'
      },
      textTransform: 'none',
    }
  };
  const validateForm = () => {
    const newErrors = {
      projectSize: projectSize === '',
      numberOfFloors: numberOfFloors === '',
      projectType: projectType === '',
      budget: budget === '',
    };

    setErrors(newErrors);
    return Object.values(newErrors).every(field => field === false);
  };
  const handleCancel = () => {
    setSelectedDetail('');
  };


  const handleAdd = () => {
    if (!validateForm()) {
      return;
    }
    const payload = {
      project_id: project_id,
      body: {
        user_canonical_id: user_id,
        project_type: projectType,
        project_size: Number(projectSize),
        budget: Number(budget),
        no_of_floors: Number(numberOfFloors)
      }
    };
    setIsLoading(true);
    dispatch<any>(updateProject(payload))
      .then(unwrapResult)
      .then((res: any) => {
        if (res) {
          setIsLoading(false);
          setProjectSize('');
          setBudget('');
          setNumberOfFloors('');
          setProjectType('')
          setSelectedDetail('');

        }
      })
      .catch((err: any) => {
        console.log(err);
        setIsLoading(false);
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
      <Typography variant="h6" gutterBottom>
        Project Scope and Details
      </Typography>
      <Box component="form" noValidate autoComplete="off">
        <TextField
          autoFocus
          error={errors.projectSize}
          helperText={errors.projectSize ? "Project size is required" : ""}
          margin="dense"
          id="project-size"
          label="Project Size"
          type="number"
          fullWidth
          variant="outlined"
          value={projectSize}
          onChange={(e) => setProjectSize(e.target.value)}
        />
        <TextField
          error={errors.numberOfFloors}
          helperText={errors.numberOfFloors ? "Number of floors is required" : ""}
          margin="dense"
          id="number-of-floors"
          label="Number of Floors"
          type="number"
          fullWidth
          variant="outlined"
          value={numberOfFloors}
          onChange={(e) => setNumberOfFloors(e.target.value)}
        />
        <FormControl fullWidth margin="dense" variant="outlined" error={errors.projectType}>
          <InputLabel id="project-type-label">Project Type</InputLabel>
          <Select
            labelId="project-type-label"
            id="project-type"
            value={projectType}
            onChange={(e) => setProjectType(e.target.value)}
            label="Project Type"
          >
            <MenuItem value="residential">Residential</MenuItem>
            <MenuItem value="commercial">Commercial</MenuItem>
            <MenuItem value="infrastructure">Infrastructure</MenuItem>
          </Select>
          {errors.projectType && (
            <FormHelperText>Project type is required</FormHelperText>
          )}
        </FormControl>
        <TextField
          error={errors.budget}
          helperText={errors.budget ? "Budget is required" : ""}
          margin="dense"
          id="budget"
          label="Budget"
          type="number"
          fullWidth
          variant="outlined"
          value={budget}
          inputProps={{ step: 10 }}
          onChange={(e) => setBudget(e.target.value)}
        />
        <Box mt={2} display="flex" justifyContent="end">
          <Button
            onClick={handleCancel}
            style={{ color: '#8D8D8D', marginRight: '8px' }}
          >
             Back
          </Button>
          <Button
            onClick={handleAdd}
            style={{ backgroundColor: '#1A1A1A', color: '#FFFFFF' }}
            disabled={isLoading}
          >
          Add
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
    </Box>

  );
}

export default ProjectScopeForm;


