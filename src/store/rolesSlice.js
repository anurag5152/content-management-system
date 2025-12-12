import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = process.env.REACT_APP_API_URL || "http://localhost:4000";

export const fetchRoles = createAsyncThunk("roles/fetchRoles", async (_, thunkAPI) => {
  try {
    const res = await axios.get(`${API}/api/roles`);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err?.response?.data || err.message);
  }
});

export const createRole = createAsyncThunk(
  "roles/createRole",
  async ({ name, modules }, thunkAPI) => {
    try {
      const res = await axios.post(`${API}/api/roles`, { name, modules });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err?.response?.data || err.message);
    }
  }
);

export const updateRole = createAsyncThunk(
  "roles/updateRole",
  async ({ id, name, modules }, thunkAPI) => {
    try {
      const res = await axios.put(`${API}/api/roles/${id}`, { name, modules });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err?.response?.data || err.message);
    }
  }
);

const rolesSlice = createSlice({
  name: "roles",
  initialState: {
    list: [],
    status: "idle",
    error: null,
  },
  reducers: {
    clearRolesError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchRoles.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(fetchRoles.fulfilled, (state, action) => {
      state.status = "idle";
      state.list = action.payload || [];
    });
    builder.addCase(fetchRoles.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload || action.error.message;
    });

    builder.addCase(createRole.pending, (state) => {
      state.status = "saving";
      state.error = null;
    });
    builder.addCase(createRole.fulfilled, (state, action) => {
      state.status = "idle";
      state.list.push(action.payload);
    });
    builder.addCase(createRole.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload || action.error.message;
    });

    builder.addCase(updateRole.pending, (state) => {
      state.status = "saving";
      state.error = null;
    });
    builder.addCase(updateRole.fulfilled, (state, action) => {
      state.status = "idle";
      const updated = action.payload;
      const idx = state.list.findIndex((r) => r.id === updated.id);
      if (idx !== -1) {
        state.list[idx] = updated;
      } else {
        state.list.push(updated);
      }
    });
    builder.addCase(updateRole.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload || action.error.message;
    });
  },
});

export const { clearRolesError } = rolesSlice.actions;

export const selectRolesList = (state) => state.roles.list;
export const selectRolesStatus = (state) => state.roles.status;
export const selectRolesError = (state) => state.roles.error;

export default rolesSlice.reducer;
