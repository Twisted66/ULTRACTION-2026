
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useMotionValue, animate, AnimatePresence } from 'framer-motion';
import type { PanInfo } from 'framer-motion';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import type { Service } from '../../data/services';

interface Props {
  services: Service[];
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const ServicesCarousel: React.FC<Props> = ({ services }) => {
  const viewportRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);

  const [activeIndex, setActiveIndex] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const cardsPerView = useMemo(() => {
    if (viewportWidth >= 1280) {
      return 3;
    }

    if (viewportWidth >= 768) {
      return 2;
    }

    return 1;
  }, [viewportWidth]);

  const stepWidth = useMemo(() => (viewportWidth > 0 ? viewportWidth / cardsPerView : 0), [viewportWidth, cardsPerView]);
  const maxIndex = useMemo(() => Math.max(services.length - cardsPerView, 0), [services.length, cardsPerView]);

  useEffect(() => {
    if (!viewportRef.current) {
      return;
    }

    const updateWidth = () => {
      const width = viewportRef.current?.offsetWidth ?? 0;
      setViewportWidth(width);
    };

    updateWidth();
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', updateWidth);
      return () => window.removeEventListener('resize', updateWidth);
    }

    const observer = new ResizeObserver(updateWidth);
    observer.observe(viewportRef.current);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setActiveIndex((prev) => clamp(prev, 0, maxIndex));
  }, [maxIndex]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const applyMotionPreference = () => {
      setPrefersReducedMotion(mediaQuery.matches);
    };

    applyMotionPreference();
    mediaQuery.addEventListener('change', applyMotionPreference);
    return () => mediaQuery.removeEventListener('change', applyMotionPreference);
  }, []);

  useEffect(() => {
    if (stepWidth <= 0) {
      return;
    }

    const targetX = -(activeIndex * stepWidth);
    const controls = animate(x, targetX, {
      type: 'spring',
      stiffness: 220,
      damping: 28,
      mass: 0.9,
    });

    return () => controls.stop();
  }, [activeIndex, stepWidth, x]);

  useEffect(() => {
    if (isPaused || isDragging || maxIndex <= 0 || prefersReducedMotion) {
      return;
    }

    const autoplay = window.setInterval(() => {
      setActiveIndex((current) => (current >= maxIndex ? 0 : current + 1));
    }, 4200);

    return () => window.clearInterval(autoplay);
  }, [isPaused, isDragging, maxIndex, prefersReducedMotion]);

  const goToPrevious = () => {
    setActiveIndex((current) => (current <= 0 ? maxIndex : current - 1));
  };

  const goToNext = () => {
    setActiveIndex((current) => (current >= maxIndex ? 0 : current + 1));
  };

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false);

    if (stepWidth <= 0) {
      return;
    }

    const dragThreshold = stepWidth * 0.18;
    if (info.offset.x <= -dragThreshold) {
      goToNext();
      return;
    }

    if (info.offset.x >= dragThreshold) {
      goToPrevious();
      return;
    }

    const projectedIndex = Math.round(-x.get() / stepWidth);
    setActiveIndex(clamp(projectedIndex, 0, maxIndex));
  };

  if (!services.length) {
    return null;
  }

  const activeService = services[activeIndex] ?? services[0];

  return (
    <div className="w-full bg-surface border-b border-black">
      <div className="flex flex-col lg:flex-row justify-between gap-10 lg:gap-8 px-8 lg:px-16 py-16 lg:py-20 border-b border-black">
        <div className="max-w-4xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-16 h-[2px] bg-accent"></div>
            <span className="text-xs font-bold uppercase tracking-[0.35em] text-accent">Our Expertise</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold uppercase font-heading leading-tight mb-8">
            Comprehensive
            <br />
            Solutions
          </h2>
          <a
            href="/services"
            className="inline-flex items-center gap-3 px-6 py-3 border border-black text-xs sm:text-sm uppercase tracking-[0.2em] font-semibold hover:bg-primary hover:text-white transition-colors motion-base"
          >
            <span>Explore All Services</span>
            <ArrowUpRight size={16} />
          </a>
        </div>

        <div className="flex items-end justify-between lg:justify-end gap-4 lg:gap-6">
          <div className="hidden md:flex items-center gap-2 text-sm uppercase tracking-widest opacity-60">
            <ArrowLeft size={16} />
            <span>Drag to Explore</span>
            <ArrowRight size={16} />
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={goToPrevious}
              className="w-10 h-10 border border-black flex items-center justify-center hover:bg-primary hover:text-white transition-colors motion-base"
              aria-label="Previous services"
            >
              <ArrowLeft size={16} />
            </button>
            <button
              type="button"
              onClick={goToNext}
              className="w-10 h-10 border border-black flex items-center justify-center hover:bg-primary hover:text-white transition-colors motion-base"
              aria-label="Next services"
            >
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden border-b border-black h-[230px] md:h-[280px] lg:h-[340px] bg-black">
        <AnimatePresence mode="wait" initial={false}>
          <motion.img
            key={activeService.id}
            src={activeService.image}
            alt={activeService.title}
            className="absolute inset-0 w-full h-full object-cover"
            initial={prefersReducedMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={prefersReducedMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.02 }}
            transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.55, ease: 'easeOut' }}
            loading="eager"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/20" />
        <div className="absolute bottom-0 left-0 p-8 md:p-10 text-white">
          <p className="text-[10px] md:text-xs uppercase tracking-[0.3em] opacity-80 mb-2">
            {String(activeIndex + 1).padStart(2, '0')} / {String(services.length).padStart(2, '0')}
          </p>
          <h3 className="text-xl md:text-3xl font-heading uppercase max-w-3xl">{activeService.title}</h3>
        </div>
      </div>

      <div
        ref={viewportRef}
        className="overflow-hidden cursor-grab active:cursor-grabbing"
        style={{ touchAction: 'pan-y' }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onFocusCapture={() => setIsPaused(true)}
        onBlurCapture={() => setIsPaused(false)}
      >
        <motion.div
          className="flex"
          drag="x"
          dragConstraints={{
            right: 0,
            left: -(maxIndex * stepWidth),
          }}
          dragElastic={0.06}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={handleDragEnd}
          style={{ x }}
        >
          {services.map((service, index) => (
            <article key={service.id} className="basis-full md:basis-1/2 xl:basis-1/3 shrink-0 border-r border-black flex flex-col group">
              <div className="aspect-[4/3] overflow-hidden relative border-b border-black">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/55"></div>
                <div className="absolute top-5 right-6 md:top-6 md:right-8">
                  <span className="font-heading text-3xl md:text-4xl italic text-white">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
              </div>

              <div className="p-7 md:p-8 flex-1 flex flex-col justify-between min-h-[240px] md:min-h-[260px] bg-surface group-hover:bg-white transition-colors duration-300">
                <div>
                  <h3 className="text-lg md:text-xl font-heading mb-5 group-hover:text-accent transition-colors text-black uppercase leading-tight">
                    {service.title}
                  </h3>
                  <p className="text-sm leading-relaxed mb-7 text-black/80 line-clamp-4">{service.description}</p>

                  {!!service.subservices?.length && (
                    <div className="grid grid-cols-1 gap-2">
                      {service.subservices.slice(0, 3).map((sub, subIndex) => (
                        <div key={`${service.id}-${subIndex}`} className="flex items-center gap-3 text-xs uppercase tracking-widest text-black/70">
                          <span className="w-4 h-[1px] bg-accent"></span>
                          {sub}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <a
                  href={service.link}
                  className="mt-8 pt-6 border-t border-black/15 flex justify-between items-center text-black group/link"
                >
                  <span className="text-xs uppercase tracking-widest font-semibold opacity-75 group-hover:opacity-100 transition-opacity">
                    View Service
                  </span>
                  <div className="w-8 h-8 rounded-full border border-black/30 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all motion-base">
                    <ArrowUpRight size={14} />
                  </div>
                </a>
              </div>
            </article>
          ))}
        </motion.div>
      </div>

      <div className="md:hidden py-5 flex justify-center border-t border-black">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest opacity-60">
          <ArrowLeft size={14} />
          <span>Swipe</span>
          <ArrowRight size={14} />
        </div>
      </div>
    </div>
  );
};

export default ServicesCarousel;
