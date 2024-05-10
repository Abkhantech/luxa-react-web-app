import React, { useState } from 'react';
import { Box, Typography, TextField, Button, CircularProgress, Backdrop } from '@mui/material';
import { useDispatch } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import { createTaskFile } from 'provider/redux/actions/task';

function CompleteTaskForm({ selectedTaskId, setCompelete, setSuccess, setError, setTaskRefresher }: any) {
  const [fileDescription, setFileDescription] = useState('');
  const [file, setFile] = useState<any>(null); 
  const [isLoading, setIsLoading] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const dispatch = useDispatch();

  const handleCancel = () => {
    setCompelete(false);
  };

  const handleFileChange = (event: any) => {
    const fileList = event.target.files;
    if (fileList && fileList.length > 0) {
      setFile(fileList[0]); 
    }
  };

  const handleCompleteTask = () => {
    setSuccess('');
    setError('');
    setFormSubmitted(true);

    const newErrors = {
      fileDescription: fileDescription === '',
      fileEmpty: file === null, 
    };

    if (Object.values(newErrors).some(field => field === true)) {
      setError('Please fill in all required fields.');
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("input_file", file);
    formData.append("task_id", selectedTaskId);
    formData.append("description", fileDescription);
    dispatch<any>(createTaskFile(formData)) 
      .then(unwrapResult)
      .then((res: any) => {
        setTaskRefresher((prev: any) => !prev);
        setSuccess('Task Task File Added Successfully.');
        setIsLoading(false);
        setFileDescription('');
        setFile(null); 
        setCompelete(false);
        setFormSubmitted(false); 
        
      })
      .catch((err: any) => {
        setSuccess('Task Task File Failed.');
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
        Complete Task
      </Typography>
      {formSubmitted && setError && (
        <Typography variant="body2" color="error">{setError}</Typography>
      )}
      <Box component="form" noValidate autoComplete="off">
        <TextField
          autoFocus
          error={formSubmitted && fileDescription === ''}
          helperText={formSubmitted && fileDescription === '' ? "File Description is required" : ""}
          margin="dense"
          id="file-description"
          label="File Description"
          fullWidth
          variant="outlined"
          value={fileDescription}
          onChange={(e) => setFileDescription(e.target.value)}
        />
        <input
          type="file"
          id="file-upload"
          accept=".pdf"
          onChange={(e)=>handleFileChange(e)}
          style={{ display: 'none' }}
        />
        <label htmlFor="file-upload">
          <Button component="span" variant="contained" color="primary" style={{ backgroundColor: '#1A1A1A', color: '#FFFFFF' }}>
            Upload File
          </Button>
          {file && <span>{file.name}</span>}
        </label>
        <Box mt={2} display="flex" justifyContent="end">
          <Button
            onClick={handleCancel}
            style={{ color: '#8D8D8D', marginRight: '8px' }}
          >
       Back
          </Button>
          {
            file && !!fileDescription &&
            <Button
              onClick={handleCompleteTask}
              style={{ backgroundColor: '#1A1A1A', color: '#FFFFFF' }}
              disabled={isLoading}
            >
              Add
            </Button>
          }
        </Box>
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

export default CompleteTaskForm;
