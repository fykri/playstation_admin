import axios from "axios";
import { refreshToken } from "./authApi";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BASE_API,
    timeout: 10000,
    withCredentials: true,
});

// Variable state untuk mencegah race condition
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

export const setupInterceptors = ({
    getToken,
    setToken,
    onLogout,
}) => {
    const requestInterceptor = axiosInstance.interceptors.request.use(
        (config) => {
            const token = getToken();

            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }

            return config;
        },
        (error) => Promise.reject(error)
    );

    const responseInterceptor = axiosInstance.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config;

            if (!originalRequest) {
                return Promise.reject(error);
            }

            // Check offline
            if (!navigator.onLine) {
                return Promise.reject(
                    new Error("Kamu sedang offline. Periksa koneksi internet.")
                );
            }

            // Server tidak dapat dijangkau
            if (error.code === "ERR_NETWORK") {
                return Promise.reject(
                    new Error("Server tidak bisa dihubungi.")
                );
            }

            const status = error.response?.status;
            const message = error.response?.data?.message;

            // Trigger refresh token jika 401
            if (
                status === 401 &&
                message === "Token expired" &&
                !originalRequest._retry
            ) {
                // Jika sedang ada proses refresh lain yang berjalan, masukkan request ke antrean
                if (isRefreshing) {
                    return new Promise((resolve, reject) => {
                        failedQueue.push({ resolve, reject });
                    })
                        .then((token) => {
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                            return axiosInstance(originalRequest);
                        })
                        .catch((err) => Promise.reject(err));
                }

                originalRequest._retry = true;
                isRefreshing = true;

                try {
                    const response = await refreshToken();
                    
                    // Pastikan token String yang diambil (sesuaikan property jika berupa response.data.token)
                    const newToken = response.data; 

                    setToken(newToken);

                    // Update header request pertama
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;

                    // Jalankan semua antrean request yang tertunda
                    processQueue(null, newToken);

                    return axiosInstance(originalRequest);
                } catch (refreshError) {
                    processQueue(refreshError, null);
                    onLogout?.();
                    return Promise.reject(refreshError);
                } finally {
                    isRefreshing = false;
                }
            }

            return Promise.reject(error);
        }
    );

    // Cleanup interceptor
    return () => {
        axiosInstance.interceptors.request.eject(requestInterceptor);
        axiosInstance.interceptors.response.eject(responseInterceptor);
    };
};

export default axiosInstance;