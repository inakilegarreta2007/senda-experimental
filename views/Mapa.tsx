
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Institution, SiteConfig } from '../types';
import { expandSearchQuery } from '@/geminiService';
import { getDistance, normalizeText } from '../utils/geo';
import CategoryNavbar from '../components/CategoryNavbar';
import Logo from '@/img/logo.png';
import { SkeletonMap } from '../components/Skeleton';
import L from 'leaflet';

import { useConfig } from '@/contexts/ConfigContext';

interface MapaProps {
  institutions: Institution[];
  loading?: boolean;
}

const Mapa: React.FC<MapaProps> = ({ institutions, loading }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const focusId = searchParams.get('id');

  const [search, setSearch] = useState('');
  const [semanticTags, setSemanticTags] = useState<string[]>([]);
  const [isSearchingAI, setIsSearchingAI] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [radiusFilter, setRadiusFilter] = useState<number | null>(null);
  const { config: globalConfig } = useConfig();
  const config = globalConfig.pages.map;

  const mapRef = useRef<HTMLDivElement>(null);
  const leafletInstance = useRef<L.Map | null>(null);
  const markersLayer = useRef<L.LayerGroup | null>(null);

  const visibleInstitutions = useMemo(() =>
    institutions.filter(i => i.status === 'Activo' || i.status === 'Ayuda Req.'),
    [institutions]);

  const filtered = useMemo(() => {
    return visibleInstitutions.filter(inst => {
      // Semantic and direct search
      const searchNorm = normalizeText(search);
      const content = normalizeText(`${inst.name} ${inst.type} ${inst.city} ${inst.address} ${(inst.needs || []).join(' ')}`);
      const directMatch = content.includes(searchNorm);
      const semanticMatch = semanticTags.some(tag => content.includes(normalizeText(tag)));
      const matchesSearch = directMatch || semanticMatch;

      // Radius filter
      if (radiusFilter && userLocation && inst.lat && inst.lng) {
        const dist = getDistance(userLocation.lat, userLocation.lng, inst.lat, inst.lng);
        return matchesSearch && dist <= radiusFilter;
      }

      return matchesSearch;
    });
  }, [visibleInstitutions, search, semanticTags, userLocation, radiusFilter]);

  useEffect(() => {
    if (!config.showAIsearch) {
      setSemanticTags([]);
      return;
    }

    const timer = setTimeout(async () => {
      if (search.length > 3) {
        setIsSearchingAI(true);
        const tags = await expandSearchQuery(search);
        setSemanticTags(tags);
        setIsSearchingAI(false);
      } else {
        setSemanticTags([]);
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [search, config.showAIsearch]);

  const handleRadiusSearch = () => {
    if (radiusFilter) {
      setRadiusFilter(null);
      return;
    }

    if (!navigator.geolocation) {
      alert("Geolocalización no soportada por el navegador");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(loc);
        setRadiusFilter(5); // 5km por defecto
        if (leafletInstance.current) {
          leafletInstance.current.setView([loc.lat, loc.lng], 13);
        }
      },
      (err) => {
        alert("No se pudo obtener tu ubicación");
      }
    );
  };

  // INICIALIZACIÓN ÚNICA DEL MAPA
  useEffect(() => {
    if (!loading && mapRef.current && !leafletInstance.current) {
      leafletInstance.current = L.map(mapRef.current).setView([-31.6106, -60.6973], 7);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(leafletInstance.current);

      markersLayer.current = L.layerGroup().addTo(leafletInstance.current);
    }

    if (!loading && focusId && leafletInstance.current) {
      const target = institutions.find(i => i.id === focusId);
      if (target && target.lat && target.lng) {
        leafletInstance.current.setView([target.lat, target.lng], 16);
      }
    }
  }, [loading, focusId, institutions]);

  // ACTUALIZACIÓN DINÁMICA DE MARCADORES
  useEffect(() => {
    if (markersLayer.current && leafletInstance.current) {
      markersLayer.current.clearLayers();
      filtered.forEach(inst => {
        if (!inst.lat || !inst.lng) return;

        const isUrgent = inst.status === 'Ayuda Req.';
        const marker = L.marker([inst.lat, inst.lng], {
          icon: L.divIcon({
            className: 'custom-div-icon',
            html: `
              <div class="group relative">
                <div class="${isUrgent ? 'bg-red-600 animate-pulse' : 'bg-primary'} text-white p-2 rounded-full shadow-lg border-2 border-white flex items-center justify-center transform hover:scale-125 transition-all">
                  <span class="material-symbols-outlined text-[18px]">${isUrgent ? 'warning' : 'location_on'}</span>
                </div>
              </div>
            `,
            iconSize: [32, 32],
            iconAnchor: [16, 16]
          })
        });

        marker.on('click', () => leafletInstance.current?.setView([inst.lat, inst.lng], 16));
        marker.bindPopup(`
          <div class="font-display min-w-[240px] max-w-[280px] p-0 overflow-hidden rounded-2xl border-none shadow-none">
            ${inst.image ? `<div class="h-32 w-full bg-cover bg-center" style="background-image: url('${inst.image}')"></div>` : `<div class="h-20 w-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary"><span class="material-symbols-outlined text-4xl">storefront</span></div>`}
            <div class="p-4 bg-white">
              <div class="flex items-center gap-2 mb-2">
                 <span class="px-2 py-1 rounded-md bg-slate-100 text-[9px] font-black uppercase tracking-widest text-slate-500">${inst.type}</span>
                 ${inst.status === 'Ayuda Req.' ? '<span class="px-2 py-1 rounded-md bg-red-100 text-[9px] font-black uppercase tracking-widest text-red-600 flex items-center gap-1"><span class="material-symbols-outlined text-[10px]">warning</span>Ayuda</span>' : ''}
              </div>
              <h3 class="font-black text-lg mb-1 text-slate-900 leading-tight">${inst.name}</h3>
              <p class="text-xs text-slate-500 font-medium mb-4 flex items-center gap-1"><span class="material-symbols-outlined text-[14px] text-slate-400">location_on</span> ${inst.address}, ${inst.city}</p>
              <a href="#/details/${inst.id}" class="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-colors shadow-lg shadow-slate-900/10">
                Ver Detalles <span class="material-symbols-outlined text-[14px]">arrow_forward</span>
              </a>
            </div>
          </div>
        `, { closeButton: false, className: 'custom-friendly-popup', maxWidth: 320 });

        markersLayer.current?.addLayer(marker);

        if (focusId === inst.id) {
          marker.openPopup();
        }
      });
    }
  }, [filtered, focusId, institutions]);

  const centerOnInstitution = (inst: Institution) => {
    if (leafletInstance.current && inst.lat && inst.lng) {
      leafletInstance.current.setView([inst.lat, inst.lng], 16);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background-light dark:bg-background-dark font-display overflow-hidden">
      <header className="bg-white dark:bg-slate-800 border-b px-6 py-3 flex justify-between items-center z-20 shadow-sm">
        <button onClick={() => navigate('/')} className="flex items-center gap-3 group transition-all">
          <img src={Logo} alt="Senda Logo" className="size-11" />
          <div className="flex flex-col text-left">

            <p className="text-[9px] text-slate-500 font-extrabold uppercase tracking-widest mt-0.5">{config.tagline}</p>
          </div>
        </button>
        <CategoryNavbar />
      </header>

      <div className="flex-1 flex overflow-hidden">
        <aside className="w-full md:w-[420px] bg-white dark:bg-slate-800 border-r flex flex-col z-10 shadow-xl">
          <div className="p-6 pb-2">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-black">{config.title}</h2>
              {config.showRadiusFilter && (
                <button
                  onClick={handleRadiusSearch}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all shadow-sm ${radiusFilter ? 'bg-primary text-white scale-105' : 'bg-slate-100 dark:bg-slate-900 text-slate-500 hover:bg-slate-200'
                    }`}
                >
                  <span className="material-symbols-outlined text-[16px]">{radiusFilter ? 'my_location' : 'near_me'}</span>
                  {radiusFilter ? 'Radio 5km ON' : 'Cerca de mí'}
                </button>
              )}
            </div>
            <div className="relative mb-4 mt-4">
              <span className={`material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 ${isSearchingAI ? 'text-primary animate-pulse' : 'text-slate-400'}`}>
                {isSearchingAI ? 'bolt' : 'search'}
              </span>
              <input
                type="text"
                placeholder="Ej: necesito alimentos, merendero..."
                className="w-full pl-12 pr-4 h-14 bg-slate-100 dark:bg-slate-900 border-none rounded-2xl focus:ring-2 focus:ring-primary dark:text-white"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-6 space-y-3 pb-6">
            {loading ? (
              <div className="space-y-3 pt-4">
                <div className="animate-pulse bg-slate-100 dark:bg-slate-800 h-20 rounded-2xl" />
                <div className="animate-pulse bg-slate-100 dark:bg-slate-800 h-20 rounded-2xl opacity-70" />
                <div className="animate-pulse bg-slate-100 dark:bg-slate-800 h-20 rounded-2xl opacity-40" />
              </div>
            ) : (
              filtered.map(inst => (
                <div
                  key={inst.id}
                  onClick={() => centerOnInstitution(inst)}
                  className={`cursor-pointer p-4 rounded-2xl border transition-all ${focusId === inst.id
                    ? 'border-primary bg-primary/5'
                    : 'border-slate-100 dark:border-slate-700 hover:border-primary bg-white dark:bg-slate-800 shadow-sm'
                    }`}
                >
                  <div className="flex gap-4">
                    <div className={`size-11 rounded-xl flex items-center justify-center shrink-0 ${inst.status === 'Ayuda Req.' ? 'bg-red-50 text-red-600' : 'bg-primary/10 text-primary'}`}>
                      <span className="material-symbols-outlined">{inst.status === 'Ayuda Req.' ? 'warning' : 'location_on'}</span>
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <h3 className="font-bold text-slate-900 dark:text-white truncate">{inst.name}</h3>
                      <p className="text-xs text-slate-500 truncate">{inst.address}, {inst.city}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </aside>

        <main className="flex-1 relative overflow-hidden">
          {loading ? (
            <SkeletonMap />
          ) : (
            <div ref={mapRef} className="absolute inset-0 z-0 h-full w-full"></div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Mapa;
