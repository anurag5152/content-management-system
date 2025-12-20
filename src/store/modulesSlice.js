import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = process.env.REACT_APP_API_URL || "http://localhost:4000";

export const fetchModulesByRole = createAsyncThunk(
  "modules/fetchByRole",
  async (role, thunkAPI) => {
    try {
      const res = await axios.get(`${API}/api/roles/by-name/${encodeURIComponent(role)}`);
      const modules = res.data?.modules || [];
      console.log("fetchModulesByRole - fetched modules for role:", role, modules);

      try {
        const storage = localStorage.getItem("cms_user") ? localStorage : sessionStorage;
        storage.setItem("cms_modules", JSON.stringify(modules));
        console.log("fetchModulesByRole - persisted modules to storage for role:", role);
      } catch (e) {
        console.error("Failed to persist cms_modules", e);
      }

      return modules;
    } catch (err) {
      return thunkAPI.rejectWithValue(err?.response?.data || err.message);
    }
  }
);

// initialize from storage so Redux has modules immediately on app load
const _loadInitialModules = () => {
  try {
    const raw = localStorage.getItem("cms_modules") || sessionStorage.getItem("cms_modules");
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error("Failed to load initial modules from storage", e);
  }
  return [];
};

const modulesSlice = createSlice({
  name: "modules",
  initialState: {
    list: _loadInitialModules(),
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
