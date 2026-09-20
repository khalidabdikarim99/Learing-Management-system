// src/Admin/pages/Students.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Users,
  Search,
  Filter,
  Eye,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  X,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Building2,
  BookOpen,
  Hash,
  GraduationCap,
  Layers,
  AlertCircle,
  AlertTriangle,
  Info,
  UserCheck,
  UserX,
  ShieldCheck,
  Check,
  Ban,
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

// ============================================================
// CONSTANTS
// ============================================================

const STATUSES = ['Pending', 'Active', 'Inactive', 'Rejected'];

const STATUS_CONFIG = {
  Pending: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    icon: Clock,
  },
  Active: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    icon: CheckCircle,
  },
  Inactive: {
    bg: 'bg-gray-100',
    text: 'text-gray-700',
    border: 'border-gray-200',
    icon: XCircle,
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

const getInitials = (name) => {
  if (!name) return 'ST';
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.charAt(0) || '';
  const last = parts[parts.length - 1]?.charAt(0) || '';
  return `${first}${last}`.toUpperCase() || 'ST';
};

const safeDelete = async (resource, id) => {
  try {
    await api.delete(`/${resource}/${id}`);
  } catch (err) {
    if (err.response?.status !== 404) throw err;
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
    gray: { bg: 'bg-gray-100', text: 'text-gray-600', bar: 'bg-gray-500' },
    red: { bg: 'bg-red-50', text: 'text-red-600', bar: 'bg-red-500' },
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
        <div className="h-10 w-10 bg-gray-200 rounded-full" />
        <div className="h-4 bg-gray-200 rounded w-40" />
        <div className="h-4 bg-gray-200 rounded w-24" />
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
        <Users className="w-10 h-10" style={{ color: BRAND.primary }} />
      )}
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">
      {filtered ? 'No Matching Students' : 'No Students Yet'}
    </h3>
    <p className="text-sm text-gray-500 text-center max-w-md">
      {filtered
        ? 'No students match your current search or filter criteria. Try adjusting your filters.'
        : 'Student registrations will appear here as they sign up.'}
    </p>
  </div>
);

// ============================================================
// STUDENT DETAILS MODAL
// ============================================================

const StudentDetailModal = ({ open, onClose, student, profile, loading }) => {
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
              <User
                className="w-5 h-5"
                style={{ color: BRAND.primary }}
              />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Student Details
              </h2>
              {student && (
                <p className="text-xs text-gray-500">
                  {student.studentId || `#${student.id}`}
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
          {loading || !student ? (
            <div className="flex items-center justify-center py-20">
              <Loader2
                className="w-8 h-8 animate-spin"
                style={{ color: BRAND.primary }}
              />
            </div>
          ) : (
            <div className="p-5 space-y-5">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50">
                <div
                  className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center shrink-0"
                  style={{ backgroundColor: BRAND.primarySoft }}
                >
                  {profile?.profilePhoto ? (
                    <img
                      src={profile.profilePhoto}
                      alt={student.fullName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span
                      className="text-xl font-bold"
                      style={{ color: BRAND.primary }}
                    >
                      {getInitials(student.fullName)}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-lg font-bold text-gray-900 truncate">
                    {student.fullName || 'Unnamed Student'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {student.email}
                  </p>
                </div>
                <StatusBadge
                  status={
                    student.accountStatus || student.status || 'Pending'
                  }
                />
              </div>

              <div>
                <h4
                  className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2"
                  style={{ color: BRAND.accent }}
                >
                  <User className="w-4 h-4" /> Personal Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {renderField(Hash, 'Student ID', student.studentId)}
                  {renderField(
                    Hash,
                    'Admission Number',
                    student.admissionNumber
                  )}
                  {renderField(User, 'Full Name', student.fullName)}
                  {renderField(
                    Calendar,
                    'Date of Birth',
                    formatDate(profile?.dateOfBirth)
                  )}
                  {renderField(User, 'Gender', profile?.gender)}
                  {renderField(User, 'Nationality', profile?.nationality)}
                </div>
              </div>

              <div>
                <h4
                  className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2"
                  style={{ color: BRAND.accent }}
                >
                  <Phone className="w-4 h-4" /> Contact Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {renderField(Mail, 'Email', student.email)}
                  {renderField(
                    Phone,
                    'Phone',
                    profile?.phone || student.phone
                  )}
                  {renderField(
                    Phone,
                    'Alternative Phone',
                    profile?.alternativePhone
                  )}
                  {renderField(MapPin, 'County', profile?.county)}
                  {renderField(MapPin, 'City', profile?.city)}
                  {renderField(
                    MapPin,
                    'Physical Address',
                    profile?.physicalAddress
                  )}
                </div>
              </div>

              <div>
                <h4
                  className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2"
                  style={{ color: BRAND.accent }}
                >
                  <GraduationCap className="w-4 h-4" /> Academic Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {renderField(BookOpen, 'Program', student.program)}
                  {renderField(
                    Building2,
                    'Department',
                    student.department
                  )}
                  {renderField(Layers, 'Year of Study', student.yearOfStudy)}
                  {renderField(
                    Calendar,
                    'Registered On',
                    formatDate(student.createdAt)
                  )}
                </div>
              </div>
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
  student,
}) => {
  if (!open) return null;

  const colors = {
    primary: {
      bg: BRAND.primary,
      hover: BRAND.primaryDark,
      icon: CheckCircle,
    },
    danger: { bg: '#dc2626', hover: '#b91c1c', icon: XCircle },
    warning: { bg: '#ea580c', hover: '#c2410c', icon: AlertTriangle },
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

          {student && (
            <div className="mt-4 p-3 bg-gray-50 rounded-xl text-left">
              <p
                className="text-xs font-semibold mb-0.5"
                style={{ color: BRAND.primary }}
              >
                {student.studentId}
              </p>
              <p className="text-sm font-semibold text-gray-900">
                {student.fullName}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">{student.email}</p>
            </div>
          )}
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

const Students = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [students, setStudents] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    active: 0,
    inactive: 0,
    rejected: 0,
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    program: '',
    department: '',
    yearOfStudy: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const [acceptModal, setAcceptModal] = useState(false);
  const [rejectModal, setRejectModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [actionStudent, setActionStudent] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Tracks which row's inline Accept button is spinning
  const [inlineAcceptId, setInlineAcceptId] = useState(null);

  // ============================================================
  // API — JSON SERVER
  // ============================================================

  const fetchStudents = useCallback(async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const [accountsRes, profilesRes] = await Promise.allSettled([
        api.get('/accounts'),
        api.get('/profiles'),
      ]);

      let list = [];
      if (accountsRes.status === 'fulfilled') {
        const raw = Array.isArray(accountsRes.value.data)
          ? accountsRes.value.data
          : [];
        list = raw.filter((a) => !a.role || a.role === 'student');
      }

      let profileList = [];
      if (profilesRes.status === 'fulfilled') {
        profileList = Array.isArray(profilesRes.value.data)
          ? profilesRes.value.data
          : [];
      }

      const withStatus = list.map((s) => ({
        ...s,
        accountStatus: s.accountStatus || s.status || 'Pending',
      }));

      setStudents(withStatus);
      setProfiles(profileList);

      setStats({
        total: withStatus.length,
        pending: withStatus.filter((s) => s.accountStatus === 'Pending')
          .length,
        active: withStatus.filter((s) => s.accountStatus === 'Active')
          .length,
        inactive: withStatus.filter((s) => s.accountStatus === 'Inactive')
          .length,
        rejected: withStatus.filter((s) => s.accountStatus === 'Rejected')
          .length,
      });

      if (showRefresh) toast.success('Students refreshed successfully');
    } catch (error) {
      console.error('Error fetching students:', error);
      if (!error.response) {
        toast.error(
          'Cannot reach JSON Server. Make sure it is running on port 5000.'
        );
      } else {
        toast.error('Students could not be loaded. Please try again.');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const handleView = async (student) => {
    setSelectedStudent(student);
    setDetailOpen(true);
    setLoadingDetail(true);
    try {
      const prof = profiles.find(
        (p) => String(p.studentId) === String(student.studentId)
      );
      if (prof) {
        setSelectedProfile(prof);
      } else {
        try {
          const res = await api.get('/profiles', {
            params: { studentId: student.studentId },
          });
          setSelectedProfile(
            Array.isArray(res.data) ? res.data[0] || null : res.data
          );
        } catch {
          setSelectedProfile(null);
        }
      }
    } finally {
      setLoadingDetail(false);
    }
  };

  // ------------------------------------------------------------
  // Writes accountStatus + status into db.json for the given account
  // ------------------------------------------------------------
  const updateAccountStatus = async (accountId, status) => {
    const payload = {
      accountStatus: status,
      status, // keep both in sync
      updatedAt: new Date().toISOString(),
    };

    try {
      await api.patch(`/accounts/${accountId}`, payload);
    } catch (patchErr) {
      if (patchErr.response?.status === 404) throw patchErr;
      // Fallback: GET then PUT the full record
      const current = await api.get(`/accounts/${accountId}`);
      await api.put(`/accounts/${accountId}`, {
        ...current.data,
        ...payload,
      });
    }
  };

  // ------------------------------------------------------------
  // INLINE ACCEPT — one click, no modal (writes directly to db.json)
  // ------------------------------------------------------------
  const handleInlineAccept = async (student) => {
    setInlineAcceptId(student.id);
    try {
      await updateAccountStatus(student.id, 'Active');

      // Optimistic local update so the badge flips immediately
      setStudents((prev) =>
        prev.map((s) =>
          s.id === student.id
            ? { ...s, accountStatus: 'Active', status: 'Active' }
            : s
        )
      );
      setStats((prev) => ({
        ...prev,
        pending: Math.max(0, prev.pending - 1),
        active: prev.active + 1,
      }));

      toast.success(`${student.fullName || 'Student'} accepted.`);
      // Re-sync with db.json
      await fetchStudents();
    } catch (err) {
      console.error('Inline accept error:', err);
      toast.error('Unable to accept student.');
    } finally {
      setInlineAcceptId(null);
    }
  };

  const handleAccept = async () => {
    if (!actionStudent) return;
    setActionLoading(true);
    try {
      await updateAccountStatus(actionStudent.id, 'Active');
      toast.success('Student accepted successfully.');
      setAcceptModal(false);
      setActionStudent(null);
      await fetchStudents(true);
    } catch (error) {
      console.error('Accept error:', error);
      toast.error('Unable to accept student.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!actionStudent) return;
    setActionLoading(true);
    try {
      await updateAccountStatus(actionStudent.id, 'Rejected');
      toast.success('Student rejected.');
      setRejectModal(false);
      setActionStudent(null);
      await fetchStudents(true);
    } catch (error) {
      console.error('Reject error:', error);
      toast.error('Unable to reject student.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!actionStudent) return;
    setActionLoading(true);
    try {
      const { id, studentId } = actionStudent;

      await safeDelete('accounts', id);

      try {
        const profRes = await api.get('/profiles', {
          params: { studentId },
        });
        const matched = Array.isArray(profRes.data) ? profRes.data : [];
        await Promise.all(
          matched.map((p) => safeDelete('profiles', p.id))
        );
      } catch (err) {
        console.warn('Profile cleanup skipped:', err);
      }

      try {
        const regRes = await api.get('/unitRegistrations', {
          params: { studentId },
        });
        const regs = Array.isArray(regRes.data) ? regRes.data : [];
        await Promise.all(
          regs.map((r) => safeDelete('unitRegistrations', r.id))
        );
      } catch (err) {
        console.warn('Unit registration cleanup skipped:', err);
      }

      toast.success('Student deleted successfully.');
      setDeleteModal(false);
      setActionStudent(null);
      await fetchStudents(true);
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Unable to delete student.');
    } finally {
      setActionLoading(false);
    }
  };

  // ============================================================
  // FILTERING
  // ============================================================

  const filteredStudents = useMemo(() => {
    let result = [...students];

    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      result = result.filter(
        (r) =>
          String(r.studentId || '').toLowerCase().includes(s) ||
          String(r.admissionNumber || '').toLowerCase().includes(s) ||
          String(r.fullName || '').toLowerCase().includes(s) ||
          String(r.email || '').toLowerCase().includes(s)
      );
    }

    if (filters.status)
      result = result.filter((r) => r.accountStatus === filters.status);
    if (filters.program)
      result = result.filter((r) => r.program === filters.program);
    if (filters.department)
      result = result.filter((r) => r.department === filters.department);
    if (filters.yearOfStudy)
      result = result.filter((r) => r.yearOfStudy === filters.yearOfStudy);

    return result;
  }, [students, searchTerm, filters]);

  const totalPages = Math.ceil(filteredStudents.length / ITEMS_PER_PAGE);
  const paginated = filteredStudents.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const hasActiveFilters = Boolean(
    searchTerm ||
      filters.status ||
      filters.program ||
      filters.department ||
      filters.yearOfStudy
  );

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilters({
      status: '',
      program: '',
      department: '',
      yearOfStudy: '',
    });
  };

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  // ============================================================
  // DERIVED OPTIONS
  // ============================================================

  const programOptions = useMemo(
    () => [...new Set(students.map((s) => s.program).filter(Boolean))],
    [students]
  );
  const departmentOptions = useMemo(
    () => [...new Set(students.map((s) => s.department).filter(Boolean))],
    [students]
  );
  const yearOptions = useMemo(
    () => [...new Set(students.map((s) => s.yearOfStudy).filter(Boolean))],
    [students]
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
                  <Users
                    className="w-6 h-6"
                    style={{ color: BRAND.primary }}
                  />
                </div>
                Students
              </h1>
              <p className="text-sm text-gray-500 mt-1 ml-11">
                Accept, reject, or delete student registrations.
              </p>
            </div>

            <div className="flex items-center gap-2 ml-11 sm:ml-0">
              <button
                onClick={() => fetchStudents(true)}
                disabled={refreshing}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <RefreshCw
                  className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`}
                />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>
        </div>

        {/* STATISTICS */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
          <StatCard
            icon={Users}
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
            icon={UserCheck}
            label="Active"
            value={stats.active}
            accent="emerald"
            active={filters.status === 'Active'}
            onClick={() =>
              setFilters((f) => ({
                ...f,
                status: f.status === 'Active' ? '' : 'Active',
              }))
            }
          />
          <StatCard
            icon={UserX}
            label="Inactive"
            value={stats.inactive}
            accent="gray"
            active={filters.status === 'Inactive'}
            onClick={() =>
              setFilters((f) => ({
                ...f,
                status: f.status === 'Inactive' ? '' : 'Inactive',
              }))
            }
          />
          <StatCard
            icon={XCircle}
            label="Rejected"
            value={stats.rejected}
            accent="red"
            active={filters.status === 'Rejected'}
            onClick={() =>
              setFilters((f) => ({
                ...f,
                status: f.status === 'Rejected' ? '' : 'Rejected',
              }))
            }
          />
        </div>

        {/* SEARCH & FILTERS */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by student ID, admission no, name, email..."
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
                      filters.yearOfStudy,
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { key: 'status', label: 'Status', options: STATUSES },
                  { key: 'program', label: 'Program', options: programOptions },
                  {
                    key: 'department',
                    label: 'Department',
                    options: departmentOptions,
                  },
                  {
                    key: 'yearOfStudy',
                    label: 'Year of Study',
                    options: yearOptions,
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

        {/* STUDENTS TABLE */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {loading ? (
            <TableSkeleton />
          ) : filteredStudents.length === 0 ? (
            <EmptyState filtered={students.length > 0} />
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
                        'Student',
                        'Student ID',
                        'Admission No',
                        'Program',
                        'Department',
                        'Year',
                        'Registered',
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
                    {paginated.map((student) => {
                      const status =
                        student.accountStatus ||
                        student.status ||
                        'Pending';
                      const isPending = status === 'Pending';
                      const isAccepting = inlineAcceptId === student.id;

                      return (
                        <tr
                          key={student.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-3 min-w-0">
                              <div
                                className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                                style={{
                                  backgroundColor: BRAND.primarySoft,
                                }}
                              >
                                <span
                                  className="text-xs font-bold"
                                  style={{ color: BRAND.primary }}
                                >
                                  {getInitials(student.fullName)}
                                </span>
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-gray-900 truncate max-w-[200px]">
                                  {student.fullName || '—'}
                                </p>
                                <p className="text-xs text-gray-500 truncate max-w-[200px]">
                                  {student.email}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3.5">
                            <span className="text-sm text-gray-700">
                              {student.studentId || '—'}
                            </span>
                          </td>
                          <td className="px-4 py-3.5">
                            <span className="text-sm text-gray-700">
                              {student.admissionNumber || '—'}
                            </span>
                          </td>
                          <td className="px-4 py-3.5">
                            <span className="text-sm text-gray-600 block max-w-[180px] truncate">
                              {student.program || '—'}
                            </span>
                          </td>
                          <td className="px-4 py-3.5">
                            <span className="text-sm text-gray-600 block max-w-[180px] truncate">
                              {student.department || '—'}
                            </span>
                          </td>
                          <td className="px-4 py-3.5">
                            <span className="text-sm text-gray-600">
                              {student.yearOfStudy || '—'}
                            </span>
                          </td>
                          <td className="px-4 py-3.5">
                            <span className="text-sm text-gray-600 whitespace-nowrap">
                              {formatDate(student.createdAt)}
                            </span>
                          </td>
                          <td className="px-4 py-3.5">
                            <StatusBadge status={status} />
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="flex items-center justify-center gap-1.5">
                              {/* INLINE ACCEPT BUTTON — writes directly to db.json */}
                              {isPending && (
                                <button
                                  onClick={() => handleInlineAccept(student)}
                                  disabled={isAccepting}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
                                  title="Accept student"
                                >
                                  {isAccepting ? (
                                    <>
                                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                      Accepting...
                                    </>
                                  ) : (
                                    <>
                                      <Check className="w-3.5 h-3.5" />
                                      Accept
                                    </>
                                  )}
                                </button>
                              )}

                              <button
                                onClick={() => handleView(student)}
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

                              {isPending && (
                                <button
                                  onClick={() => {
                                    setActionStudent(student);
                                    setRejectModal(true);
                                  }}
                                  className="p-1.5 text-gray-500 rounded-lg transition-colors"
                                  title="Reject"
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.color = '#ea580c';
                                    e.currentTarget.style.backgroundColor =
                                      '#fff7ed';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.color = '#6b7280';
                                    e.currentTarget.style.backgroundColor =
                                      'transparent';
                                  }}
                                >
                                  <Ban className="w-4 h-4" />
                                </button>
                              )}

                              <button
                                onClick={() => {
                                  setActionStudent(student);
                                  setDeleteModal(true);
                                }}
                                className="p-1.5 text-gray-500 rounded-lg transition-colors"
                                title="Delete"
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
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="lg:hidden divide-y divide-gray-100">
                {paginated.map((student) => {
                  const status =
                    student.accountStatus || student.status || 'Pending';
                  const isPending = status === 'Pending';
                  const isAccepting = inlineAcceptId === student.id;

                  return (
                    <div
                      key={student.id}
                      className="p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                          style={{ backgroundColor: BRAND.primarySoft }}
                        >
                          <span
                            className="text-xs font-bold"
                            style={{ color: BRAND.primary }}
                          >
                            {getInitials(student.fullName)}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                            <h3 className="text-sm font-semibold text-gray-900 truncate">
                              {student.fullName || '—'}
                            </h3>
                            <StatusBadge status={status} />
                          </div>
                          <p className="text-xs text-gray-500 truncate">
                            {student.email}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <Hash className="w-3.5 h-3.5 text-gray-400" />
                          {student.studentId || '—'}
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <BookOpen className="w-3.5 h-3.5 text-gray-400" />
                          {student.program || '—'}
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <Building2 className="w-3.5 h-3.5 text-gray-400" />
                          {student.department || '—'}
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <Layers className="w-3.5 h-3.5 text-gray-400" />
                          {student.yearOfStudy || '—'}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                        {isPending && (
                          <button
                            onClick={() => handleInlineAccept(student)}
                            disabled={isAccepting}
                            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-60"
                          >
                            {isAccepting ? (
                              <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                Accepting...
                              </>
                            ) : (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                Accept
                              </>
                            )}
                          </button>
                        )}
                        <button
                          onClick={() => handleView(student)}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg transition-colors"
                          style={{
                            color: BRAND.primary,
                            backgroundColor: BRAND.primarySoft,
                          }}
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View
                        </button>
                        {isPending && (
                          <button
                            onClick={() => {
                              setActionStudent(student);
                              setRejectModal(true);
                            }}
                            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-orange-700 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
                          >
                            <Ban className="w-3.5 h-3.5" />
                            Reject
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setActionStudent(student);
                            setDeleteModal(true);
                          }}
                          className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
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
                        filteredStudents.length
                      )}
                    </span>{' '}
                    of{' '}
                    <span className="font-semibold">
                      {filteredStudents.length}
                    </span>{' '}
                    students
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
        {!loading && students.length > 0 && (
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
              Clicking <span className="font-semibold">Accept</span> updates the
              student&apos;s <span className="font-semibold">accountStatus</span>{' '}
              to <span className="font-semibold">Active</span> in{' '}
              <code className="font-mono">db.json</code>, allowing them to log
              in immediately.
            </p>
          </div>
        )}
      </div>

      {/* MODALS */}
      <StudentDetailModal
        open={detailOpen}
        onClose={() => {
          setDetailOpen(false);
          setSelectedStudent(null);
          setSelectedProfile(null);
        }}
        student={selectedStudent}
        profile={selectedProfile}
        loading={loadingDetail}
      />

      {/* ACCEPT CONFIRMATION (still available, triggered via modal for extra caution) */}
      <ConfirmModal
        open={acceptModal}
        onClose={() => {
          setAcceptModal(false);
          setActionStudent(null);
        }}
        onConfirm={handleAccept}
        title="Accept Student?"
        message="Accept this student's account? They will be able to log in and access the student portal."
        confirmText="Accept Student"
        loading={actionLoading}
        variant="primary"
        student={actionStudent}
      />

      <ConfirmModal
        open={rejectModal}
        onClose={() => {
          setRejectModal(false);
          setActionStudent(null);
        }}
        onConfirm={handleReject}
        title="Reject Student?"
        message="Reject this student's registration? They will not be able to log in to the portal."
        confirmText="Reject Student"
        loading={actionLoading}
        variant="warning"
        student={actionStudent}
      />

      <ConfirmModal
        open={deleteModal}
        onClose={() => {
          setDeleteModal(false);
          setActionStudent(null);
        }}
        onConfirm={handleDelete}
        title="Delete Student?"
        message="This will permanently remove the student's account, profile, and unit registrations. This action cannot be undone."
        confirmText="Delete Student"
        loading={actionLoading}
        variant="danger"
        student={actionStudent}
      />
    </div>
  );
};

export default Students;