import { useAppSelector } from "@/redux/hooks";

export default function useAuth() {
  const authState = useAppSelector((state) => state.auth);
  const isAuthenticated = Boolean(authState.token);

  return {
    ...authState,
    isAuthenticated,
  };
}
