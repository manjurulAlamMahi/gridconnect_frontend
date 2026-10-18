import axios from "axios";
import { store } from "@/redux/store";
import { removeUserInfo } from "@/redux/slices/authSlice";

const http = axios.create({
  baseURL: import.meta.env.VITE_BASE_API_URL,
  withCredentials: true,
});

http.interceptors.request.use((config) => {
  const state = store.getState();
  const token = state.auth.token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

http.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      store.dispatch(removeUserInfo());
    }
    return Promise.reject(error);
  },
);

export default http;
