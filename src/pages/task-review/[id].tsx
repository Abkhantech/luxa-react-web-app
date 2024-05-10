import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box, Backdrop, CircularProgress, Button } from '@mui/material';
import { unwrapResult } from '@reduxjs/toolkit';
import { useRouter } from 'next/router';
import { getTaskById } from 'provider/redux/actions/task';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
const ReviewDetails = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { id } = router.query;
  const [task, setTask] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      dispatch<any>(getTaskById(id))
        .then(unwrapResult)
        .then((res: any) => {
          setIsLoading(false);
          if (res) {
            setTask(res);
          } else {
            setTask(null);
          }
        })
        .catch((err: any) => {
          console.error(err);
          setIsLoading(false);
          setTask(null);
        });
    }
  }, [id]);

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Task Details
      </Typography>

      <Box sx={{ marginBottom: 4 }}>
        <Typography variant="h5">
          {task?.title}
        </Typography>
        <Typography>
          <strong>Task Description:</strong> {task?.description}
        </Typography>
        <Typography>
          <strong>Task Due Date:</strong> {new Date(task?.dueDate).toLocaleDateString()}
        </Typography>
        <Typography>
          <strong>Task Status:</strong> {task?.status}
        </Typography>
        <Typography>
          <strong>Task Created by:</strong> {task?.created_by_user?.full_name}
        </Typography>
        <Typography>
          <strong>Task Assigned to:</strong> {task?.assigned_user?.full_name}
        </Typography>
        <Box display={'flex'} flexDirection={'column'} gap={4} alignItems={'center'}>
          <Typography variant="h4" gutterBottom>
            Review Details
          </Typography>
          <TableContainer component={Paper}>
            <Table aria-label="task files table">
              <TableHead>
                <TableRow>
                  <TableCell><strong>Review Description</strong></TableCell>
                  <TableCell><strong>Show File</strong></TableCell>
                  <TableCell><strong>Due Date</strong></TableCell>
                  <TableCell><strong>Created At</strong></TableCell>
                  <TableCell><strong>Time</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {task?.reviews?.map((review: any) => (
                  <TableRow key={review.id}>
                    <TableCell>{review.description}</TableCell>
                    <TableCell>
                      <a href={review.file} target="_blank" rel="noopener noreferrer">View File</a>
                    </TableCell>
                    <TableCell>{new Date(review.dueDate).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(review.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(review.created_at).toLocaleTimeString()}</TableCell>

                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
      <Box mt={2} display="flex" justifyContent="end">
        <Button
          onClick={() => router.back()}
          style={{ backgroundColor: '#1A1A1A', color: '#FFFFFF' }}
        >
          Back
        </Button>
      </Box>
      {isLoading && (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={isLoading}
          onClick={() => setIsLoading(false)}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
    </Box>
  );
};
export default ReviewDetails;


