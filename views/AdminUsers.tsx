
import React, { useState, useEffect } from 'react';
import { supabase } from '@/supabaseClient';
import { Institution, UserRole } from '../types';
import { toast } from 'react-hot-toast';

// Extended User Type for the UI
interface AppUser {
    id: string;
    email: string;
    role: string; // 'ADMIN' | 'REPRESENTATIVE' | 'VISITOR'
    institution_id?: string;
    created_at: string;
    last_sign_in_at?: string; // New field for status
    is_online?: boolean; // Mock status
}

const AdminUsers: React.FC = () => {
    const [users, setUsers] = useState<AppUser[]>([]);
    const [institutions, setInstitutions] = useState<Institution[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterRole, setFilterRole] = useState<'ALL' | 'ADMIN' | 'REPRESENTATIVE' | 'VISITOR'>('ALL');

    // Modal / Action States
    const [selectedUser, setSelectedUser] = useState<AppUser | null>(null);
    const [actionType, setActionType] = useState<'LINK' | 'UNLINK' | 'DELETE' | null>(null);
    const [selectedInstId, setSelectedInstId] = useState<string>('');
    const [confirmText, setConfirmText] = useState(''); // Anti-missclick
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        // Mock Data Upgrade: Added last_sign_in and more varied users
        const mockUsers: AppUser[] = [
            { id: 'admin-1', email: 'admin@senda.org', role: 'ADMIN', created_at: '2023-01-01T10:00:00Z', last_sign_in_at: new Date().toISOString(), is_online: true },
            { id: 'dev-rep-id-1', email: 'comedor.santafe@gmail.com', role: 'REPRESENTATIVE', institution_id: '1', created_at: '2023-05-15T14:30:00Z', last_sign_in_at: '2023-10-20T09:00:00Z', is_online: false },
            { id: 'user-visitor-1', email: 'voluntario.nuevo@gmail.com', role: 'VISITOR', created_at: '2023-11-01T18:20:00Z', last_sign_in_at: '2023-11-02T10:00:00Z', is_online: false },
            { id: 'dev-rep-id-2', email: 'caritas.centro@iglesia.org', role: 'REPRESENTATIVE', institution_id: '2', created_at: '2023-06-10T11:00:00Z', last_sign_in_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(), is_online: true }, // Online 5 mins ago
        ];

        const { data: instData } = await supabase.from('institutions').select('id, name, city');

        setUsers(mockUsers);
        if (instData) setInstitutions(instData as any);
        setLoading(false);
    };

    // Filter Logic
    const filteredUsers = users.filter(u => {
        const matchesSearch = u.email.toLowerCase().includes(search.toLowerCase()) || u.role.toLowerCase().includes(search.toLowerCase());
        const matchesRole = filterRole === 'ALL' || u.role === filterRole;
        return matchesSearch && matchesRole;
    });

    // Action Handlers
    const openActionModal = (user: AppUser, type: 'LINK' | 'UNLINK' | 'DELETE') => {
        setSelectedUser(user);
        setActionType(type);
        setConfirmText('');
        // Pre-fill if linking
        if (type === 'LINK') setSelectedInstId(user.institution_id || '');
    };

    const handleExecuteAction = async () => {
        if (!selectedUser || !actionType) return;
        setIsProcessing(true);

        // Simulation of API calls
        await new Promise(r => setTimeout(r, 800));

        if (actionType === 'LINK') {
            setUsers(prev => prev.map(u => u.id === selectedUser.id ? { ...u, role: 'REPRESENTATIVE', institution_id: selectedInstId } : u));
            toast.success("Usuario vinculado correctamente.");
        } else if (actionType === 'UNLINK') {
            setUsers(prev => prev.map(u => u.id === selectedUser.id ? { ...u, role: 'VISITOR', institution_id: undefined } : u));
            toast.success("Vinculación eliminada. Usuario ahora es VISITANTE.");
        } else if (actionType === 'DELETE') {
            setUsers(prev => prev.filter(u => u.id !== selectedUser.id));
            toast.success("Usuario eliminado del sistema.");
        }

        closeModal();
    };

    const closeModal = () => {
        setSelectedUser(null);
        setActionType(null);
        setIsProcessing(false);
        setConfirmText('');
        setSelectedInstId('');
    };

    // Helper: Anti-missclick validation
    const getVerificationWord = () => {
        if (actionType === 'DELETE') return 'ELIMINAR';
        if (actionType === 'UNLINK') return 'DESVINCULAR';
        return null; // Link doesn't need text confirm, just selection
    };

    const isActionValid = () => {
        const word = getVerificationWord();
        if (word && confirmText !== word) return false;
        if (actionType === 'LINK' && !selectedInstId) return false;
        return true;
    };

    return (
        <div className="flex flex-col flex-1 h-full overflow-hidden bg-slate-50/50 dark:bg-slate-950/50">
            <header className="bg-white/50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 px-8 py-6 flex flex-col gap-4 sticky top-0 z-50 backdrop-blur-md">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Gestión de Usuarios</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 font-medium italic">Administración centralizada de cuentas y permisos.</p>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="flex flex-col md:flex-row gap-4 justify-between items-end md:items-center">
                    {/* Tabs */}
                    <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                        {['ALL', 'ADMIN', 'REPRESENTATIVE', 'VISITOR'].map((role) => (
                            <button
                                key={role}
                                onClick={() => setFilterRole(role as any)}
                                className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${filterRole === role
                                        ? 'bg-white dark:bg-slate-700 text-primary shadow-sm'
                                        : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                                    }`}
                            >
                                {role === 'ALL' ? 'Todos' : role}
                            </button>
                        ))}
                    </div>

                    {/* Search */}
                    <div className="relative w-full md:w-auto">
                        <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400">search</span>
                        <input
                            type="text"
                            placeholder="Buscar usuario..."
                            className="pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-slate-800 border-none shadow-sm focus:ring-2 ring-primary/50 w-full md:w-64"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto p-4 md:p-8">
                <div className="grid grid-cols-1 gap-4">
                    {filteredUsers.map(user => {
                        const linkedInst = institutions.find(i => i.id === user.institution_id);
                        return (
                            <div key={user.id} className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:border-primary/30 transition-all">

                                {/* User Info */}
                                <div className="flex items-start gap-4">
                                    <div className="relative">
                                        <div className={`size-12 rounded-2xl flex items-center justify-center font-black text-lg ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-600' :
                                                user.role === 'REPRESENTATIVE' ? 'bg-blue-100 text-blue-600' :
                                                    'bg-slate-100 text-slate-500'
                                            }`}>
                                            {user.email[0].toUpperCase()}
                                        </div>
                                        {/* Status Dot */}
                                        <div className={`absolute -bottom-1 -right-1 size-3.5 rounded-full border-2 border-white dark:border-slate-900 ${user.is_online ? 'bg-green-500' : 'bg-slate-300'}`} title={user.is_online ? "En Línea" : "Offline"}></div>
                                    </div>

                                    <div>
                                        <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                            {user.email}
                                            <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider border ${user.role === 'ADMIN' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                                                    user.role === 'REPRESENTATIVE' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                                        'bg-slate-50 text-slate-500 border-slate-100'
                                                }`}>
                                                {user.role}
                                            </span>
                                        </h3>
                                        <p className="text-xs text-slate-400 font-mono mt-0.5 flex gap-3">
                                            <span>ID: {user.id.substring(0, 8)}...</span>
                                            <span className="hidden sm:inline">•</span>
                                            <span className="hidden sm:inline">Último acceso: {new Date(user.last_sign_in_at || user.created_at).toLocaleDateString()}</span>
                                        </p>
                                    </div>
                                </div>

                                {/* Linked Node (Center) */}
                                <div className="flex-1 md:px-8">
                                    {/* Special Display for ADMIN */}
                                    {user.role === 'ADMIN' && (
                                        <div className="p-3 rounded-xl border border-purple-100 bg-purple-50 flex items-center gap-3 w-fit">
                                            <span className="material-symbols-outlined text-purple-500">shield</span>
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-wider text-purple-700">Acceso Total</p>
                                                <p className="text-sm font-bold text-purple-900">Administrador</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Display for REPRESENTATIVE */}
                                    {user.role !== 'ADMIN' && (
                                        <div className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${linkedInst ? 'bg-emerald-50 border-emerald-100' : 'bg-amber-50 border-amber-100'}`}>
                                            <div className="flex items-center gap-2">
                                                <span className={`material-symbols-outlined ${linkedInst ? 'text-emerald-500' : 'text-amber-500'}`}>
                                                    {linkedInst ? 'link' : 'link_off'}
                                                </span>
                                                <div>
                                                    <p className={`text-[10px] font-black uppercase tracking-wider ${linkedInst ? 'text-emerald-700' : 'text-amber-700'}`}>
                                                        {linkedInst ? 'Nodo Vinculado' : 'Pendiente de Vínculo'}
                                                    </p>
                                                    <p className={`text-sm font-bold ${linkedInst ? 'text-emerald-900' : 'text-amber-900'} truncate max-w-[200px]`}>
                                                        {linkedInst ? linkedInst.name : 'Sin Asignar'}
                                                    </p>
                                                </div>
                                            </div>
                                            {linkedInst && (
                                                <button
                                                    onClick={() => openActionModal(user, 'UNLINK')}
                                                    className="p-1.5 rounded-lg bg-white/50 text-emerald-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                                                    title="Desvincular Nodo"
                                                >
                                                    <span className="material-symbols-outlined text-lg">link_off</span>
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Actions (Right) */}
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => openActionModal(user, 'LINK')}
                                        className="group flex flex-col items-center justify-center size-10 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-all border border-transparent hover:border-blue-100"
                                        title="Gestionar Vínculo"
                                    >
                                        <span className="material-symbols-outlined text-xl mb-[-2px]">edit_square</span>
                                    </button>
                                    {user.role !== 'ADMIN' && (
                                        <button
                                            onClick={() => openActionModal(user, 'DELETE')}
                                            className="group flex flex-col items-center justify-center size-10 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-all border border-transparent hover:border-red-100"
                                            title="Eliminar Usuario"
                                        >
                                            <span className="material-symbols-outlined text-xl mb-[-2px]">delete</span>
                                        </button>
                                    )}
                                </div>

                            </div>
                        );
                    })}
                </div>
            </main>

            {/* ACTION MODAL (ANTIMISSCLICK) */}
            {selectedUser && actionType && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-8 max-w-lg w-full space-y-6 relative border border-slate-200 dark:border-slate-800">

                        <div className="flex items-center gap-4">
                            <div className={`size-14 rounded-2xl flex items-center justify-center ${actionType === 'DELETE' ? 'bg-red-50 text-red-600' :
                                    actionType === 'UNLINK' ? 'bg-amber-50 text-amber-600' :
                                        'bg-blue-50 text-blue-600'
                                }`}>
                                <span className="material-symbols-outlined text-3xl">
                                    {actionType === 'DELETE' ? 'warning' : actionType === 'UNLINK' ? 'link_off' : 'admin_panel_settings'}
                                </span>
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                                    {actionType === 'DELETE' ? 'Eliminar Usuario' :
                                        actionType === 'UNLINK' ? 'Desvincular Nodo' :
                                            'Asignar Nodo'}
                                </h3>
                                <p className="text-slate-500 text-sm">Usuario: <strong>{selectedUser.email}</strong></p>
                            </div>
                        </div>

                        {/* CONTENT BASED ON ACTION */}
                        <div className="space-y-4 pt-2">

                            {/* LINK MODE */}
                            {actionType === 'LINK' && (
                                <div>
                                    <label className="block text-xs font-black uppercase text-slate-400 tracking-widest mb-2">Seleccionar Nodo a Vincular</label>
                                    <select
                                        className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border-none font-bold text-slate-700 dark:text-white focus:ring-2 ring-primary/20 appearance-none"
                                        value={selectedInstId}
                                        onChange={e => setSelectedInstId(e.target.value)}
                                    >
                                        <option value="">-- Seleccionar Institución --</option>
                                        {institutions.map(i => (
                                            <option key={i.id} value={i.id}>{i.name} ({i.city})</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* DESTRUCTIVE ACTION VERIFICATION */}
                            {(actionType === 'DELETE' || actionType === 'UNLINK') && (
                                <div className="p-4 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/30">
                                    <p className="text-sm text-red-800 dark:text-red-200 mb-3 font-medium">
                                        Esta acción puede afectar el acceso del usuario. Para confirmar, escribe
                                        <strong className="mx-1 select-all">{getVerificationWord()}</strong> abajo:
                                    </p>
                                    <input
                                        type="text"
                                        placeholder={`Escribe ${getVerificationWord()}...`}
                                        className="w-full p-2 rounded-lg border border-red-200 dark:border-red-800/50 text-sm focus:border-red-500 focus:ring-red-500 uppercase"
                                        value={confirmText}
                                        onChange={e => setConfirmText(e.target.value.toUpperCase())}
                                        autoFocus
                                    />
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                            <button
                                onClick={closeModal}
                                className="px-5 py-2.5 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleExecuteAction}
                                disabled={!isActionValid() || isProcessing}
                                className={`px-6 py-2.5 rounded-xl text-white font-black shadow-lg transition-all disabled:opacity-50 disabled:scale-100 flex items-center gap-2 ${actionType === 'DELETE' ? 'bg-red-500 shadow-red-500/30 hover:bg-red-600' :
                                        actionType === 'UNLINK' ? 'bg-amber-500 shadow-amber-500/30 hover:bg-amber-600' :
                                            'bg-primary shadow-primary/30 hover:bg-blue-600'
                                    }`}
                            >
                                {isProcessing ? 'Procesando...' : (
                                    <>
                                        <span className="material-symbols-outlined text-lg">
                                            {actionType === 'DELETE' ? 'delete' : actionType === 'UNLINK' ? 'link_off' : 'save'}
                                        </span>
                                        Confirmar
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUsers;
