import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import MainLayout from './components/common/MainLayout';
import Home from './pages/Home';
import Cars from './pages/Cars';
import CarDetails from './pages/CarDetails';
import BookingFlow from './pages/BookingFlow';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import RenterBookings from './pages/RenterBookings';
import OwnerDashboard from './pages/OwnerDashboard';
import CarForm from './pages/CarForm';
import AdminDashboard from './pages/AdminDashboard';
import './index.css';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Auth Routes (No Navbar/Footer in layout) */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* App Routes (With Navbar/Footer) */}
                    <Route element={<MainLayout><ProtectedRoute /></MainLayout>}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/dashboard/bookings" element={<RenterBookings />} />
                        <Route path="/booking/:carId" element={<BookingFlow />} />
                    </Route>

                    <Route element={<MainLayout><ProtectedRoute allowedRoles={['OWNER', 'ADMIN']} /></MainLayout>}>
                        <Route path="/owner/dashboard" element={<OwnerDashboard />} />
                        <Route path="/cars/add" element={<CarForm />} />
                    </Route>

                    <Route element={<MainLayout><ProtectedRoute allowedRoles={['ADMIN']} /></MainLayout>}>
                        <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    </Route>

                    <Route element={<MainLayout><Home /></MainLayout>} path="/" />
                    <Route element={<MainLayout><Cars /></MainLayout>} path="/cars" />
                    <Route element={<MainLayout><CarDetails /></MainLayout>} path="/cars/:id" />

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
