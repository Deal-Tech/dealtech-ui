import { useState, useEffect, useCallback, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Eye, EyeOff, ChevronRight, Loader2 } from 'lucide-react';
import { Input } from '../../components/ui/input/Input';

const slides = [
  {
    subtitle: 'DealTech UI Starter',
    title: 'Mulai Cepat Dashboard Admin',
    description:
      'Template starter untuk membangun dashboard berbasis React + Vite dengan komponen siap pakai.',
  },
  {
    subtitle: 'Reusable Components',
    title: 'Siap Copy ke Project Kamu',
    description:
      'Gunakan komponen login, sidebar, tabel, filter, card, dan form sebagai fondasi UI.',
  },
  {
    subtitle: 'Scalable Structure',
    title: 'Struktur Rapi dan Mudah Dikembangkan',
    description:
      'Routing, layout, dan pola folder sudah siap agar tim bisa tambah page baru lebih cepat.',
  },
];

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@dealtechui.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [slideDirection, setSlideDirection] = useState<'in' | 'out'>('in');

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
    const timer = setInterval(() => {
      goToSlide((activeSlide + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [activeSlide, goToSlide]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Dummy login, langsung navigate ke dashboard.
    setTimeout(() => {
      setLoading(false);
      navigate('/dashboard');
    }, 800);
  };

  return (
    <div className="flex min-h-screen w-full font-['SN_Pro',system-ui,sans-serif]">
      <div className="flex flex-1 items-center justify-center bg-white px-6 py-12 lg:px-16">
        <div className="flex min-h-[calc(100vh-6rem)] w-full max-w-[420px] flex-col">
          <div className="mb-12 flex items-center gap-2.5">
            <div
              className="flex h-9 w-9 items-center justify-center rounded text-white"
              style={{ background: '#334a34' }}
            >
              <ShieldCheck size={20} />
            </div>
            <span className="tracking-tight text-[15px] font-semibold text-gray-900">
              DealTech UI Panel Starter
            </span>
          </div>

          <div className="mb-8">
            <h1 className="mb-2 text-[28px] font-bold tracking-tight text-gray-900">
              Selamat Datang
            </h1>
            <p className="text-[13px] leading-relaxed text-gray-500">
              Masuk ke DealTech UI Panel Starter untuk melihat demo page dan
              komponen.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 space-y-5">
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-[13px] font-medium text-gray-700"
              >
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                placeholder="Masukkan email"
                autoFocus
                autoComplete="email"
                disabled={loading}
                className="h-11 rounded px-4 selection:bg-[#334a34]/10"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="block text-[13px] font-medium text-gray-700"
              >
                Kata Sandi
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  placeholder="********"
                  autoComplete="current-password"
                  disabled={loading}
                  className="h-11 rounded px-4 pr-12 selection:bg-[#334a34]/10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  aria-label={
                    showPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-[13px]">
              <label className="flex cursor-pointer items-center gap-2 text-gray-600">
                <input
                  type="checkbox"
                  className="h-3.5 w-3.5 rounded border-gray-300 accent-[#334a34]"
                  defaultChecked
                />
                <span>Ingat saya</span>
              </label>
              <a
                href="#"
                className="font-medium text-gray-500 transition-colors hover:text-[#334a34]"
              >
                Lupa sandi?
              </a>
            </div>

            {error && (
              <p className="rounded border border-red-100 bg-red-50 px-4 py-2.5 text-[13px] font-medium text-red-600">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group flex h-11 w-full items-center justify-center gap-2 rounded text-[13px] font-semibold text-white transition-all active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
              style={{ background: loading ? '#8a9e8b' : '#334a34' }}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Memproses...
                </>
              ) : (
                <>
                  Masuk ke Akun{' '}
                  <ChevronRight
                    size={16}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-[11px] text-gray-400">
            (c) 2026 DealTech UI - Panel Starter Template
          </p>
        </div>
      </div>

      <div
        className="relative hidden flex-1 flex-col items-center justify-center overflow-hidden text-white lg:flex"
        style={{
          background: 'linear-gradient(135deg, #334a34 0%, #4a6b4b 50%, #2a3d2b 100%)',
        }}
      >
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/[0.04]" />
        <div className="absolute -bottom-32 -left-16 h-96 w-96 rounded-full bg-white/[0.03]" />
        <div className="absolute right-1/4 top-1/3 h-48 w-48 rounded-full bg-white/[0.02]" />

        <div className="relative z-10 max-w-lg px-12">
          <div
            key={activeSlide}
            className={`transition-all duration-300 ${
              slideDirection === 'in'
                ? 'translate-y-0 opacity-100'
                : 'translate-y-4 opacity-0'
            }`}
          >
            <span className="mb-4 inline-block text-[11px] font-semibold uppercase tracking-widest text-white/50">
              {slides[activeSlide].subtitle}
            </span>
            <h2 className="mb-4 text-3xl font-bold leading-tight tracking-tight">
              {slides[activeSlide].title}
            </h2>
            <p className="mb-6 text-[14px] leading-relaxed text-white/50">
              {slides[activeSlide].description}
            </p>
            <div className="border-l-2 border-white/10 pl-4 text-[12px] italic text-white/30">
              Starter kit admin panel untuk prototyping cepat, rapi, dan mudah
              dikembangkan.
            </div>
          </div>

          <div className="mt-10 flex items-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goToSlide(i)}
                aria-label={`Slide ${i + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === activeSlide
                    ? 'w-8 bg-white'
                    : 'w-2 bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
