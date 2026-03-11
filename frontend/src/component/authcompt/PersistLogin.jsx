import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/authContext";
import { refreshToken } from "../../api/authApi";
import { Outlet } from "react-router-dom";

const PersistLogin = () => {
    const { accessToken, setAccessToken } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verifyRefreshToken = async () => {
            try {
                const data = await refreshToken();

                setAccessToken(data.data);
            } catch (error) {
                console.log("User not logged in");
            } finally {
                setLoading(false);
            }
        };

        if (!accessToken) {
            verifyRefreshToken();
        } else {
            setLoading(false);
        }
    }, []);

    return loading ? <p>Loading...</p> : <Outlet />;
};

export default PersistLogin;