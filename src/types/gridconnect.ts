export interface GridConnectBase {
  id: number;
}

export interface GridConnectHeader extends GridConnectBase {
  grid_title: string;
  grid_description: string;
}

export interface GridConnectDriver extends GridConnectBase {
  driver_description: string;
  driver_features: string; // contains HTML <br>
}

export interface GridConnectTeam extends GridConnectBase {
  team_description: string;
  team_features: string; // contains HTML <br>
}

export type GridConnectItem =
  | GridConnectHeader
  | GridConnectDriver
  | GridConnectTeam;

export interface GridConnectResponse {
  status: "success" | "error";
  message: string;
  data: GridConnectItem[];
}
