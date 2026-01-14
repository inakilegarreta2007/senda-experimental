import React from 'react';
import { Institution } from '../../types';
import { Step1Identity } from './Step1Identity';

interface StepRendererProps {
    step: number;
    formData: Partial<Institution>;
    setFormData: (data: Partial<Institution>) => void;
    isGeocoding: boolean;
    onManualGeocode: () => void;
    fileInputRef: React.RefObject<HTMLInputElement>;
    previewImage: string | null;
    setPreviewImage: (url: string | null) => void;
}

export const StepRenderer: React.FC<StepRendererProps> = ({
    step,
    formData,
    setFormData,
    isGeocoding,
    onManualGeocode,
    fileInputRef,
    previewImage,
    setPreviewImage
}) => {

    const handleChange = (field: keyof Institution, value: any) => {
        setFormData({ ...formData, [field]: value });
    };

    switch (step) {
        case 1: // Identidad (Delegated to specialized component)
            return (
                <Step1Identity
                    formData={formData}
                    onChange={handleChange}
                    isGeocoding={isGeocoding}
                    onManualGeocode={onManualGeocode}
                />
            );

        case 2: // Información Pública
            return (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">

                    {/* PRIVACY INDICATOR: PUBLIC */}
                    <div className="flex items-start gap-4 p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/20">
                        <div className="p-2 bg-emerald-100 dark:bg-emerald-900/40 rounded-xl text-emerald-600 dark:text-emerald-400 shadow-sm">
                            <span className="material-symbols-outlined text-[20px]">share_location</span>
                        </div>
                        <div>
                            <h4 className="text-xs font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-200 mb-1">Canales Públicos</h4>
                            <p className="text-sm text-emerald-700/80 dark:text-emerald-300/80 font-medium leading-relaxed">
                                Estos medios de contacto se mostrarán en su ficha pública para que la comunidad pueda comunicarse con el nodo.
                            </p>
                        </div>
                    </div>

                    {/* Service Description */}
                    <div>
                        <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Descripción de Servicios y Actividades *</label>
                        <textarea
                            required
                            placeholder="Describe detalladamente las actividades, asistencia y servicios que brinda el nodo a la comunidad..."
                            className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-900 border-none font-bold text-slate-800 dark:text-white min-h-[120px]"
                            value={formData.description || ''}
                            onChange={e => handleChange('description', e.target.value)}
                        />
                    </div>

                    {/* Gallery Carousel Input */}
                    <div>
                        <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Galería Audiovisual (Carrusel) <span className="text-slate-300 font-bold ml-1">(Opcional)</span></label>
                        <div className="flex gap-4 overflow-x-auto pb-4 pt-2">
                            {/* Add Button */}
                            <label className="flex-shrink-0 w-28 h-28 bg-slate-50 dark:bg-slate-800/50 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-all border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-primary group">
                                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined text-slate-500 text-xl">add_a_photo</span>
                                </div>
                                <span className="text-[9px] font-black uppercase text-slate-400 group-hover:text-primary transition-colors">Agregar Fotos</span>
                                <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => {
                                    if (e.target.files) {
                                        const files = Array.from(e.target.files);
                                        const newImages: string[] = [];
                                        let processed = 0;
                                        files.forEach(file => {
                                            const reader = new FileReader();
                                            reader.onloadend = () => {
                                                newImages.push(reader.result as string);
                                                processed++;
                                                if (processed === files.length) {
                                                    const currentGallery = formData.gallery || [];
                                                    handleChange('gallery', [...currentGallery, ...newImages]);
                                                }
                                            };
                                            reader.readAsDataURL(file);
                                        });
                                    }
                                }} />
                            </label>

                            {/* Previews */}
                            {formData.gallery?.map((img, idx) => (
                                <div key={idx} className="relative flex-shrink-0 w-28 h-28 rounded-2xl overflow-hidden shadow-sm group border border-slate-200 dark:border-slate-700">
                                    <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const newGallery = (formData.gallery || []).filter((_, i) => i !== idx);
                                                handleChange('gallery', newGallery);
                                            }}
                                            className="bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors shadow-lg transform hover:scale-110"
                                        >
                                            <span className="material-symbols-outlined text-[16px]">delete</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">info</span>
                            Las imágenes se mostrarán en formato carrusel en la ficha pública.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Sitio Web <span className="text-slate-300 font-bold ml-1">(Opcional)</span></label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">language</span>
                                <input type="url" placeholder="https://..." className="w-full pl-9 pr-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-900 border-none font-bold text-slate-800 dark:text-white" value={formData.website} onChange={e => handleChange('website', e.target.value)} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Instagram <span className="text-slate-300 font-bold ml-1">(Opcional)</span></label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">photo_camera</span>
                                <input type="url" placeholder="https://instagram.com/..." className="w-full pl-9 pr-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-900 border-none font-bold text-slate-800 dark:text-white" value={formData.instagram} onChange={e => handleChange('instagram', e.target.value)} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Facebook <span className="text-slate-300 font-bold ml-1">(Opcional)</span></label>
                            <div className="relative">
                                <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" /></svg>
                                <input type="url" placeholder="https://facebook.com/..." className="w-full pl-9 pr-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-900 border-none font-bold text-slate-800 dark:text-white" value={formData.facebook} onChange={e => handleChange('facebook', e.target.value)} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">X (Twitter) <span className="text-slate-300 font-bold ml-1">(Opcional)</span></label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">tag</span>
                                <input type="url" placeholder="https://x.com/..." className="w-full pl-9 pr-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-900 border-none font-bold text-slate-800 dark:text-white" value={formData.twitter} onChange={e => handleChange('twitter', e.target.value)} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">WhatsApp Público <span className="text-slate-300 font-bold ml-1">(Opcional)</span></label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">chat</span>
                                <input type="tel" placeholder="+54 9 ..." className="w-full pl-9 pr-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-900 border-none font-bold text-slate-800 dark:text-white" value={formData.publicWhatsapp} onChange={e => handleChange('publicWhatsapp', e.target.value)} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Teléfono Público <span className="text-slate-300 font-bold ml-1">(Opcional)</span></label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">call</span>
                                <input type="tel" placeholder="+54 ..." className="w-full pl-9 pr-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-900 border-none font-bold text-slate-800 dark:text-white" value={formData.publicPhone} onChange={e => handleChange('publicPhone', e.target.value)} />
                            </div>
                        </div>
                    </div>
                </div>
            );

        case 3: // Representante (Datos Privados)
            return (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">

                    {/* PRIVACY INDICATOR: PRIVATE */}
                    <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/50">
                        <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-400 shadow-sm">
                            <span className="material-symbols-outlined text-[20px]">shield_lock</span>
                        </div>
                        <div>
                            <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">Datos Confidenciales</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                                Esta información es para uso exclusivo del equipo de coordinación de SENDA. <span className="font-bold text-slate-800 dark:text-slate-200">No será publicada</span> en el mapa ni compartida con terceros.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Email de Contacto */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Email de Contacto *</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">alternate_email</span>
                                    <input required type="email" className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-900 border-none font-bold" value={formData.email} onChange={e => handleChange('email', e.target.value)} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Nombre del Referente (Email) *</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">person</span>
                                    <input required type="text" placeholder="Ej: Juan Pérez" className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-900 border-none font-bold" value={formData.contactEmailName} onChange={e => handleChange('contactEmailName', e.target.value)} />
                                </div>
                            </div>
                        </div>

                        {/* Celular de Contacto */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Celular de Contacto *</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">smartphone</span>
                                    <input required type="tel" className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-900 border-none font-bold" value={formData.phone} onChange={e => handleChange('phone', e.target.value)} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Nombre del Referente (Celular) *</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">person</span>
                                    <input required type="text" placeholder="Ej: María García" className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-900 border-none font-bold" value={formData.contactPhoneName} onChange={e => handleChange('contactPhoneName', e.target.value)} />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            );

        case 4: // Vinculación
            return (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">

                    {/* PRIVACY INDICATOR: MIXED (Primarily Public) */}
                    <div className="flex items-start gap-4 p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/20">
                        <div className="p-2 bg-amber-100 dark:bg-amber-900/40 rounded-xl text-amber-600 dark:text-amber-400 shadow-sm">
                            <span className="material-symbols-outlined text-[20px]">assignment_turned_in</span>
                        </div>
                        <div>
                            <h4 className="text-xs font-black uppercase tracking-wider text-amber-800 dark:text-amber-200 mb-1">Perfil Institucional</h4>
                            <p className="text-sm text-amber-700/80 dark:text-amber-300/80 font-medium leading-relaxed">
                                Su <strong>Misión, Valores y Público</strong> serán visibles para <strong>destacar su impacto</strong>. La motivación de adhesión es interna para el equipo SENDA.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Público y Alcance *</label>
                            <input required type="text" placeholder="¿A quiénes sirve principalmente el nodo?" className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-900 border-none font-bold text-slate-800 dark:text-white" value={formData.targetAudience} onChange={e => handleChange('targetAudience', e.target.value)} />
                        </div>

                        <div>
                            <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Misión y Valores (Breve reseña) <span className="text-slate-300 font-bold ml-1">(Opcional)</span></label>
                            <textarea placeholder="Descripción breve de la identidad del nodo (Máx 300 palabras)" className="w-full px-4 py-4 rounded-xl bg-slate-100 dark:bg-slate-900 border-none text-sm min-h-[100px]" value={formData.missionValues} onChange={e => handleChange('missionValues', e.target.value)} />
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
                        <label className="text-[11px] font-black uppercase text-slate-400 tracking-widest mb-4 block">Logo Oficial o Imagen Representativa <span className="text-slate-300 font-bold ml-1">(Opcional)</span></label>
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className={`w-full h-48 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-slate-50 dark:hover:bg-slate-800 relative overflow-hidden group ${previewImage ? 'border-primary bg-slate-50' : 'border-slate-300'}`}
                        >
                            {previewImage ? (
                                <div className="relative w-full h-full flex items-center justify-center p-4">
                                    <img src={previewImage} className="max-h-full max-w-full object-contain drop-shadow-md" alt="Logo" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <span className="text-white font-bold text-sm bg-black/50 px-4 py-2 rounded-full backdrop-blur">Cambiar Imagen</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center text-slate-400 group-hover:text-primary transition-colors">
                                    <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                                        <span className="material-symbols-outlined text-3xl">add_photo_alternate</span>
                                    </div>
                                    <p className="text-xs font-bold uppercase tracking-widest">Haz click para subir imagen</p>
                                    <p className="text-[10px] mt-1 opacity-70">PNG, JPG o WEBP (Max 5MB)</p>
                                </div>
                            )}
                        </div>
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={e => {
                            const file = e.target.files?.[0];
                            if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => setPreviewImage(reader.result as string);
                                reader.readAsDataURL(file);
                            }
                        }} />
                    </div>
                </div>
            );

        case 5: // Declaraciones
            return (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="bg-gradient-to-br from-indigo-50 to-slate-50 dark:from-slate-900 dark:to-slate-900 p-8 rounded-[2rem] border border-indigo-100 dark:border-slate-800 text-center shadow-sm">
                        <div className="w-16 h-16 bg-white dark:bg-slate-800 text-indigo-600 rounded-2xl shadow-lg border border-indigo-50 dark:border-slate-700 flex items-center justify-center mx-auto mb-6 transform -rotate-6">
                            <span className="material-symbols-outlined text-3xl">verified_user</span>
                        </div>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">Confirmación Legal</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                            Acto de declaración jurada para garantizar la transparencia y veracidad de la red SENDA.
                        </p>
                    </div>

                    <div className="space-y-3">
                        {[
                            { label: 'Declaro bajo juramento que toda la información proporcionada es veraz, oficial y actual.', field: 'declarationTruth' },
                            { label: 'Autorizo expresamente a SENDA a verificar la información presentada y contactar a las referencias citadas.', field: 'declarationAuthVerify' },
                            { label: 'Comprendo que la adhesión puede ser rechazada o revocada, y acepto los lineamientos y principios de la Red SENDA.', field: 'declarationTerms' }
                        ].map((item: any) => (
                            <label key={item.field} className={`flex gap-4 p-5 rounded-2xl border cursor-pointer hover:shadow-md transition-all group ${(formData as any)[item.field] ? 'bg-primary/5 border-primary/30' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800'}`}>
                                <div className={`mt-0.5 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors flex-shrink-0 ${(formData as any)[item.field] ? 'bg-primary border-primary' : 'border-slate-300 group-hover:border-primary'}`}>
                                    {(formData as any)[item.field] && <span className="material-symbols-outlined text-white text-sm">check</span>}
                                </div>
                                <input type="checkbox" className="hidden" required checked={(formData as any)[item.field]} onChange={e => handleChange(item.field, e.target.checked)} />
                                <span className={`text-sm font-medium transition-colors ${(formData as any)[item.field] ? 'text-primary dark:text-primary-light' : 'text-slate-600 dark:text-slate-400'}`}>
                                    {item.label}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>
            );

        default: return null;
    }
};
