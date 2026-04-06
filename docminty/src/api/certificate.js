import client from "./client";

export const certificateApi = {
  register: (data) => client.post("/verify", data),
  verify:   (id)   => client.get("/verify/" + id),
};
