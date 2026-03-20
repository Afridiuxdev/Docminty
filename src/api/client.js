import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

const client = axios.create({
    baseURL: API_BASE,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000,
});

// Request interceptor — attach auth token if exists
client.interceptors.request.use((config) => {
    const token = localStorage.getItem("docminty_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor — handle 401
client.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("docminty_token");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default client;

// API endpoints
export const api = {
    // Auth
    login: (data) => client.post("/auth/login", data),
    signup: (data) => client.post("/auth/signup", data),
    logout: () => client.post("/auth/logout"),

    // Verification
    createVerification: (data) => client.post("/verify", data),
    getVerification: (id) => client.get(`/verify/${id}`),

    // Payment
    createOrder: (data) => client.post("/payment/create-order", data),
    verifyPayment: (data) => client.post("/payment/verify", data),

    // User
    getProfile: () => client.get("/user/profile"),
    updateProfile: (data) => client.put("/user/profile", data),
};