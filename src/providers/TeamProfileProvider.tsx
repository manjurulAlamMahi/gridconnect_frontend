import React, { createContext, useContext } from "react";
import type { ReactNode } from "react";
import { useGetTeamProfileQuery } from "@/redux/endpoints/team/team.api";

interface TeamProfileContextType {
  data: any;
  isLoading: boolean;
  error: any;
  refetch: () => void;
}

const TeamProfileContext = createContext<TeamProfileContextType | undefined>(
  undefined
);

export const useTeamProfile = () => {
  const context = useContext(TeamProfileContext);
  if (!context) {
    throw new Error("useTeamProfile must be used within a TeamProfileProvider");
  }
  return context;
};

interface TeamProfileProviderProps {
  children: ReactNode;
}

export const TeamProfileProvider: React.FC<TeamProfileProviderProps> = ({
  children,
}) => {
  const { data, isLoading, error, refetch } = useGetTeamProfileQuery();

  return (
    <TeamProfileContext.Provider value={{ data, isLoading, error, refetch }}>
      {children}
    </TeamProfileContext.Provider>
  );
};
