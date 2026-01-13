
import React from 'react';
import { Link } from 'react-router-dom';

interface MaintenanceModeProps {
    banner?: string;
}

const MaintenanceMode: React.FC<MaintenanceModeProps> = ({ banner }) => {
    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center overflow-hidden">
            <div className="absolute inset-0 opacity-20 scale-110">
                {banner && <img src={banner} className="w-full h-full object-cover blur-[100px]" alt="" />}
            </div>
            <div className="relative z-10 space-y-8 animate-in fade-in zoom-in duration-1000">
                <div className="size-24 bg-amber-500/10 rounded-[2.5rem] flex items-center justify-center text-amber-500 mx-auto border border-amber-500/20 shadow-[0_0_50px_rgba(245,158,11,0.2)]">
                    <span className="material-symbols-outlined text-5xl">construction</span>
                </div>
                <div className="space-y-4">
                    <h1 className="text-4xl md:text-7xl font-black text-white tracking-tighter leading-none">
                        Evolucionando <br /> para vos
                    </h1>
                    <p className="text-white/40 text-lg md:text-xl max-w-lg mx-auto font-medium leading-relaxed">
                        El portal de Senda se encuentra en mantenimiento técnico. <br className="hidden md:block" /> Volveremos en breve con mejoras.
                    </p>
                </div>
                <div className="pt-10">
                    <Link to="/login" className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-white/30 hover:text-white transition-all">
                        Acceso Gestor
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default MaintenanceMode;
