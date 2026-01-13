
import React, { useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Institution } from '../types';
import L from 'leaflet';
import Logo from '@/img/logo.png';

interface InfoProps {
  isAdmin?: boolean;
  institutions: Institution[];
}

const Info: React.FC<InfoProps> = ({ isAdmin, institutions }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const inst = institutions.find(i => i.id === id);
  const miniMapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (miniMapRef.current && inst && inst.lat && inst.lng) {
      const map = L.map(miniMapRef.current, {
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: false,
        dragging: false,
        touchZoom: false
      }).setView([inst.lat, inst.lng], 15);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(map);

      L.marker([inst.lat, inst.lng], {
        icon: L.divIcon({
          className: 'custom-div-icon',
          html: `<div class="bg-primary text-white p-2 rounded-full shadow-lg border-2 border-white flex items-center justify-center transform scale-110"><span class="material-symbols-outlined text-[16px]">location_on</span></div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        })
      }).addTo(map);

      return () => { map.remove(); };
    }
  }, [inst]);

  if (!inst) return (
    <div className="h-screen flex items-center justify-center text-slate-400 font-display">
      <div className="text-center">
        <span className="material-symbols-outlined text-4xl mb-2 opacity-50">search_off</span>
        <p className="font-bold uppercase tracking-widest text-sm">Institución no encontrada</p>
      </div>
    </div>
  );

  const handleOpenInMap = () => {
    navigate(`/explorar?id=${inst.id}`);
  };

  const shareText = `¡Mirá esta institución en la Red SENDA!\n*${inst.name}*\n${inst.description.substring(0, 100)}...`;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-display flex flex-col">
      {/* Navbar Minimalista */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link to={isAdmin ? "/admin/institutions" : "/explorar"} className="group flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
            <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors">arrow_back</span>
            <span className="text-xs font-black uppercase tracking-widest text-slate-500 group-hover:text-primary hidden md:inline">Volver al Mapa</span>
          </Link>
        </div>
        <div className="flex items-center gap-3">
          {inst.website && (
            <a href={inst.website} target="_blank" rel="noreferrer" className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-primary hover:bg-primary/10 transition-colors" title="Visitar Sitio Web">
              <span className="material-symbols-outlined text-xl">public</span>
            </a>
          )}
          <button onClick={() => {
            if (navigator.share) navigator.share({ title: inst.name, text: shareText, url: window.location.href });
            else alert('Copiar enlace: ' + window.location.href);
          }} className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-primary hover:bg-primary/10 transition-colors" title="Compartir">
            <span className="material-symbols-outlined text-xl">share</span>
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8 space-y-8">

        {/* Banner Hero Section Refinado */}
        <div className="relative rounded-[2.5rem] overflow-hidden bg-white dark:bg-slate-900 shadow-xl border border-slate-100 dark:border-slate-800 group">

          {/* Imagen de Fondo con Overlay Mejorado */}
          <div className="h-64 md:h-80 w-full bg-slate-200 relative overflow-hidden">
            {inst.image ? (
              <img src={inst.image} alt={inst.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/20 via-primary/5 to-slate-50 flex items-center justify-center">
                <img src={Logo} alt="Senda" className="h-32 opacity-10 grayscale mix-blend-multiply" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent"></div>

            {/* Badges Flotantes Superior */}
            <div className="absolute top-6 left-6 flex flex-wrap gap-2">
              <span className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                {inst.type}
              </span>
              {inst.status === 'Ayuda Req.' && (
                <span className="bg-red-500/90 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg animate-pulse flex items-center gap-1 border border-red-400/30">
                  <span className="material-symbols-outlined text-[12px]">warning</span> Requiere Ayuda
                </span>
              )}
            </div>
          </div>

          {/* Contenido Principal - Layout Ajustado */}
          <div className="relative px-6 md:px-10 pb-8 -mt-20 flex flex-col md:flex-row gap-6 md:items-end z-10">

            {/* Avatar/Logo Elevado */}
            <div className="size-28 md:size-40 rounded-3xl bg-white dark:bg-slate-800 shadow-2xl flex items-center justify-center border-[6px] border-white dark:border-slate-800 overflow-hidden shrink-0 mx-auto md:mx-0">
              {inst.image ? (
                <img src={inst.image} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <span className="material-symbols-outlined text-5xl text-slate-300">storefront</span>
              )}
            </div>

            {/* Información y Botones */}
            <div className="flex-1 flex flex-col md:flex-row md:items-end gap-6 text-center md:text-left">

              <div className="flex-1 min-w-0 space-y-2 md:mb-4">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-none text-slate-800 dark:text-white drop-shadow-sm">
                  {inst.name}
                </h1>
                {inst.legalName && inst.legalName !== inst.name && (
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    {inst.legalName}
                  </p>
                )}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-2 text-sm font-bold text-slate-500 dark:text-slate-400 mt-3">
                  <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg">
                    <span className="material-symbols-outlined text-[18px] text-primary">location_on</span>
                    {inst.city}, {inst.province}
                  </span>
                  {inst.foundationYear && (
                    <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg">
                      <span className="material-symbols-outlined text-[18px] text-primary">calendar_month</span>
                      Est. {inst.foundationYear}
                    </span>
                  )}
                </div>
              </div>

              {/* Botones de Acción - Separados y Estilizados */}
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto md:mb-4">
                {inst.phone && (
                  <a href={`https://wa.me/${inst.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer"
                    className="flex-1 md:flex-none justify-center bg-[#25D366] hover:bg-[#20bd5a] text-white px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-green-500/20 transition-all active:scale-95 flex items-center gap-2 group/btn">
                    <span className="material-symbols-outlined text-[20px] group-hover/btn:rotate-12 transition-transform">chat</span>
                    WhatsApp
                  </a>
                )}
                {inst.email && (
                  <a href={`mailto:${inst.email}`}
                    className="flex-1 md:flex-none justify-center bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg transition-all active:scale-95 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[20px]">mail</span>
                    Email
                  </a>
                )}
              </div>

            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Main Info */}
          <div className="lg:col-span-2 space-y-8">

            {/* Description */}
            <div className="space-y-4">
              <h2 className="title-section">Sobre Nosotros</h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-light">
                {inst.description || "Sin descripción disponible."}
              </p>
            </div>

            {/* Needs */}
            {inst.needs && inst.needs.length > 0 && (
              <div className="space-y-4">
                <h2 className="title-section">Principales Necesidades</h2>
                <div className="flex flex-wrap gap-2">
                  {inst.needs.map((need, idx) => (
                    <span key={idx} className="px-4 py-2 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-200 rounded-xl text-xs font-bold uppercase tracking-wider border border-amber-100 dark:border-amber-800/30">
                      {need}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Service Address & Hours details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoCard icon="schedule" title="Horarios de Atención" value={inst.serviceHours} />
              <InfoCard icon="church" title="Parroquia / Capilla" value={inst.parish} />
              {/* Show Address text clearly */}
              <InfoCard icon="home_pin" title="Dirección Física" value={`${inst.address} ${inst.addressNumber || ''}, ${inst.city}`} />
              {isAdmin && (
                <InfoCard icon="badge" title="Responsable (Admin)" value={inst.responsible} highlight />
              )}
            </div>

            {/* Admin Only Section */}
            {isAdmin && (
              <div className="p-6 rounded-3xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-4">
                <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                  <span className="material-symbols-outlined">lock</span> Datos Privados (Admin)
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">CUIT</p>
                    <p className="font-mono text-sm">{inst.cuit || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Tel. Responsable</p>
                    <p className="font-mono text-sm">{inst.repPhone || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Email Responsable</p>
                    <p className="font-mono text-sm truncate" title={inst.repEmail}>{inst.repEmail || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Estado</p>
                    <p className="font-mono text-sm">{inst.status}</p>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Right Column: Map & Stats */}
          <div className="space-y-6">

            {/* Map Card */}
            <div onClick={handleOpenInMap} className="group relative h-64 w-full rounded-[2.5rem] overflow-hidden shadow-lg cursor-pointer border-4 border-white dark:border-slate-800">
              <div ref={miniMapRef} className="absolute inset-0 z-0 bg-slate-100"></div>
              <div className="absolute inset-0 z-10 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                <span className="bg-white/90 backdrop-blur text-primary px-5 py-2.5 rounded-full font-black text-[10px] uppercase shadow-xl opacity-0 translate-y-2 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  Ver en pantalla completa
                </span>
              </div>
            </div>

            {/* Impact Badge */}
            <div className="bg-primary bg-gradient-to-br from-primary to-blue-700 p-8 rounded-[2.5rem] text-white shadow-xl shadow-primary/20 relative overflow-hidden">
              <div className="absolute -right-4 -top-4 bg-white/10 size-32 rounded-full blur-2xl"></div>
              <div className="relative z-10">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-2">Impacto Estimado</p>
                <div className="flex items-baseline gap-1">
                  <p className="text-5xl font-black tracking-tighter">{inst.coveragePopulation?.toLocaleString() || 0}</p>
                </div>
                <p className="text-sm font-medium opacity-80 mt-1">Personas alcanzadas por nuestra misión.</p>
              </div>
            </div>

            {/* Donation / Collaboration CTA */}
            <div className="p-8 rounded-[2.5rem] bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-center space-y-4 shadow-sm">
              <div className="size-16 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-2">
                <span className="material-symbols-outlined text-3xl">volunteer_activism</span>
              </div>
              <h3 className="font-black text-xl text-slate-900 dark:text-white">¿Querés colaborar?</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Si deseas ayudar a <strong>{inst.name}</strong>, contactate directamente con ellos a través de sus canales oficiales.
              </p>
            </div>

          </div>
        </div>
      </main>

      <style>{`
        .title-section {
          @apply text-sm font-black uppercase tracking-widest text-slate-400 mb-2;
        }
      `}</style>
    </div>
  );
};

const InfoCard = ({ icon, title, value, highlight }: any) => (
  <div className={`p-5 rounded-2xl border flex items-start gap-4 transition-all ${highlight ? 'bg-indigo-50 border-indigo-100 dark:bg-indigo-900/20 dark:border-indigo-800' : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700'}`}>
    <div className={`p-2.5 rounded-xl shrink-0 ${highlight ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-800 dark:text-indigo-200' : 'bg-slate-50 dark:bg-slate-900 text-slate-400'}`}>
      <span className="material-symbols-outlined text-[20px]">{icon}</span>
    </div>
    <div>
      <p className={`text-[9px] font-black uppercase tracking-widest mb-1 ${highlight ? 'text-indigo-400' : 'text-slate-400'}`}>{title}</p>
      <p className={`text-sm font-bold ${highlight ? 'text-indigo-900 dark:text-indigo-100' : 'text-slate-700 dark:text-slate-200'}`}>{value || 'No especificado'}</p>
    </div>
  </div>
);

export default Info;
