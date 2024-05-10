import React, { useEffect, useState } from 'react';
import { Button, Typography, Box, Backdrop, CircularProgress } from '@mui/material';
import { projectDetails } from 'provider/redux/actions/project';
import { useDispatch } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
function DownloadForm({ project_id, setFile }: any) {

  const [projectDetail, setProjectDetail] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const handleCancel = () => {
    setFile(false);
   };

   useEffect(() => {
    if (project_id) {

      setIsLoading(true);
      dispatch<any>(projectDetails(project_id))
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
  }, [project_id])

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
    <Box sx={{ maxWidth: 'md', mx: 'auto', p: 3, border: '1px solid #ddd', borderRadius: '4px', bgcolor: 'background.paper' }}>
      <Typography variant="h6" gutterBottom>
        Download Project LUXA File
      </Typography>
      <Box sx={{ marginTop: 2, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
      <Button
          onClick={handleCancel}
          style={{ backgroundColor: '#1A1A1A', color: '#FFFFFF' }}
        >
       Back
        </Button>
        <Button
          variant="contained"
          onClick={downloadFile}
          sx={{ bgcolor: '#1A1A1A', color: '#FFFFFF', '&:hover': { bgcolor: '#333' } }}
        >
          Download File
        </Button>
      </Box>
      {isLoading && (
        <Backdrop open={isLoading}>
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
    </Box>
  );
}

export default DownloadForm;
