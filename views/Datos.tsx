
import React from 'react';
import { Stats, Institution } from '../types';

interface DatosProps {
  stats: Stats;
  institutions: Institution[];
}

const Datos: React.FC<DatosProps> = ({ stats, institutions }) => {
  const activeCount = institutions.filter(i => i.status === 'Activo').length;
  const urgentCount = institutions.filter(i => i.status === 'Ayuda Req.').length;

  return (
    <div className="flex flex-col flex-1 h-full overflow-hidden bg-background-light">
      <header className="bg-white/50 border-b border-slate-200 px-6 py-8 flex justify-between items-center sticky top-0 z-50 backdrop-blur-md">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Reportes de Impacto</h1>
          <p className="text-slate-500 text-sm mt-1 font-medium italic">Análisis estratégico de la red provincial Senda.</p>
        </div>
        <button className="px-6 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-black uppercase tracking-widest shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px]">file_download</span> Descargar PDF
        </button>
      </header>

      <main className="flex-1 p-6 md:p-10 space-y-10 overflow-y-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <DataCard label="Beneficiarios Senda" value={stats.totalBeneficiaries.toLocaleString()} icon="diversity_1" color="blue" />
          <DataCard label="Instituciones Activas" value={activeCount} icon="verified" color="green" />
          <DataCard label="Ayuda Requerida" value={urgentCount} icon="campaign" color="red" />
          <DataCard label="Auditorías Pendientes" value={stats.pendingValidations} icon="pending_actions" color="amber" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm">
            <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">analytics</span>
              Distribución Regional
            </h3>
            <div className="space-y-6">
              <RegionImpact label="Santa Fe Capital" value={45} color="bg-primary" />
              <RegionImpact label="Rosario" value={32} color="bg-indigo-500" />
              <RegionImpact label="Venado Tuerto" value={12} color="bg-blue-400" />
              <RegionImpact label="Otros" value={11} color="bg-slate-200" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-primary to-indigo-900 p-10 rounded-[3rem] text-white shadow-xl shadow-primary/20">
            <h3 className="text-xl font-black mb-6">Nota del Gestor</h3>
            <p className="text-white/70 text-sm leading-relaxed mb-10 italic font-medium">
              "Este mes hemos logrado un incremento del 12% en la cobertura alimentaria del centro provincial. La red Senda continúa fortaleciendo los lazos entre las comunidades y las instituciones eclesiales."
            </p>

          </div>
        </div>
      </main>
    </div>
  );
};

const DataCard = ({ label, value, icon, color }: any) => {
  const colorMap: any = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    green: "bg-green-50 text-green-600 border-green-100",
    red: "bg-red-50 text-red-600 border-red-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100"
  };
  return (
    <div className={`bg-white p-8 rounded-[2.5rem] border ${colorMap[color]} shadow-sm hover:shadow-lg transition-all`}>
      <div className="flex justify-between items-start mb-6">
        <span className="material-symbols-outlined text-3xl opacity-80">{icon}</span>
      </div>
      <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{label}</p>
      <p className="text-3xl font-black text-slate-900 tracking-tighter">{value}</p>
    </div>
  );
};

const RegionImpact = ({ label, value, color }: any) => (
  <div className="space-y-2">
    <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-slate-500">
      <span>{label}</span>
      <span className="text-slate-900">{value}%</span>
    </div>
    <div className="h-3 w-full bg-slate-50 rounded-full overflow-hidden">
      <div className={`h-full ${color}`} style={{ width: `${value}%` }}></div>
    </div>
  </div>
);

export default Datos;
