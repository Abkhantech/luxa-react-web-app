import React, { useEffect, useState } from 'react';
import { Box, Typography, TextField, Button, CircularProgress, Backdrop, FormControl, InputLabel, MenuItem, Select, styled } from '@mui/material';
import { useDispatch } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import { createTask } from 'provider/redux/actions/task';
import { getOptionFromProjectDetails, projectDetails } from 'provider/redux/actions/project';

function CreateTaskForm({ project_id, setTask, user_id, setSuccess, setError, setTaskRefresher }: any) {
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [taskCredit, setTaskCredit] = useState('');
  const [taskOption, setTaskOption] = useState('');
  const [creditArray, setCreditArray] = useState<any>([]);
  const [optionArray, setOptionArray] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [selectedFile, setSelectedFile] = useState<any>(null);

  const dispatch = useDispatch();
  const handleCancel = () => {
    setTask(false);
  };
  const handleFileChange = (event: any, setSelectedFile: any) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };
  const handleCreateTask = () => {
    setSuccess('');
    setError('');
    setFormSubmitted(true);

    const newErrors = {
      taskTitle: taskTitle === '',
      taskDescription: taskDescription === '',
      dueDate: dueDate === '',
      taskCredit: taskCredit === '',
      taskOption: taskOption === '',
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
      user_id: user_id,
      project_id: project_id,
      title: taskTitle,
      description: taskDescription,
      dueDate: dueDate,
      task_credit: taskCredit,
      task_option: taskOption,
      input_file: selectedFile
    };

    const formData = new FormData();
    formData.append("input_file", selectedFile);
    formData.append("user_id", user_id);
    formData.append("project_id", project_id);
    formData.append("title", taskTitle);
    formData.append("description", taskDescription);
    formData.append("dueDate", dueDate);
    formData.append("task_credit", taskCredit);
    formData.append("task_option", taskOption);

    dispatch<any>(createTask(formData))
      .then(unwrapResult)
      .then((res: any) => {
        setTaskRefresher((prev: any) => !prev);
        setTask(false);
        setSuccess('Successfully Created Project Task.');
        setIsLoading(false);
        setTaskTitle('');
        setTaskDescription('');
        setDueDate('');
        setTaskCredit('');
        setTaskOption('');
        setFormSubmitted(false);
      })
      .catch((err: any) => {
        console.log(err);
        setError("Created Project Task Failed.");
        setIsLoading(false);
      });
  };
  useEffect(() => {
    dispatch<any>(projectDetails(project_id))
      .then(unwrapResult)
      .then((res: any) => {
        const uniqueObjects = res.filter((obj: any, index: number, self: any[]) => {
          return index === self.findIndex((t: any) => (
            t.credit.creditType === obj.credit.creditType
          ));
        });
        setCreditArray(uniqueObjects);
      })
      .catch((err: any) => {
        console.log(err);
      });
  }, [taskCredit]);

  useEffect(() => {
    if (taskCredit && project_id) {
      const payload = {
        project_id: project_id,
        creditType: taskCredit
      }
      dispatch<any>(getOptionFromProjectDetails(payload))
        .then(unwrapResult)
        .then((res: any) => {
          setOptionArray(res);
        })
        .catch((err: any) => {
          console.log(err);
        });
    }
  }, [taskCredit]);

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
        Create Task
      </Typography>
      {formSubmitted && setError && (
        <Typography variant="body2" color="error">{setError}</Typography>
      )}
      <Box component="form" noValidate autoComplete="off">
        <TextField
          autoFocus
          error={formSubmitted && taskTitle === ''}
          helperText={formSubmitted && taskTitle === '' ? "Task Title is required" : ""}
          margin="dense"
          id="task-title"
          label="Task Title"
          fullWidth
          variant="outlined"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
        />
        <TextField
          error={formSubmitted && taskDescription === ''}
          helperText={formSubmitted && taskDescription === '' ? "Task Description is required" : ""}
          margin="dense"
          id="task-description"
          label="Task Description"
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
        <FormControl fullWidth variant="outlined" margin="dense" error={formSubmitted && taskCredit === ''}>
          <InputLabel id="task-credit-label">Task Credit</InputLabel>
          <Select
            labelId="task-credit-label"
            id="task-credit"
            value={taskCredit}
            onChange={(e) => setTaskCredit(e.target.value)}
            label="Task Credit"
          >
            <MenuItem value="">
              <em>Select Task Credit</em>
            </MenuItem>
            {creditArray?.map((item: any) => (
              <MenuItem key={item.id} value={item.credit.creditType}>
                {item.credit?.creditType}
              </MenuItem>
            ))}
            <MenuItem value="Not Applicable">Not Applicable</MenuItem>
          </Select>
          {formSubmitted && taskCredit === '' && (
            <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
              Task Credit is required
            </Typography>
          )}
        </FormControl>


        <FormControl fullWidth variant="outlined" margin="dense" error={formSubmitted && taskOption === ''}>
          <InputLabel id="task-option-label">Task Option</InputLabel>
          <Select
            labelId="task-option-label"
            id="task-option"
            value={taskOption}
            onChange={(e) => setTaskOption(e.target.value)}
            label="Task Option"
          >
            <MenuItem value="">
              <em>Select Task Option</em>
            </MenuItem>
            {optionArray?.map((item: any) => (
              <MenuItem key={item.id} value={item.option}>
                {item.option}
              </MenuItem>
            ))}
            <MenuItem value="Not Applicable">Not Applicable</MenuItem>
          </Select>
          {formSubmitted && taskOption === '' && (
            <Typography variant="caption" color="error" sx={{ mt: .5, ml: 2 }}>
              Task Option is required
            </Typography>
          )}
        </FormControl>
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
            onClick={handleCreateTask}
            style={{ backgroundColor: '#1A1A1A', color: '#FFFFFF' }}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress color="inherit" size={24} /> : 'Create'}
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

export default CreateTaskForm;
