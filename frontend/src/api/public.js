import client from "./client";

export const submitContactForm = async (data) => {
    return await client.post("/api/public/contact", data);
};

export const getPublicSettings = async () => {
    return await client.get("/public/settings");
};
