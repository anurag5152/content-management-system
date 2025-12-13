import { configureStore } from "@reduxjs/toolkit";
import rolesReducer from "./rolesSlice";
import usersReducer from "../store/usersSlice";
const store = configureStore({
    reducer: {
        roles: rolesReducer,
        users: usersReducer,
    },
});

export default store;
