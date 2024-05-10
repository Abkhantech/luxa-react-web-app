import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import { getProjectAgainestId, projectDetails } from 'provider/redux/actions/project';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Backdrop,
  CircularProgress,
  Typography,
  Button,
  Box
} from '@mui/material';

const ProjectDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const [isLoading, setIsLoading] = useState(false);
  const [projectDetail, setProjectDetail] = useState<any>([]);
  const [project, setProject] = useState<any>();
  const dispatch = useDispatch();

  useEffect(() => {
    if (id) {

      setIsLoading(true);
      dispatch<any>(projectDetails(id))
        .then(unwrapResult)
        .then((res: any) => {
          setIsLoading(false);
          setProjectDetail(res);
        })
        .catch((err: any) => {
          setIsLoading(false);
          console.error(err);
        });

    }
  }, [id])

  useEffect(() => {
    if (id) {

      setIsLoading(true);
      dispatch<any>(getProjectAgainestId(id))
        .then(unwrapResult)
        .then((res: any) => {
          setIsLoading(false);
          setProject(res);
        })
        .catch((err: any) => {
          setIsLoading(false);
          console.error(err);
        });

    }
  }, [id])

  const handleCancel = () => {
    router.back();
  };

  const jsonToCSV = (jsonArray: any[]): string => {
    const headers = Object.keys(jsonArray[0]).join(",");
    const rows = jsonArray.map((obj) => Object.values(obj).join(","));
    return [headers, ...rows].join("\n");
  };

  const downloadCSV = (csvContent: string, fileName: string): void => {
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  const downloadFile = () => {
    let dataToConvert: any = [];
    projectDetail.map((record: any) => {
      const customObj = {
        RatingSystem: `"${record?.rating_system?.rating_system ?? "-"}"`,
        CreditCategory: record?.credit?.creditCategory?.credit_category ?? "-",
        CreditName: record?.credit?.creditType ?? "-",
        OptionName: record?.option?.option ?? "-",
        Points: record?.points,
      };
      dataToConvert.push(customObj);
    });

    const csvData = jsonToCSV(dataToConvert);
    downloadCSV(csvData, "ProjectLUXA.csv");
  };




  return (

    <Box p={2}>
      {isLoading && (
        <Backdrop open={isLoading}>
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
      {projectDetail.length > 0 ? (
        <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
          <Typography variant="h4" sx={{ mb: 2 }}>
            Project Details
          </Typography>
          <Typography variant="h5" sx={{ mb: 1 }}>
            Project: {project?.project_name}
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            Total Points: {project?.total_points}
          </Typography>
          <Typography variant="body1">
            Certification Type:{' '}
            {!!project?.certification?.certificationType
              ? project?.certification?.certificationType
              : 'No Certification Attached'}
          </Typography>
        </Paper>
      ) : (
        <Typography variant="body1" sx={{ mb: 2 }}>
          No project details available for this project.
        </Typography>
      )}
      <TableContainer component={Paper} sx={{ mb: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Rating System</TableCell>
              <TableCell>Credit Category</TableCell>
              <TableCell>Credit Name</TableCell>
              <TableCell>Option Name</TableCell>
              <TableCell>Points</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projectDetail.map((data: any) => (
              <TableRow key={data.id}>
                <TableCell>{data.rating_system.rating_system}</TableCell>
                <TableCell>{data.credit.creditCategory.credit_category}</TableCell>
                <TableCell>{data.credit.creditType}</TableCell>
                <TableCell>{data.option.option}</TableCell>
                <TableCell>{data.points}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box display="flex" justifyContent="space-between">
        {projectDetail.length > 0 && <Button onClick={downloadFile} color="primary" variant="contained" style={{ backgroundColor: '#1A1A1A', color: '#FFFFFF' }}>
          Download CSV
        </Button>}
        <Button onClick={handleCancel} color="primary" variant="contained" style={{ backgroundColor: '#1A1A1A', color: '#FFFFFF' }}>
          Back
        </Button>
      </Box>
    </Box>
  );
};
export default ProjectDetails;


