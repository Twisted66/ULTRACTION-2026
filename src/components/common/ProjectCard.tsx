interface ProjectCardProps {
  title: string;
  category: string;
  year: string;
  image?: string;
  height?: 'tall' | 'med' | 'short' | 'hero';
  featured?: boolean;
}

const heightClasses: Record<string, string> = {
  tall: 'h-[600px]',
  med: 'h-[400px]',
  short: 'h-[300px]',
  hero: 'h-[750px]'
};

export default function ProjectCard({
  title,
  category,
  year,
  image,
  height = 'med',
  featured = false
}: ProjectCardProps) {
  const heightClass = heightClasses[height] || heightClasses.med;

  const placeholderContent = image ? null : (
    <div className="w-full h-full bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center">
      <svg className="w-16 h-16 text-primary/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    </div>
  );

  return (
    <div
      className={`project-card relative group overflow-hidden ${heightClass} ${
        featured ? '' : 'border-b border-primary/20 dark:border-white/20'
      }`}
    >
      {image ? (
        <div
          className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
          style={{ backgroundImage: `url(${image})` }}
          role="img"
          aria-label={title}
        />
      ) : (
        placeholderContent
      )}

      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/40 transition-colors duration-300"></div>

      {featured ? (
        // Featured project overlay
        <div className="absolute bottom-8 left-8 right-8 md:bottom-12 md:left-12 md:right-12 z-20 text-white text-center transition-opacity duration-300">
          <span className="inline-block px-3 py-1 border border-white/30 text-white text-[10px] uppercase tracking-[0.2em] backdrop-blur-md mb-4 bg-black/20">
            Featured Project
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold uppercase mb-4 leading-none tracking-tight font-heading">
            {title}
          </h2>
          <p className="text-sm opacity-90">{category} • {year}</p>
        </div>
      ) : (
        // Standard project overlay
        <div className="absolute bottom-3 left-3 right-3 md:bottom-4 md:left-4 md:right-4 z-20 transition-transform duration-300 group-hover:translate-y-[-2px]">
          <div className="bg-primary/95 dark:bg-primary/90 backdrop-blur-sm p-3 md:p-4 text-background dark:text-white shadow-lg">
            <span className="text-[10px] uppercase tracking-widest block mb-1 text-accent">
              {category}
            </span>
            <h3 className="text-base md:text-lg font-bold uppercase leading-tight font-heading">{title}</h3>
            <p className="text-xs opacity-90 mt-1">{year}</p>
          </div>
        </div>
      )}
    </div>
  );
}
