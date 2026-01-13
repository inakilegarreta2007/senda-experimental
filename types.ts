
export enum UserRole {
  ADMIN = 'ADMIN',
  REPRESENTATIVE = 'REPRESENTATIVE',
  VISITOR = 'VISITOR'
}

export enum ImpactCategory {
  ALIMENTACION = 'Soberanía Alimentaria',
  EDUCACION = 'Educación y Oficios',
  SALUD = 'Salud Integral',
  VIVIENDA = 'Hábitat Digno',
  ADICCIONES = 'Prevención de Adicciones',
  NINEZ = 'Protección de la Niñez',
  ANCIOANOS = 'Cuidado de Adultos Mayores',
  ESPIRITUAL = 'Acompañamiento Espiritual'
}

export interface InterventionMetric {
  date: string;
  type: ImpactCategory;
  quantity: number;
  description: string;
}

export interface Institution {
  id: string;
  // Sección 1: Identidad
  name: string; // Nombre común
  legalName?: string; // Nombre legal completo
  type: string;
  foundationYear?: string;
  country?: string;
  province: string;
  city: string;
  address: string; // Calle física
  addressNumber: string; // Altura física
  zipCode?: string;
  archdiocese?: string;
  diocese?: string;
  deanery?: string;
  parish: string;
  website?: string;

  // Sección 2: Marco Institucional
  parentEntity?: boolean;
  parentEntityType?: string;
  parentEntityName?: string;
  maxAuthorityRole?: string;
  maxAuthorityName?: string;

  // Sección 3: Contacto
  phone: string;
  whatsapp?: string;
  email?: string; // Email institucional principal
  alternativeEmail?: string;
  adminAddress?: string; // Dirección administrativa
  contactEmailName?: string;
  contactPhoneName?: string;
  serviceHours?: string;
  instagram?: string;
  facebook?: string;
  twitter?: string;
  publicPhone?: string;
  publicWhatsapp?: string;

  // Sección 4: Representante
  responsible: string; // Nombre del representante (Legacy: responsible)
  repRole?: string;
  repEmail?: string;
  repPhone?: string;
  repDeclaration?: boolean;

  // Sección 5: Documentación
  statuteLink?: string;
  resolutionLink?: string;
  publicationLink?: string;
  otherLink?: string;

  // Sección 6: Vinculación
  adhesionMotivation?: string;
  participationType?: string;
  targetAudience?: string;
  missionValues?: string;

  // Sección 7: Declaraciones
  declarationTruth?: boolean;
  declarationAuthVerify?: boolean;
  declarationTerms?: boolean;

  // Metadatos y Estado
  cuit: string;
  status: 'Activo' | 'Pendiente' | 'Inactivo' | 'En Revisión' | 'Ayuda Req.';
  needs: string[];
  description: string;
  lastUpdate: string;
  color?: string;
  lat: number;
  lng: number;
  coveragePopulation: number;
  categories: ImpactCategory[];
  staffCount?: number;
  volunteersCount?: number;
  interventionHistory?: InterventionMetric[];
  isHighImpact?: boolean;
  image?: string;
  gallery?: string[];
}

export interface Stats {
  totalInstitutions: number;
  activeRequests: number;
  totalBeneficiaries: number;
  pendingValidations: number;
  pendingNotifications?: number; // Pre-forms
  totalVolunteers: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface ButtonConfig {
  label: string;
  route: string;
}

export interface CardConfig {
  icon: string;
  title: string;
  desc: string;
  route: string;
}


export interface SiteConfig {
  general: {
    maintenanceMode: boolean;
  };
  theme: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
  };
  contact: {
    email: string;
    address: string;
    instagram: string;
    facebook: string;
  };
  pages: {
    home: {
      hero: {
        title: string;
        subtitle: string;
        metricsButton: {
          label: string;
          show: boolean;
        };
      };
      stats: {
        show: boolean;
      };
      observatory: {
        title: string;
        subtitle: string;
        description: string;
        cards: {
          card1: CardConfig;
          card2: CardConfig;
          card3: CardConfig;
        };
        show: boolean;
      };
      about: {
        show: boolean;
        title: string;
        description: string;
        point1: { icon: string; title: string; desc: string };
        point2: { icon: string; title: string; desc: string };
        image: string;
        badgeHeader: string;
        badgeFooter: string;
      };
    };
    map: {
      title: string;
      tagline: string;
      showRadiusFilter: boolean;
      showAIsearch: boolean;
    };
    impact: {
      title: string;
      subtitle: string;
      showHero: boolean;
      showStats: boolean;
    };
  };
  features: {
    showMap: boolean;
    showRegistration: boolean;
    showCollaboration: boolean;
  };
  seo: {
    title: string;
    description: string;
    seoTitle: string;
    seoDescription: string;
  };
  footer: {
    text: string;
    copyright: string;
    developerText: string;
  };
}

// --- ESTRUCTURAS EXPERIMENTALES PARA ROLES Y NOTIFICACIONES ---

/**
 * Sistema de Notificaciones Admin
 * Diseñado para desacoplar la base de datos de la lógica de notificaciones
 * Permite manejar solicitudes de cambios sin modificar los datos reales inmediatamente
 */
export enum NotificationType {
  // Flujo de Entrada
  NEW_PRE_REGISTER = 'NEW_PRE_REGISTER',     // "Alguien llenó 'Quiero ser parte'"
  NEW_FULL_REGISTER = 'NEW_FULL_REGISTER',   // "Llegó una ficha completa para validar"

  // Gestión de Identidad (Handshake)
  ACCESS_REQUEST = 'ACCESS_REQUEST',         // "Usuario solicita controlar un nodo existente"

  // Gobernanza de Datos (Modificaciones supervisadas)
  DATA_UPDATE_REQUEST = 'DATA_UPDATE_REQUEST', // "Representante sugiere cambios (teléfono, dirección)"
  DELETION_REQUEST = 'DELETION_REQUEST',       // "Representante pide baja del nodo"

  // Soporte y Sistema
  SUPPORT_TICKET = 'SUPPORT_TICKET',         // "Mensaje de ayuda / Contacto"
  SYSTEM_ALERT = 'SYSTEM_ALERT'              // "Error de geolocalización / Datos incompletos"
}

export interface AdminNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  date: string;
  read: boolean; // Estado de lectura
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'ARCHIVED'; // Estado de gestión

  // Contexto para la acción
  relatedInstitutionId?: string; // ID del nodo afectado (si existe)
  relatedUserId?: string;        // Usuario que genera la acción

  // Payload flexible para visualizar cambios antes de aplicar
  // Por ejemplo: { oldPhone: "123", newPhone: "456" }
  dataPayload?: any;

  priority: 'LOW' | 'MEDIUM' | 'HIGH';
}
