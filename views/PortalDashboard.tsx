import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { mockInstitutions } from '@/utils/mockData';
import { Institution } from '../types';

const PortalDashboard: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [myNode, setMyNode] = useState<Institution | null>(null);
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        // FETCH LOGIC
        const checkLink = async () => {
            setIsChecking(true);
            const linkedId = user?.user_metadata?.institution_id;

            // Artificial delay for smooth UX
            await new Promise(r => setTimeout(r, 800));

            if (linkedId) {
                const found = mockInstitutions.find(i => i.id === linkedId);
                setMyNode(found || null);
            } else {
                setMyNode(null);
            }
            setIsChecking(false);
        };

        checkLink();
    }, [user]);

    // LOADING STATE
    if (isChecking) return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            <p className="text-xs font-black uppercase tracking-widest text-slate-400">Verificando Credenciales...</p>
        </div>
    );

    // WAITING ROOM (NO LINK)
    if (!myNode) return (
        <div className="min-h-[80vh] flex items-center justify-center p-6 font-display bg-slate-50/50 dark:bg-slate-950/50">
            <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 p-10 text-center relative overflow-hidden">
                {/* Decorative BG */}
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-amber-50 to-transparent dark:from-amber-900/20 pointer-events-none"></div>

                <div className="relative z-10">
                    <div className="size-24 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl shadow-inner">
                        🙏
                    </div>

                    <h1 className="text-2xl font-black text-slate-800 dark:text-white mb-4">
                        ¡Hola! Qué bueno tenerte acá.
                    </h1>

                    <div className="space-y-4 text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
                        <p>
                            Ya estás dentro de la familia <strong>SENDA</strong>, pero todavía nos falta un pasito importante.
                        </p>
                        <p className="italic font-medium text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 p-4 rounded-2xl border border-amber-100 dark:border-amber-800/50">
                            "La paciencia todo lo alcanza. Quien a Dios tiene nada le falta."
                        </p>
                        <p>
                            Un administrador está revisando tu solicitud para asignarte tu <strong>Misión (Nodo)</strong>. En cuanto te vinculen con tu parroquia o comedor, este panel se va a iluminar automáticamente para que puedas empezar a trabajar.
                        </p>
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-4">
                            Mientras tanto...
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="w-full py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                        >
                            <span className="material-symbols-outlined">refresh</span>
                            Verificar si ya me dieron el alta
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    // DASHBOARD (LINKED)

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] bg-slate-50/50 dark:bg-slate-950/50 font-display p-6">

            {/* MAIN CARD */}
            <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden relative">

                {/* Decorative Background Blur */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                <div className="p-8 md:p-12 relative z-10">

                    {/* HEADER: Identity & Status */}
                    <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left justify-between gap-6 mb-12">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest border border-emerald-100 mb-3">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                                Nodo Activo
                            </div>
                            <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                                {myNode.name}
                            </h1>
                            <p className="text-slate-500 font-medium mt-2 max-w-md mx-auto md:mx-0">
                                {myNode.city}, {myNode.province}
                            </p>
                        </div>

                        {/* Quick Stats Widget (Mocked for aesthetics) */}
                        <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800 p-3 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                            <div className="text-center px-2">
                                <span className="block text-xl font-black text-slate-800 dark:text-white">{myNode.volunteersCount}</span>
                                <span className="text-[9px] text-slate-400 uppercase font-black tracking-wider">Voluntarios</span>
                            </div>
                            <div className="w-px h-8 bg-slate-200 dark:bg-slate-700"></div>
                            <div className="text-center px-2">
                                <span className="block text-xl font-black text-slate-800 dark:text-white">Active</span>
                                <span className="text-[9px] text-slate-400 uppercase font-black tracking-wider">Estado</span>
                            </div>
                        </div>
                    </div>

                    {/* ACTION GRID */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        {/* Primary Action: Visual Edit */}
                        <Link to="/portal/view" className="group relative overflow-hidden bg-slate-900 dark:bg-white text-white dark:text-slate-900 p-6 rounded-3xl col-span-1 md:col-span-2 shadow-xl shadow-slate-900/10 hover:shadow-2xl hover:scale-[1.01] transition-all">
                            <div className="relative z-10 flex flex-col h-full justify-between min-h-[140px]">
                                <div className="size-12 rounded-2xl bg-white/20 dark:bg-slate-900/10 flex items-center justify-center text-2xl backdrop-blur-sm mb-4">
                                    ✏️
                                </div>
                                <div>
                                    <h3 className="text-xl font-black uppercase tracking-tight">Gestionar Ficha Pública</h3>
                                    <p className="text-white/70 dark:text-slate-600/80 text-sm font-medium mt-1">
                                        Editar teléfonos, horarios y descripción directamente sobre la vista pública.
                                    </p>
                                </div>
                            </div>
                            {/* Hover Effect */}
                            <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-4 group-hover:translate-x-0 duration-300">
                                <span className="material-symbols-outlined text-4xl">arrow_forward</span>
                            </div>
                        </Link>

                        {/* Secondary: Profile/Config */}
                        <Link to="/portal/profile" className="group bg-slate-50 dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 hover:border-primary/50 hover:bg-white dark:hover:bg-slate-700 transition-all">
                            <div className="flex items-center justify-between mb-8">
                                <div className="size-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                    <span className="material-symbols-outlined">id_card</span>
                                </div>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800 dark:text-white">Datos de Identidad</h4>
                                <p className="text-xs text-slate-400 font-medium mt-1 group-hover:text-slate-500">Configuración interna y legal</p>
                            </div>
                        </Link>

                        {/* Secondary: Support */}
                        <button className="group text-left bg-slate-50 dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 hover:border-primary/50 hover:bg-white dark:hover:bg-slate-700 transition-all">
                            <div className="flex items-center justify-between mb-8">
                                <div className="size-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                                    <span className="material-symbols-outlined">support_agent</span>
                                </div>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800 dark:text-white">Soporte SENDA</h4>
                                <p className="text-xs text-slate-400 font-medium mt-1 group-hover:text-slate-500">Contactar a un administrador</p>
                            </div>
                        </button>

                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                            SENDA NODE MANAGEMENT SYSTEM v1.0
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default PortalDashboard;
