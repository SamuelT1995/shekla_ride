import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Mail, Lock, User, Phone, ArrowRight } from 'lucide-react';
import FileUpload from '../components/common/FileUpload';

const Register = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        phoneNumber: '',
        email: '',
        password: '',
        role: 'USER',
        licenseFront: null,
        licenseBack: null,
        vehicleImages: [],
        ownershipDocs: null
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const user = await register(formData);
            if (user.role === 'OWNER') navigate('/owner/dashboard');
            else if (user.role === 'ADMIN') navigate('/admin/dashboard');
            else navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-secondary selection:bg-primary selection:text-white">
            <div className="hidden lg:flex w-1/3 bg-primary relative items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1549317336-206569e8475c?auto=format&fit=crop&q=80&w=2000"
                        className="w-full h-full object-cover opacity-20"
                        alt="Luxury Detail"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-primary via-primary/95 to-transparent"></div>
                </div>

                <div className="relative z-10 p-12 space-y-12">
                    <Link to="/" className="inline-flex items-center gap-4 group">
                        <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center text-primary transition-transform group-hover:rotate-[360deg] duration-700">
                            <Shield size={22} />
                        </div>
                        <span className="text-xl font-light text-white uppercase tracking-[0.4em] font-serif italic">Join Us</span>
                    </Link>

                    <h1 className="text-6xl font-light text-white leading-tight tracking-tighter">
                        Become part of the <br />
                        <span className="italic font-serif text-slate-400">extraordinary.</span>
                    </h1>

                    <p className="text-lg text-slate-400 font-medium leading-relaxed">
                        Ethopia's premier gateway to exclusive vehicle ownership and travel experiences.
                    </p>
                </div>
            </div>

            <div className="w-full lg:w-2/3 flex flex-col justify-center p-8 md:p-16 lg:p-32 bg-secondary overflow-y-auto">
                <div className="max-w-2xl mx-auto w-full space-y-16">
                    <div className="space-y-4">
                        <h2 className="text-[10px] font-bold uppercase tracking-[0.5em] text-slate-300">Application</h2>
                        <h3 className="text-5xl font-light tracking-tight italic font-serif">Create Account</h3>
                    </div>

                    {error && (
                        <div className="bg-white border border-red-50 text-red-800 p-6 rounded-3xl flex items-center gap-4 animate-in fade-in slide-in-from-top-4 shadow-premium">
                            <p className="text-xs font-bold uppercase tracking-widest">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-12">
                        {/* Basic Info */}
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black tracking-[0.3em] text-slate-400 uppercase ml-2">Full Name</label>
                                <div className="relative group">
                                    <User className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={18} />
                                    <input
                                        name="fullName"
                                        className="w-full bg-white border border-slate-50 focus:border-primary/20 rounded-2xl py-5 pl-16 pr-8 outline-none transition-all font-medium text-sm"
                                        placeholder="Abebe Bikila"
                                        required
                                        value={formData.fullName}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black tracking-[0.3em] text-slate-400 uppercase ml-2">Email Address</label>
                                <div className="relative group">
                                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={18} />
                                    <input
                                        name="email"
                                        type="email"
                                        className="w-full bg-white border border-slate-50 focus:border-primary/20 rounded-2xl py-5 pl-16 pr-8 outline-none transition-all font-medium text-sm"
                                        placeholder="user@example.com"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black tracking-[0.3em] text-slate-400 uppercase ml-2">Phone Number</label>
                                <div className="relative group">
                                    <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={18} />
                                    <input
                                        name="phoneNumber"
                                        className="w-full bg-white border border-slate-50 focus:border-primary/20 rounded-2xl py-5 pl-16 pr-8 outline-none transition-all font-medium text-sm"
                                        placeholder="+251..."
                                        required
                                        value={formData.phoneNumber}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black tracking-[0.3em] text-slate-400 uppercase ml-2">Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={18} />
                                    <input
                                        name="password"
                                        type="password"
                                        className="w-full bg-white border border-slate-50 focus:border-primary/20 rounded-2xl py-5 pl-16 pr-8 outline-none transition-all font-medium text-sm"
                                        placeholder="••••••••"
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Account Intent */}
                        <div className="space-y-6">
                            <label className="text-[10px] font-black tracking-[0.3em] text-slate-400 uppercase ml-2">Application Intent</label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: 'USER' })}
                                    className={`py-6 rounded-2xl font-bold uppercase tracking-[0.2em] text-[10px] transition-all border ${formData.role === 'USER' ? 'border-primary bg-primary text-secondary shadow-luxe' : 'border-slate-100 bg-white text-slate-300 hover:border-slate-200'}`}
                                >
                                    Renter / Guest
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: 'OWNER' })}
                                    className={`py-6 rounded-2xl font-bold uppercase tracking-[0.2em] text-[10px] transition-all border ${formData.role === 'OWNER' ? 'border-primary bg-primary text-secondary shadow-luxe' : 'border-slate-100 bg-white text-slate-300 hover:border-slate-200'}`}
                                >
                                    Car Owner / Host
                                </button>
                            </div>
                        </div>

                        {/* Verification Section */}
                        <div className="space-y-12 pt-12 border-t border-slate-50">
                            {/* Identity - All Roles */}
                            <div className="space-y-8">
                                <div className="space-y-2 text-center">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Driver Verification</h4>
                                    <p className="text-xs text-slate-400 font-medium">To maintain the integrity of our network, we require a scan of your Driver's Credentials.</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <FileUpload
                                        label="Credential Front"
                                        maxFiles={1}
                                        onFileSelect={(files) => setFormData({ ...formData, licenseFront: files[0] })}
                                        helperText="Passport or Driver's License"
                                    />
                                    <FileUpload
                                        label="Credential Back"
                                        maxFiles={1}
                                        onFileSelect={(files) => setFormData({ ...formData, licenseBack: files[0] })}
                                        helperText="Address and Category proof"
                                    />
                                </div>
                            </div>

                            {/* Vehicle Details - Owners Only */}
                            {formData.role === 'OWNER' && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-700">
                                    <div className="space-y-2 text-center">
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Vehicle Registry</h4>
                                        <p className="text-xs text-slate-400 font-medium">As a prospective Host, please provide a preview of your flagship asset and proof of registry.</p>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <FileUpload
                                            label="Asset Gallery"
                                            maxFiles={5}
                                            onFileSelect={(files) => setFormData({ ...formData, vehicleImages: files })}
                                            helperText="Up to 5 high-resolution images of your vehicle"
                                        />
                                        <FileUpload
                                            label="Ownership Documentation"
                                            maxFiles={1}
                                            onFileSelect={(files) => setFormData({ ...formData, ownershipDocs: files[0] })}
                                            helperText="Registration, Insurance, or Title"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-6 rounded-full btn-primary transition-all duration-700 shadow-luxe flex items-center justify-center gap-4 group mt-12 overflow-hidden relative"
                        >
                            {isLoading ? 'Processing Application...' : (
                                <>
                                    <span>Create Account</span>
                                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-2" />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="text-center">
                        <span className="text-xs font-medium text-slate-400">Existing Member?</span> <Link to="/login" className="text-[10px] font-black text-primary uppercase tracking-[0.2em] ml-2 hover:underline">Secure Login</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
