
import React from 'react';
import { Institution, ImpactCategory, Stats } from '../types';
import Logo from '@/img/logo.png';
import { useNavigate } from 'react-router-dom';
import Footer from '@/components/Footer';
import { useConfig } from '@/contexts/ConfigContext';

interface ImpactoPublicoProps {
  institutions: Institution[];
  stats: Stats;
}

const DEFAULT_IMPACT_CONFIG = {
  title: 'Evidencia del Impacto Social y \nPresencia Territorial Eclesial.',
  subtitle: 'Sistematización de la intervención en la Provincia de Santa Fe: datos reales, trazables y verídicos sobre la cobertura de brechas donde el Estado delega o abandona.',
  showHero: true,
  showStats: true,
};

const ImpactoPublico: React.FC<ImpactoPublicoProps> = ({ institutions, stats }) => {
  const navigate = useNavigate();
  const [impactConfig, setImpactConfig] = React.useState(DEFAULT_IMPACT_CONFIG);

  const loadConfig = () => {
    const stored = localStorage.getItem('senda_site_config');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed?.pages?.impact) {
          setImpactConfig({ ...DEFAULT_IMPACT_CONFIG, ...parsed.pages.impact });
        }
      } catch (e) {
        console.error("Error loading impact config", e);
      }
    }
  };

  React.useEffect(() => {
    loadConfig();
    window.addEventListener('senda_config_update', loadConfig);
    return () => window.removeEventListener('senda_config_update', loadConfig);
  }, []);

  // Agregamos métricas por categoría para el público
  const impactByDimension = Object.values(ImpactCategory).map(cat => {
    const relevant = institutions.filter(i => i.categories?.includes(cat));
    return {
      name: cat,
      count: relevant.length,
      people: relevant.reduce((acc, curr) => acc + curr.coveragePopulation, 0),
      icon: getIconForCategory(cat)
    };
  }).filter(d => d.count > 0);

  function getIconForCategory(cat: ImpactCategory) {
    switch (cat) {
      case ImpactCategory.ALIMENTACION: return 'restaurant';
      case ImpactCategory.EDUCACION: return 'menu_book';
      case ImpactCategory.SALUD: return 'health_and_safety';
      case ImpactCategory.VIVIENDA: return 'home';
      case ImpactCategory.ADICCIONES: return 'psychology';
      case ImpactCategory.NINEZ: return 'child_care';
      case ImpactCategory.ANCIOANOS: return 'elderly';
      case ImpactCategory.ESPIRITUAL: return 'auto_awesome';
      default: return 'stars';
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 font-display flex flex-col">
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 p-6 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button onClick={() => navigate('/')} className="flex items-center gap-3 group">
            <img src={Logo} alt="Senda Logo" className="size-10 group-hover:scale-110 transition-transform" />
            <h1 className="text-xl font-black tracking-tighter uppercase">Registro <span className="text-primary">de NODOS</span></h1>
          </button>
          <button
            onClick={() => navigate('/explorar')}
            className="px-6 py-2.5 bg-primary text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg hover:scale-105 transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">map</span>
            MAPA SENDA
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-6 py-12 space-y-20">
        {/* Hero de Impacto */}
        {impactConfig.showHero && (
          <section className="text-center space-y-6 max-w-4xl mx-auto">
            <div className="inline-block px-4 py-1 bg-primary/5 rounded-full">
              <span className="text-primary font-black uppercase tracking-[0.3em] text-[10px]">Transparencia Activa</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white leading-tight whitespace-pre-line">
              {impactConfig.title}
            </h2>
            <p className="text-xl text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              {impactConfig.subtitle}
            </p>
          </section>
        )}

        {/* Big Numbers */}
        {impactConfig.showStats && (
          <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-10 bg-slate-50 dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 text-center space-y-2 group hover:bg-primary transition-all duration-500 shadow-sm hover:shadow-xl">
              <p className="text-6xl font-black text-primary group-hover:text-white transition-colors">{stats.totalBeneficiaries.toLocaleString()}</p>
              <p className="text-xs font-black uppercase tracking-widest text-slate-400 group-hover:text-white/60">Cobertura de Necesidades Críticas</p>
            </div>
            <div className="p-10 bg-slate-50 dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 text-center space-y-2 group hover:bg-primary transition-all duration-500 shadow-sm hover:shadow-xl">
              <p className="text-6xl font-black text-primary group-hover:text-white transition-colors">{stats.totalInstitutions}</p>
              <p className="text-xs font-black uppercase tracking-widest text-slate-400 group-hover:text-white/60">Dimensiones de Acción Territorial</p>
            </div>
            <div className="p-10 bg-slate-50 dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 text-center space-y-2 group hover:bg-primary transition-all duration-500 shadow-sm hover:shadow-xl">
              <p className="text-6xl font-black text-primary group-hover:text-white transition-colors">{stats.totalVolunteers}</p>
              <p className="text-xs font-black uppercase tracking-widest text-slate-400 group-hover:text-white/60">Capilaridad y Sostenimiento</p>
            </div>
          </section>
        )}

        {/* Dimensiones Humanas */}
        <section className="space-y-12">
          <div className="flex flex-col md:flex-row justify-between items-end gap-4">
            <h3 className="text-3xl font-black tracking-tight">Ejes de Intervención Eclesial</h3>
            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Sistematización por Áreas de Impacto</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {impactByDimension.map((dim) => (
              <div key={dim.name} className="p-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all group">
                <div className="size-14 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all">
                  <span className="material-symbols-outlined text-3xl">{dim.icon}</span>
                </div>
                <h4 className="text-lg font-black text-slate-900 dark:text-white mb-2">{dim.name}</h4>
                <div className="space-y-1">
                  <p className="text-3xl font-black text-primary">{dim.people.toLocaleString()}</p>
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Beneficiarios Directos</p>
                </div>
                <p className="mt-4 text-xs font-bold text-slate-500">Presente en {dim.count} sedes</p>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-slate-900 rounded-[4rem] p-12 md:p-20 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full"></div>
          <div className="relative z-10 flex flex-col items-center text-center space-y-8">
            <h3 className="text-3xl md:text-5xl font-black max-w-2xl">¿Quieres ser parte de esta transformación?</h3>
            <p className="text-white/60 text-lg max-w-xl">
              Cada aporte, por pequeño que parezca, alimenta la red Senda y nos permite llegar a un rincón más de nuestra provincia.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button onClick={() => navigate('/registro')} className="px-10 py-5 bg-white text-slate-900 rounded-2xl font-black text-lg hover:scale-105 transition-all shadow-2xl">
                Sumar Institución
              </button>
              <button onClick={() => navigate('/explorar')} className="px-10 py-5 bg-primary text-white rounded-2xl font-black text-lg hover:scale-105 transition-all shadow-2xl">
                Quiero Colaborar
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer variant="simple" />
    </div>
  );
};

export default ImpactoPublico;
