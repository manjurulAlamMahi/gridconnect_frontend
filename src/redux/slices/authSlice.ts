import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type TUserRole = "driver" | "team";

export type TAuthenticatedUser = {
  id: string;
  role: TUserRole;
  firstName?: string;
  lastName?: string;
  email?: string;
  image?: string;
  dateOfBirth?: string;
  hasAccess?: boolean;
  // Team-specific fields
  teamName?: string;
};

type TInitialState = {
  token: null | string;
  user: TAuthenticatedUser | null;
  sessionTimeout: string;
};

const initialState: TInitialState = {
  token: null,
  user: null,
  sessionTimeout: localStorage.getItem("sessionTimeout") || "30",
};

type TCredentialsPayload = {
  token: string;
  user: TAuthenticatedUser;
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<TCredentialsPayload>) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
    updateUser: (state, action: PayloadAction<Partial<TAuthenticatedUser>>) => {
      if (!state.user) return;
      state.user = { ...state.user, ...action.payload };
    },
    removeUserInfo: (state) => {
      state.token = null;
      state.user = null;
    },
    setSessionTimeout: (state, action: PayloadAction<string>) => {
      state.sessionTimeout = action.payload;
      localStorage.setItem("sessionTimeout", action.payload);
    },
  },
});

export const { setCredentials, updateUser, removeUserInfo, setSessionTimeout } =
  authSlice.actions;
export default authSlice.reducer;
