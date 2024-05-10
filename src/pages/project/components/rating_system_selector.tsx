import React, { useEffect, useState } from 'react';
import DisclaimerModal from './disclaimer';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  Select,
  MenuItem,
  FormControl,
  Button,
  Backdrop,
  CircularProgress
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useDispatch } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import { getAllCertifications, getAllCreditcategories, getAllRatingSystemAgainestId, getAllRatingSystems } from 'provider/redux/actions/certification.credits';
import { useRouter } from 'next/navigation';
import { attachRatingSystemToProject, getProjectById } from 'provider/redux/actions/project';

function RatingSystemSelector({ setState, project_id }: any) {
  const [ratingSystem, setRatingSystem] = useState<any>([]);
  const [selectedRatingSystem, setSelectedRatingSystem] = useState<any>('');
  const [credits, setAllCredits] = useState<any>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [creditCategoriesData, setCreditCategoriesData] = useState<any>([]);
  const [project, setProject] = useState<any>();
  const [checkState, setCheckState] = useState<any>(false);
  const [selectedCertification, setSelectedCertification] = useState<any>();
  const [certifications, setCertifications] = useState<any>([]);


  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const handleCancel = () => {
    setState(false);
  };

  const handleCreditSelect = (credit: any, project_id: number) => {
    router.push(`/credit-option/${credit.id}?project_id=${project_id}&rating_system_id=${selectedRatingSystem?.id}`);
  };


  const handleRatingSystemChange = (event: any) => {
    setSelectedRatingSystem(event.target.value);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(selectedCategory === category ? null : category);
  };
  useEffect(() => {
    setIsLoading(true);
    dispatch<any>(getAllRatingSystems())
      .then(unwrapResult)
      .then((res: any) => {
        setIsLoading(false);
        setRatingSystem(res);
      })
      .catch((err: any) => {
        setIsLoading(false);
        console.log(err);
      })

    dispatch<any>(getAllCreditcategories())
      .then(unwrapResult)
      .then((res: any) => {
        setCreditCategoriesData(res);
      })
      .catch((err: any) => {
        console.log(err);
      })
  }, [])
  useEffect(() => {

    if (selectedRatingSystem.id) {
      setIsLoading(true);
      dispatch<any>(getAllRatingSystemAgainestId(selectedRatingSystem?.id))
        .then(unwrapResult)
        .then((res: any) => {
          setAllCredits(res.credits);
          setIsLoading(false)
        })
        .catch((err: any) => {
          setIsLoading(false);
          console.log(err);
        })
    }
  }, [selectedRatingSystem])

  useEffect(() => {
    localStorage.removeItem('pid');
  }, [])



  useEffect(() => {
    if (project_id) {
      dispatch<any>(getProjectById(project_id))
        .then(unwrapResult)
        .then((res: any) => {
          if (res) {
            setProject(res);
            console.log(res);
          }
        })
        .catch((err: any) => {
          console.log(err);
        });
    }
  }, [project_id, selectedRatingSystem])

  useEffect(() => {
    if (project_id) {
      dispatch<any>(getProjectById(project_id))
        .then(unwrapResult)
        .then((res: any) => {
          if (res) {
            setProject(res);
            if (res.rating_system?.length !== 0) {
              setSelectedRatingSystem(res.rating_system[0]);
            }
          }
        })
        .catch((err: any) => {
          console.log(err);
        });
    }
  }, [project_id, checkState])
  useEffect(() => {
    if (project_id) {
      dispatch<any>(getAllCertifications())
        .then(unwrapResult)
        .then((res: any) => {
          if (res) {
            setCertifications(res);
            console.log(res);
          }
        })
        .catch((err: any) => {
          console.log(err);
        });
    }
  }, [project_id])
  const onSaveHandler = () => {
    setIsLoading(true);
    const payload = { project_id: project_id, rating_system: selectedRatingSystem?.rating_system }

    dispatch<any>(attachRatingSystemToProject(payload))
      .then(unwrapResult)
      .then((res: any) => {

        setIsLoading(false);
        setCheckState((prev: any) => !prev);
      })
      .catch((err: any) => {
        setIsLoading(false);
        console.log(err);
      })
  }
  const handleCertificationChange = (event: any) => {
    setSelectedCertification(event.target.value);
  };
  return (
    <Box sx={{
      maxWidth: 'md',
      mx: 'auto',
      p: 5,
      border: '1px solid #ddd',
      borderRadius: '4px',
      bgcolor: 'background.paper'
    }}>
      <DisclaimerModal />

      <Typography variant="h6" gutterBottom fontWeight={'bold'}>
        Select Rating System
      </Typography>
      <FormControl fullWidth margin="normal" sx={{ mb: 4 }}>
        <Select
          value={selectedRatingSystem || ""}
          onChange={handleRatingSystemChange}
          displayEmpty
          inputProps={{ 'aria-label': 'Select a rating system' }}
        >
          {project?.rating_system?.length === 0 ? <MenuItem value="" disabled>
            Select Rating System
          </MenuItem> : <MenuItem value={selectedRatingSystem} disabled>
            {selectedRatingSystem.rating_system}
          </MenuItem>}
          {project?.rating_system?.length === 0 && ratingSystem.map((system: any) => (
            <MenuItem key={system.id} value={system}>
              {system.rating_system}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Typography variant="h6" gutterBottom fontWeight={'bold'}>
        Select Certification
      </Typography>
      <FormControl fullWidth margin="normal" sx={{ mb: 4 }}>
        <Select
          value={selectedCertification || ""}
          onChange={handleCertificationChange}
          displayEmpty
          inputProps={{ 'aria-label': 'Select a certification' }}
        >
          <MenuItem value="" disabled>Select a certification</MenuItem>
          {certifications?.map((certification: any) => (
            <MenuItem key={certification.id} value={certification.certificationType}>
              {certification.certificationType}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {
        project?.rating_system?.length !== 0 &&
        <>
          <Typography variant="h6" gutterBottom fontWeight={'bold'}>
            LEED Credit Library
          </Typography>
          {
            creditCategoriesData.map((category: any) => (
              <Accordion key={category.id} expanded={selectedCategory === category.credit_category}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  onClick={() => handleCategoryChange(category.credit_category)}
                >
                  <Box component="span" sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box component="span" sx={{ mr: 1 }}>•</Box>
                    <Typography fontWeight={'bold'}>{category.credit_category}</Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <List>
                    {credits?.filter((credit: any) => credit.creditCategory.id === category.id)
                      .map((credit: any) => (
                        <ListItem
                          key={credit.id}
                          button
                          onClick={() => handleCreditSelect(credit, project_id)}
                        >
                          <Box component="span" sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box component="span" sx={{ mr: 1 }}>•</Box>
                            <ListItemText primary={credit.creditType} />
                          </Box>
                        </ListItem>
                      ))}
                  </List>
                </AccordionDetails>
              </Accordion>
            ))
          }
        </>}
      <Box mt={2} display="flex" justifyContent="end">
        <Button
          onClick={handleCancel}
          style={{ backgroundColor: '#1A1A1A', color: '#FFFFFF', marginRight: 8 }}
        >
     Back
        </Button>
        {
          project?.rating_system?.length === 0 &&
          selectedCertification && selectedRatingSystem &&
          <Button
            onClick={onSaveHandler}
            style={{ backgroundColor: '#1A1A1A', color: '#FFFFFF' }}
          >
            Save
          </Button>}
      </Box>

      {
        isLoading && (
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={isLoading}
            onClick={() => {
              setIsLoading(true);
            }}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        )
      }
    </Box >

  );
}

export default RatingSystemSelector;

