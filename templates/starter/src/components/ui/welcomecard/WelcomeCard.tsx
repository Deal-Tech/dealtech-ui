import { useCallback, useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const WELCOME_SLIDES = [
  {
    subtitle: 'Analitik',
    description:
      'Lihat performa data demo secara real-time untuk kebutuhan testing komponen dan layout dashboard.',
  },
  {
    subtitle: 'Eksplorasi',
    description:
      'Coba variasi tampilan card, table, dan form untuk menyiapkan starter UI yang rapi dan siap pakai.',
  },
  {
    subtitle: 'Integrasi',
    description:
      'Siapkan struktur halaman demo sebelum dipindahkan ke template utama agar proses scaling lebih cepat.',
  },
];

const WelcomeCard = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [slideDir, setSlideDir] = useState<'in' | 'out'>('in');

  const goToSlide = useCallback(
    (index: number) => {
      if (index === activeSlide) return;
      setSlideDir('out');
      setTimeout(() => {
        setActiveSlide(index);
        setSlideDir('in');
      }, 300);
    },
    [activeSlide]
  );

  useEffect(() => {
    const timer = setInterval(() => {
      goToSlide((activeSlide + 1) % WELCOME_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [activeSlide, goToSlide]);

  return (
    <div
      className="relative overflow-hidden rounded p-8"
      style={{ background: 'linear-gradient(135deg, #2a3d2b 0%, #334a34 40%, #4a6b4b 100%)' }}
    >
      <div className="pointer-events-none">
        <div className="absolute -right-10 -top-16 h-60 w-60 rounded-full bg-white opacity-[0.07]" />
        <div className="absolute -bottom-10 -left-8 h-40 w-40 rounded-full bg-white opacity-[0.07]" />
        <div className="absolute right-[20%] top-1/2 h-20 w-20 rounded-full bg-white opacity-[0.04]" />
      </div>

      <div className="relative z-[1] flex max-w-xl flex-col gap-5">
        <div
          key={activeSlide}
          className={`transition-all duration-300 ${
            slideDir === 'in' ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
          }`}
        >
          <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-[1.5px] text-white/50">
            {WELCOME_SLIDES[activeSlide].subtitle}
          </span>
          <h2 className="mb-3 text-2xl font-bold leading-tight text-white">Dealtech UI Panel Starter</h2>
          <p className="mb-4 text-sm leading-relaxed text-white/70">
            {WELCOME_SLIDES[activeSlide].description}
          </p>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 rounded bg-white/10 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/20"
          >
            Lihat Demo
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-2 flex gap-2">
          {WELCOME_SLIDES.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => goToSlide(index)}
              className={`h-1 rounded-full transition-all duration-300 ${
                index === activeSlide ? 'w-10 bg-white' : 'w-7 bg-white/25'
              }`}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default WelcomeCard;
