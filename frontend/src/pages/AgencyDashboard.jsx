import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import {
    Building2, Users, Car, Briefcase, Plus,
    BarChart3, Settings, ShieldCheck, Search,
    Download, LayoutDashboard, UserPlus, FileText,
    MoreHorizontal, Filter
} from 'lucide-react';

const AgencyDashboard = () => {
    const { user } = useAuth();
    const [agency, setAgency] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [showStaffModal, setShowStaffModal] = useState(false);
    const [staffData, setStaffData] = useState({ fullName: '', email: '', role: 'AGENCY_STAFF', password: 'Password123!' });

    useEffect(() => {
        const fetchAgencyData = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/api/agency/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setAgency(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAgencyData();
    }, []);

    const handleAddStaff = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/agency/staff', staffData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setShowStaffModal(false);
            // Refresh data
            const res = await axios.get('http://localhost:5000/api/agency/profile', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAgency(res.data);
        } catch (err) {
            alert('Failed to add staff member');
        }
    };

    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#F4F7FE]">
            <div className="w-12 h-12 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mb-6"></div>
            <p className="font-bold text-slate-400 text-xs uppercase tracking-[0.2em]">Initializing Enterprise Operations...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F4F7FE] flex">
            {/* Enterprise Sidebar */}
            <div className="w-72 bg-slate-950 text-white flex flex-col fixed h-full z-50">
                <div className="p-8 border-b border-white/10 flex items-center gap-4">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        <Building2 size={22} />
                    </div>
                    <div>
                        <h2 className="text-sm font-black uppercase tracking-widest text-white/50">Enterprise</h2>
                        <h1 className="text-lg font-black tracking-tight leading-none truncate w-40">{agency?.name || 'Loading...'}</h1>
                    </div>
                </div>

                <nav className="flex-1 p-6 space-y-2 mt-4">
                    {[
                        { id: 'overview', label: 'Agency Overview', icon: <LayoutDashboard size={18} /> },
                        { id: 'fleet', label: 'Fleet Management', icon: <Car size={18} /> },
                        { id: 'staff', label: 'Human Resources', icon: <Users size={18} /> },
                        { id: 'analytics', label: 'Business Analytics', icon: <BarChart3 size={18} /> },
                        { id: 'docs', label: 'Corporate Documents', icon: <FileText size={18} /> },
                        { id: 'settings', label: 'Agency Settings', icon: <Settings size={18} /> }
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[11px] font-bold uppercase tracking-widest transition-all ${activeTab === item.id
                                ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-900/40 translate-x-1'
                                : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            {item.icon} {item.label}
                        </button>
                    ))}
                </nav>

                <div className="p-6">
                    <div className="bg-white/5 rounded-3xl p-6 border border-white/5">
                        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4">Operations Status</p>
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                            <span className="text-xs font-bold text-white/80">Systems Active</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 ml-72 pt-8 px-12 pb-24">
                {/* Header / Stats Top Bar */}
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <h1 className="text-2xl font-black text-slate-800 tracking-tight">
                            {activeTab === 'overview' && 'Mission Operations Overview'}
                            {activeTab === 'fleet' && 'Fleet Deployment Control'}
                            {activeTab === 'staff' && 'Personnel & HR Management'}
                            {activeTab === 'analytics' && 'Strategic Growth Analytics'}
                        </h1>
                        <p className="text-slate-400 font-medium">Monitoring {agency?.name} enterprise metrics.</p>
                    </div>

                    <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-3 px-4">
                            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                                <Search size={18} />
                            </div>
                            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                                <Download size={18} />
                            </div>
                        </div>
                        <div className="h-10 w-px bg-slate-100"></div>
                        <div className="px-4 py-2 flex items-center gap-3">
                            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-black">
                                {user?.fullName.charAt(0)}
                            </div>
                            <div className="text-left leading-none">
                                <p className="text-xs font-black text-slate-900">{user?.fullName}</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{user?.role.replace('_', ' ')}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {activeTab === 'overview' && (
                    <div className="space-y-12">
                        {/* KPI Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[
                                { label: 'Fleet Availability', val: agency?.fleet?.length || 0, icon: <Car size={20} />, color: 'text-indigo-600', bg: 'bg-indigo-50 border-indigo-100' },
                                { label: 'Active Personnel', val: (agency?.staff?.length || 0) + 1, icon: <Users size={20} />, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100' },
                                { label: 'Monthly Revenue', val: '$14.2K', icon: <BarChart3 size={20} />, color: 'text-indigo-600', bg: 'bg-indigo-50 border-indigo-100' },
                                { label: 'Company Score', val: '98%', icon: <ShieldCheck size={20} />, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100' }
                            ].map((kpi, i) => (
                                <div key={i} className={`bg-white p-8 rounded-[2.5rem] border ${kpi.bg} shadow-sm transition-transform hover:-translate-y-1`}>
                                    <div className="flex justify-between items-start mb-6">
                                        <div className={`p-4 rounded-xl ${kpi.bg} ${kpi.color}`}>
                                            {kpi.icon}
                                        </div>
                                        <span className={`text-[10px] font-black uppercase tracking-widest ${kpi.color}`}>+12%</span>
                                    </div>
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{kpi.label}</p>
                                    <p className="text-3xl font-black text-slate-900">{kpi.val}</p>
                                </div>
                            ))}
                        </div>

                        {/* Mixed Grid: Operations & Stats */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                            <div className="lg:col-span-2 space-y-8">
                                <div className="bg-white rounded-[3rem] p-10 shadow-premium border border-slate-50">
                                    <div className="flex items-center justify-between mb-10">
                                        <h3 className="text-xl font-black text-slate-800 tracking-tight">Fleet Deployment Roadmap</h3>
                                        <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest border border-indigo-100 px-6 py-2 rounded-xl">Full Report</button>
                                    </div>
                                    <div className="h-64 flex items-end justify-between px-4 pb-4">
                                        {[65, 45, 85, 30, 95, 55, 75].map((h, i) => (
                                            <div key={i} className="w-12 bg-indigo-50 rounded-t-2xl relative group">
                                                <div className="absolute bottom-0 w-full bg-indigo-600 rounded-t-2xl transition-all duration-1000 group-hover:bg-indigo-500" style={{ height: `${h}%` }}></div>
                                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">{h}%</div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex justify-between px-4 mt-6">
                                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                                            <span key={d} className="text-[10px] font-black text-slate-300 uppercase tracking-widest w-12 text-center">{d}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-8">
                                <div className="bg-white rounded-[3rem] p-10 shadow-premium border border-slate-50">
                                    <h3 className="text-xl font-black text-slate-800 tracking-tight mb-8 italic">Quick Operations</h3>
                                    <div className="space-y-4">
                                        <Link to="/cars/add" className="w-full h-20 bg-indigo-600 text-white rounded-[1.5rem] flex items-center justify-center gap-4 group shadow-xl shadow-indigo-900/10 hover:bg-indigo-700 transition-all font-black text-xs uppercase tracking-[0.2em]">
                                            <Plus size={20} className="group-hover:rotate-90 transition-transform" /> List Vehicle
                                        </Link>
                                        <button onClick={() => setShowStaffModal(true)} className="w-full h-20 bg-slate-50 text-slate-400 rounded-[1.5rem] flex items-center justify-center gap-4 group hover:bg-indigo-50 hover:text-indigo-600 transition-all font-black text-xs uppercase tracking-[0.2em] border border-slate-100">
                                            <UserPlus size={20} className="group-hover:translate-x-1 transition-transform" /> Recruit Personnel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'staff' && (
                    <div className="bg-white rounded-[3rem] p-12 shadow-premium border border-slate-50 animate-in fade-in slide-in-from-bottom-8">
                        <div className="flex justify-between items-center mb-12">
                            <div>
                                <h3 className="text-2xl font-black text-slate-800 tracking-tight">Active Human Resources</h3>
                                <p className="text-slate-400 font-medium">Manage permissions and team roles for {agency?.name}.</p>
                            </div>
                            <button onClick={() => setShowStaffModal(true)} className="btn-primary rounded-2xl px-8 py-4 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                <UserPlus size={18} /> Hire Personnel
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <div className="bg-slate-50 p-8 rounded-[2rem] border-2 border-indigo-100 relative group overflow-hidden">
                                <div className="absolute -top-4 -right-4 text-indigo-100 opacity-20 pointer-events-none">
                                    <Building2 size={120} />
                                </div>
                                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm mb-6">
                                    <Users size={32} />
                                </div>
                                <h4 className="text-lg font-black text-slate-800 mb-1">{agency?.owner?.fullName}</h4>
                                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-4 block">Executive Director</span>
                                <p className="text-xs text-slate-400 font-medium pb-6 border-b border-indigo-50 mb-6">{agency?.owner?.email}</p>
                                <button className="text-[10px] font-black uppercase tracking-widest text-slate-300">Super Administrator</button>
                            </div>

                            {agency?.staff?.map(person => (
                                <div key={person.id} className="bg-white p-8 rounded-[2rem] border border-slate-100 group hover:border-indigo-200 transition-all hover:shadow-xl relative overflow-hidden">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 shadow-inner group-hover:scale-110 transition-transform">
                                            <Users size={32} />
                                        </div>
                                        <button className="text-slate-200 hover:text-slate-400"><MoreHorizontal size={20} /></button>
                                    </div>
                                    <h4 className="text-lg font-black text-slate-800 mb-1">{person.fullName}</h4>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-4 block">{person.role.replace('AGENCY_', '')}</span>
                                    <p className="text-xs text-slate-400 font-medium pb-6 border-b border-slate-50 mb-6">{person.email}</p>
                                    <div className="flex gap-2">
                                        <button className="flex-1 py-3 bg-slate-50 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-all">Profile</button>
                                        <button className="flex-1 py-3 border border-slate-50 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-300 hover:border-red-50 hover:text-red-400 transition-all">Relieve</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Fallback for other tabs */}
                {(activeTab === 'fleet' || activeTab === 'analytics' || activeTab === 'docs' || activeTab === 'settings') && (
                    <div className="bg-white rounded-[3rem] p-32 text-center border border-slate-50 shadow-premium animate-in zoom-in-95">
                        <div className="w-24 h-24 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-10">
                            <LayoutDashboard size={48} />
                        </div>
                        <h3 className="text-2xl font-black bg-gradient-to-r from-indigo-600 to-emerald-500 bg-clip-text text-transparent mb-4">Strategic Enterprise Planning</h3>
                        <p className="text-slate-400 font-medium max-w-sm mx-auto mb-12">This module is part of our Phase 2 Strategic Roadmap. We are currently finalizing backend protocols for high-volume enterprise data.</p>
                        <button className="px-12 py-5 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl">Review Roadmap</button>
                    </div>
                )}
            </div>

            {/* Hiring/Recruitment Modal */}
            {showStaffModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-8">
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl" onClick={() => setShowStaffModal(false)}></div>
                    <form onSubmit={handleAddStaff} className="relative bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95">
                        <div className="bg-indigo-600 p-10 text-white">
                            <h3 className="text-2xl font-black tracking-tight mb-2">Talent Acquisition</h3>
                            <p className="text-indigo-100 text-xs font-bold uppercase tracking-widest">Internal Recruitment Form</p>
                        </div>
                        <div className="p-10 space-y-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Candidate Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:border-indigo-600 outline-none transition-all font-bold text-sm"
                                    onChange={(e) => setStaffData({ ...staffData, fullName: e.target.value })}
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Corporate Email</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:border-indigo-600 outline-none transition-all font-bold text-sm"
                                    onChange={(e) => setStaffData({ ...staffData, email: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Organizational Role</label>
                                    <select
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:border-indigo-600 outline-none transition-all font-bold text-sm cursor-pointer"
                                        onChange={(e) => setStaffData({ ...staffData, role: e.target.value })}
                                    >
                                        <option value="AGENCY_MANAGER">Agency Manager</option>
                                        <option value="AGENCY_STAFF">Booking Staff</option>
                                    </select>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Temporary Code</label>
                                    <input
                                        type="text"
                                        disabled
                                        value="Password123!"
                                        className="w-full px-6 py-4 bg-slate-100 border border-slate-100 rounded-2xl text-slate-400 font-bold text-sm italic"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button type="submit" className="flex-1 bg-indigo-600 text-white rounded-2xl py-5 font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-900/10 hover:bg-indigo-700 active:scale-95 transition-all">Confirm Hire</button>
                                <button type="button" onClick={() => setShowStaffModal(false)} className="flex-1 bg-slate-50 text-slate-400 rounded-2xl py-5 font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all">Abort</button>
                            </div>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default AgencyDashboard;
