import http from "@/lib/http";
import type { TAuthenticatedUser } from "@/redux/slices/authSlice";

type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  user: TAuthenticatedUser;
};

const authService = {
  async login(payload: LoginPayload) {
    const { data } = await http.post<LoginResponse>("/auth/login", payload);
    return data;
  },
};

export default authService;
