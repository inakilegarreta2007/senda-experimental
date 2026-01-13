
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { Institution, NotificationType } from '../types';
import { mockInstitutions } from '@/utils/mockData';

const PortalIdentity: React.FC = () => {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    // Mock initial data loading - In real app, fetch based on user.institution_id
    const [formData, setFormData] = useState<Partial<Institution>>({});

    useEffect(() => {
        // Simulate fetching the user's institution
        // For DEV, we just pick the first one or a specific one
        const userInstitution = mockInstitutions[0];
        if (userInstitution) {
            setFormData(userInstitution);
        }
    }, []);

    const handleChange = (field: keyof Institution, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate Network Delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Create the Change Request Object (Notification)
        // In a real app, this would be POSTed to a 'notifications' table via Supabase RPC or Insert
        const changeRequest = {
            type: NotificationType.DATA_UPDATE_REQUEST,
            title: `Solicitud de Cambio: ${formData.name}`,
            message: `El nodo ${formData.name} solicita actualizar su información pública.`,
            relatedInstitutionId: formData.id,
            relatedUserId: user?.id,
            payload: formData // The proposed changes
        };

        console.log('🚀 [PORTAL] Enviando Solicitud de Cambio:', changeRequest);

        toast.success('Solicitud enviada a revisión', {
            icon: 'check_circle',
            duration: 4000,
        });

        setIsLoading(false);
    };

    return (
        <div className="p-8 max-w-4xl mx-auto pb-24">
            <header className="mb-8">
                <h1 className="text-2xl font-black text-slate-800 dark:text-white">
                    Ficha Pública
                </h1>
                <p className="text-slate-500 mt-2">
                    Edita la información visible de tu institución. Los cambios pasarán por una revisión antes de publicarse.
                </p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-8">

                {/* SECTION: CONTACT */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-2 mb-6 pb-2 border-b border-slate-100 dark:border-slate-700">
                        <span className="material-symbols-outlined text-primary">contact_phone</span>
                        <h3 className="font-bold text-slate-700 dark:text-slate-200 uppercase tracking-widest text-xs">
                            Canales de Contacto
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">
                                Teléfono Público
                            </label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold text-slate-800 dark:text-white focus:ring-2 focus:ring-primary/20 transition-all"
                                value={formData.phone || ''}
                                onChange={e => handleChange('phone', e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">
                                WhatsApp
                            </label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold text-slate-800 dark:text-white focus:ring-2 focus:ring-primary/20 transition-all"
                                value={formData.whatsapp || ''}
                                onChange={e => handleChange('whatsapp', e.target.value)}
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">
                                Email de Contacto
                            </label>
                            <input
                                type="email"
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold text-slate-800 dark:text-white focus:ring-2 focus:ring-primary/20 transition-all"
                                value={formData.email || ''}
                                onChange={e => handleChange('email', e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* SECTION: SOCIALS */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-2 mb-6 pb-2 border-b border-slate-100 dark:border-slate-700">
                        <span className="material-symbols-outlined text-blue-500">public</span>
                        <h3 className="font-bold text-slate-700 dark:text-slate-200 uppercase tracking-widest text-xs">
                            Presencia Digital
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">
                                Website / Linktree
                            </label>
                            <input
                                type="url"
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold text-slate-800 dark:text-white focus:ring-2 focus:ring-primary/20 transition-all"
                                value={formData.website || ''}
                                onChange={e => handleChange('website', e.target.value)}
                                placeholder="https://"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">
                                Instagram
                            </label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold text-slate-800 dark:text-white focus:ring-2 focus:ring-primary/20 transition-all"
                                value={formData.instagram || ''}
                                onChange={e => handleChange('instagram', e.target.value)}
                                placeholder="@usuario"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">
                                Facebook
                            </label>
                            <input
                                type="url"
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold text-slate-800 dark:text-white focus:ring-2 focus:ring-primary/20 transition-all"
                                value={formData.facebook || ''}
                                onChange={e => handleChange('facebook', e.target.value)}
                                placeholder="https://facebook.com/..."
                            />
                        </div>
                    </div>
                </div>

                {/* SECTION: DESCRIPTION */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-2 mb-6 pb-2 border-b border-slate-100 dark:border-slate-700">
                        <span className="material-symbols-outlined text-amber-500">description</span>
                        <h3 className="font-bold text-slate-700 dark:text-slate-200 uppercase tracking-widest text-xs">
                            Sobre Nosotros
                        </h3>
                    </div>
                    <div>
                        <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">
                            Descripción Corta
                        </label>
                        <textarea
                            rows={4}
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-bold text-slate-800 dark:text-white focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                            value={formData.description || ''}
                            onChange={e => handleChange('description', e.target.value)}
                        />
                        <p className="text-[10px] text-slate-400 mt-2 text-right">
                            {formData.description?.length || 0}/500 caracteres
                        </p>
                    </div>
                </div>

                {/* ACTION BAR */}
                <div className="fixed bottom-0 left-0 md:left-64 right-0 p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3 z-40">
                    <button
                        type="button"
                        onClick={() => setFormData(mockInstitutions[0])} // Reset
                        disabled={isLoading}
                        className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-8 py-3 rounded-xl bg-primary text-white font-black shadow-lg shadow-primary/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                    >
                        {isLoading ? (
                            <span className="material-symbols-outlined animate-spin">progress_activity</span>
                        ) : (
                            <>
                                <span className="material-symbols-outlined">save_as</span>
                                Solicitar Cambios
                            </>
                        )}
                    </button>
                </div>

            </form>
        </div>
    );
};

export default PortalIdentity;
