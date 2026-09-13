export type RegistrationStatus =
  | 'Pending_ID_Approval'
  | 'ID_Approved_Payment_Pending'
  | 'Pending_Payment_Verification'
  | 'Approved'
  | 'Rejected';

export interface Registration {
  id: string;
  tokenId: string; // e.g. KRUP-2026-8492
  fullName: string;
  collegeEmail: string;
  phone: string;
  usn: string;
  department: string;
  batchYear: string;
  idCardPhoto: string; // Base64 or image URL
  status: RegistrationStatus;
  rejectionReason?: string;
  utrNumber?: string;
  paymentScreenshot?: string;
  appliedAt: string;
  approvedAt?: string;
  isVip?: boolean;
  isGateScanned?: boolean;
  scannedAt?: string;
  scannedBy?: string;
  isOnasadyaClaimed?: boolean;
  onasadyaClaimedAt?: string;
  ticketPrice: number;
}

export interface DriverRegistration {
  id: string;
  driverId: string; // e.g. KRUP-DRV-101
  driverName: string;
  phone: string;
  vehicleNumber: string;
  busRoute: string;
  collegeAffiliation: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  appliedAt: string;
  isGateScanned?: boolean;
  scannedAt?: string;
}

export interface SiteSettings {
  totalCapacity: number; // Strictly 750
  generalPassPrice: number; // ₹700
  isRegistrationOpen: boolean;
  upiId: string;
  upiPayeeName: string;
  eventDate: string;
  eventVenue: string;
  venueMapsUrl: string;
  adminPin: string;
}

export interface OnasadyaDish {
  id: number;
  name: string;
  malayalamName: string;
  category: 'Rice & Dal' | 'Curry & Gravy' | 'Dry Side (Thoran/Mezhukkupuratti)' | 'Crispy & Savory' | 'Sweet Dessert (Payasam)' | 'Pickle & Chutney';
  description: string;
  ingredients: string[];
  tasteProfile: string;
  traditionalPlacement: string;
}

export interface ProgramEvent {
  id: string;
  time: string;
  title: string;
  malayalamTitle?: string;
  category: 'Ceremony' | 'Music & Dance' | 'Contest' | 'Feast' | 'Celebration';
  location: string;
  description: string;
  highlights: string[];
}
