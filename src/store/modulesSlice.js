import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = process.env.REACT_APP_API_URL || "http://localhost:4000";

export const fetchModulesByRole = createAsyncThunk(
  "modules/fetchByRole",
  async (role, thunkAPI) => {
    try {
      const res = await axios.get(`${API}/api/roles/by-name/${encodeURIComponent(role)}`);
      const modules = res.data?.modules || [];

      try {
        const storage = localStorage.getItem("cms_user") ? localStorage : sessionStorage;
        storage.setItem("cms_modules", JSON.stringify(modules));
      } catch (e) {
        console.error("Failed to persist cms_modules", e);
      }

      return modules;
    } catch (err) {
      return thunkAPI.rejectWithValue(err?.response?.data || err.message);
    }
  }
);

const modulesSlice = createSlice({
  name: "modules",
  initialState: {
    list: [],
    status: "idle",
    error: null,
  },
  reducers: {
    setModules(state, action) {
      state.list = action.payload || [];
    },
    clearModules(state) {
      state.list = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchModulesByRole.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(fetchModulesByRole.fulfilled, (state, action) => {
      state.status = "idle";
      state.list = action.payload || [];
    });
    builder.addCase(fetchModulesByRole.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload || action.error.message;
    });
  },
});

export const { setModules, clearModules } = modulesSlice.actions;
export const selectModules = (state) => state.modules.list;
export default modulesSlice.reducer;
