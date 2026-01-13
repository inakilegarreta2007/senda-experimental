
import React, { useState } from 'react';

interface FAQItemProps {
    question: string;
    answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-slate-100 dark:border-slate-800 last:border-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full py-6 flex items-center justify-between text-left group"
            >
                <span className={`text-lg font-bold transition-colors ${isOpen ? 'text-primary' : 'text-slate-700 dark:text-slate-200 group-hover:text-primary'}`}>
                    {question}
                </span>
                <span className={`material-symbols-outlined transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary' : 'text-slate-400'}`}>
                    expand_more
                </span>
            </button>
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 pb-6' : 'max-h-0'}`}>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                    {answer}
                </p>
            </div>
        </div>
    );
};

const FAQAccordion: React.FC = () => {
    const faqs = [
        {
            question: "¿Cómo puedo realizar una donación material?",
            answer: "Para donar alimentos, ropa o insumos, te recomendamos visitar nuestra sección de 'Colaborar', donde encontrarás los puntos de recepción oficiales de Cáritas, Arcores y Cruz Roja con sus respectivos horarios y contactos."
        },
        {
            question: "¿Cómo sé si mi donación llega a destino?",
            answer: "Senda es una plataforma de transparencia. Cada institución en la red reporta periódicamente su impacto y población alcanzada. Además, fomentamos las donaciones directas a entidades de trayectoria reconocida para garantizar la trazabilidad."
        },
        {
            question: "Quiero sumar mi institución a la red, ¿qué requisitos hay?",
            answer: "Cualquier organización social o eclesial con trabajo territorial comprobable en la provincia de Santa Fe puede solicitar su ingreso. Solo debes completar el formulario en la sección 'Sumar Institución' y un administrador validará los datos."
        },
        {
            question: "¿Senda maneja dinero de las donaciones?",
            answer: "No. Senda es un nexo tecnológico y de visibilidad. No procesamos pagos ni recibimos fondos. Nuestra misión es conectar la necesidad con el donante para que la colaboración sea directa y eficiente."
        },
        {
            question: "¿Puedo ser voluntario remoto?",
            answer: "¡Sí! Como 'Embajador de Conciencia' puedes ayudarnos difundiendo las necesidades urgentes y la misión de Senda en tus redes digitales. En la página de colaboración encontrarás kits listos para compartir."
        }
    ];

    return (
        <div className="space-y-2">
            {faqs.map((faq, idx) => (
                <FAQItem key={idx} question={faq.question} answer={faq.answer} />
            ))}
        </div>
    );
};

export default FAQAccordion;
