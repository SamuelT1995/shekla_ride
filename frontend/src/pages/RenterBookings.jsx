import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Calendar, MapPin, Clock } from 'lucide-react';

const RenterBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/api/bookings/renter', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setBookings(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'APPROVED': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'CONFIRMED': return 'bg-green-100 text-green-700 border-green-200';
            case 'CANCELLED': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center font-black text-primary">Loading your journeys...</div>;

    return (
        <div className="min-h-screen bg-gray-50 pb-20">

            <div className="container py-12">
                <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 mb-2">My Bookings</h1>
                        <p className="text-gray-500 font-medium">Manage your car rentals and track their status.</p>
                    </div>
                </div>

                {bookings.length === 0 ? (
                    <div className="bg-white p-20 rounded-3xl shadow-sm border border-gray-100 text-center">
                        <div className="w-20 h-20 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Clock size={40} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No bookings yet</h3>
                        <p className="text-gray-500 mb-8">Ready to hit the road? Explore our premium fleet.</p>
                        <Link to="/cars" className="btn btn-primary inline-block">
                            Browse Cars
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {bookings.map(booking => (
                            <div key={booking.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row group hover:border-primary transition-all duration-300">
                                <div className="md:w-64 h-48 md:h-auto relative overflow-hidden">
                                    <img
                                        src={booking.car.images[0] || "https://images.unsplash.com/photo-1549317336-206569e8475c?auto=format&fit=crop&q=80&w=1000"}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        alt={booking.car.model}
                                    />
                                    <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-black border uppercase tracking-wider shadow-sm ${getStatusColor(booking.status)}`}>
                                        {booking.status}
                                    </div>
                                </div>
                                <div className="flex-1 p-6 md:p-8 flex flex-col md:flex-row justify-between gap-8">
                                    <div>
                                        <div className="text-xs font-black text-primary uppercase tracking-widest mb-1">{booking.car.type}</div>
                                        <h3 className="text-2xl font-black text-gray-900 mb-4">{booking.car.make} {booking.car.model}</h3>

                                        <div className="flex flex-wrap gap-x-8 gap-y-3">
                                            <div className="flex items-center gap-2 text-gray-500">
                                                <Calendar size={16} className="text-primary" />
                                                <span className="text-sm">
                                                    {new Date(booking.startDate).toLocaleDateString()} — {new Date(booking.endDate).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-500">
                                                <MapPin size={16} className="text-primary" />
                                                <span className="text-sm font-medium">{booking.car.location}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-500">
                                                <User size={16} className="text-primary" />
                                                <span className="text-sm font-bold text-gray-700">Owner: {booking.car.owner.fullName}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="md:text-right flex flex-col justify-between items-end border-t md:border-t-0 pt-6 md:pt-0">
                                        <div>
                                            <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Total Price</div>
                                            <div className="text-2xl font-black text-primary">${booking.totalPrice}</div>
                                        </div>

                                        {booking.status === 'APPROVED' && (
                                            <button className="btn btn-primary bg-green-600 hover:bg-green-700 shadow-green-900/10 py-3 text-sm flex items-center gap-2">
                                                <CreditCard size={18} /> Pay Deposit Now
                                            </button>
                                        )}
                                        {booking.status === 'PENDING' && (
                                            <div className="text-xs text-yellow-600 font-bold bg-yellow-50 px-4 py-2 rounded-lg border border-yellow-100">
                                                Awaiting owner approval
                                            </div>
                                        )}
                                        {booking.status === 'CONFIRMED' && (
                                            <div className="text-xs text-green-600 font-black flex items-center gap-1">
                                                <CheckCircle size={16} /> Booking Secured
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RenterBookings;
