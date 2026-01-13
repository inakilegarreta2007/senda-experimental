
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '@/img/logo.png';
import { supabase } from '../supabaseClient';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';

const Login: React.FC = () => {
  const { signInDev, signInRepresentativeDev, user, signOut } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const userRole = (user?.user_metadata?.role as UserRole) || 'Rol Desconocido';
  const linkedInstId = user?.user_metadata?.institution_id;

  const handleDevLogin = async () => {
    if (confirm('¿Ingresar en MODO DESARROLLADOR (Admin)? Esto omitirá la autenticación real.')) {
      await signInDev();
      // Reload handles navigation or AuthContext listener
    }
  };

  const handleRepLogin = async () => {
    if (confirm('¿Ingresar como REFERENTE DE NODO (Dev)?')) {
      await signInRepresentativeDev();
    }
  };

  const handleLogout = async () => {
    await signOut();
    toast.success("Sesión cerrada correctamente");
    // Stay on login page to re-login
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error('Credenciales incorrectas');
        setIsLoading(false);
        return;
      }

      toast.success('¡Acceso autorizado!');
      navigate('/admin');

    } catch (err) {
      console.error('Login error:', err);
      toast.error('Error al iniciar sesión');
      setIsLoading(false);
    }
  };

  // RENDER: LOGGED IN STATE
  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6 font-display">
        <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden text-center p-12 space-y-8">
          <div className="size-24 rounded-full bg-slate-100 mx-auto flex items-center justify-center text-4xl mb-4 animate-bounce">
            🔐
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Sesión Activa</h2>
            <p className="text-slate-500 font-medium mt-2">{user.email}</p>
            <div className="flex justify-center gap-2 mt-3">
              <span className="px-3 py-1 rounded-lg bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest border border-blue-100">
                {userRole}
              </span>
              {linkedInstId && (
                <span className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                  Nodo #{linkedInstId}
                </span>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => navigate(userRole === UserRole.ADMIN ? '/admin' : '/portal')}
              className="w-full py-4 rounded-xl bg-primary text-white font-black uppercase tracking-wider shadow-lg hover:bg-blue-600 transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">dashboard</span>
              Continuar al Panel
            </button>
            <button
              onClick={handleLogout}
              className="w-full py-4 rounded-xl bg-slate-100 text-slate-500 font-black uppercase tracking-wider hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">logout</span>
              Cerrar Sesión / Cambiar Cuenta
            </button>
          </div>
        </div>
      </div>
    );
  }

  // RENDER: LOGIN FORM (If not logged in)
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6 font-display">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="p-8 md:p-12">
          <div className="flex flex-col items-center mb-10">
            <div className="bg-primary/5 p-6 rounded-[2.5rem] mb-6">
              <img src={Logo} alt="Senda Logo" className="size-20" />
            </div>
            <h1 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white uppercase">
              Centro de Auditoría
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-black uppercase tracking-widest mt-2 text-center">
              Acceso restringido para gestores <br />y auditores de la Red Senda
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 ml-1">
                Correo Electrónico
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="auditor@sendasantafe.org"
                className="w-full h-14 px-6 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-primary dark:text-white transition-all font-bold"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 ml-1">
                Contraseña
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-14 px-6 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-primary dark:text-white transition-all font-bold"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-16 bg-slate-900 dark:bg-primary text-white rounded-2xl font-black text-lg shadow-xl shadow-slate-900/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
            >
              {isLoading ? (
                <span className="material-symbols-outlined animate-spin">progress_activity</span>
              ) : (
                <>
                  <span className="material-symbols-outlined">verified_user</span>
                  Autorizar Ingreso
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800 text-center">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed italic">
              Si no posee credenciales institucionales, <br />solicite acceso al administrador de la red.
            </p>

            <div className="flex flex-col items-center gap-2 mt-6">
              <button
                onClick={handleDevLogin}
                type="button"
                className="text-[10px] font-mono text-red-300 hover:text-red-500 hover:underline transition-colors uppercase tracking-widest"
              >
                [DEV] Ingresar como Admin
              </button>
              <button
                onClick={handleRepLogin}
                type="button"
                className="text-[10px] font-mono text-blue-300 hover:text-blue-500 hover:underline transition-colors uppercase tracking-widest"
              >
                [DEV] Ingresar como Referente
              </button>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-950 p-6 text-center border-t border-slate-100 dark:border-slate-800">
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em]">
            SENTINEL SECURITY PROTOCOL
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
