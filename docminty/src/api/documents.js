import client from "./client";

export const documentsApi = {
  getAll:  ()     => client.get("/documents"),
  save:    (data) => {
    let formData = data;
    if (!(data instanceof FormData)) {
      formData = new FormData();
      const { file, ...rest } = data;
      formData.append("document", new Blob([JSON.stringify(rest)], { type: "application/json" }));
      if (file) {
        formData.append("file", file);
      }
    }
    return client.post("/documents", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    }).then(res => {
      if (res.data && res.data.success === false) {
        if (res.data.message && res.data.message.toLowerCase().includes("limit")) {
          if (typeof window !== "undefined") window.dispatchEvent(new Event("show-upgrade-modal"));
          throw new Error("PLAN_LIMIT_REACHED");
        }
        throw new Error(res.data.message || "Failed to save");
      }
      return res;
    });
  },
  getCount: ()    => client.get("/documents/count"),
  togglePublic: (id, isPublic) => client.post(`/documents/${id}/toggle-public?isPublic=${isPublic}`),
  delete:  (id)   => client.delete("/documents/" + id),
  verify:  (id)   => client.get("/public/verify/" + id),
  getPublic: (token) => client.get("/public/documents/" + token)
};
