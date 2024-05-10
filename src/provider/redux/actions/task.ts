import { createAsyncThunk } from "@reduxjs/toolkit";
import { ActionTypes } from "../constants/action-types";
import { apiCall } from "../../../apis/api";

export const createTask = createAsyncThunk(
  ActionTypes.CREATE_TASK,
  async (payload: any, { rejectWithValue }) => {
    try {
      const res = await apiCall("/task/", "post", payload);
      return res;
    } catch (error: any) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const assignTask = createAsyncThunk(
  ActionTypes.ASSIGN_TASK,
  async (payload: any, { rejectWithValue }) => {
    try {
      const res = await apiCall("/task/assignTask", "post", payload);
      return res;
    } catch (error: any) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const getAllTasks = createAsyncThunk(
  ActionTypes.GET_ALL_TASKS,
  async (id: any, { rejectWithValue }) => {
    try {
      const res = await apiCall(`/task/allProjectTask/${id}`, "get");
      return res;
    } catch (error: any) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const createTaskFile = createAsyncThunk(
  ActionTypes.CREATE_TASK_FILE,
  async (payload: any, { rejectWithValue }) => {
    try {
      const res = await apiCall("/taskfile", "post", payload);
      return res;
    } catch (error: any) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const updateTaskStatus = createAsyncThunk(
  ActionTypes.UPDATE_TASK_STATUS,
  async (id: any, { rejectWithValue }) => {
    try {
      const res = await apiCall(`/task/${id}`, "patch", {
        status: "Completed",
      });
      return res;
    } catch (error: any) {
      console.log(error);
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const updateTaskStatusDynamiclly = createAsyncThunk(
  ActionTypes.UPDATE_TASK_STATUS_DYNAMICLLY,
  async (payload: any, { rejectWithValue }) => {
    try {
      const res = await apiCall(
        `/task/${payload.id}/updateStatus`,
        "patch",
        payload.status
      );
      return res;
    } catch (error: any) {
      console.log(error);
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const getTaskById = createAsyncThunk(
  ActionTypes.GET_TASK_BY_ID,
  async (id: any, { rejectWithValue }) => {
    try {
      const res = await apiCall(`/task/${id}`, "get");
      return res;
    } catch (error: any) {
      console.log(error);
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const createTaskReview = createAsyncThunk(
  ActionTypes.Create_TASK_Review,
  async (payload: any, { rejectWithValue }) => {
    try {
      const res = await apiCall("/review", "post", payload);
      return res;
    } catch (error: any) {
      console.log(error);
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);
