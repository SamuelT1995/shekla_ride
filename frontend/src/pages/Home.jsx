import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    Search, MapPin, ArrowRight, Shield, Users,
    Star, ChevronRight, Compass, ShieldCheck,
    Smartphone, Car, Gem
} from 'lucide-react';
import axios from 'axios';

const Home = () => {
    const [search, setSearch] = useState({ location: '', query: '' });
    const [featuredCars, setFeaturedCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/cars');
                setFeaturedCars(res.data.slice(0, 4));
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchFeatured();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        navigate(`/cars?location=${search.location}&query=${search.query}`);
    };

    return (
        <div className="min-h-screen bg-secondary selection:bg-primary selection:text-white">
            {/* Cinematic Hero Section */}
            <section className="relative min-h-[90vh] flex flex-col justify-center overflow-hidden">
                <div className="absolute inset-0 z-0 bg-primary">
                    <img
                        src="https://images.unsplash.com/photo-1542362567-b0523030386a?auto=format&fit=crop&q=80&w=2500"
                        alt=""
                        className="w-full h-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-primary/20 to-secondary"></div>
                </div>

                <div className="container relative z-10 pt-32 pb-12">
                    <div className="max-w-5xl space-y-12 animate-in fade-in slide-in-from-bottom-12 duration-1000">
                        <div className="inline-flex items-center gap-4 px-1 py-1 pr-6 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white/80">
                            <span className="bg-white/10 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em]">New</span>
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">The Spring Collection is here</span>
                        </div>

                        <h1 className="text-6xl md:text-8xl lg:text-9xl font-light leading-[1.1] tracking-tighter text-white">
                            The art of <br />
                            <span className="italic font-serif">moving well.</span>
                        </h1>

                        <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                            <Link to="/cars" className="btn bg-white text-primary px-10 py-5 hover:bg-secondary transition-all shadow-luxe">
                                Browse Vehicles
                            </Link>
                            <p className="max-w-xs text-sm text-white/60 font-medium leading-relaxed">
                                Ethiopia's premier peer-to-peer car sharing marketplace.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Search Widget - Integrated into Flow */}
                <div className="container relative z-10 pb-32">
                    <form onSubmit={handleSearch} className="bg-white/95 backdrop-blur-2xl p-2 rounded-3xl shadow-massive flex flex-col md:flex-row gap-2 max-w-5xl border border-white/40">
                        <div className="flex-1 flex items-center gap-4 px-6 py-4">
                            <MapPin size={20} className="text-slate-300" />
                            <div className="flex flex-col flex-1">
                                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-0.5">Pick up</label>
                                <input
                                    type="text"
                                    placeholder="Where to?"
                                    className="bg-transparent outline-none w-full text-base font-semibold tracking-tight"
                                    value={search.location}
                                    onChange={(e) => setSearch({ ...search, location: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="flex-1 flex items-center gap-4 px-6 py-4 border-l border-slate-100">
                            <Search size={20} className="text-slate-300" />
                            <div className="flex flex-col flex-1">
                                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-0.5">Preferences</label>
                                <input
                                    type="text"
                                    placeholder="Car brand?"
                                    className="bg-transparent outline-none w-full text-base font-semibold tracking-tight"
                                    value={search.query}
                                    onChange={(e) => setSearch({ ...search, query: e.target.value })}
                                />
                            </div>
                        </div>
                        <button type="submit" className="btn-primary px-12 py-4 rounded-2xl text-[11px] font-bold uppercase tracking-[0.2em]">
                            Search
                        </button>
                    </form>
                </div>
            </section>

            {/* Our Philosophy */}
            <section className="py-32 md:py-56 bg-secondary">
                <div className="container">
                    <div className="grid lg:grid-cols-2 gap-24 items-center">
                        <div className="space-y-12">
                            <div className="space-y-6">
                                <h2 className="text-[11px] font-bold uppercase tracking-[0.4em] text-slate-400">Our Philosophy</h2>
                                <h3 className="text-5xl md:text-7xl font-light tracking-tight leading-tight">
                                    Luxury is <br />
                                    <span className="italic font-serif text-slate-400">simplicity.</span>
                                </h3>
                            </div>
                            <p className="text-lg text-slate-500 font-medium leading-[1.8] max-w-lg">
                                We believe in absolute clarity. Every interaction with Shekla Ride is designed to provide a seamless and professional experience.
                            </p>
                            <div className="pt-6">
                                <Link to="/about" className="group flex items-center gap-4 text-[11px] font-bold uppercase tracking-[0.3em] text-primary">
                                    Our Story
                                    <span className="w-12 h-[1px] bg-primary group-hover:w-20 transition-all duration-500"></span>
                                </Link>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-8 mt-12">
                                <div className="aspect-[3/4] rounded-3xl overflow-hidden shadow-premium">
                                    <img src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover" alt="" />
                                </div>
                                <div className="p-10 bg-white rounded-3xl shadow-premium space-y-4">
                                    <ShieldCheck className="text-primary" size={28} />
                                    <h4 className="font-bold uppercase tracking-[0.2em] text-[10px]">Total Security</h4>
                                    <p className="text-sm text-slate-400 font-medium leading-relaxed">Verified hosts and comprehensive protection.</p>
                                </div>
                            </div>
                            <div className="space-y-8">
                                <div className="p-10 bg-primary text-secondary rounded-3xl shadow-luxe space-y-4">
                                    <Gem size={28} className="text-white/20" />
                                    <h4 className="font-bold uppercase tracking-[0.2em] text-[10px]">Premium Tier</h4>
                                    <p className="text-sm text-slate-300 font-medium leading-relaxed">Access exclusive vehicles on our platform.</p>
                                </div>
                                <div className="aspect-[3/4] rounded-3xl overflow-hidden shadow-premium">
                                    <img src="https://images.unsplash.com/photo-1549317336-206569e8475c?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover" alt="" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Collection */}
            <section className="py-32 md:py-56 bg-white rounded-t-[4rem] shadow-luxe relative z-20">
                <div className="container">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
                        <div className="space-y-4">
                            <h2 className="text-[11px] font-bold uppercase tracking-[0.4em] text-slate-300">Browse Catalog</h2>
                            <h3 className="text-5xl md:text-6xl font-light tracking-tight italic font-serif">Featured Vehicles.</h3>
                        </div>
                        <Link to="/cars" className="btn border border-slate-100 hover:border-primary transition-all rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm">
                            View All Cars
                        </Link>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="space-y-8">
                                    <div className="aspect-[4/5] bg-slate-50 animate-pulse rounded-3xl"></div>
                                    <div className="h-4 bg-slate-50 animate-pulse w-1/2 mx-auto"></div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-24">
                            {featuredCars.map(car => (
                                <Link to={`/cars/${car.id}`} key={car.id} className="group flex flex-col no-underline">
                                    <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-premium mb-8">
                                        <img
                                            src={car.images[0] || "https://images.unsplash.com/photo-1549317336-206569e8475c?auto=format&fit=crop&q=80&w=1000"}
                                            alt={car.model}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    </div>
                                    <div className="text-center space-y-2 px-4">
                                        <h4 className="text-sm font-black uppercase tracking-[0.2em] text-primary italic">{car.make} {car.model}</h4>
                                        <div className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em] flex items-center justify-center gap-3">
                                            <span className="text-primary">ETB {car.pricePerDay}</span>
                                            <span className="w-1 h-1 bg-slate-100 rounded-full"></span>
                                            <span>{car.location}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Coming Soon Section - FIXED REPOSONSIVE */}
            <section className="py-32 md:py-48 bg-secondary">
                <div className="container">
                    <div className="bg-primary rounded-[3rem] p-12 md:p-32 overflow-hidden relative shadow-luxe">
                        <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-white/5 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2"></div>

                        <div className="grid lg:grid-cols-2 gap-20 items-center relative z-10 text-center lg:text-left">
                            <div className="space-y-12">
                                <div className="space-y-6">
                                    <h2 className="text-5xl md:text-7xl font-light tracking-tighter text-white leading-[1]">
                                        Always <br />
                                        <span className="italic font-serif text-slate-400">within reach.</span>
                                    </h2>
                                    <p className="text-lg text-slate-300 font-medium leading-relaxed max-w-md mx-auto lg:mx-0">
                                        Our bespoke mobile experience is currently in final refinement to meet our standards of excellence.
                                    </p>
                                </div>

                                <div className="inline-flex items-center gap-4 px-8 py-4 rounded-full bg-white/5 border border-white/10">
                                    <div className="w-2 h-2 bg-gold rounded-full animate-pulse"></div>
                                    <span className="text-xs font-bold uppercase tracking-[0.3em] text-white/80">Coming Soon to iOS and Android</span>
                                </div>
                            </div>
                            <div className="lg:block hidden">
                                <div className="relative">
                                    <img
                                        src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=800"
                                        className="relative rounded-[3rem] shadow-massive border border-white/5"
                                        alt=""
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Host Section */}
            <section className="py-32 md:py-56 bg-white">
                <div className="container text-center space-y-16">
                    <div className="max-w-3xl mx-auto space-y-8">
                        <h2 className="text-[11px] font-bold uppercase tracking-[0.4em] text-slate-300">Our Network</h2>
                        <h3 className="text-5xl md:text-8xl font-light tracking-tighter leading-[1] italic font-serif">Earn with your car.</h3>
                        <p className="text-xl text-slate-400 font-medium leading-relaxed max-w-2xl mx-auto">
                            Join Ethiopia's premier host network and turn your vehicles into additional income.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-16 text-left pt-12 max-w-5xl mx-auto">
                        <div className="space-y-4">
                            <h4 className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                                <Star size={18} className="text-gold" /> Excellent Returns
                            </h4>
                            <p className="text-sm text-slate-500 font-medium leading-[1.8]">Earn professional rates for your vehicles.</p>
                        </div>
                        <div className="space-y-4">
                            <h4 className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                                <ShieldCheck size={18} className="text-gold" /> Full Control
                            </h4>
                            <p className="text-sm text-slate-500 font-medium leading-[1.8]">Manage your pricing and availability anytime.</p>
                        </div>
                        <div className="space-y-4">
                            <h4 className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                                <Compass size={18} className="text-gold" /> Dedicated Support
                            </h4>
                            <p className="text-sm text-slate-500 font-medium leading-[1.8]">Our support team is always here to help.</p>
                        </div>
                    </div>

                    <div className="pt-16 flex justify-center">
                        <Link to="/register" className="btn bg-primary text-white px-16 py-6 rounded-full shadow-luxe hover:scale-105 transition-all text-sm font-bold tracking-[0.2em]">
                            Apply to Host
                        </Link>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default Home;
