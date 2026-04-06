import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

const client = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

// Attach JWT token to every request
client.interceptors.request.use(config => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("docminty_access_token");
    if (token) config.headers.Authorization = "Bearer " + token;
  }
  return config;
});

// Auto refresh on 401
client.interceptors.response.use(
  res => res,
  async err => {
    const original = err.config;
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refreshToken = localStorage.getItem("docminty_refresh_token");
        if (!refreshToken) throw new Error("No refresh token");
        const res = await axios.post(API_URL + "/auth/refresh", { refreshToken });
        const { accessToken } = res.data.data;
        localStorage.setItem("docminty_access_token", accessToken);
        original.headers.Authorization = "Bearer " + accessToken;
        return client(original);
      } catch (e) {
        localStorage.removeItem("docminty_access_token");
        localStorage.removeItem("docminty_refresh_token");
        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  }
);

export default client;
