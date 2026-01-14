import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import Porch from '../views/Porch';
import { mockInstitutions } from '@/utils/mockData';

const RepresentativeLayout: React.FC = () => {
    const { user, signOut } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [hasAccess, setHasAccess] = useState<boolean | null>(null); // Null = loading



    // SECURITY CHECK: Does this user have a VALID mission?
    useEffect(() => {
        const checkAccess = async () => {
            // Simulate a brief check for UX smoothness
            await new Promise(r => setTimeout(r, 600));

            const linkedId = user?.user_metadata?.institution_id;

            if (!linkedId) {
                setHasAccess(false);
                return;
            }

            // Verify if the node actually exists in our data
            // In a real app, this would be a Supabase query
            const isValidNode = mockInstitutions.some(i => i.id === linkedId);

            setHasAccess(isValidNode);
        };
        checkAccess();
    }, [user]);

    const handleLogout = async () => {
        await signOut();
        navigate('/login');
        toast.success('Sesión cerrada correctamente');
    };

    const menuItems = [
        { icon: 'dashboard', label: 'Mi Nodo', path: '/portal' },
        { icon: 'visibility', label: 'Ficha Pública', path: '/portal/view' },
        { icon: 'help', label: 'Ayuda y Soporte', path: '/portal/help' },
    ];

    // 1. Loading State
    if (hasAccess === null) {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-4">Cargando Misión...</p>
            </div>
        );
    }

    // 2. BLOCKED STATE (NO ID) -> Show "Porch" (Sala de Espera)
    if (hasAccess === false) {
        return <Porch />;
    }

    // 3. ALLOWED STATE -> Show Full Dashboard
    return (
        <div className="flex h-screen bg-slate-50 dark:bg-slate-950 font-display overflow-hidden">
            {/* Sidebar */}
            <aside
                className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 flex flex-col relative z-20 shadow-xl`}
            >
                {/* Logo Area */}
                <div className="h-20 flex items-center justify-center border-b border-slate-100 dark:border-slate-800">
                    {isSidebarOpen ? (
                        <h1 className="text-xl font-black tracking-tighter text-slate-800 dark:text-white uppercase">
                            Red<span className="text-primary">Senda</span>
                        </h1>
                    ) : (
                        <span className="material-symbols-outlined text-primary text-3xl">hub</span>
                    )}
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all group ${isActive
                                    ? 'bg-primary text-white shadow-lg shadow-primary/30'
                                    : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-primary'
                                    }`}
                                title={!isSidebarOpen ? item.label : ''}
                            >
                                <span className={`material-symbols-outlined ${!isSidebarOpen ? 'mx-auto' : ''}`}>
                                    {item.icon}
                                </span>
                                {isSidebarOpen && (
                                    <span className="font-bold text-sm tracking-wide">{item.label}</span>
                                )}
                            </Link>
                        )
                    })}
                </nav>

                {/* Footer User Info */}
                <div className="p-4 border-t border-slate-100 dark:border-slate-800">
                    <div className={`flex items-center gap-3 ${!isSidebarOpen && 'justify-center'}`}>
                        <div className="size-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                            {user?.email?.[0].toUpperCase()}
                        </div>
                        {isSidebarOpen && (
                            <div className="overflow-hidden">
                                <p className="text-xs font-bold text-slate-700 dark:text-white truncate">{user?.email}</p>
                                <p className="text-[10px] text-slate-400 capitalize">{user?.user_metadata?.role || 'Gestor'}</p>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={handleLogout}
                        className={`mt-4 flex items-center gap-2 text-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg w-full transition-colors ${!isSidebarOpen && 'justify-center'}`}
                    >
                        <span className="material-symbols-outlined">logout</span>
                        {isSidebarOpen && <span className="text-xs font-bold uppercase">Cerrar Sesión</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-full overflow-hidden relative">
                {/* Top Bar mobile toggle could go here */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};
export default RepresentativeLayout;
