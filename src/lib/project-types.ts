// Project Types and Constants for ULTRACTION Website

/**
 * Project categories based on ULTRACTION's project types
 */
export enum ProjectCategory {
  ALL = 'all',
  INFRASTRUCTURE = 'infrastructure',
  RESIDENTIAL = 'residential',
  COMMERCIAL = 'commercial',
  INDUSTRIAL = 'industrial',
  MARINE = 'marine',
}

/**
 * Category metadata for display
 */
export const CATEGORY_INFO = {
  [ProjectCategory.ALL]: {
    label: 'All Projects',
    icon: 'apps',
    description: 'View our complete portfolio',
    color: 'hsl(var(--color-primary))',
  },
  [ProjectCategory.INFRASTRUCTURE]: {
    label: 'Infrastructure',
    icon: 'bridge',
    description: 'Bridges, roads, tunnels, and rail projects',
    color: 'hsl(var(--color-accent))',
  },
  [ProjectCategory.RESIDENTIAL]: {
    label: 'Residential',
    icon: 'home_work',
    description: 'Villas and residential towers',
    color: 'hsl(var(--color-primary))',
  },
  [ProjectCategory.COMMERCIAL]: {
    label: 'Commercial',
    icon: 'domain',
    description: 'Warehouses, ports, and commercial buildings',
    color: 'hsl(var(--color-accent))',
  },
  [ProjectCategory.INDUSTRIAL]: {
    label: 'Industrial',
    icon: 'factory',
    description: 'Oil & gas, substations, water reservoirs',
    color: 'hsl(var(--color-primary))',
  },
  [ProjectCategory.MARINE]: {
    label: 'Marine',
    icon: 'sailing',
    description: 'Marine staging and offshore projects',
    color: 'hsl(var(--color-accent))',
  },
} as const;

/**
 * List of all categories for filtering
 */
export const CATEGORIES = [
  ProjectCategory.ALL,
  ProjectCategory.INFRASTRUCTURE,
  ProjectCategory.RESIDENTIAL,
  ProjectCategory.COMMERCIAL,
  ProjectCategory.INDUSTRIAL,
  ProjectCategory.MARINE,
] as const;

/**
 * Category type for use in components
 */
export type CategoryType = typeof CATEGORIES[number];

/**
 * Project data interface
 */
export interface UltractionProject {
  id: string;
  title: string;
  slug: string;
  category: CategoryType;
  location: string;
  completed: string;
  client?: string;
  featured?: boolean;
  images: string[];
  imageCount: number;
  description?: string;
  size?: string;
  duration?: string;
}

/**
 * Source project folder mapping
 */
export const SOURCE_PROJECT_FOLDERS = [
  '27 DISTRIBUTION SUBSTATIONS SADER - ABU DHABI',
  'BANIYAS NORTH INFRASTRUCTURE',
  'CONSTRUCTION OF NASEEM ALBAR BRIDGE',
  'CONSTRUCTION OF UTILITY BRIDGE',
  'CRYSTAL LAGOON & MACHINE STATION MAYDAN - DUBAI',
  'DEVELOPMENT OF 3 BRIDGES AL TALAH ROAD',
  'DISTRIBUTION SUBSTATION AQAH - FUJAIRAH',
  'ETIHAD RAIL 2D PACKAGE CULVERTS',
  'ETIHAD RAIL 2D PACKAGE TUNNEL SERVICE BLDG #1 MASSAFI, FUJAIRAH',
  'ETIHAD RAIL 2F2 PACKAGE ADP PROJECT',
  'HUGE WATER RESERVOIR & 29 SUBSTATIONS MBZ CITY,ABU DHABI',
  'HUGE WATER RESERVOIR RIYADH CITY - ABU DHABI',
  'KHALIFA PORT',
  'MARINE STAGING YASSAT ISLAND - ABU DHABI',
  'OFFSHORE OIL & GAS FIELD',
  'OPERA TUNNEL & FORTE TUNNEL DOWNTOWN DUBAI',
  'OVER-BRIDGE PACKAGE 44 MBR DUBAI HILLS ESTATE',
  'POND & PUMP STATIONS RIYADH CITY - ABU DHABI',
  'PRIVATE VILLAS PROJECT',
  'PUMP STATIONS & RETAINING WALLS',
  'RETAINING WALLS',
  'TRAFFIC IMPROVEMENT ON E20 AND CONSTRUCTION OF 2 BRIDGES',
  'UPGRADING OF INNER BYPASS PARALLEL TO E-45',
  'VEHICLE TUNNEL & HUGE WALLS YAS ACRES - ABU DHABI',
  'WATER RESERVOIR & 6 POWER STATIONS SAMHA - ABU DHABI',
  'WATER RESERVOIR & RETAINING WALLS YAS ISLAND - ABU DHABI',
] as const;

/**
 * Helper function to create a slug from a project title
 */
export function createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

/**
 * Helper function to get category by project name
 */
export function getCategoryByProjectName(projectName: string): CategoryType {
  const name = projectName.toUpperCase();

  // Infrastructure keywords
  if (
    name.includes('BRIDGE') ||
    name.includes('TUNNEL') ||
    name.includes('ROAD') ||
    name.includes('INFRASTRUCTURE') ||
    name.includes('ETIHAD RAIL') ||
    name.includes('BYPASS') ||
    name.includes('TRAFFIC')
  ) {
    return ProjectCategory.INFRASTRUCTURE;
  }

  // Residential keywords
  if (
    name.includes('VILLA') ||
    name.includes('RESIDENTIAL')
  ) {
    return ProjectCategory.RESIDENTIAL;
  }

  // Industrial keywords
  if (
    name.includes('SUBSTATION') ||
    name.includes('POWER') ||
    name.includes('WATER RESERVOIR') ||
    name.includes('OIL') ||
    name.includes('GAS') ||
    name.includes('PUMP') ||
    name.includes('INDUSTRIAL')
  ) {
    return ProjectCategory.INDUSTRIAL;
  }

  // Marine keywords
  if (
    name.includes('MARINE') ||
    name.includes('OFFSHORE') ||
    name.includes('PORT') ||
    name.includes('ISLAND')
  ) {
    return ProjectCategory.MARINE;
  }

  // Commercial keywords
  if (
    name.includes('LAGOON') ||
    name.includes('COMMERCIAL') ||
    name.includes('WAREHOUSE')
  ) {
    return ProjectCategory.COMMERCIAL;
  }

  // Default to infrastructure for construction projects
  return ProjectCategory.INFRASTRUCTURE;
}

/**
 * Get category display info
 */
export function getCategoryInfo(category: CategoryType) {
  return CATEGORY_INFO[category] || CATEGORY_INFO[ProjectCategory.ALL];
}
