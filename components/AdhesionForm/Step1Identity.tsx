import React, { useEffect, useRef } from 'react';
import { Institution } from '../../types';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Step1Props {
    formData: Partial<Institution>;
    onChange: (field: keyof Institution, value: any) => void;
    isGeocoding: boolean;
    onManualGeocode: () => void;
}

export const Step1Identity: React.FC<Step1Props> = ({
    formData, onChange, isGeocoding, onManualGeocode
}) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const miniMapRef = useRef<L.Map | null>(null);
    const markerRef = useRef<L.Marker | null>(null);

    useEffect(() => {
        if (mapContainerRef.current && !miniMapRef.current) {
            // Init Map
            const initialLat = formData.lat || -31.6106;
            const initialLng = formData.lng || -60.6973;

            miniMapRef.current = L.map(mapContainerRef.current, {
                zoomControl: false,
                attributionControl: false
            }).setView([initialLat, initialLng], 15);

            L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png').addTo(miniMapRef.current!);

            markerRef.current = L.marker([initialLat, initialLng], {
                draggable: true,
                icon: L.divIcon({
                    className: 'custom-div-icon',
                    html: `<div class="bg-primary text-white p-2 rounded-full shadow-lg border-2 border-white flex items-center justify-center transform scale-125"><span class="material-symbols-outlined text-[18px]">location_on</span></div>`,
                    iconSize: [32, 32],
                    iconAnchor: [16, 16]
                })
            }).addTo(miniMapRef.current!);

            markerRef.current.on('dragend', (e: any) => {
                const { lat, lng } = e.target.getLatLng();
                onChange('lat', lat);
                onChange('lng', lng);
            });
        }

        return () => {
            if (miniMapRef.current) {
                miniMapRef.current.remove();
                miniMapRef.current = null;
                markerRef.current = null;
            }
        }
    }, [formData.lat, formData.lng, onChange]);

    // Sync marker from props
    useEffect(() => {
        if (miniMapRef.current && markerRef.current && formData.lat && formData.lng) {
            const newPos: [number, number] = [formData.lat, formData.lng];
            markerRef.current.setLatLng(newPos);
            miniMapRef.current.setView(newPos, 16);
        }
    }, [formData.lat, formData.lng]);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">

            {/* PRIVACY INDICATOR: PUBLIC */}
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/20">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/40 rounded-xl text-emerald-600 dark:text-emerald-400 shadow-sm">
                    <span className="material-symbols-outlined text-[20px]">public</span>
                </div>
                <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-200 mb-1">Información Pública</h4>
                    <p className="text-sm text-emerald-700/80 dark:text-emerald-300/80 font-medium leading-relaxed">
                        Los datos de identidad y ubicación geográfica serán visibles para todos los visitantes del mapa interactivo de SENDA.
                    </p>
                </div>
            </div>

            {/* SECCIÓN 1: DATOS BÁSICOS */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="material-symbols-outlined text-primary text-lg">id_card</span>
                    <h4 className="text-sm font-black uppercase tracking-widest text-slate-400">Datos Básicos</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="col-span-1 md:col-span-2">
                        <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Nombre del Nodo *</label>
                        <input required type="text" className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-900 border-none font-bold text-slate-800 dark:text-white focus:ring-2 focus:ring-primary/20 transition-all" value={formData.legalName} onChange={e => onChange('legalName', e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Tipo de Nodo *</label>
                        <input required type="text" placeholder="Ej: Comedor, Merendero, Apoyo Escolar" className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-900 border-none font-bold text-slate-800 dark:text-white focus:ring-2 focus:ring-primary/20 transition-all" value={formData.type} onChange={e => onChange('type', e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Año Fundación <span className="text-slate-300 font-bold ml-1">(Opcional)</span></label>
                        <input type="number" className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-900 border-none font-bold text-slate-800 dark:text-white focus:ring-2 focus:ring-primary/20 transition-all" value={formData.foundationYear} onChange={e => onChange('foundationYear', e.target.value)} />
                    </div>
                </div>
            </div>

            {/* SECCIÓN 2: UBICACIÓN Y GEOGRAFÍA */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="material-symbols-outlined text-green-500 text-lg">pin_drop</span>
                    <h4 className="text-sm font-black uppercase tracking-widest text-slate-400">Ubicación y Geografía</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-1">
                        <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">País *</label>
                        <input required type="text" className="w-full px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border-none font-bold text-slate-800 dark:text-white" value={formData.country} onChange={e => onChange('country', e.target.value)} />
                    </div>
                    <div className="md:col-span-1">
                        <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Provincia *</label>
                        <input required type="text" className="w-full px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border-none font-bold text-slate-800 dark:text-white" value={formData.province} onChange={e => onChange('province', e.target.value)} />
                    </div>
                    <div className="md:col-span-1">
                        <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Localidad *</label>
                        <input required type="text" className="w-full px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border-none font-bold text-slate-800 dark:text-white" value={formData.city} onChange={e => onChange('city', e.target.value)} />
                    </div>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <div className="flex justify-between items-center mb-4">
                        <label className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                            <span className="material-symbols-outlined text-sm">home_pin</span>
                            Dirección Física Real
                        </label>
                        <button type="button" onClick={onManualGeocode} disabled={isGeocoding} className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 text-[9px] font-black uppercase text-primary border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1 shadow-sm">
                            {isGeocoding ? <span className="animate-spin material-symbols-outlined text-sm">refresh</span> : <span className="material-symbols-outlined text-sm">my_location</span>}
                            Sincronizar Coordenadas
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
                        <div className="md:col-span-2">
                            <input required type="text" placeholder="Calle (Ej: Av. San Martín) *" className="w-full px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-slate-800 dark:text-white" value={formData.address} onChange={e => onChange('address', e.target.value)} />
                        </div>
                        <div>
                            <input required type="text" placeholder="Número (Ej: 1234) *" className="w-full px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-slate-800 dark:text-white" value={formData.addressNumber} onChange={e => onChange('addressNumber', e.target.value)} />
                        </div>
                        <div>
                            <input type="text" placeholder="C.P. (Opc)" className="w-full px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-slate-800 dark:text-white" value={formData.zipCode} onChange={e => onChange('zipCode', e.target.value)} />
                        </div>
                    </div>
                    <div className="h-48 rounded-xl overflow-hidden shadow-inner border border-slate-200 dark:border-slate-700 relative">
                        <div ref={mapContainerRef} className="w-full h-full z-0"></div>
                        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-[9px] font-bold text-slate-500 z-[400] shadow-sm pointer-events-none">
                            Arrastra el marcador para ajustar
                        </div>
                    </div>
                </div>

                <div className="pt-2">
                    <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Diócesis <span className="text-slate-300 font-bold ml-1">(Opcional)</span></label>
                    <input type="text" className="w-full px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border-none font-bold text-slate-800 dark:text-white" value={formData.archdiocese} onChange={e => onChange('archdiocese', e.target.value)} />
                </div>
            </div>

            {/* SECCIÓN 3: INFO ADICIONAL (ELIMINADA) */}
        </div>
    );
};
