import { createContext, useState, useEffect, useCallback } from "react";
import { refreshToken } from "@/api/authApi";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [accessToken, setAccessToken] = useState(null);
    const [user, setUser] = useState(null);
    // Tambahkan state loading agar app tidak merender halaman sebelum auth diperiksa
    const [isLoading, setIsLoading] = useState(true);

    const logout = useCallback(() => {
        setAccessToken(null);
        setUser(null);
    }, []);

    // Silent Refresh saat pertama kali web dibuka / di-refresh
    useEffect(() => {
        const initAuth = async () => {
            try {
                // Memanggil endpoint refresh token menggunakan HttpOnly cookie
                const response = await refreshToken();
                
                // Set kembali access token & data user ke state
                setAccessToken(response.data.accessToken || response.data); 
                setUser(response.data.user);
            } catch (error) {
                // Jika cookie expired/tidak ada, biarkan user dalam kondisi logged out
                logout();
            } finally {
                setIsLoading(false);
            }
        };

        initAuth();
    }, [logout]);

    if (isLoading) {
        return <div>Loading...</div>; // Atau tampilkan Spinner / Skeleton
    }

    return (
        <AuthContext.Provider value={{
            accessToken,
            setAccessToken,
            user,
            setUser,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};