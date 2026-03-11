import { useContext, useState } from "react";
import { login } from "../api/authApi";
import { AuthContext } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import { Button, HStack } from "@chakra-ui/react";

const LoginPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    //const [isError, setIsError] = useState("");
    const { setAccessToken } = useContext(AuthContext);

    const navigate = useNavigate();
    async function handleLogin() {
        try {
            const result = await login(username, password);
            setAccessToken(result.accessToken);
            navigate("/dashboard");
        } catch (error) {
            setIsError(error.response.data.message);
        }
    }

    return (
        <div className="flex justify-center items-center min-w-77 sm:w-86 py-4 rounded-sm border-white border ">
            <div className="w-[90%] flex  items-center flex-col">
                <header className="bg-white p-1.5 rounded-t-xl rounded-br-2xl">
                    {/*<LockIcon fontSize="large"></LockIcon>*/}
                    <HStack>
                        <Button>Click me</Button>
                        <Button>Click me</Button>
                    </HStack>
                </header>
                <form className="mt-5">{/* FORM USERNAME */}</form>
            </div>
        </div>
    );
};

export default LoginPage;
