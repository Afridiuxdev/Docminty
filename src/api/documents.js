import client from "./client";

export const documentsApi = {
  getAll:  ()     => client.get("/documents"),
  save:    (data) => client.post("/documents", data),
  delete:  (id)   => client.delete("/documents/" + id),
};
