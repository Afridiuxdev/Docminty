import client from "./client";

export const adminApi = {
  getStats:          () => client.get("/admin/stats"),
  getUsers:          () => client.get("/admin/users"),
  getRevenue:        () => client.get("/admin/revenue"),
  banUser:           (id) => client.put("/admin/users/" + id + "/ban"),
  unbanUser:         (id) => client.put("/admin/users/" + id + "/unban"),
  getDocuments:      () => client.get("/admin/documents"),
  getDocument:       (id) => client.get("/admin/documents/" + id),
  getUserDetails:    (id) => client.get("/admin/users/" + id),
  getPayments:       () => client.get("/admin/payments"),
  getNotifications:  () => client.get("/admin/notifications"),
  markAllRead:       () => client.post("/admin/notifications/mark-read"),
  deleteNotification:(id) => client.delete("/admin/notifications/" + id),
  getActivities:     () => client.get("/admin/activities"),
  getSettings:       () => client.get("/admin/settings"),
  saveSettings:      (data) => client.post("/admin/settings", data),
};