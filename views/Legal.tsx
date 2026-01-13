
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import Logo from '@/img/logo.png';
import Footer from '@/components/Footer';

const Legal: React.FC = () => {
    const { section } = useParams<{ section: string }>();
    const isPrivacy = section === 'privacidad';

    const title = isPrivacy ? 'Política de Privacidad' : 'Términos y Condiciones';
    const lastUpdate = '27 de Diciembre, 2025';

    return (
        <div className="min-h-screen bg-white dark:bg-slate-900 font-display">
            <nav className="border-b border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-4xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl group-hover:bg-primary/10 transition-colors">
                            <span className="material-symbols-outlined text-slate-500 group-hover:text-primary">arrow_back</span>
                        </div>
                        <span className="text-sm font-black uppercase tracking-widest text-slate-500 group-hover:text-primary transition-colors">Volver</span>
                    </Link>
                    <img src={Logo} alt="Senda Logo" className="size-8" />
                </div>
            </nav>

            <main className="max-w-3xl mx-auto px-6 py-20">
                <header className="mb-16 text-center space-y-4">
                    <span className="inline-block px-4 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-500">
                        Legal
                    </span>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">{title}</h1>
                    <p className="text-slate-400 text-sm font-medium">Última actualización: {lastUpdate}</p>
                </header>

                <div className="prose prose-slate dark:prose-invert prose-lg mx-auto prose-headings:font-black prose-headings:tracking-tight prose-a:text-primary">
                    {isPrivacy ? (
                        <>
                            <p>
                                En <strong>Senda</strong>, nos comprometemos a proteger la privacidad de nuestras instituciones, voluntarios y beneficiarios. Esta Política de Privacidad describe cómo recopilamos, usamos y protegemos su información.
                            </p>

                            <h3>1. Recopilación de Información</h3>
                            <p>
                                Recopilamos información que usted nos proporciona directamente al registrar una institución, como nombres, direcciones, números de contacto y descripciones de las actividades. También podemos recopilar información de ubicación geográfica para situar las sedes en nuestro mapa.
                            </p>

                            <h3>2. Uso de la Información</h3>
                            <p>
                                La información recopilada se utiliza exclusivamente para:
                            </p>
                            <ul>
                                <li>Visibilizar las sedes y puntos de asistencia en el Mapa Senda.</li>
                                <li>Conectar a voluntarios y donantes con las instituciones.</li>
                                <li>Generar estadísticas anónimas para el Observatorio Social.</li>
                                <li>Mejorar la coordinación de la ayuda solidaria.</li>
                            </ul>

                            <h3>3. Protección de Datos</h3>
                            <p>
                                Implementamos medidas de seguridad técnicas y organizativas para proteger sus datos contra el acceso no autorizado, la modificación, divulgación o destrucción. <strong>No compartimos ni vendemos datos personales a terceros con fines comerciales.</strong>
                            </p>

                            <h3>4. Datos de Ubicación</h3>
                            <p>
                                Para garantizar la precisión del Mapa Senda, utilizamos servicios de georreferenciación. Al registrarse, usted acepta que la ubicación aproximada de la institución sea pública para facilitar el acceso a la ayuda.
                            </p>

                            <h3>5. Contacto</h3>
                            <p>
                                Si tiene preguntas sobre esta política, puede contactar al equipo de coordinación a través de los canales oficiales de Senda.
                            </p>
                        </>
                    ) : (
                        <>
                            <p>
                                Bienvenido a <strong>Senda</strong>. Al acceder y utilizar nuestra plataforma, usted acepta cumplir con los siguientes Términos y Condiciones. Si no está de acuerdo con alguna parte de estos términos, le rogamos no utilizar nuestros servicios.
                            </p>

                            <h3>1. Naturaleza del Proyecto</h3>
                            <p>
                                Senda es una <strong>iniciativa solidaria independiente</strong> que busca articular esfuerzos socio-eclesiales. No somos una entidad gubernamental ni representamos a ningún partido político.
                            </p>

                            <h3>2. Responsabilidad del Usuario</h3>
                            <p>
                                Usted se compromete a utilizar la plataforma de manera ética y responsable.
                            </p>
                            <ul>
                                <li>La información proporcionada al registrar una institución debe ser veraz y actualizada.</li>
                                <li>No está permitido el uso de la plataforma para fines ilícitos, discriminatorios o que atenten contra la dignidad de las personas.</li>
                            </ul>

                            <h3>3. Propiedad Intelectual</h3>
                            <p>
                                Todo el contenido de la plataforma, incluyendo logos, diseños, textos y código, es propiedad de Senda o de sus respectivos titulares y está protegido por las leyes de propiedad intelectual.
                            </p>

                            <h3>4. Exactitud de la Información</h3>
                            <p>
                                Aunque nos esforzamos por mantener la información actualizada, Senda no garantiza la exactitud completa de los datos de las instituciones, ya que estos son provistos por terceros. No nos hacemos responsables por inconvenientes derivados de información inexacta.
                            </p>

                            <h3>5. Modificaciones</h3>
                            <p>
                                Nos reservamos el derecho de modificar estos términos en cualquier momento. Las modificaciones entrarán en vigencia inmediatamente después de su publicación en la plataforma.
                            </p>
                        </>
                    )}
                </div>
            </main>

            <Footer variant="simple" />
        </div>
    );
};

export default Legal;
