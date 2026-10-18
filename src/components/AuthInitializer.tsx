import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { removeUserInfo } from "@/redux/slices/authSlice";
import { isTokenExpired } from "@/lib/auth";

export default function AuthInitializer() {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);
  // Use a ref to prevent double-dispatch in strict mode if needed, though harmless here
  const processedToken = useRef<string | null>(null);

  useEffect(() => {
    if (token && token !== processedToken.current) {
      if (isTokenExpired(token)) {
        // console.log("Token expired, logging out...");
        dispatch(removeUserInfo());
      }
      processedToken.current = token;
    }
  }, [token, dispatch]);

  return null;
}
