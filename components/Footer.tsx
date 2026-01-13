
import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '@/img/logo.png';
import { useConfig } from '@/contexts/ConfigContext';

interface FooterProps {
    variant?: 'full' | 'simple';
}

const Footer: React.FC<FooterProps> = ({ variant = 'full' }) => {
    const { config } = useConfig();

    if (variant === 'simple') {
        return (
            <footer className="p-12 text-center border-t border-slate-100 dark:border-slate-800">
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">
                    {config.footer.copyright} • {config.footer.developerText}
                </p>
            </footer>
        );
    }

    return (
        <footer className="bg-slate-950 text-slate-400 py-20 border-t border-white/5">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">

                {/* Branding */}
                <div className="space-y-6 md:col-span-2">
                    <div className="flex items-center gap-3">
                        <img src={Logo} alt="Senda Logo" className="size-8 opacity-80" />
                        <span className="text-white font-black tracking-tighter uppercase">SENDA</span>
                    </div>
                    <p className="text-sm leading-relaxed max-w-sm">
                        {config.footer.text}
                    </p>
                    <div className="flex gap-4 relative z-10 pointer-events-auto">
                        {config.contact.instagram && (
                            <a href={config.contact.instagram} target="_blank" rel="noopener noreferrer" className="size-10 rounded-full bg-white/5 hover:bg-white/20 flex items-center justify-center transition-all text-white group" title="Instagram">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="opacity-80 group-hover:opacity-100"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                            </a>
                        )}
                        {config.contact.facebook && (
                            <a href={config.contact.facebook} target="_blank" rel="noopener noreferrer" className="size-10 rounded-full bg-white/5 hover:bg-white/20 flex items-center justify-center transition-all text-white group" title="Facebook">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="opacity-80 group-hover:opacity-100"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                            </a>
                        )}
                    </div>
                </div>

                {/* Legal */}
                <div>
                    <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-6">Legal</h4>
                    <ul className="space-y-4 text-sm">
                        <li><Link to="/legal/terminos" className="hover:text-primary transition-colors">Términos y Condiciones</Link></li>
                        <li><Link to="/legal/privacidad" className="hover:text-primary transition-colors">Política de Privacidad</Link></li>
                    </ul>
                </div>

                {/* Contacto */}
                <div>
                    <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-6">Contacto</h4>
                    <ul className="space-y-4 text-sm">
                        <li className="flex items-start gap-4">
                            <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                            </div>
                            <div className="pt-1">
                                <p className="text-[10px] uppercase font-black tracking-widest text-slate-500 mb-0.5">Email</p>
                                <span className="font-bold text-slate-300">{config.contact.email}</span>
                            </div>
                        </li>
                        <li className="flex items-start gap-4">
                            <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                            </div>
                            <div className="pt-1">
                                <p className="text-[10px] uppercase font-black tracking-widest text-slate-500 mb-0.5">Ubicación</p>
                                <span className="font-bold text-slate-300">{config.contact.address}</span>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 pt-12 mt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-xs font-medium uppercase tracking-widest opacity-50">
                <p>{config.footer.copyright}</p>
                <p>{config.footer.developerText}</p>
            </div>
        </footer>
    );
};

export default Footer;
