import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box, Backdrop, CircularProgress, Button, Alert } from '@mui/material';
import { unwrapResult } from '@reduxjs/toolkit';
import { useRouter } from 'next/router';
import { getTaskById, updateTaskStatusDynamiclly } from 'provider/redux/actions/task';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import CreateReviewForm from './components/create-review';
const TaskDetails = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { id, user_id } = router.query;
  const [task, setTask] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);
  const [taskRefresher, setTaskRefresher] = useState<any>(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [review, setReview] = useState(false);

  useEffect(() => {
    if (id && user_id) {
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
  }, [id, user_id, taskRefresher]);



  const handleMarkAsClosed = () => {
    setIsLoading(true);
    const payload = {
      id: id,
      status: {
        status: 'Closed'
      }
    }
    dispatch<any>(updateTaskStatusDynamiclly(payload))
      .then(unwrapResult)
      .then((res: any) => {
        setIsLoading(false);
        if (res) {
          setTaskRefresher((prev: any) => !prev);
        }
      })
      .catch((err: any) => {
        console.error(err);
        setIsLoading(false);
      });
  };

  const handleReviewItAgain = () => {
    setReview(true);
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      setError('');
      setSuccess('');
    }, 2000);
    return () => clearTimeout(timer);
  }, [error, success]);
  return (
    <Box sx={{ padding: 4 }}>
      {error && (
        <Alert severity="error" sx={{ width: '98%', mb: 2, alignItems: 'center' }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ width: '98%', mb: 2, alignItems: 'center' }}>
          {success}
        </Alert>
      )}
      <Typography variant="h4" gutterBottom>
        Task Details
      </Typography>
      {!isLoading && task && task.taskFiles.length !== 0 ? (
        <Box sx={{ marginBottom: 4 }}>
          <Typography variant="h5">
            {task.title}
          </Typography>
          <Typography>
            <strong>Task Description:</strong> {task.description}
          </Typography>
          <Typography>
            <strong>Task Due Date:</strong> {new Date(task.dueDate).toLocaleDateString()}
          </Typography>
          <Typography>
            <strong>Task Status:</strong> {task.status}
          </Typography>
          <Typography>
            <strong>Task Created by:</strong> {task.created_by_user?.full_name}
          </Typography>
          <Typography>
            <strong>Task Assigned to:</strong> {task.assigned_user?.full_name}
          </Typography>

          {!review && task?.created_by_user?.canonical_id === user_id && task.status === 'Completed' && <Box mt={2} display="flex" justifyContent="right" gap={2} padding={2}>
            <Button
              onClick={handleMarkAsClosed}
              style={{ backgroundColor: '#1A1A1A', color: '#FFFFFF' }}
            >
              Mark As Closed
            </Button>
            <Button
              onClick={handleReviewItAgain}
              style={{ backgroundColor: '#1A1A1A', color: '#FFFFFF' }}
            >
              Submit Review
            </Button>
          </Box>}

          {!review && <TableContainer component={Paper}>
            <Table aria-label="task files table">
              <TableHead>
                <TableRow>
                  <TableCell><strong>File Description</strong></TableCell>
                  <TableCell><strong>Show File</strong></TableCell>
                  <TableCell><strong>Created At</strong></TableCell>
                  <TableCell><strong>Time</strong></TableCell>

                </TableRow>
              </TableHead>
              <TableBody>
                {task.taskFiles?.map((file: any) => (
                  <TableRow key={file.id}>
                    <TableCell>{file.description}</TableCell>
                    <TableCell>
                      <a href={file.file} target="_blank" rel="noopener noreferrer">View File</a>
                    </TableCell>
                    <TableCell>{new Date(file.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(file.created_at).toLocaleTimeString()}</TableCell>

                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          }
        </Box>
      ) : (
        !isLoading && (
          <Typography variant="h6" sx={{ marginTop: 2 }}>
            No task file details found.
          </Typography>
        )
      )}
      {!review && <Box mt={2} display="flex" justifyContent="end">
        <Button
          onClick={() => router.back()}
          style={{ backgroundColor: '#1A1A1A', color: '#FFFFFF' }}
        >
          Back
        </Button>
      </Box>
      }

      {isLoading && (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={isLoading}
          onClick={() => setIsLoading(false)}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
      {review && <CreateReviewForm setReview={setReview} task_id={id} setSuccess={setSuccess} setError={setError} setTaskRefresher={setTaskRefresher}/>}


    </Box>
  );
};
export default TaskDetails;


