import { headers } from 'next/headers';

// Country-specific privacy regulations for Spanish-speaking countries
export const PRIVACY_REGULATIONS = {
  // Latin American Countries
  CO: { country: "Colombia", law: "Ley 1581 de 2012 (Habeas Data)" },
  MX: { country: "México", law: "Ley Federal de Protección de Datos Personales (LFPDPPP)" },
  AR: { country: "Argentina", law: "Ley 25.326 de Protección de Datos Personales" },
  ES: { country: "España", law: "Reglamento General de Protección de Datos (RGPD)" },
  PE: { country: "Perú", law: "Ley 29733 de Protección de Datos Personales" },
  VE: { country: "Venezuela", law: "Ley de Infogobierno" },
  CL: { country: "Chile", law: "Ley 19.628 sobre Protección de Datos de Carácter Personal" },
  EC: { country: "Ecuador", law: "Ley Orgánica de Protección de Datos Personales" },
  GT: { country: "Guatemala", law: "Ley de Acceso a la Información Pública" },
  CU: { country: "Cuba", law: "Decreto-Ley 370 sobre la Informatización de la Sociedad" },
  BO: { country: "Bolivia", law: "Ley de Protección de Datos Personales" },
  DO: { country: "República Dominicana", law: "Ley 172-13 de Protección de Datos Personales" },
  HN: { country: "Honduras", law: "Ley de Transparencia y Acceso a la Información Pública" },
  PY: { country: "Paraguay", law: "Ley 1682/01 que regula la información de carácter privado" },
  SV: { country: "El Salvador", law: "Ley de Acceso a la Información Pública" },
  NI: { country: "Nicaragua", law: "Ley de Acceso a la Información Pública" },
  CR: { country: "Costa Rica", law: "Ley de Protección de la Persona frente al tratamiento de sus datos personales" },
  PA: { country: "Panamá", law: "Ley 81 de Protección de Datos Personales" },
  PR: { country: "Puerto Rico", law: "Ley de Protección de Datos" },
  UY: { country: "Uruguay", law: "Ley 18.331 de Protección de Datos Personales" },
  GQ: { country: "Guinea Ecuatorial", law: "regulaciones de protección de datos" },
  
  // Additional countries with significant Spanish-speaking populations
  US: { country: "Estados Unidos", law: "California Consumer Privacy Act (CCPA)" },
  
  // Default fallback
  DEFAULT: { country: "internacional", law: "regulaciones internacionales de protección de datos" }
} as const;

export type CountryCode = keyof typeof PRIVACY_REGULATIONS;

/**
 * Get the user's country code from Vercel's geolocation headers
 */
export async function getUserCountry(): Promise<string> {
  try {
    const headersList = await headers();
    
    // Vercel provides geolocation data in headers
    const country = headersList.get('x-vercel-ip-country') || 
                   headersList.get('cf-ipcountry') || // Cloudflare fallback
                   'DEFAULT';
    
    console.log('🌍 Detected user country:', country);
    return country.toUpperCase();
  } catch (error) {
    console.error('Failed to get user country:', error);
    return 'DEFAULT';
  }
}

/**
 * Get privacy regulation information for a country
 */
export function getPrivacyRegulation(countryCode?: string) {
  const code = (countryCode || 'DEFAULT').toUpperCase() as CountryCode;
  return PRIVACY_REGULATIONS[code] || PRIVACY_REGULATIONS.DEFAULT;
}

/**
 * Get formatted privacy compliance text for display
 */
export async function getPrivacyComplianceText(): Promise<string> {
  const countryCode = await getUserCountry();
  const regulation = getPrivacyRegulation(countryCode);
  
  if (countryCode === 'DEFAULT' || !PRIVACY_REGULATIONS[countryCode as CountryCode]) {
    return `Este sitio cumple con las regulaciones ${regulation.law}.`;
  }
  
  return `Este sitio cumple con las regulaciones de ${regulation.country} (${regulation.law}).`;
}
