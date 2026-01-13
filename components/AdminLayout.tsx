
import React from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { Stats } from '../types';
import Logo from '@/img/logo.png';

import { useAuth } from '../contexts/AuthContext';

interface AdminLayoutProps {
  stats: Stats;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ stats }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const menuItems = [
    { path: '/admin', icon: 'dashboard', label: 'Tablero Principal' },
    { path: '/admin/observatorio', icon: 'monitoring', label: 'Observatorio Social' },
    { path: '/admin/institutions', icon: 'church', label: 'Red de Nodos' },
    { path: '/admin/notifications', icon: 'notifications', label: 'Notificaciones', badge: stats.pendingNotifications },
    { path: '/admin/validations', icon: 'verified', label: 'Validar Solicitudes', badge: stats.pendingValidations },
    { path: '/admin/users', icon: 'group', label: 'Usuarios' },
    { path: '/admin/reports', icon: 'bar_chart', label: 'Reportes de Impacto' },
    { path: '/admin/links', icon: 'settings_suggest', label: 'Configuración de Sitio' },
  ];

  return (
    <div className="flex h-screen bg-background-light dark:bg-background-dark overflow-hidden font-display">
      <aside className="w-72 bg-primary text-white hidden md:flex flex-col shadow-xl shrink-0 z-50">
        <div className="p-6">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-white/10 p-1.5 rounded-xl group-hover:bg-white/20 transition-all">
              <img src={Logo} alt="Senda Logo" className="size-10" />
            </div>
            <div>
              <h1 className="text-xl font-black leading-none tracking-tighter">Senda Admin</h1>
              <p className="text-white/60 text-[10px] uppercase tracking-widest mt-1">Gestión de Ayuda</p>
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
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${isActive
                  ? 'bg-white/10 text-white shadow-inner'
                  : 'text-white/60 hover:bg-white/5 hover:text-white'
                  }`}
              >
                <span className={`material-symbols-outlined ${isActive ? 'fill' : ''} group-hover:scale-110 transition-transform`}>
                  {item.icon}
                </span>
                <span className={`text-sm ${isActive ? 'font-bold' : 'font-medium'}`}>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="ml-auto bg-red-500 text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-[1.5rem] text-center shadow-lg">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mt-auto border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-white/50 hover:text-white hover:bg-white/5 rounded-xl w-full transition-all group"
          >
            <span className="material-symbols-outlined group-hover:rotate-12 transition-transform">logout</span>
            <span className="font-bold text-sm">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-y-auto relative">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
