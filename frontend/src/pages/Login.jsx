import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Mail, Lock, ArrowRight, User } from 'lucide-react';

const Login = () => {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || "/";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const user = await login(identifier, password);
            if (user.role === 'OWNER') navigate('/owner/dashboard');
            else if (user.role === 'ADMIN') navigate('/admin/dashboard');
            else navigate(from, { replace: true });
        } catch (err) {
            setError(err.response?.data?.message || 'Authentication failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-secondary selection:bg-primary selection:text-white">
            {/* Split Screen Layout */}
            <div className="hidden lg:flex w-1/2 bg-primary relative items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&q=80&w=2000"
                        className="w-full h-full object-cover opacity-20 grayscale"
                        alt="Aesthetic Background"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary via-primary/80 to-transparent"></div>
                </div>

                <div className="relative z-10 max-w-sm space-y-12 px-12 text-center lg:text-left">
                    <Link to="/" className="inline-flex items-center gap-4 group">
                        <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center text-primary transition-transform group-hover:rotate-[360deg] duration-700">
                            <Shield size={22} />
                        </div>
                        <span className="text-xl font-light text-white uppercase tracking-[0.4em] font-serif italic">Registry</span>
                    </Link>

                    <h1 className="text-6xl font-light text-white leading-[1.1] tracking-tighter">
                        Excellence <br />
                        <span className="italic font-serif text-slate-400">redefined.</span>
                    </h1>

                    <p className="text-lg text-slate-400 font-medium leading-relaxed">
                        Access Ethiopia's most exclusive collection of peer-to-peer vehicles.
                    </p>
                </div>
            </div>

            <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 md:p-16 lg:p-32 bg-secondary">
                <div className="max-w-md mx-auto w-full space-y-16">
                    <div className="space-y-4">
                        <h2 className="text-[10px] font-bold uppercase tracking-[0.5em] text-slate-300">Authentication</h2>
                        <h3 className="text-5xl font-light tracking-tight italic font-serif">Welcome Back</h3>
                    </div>

                    {error && (
                        <div className="bg-white border border-red-50 text-red-800 p-6 rounded-3xl flex items-center gap-4 animate-in fade-in slide-in-from-top-4 shadow-premium">
                            <p className="text-xs font-bold uppercase tracking-widest">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black tracking-[0.3em] text-slate-400 uppercase ml-2">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={18} />
                                <input
                                    type="text"
                                    className="w-full bg-white border border-slate-50 focus:border-primary/20 rounded-[2rem] py-5 pl-16 pr-8 outline-none transition-all font-medium text-sm placeholder:text-slate-200"
                                    placeholder="your@address.com"
                                    required
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center px-2">
                                <label className="text-[10px] font-black tracking-[0.3em] text-slate-400 uppercase">Access Key</label>
                                <Link to="#" className="text-[8px] font-black tracking-widest text-slate-300 uppercase hover:text-primary transition-colors">Recovery</Link>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={18} />
                                <input
                                    type="password"
                                    className="w-full bg-white border border-slate-50 focus:border-primary/20 rounded-[2rem] py-5 pl-16 pr-8 outline-none transition-all font-medium text-sm placeholder:text-slate-200"
                                    placeholder="••••••••"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-6 rounded-[2rem] btn-primary transition-all duration-700 shadow-luxe flex items-center justify-center gap-4 group mt-12 overflow-hidden relative"
                        >
                            <span className="relative z-10">{isLoading ? 'Validating...' : 'Enter Registry'}</span>
                            <ArrowRight size={16} className="relative z-10 transition-transform group-hover:translate-x-2" />
                        </button>
                    </form>

                    <p className="text-center">
                        <span className="text-xs font-medium text-slate-400">First time?</span> <Link to="/register" className="text-[10px] font-black text-primary uppercase tracking-[0.2em] ml-2 hover:underline">Apply for membership</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
