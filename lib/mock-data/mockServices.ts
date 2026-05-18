import { Service } from "@/types";

export const mockServices: Service[] = [
  {
    id: "SRV-001",
    name: "Premium Cut",
    category: "Hair",
    price: "₱500",
    duration: "45 Min",
    description: "Precision tailored haircut with hot towel finish and rejuvenating styling tonic.",
    status: "active",
    rating: "4.9",
    popular: true
  },
  {
    id: "SRV-002",
    name: "Hair Color",
    category: "Hair",
    price: "₱2,500",
    duration: "120 Min",
    description: "Vibrant full color or subtle highlights using premium imported organic ammonia-free dyes.",
    status: "active",
    rating: "4.8"
  },
  {
    id: "SRV-003",
    name: "Beard Sculpt",
    category: "Hair",
    price: "₱350",
    duration: "30 Min",
    description: "Detailed beard shaping, trim, and conditioning balm application with straight razor edging.",
    status: "active",
    rating: "4.7"
  },
  {
    id: "SRV-004",
    name: "Keratin Rebond",
    category: "Hair",
    price: "₱3,500",
    duration: "180 Min",
    description: "Advanced straightening treatment infused with Brazilian keratin for ultra-silky, smooth hair.",
    status: "active",
    rating: "4.9"
  },
  {
    id: "SRV-005",
    name: "Manicure & Gel",
    category: "Nails",
    price: "₱650",
    duration: "60 Min",
    description: "Deluxe hand soak, cuticle care, nail shaping, and long-lasting premium gel polish.",
    status: "active",
    rating: "4.8"
  },
  {
    id: "SRV-006",
    name: "Deep Facial Glow",
    category: "Facial",
    price: "₱1,200",
    duration: "60 Min",
    description: "Purifying steam, gentle exfoliation, pore extraction, and nourishing collagen mask.",
    status: "active",
    rating: "5.0",
    popular: true
  },
  {
    id: "SRV-007",
    name: "Scalp Massage",
    category: "Massage",
    price: "₱850",
    duration: "45 Min",
    description: "Therapeutic acupressure head and shoulder massage with invigorating peppermint scalp tonic.",
    status: "active",
    rating: "4.9"
  },
  {
    id: "SRV-008",
    name: "Ultimate Royal Package",
    category: "Packages",
    price: "₱4,500",
    duration: "240 Min",
    description: "The complete grooming ritual: Premium Cut, Deep Facial Glow, Scalp Massage, and Deluxe Pedicure.",
    status: "active",
    rating: "5.0",
    popular: true
  }
];

export const mockFeaturedServices: Service[] = [
  mockServices[0], // Premium Cut
  mockServices[5]  // Deep Facial Glow
];
