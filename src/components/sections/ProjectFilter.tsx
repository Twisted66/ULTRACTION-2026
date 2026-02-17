import React, { useState } from 'react';
import { CATEGORIES, ProjectCategory, type CategoryType } from '../../lib/project-types';

interface ProjectFilterProps {
  categories?: readonly CategoryType[];
  initialCategory?: CategoryType;
  onCategoryChange?: (category: CategoryType) => void;
}

const icons: Record<CategoryType, string> = {
  [ProjectCategory.ALL]: 'apps',
  [ProjectCategory.INFRASTRUCTURE]: 'bridge',
  [ProjectCategory.RESIDENTIAL]: 'home_work',
  [ProjectCategory.COMMERCIAL]: 'domain',
  [ProjectCategory.INDUSTRIAL]: 'factory',
  [ProjectCategory.MARINE]: 'sailing'
};

const iconPaths: Record<string, React.ReactElement> = {
  'apps': (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  ),
  'bridge': (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  ),
  'home_work': (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  ),
  'domain': (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
  ),
  'factory': (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16M6 4v16M18 4v16M10 8v8M14 8v8" />
  ),
  'sailing': (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
  )
};

const categoryLabels: Record<CategoryType, string> = {
  [ProjectCategory.ALL]: 'ALL',
  [ProjectCategory.INFRASTRUCTURE]: 'INFRASTRUCTURE',
  [ProjectCategory.RESIDENTIAL]: 'RESIDENTIAL',
  [ProjectCategory.COMMERCIAL]: 'COMMERCIAL',
  [ProjectCategory.INDUSTRIAL]: 'INDUSTRIAL',
  [ProjectCategory.MARINE]: 'MARINE'
};

export default function ProjectFilter({
  categories = CATEGORIES,
  initialCategory = ProjectCategory.ALL,
  onCategoryChange
}: ProjectFilterProps) {
  const [activeCategory, setActiveCategory] = useState<CategoryType>(initialCategory);

  const handleCategoryChange = (category: CategoryType) => {
    setActiveCategory(category);
    // Call custom callback if provided
    if (onCategoryChange) {
      onCategoryChange(category);
    }
    // Dispatch custom event for backward compatibility
    window.dispatchEvent(new CustomEvent('project-filter-change', { detail: category }));
  };

  return (
    <section className="border-b border-primary/20 dark:border-white/20">
      <div className="grid grid-cols-1 md:grid-cols-12">
        {/* Title */}
        <div className="col-span-12 md:col-span-4 p-6 lg:p-8 border-b md:border-b-0 md:border-r border-primary/20 dark:border-white/20 flex flex-col justify-center">
          <h1 className="text-3xl lg:text-4xl font-bold uppercase tracking-tight mb-1 font-heading">Projects</h1>
          <p className="text-xs uppercase tracking-widest opacity-60">Selected Works 2020-2024</p>
        </div>

        {/* Category Filters */}
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryChange(category)}
            aria-label={`Filter by ${category}`}
            aria-pressed={activeCategory === category}
            className={`col-span-3 sm:col-span-6 md:col-span-2 py-6 px-4 hover:bg-primary hover:text-background dark:hover:text-white transition-all duration-300 flex flex-col items-center justify-center gap-2 group focus-ring ${
              activeCategory === category ? 'bg-primary text-background dark:text-white' : ''
            }`}
          >
            <svg className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {iconPaths[icons[category]] || iconPaths['apps']}
            </svg>
            <span className="text-xs font-bold uppercase tracking-widest">{categoryLabels[category] || category}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
