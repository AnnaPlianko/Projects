import type {Action,PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { UserModel } from "../Models/UserModel";

// Stores authenticated user object in Redux.
function initUser(_currentState: UserModel | null, action: PayloadAction<UserModel>): UserModel {
    return action.payload;
}

// Clears user state on logout.
function logoutUser(_currentState: UserModel | null, _action: Action): null {
    return null;
}

export const userSlice = createSlice({
    name: "user-slice",
    initialState: null as UserModel | null,
    reducers: { initUser, logoutUser }
});

export const { initUser: initUserAction, logoutUser: logoutUserAction } = userSlice.actions;
export default userSlice.reducer;