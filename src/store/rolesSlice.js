import { createSlice, nanoid } from "@reduxjs/toolkit";


const initialState = {
  roles: [
    // starter roles (optional)
    { id: 1, name: "Admin", permissions: ["add_story","view_story","view_scheduled_story","epaper","create_poll","video_list","contact_list"] },
    { id: 2, name: "Editor", permissions: ["add_story","view_story","view_scheduled_story"] },
  ],
  // master permission ids - we'll import MODULES where needed instead of duplicating
  allPermissions: [], 
};

const rolesSlice = createSlice({
  name: "roles",
  initialState,
  reducers: {
    createRole(state, action) {
      // payload: { name, permissions: [] }
      const id = nanoid();
      state.roles.push({ id, name: action.payload.name, permissions: action.payload.permissions });
    },
    updateRole(state, action) {
      const idx = state.roles.findIndex(r => r.id === action.payload.id);
      if (idx >= 0) state.roles[idx] = { ...state.roles[idx], name: action.payload.name, permissions: action.payload.permissions };
    },
    deleteRole(state, action) {
      state.roles = state.roles.filter(r => r.id !== action.payload);
    },
    setRoles(state, action) {
      state.roles = action.payload;
    }
  }
});

export const { createRole, updateRole, deleteRole, setRoles } = rolesSlice.actions;
export default rolesSlice.reducer;
