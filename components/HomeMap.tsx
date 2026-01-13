
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Institution } from '../types';

interface HomeMapProps {
    institutions: Institution[];
}

const HomeMap: React.FC<HomeMapProps> = ({ institutions }) => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<L.Map | null>(null);
    const markersLayer = useRef<L.LayerGroup | null>(null);

    useEffect(() => {
        if (mapContainer.current && !mapInstance.current) {
            // Initialize map
            mapInstance.current = L.map(mapContainer.current, {
                zoomControl: false,
                scrollWheelZoom: false,
                dragging: true, // Allow dragging to explore
                doubleClickZoom: false,
                attributionControl: false
            }).setView([-31.6333, -60.7000], 8); // Center on Santa Fe roughly

            // Dark/Neutral tile layer for better contrast with overlay text
            L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
                subdomains: 'abcd',
                maxZoom: 19
            }).addTo(mapInstance.current);

            markersLayer.current = L.layerGroup().addTo(mapInstance.current);
        }

        return () => {
            // Cleanup happens if component unmounts
            // mapInstance.current?.remove(); // Often causes issues with creating/destroying rapidly in dev, better to verify ref
        };
    }, []);

    useEffect(() => {
        if (!mapInstance.current || !markersLayer.current) return;

        markersLayer.current.clearLayers();

        const activeInstitutions = institutions.filter(i => i.status === 'Activo' || i.status === 'Ayuda Req.');

        activeInstitutions.forEach(inst => {
            if (!inst.lat || !inst.lng) return;

            const isUrgent = inst.status === 'Ayuda Req.';
            const colorClass = isUrgent ? 'bg-red-500' : 'bg-primary';

            const icon = L.divIcon({
                className: 'custom-div-icon',
                html: `
          <div class="relative group">
            <div class="${colorClass} size-3 rounded-full border border-white shadow-sm opacity-80 group-hover:scale-150 transition-transform duration-300"></div>
            ${isUrgent ? '<div class="absolute -inset-1 bg-red-500/30 rounded-full animate-ping"></div>' : ''}
          </div>
        `,
                iconSize: [12, 12],
                iconAnchor: [6, 6]
            });

            const marker = L.marker([inst.lat, inst.lng], { icon });

            marker.bindPopup(`
        <div class="font-sans text-xs min-w-[120px]">
          <strong class="block text-slate-800 mb-1">${inst.name}</strong>
          <span class="text-slate-500">${inst.city}</span>
        </div>
      `, { closeButton: false });

            if (markersLayer.current) {
                markersLayer.current.addLayer(marker);
            }
        });

    }, [institutions]);

    return <div ref={mapContainer} className="h-full w-full absolute inset-0 z-0 bg-slate-100" />;
};

export default HomeMap;
