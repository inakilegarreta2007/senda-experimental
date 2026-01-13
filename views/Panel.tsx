
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Stats, Institution } from '../types';
import CategoryNavbar from '../components/CategoryNavbar';
import { geocodeAddress, generateImpactSummary } from '@/geminiService';
import { toast } from 'react-hot-toast';
import { SkeletonList, Skeleton } from '../components/Skeleton';

interface PanelProps {
  stats: Stats;
  institutions: Institution[];
  onUpdate: (inst: Institution) => void;
  onDelete: (id: string) => void;
  loading?: boolean;
}

const Panel: React.FC<PanelProps> = ({ stats, institutions, onUpdate, onDelete, loading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingInst, setEditingInst] = useState<Institution | null>(null);
  const [lastSyncedAddr, setLastSyncedAddr] = useState('');
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);
  const [aiSummary, setAiSummary] = useState<string>('');
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingInstId, setDeletingInstId] = useState<string | null>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      if (stats.totalInstitutions > 0) {
        setIsSummaryLoading(true);
        const summary = await generateImpactSummary(stats);
        setAiSummary(summary);
        setIsSummaryLoading(false);
      }
    };
    fetchSummary();
  }, [stats.totalInstitutions]);

  const filteredInstitutions = useMemo(() => institutions
    .filter(i => i.status !== 'Inactivo' && i.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .slice(0, 8), [institutions, searchTerm]);

  const openEditModal = (inst: Institution) => {
    setEditingInst({ ...inst });
    const currentAddr = `${inst.address} ${inst.addressNumber}, ${inst.city}`;
    setLastSyncedAddr(currentAddr);
    setSyncSuccess(false);
    setIsEditModalOpen(true);
  };

  const currentFormAddr = editingInst ? `${editingInst.address} ${editingInst.addressNumber}, ${editingInst.city}` : '';
  const isSyncRequired = editingInst && currentFormAddr !== lastSyncedAddr;

  const handleAutoGeocode = async () => {
    if (!editingInst) return;
    const { address, addressNumber, city, province } = editingInst;

    if (!address || !addressNumber || !city) {
      toast.error("Datos incompletos para geolocalizar");
      return;
    }

    setIsGeocoding(true);
    setSyncSuccess(false);

    try {
      const coords = await geocodeAddress(
        address,
        addressNumber,
        city,
        province || 'Santa Fe',
        editingInst.zipCode
      );

      if (!coords) {
        throw new Error("No se pudieron obtener las coordenadas.");
      }

      setEditingInst(prev => prev ? {
        ...prev,
        lat: coords.lat,
        lng: coords.lng
      } : null);

      setLastSyncedAddr(`${address} ${addressNumber}, ${city}`);
      setSyncSuccess(true);
      toast.success("Coordenadas actualizadas");
      // Feedback visual de éxito por 2 segundos
      setTimeout(() => setSyncSuccess(false), 2000);
    } catch (error) {
      console.error(error);
      toast.error("Error al sincronizar coordenadas.");
    } finally {
      setIsGeocoding(false);
    }
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingInst) {
      onUpdate({
        ...editingInst,
        lastUpdate: new Date().toLocaleDateString('es-AR')
      });
      setIsEditModalOpen(false);
      setEditingInst(null);
      toast.success('Institución actualizada');
    }
  };

  const confirmDelete = (id: string) => {
    setDeletingInstId(id);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = () => {
    if (deletingInstId) {
      onDelete(deletingInstId);
      setIsDeleteModalOpen(false);
      setDeletingInstId(null);
      toast.success('Institución eliminada');
    }
  };

  const handleExport = () => {
    try {
      toast.loading('Generando CSV...', { id: 'export' });

      const headers = ['ID', 'Nombre', 'Tipo', 'Ciudad', 'Dirección', 'Provincia', 'Responsable', 'Teléfono', 'WhatsApp', 'Email', 'CUIT', 'Beneficiarios', 'Estado', 'Lat', 'Lng'];
      const rows = institutions.map(inst => [
        inst.id,
        `"${inst.name}"`,
        `"${inst.type}"`,
        `"${inst.city}"`,
        `"${inst.address} ${inst.addressNumber}"`,
        `"${inst.province}"`,
        `"${inst.responsible}"`,
        `"${inst.phone}"`,
        `"${inst.whatsapp}"`,
        `"${inst.email}"`,
        `"${inst.cuit}"`,
        inst.coveragePopulation,
        `"${inst.status}"`,
        inst.lat,
        inst.lng
      ]);

      const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.setAttribute("href", url);
      link.setAttribute("download", `Red_Senda_Export_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('Reporte descargado', { id: 'export' });
    } catch (err) {
      console.error(err);
      toast.error('Error al exportar datos', { id: 'export' });
    }
  };

  return (
    <div className="flex flex-col flex-1 min-h-full">
      <header className="p-6 md:p-8 flex justify-between items-end border-b border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 sticky top-0 z-30 backdrop-blur-md">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Panel Senda</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 font-medium">Gestión de impacto y sedes.</p>
        </div>
        <div className="flex gap-3 items-center">
          <button onClick={handleExport} className="hidden lg:flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-50 transition-all">
            <span className="material-symbols-outlined text-[20px]">download</span> Exportar
          </button>
          <div className="relative hidden md:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">search</span>
            <input
              type="text"
              placeholder="Buscar..."
              className="pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-xs font-bold focus:ring-1 focus:ring-primary w-48 lg:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <CategoryNavbar />
        </div>
      </header>

      <section className="p-6 md:p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon="domain" color="blue" label="Nodos" value={stats.totalInstitutions} />
        <StatCard icon="campaign" color="red" label="Ayuda Req." value={stats.activeRequests} />
        <StatCard icon="diversity_1" color="indigo" label="Beneficiarios" value={stats.totalBeneficiaries.toLocaleString()} />
        <StatCard icon="pending_actions" color="amber" label="Por Validar" value={stats.pendingValidations} />
      </section>

      <section className="px-6 md:px-8 pb-8">
        <div className="bg-gradient-to-br from-primary/10 to-indigo-500/5 dark:from-primary/20 dark:to-indigo-500/10 rounded-[2.5rem] p-8 border border-primary/10 dark:border-primary/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <span className="material-symbols-outlined text-[120px] text-primary">auto_awesome</span>
          </div>
          <div className="relative z-10">
            <h3 className="text-primary font-black uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">auto_awesome</span>
              Resumen de Impacto IA
            </h3>
            {isSummaryLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ) : (
              <p className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed max-w-3xl italic">
                "{aiSummary || 'Analizando impacto de la red...'}"
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="px-6 md:px-8 pb-10 flex-1">
        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
            <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">edit_note</span>
              Red Territorial Senda
            </h2>
            <Link to="/admin/institutions" className="text-xs font-black text-primary uppercase tracking-widest hover:underline">Ver todas</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Nodo</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Ubicación</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Estado</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="p-6">
                      <SkeletonList />
                    </td>
                  </tr>
                ) : (
                  filteredInstitutions.map(inst => (
                    <tr key={inst.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/20 transition-colors group">
                      <td className="px-6 py-4">
                        <p className="font-bold text-sm text-slate-800 dark:text-slate-200">{inst.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">{inst.type}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-[11px] text-slate-500 font-medium">
                          {inst.address} {inst.addressNumber}, {inst.city}
                        </p>
                        <p className="text-[9px] text-slate-400">Lat: {inst.lat?.toFixed(4)} Lng: {inst.lng?.toFixed(4)}</p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-2 py-1 rounded-full text-[9px] font-black uppercase ${inst.status === 'Activo' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                          }`}>
                          {inst.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openEditModal(inst)}
                            className="text-slate-400 hover:text-primary transition-colors p-2 hover:bg-primary/5 rounded-lg"
                          >
                            <span className="material-symbols-outlined text-[18px]">edit</span>
                          </button>
                          <Link to={`/admin/details/${inst.id}`} className="text-slate-400 hover:text-indigo-600 transition-colors p-2 hover:bg-indigo-50 rounded-lg">
                            <span className="material-symbols-outlined text-[18px]">visibility</span>
                          </Link>
                          <button
                            onClick={() => confirmDelete(inst.id)}
                            className="text-slate-400 hover:text-red-600 transition-colors p-2 hover:bg-red-50 rounded-lg"
                            title="Eliminar"
                          >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* MODAL DE EDICIÓN CON GEOLOCALIZACIÓN FORZADA */}
      {isEditModalOpen && editingInst && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-800 w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">Actualizar Nodo</h2>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-red-500 p-2 transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest ml-1">Nombre</label>
                  <input
                    required
                    type="text"
                    className="w-full px-5 py-3 rounded-2xl bg-slate-100 dark:bg-slate-900 border-none focus:ring-2 focus:ring-primary dark:text-white font-bold"
                    value={editingInst.name}
                    onChange={e => setEditingInst({ ...editingInst, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest ml-1">Estado</label>
                  <select
                    className="w-full px-5 py-3 rounded-2xl bg-slate-100 dark:bg-slate-900 border-none focus:ring-2 focus:ring-primary dark:text-white font-black"
                    value={editingInst.status}
                    onChange={e => setEditingInst({ ...editingInst, status: e.target.value as any })}
                  >
                    <option value="Activo">🟢 Activo</option>
                    <option value="Ayuda Req.">🔴 Ayuda Req.</option>
                    <option value="Pendiente">🟡 Pendiente</option>
                  </select>
                </div>
              </div>

              {/* DIRECCIÓN REAL (IA) */}
              <div className={`space-y-4 p-6 rounded-[2.5rem] border transition-all ${isSyncRequired ? 'bg-amber-50 border-amber-200' : 'bg-slate-50 dark:bg-slate-900/50 border-slate-100 dark:border-slate-800'}`}>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">map</span>
                    Ubicación Territorial
                  </h3>
                  <button
                    type="button"
                    onClick={handleAutoGeocode}
                    disabled={isGeocoding}
                    className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl transition-all flex items-center gap-2 shadow-md ${syncSuccess ? 'bg-green-500 text-white' : (isSyncRequired ? 'bg-amber-500 text-white animate-pulse' : 'bg-primary text-white')
                      }`}
                  >
                    {isGeocoding ? (
                      <span className="material-symbols-outlined text-[14px] animate-spin">progress_activity</span>
                    ) : (
                      <span className="material-symbols-outlined text-[14px]">{syncSuccess ? 'check_circle' : 'bolt'}</span>
                    )}
                    {isGeocoding ? 'Sincronizando...' : (syncSuccess ? '¡Sincronizado!' : (isSyncRequired ? 'Sincronizar nueva dirección' : 'Ubicación Sincronizada'))}
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Localidad</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border-none focus:ring-1 focus:ring-primary text-sm dark:text-white"
                      value={editingInst.city}
                      onChange={e => setEditingInst({ ...editingInst, city: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">C.P.</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border-none focus:ring-1 focus:ring-primary text-sm dark:text-white"
                      value={editingInst.zipCode || ''}
                      onChange={e => setEditingInst({ ...editingInst, zipCode: e.target.value })}
                    />
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1 space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Calle</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border-none focus:ring-1 focus:ring-primary text-sm dark:text-white"
                        value={editingInst.address}
                        onChange={e => setEditingInst({ ...editingInst, address: e.target.value })}
                      />
                    </div>
                    <div className="w-20 space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nº</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border-none focus:ring-1 focus:ring-primary text-sm dark:text-white"
                        value={editingInst.addressNumber}
                        onChange={e => setEditingInst({ ...editingInst, addressNumber: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex justify-between items-center px-4 py-2 bg-slate-100 dark:bg-slate-900 rounded-lg">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Lat (IA)</span>
                    <span className="text-xs font-mono text-slate-600">{editingInst.lat?.toFixed(5) || '---'}</span>
                  </div>
                  <div className="flex justify-between items-center px-4 py-2 bg-slate-100 dark:bg-slate-900 rounded-lg">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Lng (IA)</span>
                    <span className="text-xs font-mono text-slate-600">{editingInst.lng?.toFixed(5) || '---'}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 py-4 rounded-2xl border-2 border-slate-100 dark:border-slate-700 font-black text-xs uppercase tracking-widest text-slate-400"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSyncRequired && !syncSuccess}
                  title={isSyncRequired ? "Debes sincronizar la nueva dirección primero" : ""}
                  className={`flex-[2] py-4 rounded-2xl text-white font-black text-xs uppercase tracking-[0.2em] shadow-xl transition-all ${isSyncRequired && !syncSuccess ? 'bg-slate-400 cursor-not-allowed' : 'bg-primary hover:bg-blue-800 active:scale-95'
                    }`}
                >
                  Confirmar y Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE CONFIRMACIÓN DE ELIMINACIÓN */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[210] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 p-8 text-center">
            <div className="size-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-3xl">warning</span>
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">¿Eliminar Nodo?</h3>
            <p className="text-slate-500 font-medium mb-8">Esta acción no se puede deshacer. El nodo será eliminado permanentemente de la red.</p>
            <div className="flex gap-4">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 py-3 rounded-xl border-2 border-slate-100 dark:border-slate-700 font-black text-xs uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-3 rounded-xl bg-red-500 text-white font-black text-xs uppercase tracking-widest shadow-xl hover:bg-red-600 transition-all active:scale-95"
              >
                Sí, Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ icon, color, label, value }: any) => {
  const colorMap: any = {
    blue: "bg-blue-50 text-blue-600",
    red: "bg-red-50 text-red-600",
    indigo: "bg-indigo-50 text-indigo-600",
    amber: "bg-amber-50 text-amber-600"
  };
  return (
    <div className="bg-white dark:bg-slate-800 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-700 shadow-sm transition-all group">
      <div className="flex justify-between items-start mb-6">
        <div className={`p-4 rounded-2xl ${colorMap[color]}`}>
          <span className="material-symbols-outlined text-[28px]">{icon}</span>
        </div>
      </div>
      <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">{label}</p>
      <p className="text-4xl font-black text-slate-900 dark:text-white leading-none tracking-tight">{value}</p>
    </div>
  );
};

export default Panel;
