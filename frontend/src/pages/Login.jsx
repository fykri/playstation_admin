import { useContext, useState } from "react";
import { login } from "../api/authApi";
import { AuthContext } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import ErrorMessage from "@/components/ErrorMessage";
//cakra ui
import { Input, InputGroup, Button } from "@chakra-ui/react";
import { FaLock } from "react-icons/fa";
import { PasswordInput } from "@/components/ui/password-input";
import { LuUser } from "react-icons/lu";
import { MdOutlinePassword } from "react-icons/md";
const LoginPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isError, setIsError] = useState("");
    const { setAccessToken } = useContext(AuthContext);
    const usernameRef = useRef(null);
    const passwordRef = useRef(null);

    const handleUsernameEnter = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            passwordRef.current.focus();
        }
    };

    const navigate = useNavigate();
    async function handleLogin(e) {
        e.preventDefault();
        setIsError("")
        try {
            const result = await login(username, password);
            setAccessToken(result.accessToken);
            navigate("/dashboard");
        } catch (error) {
            setIsError(error.response.data.message);
        }
    }

    return (
        <div className="flex justify-center items-center min-w-77 sm:w-86 py-4 rounded-sm ">
            <div className="w-[90%] flex flex-col items-center gap-7">
                <ErrorMessage message={isError}></ErrorMessage>
                <header className="min-w-15 min-h-15 flex items-center justify-center bg-secondary rounded-t-xl rounded-br-2xl">
                    <FaLock size={34} className="text-primary" />
                </header>
                <form className="flex flex-col gap-4" onSubmit={handleLogin}>
                    <InputGroup startElement={<LuUser />}>
                        <Input
                            borderColor="gray.600"
                            size="lg"
                            ref={usernameRef}
                            onChange={(e) => {
                                setUsername(e.target.value);
                            }}
                            onKeyDown={handleUsernameEnter}
                            placeholder="Username"
                            css={{ "--focus-color": "secondary" }}
                        ></Input>
                    </InputGroup>
                    <InputGroup startElement={<MdOutlinePassword />}>
                        <PasswordInput
                            borderColor="gray.600"
                            size="lg"
                            ref={passwordRef}
                            onChange={(e) => {
                                setPassword(e.target.value);
                            }}
                            placeholder="Password"
                            css={{ "--focus-color": "secondary" }}
                        ></PasswordInput>
                    </InputGroup>
                    <Button type="submit">Login</Button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
