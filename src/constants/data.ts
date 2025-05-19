import { SideMenu } from 'types';

export type Product = {
  photo_url: string;
  name: string;
  description: string;
  created_at: string;
  price: number;
  id: number;
  category: string;
  updated_at: string;
};

//Info: The following data is used for the sidebar navigation and Cmd K bar.
export const sideMenu: SideMenu[] = [
  {
    title: 'overview',
    navItems: [
      {
        title: 'Dashboard',
        url: '/dashboard',
        icon: 'dashboard',
        isActive: false,
        shortcut: ['d', 'd'],
        items: [] // Empty array as there are no child items for Dashboard
      },
      {
        title: 'Peserta',
        url: '/dashboard/participants',
        icon: 'user2',
        isActive: false,
        shortcut: ['d', 'p'],
        items: [] // Empty array as there are no child items for Dashboard
      },
      {
        title: 'Officials',
        url: '/dashboard/officials',
        icon: 'user2',
        isActive: false,
        shortcut: ['d', 'o'],
        items: []
      }
    ]
  },
  {
    title: 'User Manager',
    permission: 'user:view',
    navItems: [
      {
        title: 'Users',
        url: '/dashboard/users',
        icon: 'user',
        isActive: false,
        items: [],
        shortcut: ['d', 'u'],
        permission: 'user:view'
      },
      {
        title: 'Roles',
        url: '/dashboard/roles',
        icon: 'key',
        isActive: false,
        items: [],
        shortcut: ['d', 'r'],
        permission: 'role:view'
      }
    ]
  },
  {
    title: 'Registration Manager',
    permission: 'registrasi:all',
    navItems: [
      {
        title: 'Rekap Kehadiran',
        url: '/dashboard/recap',
        icon: 'user',
        isActive: false,
        items: [],
        shortcut: ['r', 'k'],
        permission: 'registrasi:all'
      },
      {
        title: 'Regitrasi Peserta',
        url: '/dashboard/registrasi',
        icon: 'user',
        isActive: false,
        items: [],
        shortcut: ['r', 'p'],
        permission: 'registrasi:all'
      },
      {
        title: 'Registrasi Official',
        url: '/dashboard/registrasi-official',
        icon: 'key',
        isActive: false,
        items: [],
        shortcut: ['r', 'o'],
        permission: 'registrasi:all'
      }
    ]
  },
  {
    title: 'Keuangan Manager',
    permission: 'keuangan:all',
    navItems: [
      {
        title: 'Keuangan',
        url: '/dashboard/keuangan',
        icon: 'dollar',
        isActive: false,
        items: [],
        shortcut: ['r', 'k'],
        permission: 'keuangan:all'
      }
    ]
  }
];

export interface SaleUser {
  id: number;
  name: string;
  email: string;
  amount: string;
  image: string;
  initials: string;
}

export const recentSalesData: SaleUser[] = [
  {
    id: 1,
    name: 'Olivia Martin',
    email: 'olivia.martin@email.com',
    amount: '+$1,999.00',
    image: 'https://api.slingacademy.com/public/sample-users/1.png',
    initials: 'OM'
  },
  {
    id: 2,
    name: 'Jackson Lee',
    email: 'jackson.lee@email.com',
    amount: '+$39.00',
    image: 'https://api.slingacademy.com/public/sample-users/2.png',
    initials: 'JL'
  },
  {
    id: 3,
    name: 'Isabella Nguyen',
    email: 'isabella.nguyen@email.com',
    amount: '+$299.00',
    image: 'https://api.slingacademy.com/public/sample-users/3.png',
    initials: 'IN'
  },
  {
    id: 4,
    name: 'William Kim',
    email: 'will@email.com',
    amount: '+$99.00',
    image: 'https://api.slingacademy.com/public/sample-users/4.png',
    initials: 'WK'
  },
  {
    id: 5,
    name: 'Sofia Davis',
    email: 'sofia.davis@email.com',
    amount: '+$39.00',
    image: 'https://api.slingacademy.com/public/sample-users/5.png',
    initials: 'SD'
  }
];
