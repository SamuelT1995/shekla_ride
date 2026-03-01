import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
    Search, Calendar, Clock, MapPin,
    CreditCard, ChevronRight, Star, Heart,
    Filter, Sparkles, Navigation
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({ activeBookings: 0, totalSpent: 0 });
    const [recentBookings, setRecentBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/api/bookings/renter', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setRecentBookings(res.data.slice(0, 3));
                setStats({
                    activeBookings: res.data.filter(b => b.status === 'CONFIRMED' || b.status === 'PICKED_UP').length,
                    totalSpent: res.data.reduce((acc, b) => acc + (b.status === 'COMPLETED' ? b.totalPrice : 0), 0)
                });
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    return (
        <div className="min-h-screen bg-[#FDFDFF] pt-32 pb-24">
            <div className="container max-w-6xl">
                {/* Hero / Welcome */}
                <div className="relative mb-16 overflow-hidden rounded-[3rem] bg-slate-900 p-12 lg:p-16 text-white shadow-2xl">
                    <div className="absolute right-0 top-0 h-full w-1/3 opacity-20">
                        <img
                            src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=1200"
                            className="h-full w-full object-cover"
                            alt=""
                        />
                    </div>
                    <div className="relative z-10 max-w-2xl space-y-8">
                        <div className="flex items-center gap-3">
                            <div className="flex -space-x-2">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="h-8 w-8 rounded-full border-2 border-slate-900 bg-slate-800 p-1">
                                        <div className="h-full w-full rounded-full bg-primary/20"></div>
                                    </div>
                                ))}
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Member Spotlight</span>
                        </div>
                        <h1 className="text-4xl font-light leading-tight tracking-tight lg:text-6xl">
                            Welcome back, <br />
                            <span className="font-serif italic text-primary">{user?.fullName.split(' ')[0]}</span>
                        </h1>
                        <p className="text-lg text-slate-400 font-medium">Ready for your next extraordinary journey in Ethiopia?</p>
                        <div className="flex flex-wrap gap-4 pt-4">
                            <Link to="/cars" className="flex items-center gap-3 rounded-full bg-primary px-8 py-4 text-[10px] font-black uppercase tracking-widest text-secondary shadow-luxe transition-transform hover:scale-105">
                                <Search size={16} /> Discover Vehicles
                            </Link>
                            <Link to="/dashboard/bookings" className="flex items-center gap-3 rounded-full bg-white/10 px-8 py-4 text-[10px] font-black uppercase tracking-widest text-white backdrop-blur-md transition-all hover:bg-white/20">
                                <Calendar size={16} /> Manage Bookings
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="grid gap-12 lg:grid-cols-3">
                    {/* Stats & Quick Actions */}
                    <div className="space-y-12">
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-1">
                            <div className="group rounded-[2.5rem] bg-white p-8 border border-slate-50 shadow-premium transition-all hover:shadow-xl">
                                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500 shadow-sm transition-transform group-hover:scale-110">
                                    <Navigation size={24} />
                                </div>
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-300">Active Rentals</h3>
                                <p className="text-3xl font-black text-slate-900">{stats.activeBookings}</p>
                            </div>
                            <div className="group rounded-[2.5rem] bg-white p-8 border border-slate-50 shadow-premium transition-all hover:shadow-xl">
                                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-500 shadow-sm transition-transform group-hover:scale-110">
                                    <Sparkles size={24} />
                                </div>
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-300">Journey Points</h3>
                                <p className="text-3xl font-black text-slate-900">1,250 <span className="text-xs text-slate-300">XP</span></p>
                            </div>
                        </div>

                        <div className="rounded-[2.5rem] bg-white p-10 border border-slate-50 shadow-premium">
                            <h3 className="mb-8 text-xl font-bold flex items-center gap-3">
                                <Filter size={20} className="text-primary" /> Curated For You
                            </h3>
                            <div className="space-y-6">
                                {[
                                    { name: 'Weekend Escape', icon: <ChevronRight size={14} /> },
                                    { name: 'Business Class', icon: <ChevronRight size={14} /> },
                                    { name: 'Mountain Explorer', icon: <ChevronRight size={14} /> }
                                ].map((item, i) => (
                                    <button key={i} className="flex w-full items-center justify-between rounded-2xl border border-slate-50 p-5 text-left text-[10px] font-black uppercase tracking-widest text-slate-400 transition-all hover:border-primary/20 hover:text-primary group">
                                        {item.name}
                                        <span className="group-hover:translate-x-1 transition-transform">{item.icon}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Main Feed: Recent Activity */}
                    <div className="lg:col-span-2 space-y-12">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-light italic font-serif">Recent Journeys</h2>
                            <Link to="/dashboard/bookings" className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">View History</Link>
                        </div>

                        {loading ? (
                            <div className="grid gap-6">
                                {[1, 2].map(i => (
                                    <div key={i} className="h-48 animate-pulse rounded-[2.5rem] bg-slate-100"></div>
                                ))}
                            </div>
                        ) : recentBookings.length > 0 ? (
                            <div className="grid gap-6">
                                {recentBookings.map(booking => (
                                    <div key={booking.id} className="group relative flex flex-col overflow-hidden rounded-[2.5rem] bg-white p-4 sm:flex-row gap-6 border border-slate-50 shadow-premium transition-all hover:shadow-xl">
                                        <div className="h-48 w-full shrink-0 overflow-hidden rounded-[2rem] sm:h-auto sm:w-48">
                                            <img
                                                src={booking.car.images[0]}
                                                className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                alt=""
                                            />
                                        </div>
                                        <div className="flex flex-col justify-between py-4 pr-4 flex-1">
                                            <div>
                                                <div className="mb-2 flex items-center gap-3">
                                                    <span className="rounded-full bg-slate-50 px-3 py-1 text-[8px] font-black uppercase tracking-widest text-slate-400">
                                                        {booking.car.type}
                                                    </span>
                                                    <span className={`rounded-full px-3 py-1 text-[8px] font-black uppercase tracking-widest ${booking.status === 'CONFIRMED' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'
                                                        }`}>
                                                        {booking.status}
                                                    </span>
                                                </div>
                                                <h3 className="text-xl font-bold">{booking.car.make} {booking.car.model}</h3>
                                                <div className="mt-4 flex flex-wrap gap-4 text-slate-400">
                                                    <div className="flex items-center gap-2 text-[10px] font-medium">
                                                        <Calendar size={14} className="text-primary" /> {new Date(booking.startDate).toLocaleDateString()}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-[10px] font-medium">
                                                        <MapPin size={14} className="text-primary" /> {booking.car.location}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mt-6 flex items-center justify-between border-t border-slate-50 pt-4">
                                                <div className="text-lg font-black tracking-tight text-slate-900">
                                                    ${booking.totalPrice}
                                                </div>
                                                <Link to={`/cars/${booking.car.id}`} className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                                    Details <ChevronRight size={14} />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="rounded-[3rem] border border-dashed border-slate-200 bg-white/50 p-24 text-center">
                                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-50 text-slate-300">
                                    <Clock size={40} />
                                </div>
                                <h3 className="text-xl font-bold">No Records Found</h3>
                                <p className="mb-8 text-sm text-slate-400 font-medium">Capture your first travel story today.</p>
                                <Link to="/cars" className="btn-primary rounded-full px-12 py-5 text-[10px] font-black uppercase tracking-widest shadow-luxe">Start Exploring</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
