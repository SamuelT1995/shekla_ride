import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <div className="container max-w-4xl py-12">
                <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden">
                    <div className="bg-primary h-48 relative">
                        <div className="absolute -bottom-16 left-12 w-32 h-32 bg-white rounded-3xl p-2 shadow-xl">
                            <div className="w-full h-full bg-slate-900 rounded-2xl flex items-center justify-center text-white text-4xl font-black">
                                {user?.fullName.charAt(0)}
                            </div>
                        </div>
                    </div>

                    <div className="pt-20 px-12 pb-12">
                        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <h1 className="text-4xl font-black text-gray-900">{user?.fullName}</h1>
                                    <span className="px-3 py-1 bg-blue-50 text-primary text-[10px] font-black rounded-full border border-blue-100 uppercase tracking-widest">{user?.role}</span>
                                </div>
                                <p className="text-gray-500 font-medium">{user?.email}</p>
                            </div>
                            <div className="flex gap-4">
                                <Link to="/dashboard/bookings" className="btn btn-primary py-3 px-8 text-sm">View My Bookings</Link>
                                <button onClick={logout} className="px-8 py-3 bg-red-50 text-red-600 rounded-xl font-black text-sm hover:bg-red-100 transition-colors">Logout Account</button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 pt-16 border-t border-gray-100">
                            <div className="p-6 bg-gray-50 rounded-2xl">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Account Status</p>
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${user?.status === 'VERIFIED' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                                    <p className="font-bold text-gray-900 uppercase text-xs">{user?.status}</p>
                                </div>
                            </div>
                            <div className="p-6 bg-gray-50 rounded-2xl">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Total Rentals</p>
                                <p className="text-2xl font-black text-gray-900">0</p>
                            </div>
                            <div className="p-6 bg-gray-50 rounded-2xl">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Member Since</p>
                                <p className="font-bold text-gray-900">Feb 2026</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
