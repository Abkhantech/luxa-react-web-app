import React, { useEffect, useState } from 'react';
import { Box, Typography, TextField, Button, CircularProgress, Backdrop, styled } from '@mui/material';
import { useDispatch } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import { createTaskReview } from 'provider/redux/actions/task';

function CreateReviewForm({ setReview, task_id, setSuccess, setError, setTaskRefresher }: any) {
  const [taskDescription, setTaskDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [selectedFile, setSelectedFile] = useState<any>(null);

  const dispatch = useDispatch();
  const handleCancel = () => {
    setReview(false);
  };
  const handleFileChange = (event: any, setSelectedFile: any) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };
  const handleCreateReview = () => {
    setSuccess('');
    setError('');
    setFormSubmitted(true);

    const newErrors = {
      taskDescription: taskDescription === '',
      dueDate: dueDate === '',
    };

    if (Object.values(newErrors).some(field => field === true)) {
      setError('Please fill in all required fields.');
      return;
    }
    if (selectedFile?.type !== 'text/csv' && selectedFile?.type !== 'application/pdf') {
      setError("Please upload task file and you can only upload CSV or PDF files");
      return;
    }

    setIsLoading(true);
    const payload = {
      task_id: task_id,
      description: taskDescription,
      dueDate: dueDate,
      input_file: selectedFile
    };
    const formData = new FormData();
    formData.append("input_file", selectedFile);
    formData.append("task_id", task_id);
    formData.append("description", taskDescription);
    formData.append("dueDate", dueDate);

    dispatch<any>(createTaskReview(formData))
      .then(unwrapResult)
      .then((res: any) => {
        setTaskRefresher((prev: any) => !prev);
        setSuccess('Successfully Created Task Review.');
        setIsLoading(false);
        setTaskDescription('');
        setDueDate('');
        setFormSubmitted(false);
        setReview(false);
      })
      .catch((err: any) => {
        console.log(err);
        setError("Created Task Review Failed.");
        setIsLoading(false);
      });
  };

  const StyledFileInput = styled(TextField)(({ theme }) => ({
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#5A7BFC59",
        borderWidth: "1",
        borderRadius: "8px",
      },
    },
    "& input": {
      color: "#71717A",
      background: "#5A7BFC14",
      borderRadius: "8px",
    },
  }));
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
        Review Task
      </Typography>
      {formSubmitted && setError && (
        <Typography variant="body2" color="error">{setError}</Typography>
      )}
      <Box component="form" noValidate autoComplete="off">
        <TextField
          error={formSubmitted && taskDescription === ''}
          helperText={formSubmitted && taskDescription === '' ? "Review Description is required" : ""}
          margin="dense"
          id="task-description"
          label="What is wrong with this submission?"
          multiline
          rows={4}
          fullWidth
          variant="outlined"
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
        />
        <TextField
          error={formSubmitted && dueDate === ''}
          helperText={formSubmitted && dueDate === '' ? "Due Date is required" : ""}
          margin="dense"
          id="due-date"
          label="Due Date"
          type="date"
          fullWidth
          variant="outlined"
          InputLabelProps={{ shrink: true }}
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <input
          type="file"
          id="file-upload"
          accept=".pdf"
          onChange={(e) => handleFileChange(e, setSelectedFile)}
          style={{ display: 'none' }}
        />
        <label htmlFor="file-upload">
          <Button component="span" variant="contained" color="primary" style={{ backgroundColor: '#1A1A1A', color: '#FFFFFF' }}>
            Upload File
          </Button>
          {selectedFile && <span>{selectedFile.name}</span>}
        </label>
        <Box mt={2} display="flex" justifyContent="end">
          <Button
            onClick={handleCancel}
            style={{ color: '#8D8D8D', marginRight: '8px' }}
          >
            Back
          </Button>
          <Button
            onClick={handleCreateReview}
            style={{ backgroundColor: '#1A1A1A', color: '#FFFFFF' }}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress color="inherit" size={24} /> : 'Create Review'}
          </Button>
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

export default CreateReviewForm;
