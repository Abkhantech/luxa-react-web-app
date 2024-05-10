import { createAsyncThunk } from "@reduxjs/toolkit";
import { ActionTypes } from "../constants/action-types";
import { apiCall } from "../../../apis/api";

export const getUserAgainstId = createAsyncThunk(
  ActionTypes.GET_USER_BY_ID,
  async (id: any, { rejectWithValue }) => {
    try {
      const res = await apiCall(`/user/${id}`, "get");
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

export const UpdateUserAgainstId = createAsyncThunk(
  ActionTypes.UPDATE_USER_AGAINST_ID,
  async (payload: any, { rejectWithValue }) => {
    try {
      const res = await apiCall(`/user/${payload.id}`, "patch", payload.user);
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

export const registerUser = createAsyncThunk(
  ActionTypes.REGISTER_USER,
  async (payload: any, { rejectWithValue }) => {
    try {
      const res = await apiCall("/user/register", "post", payload);
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

export const addNewUser = createAsyncThunk(
  ActionTypes.ADD_NEW_USER,
  async (payload: any, { rejectWithValue }) => {
    try {
      const res = await apiCall("/user/newUser", "post", payload);
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

export const userLogin = createAsyncThunk(
  ActionTypes.USER_LOGIN,
  async (payload: any, { rejectWithValue }) => {
    try {
      const res = await apiCall("/user/login", "post", payload);
      localStorage.setItem("jwtToken", res.jwt);
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

export const getAllUser = createAsyncThunk(
  ActionTypes.GET_ALL_USERS,
  async (id: string) => {
    try {
      const res = await apiCall(`/user/${id}/allUsers`, "get");
      return res;
    } catch (error: any) {
      console.log(error);
    }
  }
);

export const getAll = createAsyncThunk(ActionTypes.GET_ALL, async () => {
  try {
    const res = await apiCall("/user/allUsers", "get");
    return res;
  } catch (error: any) {
    console.log(error);
  }
});
