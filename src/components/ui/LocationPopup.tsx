"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Phone, Mail, Globe as GlobeIcon, Navigation } from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

export interface LocationData {
  name: string;
  title?: string;
  company?: string;
  address?: string;
  phone?: string;
  mobile?: string;
  email?: string;
  website?: string;
  lat: number;
  lng: number;
}

interface LocationPopupProps {
  location: LocationData | null;
  onClose: () => void;
  isOpen: boolean;
  className?: string;
}

// ============================================================================
// Helper Functions
// ============================================================================

function getGoogleMapsUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps?q=${lat},${lng}`;
}

function getGoogleMapsEmbedUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d50000!2d${lng}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM!5e0!3m2!1sen!2sae!4v1`;
}

// ============================================================================
// Components
// ============================================================================

function ContactItem({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <div className="flex items-start gap-3 p-3 rounded-sm bg-black/5 hover:bg-black/10 transition-colors motion-base">
      <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: "hsl(var(--color-accent))" }} />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-black/60 uppercase tracking-wide">{label}</p>
        <p className="text-sm font-medium text-black break-words">{value}</p>
      </div>
    </div>
  );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="block hover:scale-[1.02] transition-transform motion-base">
        {content}
      </a>
    );
  }

  return content;
}

// ============================================================================
// Main LocationPopup Component
// ============================================================================

export function LocationPopup({ location, onClose, isOpen, className }: LocationPopupProps) {
  // Close on escape key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!location) return null;

  const mapUrl = getGoogleMapsUrl(location.lat, location.lng);
  const embedUrl = getGoogleMapsEmbedUrl(location.lat, location.lng);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Popup */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{
                duration: 0.3,
                ease: [0.16, 1, 0.3, 1],
              }}
              className={cn(
                "pointer-events-auto w-full max-w-lg bg-[hsl(var(--color-surface))] shadow-2xl border border-black/10",
                className
              )}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-black/10">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-sm flex items-center justify-center"
                    style={{ backgroundColor: "hsl(var(--color-accent))" }}
                  >
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold font-heading text-black">
                      {location.name}
                    </h2>
                    {(location.title || location.company) && (
                      <p className="text-xs text-black/60 font-medium">
                        {[location.title, location.company].filter(Boolean).join(" • ")}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-sm hover:bg-black/10 transition-colors motion-fast"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                {/* Address */}
                {location.address && (
                  <ContactItem
                    icon={MapPin}
                    label="Address"
                    value={location.address}
                    href={mapUrl}
                  />
                )}

                {/* Phone */}
                {location.phone && (
                  <ContactItem
                    icon={Phone}
                    label="Phone"
                    value={location.phone}
                    href={`tel:${location.phone}`}
                  />
                )}

                {/* Mobile */}
                {location.mobile && (
                  <ContactItem
                    icon={Phone}
                    label="Mobile"
                    value={location.mobile}
                    href={`tel:${location.mobile}`}
                  />
                )}

                {/* Email */}
                {location.email && (
                  <ContactItem
                    icon={Mail}
                    label="Email"
                    value={location.email}
                    href={`mailto:${location.email}`}
                  />
                )}

                {/* Website */}
                {location.website && (
                  <ContactItem
                    icon={GlobeIcon}
                    label="Website"
                    value={location.website}
                    href={location.website.startsWith("http") ? location.website : `https://${location.website}`}
                  />
                )}

                {/* Google Maps Embed */}
                <div className="mt-4 rounded-sm overflow-hidden border border-black/10 h-48">
                  <iframe
                    src={embedUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={`Map of ${location.name}`}
                  />
                </div>
              </div>

              {/* Footer - Get Directions Button */}
              <div className="p-6 border-t border-black/10 bg-black/5">
                <a
                  href={mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-sm font-medium text-white transition-all motion-base hover:opacity-90 active:scale-[0.98]"
                  style={{ backgroundColor: "hsl(var(--color-accent))" }}
                >
                  <Navigation className="w-5 h-5" />
                  Get Directions
                </a>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

export default LocationPopup;
