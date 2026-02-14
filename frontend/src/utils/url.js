// Dynamic base URL for LAN access
export const getBaseURL = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace('/api', '');
  }
  const hostname = window.location.hostname;
  const port = window.location.port;
  // If served from same origin (production/ngrok), use current origin
  if (port !== '5173' && port !== '5174') {
    return window.location.origin;
  }
  return `http://${hostname}:5000`;
};

export const getAPIURL = () => {
  return `${getBaseURL()}/api`;
};

export const getSocketURL = () => {
  if (import.meta.env.VITE_SOCKET_URL) {
    return import.meta.env.VITE_SOCKET_URL;
  }
  return getBaseURL();
};
