
import React from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Logo from '@/img/logo.png';

const RepresentativeLayout: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { signOut } = useAuth();

    const handleLogout = async () => {
        await signOut();
        navigate('/login');
    };

    const menuItems = [
        { icon: 'dashboard', label: 'Mi Nodo', path: '/portal' },
        { icon: 'visibility', label: 'Ficha Pública', path: '/portal/view' },
        { icon: 'help', label: 'Ayuda y Soporte', path: '/portal/help' },
    ];

    return (
        <div className="flex h-screen bg-slate-50 dark:bg-slate-900 overflow-hidden font-display">
            {/* Sidebar Simplified */}
            <aside className="w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 hidden md:flex flex-col z-50">
                <div className="p-6 border-b border-slate-100 dark:border-slate-700">
                    <Link to="/" className="flex items-center gap-3">
                        <img src={Logo} alt="Senda Logo" className="size-8" />
                        <div>
                            <h1 className="text-lg font-bold text-slate-800 dark:text-white leading-none">Mi Portal</h1>
                            <p className="text-slate-400 text-[10px] uppercase tracking-widest mt-1">Gestión de Nodo</p>
                        </div>
                    </Link>
                </div>

                <nav className="flex-1 px-4 space-y-1 mt-6">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`
                                    group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300
                                    ${isActive
                                        ? 'bg-gradient-to-r from-primary to-blue-600 text-white shadow-lg shadow-primary/30'
                                        : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-primary dark:text-slate-400'
                                    }
                                `}
                            >
                                <span className="material-symbols-outlined transition-transform duration-300 group-hover:scale-110">{item.icon}</span>
                                <span className={`font-bold text-sm tracking-wide transition-all duration-300 ${isActive ? 'translate-x-1' : ''}`}>{item.label}</span>
                                {isActive && (
                                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-lg animate-pulse" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 mt-auto border-t border-slate-100 dark:border-slate-700">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-xl w-full transition-all group"
                    >
                        <span className="material-symbols-outlined group-hover:rotate-12 transition-transform">logout</span>
                        <span className="font-bold text-sm">Cerrar Sesión</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-y-auto relative bg-slate-50 dark:bg-slate-900">
                <Outlet />
            </main>
        </div>
    );
};

export default RepresentativeLayout;
