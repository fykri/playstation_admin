import './index.css';
import { Route, Routes } from 'react-router-dom';
import LoginPage from './pages/Login';
import PersistLogin from './components/authcompt/PersistLogin';
import ProtectedRoute from './components/authcompt/ProtectedRoute';
import DashboardPage from './pages/Dashboard/Dashboard';
import Console from './pages/Console';
import Station from './pages/Station';
import SessionPage from './pages/Session';
import Booking from './pages/booking/Booking';
import ReportPages from './pages/Report/Report';
function App() {
    return (
        <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route element={<PersistLogin />}>
                {/* disini misalnya pages apa gitu */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/consoles" element={<Console />} />
                    <Route path="/station" element={<Station />}></Route>
                    <Route path="/session" element={<SessionPage />}></Route>
                    <Route path="/booking" element={<Booking />}></Route>
                    <Route path="/report" element={<ReportPages />}></Route>
                </Route>
            </Route>
        </Routes>
    );
}

export default App;
