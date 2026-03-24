import "./index.css";
import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/Login";
import PersistLogin from "./components/authcompt/PersistLogin";
import ProtectedRoute from "./components/authcompt/ProtectedRoute";
import DashboardPage from "./pages/Dashboard";
import Console from "./pages/Console";
function App() {
    return (
        <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route element={<PersistLogin />}>
                {/* disini misalnya pages apa gitu */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/consoles" element={<Console />} />
                </Route>
            </Route>
        </Routes>
    );
}

export default App;
