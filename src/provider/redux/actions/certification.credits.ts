import { createAsyncThunk } from "@reduxjs/toolkit";
import { ActionTypes } from "../constants/action-types";
import { apiCall } from "../../../apis/api";

export const getAllRatingSystems = createAsyncThunk(
  ActionTypes.GET_ALL_RATING_SYSTEMS,
  async (_: void, { rejectWithValue }) => {
    try {
      const res = await apiCall("/rating-system", "get");
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

export const getAllCreditcategories = createAsyncThunk(
  ActionTypes.GET_ALL_CREDIT_CATEGORIES,
  async (_: void, { rejectWithValue }) => {
    try {
      const res = await apiCall("/credit-category", "get");
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

export const getCreditById = createAsyncThunk(
  ActionTypes.GET_CREDIT_BY_ID,
  async (id: any, { rejectWithValue }) => {
    try {
      const res = await apiCall(`/credit/${id}`, "get");
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

export const addCreditInProject = createAsyncThunk(
  ActionTypes.ADD_CREDIT_IN_PROJECT,
  async (payload: any, { rejectWithValue }) => {
    try {
      const res = await apiCall("/credit/addProjectCredit", "post", payload);
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

export const getAllRatingSystemAgainestId = createAsyncThunk(
  ActionTypes.GET_RATING_SYSTEM_AGAINEST_ID,
  async (id: any, { rejectWithValue }) => {
    try {
      const res = await apiCall(`/rating-system/${id}`, "get");
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

export const saveCreditPoint = createAsyncThunk(
  ActionTypes.SAVE_CREDIT_POINT,
  async (payload: any, { rejectWithValue }) => {
    try {
      const res = await apiCall("/project-detail", "post", payload);
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

export const getOptions = createAsyncThunk(
  ActionTypes.GET_OPTIONS,
  async (payload: any, { rejectWithValue }) => {
    try {
      const res = await apiCall("/project-detail/findOptions", "post", payload);
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

export const getAllCertifications = createAsyncThunk(
  ActionTypes.GET_ALL_CERTIFICATIONS,
  async (_: void, { rejectWithValue }) => {
    try {
      const res = await apiCall("/certification", "get");
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

