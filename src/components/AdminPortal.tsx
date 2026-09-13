import React, { useState } from 'react';
import {
  X,
  Shield,
  Lock,
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  Download,
  Search,
  Eye,
  Star,
  Settings as SettingsIcon,
  Camera,
  Bus,
  RefreshCw,
  Trash2,
} from 'lucide-react';
import { useTickets } from '../context/TicketContext';
import { AdminQrScanner } from './AdminQrScanner';
import type { Registration } from '../types';

interface AdminPortalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenDigitalPass: (registration: Registration) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  isOpen,
  onClose,
  onOpenDigitalPass,
}) => {
  const {
    registrations,
    drivers,
    settings,
    totalClaimedPasses,
    capacityPercentage,
    approveStudentId,
    rejectStudentId,
    approvePayment,
    rejectPayment,
    toggleVip,
    deleteRegistration,
    approveDriver,
    deleteDriver,
    updateSettings,
    resetToDefaults,
    exportToCsv,
  } = useTickets();


  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  // Dashboard Tabs
  const [activeTab, setActiveTab] = useState<'students' | 'drivers' | 'scanner' | 'settings'>('students');

  // Filter & Search
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Proof Lightbox
  const [lightboxImage, setLightboxImage] = useState<{ url: string; title: string } | null>(null);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (pinInput.trim() === settings.adminPin || pinInput.trim() === 'kruponam2026admin') {
      setIsAuthenticated(true);
      setPinInput('');
    } else {
      setAuthError('Incorrect security PIN. Default is 2026.');
    }
  };

  // Analytics Computations
  const approvedTickets = registrations.filter((r) => r.status === 'Approved').length;
  const pendingIdReviews = registrations.filter((r) => r.status === 'Pending_ID_Approval').length;
  const pendingPayments = registrations.filter((r) => r.status === 'Pending_Payment_Verification').length;
  const totalRevenue = approvedTickets * settings.generalPassPrice;


  // Filtered registrations
  const filteredRegistrations = registrations.filter((r) => {
    const matchesFilter =
      statusFilter === 'ALL'
        ? true
        : statusFilter === 'VIP'
        ? r.isVip
        : r.status === statusFilter;

    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      r.fullName.toLowerCase().includes(q) ||
      r.tokenId.toLowerCase().includes(q) ||
      r.usn.toLowerCase().includes(q) ||
      r.phone.includes(q) ||
      (r.utrNumber && r.utrNumber.toLowerCase().includes(q));

    return matchesFilter && matchesQuery;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#FAF5EB] rounded-3xl max-w-6xl w-full border-2 border-[#D4AF37] shadow-2xl relative my-6 overflow-hidden animate-in zoom-in-95 duration-200 text-left flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-[#072617] px-6 py-4 text-white flex items-center justify-between border-b border-[#D4AF37]/40 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/20 flex items-center justify-center text-[#FDE68A]">
              <Shield className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div>
              <h3 className="font-['Cinzel'] font-bold text-lg text-white flex items-center gap-2">
                <span>Kruponam 2026 Admin Portal</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Strict 750 Cap Engine
                </span>
              </h3>
              <p className="text-[11px] text-[#FAF5EB]/70 font-sans">
                Festival Committee Operations & Security Verification
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Auth Screen vs Dashboard */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-12 max-w-md mx-auto text-center space-y-6 my-auto">
            <div className="w-16 h-16 rounded-full bg-[#0D472B]/10 text-[#0D472B] flex items-center justify-center mx-auto border border-[#D4AF37]/30">
              <Lock className="w-8 h-8 text-[#0D472B]" />
            </div>

            <div>
              <h4 className="font-['Cinzel'] font-bold text-2xl text-[#0D472B]">
                Protected Operations Portal
              </h4>
              <p className="text-xs text-stone-600 mt-1">
                Enter your administrative PIN to access ticket inventory, gate scanner, and student reviews.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-3">
              {authError && (
                <p className="text-xs text-red-600 font-semibold">{authError}</p>
              )}
              <input
                type="password"
                maxLength={16}
                autoFocus
                placeholder="Enter 4-Digit Admin PIN"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-stone-300 text-center font-mono text-xl tracking-widest outline-hidden focus:border-[#D4AF37] bg-white shadow-xs"
              />
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#0D472B] hover:bg-[#072617] text-[#FDE68A] font-bold text-sm transition-all shadow-md"
              >
                Authenticate & Enter
              </button>
            </form>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsAuthenticated(true);
                }}
                className="text-[11px] text-[#8C6B08] underline hover:text-[#0D472B]"
              >
                Quick demo bypass (Default PIN: 2026)
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            {/* Top Navigation Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 pb-3">
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('students')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeTab === 'students'
                      ? 'bg-[#0D472B] text-[#FDE68A] shadow-xs'
                      : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Student Passes ({registrations.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('drivers')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeTab === 'drivers'
                      ? 'bg-[#0D472B] text-[#FDE68A] shadow-xs'
                      : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
                  }`}
                >
                  <Bus className="w-3.5 h-3.5" />
                  <span>Driver Crew ({drivers.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('scanner')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeTab === 'scanner'
                      ? 'bg-[#0D472B] text-[#FDE68A] shadow-xs'
                      : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
                  }`}
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Gate Security Scanner</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('settings')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeTab === 'settings'
                      ? 'bg-[#0D472B] text-[#FDE68A] shadow-xs'
                      : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
                  }`}
                >
                  <SettingsIcon className="w-3.5 h-3.5" />
                  <span>Settings & Inventory</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={exportToCsv}
                  className="px-3 py-1.5 rounded-xl bg-white border border-stone-300 text-stone-700 hover:border-[#D4AF37] text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-[#0D472B]" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* KPI Stat Cards & Gauge */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-xs">
                <span className="text-[10px] font-mono uppercase text-stone-500 font-bold block">Capacity Cap</span>
                <p className="text-xl font-mono font-bold text-[#0D472B]">
                  {totalClaimedPasses} <span className="text-xs text-stone-400">/ {settings.totalCapacity}</span>
                </p>
                <div className="w-full bg-stone-100 h-1.5 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className="h-full bg-[#D4AF37]"
                    style={{ width: `${capacityPercentage}%` }}
                  />
                </div>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-xs">
                <span className="text-[10px] font-mono uppercase text-stone-500 font-bold block">Approved Passes</span>
                <p className="text-xl font-mono font-bold text-emerald-700">{approvedTickets}</p>
                <span className="text-[10px] text-emerald-600 font-medium">Ready for Gate Entry</span>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-xs">
                <span className="text-[10px] font-mono uppercase text-stone-500 font-bold block">Pending ID Check</span>
                <p className="text-xl font-mono font-bold text-amber-600">{pendingIdReviews}</p>
                <span className="text-[10px] text-stone-400">Awaiting Committee</span>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-xs">
                <span className="text-[10px] font-mono uppercase text-stone-500 font-bold block">Pending Payments</span>
                <p className="text-xl font-mono font-bold text-blue-600">{pendingPayments}</p>
                <span className="text-[10px] text-stone-400">UTR To Verify</span>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-xs">
                <span className="text-[10px] font-mono uppercase text-stone-500 font-bold block">Total Revenue</span>
                <p className="text-xl font-mono font-bold text-[#881337]">
                  ₹{(totalRevenue).toLocaleString('en-IN')}
                </p>
                <span className="text-[10px] text-stone-400">General Passes</span>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-xs">
                <span className="text-[10px] font-mono uppercase text-stone-500 font-bold block">Driver Passes</span>
                <p className="text-xl font-mono font-bold text-stone-800">{drivers.length}</p>
                <span className="text-[10px] text-emerald-600">Transit Fleet</span>
              </div>
            </div>

            {/* TAB 1: STUDENT PASSES */}
            {activeTab === 'students' && (
              <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
                {/* Search & Filter Controls */}
                <div className="p-4 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3 bg-stone-50/70">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {['ALL', 'Pending_ID_Approval', 'ID_Approved_Payment_Pending', 'Pending_Payment_Verification', 'Approved', 'Rejected', 'VIP'].map((f) => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => setStatusFilter(f)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                          statusFilter === f
                            ? 'bg-[#0D472B] text-[#FDE68A]'
                            : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
                        }`}
                      >
                        {f.replace(/_/g, ' ')}
                      </button>
                    ))}
                  </div>

                  <div className="relative w-full sm:w-64">
                    <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search Token, Name, USN, UTR..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-stone-300 text-xs bg-white outline-hidden focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#0D472B]/5 text-stone-600 font-mono text-[11px] uppercase tracking-wider border-b border-stone-200">
                      <tr>
                        <th className="py-3 px-4">Attendee & Token</th>
                        <th className="py-3 px-3">USN / Dept</th>
                        <th className="py-3 px-3">Proofs (ID & Payment)</th>
                        <th className="py-3 px-3">Status</th>
                        <th className="py-3 px-3">UTR / Amount</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 font-sans">
                      {filteredRegistrations.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-stone-400 text-xs">
                            No student applications match the filter criteria.
                          </td>
                        </tr>
                      ) : (
                        filteredRegistrations.map((reg) => (
                          <tr key={reg.id} className="hover:bg-stone-50/60 transition-colors">
                            {/* Attendee */}
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <div>
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-bold text-stone-900">{reg.fullName}</span>
                                    {reg.isVip && (
                                      <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 text-[10px] font-bold border border-amber-300">
                                        VIP
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[11px] font-mono text-[#8C6B08] font-bold">
                                    {reg.tokenId}
                                  </div>
                                  <div className="text-[11px] text-stone-400">{reg.phone}</div>
                                </div>
                              </div>
                            </td>

                            {/* USN & Dept */}
                            <td className="py-3 px-3">
                              <span className="font-mono font-bold text-stone-800 block">{reg.usn}</span>
                              <span className="text-[11px] text-stone-500 block truncate max-w-[150px]">
                                {reg.department}
                              </span>
                              <span className="text-[10px] text-stone-400">{reg.batchYear}</span>
                            </td>

                            {/* Proof Lightbox buttons */}
                            <td className="py-3 px-3">
                              <div className="flex items-center gap-1.5">
                                {reg.idCardPhoto ? (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setLightboxImage({
                                        url: reg.idCardPhoto,
                                        title: `Student ID: ${reg.fullName} (${reg.usn})`,
                                      })
                                    }
                                    className="p-1 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-700 text-[11px] flex items-center gap-1 border border-stone-200"
                                  >
                                    <Eye className="w-3 h-3 text-[#0D472B]" />
                                    <span>ID Proof</span>
                                  </button>
                                ) : (
                                  <span className="text-[10px] text-stone-400">No ID</span>
                                )}

                                {reg.paymentScreenshot ? (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setLightboxImage({
                                        url: reg.paymentScreenshot!,
                                        title: `Payment Receipt: ${reg.fullName} (UTR: ${reg.utrNumber})`,
                                      })
                                    }
                                    className="p-1 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] flex items-center gap-1 border border-blue-200"
                                  >
                                    <Eye className="w-3 h-3 text-blue-600" />
                                    <span>UTR Slip</span>
                                  </button>
                                ) : null}
                              </div>
                            </td>

                            {/* Status */}
                            <td className="py-3 px-3">
                              {reg.status === 'Approved' ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                                  <CheckCircle2 className="w-3 h-3" />
                                  Approved
                                </span>
                              ) : reg.status === 'ID_Approved_Payment_Pending' ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
                                  <Clock className="w-3 h-3" />
                                  Pay Pending
                                </span>
                              ) : reg.status === 'Pending_Payment_Verification' ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800">
                                  <Clock className="w-3 h-3" />
                                  Verify UTR
                                </span>
                              ) : reg.status === 'Rejected' ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-100 text-red-800">
                                  <AlertCircle className="w-3 h-3" />
                                  Rejected
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-stone-100 text-stone-700">
                                  <Clock className="w-3 h-3" />
                                  Review ID
                                </span>
                              )}
                              {reg.isGateScanned && (
                                <span className="block text-[10px] text-emerald-700 font-medium mt-0.5">
                                  ✓ Scanned at Gate
                                </span>
                              )}
                            </td>

                            {/* UTR & Price */}
                            <td className="py-3 px-3 font-mono">
                              <span className="font-bold text-stone-800 block">₹{reg.ticketPrice}</span>
                              <span className="text-[11px] text-stone-500 block">
                                {reg.utrNumber ? `UTR: ${reg.utrNumber}` : '—'}
                              </span>
                            </td>

                            {/* Actions */}
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                {/* If Pending ID Approval */}
                                {reg.status === 'Pending_ID_Approval' && (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() => approveStudentId(reg.tokenId)}
                                      className="px-2.5 py-1 rounded bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-bold"
                                    >
                                      Approve ID
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const reason = prompt('Rejection reason:');
                                        if (reason) rejectStudentId(reg.tokenId, reason);
                                      }}
                                      className="px-2 py-1 rounded bg-stone-100 hover:bg-red-50 text-red-600 text-[11px] border border-stone-200"
                                    >
                                      Reject
                                    </button>
                                  </>
                                )}

                                {/* If Pending Payment Verification */}
                                {reg.status === 'Pending_Payment_Verification' && (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() => approvePayment(reg.tokenId)}
                                      className="px-2.5 py-1 rounded bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-bold"
                                    >
                                      Approve Payment
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const reason = prompt('Rejection reason (invalid UTR/duplicate):');
                                        if (reason) rejectPayment(reg.tokenId, reason);
                                      }}
                                      className="px-2 py-1 rounded bg-stone-100 hover:bg-red-50 text-red-600 text-[11px] border border-stone-200"
                                    >
                                      Reject
                                    </button>
                                  </>
                                )}

                                {/* If Approved -> View Pass */}
                                {reg.status === 'Approved' && (
                                  <button
                                    type="button"
                                    onClick={() => onOpenDigitalPass(reg)}
                                    className="px-2.5 py-1 rounded bg-[#0D472B] hover:bg-[#072617] text-[#FDE68A] text-[11px] font-bold"
                                  >
                                    View Pass
                                  </button>
                                )}

                                {/* VIP Toggle */}
                                <button
                                  type="button"
                                  onClick={() => toggleVip(reg.tokenId)}
                                  className={`p-1 rounded ${
                                    reg.isVip ? 'text-amber-500 bg-amber-50' : 'text-stone-400 hover:text-amber-500'
                                  }`}
                                  title="Toggle VIP Delegate"
                                >
                                  <Star className="w-3.5 h-3.5 fill-current" />
                                </button>

                                {/* Delete */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (confirm(`Delete registration for ${reg.fullName}?`)) {
                                      deleteRegistration(reg.tokenId);
                                    }
                                  }}
                                  className="p-1 rounded text-stone-300 hover:text-red-600"
                                  title="Delete record"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 2: DRIVER PASSES */}
            {activeTab === 'drivers' && (
              <div className="bg-white rounded-3xl border border-stone-200 p-5 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-['Cinzel'] font-bold text-base text-[#0D472B]">
                    Transport Drivers & Transit Passes
                  </h4>
                  <span className="text-xs text-stone-500">
                    {drivers.length} Registered Drivers
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#0D472B]/5 font-mono text-[11px] uppercase border-b border-stone-200">
                      <tr>
                        <th className="py-2.5 px-3">Driver Name & ID</th>
                        <th className="py-2.5 px-3">Vehicle Number</th>
                        <th className="py-2.5 px-3">Designated Route</th>
                        <th className="py-2.5 px-3">Affiliation</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {drivers.map((drv) => (
                        <tr key={drv.id} className="hover:bg-stone-50">
                          <td className="py-3 px-3">
                            <span className="font-bold text-stone-900 block">{drv.driverName}</span>
                            <span className="font-mono text-emerald-800 text-[11px] font-bold">{drv.driverId}</span>
                            <span className="text-[11px] text-stone-400 block">{drv.phone}</span>
                          </td>
                          <td className="py-3 px-3 font-mono font-bold text-stone-800">
                            {drv.vehicleNumber}
                          </td>
                          <td className="py-3 px-3 text-stone-600">{drv.busRoute}</td>
                          <td className="py-3 px-3 text-stone-500">{drv.collegeAffiliation}</td>
                          <td className="py-3 px-3">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              {drv.status}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {drv.status === 'Pending' && (
                                <button
                                  type="button"
                                  onClick={() => approveDriver(drv.driverId)}
                                  className="px-2 py-0.5 rounded bg-emerald-700 hover:bg-emerald-800 text-white text-[10px] font-bold"
                                >
                                  Approve
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => deleteDriver(drv.driverId)}
                                className="p-1 text-stone-300 hover:text-red-600"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 3: GATE SECURITY SCANNER */}
            {activeTab === 'scanner' && (
              <AdminQrScanner />
            )}

            {/* TAB 4: SETTINGS & INVENTORY CONTROLS */}
            {activeTab === 'settings' && (
              <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-xs max-w-2xl space-y-6">
                <div>
                  <h4 className="font-['Cinzel'] font-bold text-lg text-[#0D472B]">
                    Festival Capacity & System Settings
                  </h4>
                  <p className="text-xs text-stone-500">
                    Control pass pricing, merchant payment UPI, and capacity limits.
                  </p>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-stone-700 uppercase tracking-wider mb-1">
                      Strict Pass Capacity Limit
                    </label>
                    <input
                      type="number"
                      value={settings.totalCapacity}
                      onChange={(e) => updateSettings({ totalCapacity: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 font-mono text-sm bg-stone-50"
                    />
                    <p className="text-[11px] text-stone-400 mt-1">Default is 750 passes.</p>
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 uppercase tracking-wider mb-1">
                      General Pass Price (INR ₹)
                    </label>
                    <input
                      type="number"
                      value={settings.generalPassPrice}
                      onChange={(e) => updateSettings({ generalPassPrice: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 font-mono text-sm bg-stone-50"
                    />
                    <p className="text-[11px] text-stone-400 mt-1">Default is ₹700 per pass.</p>
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 uppercase tracking-wider mb-1">
                      Merchant UPI ID (For Dynamic QR Generation)
                    </label>
                    <input
                      type="text"
                      value={settings.upiId}
                      onChange={(e) => updateSettings({ upiId: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 font-mono text-sm bg-stone-50"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 uppercase tracking-wider mb-1">
                      Registration Status
                    </label>
                    <div className="flex items-center gap-3 mt-1">
                      <button
                        type="button"
                        onClick={() => updateSettings({ isRegistrationOpen: !settings.isRegistrationOpen })}
                        className={`px-4 py-2 rounded-xl font-bold text-xs ${
                          settings.isRegistrationOpen
                            ? 'bg-emerald-700 text-white'
                            : 'bg-red-600 text-white'
                        }`}
                      >
                        {settings.isRegistrationOpen ? 'Registration Open' : 'Registration Locked / Paused'}
                      </button>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-stone-200">
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm('Reset system data and reload default realistic registrations?')) {
                          resetToDefaults();
                        }
                      }}
                      className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs flex items-center gap-2"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-stone-500" />
                      <span>Reset All to Default Seed Data</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Lightbox Modal for ID and UTR Proofs */}
        {lightboxImage && (
          <div
            className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4"
            onClick={() => setLightboxImage(null)}
          >
            <div
              className="bg-white rounded-2xl max-w-lg w-full p-4 space-y-3 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <h5 className="font-bold text-xs text-stone-800">{lightboxImage.title}</h5>
                <button
                  type="button"
                  onClick={() => setLightboxImage(null)}
                  className="p-1 text-stone-400 hover:text-stone-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="max-h-[75vh] overflow-auto rounded-lg border border-stone-200">
                <img
                  src={lightboxImage.url}
                  alt={lightboxImage.title}
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
