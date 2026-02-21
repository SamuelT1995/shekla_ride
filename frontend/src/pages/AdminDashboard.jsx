import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Users, Car, CreditCard, Shield, Check, X, Search, Filter, ArrowUpRight } from 'lucide-react';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ users: 0, cars: 0, bookings: 0, revenue: 0 });
    const [pendingUsers, setPendingUsers] = useState([]);
    const [pendingCars, setPendingCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const token = localStorage.getItem('token');
                const [statsRes, usersRes, carsRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/admin/stats', { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get('http://localhost:5000/api/admin/pending-users', { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get('http://localhost:5000/api/admin/pending-cars', { headers: { Authorization: `Bearer ${token}` } })
                ]);
                setStats(statsRes.data);
                setPendingUsers(usersRes.data);
                setPendingCars(carsRes.data);
            } catch (err) {
                console.error('Failed to load admin data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchAdminData();
    }, []);

    const handleUserVerification = async (userId, status) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5000/api/admin/users/${userId}/verify`, { status }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPendingUsers(pendingUsers.filter(u => u.id !== userId));
        } catch (err) {
            alert('Verification failed');
        }
    };

    const handleCarApproval = async (carId, isVerified) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5000/api/admin/cars/${carId}/approve`, { isVerified }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPendingCars(pendingCars.filter(c => c.id !== carId));
        } catch (err) {
            alert('Approval failed');
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center font-black text-primary">Accessing Command Center...</div>;

    const statItems = [
        { label: 'Platform Users', val: stats.users, icon: <Users />, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Active Fleet', val: stats.cars, icon: <Car />, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { label: 'Confirmed Bookings', val: stats.bookings, icon: <CreditCard />, color: 'text-green-600', bg: 'bg-green-50' },
        { label: 'Total Volume', val: `$${stats.revenue}`, icon: <Shield />, color: 'text-primary', bg: 'bg-blue-100' }
    ];

    return (
        <div className="min-h-screen bg-slate-50 pb-20">

            <div className="container py-12">
                <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">System Status: Operational</span>
                        </div>
                        <h1 className="text-5xl font-black text-slate-900 tracking-tight">Admin Console</h1>
                        <p className="text-slate-500 font-medium mt-2">Platform monitoring & identity verification engine.</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                            <input type="text" placeholder="Global search..." className="pl-12 pr-6 py-4 rounded-2xl border border-slate-200 bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all w-64 shadow-sm" />
                        </div>
                    </div>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {statItems.map((item, i) => (
                        <div key={i} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-6 group hover:translate-y-[-4px] transition-all duration-300">
                            <div className={`w-14 h-14 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                {item.icon}
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
                                <p className="text-2xl font-black text-slate-900">{item.val}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main Content Area */}
                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
                    <nav className="flex border-b border-slate-100 p-3 gap-3">
                        {['overview', 'users', 'cars'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-8 py-4 text-sm font-black rounded-2xl transition-all uppercase tracking-widest ${activeTab === tab ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </nav>

                    <div className="p-8 md:p-12">
                        {activeTab === 'overview' && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                <div>
                                    <div className="flex items-center justify-between mb-8">
                                        <h3 className="text-xl font-black text-slate-900">Priority KYC Verifications</h3>
                                        <span className="px-3 py-1 bg-red-50 text-red-600 text-[10px] font-black rounded-full border border-red-100 uppercase">{pendingUsers.length} Pending</span>
                                    </div>
                                    <div className="space-y-4">
                                        {pendingUsers.length === 0 ? (
                                            <div className="text-center py-12 bg-slate-50 rounded-3xl border border-dashed border-slate-200 text-slate-400 font-bold italic text-sm">All identities verified.</div>
                                        ) : (
                                            pendingUsers.map(user => (
                                                <div key={user.id} className="p-4 rounded-2xl bg-white border border-slate-100 flex items-center justify-between group hover:border-blue-200 transition-colors">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-bold text-xs">{user.fullName.charAt(0)}</div>
                                                        <div>
                                                            <p className="font-bold text-slate-900">{user.fullName}</p>
                                                            <p className="text-xs text-slate-400 font-medium">{user.role} • Joined {new Date(user.createdAt).toLocaleDateString()}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button onClick={() => handleUserVerification(user.id, 'VERIFIED')} className="w-9 h-9 bg-green-50 text-green-600 rounded-lg flex items-center justify-center hover:bg-green-600 hover:text-white transition-all shadow-sm"><Check size={18} /></button>
                                                        <button onClick={() => handleUserVerification(user.id, 'REJECTED')} className="w-9 h-9 bg-red-50 text-red-600 rounded-lg flex items-center justify-center hover:bg-red-600 hover:text-white transition-all shadow-sm"><X size={18} /></button>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-8">
                                        <h3 className="text-xl font-black text-slate-900">Vehicle Approvals</h3>
                                        <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black rounded-full border border-indigo-100 uppercase">{pendingCars.length} Awaiting Review</span>
                                    </div>
                                    <div className="space-y-4">
                                        {pendingCars.length === 0 ? (
                                            <div className="text-center py-12 bg-slate-50 rounded-3xl border border-dashed border-slate-200 text-slate-400 font-bold italic text-sm">Fleet audit complete.</div>
                                        ) : (
                                            pendingCars.map(car => (
                                                <div key={car.id} className="p-4 rounded-2xl bg-white border border-slate-100 flex items-center justify-between group hover:border-indigo-200 transition-colors">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-16 h-12 bg-slate-100 rounded-lg overflow-hidden shrink-0">
                                                            <img src={car.images[0] || "https://images.unsplash.com/photo-1549317336-206569e8475c?auto=format&fit=crop&q=80&w=200"} className="w-full h-full object-cover" alt="car" />
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-slate-900">{car.make} {car.model}</p>
                                                            <p className="text-xs text-slate-400 font-medium">Owner: {car.owner.fullName}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button onClick={() => handleCarApproval(car.id, true)} className="px-4 py-2 bg-slate-900 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-colors shadow-lg shadow-slate-900/20">Approve</button>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'users' && <div className="text-slate-400 italic font-bold">Comprehensive User Management Interface Coming Soon...</div>}
                        {activeTab === 'cars' && <div className="text-slate-400 italic font-bold">Global Fleet Inventory Controller Coming Soon...</div>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
