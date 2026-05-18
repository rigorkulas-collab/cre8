export interface Service {
  id: string;
  name: string;
  category: string;
  price: string;
  duration: string;
  description: string;
  status?: "active" | "inactive";
  rating?: string;
  popular?: boolean;
}

export interface Staff {
  id: string;
  name: string;
  role: string;
  rating: string;
}

export interface Appointment {
  id: string;
  serviceId: string;
  serviceName: string;
  category: string;
  stylistName: string;
  date: string;
  time: string;
  price: string;
  duration: string;
  status: "pending" | "confirmed" | "completed" | "cancelled" | "rescheduled" | "in progress";
  refCode: string;
}

export interface UserProfile {
  name: string;
  email: string;
  mobile: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface Promotion {
  id: string;
  title: string;
  code: string;
  discount: string;
  description: string;
  pointsRequired?: number;
}
