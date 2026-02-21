import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { MapPin, Users, Fuel, Gauge, Calendar, ShieldCheck, User } from 'lucide-react';

const CarDetails = () => {
    const { id } = useParams();
    const [car, setCar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [days, setDays] = useState(1);

    useEffect(() => {
        const fetchCar = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/cars/${id}`);
                setCar(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchCar();
    }, [id]);

    if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-primary">Loading vehicle details...</div>;
    if (!car) return <div className="min-h-screen flex items-center justify-center font-bold text-danger text-xl">Vehicle not found</div>;

    const totalPrice = car.pricePerDay * days;

    return (
        <div className="min-h-screen bg-white text-gray-900 pb-20">

            {/* Image Gallery Placeholder */}
            <div className="container py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[400px] md:h-[500px]">
                    <div className="md:col-span-2 rounded-2xl overflow-hidden shadow-lg border border-gray-100">
                        <img
                            src={car.images[0] || "https://images.unsplash.com/photo-1549317336-206569e8475c?auto=format&fit=crop&q=80&w=1000"}
                            alt={car.model}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="hidden md:flex flex-col gap-6">
                        <div className="flex-1 rounded-2xl overflow-hidden shadow-md border border-gray-100">
                            <img
                                src={car.images[1] || "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1000"}
                                alt="interior"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="flex-1 rounded-2xl overflow-hidden shadow-md border border-gray-100">
                            <img
                                src={car.images[2] || "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=1000"}
                                alt="side"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="container lg:flex gap-12">
                {/* Left Side: Vehicle Info */}
                <div className="lg:flex-1">
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="bg-blue-100 text-primary px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest">{car.type}</span>
                            <div className="flex items-center gap-1 text-gray-500 text-sm">
                                <MapPin size={16} /> {car.location}
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black mb-4">{car.make} {car.model} {car.year}</h1>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <img src={car.owner.avatarUrl || "https://ui-avatars.com/api/?name=" + car.owner.fullName} alt="owner" className="w-10 h-10 rounded-full border-2 border-primary" />
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-bold tracking-tight">Owned by</p>
                                    <p className="text-sm font-bold">{car.owner.fullName}</p>
                                </div>
                            </div>
                            <div className="h-8 w-px bg-gray-200"></div>
                            <div className="flex items-center gap-1 text-orange-500 font-bold">
                                <span>★ 4.9</span>
                                <span className="text-gray-400 font-normal text-xs">(24 reviews)</span>
                            </div>
                        </div>
                    </div>

                    {/* Specs Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                        {[
                            { icon: <Users size={20} />, label: "Seats", val: car.seats },
                            { icon: <Gauge size={20} />, label: "Grid", val: car.transmission },
                            { icon: <Fuel size={20} />, label: "Fuel", val: car.fuelType },
                            { icon: <Calendar size={20} />, label: "Year", val: car.year }
                        ].map((spec, i) => (
                            <div key={i} className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-center gap-3">
                                <div className="text-primary">{spec.icon}</div>
                                <div>
                                    <p className="text-[10px] text-gray-500 uppercase font-black">{spec.label}</p>
                                    <p className="text-sm font-bold">{spec.val}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mb-12">
                        <h2 className="text-2xl font-black mb-4">Description</h2>
                        <p className="text-gray-600 leading-relaxed max-w-2xl">
                            {car.description || "No description provided for this vehicle. Experience the perfect blend of performance and luxury with this " + car.make + " " + car.model + ". Meticulously maintained and ready for your next adventure."}
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-black mb-6">What this car offers</h2>
                        <div className="grid grid-cols-2 gap-y-4 max-w-md">
                            {["Bluetooth", "Backup Camera", "Sunroof", "USB Port", "Apple CarPlay", "Heated Seats"].map(feature => (
                                <div key={feature} className="flex items-center gap-3 text-gray-700 font-medium">
                                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                                    {feature}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Side: Booking Widget */}
                <div className="w-full lg:w-[400px] mt-12 lg:mt-0">
                    <div className="bg-white p-8 rounded-3xl shadow-2xl border border-gray-100 sticky top-24">
                        <div className="flex justify-between items-end mb-8">
                            <div>
                                <p className="text-3xl font-black text-primary">${car.pricePerDay}</p>
                                <p className="text-gray-500 text-sm">Price per day</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-400 line-through font-bold">$120</p>
                                <p className="text-xs text-green-600 font-black">Early Bird Discount</p>
                            </div>
                        </div>

                        <div className="space-y-4 mb-8">
                            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <label className="text-[10px] text-gray-500 uppercase font-black mb-1 block">Rental Duration</label>
                                <div className="flex items-center justify-between">
                                    <button
                                        className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center font-bold hover:bg-gray-100 transition-colors"
                                        onClick={() => setDays(Math.max(1, days - 1))}
                                    >-</button>
                                    <span className="text-xl font-bold">{days} {days === 1 ? 'Day' : 'Days'}</span>
                                    <button
                                        className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center font-bold hover:bg-gray-100 transition-colors"
                                        onClick={() => setDays(days + 1)}
                                    >+</button>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3 mb-8">
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>${car.pricePerDay} x {days} days</span>
                                <span className="font-bold">${totalPrice}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Insurance fee</span>
                                <span className="font-bold text-green-600">FREE</span>
                            </div>
                            <div className="h-px bg-gray-100 my-4"></div>
                            <div className="flex justify-between text-xl font-black text-gray-900">
                                <span>Total Price</span>
                                <span className="text-primary">${totalPrice}</span>
                            </div>
                        </div>

                        <Link to={`/booking/${car.id}?days=${days}`} className="block">
                            <button className="btn btn-primary w-full py-4 text-lg mb-4">
                                Reserve This Car
                            </button>
                        </Link>
                        <p className="text-center text-xs text-gray-400 font-medium">You won't be charged yet</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CarDetails;
