export interface ErodeLocationInfo {
  slug: string;
  name: string;
  locationQuery: string; // Matches property.location
  tagline: string;
  description: string;
  heroImage: string;
  highlights: string[];
}

export const erodeLocations: ErodeLocationInfo[] = [
  {
    slug: 'thindal',
    name: 'Thindal',
    locationQuery: 'Thindal',
    tagline: 'Hillside Luxury & Temple Proximity',
    description:
      'Thindal is one of Erode’s premier residential localities, famously home to the historic Thindal Murugan Temple. Situated along the Erode-Perundurai road, it offers serene elevated views, high-end gated communities, and quick connectivity to Erode city center.',
    heroImage: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1400&q=80',
    highlights: ['Thindal Murugan Temple', 'High-end Gated Villas', '4-Lane Highway Access', 'Top Educational Hubs'],
  },
  {
    slug: 'perundurai',
    name: 'Perundurai',
    locationQuery: 'Perundurai Road',
    tagline: 'Industrial & Educational Hub of Erode',
    description:
      'Perundurai is an economic powerhouse in Erode district, known for SIPCOT Industrial Growth Center, IRTT Medical College, and major engineering institutions. A prime destination for modern apartments, penthouses, and commercial plots.',
    heroImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=80',
    highlights: ['SIPCOT Industrial Complex', 'Medical & Engineering Colleges', 'Rapid Commercial Growth', 'Luxury Penthouses'],
  },
  {
    slug: 'gobichettipalayam',
    name: 'Gobichettipalayam',
    locationQuery: 'Gobichettipalayam',
    tagline: 'Scenic Paddy Fields & Film Heritage',
    description:
      'Known affectionately as "Gobi", this lush green township is renowned for its vast agricultural landscapes, coconut plantations, and vibrant cinema history. Ideal for spacious farmhouses and heritage estates.',
    heroImage: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1400&q=80',
    highlights: ['Coconut & Paddy Plantations', 'Cinema Shooting Hub', 'Kodivery Dam Proximity', 'Heritage Farm Estates'],
  },
  {
    slug: 'sathyamangalam',
    name: 'Sathyamangalam',
    locationQuery: 'Sathyamangalam',
    tagline: 'Gateway to Western Ghats & Tiger Reserve',
    description:
      'Situated at the foothills of the Nilgiris, Sathyamangalam is famous for the Sathyamangalam Tiger Reserve and Bannari Amman Temple. Offers cool mountain breezes, teakwood chalets, and eco-luxury living.',
    heroImage: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=1400&q=80',
    highlights: ['Sathyamangalam Tiger Reserve', 'Bannari Amman Temple', 'Mountain Foothills', 'Eco Chalets & Retreats'],
  },
  {
    slug: 'bhavani',
    name: 'Bhavani',
    locationQuery: 'Bhavani',
    tagline: 'Sacred Riverfront & Carpet Craft',
    description:
      'Bhavani, the "Carpet City" of South India, lies at the holy confluence of the Kaveri, Bhavani, and invisible Amudha rivers (Kooduthurai). Offers serene riverfront villas and peaceful riverside living.',
    heroImage: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1400&q=80',
    highlights: ['Holy Kooduthurai Sangam', 'Famous Carpet Weaving Heritage', 'Riverfront Property Access', 'Historic Culture'],
  },
  {
    slug: 'chennimalai',
    name: 'Chennimalai',
    locationQuery: 'Chennimalai',
    tagline: 'Handloom Capital & Hilltop Shrine',
    description:
      'Chennimalai is celebrated globally for its high-quality handloom textile products and the sacred Chennimalai Murugan Hill Temple. Features hill-view residences with traditional architecture.',
    heroImage: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1400&q=80',
    highlights: ['Chennimalai Murugan Temple', 'Global Handloom Textile Center', 'Quiet Hillside Villas', 'Lush Landscapes'],
  },
  {
    slug: 'modakurichi',
    name: 'Modakurichi',
    locationQuery: 'Modakurichi',
    tagline: 'Green Agricultural Meadows',
    description:
      'Modakurichi is a flourishing agricultural town in Erode district. Blessed with fertile soil and canal irrigation, it is perfect for buyers looking for modern luxury penthouses and farm residences surrounded by nature.',
    heroImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1400&q=80',
    highlights: ['Fertile Farm Belts', 'Canal Irrigation', 'Peaceful Countryside', 'Eco-conscious Homes'],
  },
  {
    slug: 'kodumudi',
    name: 'Kodumudi',
    locationQuery: 'Kodumudi',
    tagline: 'Kaveri River Sanctuary & Heritage',
    description:
      'Located on the banks of the Kaveri River, Kodumudi is famous for the ancient Magudeswarar Veeranarayana Perumal Temple. A serene haven for waterfront estates and quiet retirement villas.',
    heroImage: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1400&q=80',
    highlights: ['Kaveri River Bank', 'Ancient Magudeswarar Temple', 'Tranquil Waterfront Estates', 'Rail & Road Connectivity'],
  },
  {
    slug: 'bhavanisagar',
    name: 'Bhavanisagar',
    locationQuery: 'Bhavanisagar',
    tagline: 'Lakeside Dam Views & Nilgiri Foothills',
    description:
      'Home to one of the world’s largest earthen dams (Bhavanisagar Dam), this picturesque location boasts cool climate, lakeside breezes, and mountain vistas. Exceptional for weekend villas and private resorts.',
    heroImage: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1400&q=80',
    highlights: ['Bhavanisagar Dam & Reservoir', 'Cool Microclimate', 'Nilgiri View Panoramas', 'Lakeside Residences'],
  },
  {
    slug: 'kavindapadi',
    name: 'Kavindapadi',
    locationQuery: 'Kavindapadi',
    tagline: 'Sugarcane & Turmeric Valley',
    description:
      'Kavindapadi is a major agricultural hub in Erode district, renowned for its turmeric and sugarcane markets. Offers scenic countryside villas amidst lush green farmlands.',
    heroImage: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1400&q=80',
    highlights: ['Turmeric & Sugarcane Belt', 'Fresh Country Air', 'Scenic Valley Living', 'Organic Farm Plots'],
  },
];
