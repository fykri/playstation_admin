import LockIcon from "@mui/icons-material/Lock";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { Box, TextField, IconButton, InputAdornment } from "@mui/material";
import { useState } from "react";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Button } from "@mui/material";
const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);

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
                            //backgroundColor:'red'
                        }}
                    >
                        <AccountCircle
                            sx={{
                                color: "white",
                                mr: 1,
                                fontSize: 45,
                            }}
                        />
                        <TextField
                            id="username"
                            label="username"
                            variant="standard"
                            fullWidth
                            sx={{
                                input: { color: "white", fontSize: 20 },
                                label: { color: "#F2F9FF", fontSize: 15 },
                                "& .MuiInput-underline:before": {
                                    borderBottomColor: "white",
                                    top: "-3px",
                                },
                                "& .MuiInput-underline:after": {
                                    borderBottomColor: "white",
                                    top: "-3px",
                                },
                            }}
                        />
                    </Box>
                    {/* FORM PASSWORD */}
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "flex-end",
                            width: 270,
                            mt: 3,
                        }}
                    >
                        <LockIcon
                            sx={{
                                color: "white",
                                mr: 1,
                                fontSize: 45,
                            }}
                        />

                        <TextField
                            label="password"
                            variant="standard"
                            type={showPassword ? "text" : "password"}
                            fullWidth
                            sx={{
                                input: { color: "white", fontSize: 20 },
                                label: { color: "#F2F9FF", fontSize: 15 },
                                "& .MuiInput-underline:before": {
                                    borderBottomColor: "white",
                                    top: "-3px",
                                },
                                "& .MuiInput-underline:after": {
                                    borderBottomColor: "white",
                                    top: "-3px",
                                },
                            }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
                                            edge="end"
                                            sx={{ color: "white" }}
                                        >
                                            {showPassword ? (
                                                <VisibilityOff />
                                            ) : (
                                                <Visibility />
                                            )}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>
                    <Button
                        variant="contained"
                        fullWidth
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
