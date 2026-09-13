import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Registration, DriverRegistration, SiteSettings, RegistrationStatus } from '../types';
import { initialRegistrations, initialDrivers, initialSiteSettings } from '../data/seedData';


interface TicketContextType {
  registrations: Registration[];
  drivers: DriverRegistration[];
  settings: SiteSettings;
  baseBookedOffset: number;
  totalClaimedPasses: number;
  remainingPasses: number;
  capacityPercentage: number;
  isSoldOut: boolean;
  isSellingFast: boolean;
  registerStudent: (data: {
    fullName: string;
    collegeEmail: string;
    phone: string;
    usn: string;
    department: string;
    batchYear: string;
    idCardPhoto: string;
  }) => Promise<Registration>;
  approveStudentId: (tokenId: string) => void;
  rejectStudentId: (tokenId: string, reason: string) => void;
  submitPayment: (tokenId: string, utrNumber: string, paymentScreenshot: string) => Promise<Registration>;
  approvePayment: (tokenId: string) => void;
  rejectPayment: (tokenId: string, reason: string) => void;
  toggleVip: (tokenId: string) => void;
  deleteRegistration: (tokenId: string) => void;
  registerDriver: (data: {
    driverName: string;
    phone: string;
    vehicleNumber: string;
    busRoute: string;
    collegeAffiliation: string;
  }) => Promise<DriverRegistration>;
  approveDriver: (driverId: string) => void;
  deleteDriver: (driverId: string) => void;
  scanPass: (tokenOrPayload: string) => {
    success: boolean;
    code: 'VALID' | 'DUPLICATE' | 'INVALID';
    message: string;
    registration?: Registration;
  };
  claimOnasadya: (tokenId: string) => boolean;
  updateSettings: (newSettings: Partial<SiteSettings>) => void;
  setBaseOffset: (offset: number) => void;
  resetToDefaults: () => void;
  exportToCsv: () => void;
}

const TicketContext = createContext<TicketContextType | undefined>(undefined);

const REGISTRATIONS_KEY = 'kruponam_registrations_v2026';
const DRIVERS_KEY = 'kruponam_drivers_v2026';
const SETTINGS_KEY = 'kruponam_settings_v2026';
const OFFSET_KEY = 'kruponam_offset_v2026';

export const TicketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [registrations, setRegistrations] = useState<Registration[]>(() => {
    try {
      const saved = localStorage.getItem(REGISTRATIONS_KEY);
      return saved ? JSON.parse(saved) : initialRegistrations;
    } catch {
      return initialRegistrations;
    }
  });

  const [drivers, setDrivers] = useState<DriverRegistration[]>(() => {
    try {
      const saved = localStorage.getItem(DRIVERS_KEY);
      return saved ? JSON.parse(saved) : initialDrivers;
    } catch {
      return initialDrivers;
    }
  });

  const [settings, setSettings] = useState<SiteSettings>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY);
      return saved ? JSON.parse(saved) : initialSiteSettings;
    } catch {
      return initialSiteSettings;
    }
  });

  // Base pre-booked passes offset to reflect realistic college batch bookings
  const [baseBookedOffset, setBaseBookedOffset] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(OFFSET_KEY);
      return saved ? Number(saved) : 518;
    } catch {
      return 518;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(REGISTRATIONS_KEY, JSON.stringify(registrations));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }, [registrations]);

  useEffect(() => {
    try {
      localStorage.setItem(DRIVERS_KEY, JSON.stringify(drivers));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }, [drivers]);

  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem(OFFSET_KEY, String(baseBookedOffset));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }, [baseBookedOffset]);

  // Total active passes (excluding rejected ones)
  const activeRegistrations = registrations.filter((r) => r.status !== 'Rejected');
  const totalClaimedPasses = Math.min(settings.totalCapacity, baseBookedOffset + activeRegistrations.length);
  const remainingPasses = Math.max(0, settings.totalCapacity - totalClaimedPasses);
  const capacityPercentage = Math.min(100, Math.round((totalClaimedPasses / settings.totalCapacity) * 100));
  const isSoldOut = totalClaimedPasses >= settings.totalCapacity;
  const isSellingFast = remainingPasses > 0 && remainingPasses < 150;

  const registerStudent = async (data: {
    fullName: string;
    collegeEmail: string;
    phone: string;
    usn: string;
    department: string;
    batchYear: string;
    idCardPhoto: string;
  }): Promise<Registration> => {
    if (isSoldOut) {
      throw new Error('Capacity Reached! All 750 passes have been allocated.');
    }
    if (!settings.isRegistrationOpen) {
      throw new Error('Registration is currently closed by the event committee.');
    }

    // Check if USN or Email already registered
    const existing = registrations.find(
      (r) =>
        r.status !== 'Rejected' &&
        (r.usn.toLowerCase() === data.usn.toLowerCase().trim() ||
          r.collegeEmail.toLowerCase() === data.collegeEmail.toLowerCase().trim())
    );
    if (existing) {
      throw new Error(`An application already exists for USN ${data.usn} (Token: ${existing.tokenId}). Please check your ticket status.`);
    }

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const tokenId = `KRUP-2026-${randomNum}`;

    const newReg: Registration = {
      id: 'reg-' + Date.now(),
      tokenId,
      fullName: data.fullName.trim(),
      collegeEmail: data.collegeEmail.trim(),
      phone: data.phone.trim(),
      usn: data.usn.trim().toUpperCase(),
      department: data.department,
      batchYear: data.batchYear,
      idCardPhoto: data.idCardPhoto,
      status: 'Pending_ID_Approval',
      appliedAt: new Date().toISOString(),
      ticketPrice: settings.generalPassPrice,
      isGateScanned: false,
      isOnasadyaClaimed: false,
    };

    setRegistrations((prev) => [newReg, ...prev]);
    return newReg;
  };

  const approveStudentId = (tokenId: string) => {
    setRegistrations((prev) =>
      prev.map((r) =>
        r.tokenId === tokenId
          ? { ...r, status: 'ID_Approved_Payment_Pending' as RegistrationStatus, rejectionReason: undefined }
          : r
      )
    );
  };

  const rejectStudentId = (tokenId: string, reason: string) => {
    setRegistrations((prev) =>
      prev.map((r) =>
        r.tokenId === tokenId
          ? { ...r, status: 'Rejected' as RegistrationStatus, rejectionReason: reason || 'Student ID verification failed.' }
          : r
      )
    );
  };

  const submitPayment = async (tokenId: string, utrNumber: string, paymentScreenshot: string): Promise<Registration> => {
    let updatedRecord: Registration | undefined;

    setRegistrations((prev) => {
      const next = prev.map((r) => {
        if (r.tokenId === tokenId) {
          updatedRecord = {
            ...r,
            utrNumber: utrNumber.trim(),
            paymentScreenshot,
            status: 'Pending_Payment_Verification' as RegistrationStatus,
          };
          return updatedRecord;
        }
        return r;
      });
      return next;
    });

    if (!updatedRecord) {
      throw new Error('Registration token not found');
    }
    return updatedRecord;
  };

  const approvePayment = (tokenId: string) => {
    setRegistrations((prev) =>
      prev.map((r) =>
        r.tokenId === tokenId
          ? {
              ...r,
              status: 'Approved' as RegistrationStatus,
              approvedAt: new Date().toISOString(),
              rejectionReason: undefined,
            }
          : r
      )
    );
  };

  const rejectPayment = (tokenId: string, reason: string) => {
    setRegistrations((prev) =>
      prev.map((r) =>
        r.tokenId === tokenId
          ? {
              ...r,
              status: 'Rejected' as RegistrationStatus,
              rejectionReason: reason || 'Payment UTR verification failed or duplicate transaction.',
            }
          : r
      )
    );
  };

  const toggleVip = (tokenId: string) => {
    setRegistrations((prev) =>
      prev.map((r) => (r.tokenId === tokenId ? { ...r, isVip: !r.isVip } : r))
    );
  };

  const deleteRegistration = (tokenId: string) => {
    setRegistrations((prev) => prev.filter((r) => r.tokenId !== tokenId));
  };

  const registerDriver = async (data: {
    driverName: string;
    phone: string;
    vehicleNumber: string;
    busRoute: string;
    collegeAffiliation: string;
  }): Promise<DriverRegistration> => {
    const driverId = `KRUP-DRV-0${drivers.length + 1}`;
    const newDriver: DriverRegistration = {
      id: 'drv-' + Date.now(),
      driverId,
      driverName: data.driverName.trim(),
      phone: data.phone.trim(),
      vehicleNumber: data.vehicleNumber.trim().toUpperCase(),
      busRoute: data.busRoute.trim(),
      collegeAffiliation: data.collegeAffiliation.trim(),
      status: 'Approved',
      appliedAt: new Date().toISOString(),
    };

    setDrivers((prev) => [newDriver, ...prev]);
    return newDriver;
  };

  const approveDriver = (driverId: string) => {
    setDrivers((prev) =>
      prev.map((d) => (d.driverId === driverId ? { ...d, status: 'Approved' } : d))
    );
  };

  const deleteDriver = (driverId: string) => {
    setDrivers((prev) => prev.filter((d) => d.driverId !== driverId));
  };

  // Gate QR Verification
  const scanPass = (tokenOrPayload: string): {
    success: boolean;
    code: 'VALID' | 'DUPLICATE' | 'INVALID';
    message: string;
    registration?: Registration;
  } => {
    // Extract token ID if payload is a JSON or URL string
    let token = tokenOrPayload.trim();
    if (token.includes('token=')) {
      const match = token.match(/token=([A-Z0-9-]+)/i);
      if (match) token = match[1];
    } else if (token.includes('KRUP-')) {
      const match = token.match(/(KRUP-2026-\d{4})/i);
      if (match) token = match[1];
    }

    const reg = registrations.find(
      (r) => r.tokenId.toUpperCase() === token.toUpperCase()
    );

    if (!reg) {
      return {
        success: false,
        code: 'INVALID',
        message: `Pass not found in system for code "${token}".`,
      };
    }

    if (reg.status !== 'Approved') {
      return {
        success: false,
        code: 'INVALID',
        message: `Pass for ${reg.fullName} (${reg.tokenId}) is NOT approved. Current Status: ${reg.status.replace(/_/g, ' ')}.`,
        registration: reg,
      };
    }

    if (reg.isGateScanned) {
      const timeStr = reg.scannedAt
        ? new Date(reg.scannedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        : 'Earlier today';
      return {
        success: false,
        code: 'DUPLICATE',
        message: `ALREADY SCANNED! Pass used at ${timeStr} (${reg.scannedBy || 'Gate Desk'}). Duplicate entry blocked.`,
        registration: reg,
      };
    }

    // Mark as scanned
    const nowIso = new Date().toISOString();
    setRegistrations((prev) =>
      prev.map((r) =>
        r.tokenId === reg.tokenId
          ? {
              ...r,
              isGateScanned: true,
              scannedAt: nowIso,
              scannedBy: 'Gate Officer - Alpha Desk',
            }
          : r
      )
    );

    const updated = {
      ...reg,
      isGateScanned: true,
      scannedAt: nowIso,
      scannedBy: 'Gate Officer - Alpha Desk',
    };

    return {
      success: true,
      code: 'VALID',
      message: `VALID ENTRY — ID & ₹${reg.ticketPrice} Payment Verified. Welcome to Kruponam 2026!`,
      registration: updated,
    };
  };

  const claimOnasadya = (tokenId: string): boolean => {
    let success = false;
    setRegistrations((prev) =>
      prev.map((r) => {
        if (r.tokenId === tokenId && !r.isOnasadyaClaimed) {
          success = true;
          return {
            ...r,
            isOnasadyaClaimed: true,
            onasadyaClaimedAt: new Date().toISOString(),
          };
        }
        return r;
      })
    );
    return success;
  };

  const updateSettings = (newSettings: Partial<SiteSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const setBaseOffset = (offset: number) => {
    setBaseBookedOffset(Math.max(0, Math.min(settings.totalCapacity, offset)));
  };

  const resetToDefaults = () => {
    localStorage.removeItem(REGISTRATIONS_KEY);
    localStorage.removeItem(DRIVERS_KEY);
    localStorage.removeItem(SETTINGS_KEY);
    localStorage.removeItem(OFFSET_KEY);
    setRegistrations(initialRegistrations);
    setDrivers(initialDrivers);
    setSettings(initialSiteSettings);
    setBaseBookedOffset(518);
  };

  const exportToCsv = () => {
    const headers = [
      'Token ID',
      'Full Name',
      'USN',
      'Department',
      'Batch',
      'Email',
      'Phone',
      'Status',
      'UTR Number',
      'Applied At',
      'Approved At',
      'Gate Scanned',
      'Scanned At',
      'Onasadya Claimed',
      'VIP Pass',
    ];

    const rows = registrations.map((r) => [
      `"${r.tokenId}"`,
      `"${r.fullName}"`,
      `"${r.usn}"`,
      `"${r.department}"`,
      `"${r.batchYear}"`,
      `"${r.collegeEmail}"`,
      `"${r.phone}"`,
      `"${r.status}"`,
      `"${r.utrNumber || ''}"`,
      `"${r.appliedAt}"`,
      `"${r.approvedAt || ''}"`,
      `"${r.isGateScanned ? 'YES' : 'NO'}"`,
      `"${r.scannedAt || ''}"`,
      `"${r.isOnasadyaClaimed ? 'YES' : 'NO'}"`,
      `"${r.isVip ? 'YES' : 'NO'}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Kruponam_2026_Attendees_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <TicketContext.Provider
      value={{
        registrations,
        drivers,
        settings,
        baseBookedOffset,
        totalClaimedPasses,
        remainingPasses,
        capacityPercentage,
        isSoldOut,
        isSellingFast,
        registerStudent,
        approveStudentId,
        rejectStudentId,
        submitPayment,
        approvePayment,
        rejectPayment,
        toggleVip,
        deleteRegistration,
        registerDriver,
        approveDriver,
        deleteDriver,
        scanPass,
        claimOnasadya,
        updateSettings,
        setBaseOffset,
        resetToDefaults,
        exportToCsv,
      }}
    >
      {children}
    </TicketContext.Provider>
  );
};

export const useTickets = () => {
  const context = useContext(TicketContext);
  if (!context) {
    throw new Error('useTickets must be used within a TicketProvider');
  }
  return context;
};
