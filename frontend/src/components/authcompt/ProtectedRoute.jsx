import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
    const { accessToken } = useContext(AuthContext);
    return accessToken ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
