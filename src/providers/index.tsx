import { RouterProvider } from "react-router";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "@/redux/store";
import router from "@/routes/router";
import { useState, useEffect } from "react";
import SplashScreen from "@/components/shared/SplashScreen";
import AuthInitializer from "@/components/AuthInitializer";

export default function Providers() {
  const [showSplash, setShowSplash] = useState(true);
  const [finishLoading, setFinishLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFinishLoading(true);
      setTimeout(() => {
        setShowSplash(false);
      }, 700); // Match transition duration
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AuthInitializer />
        {showSplash && <SplashScreen finishLoading={finishLoading} />}
        <RouterProvider router={router} />
      </PersistGate>
    </Provider>
  );
}
