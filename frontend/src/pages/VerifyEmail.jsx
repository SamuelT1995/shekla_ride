import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, ArrowLeft, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';

const VerifyEmail = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { verifyEmail, resendCode } = useAuth();
    const inputRefs = useRef([]);

    const [code, setCode] = useState(['', '', '', '']);
    const [email, setEmail] = useState(location.state?.email || localStorage.getItem('verify_email'));
    const [emailPreviewUrl, setEmailPreviewUrl] = useState(location.state?.emailPreviewUrl || null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [resendSuccess, setResendSuccess] = useState(false);
    const [isDevMode, setIsDevMode] = useState(location.state?.isDevMode ?? true);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (location.state?.email) {
            localStorage.setItem('verify_email', location.state.email);
            setEmail(location.state.email);
        }

        if (!email && !location.state?.email) {
            navigate('/register');
        }
    }, [email, navigate, location.state]);

    // Clear email from storage on success
    useEffect(() => {
        if (success) {
            localStorage.removeItem('verify_email');
        }
    }, [success]);

    const handleChange = (index, value) => {
        if (isNaN(value)) return;

        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        // Move to next input
        if (value !== '' && index < 3) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && code[index] === '' && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const verificationCode = code.join('');
        if (verificationCode.length !== 4) return;

        setLoading(true);
        setError('');
        try {
            await verifyEmail(email, verificationCode);
            setSuccess(true);
            setTimeout(() => {
                navigate('/login', { state: { message: 'Verification successful! You can now log in.' } });
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Verification failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setResending(true);
        setError('');
        try {
            const res = await resendCode(email);
            setResendSuccess(true);
            if (res.emailPreviewUrl) setEmailPreviewUrl(res.emailPreviewUrl);
            if (res.isDevMode !== undefined) setIsDevMode(res.isDevMode);
            setTimeout(() => setResendSuccess(false), 5000);
        } catch (err) {
            setError('Failed to resend code.');
        } finally {
            setResending(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#020617] p-6 selection:bg-primary selection:text-white">
            {/* Background Layer with Sophisticated Depth */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center scale-110 blur-sm brightness-[0.2]"
                    style={{
                        backgroundImage: `url('/hero_car_v5.jpg')`
                    }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-tr from-[#020617] via-transparent to-primary/10"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent"></div>
            </div>

            <div className="relative z-10 w-full max-w-[480px]">
                {/* Premium Glassmorphism Card */}
                <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[40px] p-8 md:p-12 shadow-2xl space-y-10">
                    <div className="text-center space-y-6">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-primary/10 border border-primary/20 text-primary shadow-[0_0_40px_rgba(59,130,246,0.1)] animate-in zoom-in duration-700">
                            <Shield size={40} strokeWidth={1.5} />
                        </div>

                        <div className="space-y-3">
                            <h1 className="text-4xl font-light text-white tracking-tight leading-tight">
                                Authentication <br />
                                <span className="text-slate-500 font-serif italic">Required</span>
                            </h1>

                            <div className="flex flex-col items-center gap-3">
                                {isDevMode && emailPreviewUrl ? (
                                    <a
                                        href={emailPreviewUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group flex items-center gap-3 px-5 py-3 bg-primary/10 border border-primary/30 hover:border-primary/60 rounded-2xl transition-all duration-300 hover:bg-primary/20"
                                    >
                                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.5)]"></div>
                                        <span className="text-xs font-bold uppercase tracking-[0.15em] text-primary group-hover:text-white transition-colors">
                                            📬 Click to View Your Email →
                                        </span>
                                    </a>
                                ) : isDevMode ? (
                                    <div className="px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></div>
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-400">Check backend terminal for code</span>
                                    </div>
                                ) : (
                                    <p className="text-slate-400 text-sm font-medium">
                                        Enter the security code sent to <br />
                                        <span className="text-white border-b border-white/20 pb-0.5">{email}</span>
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {success ? (
                        <div className="bg-emerald-500/10 border border-emerald-500/20 p-8 rounded-3xl space-y-4 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                                <CheckCircle2 size={32} className="text-emerald-500" />
                            </div>
                            <h4 className="text-white font-bold uppercase tracking-widest text-xs">Identity Verified</h4>
                            <p className="text-slate-400 text-[10px] uppercase tracking-widest leading-relaxed">Securing your session...</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-10">
                            <div className="flex justify-between gap-3">
                                {code.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={(el) => (inputRefs.current[index] = el)}
                                        type="text"
                                        maxLength="1"
                                        className="w-full h-24 text-center text-4xl font-extralight bg-white/[0.05] border border-white/10 rounded-2xl text-white outline-none focus:border-primary/50 focus:bg-white/[0.08] focus:ring-4 focus:ring-primary/10 transition-all duration-300"
                                        value={digit}
                                        onChange={(e) => handleChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        disabled={loading}
                                        placeholder="•"
                                    />
                                ))}
                            </div>

                            {error && (
                                <div className="flex items-center gap-3 text-rose-400 bg-rose-500/10 border border-rose-500/20 p-5 rounded-2xl text-[10px] font-bold uppercase tracking-widest animate-in fade-in duration-300">
                                    <AlertCircle size={16} />
                                    {error}
                                </div>
                            )}

                            {resendSuccess && (
                                <div className="flex items-center gap-3 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-5 rounded-2xl text-[10px] font-bold uppercase tracking-widest animate-in fade-in duration-300">
                                    <CheckCircle2 size={16} />
                                    New integrity code distributed.
                                </div>
                            )}

                            <div className="space-y-6">
                                <button
                                    type="submit"
                                    disabled={loading || code.some(d => d === '')}
                                    className="w-full py-6 bg-primary text-secondary rounded-2xl font-black uppercase tracking-[0.3em] text-[11px] shadow-2xl hover:bg-white hover:text-black hover:scale-[1.02] active:scale-[0.98] transition-all duration-500 disabled:opacity-30 disabled:hover:scale-100 flex items-center justify-center gap-4 group"
                                >
                                    {loading ? <RefreshCw className="animate-spin" size={18} /> : (
                                        <>
                                            <span>Authorize Access</span>
                                            <Shield size={16} className="transition-transform group-hover:rotate-12" />
                                        </>
                                    )}
                                </button>

                                <div className="flex flex-col gap-6 items-center">
                                    <button
                                        type="button"
                                        onClick={handleResend}
                                        disabled={resending}
                                        className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-white transition-colors flex items-center gap-2 group"
                                    >
                                        {resending ? <RefreshCw className="animate-spin" size={12} /> : (
                                            <RefreshCw size={12} className="group-hover:rotate-180 transition-transform duration-700" />
                                        )}
                                        {resending ? 'Re-issuing...' : "Request New Code"}
                                    </button>

                                    <Link
                                        to="/register"
                                        className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 hover:text-rose-400 transition-colors"
                                    >
                                        <ArrowLeft size={12} /> Cancel Application
                                    </Link>
                                </div>
                            </div>
                        </form>
                    )}
                </div>

                <div className="mt-12 text-center">
                    <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-slate-700">
                        Secure Environment <span className="text-slate-800">|</span> Shekla Ride Protocol
                    </p>
                </div>
            </div>
        </div>
    );
};

export default VerifyEmail;

