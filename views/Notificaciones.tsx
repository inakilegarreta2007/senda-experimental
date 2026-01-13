
import React, { useState, useEffect } from 'react';
import { Institution, AdminNotification, NotificationType } from '../types';
import { toast } from 'react-hot-toast';

interface NotificacionesProps {
    institutions: Institution[];
    onUpdate: (inst: Institution) => void;
}

const Notificaciones: React.FC<NotificacionesProps> = ({ institutions, onUpdate }) => {
    const [notifications, setNotifications] = useState<AdminNotification[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    // Initial Fetch of "Notifications" (Mixed Sources)
    useEffect(() => {
        const loadNotifications = () => {
            const list: AdminNotification[] = [];

            // 1. Convert Pre-registrations (Institutions with status 'Pendiente') into Notifications
            const pending = institutions.filter(i => i.status === 'Pendiente');
            pending.forEach(inst => {
                list.push({
                    id: `prereg-${inst.id}`,
                    type: NotificationType.NEW_PRE_REGISTER,
                    title: `Nuevo Pre-registro: ${inst.name}`,
                    message: `Solicitud iniciada por ${inst.responsible || 'Usuario Anónimo'}`,
                    date: inst.lastUpdate,
                    read: false,
                    status: 'PENDING',
                    relatedInstitutionId: inst.id,
                    priority: 'MEDIUM',
                    // Pass the institution object itself as payload for easy access
                    dataPayload: inst
                });
            });

            // 2. Mock: Simulate a "Data Update Request"
            list.push({
                id: 'mock-update-req-1',
                type: NotificationType.DATA_UPDATE_REQUEST,
                title: 'Solicitud de Actualización',
                message: 'Comedor Los Pekes solicita cambiar su dirección y teléfono.',
                date: new Date().toISOString(),
                read: false,
                status: 'PENDING',
                relatedInstitutionId: 'mock-inst-id',
                priority: 'HIGH',
                dataPayload: {
                    phone: '342-999-9999',
                    address: 'Calle Nueva 123',
                    description: 'Nueva descripción actualizada desde el portal.'
                }
            });

            // Sort by date desc
            list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

            setNotifications(list);
            if (!selectedId && list.length > 0) setSelectedId(list[0].id);
        };

        loadNotifications();
    }, [institutions]);

    const selected = notifications.find(n => n.id === selectedId);

    // Helper to get Icon based on Type
    const getIcon = (type: NotificationType) => {
        switch (type) {
            case NotificationType.NEW_PRE_REGISTER: return 'person_add';
            case NotificationType.DATA_UPDATE_REQUEST: return 'edit_document';
            case NotificationType.DELETION_REQUEST: return 'delete_forever';
            default: return 'notifications';
        }
    };

    const handleApproveUpdate = (notif: AdminNotification) => {
        if (!confirm('¿Aprobar estos cambios y aplicarlos a la ficha pública?')) return;

        // Emulate DB Update
        toast.promise(
            new Promise(resolve => setTimeout(resolve, 1000)),
            {
                loading: 'Aplicando cambios...',
                success: 'Datos actualizados correctamente',
                error: 'Error al actualizar'
            }
        );

        // Remove from list
        setNotifications(prev => prev.filter(n => n.id !== notif.id));
        setSelectedId(null);
    };

    return (
        <div className="flex flex-col flex-1 h-full overflow-hidden">
            <header className="bg-white/50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 px-6 py-8 flex justify-between items-center sticky top-0 z-50 backdrop-blur-md">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Bandeja de Entrada</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 font-medium italic">Gestión de solicitudes y alertas del sistema.</p>
                </div>
                <span className="text-xs font-black text-white bg-blue-500 px-4 py-2 rounded-full uppercase tracking-widest shadow-lg shadow-blue-500/30">{notifications.length} Pendientes</span>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar List */}
                <aside className="w-80 lg:w-[400px] bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 overflow-y-auto p-4 space-y-3 shadow-inner">
                    {notifications.length > 0 ? notifications.map(notif => (
                        <div
                            key={notif.id}
                            onClick={() => setSelectedId(notif.id)}
                            className={`p-4 rounded-2xl cursor-pointer transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700 relative overflow-hidden group ${selectedId === notif.id
                                ? 'bg-primary/5 border-primary/20 shadow-sm'
                                : 'bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800'
                                }`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div className={`flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${notif.type === NotificationType.DATA_UPDATE_REQUEST ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                                    }`}>
                                    <span className="material-symbols-outlined text-[10px]">{getIcon(notif.type)}</span>
                                    {notif.type === NotificationType.DATA_UPDATE_REQUEST ? 'Cambios' : 'Ingreso'}
                                </div>
                                <span className="text-[10px] text-slate-400 font-bold">{new Date(notif.date).toLocaleDateString()}</span>
                            </div>
                            <h3 className="font-bold text-slate-800 dark:text-white leading-tight mb-1 text-sm">{notif.title}</h3>
                            <p className="text-xs text-slate-500 line-clamp-2">{notif.message}</p>
                        </div>
                    )) : (
                        <div className="p-10 text-center opacity-40">
                            <span className="material-symbols-outlined text-5xl mb-2">inbox</span>
                            <p className="text-[10px] font-black uppercase tracking-widest">Bandeja Vacía</p>
                        </div>
                    )}
                </aside>

                {/* Detail View */}
                <main className="flex-1 p-6 lg:p-12 bg-slate-50/30 dark:bg-slate-950/20 overflow-y-auto">
                    {selected ? (
                        <div className="bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-200 dark:border-slate-700 p-8 shadow-xl max-w-3xl mx-auto animate-in zoom-in-95 duration-300">

                            {/* Header */}
                            <div className="mb-8 pb-6 border-b border-slate-100 dark:border-slate-700">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className={`p-3 rounded-full ${selected.type === NotificationType.DATA_UPDATE_REQUEST ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'
                                        }`}>
                                        <span className="material-symbols-outlined text-xl">{getIcon(selected.type)}</span>
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{selected.title}</h2>
                                        <p className="text-sm text-slate-500 font-medium">{new Date(selected.date).toLocaleString()}</p>
                                    </div>
                                </div>
                                <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed">{selected.message}</p>
                            </div>

                            {/* CONTENT: DATA UPDATE REQUEST */}
                            {selected.type === NotificationType.DATA_UPDATE_REQUEST && (
                                <div className="space-y-6">
                                    <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                                        <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Cambios Propuestos</h4>
                                        <div className="space-y-4">
                                            {Object.entries(selected.dataPayload || {}).map(([key, value]) => (
                                                <div key={key} className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b border-slate-200/50 dark:border-slate-700/50 last:border-0 last:pb-0">
                                                    <div>
                                                        <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">{key} (Actual)</span>
                                                        <p className="text-sm text-slate-500 line-through">Valor Original...</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-[10px] font-bold uppercase text-emerald-500 block mb-1">{key} (Nuevo)</span>
                                                        <p className="text-sm font-bold text-slate-800 dark:text-white bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded inline-block">
                                                            {String(value)}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-3 mt-8">
                                        <button className="px-5 py-2.5 rounded-xl font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-sm">
                                            Rechazar
                                        </button>
                                        <button
                                            onClick={() => handleApproveUpdate(selected)}
                                            className="px-6 py-2.5 rounded-xl bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all text-sm flex items-center gap-2"
                                        >
                                            <span className="material-symbols-outlined text-lg">check</span>
                                            Aprobar Cambios
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* CONTENT: PRE-REGISTRATION */}
                            {selected.type === NotificationType.NEW_PRE_REGISTER && (
                                <div>
                                    <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/20 p-6 rounded-2xl flex gap-4 items-start mb-6">
                                        <span className="material-symbols-outlined text-blue-500 mt-1">info</span>
                                        <div>
                                            <h4 className="font-bold text-blue-800 dark:text-blue-200 text-sm mb-1">Pasos Siguientes</h4>
                                            <p className="text-xs text-blue-700/70 dark:text-blue-300/60 leading-relaxed">
                                                Esta institución ha completado el formulario de interés (Paso 1). Debes contactar al responsable o esperar a que completen la validación final.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 dark:bg-slate-900/50 p-8 rounded-[2.5rem] mb-8">
                                        <div>
                                            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Institución</p>
                                            <p className="font-semibold text-slate-700 dark:text-slate-300">{selected.dataPayload?.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Responsable</p>
                                            <p className="font-semibold text-slate-700 dark:text-slate-300">{selected.dataPayload?.responsible}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Contacto</p>
                                            <p className="font-semibold text-slate-700 dark:text-slate-300 break-words">{selected.dataPayload?.email || selected.dataPayload?.phone}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Ticket ID</p>
                                            <p className="font-mono font-bold text-slate-500">{selected.dataPayload?.otherLink || 'N/A'}</p>
                                        </div>
                                    </div>

                                    <div className="flex justify-end">
                                        <button className="px-5 py-2.5 rounded-xl font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-sm">
                                            Archivar
                                        </button>
                                    </div>
                                </div>
                            )}

                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center opacity-30 text-center">
                            <span className="material-symbols-outlined text-8xl mb-4 text-slate-300 dark:text-slate-600">mark_email_unread</span>
                            <h2 className="text-xl font-black uppercase tracking-tighter text-slate-400 dark:text-slate-500">Selecciona una solicitud</h2>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Notificaciones;
