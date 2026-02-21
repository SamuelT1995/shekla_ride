import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import { Check, FileText, Clock, Calendar, Shield } from 'lucide-react';

const BookingFlow = () => {
    const { carId } = useParams();
    const loc = useLocation();
    const queryParams = new URLSearchParams(loc.search);
    const initialDays = parseInt(queryParams.get('days')) || 1;

    const [step, setStep] = useState(1);
    const [car, setCar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [bookingData, setBookingData] = useState({
        startDate: '',
        endDate: '',
        days: initialDays
    });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCar = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/cars/${carId}`);
                setCar(res.data);
            } catch (err) {
                console.error(err);
                setError('Failed to load car details');
            } finally {
                setLoading(false);
            }
        };
        fetchCar();
    }, [carId]);

    const handleDateChange = (e) => {
        setBookingData({ ...bookingData, [e.target.name]: e.target.value });
    };

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setError('');
        try {
            const token = localStorage.getItem('token');
            const totalPrice = car.pricePerDay * bookingData.days;
            await axios.post('http://localhost:5000/api/bookings', {
                carId,
                startDate: bookingData.startDate,
                endDate: bookingData.endDate,
                totalPrice: totalPrice,
                totalDays: bookingData.days
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            nextStep(); // Move to confirmation step
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create booking');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-primary">Loading journey details...</div>;
    if (!car) return <div className="min-h-screen flex items-center justify-center font-bold text-danger text-xl">Vehicle not found</div>;

    const totalPrice = car.pricePerDay * bookingData.days;

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 pb-20">

            <div className="container max-w-4xl py-12">
                {/* Progress Bar */}
                <div className="mb-12">
                    <div className="flex justify-between items-center mb-4">
                        {['Dates', 'Agreement', 'Done'].map((label, i) => (
                            <div key={i} className="flex flex-col items-center flex-1 relative">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold relative z-10 ${step > i + 1 ? 'bg-green-500 text-white' : (step === i + 1 ? 'bg-primary text-white shadow-lg shadow-blue-500/30' : 'bg-gray-200 text-gray-500')}`}>
                                    {step > i + 1 ? <Check size={20} /> : i + 1}
                                </div>
                                <span className={`text-xs mt-2 font-bold uppercase tracking-widest ${step === i + 1 ? 'text-primary' : 'text-gray-400'}`}>{label}</span>
                                {i < 2 && (
                                    <div className={`absolute top-5 left-1/2 w-full h-1 -translate-y-1/2 z-0 ${step > i + 1 ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="lg:grid lg:grid-cols-3 gap-8">
                    {/* Left: Main Content */}
                    <div className="lg:col-span-2">
                        {step === 1 && (
                            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                                <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
                                    <Calendar className="text-primary" /> Select Dates
                                </h2>
                                {error && <div className="p-4 bg-red-50 text-red-600 rounded-xl mb-6 text-sm flex items-center gap-2"><Shield size={16} />{error}</div>}

                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="form-group">
                                            <label className="text-xs uppercase font-black text-gray-500 mb-2 block">Pickup Date</label>
                                            <input
                                                type="date"
                                                name="startDate"
                                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-primary focus:border-primary transition-all text-gray-900"
                                                value={bookingData.startDate}
                                                onChange={handleDateChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="text-xs uppercase font-black text-gray-500 mb-2 block">Return Date</label>
                                            <input
                                                type="date"
                                                name="endDate"
                                                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-primary focus:border-primary transition-all text-gray-900"
                                                value={bookingData.endDate}
                                                onChange={handleDateChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100 flex items-start gap-4">
                                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm flex-shrink-0">
                                            <Clock size={20} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">Estimated Duration</p>
                                            <p className="text-xs text-gray-500">Pick-up and drop-off at the same location default.</p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={nextStep}
                                        disabled={!bookingData.startDate || !bookingData.endDate}
                                        className="w-full bg-primary text-white py-4 text-lg font-black rounded-xl hover:bg-primary-dark transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-4 shadow-xl shadow-blue-900/10"
                                    >
                                        Continue to Agreement
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                                <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
                                    <FileText className="text-primary" /> Digital Rental Agreement
                                </h2>

                                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 h-96 overflow-y-auto mb-8 text-sm text-gray-600 leading-relaxed scrollbar-hide">
                                    <h3 className="font-bold text-gray-900 mb-4 text-center text-lg">SHEKLA RIDE RENTAL TERMS</h3>
                                    <p className="mb-4">1. <strong>Vehicle Condition:</strong> The Renter acknowledges receiving the vehicle in excellent condition and agrees to return it in the same state.</p>
                                    <p className="mb-4">2. <strong>Insurance:</strong> The vehicle is covered by comprehensive insurance. A deductible may apply in case of fault-based damage.</p>
                                    <p className="mb-4">3. <strong>Usage:</strong> The vehicle must stay within national borders and be driven only by the registered Renter.</p>
                                    <p className="mb-4">4. <strong>Late Returns:</strong> A fee of $20/hour will be charged for returns more than 2 hours late.</p>
                                    <p className="mb-4">5. <strong>Cancellations:</strong> Full refund if cancelled 48 hours before the trip starts.</p>
                                    <div className="h-px bg-gray-200 my-6"></div>
                                    <p className="italic text-gray-400 text-center">By clicking 'Confirm Booking', you agree to these legally binding terms.</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <button onClick={prevStep} className="bg-gray-100 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-200 transition-colors">
                                        Back
                                    </button>
                                    <button
                                        onClick={handleSubmit}
                                        disabled={isSubmitting}
                                        className="bg-primary text-white py-4 rounded-xl font-black shadow-xl shadow-blue-900/10 disabled:opacity-50"
                                    >
                                        {isSubmitting ? 'Processing...' : 'Accept & Confirm'}
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="bg-white p-12 rounded-3xl shadow-xl border border-gray-100 text-center">
                                <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                                    <Check size={48} />
                                </div>
                                <h2 className="text-4xl font-black mb-4">You're All Set!</h2>
                                <p className="text-gray-500 mb-10 max-w-sm mx-auto text-lg">
                                    Your booking request for the <span className="font-bold text-gray-900">{car.make} {car.model}</span> has been sent to the owner.
                                </p>

                                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 mb-10 text-left">
                                    <p className="text-xs uppercase font-black text-gray-400 mb-4 tracking-widest text-center">Next Steps</p>
                                    <div className="space-y-4">
                                        <div className="flex gap-4">
                                            <div className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center font-bold text-sm shrink-0">1</div>
                                            <p className="text-sm text-gray-600 font-medium">Wait for owner approval (usually within 2 hours).</p>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center font-bold text-sm shrink-0">2</div>
                                            <p className="text-sm text-gray-600 font-medium">Pay the security deposit securely on the platform.</p>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => navigate('/dashboard')}
                                    className="w-full bg-primary text-white py-4 text-lg font-black rounded-xl shadow-xl shadow-blue-900/10"
                                >
                                    Go to My Bookings
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Right: Summary Card (shown in steps 1 & 2) */}
                    {(step === 1 || step === 2) && (
                        <div className="mt-8 lg:mt-0">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
                                <h3 className="font-bold text-xl mb-6">Booking Summary</h3>
                                <div className="flex gap-4 mb-6">
                                    <img
                                        src={car.images[0] || "https://images.unsplash.com/photo-1549317336-206569e8475c?auto=format&fit=crop&q=80&w=1000"}
                                        className="w-20 h-20 rounded-xl object-cover shadow-sm border border-gray-50"
                                        alt="car"
                                    />
                                    <div>
                                        <h4 className="font-black text-gray-900">{car.make} {car.model}</h4>
                                        <p className="text-xs text-gray-500">{car.type} • {car.location}</p>
                                        <p className="text-sm font-black text-primary mt-1">${car.pricePerDay}/day</p>
                                    </div>
                                </div>
                                <div className="space-y-4 pt-6 border-t border-gray-100">
                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span>Subtotal</span>
                                        <span className="font-bold">${totalPrice}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span>Insurance Fee</span>
                                        <span className="font-bold text-green-600">FREE</span>
                                    </div>
                                    <div className="flex justify-between text-lg font-black text-gray-900 pt-4 border-t border-gray-100">
                                        <span>Total</span>
                                        <span className="text-primary">${totalPrice}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookingFlow;
