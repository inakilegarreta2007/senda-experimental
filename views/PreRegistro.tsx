import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Logo from '@/img/logo.png';
import { supabase } from '@/supabaseClient';
import { toast } from 'react-hot-toast';

const PreRegistro: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        projectName: '',
        serviceType: 'Comedor',
        contactName: '',
        contactMethod: '', // Email, phone, or whatsapp
        religiousRefName: '',
        religiousRefRole: 'Sacerdote',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Map to DB columns
            // Assuming simplified mapping for now.
            // contactMethod is tricky, let's guess it's a string that implies method + value?
            // Or we just put it in 'email' or 'phone' depending on format?
            // For simplicity, let's assume contactMethod is just a generic contact string,
            // but we need to put it somewhere.
            // Let's decide: if it looks like email, email. Else phone.

            let email = '';
            let phone = '';

            if (formData.contactMethod.includes('@')) {
                email = formData.contactMethod;
            } else {
                phone = formData.contactMethod;
            }

            // Generate Ticket Code
            const ticketCode = `SOL-${Math.floor(100000 + Math.random() * 900000)}`;

            const payload = {
                name: formData.projectName,
                type: formData.serviceType,
                responsible: formData.contactName, // Persona responsable
                email: email,
                phone: phone,
                max_authority_name: formData.religiousRefName, // Religioso referente
                max_authority_role: formData.religiousRefRole,
                status: 'Pendiente', // Pre-registration status
                created_at: new Date().toISOString(),
                // Defaults
                province: 'Santa Fe',
                country: 'Argentina',
                other_link: ticketCode, // Storing Ticket Code here
            };

            const { data, error } = await supabase.from('institutions').insert([payload]).select().single();

            if (error) throw error;

            toast.success('¡Pre-inscripción exitosa!');

            // Redirect to Full Form with ID and Data
            // We use state to pass the ID so the Full Form knows it's an "update" flow
            // Map snake_case payload to camelCase formData
            const preFilledFormData = {
                name: payload.name,
                type: payload.type,
                responsible: payload.responsible,
                email: payload.email,
                phone: payload.phone,
                maxAuthorityName: payload.max_authority_name,
                maxAuthorityRole: payload.max_authority_role,
                otherLink: payload.other_link,
                province: payload.province,
                country: payload.country,
                status: 'Pendiente'
            };

            navigate('/registro-completo', {
                state: {
                    preRegisteredId: data.id,
                    preFilledData: preFilledFormData
                }
            });

        } catch (error: any) {
            console.error('Error en pre-registro:', error);
            toast.error('Hubo un error al enviar los datos. Intenta nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-display items-center justify-center p-6 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-primary rounded-full blur-[150px]"></div>
                <div className="absolute bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-green-500 rounded-full blur-[150px]"></div>
            </div>

            <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 p-8 md:p-12 z-10 animate-in fade-in zoom-in-95 duration-500">
                <div className="text-center mb-10">
                    <img src={Logo} alt="Senda Logo" className="h-16 mx-auto mb-6" />
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Sumar Nodo a SENDA</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium text-sm leading-relaxed">
                        Completá estos datos básicos para que el equipo de SENDA pueda conocerte, acompañar tu obra y avanzar en la incorporación a la red.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-[11px] font-black uppercase text-slate-400 tracking-widest mb-1.5 pl-1">Nombre del Proyecto u Obra</label>
                        <input
                            required
                            type="text"
                            name="projectName"
                            value={formData.projectName}
                            onChange={handleChange}
                            placeholder="Ej. Comedor Santa Teresa"
                            className="w-full px-5 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none font-bold text-slate-800 dark:text-white focus:ring-2 focus:ring-primary transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-[11px] font-black uppercase text-slate-400 tracking-widest mb-1.5 pl-1">Tipo de Ayuda o Servicio</label>
                        <select
                            name="serviceType"
                            value={formData.serviceType}
                            onChange={handleChange}
                            className="w-full px-5 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none font-bold text-slate-800 dark:text-white focus:ring-2 focus:ring-primary transition-all"
                        >
                            <option value="Comedor">Asistencia Alimentaria</option>
                            <option value="Educación">Educación y Apoyo Escolar</option>
                            <option value="Salud">Salud y Prevención</option>
                            <option value="Espiritual">Acompañamiento Espiritual</option>
                            <option value="Social">Asistencia Social / Cáritas</option>
                            <option value="Oficios">Taller de Oficios</option>
                            <option value="Otro">Otro</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-[11px] font-black uppercase text-slate-400 tracking-widest mb-1.5 pl-1">Nombre del Responsable</label>
                        <input
                            required
                            type="text"
                            name="contactName"
                            value={formData.contactName}
                            onChange={handleChange}
                            placeholder="Tu nombre y apellido"
                            className="w-full px-5 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none font-bold text-slate-800 dark:text-white focus:ring-2 focus:ring-primary transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-[11px] font-black uppercase text-slate-400 tracking-widest mb-1.5 pl-1">Vía de Contacto Principal</label>
                        <input
                            required
                            type="text"
                            name="contactMethod"
                            value={formData.contactMethod}
                            onChange={handleChange}
                            placeholder="WhatsApp, Teléfono o Email"
                            className="w-full px-5 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none font-bold text-slate-800 dark:text-white focus:ring-2 focus:ring-primary transition-all"
                        />
                    </div>

                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                        <p className="text-xs font-bold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-lg">church</span> Referente Eclesial
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[9px] font-black uppercase text-slate-400 tracking-widest mb-1.5 pl-1">Nombre</label>
                                <input
                                    type="text"
                                    name="religiousRefName"
                                    value={formData.religiousRefName}
                                    onChange={handleChange}
                                    placeholder="Ej. P. Juan Pérez"
                                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border-none font-medium text-slate-800 dark:text-white focus:ring-2 focus:ring-primary transition-all text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-[9px] font-black uppercase text-slate-400 tracking-widest mb-1.5 pl-1">Rol Pastoral</label>
                                <select
                                    name="religiousRefRole"
                                    value={formData.religiousRefRole}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border-none font-medium text-slate-800 dark:text-white focus:ring-2 focus:ring-primary transition-all text-sm"
                                >
                                    <option value="Sacerdote">Sacerdote</option>
                                    <option value="Diácono">Diácono</option>
                                    <option value="Religioso/a">Religioso/a</option>
                                    <option value="Asesor Espiritual">Asesor Espiritual</option>
                                    <option value="Otro">Otro</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-primary hover:bg-blue-800 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-900/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <span className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white"></span>
                            ) : (
                                <>
                                    Siguiente Paso <span className="material-symbols-outlined text-lg">arrow_forward</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>

                <div className="mt-8 text-center">
                    <Link to="/" className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 text-xs font-bold uppercase tracking-widest transition-colors">
                        Cancelar y Volver
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PreRegistro;
