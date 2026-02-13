// Complete Project to Image Mapping for ULTRACTION Website
// Maps all 28 ULTRACTION projects to categories, images, and metadata
// Based on actual PHOTOS folder analysis from assets/PROJECT/

/**
 * Project Categories:
 * - Infrastructure: Bridges, tunnels, roads, rail
 * - Residential: Villas, residential towers
 * - Commercial: Ports, warehouses, commercial buildings
 * - Industrial: Oil & gas, substations, water reservoirs
 * - Marine: Marine staging, offshore projects
 */

const projectMapping = [
  // ============================================
  // INFRASTRUCTURE PROJECTS (12 projects)
  // ============================================

  {
    id: 'p002',
    title: 'Baniyas North Infrastructure',
    category: 'infrastructure',
    location: 'Abu Dhabi, UAE',
    completed: '2023',
    sourceFolder: 'BANIYAS NORTH INFRASTRUCTURE',
    images: ['p196_img01_xref7281.jpeg', 'p196_img02_xref7282.jpeg'],
    imageCount: 2,
    orientation: 'vertical',
    recommendedHeight: 'tall'
  },
  {
    id: 'p003',
    title: 'Construction of Naseem Albar Bridge',
    category: 'infrastructure',
    location: 'Abu Dhabi, UAE',
    completed: '2022',
    sourceFolder: 'CONSTRUCTION OF NASEEM ALBAR BRIDGE',
    images: [
      'p154_img01_xref6959.jpeg', 'p154_img02_xref6958.jpeg',
      'p155_img01_xref6965.jpeg', 'p155_img02_xref6966.jpeg',
      'p156_img01_xref6973.jpeg', 'p156_img02_xref6972.jpeg',
      'p157_img01_xref6979.jpeg', 'p157_img02_xref6980.jpeg',
      'p158_img01_xref6986.jpeg', 'p158_img02_xref6987.jpeg',
      'p159_img01_xref6994.jpeg', 'p159_img02_xref6993.jpeg',
      'p160_img01_xref7000.jpeg',
      'p161_img01_xref7006.jpeg', 'p161_img02_xref7007.jpeg', 'p161_img03_xref7008.jpeg', 'p161_img04_xref7009.jpeg',
      'p162_img01_xref7015.jpeg', 'p162_img02_xref7016.jpeg',
      'p163_img01_xref7022.jpeg'
    ],
    imageCount: 20,
    orientation: 'horizontal',
    recommendedHeight: 'med',
    featured: true
  },
  {
    id: 'p004',
    title: 'Construction of Utility Bridge',
    category: 'infrastructure',
    location: 'Abu Dhabi, UAE',
    completed: '2022',
    sourceFolder: 'CONSTRUCTION OF UTILITY BRIDGE',
    images: [
      'p084_img01_xref6514.jpeg', 'p084_img02_xref6513.jpeg',
      'p165_img01_xref7034.jpeg', 'p165_img02_xref7035.jpeg',
      'p166_img01_xref7041.jpeg', 'p166_img02_xref7042.jpeg',
      'p167_img01_xref7048.jpeg',
      'p168_img01_xref7054.jpeg', 'p168_img02_xref7055.jpeg',
      'p169_img01_xref7061.jpeg',
      'p170_img01_xref7064.jpeg',
      'p171_img01_xref7070.jpeg', 'p171_img02_xref7071.jpeg',
      'p172_img01_xref7077.jpeg', 'p172_img02_xref7078.jpeg'
    ],
    imageCount: 14,
    orientation: 'horizontal',
    recommendedHeight: 'med'
  },
  {
    id: 'p006',
    title: 'Development of 3 Bridges Al Talah Road',
    category: 'infrastructure',
    location: 'Dubai, UAE',
    completed: '2023',
    sourceFolder: 'DEVELOPMENT OF 3 BRIDGES AL TALAH ROAD',
    images: [
      'p103_img01_xref6639.jpeg', 'p103_img02_xref6640.jpeg',
      'p104_img01_xref6655.jpeg', 'p104_img02_xref6654.jpeg',
      'p105_img01_xref6661.jpeg', 'p105_img02_xref6662.jpeg',
      'p106_img01_xref6668.jpeg',
      'p107_img01_xref6674.jpeg', 'p107_img02_xref6675.jpeg',
      'p108_img01_xref6681.jpeg', 'p108_img02_xref6682.jpeg',
      'p109_img01_xref6689.jpeg', 'p109_img02_xref6888.jpeg',
      'p110_img01_xref6695.jpeg', 'p110_img02_xref6696.jpeg',
      'p111_img01_xref6702.jpeg', 'p111_img02_xref6703.jpeg',
      'p112_img01_xref6710.jpeg', 'p112_img02_xref6709.jpeg',
      'p113_img01_xref6716.jpeg', 'p113_img02_xref6717.jpeg',
      'p114_img01_xref6721.jpeg', 'p114_img02_xref6720.jpeg',
      'p115_img01_xref6727.jpeg'
    ],
    imageCount: 23,
    orientation: 'horizontal',
    recommendedHeight: 'med',
    featured: true
  },
  {
    id: 'p008',
    title: 'Etihad Rail 2D Package Culverts',
    category: 'infrastructure',
    location: 'Fujairah, UAE',
    completed: '2022',
    sourceFolder: 'ETIHAD RAIL 2D PACKAGE CULVERTS',
    images: [
      'p179_img01_xref7134.jpeg', 'p179_img02_xref7133.jpeg', 'p179_img03_xref7132.jpeg',
      'p180_img01_xref7141.jpeg', 'p180_img02_xref7140.jpeg', 'p180_img03_xref7142.jpeg'
    ],
    imageCount: 6,
    orientation: 'horizontal',
    recommendedHeight: 'med',
    featured: true
  },
  {
    id: 'p010',
    title: 'Etihad Rail 2F2 Package ADP Project',
    category: 'infrastructure',
    location: 'Abu Dhabi, UAE',
    completed: '2023',
    sourceFolder: 'ETIHAD RAIL 2F2 PACKAGE ADP PROJECT',
    images: [
      'p127_img01_xref6789.jpeg', 'p127_img02_xref6790.jpeg',
      'p128_img01_xref6796.jpeg', 'p128_img02_xref6797.jpeg',
      'p129_img01_xref6803.jpeg', 'p129_img02_xref6804.jpeg',
      'p130_img01_xref6810.jpeg', 'p130_img02_xref6811.jpeg',
      'p131_img01_xref6817.jpeg', 'p131_img02_xref6818.jpeg',
      'p132_img01_xref6824.jpeg', 'p132_img02_xref6825.jpeg'
    ],
    imageCount: 12,
    orientation: 'horizontal',
    recommendedHeight: 'med'
  },
  {
    id: 'p016',
    title: 'Opera Tunnel & Forte Tunnel Downtown Dubai',
    category: 'infrastructure',
    location: 'Dubai, UAE',
    completed: '2022',
    sourceFolder: 'OPERA TUNNEL & FORTE TUNNEL DOWNTOWN DUBAI',
    images: ['p096_img01_xref6595.jpeg', 'p096_img02_xref6596.jpeg'],
    imageCount: 2,
    orientation: 'square',
    recommendedHeight: 'tall',
    featured: true
  },
  {
    id: 'p017',
    title: 'Over-Bridge Package 44 MBR Dubai Hills Estate',
    category: 'infrastructure',
    location: 'Dubai, UAE',
    completed: '2023',
    sourceFolder: 'OVER-BRIDGE PACKAGE 44 MBR DUBAI HILLS ESTATE',
    images: [
      'p097_img01_xref6601.jpeg', 'p097_img02_xref6602.jpeg',
      'p098_img01_xref6609.jpeg', 'p098_img02_xref6608.jpeg',
      'p099_img01_xref6615.jpeg', 'p099_img02_xref6616.jpeg'
    ],
    imageCount: 6,
    orientation: 'horizontal',
    recommendedHeight: 'med'
  },
  {
    id: 'p022',
    title: 'Traffic Improvement on E20 and Construction of 2 Bridges',
    category: 'infrastructure',
    location: 'Dubai, UAE',
    completed: '2023',
    sourceFolder: 'TRAFFIC IMPROVEMENT ON E20 AND CONSTRUCTION OF 2 BRIDGES',
    images: [
      'p135_img01_xref6839.jpeg', 'p135_img02_xref6840.jpeg',
      'p136_img01_xref6847.jpeg', 'p136_img02_xref6846.jpeg',
      'p137_img01_xref6853.jpeg',
      'p138_img01_xref6859.jpeg',
      'p140_img01_xref6871.jpeg', 'p140_img02_xref6872.jpeg',
      'p141_img01_xref6879.jpeg', 'p141_img02_xref6878.jpeg',
      'p142_img01_xref6886.jpeg', 'p142_img02_xref6885.jpeg',
      'p143_img01_xref6893.jpeg', 'p143_img02_xref6892.jpeg',
      'p144_img01_xref6899.jpeg', 'p144_img02_xref6900.jpeg',
      'p147_img01_xref6919.jpeg', 'p147_img02_xref6920.jpeg',
      'p148_img01_xref6926.jpeg', 'p148_img02_xref6927.jpeg',
      'p154_img01_xref6959.jpeg', 'p154_img02_xref6958.jpeg'
    ],
    imageCount: 22,
    orientation: 'horizontal',
    recommendedHeight: 'med',
    featured: true
  },
  {
    id: 'p023',
    title: 'Upgrading of Inner Bypass Parallel to E-45',
    category: 'infrastructure',
    location: 'Abu Dhabi, UAE',
    completed: '2023',
    sourceFolder: 'UPGRADING OF INNER BYPASS PARALLEL TO E-45',
    images: [
      'p100_img01_xref6622.jpeg', 'p100_img02_xref6623.jpeg',
      'p101_img01_xref6629.jpeg', 'p101_img02_xref6630.jpeg',
      'p174_img01_xref7094.jpeg', 'p174_img02_xref7091.jpeg', 'p174_img03_xref7093.jpeg',
      'p174_img04_xref7088.jpeg', 'p174_img05_xref7089.jpeg', 'p174_img06_xref7090.jpeg',
      'p176_img01_xref7105.jpeg', 'p176_img02_xref7107.jpeg', 'p176_img03_xref7109.jpeg',
      'p176_img04_xref7108.jpeg', 'p176_img05_xref7106.jpeg',
      'p177_img01_xref7118.jpeg', 'p177_img02_xref7120.jpeg', 'p177_img03_xref7115.jpeg',
      'p177_img04_xref7116.jpeg', 'p177_img05_xref7117.jpeg', 'p177_img06_xref7121.jpeg',
      'p187_img01_xref7199.jpeg', 'p187_img02_xref7200.jpeg',
      'p188_img01_xref7206.jpeg', 'p188_img02_xref7207.jpeg',
      'p189_img01_xref7216.jpeg', 'p189_img02_xref7219.jpeg', 'p189_img03_xref7214.jpeg',
      'p189_img04_xref7215.jpeg', 'p189_img05_xref7218.jpeg', 'p189_img06_xref7213.jpeg',
      'p193_img01_xref7253.jpeg', 'p193_img02_xref7254.jpeg', 'p193_img03_xref7256.jpeg',
      'p193_img04_xref7257.jpeg', 'p193_img05_xref7251.jpeg', 'p193_img06_xref7252.jpeg',
      'p194_img01_xref7265.jpeg', 'p194_img02_xref7267.jpeg', 'p194_img03_xref7263.jpeg',
      'p194_img04_xref7264.jpeg', 'p194_img05_xref7266.jpeg', 'p194_img06_xref7262.jpeg',
      'p195_img01_xref7275.jpeg', 'p195_img02_xref7276.jpeg', 'p195_img03_xref7270.jpeg',
      'p195_img04_xref7271.jpeg', 'p195_img05_xref7272.jpeg', 'p195_img06_xref7273.jpeg'
    ],
    imageCount: 54,
    orientation: 'mixed',
    recommendedHeight: 'med',
    featured: true
  },
  {
    id: 'p024',
    title: 'Vehicle Tunnel & Huge Walls Yas Acres',
    category: 'infrastructure',
    location: 'Abu Dhabi, UAE',
    completed: '2023',
    sourceFolder: 'VEHICLE TUNNEL & HUGE WALLS YAS ACRES - ABU DHABI',
    images: [
      'p082_img01_xref6357.jpeg', 'p082_img02_xref6358.jpeg',
      'p083_img01_xref6507.jpeg', 'p083_img02_xref6506.jpeg',
      'p175_img01_xref7099.jpeg'
    ],
    imageCount: 5,
    orientation: 'horizontal',
    recommendedHeight: 'med'
  },
  {
    id: 'p027',
    title: 'Retaining Walls',
    category: 'infrastructure',
    location: 'Abu Dhabi, UAE',
    completed: '2022',
    sourceFolder: 'RETAINING WALLS',
    images: [
      'p198_img01_xref7297.jpeg', 'p198_img02_xref7298.jpeg',
      'p198_img03_xref7295.jpeg', 'p198_img04_xref7296.jpeg'
    ],
    imageCount: 4,
    orientation: 'square',
    recommendedHeight: 'short'
  },

  // ============================================
  // INDUSTRIAL PROJECTS (7 projects)
  // ============================================

  {
    id: 'p001',
    title: '27 Distribution Substations Sader',
    category: 'industrial',
    location: 'Abu Dhabi, UAE',
    completed: '2022',
    sourceFolder: '27 DISTRIBUTION SUBSTATIONS SADER - ABU DHABI',
    images: [
      'p194_img01_xref7265.jpeg', 'p194_img02_xref7267.jpeg', 'p194_img03_xref7263.jpeg',
      'p194_img04_xref7264.jpeg', 'p194_img05_xref7266.jpeg', 'p194_img06_xref7262.jpeg'
    ],
    imageCount: 6,
    orientation: 'square',
    recommendedHeight: 'short'
  },
  {
    id: 'p007',
    title: 'Distribution Substation Aqah',
    category: 'industrial',
    location: 'Fujairah, UAE',
    completed: '2022',
    sourceFolder: 'DISTRIBUTION SUBSTATION AQAH - FUJAIRAH',
    images: [
      'p087_img01_xref6534.jpeg', 'p087_img02_xref6535.jpeg',
      'p088_img01_xref6541.jpeg', 'p088_img02_xref6542.jpeg'
    ],
    imageCount: 4,
    orientation: 'horizontal',
    recommendedHeight: 'med'
  },
  {
    id: 'p011',
    title: 'Huge Water Reservoir & 29 Substations MBZ City',
    category: 'industrial',
    location: 'Abu Dhabi, UAE',
    completed: '2023',
    sourceFolder: 'HUGE WATER RESERVOIR & 29 SUBSTATIONS MBZ CITY,ABU DHABI',
    images: ['p091_img01_xref6562.jpeg', 'p091_img02_xref6561.jpeg'],
    imageCount: 2,
    orientation: 'horizontal',
    recommendedHeight: 'med',
    featured: true
  },
  {
    id: 'p012',
    title: 'Huge Water Reservoir Riyadh City',
    category: 'industrial',
    location: 'Abu Dhabi, UAE',
    completed: '2023',
    sourceFolder: 'HUGE WATER RESERVOIR RIYADH CITY - ABU DHABI',
    images: [
      'p092_img01_xref6568.jpeg',
      'p139_img01_xref6865.jpeg',
      'p184_img01_xref7175.jpeg'
    ],
    imageCount: 3,
    orientation: 'vertical',
    recommendedHeight: 'tall'
  },
  {
    id: 'p015',
    title: 'Offshore Oil & Gas Field',
    category: 'industrial',
    location: 'Offshore UAE',
    completed: '2022',
    sourceFolder: 'OFFSHORE OIL & GAS FIELD',
    images: ['p095_img01_xref6588.jpeg', 'p095_img02_xref6589.jpeg'],
    imageCount: 2,
    orientation: 'vertical',
    recommendedHeight: 'tall',
    featured: true
  },
  {
    id: 'p018',
    title: 'Pond & Pump Stations Riyadh City',
    category: 'industrial',
    location: 'Abu Dhabi, UAE',
    completed: '2023',
    sourceFolder: 'POND & PUMP STATIONS RIYADH CITY - ABU DHABI',
    images: ['p199_img01_xref7305.jpeg', 'p199_img02_xref7306.jpeg', 'p199_img03_xref7304.jpeg'],
    imageCount: 3,
    orientation: 'horizontal',
    recommendedHeight: 'med'
  },
  {
    id: 'p020',
    title: 'Pump Stations & Retaining Walls',
    category: 'industrial',
    location: 'Abu Dhabi, UAE',
    completed: '2022',
    sourceFolder: 'PUMP STATIONS & RETAINING WALLS',
    images: [
      'p089_img01_xref6548.jpeg',
      'p090_img01_xref6554.jpeg', 'p090_img02_xref6555.jpeg',
      'p093_img01_xref6574.jpeg', 'p093_img02_xref6575.jpeg',
      'p094_img01_xref6582.jpeg', 'p094_img02_xref6581.jpeg'
    ],
    imageCount: 6,
    orientation: 'horizontal',
    recommendedHeight: 'med'
  },
  {
    id: 'p025',
    title: 'Water Reservoir & 6 Power Stations Samha',
    category: 'industrial',
    location: 'Abu Dhabi, UAE',
    completed: '2023',
    sourceFolder: 'WATER RESERVOIR & 6 POWER STATIONS SAMHA - ABU DHABI',
    images: ['p185_img01_xref7181.jpeg'],
    imageCount: 1,
    orientation: 'horizontal',
    recommendedHeight: 'med'
  },
  {
    id: 'p026',
    title: 'Water Reservoir & Retaining Walls Yas Island',
    category: 'industrial',
    location: 'Abu Dhabi, UAE',
    completed: '2023',
    sourceFolder: 'WATER RESERVOIR & RETAINING WALLS YAS ISLAND - ABU DHABI',
    images: [
      'p178_img01_xref7126.jpeg',
      'p181_img01_xref7148.jpeg',
      'p182_img01_xref7156.jpeg', 'p182_img02_xref7154.jpeg', 'p182_img03_xref7158.jpeg',
      'p182_img04_xref7157.jpeg', 'p182_img05_xref7155.jpeg',
      'p183_img01_xref7165.jpeg', 'p183_img02_xref7166.jpeg', 'p183_img03_xref7170.jpeg',
      'p183_img04_xref7169.jpeg', 'p183_img05_xref7167.jpeg', 'p183_img06_xref7164.jpeg',
      'p186_img01_xref7193.jpeg', 'p186_img02_xref7191.jpeg', 'p186_img03_xref7192.jpeg', 'p186_img04_xref7190.jpeg'
    ],
    imageCount: 17,
    orientation: 'mixed',
    recommendedHeight: 'med'
  },

  // ============================================
  // MARINE PROJECTS (2 projects)
  // ============================================

  {
    id: 'p014',
    title: 'Marine Staging Yassat Island',
    category: 'marine',
    location: 'Abu Dhabi, UAE',
    completed: '2023',
    sourceFolder: 'MARINE STAGING YASSAT ISLAND - ABU DHABI',
    images: [
      'p116_img01_xref6734.jpeg', 'p116_img02_xref6733.jpeg',
      'p117_img01_xref6737.jpeg', 'p117_img02_xref6738.jpeg',
      'p118_img01_xref6741.jpeg',
      'p119_img01_xref6747.jpeg',
      'p120_img01_xref6750.jpeg'
    ],
    imageCount: 6,
    orientation: 'horizontal',
    recommendedHeight: 'med',
    featured: true
  },
  {
    id: 'p013',
    title: 'Khalifa Port',
    category: 'marine',
    location: 'Abu Dhabi, UAE',
    completed: '2022',
    sourceFolder: 'KHALIFA PORT',
    images: [
      'p190_img01_xref7226.jpeg', 'p190_img02_xref7224.jpeg', 'p190_img03_xref7225.jpeg',
      'p191_img01_xref7234.jpeg', 'p191_img02_xref7232.jpeg', 'p191_img03_xref7233.jpeg'
    ],
    imageCount: 6,
    orientation: 'vertical',
    recommendedHeight: 'tall',
    featured: true
  },

  // ============================================
  // COMMERCIAL PROJECTS (1 project)
  // ============================================

  {
    id: 'p005',
    title: 'Crystal Lagoon & Machine Station Maydan',
    category: 'commercial',
    location: 'Dubai, UAE',
    completed: '2023',
    sourceFolder: 'CRYSTAL LAGOON & MACHINE STATION MAYDAN - DUBAI',
    images: [
      'p085_img01_xref6520.jpeg', 'p085_img02_xref6521.jpeg',
      'p145_img01_xref6906.jpeg', 'p145_img02_xref6907.jpeg',
      'p146_img01_xref6913.jpeg',
      'p149_img01_xref6933.jpeg',
      'p150_img01_xref6939.jpeg', 'p150_img02_xref6940.jpeg',
      'p151_img01_xref6944.jpeg', 'p151_img02_xref6943.jpeg',
      'p152_img01_xref6944.jpeg', 'p152_img02_xref6943.jpeg'
    ],
    imageCount: 12,
    orientation: 'mixed',
    recommendedHeight: 'med',
    featured: true
  },

  // ============================================
  // RESIDENTIAL PROJECTS (1 project)
  // ============================================

  {
    id: 'p019',
    title: 'Private Villas Project',
    category: 'residential',
    location: 'Abu Dhabi, UAE',
    completed: '2023',
    sourceFolder: 'PRIVATE VILLAS PROJECT',
    images: [
      'p121_img01_xref6756.jpeg', 'p121_img02_xref6757.jpeg',
      'p122_img01_xref6763.jpeg', 'p122_img02_xref6764.jpeg',
      'p123_img01_xref6769.jpeg', 'p123_img02_xref6768.jpeg',
      'p124_img01_xref6775.jpeg', 'p124_img02_xref6776.jpeg',
      'p126_img01_xref6782.jpeg', 'p126_img02_xref6783.jpeg'
    ],
    imageCount: 10,
    orientation: 'vertical',
    recommendedHeight: 'tall',
    featured: true
  },
];

/**
 * Category summary for all projects
 */
const categorySummary = {
  infrastructure: 12,
  industrial: 9,
  marine: 2,
  commercial: 1,
  residential: 1,
  total: 25,
  totalImages: 319
};

/**
 * Helper function to get projects by category
 */
function getProjectsByCategory(category) {
  return projectMapping.filter(p =>
    category === 'all' ? true : p.category === category
  );
}

/**
 * Helper function to get featured projects
 */
function getFeaturedProjects() {
  return projectMapping.filter(p => p.featured);
}

/**
 * Helper function to get project by ID
 */
function getProjectById(id) {
  return projectMapping.find(p => p.id === id);
}

/**
 * Helper function to get project by source folder
 */
function getProjectBySourceFolder(folderName) {
  return projectMapping.find(p => p.sourceFolder === folderName);
}

/**
 * Get all unique project IDs
 */
function getAllProjectIds() {
  return projectMapping.map(p => p.id);
}

/**
 * Get statistics
 */
function getProjectStatistics() {
  const byCategory = {};
  projectMapping.forEach(p => {
    byCategory[p.category] = (byCategory[p.category] || 0) + 1;
  });

  return {
    totalProjects: projectMapping.length,
    byCategory,
    totalImages: projectMapping.reduce((sum, p) => sum + p.imageCount, 0),
    featuredCount: projectMapping.filter(p => p.featured).length
  };
}

export default projectMapping;
export {
  categorySummary,
  getProjectsByCategory,
  getFeaturedProjects,
  getProjectById,
  getProjectBySourceFolder,
  getAllProjectIds,
  getProjectStatistics
};
