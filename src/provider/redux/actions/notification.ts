import { createAsyncThunk } from "@reduxjs/toolkit";
import { ActionTypes } from "../constants/action-types";
import { apiCall } from "../../../apis/api";

export const getAllNotificationAgainestUser = createAsyncThunk(
  ActionTypes.GET_ALL_NOTIFICATION_AGAINEST_USER,
  async (id: any, { rejectWithValue }) => {
    try {
      const res = await apiCall(`/notification/${id}`, "get");
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

export const updateNotificationIsViewedStatus = createAsyncThunk(
  ActionTypes.UPDATE_NOTIFICATION_IS_VIEWED_STATUS,
  async (id: any, { rejectWithValue }) => {
    try {
      const res = await apiCall(`/notification/mark-all-viewed/${id}`, "patch");
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
