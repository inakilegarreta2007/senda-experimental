
import React, { useState, useEffect, useRef } from 'react';
import { Institution, NotificationType, UserRole } from '../types';
import L from 'leaflet';
import Logo from '@/img/logo.png';
import { mockInstitutions } from '@/utils/mockData';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/supabaseClient';

// Reusing style from Info.tsx but with Edit capabilities
// "PortalNodeView" acts as the self-management dashboard for a node rep.

const PortalNodeView: React.FC = () => {
    const { user } = useAuth();
    // 1. Fetch "My Institution"
    const [inst, setInst] = useState<Institution | null>(null);
    const [loading, setLoading] = useState(true);
    const miniMapRef = useRef<HTMLDivElement>(null);

    // SECURITY PROTOCOL: FETCH ONLY LINKED NODE
    useEffect(() => {
        const fetchLinkedNode = async () => {
            setLoading(true);
            const linkId = user?.user_metadata?.institution_id;

            if (!linkId) {
                console.warn("Usuario Referente sin ID de Institución vinculado.");
                setLoading(false);
                return;
            }

            // 1. Try fetching from Real DB
            const { data } = await supabase.from('institutions').select('*').eq('id', linkId).single();

            if (data) {
                // Map DB data (omitted for brevity, using mock for DEV continuity if DB fails/is empty)
                // In prod, map 'data' to 'Institution' type here.
            }

            // 2. Fallback to Mock Data for Development using the STRICT ID
            const found = mockInstitutions.find(i => i.id === linkId);
            if (found) {
                setInst(found);
            } else {
                toast.error("Error crítico: El nodo vinculado no existe.");
            }
            setLoading(false);
        };

        if (user) fetchLinkedNode();
    }, [user]);

    // Map Effect
    useEffect(() => {
        if (miniMapRef.current && inst && inst.lat && inst.lng) {
            const map = L.map(miniMapRef.current, {
                zoomControl: false,
                attributionControl: false,
                scrollWheelZoom: false,
                dragging: false,
                touchZoom: false
            }).setView([inst.lat, inst.lng], 15);

            L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
                subdomains: 'abcd',
                maxZoom: 20
            }).addTo(map);

            L.marker([inst.lat, inst.lng], {
                icon: L.divIcon({
                    className: 'custom-div-icon',
                    html: `<div class="bg-primary text-white p-2 rounded-full shadow-lg border-2 border-white flex items-center justify-center transform scale-110"><span class="material-symbols-outlined text-[16px]">location_on</span></div>`,
                    iconSize: [32, 32],
                    iconAnchor: [16, 16]
                })
            }).addTo(map);

            return () => { map.remove(); };
        }
    }, [inst]);

    // 2. Edit Logic
    const [editingField, setEditingField] = useState<keyof Institution | 'socials' | null>(null);
    const [tempValue, setTempValue] = useState<any>('');

    const handleEdit = (field: keyof Institution | 'socials', currentValue: any) => {
        setEditingField(field);
        setTempValue(currentValue);
    };

    const handleCancel = () => {
        setEditingField(null);
        setTempValue('');
    };

    const handleSave = (field: keyof Institution | 'socials') => {
        if (!inst) return;

        // Simulate Request
        const changeRequest = {
            type: NotificationType.DATA_UPDATE_REQUEST,
            title: `Cambio en ${field}`,
            message: `El nodo solicita cambiar ${field}.`,
            relatedInstitutionId: inst.id,
            payload: { [field]: tempValue }
        };

        console.log('🚀 [PORTAL] Solicitud Contextual:', changeRequest);

        toast.success(`Solicitud de cambio enviada para: ${field}`, {
            icon: 'outbox',
            style: { background: '#333', color: '#fff' }
        });

        setEditingField(null);
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
    );

    if (!inst) return (
        <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-slate-50 dark:bg-slate-950">
            <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">link_off</span>
            <h1 className="text-2xl font-black text-slate-800 dark:text-white mb-2">Cuenta No Vinculada</h1>
            <p className="text-slate-500 max-w-md mx-auto mb-6">
                Tu usuario tiene permisos de Referente, pero aún no ha sido vinculado a ninguna Institución específica en el sistema.
            </p>
            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200 rounded-xl border border-amber-100 dark:border-amber-800/30 text-sm font-bold">
                ⚠️ Protocolo de Seguridad: La vinculación debe ser aprobada manualmente por un Administrador.
            </div>
        </div>
    );

    const shareText = `¡Mirá esta institución en la Red SENDA!\n*${inst.name}*\n${inst.description.substring(0, 100)}...`;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-display flex flex-col pb-20">

            {/* Header / Nav is handled by Layout, but let's add a local header */}
            <header className="px-6 py-8 md:px-12 md:py-10">
                <div className="flex items-center gap-3 mb-2">
                    <span className="material-symbols-outlined text-primary text-3xl">verified_user</span>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Mi Nodo</h1>
                </div>
                <p className="text-slate-500 font-medium">Así ven tu institución los visitantes. Pulsa el lápiz para sugerir cambios.</p>
            </header>

            <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-8 space-y-8">
                {/* Banner Hero Section Refinado */}
                <div className="relative rounded-[2.5rem] overflow-hidden bg-white dark:bg-slate-900 shadow-xl border border-slate-100 dark:border-slate-800 group">

                    {/* Imagen de Fondo */}
                    <div className="h-64 md:h-80 w-full bg-slate-200 relative overflow-hidden group/img">
                        {/* EDIT BUTTON: IMAGE */}
                        <button
                            onClick={() => toast('Funcionalidad de subir imagen pendiente...', { icon: 'construction' })}
                            className="absolute top-4 right-4 z-20 bg-white/20 hover:bg-white text-white hover:text-primary backdrop-blur-md px-4 py-2 rounded-full font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-2 group-hover/img:opacity-100 opacity-0"
                        >
                            <span className="material-symbols-outlined text-sm">edit</span> Cambiar Portada
                        </button>

                        {inst.image ? (
                            <img src={inst.image} alt={inst.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-primary/20 via-primary/5 to-slate-50 flex items-center justify-center">
                                <img src={Logo} alt="Senda" className="h-32 opacity-10 grayscale mix-blend-multiply" />
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent"></div>
                    </div>

                    {/* Contenido Principal */}
                    <div className="relative px-6 md:px-10 pb-8 -mt-20 flex flex-col md:flex-row gap-6 md:items-end z-10">
                        {/* Avatar */}
                        <div className="size-28 md:size-40 rounded-3xl bg-white dark:bg-slate-800 shadow-2xl flex items-center justify-center border-[6px] border-white dark:border-slate-800 overflow-hidden shrink-0 mx-auto md:mx-0 relative group/avatar">
                            {/* EDIT BUTTON: LOGO */}
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-all cursor-pointer">
                                <span className="material-symbols-outlined text-white">photo_camera</span>
                            </div>
                            {inst.image ? (
                                <img src={inst.image} alt="Logo" className="w-full h-full object-cover" />
                            ) : (
                                <span className="material-symbols-outlined text-5xl text-slate-300">storefront</span>
                            )}
                        </div>

                        {/* Información y Botones */}
                        <div className="flex-1 flex flex-col md:flex-row md:items-end gap-6 text-center md:text-left">
                            <div className="flex-1 min-w-0 space-y-2 md:mb-4 relative group/title">
                                <div className="flex items-center gap-3 justify-center md:justify-start">
                                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-none text-slate-800 dark:text-white drop-shadow-sm">
                                        {inst.name}
                                    </h1>
                                    <EditBtn onClick={() => handleEdit('name', inst.name)} />
                                </div>
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-2 text-sm font-bold text-slate-500 dark:text-slate-400 mt-3">
                                    <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg">
                                        <span className="material-symbols-outlined text-[18px] text-primary">location_on</span>
                                        {inst.city}, {inst.province}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* MODAL / POPOVER EDIT MODE */}
                {editingField && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in">
                        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-8 max-w-lg w-full ring-1 ring-slate-900/5 space-y-6">
                            <div>
                                <h3 className="text-lg font-black text-slate-900 dark:text-white">Solicitar cambio de: <span className="text-primary uppercase tracking-wider">{editingField}</span></h3>
                                <p className="text-slate-500 text-sm mt-1">El administrador revisará este cambio antes de publicarlo.</p>
                            </div>

                            {editingField === 'description' ? (
                                <textarea
                                    className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border-none font-medium h-32 resize-none focus:ring-2 ring-primary/20"
                                    value={tempValue}
                                    onChange={e => setTempValue(e.target.value)}
                                />
                            ) : (
                                <input
                                    type="text"
                                    className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border-none font-bold text-lg focus:ring-2 ring-primary/20"
                                    value={tempValue}
                                    onChange={e => setTempValue(e.target.value)}
                                />
                            )}

                            <div className="flex justify-end gap-3 pt-2">
                                <button onClick={handleCancel} className="px-5 py-2.5 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors">Cancelar</button>
                                <button onClick={() => handleSave(editingField)} className="px-6 py-2.5 rounded-xl bg-primary text-white font-black shadow-lg shadow-primary/30 hover:scale-105 active:scale-95 transition-all">
                                    Enviar Solicitud
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Main Info */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Description */}
                        <div className="space-y-4 group/desc relative border border-transparent hover:border-slate-200 dark:hover:border-slate-800 p-4 rounded-3xl transition-all hover:bg-white dark:hover:bg-slate-900/50">
                            <div className="flex items-center justify-between">
                                <h2 className="title-section mb-0">Sobre Nosotros</h2>
                                <EditBtn onClick={() => handleEdit('description', inst.description)} />
                            </div>
                            <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-light">
                                {inst.description || "Sin descripción disponible."}
                            </p>
                        </div>


                        {/* Service Address & Hours details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InfoCardEditable
                                icon="schedule"
                                title="Horarios de Atención"
                                value={inst.serviceHours}
                                onEdit={() => handleEdit('serviceHours', inst.serviceHours)}
                            />
                            <InfoCardEditable
                                icon="church"
                                title="Parroquia / Capilla"
                                value={inst.parish}
                                onEdit={() => handleEdit('parish', inst.parish)}
                            />
                            <InfoCardEditable
                                icon="home_pin"
                                title="Dirección Física"
                                value={`${inst.address} ${inst.addressNumber || ''}, ${inst.city}`}
                                onEdit={() => handleEdit('address', inst.address)}
                            />
                            <InfoCardEditable
                                icon="call"
                                title="Teléfono Público"
                                value={inst.phone}
                                onEdit={() => handleEdit('phone', inst.phone)}
                            />
                            <InfoCardEditable
                                icon="mail"
                                title="Email Público"
                                value={inst.email}
                                onEdit={() => handleEdit('email', inst.email)}
                            />
                        </div>
                    </div>

                    {/* Right Column: Map & Stats */}
                    <div className="space-y-6">
                        {/* Map Card */}
                        <div className="group relative h-64 w-full rounded-[2.5rem] overflow-hidden shadow-lg border-4 border-white dark:border-slate-800">
                            <div className="absolute top-4 right-4 z-20">
                                <button onClick={() => handleEdit('lat', `${inst.lat}, ${inst.lng}`)} className="bg-white text-slate-800 p-2 rounded-full shadow-lg hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined text-sm">edit_location</span>
                                </button>
                            </div>
                            <div ref={miniMapRef} className="absolute inset-0 z-0 bg-slate-100"></div>
                        </div>
                    </div>
                </div>
            </main>

            <style>{`
                .title-section {
                @apply text-sm font-black uppercase tracking-widest text-slate-400 mb-2;
                }
            `}</style>
        </div>
    );
};

// Components helpers
const EditBtn = ({ onClick }: { onClick: () => void }) => (
    <button onClick={onClick} className="opacity-0 group-hover/title:opacity-100 group-hover/desc:opacity-100 bg-slate-100 text-slate-400 hover:text-primary hover:bg-primary/10 p-1.5 rounded-lg transition-all" title="Editar este campo">
        <span className="material-symbols-outlined text-sm">edit</span>
    </button>
);

const InfoCardEditable = ({ icon, title, value, onEdit }: any) => (
    <div className="group p-5 rounded-2xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-start gap-4 transition-all hover:border-primary/30 relative">
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={onEdit} className="text-slate-300 hover:text-primary p-1">
                <span className="material-symbols-outlined text-[16px]">edit</span>
            </button>
        </div>
        <div className="p-2.5 rounded-xl shrink-0 bg-slate-50 dark:bg-slate-900 text-slate-400">
            <span className="material-symbols-outlined text-[20px]">{icon}</span>
        </div>
        <div>
            <p className="text-[9px] font-black uppercase tracking-widest mb-1 text-slate-400">{title}</p>
            <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{value || 'No especificado'}</p>
        </div>
    </div>
);

export default PortalNodeView;
