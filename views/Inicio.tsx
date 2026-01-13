
/* PÁGINA: Inicio Senda (Rediseñada) */
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Institution, Stats } from '@/types';
import Logo from '@/img/logo.png';
import MaintenanceMode from '@/components/MaintenanceMode';
import HeroStats from '@/components/HeroStats';
import ImpactCarousel from '@/components/ImpactCarousel';
import HomeMap from '@/components/HomeMap'; // New Import
import Footer from '@/components/Footer';
import { useConfig } from '@/contexts/ConfigContext';

interface InicioProps {
  institutions?: Institution[];
  stats?: Stats;
}



const Inicio: React.FC<InicioProps> = ({ institutions, stats }) => {
  const navigate = useNavigate();
  const { config } = useConfig();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-display flex flex-col overflow-x-hidden">

      {/* --- HERO IMMERSIVE --- */}
      <header className="relative h-[100vh] w-full overflow-hidden flex flex-col">

        {/* HomeMap Background */}
        <div className="absolute inset-0 z-0">
          <HomeMap institutions={institutions || []} />
          {/* Gradient Overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/40 to-transparent pointer-events-none"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/20 pointer-events-none"></div>
        </div>

        {/* Navbar on top (Transparent) */}
        <nav className="relative z-50 w-full px-6 py-6 flex justify-between items-center pointer-events-none">
          <div className="flex items-center gap-3 pointer-events-auto">
            {/* Logo con efecto glass */}
            <div className="bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/10 shadow-xl">
              <img src={Logo} alt="Senda Logo" className="size-10" />
            </div>

          </div>
          <div className="flex gap-4 pointer-events-auto">
            {config.features.showRegistration && (
              <Link to="/registro" className="px-6 py-3 bg-white hover:bg-white/90 text-slate-900 shadow-lg rounded-full text-[10px] font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95">
                SUMAR NODO
              </Link>
            )}
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 flex-1 flex flex-col justify-center px-6 md:px-20 max-w-7xl mx-auto w-full pointer-events-none">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">

            {/* Left Column: Text */}
            <div className="space-y-8 pointer-events-auto text-center lg:text-left flex flex-col items-center lg:items-start">
              <h1 className="text-7xl md:text-9xl font-black text-white leading-[0.8] tracking-tighter drop-shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-1000 uppercase">
                {config.pages.home.hero.title}
              </h1>

              <p className="text-xl md:text-3xl text-white/90 font-bold leading-relaxed max-w-xl animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200 text-shadow-sm tracking-tight">
                {config.pages.home.hero.subtitle}
              </p>

              <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full animate-in fade-in slide-in-from-left-4 duration-700 shadow-xl w-fit delay-300">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-white font-black uppercase tracking-[0.2em] text-[10px]">Red en Tiempo Real</span>
              </div>

              {/* Metrics integrated directly in Hero flow (Left side) */}
              <div className="pt-4 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-300 w-full flex justify-center lg:justify-start">
                <HeroStats stats={stats} className="!static !flex !flex-row !gap-6 !bg-transparent !p-0" />
              </div>
            </div>

            {/* Right Column: Buttons Stack */}
            <div className="flex flex-col gap-4 pointer-events-auto w-full max-w-md mx-auto lg:ml-auto animate-in fade-in slide-in-from-right-8 duration-1000 delay-500">

              {config.features.showMap && (
                <button
                  onClick={() => navigate('/explorar')}
                  className="group relative overflow-hidden bg-white text-slate-900 hover:bg-slate-100 p-6 rounded-[2.5rem] shadow-2xl transition-all hover:scale-[1.02] active:scale-[0.98] text-left flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <span className="material-symbols-outlined text-4xl">map</span>
                    <span className="font-black text-xl md:text-2xl uppercase tracking-tighter">Explorar Mapa</span>
                  </div>
                  <span className="material-symbols-outlined opacity-0 group-hover:opacity-100 transition-opacity -translate-x-4 group-hover:translate-x-0 transform duration-300">arrow_forward</span>
                </button>
              )}

              {config.features.showCollaboration && (
                <button
                  onClick={() => navigate('/colaborar')}
                  className="group relative overflow-hidden bg-primary text-white hover:bg-primary/90 p-6 rounded-[2.5rem] shadow-2xl transition-all hover:scale-[1.02] active:scale-[0.98] text-left flex items-center justify-between border-2 border-white/10"
                >
                  <div className="flex items-center gap-4">
                    <span className="material-symbols-outlined text-4xl animate-pulse">volunteer_activism</span>
                    <span className="font-black text-xl md:text-2xl uppercase tracking-tighter">Quiero Ayudar</span>
                  </div>
                  <span className="material-symbols-outlined opacity-0 group-hover:opacity-100 transition-opacity -translate-x-4 group-hover:translate-x-0 transform duration-300">arrow_forward</span>
                </button>
              )}

              {config.pages.home.hero.metricsButton?.show && (
                <button
                  onClick={() => navigate('/impacto')}
                  className="group relative overflow-hidden bg-slate-900/60 backdrop-blur-xl text-white hover:bg-slate-900/80 p-6 rounded-[2.5rem] shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] text-left flex items-center justify-between border border-white/10"
                >
                  <div className="flex items-center gap-4">
                    <span className="material-symbols-outlined text-4xl text-slate-400 group-hover:text-white transition-colors">bar_chart</span>
                    <span className="font-black text-xl md:text-2xl uppercase tracking-tighter text-slate-200 group-hover:text-white transition-colors">{config.pages.home.hero.metricsButton?.label || 'VER IMPACTO'}</span>
                  </div>
                  <span className="material-symbols-outlined opacity-0 group-hover:opacity-100 transition-opacity -translate-x-4 group-hover:translate-x-0 transform duration-300">arrow_forward</span>
                </button>
              )}

            </div>
          </div>
        </div>

      </header>

      {/* --- SECCIÓN 1: EL PROBLEMA (PUENTE DE CONEXIÓN) --- */}
      {config.pages.home.about?.show && (
        <section className="py-32 px-6 bg-white dark:bg-slate-950 relative overflow-hidden">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight tracking-tighter">
                {config.pages.home.about.title.includes('SENDA') ? (
                  <>
                    {config.pages.home.about.title.split('SENDA')[0]}
                    <span className="text-primary">SENDA</span>
                    {config.pages.home.about.title.split('SENDA')[1]}
                  </>
                ) : config.pages.home.about.title}
              </h2>
              <p className="text-lg text-slate-500 font-medium leading-relaxed">
                {config.pages.home.about.description}
              </p>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="size-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-2xl">{config.pages.home.about.point1.icon}</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white">{config.pages.home.about.point1.title}</h4>
                    <p className="text-sm text-slate-500">{config.pages.home.about.point1.desc}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="size-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-2xl">{config.pages.home.about.point2.icon}</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white">{config.pages.home.about.point2.title}</h4>
                    <p className="text-sm text-slate-500">{config.pages.home.about.point2.desc}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-[3rem] rotate-3 blur-md transform translate-y-4 translate-x-4"></div>
              <img
                src={config.pages.home.about.image}
                alt="Voluntariado"
                className="relative rounded-[3rem] shadow-2xl z-10 w-full object-cover h-[500px]"
              />
              <div className="absolute -bottom-10 -left-10 z-20 bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-xl border border-slate-100 dark:border-slate-800 max-w-xs">
                <p className="text-4xl font-black text-primary">{config.pages.home.about.badgeHeader}</p>
                <p className="text-xs uppercase tracking-widest text-slate-400 mt-2">{config.pages.home.about.badgeFooter}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* --- SECCIÓN 2: EL OBSERVATORIO (EVIDENCIA TÉCNICA) --- */}
      {config.pages.home.observatory?.show && (
        <section className="py-32 px-6 bg-slate-950 text-white relative overflow-hidden">
          {/* Background Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-slate-950 via-transparent to-slate-950"></div>

          <div className="max-w-7xl mx-auto relative z-10 text-center space-y-16">
            <div className="space-y-6 max-w-2xl mx-auto">
              <span className="material-symbols-outlined text-6xl text-primary animate-pulse">travel_explore</span>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter whitespace-pre-wrap">{config.pages.home.observatory?.title}</h2>
              <p className="text-xl text-slate-400 font-medium">{config.pages.home.observatory?.subtitle}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {(['card1', 'card2', 'card3'] as const).map((key) => {
                const card = config.pages.home.observatory?.cards?.[key];
                if (!card) return null;
                return (
                  <div key={key} className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group">
                    <div className={`h-2 bg-gradient-to-r ${key === 'card1' ? 'from-primary' : key === 'card2' ? 'from-accent' : 'from-green-500'} to-transparent mb-6 rounded-full w-12 group-hover:w-full transition-all duration-500`}></div>
                    <h3 className="text-2xl font-black mb-2">{card.title}</h3>
                    <p className="text-sm text-slate-400">{card.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}


      {/* FOOTER COMPLETO */}
      <Footer />
    </div>
  );
};

export default Inicio;
