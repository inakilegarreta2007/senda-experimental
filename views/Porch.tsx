
import React from 'react';
import { useConfig } from '../contexts/ConfigContext';
import { useAuth } from '../contexts/AuthContext';

const Porch: React.FC = () => {
    const { signOut } = useAuth();
    const { config } = useConfig();

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-6 font-display bg-slate-50 dark:bg-slate-950">
            <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl shadow-primary/10 border border-slate-200 dark:border-slate-800 p-10 text-center relative overflow-hidden animate-in fade-in zoom-in duration-500">
                {/* Decorative BG - Argentine Sun Hint */}
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-accent/10 rounded-full blur-3xl pointer-events-none"></div>

                <div className="relative z-10">
                    <div className="size-20 bg-celeste/20 text-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner ring-4 ring-white dark:ring-slate-900">
                        <span className="material-symbols-outlined text-4xl">church</span>
                    </div>

                    <h1 className="text-2xl font-black text-primary dark:text-white mb-2">
                        {config.pages.portal?.welcomeTitle || 'Bienvenido a SENDA'}
                    </h1>
                    <p className="text-sm font-medium text-slate-500 mb-6 uppercase tracking-wider">
                        {config.pages.portal?.welcomeSubtitle || ''}
                    </p>

                    <div className="space-y-6 text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
                        <div dangerouslySetInnerHTML={{ __html: config.pages.portal?.welcomeMessageIntro || 'Estamos procesando su vinculación institucional.' }} />

                        <div className="bg-amber-50 dark:bg-amber-900/20 p-5 rounded-xl border-l-4 border-accent text-left relative overflow-hidden">
                            <span className="absolute top-2 right-2 text-accent/20 material-symbols-outlined text-4xl">format_quote</span>
                            <p className="italic font-medium text-amber-800 dark:text-amber-200 relative z-10">
                                {config.pages.portal?.quote || '"La caridad es el abrazo de Dios a través de nuestras manos."'}
                            </p>
                        </div>

                        <div dangerouslySetInnerHTML={{ __html: config.pages.portal?.welcomeMessageExplain || 'Un administrador revisará su solicitud.' }} />
                    </div>

                </div>

                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
                    <button
                        onClick={() => window.location.reload()}
                        className="w-full py-3.5 rounded-xl bg-slate-50 hover:bg-celeste/10 border border-slate-200 hover:border-celeste text-slate-600 hover:text-primary font-bold transition-all flex items-center justify-center gap-2 group"
                    >
                        <span className="material-symbols-outlined group-hover:rotate-180 transition-transform">refresh</span>
                        Consultar Estado de Alta
                    </button>

                    <button
                        onClick={() => signOut()}
                        className="text-xs text-slate-400 hover:text-red-500 underline decoration-slate-300 underline-offset-4 transition-colors"
                    >
                        Cerrar Sesión
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Porch;
