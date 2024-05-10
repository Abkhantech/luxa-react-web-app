import { createAsyncThunk } from "@reduxjs/toolkit";
import { ActionTypes } from "../constants/action-types";
import { apiCall } from "../../../apis/api";

export const loginSuperAdmin = createAsyncThunk(
  ActionTypes.SUPER_ADMIN_LOGIN,
  async (payload: any, { rejectWithValue }) => {
    try {
      const res = await apiCall("/super_admin/login", "post", payload);
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
export const getSuperAdminById = createAsyncThunk(
  ActionTypes.GET_SUPER_ADMIN_BY_ID,
  async (id: any, { rejectWithValue }) => {
    try {
      const res = await apiCall(`/super_admin/${id}`, "get");
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

export const addCompanyAdmin = createAsyncThunk(
  ActionTypes.ADD_COMPANY_ADMIN,
  async (payload: any, { rejectWithValue }) => {
    try {
      const res = await apiCall("/super_admin/addAdmin", "post", payload);
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

export { };
