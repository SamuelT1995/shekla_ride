import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import FileUpload from '../components/common/FileUpload';
import { Car, Shield, ImagePlus, Info, CheckCircle } from 'lucide-react';

const CarForm = () => {
    const [formData, setFormData] = useState({
        make: '',
        model: '',
        year: new Date().getFullYear(),
        type: 'SEDAN',
        transmission: 'AUTOMATIC',
        fuelType: 'PETROL',
        seats: 4,
        pricePerDay: '',
        location: '',
        description: '',
        images: []
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: name === 'year' || name === 'seats' || name === 'pricePerDay' ? parseFloat(value) : value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/cars', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            navigate('/owner/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to list car');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">

            <div className="container max-w-3xl py-12">
                <div className="mb-10 text-center">
                    <h1 className="text-4xl font-black text-gray-900 mb-2">List Your Vehicle</h1>
                    <p className="text-gray-500 font-medium">Turn your car into a source of income today.</p>
                </div>

                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="bg-primary p-8 text-white flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold">Vehicle Details</h2>
                            <p className="text-blue-200 text-sm">Provide accurate information for better approval odds.</p>
                        </div>
                        <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                            <Car size={24} />
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-8">
                        {error && (
                            <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 flex items-center gap-3">
                                <Shield size={18} /> {error}
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="form-group">
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Make</label>
                                <input name="make" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-gray-300" placeholder="e.g. Tesla" required value={formData.make} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Model</label>
                                <input name="model" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-gray-300" placeholder="e.g. Model 3" required value={formData.model} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Year</label>
                                <input name="year" type="number" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary outline-none transition-all" required value={formData.year} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Type</label>
                                <select name="type" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary outline-none transition-all bg-white" value={formData.type} onChange={handleChange}>
                                    <option value="SEDAN">Sedan</option>
                                    <option value="SUV">SUV</option>
                                    <option value="TRUCK">Truck</option>
                                    <option value="VAN">Van</option>
                                    <option value="LUXURY">Luxury</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="form-group">
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Transmission</label>
                                <select name="transmission" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary outline-none transition-all bg-white" value={formData.transmission} onChange={handleChange}>
                                    <option value="AUTOMATIC">Automatic</option>
                                    <option value="MANUAL">Manual</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Fuel</label>
                                <select name="fuelType" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary outline-none transition-all bg-white" value={formData.fuelType} onChange={handleChange}>
                                    <option value="PETROL">Petrol</option>
                                    <option value="DIESEL">Diesel</option>
                                    <option value="ELECTRIC">Electric</option>
                                    <option value="HYBRID">Hybrid</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Seats</label>
                                <input name="seats" type="number" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary outline-none transition-all" required value={formData.seats} onChange={handleChange} />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                            <div className="form-group">
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Price Per Day ($)</label>
                                <input name="pricePerDay" type="number" className="w-full px-4 py-3 rounded-xl border border-gray-200 font-bold text-primary focus:ring-2 focus:ring-primary outline-none transition-all" placeholder="50" required value={formData.pricePerDay} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Location</label>
                                <input name="location" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary outline-none transition-all" placeholder="Addis Ababa, Bole" required value={formData.location} onChange={handleChange} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <FileUpload
                                label="Vehicle Images"
                                maxFiles={5}
                                onFileSelect={(files) => setFormData({ ...formData, images: files.map(f => f.name) })} // Mocking filenames for now
                                helperText="Upload up to 5 high-quality images of your vehicle"
                            />
                        </div>

                        <div className="form-group border-t border-gray-100 pt-8">
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Detailed Description</label>
                            <textarea name="description" rows="4" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-gray-300 font-medium" placeholder="Tell us about your car's features, mileage, and rules..." value={formData.description} onChange={handleChange}></textarea>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-primary text-white py-5 text-xl font-black rounded-2xl hover:bg-primary-dark transition-all shadow-xl shadow-blue-500/20 disabled:opacity-50"
                        >
                            {isLoading ? 'Processing Listing...' : 'List Your Vehicle Now'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CarForm;
