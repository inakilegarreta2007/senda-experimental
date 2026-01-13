
import React, { useState, useEffect } from 'react';

const stories = [
    {
        quote: "Gracias a Senda pudimos coordinar la entrega de 500 viandas en tiempo récord para familias aisladas por la inundación.",
        author: "Marta R.",
        role: "Coordinadora de Comedor",
        location: "Santa Fe Capital"
    },
    {
        quote: "La transparencia de la plataforma nos dio la confianza para empezar a donar mensualmente desde nuestra empresa.",
        author: "Juan Pablo P.",
        role: "Donante Corporativo",
        location: "Rosario"
    },
    {
        quote: "Encontré un centro de salud cerca de mi casa que no sabía que existía. La geolocalización es fundamental.",
        author: "Elena G.",
        role: "Vecina Beneficiaria",
        location: "Reconquista"
    }
];

const ImpactCarousel: React.FC = () => {
    const [active, setActive] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setActive(prev => (prev + 1) % stories.length);
        }, 8000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative overflow-hidden bg-slate-100 dark:bg-slate-900/50 rounded-[4rem] p-12 md:p-20 border border-slate-200 dark:border-slate-800">
            <div className="absolute top-10 left-10 opacity-5">
                <span className="material-symbols-outlined text-[160px]">format_quote</span>
            </div>

            <div className="relative z-10 max-w-4xl mx-auto text-center space-y-10">
                <p className="text-2xl md:text-4xl font-black text-slate-800 dark:text-white leading-tight italic tracking-tight transition-all duration-700">
                    "{stories[active].quote}"
                </p>

                <div className="flex flex-col items-center space-y-2">
                    <p className="font-black text-primary uppercase tracking-[0.2em] text-xs">{stories[active].author}</p>
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{stories[active].role} • {stories[active].location}</p>
                </div>

                <div className="flex justify-center gap-3">
                    {stories.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setActive(idx)}
                            className={`h-1.5 rounded-full transition-all duration-500 ${idx === active ? 'w-10 bg-primary' : 'w-3 bg-slate-300 dark:bg-slate-700'}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ImpactCarousel;
