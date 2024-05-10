
import { createSlice } from '@reduxjs/toolkit'
// import { getUserByIdForFreeView } from '../actions/user';

const initialState = {
  loading: false,
  user: null,
  jwtToken: null, // for storing the JWT
  error: null,
  success: false,
  address: null,
  is_follower: false
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
    // // Register user
    // [registerUser.pending.toString()]: (state: any) => {
    //   state.loading = true
    //   state.error = null
    // },
    // [registerUser.fulfilled.toString()]: (state: any, { payload }: any) => {
    //   state.loading = false
    //   state.success = true
    //   state.user = payload.user
    // },
    // [registerUser.rejected.toString()]: (state: any, { payload }: any) => {
    //   state.loading = false
    //   state.error = payload
    // },

    // [addAddress.pending.toString()]: (state: any) => {
    //   state.loading = true
    //   state.error = null
    // },
    // [addAddress.fulfilled.toString()]: (state: any, { payload }: any) => {
    //   state.loading = false
    //   state.success = true
    //   state.address = payload
    // },
    // [addAddress.rejected.toString()]: (state: any, { payload }: any) => {
    //   state.loading = false
    //   state.error = payload
    // },

    // // Login user
    // [loginUser.pending.toString()]: (state) => {
    //   state.loading = true
    //   state.error = null
    // },
    // [loginUser.fulfilled.toString()]: (state, { payload }) => {
    //   state.loading = false
    //   state.user = payload.user
    // },
    // [loginUser.rejected.toString()]: (state, { payload }) => {
    //   state.loading = false
    //   state.error = payload
    // },

    // // Logout User
    // [logoutUser.pending.toString()]: (state) => {
    //   state.loading = true
    //   state.error = null
    // },
    // [logoutUser.fulfilled.toString()]: (state, { payload }) => {
    //   state.success = false
    //   state.loading = false
    //   state.user = null
    //   state.jwtToken = null
    // },
    // [logoutUser.rejected.toString()]: (state, { payload }) => {
    //   state.loading = false
    //   state.error = payload
    // },

    // Get User by ID
    // [getUserByIdForFreeView.pending.toString()]: (state) => {
    //   state.loading = true
    //   state.error = null
    // },
    // [getUserByIdForFreeView.fulfilled.toString()]: (state, { payload }) => {
    //   state.success = false
    //   state.loading = false
    //   state.user = payload.user
    // },
    // [getUserByIdForFreeView.rejected.toString()]: (state, { payload }) => {
    //   state.loading = false
    //   state.error = payload
    // },

    // // Get is logged in user a follower of profile user
    // [isFollower.pending.toString()]: (state) => {
    //   state.loading = true
    //   state.error = null
    // },
    // [isFollower.fulfilled.toString()]: (state, { payload }) => {
    //   state.success = false
    //   state.loading = false
    //   state.is_follower = payload.user
    // },
    // [isFollower.rejected.toString()]: (state, { payload }) => {
    //   state.loading = false
    //   state.error = payload
    // },

})

export default userSlice.reducer;
