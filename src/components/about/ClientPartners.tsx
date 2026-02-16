import React from 'react';
import { motion } from 'framer-motion';
import arabland from '../../assets/clients/arabland.jpg';
import falaroad from '../../assets/clients/falaroad.jpg';
import gcl from '../../assets/clients/gcl.jpg';
import it from '../../assets/clients/it.png';
import lindberg from '../../assets/clients/lindberg.png';
import nbhh from '../../assets/clients/nbhh.jpg';
import nmdcAe from '../../assets/clients/NMDC.AE.png';
import npc from '../../assets/clients/npc.png';
import petrofac from '../../assets/clients/petrofac.svg';
import pivot from '../../assets/clients/pivot.jpg';
import powerchina from '../../assets/clients/powerchina.jpeg';
import powercon from '../../assets/clients/powercon.png';
import sobha from '../../assets/clients/sobha.jpg';
import trojan from '../../assets/clients/trojan.jpeg';
import ue from '../../assets/clients/ue.jpg';

interface ClientPartnersProps {
  stats?: {
    years: number;
    projects: number;
    partners: number;
  };
}

const clientLogos = [
  { src: arabland, name: 'Arab Land Contracting LLC' },
  { src: falaroad, name: 'FARAROAD' },
  { src: gcl, name: 'Gulf Contracting and Landscape GCL' },
  { src: it, name: 'Larsen and Toubro LT' },
  { src: lindberg, name: 'Lindberg Emirates' },
  { src: nbhh, name: 'NBHH' },
  { src: nmdcAe, name: 'NMDC National Marine Dredging Company' },
  { src: npc, name: 'NPC' },
  { src: petrofac, name: 'Petrofac' },
  { src: pivot, name: 'Pivot Engineering and General Contracting' },
  { src: powerchina, name: 'PowerChina' },
  { src: powercon, name: 'Powercon' },
  { src: sobha, name: 'SOBHA Limited' },
  { src: trojan, name: 'Trojan' },
  { src: ue, name: 'United Engineering UE' },
];

const ClientPartners: React.FC<ClientPartnersProps> = ({
  stats = { years: 15, projects: 500, partners: 100 }
}) => {
  return (
    <section className="relative bg-surface text-primary overflow-hidden border-y border-primary/20">
      <style>{`
        .client-logo-track {
          animation: clientLogoScrollLeft 40s linear infinite;
        }

        .client-logo-container:hover .client-logo-track {
          animation-play-state: paused;
        }

        @keyframes clientLogoScrollLeft {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .client-logo-track {
            animation: none;
            transform: none;
          }
        }
      `}</style>
      {/* Background pattern */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(to right, currentColor 1px, transparent 1px),
              linear-gradient(to bottom, currentColor 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}
        ></div>

        {/* Animated gradient accent */}
        <motion.div
          className="absolute top-0 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        ></motion.div>
      </div>

      <div className="relative px-6 md:px-12 lg:px-24 pt-20 md:pt-28 pb-16 md:pb-20">
        {/* Header Section */}
        <div className="grid grid-cols-12 gap-4 mb-16 md:mb-20">
          <div className="col-span-12 lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-[2px] bg-accent"></div>
                <span className="text-xs font-bold uppercase tracking-[0.3em] text-accent">
                  Our Network
                </span>
              </div>

              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-heading leading-[0.9] tracking-tight mb-6">
                Trusted By
                <br />
                <span className="italic font-light text-primary/50 scale-y-75 inline-block">
                  Industry Leaders
                </span>
              </h2>

              <p className="text-base md:text-lg text-primary/60 max-w-2xl leading-relaxed">
                We deliver projects in partnership with leading organizations across infrastructure,
                utilities, and construction sectors throughout the UAE and beyond.
              </p>
            </motion.div>
          </div>

          {/* Stats Grid */}
          <div className="col-span-12 lg:col-span-4 lg:col-start-9 grid grid-cols-3 lg:grid-cols-1 gap-6 lg:gap-8 mt-8 lg:mt-0">
            {[
              { value: `${stats.years}+`, label: 'Years Experience' },
              { value: `${stats.projects}+`, label: 'Projects Delivered' },
              { value: `${stats.partners}+`, label: 'Trusted Partners' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                className="border-l-2 border-accent pl-4 lg:pl-6"
              >
                <div className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading text-primary mb-1">
                  {stat.value}
                </div>
                <div className="text-xs uppercase tracking-widest text-primary/50">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Logo Loop */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mb-12 client-logo-container"
        >
          <div className="relative w-full overflow-hidden bg-transparent">
            <div className="client-logo-track flex gap-10 md:gap-14 w-max py-7 px-6">
              {clientLogos.map((logo) => (
                <div key={logo.name} className="flex items-center justify-center w-32 md:w-40 h-20 md:h-24 opacity-80 hover:opacity-100 transition-opacity duration-300">
                  <img src={logo.src.src} alt={logo.name} className="max-w-full max-h-full object-contain" loading="lazy" />
                </div>
              ))}
              {clientLogos.map((logo) => (
                <div key={`${logo.name}-dup`} className="flex items-center justify-center w-32 md:w-40 h-20 md:h-24 opacity-80 hover:opacity-100 transition-opacity duration-300" aria-hidden="true">
                  <img src={logo.src.src} alt={logo.name} className="max-w-full max-h-full object-contain" loading="lazy" />
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pt-12 border-t border-primary/10"
        >
          <div className="max-w-xl">
            <h3 className="text-xl md:text-2xl font-bold uppercase tracking-tight mb-2">
              Join Our Partner Network
            </h3>
            <p className="text-sm md:text-base text-primary/60 leading-relaxed">
              Discover how we can collaborate to deliver exceptional construction projects.
            </p>
          </div>

          <a
            href="/contact"
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-primary text-white overflow-hidden transition-all duration-300 hover:bg-accent hover:shadow-xl hover:shadow-accent/20"
          >
            <span className="relative z-10 text-xs font-bold uppercase tracking-[0.2em]">
              Partner With Us
            </span>
            <svg
              className="relative z-10 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M14 5l7 7m0 0l-7 7m7-7H3"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
          </a>
        </motion.div>
      </div>

      {/* Bottom decorative line */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent"></div>
    </section>
  );
};

export default ClientPartners;
