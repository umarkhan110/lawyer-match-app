export interface Lawyer {
  id?: string;
  email?: string;
  fullName: string;
  barNumber: string;
  address: string;
  phoneNumber: string;
  languages: string[];
  startingPrice: number;
  additionalServices: string[];
  officeLocations: OfficeLocation[];
  availability: Availability[];
  profileImage?: string;
}

export interface OfficeLocation {
  id: string;
  address: string;
  latitude: number;
  longitude: number;
}

export interface Availability {
  id: string;
  date: string;
  timeSlots: TimeSlot[];
}

export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
}

export interface Client {
  id?: string;
  email?: string;
  phoneNumber?: string;
  budget?: number;
  downPayment?: number;
  location?: {
    latitude: number;
    longitude: number;
  };
}

export interface Subscription {
  id: string;
  lawyerId: string;
  status: 'active' | 'inactive';
  startDate: string;
  endDate: string;
}

export interface CaseType {
  type: string;
  title: string;
  description: string;
  Icon: React.ComponentType;
}

export interface Case {
  id: string;
  clientId: string;
  caseType: 'IMMIGRATION' | 'PERSONAL_INJURY' | string; // Extend with other case types if needed
  details: {
    entryDate?: string;
    alienNumber?: string;
    hasCourtDate?: string;
    language?: string;
    [key: string]: string | undefined; // Allow for additional dynamic fields
  };
  documents: string[];
  budget: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | string; // Extend with other statuses if needed
  createdAt: Date;
}

export type UserType = 'lawyer' | 'client';