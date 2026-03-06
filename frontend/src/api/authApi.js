import api from "./axios";

export const login = async (username, password) => {
    const res = await api.post("/auth/login", { username, password });
    return res.data;
};

export const logout = async () => {
    return await api.post("/auth/logout");
};

export const refreshToken = async () => {
    const res = await api.get("/auth/getToken");
    return res.data;
};

export default api;
