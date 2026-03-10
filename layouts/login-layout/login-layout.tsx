import { useState, useEffect, useCallback } from 'react';
import { Eye, EyeOff, ChevronRight, Loader2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// ── Types ───────────────────────────────────────────
export interface LoginSlide {
    subtitle: string;
    title: string;
    description: string;
}

export interface LoginLayoutProps {
    /** Brand icon (lucide icon) */
    brandIcon: LucideIcon;
    /** Brand name shown beside icon */
    brandName: string;
    /** Main heading */
    heading?: string;
    /** Subtitle below heading */
    subheading?: string;
    /** Submit button label */
    submitLabel?: string;
    /** Footer text (e.g. copyright) */
    footerText?: string;
    /** Right panel slides (auto-rotate) */
    slides?: LoginSlide[];
    /** Right panel bottom quote */
    quoteText?: string;
    /** Loading state */
    loading?: boolean;
    /** Error message */
    error?: string;
    /** Callback on form submit */
    onSubmit?: (email: string, password: string) => void | Promise<void>;
    /** Show "remember me" checkbox (default: true) */
    showRememberMe?: boolean;
    /** Show "forgot password" link (default: true) */
    showForgotPassword?: boolean;
    /** Forgot password click handler */
    onForgotPassword?: () => void;
}

// ── Default slides ──────────────────────────────────
const defaultSlides: LoginSlide[] = [
    {
        subtitle: 'Admin Panel',
        title: 'Kelola Semua dalam Satu Dashboard',
        description: 'Dashboard admin untuk memudahkan pengelolaan produk, pesanan, pembayaran, dan seluruh operasional secara efisien.',
    },
    {
        subtitle: 'Manajemen Data',
        title: 'Produk, Kategori & Voucher',
        description: 'Tambah, edit, dan kelola seluruh katalog dari satu tempat yang terintegrasi.',
    },
    {
        subtitle: 'Monitoring',
        title: 'Pantau Pesanan & Pembayaran',
        description: 'Lacak status pesanan secara real-time, verifikasi pembayaran, dan kelola pengiriman dengan mudah.',
    },
];

// ── Component ───────────────────────────────────────
export const LoginLayout = ({
    brandIcon: BrandIcon,
    brandName,
    heading = 'Selamat Datang',
    subheading = 'Masuk ke dashboard untuk memantau dan mengelola operasional.',
    submitLabel = 'Masuk ke Akun',
    footerText = '© 2025 — Powered by Dealtech',
    slides = defaultSlides,
    quoteText = 'Teknologi modern untuk memastikan privasi data dan reliabilitas sistem 24/7.',
    loading = false,
    error: externalError,
    onSubmit,
    showRememberMe = true,
    showForgotPassword = true,
    onForgotPassword,
}: LoginLayoutProps) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [internalError, setInternalError] = useState('');
    const [activeSlide, setActiveSlide] = useState(0);
    const [slideDirection, setSlideDirection] = useState<'in' | 'out'>('in');

    const error = externalError || internalError;

    const goToSlide = useCallback(
        (index: number) => {
            if (index === activeSlide) return;
            setSlideDirection('out');
            setTimeout(() => {
                setActiveSlide(index);
                setSlideDirection('in');
            }, 300);
        },
        [activeSlide]
    );

    useEffect(() => {
        if (slides.length <= 1) return;
        const timer = setInterval(() => {
            goToSlide((activeSlide + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [activeSlide, goToSlide, slides.length]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setInternalError('');
        if (onSubmit) {
            try {
                await onSubmit(email, password);
            } catch (err: any) {
                setInternalError(err.message || 'Login gagal');
            }
        }
    };

    return (
        <div className="flex min-h-screen w-full font-['SN_Pro',system-ui,sans-serif]">
            {/* ===== LEFT PANEL — Form ===== */}
            <div className="flex flex-1 items-center justify-center bg-white px-6 py-12 lg:px-16">
                <div className="w-full max-w-[420px] flex flex-col min-h-[calc(100vh-6rem)]">
                    {/* Brand */}
                    <div className="flex items-center gap-2.5 mb-12">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-900 text-white">
                            <BrandIcon size={20} />
                        </div>
                        <span className="text-[15px] font-semibold text-gray-900 tracking-tight">{brandName}</span>
                    </div>

                    {/* Heading */}
                    <div className="mb-8">
                        <h1 className="text-[28px] font-bold text-gray-900 tracking-tight mb-2">{heading}</h1>
                        <p className="text-[13px] text-gray-500 leading-relaxed">{subheading}</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5 flex-1">
                        <div className="space-y-1.5">
                            <label htmlFor="login-email" className="block text-[13px] font-medium text-gray-700">Email</label>
                            <input
                                id="login-email"
                                type="email"
                                value={email}
                                onChange={(e) => { setEmail(e.target.value); setInternalError(''); }}
                                placeholder="Masukkan email"
                                autoFocus
                                autoComplete="email"
                                disabled={loading}
                                className="w-full h-11 px-3.5 rounded-xl border border-gray-200 bg-gray-50 text-sm transition-all placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 focus:bg-white disabled:opacity-50"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label htmlFor="login-password" className="block text-[13px] font-medium text-gray-700">Kata Sandi</label>
                            <div className="relative">
                                <input
                                    id="login-password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => { setPassword(e.target.value); setInternalError(''); }}
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                    disabled={loading}
                                    className="w-full h-11 px-3.5 pr-10 rounded-xl border border-gray-200 bg-gray-50 text-sm transition-all placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 focus:bg-white disabled:opacity-50"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    tabIndex={-1}
                                    aria-label={showPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {(showRememberMe || showForgotPassword) && (
                            <div className="flex items-center justify-between text-[13px]">
                                {showRememberMe && (
                                    <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
                                        <input type="checkbox" className="h-3.5 w-3.5 rounded border-gray-300" />
                                        <span>Ingat saya</span>
                                    </label>
                                )}
                                {showForgotPassword && (
                                    <button
                                        type="button"
                                        onClick={onForgotPassword}
                                        className="text-gray-500 hover:text-gray-900 font-medium transition-colors ml-auto"
                                    >
                                        Lupa sandi?
                                    </button>
                                )}
                            </div>
                        )}

                        {error && (
                            <p className="bg-red-50 text-red-600 px-4 py-2.5 rounded-xl text-[13px] font-medium border border-red-100">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="group w-full h-11 flex items-center justify-center gap-2 rounded-xl bg-gray-900 text-[13px] font-semibold text-white transition-all hover:bg-gray-800 active:scale-[0.99] disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <><Loader2 size={16} className="animate-spin" /> Memproses...</>
                            ) : (
                                <>{submitLabel} <ChevronRight size={16} className="transition-transform group-hover:translate-x-0.5" /></>
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <p className="text-[11px] text-gray-400 mt-8">{footerText}</p>
                </div>
            </div>

            {/* ===== RIGHT PANEL — Slider ===== */}
            {slides.length > 0 && (
                <div className="hidden lg:flex flex-1 relative bg-gray-900 text-white flex-col items-center justify-center overflow-hidden">
                    {/* Decorative shapes */}
                    <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/[0.04]" />
                    <div className="absolute -bottom-32 -left-16 w-96 h-96 rounded-full bg-white/[0.03]" />
                    <div className="absolute top-1/3 right-1/4 w-48 h-48 rounded-full bg-white/[0.02]" />

                    <div className="relative z-10 max-w-lg px-12">
                        {/* Slide content */}
                        <div
                            key={activeSlide}
                            className={`transition-all duration-300 ${slideDirection === 'in'
                                ? 'opacity-100 translate-y-0'
                                : 'opacity-0 translate-y-4'
                                }`}
                        >
                            <span className="inline-block text-[11px] font-semibold uppercase tracking-widest text-white/50 mb-4">
                                {slides[activeSlide].subtitle}
                            </span>
                            <h2 className="text-3xl font-bold leading-tight tracking-tight mb-4">
                                {slides[activeSlide].title}
                            </h2>
                            <p className="text-[14px] text-white/50 leading-relaxed mb-6">
                                {slides[activeSlide].description}
                            </p>
                            {quoteText && (
                                <div className="text-[12px] text-white/30 italic border-l-2 border-white/10 pl-4">
                                    {quoteText}
                                </div>
                            )}
                        </div>

                        {/* Dots */}
                        {slides.length > 1 && (
                            <div className="flex items-center gap-2 mt-10">
                                {slides.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => goToSlide(i)}
                                        aria-label={`Slide ${i + 1}`}
                                        className={`h-2 rounded-full transition-all duration-300 ${i === activeSlide
                                            ? 'w-8 bg-white'
                                            : 'w-2 bg-white/20 hover:bg-white/40'
                                            }`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default LoginLayout;
