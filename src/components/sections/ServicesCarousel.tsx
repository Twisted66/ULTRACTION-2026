
import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import type { Service } from '../../data/services';

interface Props {
    services: Service[];
}

const ServicesCarousel: React.FC<Props> = ({ services }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState(0);
    const x = useMotionValue(0);

    useEffect(() => {
        if (containerRef.current) {
            setWidth(containerRef.current.scrollWidth - containerRef.current.offsetWidth);
        }
    }, [services]);

    const handleDragEnd = () => {
        const currentX = x.get();
        if (currentX > 0) {
            animate(x, 0, { type: "spring", stiffness: 300, damping: 30 });
        } else if (currentX < -width) {
            animate(x, -width, { type: "spring", stiffness: 300, damping: 30 });
        }
    };

    return (
        <div className="w-full bg-surface border-b border-black">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end px-8 lg:px-16 py-20 border-b border-black">
                <div>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-16 h-[2px] bg-accent"></div>
                        <span className="text-xs font-bold uppercase tracking-[0.35em] text-accent">Our Expertise</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold uppercase font-heading leading-tight">
                        Comprehensive<br />Solutions
                    </h2>
                </div>

                <div className="hidden md:flex gap-4">
                    {/* Navigation buttons could go here if needed, but drag is primary */}
                    <div className="flex items-center gap-2 text-sm uppercase tracking-widest opacity-60">
                        <ArrowLeft size={16} />
                        <span>Drag to Explore</span>
                        <ArrowRight size={16} />
                    </div>
                </div>
            </div>

            {/* Carousel Container */}
            <div className="overflow-hidden cursor-grab active:cursor-grabbing" ref={containerRef}>
                <motion.div
                    className="flex"
                    drag="x"
                    dragConstraints={{ right: 0, left: -width }}
                    onDragEnd={handleDragEnd}
                    style={{ x }}
                >
                    {services.map((service, index) => (
                        <motion.div
                            key={service.id}
                            className={`
                min-w-[85vw] md:min-w-[45vw] lg:min-w-[25vw] 
                border-r border-black 
                flex flex-col 
                group hover:bg-white dark:hover:bg-white/5 
                transition-colors duration-300
              `}
                        >
                            {/* Image Container */}
                            <div className="aspect-[4/3] overflow-hidden relative border-b border-black">
                                <img
                                    src={service.image}
                                    alt={service.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    loading="lazy"
                                />
                                <div className="absolute top-0 right-0 p-6 md:p-8">
                                    <span className="font-heading text-4xl md:text-5xl italic text-white group-hover:text-accent transition-colors">
                                        {String(index + 1).padStart(2, '0')}
                                    </span>
                                </div>
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300"></div>
                            </div>

                            {/* Content Container */}
                            <div className="p-8 flex-1 flex flex-col justify-between min-h-[300px]">
                                <div>
                                    <h3 className="text-xl md:text-2xl font-heading mb-6 group-hover:text-accent transition-colors text-black uppercase">
                                        {service.title}
                                    </h3>
                                    <p className="text-sm font-light leading-loose mb-8 text-black/80 line-clamp-4">
                                        {service.description}
                                    </p>

                                    {service.subservices && (
                                        <div className="grid grid-cols-1 gap-2">
                                            {service.subservices.slice(0, 3).map((sub, i) => (
                                                <div key={i} className="flex items-center gap-3 text-xs uppercase tracking-widest text-black/70">
                                                    <span className="w-4 h-[1px] bg-accent"></span>
                                                    {sub}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <a
                                    href={service.link}
                                    className="mt-8 pt-8 border-t border-black/10 flex justify-between items-center opacity-60 group-hover:opacity-100 transition-opacity text-black group"
                                >
                                    <span className="text-xs uppercase tracking-widest font-medium">View Project</span>
                                    <div className="w-8 h-8 rounded-full border border-black/20 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                                        <ArrowUpRight size={14} />
                                    </div>
                                </a>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            {/* Mobile Indicator */}
            <div className="md:hidden py-6 flex justify-center border-t border-black">
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
