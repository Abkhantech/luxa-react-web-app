import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Card, CardContent } from '@mui/material';
import Image from 'next/image';
import certification_logo from '../../../assets/certification/certification_logo.png';
import RatingSystemSelector from './rating_system_selector';
import DisclaimerModal from './disclaimer';
function LEEDCertificationWizard({ setCreditButton, project_id }: any) {
  const [state, setState] = useState(false);
  const handleStart = () => {
    setState(true);
  };

  const handleCancel = () => {
    setCreditButton(false);
  };
  useEffect(() => {
    const pid = localStorage.getItem('pid');
  
    if (!!pid) {
      setState(true);
    }
  }, [])

  return (
    <Box>
      {!state ?
        <Box sx={{
          maxWidth: 'sm',
          mx: 'auto',
          p: 3,
          bgcolor: 'background.paper',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          <Typography variant="h5" gutterBottom>
            Project Certification
          </Typography>
          <Card variant="outlined" sx={{ mb: 2, width: '100%' }}>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                LEED Credit & Point Wizard
              </Typography>
              <Image src={certification_logo} alt="Dashboard Logo" style={{ margin: '0 auto' }} />
              <Typography sx={{ mt: 2 }}>
                Use this wizard to start your LEED Certification journey
              </Typography>
            </CardContent>
          </Card>
          <Box mt={2} display="flex" width="100%" justifyContent={'flex-end'}>
            <Button
              onClick={handleCancel}
              style={{ color: '#8D8D8D', marginRight: '8px' }}
            >
          Back
            </Button>
            <Button
              onClick={handleStart}
              style={{ backgroundColor: '#1A1A1A', color: '#FFFFFF' }}
            >
              Start
            </Button>
          </Box>
          <DisclaimerModal />
        </Box>

        :
        <RatingSystemSelector setCreditButton={setCreditButton} setState={setState} project_id={project_id} />}
    </Box>

  );
}

export default LEEDCertificationWizard;
