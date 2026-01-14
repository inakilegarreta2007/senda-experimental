import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { SiteConfig } from '@/types';
import { useConfig, DEFAULT_CONFIG } from '@/contexts/ConfigContext';

const Vinculos: React.FC = () => {
  const { config: globalConfig, updateConfig, loading } = useConfig();
  const [config, setConfig] = useState<SiteConfig>(DEFAULT_CONFIG);
  const [activeTab, setActiveTab] = useState<'general' | 'home' | 'map' | 'impact' | 'style' | 'portal'>('home');
  const [isSaving, setIsSaving] = useState(false);

  // Sync with global config on load
  useEffect(() => {
    if (!loading) {
      setConfig(globalConfig);
    }
  }, [loading, globalConfig]);

  // Theme preview effect - local
  useEffect(() => {
    document.documentElement.style.setProperty('--color-primary', config.theme.primaryColor);
    document.documentElement.style.setProperty('--color-secondary', config.theme.secondaryColor);
    document.documentElement.style.setProperty('--color-accent', config.theme.accentColor);
  }, [config.theme]);

  const handleSave = () => {
    setIsSaving(true);
    updateConfig(config);
    setTimeout(() => {
      setIsSaving(false);
      toast.success('¡Cambios publicados correctamente!');
    }, 800);
  };

  return (
    <div className="flex flex-col flex-1 min-h-full bg-slate-50 dark:bg-slate-950/20">
      {/* Header */}
      <header className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 sticky top-0 z-30 backdrop-blur-md flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-none">CMS / Configuración</h1>
          <p className="text-slate-500 text-xs mt-1 font-bold uppercase tracking-widest opacity-60">Control Total del Sitio</p>
        </div>
        <button onClick={handleSave} disabled={isSaving} className="px-8 py-4 bg-slate-950 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all">
          {isSaving ? 'Guardando...' : 'Publicar Cambios'}
        </button>
      </header>

      <main className="p-6 md:p-10 lg:flex gap-10 max-w-[1600px] mx-auto w-full">
        {/* Sidebar */}
        <aside className="lg:w-64 space-y-1 mb-8 lg:mb-0 shrink-0">
          <NavSection title="INTERFACES">
            <NavItem icon="home" label="Inicio" active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
            <NavItem icon="map" label="Mapa" active={activeTab === 'map'} onClick={() => setActiveTab('map')} />
            <NavItem icon="bar_chart" label="Impacto" active={activeTab === 'impact'} onClick={() => setActiveTab('impact')} />
            <NavItem icon="Meeting_Room" label="Sala de Espera" active={activeTab === 'portal'} onClick={() => setActiveTab('portal')} />
          </NavSection>
          <NavSection title="GLOBAL">
            <NavItem icon="palette" label="Apariencia" active={activeTab === 'style'} onClick={() => setActiveTab('style')} />
            <NavItem icon="settings" label="General" active={activeTab === 'general'} onClick={() => setActiveTab('general')} />
          </NavSection>
        </aside>


        {/* Content Area */}
        <div className="flex-1 bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm p-10 animate-in fade-in zoom-in-95 duration-300">

          {/* PORTAL TAB */}
          {activeTab === 'portal' && (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">

              {/* Left Column: Editor */}
              <div className="space-y-10">
                <Container title="Sala de Espera (Bienvenida)" icon="meeting_room">
                  <p className="text-sm text-slate-500 mb-6 font-medium">
                    Configure el mensaje que ven los usuarios nuevos antes de ser asignados a un Nodo.
                  </p>
                  <div className="grid grid-cols-1 gap-6">
                    <Field
                      label="Título de Bienvenida"
                      value={config.pages.portal?.welcomeTitle || ''}
                      onChange={v => setConfig(prev => ({ ...prev, pages: { ...prev.pages, portal: { ...prev.pages.portal, welcomeTitle: v } } }))}
                    />
                    <Field
                      label="Subtítulo (Ej: Registro Federal...)"
                      value={config.pages.portal?.welcomeSubtitle || ''}
                      onChange={v => setConfig(prev => ({ ...prev, pages: { ...prev.pages, portal: { ...prev.pages.portal, welcomeSubtitle: v } } }))}
                    />
                    <Field
                      label="Mensaje Principal (Soporta HTML)"
                      value={config.pages.portal?.welcomeMessageIntro || ''}
                      onChange={v => setConfig(prev => ({ ...prev, pages: { ...prev.pages, portal: { ...prev.pages.portal, welcomeMessageIntro: v } } }))}
                      type="textarea"
                    />
                    <Field
                      label="Frase Inspiradora / Cita"
                      value={config.pages.portal?.quote || ''}
                      onChange={v => setConfig(prev => ({ ...prev, pages: { ...prev.pages, portal: { ...prev.pages.portal, quote: v } } }))}
                      type="textarea"
                    />
                    <Field
                      label="Mensaje Explicativo Inferior (Soporta HTML)"
                      value={config.pages.portal?.welcomeMessageExplain || ''}
                      onChange={v => setConfig(prev => ({ ...prev, pages: { ...prev.pages, portal: { ...prev.pages.portal, welcomeMessageExplain: v } } }))}
                      type="textarea"
                    />
                  </div>
                </Container>
              </div>

              {/* Right Column: Live Preview */}
              <div className="relative">
                <div className="sticky top-24">
                  <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-4 text-center">Vista Previa en Vivo</h3>

                  {/* Simulated Porch Component */}
                  <div className="w-full bg-slate-50 dark:bg-slate-950 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-inner flex items-center justify-center min-h-[600px]">
                    <div className="max-w-sm w-full bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl shadow-primary/10 border border-slate-200 dark:border-slate-800 p-8 text-center relative overflow-hidden transform scale-90 sm:scale-100 transition-all">
                      {/* Decorative BG */}
                      <div className="absolute -top-20 -right-20 w-64 h-64 bg-accent/10 rounded-full blur-3xl pointer-events-none"></div>

                      <div className="relative z-10">
                        <div className="size-16 bg-celeste/20 text-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner ring-4 ring-white dark:ring-slate-900">
                          <span className="material-symbols-outlined text-3xl">church</span>
                        </div>

                        <h1 className="text-xl font-black text-primary dark:text-white mb-2">
                          {config.pages.portal?.welcomeTitle || 'Bienvenido a SENDA'}
                        </h1>
                        <p className="text-xs font-medium text-slate-500 mb-6 uppercase tracking-wider">
                          {config.pages.portal?.welcomeSubtitle || 'Registro Federal de Intervención Social'}
                        </p>

                        <div className="space-y-4 text-slate-600 dark:text-slate-300 leading-relaxed text-xs">
                          <div dangerouslySetInnerHTML={{ __html: config.pages.portal?.welcomeMessageIntro || 'Mensaje de bienvenida...' }} />

                          <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl border-l-4 border-accent text-left relative overflow-hidden">
                            <span className="absolute top-2 right-2 text-accent/20 material-symbols-outlined text-3xl">format_quote</span>
                            <p className="italic font-medium text-amber-800 dark:text-amber-200 relative z-10">
                              {config.pages.portal?.quote || '"Frase inspiradora..."'}
                            </p>
                          </div>

                          <div dangerouslySetInnerHTML={{ __html: config.pages.portal?.welcomeMessageExplain || 'Explicación del proceso...' }} />
                        </div>

                        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3 opacity-50 grayscale">
                          <button className="w-full py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 font-bold flex items-center justify-center gap-2 text-xs pointer-events-none">
                            <span className="material-symbols-outlined text-sm">refresh</span>
                            Consultar Estado (Simulado)
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-center text-xs text-slate-400 mt-4 italic">
                    Así es como lo verá el usuario en su dispositivo.
                  </p>
                </div>
              </div>

            </div>
          )}

          {/* HOME TAB */}
          {activeTab === 'home' && (
            <div className="space-y-10">
              <Container title="Hero Principal" icon="crop_original">
                <Field label="Título (Encabezado)" value={config.pages.home.hero.title} onChange={v => setConfig(prev => ({ ...prev, pages: { ...prev.pages, home: { ...prev.pages.home, hero: { ...prev.pages.home.hero, title: v } } } }))} type="textarea" />
                <Field label="Subtítulo" value={config.pages.home.hero.subtitle} onChange={v => setConfig(prev => ({ ...prev, pages: { ...prev.pages, home: { ...prev.pages.home, hero: { ...prev.pages.home.hero, subtitle: v } } } }))} type="textarea" />

                <div className="mt-6 pt-6 border-t border-slate-100 space-y-4">
                  <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Botón de Métricas</h4>
                  <Toggle
                    label="Mostrar Botón"
                    checked={config.pages.home.hero.metricsButton?.show ?? false}
                    onChange={() => setConfig(prev => ({
                      ...prev,
                      pages: {
                        ...prev.pages,
                        home: {
                          ...prev.pages.home,
                          hero: {
                            ...prev.pages.home.hero,
                            metricsButton: {
                              label: prev.pages.home.hero.metricsButton?.label || 'VER IMPACTO',
                              show: !(prev.pages.home.hero.metricsButton?.show ?? false)
                            }
                          }
                        }
                      }
                    }))}
                  />
                  {(config.pages.home.hero.metricsButton?.show ?? false) && (
                    <Field
                      label="Texto del Botón"
                      value={config.pages.home.hero.metricsButton?.label ?? 'VER IMPACTO'}
                      onChange={v => setConfig(prev => ({
                        ...prev,
                        pages: {
                          ...prev.pages,
                          home: {
                            ...prev.pages.home,
                            hero: {
                              ...prev.pages.home.hero,
                              metricsButton: {
                                ...prev.pages.home.hero.metricsButton!,
                                label: v
                              }
                            }
                          }
                        }
                      }))}
                    />
                  )}
                </div>
              </Container>

              <Container title="Observatorio Técnico" icon="travel_explore">
                <Toggle label="Mostrar Sección" checked={config.pages.home.observatory?.show ?? true} onChange={() => setConfig(prev => ({ ...prev, pages: { ...prev.pages, home: { ...prev.pages.home, observatory: { ...prev.pages.home.observatory, show: !prev.pages.home.observatory.show } } } }))} />

                {config.pages.home.observatory?.show && (
                  <div className="mt-6 space-y-6 pl-4 border-l-2 border-slate-100">
                    <Field label="Título de Sección" value={config.pages.home.observatory.title} onChange={v => setConfig(prev => ({ ...prev, pages: { ...prev.pages, home: { ...prev.pages.home, observatory: { ...prev.pages.home.observatory, title: v } } } }))} />
                    <Field label="Descripción General" value={config.pages.home.observatory.subtitle} onChange={v => setConfig(prev => ({ ...prev, pages: { ...prev.pages, home: { ...prev.pages.home, observatory: { ...prev.pages.home.observatory, subtitle: v } } } }))} type="textarea" />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                      {['card1', 'card2', 'card3'].map((key) => (
                        <div key={key} className="p-4 bg-slate-50 rounded-xl space-y-3">
                          <div className="text-[10px] uppercase font-black text-slate-400">Tarjeta {key.replace('card', '')}</div>
                          <Field label="Título" value={config.pages.home.observatory.cards[key as keyof typeof config.pages.home.observatory.cards].title} onChange={v => {
                            const newCards = { ...config.pages.home.observatory.cards };
                            (newCards as any)[key].title = v;
                            setConfig(prev => ({ ...prev, pages: { ...prev.pages, home: { ...prev.pages.home, observatory: { ...prev.pages.home.observatory, cards: newCards } } } }));
                          }} />
                          <Field label="Texto" value={config.pages.home.observatory.cards[key as keyof typeof config.pages.home.observatory.cards].desc} onChange={v => {
                            const newCards = { ...config.pages.home.observatory.cards };
                            (newCards as any)[key].desc = v;
                            setConfig(prev => ({ ...prev, pages: { ...prev.pages, home: { ...prev.pages.home, observatory: { ...prev.pages.home.observatory, cards: newCards } } } }));
                          }} type="textarea" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Container>

              <Container title="Acerca de Senda (Problema)" icon="help_outline">
                <Toggle label="Mostrar Sección" checked={config.pages.home.about?.show ?? true} onChange={() => setConfig(prev => ({ ...prev, pages: { ...prev.pages, home: { ...prev.pages.home, about: { ...prev.pages.home.about, show: !prev.pages.home.about.show } } } }))} />

                {config.pages.home.about?.show && (
                  <div className="mt-6 space-y-6">
                    <Field label="Título de Sección" value={config.pages.home.about.title} onChange={v => setConfig(prev => ({ ...prev, pages: { ...prev.pages, home: { ...prev.pages.home, about: { ...prev.pages.home.about, title: v } } } }))} />
                    <Field label="Descripción Principal" value={config.pages.home.about.description} onChange={v => setConfig(prev => ({ ...prev, pages: { ...prev.pages, home: { ...prev.pages.home, about: { ...prev.pages.home.about, description: v } } } }))} type="textarea" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-4 bg-slate-50 rounded-xl space-y-3">
                        <div className="text-[10px] uppercase font-black text-slate-400">Punto 1</div>
                        <Field label="Icono (Material Symbols)" value={config.pages.home.about.point1.icon} onChange={v => setConfig(prev => ({ ...prev, pages: { ...prev.pages, home: { ...prev.pages.home, about: { ...prev.pages.home.about, point1: { ...prev.pages.home.about.point1, icon: v } } } } }))} />
                        <Field label="Título" value={config.pages.home.about.point1.title} onChange={v => setConfig(prev => ({ ...prev, pages: { ...prev.pages, home: { ...prev.pages.home, about: { ...prev.pages.home.about, point1: { ...prev.pages.home.about.point1, title: v } } } } }))} />
                        <Field label="Descripción" value={config.pages.home.about.point1.desc} onChange={v => setConfig(prev => ({ ...prev, pages: { ...prev.pages, home: { ...prev.pages.home, about: { ...prev.pages.home.about, point1: { ...prev.pages.home.about.point1, desc: v } } } } }))} type="textarea" />
                      </div>
                      <div className="p-4 bg-slate-50 rounded-xl space-y-3">
                        <div className="text-[10px] uppercase font-black text-slate-400">Punto 2</div>
                        <Field label="Icono (Material Symbols)" value={config.pages.home.about.point2.icon} onChange={v => setConfig(prev => ({ ...prev, pages: { ...prev.pages, home: { ...prev.pages.home, about: { ...prev.pages.home.about, point2: { ...prev.pages.home.about.point2, icon: v } } } } }))} />
                        <Field label="Título" value={config.pages.home.about.point2.title} onChange={v => setConfig(prev => ({ ...prev, pages: { ...prev.pages, home: { ...prev.pages.home, about: { ...prev.pages.home.about, point2: { ...prev.pages.home.about.point2, title: v } } } } }))} />
                        <Field label="Descripción" value={config.pages.home.about.point2.desc} onChange={v => setConfig(prev => ({ ...prev, pages: { ...prev.pages, home: { ...prev.pages.home, about: { ...prev.pages.home.about, point2: { ...prev.pages.home.about.point2, desc: v } } } } }))} type="textarea" />
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-xl space-y-3">
                      <div className="text-[10px] uppercase font-black text-slate-400">Imagen y Badge</div>
                      <Field label="URL Imagen Principal" value={config.pages.home.about.image} onChange={v => setConfig(prev => ({ ...prev, pages: { ...prev.pages, home: { ...prev.pages.home, about: { ...prev.pages.home.about, image: v } } } }))} />
                      <Field label="Título Badge (Ej: High Precision)" value={config.pages.home.about.badgeHeader} onChange={v => setConfig(prev => ({ ...prev, pages: { ...prev.pages, home: { ...prev.pages.home, about: { ...prev.pages.home.about, badgeHeader: v } } } }))} />
                      <Field label="Texto Badge" value={config.pages.home.about.badgeFooter} onChange={v => setConfig(prev => ({ ...prev, pages: { ...prev.pages, home: { ...prev.pages.home, about: { ...prev.pages.home.about, badgeFooter: v } } } }))} />
                    </div>
                  </div>
                )}
              </Container>
            </div>
          )}

          {/* MAP TAB */}
          {activeTab === 'map' && (
            <div className="space-y-10">
              <Container title="Configuración de Mapa" icon="map">
                <Field label="Título Sidebar" value={config.pages.map.title} onChange={v => setConfig(prev => ({ ...prev, pages: { ...prev.pages, map: { ...prev.pages.map, title: v } } }))} />
                <Field label="Tagline / Bajada" value={config.pages.map.tagline} onChange={v => setConfig(prev => ({ ...prev, pages: { ...prev.pages, map: { ...prev.pages.map, tagline: v } } }))} />
              </Container>
              <Container title="Funcionalidades" icon="tune">
                <Toggle label="Filtro de Radio" checked={config.pages.map.showRadiusFilter} onChange={() => setConfig(prev => ({ ...prev, pages: { ...prev.pages, map: { ...prev.pages.map, showRadiusFilter: !prev.pages.map.showRadiusFilter } } }))} />
                <Toggle label="Búsqueda con IA" checked={config.pages.map.showAIsearch} onChange={() => setConfig(prev => ({ ...prev, pages: { ...prev.pages, map: { ...prev.pages.map, showAIsearch: !prev.pages.map.showAIsearch } } }))} />
              </Container>
            </div>
          )}

          {/* IMPACT TAB */}
          {activeTab === 'impact' && (
            <div className="space-y-10">
              <Container title="Header Impacto" icon="analytics">
                <Field label="Título Principal" value={config.pages.impact.title} onChange={v => setConfig(prev => ({ ...prev, pages: { ...prev.pages, impact: { ...prev.pages.impact, title: v } } }))} type="textarea" />
                <Field label="Subtítulo" value={config.pages.impact.subtitle} onChange={v => setConfig(prev => ({ ...prev, pages: { ...prev.pages, impact: { ...prev.pages.impact, subtitle: v } } }))} type="textarea" />
              </Container>
              <Container title="Visibilidad" icon="visibility">
                <Toggle label="Mostrar Hero" checked={config.pages.impact.showHero} onChange={() => setConfig(prev => ({ ...prev, pages: { ...prev.pages, impact: { ...prev.pages.impact, showHero: !prev.pages.impact.showHero } } }))} />
                <Toggle label="Mostrar Estadísticas" checked={config.pages.impact.showStats} onChange={() => setConfig(prev => ({ ...prev, pages: { ...prev.pages, impact: { ...prev.pages.impact, showStats: !prev.pages.impact.showStats } } }))} />
              </Container>
            </div>
          )}

          {/* STYLE TAB */}
          {activeTab === 'style' && (
            <div className="space-y-10">
              <Container title="Paleta de Colores" icon="palette">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <ColorPicker label="Primario" value={config.theme.primaryColor} onChange={v => setConfig(prev => ({ ...prev, theme: { ...prev.theme, primaryColor: v } }))} />
                  <ColorPicker label="Secundario" value={config.theme.secondaryColor} onChange={v => setConfig(prev => ({ ...prev, theme: { ...prev.theme, secondaryColor: v } }))} />
                  <ColorPicker label="Acento" value={config.theme.accentColor} onChange={v => setConfig(prev => ({ ...prev, theme: { ...prev.theme, accentColor: v } }))} />
                </div>
              </Container>
            </div>
          )}

          {/* GENERAL TAB */}
          {activeTab === 'general' && (
            <div className="space-y-10">
              <Container title="Contacto y Pie de Página" icon="contact_mail">
                <Field label="Email" value={config.contact.email} onChange={v => setConfig(prev => ({ ...prev, contact: { ...prev.contact, email: v } }))} />
                <Field label="Dirección" value={config.contact.address} onChange={v => setConfig(prev => ({ ...prev, contact: { ...prev.contact, address: v } }))} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Instagram (URL)" value={config.contact.instagram} onChange={v => setConfig(prev => ({ ...prev, contact: { ...prev.contact, instagram: v } }))} />
                  <Field label="Facebook (URL)" value={config.contact.facebook} onChange={v => setConfig(prev => ({ ...prev, contact: { ...prev.contact, facebook: v } }))} />
                </div>
                <Field label="Footer Texto" value={config.footer.text} onChange={v => setConfig(prev => ({ ...prev, footer: { ...prev.footer, text: v } }))} type="textarea" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Copyright (Footer)" value={config.footer.copyright} onChange={v => setConfig(prev => ({ ...prev, footer: { ...prev.footer, copyright: v } }))} />
                  <Field label="Crédito Desarrollador" value={config.footer.developerText} onChange={v => setConfig(prev => ({ ...prev, footer: { ...prev.footer, developerText: v } }))} />
                </div>
              </Container>
              <Container title="Funcionalidades Globales" icon="toggle_on">
                <Toggle label="Mostrar Acceso a Mapa" checked={config.features.showMap} onChange={() => setConfig(prev => ({ ...prev, features: { ...prev.features, showMap: !prev.features.showMap } }))} />
                <Toggle label="Mostrar Botón Registro" checked={config.features.showRegistration} onChange={() => setConfig(prev => ({ ...prev, features: { ...prev.features, showRegistration: !prev.features.showRegistration } }))} />
                <Toggle label="Mostrar Botón Colaborar" checked={config.features.showCollaboration} onChange={() => setConfig(prev => ({ ...prev, features: { ...prev.features, showCollaboration: !prev.features.showCollaboration } }))} />
              </Container>
              <Container title="Mantenimiento" icon="build">
                <Toggle label="Modo Mantenimiento" checked={config.general.maintenanceMode} onChange={() => setConfig(prev => ({ ...prev, general: { ...prev.general, maintenanceMode: !prev.general.maintenanceMode } }))} />

                {config.general.maintenanceMode && (
                  <div className="mt-6 space-y-6 pt-6 border-t border-slate-100 animate-in fade-in slide-in-from-top-4">
                    <Field
                      label="Título (Soporta HTML)"
                      value={config.general.maintenanceTitle || ''}
                      onChange={v => setConfig(prev => ({ ...prev, general: { ...prev.general, maintenanceTitle: v } }))}
                      type="textarea"
                    />
                    <Field
                      label="Mensaje (Soporta HTML)"
                      value={config.general.maintenanceMessage || ''}
                      onChange={v => setConfig(prev => ({ ...prev, general: { ...prev.general, maintenanceMessage: v } }))}
                      type="textarea"
                    />
                  </div>
                )}
              </Container>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

// --- Atomic Components ---

const NavSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <div className="mb-8">
    <h3 className="px-4 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-3">{title}</h3>
    <div className="space-y-1">{children}</div>
  </div>
);

const NavItem = ({ icon, label, active, onClick }: { icon: string, label: string, active: boolean, onClick: () => void }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${active ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100'}`}>
    <span className="material-symbols-outlined text-[18px]">{icon}</span>
    {label}
  </button>
);

const Container = ({ title, icon, children }: { title: string, icon: string, children: React.ReactNode }) => (
  <section className="bg-white rounded-none space-y-6">
    <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
      <span className="material-symbols-outlined text-slate-400">{icon}</span>
      <h2 className="text-lg font-black text-slate-800">{title}</h2>
    </div>
    <div>{children}</div>
  </section>
);

const Field = ({ label, value, onChange, type = 'text' }: { label: string, value: string, onChange: (v: string) => void, type?: 'text' | 'textarea' }) => (
  <div className="mb-4">
    <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">{label}</label>
    {type === 'textarea' ? (
      <textarea className="w-full p-4 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-primary text-sm font-medium" rows={3} value={value} onChange={e => onChange(e.target.value)} />
    ) : (
      <input className="w-full p-4 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-primary text-sm font-bold" value={value} onChange={e => onChange(e.target.value)} />
    )}
  </div>
);

const Toggle = ({ label, checked, onChange }: { label: string, checked: boolean, onChange: () => void }) => (
  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
    <span className="font-bold text-sm text-slate-700">{label}</span>
    <button onClick={onChange} className={`w-12 h-6 rounded-full p-1 transition-colors ${checked ? 'bg-primary' : 'bg-slate-300'}`}>
      <div className={`w-4 h-4 rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-0'}`} />
    </button>
  </div>
);

const ColorPicker = ({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) => (
  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
    <input
      type="color"
      value={value}
      onInput={e => onChange((e.target as HTMLInputElement).value)}
      onChange={e => onChange(e.target.value)}
      className="w-10 h-10 rounded-lg cursor-pointer border-none bg-transparent"
    />
    <div>
      <div className="text-[9px] font-black uppercase text-slate-400">{label}</div>
      <div className="text-xs font-mono font-bold text-slate-700">{value}</div>
    </div>
  </div>
);

export default Vinculos;
