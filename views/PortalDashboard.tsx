
import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const PortalDashboard: React.FC = () => {
    const { user } = useAuth();

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-8">
            <header>
                <h1 className="text-2xl font-black text-slate-800 dark:text-white">
                    Bienvenido, {user?.user_metadata?.name || 'Referente'}
                </h1>
                <p className="text-slate-500 mt-2">
                    Desde aquí puedes gestionar la información pública de tu institución.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Status Card */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-xl">
                            <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400">verified</span>
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800 dark:text-white">Estado del Nodo</h3>
                            <p className="text-emerald-600 dark:text-emerald-400 text-sm font-bold">Activo y Visible</p>
                        </div>
                    </div>
                    <p className="text-slate-500 text-sm">
                        Tu institución aparece correctamente en el mapa. La última actualización fue hace 2 días.
                    </p>
                </div>

                {/* Edit Request Card */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-xl">
                            <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">edit_document</span>
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800 dark:text-white">Solicitar Cambios</h3>
                            <p className="text-slate-400 text-sm">Información Pública</p>
                        </div>
                    </div>
                    <p className="text-slate-500 text-sm mb-4">
                        Si detectas un error en tu dirección, teléfono u horarios, puedes solicitar una corrección.
                    </p>
                    <button className="w-full py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg font-bold text-sm transition-colors">
                        Iniciar Solicitud
                    </button>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="pt-8 border-t border-slate-200 dark:border-slate-700">
                <h3 className="text-red-500 font-bold mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined icon-sm">warning</span>
                    Zona de Peligro
                </h3>
                <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 p-4 rounded-xl flex items-center justify-between">
                    <div>
                        <p className="text-red-800 dark:text-red-200 font-bold text-sm">Solicitar Baja del Nodo</p>
                        <p className="text-red-600 dark:text-red-300 text-xs mt-1">
                            Esto enviará una alerta al administrador para remover tu institución del mapa.
                        </p>
                    </div>
                    <button className="px-4 py-2 bg-white dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg text-sm font-bold hover:bg-red-50 transition-colors">
                        Solicitar Baja
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PortalDashboard;
