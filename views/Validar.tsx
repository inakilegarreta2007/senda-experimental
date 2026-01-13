
import React, { useState } from 'react';
import { Institution } from '../types';

interface ValidarProps {
  institutions: Institution[];
  onUpdate: (inst: Institution) => void;
}

const Validar: React.FC<ValidarProps> = ({ institutions, onUpdate }) => {
  // Validation Requests (Full Forms) have status 'En Revisión'
  const pending = institutions.filter(i => i.status === 'En Revisión');
  const [selectedId, setSelectedId] = useState<string | null>(pending[0]?.id || null);
  const selected = institutions.find(i => i.id === selectedId);

  const handleApprove = () => {
    if (!selected) return;
    onUpdate({ ...selected, status: 'Activo', lastUpdate: new Date().toLocaleDateString('es-AR') });
    setSelectedId(null);
  };

  const handleReject = () => {
    if (!selected) return;
    onUpdate({ ...selected, status: 'Inactivo', lastUpdate: new Date().toLocaleDateString('es-AR') });
    setSelectedId(null);
  };

  return (
    <div className="flex flex-col flex-1 h-full overflow-hidden">
      <header className="bg-white/50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 px-6 py-8 flex justify-between items-center sticky top-0 z-50 backdrop-blur-md">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Validar Solicitudes</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 font-medium italic">Auditoría de nuevos registros finales en la plataforma.</p>
        </div>
        <span className="text-xs font-black text-white bg-green-500 px-4 py-2 rounded-full uppercase tracking-widest shadow-lg shadow-green-500/30">{pending.length} Para Validar</span>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <aside className="w-80 lg:w-[400px] bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 overflow-y-auto p-4 space-y-3 shadow-inner">
          {pending.length > 0 ? pending.map(inst => (
            <div
              key={inst.id}
              onClick={() => setSelectedId(inst.id)}
              className={`p-6 rounded-[2rem] cursor-pointer transition-all border-2 relative overflow-hidden ${selectedId === inst.id
                ? 'bg-primary/5 border-primary shadow-sm'
                : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-900/50'
                }`}
            >
              <div className="absolute top-4 right-4 text-[9px] font-black text-slate-300 uppercase tracking-widest">{inst.otherLink || ''}</div>
              <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-2">{inst.type}</p>
              <h3 className="font-bold text-slate-900 dark:text-white leading-tight">{inst.name}</h3>
              <p className="text-xs text-slate-500 font-medium mt-1">{inst.city}</p>
            </div>
          )) : (
            <div className="p-10 text-center opacity-40">
              <span className="material-symbols-outlined text-5xl mb-2">task_alt</span>
              <p className="text-[10px] font-black uppercase tracking-widest">No hay solicitudes pendientes</p>
            </div>
          )}
        </aside>

        <main className="flex-1 p-6 lg:p-12 bg-slate-50/30 dark:bg-slate-950/20 overflow-y-auto">
          {selected ? (
            <div className="bg-white dark:bg-slate-800 rounded-[3rem] border border-slate-200 dark:border-slate-700 p-10 shadow-xl max-w-3xl mx-auto animate-in zoom-in-95 duration-300 relative">
              {selected.otherLink && (
                <div className="absolute top-8 right-10 bg-slate-100 dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
                  <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest leading-none mb-0.5">Ticket ID</p>
                  <p className="text-sm font-mono font-bold text-slate-600 dark:text-slate-300 leading-none">{selected.otherLink}</p>
                </div>
              )}

              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight pr-20">{selected.name}</h2>
                  <p className="text-sm font-bold text-primary uppercase tracking-widest mt-1">{selected.city} • {selected.responsible}</p>
                </div>
                <div className="size-16 bg-slate-50 dark:bg-slate-900 rounded-3xl flex items-center justify-center text-slate-300">
                  <span className="material-symbols-outlined text-4xl">domain</span>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-[2rem] mb-8">
                <p className="text-[11px] font-black uppercase text-slate-400 tracking-widest mb-3">Descripción de la Actividad</p>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{selected.description || 'Sin descripción detallada proporcionada en el registro inicial.'}</p>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-10">
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Población</p>
                  <p className="text-lg font-black">{selected.coveragePopulation.toLocaleString()} beneficiarios</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Contacto</p>
                  <p className="text-lg font-black">{selected.phone || 'No disponible'}</p>
                </div>
              </div>

              <div className="flex gap-4 pt-6 border-t border-slate-100 dark:border-slate-700">
                <button onClick={handleReject} className="flex-1 py-4 border-2 border-red-100 text-red-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-50 transition-all">Rechazar Registro</button>
                <button onClick={handleApprove} className="flex-[2] py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-blue-800 transition-all active:scale-95">Aprobar para la Red Senda</button>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center opacity-30 text-center">
              <span className="material-symbols-outlined text-8xl mb-4">search_check</span>
              <h2 className="text-xl font-black uppercase tracking-tighter">Selecciona una solicitud</h2>
              <p className="text-sm font-medium">Revisa los detalles antes de dar el alta oficial.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Validar;
