import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { AuthProvider } from "./context/authContext.jsx";
import { Provider } from "@/components/ui/provider";
import "./index.css";

createRoot(document.getElementById("root")).render(
    <BrowserRouter>
        <Provider>
            <AuthProvider>
                <App />
            </AuthProvider>
        </Provider>
    </BrowserRouter>,
);
