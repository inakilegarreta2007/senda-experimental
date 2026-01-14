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
        <div className="min-h-[80vh] flex flex-col items-center justify-center gap-4 bg-slate-50 dark:bg-slate-950">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary"></div>
            <p className="text-xs font-black uppercase tracking-widest text-primary/70">Verificando Credenciales...</p>
        </div>
    );

    // ERROR STATE (HAS ID BUT NOT FOUND IN DATA)
    if (!myNode) return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
            <div className="size-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-3xl">error_outline</span>
            </div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Error de Vinculación</h2>
            <p className="text-slate-500 max-w-sm mb-6">
                Su cuenta tiene un ID de nodo asignado, pero no pudimos recuperar los datos. Por favor, contacte a soporte.
            </p>
            <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-slate-900 text-white rounded-lg font-bold text-sm hover:bg-slate-800 transition-colors"
            >
                Reintentar
            </button>
        </div>
    );

    // DASHBOARD (LINKED)
    return (
        <div className="flex flex-col items-center min-h-[85vh] bg-slate-50 dark:bg-slate-950 font-display p-4 md:p-8">

            {/* MAIN DASHBOARD CONTAINER */}
            <div className="w-full max-w-4xl">

                {/* WELCOME BANNER */}
                <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary to-[#004b87] text-white shadow-2xl shadow-primary/20 mb-8">
                    {/* Background Pattern */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-celeste/20 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/3 pointer-events-none"></div>

                    <div className="relative z-10 p-8 md:p-10 flex flex-col md:flex-row items-center md:items-end justify-between gap-6">
                        <div className="flex-1 text-center md:text-left">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-widest shadow-lg mb-4">
                                <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
                                Nodo Pastoral Activo
                            </div>
                            <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">
                                {myNode.name}
                            </h1>
                            <div className="flex items-center justify-center md:justify-start gap-2 text-celeste font-medium">
                                <span className="material-symbols-outlined text-lg">location_on</span>
                                {myNode.city}, {myNode.province}
                            </div>
                        </div>

                        {/* Quick Stats in Banner */}
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex items-center gap-6 shadow-inner">
                            <div className="text-center">
                                <span className="block text-2xl font-black text-white">{myNode.volunteersCount}</span>
                                <span className="text-[10px] text-celeste uppercase font-bold tracking-wider">Voluntarios</span>
                            </div>
                            <div className="w-px h-8 bg-white/20"></div>
                            <div className="text-center">
                                <span className="block text-2xl font-black text-accent">100%</span>
                                <span className="text-[10px] text-celeste uppercase font-bold tracking-wider">Impacto</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* GRID SYSTEM */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* LEFT COLUMN: PRIMARY ACTIONS */}
                    <div className="md:col-span-2 space-y-6">

                        {/* MAIN ACTION CARD */}
                        <Link to="/portal/view" className="group relative block bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500">
                                <span className="material-symbols-outlined text-8xl text-slate-50 dark:text-slate-800">edit_document</span>
                            </div>

                            <div className="relative z-10">
                                <div className="size-14 rounded-2xl bg-primary/5 text-primary flex items-center justify-center text-3xl mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                    <span className="material-symbols-outlined">edit</span>
                                </div>
                                <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-2">
                                    Gestionar Ficha Institucional
                                </h3>
                                <p className="text-slate-500 font-medium leading-relaxed max-w-md">
                                    Actualice los horarios de misa, servicios de caridad, y datos de contacto visibles en el mapa nacional.
                                </p>
                                <div className="mt-6 inline-flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wide group-hover:gap-4 transition-all">
                                    Ingresar al Editor <span className="material-symbols-outlined">arrow_forward</span>
                                </div>
                            </div>
                        </Link>

                        {/* SECONDARY ACTIONS GRID */}
                        <div className="grid grid-cols-2 gap-4">
                            <Link to="/portal/profile" className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800 hover:border-celeste/30 transition-all group">
                                <div className="mb-4 text-slate-400 group-hover:text-secondary transition-colors">
                                    <span className="material-symbols-outlined text-3xl">verified_user</span>
                                </div>
                                <h4 className="font-bold text-slate-800 dark:text-white text-lg">Credenciales</h4>
                                <p className="text-xs text-slate-500 mt-1">Datos legales y de acceso</p>
                            </Link>

                            <button className="text-left bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800 hover:border-accent/30 transition-all group">
                                <div className="mb-4 text-slate-400 group-hover:text-accent transition-colors">
                                    <span className="material-symbols-outlined text-3xl">volunteer_activism</span>
                                </div>
                                <h4 className="font-bold text-slate-800 dark:text-white text-lg">Recursos</h4>
                                <p className="text-xs text-slate-500 mt-1">Material pastoral y guías</p>
                            </button>
                        </div>

                    </div>

                    {/* RIGHT COLUMN: INFO WIDGETS */}
                    <div className="space-y-6">

                        {/* LITURGICAL WIDGET */}
                        <div className="bg-[#002B55] text-white rounded-[2rem] p-6 relative overflow-hidden shadow-lg">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-4 opacity-80">
                                    <span className="material-symbols-outlined text-accent">calendar_month</span>
                                    <span className="text-xs font-bold uppercase tracking-widest">Liturgia de Hoy</span>
                                </div>
                                <h3 className="text-xl font-bold italic font-serif leading-tight mb-4 text-white/90">
                                    "Vayan y hagan discípulos a todas las naciones."
                                </h3>
                                <div className="text-sm font-medium text-celeste">
                                    Mateo 28, 19
                                </div>
                            </div>
                        </div>

                        {/* SUPPORT WIDGET */}
                        <button className="w-full bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-slate-100 dark:border-slate-800 shadow-lg shadow-slate-200/50 dark:shadow-none text-left group hover:ring-2 ring-primary/10 transition-all">
                            <div className="flex items-center justify-between mb-4">
                                <div className="size-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 group-hover:bg-primary group-hover:text-white transition-colors">
                                    <span className="material-symbols-outlined">support_agent</span>
                                </div>
                                <span className="px-2 py-1 rounded-md bg-slate-50 text-[10px] font-bold uppercase text-slate-400">Ayuda</span>
                            </div>
                            <h4 className="font-bold text-slate-800 dark:text-white">Mesa de Ayuda</h4>
                            <p className="text-xs text-slate-500 mt-1">Contacte al equipo central SENDA</p>
                        </button>

                    </div>

                </div>

                <div className="mt-12 text-center">
                    <p className="text-[10px] text-slate-300 dark:text-slate-700 uppercase tracking-[0.2em] font-bold">
                        Senda Intervención Social Eclesial
                    </p>
                </div>

            </div>
        </div>
    );
};

export default PortalDashboard;
