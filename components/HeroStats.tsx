import React from 'react';
import { Stats } from '../types';

interface HeroStatsProps {
    stats?: Stats;
}

const HeroStats: React.FC<HeroStatsProps & { className?: string }> = ({ stats, className = "" }) => {
    return (
        <div className={`hidden md:flex gap-4 z-20 ${className}`}>
            <div className="bg-black/30 backdrop-blur-md border border-white/10 p-6 rounded-3xl text-white min-w-[140px] shadow-lg">
                <p className="text-3xl font-black">{stats?.totalInstitutions || '140+'}</p>
                <p className="text-[9px] font-black uppercase tracking-widest text-white/60">Sedes Activas</p>
            </div>
            <div className="bg-primary/80 backdrop-blur-md border border-white/10 p-6 rounded-3xl text-white min-w-[140px] shadow-lg">
                <p className="text-3xl font-black">{stats?.totalBeneficiaries.toLocaleString() || '24k'}</p>
                <p className="text-[9px] font-black uppercase tracking-widest text-white/60">Vidas Acompañadas</p>
            </div>
        </div>
    );
};

export default HeroStats;
