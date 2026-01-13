import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';

interface ProtectedRouteProps {
    redirectTo?: string;
    allowedRoles?: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    redirectTo = '/login',
    allowedRoles
}) => {
    const { user, loading } = useAuth();

    // Still loading auth state
    if (loading) {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 gap-6">
                <div className="size-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 animate-pulse">
                    Validando Credenciales...
                </p>
            </div>
        );
    }

    // Not authenticated - redirect to login
    if (!user) {
        console.log('🚫 No user - redirecting to login');
        return <Navigate to={redirectTo} replace />;
    }

    // Role check
    const userRole = (user.user_metadata?.role as UserRole) || UserRole.VISITOR;

    if (allowedRoles && !allowedRoles.includes(userRole)) {
        console.log(`🚫 Role mismatch. Required: ${allowedRoles}, Found: ${userRole}`);
        // Redirect to appropriate dashboard based on their actual role
        if (userRole === UserRole.ADMIN) return <Navigate to="/admin" replace />;
        if (userRole === UserRole.REPRESENTATIVE) return <Navigate to="/portal" replace />;
        return <Navigate to="/" replace />;
    }

    // All checks passed
    // console.log('✅ Access granted');
    return <Outlet />;
};

export default ProtectedRoute;
