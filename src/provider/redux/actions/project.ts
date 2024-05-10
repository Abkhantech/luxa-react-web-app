import { createAsyncThunk } from "@reduxjs/toolkit";
import { ActionTypes } from "../constants/action-types";
import { apiCall } from "../../../apis/api";

export const createProject = createAsyncThunk(
  ActionTypes.CREATE_PROJECT,
  async (payload: any, { rejectWithValue }) => {
    try {
      const res = await apiCall("/project", "post", payload);
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

export const getAllProject = createAsyncThunk(
  ActionTypes.GET_ALL_PROJECTS,
  async (_: void, { rejectWithValue }) => {
    try {
      const res = await apiCall("/project", "get");
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

export const getProjectById = createAsyncThunk(
  ActionTypes.GET_PROJECT_BY_ID,
  async (id: any, { rejectWithValue }) => {
    try {
      const res = await apiCall(`/project/${id}`, "get");
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

export const updateProject = createAsyncThunk(
  ActionTypes.UPDATE_PROJECT,
  async (payload: any, { rejectWithValue }) => {
    try {
      const res = await apiCall(
        `/project/${payload.project_id}`,
        "patch",
        payload.body
      );
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

export const assignProject = createAsyncThunk(
  ActionTypes.ASSIGN_PROJECT,
  async (payload: any, { rejectWithValue }) => {
    try {
      const res = await apiCall("/project/assignProject", "post", payload);
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

export const projectDetails = createAsyncThunk(
  ActionTypes.PROJECT_DETAILS,
  async (id: any, { rejectWithValue }) => {
    try {
      const res = await apiCall(`/project-detail/projectDetails/${id}`, "get");
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

export const getOptionFromProjectDetails = createAsyncThunk(
  ActionTypes.PROJECT_DETAILS,
  async (payload: any, { rejectWithValue }) => {
    try {
      const res = await apiCall('/project-detail/projectDetailsWithOption', "post",payload);
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
export const getProjectAgainestUser = createAsyncThunk(
  ActionTypes.GET_PROJECT_AGAINEST_USER,
  async (id: any, { rejectWithValue }) => {
    try {
      const res = await apiCall(
        `/project/getProjectAgainestCompany/${id}`,
        "get"
      );
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

export const getProjectAgainestId = createAsyncThunk(
  ActionTypes.GET_PROJECT_AGAINEST_ID,
  async (id: any, { rejectWithValue }) => {
    try {
      const res = await apiCall(`/project/${id}`, "get");
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

export const attachRatingSystemToProject = createAsyncThunk(
  ActionTypes.ATTACH_RATING_SYSTEM_TO_PROJECT,
  async (payload: any, { rejectWithValue }) => {
    try {
      const res = await apiCall("/project/attachRatingSystem", "post",payload);
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

