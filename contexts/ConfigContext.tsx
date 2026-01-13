import React, { createContext, useContext, useEffect, useState } from 'react';
import { SiteConfig } from '../types';

export const DEFAULT_CONFIG: SiteConfig = {
    general: {
        maintenanceMode: false,
    },
    theme: {
        primaryColor: '#1c388d',
        secondaryColor: '#64748b',
        accentColor: '#f59e0b',
    },
    contact: {
        email: 'info@sendasantafe.org',
        address: 'Santa Fe, Argentina',
        instagram: 'https://instagram.com/senda_argentina',
        facebook: 'https://facebook.com/senda_argentina',
    },
    pages: {
        home: {
            hero: {
                title: 'SENDA',
                subtitle: 'El camino más corto para ayudar',
                metricsButton: {
                    label: 'VER IMPACTO',
                    show: true
                }
            },
            stats: {
                show: true,
            },
            observatory: {
                title: 'Observatorio Técnico de\nAcción Eclesial',
                subtitle: 'Más que un mapa, una herramienta de auditoría social. Senda documenta y valida cada intervención con rigor técnico.',
                description: '',
                cards: {
                    card1: { icon: 'equalizer_chart', title: 'Trazabilidad', desc: 'Datos verificables sobre quién hace qué y dónde.', route: '' },
                    card2: { icon: 'share_location', title: 'Capilaridad', desc: 'Demostración de presencia territorial donde el Estado no llega.', route: '' },
                    card3: { icon: 'verified_user', title: 'Transparencia', desc: 'Protocolos de validación de identidad eclesial.', route: '' },
                },
                show: true
            },
            about: {
                show: true,
                title: '¿Por qué nace SENDA?',
                description: 'En Argentina, la Iglesia Católica sostiene materialmente a la sociedad allí donde nadie más llega. Comedores, merenderos, hogares y centros de apoyo operan incansablemente, pero a menudo de forma aislada.',
                point1: {
                    icon: 'visibility_off',
                    title: 'Falta de Visibilidad',
                    desc: 'Proyectos vitales quedan ocultos en su entorno geográfico.'
                },
                point2: {
                    icon: 'link_off',
                    title: 'Desconexión',
                    desc: 'Dificultad para conectar donantes con necesidades reales verificadas.'
                },
                image: 'https://images.unsplash.com/photo-1594708767771-a7502209ff51?q=80&w=2000&auto=format&fit=crop',
                badgeHeader: 'High Precision',
                badgeFooter: 'Tecnología al servicio de la caridad eficaz.'
            }
        },
        map: {
            title: 'Red Provincial',
            tagline: 'Sistemas de Geolocalización Free',
            showRadiusFilter: true,
            showAIsearch: true,
        },
        impact: {
            title: 'Evidencia del Impacto Social',
            subtitle: 'Sistematización de la intervención en la Provincia de Santa Fe.',
            showHero: true,
            showStats: true,
        },
    },
    features: {
        showMap: true,
        showRegistration: true,
        showCollaboration: true,
    },
    seo: {
        title: 'Senda | Red de Impacto Social Santa Fe',
        description: 'Conectando la solidaridad con la necesidad real en Santa Fe.',
    },
    footer: {
        text: 'Construyendo puentes de caridad eficaz a través de la evidencia y la tecnología en la Provincia de Santa Fe.',
        copyright: '© 2024 Senda. All rights reserved.',
        developerText: 'Developed with High Precision',
    },
};

interface ConfigContextType {
    config: SiteConfig;
    loading: boolean;
    updateConfig: (newConfig: SiteConfig) => void;
    refreshConfig: () => void;
}

const ConfigContext = createContext<ConfigContextType>({
    config: DEFAULT_CONFIG,
    loading: true,
    updateConfig: () => { },
    refreshConfig: () => { },
});

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [config, setConfig] = useState<SiteConfig>(DEFAULT_CONFIG);
    const [loading, setLoading] = useState(true);

    const loadConfig = () => {
        try {
            const stored = localStorage.getItem('senda_site_config');
            if (stored) {
                const parsed = JSON.parse(stored);
                if (parsed) {
                    // Deep merge logic could go here, but for now simple spread with defaults is safer against missing keys
                    // We'll trust the stored config but overlay it on top of defaults to ensure new keys exist
                    setConfig(prev => deepMerge(DEFAULT_CONFIG, parsed));
                }
            }
        } catch (e) {
            console.error("Error loading site config", e);
        } finally {
            setLoading(false);
        }
    };

    // Deep merge helper
    const deepMerge = (defaultObj: any, storedObj: any): any => {
        const result = { ...defaultObj };
        for (const key in storedObj) {
            if (storedObj[key] && typeof storedObj[key] === 'object' && !Array.isArray(storedObj[key])) {
                result[key] = deepMerge(defaultObj[key] || {}, storedObj[key]);
            } else {
                result[key] = storedObj[key];
            }
        }
        return result;
    };

    useEffect(() => {
        loadConfig();

        // Listen for cross-tab updates or dispatch events
        const handleStorageChange = () => loadConfig();
        window.addEventListener('senda_config_update', handleStorageChange);
        window.addEventListener('storage', handleStorageChange); // Cross-tab support

        return () => {
            window.removeEventListener('senda_config_update', handleStorageChange);
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    // Apply theme side-effects
    useEffect(() => {
        if (config.theme) {
            if (config.theme.primaryColor) document.documentElement.style.setProperty('--color-primary', config.theme.primaryColor);
            if (config.theme.secondaryColor) document.documentElement.style.setProperty('--color-secondary', config.theme.secondaryColor);
            if (config.theme.accentColor) document.documentElement.style.setProperty('--color-accent', config.theme.accentColor);
        }
    }, [config.theme]);

    const updateConfig = (newConfig: SiteConfig) => {
        setConfig(newConfig);
        localStorage.setItem('senda_site_config', JSON.stringify(newConfig));
        // Dispatch event for other listeners in the same tab
        window.dispatchEvent(new Event('senda_config_update'));
    };

    const refreshConfig = () => {
        loadConfig();
    };

    return (
        <ConfigContext.Provider value={{ config, loading, updateConfig, refreshConfig }}>
            {children}
        </ConfigContext.Provider>
    );
};

export const useConfig = () => useContext(ConfigContext);
