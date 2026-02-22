import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Shield, User, LogOut, Menu, X } from 'lucide-react';

const Navbar = () => {
    const { user, authenticated, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isTransparent = location.pathname === '/';

    return (
        <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-700 ${isScrolled ? 'bg-secondary/80 backdrop-blur-xl py-4 shadow-premium' : 'bg-transparent py-8'}`}>
            <div className="container flex justify-between items-center">
                {/* Brand */}
                <Link to="/" className="flex items-center gap-4 group no-underline">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-700 ${isScrolled ? 'bg-primary text-secondary' : 'bg-white/10 backdrop-blur-md text-white border border-white/10'}`}>
                        <Shield size={22} className="group-hover:rotate-[360deg] transition-transform duration-700" />
                    </div>
                    <span className={`text-xl font-light uppercase tracking-[0.3em] font-serif italic transition-colors duration-700 ${isScrolled ? 'text-primary' : 'text-white'}`}>
                        Shekla Ride
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-12">
                    <Link to="/cars" className={`text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-700 hover:opacity-100 no-underline ${isScrolled ? 'text-primary' : 'text-white/80 hover:text-white'}`}>
                        Browse Vehicles
                    </Link>

                    {authenticated ? (
                        <div className="flex items-center gap-8">
                            <Link
                                to={user.role === 'ADMIN' ? '/admin/dashboard' : (user.role === 'OWNER' ? '/owner/dashboard' : '/dashboard')}
                                className={`text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-2 no-underline ${isScrolled ? 'text-primary' : 'text-white'}`}
                            >
                                <User size={16} />
                                Dashboard
                            </Link>
                            <button
                                onClick={handleLogout}
                                className={`text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-2 cursor-pointer transition-colors ${isScrolled ? 'text-primary/60 hover:text-primary' : 'text-white/60 hover:text-white'}`}
                            >
                                <LogOut size={16} />
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-8">
                            <Link to="/login" className={`text-[10px] font-bold uppercase tracking-[0.2em] no-underline transition-colors ${isScrolled ? 'text-primary' : 'text-white'}`}>
                                Login
                            </Link>
                            <Link to="/register" className={`btn px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${isScrolled ? 'bg-primary text-secondary shadow-luxe' : 'bg-white text-primary'}`}>
                                Join
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className={`md:hidden p-2 transition-colors ${isScrolled ? 'text-primary' : 'text-white'}`}
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <div className={`fixed inset-0 bg-primary/95 backdrop-blur-2xl z-[90] transition-all duration-700 md:hidden flex flex-col items-center justify-center space-y-12 ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                <Link to="/cars" onClick={() => setIsMobileMenuOpen(false)} className="text-3xl font-light text-white italic font-serif">Browse Vehicles</Link>
                {authenticated ? (
                    <>
                        <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="text-3xl font-light text-white italic font-serif">Dashboard</Link>
                        <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="text-xl font-bold uppercase tracking-widest text-slate-400">Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-3xl font-light text-white italic font-serif">Login</Link>
                        <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="bg-white text-primary px-12 py-6 rounded-full font-black uppercase tracking-widest text-xs">Join Now</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
