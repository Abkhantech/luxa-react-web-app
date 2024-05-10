import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Backdrop, CircularProgress, Alert, Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText } from '@mui/material';
import { useRouter } from 'next/router';
import { useDispatch } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import CreateTaskForm from './components/create_task';
import { getAllTasks, updateTaskStatus } from 'provider/redux/actions/task';
import AssignTask from './components/assign_task';
import CompleteTaskForm from './components/complete_task';
import { io } from 'socket.io-client';
const TaskDetailsPage = () => {
  const thisUrl = process.env.NEXT_PUBLIC_API_URL || '';
  const router = useRouter();
  const dispatch = useDispatch();
  const { id, user_id } = router.query;
  const [task, setTask] = useState(false);
  const [assignTask, setAssignTask] = useState(false);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');
  const [allTasks, setAllTasks] = React.useState<any>([]);
  const [taskRefresher, setTaskRefresher] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<number>();
  const [isLoading, setIsLoading] = useState(false);
  const [compelete, setCompelete] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState(null);
  const [refresh, setRefresh] = useState<boolean>(false);

  const handleMarkAsCompleted = (taskId: any) => {
    setCurrentTaskId(taskId);
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const handleConfirm = () => {
    setIsLoading(true);

    dispatch<any>(updateTaskStatus(currentTaskId))
      .then(unwrapResult)
      .then((res: any) => {
        if (res) {
          setIsLoading(false);
          setOpenDialog(false);
          setTaskRefresher((prev) => !prev);
        }
      })
      .catch((err: any) => {
        console.log(err);
        setIsLoading(false);
      })

  };
  const handleAssignTask = () => {
    setAssignTask(true);
  };

  const handleCancel = () => {
    router.back();
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setError('');
      setSuccess('');
    }, 2000);
    return () => clearTimeout(timer);
  }, [error, success]);


  useEffect(() => {
    if (id) {
      setIsLoading(true);
      dispatch<any>(getAllTasks(id))
        .then(unwrapResult)
        .then((res: any) => {
          if (res) {
            setIsLoading(false);
            setAllTasks(res);
          }
        })
        .catch((err: any) => {
          console.log(err);
          setIsLoading(false);
        })
    }

  }, [id, taskRefresher, refresh]);

  const handleSeeFiles = (id: any) => {
    router.push(`/task-info/${id}?user_id=${user_id}`);
  }
  useEffect(() => {
  }, [user_id])

  const checkIfAnyReviewPending = (reviews: any) => {
    const hasPendingStatus = reviews?.some((item: { reviewStatus: string; }) => item?.reviewStatus === 'Pendding');
    if (!!hasPendingStatus) {
      return true;
    } else {
      return false;
    }
  }
  const goToReviewPage = (id: any) => {
    router.push(`/task-review/${id}`);
  }

  useEffect(() => {
    const socket = io(thisUrl);

    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    socket.on('connect_error', error => {
      console.error('WebSocket connection error:', error);
    });

    socket.on('sendTaskAssignment', task => {
      if (task.assigned_user.canonical_id===user_id) {
        setRefresh((prev: any) => !prev)
      }
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Box p={2}>
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
      <Box display="flex" alignItems="center" justifyContent="space-between" p={2}>
        <Typography variant="h4" gutterBottom>
          Task Details
        </Typography>
        {
          !assignTask && !compelete &&
          <Button variant="contained" color="primary" style={{ backgroundColor: '#1A1A1A', color: '#FFFFFF' }} onClick={() => setTask(true)}>
            Create New Task
          </Button>
        }
      </Box>
      {
        !task && !assignTask && !compelete &&
        <>
          <TableContainer component={Paper} sx={{ mb: 2 }}>
            {allTasks.length !== 0 ?
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Task Count</strong></TableCell>
                    <TableCell><strong>Title</strong></TableCell>
                    <TableCell><strong>Assigned to</strong></TableCell>
                    <TableCell><strong>Document</strong></TableCell>
                    <TableCell><strong>Created By</strong></TableCell>
                    <TableCell><strong>Description</strong></TableCell>
                    <TableCell><strong>Due Date</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                    <TableCell><strong>Task Credit</strong></TableCell>
                    <TableCell><strong>Task Option</strong></TableCell>
                    <TableCell><strong>Actions</strong></TableCell>
                    <TableCell><strong>Show Files</strong></TableCell>
                    <TableCell><strong>Review</strong></TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {allTasks.map((task: any, index: any) => (
                    <TableRow key={task.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell style={{ whiteSpace: 'pre-wrap' }} >{task.title}</TableCell>
                      <TableCell>
                        <div>
                          {!!task.assigned_user?.full_name ? task.assigned_user.full_name : task.assigned_user?.email}
                        </div>
                        <div>
                          {!!task.assigned_user ?
                            (task.assigned_user.roles?.map((role: any) => role.role_name).join(', '))
                            : ''}
                        </div>
                      </TableCell>
                      <TableCell>
                        {task.file ?
                          <a href={task.file} target="_blank" rel="noopener noreferrer" style={{ color: '#000000', fontWeight: 'bold' }}>View Document</a>
                          : 'No Document'}
                      </TableCell>
                      <TableCell>
                        <TableCell>
                          <div>
                            {task.created_by_user.full_name}
                          </div>
                          <div>
                            ({task.created_by_user.roles.map((role: any) => role.role_name).join(', ')})
                          </div>
                        </TableCell>
                      </TableCell>

                      <TableCell style={{ whiteSpace: 'pre-wrap' }}>{task.description}</TableCell>
                      <TableCell>{new Date(task.dueDate).toLocaleDateString('en-US')}</TableCell>
                      <TableCell>
                        {task?.assigned_user?.canonical_id === user_id && task.status !== 'Completed' && task.status !== 'Closed' ?
                          <Button
                            disabled={task?.status === 'Completed' || task.taskFiles?.length === 0 || checkIfAnyReviewPending(task.reviews)}
                            variant="contained"
                            color="primary"
                            onClick={() => handleMarkAsCompleted(task.id)}
                            style={{
                              backgroundColor: '#1A1A1A',
                              color: '#FFFFFF',
                              opacity: task?.status === 'Completed' || task.taskFiles?.length === 0 || checkIfAnyReviewPending(task.reviews) ? 0.5 : 1
                            }}
                          >
                            Mark as Completed
                          </Button>
                          : (
                            <Typography>{task.status === 'Completed' ? 'Completed' : task.status === 'Closed' ? 'Closed' : 'Submission Pending'}</Typography>
                          )
                        }


                      </TableCell>

                      <TableCell>{task.task_credit}</TableCell>
                      <TableCell>{task.task_option}</TableCell>
                      <TableCell>
                        {task?.created_by_user?.canonical_id === user_id ? (
                          <Button
                            disabled={!!task.assigned_user}
                            variant="contained"
                            color="primary"
                            onClick={() => { setSelectedTaskId(task.id); handleAssignTask(); }}
                            style={{
                              backgroundColor: '#1A1A1A',
                              color: '#FFFFFF',
                              opacity: task.assigned_user ? 0.5 : 1
                            }}
                          >
                            Assign Task
                          </Button>
                        ) : task?.assigned_user?.canonical_id === user_id ? (
                          <Button
                            disabled={task.status === 'Completed'}
                            variant="contained"
                            color="primary"
                            onClick={() => { setSelectedTaskId(task.id); setCompelete(true); }}
                            style={{
                              backgroundColor: '#1A1A1A',
                              color: '#FFFFFF',
                              opacity: task.status === 'Completed' || task.status === 'Closed' ? 0.5 : 1
                            }}
                          >
                            Submit File
                          </Button>
                        ) : (
                          <Typography
                            variant="body1"
                            style={{
                              padding: '6px 12px',
                              textAlign: 'center'
                            }}
                          >
                            No Action
                          </Typography>
                        )}

                      </TableCell>
                      <TableCell>
                        {task.assigned_user ? (
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleSeeFiles(task.canonical_id)}
                            style={{ backgroundColor: '#1A1A1A', color: '#FFFFFF' }}
                          >
                            View Files
                          </Button>
                        ) : <Typography variant="body1">
                          No Submission
                        </Typography>}
                      </TableCell>
                      <TableCell>

                        {task.reviews.length !== 0 ? <Button
                          variant="contained"
                          color="primary"
                          onClick={() => goToReviewPage(task.canonical_id)}
                          style={{ backgroundColor: '#1A1A1A', color: '#FFFFFF' }}
                        >
                          Review
                        </Button> : <Typography variant="body1">
                          No Review
                        </Typography>}

                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              : <Typography variant="body1">
                No task details available for this task.
              </Typography>}

          </TableContainer>
          <Box display="flex" justifyContent="end">
            <Button onClick={handleCancel} color="primary" variant="contained" style={{ backgroundColor: '#1A1A1A', color: '#FFFFFF' }}>
              Back
            </Button>
          </Box>
        </>
      }
      {task && <CreateTaskForm project_id={id} setTask={setTask} user_id={user_id} setSuccess={setSuccess} setError={setError} setTaskRefresher={setTaskRefresher} />}
      {assignTask && <AssignTask project_id={id} setAssignTask={setAssignTask} user_id={user_id} selectedTaskId={selectedTaskId} setSuccess={setSuccess} setError={setError} setTaskRefresher={setTaskRefresher} />}
      {compelete && <CompleteTaskForm selectedTaskId={selectedTaskId} setCompelete={setCompelete} setSuccess={setSuccess} setError={setError} setTaskRefresher={setTaskRefresher} />}
      {isLoading && (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={isLoading}
          onClick={() => setIsLoading(true)}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
      <Dialog
        open={openDialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirm Action"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to mark this task as completed?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} style={{ color: '#8D8D8D', marginRight: '8px' }}>Cancel</Button>
          <Button onClick={handleConfirm} autoFocus style={{
            backgroundColor: '#1A1A1A',
            color: '#FFFFFF',
          }}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
}

export default TaskDetailsPage;
