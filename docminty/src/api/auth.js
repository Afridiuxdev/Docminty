import client from "./client";

export const authApi = {
  signup: (data) => client.post("/auth/signup", data),
  verifyOtp: (data) => client.post("/auth/verify-otp", data),
  resendOtp: (data) => client.post("/auth/resend-otp", data),
  login: (data) => client.post("/auth/login", data),
  verifyLoginOtp: (data) => client.post("/auth/verify-login-otp", data),
  googleLogin: (idToken) => client.post("/auth/google", { idToken }),
  refresh: (refreshToken) => client.post("/auth/refresh", { refreshToken }),
  me: () => client.get("/auth/me"),
  updateProfile: (data) => client.put("/auth/update-profile", data),
  forgotPassword: (data) => client.post("/auth/forgot-password", data),
  verifyResetOtp: (data) => client.post("/auth/verify-reset-otp", data),
  resetPassword: (data) => client.post("/auth/reset-password", data),
  deleteAccount: (data) => client.delete("/auth/delete-account", { data }),
};

export function saveTokens(accessToken, refreshToken) {
  localStorage.setItem("docminty_access_token", accessToken);
  localStorage.setItem("docminty_refresh_token", refreshToken);
}

export function clearTokens() {
  localStorage.removeItem("docminty_access_token");
  localStorage.removeItem("docminty_refresh_token");
}

export function getAccessToken() {
  return typeof window !== "undefined" ? localStorage.getItem("docminty_access_token") : null;
}
