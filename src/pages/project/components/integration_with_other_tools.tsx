

import React, { useState } from 'react';
import { Button, Typography, Box, Paper, CircularProgress, Backdrop } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

function IntegrationForm({ project_id, user_id, setSelectedDetail }: any) {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (event: any) => {
    setFile(event.target.files[0]);
  };
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
        Integration with Other Tools and Data Import
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start', gap: 2 }}>
        <Button
          variant="contained"
          sx={{ bgcolor: '#1A1A1A', color: '#FFFFFF', '&:hover': { bgcolor: '#333' } }}
          startIcon={<CloudUploadIcon />}
          onClick={() =>''}
        >
          Connect with LUXA
        </Button>
        <Typography variant="subtitle1">
          Connect Luxa with existing project management tools, BIM software, or ERP systems
        </Typography>
        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          Data Import:
        </Typography>
        <Button
          variant="outlined"
          component="label"
          startIcon={<CloudUploadIcon />}
          sx={{ mt: 1, borderColor: '#1A1A1A', color: '#1A1A1A' }}
        >
          Tools for importing project data, such as specifications or architectural plans
          <input
            type="file"
            hidden
            onChange={handleFileChange}
          />
        </Button>
      </Box>
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

export default IntegrationForm;

