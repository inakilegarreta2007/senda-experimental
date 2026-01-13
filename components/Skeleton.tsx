
import React from 'react';

export const Skeleton: React.FC<{ className?: string }> = ({ className }) => (
    <div className={`animate-pulse bg-slate-200 dark:bg-slate-700 rounded-xl ${className}`}></div>
);

export const SkeletonList: React.FC = () => (
    <div className="space-y-4 w-full">
        {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700">
                <Skeleton className="size-12 rounded-2xl" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-3 w-1/4" />
                </div>
                <Skeleton className="h-8 w-20 rounded-full" />
            </div>
        ))}
    </div>
);

export const SkeletonMap: React.FC = () => (
    <div className="w-full h-full relative overflow-hidden bg-slate-50 dark:bg-slate-900 rounded-[2.5rem]">
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="size-12 border-4 border-slate-200 border-t-primary rounded-full animate-spin"></div>
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Cargando Mapa Territorial...</p>
            </div>
        </div>
        <div className="absolute inset-0 pointer-events-none opacity-20">
            <div className="grid grid-cols-12 grid-rows-12 h-full gap-4 p-8">
                {[...Array(24)].map((_, i) => (
                    <Skeleton key={i} className="size-4 rounded-full" />
                ))}
            </div>
        </div>
    </div>
);
