import React, { createContext, useContext } from "react";
import type { ReactNode } from "react";
import { useGetProfileQuery } from "@/redux/endpoints/driver/driver.api";

interface DriverProfileContextType {
  data: any;
  isLoading: boolean;
  error: any;
  refetch: () => void;
}

const DriverProfileContext = createContext<
  DriverProfileContextType | undefined
>(undefined);

export const useDriverProfile = () => {
  const context = useContext(DriverProfileContext);
  if (!context) {
    throw new Error(
      "useDriverProfile must be used within a DriverProfileProvider",
    );
  }
  return context;
};

interface DriverProfileProviderProps {
  children: ReactNode;
}

export const DriverProfileProvider: React.FC<DriverProfileProviderProps> = ({
  children,
}) => {
  const { data, isLoading, error, refetch } = useGetProfileQuery(undefined);

  return (
    <DriverProfileContext.Provider value={{ data, isLoading, error, refetch }}>
      {children}
    </DriverProfileContext.Provider>
  );
};
