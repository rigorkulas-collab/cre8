import { Appointment } from "@/types";

export const initialAppointments: Appointment[] = [
  {
    id: "APT-101",
    serviceId: "SRV-001",
    serviceName: "Premium Cut",
    category: "Hair",
    stylistName: "Alex River",
    date: "May 20, 2026",
    time: "02:00 PM",
    price: "₱500",
    duration: "45 Min",
    status: "confirmed",
    refCode: "CRE8-F84D2"
  },
  {
    id: "APT-102",
    serviceId: "SRV-006",
    serviceName: "Deep Facial Glow",
    category: "Facial",
    stylistName: "Maria Cruz",
    date: "May 26, 2026",
    time: "10:30 AM",
    price: "₱1,200",
    duration: "60 Min",
    status: "pending",
    refCode: "CRE8-R91B8"
  },
  {
    id: "APT-103",
    serviceId: "SRV-003",
    serviceName: "Beard Sculpt",
    category: "Hair",
    stylistName: "Alex River",
    date: "May 08, 2026",
    time: "04:00 PM",
    price: "₱350",
    duration: "30 Min",
    status: "completed",
    refCode: "CRE8-K28A1"
  },
  {
    id: "APT-104",
    serviceId: "SRV-005",
    serviceName: "Manicure & Gel",
    category: "Nails",
    stylistName: "Jo Jordan",
    date: "May 02, 2026",
    time: "01:00 PM",
    price: "₱650",
    duration: "45 Min",
    status: "completed",
    refCode: "CRE8-H91C2"
  }
];

export const mockTimeSlots = [
  { time: "09:00 AM", available: true },
  { time: "10:00 AM", available: true },
  { time: "11:00 AM", available: false },
  { time: "01:00 PM", available: true },
  { time: "02:00 PM", available: true },
  { time: "03:00 PM", available: false },
  { time: "04:00 PM", available: true },
  { time: "05:00 PM", available: true }
];
