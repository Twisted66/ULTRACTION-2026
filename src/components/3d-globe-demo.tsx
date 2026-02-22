"use client";
import { Globe3D } from "@/components/ui/3d-globe";
import type { GlobeMarker } from "@/components/ui/3d-globe";

const sampleMarkers: GlobeMarker[] = [
  {
    lat: 24.3713,
    lng: 54.5205,
    src: "/UGC-PNG.png",
    label: "Abu Dhabi, UAE - Headquarters",
  },
  {
    lat: 24.7136,
    lng: 46.6753,
    src: "/UGC-PNG.png",
    label: "Riyadh, KSA - Branch Office",
  },
];

interface Globe3DDemoProps {
  className?: string;
}

export default function Globe3DDemo({ className }: Globe3DDemoProps) {
  return (
    <Globe3D
      className={className}
      markers={sampleMarkers}
      config={{
        radius: 3.2,
        atmosphereColor: "#4da6ff",
        atmosphereIntensity: 20,
        bumpScale: 5,
        autoRotateSpeed: 0.3,
      }}
      onMarkerClick={(marker) => {
        console.log("Clicked marker:", marker.label);
      }}
      onMarkerHover={(marker) => {
        if (marker) {
          console.log("Hovering:", marker.label);
        }
      }}
    />
  );
}
