


import React, { useState } from 'react';
import {
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
  Box,
  CircularProgress,
  Backdrop
} from '@mui/material';

function SustainabilityGoalsForm({setSelectedDetail }: any) {
  const [certification, setCertification] = useState('');
  const [standard, setStandard] = useState('');
  const [customGoals, setCustomGoals] = useState('');
  const [isLoading, setIsLoading] = useState(false);


  const handleAdd = () => {
  };
  const handleCancel = () => {
    setSelectedDetail('');
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
        Sustainability Goals and Standards
      </Typography>
      <Box
        component="form"
        noValidate
        autoComplete="off"
        sx={{ '& .MuiFormControl-root': { mb: 2, width: '100%' } }}
      >
        <FormControl fullWidth margin="dense">
          <InputLabel id="certification-label">Select Certifications</InputLabel>
          <Select
            labelId="certification-label"
            id="select-certification"
            value={certification}
            label="Select Certifications"
            onChange={(e) => setCertification(e.target.value)}
          >
            <MenuItem value="LEED">LEED</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth margin="dense">
          <InputLabel id="standard-label">Select Goals/Standards to Benchmark</InputLabel>
          <Select
            labelId="standard-label"
            id="select-standard"
            value={standard}
            label="Select Goals/Standards to Benchmark"
            onChange={(e) => setStandard(e.target.value)}
          >
            <MenuItem value="UNSDG">UN Sustainable Design Goals</MenuItem>
          </Select>
        </FormControl>
        <TextField
          margin="dense"
          id="custom-goals"
          label="Custom Project Sustainability Goals"
          type="text"
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          value={customGoals}
          onChange={(e) => setCustomGoals(e.target.value)}
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

export default SustainabilityGoalsForm;
