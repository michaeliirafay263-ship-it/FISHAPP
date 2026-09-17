import { INITIAL_FISH_CATALOG } from '../../src/data/fishCatalog.js';
import { INITIAL_ORDERS, RIDERS } from '../../src/data/initialOrders.js';
import { DAR_WARDS } from '../../src/data/wards.js';

export let fishStore = [...INITIAL_FISH_CATALOG];
export let ordersStore = [...INITIAL_ORDERS];
export let ridersStore = [...RIDERS];
export let wardsStore = [...DAR_WARDS];
export let customersStore = [
  {
    id: 'cust-1',
    name: 'Amina Salum',
    phone: '0754 443 219',
    userType: 'Household',
    ward: 'Mikocheni A & B',
    address: 'Mikocheni B, Near Rose Garden, House 42B',
    totalOrders: 3,
    totalSpent: 185000
  },
  {
    id: 'cust-2',
    name: 'David Mwangi (The Peninsula Bistro)',
    phone: '0784 102 938',
    userType: 'Restaurant',
    ward: 'Masaki (Peninsula)',
    address: 'Toure Drive, Plot 14, Kitchen Back Entrance',
    totalOrders: 8,
    totalSpent: 1240000
  },
  {
    id: 'cust-3',
    name: 'Fatma Zahran',
    phone: '0767 991 302',
    userType: 'Household',
    ward: 'Upanga East / West',
    address: 'United Nations Rd, Upanga, Apartment 3B',
    totalOrders: 2,
    totalSpent: 89000
  }
];
