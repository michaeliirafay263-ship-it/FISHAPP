export const RIDERS = [
  {
    id: 'rider-1',
    name: 'Juma Rashidi',
    phone: '+255 754 882 109',
    bikePlate: 'MC 849 DXA',
    bikeModel: 'Bajaj Boxer 150 (Fitted Cold Box 45L)',
    currentZone: 'Mikocheni',
    activeDeliveriesCount: 1,
    rating: 4.9,
    status: 'on_route'
  },
  {
    id: 'rider-2',
    name: 'Baraka Mussa',
    phone: '+255 713 550 491',
    bikePlate: 'MC 412 CYZ',
    bikeModel: 'TVS HLX 125 (Insulated Carrier)',
    currentZone: 'Kivukoni Market Hub',
    activeDeliveriesCount: 1,
    rating: 4.8,
    status: 'ready'
  },
  {
    id: 'rider-3',
    name: 'Emmanuel Kimaro',
    phone: '+255 788 334 112',
    bikePlate: 'MC 901 BTA',
    bikeModel: 'Honda Ace 125 (Thermal Pouch System)',
    currentZone: 'Sinza Mori',
    activeDeliveriesCount: 0,
    rating: 4.95,
    status: 'ready'
  }
];

export const INITIAL_ORDERS = [
  {
    id: 'ORD-8924',
    customerName: 'Amina Salum',
    customerPhone: '+255 754 443 219',
    customerType: 'Household',
    items: [
      {
        id: 'changaraweni-snapper',
        name: 'Red Snapper (Changaraweni)',
        pricePerKg: 18500,
        weightKg: 2.0,
        cleaningOption: 'Descaled & Gutted',
        totalPrice: 37000
      },
      {
        id: 'kamba-jumbo-prawns',
        name: 'Jumbo Tiger Prawns (Kamba Wakubwa)',
        pricePerKg: 32000,
        weightKg: 1.0,
        cleaningOption: 'Whole with Head & Shell',
        totalPrice: 32000
      }
    ],
    itemsSubtotal: 69000,
    coldChainFee: 1500,
    deliveryFee: 4500,
    grandTotal: 75000,
    ward: 'Mikocheni A & B',
    exactAddress: 'Mikocheni B, Near Rose Garden, House No. 42B',
    deliveryTimeSlot: '12:30 - 15:30',
    paymentMethod: 'M-Pesa (Vodacom)',
    paymentStatus: 'PAID',
    paymentRef: 'MPESA-QRT892911',
    status: 'out_for_delivery', // 'received' | 'sourced' | 'packed' | 'out_for_delivery' | 'delivered'
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    statusHistory: [
      { status: 'received', time: '11:15 AM', label: 'Order placed & M-Pesa payment verified' },
      { status: 'sourced', time: '11:30 AM', label: 'Fresh fish inspected at Kivukoni Market pier' },
      { status: 'packed', time: '11:50 AM', label: 'Descaled, cleaned & packed in thermal ice pouch' },
      { status: 'out_for_delivery', time: '12:10 PM', label: 'Handed to rider Juma Rashidi on bike MC 849 DXA' }
    ],
    assignedRiderId: 'rider-1',
    riderNotes: 'Client requested call upon arrival at gate.',
    freshnessRating: null
  },
  {
    id: 'ORD-8919',
    customerName: 'The Peninsula Bistro (David Mwangi)',
    customerPhone: '+255 784 102 938',
    customerType: 'Restaurant',
    items: [
      {
        id: 'nguru-kingfish',
        name: 'Kingfish (Nguru)',
        pricePerKg: 22000,
        weightKg: 4.5,
        cleaningOption: 'Cut into Round Steaks',
        totalPrice: 99000
      },
      {
        id: 'ngisi-fresh-calamari',
        name: 'Fresh Calamari / Squid (Ngisi)',
        pricePerKg: 19000,
        weightKg: 3.0,
        cleaningOption: 'Cleaned, Ink Removed & Cut into Rings',
        totalPrice: 57000
      }
    ],
    itemsSubtotal: 156000,
    coldChainFee: 1500,
    deliveryFee: 4500,
    grandTotal: 162000,
    ward: 'Masaki (Peninsula)',
    exactAddress: 'Toure Drive, Plot 14, Kitchen Back Entrance',
    deliveryTimeSlot: '08:30 - 11:30',
    paymentMethod: 'Tigo Pesa',
    paymentStatus: 'PAID',
    paymentRef: 'TIGO-99214482',
    status: 'delivered',
    createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    statusHistory: [
      { status: 'received', time: '07:45 AM', label: 'Order confirmed' },
      { status: 'sourced', time: '08:15 AM', label: 'Sourced from dawn dhow landing' },
      { status: 'packed', time: '08:40 AM', label: 'Packed in commercial insulated crates' },
      { status: 'out_for_delivery', time: '09:05 AM', label: 'Dispatched with Baraka Mussa' },
      { status: 'delivered', time: '09:42 AM', label: 'Delivered & temperature verified (2.4°C)' }
    ],
    assignedRiderId: 'rider-2',
    riderNotes: 'Chef checked gill freshness and stamped delivery sheet.',
    freshnessRating: 5
  },
  {
    id: 'ORD-8926',
    customerName: 'Fatma Zahran',
    customerPhone: '+255 767 991 302',
    customerType: 'Household',
    items: [
      {
        id: 'changu-emperor',
        name: 'White Snapper / Emperor (Changu)',
        pricePerKg: 16000,
        weightKg: 2.5,
        cleaningOption: 'Descaled & Gutted',
        totalPrice: 40000
      }
    ],
    itemsSubtotal: 40000,
    coldChainFee: 1500,
    deliveryFee: 3000,
    grandTotal: 44500,
    ward: 'Upanga East / West',
    exactAddress: 'United Nations Rd, Upanga, Apartment 3B',
    deliveryTimeSlot: '16:30 - 19:30',
    paymentMethod: 'Airtel Money',
    paymentStatus: 'PAID',
    paymentRef: 'AIRTEL-7740129',
    status: 'packed',
    createdAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    statusHistory: [
      { status: 'received', time: '02:10 PM', label: 'Order confirmed' },
      { status: 'sourced', time: '02:25 PM', label: 'Selected prime Changu from cold store' },
      { status: 'packed', time: '02:40 PM', label: 'Gutted, double rinsed, placed in ice pack' }
    ],
    assignedRiderId: 'rider-2',
    riderNotes: 'Call before dispatch.',
    freshnessRating: null
  }
];
