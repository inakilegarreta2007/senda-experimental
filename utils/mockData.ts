
import { Institution, ImpactCategory } from '@/types';

export const mockInstitutions: Institution[] = [
  {
    id: 'INS-204',
    name: 'Cáritas San José',
    type: 'Centro Comunitario',
    parish: 'Pquia. Luján',
    province: 'Santa Fe', // Added missing province
    city: 'Santa Fe Capital',
    address: 'Av. Aristóbulo del Valle', // Updated address to be just the street
    addressNumber: '6500', // Added missing addressNumber
    phone: '+54 342 455-1234',
    whatsapp: '543424551234',
    email: 'contacto@sanjose.org',
    responsible: 'María González',
    cuit: '20-12345678-9',
    status: 'Ayuda Req.',
    needs: ['Alimentos no perecederos', 'Útiles escolares'],
    description: 'Brindamos merienda diaria y apoyo en tareas escolares. Fomentamos la integración barrial.',
    lastUpdate: '12 Oct 2023',
    color: 'blue',
    lat: -31.6106,
    lng: -60.6973,
    coveragePopulation: 150,
    categories: [ImpactCategory.ALIMENTACION, ImpactCategory.EDUCACION, ImpactCategory.NINEZ],
    volunteersCount: 25,
    isHighImpact: true
  },
  {
    id: 'INS-198',
    name: 'Comedor Santa Rita',
    type: 'Comedor Comunitario',
    parish: 'Capilla Santa Rita',
    province: 'Santa Fe', // Added missing province
    city: 'Rosario',
    address: 'Bv. Seguí', // Updated address to be just the street
    addressNumber: '3400', // Added missing addressNumber
    phone: '+54 341 432-5678',
    whatsapp: '543414325678',
    email: 'santarita@rosario.org',
    responsible: 'Juan Pérez',
    cuit: '23-98765432-1',
    status: 'Activo',
    needs: [],
    description: 'Servicio de almuerzo para familias en situación de calle y ancianos del barrio.',
    lastUpdate: '11 Oct 2023',
    color: 'orange',
    lat: -32.9602,
    lng: -60.6780,
    coveragePopulation: 320,
    categories: [ImpactCategory.ALIMENTACION, ImpactCategory.ANCIOANOS],
    volunteersCount: 15
  },
  {
    id: 'INS-150',
    name: 'Hogar San Francisco',
    type: 'Hogar de Ancianos',
    parish: 'Catedral de Venado Tuerto',
    province: 'Santa Fe', // Added missing province
    city: 'Venado Tuerto',
    address: 'Calle Mitre', // Updated address to be just the street
    addressNumber: '450', // Added missing addressNumber
    phone: '+54 3462 445-121',
    whatsapp: '543462445121',
    email: 'sfhogar@venado.org',
    responsible: 'Sor Elena',
    cuit: '30-45678901-2',
    status: 'En Revisión',
    needs: ['Medicamentos', 'Ropa de cama'],
    description: 'Cuidado integral para adultos mayores sin recursos y acompañamiento espiritual.',
    lastUpdate: '10 Oct 2023',
    color: 'purple',
    lat: -33.7441,
    lng: -61.9688,
    coveragePopulation: 45,
    categories: [ImpactCategory.SALUD, ImpactCategory.ANCIOANOS, ImpactCategory.ESPIRITUAL],
    volunteersCount: 40,
    isHighImpact: true
  }
];

export const mockStats = {
  totalInstitutions: 142,
  activeRequests: 38,
  totalBeneficiaries: 24580,
  pendingValidations: 12,
  totalVolunteers: 850
};
