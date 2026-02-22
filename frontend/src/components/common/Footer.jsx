import React from 'react';
import { Link } from 'react-router-dom';
import {
    Shield, Mail, Phone, MapPin, Instagram,
    Twitter, Facebook, Linkedin, ArrowRight, Heart
} from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const sections = [
        {
            title: 'Experience',
            links: [
                { label: 'Browse Vehicles', path: '/cars' },
                { label: 'How it Works', path: '/' },
                { label: 'Support', path: '/help' },
                { label: 'Our Philosophy', path: '/about' }
            ]
        },
        {
            title: 'Dashboard',
            links: [
                { label: 'Add your Vehicle', path: '/cars/add' },
                { label: 'Host Guidelines', path: '/host-rules' },
                { label: 'Insurance & Safety', path: '/safety' }
            ]
        },
        {
            title: 'Legacy',
            links: [
                { label: 'Our Story', path: '/about' },
                { label: 'Press & Media', path: '/press' },
                { label: 'Executive Careers', path: '/careers' }
            ]
        }
    ];

    return (
        <footer className="bg-secondary text-primary pt-48 pb-12 border-t border-slate-100">
            <div className="container">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-24 mb-32">
                    {/* Brand */}
                    <div className="lg:col-span-2 space-y-12">
                        <Link to="/" className="flex items-center gap-4 group">
                            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-secondary transition-transform duration-500 group-hover:rotate-[360deg]">
                                <Shield size={22} />
                            </div>
                            <span className="text-xl font-light uppercase tracking-[0.3em] font-serif italic">Shekla Ride</span>
                        </Link>

                        <p className="text-lg text-slate-400 font-medium leading-relaxed max-w-sm">
                            Ethiopia's premier peer-to-peer car sharing marketplace. Professional service for an extraordinary journey.
                        </p>

                        <div className="flex gap-6">
                            {[Instagram, Twitter, Facebook, Linkedin].map((Icon, i) => (
                                <button key={i} className="text-slate-400 hover:text-primary transition-colors">
                                    <Icon size={20} strokeWidth={1.5} />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Nav Groups */}
                    {sections.map((section, s) => (
                        <div key={s} className="space-y-10">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">{section.title}</h4>
                            <ul className="space-y-6">
                                {section.links.map((link, l) => (
                                    <li key={l}>
                                        <Link to={link.path} className="text-sm font-medium text-slate-400 hover:text-primary transition-colors">
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom Bar */}
                <div className="pt-12 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300">©{currentYear} Shekla Ride</span>
                        <div className="flex gap-8">
                            <Link to="/privacy" className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 hover:text-primary transition-colors">Privacy</Link>
                            <Link to="/terms" className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 hover:text-primary transition-colors">Terms</Link>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300">
                        Crafted for the <span className="italic font-serif text-slate-400">extraordinary</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
