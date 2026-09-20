// src/users/pages/MyRegisteredUnits.jsx
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  BookOpen,
  Search,
  Filter,
  Eye,
  Trash2,
  Download,
  RefreshCw,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  User,
  Building2,
  BookMarked,
  Layers,
  X,
  Info,
  Loader2,
  PlusCircle,
  Award,
  AlertTriangle,
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
// CURRENT STUDENT
// ============================================================

function getCurrentStudent() {
  try {
    const raw =
      localStorage.getItem('user') || sessionStorage.getItem('user');
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

// ============================================================
// DESIGN TOKENS — Brown Sidebar Theme
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

const SEMESTERS = ['Semester 1', 'Semester 2', 'Semester 3'];
const ACADEMIC_YEARS = ['2023/2024', '2024/2025', '2025/2026'];
const STATUSES = ['Pending', 'Approved', 'Dropped', 'Completed'];

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
  Registered: {
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
};

const ITEMS_PER_PAGE = 10;

// ============================================================
// UTILITY FUNCTIONS
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

const SummaryCard = ({ icon: Icon, label, value, accent, subtitle }) => {
  const accentMap = {
    brown: { bg: 'bg-[#F5EFE6]', text: 'text-[#6B4423]', bar: 'bg-[#6B4423]' },
    tan: { bg: 'bg-[#F5EFE6]', text: 'text-[#8B5E34]', bar: 'bg-[#8B5E34]' },
    cream: { bg: 'bg-[#F5EFE6]', text: 'text-[#A67C52]', bar: 'bg-[#A67C52]' },
    emerald: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-600',
      bar: 'bg-emerald-500',
    },
    blue: { bg: 'bg-blue-50', text: 'text-blue-600', bar: 'bg-blue-500' },
  };
  const c = accentMap[accent] || accentMap.brown;

  return (
    <div className="relative bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 overflow-hidden">
      <div className={`absolute top-0 left-0 right-0 h-1 ${c.bar}`} />
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
            {label}
          </p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${c.bg} ${c.text}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};

const TableSkeleton = () => (
  <div className="space-y-3 p-4">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="flex items-center gap-4 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-20" />
        <div className="h-4 bg-gray-200 rounded w-48" />
        <div className="h-4 bg-gray-200 rounded w-16" />
        <div className="h-4 bg-gray-200 rounded w-32" />
        <div className="h-4 bg-gray-200 rounded w-24" />
        <div className="h-4 bg-gray-200 rounded w-20" />
      </div>
    ))}
  </div>
);

const EmptyState = ({ onRegister }) => (
  <div className="flex flex-col items-center justify-center py-16 px-4">
    <div
      className="w-20 h-20 rounded-full flex items-center justify-center mb-5"
      style={{ backgroundColor: BRAND.primarySoft }}
    >
      <BookOpen className="w-10 h-10" style={{ color: BRAND.primary }} />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">
      No Units Registered
    </h3>
    <p className="text-sm text-gray-500 text-center max-w-md mb-6">
      You haven't registered for any units yet. Start by browsing available
      units and register for the current semester.
    </p>
    <button
      onClick={onRegister}
      className="inline-flex items-center gap-2 px-5 py-2.5 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm"
      style={{ backgroundColor: BRAND.primary }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.backgroundColor = BRAND.primaryDark)
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.backgroundColor = BRAND.primary)
      }
    >
      <PlusCircle className="w-4 h-4" />
      Register Units
    </button>
  </div>
);

// ============================================================
// MAIN COMPONENT
// ============================================================

const MyRegisteredUnits = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [units, setUnits] = useState([]);
  const [filteredUnits, setFilteredUnits] = useState([]);
  const [academicPeriod, setAcademicPeriod] = useState(null);
  const [stats, setStats] = useState({
    totalUnits: 0,
    totalCredits: 0,
    completedUnits: 0,
    currentUnits: 0,
    pendingRegistrations: 0,
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    semester: '',
    academicYear: '',
    status: '',
    department: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  const [selectedUnit, setSelectedUnit] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [dropModalOpen, setDropModalOpen] = useState(false);
  const [unitToDrop, setUnitToDrop] = useState(null);
  const [dropping, setDropping] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const [dropAllowed, setDropAllowed] = useState(true);
  const [dropDeadline, setDropDeadline] = useState(null);

  // ============================================================
  // API — JSON SERVER
  // ============================================================

  const fetchRegisteredUnits = useCallback(async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const student = getCurrentStudent();
      if (!student?.studentId) {
        setUnits([]);
        setFilteredUnits([]);
        setLoading(false);
        setRefreshing(false);
        return;
      }

      // GET /unitRegistrations?studentId=...
      const response = await api.get('/unitRegistrations', {
        params: { studentId: student.studentId },
      });

      const list = Array.isArray(response.data) ? response.data : [];
      setUnits(list);
      setFilteredUnits(list);

      // Derive academic period from first record
      if (list.length > 0) {
        const sample = list[0];
        setAcademicPeriod({
          academicYear: sample.academicYear || '2025/2026',
          semester: sample.semester || 'Semester 1',
          program: sample.program || student.program || '—',
          yearOfStudy: student.yearOfStudy || '—',
          registrationDate:
            sample.registrationDate || sample.createdAt,
          registrationStatus: sample.status || 'Pending',
        });
      } else {
        setAcademicPeriod(null);
      }

      // Stats
      const completed = list.filter(
        (u) => (u.status || '').toLowerCase() === 'completed'
      ).length;
      const pending = list.filter(
        (u) => (u.status || '').toLowerCase() === 'pending'
      ).length;
      const current = list.filter((u) =>
        ['approved', 'registered'].includes(
          (u.status || '').toLowerCase()
        )
      ).length;
      const totalCredits = list.reduce(
        (sum, u) => sum + (parseInt(u.creditHours) || 0),
        0
      );

      setStats({
        totalUnits: list.length,
        totalCredits,
        completedUnits: completed,
        currentUnits: current,
        pendingRegistrations: pending,
      });

      if (showRefresh) toast.success('Units refreshed successfully');
    } catch (error) {
      console.error('Error fetching registered units:', error);
      if (!error.response) {
        toast.error(
          'Cannot reach JSON Server. Make sure it is running on port 5000.'
        );
      } else {
        toast.error('Failed to load registered units. Please try again.');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const handleDropUnit = async () => {
    if (!unitToDrop) return;
    setDropping(true);
    try {
      const registrationId = unitToDrop.id || unitToDrop.registrationId;
      // DELETE /unitRegistrations/:id
      await api.delete(`/unitRegistrations/${registrationId}`);

      toast.success('Unit dropped successfully.');
      setDropModalOpen(false);
      setUnitToDrop(null);
      fetchRegisteredUnits(true);
    } catch (error) {
      console.error('Error dropping unit:', error);
      if (!error.response) {
        toast.error('Network error. Please try again.');
      } else {
        toast.error('Failed to drop unit. Please try again.');
      }
    } finally {
      setDropping(false);
    }
  };

  const handleDownloadSlip = async () => {
    setDownloading(true);
    try {
      // JSON Server has no PDF endpoint — export the current list as JSON
      const blob = new Blob([JSON.stringify(units, null, 2)], {
        type: 'application/json',
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Registration_Slip_${
        academicPeriod?.academicYear || 'current'
      }.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Registration slip downloaded');
    } catch (error) {
      console.error('Error downloading slip:', error);
      toast.error('Failed to download registration slip. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const handleViewUnit = (unit) => {
    setSelectedUnit(unit);
    setViewModalOpen(true);
  };

  const handleOpenDropModal = (unit) => {
    if (!dropAllowed) {
      toast.warning(
        'Dropping units is currently not allowed. Please contact the registrar.'
      );
      return;
    }
    setUnitToDrop(unit);
    setDropModalOpen(true);
  };

  const handleClearFilters = () => {
    setFilters({ semester: '', academicYear: '', status: '', department: '' });
    setSearchTerm('');
  };

  const handleRegisterUnits = () => {
    window.location.href = '/user/register-units';
  };

  // ============================================================
  // FILTERING LOGIC
  // ============================================================

  useEffect(() => {
    let result = [...units];

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      result = result.filter(
        (unit) =>
          String(unit.unitCode || '').toLowerCase().includes(search) ||
          String(unit.unitName || '').toLowerCase().includes(search) ||
          String(unit.lecturer || '').toLowerCase().includes(search)
      );
    }

    if (filters.semester)
      result = result.filter((unit) => unit.semester === filters.semester);
    if (filters.academicYear)
      result = result.filter(
        (unit) => unit.academicYear === filters.academicYear
      );
    if (filters.status)
      result = result.filter((unit) => unit.status === filters.status);
    if (filters.department)
      result = result.filter((unit) => unit.department === filters.department);

    setFilteredUnits(result);
    setCurrentPage(1);
  }, [searchTerm, filters, units]);

  // ============================================================
  // DERIVED VALUES
  // ============================================================

  const departments = [
    ...new Set(units.map((u) => u.department).filter(Boolean)),
  ];

  const totalPages = Math.ceil(filteredUnits.length / ITEMS_PER_PAGE);
  const paginatedUnits = filteredUnits.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const hasActiveFilters =
    searchTerm ||
    filters.semester ||
    filters.academicYear ||
    filters.status ||
    filters.department;

  // ============================================================
  // EFFECTS
  // ============================================================

  useEffect(() => {
    fetchRegisteredUnits();
  }, [fetchRegisteredUnits]);

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
                  <BookOpen
                    className="w-6 h-6"
                    style={{ color: BRAND.primary }}
                  />
                </div>
                My Registered Units
              </h1>
              <p className="text-sm text-gray-500 mt-1 ml-11">
                View and manage your registered units.
              </p>
            </div>

            <div className="flex items-center gap-2 ml-11 sm:ml-0">
              <button
                onClick={() => fetchRegisteredUnits(true)}
                disabled={refreshing}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <RefreshCw
                  className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`}
                />
                <span className="hidden sm:inline">Refresh</span>
              </button>
              <button
                onClick={handleDownloadSlip}
                disabled={downloading || units.length === 0}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
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
                  {downloading
                    ? 'Downloading...'
                    : 'Download Registration Slip'}
                </span>
                <span className="sm:hidden">Slip</span>
              </button>
            </div>
          </div>
        </div>

        {/* ACADEMIC PERIOD */}
        {academicPeriod && (
          <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar
                className="w-5 h-5"
                style={{ color: BRAND.primary }}
              />
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                Academic Period
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Academic Year</p>
                <p className="text-sm font-semibold text-gray-900">
                  {academicPeriod.academicYear || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Semester</p>
                <p className="text-sm font-semibold text-gray-900">
                  {academicPeriod.semester || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Program</p>
                <p className="text-sm font-semibold text-gray-900">
                  {academicPeriod.program || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Year of Study</p>
                <p className="text-sm font-semibold text-gray-900">
                  {academicPeriod.yearOfStudy
                    ? `Year ${academicPeriod.yearOfStudy}`
                    : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">
                  Registration Date
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  {formatDate(academicPeriod.registrationDate)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">
                  Registration Status
                </p>
                <StatusBadge
                  status={academicPeriod.registrationStatus || 'Pending'}
                />
              </div>
            </div>
          </div>
        )}

        {/* SUMMARY CARDS */}
        {!loading && units.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
            <SummaryCard
              icon={BookOpen}
              label="Total Units"
              value={stats.totalUnits}
              accent="brown"
              subtitle="Registered"
            />
            <SummaryCard
              icon={Layers}
              label="Credit Hours"
              value={stats.totalCredits}
              accent="tan"
              subtitle="Total"
            />
            <SummaryCard
              icon={Award}
              label="Completed"
              value={stats.completedUnits}
              accent="emerald"
              subtitle="Units"
            />
            <SummaryCard
              icon={BookMarked}
              label="Current"
              value={stats.currentUnits}
              accent="blue"
              subtitle="In progress"
            />
            <SummaryCard
              icon={Clock}
              label="Pending"
              value={stats.pendingRegistrations}
              accent="cream"
              subtitle="Registrations"
            />
          </div>
        )}

        {/* DROP NOTICE */}
        {!loading && units.length > 0 && !dropAllowed && (
          <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl mb-6">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-800">
                Unit Dropping Not Available
              </p>
              <p className="text-sm text-amber-700 mt-0.5">
                The drop period has ended or dropping is not allowed at this
                time.
                {dropDeadline && ` Deadline was ${formatDate(dropDeadline)}.`}{' '}
                Please contact the registrar for assistance.
              </p>
            </div>
          </div>
        )}

        {/* SEARCH & FILTERS */}
        {!loading && units.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by unit code, name, or lecturer..."
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
                onClick={() => setShowFilters(!showFilters)}
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
                        filters.semester,
                        filters.academicYear,
                        filters.status,
                        filters.department,
                      ].filter(Boolean).length
                    }
                  </span>
                )}
              </button>
            </div>

            {showFilters && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    {
                      key: 'semester',
                      label: 'Semester',
                      options: SEMESTERS,
                      placeholder: 'All Semesters',
                    },
                    {
                      key: 'academicYear',
                      label: 'Academic Year',
                      options: ACADEMIC_YEARS,
                      placeholder: 'All Years',
                    },
                    {
                      key: 'status',
                      label: 'Status',
                      options: STATUSES,
                      placeholder: 'All Statuses',
                    },
                    {
                      key: 'department',
                      label: 'Department',
                      options: departments,
                      placeholder: 'All Departments',
                    },
                  ].map(({ key, label, options, placeholder }) => (
                    <div key={key}>
                      <label className="block text-xs font-medium text-gray-600 mb-1.5">
                        {label}
                      </label>
                      <select
                        value={filters[key]}
                        onChange={(e) =>
                          setFilters({ ...filters, [key]: e.target.value })
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
                        <option value="">{placeholder}</option>
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
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = BRAND.primaryDark)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = BRAND.primary)
                      }
                    >
                      <X className="w-3.5 h-3.5" />
                      Clear all filters
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* UNITS TABLE */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {loading ? (
            <TableSkeleton />
          ) : units.length === 0 ? (
            <EmptyState onRegister={handleRegisterUnits} />
          ) : filteredUnits.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-1">
                No matching units
              </h3>
              <p className="text-sm text-gray-500 text-center max-w-sm mb-4">
                No units match your current search or filter criteria.
              </p>
              <button
                onClick={handleClearFilters}
                className="text-sm font-medium"
                style={{ color: BRAND.primary }}
              >
                Clear filters
              </button>
            </div>
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
                        'Unit Code',
                        'Unit Name',
                        'Credit Hours',
                        'Department',
                        'Lecturer',
                        'Semester',
                        'Reg. Date',
                        'Status',
                      ].map((h) => (
                        <th
                          key={h}
                          className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
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
                    {paginatedUnits.map((unit) => (
                      <tr
                        key={unit.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-3.5">
                          <span
                            className="text-sm font-semibold"
                            style={{ color: BRAND.primary }}
                          >
                            {unit.unitCode}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="text-sm font-medium text-gray-900">
                            {unit.unitName}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="inline-flex items-center gap-1 text-sm text-gray-700">
                            <Layers className="w-3.5 h-3.5 text-gray-400" />
                            {unit.creditHours}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="text-sm text-gray-600">
                            {unit.department || 'N/A'}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="text-sm text-gray-600">
                            {unit.lecturer || 'Not assigned'}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="text-sm text-gray-600">
                            {unit.semester || 'N/A'}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="text-sm text-gray-600">
                            {formatDate(
                              unit.registrationDate || unit.createdAt
                            )}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <StatusBadge status={unit.status} />
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => handleViewUnit(unit)}
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
                            <button
                              onClick={() => handleOpenDropModal(unit)}
                              disabled={
                                !dropAllowed ||
                                unit.status === 'Dropped' ||
                                unit.status === 'Completed'
                              }
                              className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-gray-500"
                              title={
                                !dropAllowed
                                  ? 'Dropping not allowed'
                                  : unit.status === 'Dropped'
                                  ? 'Already dropped'
                                  : unit.status === 'Completed'
                                  ? 'Cannot drop completed unit'
                                  : 'Drop Unit'
                              }
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="lg:hidden divide-y divide-gray-100">
                {paginatedUnits.map((unit) => (
                  <div
                    key={unit.id}
                    className="p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className="text-sm font-bold"
                            style={{ color: BRAND.primary }}
                          >
                            {unit.unitCode}
                          </span>
                          <StatusBadge status={unit.status} />
                        </div>
                        <h3 className="text-sm font-semibold text-gray-900 truncate">
                          {unit.unitName}
                        </h3>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <Layers className="w-3.5 h-3.5 text-gray-400" />
                        {unit.creditHours} Credit Hours
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <Building2 className="w-3.5 h-3.5 text-gray-400" />
                        {unit.department || 'N/A'}
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <User className="w-3.5 h-3.5 text-gray-400" />
                        {unit.lecturer || 'Not assigned'}
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        {unit.semester || 'N/A'}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                      <button
                        onClick={() => handleViewUnit(unit)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg transition-colors"
                        style={{
                          color: BRAND.primary,
                          backgroundColor: BRAND.primarySoft,
                        }}
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View
                      </button>
                      <button
                        onClick={() => handleOpenDropModal(unit)}
                        disabled={
                          !dropAllowed ||
                          unit.status === 'Dropped' ||
                          unit.status === 'Completed'
                        }
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Drop
                      </button>
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
                        filteredUnits.length
                      )}
                    </span>{' '}
                    of{' '}
                    <span className="font-semibold">
                      {filteredUnits.length}
                    </span>{' '}
                    units
                  </p>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() =>
                        setCurrentPage((p) => Math.max(1, p - 1))
                      }
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
                        const isActive = currentPage === page;
                        return (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`min-w-[36px] px-3 py-2 text-xs font-semibold rounded-lg border transition-colors ${
                              isActive
                                ? 'text-white border-transparent'
                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                            }`}
                            style={
                              isActive
                                ? { backgroundColor: BRAND.primary }
                                : {}
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

        {/* REGISTER UNITS CTA */}
        {!loading && units.length > 0 && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={handleRegisterUnits}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-white border-2 rounded-lg transition-colors"
              style={{
                color: BRAND.primary,
                borderColor: BRAND.primaryBorder,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = BRAND.primarySoft;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
              }}
            >
              <PlusCircle className="w-4 h-4" />
              Register More Units
            </button>
          </div>
        )}
      </div>

      {/* VIEW UNIT MODAL */}
      {viewModalOpen && selectedUnit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
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
                  <BookOpen
                    className="w-5 h-5"
                    style={{ color: BRAND.primary }}
                  />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Unit Details
                  </h2>
                  <p className="text-xs text-gray-500">
                    {selectedUnit.unitCode}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setViewModalOpen(false);
                  setSelectedUnit(null);
                }}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="mb-6">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <p
                      className="text-xs font-semibold uppercase tracking-wider mb-1"
                      style={{ color: BRAND.primary }}
                    >
                      {selectedUnit.unitCode}
                    </p>
                    <h3 className="text-xl font-bold text-gray-900">
                      {selectedUnit.unitName}
                    </h3>
                  </div>
                  <StatusBadge status={selectedUnit.status} />
                </div>
                {selectedUnit.description && (
                  <p className="text-sm text-gray-600 leading-relaxed mt-3">
                    {selectedUnit.description}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-1">
                    <User className="w-4 h-4 text-gray-400" />
                    <p className="text-xs font-medium text-gray-500">
                      Lecturer
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">
                    {selectedUnit.lecturer || 'Not assigned'}
                  </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-1">
                    <Layers className="w-4 h-4 text-gray-400" />
                    <p className="text-xs font-medium text-gray-500">
                      Credit Hours
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">
                    {selectedUnit.creditHours} Hours
                  </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-1">
                    <Building2 className="w-4 h-4 text-gray-400" />
                    <p className="text-xs font-medium text-gray-500">
                      Department
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">
                    {selectedUnit.department || 'N/A'}
                  </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <p className="text-xs font-medium text-gray-500">
                      Registration Date
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">
                    {formatDate(
                      selectedUnit.registrationDate || selectedUnit.createdAt
                    )}
                  </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl sm:col-span-2">
                  <div className="flex items-center gap-2 mb-1">
                    <Info className="w-4 h-4 text-gray-400" />
                    <p className="text-xs font-medium text-gray-500">
                      Prerequisites
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">
                    {selectedUnit.prerequisites &&
                    selectedUnit.prerequisites.length > 0
                      ? Array.isArray(selectedUnit.prerequisites)
                        ? selectedUnit.prerequisites
                            .map((p) =>
                              typeof p === 'object' ? p.code || p.name : p
                            )
                            .join(', ')
                        : selectedUnit.prerequisites
                      : 'None'}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-5 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => {
                  setViewModalOpen(false);
                  setSelectedUnit(null);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              {dropAllowed &&
                selectedUnit.status !== 'Dropped' &&
                selectedUnit.status !== 'Completed' && (
                  <button
                    onClick={() => {
                      setViewModalOpen(false);
                      handleOpenDropModal(selectedUnit);
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Drop Unit
                  </button>
                )}
            </div>
          </div>
        </div>
      )}

      {/* DROP CONFIRMATION MODAL */}
      {dropModalOpen && unitToDrop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Drop Unit?
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Are you sure you want to drop this unit? This action cannot be
                undone.
              </p>

              <div className="p-3 bg-gray-50 rounded-xl text-left">
                <p
                  className="text-xs font-semibold mb-0.5"
                  style={{ color: BRAND.primary }}
                >
                  {unitToDrop.unitCode}
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  {unitToDrop.unitName}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {unitToDrop.creditHours} Credit Hours
                </p>
              </div>

              <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg mt-4 text-left">
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-800">
                  Dropping a unit may affect your credit load and graduation
                  timeline. Please consult your academic advisor if unsure.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-5 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => {
                  setDropModalOpen(false);
                  setUnitToDrop(null);
                }}
                disabled={dropping}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDropUnit}
                disabled={dropping}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {dropping ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Dropping...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Drop Unit
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyRegisteredUnits;