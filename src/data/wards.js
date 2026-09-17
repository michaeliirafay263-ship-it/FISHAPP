export const DAR_WARDS = [
  { id: 'kivukoni', name: 'Kivukoni', district: 'Ilala', fee: 2000, estimatedMinutes: 25, popular: true },
  { id: 'city-centre', name: 'City Centre (Posta)', district: 'Ilala', fee: 2500, estimatedMinutes: 30, popular: true },
  { id: 'upanga', name: 'Upanga East / West', district: 'Ilala', fee: 3000, estimatedMinutes: 35, popular: true },
  { id: 'kariakoo', name: 'Kariakoo', district: 'Ilala', fee: 3500, estimatedMinutes: 40, popular: false },
  { id: 'masaki', name: 'Masaki (Peninsula)', district: 'Kinondoni', fee: 4500, estimatedMinutes: 45, popular: true },
  { id: 'oysterbay', name: 'Oysterbay', district: 'Kinondoni', fee: 4000, estimatedMinutes: 40, popular: true },
  { id: 'mikocheni', name: 'Mikocheni A & B', district: 'Kinondoni', fee: 4500, estimatedMinutes: 45, popular: true },
  { id: 'msasani', name: 'Msasani Village / Beach', district: 'Kinondoni', fee: 4000, estimatedMinutes: 40, popular: false },
  { id: 'kinondoni', name: 'Kinondoni (Mkwajuni/Manyanya)', district: 'Kinondoni', fee: 4000, estimatedMinutes: 40, popular: false },
  { id: 'sinza', name: 'Sinza (Mori / Kumekucha / Palestina)', district: 'Ubungo', fee: 5000, estimatedMinutes: 50, popular: true },
  { id: 'kijitonyama', name: 'Kijitonyama / Sayansi', district: 'Kinondoni', fee: 4500, estimatedMinutes: 45, popular: false },
  { id: 'mwenge', name: 'Mwenge / Mlimani City', district: 'Kinondoni', fee: 5000, estimatedMinutes: 50, popular: false },
  { id: 'mbezi-beach', name: 'Mbezi Beach (Africana / Rainbow)', district: 'Kinondoni', fee: 6500, estimatedMinutes: 60, popular: true },
  { id: 'tegeta', name: 'Tegeta / Kunduchi', district: 'Kinondoni', fee: 7500, estimatedMinutes: 70, popular: false },
  { id: 'tabata', name: 'Tabata (Bima / Segerea)', district: 'Ilala', fee: 5500, estimatedMinutes: 55, popular: false }
];

export const DELIVERY_TIME_SLOTS = [
  { id: 'morning', label: 'Morning Catch (08:30 - 11:30)', shortLabel: '08:30 - 11:30', description: 'Fresh off the dawn boats from Kivukoni' },
  { id: 'afternoon', label: 'Afternoon Delivery (12:30 - 15:30)', shortLabel: '12:30 - 15:30', description: 'Packed with fresh ice for lunch/prep' },
  { id: 'evening', label: 'Evening Dinner Prep (16:30 - 19:30)', shortLabel: '16:30 - 19:30', description: 'Arrives chilled for dinner' }
];

export const COLD_CHAIN_FEE = 1500; // TZS for insulated thermal foil bag + double sealed food-grade ice packs
