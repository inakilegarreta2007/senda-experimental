
import React, { useState } from 'react';
import { Institution, ImpactCategory } from '../types';

interface ObservatorioProps {
  institutions: Institution[];
}

const Observatorio: React.FC<ObservatorioProps> = ({ institutions }) => {
  const [filterCategory, setFilterCategory] = useState<ImpactCategory | 'ALL'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const data = institutions.filter(inst => {
    const matchesCategory = filterCategory === 'ALL' || inst.categories?.includes(filterCategory);
    const matchesSearch = inst.name.toLowerCase().includes(searchTerm.toLowerCase()) || inst.city.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch && inst.status !== 'Inactivo';
  });

  const statsByCategory = Object.values(ImpactCategory).map(cat => ({
    name: cat,
    count: institutions.filter(i => i.categories?.includes(cat)).length,
    beneficiaries: institutions.filter(i => i.categories?.includes(cat)).reduce((acc, curr) => acc + curr.coveragePopulation, 0)
  }));

  return (
    <div className="flex flex-col flex-1 h-full bg-slate-50 dark:bg-slate-950/20 font-display">
      <header className="p-8 border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 sticky top-0 z-30 backdrop-blur-md">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">Observatorio Técnico Eclesial</h1>
            <p className="text-slate-500 font-medium mt-1">Auditoría social y sistematización de la capilaridad territorial en la Provincia de Santa Fe.</p>
          </div>
          <div className="flex gap-3">
            <div className="bg-primary text-white px-6 py-4 rounded-3xl shadow-xl flex items-center gap-4">
              <span className="material-symbols-outlined text-3xl">database</span>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Registros de Verdad</p>
                <p className="text-2xl font-black">{institutions.length}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="p-8 space-y-8 overflow-y-auto">
        {/* Dash de Categorías */}
        <section className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {statsByCategory.map(stat => (
            <button
              key={stat.name}
              onClick={() => setFilterCategory(stat.name === filterCategory ? 'ALL' : stat.name)}
              className={`p-4 rounded-2xl border transition-all flex flex-col items-center text-center gap-2 ${filterCategory === stat.name
                  ? 'bg-primary border-primary text-white shadow-lg scale-105'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-primary/30'
                }`}
            >
              <p className="text-[9px] font-black uppercase tracking-tighter leading-tight h-8 flex items-center">{stat.name}</p>
              <p className="text-xl font-black">{stat.count}</p>
            </button>
          ))}
        </section>

        <div className="bg-white dark:bg-slate-800 rounded-[3rem] border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex flex-col md:flex-row justify-between gap-4">
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
              <input
                type="text"
                placeholder="Filtrar base de datos..."
                className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl focus:ring-2 focus:ring-primary dark:text-white"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Institución / Centro</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Brechas Críticas (Áreas)</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Impacto (Población)</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Gestión Voluntaria</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Localidad</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {data.map(inst => (
                  <tr key={inst.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-colors">
                    <td className="px-6 py-5">
                      <p className="font-black text-slate-900 dark:text-white text-sm">{inst.name}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">{inst.type}</p>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-wrap gap-1">
                        {inst.categories?.map(cat => (
                          <span key={cat} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-[9px] font-black uppercase">
                            {cat}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className="font-black text-primary">{inst.coveragePopulation.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-5 text-center text-xs font-bold text-slate-500">
                      {inst.volunteersCount || '-'}
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-xs font-bold text-slate-500">{inst.city}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Observatorio;
