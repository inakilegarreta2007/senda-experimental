
import React, { useState, useEffect, Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { UserRole, Institution } from './types';
import { splitAddress } from './utils/geo';
import AdminLayout from './components/AdminLayout';

import { mockInstitutions } from '@/utils/mockData';
import { supabase } from '@/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import { useConfig } from '@/contexts/ConfigContext';
import MaintenanceMode from '@/components/MaintenanceMode';

// Lazy load components & views
const ProtectedRoute = lazy(() => import('./components/ProtectedRoute'));
const Panel = lazy(() => import('./views/Panel'));
const Validar = lazy(() => import('./views/Validar'));
const Red = lazy(() => import('./views/Red'));
const Datos = lazy(() => import('./views/Datos'));
const Mapa = lazy(() => import('./views/Mapa'));
const Info = lazy(() => import('./views/Info'));
const Inicio = lazy(() => import('./views/Inicio'));
const Login = lazy(() => import('./views/Login'));
// const AdminLayout removed to avoid conflict if already imported at top, or keep if that was the intention.
// Looking at previous context, AdminLayout is a component used in Routes. 
// If it was already imported, I should check. 
// Assuming the error says "Import declaration conflicts with local declaration", suggests duplicate.
// I will just keep the NEW modules.
const Vinculos = lazy(() => import('./views/Vinculos')); // Admin Config
const AdminUsers = lazy(() => import('./views/AdminUsers')); // Admin Users Management
const Registro = lazy(() => import('./views/Registro'));
const PreRegistro = lazy(() => import('./views/PreRegistro'));
const Observatorio = lazy(() => import('./views/Observatorio'));
const ImpactoPublico = lazy(() => import('./views/ImpactoPublico'));
const Legal = lazy(() => import('./views/Legal'));
const Colaborar = lazy(() => import('./views/Colaborar'));
const PreguntasFrecuentes = lazy(() => import('./views/PreguntasFrecuentes'));
const Notificaciones = lazy(() => import('./views/Notificaciones'));
const PortalDashboard = lazy(() => import('./views/PortalDashboard')); // New View
const PortalIdentity = lazy(() => import('./views/PortalIdentity')); // New View
const PortalNodeView = lazy(() => import('./views/PortalNodeView')); // New View (Contextual Edit)
const RepresentativeLayout = lazy(() => import('./components/RepresentativeLayout')); // New Layout

// Loading component
const Loading = () => (
  <div className="flex items-center justify-center min-h-screen bg-background-light dark:bg-background-dark">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

const App: React.FC = () => {
  const { config, loading: configLoading } = useConfig();
  const { user, loading: authLoading } = useAuth();
  const isAuthenticated = !!user;
  const userRole = (user?.user_metadata?.role as UserRole) || UserRole.VISITOR;

  const [institutions, setInstitutions] = useState<Institution[]>([]);


  const [stats, setStats] = useState({
    totalInstitutions: 0,
    activeRequests: 0,
    totalBeneficiaries: 0,
    pendingValidations: 0,
    totalVolunteers: 0
  });

  // Fetch Institutions from Supabase
  useEffect(() => {
    const fetchInstitutions = async () => {
      try {
        const { data, error } = await supabase
          .from('institutions')
          .select('*');

        if (error) {
          console.error('Error fetching institutions:', error);
          setInstitutions(mockInstitutions); // Fallback
        } else if (data) {
          const mappedData: Institution[] = data.map((item: any) => {
            const { street, number } = splitAddress(item.address);
            return {
              id: item.id,
              name: item.name,
              type: item.type || 'Comedor',
              parish: item.parish || '',
              province: item.province || 'Santa Fe',
              city: item.city || '',
              address: street,
              addressNumber: number,
              zipCode: item.zip_code || '',
              phone: item.phone || '',
              email: item.email || '',
              responsible: item.responsible || '',
              cuit: item.cuit || '',
              description: item.description || '',
              whatsapp: item.whatsapp || item.phone || '',
              lat: item.lat || -31.6333,
              lng: item.lng || -60.7000,
              status: (['Activo', 'Pendiente', 'Inactivo', 'En Revisión', 'Ayuda Req.'].includes(item.status) ? item.status : 'Pendiente') as Institution['status'],
              needs: [],
              lastUpdate: item.created_at || new Date().toISOString(),
              coveragePopulation: item.coverage_population || 0,
              categories: [],
              staffCount: 0,
              volunteersCount: item.volunteers_count || 0,
              interventionHistory: [],
              isHighImpact: false,
              image: item.image_url,
              // Extended fields
              otherLink: item.other_link,
              website: item.website,
              instagram: item.instagram,
              facebook: item.facebook,
              twitter: item.twitter,
              maxAuthorityName: item.max_authority_name,
              maxAuthorityRole: item.max_authority_role,
              parentEntityName: item.parent_entity_name,
              contactEmailName: item.contact_email_name,
              contactPhoneName: item.contact_phone_name
            };
          });
          setInstitutions(mappedData);
        }
      } catch (err) {
        console.error(err);
        setInstitutions(mockInstitutions);
      } finally {
        // Reduced global loading dependency
      }
    };

    fetchInstitutions();
  }, []);

  useEffect(() => {
    const activeAndUrgent = institutions.filter(i => i.status === 'Activo' || i.status === 'Ayuda Req.');
    const urgent = institutions.filter(i => i.status === 'Ayuda Req.');
    const pendingNotifications = institutions.filter(i => i.status === 'Pendiente');
    const pendingValidations = institutions.filter(i => i.status === 'En Revisión');
    const beneficiaries = activeAndUrgent.reduce((acc, curr) => acc + curr.coveragePopulation, 0);
    const volunteers = activeAndUrgent.reduce((acc, curr) => acc + (curr.volunteersCount || 0), 0);

    setStats({
      totalInstitutions: activeAndUrgent.length,
      activeRequests: urgent.length,
      totalBeneficiaries: beneficiaries,
      pendingValidations: pendingValidations.length,
      pendingNotifications: pendingNotifications.length,
      totalVolunteers: volunteers
    });
  }, [institutions]);

  const updateInstitution = async (updated: Institution) => {
    // Optimistic update
    setInstitutions(prev => prev.map(inst => inst.id === updated.id ? updated : inst));

    try {
      const { error } = await supabase
        .from('institutions')
        .update({
          name: updated.name,
          description: updated.description,
          address: `${updated.address} ${updated.addressNumber}`, // Concatenate address and addressNumber for the DB 'address' column
          zip_code: updated.zipCode,
          parish: updated.parish,
          city: updated.city,
          province: updated.province,
          lat: updated.lat,
          lng: updated.lng,
          phone: updated.phone,
          email: updated.email,
          type: updated.type,
          status: updated.status,
          coverage_population: updated.coveragePopulation,
          volunteers_count: updated.volunteersCount,
          image_url: updated.image,
          cuit: updated.cuit,
          responsible: updated.responsible,
          whatsapp: updated.whatsapp,
        })
        .eq('id', updated.id);

      if (error) {
        console.error('Error updating institution:', error);
        // Revert on error? For now just log
      }
    } catch (err) {
      console.error(err);
    }
  };

  const addInstitution = (newInst: Institution) => {
    setInstitutions(prev => [...prev, newInst]);
  };

  const removeInstitution = async (id: string) => {
    setInstitutions(prev => prev.filter(i => i.id !== id));
    try {
      const { error } = await supabase.from('institutions').delete().eq('id', id);
      if (error) throw error;
    } catch (err) {
      console.error('Error deleting institution:', err);
      // Opcional: Revertir si falla
      // toast.error('Error al eliminar');
    }
  };

  const isGlobalLoading = authLoading || configLoading;

  // Fallback timer
  useEffect(() => {
    // console.log('[DEBUG] App Loading State:', { authLoading, configLoading, isGlobalLoading });
  }, [authLoading, configLoading, isGlobalLoading]);

  // Helper to determine redirect path logic based on role
  const getLoginRedirect = () => {
    if (userRole === UserRole.ADMIN) return "/admin";
    if (userRole === UserRole.REPRESENTATIVE) return "/portal";
    return "/"; // Default fallback
  };

  return (
    <HashRouter>
      <div className="min-h-screen relative overflow-x-hidden flex flex-col bg-background-light dark:bg-background-dark">
        <Toaster position="top-right" reverseOrder={false} />
        {/* Show Lock button if not logged in OR if logged in as Visitor (to allow upgrading session) */}
        {(!isAuthenticated || userRole === UserRole.VISITOR) && (
          <a href="#/login" className="fixed bottom-4 right-4 z-50 p-3 bg-white/10 backdrop-blur-md rounded-full text-slate-400 hover:text-primary hover:bg-white shadow-lg transition-all border border-slate-200/20" title="Acceso Administrativo">
            <span className="material-symbols-outlined text-xl">lock</span>
          </a>
        )}

        {/* Maintenance Indicator for Admins/Users with access */}
        {config.general?.maintenanceMode && isAuthenticated && (
          <div className="bg-amber-400 text-amber-950 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-center sticky top-0 z-[100] shadow-sm flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-sm">construction</span>
            Sitio en Mantenimiento (Tienes acceso VIP)
          </div>
        )}
        <Suspense fallback={<Loading />}>
          <Routes>
            {/* PUBLIC ROUTES (Respect Maintenance Mode) */}
            <Route path="/" element={
              config.general.maintenanceMode && !isAuthenticated
                ? <MaintenanceMode />
                : <Inicio institutions={institutions} stats={stats} />
            } />
            {/* ... other public routes ... */}
            <Route path="/explorar" element={
              config.general.maintenanceMode && !isAuthenticated
                ? <MaintenanceMode />
                : <Mapa institutions={institutions} loading={isGlobalLoading} />
            } />
            <Route path="/impacto" element={
              config.general.maintenanceMode && !isAuthenticated
                ? <MaintenanceMode />
                : <ImpactoPublico institutions={institutions} stats={stats} />
            } />
            <Route path="/registro" element={
              config.general.maintenanceMode && !isAuthenticated
                ? <MaintenanceMode />
                : <PreRegistro />
            } />
            <Route path="/registro-completo" element={
              config.general.maintenanceMode && !isAuthenticated
                ? <MaintenanceMode />
                : <Registro onAdd={addInstitution} />
            } />
            <Route path="/details/:id" element={
              config.general.maintenanceMode && !isAuthenticated
                ? <MaintenanceMode />
                : <Info institutions={institutions} />
            } />
            <Route path="/legal/:section" element={<Legal />} />
            <Route path="/colaborar" element={
              config.general.maintenanceMode && !isAuthenticated
                ? <MaintenanceMode />
                : <Colaborar />
            } />
            <Route path="/faq" element={
              config.general.maintenanceMode && !isAuthenticated
                ? <MaintenanceMode />
                : <PreguntasFrecuentes />
            } />

            {/* Login Route: Allow access even if authenticated so users can switch accounts */}
            <Route path="/login" element={<Login />} />

            {/* PROTECTED ADMIN ROUTES */}
            <Route element={<ProtectedRoute allowedRoles={[UserRole.ADMIN]} />}>
              <Route path="/admin" element={<AdminLayout stats={stats} />}>
                <Route index element={<Panel stats={stats} institutions={institutions} onUpdate={updateInstitution} onDelete={removeInstitution} loading={isGlobalLoading} />} />
                <Route path="observatorio" element={<Observatorio institutions={institutions} />} />
                <Route path="notifications" element={<Notificaciones institutions={institutions} onUpdate={updateInstitution} />} />
                <Route path="validations" element={<Validar institutions={institutions} onUpdate={updateInstitution} />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="institutions" element={<Red institutions={institutions} onAdd={addInstitution} onUpdate={updateInstitution} loading={isGlobalLoading} />} />
                <Route path="reports" element={<Datos stats={stats} institutions={institutions} />} />
                <Route path="links" element={<Vinculos />} />
                <Route path="details/:id" element={<Info isAdmin institutions={institutions} />} />
              </Route>
            </Route>

            {/* PROTECTED REPRESENTATIVE PORTAL ROUTES */}
            <Route element={<ProtectedRoute allowedRoles={[UserRole.REPRESENTATIVE]} />}>
              <Route path="/portal" element={<RepresentativeLayout />}>
                <Route index element={<PortalDashboard />} />
                <Route path="profile" element={<PortalIdentity />} />
                <Route path="view" element={<PortalNodeView />} />
                {/* Add more portal sub-routes here later */}
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Suspense>

        {/* AICoach component removed */}
      </div>
    </HashRouter>
  );
};

export default App;
