import client from "./client";

export const adminApi = {
  getStats:          () => client.get("/admin/stats"),
  getUsers:          () => client.get("/admin/users"),
  getRevenue:        () => client.get("/admin/revenue"),
  banUser:           (id) => client.put("/admin/users/" + id + "/ban"),
  unbanUser:         (id) => client.put("/admin/users/" + id + "/unban"),
  getNotifications:  () => client.get("/admin/notifications"),
  getSettings:       () => client.get("/admin/settings"),
  saveSettings:      (data) => client.post("/admin/settings", data),
};