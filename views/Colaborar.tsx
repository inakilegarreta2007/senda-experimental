
import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '@/img/logo.png';
import Footer from '@/components/Footer';
import { toast } from 'react-hot-toast';

const Colaborar: React.FC = () => {
    const shareText = "¡Hola! Estoy apoyando a Senda, una red que conecta a quienes quieren ayudar con las necesidades reales de Santa Fe. Conocé más y sumate acá: https://senda-santafe.org";

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success('¡Texto copiado al portapapeles!');
    };

    const officialPoints = [
        {
            name: "Cáritas Argentina",
            description: "Organización oficial de la Iglesia Católica que trabaja para mitigar la pobreza y la exclusión.",
            icon: "volunteer_activism",
            color: "bg-red-500",
            link: "https://www.caritas.org.ar/"
        },
        {
            name: "Cruz Roja Argentina",
            description: "Asociación civil, humanitaria y de carácter voluntario con presencia en todo el territorio nacional.",
            icon: "emergency",
            color: "bg-red-600",
            link: "https://www.cruzroja.org.ar/"
        },
        {
            name: "Arcores",
            description: "Red Solidaria Internacional Agustino Recoleta que impulsa proyectos de desarrollo y justicia social.",
            icon: "public",
            color: "bg-blue-600",
            link: "https://www.arcores.org/"
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-display flex flex-col">
            {/* Navbar Simple */}
            <nav className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-700 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-3">
                        <img src={Logo} alt="Senda Logo" className="size-10" />
                        <span className="text-lg font-black tracking-tighter text-slate-900 dark:text-white uppercase font-display">SENDA</span>
                    </Link>
                    <Link to="/" className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px]">arrow_back</span> Volver al Inicio
                    </Link>
                </div>
            </nav>

            <main className="flex-1 max-w-6xl mx-auto px-6 py-16 md:py-24 space-y-20">
                {/* Header Inspiracional */}
                <section className="text-center space-y-6 max-w-3xl mx-auto">
                    <div className="inline-block px-4 py-1.5 bg-primary/10 rounded-full">
                        <span className="text-primary font-black uppercase tracking-[0.3em] text-[10px]">Centro de Colaboración</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white leading-tight tracking-tight">
                        Tu ayuda no conoce de distancias.
                    </h1>
                    <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                        Ya sea compartiendo un mensaje o coordinando una donación, cada acción en Senda suma para transformar la realidad de nuestra provincia.
                    </p>
                </section>

                {/* Sección: Embajadores de Conciencia */}
                <section className="bg-white dark:bg-slate-800 rounded-[3rem] p-8 md:p-16 border border-slate-200 dark:border-slate-700 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] rounded-full -mr-20 -mt-20"></div>

                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <h2 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                                    <span className="material-symbols-outlined text-primary text-4xl">campaign</span>
                                    Embajadores de Conciencia
                                </h2>
                                <p className="text-slate-500 dark:text-slate-400 font-medium">
                                    Convertite en un multiplicador del impacto. Compartí la misión de Senda en tus redes sociales y ayudanos a llegar a más corazones solidarios.
                                </p>
                            </div>

                            <div className="space-y-4 bg-slate-50 dark:bg-slate-900/50 p-6 rounded-3xl border border-dotted border-slate-300 dark:border-slate-600">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Kit de difusión (Copiá y compartí)</p>
                                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 italic leading-relaxed">
                                    "{shareText}"
                                </p>
                                <button
                                    onClick={() => handleCopy(shareText)}
                                    className="w-full py-3 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-primary/20"
                                >
                                    <span className="material-symbols-outlined text-[18px]">content_copy</span> Copiar Mensaje
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="aspect-square bg-slate-100 dark:bg-slate-900/80 rounded-[2rem] flex flex-col items-center justify-center p-6 text-center space-y-3 group hover:bg-primary transition-all cursor-default">
                                <span className="material-symbols-outlined text-4xl text-primary group-hover:text-white transition-colors">share</span>
                                <span className="text-[10px] font-black uppercase tracking-tighter group-hover:text-white/80">Compartir en Redes</span>
                            </div>
                            <div className="aspect-square bg-slate-100 dark:bg-slate-900/80 rounded-[2rem] flex flex-col items-center justify-center p-6 text-center space-y-3 group hover:bg-primary transition-all cursor-default">
                                <span className="material-symbols-outlined text-4xl text-primary group-hover:text-white transition-colors">chat_bubble</span>
                                <span className="text-[10px] font-black uppercase tracking-tighter group-hover:text-white/80">Enviar por WhatsApp</span>
                            </div>
                            <div className="aspect-square bg-slate-100 dark:bg-slate-900/80 rounded-[2rem] flex flex-col items-center justify-center p-6 text-center space-y-3 group hover:bg-primary transition-all cursor-default">
                                <span className="material-symbols-outlined text-4xl text-primary group-hover:text-white transition-colors">download</span>
                                <span className="text-[10px] font-black uppercase tracking-tighter group-hover:text-white/80">Bajar Gráficas</span>
                            </div>
                            <div className="aspect-square bg-slate-100 dark:bg-slate-900/80 rounded-[2rem] flex flex-col items-center justify-center p-6 text-center space-y-3 group hover:bg-primary transition-all cursor-default">
                                <span className="material-symbols-outlined text-4xl text-primary group-hover:text-white transition-colors">add_reaction</span>
                                <span className="text-[10px] font-black uppercase tracking-tighter group-hover:text-white/80">Sumar Seguidores</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Sección: Puntos de Donación Oficiales */}
                <section className="space-y-12">
                    <div className="text-center space-y-4">
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white">Puntos Oficiales de Recepción</h2>
                        <p className="text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto text-lg leading-relaxed">
                            Si deseás realizar donaciones de bienes, alimentos o recursos, te recomendamos acudir a estas asociaciones civiles y eclesiales de confianza.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {officialPoints.map((point, idx) => (
                            <div key={idx} className="bg-white dark:bg-slate-800 p-8 rounded-[3rem] border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col h-full hover:shadow-xl hover:-translate-y-2 transition-all">
                                <div className={`size-16 ${point.color} rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg`}>
                                    <span className="material-symbols-outlined text-3xl">{point.icon}</span>
                                </div>
                                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-3 uppercase tracking-tight">{point.name}</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed mb-8 flex-1">
                                    {point.description}
                                </p>
                                <a
                                    href={point.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full py-4 border-2 border-slate-100 dark:border-slate-700 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary hover:border-primary transition-all text-center flex items-center justify-center gap-2 group"
                                >
                                    Visitar Sitio Oficial <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">open_in_new</span>
                                </a>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Sección: Contacto Directo Administradores */}
                <section className="bg-slate-900 rounded-[3rem] p-12 md:p-20 text-white relative overflow-hidden text-center">
                    <div className="absolute inset-0 bg-primary/20 opacity-30"></div>
                    <div className="relative z-10 space-y-8 max-w-2xl mx-auto">
                        <h2 className="text-3xl md:text-5xl font-black leading-tight">¿Grandes donaciones o proyectos estratégicos?</h2>
                        <p className="text-lg text-white/60 font-medium">
                            Si representás a una empresa o deseás coordinar un aporte a gran escala, comunicate directamente con nuestro equipo de coordinación provincial.
                        </p>

                        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                            <a href="mailto:coordinacion@senda-sf.org" className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center gap-3 active:scale-95 shadow-xl">
                                <span className="material-symbols-outlined">mail</span> coordinacion@sendaSantaFe.org
                            </a>
                            <a href="tel:+543420000000" className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-white/20 transition-all flex items-center gap-3 active:scale-95 shadow-xl">
                                <span className="material-symbols-outlined">phone</span> central@senda-sf.org
                            </a>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default Colaborar;
