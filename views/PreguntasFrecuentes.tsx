
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '@/img/logo.png';
import FAQAccordion from '../components/FAQAccordion';
import Footer from '@/components/Footer';

const PreguntasFrecuentes: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-display flex flex-col">
            <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 p-6 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <button onClick={() => navigate('/')} className="flex items-center gap-3 group">
                        <img src={Logo} alt="Senda Logo" className="size-10 group-hover:scale-110 transition-transform" />
                        <h1 className="text-xl font-black tracking-tighter uppercase">Senda <span className="text-primary">Ayuda</span></h1>
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        className="text-slate-400 hover:text-primary transition-colors flex items-center gap-1 font-black uppercase text-[10px] tracking-widest"
                    >
                        <span className="material-symbols-outlined">arrow_back</span>
                        Volver al inicio
                    </button>
                </div>
            </header>

            <main className="flex-1 max-w-4xl mx-auto w-full p-6 py-20 space-y-16">
                <div className="text-center space-y-4">
                    <div className="inline-block px-4 py-1 bg-primary/10 rounded-full">
                        <span className="text-primary font-black uppercase tracking-[0.3em] text-[10px]">Centro de Información</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight">
                        Preguntas Frecuentes
                    </h2>
                    <p className="text-lg text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto">
                        Todo lo que necesitás saber sobre cómo funciona la red Senda y cómo podés participar de forma segura.
                    </p>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 md:p-12 border border-slate-100 dark:border-slate-800 shadow-sm">
                    <FAQAccordion />
                </div>

                <div className="bg-slate-900 rounded-[3rem] p-10 md:p-16 text-white relative overflow-hidden text-center space-y-8">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[60px] rounded-full"></div>
                    <h3 className="text-2xl md:text-3xl font-black">¿Aún tenés dudas?</h3>
                    <p className="text-white/60 font-medium">Nuestro equipo de administración está listo para guiarte en lo que necesites.</p>
                    <div className="flex justify-center">
                        <a
                            href="mailto:info@sendasantafe.org"
                            className="px-10 py-5 bg-white text-slate-900 rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl flex items-center gap-3"
                        >
                            <span className="material-symbols-outlined">mail</span> Contactar Soporte
                        </a>
                    </div>
                </div>
            </main>

            <Footer variant="simple" />
        </div>
    );
};

export default PreguntasFrecuentes;
