import { Box, Button } from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import LockIcon from "@mui/icons-material/Lock";
import FormTextField from "../component/inputs/FormTextField";
import PasswordField from "../component/inputs/PasswordField";
import { useContext, useState } from "react";
import { login } from "../api/authApi";
import { AuthContext } from "../context/authContext";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isError, setIsError] = useState("");
    const { setAccessToken } = useContext(AuthContext);

    const navigate = useNavigate();
    async function handleLogin() {
        try {
            const result = await login(username, password);
            setAccessToken(result.accessToken);
            navigate('/dashboard')
        } catch (error) {
            setIsError(error.response.data.message);
        }
    }

    return (
        <div className="flex justify-center items-center min-w-77 sm:w-86 py-4 rounded-sm border-white border ">
            <div className="w-[90%] flex  items-center flex-col">
                <header className="bg-white p-1.5 rounded-t-xl rounded-br-2xl">
                    <LockIcon fontSize="large"></LockIcon>
                </header>
                <form className="mt-5">
                    {/* FORM USERNAME */}
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "flex-end",
                            width: 270,
                        }}
                    >
                        <AccountCircle
                            sx={{ color: "white", mr: 1, fontSize: 45 }}
                        />
                        <FormTextField
                            label="Username"
                            onChange={(e) => {
                                setUsername(e.target.value);
                            }}
                        />
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "flex-end",
                            width: 270,
                            mt: 3,
                        }}
                    >
                        <LockIcon
                            sx={{ color: "white", mr: 1, fontSize: 45 }}
                        />
                        <PasswordField
                            label="Password"
                            onChange={(e) => {
                                setPassword(e.target.value);
                            }}
                        />
                    </Box>
                    <Button
                        variant="contained"
                        fullWidth
                        onClick={handleLogin}
                        sx={{
                            mt: 4,
                            height: 45,
                            borderRadius: 2,
                            fontWeight: "bold",
                            fontSize: 16,
                            textTransform: "none",
                            backgroundColor: "#1976d2",
                            "&:hover": {
                                backgroundColor: "#1565c0",
                            },
                        }}
                    >
                        Login
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
