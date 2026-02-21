import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Car, Calendar, Clock, CreditCard, Plus, Shield, Trash2, User, Check } from 'lucide-react';

const OwnerDashboard = () => {
    const [cars, setCars] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('cars');

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

    if (loading) return <div className="min-h-screen flex items-center justify-center font-black text-primary">Loading your operations...</div>;

    const stats = [
        { label: 'Total Fleet', val: cars.length, icon: <Car className="text-blue-600" />, bg: 'bg-blue-50' },
        { label: 'Active Bookings', val: bookings.filter(b => b.status === 'CONFIRMED' || b.status === 'APPROVED').length, icon: <Calendar className="text-green-600" />, bg: 'bg-green-50' },
        { label: 'Pending Requests', val: bookings.filter(b => b.status === 'PENDING').length, icon: <Clock className="text-orange-600" />, bg: 'bg-orange-50' },
        { label: 'Total Earnings', val: `$${bookings.filter(b => b.status === 'CONFIRMED').reduce((acc, b) => acc + b.totalPrice, 0)}`, icon: <CreditCard className="text-indigo-600" />, bg: 'bg-indigo-50' }
    ];

    return (
        <div className="min-h-screen bg-gray-50 pb-20">

            <div className="container py-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 mb-2">Owner Console</h1>
                        <p className="text-gray-500 font-medium">Manage your fleet and maximize your earnings.</p>
                    </div>
                    <Link to="/cars/add" className="btn btn-primary py-4 px-8 flex items-center gap-2 group">
                        <Plus size={20} className="group-hover:rotate-90 transition-transform" /> List New Vehicle
                    </Link>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {stats.map((stat, i) => (
                        <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-6">
                            <div className={`w-14 h-14 ${stat.bg} rounded-2xl flex items-center justify-center`}>
                                {stat.icon}
                            </div>
                            <div>
                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                                <p className="text-2xl font-black text-gray-900">{stat.val}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="flex border-b border-gray-100 p-2 gap-2">
                        <button
                            onClick={() => setActiveTab('cars')}
                            className={`flex-1 py-4 text-sm font-black rounded-2xl transition-all ${activeTab === 'cars' ? 'bg-primary text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                            Vehicle Fleet ({cars.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('bookings')}
                            className={`flex-1 py-4 text-sm font-black rounded-2xl transition-all ${activeTab === 'bookings' ? 'bg-primary text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                            Guest Bookings ({bookings.length})
                        </button>
                    </div>

                    <div className="p-4 md:p-8">
                        {activeTab === 'cars' && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {cars.length === 0 ? (
                                    <div className="lg:col-span-2 py-20 text-center">
                                        <p className="text-gray-400 font-bold mb-4 italic">No vehicles listed yet</p>
                                        <Link to="/cars/add" className="text-primary font-black hover:underline">Click here to add your first car</Link>
                                    </div>
                                ) : (
                                    cars.map(car => (
                                        <div key={car.id} className="flex gap-6 p-4 rounded-2xl border border-gray-100 hover:border-primary/30 transition-colors group">
                                            <div className="w-32 h-32 rounded-xl overflow-hidden shadow-inner flex-shrink-0 relative">
                                                <img src={car.images[0] || "https://images.unsplash.com/photo-1549317336-206569e8475c?auto=format&fit=crop&q=80&w=500"} className="w-full h-full object-cover" alt={car.model} />
                                                <div className={`absolute bottom-2 right-2 w-3 h-3 rounded-full border-2 border-white ${car.isVerified ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                                            </div>
                                            <div className="flex-1 flex flex-col justify-between">
                                                <div>
                                                    <h3 className="font-black text-gray-900 group-hover:text-primary transition-colors">{car.make} {car.model}</h3>
                                                    <p className="text-xs text-gray-500">{car.year} • {car.location}</p>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm font-black text-primary">${car.pricePerDay}/day</span>
                                                    <div className="flex gap-2">
                                                        <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors"><Shield size={18} /></button>
                                                        <button className="p-2 text-gray-400 hover:text-red-600 transition-colors"><Trash2 size={18} /></button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}

                        {activeTab === 'bookings' && (
                            <div className="space-y-4">
                                {bookings.length === 0 ? (
                                    <div className="py-20 text-center text-gray-400 font-bold italic">No bookings received yet</div>
                                ) : (
                                    bookings.map(booking => (
                                        <div key={booking.id} className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm border border-gray-100">
                                                    <User size={24} />
                                                </div>
                                                <div>
                                                    <h4 className="font-black text-gray-900">{booking.renter.fullName}</h4>
                                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Wants to rent your <span className="text-primary">{booking.car.model}</span></p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-8">
                                                <div className="hidden lg:block">
                                                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Duration</p>
                                                    <p className="text-xs font-bold text-gray-700">{new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Status</p>
                                                    <span className={`text-[10px] font-black px-3 py-1 rounded-full border uppercase tracking-wider ${booking.status === 'PENDING' ? 'bg-yellow-50 text-yellow-600 border-yellow-100' :
                                                        booking.status === 'APPROVED' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                                            booking.status === 'CONFIRMED' ? 'bg-green-50 text-green-600 border-green-100' :
                                                                'bg-gray-50 text-gray-600 border-gray-100'
                                                        }`}>
                                                        {booking.status}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex gap-2 w-full md:w-auto">
                                                {booking.status === 'PENDING' ? (
                                                    <>
                                                        <button onClick={() => handleBookingAction(booking.id, 'approve')} className="flex-1 md:flex-none bg-green-600 text-white px-6 py-3 rounded-xl font-black text-xs hover:bg-green-700 transition-colors shadow-lg shadow-green-900/10 flex items-center justify-center gap-2">
                                                            <Check size={16} /> Approve
                                                        </button>
                                                        <button onClick={() => handleBookingAction(booking.id, 'cancel')} className="flex-1 md:flex-none border border-red-200 text-red-600 px-6 py-3 rounded-xl font-black text-xs hover:bg-red-50 transition-colors flex items-center justify-center gap-2">
                                                            Reject
                                                        </button>
                                                    </>
                                                ) : (
                                                    <button className="w-full md:w-auto text-xs font-bold text-gray-400 bg-gray-100 px-6 py-3 rounded-xl cursor-default">
                                                        No Actions Available
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OwnerDashboard;
