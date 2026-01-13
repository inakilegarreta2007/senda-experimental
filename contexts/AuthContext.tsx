import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { User, Session } from '@supabase/supabase-js';

// MOCK DEV USER
const DEV_USER: User = {
    id: 'dev-admin-id',
    app_metadata: { provider: 'email', providers: ['email'] },
    user_metadata: { role: 'ADMIN' },
    aud: 'authenticated',
    created_at: new Date().toISOString(),
    email: 'dev@sendasantafe.org',
    phone: '',
    role: 'authenticated',
    updated_at: new Date().toISOString()
};

const DEV_SESSION: Session = {
    access_token: 'mock-token',
    refresh_token: 'mock-refresh-token',
    expires_in: 3600,
    token_type: 'bearer',
    user: DEV_USER
};

interface AuthContextType {
    session: Session | null;
    user: User | null;
    loading: boolean;
    signOut: () => Promise<void>;
    signInDev: () => Promise<void>;
    signInRepresentativeDev: () => Promise<void>; // New Dev Method
}

const AuthContext = createContext<AuthContextType>({
    session: null,
    user: null,
    loading: true,
    signOut: async () => { },
    signInDev: async () => { },
    signInRepresentativeDev: async () => { },
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        // Check for Dev Bypass first
        const devMode = localStorage.getItem('senda_dev_auth');
        if (devMode) {
            console.log('🔓 Dev Auth Active:', devMode);
            // Support multiple dev roles
            const isRep = devMode === 'representative';
            const mockUser = isRep ? {
                ...DEV_USER,
                id: 'dev-rep-id',
                user_metadata: {
                    role: 'REPRESENTATIVE',
                    name: 'Juan Rep',
                    institution_id: '1' // LINKED NODE (Remove this line to test 'Porch/Waiting Room')
                },
                email: 'rep@nodo.org'
            } : DEV_USER;

            setSession({ ...DEV_SESSION, user: mockUser });
            setUser(mockUser);
            setLoading(false);
            return;
        }

        // Listen to auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
            if (!mounted) return;
            // If dev mode is active, ignore Supabase updates (or handle collision)
            // Ideally Supabase won't fire if we don't call it, but let's be safe
            if (localStorage.getItem('senda_dev_auth')) return;

            console.log('🔐 Auth event:', event);
            setSession(newSession);
            setUser(newSession?.user ?? null);
            setLoading(false);
        });

        // Check for existing Supabase session
        supabase.auth.getSession().then(({ data: { session: existingSession } }) => {
            if (!mounted) return;
            if (!existingSession && !devMode) {
                setLoading(false);
            }
        });

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, []);

    const signOut = async () => {
        // Clear Dev Auth
        localStorage.removeItem('senda_dev_auth');

        // Clear Supabase Auth
        await supabase.auth.signOut();

        setSession(null);
        setUser(null);
    };

    const signInDev = async () => {
        localStorage.setItem('senda_dev_auth', 'true'); // Default admin
        window.location.reload();
    };

    const signInRepresentativeDev = async () => {
        localStorage.setItem('senda_dev_auth', 'representative');
        window.location.reload();
    };

    return (
        <AuthContext.Provider value={{ session, user, loading, signOut, signInDev, signInRepresentativeDev }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
