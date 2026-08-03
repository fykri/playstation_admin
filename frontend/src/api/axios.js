import axios from "axios";

export default axios.create({
    baseURL: import.meta.env.VITE_BASE_API,
    withCredentials: true,
    timeout: 10000,
});