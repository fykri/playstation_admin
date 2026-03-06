import "./index.css";
import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/Login";
import PersistLogin from "./component/authcompt/PersistLogin";
import ProtectedRoute from "./component/authcompt/ProtectedRoute";
import DashboardPage from "./pages/Dashboard";
function App() {
    return (
        <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route element={<PersistLogin />}>
                {/* disini misalnya pages apa gitu */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<DashboardPage />}></Route>
                </Route>
            </Route>
        </Routes>
    );
}

export default App;
