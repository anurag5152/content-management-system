import { configureStore } from "@reduxjs/toolkit";
import rolesReducer from "./rolesSlice";
import usersReducer from "../store/usersSlice";
import modulesReducer from "./modulesSlice";
const store = configureStore({
    reducer: {
        roles: rolesReducer,
        users: usersReducer,
        modules: modulesReducer,
    },
});

export default store;
