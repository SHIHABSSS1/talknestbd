/** Static sample rows for the design-only admin list pages. */
export interface AdminOrderItem {
  title: string;
  quantity: number;
  price: number;
}

export type AdminOrderStatus = "Confirmed" | "Processing" | "Out for delivery";

export interface AdminOrder {
  id: string;
  customer: string;
  phone: string;
  email: string;
  items: AdminOrderItem[];
  total: number;
  payment: string;
  delivery: string;
  status: AdminOrderStatus;
  date: string;
  address: string;
}

export interface AdminCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  orders: number;
  spent: number;
  joined: string;
  status: "Active" | "New";
}

export const sampleOrders: AdminOrder[] = [
  {
    id: "TN-261117-4821",
    customer: "Tanha Rahman",
    phone: "+880 1712-000000",
    email: "tanha@example.com",
    items: [
      { title: "A Journey Through Blue Clouds", quantity: 1, price: 380 },
      { title: "Miswak Herbal", quantity: 2, price: 120 },
    ],
    total: 660,
    payment: "Cash on Delivery",
    delivery: "Standard delivery",
    status: "Confirmed",
    date: "17 Nov 2026",
    address: "12 Lake View Road, Dhanmondi, Dhaka",
  },
  {
    id: "TN-261117-4790",
    customer: "Mahin Ahmed",
    phone: "+880 1819-221043",
    email: "mahin@example.com",
    items: [{ title: "The Last Afternoon Light", quantity: 2, price: 320 }],
    total: 680,
    payment: "bKash",
    delivery: "Express delivery",
    status: "Processing",
    date: "17 Nov 2026",
    address: "8/A Green Road, Farmgate, Dhaka",
  },
  {
    id: "TN-261116-4655",
    customer: "Sadia Islam",
    phone: "+880 1655-908122",
    email: "sadia@example.com",
    items: [
      { title: "The Vanished City", quantity: 1, price: 340 },
      { title: "Letters of Love", quantity: 1, price: 300 },
    ],
    total: 690,
    payment: "Nagad",
    delivery: "Standard delivery",
    status: "Out for delivery",
    date: "16 Nov 2026",
    address: "House 22, Road 7, Banani, Dhaka",
  },
  {
    id: "TN-261116-4512",
    customer: "Rakibul Hasan",
    phone: "+880 1733-445610",
    email: "rakib@example.com",
    items: [{ title: "Small Sunnah, Every Day", quantity: 1, price: 450 }],
    total: 490,
    payment: "Cash on Delivery",
    delivery: "Store pickup",
    status: "Confirmed",
    date: "16 Nov 2026",
    address: "Store pickup — TalkNest BD",
  },
  {
    id: "TN-261115-4388",
    customer: "Nusrat Jahan",
    phone: "+880 1911-772345",
    email: "nusrat@example.com",
    items: [{ title: "A Journey Through Blue Clouds", quantity: 3, price: 380 }],
    total: 1180,
    payment: "bKash",
    delivery: "Express delivery",
    status: "Processing",
    date: "15 Nov 2026",
    address: "45 Manik Mia Avenue, Dhaka",
  },
  {
    id: "TN-261115-4210",
    customer: "Imran Hossain",
    phone: "+880 1622-889001",
    email: "imran@example.com",
    items: [{ title: "The Last Afternoon Light", quantity: 1, price: 320 }],
    total: 360,
    payment: "Cash on Delivery",
    delivery: "Standard delivery",
    status: "Out for delivery",
    date: "15 Nov 2026",
    address: "9 Shantidhara, Chattogram",
  },
];

export const sampleCustomers: AdminCustomer[] = [
  {
    id: "C-1042",
    name: "Tanha Rahman",
    email: "tanha@example.com",
    phone: "+880 1712-000000",
    city: "Dhaka",
    orders: 8,
    spent: 4280,
    joined: "Jan 2025",
    status: "Active",
  },
  {
    id: "C-1039",
    name: "Mahin Ahmed",
    email: "mahin@example.com",
    phone: "+880 1819-221043",
    city: "Dhaka",
    orders: 5,
    spent: 2610,
    joined: "Mar 2025",
    status: "Active",
  },
  {
    id: "C-1036",
    name: "Sadia Islam",
    email: "sadia@example.com",
    phone: "+880 1655-908122",
    city: "Dhaka",
    orders: 12,
    spent: 7340,
    joined: "Nov 2024",
    status: "Active",
  },
  {
    id: "C-1031",
    name: "Rakibul Hasan",
    email: "rakib@example.com",
    phone: "+880 1733-445610",
    city: "Dhaka",
    orders: 2,
    spent: 890,
    joined: "Sep 2026",
    status: "New",
  },
  {
    id: "C-1028",
    name: "Nusrat Jahan",
    email: "nusrat@example.com",
    phone: "+880 1911-772345",
    city: "Dhaka",
    orders: 7,
    spent: 5120,
    joined: "May 2025",
    status: "Active",
  },
  {
    id: "C-1024",
    name: "Imran Hossain",
    email: "imran@example.com",
    phone: "+880 1622-889001",
    city: "Chattogram",
    orders: 3,
    spent: 1440,
    joined: "Aug 2026",
    status: "New",
  },
];
