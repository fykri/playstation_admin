import { useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/authContext";

const useAxiosPrivate = () => {

    const { accessToken } = useContext(AuthContext);

    useEffect(() => {

        const requestIntercept = api.interceptors.request.use(
            config => {

                if (accessToken) {
                    config.headers.Authorization = `Bearer ${accessToken}`;
                }

                return config;
            },
            error => Promise.reject(error)
        );

        return () => {
            api.interceptors.request.eject(requestIntercept);
        };

    }, [accessToken]);

    return api;
};

export default useAxiosPrivate;
