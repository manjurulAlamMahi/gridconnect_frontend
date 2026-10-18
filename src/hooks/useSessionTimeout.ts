import { useEffect, useRef, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { removeUserInfo } from "@/redux/slices/authSlice";

const useSessionTimeout = () => {
    const dispatch = useAppDispatch();
    const { sessionTimeout, token } = useAppSelector((state) => state.auth);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const logout = useCallback(() => {
        if (token) {
            dispatch(removeUserInfo());
        }
    }, [dispatch, token]);

    const resetTimer = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        if (token) {
            const minutes = parseInt(sessionTimeout, 10);
            if (!isNaN(minutes) && minutes > 0) {
                timeoutRef.current = setTimeout(logout, minutes * 60 * 1000);
            }
        }
    }, [sessionTimeout, token, logout]);

    useEffect(() => {
        if (!token) {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            return;
        }

        const events = [
            "mousemove",
            "mousedown",
            "click",
            "scroll",
            "keypress",
            "touchstart",
        ];

        const handleActivity = () => {
            resetTimer();
        };

        // Set initial timer
        resetTimer();

        // Add event listeners
        events.forEach((event) => {
            window.addEventListener(event, handleActivity);
        });

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            events.forEach((event) => {
                window.removeEventListener(event, handleActivity);
            });
        };
    }, [resetTimer, token]);

    return;
};

export default useSessionTimeout;
