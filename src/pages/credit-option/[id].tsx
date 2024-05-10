import { useEffect, useState } from 'react';
import { Container, Typography, List, ListItem, ListItemText, Button, Box, Divider, IconButton, Backdrop, CircularProgress, TextField, Stack } from '@mui/material';
import { useRouter } from 'next/router';
import { useDispatch } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import { getCreditById, getOptions, saveCreditPoint } from 'provider/redux/actions/certification.credits';

const CreditDetailsPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const [credit, setCredit] = useState<any>();
  const [options, setOptions] = useState<any>([]);
  const [projectDetail, setProjectDetail] = useState<any>();
  const router = useRouter();
  const [point, setPoint] = useState<any>(0);
  const { id, project_id, rating_system_id }:any = router.query;
  const handleSave = (option_id: number) => {

    setIsLoading(true);
    const payload = {
      credit_id: id,
      project_id: project_id,
      rating_system_id: rating_system_id,
      point: point,
      option_id: option_id,
    }
    dispatch<any>(saveCreditPoint(payload))
      .then(unwrapResult)
      .then((res: any) => {
        setIsLoading(false);
        setProjectDetail(res);
        setSelectedPoint('');
      })
      .catch((err: any) => {
        setIsLoading(false);
        console.error(err);
      });
  }
  const [selectedPoint, setSelectedPoint] = useState<any>(null)

  const handleBack = () => {
    localStorage.setItem("pid", project_id);
    router.back();
  };

  useEffect(() => {

    if (id) {
      setIsLoading(true);
      dispatch<any>(getCreditById(id))
        .then(unwrapResult)
        .then((res: any) => {
          setIsLoading(false);
          setCredit(res);
        })
        .catch((err: any) => {
          setIsLoading(false);
          console.error(err);
        });
    }
  }, [id]);
  useEffect(() => {

    if (id) {
      const payload = {
        credit_id: id,
        project_id: project_id,
        rating_system_id: rating_system_id
      }
      setIsLoading(true);
      dispatch<any>(getOptions(payload))
        .then(unwrapResult)
        .then((res: any) => {
          setOptions(res);
          setIsLoading(false);
        })
        .catch((err: any) => {
          setIsLoading(false);
          console.error(err);
        });
    }
  }, [id, projectDetail]);
  const handlePointChange = (event: any) => {
    setPoint(Number(event.target.value));
  };

  const handleDisplayPoints = (option_id: any) => {
    const option = options.find((option: any) => option.option.id === option_id);
    return option ? option.points : 0;
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h4" component="h1" sx={{ flexGrow: 1, mb: 3 }}>
          Credit Detail
        </Typography>
      </Box>
      <Divider sx={{ mb: 3 }} />
      <Typography variant="h6" gutterBottom>
        Credit Name
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        {credit?.creditType || 'No credit name available'}
      </Typography>
      <Divider sx={{ my: 3 }} />
      <Typography variant="h6" gutterBottom>
        Credit Options
      </Typography>
      {credit?.options?.length > 0 ? (
        <List sx={{ width: '100%' }}>
          {credit.options.map((option: any) => (
            <ListItem key={option.id} divider>
              <ListItemText primary={option.option} />
              <Typography sx={{ mr: 2 }}>
                Current Points: {handleDisplayPoints(option.id)}

              </Typography>
              {selectedPoint !== option.id && (

                <Button onClick={() => { setSelectedPoint(option.id), setPoint(0) }}
                  style={{ backgroundColor: '#1A1A1A', color: '#FFFFFF' }}
                >
                  ADD POINTS
                </Button>

              )}
              {selectedPoint === option.id && (

                <Stack spacing={1} direction={'row'}>

                  <TextField
                    type="number"
                    label="Enter Point"
                    variant="outlined"
                    size="small"
                    value={point}
                    onChange={handlePointChange}
                    sx={{ mr: 2 }}
                  />
                  <Button
                    onClick={() => handleSave(option.id)}
                    style={{ backgroundColor: '#1A1A1A', color: '#FFFFFF' }}
                    disabled={isLoading}
                  >
                    Save
                  </Button>
                  <Button
                    onClick={() => { setSelectedPoint(null) }}
                    style={{ color: '#8D8D8D', marginRight: '8px' }}
                  >
                    Back
                  </Button>
                </Stack>
              )}
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography variant="subtitle1">No options.</Typography>
      )}
      <Box mt={2} display="flex" justifyContent="end">
        <Button
          onClick={handleBack}
          style={{ color: '#8D8D8D', marginRight: '8px' }}
        >
      Back
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
    </Container>
  );
};

export default CreditDetailsPage;
