
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const CategoryNavbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [links, setLinks] = useState({
    boton1: 'MAPA SENDA',
    boton2: 'QUIERO COLABORAR',
    boton3: 'SUMAR INSTITUCIÓN'
  });

  const loadLinks = () => {
    const stored = localStorage.getItem('senda_site_config');
    if (stored) {
      const data = JSON.parse(stored);
      // Fallback to default if config exists but links sub-object is missing
      const btn1 = data?.pages?.home?.actions?.button1?.label || 'MAPA SENDA';
      const btn2 = data?.pages?.home?.actions?.button2?.label || 'QUIERO COLABORAR';
      const btn3 = data?.pages?.home?.actions?.button3?.label || 'SUMAR INSTITUCIÓN';

      setLinks({
        boton1: btn1,
        boton2: btn2,
        boton3: btn3
      });
    }
  };

  useEffect(() => {
    loadLinks();
    loadLinks();
    window.addEventListener('senda_config_update', loadLinks);
    return () => window.removeEventListener('senda_config_update', loadLinks);
  }, []);

  const handleAction = (type: string) => {
    setIsOpen(false);
    switch (type) {
      case 'ayuda': navigate('/explorar'); break;
      case 'sumar': navigate('/registro'); break;
      case 'colaborar':
        if (location.pathname !== '/') {
          navigate(`/#${type}`);
        } else {
          const el = document.getElementById(type);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }
        break;
      default: break;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-center p-2.5 rounded-2xl transition-all ${isOpen
          ? 'bg-primary text-white shadow-lg scale-95'
          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm'
          }`}
      >
        <span className="material-symbols-outlined text-[30px] leading-none">
          {isOpen ? 'close' : 'grid_view'}
        </span>
      </button>

      <div
        className={`absolute right-0 top-full mt-4 w-[92vw] max-w-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.2)] overflow-hidden transition-all duration-300 origin-top-right z-[100] ${isOpen ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto' : 'opacity-0 -translate-y-4 scale-95 pointer-events-none'
          }`}
      >
        <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 dark:bg-slate-900/50">
          <button onClick={() => handleAction('ayuda')} className="flex flex-col items-center justify-center gap-3 px-2 py-5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-[10px] font-black text-slate-700 dark:text-slate-200 hover:border-red-400 hover:text-red-500 shadow-sm transition-all group active:scale-95">
            <span className="material-symbols-outlined text-[24px] text-red-500 group-hover:scale-110 transition-transform">map</span>
            <span className="text-center leading-tight px-1 uppercase tracking-widest">{links.boton1}</span>
          </button>

          <button onClick={() => handleAction('colaborar')} className="flex flex-col items-center justify-center gap-3 px-2 py-5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-[10px] font-black text-slate-700 dark:text-slate-200 hover:border-primary hover:text-primary shadow-sm transition-all group active:scale-95">
            <span className="material-symbols-outlined text-[24px] text-primary group-hover:scale-110 transition-transform">volunteer_activism</span>
            <span className="text-center leading-tight px-1 uppercase tracking-widest">{links.boton2}</span>
          </button>

          <button onClick={() => handleAction('sumar')} className="flex flex-col items-center justify-center gap-3 px-2 py-5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-[10px] font-black text-slate-700 dark:text-slate-200 hover:border-amber-400 hover:text-amber-500 shadow-sm transition-all group active:scale-95">
            <span className="material-symbols-outlined text-[24px] text-amber-500 group-hover:scale-110 transition-transform">add_business</span>
            <span className="text-center leading-tight px-1 uppercase tracking-widest">{links.boton3}</span>
          </button>
        </div>

        <div className="p-4 bg-primary text-center">
          <p className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em]">Red de Asistencia Senda</p>
        </div>
      </div>
    </div>
  );
};

export default CategoryNavbar;
