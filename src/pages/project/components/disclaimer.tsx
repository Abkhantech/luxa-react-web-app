import React, { useState } from 'react';
import { Button, Typography, Box, Modal, Backdrop, Fade, ListItemIcon } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';

function DisclaimerModal() {
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="disclaimer-modal"
        aria-describedby="disclaimer-text"
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 4,
              borderRadius: '4px',
            }}
          >
            <Typography variant="h6" id="disclaimer-modal" sx={{ fontWeight: 'bold' }}>
              <ListItemIcon>
                <WarningIcon />
              </ListItemIcon>
              Disclaimer
            </Typography>
            <Typography variant="body1" id="disclaimer-text">
              This software is not endorsed or certified by LEED, USGBC, or GBCI.
            </Typography>
            <Button
              onClick={handleClose}
              style={{ color: '#8D8D8D', marginRight: '8px' }}
            >
            Back
            </Button>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}

export default DisclaimerModal;
