import React, { useRef, useState, useEffect } from 'react';
import { createWhatsAppUrl } from '../data/services.ts';

export const Hero: React.FC = () => {
  const heroWhatsAppUrl = createWhatsAppUrl(
    "Olá, Nathalia! Gostaria de agendar uma avaliação fisioterapêutica."
  );

  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  // Auto-play attempt on mount
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.defaultMuted = true;
      videoRef.current.playsInline = true;

      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch((err) => {
            console.log('Autoplay aguardando interação do usuário:', err);
            setIsPlaying(false);
          });
      }
    }
  }, []);

  // One-time interaction fallback to ensure video plays even with strict browser battery-saving policies
  useEffect(() => {
    const startPlayback = () => {
      if (videoRef.current && videoRef.current.paused) {
        videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    };
    window.addEventListener('click', startPlayback, { once: true });
    window.addEventListener('touchstart', startPlayback, { once: true });
    return () => {
      window.removeEventListener('click', startPlayback);
      window.removeEventListener('touchstart', startPlayback);
    };
  }, []);

  const handleTogglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleToggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <section className="relative overflow-hidden min-h-[90vh] lg:min-h-[95vh] flex items-center justify-center bg-white text-white">
      
      {/* 1. Background Video Layer - Sem margens amostras e com enquadramento justo */}
      <div className="absolute inset-0 z-0 overflow-hidden select-none pointer-events-none">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          className="w-full h-full object-cover object-center"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        >
          {/* Vídeo oficial enquadrado 1920x1080 (H.264 FastStart) */}
          <source src="/videos/banner-nathalia.mp4" type="video/mp4" />
          {/* Fallback de streaming direto do Google Drive */}
          <source src="https://drive.google.com/uc?export=download&id=17XV2tvHikiXMk9JS-YykAnL2jZtXg2Hm" type="video/mp4" />
        </video>

        {/* Fundo com 0% para o vídeo aparecer 100% limpo e vívido (sem sobreposição escurecida) */}
        <div className="absolute inset-0 bg-transparent pointer-events-none" />
      </div>

      {/* 2. Textos externos posicionados e descidos sobre o vídeo */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-20 sm:pt-28 lg:pt-32 pb-14 w-full flex flex-col justify-center min-h-[90vh] lg:min-h-[95vh]">
        <div className="max-w-3xl lg:max-w-4xl space-y-5 sm:space-y-6 text-left">
          
          {/* Logo clara posicionada acima da frase Reabilitação funcional */}
          <div className="pb-1">
            <img 
              src="/images/logo-fisiotherapy-claro.png" 
              alt="FISIOTERAPY - Prevenção e Tratamento da Dor"
              className="w-[360px] max-w-[90vw] sm:w-[460px] lg:w-[525px] h-auto object-contain drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)] filter"
            />
          </div>

          {/* Headline com quebra exata e sombra para alto contraste */}
          <h1 className="text-[30px] sm:text-4xl lg:text-[46px] xl:text-5xl font-extrabold text-white tracking-tight leading-[1.18] drop-shadow-[0_3px_12px_rgba(0,0,0,0.9)]">
            <span className="block text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
              Reabilitação funcional,
            </span>
            <span className="block whitespace-nowrap drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300">alívio da dor</span> e bem-estar
            </span>
            <span className="block text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
              contínuo.
            </span>
          </h1>

          {/* Descrição com contraste protegido por drop-shadow */}
          <p className="text-base sm:text-lg text-white max-w-2xl leading-relaxed font-medium drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
            Tratamentos especializados focados na sua recuperação completa. Do pós-cirúrgico e acidentes de trabalho a técnicas integrativas como Dry Needling e Auriculoterapia.
          </p>

          {/* CTAs descidos abaixo com tamanho aumentado em 3% */}
          <div className="flex flex-col sm:flex-row items-center justify-start gap-4 pt-3">
            <a 
              href={heroWhatsAppUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8.5 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-[16.5px] scale-[1.03] origin-left shadow-2xl shadow-emerald-500/30 hover:scale-[1.05] transition-all duration-200 cursor-pointer drop-shadow-md"
            >
              <i className="fa-brands fa-whatsapp text-2xl text-slate-950"></i>
              <span>Agende Já no WhatsApp</span>
            </a>

            <a 
              href="#servicos" 
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7.5 py-4 rounded-xl bg-slate-950/70 hover:bg-slate-900/80 text-white font-semibold text-[16.5px] scale-[1.03] origin-left border border-white/30 backdrop-blur-md shadow-2xl hover:scale-[1.05] transition-all duration-200 cursor-pointer drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]"
            >
              <i className="fa-solid fa-list-check text-emerald-400"></i>
              <span>Conhecer Especialidades</span>
            </a>
          </div>

          {/* Controles discretos de reprodução e áudio */}
          <div className="pt-2 flex items-center gap-2 text-xs text-slate-200">
            <button
              type="button"
              onClick={handleTogglePlay}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950/60 hover:bg-slate-900/80 border border-white/20 backdrop-blur-md transition-colors cursor-pointer"
              aria-label={isPlaying ? 'Pausar vídeo' : 'Reproduzir vídeo'}
            >
              <i className={`fa-solid ${isPlaying ? 'fa-pause' : 'fa-play text-emerald-400'}`}></i>
              <span>{isPlaying ? 'Pausar Vídeo' : 'Reproduzir Vídeo'}</span>
            </button>

            <button
              type="button"
              onClick={handleToggleMute}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950/60 hover:bg-slate-900/80 border border-white/20 backdrop-blur-md transition-colors cursor-pointer"
              aria-label={isMuted ? 'Ativar áudio' : 'Desativar áudio'}
            >
              <i className={`fa-solid ${isMuted ? 'fa-volume-xmark' : 'fa-volume-high text-emerald-400'}`}></i>
              <span>{isMuted ? 'Sem Som' : 'Com Som'}</span>
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};
