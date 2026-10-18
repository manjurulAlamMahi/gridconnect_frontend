import Echo from "laravel-echo";
import Pusher from "pusher-js";

(window as any).Pusher = Pusher;

import http from "./http";

const reverbKey = import.meta.env.VITE_REVERB_APP_KEY;
const reverbHost = import.meta.env.VITE_REVERB_HOST;
const reverbPort = import.meta.env.VITE_REVERB_PORT;
const reverbScheme = import.meta.env.VITE_REVERB_SCHEME;
const broadcastAuthUrl = import.meta.env.VITE_BROADCAST_AUTH_URL;
const isSecureTransport = ["https", "wss"].includes(
  String(reverbScheme || "").toLowerCase(),
);

if (!reverbKey) {
  console.warn(
    "VITE_REVERB_APP_KEY is not defined. Real-time chat will not work.",
  );
}

const echo = new Echo({
  broadcaster: "reverb",
  key: reverbKey,
  wsHost: reverbHost,
  wsPort: reverbPort ?? 80,
  wssPort: reverbPort ?? 443,
  forceTLS: isSecureTransport,
  disableStats: true,
  enabledTransports: ["ws", "wss"],
  authorizer: (channel: any) => {
    return {
      authorize: (socketId: string, callback: any) => {
        const baseUrl = (
          http.defaults.baseURL ||
          import.meta.env.VITE_BASE_API_URL ||
          ""
        ).replace(/\/api\/?$/, "");
        const authUrl = broadcastAuthUrl || `${baseUrl}/broadcasting/auth`;

        http
          .post(
            authUrl,
            {
              socket_id: socketId,
              channel_name: channel.name,
            },
            {
              withCredentials: true,
              headers: {
                Accept: "application/json",
                "X-Requested-With": "XMLHttpRequest",
              },
            },
          )
          .then((response) => {
            callback(false, response.data);
          })
          .catch((error) => {
            callback(true, error);
          });
      },
    };
  },
});

export default echo;
