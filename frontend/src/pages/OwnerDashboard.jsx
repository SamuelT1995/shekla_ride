import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import {
    Car, Calendar, Clock, CreditCard, Plus,
    Shield, Trash2, User, Check, TrendingUp,
    Settings, MessageSquare, AlertCircle, Star
} from 'lucide-react';

const OwnerDashboard = () => {
    const [cars, setCars] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('inventory');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const [carsRes, bookingsRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/cars/owner', {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get('http://localhost:5000/api/bookings/owner', {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                ]);
                setCars(carsRes.data);
                setBookings(bookingsRes.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleBookingAction = async (bookingId, action) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.put(`http://localhost:5000/api/bookings/${bookingId}/${action}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBookings(bookings.map(b => b.id === bookingId ? res.data : b));
        } catch (err) {
            alert('Failed to update booking');
        }
    };

    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="font-black text-slate-400 uppercase tracking-widest text-xs">Syncing Your Assets...</p>
        </div>
    );

    const totalEarnings = bookings.filter(b => b.status === 'CONFIRMED' || b.status === 'COMPLETED').reduce((acc, b) => acc + b.totalPrice, 0);

    return (
        <div className="min-h-screen bg-[#F8F9FD] pt-32 pb-24">
            <div className="container max-w-7xl">
                {/* Modern Header */}
                <div className="mb-12 flex flex-col lg:flex-row lg:items-center justify-between gap-8 bg-white p-8 rounded-[3rem] shadow-premium border border-slate-100">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-primary/10 rounded-[2rem] flex items-center justify-center text-primary shadow-inner">
                            <TrendingUp size={32} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Host Control Center</h1>
                            <p className="text-slate-400 font-medium">Monitoring your private fleet and incoming revenue.</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-4">
                        <div className="px-8 py-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Revenue</p>
                            <p className="text-2xl font-black text-slate-900">${totalEarnings.toLocaleString()}</p>
                        </div>
                        <Link to="/cars/add" className="btn-primary rounded-2xl px-8 py-4 text-[10px] font-black uppercase tracking-widest flex items-center gap-3 shadow-luxe transition-transform hover:scale-105 active:scale-95">
                            <Plus size={18} /> List New Vehicle
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                    {/* Left Sidebar - Navigation & Quick Links */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="bg-white rounded-[2.5rem] p-4 shadow-premium border border-slate-50">
                            <nav className="space-y-2">
                                {[
                                    { id: 'inventory', label: 'Vehicle Inventory', icon: <Car size={18} />, count: cars.length },
                                    { id: 'requests', label: 'Booking Requests', icon: <Calendar size={18} />, count: bookings.filter(b => b.status === 'PENDING').length },
                                    { id: 'earnings', label: 'Revenue & Payouts', icon: <CreditCard size={18} /> },
                                    { id: 'settings', label: 'Vehicle Settings', icon: <Settings size={18} /> }
                                ].map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveTab(item.id)}
                                        className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === item.id
                                            ? 'bg-primary text-secondary shadow-premium translate-x-1'
                                            : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
                                            }`}
                                    >
                                        <span className="flex items-center gap-4">
                                            {item.icon} {item.label}
                                        </span>
                                        {item.count > 0 && (
                                            <span className={`px-2 py-0.5 rounded-full text-[9px] ${activeTab === item.id ? 'bg-secondary text-primary' : 'bg-primary/10 text-primary'}`}>
                                                {item.count}
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </nav>
                        </div>

                        {/* Tip / Notification */}
                        <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden group">
                            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
                                <Shield size={120} />
                            </div>
                            <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <AlertCircle size={20} /> Host Tip
                            </h4>
                            <p className="text-indigo-100 text-sm font-medium leading-relaxed">
                                Professional photos increase booking rates by up to 40%. Consider updating your gallery soon!
                            </p>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-3">
                        {activeTab === 'inventory' && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between mb-4 px-4">
                                    <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight italic">Your Active Fleet</h2>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{cars.length} Vehicles</span>
                                </div>

                                {cars.length === 0 ? (
                                    <div className="bg-white rounded-[3rem] border border-dashed border-slate-200 p-24 text-center">
                                        <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <Car size={40} />
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-2">The garage is empty</h3>
                                        <p className="text-slate-400 font-medium mb-8">Start your hosting journey by adding your first vehicle.</p>
                                        <Link to="/cars/add" className="btn-primary rounded-xl px-12 py-5 text-[10px] font-black uppercase tracking-widest shadow-luxe">Add a Vehicle</Link>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-sans">
                                        {cars.map(car => (
                                            <div key={car.id} className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-50 shadow-premium group hover:shadow-xl transition-all">
                                                <div className="h-48 overflow-hidden relative">
                                                    <img src={car.images[0] || "https://images.unsplash.com/photo-1549317336-206569e8475c?auto=format&fit=crop&q=80&w=600"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/20 shadow-sm">
                                                        <span className="text-[10px] font-black text-primary uppercase">${car.pricePerDay} <span className="text-slate-400 font-medium">/ Day</span></span>
                                                    </div>
                                                </div>
                                                <div className="p-8">
                                                    <div className="flex justify-between items-start mb-6">
                                                        <div>
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <span className="text-[8px] font-black text-slate-300 uppercase tracking-[.2em]">{car.year}</span>
                                                                <div className={`w-1.5 h-1.5 rounded-full ${car.status === 'APPROVED' ? 'bg-emerald-500' : 'bg-orange-500'}`}></div>
                                                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{car.status}</span>
                                                            </div>
                                                            <h3 className="text-xl font-black text-slate-900 group-hover:text-primary transition-colors italic">{car.make} {car.model}</h3>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <button className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-slate-100 transition-colors"><MessageSquare size={16} /></button>
                                                            <button className="w-10 h-10 rounded-xl bg-red-50 text-red-400 flex items-center justify-center hover:bg-red-100 transition-colors"><Trash2 size={16} /></button>
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4 border-t border-slate-50 pt-6">
                                                        <div>
                                                            <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Total Trips</p>
                                                            <p className="text-sm font-bold text-slate-700">12 Trips</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Rating</p>
                                                            <div className="flex items-center justify-end gap-1 text-sm font-bold text-slate-900">
                                                                4.9 <Star size={12} className="text-amber-400 fill-amber-400" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'requests' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                                <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight italic px-4">Pending Requests</h2>
                                {bookings.filter(b => b.status === 'PENDING').length === 0 ? (
                                    <div className="bg-white rounded-[3rem] p-24 text-center border border-slate-50 shadow-premium">
                                        <p className="text-slate-400 font-bold italic">No pending requests at the moment.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {bookings.filter(b => b.status === 'PENDING').map(booking => (
                                            <div key={booking.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-premium flex flex-col md:flex-row justify-between items-start md:items-center gap-8 group">
                                                <div className="flex items-center gap-6">
                                                    <div className="w-16 h-16 bg-slate-100 rounded-[1.5rem] flex items-center justify-center text-slate-400 shadow-inner group-hover:scale-110 transition-transform">
                                                        <User size={32} />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-lg font-black text-slate-900">{booking.renter.fullName}</h4>
                                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                                                            Interested in <span className="text-primary italic">{booking.car.model}</span>
                                                        </p>
                                                        <div className="flex items-center gap-4 text-xs font-medium text-slate-500 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                                                            <Calendar size={14} className="text-primary" />
                                                            {new Date(booking.startDate).toLocaleDateString()} — {new Date(booking.endDate).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-4 w-full md:w-auto">
                                                    <div className="text-right px-8 hidden md:block">
                                                        <p className="text-[10px] text-slate-300 font-black uppercase tracking-widest mb-1">Payout</p>
                                                        <p className="text-xl font-black text-primary">${booking.totalPrice}</p>
                                                    </div>
                                                    <div className="flex gap-3 flex-1 md:flex-none">
                                                        <button
                                                            onClick={() => handleBookingAction(booking.id, 'approve')}
                                                            className="flex-1 md:flex-none bg-emerald-600 text-white px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-700 transition-all hover:shadow-lg active:scale-95 flex items-center gap-2"
                                                        >
                                                            <Check size={16} /> Approve
                                                        </button>
                                                        <button
                                                            onClick={() => handleBookingAction(booking.id, 'cancel')}
                                                            className="flex-1 md:flex-none bg-slate-50 text-slate-400 px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-50 hover:text-red-500 transition-all active:scale-95"
                                                        >
                                                            Reject
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Placeholder for other tabs */}
                        {(activeTab === 'earnings' || activeTab === 'settings') && (
                            <div className="bg-white rounded-[3rem] p-24 text-center border border-slate-50 shadow-premium animate-in zoom-in-95">
                                <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <TrendingUp size={40} />
                                </div>
                                <h3 className="text-xl font-bold bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">Enhanced Commercial Insights</h3>
                                <p className="text-slate-400 font-medium mb-8">This module is currently being calibrated for your growth. Stay tuned!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OwnerDashboard;
