// src/Admin/pages/UnitRegistration.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  ClipboardList,
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Trash2,
  RefreshCw,
  X,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Clock,
  AlertCircle,
  Layers,
  Building2,
  BookOpen,
  Calendar,
  User,
  Hash,
  Download,
  Info,
  Award,
} from 'lucide-react';

// ============================================================
// API CONFIGURATION — JSON SERVER
// ============================================================

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// ============================================================
// DESIGN TOKENS
// ============================================================

const BRAND = {
  primary: '#6B4423',
  primaryDark: '#4A2F17',
  primaryLight: '#A67C52',
  primarySoft: '#F5EFE6',
  primaryBorder: '#E0D3C0',
  accent: '#8B5E34',
  accentLight: '#C9A87C',
  dark: '#3E2C1C',
};

// ============================================================
// CONSTANTS
// ============================================================

const SEMESTERS = ['Semester 1', 'Semester 2', 'Semester 3'];
const ACADEMIC_YEARS = ['2023/2024', '2024/2025', '2025/2026', '2026/2027'];
const STATUSES = ['Pending', 'Approved', 'Dropped', 'Completed', 'Rejected'];

const STATUS_CONFIG = {
  Pending: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    icon: Clock,
  },
  Approved: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    icon: CheckCircle,
  },
  Dropped: {
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
    icon: XCircle,
  },
  Completed: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    icon: Award,
  },
  Rejected: {
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
    icon: XCircle,
  },
};

const ITEMS_PER_PAGE = 10;

// ============================================================
// UTILITY
// ============================================================

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return 'N/A';
  }
};

// ============================================================
// SUB-COMPONENTS
// ============================================================

const StatusBadge = ({ status }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.Pending;
  const Icon = config.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.bg} ${config.text} ${config.border}`}
    >
      <Icon className="w-3.5 h-3.5" />
      {status || 'Pending'}
    </span>
  );
};

const StatCard = ({ icon: Icon, label, value, accent, active, onClick }) => {
  const accentMap = {
    brown: { bg: 'bg-[#F5EFE6]', text: 'text-[#6B4423]', bar: 'bg-[#6B4423]' },
    tan: { bg: 'bg-[#F5EFE6]', text: 'text-[#8B5E34]', bar: 'bg-[#8B5E34]' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-600', bar: 'bg-amber-500' },
    emerald: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-600',
      bar: 'bg-emerald-500',
    },
    red: { bg: 'bg-red-50', text: 'text-red-600', bar: 'bg-red-500' },
    blue: { bg: 'bg-blue-50', text: 'text-blue-600', bar: 'bg-blue-500' },
  };
  const c = accentMap[accent] || accentMap.brown;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative text-left bg-white rounded-xl border p-4 transition-all duration-200 overflow-hidden w-full ${
        active
          ? 'shadow-lg -translate-y-0.5'
          : 'border-gray-200 hover:shadow-md hover:-translate-y-0.5'
      }`}
      style={active ? { borderColor: BRAND.primary } : {}}
    >
      <div className={`absolute top-0 left-0 right-0 h-1 ${c.bar}`} />
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">
            {label}
          </p>
          <p
            className={`text-xl font-bold ${active ? '' : 'text-gray-900'}`}
            style={active ? { color: BRAND.primary } : {}}
          >
            {value}
          </p>
        </div>
        <div className={`p-2 rounded-lg ${c.bg} ${c.text}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
    </button>
  );
};

const TableSkeleton = () => (
  <div className="space-y-3 p-4">
    {[...Array(6)].map((_, i) => (
      <div key={i} className="flex items-center gap-4 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-24" />
        <div className="h-4 bg-gray-200 rounded w-24" />
        <div className="h-4 bg-gray-200 rounded w-40" />
        <div className="h-4 bg-gray-200 rounded w-20" />
        <div className="h-4 bg-gray-200 rounded w-32" />
        <div className="h-4 bg-gray-200 rounded w-20" />
      </div>
    ))}
  </div>
);

const EmptyState = ({ filtered }) => (
  <div className="flex flex-col items-center justify-center py-16 px-4">
    <div
      className="w-20 h-20 rounded-full flex items-center justify-center mb-5"
      style={{ backgroundColor: BRAND.primarySoft }}
    >
      {filtered ? (
        <Search className="w-10 h-10" style={{ color: BRAND.primary }} />
      ) : (
        <ClipboardList className="w-10 h-10" style={{ color: BRAND.primary }} />
      )}
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">
      {filtered ? 'No Matching Registrations' : 'No Registrations Yet'}
    </h3>
    <p className="text-sm text-gray-500 text-center max-w-md">
      {filtered
        ? 'No registrations match your current search or filter criteria. Try adjusting your filters.'
        : 'Student unit registrations will appear here as they are submitted.'}
    </p>
  </div>
);

// ============================================================
// REGISTRATION DETAILS MODAL
// ============================================================

const RegistrationDetailModal = ({ open, onClose, registration, loading }) => {
  if (!open) return null;

  const renderField = (icon, label, value) => (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
      <div
        className="p-2 rounded-lg flex-shrink-0"
        style={{ backgroundColor: BRAND.primarySoft }}
      >
        {React.createElement(icon, {
          className: 'w-4 h-4',
          style: { color: BRAND.primary },
        })}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
          {label}
        </p>
        <p className="text-sm font-semibold text-gray-900 mt-0.5 break-words">
          {value || '—'}
        </p>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <div
          className="flex items-center justify-between p-5 border-b border-gray-200"
          style={{
            background: `linear-gradient(to right, ${BRAND.primarySoft}, #ffffff)`,
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="p-2 rounded-lg"
              style={{ backgroundColor: BRAND.primarySoft }}
            >
              <ClipboardList
                className="w-5 h-5"
                style={{ color: BRAND.primary }}
              />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Registration Details
              </h2>
              {registration && (
                <p className="text-xs text-gray-500">
                  #{registration.id}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading || !registration ? (
            <div className="flex items-center justify-center py-20">
              <Loader2
                className="w-8 h-8 animate-spin"
                style={{ color: BRAND.primary }}
              />
            </div>
          ) : (
            <div className="p-5 space-y-5">
              {/* Student Info */}
              <div>
                <h4
                  className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2"
                  style={{ color: BRAND.accent }}
                >
                  <User className="w-4 h-4" /> Student Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {renderField(Hash, 'Student ID', registration.studentId)}
                  {renderField(
                    User,
                    'Full Name',
                    registration.studentName
                  )}
                  {renderField(BookOpen, 'Program', registration.program)}
                  {renderField(
                    Building2,
                    'Department',
                    registration.department
                  )}
                </div>
              </div>

              {/* Unit Info */}
              <div>
                <h4
                  className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2"
                  style={{ color: BRAND.accent }}
                >
                  <BookOpen className="w-4 h-4" /> Unit Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {renderField(Hash, 'Unit Code', registration.unitCode)}
                  {renderField(BookOpen, 'Unit Name', registration.unitName)}
                  {renderField(
                    Layers,
                    'Credit Hours',
                    registration.creditHours
                  )}
                  {renderField(User, 'Lecturer', registration.lecturer)}
                </div>
              </div>

              {/* Registration Info */}
              <div>
                <h4
                  className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2"
                  style={{ color: BRAND.accent }}
                >
                  <ClipboardList className="w-4 h-4" /> Registration
                  Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {renderField(Hash, 'Registration ID', registration.id)}
                  {renderField(Calendar, 'Semester', registration.semester)}
                  {renderField(
                    Calendar,
                    'Academic Year',
                    registration.academicYear
                  )}
                  {renderField(
                    Calendar,
                    'Registration Date',
                    formatDate(
                      registration.registrationDate || registration.createdAt
                    )
                  )}
                  {renderField(
                    Clock,
                    'Last Updated',
                    formatDate(registration.updatedAt)
                  )}
                </div>
              </div>

              {/* Status */}
              <div>
                <h4
                  className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2"
                  style={{ color: BRAND.accent }}
                >
                  <CheckCircle className="w-4 h-4" /> Status
                </h4>
                <div className="p-4 bg-gray-50 rounded-lg flex items-center justify-between">
                  <span className="text-sm text-gray-600">Current Status</span>
                  <StatusBadge status={registration.status} />
                </div>
              </div>

              {registration.adminRemarks && (
                <div
                  className="rounded-lg p-4 border"
                  style={{
                    backgroundColor: BRAND.primarySoft,
                    borderColor: BRAND.primaryBorder,
                  }}
                >
                  <p
                    className="text-xs font-bold uppercase tracking-wider mb-1.5"
                    style={{ color: BRAND.accent }}
                  >
                    Admin Remarks
                  </p>
                  <p className="text-sm" style={{ color: BRAND.primaryDark }}>
                    {registration.adminRemarks}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 p-5 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// CONFIRM MODAL
// ============================================================

const ConfirmModal = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  loading,
  variant = 'primary',
}) => {
  if (!open) return null;

  const colors = {
    primary: {
      bg: BRAND.primary,
      hover: BRAND.primaryDark,
      icon: CheckCircle,
    },
    danger: { bg: '#dc2626', hover: '#b91c1c', icon: XCircle },
  };
  const c = colors[variant] || colors.primary;
  const Icon = c.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="p-6 text-center">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: `${c.bg}15` }}
          >
            <Icon className="w-8 h-8" style={{ color: c.bg }} />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-sm text-gray-600 leading-relaxed">{message}</p>
        </div>

        <div className="flex items-center gap-3 p-5 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white rounded-lg transition-colors disabled:opacity-60"
            style={{ backgroundColor: c.bg }}
            onMouseEnter={(e) => {
              if (!loading) e.currentTarget.style.backgroundColor = c.hover;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = c.bg;
            }}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing...
              </>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// MAIN COMPONENT
// ============================================================

const UnitRegistration = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [registrations, setRegistrations] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    dropped: 0,
    completed: 0,
    currentSemester: 0,
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    program: '',
    department: '',
    unit: '',
    semester: '',
    academicYear: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedReg, setSelectedReg] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const [approveModal, setApproveModal] = useState(false);
  const [dropModal, setDropModal] = useState(false);
  const [actionReg, setActionReg] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // ============================================================
  // API — JSON SERVER
  // ============================================================

  const fetchRegistrations = useCallback(
    async (showRefresh = false) => {
      if (showRefresh) setRefreshing(true);
      else setLoading(true);

      try {
        const params = {};
        if (filters.status) params.status = filters.status;
        if (filters.program) params.program = filters.program;
        if (filters.department) params.department = filters.department;
        if (filters.semester) params.semester = filters.semester;
        if (filters.academicYear) params.academicYear = filters.academicYear;

        // GET /unitRegistrations
        const response = await api.get('/unitRegistrations', { params });
        const list = Array.isArray(response.data) ? response.data : [];

        setRegistrations(list);

        // Compute stats
        const pending = list.filter((r) => r.status === 'Pending').length;
        const approved = list.filter((r) => r.status === 'Approved').length;
        const dropped = list.filter((r) => r.status === 'Dropped').length;
        const completed = list.filter((r) => r.status === 'Completed').length;

        // "This Semester" = most common semester in the list
        const semesterCounts = {};
        list.forEach((r) => {
          if (r.semester) {
            semesterCounts[r.semester] =
              (semesterCounts[r.semester] || 0) + 1;
          }
        });
        const topSemester = Object.entries(semesterCounts).sort(
          (a, b) => b[1] - a[1]
        )[0]?.[0];
        const currentSemester = topSemester
          ? list.filter((r) => r.semester === topSemester).length
          : 0;

        setStats({
          total: list.length,
          pending,
          approved,
          dropped,
          completed,
          currentSemester,
        });

        if (showRefresh)
          toast.success('Registrations refreshed successfully');
      } catch (error) {
        console.error('Error fetching registrations:', error);
        if (!error.response) {
          toast.error(
            'Cannot reach JSON Server. Make sure it is running on port 5000.'
          );
        } else {
          toast.error('Registrations could not be loaded. Please try again.');
        }
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [filters]
  );

  const fetchRegistrationDetails = async (id) => {
    setLoadingDetail(true);
    try {
      // GET /unitRegistrations/:id
      const response = await api.get(`/unitRegistrations/${id}`);
      return response.data;
    } catch (error) {
      toast.error('Registration details could not be loaded.');
      return null;
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleView = async (reg) => {
    setSelectedReg(reg);
    setDetailOpen(true);
    const full = await fetchRegistrationDetails(reg.id);
    if (full) setSelectedReg(full);
  };

  const handleApprove = async () => {
    if (!actionReg) return;
    setActionLoading(true);
    try {
      // PATCH /unitRegistrations/:id
      await api.patch(`/unitRegistrations/${actionReg.id}`, {
        status: 'Approved',
        updatedAt: new Date().toISOString(),
      });
      toast.success('Unit registration approved successfully.');
      setApproveModal(false);
      setActionReg(null);
      fetchRegistrations(true);
    } catch (error) {
      console.error('Approve error:', error);
      toast.error('Unable to approve registration.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDrop = async () => {
    if (!actionReg) return;
    setActionLoading(true);
    try {
      // PATCH /unitRegistrations/:id (soft drop)
      await api.patch(`/unitRegistrations/${actionReg.id}`, {
        status: 'Dropped',
        updatedAt: new Date().toISOString(),
      });
      toast.success('Registration dropped successfully.');
      setDropModal(false);
      setActionReg(null);
      fetchRegistrations(true);
    } catch (error) {
      console.error('Drop error:', error);
      toast.error('Unable to drop registration.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDownloadReport = async () => {
    setDownloading(true);
    try {
      // JSON Server has no PDF endpoint — export current list as JSON
      const blob = new Blob([JSON.stringify(registrations, null, 2)], {
        type: 'application/json',
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Unit_Registration_Report_${
        filters.academicYear || 'current'
      }.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Registration report downloaded');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Registration report is currently unavailable.');
    } finally {
      setDownloading(false);
    }
  };

  // ============================================================
  // FILTERING
  // ============================================================

  const filteredRegistrations = useMemo(() => {
    let result = [...registrations];
    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      result = result.filter((r) => {
        const fullName = `${r.studentName || ''}`.toLowerCase();
        return (
          String(r.id || '').toLowerCase().includes(s) ||
          String(r.studentId || '').toLowerCase().includes(s) ||
          fullName.includes(s) ||
          String(r.unitCode || '').toLowerCase().includes(s) ||
          String(r.unitName || '').toLowerCase().includes(s)
        );
      });
    }
    if (filters.status)
      result = result.filter((r) => r.status === filters.status);
    if (filters.program)
      result = result.filter((r) => r.program === filters.program);
    if (filters.department)
      result = result.filter((r) => r.department === filters.department);
    if (filters.unit)
      result = result.filter(
        (r) => r.unitCode === filters.unit || r.unitName === filters.unit
      );
    if (filters.semester)
      result = result.filter((r) => r.semester === filters.semester);
    if (filters.academicYear)
      result = result.filter((r) => r.academicYear === filters.academicYear);
    return result;
  }, [registrations, searchTerm, filters]);

  const totalPages = Math.ceil(filteredRegistrations.length / ITEMS_PER_PAGE);
  const paginated = filteredRegistrations.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const hasActiveFilters = Boolean(
    searchTerm ||
      filters.status ||
      filters.program ||
      filters.department ||
      filters.unit ||
      filters.semester ||
      filters.academicYear
  );

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilters({
      status: '',
      program: '',
      department: '',
      unit: '',
      semester: '',
      academicYear: '',
    });
  };

  useEffect(() => {
    fetchRegistrations();
  }, [fetchRegistrations]);

  const programOptions = useMemo(
    () => [...new Set(registrations.map((r) => r.program).filter(Boolean))],
    [registrations]
  );
  const departmentOptions = useMemo(
    () => [...new Set(registrations.map((r) => r.department).filter(Boolean))],
    [registrations]
  );
  const unitOptions = useMemo(
    () =>
      [
        ...new Set(
          registrations
            .map((r) => r.unitCode)
            .filter(Boolean)
            .map((code) => {
              const unit = registrations.find((x) => x.unitCode === code);
              return unit ? `${code} — ${unit.unitName}` : code;
            })
        ),
      ],
    [registrations]
  );

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* PAGE HEADER */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1
                className="text-2xl sm:text-3xl font-bold flex items-center gap-3"
                style={{ color: BRAND.primary }}
              >
                <div
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: BRAND.primarySoft }}
                >
                  <ClipboardList
                    className="w-6 h-6"
                    style={{ color: BRAND.primary }}
                  />
                </div>
                Unit Registration
              </h1>
              <p className="text-sm text-gray-500 mt-1 ml-11">
                Manage and approve student unit registrations.
              </p>
            </div>

            <div className="flex items-center gap-2 ml-11 sm:ml-0">
              <button
                onClick={() => fetchRegistrations(true)}
                disabled={refreshing}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <RefreshCw
                  className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`}
                />
                <span className="hidden sm:inline">Refresh</span>
              </button>
              <button
                onClick={handleDownloadReport}
                disabled={downloading || registrations.length === 0}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: BRAND.primary }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = BRAND.primaryDark)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = BRAND.primary)
                }
              >
                {downloading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                <span className="hidden sm:inline">
                  {downloading ? 'Downloading...' : 'Download Report'}
                </span>
                <span className="sm:hidden">Report</span>
              </button>
            </div>
          </div>
        </div>

        {/* STATISTICS */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          <StatCard
            icon={ClipboardList}
            label="Total"
            value={stats.total}
            accent="brown"
            active={!filters.status}
            onClick={() => setFilters((f) => ({ ...f, status: '' }))}
          />
          <StatCard
            icon={Clock}
            label="Pending"
            value={stats.pending}
            accent="amber"
            active={filters.status === 'Pending'}
            onClick={() =>
              setFilters((f) => ({
                ...f,
                status: f.status === 'Pending' ? '' : 'Pending',
              }))
            }
          />
          <StatCard
            icon={CheckCircle}
            label="Approved"
            value={stats.approved}
            accent="emerald"
            active={filters.status === 'Approved'}
            onClick={() =>
              setFilters((f) => ({
                ...f,
                status: f.status === 'Approved' ? '' : 'Approved',
              }))
            }
          />
          <StatCard
            icon={XCircle}
            label="Dropped"
            value={stats.dropped}
            accent="red"
            active={filters.status === 'Dropped'}
            onClick={() =>
              setFilters((f) => ({
                ...f,
                status: f.status === 'Dropped' ? '' : 'Dropped',
              }))
            }
          />
          <StatCard
            icon={Award}
            label="Completed"
            value={stats.completed}
            accent="blue"
            active={filters.status === 'Completed'}
            onClick={() =>
              setFilters((f) => ({
                ...f,
                status: f.status === 'Completed' ? '' : 'Completed',
              }))
            }
          />
          <StatCard
            icon={Calendar}
            label="This Semester"
            value={stats.currentSemester}
            accent="tan"
            active={false}
            onClick={() => {}}
          />
        </div>

        {/* SEARCH & FILTERS */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by registration ID, student ID, name, unit code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg outline-none transition-all"
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = BRAND.primary;
                  e.currentTarget.style.boxShadow = `0 0 0 3px ${BRAND.primarySoft}`;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#d1d5db';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              onClick={() => setShowFilters((v) => !v)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg border transition-colors ${
                showFilters || hasActiveFilters
                  ? ''
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
              style={
                showFilters || hasActiveFilters
                  ? {
                      backgroundColor: BRAND.primarySoft,
                      color: BRAND.primaryDark,
                      borderColor: BRAND.primaryBorder,
                    }
                  : {}
              }
            >
              <Filter className="w-4 h-4" />
              Filters
              {hasActiveFilters && (
                <span
                  className="ml-1 px-1.5 py-0.5 text-xs text-white rounded-full"
                  style={{ backgroundColor: BRAND.primary }}
                >
                  {
                    [
                      filters.status,
                      filters.program,
                      filters.department,
                      filters.unit,
                      filters.semester,
                      filters.academicYear,
                    ].filter(Boolean).length
                  }
                </span>
              )}
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  showFilters ? 'rotate-180' : ''
                }`}
              />
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { key: 'status', label: 'Status', options: STATUSES },
                  { key: 'program', label: 'Program', options: programOptions },
                  {
                    key: 'department',
                    label: 'Department',
                    options: departmentOptions,
                  },
                  { key: 'unit', label: 'Unit', options: unitOptions },
                  { key: 'semester', label: 'Semester', options: SEMESTERS },
                  {
                    key: 'academicYear',
                    label: 'Academic Year',
                    options: ACADEMIC_YEARS,
                  },
                ].map(({ key, label, options }) => (
                  <div key={key}>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">
                      {label}
                    </label>
                    <select
                      value={filters[key]}
                      onChange={(e) =>
                        setFilters((f) => ({ ...f, [key]: e.target.value }))
                      }
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none"
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = BRAND.primary;
                        e.currentTarget.style.boxShadow = `0 0 0 3px ${BRAND.primarySoft}`;
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = '#d1d5db';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <option value="">All</option>
                      {options.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>

              {hasActiveFilters && (
                <div className="mt-3 flex justify-end">
                  <button
                    onClick={handleClearFilters}
                    className="text-xs font-medium inline-flex items-center gap-1"
                    style={{ color: BRAND.primary }}
                  >
                    <X className="w-3.5 h-3.5" />
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* REGISTRATIONS TABLE */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {loading ? (
            <TableSkeleton />
          ) : filteredRegistrations.length === 0 ? (
            <EmptyState filtered={registrations.length > 0} />
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr
                      className="border-b border-gray-200"
                      style={{ backgroundColor: BRAND.primarySoft }}
                    >
                      {[
                        'Reg ID',
                        'Student ID',
                        'Student Name',
                        'Program',
                        'Unit Code',
                        'Unit Name',
                        'Credit Hrs',
                        'Semester',
                        'Academic Year',
                        'Reg. Date',
                        'Status',
                      ].map((h) => (
                        <th
                          key={h}
                          className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap"
                          style={{ color: BRAND.primaryDark }}
                        >
                          {h}
                        </th>
                      ))}
                      <th
                        className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider"
                        style={{ color: BRAND.primaryDark }}
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {paginated.map((reg) => (
                      <tr
                        key={reg.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-3.5">
                          <span
                            className="text-sm font-semibold"
                            style={{ color: BRAND.primary }}
                          >
                            #{reg.id}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="text-sm text-gray-700">
                            {reg.studentId || '—'}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="text-sm font-medium text-gray-900 block max-w-[180px] truncate">
                            {reg.studentName || '—'}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="text-sm text-gray-600 block max-w-[180px] truncate">
                            {reg.program || '—'}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span
                            className="text-sm font-semibold"
                            style={{ color: BRAND.primary }}
                          >
                            {reg.unitCode || '—'}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="text-sm text-gray-700 block max-w-[220px] truncate">
                            {reg.unitName || '—'}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="inline-flex items-center gap-1 text-sm text-gray-700">
                            <Layers className="w-3.5 h-3.5 text-gray-400" />
                            {reg.creditHours || '—'}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="text-sm text-gray-600 whitespace-nowrap">
                            {reg.semester || '—'}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="text-sm text-gray-600 whitespace-nowrap">
                            {reg.academicYear || '—'}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="text-sm text-gray-600 whitespace-nowrap">
                            {formatDate(
                              reg.registrationDate || reg.createdAt
                            )}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <StatusBadge status={reg.status} />
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => handleView(reg)}
                              className="p-1.5 text-gray-500 rounded-lg transition-colors"
                              title="View Details"
                              onMouseEnter={(e) => {
                                e.currentTarget.style.color = BRAND.primary;
                                e.currentTarget.style.backgroundColor =
                                  BRAND.primarySoft;
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.color = '#6b7280';
                                e.currentTarget.style.backgroundColor =
                                  'transparent';
                              }}
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {reg.status === 'Pending' && (
                              <button
                                onClick={() => {
                                  setActionReg(reg);
                                  setApproveModal(true);
                                }}
                                className="p-1.5 text-gray-500 rounded-lg transition-colors"
                                title="Approve"
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.color = '#059669';
                                  e.currentTarget.style.backgroundColor =
                                    '#ecfdf5';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.color = '#6b7280';
                                  e.currentTarget.style.backgroundColor =
                                    'transparent';
                                }}
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                            )}
                            {(reg.status === 'Pending' ||
                              reg.status === 'Approved') && (
                              <button
                                onClick={() => {
                                  setActionReg(reg);
                                  setDropModal(true);
                                }}
                                className="p-1.5 text-gray-500 rounded-lg transition-colors"
                                title="Drop Registration"
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.color = '#dc2626';
                                  e.currentTarget.style.backgroundColor =
                                    '#fef2f2';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.color = '#6b7280';
                                  e.currentTarget.style.backgroundColor =
                                    'transparent';
                                }}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="lg:hidden divide-y divide-gray-100">
                {paginated.map((reg) => (
                  <div
                    key={reg.id}
                    className="p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span
                            className="text-sm font-bold"
                            style={{ color: BRAND.primary }}
                          >
                            #{reg.id}
                          </span>
                          <StatusBadge status={reg.status} />
                        </div>
                        <h3 className="text-sm font-semibold text-gray-900 truncate">
                          {reg.unitCode} — {reg.unitName}
                        </h3>
                        <p className="text-xs text-gray-500 truncate">
                          {reg.studentName}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <Hash className="w-3.5 h-3.5 text-gray-400" />
                        {reg.studentId || '—'}
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <Layers className="w-3.5 h-3.5 text-gray-400" />
                        {reg.creditHours} Credit Hours
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <BookOpen className="w-3.5 h-3.5 text-gray-400" />
                        {reg.program || '—'}
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        {reg.semester || '—'}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                      <button
                        onClick={() => handleView(reg)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg transition-colors"
                        style={{
                          color: BRAND.primary,
                          backgroundColor: BRAND.primarySoft,
                        }}
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View
                      </button>
                      {reg.status === 'Pending' && (
                        <button
                          onClick={() => {
                            setActionReg(reg);
                            setApproveModal(true);
                          }}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-emerald-700 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          Approve
                        </button>
                      )}
                      {(reg.status === 'Pending' ||
                        reg.status === 'Approved') && (
                        <button
                          onClick={() => {
                            setActionReg(reg);
                            setDropModal(true);
                          }}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Drop
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-gray-200 bg-gray-50">
                  <p className="text-xs text-gray-600">
                    Showing{' '}
                    <span className="font-semibold">
                      {(currentPage - 1) * ITEMS_PER_PAGE + 1}
                    </span>{' '}
                    to{' '}
                    <span className="font-semibold">
                      {Math.min(
                        currentPage * ITEMS_PER_PAGE,
                        filteredRegistrations.length
                      )}
                    </span>{' '}
                    of{' '}
                    <span className="font-semibold">
                      {filteredRegistrations.length}
                    </span>{' '}
                    registrations
                  </p>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="p-2 text-gray-600 hover:bg-white rounded-lg border border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    {[...Array(totalPages)].map((_, i) => {
                      const page = i + 1;
                      if (
                        page === 1 ||
                        page === totalPages ||
                        Math.abs(page - currentPage) <= 1
                      ) {
                        const active = currentPage === page;
                        return (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`min-w-[36px] px-3 py-2 text-xs font-semibold rounded-lg border transition-colors ${
                              active
                                ? 'text-white border-transparent'
                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                            }`}
                            style={
                              active ? { backgroundColor: BRAND.primary } : {}
                            }
                          >
                            {page}
                          </button>
                        );
                      } else if (
                        page === currentPage - 2 ||
                        page === currentPage + 2
                      ) {
                        return (
                          <span key={page} className="px-2 text-gray-400">
                            ...
                          </span>
                        );
                      }
                      return null;
                    })}
                    <button
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="p-2 text-gray-600 hover:bg-white rounded-lg border border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Info footer */}
        {!loading && registrations.length > 0 && (
          <div
            className="mt-4 flex items-start gap-2 p-3 rounded-lg border"
            style={{
              backgroundColor: BRAND.primarySoft,
              borderColor: BRAND.primaryBorder,
            }}
          >
            <Info
              className="w-4 h-4 flex-shrink-0 mt-0.5"
              style={{ color: BRAND.primary }}
            />
            <p className="text-xs" style={{ color: BRAND.primaryDark }}>
              Approving a registration makes the unit official for the student.
              Approvals are validated by the backend for credit limits,
              prerequisites, and timetable conflicts.
            </p>
          </div>
        )}
      </div>

      {/* MODALS */}
      <RegistrationDetailModal
        open={detailOpen}
        onClose={() => {
          setDetailOpen(false);
          setSelectedReg(null);
        }}
        registration={selectedReg}
        loading={loadingDetail}
      />

      <ConfirmModal
        open={approveModal}
        onClose={() => {
          setApproveModal(false);
          setActionReg(null);
        }}
        onConfirm={handleApprove}
        title="Approve Registration?"
        message={`Approve the unit registration for ${
          actionReg?.studentName || 'this student'
        } in ${actionReg?.unitCode || 'this unit'}? The student will see this
        unit as approved.`}
        confirmText="Approve Registration"
        loading={actionLoading}
        variant="primary"
      />

      <ConfirmModal
        open={dropModal}
        onClose={() => {
          setDropModal(false);
          setActionReg(null);
        }}
        onConfirm={handleDrop}
        title="Drop Registration?"
        message={`Are you sure you want to drop the registration for ${
          actionReg?.studentName || 'this student'
        } in ${actionReg?.unitCode || 'this unit'}? This action cannot be
        undone.`}
        confirmText="Drop Registration"
        loading={actionLoading}
        variant="danger"
      />
    </div>
  );
};

export default UnitRegistration;