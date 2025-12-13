import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = process.env.REACT_APP_API_URL || "http://localhost:4000";

/* ===========================
   ASYNC THUNKS
=========================== */

/* Fetch users (Admin list – A) */
export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(`${API}/api/users`);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err?.response?.data || err.message
      );
    }
  }
);

/* Create user (B – New User) */
export const createUser = createAsyncThunk(
  "users/createUser",
  async (payload, thunkAPI) => {
    try {
      const res = await axios.post(`${API}/api/users`, payload);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err?.response?.data || err.message
      );
    }
  }
);

/* Update user (Edit from A or B) */
export const updateUser = createAsyncThunk(
  "users/updateUser",
  async ({ id, data }, thunkAPI) => {
    try {
      const res = await axios.put(`${API}/api/users/${id}`, data);
      return { id, ...data };
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err?.response?.data || err.message
      );
    }
  }
);

/* ===========================
   SLICE
=========================== */

const usersSlice = createSlice({
  name: "users",
  initialState: {
    list: [],
    status: "idle", // idle | loading | saving | failed
    error: null,
  },
  reducers: {
    clearUsersError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    /* FETCH */
    builder.addCase(fetchUsers.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      state.status = "idle";
      state.list = action.payload || [];
    });
    builder.addCase(fetchUsers.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    });

    /* CREATE */
    builder.addCase(createUser.pending, (state) => {
      state.status = "saving";
      state.error = null;
    });
    builder.addCase(createUser.fulfilled, (state, action) => {
      state.status = "idle";
      // push minimal info, list will be re-fetched later if needed
      state.list.unshift(action.payload);
    });
    builder.addCase(createUser.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    });

    /* UPDATE */
    builder.addCase(updateUser.pending, (state) => {
      state.status = "saving";
      state.error = null;
    });
    builder.addCase(updateUser.fulfilled, (state, action) => {
      state.status = "idle";
      const idx = state.list.findIndex(
        (u) => u.id === action.payload.id
      );
      if (idx !== -1) {
        state.list[idx] = {
          ...state.list[idx],
          ...action.payload,
        };
      }
    });
    builder.addCase(updateUser.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    });
  },
});

export const { clearUsersError } = usersSlice.actions;

/* ===========================
   SELECTORS
=========================== */
export const selectUsersList = (state) => state.users.list;
export const selectUsersStatus = (state) => state.users.status;
export const selectUsersError = (state) => state.users.error;

export default usersSlice.reducer;
