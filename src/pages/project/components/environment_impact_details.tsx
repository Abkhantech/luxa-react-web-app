import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Paper, CircularProgress, Backdrop } from '@mui/material';

function EnvironmentalImpactForm({ project_id, user_id, setSelectedDetail }: any) {
  const [energyUseGoal, setEnergyUseGoal] = useState('');
  const [waterUseGoal, setWaterUseGoal] = useState('');
  const [wasteManagementPlan, setWasteManagementPlan] = useState('');
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
        Environmental Impact Details
      </Typography>
      <Box
        component="form"
        noValidate
        autoComplete="off"
        sx={{ '& .MuiTextField-root': { mb: 2, width: '100%' } }}
      >
        <TextField
          autoFocus
          id="energy-use-goal"
          label="Energy Use Goal"
          type="text"
          variant="outlined"
          value={energyUseGoal}
          onChange={(e) => setEnergyUseGoal(e.target.value)}
        />
        <TextField
          id="water-use-goal"
          label="Water Use Goal"
          type="text"
          variant="outlined"
          value={waterUseGoal}
          onChange={(e) => setWaterUseGoal(e.target.value)}
        />
        <TextField
          id="waste-management-plan"
          label="Waste Management Plan"
          type="text"
          multiline
          rows={4}
          variant="outlined"
          value={wasteManagementPlan}
          onChange={(e) => setWasteManagementPlan(e.target.value)}
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

export default EnvironmentalImpactForm;
