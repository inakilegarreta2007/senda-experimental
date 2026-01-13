
import React from 'react';

const Porch: React.FC = () => {
    return (
        <div className="min-h-screen w-full flex items-center justify-center p-6 font-display bg-slate-50 dark:bg-slate-950">
            <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 p-10 text-center relative overflow-hidden animate-in fade-in zoom-in duration-500">
                {/* Decorative BG */}
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-amber-50 to-transparent dark:from-amber-900/20 pointer-events-none"></div>

                <div className="relative z-10">
                    <div className="size-24 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl shadow-inner">
                        🙏
                    </div>

                    <h1 className="text-2xl font-black text-slate-800 dark:text-white mb-4">
                        ¡Hola! Qué bueno tenerte acá.
                    </h1>

                    <div className="space-y-4 text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
                        <p>
                            Ya estás dentro de la familia <strong>SENDA</strong>, pero todavía nos falta un pasito importante.
                        </p>
                        <p className="italic font-medium text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 p-4 rounded-2xl border border-amber-100 dark:border-amber-800/50">
                            "La paciencia todo lo alcanza. Quien a Dios tiene nada le falta."
                        </p>
                        <p>
                            Un administrador está revisando tu solicitud para asignarte tu <strong>Misión (Nodo)</strong>. En cuanto te vinculen con tu parroquia o comedor, este panel se va a iluminar automáticamente para que puedas empezar a trabajar.
                        </p>
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-4">
                            Mientras tanto...
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="w-full py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                        >
                            <span className="material-symbols-outlined">refresh</span>
                            Verificar si ya me dieron el alta
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Porch;
