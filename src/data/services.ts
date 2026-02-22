
export interface Service {
    id: string;
    title: string;
    description: string;
    image: string;
    icon?: string; // Optional icon for other views
    link: string;
    subservices?: string[]; // List of sub-services/bullets
}

export const services: Service[] = [
    {
        id: "infrastructure",
        title: "Bridges, Underpasses and Box Culverts",
        description: "End-to-end services from planning to construction to handover. Focus on safety, aesthetics, and functionality. Enhancing resilient transportation and water management systems.",
        image: "/images/projects/naseem-albar-bridge/photo_019.jpeg",
        link: "/services#infrastructure",
        subservices: [
            "Bridge Construction",
            "Underpasses",
            "Box Culverts"
        ]
    },
    {
        id: "industrial-commercial-residential",
        title: "Industrial, Commercial and Residential Buildings",
        description: "Constructing industrial, commercial, residential buildings, and palaces. Tailored services from planning to execution. Opulent palaces that epitomize grandeur and timeless elegance.",
        image: "/images/projects/dubai-marina-tower/hero.png",
        link: "/services#commercial",
        subservices: [
            "Industrial Facilities",
            "Commercial Buildings",
            "Residential Complexes",
            "Palace Construction"
        ]
    },
    {
        id: "water-reservoir",
        title: "Water Reservoir and Pump Stations",
        description: "End-to-end services from design to maintenance. Efficient water management solutions. Sustainable and reliable water supply projects.",
        image: "/images/projects/water-reservoir-retaining-walls-yas-island/hero.png",
        link: "/services#water-reservoir",
        subservices: [
            "Water Reservoirs",
            "Pump Stations",
            "Maintenance Services"
        ]
    },
    {
        id: "power-plants",
        title: "Power Plants & Distribution Substation (Civil Works)",
        description: "Complete services from planning to maintenance. Focus on precision and safety. Vital utility infrastructure supporting power distribution across the region.",
        image: "/images/projects/distribution-substation-aqah/hero.png",
        link: "/services#power-plants",
        subservices: [
            "Power Plant Civil Works",
            "Distribution Substations",
            "Control Buildings",
            "Maintenance Services"
        ]
    },
    {
        id: "seaports-airports",
        title: "Civil Works for Seaports and Airports",
        description: "End-to-end services for critical infrastructure. International standards compliance. Maritime and aviation transportation hubs connecting the region to the world.",
        image: "/images/projects/khalifa-port/hero.png",
        link: "/services#seaports-airports",
        subservices: [
            "Seaport Infrastructure",
            "Airport Civil Works",
            "Marine Structures"
        ]
    },
    {
        id: "oil-gas",
        title: "Onshore and Offshore Civil Works (Oil and Gas)",
        description: "Planning, design, and execution of essential infrastructure. Safety, durability, and environmental compliance. Stringent industry standards for oil and gas operations.",
        image: "/images/projects/marine-staging-yassat-island/hero.png",
        link: "/services#oil-gas",
        subservices: [
            "Onshore Facilities",
            "Offshore Structures",
            "Process Plant Civil Works",
            "Pipeline Infrastructure"
        ]
    },
    {
        id: "heritage",
        title: "Heritage Revitalization Project",
        description: "Preserving and restoring historical and cultural landmarks. Advanced restoration techniques. Integrating modern amenities while honoring authenticity.",
        image: "/images/projects/qidfah-revitalization/hero.png",
        link: "/services#heritage",
        subservices: [
            "Preservation",
            "Integration"
        ]
    },
    {
        id: "pipeline-storm",
        title: "Pipeline and Storm Network",
        description: "Efficient transportation of substances and storm water management. Industry standards and environmental considerations. Sustainable urban and industrial environments.",
        image: "/images/projects/inner-bypass-e45/photo_018.jpeg",
        link: "/services#pipeline-storm",
        subservices: [
            "Pipeline Networks",
            "Storm Water Systems",
            "Drainage Infrastructure",
            "Environmental Compliance"
        ]
    },
    {
        id: "road-works",
        title: "Road Works and Earthworks",
        description: "Comprehensive road construction and earthworks services. From site preparation to final paving. Delivering durable transportation infrastructure.",
        image: "/images/projects/al-tallah-bridge/photo_013.jpeg",
        link: "/services#road-works",
        subservices: [
            "Road Construction",
            "Earthworks",
            "Site Preparation"
        ]
    },
    {
        id: "utilities",
        title: "Utilities",
        description: "Complete utility infrastructure services including water distribution networks, drainage systems, power supply infrastructure, and communication lines. Supporting modern urban development.",
        image: "/images/projects/utility-bridge/hero.png",
        link: "/services#utilities",
        subservices: [
            "Water Distribution",
            "Drainage Systems",
            "Power Infrastructure",
            "Communication Lines"
        ]
    }
];
