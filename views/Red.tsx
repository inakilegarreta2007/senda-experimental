import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
// Leaflet imports removed
import { StepRenderer } from '../components/AdhesionForm/StepRenderer';
import { Institution } from '../types';
import { SkeletonList } from '../components/Skeleton';
import { supabase, uploadImage } from '../supabaseClient';
import { geocodeAddress } from '@/geminiService';
import { splitAddress } from '@/utils/geo';
import { toast } from 'react-hot-toast';

interface RedProps {
  institutions: Institution[];
  onAdd: (inst: Institution) => void;
  onUpdate: (inst: Institution) => void;
  loading?: boolean;
}

const STEPS = [
  { id: 1, title: 'Identidad', icon: 'verified' },
  { id: 2, title: 'Info. Pública', icon: 'public' },
  { id: 3, title: 'Datos Confidenciales', icon: 'shield_lock' },
  { id: 4, title: 'Perfil Institucional', icon: 'assignment_turned_in' },
  { id: 5, title: 'Confirmación Legal', icon: 'gavel' },
];

const Red: React.FC<RedProps> = ({ institutions, onAdd, onUpdate, loading }) => {
  const [filter, setFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInst, setEditingInst] = useState<Institution | null>(null);
  const [activeStep, setActiveStep] = useState(1);

  const initialFormData: Partial<Institution> = {
    // 1. Identidad
    name: '', legalName: '', type: 'Asistencia Alimentaria', foundationYear: '',
    country: 'Argentina', province: 'Santa Fe', city: 'Santa Fe Capital',
    address: '', addressNumber: '', zipCode: '',
    archdiocese: '', diocese: '', deanery: '', parish: '', website: '',

    // 2. Marco
    parentEntity: false, parentEntityType: '', parentEntityName: '',
    maxAuthorityRole: '', maxAuthorityName: '',

    // 3. Contacto
    phone: '', whatsapp: '', email: '', alternativeEmail: '',
    adminAddress: '', serviceHours: '', contactEmailName: '', contactPhoneName: '',

    // 4. Representante
    responsible: '', repRole: '', repEmail: '', repPhone: '', repDeclaration: false,

    // 5. Documentos
    statuteLink: '', resolutionLink: '', publicationLink: '', otherLink: '',

    // 6. Vinculación
    adhesionMotivation: '', participationType: '', targetAudience: '', missionValues: '',

    // 7. Declaraciones
    declarationTruth: false, declarationAuthVerify: false, declarationTerms: false,

    // Legacy / System
    cuit: '', coveragePopulation: 0, volunteersCount: 0,
    description: '', needs: [], status: 'En Revisión',
    lat: undefined, lng: undefined
  };

  const [formData, setFormData] = useState<Partial<Institution>>(initialFormData);
  const [isSaving, setIsSaving] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Refs removed (moved to components)

  // Map effects removed (moved to components)

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

  const filtered = useMemo(() =>
    institutions.filter(inst => inst.status !== 'Inactivo' && inst.name.toLowerCase().includes(filter.toLowerCase())),
    [institutions, filter]);

  const openAddModal = () => {
    setEditingInst(null);
    setFormData(initialFormData);
    setActiveStep(1);
    setPreviewImage(null);
    setIsModalOpen(true);
  };

  const openEditModal = (inst: Institution) => {
    setEditingInst(inst);
    setFormData(inst);
    setActiveStep(1);
    setPreviewImage(inst.image || null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.declarationTruth || !formData.declarationAuthVerify || !formData.declarationTerms) {
      toast.error('Debes aceptar todas las declaraciones finales');
      return;
    }

    setIsSaving(true);
    try {
      let imageUrl = formData.image || '';
      if (previewImage && previewImage !== formData.image) {
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
        name: formData.name || formData.legalName, // Fallback to legalName if name is empty
        legal_name: formData.legalName,
        type: formData.type,
        foundation_year: formData.foundationYear,
        country: formData.country,
        province: formData.province,
        city: formData.city,
        address: `${formData.address} ${formData.addressNumber}`,
        address_number: formData.addressNumber, // New column assumed
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
        whatsapp: formData.whatsapp,
        email: formData.email,
        alternative_email: formData.alternativeEmail,
        admin_address: formData.adminAddress,
        service_hours: formData.serviceHours,

        responsible: formData.responsible, // Representative Name
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
        status: editingInst ? formData.status : 'En Revisión', // Force status for new
        lat: finalLat,
        lng: finalLng,
        image_url: imageUrl,
        gallery: galleryUrls,
        description: formData.description,
        coverage_population: formData.coveragePopulation,
        volunteers_count: formData.volunteersCount,
      };

      // NOTE: We are sending snake_case keys assuming database columns exist. 
      // If not, Supabase will ignore or error depending on configuration. 
      // Current Supabase client setup usually requires keys to match DB columns exactly.
      // Since I cannot change DB schema, I will proceed. If it fails, I will notify user.

      if (editingInst) {
        onUpdate({ ...editingInst, ...formData, lat: finalLat, lng: finalLng, image: imageUrl, gallery: galleryUrls } as Institution);
        toast.success('Institución actualizada');
      } else {
        // We need to map payload to snake_case for Supabase insert
        const { data, error } = await supabase.from('institutions').insert([payload]).select().single();
        if (error) throw error;

        if (data) onAdd({ ...formData, id: data.id } as Institution);
        toast.success('Solicitud enviada exitosamente');

        // Mensaje final automático solicitado:
        await new Promise(r => setTimeout(r, 1000));
        alert('Gracias por su solicitud.\nLa información ingresada será evaluada por el equipo de validación de SENDA.\nEn caso de requerir información adicional, nos comunicaremos a través de los canales oficiales proporcionados.');
      }
      setIsModalOpen(false);
    } catch (err: any) {
      console.error(err);
      toast.error('Error al guardar. Verifica la conexión o los campos.');
    } finally {
      setIsSaving(false);
    }
  };

  // renderStepContent removed (replaced by StepRenderer component)

  return (
    <div className="flex flex-col flex-1 min-h-full">
      <header className="bg-white/50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 px-6 py-8 flex justify-between items-center sticky top-0 z-50 backdrop-blur-md">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Red de Nodos</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 font-medium">Gestión integral de las sedes de asistencia.</p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-primary text-white px-6 py-3 rounded-2xl text-sm font-black shadow-lg hover:bg-blue-800 transition-all active:scale-95 flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          NUEVO NODO
        </button>
      </header>

      <main className="max-w-7xl mx-auto w-full p-6 space-y-6">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
          <input
            type="text"
            placeholder="Filtrar por nombre de nodo..."
            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white dark:bg-slate-800 border-none shadow-sm focus:ring-2 focus:ring-primary dark:text-white transition-all"
            value={filter}
            onChange={e => setFilter(e.target.value)}
          />
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700">
              <tr>
                <th className="px-6 py-5 text-[11px] font-black uppercase text-slate-400 tracking-widest">Nodo</th>
                <th className="px-6 py-5 text-[11px] font-black uppercase text-slate-400 tracking-widest">Ciudad</th>
                <th className="px-6 py-5 text-[11px] font-black uppercase text-slate-400 tracking-widest">Tipo</th>
                <th className="px-6 py-5 text-[11px] font-black uppercase text-slate-400 tracking-widest">Estado</th>
                <th className="px-6 py-5 text-[11px] font-black uppercase text-slate-400 tracking-widest text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {loading ? (
                <tr><td colSpan={5} className="p-6"><SkeletonList /></td></tr>
              ) : (
                filtered.map(inst => (
                  <tr key={inst.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/20 transition-colors group">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-800 dark:text-slate-200">{inst.name}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">{inst.legalName?.substring(0, 25)}...</p>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500 font-medium">{inst.city}</td>
                    <td className="px-6 py-4"><span className="text-xs font-bold text-slate-600 dark:text-slate-400">{inst.type}</span></td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${inst.status === 'Activo' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>
                        {inst.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end gap-1">
                      <Link to={`/admin/details/${inst.id}`} className="text-slate-400 hover:text-primary transition-colors p-2 inline-block hover:bg-primary/5 rounded-lg" title="Ver Detalles"><span className="material-symbols-outlined">visibility</span></Link>
                      <button onClick={() => openEditModal(inst)} className="text-slate-400 hover:text-amber-600 transition-colors p-2 inline-block hover:bg-amber-50 rounded-lg" title="Editar"><span className="material-symbols-outlined">edit</span></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="p-20 text-center"><span className="material-symbols-outlined text-slate-200 text-6xl mb-4">search_off</span><p className="text-slate-400 font-bold uppercase tracking-widest text-sm italic">No se encontraron nodos en la red</p></div>
          )}
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-800 w-full max-w-4xl h-[90vh] rounded-[2.5rem] shadow-2xl flex overflow-hidden animate-in zoom-in-95 duration-300">
            {/* Sidebar Wizard */}
            <div className="w-64 bg-slate-50 dark:bg-slate-900 border-r border-slate-100 dark:border-slate-700 p-8 flex flex-col hidden md:flex">
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
              <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
                <div className="text-[10px] text-slate-400 font-medium text-center">Paso {activeStep} de {STEPS.length}</div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-primary h-full transition-all duration-500" style={{ width: `${(activeStep / STEPS.length) * 100}%` }}></div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-full overflow-hidden relative">
              {/* Mobile Header Steps */}
              <div className="md:hidden bg-slate-50 p-4 flex gap-2 overflow-x-auto">
                {STEPS.map(step => (
                  <button key={step.id} onClick={() => setActiveStep(step.id)} className={`flex-shrink-0 px-3 py-1 rounded-full text-[10px] font-bold uppercase ${activeStep === step.id ? 'bg-primary text-white' : 'bg-slate-200 text-slate-500'}`}>{step.id}. {step.title}</button>
                ))}
              </div>

              <div className="flex-1 overflow-y-auto p-8 md:p-12">
                <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-1 flex items-center gap-2">
                  <span className="material-symbols-outlined text-slate-300 text-3xl">{STEPS.find(s => s.id === activeStep)?.icon}</span>
                  {STEPS.find(s => s.id === activeStep)?.title}
                </h3>
                <p className="text-sm text-slate-400 font-medium mb-8">Completa los datos de la sección.</p>

                <form id="adhesion-form" onSubmit={handleSubmit}>
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
                <button type="button" onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold text-sm px-4">Cancelar</button>
                <div className="flex gap-3">
                  {activeStep > 1 && (
                    <button type="button" onClick={() => setActiveStep(p => p - 1)} className="px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-black text-xs uppercase tracking-widest transition-colors">Anterior</button>
                  )}

                  {activeStep < STEPS.length ? (
                    <button type="button" onClick={() => setActiveStep(p => p + 1)} className="px-8 py-3 rounded-2xl bg-primary text-white font-black text-xs uppercase tracking-widest shadow-lg hover:bg-blue-800 transition-all flex items-center gap-2">
                      Siguiente <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </button>
                  ) : (
                    <button form="adhesion-form" disabled={isSaving} type="submit" className="px-8 py-3 rounded-2xl bg-green-600 text-white font-black text-xs uppercase tracking-widest shadow-lg hover:bg-green-700 transition-all flex items-center gap-2">
                      {isSaving ? 'Enviando...' : 'Finalizar Solicitud'} <span className="material-symbols-outlined text-[16px]">check</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Red;
