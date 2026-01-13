import React from 'react';

const steps = [
    {
        icon: 'location_searching',
        title: 'Sistematizamos',
        description: 'Documentamos la capilaridad territorial y las brechas críticas donde el Estado está ausente.'
    },
    {
        icon: 'hub',
        title: 'Auditamos',
        description: 'Generamos datos duros, trazables y verídicos sobre la intervención eclesial autónoma.'
    },
    {
        icon: 'auto_awesome',
        title: 'Evidenciamos',
        description: 'Posicionamos la labor social ante autoridades civiles con valor de incidencia pública.'
    }
];

const StepGuide: React.FC = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connector Line (Desktop) */}
            <div className="hidden md:block absolute top-1/4 left-0 w-full h-px bg-slate-200 dark:bg-slate-700 -z-10"></div>

            {steps.map((step, idx) => (
                <div key={idx} className="flex flex-col items-center text-center space-y-6 group">
                    <div className="size-20 bg-white dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:border-primary transition-all duration-500 relative z-10">
                        <span className="material-symbols-outlined text-4xl text-primary">{step.icon}</span>
                        <div className="absolute -top-2 -right-2 size-8 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full flex items-center justify-center text-[10px] font-black italic shadow-md border-4 border-slate-50 dark:border-slate-950">
                            0{idx + 1}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">{step.title}</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-[240px]">
                            {step.description}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default StepGuide;
