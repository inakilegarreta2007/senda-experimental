import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
// Leaflet imports removed
import { StepRenderer } from '../components/AdhesionForm/StepRenderer';
import { Institution } from '../types';
import { geocodeAddress } from '@/geminiService';
import Logo from '@/img/logo.png';
import { supabase, uploadImage } from '../supabaseClient';
import { toast } from 'react-hot-toast';

interface RegistroProps {
  onAdd: (inst: Institution) => void;
}

const STEPS = [
  { id: 1, title: 'Identidad', icon: 'verified' },
  { id: 2, title: 'Info. Pública', icon: 'public' },
  { id: 3, title: 'Representante', icon: 'badge' },
  { id: 4, title: 'Vinculación', icon: 'handshake' },
  { id: 5, title: 'Declaraciones', icon: 'signature' },
];

const Registro: React.FC<RegistroProps> = ({ onAdd }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeStep, setActiveStep] = useState(1);
  const [complete, setComplete] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Spam Filter
  const [honeypot, setHoneypot] = useState('');
  const startTimeRef = useRef(Date.now());

  // Check for pre-registration data
  const { preRegisteredId, preFilledData } = location.state || {};

  // Map refs removed (moved to Step component)

  const [formData, setFormData] = useState<Partial<Institution>>({
    // 1. Identidad
    name: '', legalName: '', type: 'Asistencia Alimentaria', foundationYear: '',
    country: 'Argentina', province: 'Santa Fe', city: '',
    address: '', addressNumber: '', zipCode: '',
    archdiocese: '', diocese: '', deanery: '', parish: '', website: '',

    // 2. Marco
    parentEntity: false, parentEntityType: '', parentEntityName: '',
    maxAuthorityRole: '', maxAuthorityName: '',

    // 3. Contacto
    phone: '', whatsapp: '', email: '', alternativeEmail: '',
    contactEmailName: '', contactPhoneName: '',
    adminAddress: '', serviceHours: '',
    instagram: '', facebook: '', twitter: '',
    publicPhone: '', publicWhatsapp: '',

    // 4. Representante
    responsible: '', repRole: '', repEmail: '', repPhone: '', repDeclaration: false,

    // 5. Documentos
    statuteLink: '', resolutionLink: '', publicationLink: '', otherLink: '',

    // 6. Vinculación
    adhesionMotivation: '', participationType: '', targetAudience: '', missionValues: '',

    // 7. Declaraciones
    declarationTruth: false, declarationAuthVerify: false, declarationTerms: false,

    // Legacy
    cuit: '',
    description: '',
    status: 'Pendiente',
    ...preFilledData // Merge pre-filled data if available
  });

  // Map effects removed (moved to Step component)

  const handleManualGeocode = async () => {
    if (!formData.address || !formData.addressNumber || !formData.city) {
      toast.error('Completa calle, altura y ciudad primero');
      return;
    }
    setIsGeocoding(true);
    try {
      const coords = await geocodeAddress(
        formData.address,
        formData.addressNumber,
        formData.city,
        formData.province || 'Santa Fe',
        formData.zipCode
      );
      if (!coords) throw new Error("No se pudo obtener la ubicación.");
      setFormData(prev => ({ ...prev, lat: coords.lat, lng: coords.lng }));
      toast.success('Ubicación sincronizada');
    } catch (err: any) {
      toast.error(err.message || 'Error al geocodificar');
    } finally {
      setIsGeocoding(false);
    }
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Spam Check
    if (honeypot) {
      console.warn('Spam detected: Honeypot filled');
      return; // Silent fail
    }

    if (Date.now() - startTimeRef.current < 2000) {
      toast.error('Detección de comportamiento automatizado. Por favor intente nuevamente.');
      return;
    }

    if (!formData.declarationTruth || !formData.declarationAuthVerify || !formData.declarationTerms) {
      toast.error('Debes aceptar todas las declaraciones finales');
      return;
    }

    setIsSaving(true);
    try {
      let imageUrl = '';
      if (previewImage) {
        imageUrl = await uploadImage(previewImage, `inst_${Date.now()}`);
      }

      // Process Gallery
      let galleryUrls: string[] = [];
      if (formData.gallery && formData.gallery.length > 0) {
        for (let i = 0; i < formData.gallery.length; i++) {
          const img = formData.gallery[i];
          if (img.includes('base64')) {
            const url = await uploadImage(img, `gallery_${Date.now()}_${i}`);
            galleryUrls.push(url);
          } else {
            galleryUrls.push(img);
          }
        }
      }

      const finalLat = formData.lat || -31.6333;
      const finalLng = formData.lng || -60.7000;

      const payload = {
        name: formData.name || formData.legalName,
        legal_name: formData.legalName,
        type: formData.type,
        foundation_year: formData.foundationYear,
        country: formData.country,
        province: formData.province,
        city: formData.city,
        address: `${formData.address} ${formData.addressNumber}`,
        address_number: formData.addressNumber,
        zip_code: formData.zipCode,
        archdiocese: formData.archdiocese,
        diocese: formData.diocese,
        deanery: formData.deanery,
        parish: formData.parish,
        website: formData.website,

        parent_entity: formData.parentEntity,
        parent_entity_type: formData.parentEntityType,
        parent_entity_name: formData.parentEntityName,
        max_authority_role: formData.maxAuthorityRole,
        max_authority_name: formData.maxAuthorityName,

        phone: formData.phone,
        contact_phone_name: formData.contactPhoneName,
        whatsapp: formData.whatsapp,
        email: formData.email,
        contact_email_name: formData.contactEmailName,
        alternative_email: formData.alternativeEmail,
        admin_address: formData.adminAddress,
        service_hours: formData.serviceHours,
        instagram: formData.instagram,
        facebook: formData.facebook,
        twitter: formData.twitter,
        public_phone: formData.publicPhone,
        public_whatsapp: formData.publicWhatsapp,

        responsible: formData.responsible,
        rep_role: formData.repRole,
        rep_email: formData.repEmail,
        rep_phone: formData.repPhone,
        rep_declaration: formData.repDeclaration,

        statute_link: formData.statuteLink,
        resolution_link: formData.resolutionLink,
        publication_link: formData.publicationLink,
        other_link: formData.otherLink,

        adhesion_motivation: formData.adhesionMotivation,
        participation_type: formData.participationType,
        target_audience: formData.targetAudience,
        mission_values: formData.missionValues,

        declaration_truth: formData.declarationTruth,
        declaration_auth_verify: formData.declarationAuthVerify,
        declaration_terms: formData.declarationTerms,

        cuit: formData.cuit,
        status: 'En Revisión',
        lat: finalLat,
        lng: finalLng,
        image_url: imageUrl,
        gallery: galleryUrls,
        description: formData.description || `Solicitud Web: ${formData.missionValues?.substring(0, 100)}...`,
        coverage_population: 0,
      };

      let result;
      if (preRegisteredId) {
        // Update existing pre-registered node
        result = await supabase.from('institutions').update(payload).eq('id', preRegisteredId).select().single();
      } else {
        // Create new
        result = await supabase.from('institutions').insert([payload]).select().single();
      }

      const { data, error } = result;
      if (error) throw error;

      // Update local state if needed (optional for public form)
      setComplete(true);

      // Mensaje final
      await new Promise(r => setTimeout(r, 1000));
      alert('Gracias por su solicitud.\nLa información ingresada será evaluada por el equipo de validación de SENDA.\nEn caso de requerir información adicional, nos comunicaremos a través de los canales oficiales proporcionados.');

    } catch (err: any) {
      console.error(err);
      toast.error('Error al enviar solicitud. Intente nuevamente.');
    } finally {
      setIsSaving(false);
    }
  };



  if (complete) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-display items-center justify-center p-6">
        <div className="w-full max-w-2xl bg-white dark:bg-slate-800 rounded-[3.5rem] shadow-2xl p-14 text-center space-y-10 animate-in zoom-in-95">
          <div className="size-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <span className="material-symbols-outlined text-6xl">verified_user</span>
          </div>
          <div className="space-y-4">
            <h2 className="text-4xl font-black text-slate-900 dark:text-white">¡Solicitud Registrada!</h2>
            <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed max-w-sm mx-auto text-lg">
              Gracias por su solicitud. La información ingresada será evaluada por el equipo de validación de SENDA.
            </p>
          </div>
          <button onClick={() => navigate('/')} className="w-full py-6 bg-slate-900 text-white rounded-2xl font-black text-lg shadow-xl hover:bg-black transition-all active:scale-95">Finalizar y Regresar al Inicio</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-display">
      <header className="p-6 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center sticky top-0 z-50">
        <Link to="/" className="flex items-center gap-3">
          <img src={Logo} alt="Senda Logo" className="size-10" />

        </Link>
        <div className="hidden md:flex gap-2">
          {STEPS.map(s => (
            <div key={s.id} className={`h-1.5 rounded-full transition-all ${s.id <= activeStep ? 'w-8 bg-primary' : 'w-2 bg-slate-200'}`}></div>
          ))}
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 py-12">
        <div className="w-full max-w-5xl bg-white dark:bg-slate-800 rounded-[3.5rem] shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex h-[80vh]">
          {/* Sidebar Wizard */}
          <div className="w-64 bg-slate-50 dark:bg-slate-900 border-r border-slate-100 dark:border-slate-700 p-8 flex flex-col hidden lg:flex">
            <h2 className="text-xl font-black mb-8 text-slate-800 dark:text-white leading-none">Formulario de <br /><span className="text-primary">Adhesión</span></h2>
            <div className="space-y-2 flex-1 overflow-y-auto pr-2">
              {STEPS.map(step => (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(step.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left ${activeStep === step.id ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                >
                  <span className={`material-symbols-outlined text-[20px] ${activeStep === step.id ? 'text-white' : 'text-slate-400'}`}>{step.icon}</span>
                  <span className="text-[11px] font-black uppercase tracking-wide">{step.title}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 flex flex-col h-full relative">
            <div className="flex-1 overflow-y-auto p-8 md:p-12">
              <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-1 flex items-center gap-2">
                <span className="material-symbols-outlined text-slate-300 text-3xl">{STEPS.find(s => s.id === activeStep)?.icon}</span>
                {STEPS.find(s => s.id === activeStep)?.title}
              </h3>
              <p className="text-sm text-slate-400 font-medium mb-8">Completa los datos solicitados.</p>

              <form id="public-adhesion-form" onSubmit={handleFinalSubmit}>
                {/* Honeypot Field */}
                <input
                  type="text"
                  name="website_validate_ref"
                  value={honeypot}
                  onChange={e => setHoneypot(e.target.value)}
                  style={{ position: 'absolute', opacity: 0, zIndex: -1, pointerEvents: 'none', height: 0, width: 0 }}
                  tabIndex={-1}
                  autoComplete="off"
                />

                <StepRenderer
                  step={activeStep}
                  formData={formData}
                  setFormData={setFormData}
                  isGeocoding={isGeocoding}
                  onManualGeocode={handleManualGeocode}
                  fileInputRef={fileInputRef}
                  previewImage={previewImage}
                  setPreviewImage={setPreviewImage}
                />
              </form>
            </div>

            <div className="p-6 border-t border-slate-100 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 backdrop-blur flex justify-between items-center gap-4">
              <button type="button" onClick={() => navigate('/')} className="text-slate-400 hover:text-slate-600 font-bold text-sm px-4">Cancelar</button>
              <div className="flex gap-3">
                {activeStep > 1 && (
                  <button type="button" onClick={() => setActiveStep(p => p - 1)} className="px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-black text-xs uppercase tracking-widest transition-colors">Anterior</button>
                )}

                {activeStep < STEPS.length ? (
                  <button type="button" onClick={() => setActiveStep(p => p + 1)} className="px-8 py-3 rounded-2xl bg-primary text-white font-black text-xs uppercase tracking-widest shadow-lg hover:bg-blue-800 transition-all flex items-center gap-2">
                    Siguiente <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                ) : (
                  <button form="public-adhesion-form" disabled={isSaving} type="submit" className="px-8 py-3 rounded-2xl bg-green-600 text-white font-black text-xs uppercase tracking-widest shadow-lg hover:bg-green-700 transition-all flex items-center gap-2">
                    {isSaving ? 'Enviando...' : 'Finalizar Solicitud'} <span className="material-symbols-outlined text-[16px]">check</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Registro;
