// src/Admin/pages/Dashboard.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  FileText,
  ClipboardList,
  Award,
  UserCog,
  Settings,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileWarning,
  RefreshCw,
  Loader2,
  ChevronRight,
  ArrowRight,
  Activity,
  Calendar,
  Hash,
  User,
  BookMarked,
  BarChart3,
  PieChart as PieIcon,
  LineChart as LineIcon,
  Eye,
  Megaphone,
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

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
// HELPERS
// ============================================================

function getCurrentAdmin() {
  try {
    const raw =
      localStorage.getItem('adminUser') || sessionStorage.getItem('adminUser');
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

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
  amber: '#D97706',
  amberSoft: '#FEF3C7',
  dark: '#3E2C1C',
};

const APPLICATION_COLORS = {
  Draft: '#9CA3AF',
  Submitted: '#3B82F6',
  'Under Review': '#D97706',
  Approved: '#059669',
  Rejected: '#DC2626',
  'Requires Correction': '#EA580C',
};

const UNIT_REG_COLORS = {
  Pending: '#D97706',
  Registered: '#6B4423',
  Approved: '#059669',
  Dropped: '#DC2626',
  Completed: '#3B82F6',
};

const LINE_COLOR = '#6B4423';
const BAR_COLOR = '#8B5E34';

// ============================================================
// STATUS CONFIG
// ============================================================

const APPLICATION_STATUSES = {
  Draft: { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200', icon: FileText },
  Submitted: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: FileText },
  'Under Review': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: Clock },
  Approved: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: CheckCircle },
  Rejected: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', icon: XCircle },
  'Requires Correction': { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', icon: FileWarning },
};

const REGISTRATION_STATUSES = {
  Pending: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: Clock },
  Registered: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: CheckCircle },
  Approved: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: CheckCircle },
  Dropped: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', icon: XCircle },
  Completed: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: Award },
};

const RESULT_STATUSES = {
  Pending: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: Clock },
  Published: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: CheckCircle },
  Withheld: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', icon: AlertCircle },
  Incomplete: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', icon: FileWarning },
  Draft: { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200', icon: FileText },
};

const GRADE_STYLES = {
  A: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  'A-': 'bg-emerald-100 text-emerald-800 border-emerald-200',
  'B+': 'bg-blue-100 text-blue-800 border-blue-200',
  B: 'bg-blue-100 text-blue-800 border-blue-200',
  'B-': 'bg-blue-100 text-blue-800 border-blue-200',
  'C+': 'bg-amber-100 text-amber-800 border-amber-200',
  C: 'bg-amber-100 text-amber-800 border-amber-200',
  'C-': 'bg-amber-100 text-amber-800 border-amber-200',
  D: 'bg-orange-100 text-orange-800 border-orange-200',
  E: 'bg-red-100 text-red-800 border-red-200',
  F: 'bg-red-100 text-red-800 border-red-200',
};

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

const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return 'N/A';
  }
};

const formatNumber = (val, decimals = 2) => {
  if (val === null || val === undefined || val === '') return '—';
  const num = parseFloat(val);
  if (isNaN(num)) return '—';
  return num.toFixed(decimals);
};

const getGradeStyle = (grade) =>
  GRADE_STYLES[grade] || 'bg-gray-100 text-gray-700 border-gray-200';

// ============================================================
// SUB-COMPONENTS
// ============================================================

const StatusBadge = ({ status, configMap }) => {
  const config = configMap[status] || {
    bg: 'bg-gray-100',
    text: 'text-gray-700',
    border: 'border-gray-200',
    icon: AlertCircle,
  };
  const Icon = config.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.bg} ${config.text} ${config.border}`}
    >
      <Icon className="w-3.5 h-3.5" />
      {status || '—'}
    </span>
  );
};

const GradeBadge = ({ grade }) => {
  if (!grade) return <span className="text-sm text-gray-400">—</span>;
  return (
    <span
      className={`inline-flex items-center justify-center min-w-[36px] px-2 py-0.5 rounded-lg text-xs font-bold border ${getGradeStyle(
        grade
      )}`}
    >
      {grade}
    </span>
  );
};

const StatCard = ({ icon: Icon, title, value, description, accent = 'brown' }) => {
  const accents = {
    brown: { bg: 'bg-[#F5EFE6]', text: 'text-[#6B4423]', bar: 'bg-[#6B4423]' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-600', bar: 'bg-amber-500' },
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', bar: 'bg-emerald-500' },
    blue: { bg: 'bg-blue-50', text: 'text-blue-600', bar: 'bg-blue-500' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-600', bar: 'bg-purple-500' },
    red: { bg: 'bg-red-50', text: 'text-red-600', bar: 'bg-red-500' },
    orange: { bg: 'bg-orange-50', text: 'text-orange-600', bar: 'bg-orange-500' },
  };
  const c = accents[accent] || accents.brown;

  return (
    <div className="relative bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-all duration-200 overflow-hidden">
      <div className={`absolute top-0 left-0 right-0 h-1 ${c.bar}`} />
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900 truncate">{value}</p>
          {description && (
            <p className="text-xs text-gray-400 mt-1 truncate">{description}</p>
          )}
        </div>
        <div className={`p-3 rounded-xl flex-shrink-0 ${c.bg} ${c.text}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};

const SectionHeader = ({ icon: Icon, title, subtitle, action, onAction }) => (
  <div className="flex items-start justify-between gap-3 mb-4">
    <div className="flex items-start gap-3">
      {Icon && (
        <div
          className="p-2 rounded-lg flex-shrink-0 mt-0.5"
          style={{ backgroundColor: BRAND.primarySoft }}
        >
          <Icon className="w-4 h-4" style={{ color: BRAND.primary }} />
        </div>
      )}
      <div>
        <h3
          className="text-sm font-semibold uppercase tracking-wider"
          style={{ color: BRAND.primaryDark }}
        >
          {title}
        </h3>
        {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
    </div>
    {action && (
      <button
        onClick={onAction}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap"
        style={{ color: BRAND.primary, backgroundColor: BRAND.primarySoft }}
      >
        {action}
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
    )}
  </div>
);

const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-xl border border-gray-200 p-5 ${className}`}>
    {children}
  </div>
);

const SkeletonCard = () => (
  <div className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
    <div className="flex justify-between items-start">
      <div className="flex-1 space-y-2">
        <div className="h-3 bg-gray-200 rounded w-24" />
        <div className="h-7 bg-gray-200 rounded w-16" />
        <div className="h-3 bg-gray-200 rounded w-32" />
      </div>
      <div className="w-11 h-11 bg-gray-200 rounded-xl" />
    </div>
  </div>
);

const SkeletonChart = ({ height = 280 }) => (
  <div
    className="bg-gray-100 rounded-lg animate-pulse flex items-center justify-center"
    style={{ height }}
  >
    <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
  </div>
);

const SkeletonTable = ({ rows = 4 }) => (
  <div className="space-y-3 animate-pulse">
    {[...Array(rows)].map((_, i) => (
      <div key={i} className="flex items-center gap-4">
        <div className="h-4 bg-gray-200 rounded w-20" />
        <div className="h-4 bg-gray-200 rounded flex-1" />
        <div className="h-4 bg-gray-200 rounded w-16" />
        <div className="h-4 bg-gray-200 rounded w-20" />
      </div>
    ))}
  </div>
);

const EmptyState = ({ icon: Icon, title, description, action, onAction }) => (
  <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
    <div
      className="w-14 h-14 rounded-full flex items-center justify-center mb-3"
      style={{ backgroundColor: BRAND.primarySoft }}
    >
      <Icon className="w-6 h-6" style={{ color: BRAND.primary }} />
    </div>
    <p className="text-sm font-semibold text-gray-900">{title}</p>
    {description && (
      <p className="text-xs text-gray-500 mt-1 max-w-sm">{description}</p>
    )}
    {action && onAction && (
      <button
        onClick={onAction}
        className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white rounded-lg transition-colors"
        style={{ backgroundColor: BRAND.primary }}
      >
        {action}
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    )}
  </div>
);

const ChartCard = ({ icon, title, subtitle, hasData, emptyTitle, children }) => (
  <Card>
    <SectionHeader icon={icon} title={title} subtitle={subtitle} />
    {hasData ? (
      <div style={{ width: '100%', height: 280 }}>{children}</div>
    ) : (
      <EmptyState icon={icon} title={emptyTitle} />
    )}
  </Card>
);

const tooltipStyle = {
  backgroundColor: '#fff',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  fontSize: '12px',
};

const legendStyle = {
  fontSize: '12px',
  paddingTop: '10px',
};

// ============================================================
// MAIN COMPONENT
// ============================================================

const Dashboard = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Raw data
  const [admin, setAdmin] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [applications, setApplications] = useState([]);
  const [units, setUnits] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [results, setResults] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [semesters, setSemesters] = useState([]);

  // ============================================================
  // FETCH EVERYTHING
  // ============================================================

  const fetchDashboard = useCallback(async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const cached = getCurrentAdmin();

      const [
        adminRes,
        accountsRes,
        profilesRes,
        appsRes,
        unitsRes,
        regsRes,
        resultsRes,
        annRes,
        ayRes,
        semRes,
      ] = await Promise.allSettled([
        cached?.id
          ? api.get(`/adminCredentials/${cached.id}`)
          : Promise.resolve({ data: null }),
        api.get('/accounts'),
        api.get('/profiles'),
        api.get('/applications'),
        api.get('/units'),
        api.get('/unitRegistrations'),
        api.get('/results'),
        api.get('/announcements'),
        api.get('/academicYears'),
        api.get('/semesters'),
      ]);

      const safeArr = (r) =>
        r.status === 'fulfilled' && Array.isArray(r.value.data)
          ? r.value.data
          : [];

      const fetchedAdmin =
        adminRes.status === 'fulfilled' &&
        adminRes.value.data &&
        !Array.isArray(adminRes.value.data)
          ? adminRes.value.data
          : cached;

      setAdmin(fetchedAdmin);
      setAccounts(safeArr(accountsRes));
      setProfiles(safeArr(profilesRes));
      setApplications(safeArr(appsRes));
      setUnits(safeArr(unitsRes));
      setRegistrations(safeArr(regsRes));
      setResults(safeArr(resultsRes));
      setAnnouncements(safeArr(annRes));
      setAcademicYears(safeArr(ayRes));
      setSemesters(safeArr(semRes));

      if (showRefresh) toast.success('Dashboard refreshed successfully');
    } catch (error) {
      console.error('Dashboard error:', error);
      if (!error.response) {
        toast.error(
          'Cannot reach JSON Server. Make sure it is running on port 5000.'
        );
      } else {
        toast.error('Unable to load dashboard information.');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  // ============================================================
  // DERIVED: STUDENTS / STAFF / ADMINS
  // ============================================================

  const students = useMemo(
    () => accounts.filter((a) => !a.role || a.role === 'student'),
    [accounts]
  );

  const lecturers = useMemo(
    () => accounts.filter((a) => a.role === 'lecturer'),
    [accounts]
  );

  const staff = useMemo(
    () => accounts.filter((a) => a.role === 'staff'),
    [accounts]
  );

  const admins = useMemo(
    () => accounts.filter((a) => a.role === 'admin'),
    [accounts]
  );

  // Enrich students with profile photo + full details
  const enrichedStudents = useMemo(() => {
    return students.map((s) => {
      const key = String(s.studentId || s.id);
      const profile = profiles.find(
        (p) =>
          String(p.studentId) === key ||
          String(p.accountId) === String(s.id)
      );
      return {
        ...s,
        full_name: profile?.fullName || s.fullName || '—',
        profile_photo: profile?.profilePhoto || s.profilePhoto || null,
        phone: profile?.phone || s.phone || null,
        county: profile?.county || null,
        city: profile?.city || null,
      };
    });
  }, [students, profiles]);

  // ============================================================
  // DERIVED: STUDENT STATS
  // ============================================================

  const studentStats = useMemo(() => {
    const total = enrichedStudents.length;
    const active = enrichedStudents.filter(
      (s) =>
        String(s.accountStatus || s.status || '').toLowerCase() === 'active'
    ).length;
    const inactive = enrichedStudents.filter(
      (s) =>
        String(s.accountStatus || s.status || '').toLowerCase() === 'inactive'
    ).length;
    const pending = enrichedStudents.filter(
      (s) =>
        String(s.accountStatus || s.status || '').toLowerCase() === 'pending'
    ).length;

    // New this semester — registered in the last 90 days
    const ninetyDaysAgo = Date.now() - 90 * 24 * 60 * 60 * 1000;
    const newThisSemester = enrichedStudents.filter(
      (s) => s.createdAt && new Date(s.createdAt).getTime() >= ninetyDaysAgo
    ).length;

    return { total, active, inactive, pending, new_students: newThisSemester };
  }, [enrichedStudents]);

  // Students grouped by program
  const studentsByProgram = useMemo(() => {
    const counts = {};
    enrichedStudents.forEach((s) => {
      const p = s.program || 'Unknown';
      counts[p] = (counts[p] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([program, count]) => ({ program, count }))
      .sort((a, b) => b.count - a.count);
  }, [enrichedStudents]);

  // ============================================================
  // DERIVED: APPLICATIONS
  // ============================================================

  const applicationStats = useMemo(() => {
    const total = applications.length;
    const stats = {
      total,
      Draft: 0,
      Submitted: 0,
      'Under Review': 0,
      Approved: 0,
      Rejected: 0,
      'Requires Correction': 0,
    };
    applications.forEach((a) => {
      const status = a.status || 'Draft';
      if (stats[status] !== undefined) stats[status] += 1;
    });
    return stats;
  }, [applications]);

  const recentApplications = useMemo(
    () =>
      [...applications]
        .sort(
          (a, b) =>
            new Date(b.submittedAt || b.createdAt || 0) -
            new Date(a.submittedAt || a.createdAt || 0)
        )
        .slice(0, 5)
        .map((a) => {
          const acc = accounts.find(
            (x) =>
              String(x.studentId) === String(a.studentId) ||
              String(x.id) === String(a.studentId)
          );
          return {
            ...a,
            student_name:
              acc?.fullName ||
              `${acc?.firstName || ''} ${acc?.lastName || ''}`.trim() ||
              a.studentName ||
              '—',
          };
        }),
    [applications, accounts]
  );

  // Application trend — count per month for the last 6 months
  const applicationTrend = useMemo(() => {
    const months = {};
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = d.toLocaleString('en-US', {
        month: 'short',
        year: 'numeric',
      });
      months[label] = 0;
    }

    applications.forEach((a) => {
      const dateStr = a.submittedAt || a.createdAt;
      if (!dateStr) return;
      const d = new Date(dateStr);
      const label = d.toLocaleString('en-US', {
        month: 'short',
        year: 'numeric',
      });
      if (months[label] !== undefined) months[label] += 1;
    });

    return Object.entries(months).map(([month, count]) => ({ month, count }));
  }, [applications]);

  // ============================================================
  // DERIVED: UNITS
  // ============================================================

  const unitStats = useMemo(() => {
    const total = units.length;
    const active = units.filter(
      (u) => (u.status || 'Active').toLowerCase() === 'active'
    ).length;
    const inactive = units.filter(
      (u) => (u.status || '').toLowerCase() === 'inactive'
    ).length;
    const thisSemester = units.filter(
      (u) => u.semester === (semesters[0]?.name || 'Semester 1')
    ).length;
    return { total, active, inactive, this_semester: thisSemester };
  }, [units, semesters]);

  const recentUnits = useMemo(
    () =>
      [...units]
        .sort(
          (a, b) =>
            new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        )
        .slice(0, 5),
    [units]
  );

  // ============================================================
  // DERIVED: UNIT REGISTRATIONS
  // ============================================================

  const registrationStats = useMemo(() => {
    const total = registrations.length;
    const stats = {
      total,
      Pending: 0,
      Registered: 0,
      Approved: 0,
      Dropped: 0,
      Completed: 0,
    };
    registrations.forEach((r) => {
      const status = r.status || 'Pending';
      if (stats[status] !== undefined) stats[status] += 1;
    });
    // Normalized "active" = everything except dropped/rejected
    stats.Active =
      stats.Pending + stats.Registered + stats.Approved + stats.Completed;
    return stats;
  }, [registrations]);

  const recentRegistrations = useMemo(
    () =>
      [...registrations]
        .sort(
          (a, b) =>
            new Date(b.registrationDate || b.createdAt || 0) -
            new Date(a.registrationDate || a.createdAt || 0)
        )
        .slice(0, 5),
    [registrations]
  );

  // Registration trend per month
  const registrationTrend = useMemo(() => {
    const months = {};
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = d.toLocaleString('en-US', {
        month: 'short',
        year: 'numeric',
      });
      months[label] = 0;
    }

    registrations.forEach((r) => {
      const dateStr = r.registrationDate || r.createdAt;
      if (!dateStr) return;
      const d = new Date(dateStr);
      const label = d.toLocaleString('en-US', {
        month: 'short',
        year: 'numeric',
      });
      if (months[label] !== undefined) months[label] += 1;
    });

    return Object.entries(months).map(([month, count]) => ({ month, count }));
  }, [registrations]);

  // ============================================================
  // DERIVED: RESULTS
  // ============================================================

  const resultStats = useMemo(() => {
    const total = results.length;
    const stats = {
      total,
      Pending: 0,
      Published: 0,
      Withheld: 0,
      Incomplete: 0,
      Draft: 0,
    };
    results.forEach((r) => {
      const status = r.status || 'Pending';
      if (stats[status] !== undefined) stats[status] += 1;
    });
    const studentsWithResults = new Set(
      results.map((r) => r.studentId).filter(Boolean)
    ).size;

    // Compute average GPA across published results
    const published = results.filter((r) => r.status === 'Published');
    const gpas = published.map((r) => parseFloat(r.gradePoint)).filter((g) => !isNaN(g));
    const averageGpa =
      gpas.length > 0 ? gpas.reduce((a, b) => a + b, 0) / gpas.length : 0;
    const highestGpa = gpas.length > 0 ? Math.max(...gpas) : 0;

    return {
      ...stats,
      students_with_results: studentsWithResults,
      average_gpa: averageGpa,
      highest_gpa: highestGpa,
    };
  }, [results]);

  const gradeDistribution = useMemo(() => {
    const counts = {};
    results.forEach((r) => {
      if (!r.grade) return;
      if (String(r.status || '').toLowerCase() !== 'published') return;
      counts[r.grade] = (counts[r.grade] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([grade, count]) => ({ grade, count }))
      .sort((a, b) => {
        const order = ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'E', 'F'];
        return order.indexOf(a.grade) - order.indexOf(b.grade);
      });
  }, [results]);

  // GPA trend per semester
  const gpaTrend = useMemo(() => {
    const bySem = {};
    results
      .filter((r) => String(r.status || '').toLowerCase() === 'published')
      .forEach((r) => {
        const gp = parseFloat(r.gradePoint);
        if (isNaN(gp)) return;
        const label = r.semester || '—';
        if (!bySem[label]) bySem[label] = { totalPoints: 0, totalCredits: 0 };
        const credits = parseFloat(r.creditHours) || 0;
        bySem[label].totalPoints += gp * credits;
        bySem[label].totalCredits += credits;
      });
    return Object.entries(bySem)
      .filter(([, b]) => b.totalCredits > 0)
      .map(([label, b]) => ({
        semester: label,
        gpa: parseFloat((b.totalPoints / b.totalCredits).toFixed(2)),
      }));
  }, [results]);

  const recentResults = useMemo(
    () =>
      [...results]
        .filter((r) => String(r.status || '').toLowerCase() === 'published')
        .sort(
          (a, b) =>
            new Date(b.publishedAt || b.updatedAt || 0) -
            new Date(a.publishedAt || a.updatedAt || 0)
        )
        .slice(0, 5),
    [results]
  );

  // ============================================================
  // DERIVED: USERS / STAFF
  // ============================================================

  const userStats = useMemo(() => {
    const total = accounts.length;
    const active = accounts.filter(
      (a) => String(a.accountStatus || a.status || '').toLowerCase() === 'active'
    ).length;
    const inactive = accounts.filter(
      (a) => String(a.accountStatus || a.status || '').toLowerCase() === 'inactive'
    ).length;
    return {
      total,
      students: students.length,
      lecturers: lecturers.length,
      staff: staff.length,
      administrators: admins.length,
      active,
      inactive,
    };
  }, [accounts, students, lecturers, staff, admins]);

  // ============================================================
  // DERIVED: ACTIVITY FEED
  // ============================================================

  const recentActivity = useMemo(() => {
    const events = [];

    // Latest applications
    applications.slice(0, 10).forEach((a) => {
      events.push({
        id: `app-${a.id}`,
        activity: `Application ${a.status || 'submitted'}`,
        details: `${a.applicationType || 'Application'} for ${
          a.studentId || 'student'
        }`,
        user_name: a.studentName || 'Student',
        created_at: a.submittedAt || a.createdAt,
      });
    });

    // Latest registrations
    registrations.slice(0, 10).forEach((r) => {
      events.push({
        id: `reg-${r.id}`,
        activity: `Unit registration ${r.status || 'updated'}`,
        details: `${r.unitCode || 'Unit'} for ${
          r.studentName || r.studentId || 'student'
        }`,
        user_name: r.studentName || 'Student',
        created_at: r.registrationDate || r.createdAt,
      });
    });

    // Latest results
    results.slice(0, 10).forEach((r) => {
      events.push({
        id: `res-${r.id}`,
        activity: `Result ${r.status || 'updated'}`,
        details: `${r.unitCode || 'Unit'} · ${r.grade || '—'}`,
        user_name: r.studentName || r.studentId || 'Student',
        created_at: r.publishedAt || r.updatedAt || r.createdAt,
      });
    });

    // Sort by date desc and take top 10
    return events
      .filter((e) => e.created_at)
      .sort(
        (a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)
      )
      .slice(0, 10);
  }, [applications, registrations, results]);

  // ============================================================
  // DERIVED: ANNOUNCEMENTS
  // ============================================================

  const recentAnnouncements = useMemo(
    () =>
      [...announcements]
        .sort(
          (a, b) =>
            new Date(b.createdAt || b.created_at || 0) -
            new Date(a.createdAt || a.created_at || 0)
        )
        .slice(0, 5),
    [announcements]
  );

  // ============================================================
  // DERIVED: CHART DATA
  // ============================================================

  const appPieData = useMemo(() => {
    const keys = [
      'Draft',
      'Submitted',
      'Under Review',
      'Approved',
      'Rejected',
      'Requires Correction',
    ];
    return keys
      .map((key) => ({ name: key, value: applicationStats[key] || 0, key }))
      .filter((d) => d.value > 0);
  }, [applicationStats]);

  const regBarData = useMemo(() => {
    const keys = ['Pending', 'Registered', 'Approved', 'Dropped', 'Completed'];
    return keys
      .map((key) => ({ name: key, value: registrationStats[key] || 0, key }))
      .filter((d) => d.value > 0);
  }, [registrationStats]);

  const gradeBarData = useMemo(
    () => gradeDistribution.map((g) => ({ grade: g.grade, count: g.count })),
    [gradeDistribution]
  );

  // Academic period labels (for header)
  const activeAcademicYear = useMemo(() => {
    const active = academicYears.find(
      (y) => (y.status || '').toLowerCase() === 'active'
    );
    return active?.name || academicYears[0]?.name || '2025/2026';
  }, [academicYears]);

  const activeSemester = useMemo(() => {
    const active = semesters.find(
      (s) => (s.status || '').toLowerCase() === 'active'
    );
    return active?.name || semesters[0]?.name || 'Semester 1';
  }, [semesters]);

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ToastContainer position="top-right" autoClose={4000} theme="light" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gray-200" />
              <div className="flex-1 space-y-2">
                <div className="h-5 bg-gray-200 rounded w-72" />
                <div className="h-3 bg-gray-200 rounded w-96" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {[...Array(8)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card><SkeletonChart /></Card>
            <Card><SkeletonChart /></Card>
          </div>
          <Card><SkeletonTable rows={5} /></Card>
        </div>
      </div>
    );
  }

  // ============================================================
  // RENDER
  // ============================================================

  const adminDisplayName =
    `${admin?.first_name || ''} ${admin?.last_name || ''}`.trim() ||
    admin?.full_name ||
    admin?.email ||
    'Administrator';

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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* ============================================================
            1. WELCOME HEADER
            ============================================================ */}
        <div
          className="rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${BRAND.primary} 0%, ${BRAND.accent} 100%)`,
          }}
        >
          <div
            className="absolute -top-20 -right-20 w-64 h-64 rounded-full"
            style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}
          />
          <div
            className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full"
            style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}
          />

          <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-5 justify-between">
            <div className="flex items-start gap-4 flex-1">
              <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center flex-shrink-0 border border-white/20">
                <LayoutDashboard className="w-7 h-7" />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold">
                  Welcome to SkillNest Admin Dashboard
                </h1>
                <p className="text-sm text-white/80 mt-1">
                  {adminDisplayName} · {admin?.role || 'Administrator'}
                </p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-xs">
                  <span className="inline-flex items-center gap-1.5 text-white/80">
                    <Calendar className="w-3.5 h-3.5" />
                    Academic Year: {activeAcademicYear}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-white/80">
                    <BookMarked className="w-3.5 h-3.5" />
                    Current Semester: {activeSemester}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => fetchDashboard(true)}
                disabled={refreshing}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur transition-colors disabled:opacity-50"
              >
                <RefreshCw
                  className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`}
                />
                <span className="hidden sm:inline">Refresh</span>
              </button>
              <button
                onClick={() => navigate('/admin/settings')}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-lg bg-white text-[#4A2F17] hover:bg-white/90 transition-colors"
              >
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Settings</span>
              </button>
            </div>
          </div>
        </div>

        {/* ============================================================
            2. MAIN STATISTICS
            ============================================================ */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          <StatCard
            icon={GraduationCap}
            title="Total Students"
            value={studentStats.total}
            description="Registered students"
            accent="brown"
          />
          <StatCard
            icon={CheckCircle}
            title="Active Students"
            value={studentStats.active}
            description="Currently active"
            accent="emerald"
          />
          <StatCard
            icon={FileText}
            title="Pending Applications"
            value={
              applicationStats.Submitted + applicationStats['Under Review']
            }
            description="Awaiting review"
            accent="amber"
          />
          <StatCard
            icon={BookOpen}
            title="Total Units"
            value={unitStats.total}
            description="Academic units"
            accent="blue"
          />
          <StatCard
            icon={ClipboardList}
            title="Unit Registrations"
            value={registrationStats.total}
            description="All registrations"
            accent="purple"
          />
          <StatCard
            icon={Award}
            title="Published Results"
            value={resultStats.Published}
            description="Available to students"
            accent="emerald"
          />
          <StatCard
            icon={UserCog}
            title="Total Users"
            value={userStats.total}
            description="System accounts"
            accent="brown"
          />
          <StatCard
            icon={Users}
            title="Staff & Lecturers"
            value={userStats.lecturers + userStats.staff}
            description="Faculty & staff"
            accent="orange"
          />
        </div>

        {/* ============================================================
            3. APPLICATIONS — Overview + Pie + Trend
            ============================================================ */}
        <Card>
          <SectionHeader
            icon={FileText}
            title="Application Overview"
            subtitle="Applications submitted by students"
            action="Review Applications"
            onAction={() => navigate('/admin/applications')}
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2 mb-5">
            {[
              { label: 'Total', value: applicationStats.total },
              { label: 'Draft', value: applicationStats.Draft },
              { label: 'Submitted', value: applicationStats.Submitted },
              {
                label: 'Under Review',
                value: applicationStats['Under Review'],
              },
              { label: 'Approved', value: applicationStats.Approved },
              { label: 'Rejected', value: applicationStats.Rejected },
              {
                label: 'Correction',
                value: applicationStats['Requires Correction'],
              },
            ].map((s) => (
              <div
                key={s.label}
                className="p-3 rounded-lg bg-gray-50 border border-gray-100"
              >
                <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider truncate">
                  {s.label}
                </p>
                <p className="text-lg font-bold text-gray-900 mt-0.5">
                  {s.value}
                </p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Application Status Distribution
              </p>
              {appPieData.length === 0 ? (
                <EmptyState
                  icon={PieIcon}
                  title="No application data available."
                />
              ) : (
                <div style={{ width: '100%', height: 260 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={appPieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={90}
                        paddingAngle={3}
                        label={({ name, percent }) =>
                          `${(percent * 100).toFixed(0)}%`
                        }
                        labelLine={false}
                      >
                        {appPieData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={APPLICATION_COLORS[entry.key] || '#9CA3AF'}
                          />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={tooltipStyle} />
                      <Legend
                        verticalAlign="bottom"
                        iconType="circle"
                        wrapperStyle={legendStyle}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Application Submission Trend
              </p>
              {applicationTrend.every((t) => t.count === 0) ? (
                <EmptyState
                  icon={LineIcon}
                  title="No historical trend data available."
                />
              ) : (
                <div style={{ width: '100%', height: 260 }}>
                  <ResponsiveContainer>
                    <LineChart data={applicationTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis
                        dataKey="month"
                        tick={{ fontSize: 11, fill: '#6b7280' }}
                      />
                      <YAxis
                        allowDecimals={false}
                        tick={{ fontSize: 11, fill: '#6b7280' }}
                      />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Line
                        type="monotone"
                        dataKey="count"
                        name="Applications"
                        stroke={LINE_COLOR}
                        strokeWidth={2.5}
                        dot={{
                          r: 4,
                          fill: LINE_COLOR,
                          strokeWidth: 2,
                          stroke: '#fff',
                        }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* ============================================================
            4. RECENT APPLICATIONS
            ============================================================ */}
        <Card>
          <SectionHeader
            icon={ClipboardList}
            title="Recent Applications"
            subtitle="Latest submissions from students"
            action="View All"
            onAction={() => navigate('/admin/applications')}
          />
          {recentApplications.length === 0 ? (
            <EmptyState icon={FileText} title="No applications found." />
          ) : (
            <div className="overflow-x-auto -mx-5">
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="border-b border-gray-200">
                    {[
                      'App ID',
                      'Student ID',
                      'Student Name',
                      'Program',
                      'Type',
                      'Academic Year',
                      'Semester',
                      'Submitted',
                      'Status',
                      'Action',
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-5 py-3 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentApplications.map((a) => (
                    <tr
                      key={a.id || a.application_id}
                      className="hover:bg-gray-50"
                    >
                      <td
                        className="px-5 py-3 text-sm font-semibold whitespace-nowrap"
                        style={{ color: BRAND.primary }}
                      >
                        #{a.id || a.application_id}
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-700 whitespace-nowrap">
                        {a.studentId || '—'}
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-900 max-w-[180px] truncate">
                        {a.student_name || '—'}
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-600 max-w-[160px] truncate">
                        {a.program || '—'}
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-600 whitespace-nowrap">
                        {a.applicationType || a.type || '—'}
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-600 whitespace-nowrap">
                        {a.academicYear || '—'}
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-600 whitespace-nowrap">
                        {a.semester || '—'}
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-600 whitespace-nowrap">
                        {formatDate(a.submittedAt || a.createdAt)}
                      </td>
                      <td className="px-5 py-3">
                        <StatusBadge
                          status={a.status}
                          configMap={APPLICATION_STATUSES}
                        />
                      </td>
                      <td className="px-5 py-3">
                        <button
                          onClick={() => navigate('/admin/applications')}
                          className="p-1.5 text-gray-500 hover:text-[#6B4423] hover:bg-[#F5EFE6] rounded-lg transition-colors"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* ============================================================
            5. STUDENT OVERVIEW
            ============================================================ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <SectionHeader
              icon={GraduationCap}
              title="Student Overview"
              action="Manage Students"
              onAction={() => navigate('/admin/students')}
            />
            <div className="space-y-3">
              {[
                { label: 'Total Students', value: studentStats.total },
                { label: 'Active', value: studentStats.active },
                { label: 'Inactive', value: studentStats.inactive },
                { label: 'Pending', value: studentStats.pending },
                { label: 'New (90 days)', value: studentStats.new_students },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-b-0"
                >
                  <span className="text-sm text-gray-600">{label}</span>
                  <span
                    className="text-lg font-bold"
                    style={{ color: BRAND.primary }}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <div className="lg:col-span-2">
            <ChartCard
              icon={BarChart3}
              title="Students by Program"
              subtitle="Distribution across academic programs"
              hasData={studentsByProgram.length > 0}
              emptyTitle="No student program data available."
            >
              <ResponsiveContainer>
                <BarChart data={studentsByProgram}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="program"
                    tick={{ fontSize: 11, fill: '#6b7280' }}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 11, fill: '#6b7280' }}
                  />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar
                    dataKey="count"
                    name="Students"
                    fill={BAR_COLOR}
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </div>

        {/* ============================================================
            6. RECENT STUDENTS
            ============================================================ */}
        <Card>
          <SectionHeader
            icon={Users}
            title="Recent Students"
            subtitle="Latest student registrations"
            action="View All"
            onAction={() => navigate('/admin/students')}
          />
          {enrichedStudents.length === 0 ? (
            <EmptyState icon={Users} title="No students found." />
          ) : (
            <div className="overflow-x-auto -mx-5">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="border-b border-gray-200">
                    {[
                      'Student ID',
                      'Name',
                      'Program',
                      'Department',
                      'Year',
                      'Status',
                      'Registered',
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-5 py-3 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[...enrichedStudents]
                    .sort(
                      (a, b) =>
                        new Date(b.createdAt || 0) -
                        new Date(a.createdAt || 0)
                    )
                    .slice(0, 5)
                    .map((s) => (
                      <tr key={s.id} className="hover:bg-gray-50">
                        <td
                          className="px-5 py-3 text-sm font-semibold whitespace-nowrap"
                          style={{ color: BRAND.primary }}
                        >
                          {s.studentId || s.id || '—'}
                        </td>
                        <td className="px-5 py-3 text-sm text-gray-900 max-w-[180px] truncate">
                          {s.full_name}
                        </td>
                        <td className="px-5 py-3 text-sm text-gray-600 max-w-[180px] truncate">
                          {s.program || '—'}
                        </td>
                        <td className="px-5 py-3 text-sm text-gray-600 max-w-[160px] truncate">
                          {s.department || '—'}
                        </td>
                        <td className="px-5 py-3 text-sm text-gray-600 whitespace-nowrap">
                          {s.yearOfStudy || '—'}
                        </td>
                        <td className="px-5 py-3">
                          <StatusBadge
                            status={s.accountStatus || s.status || 'Active'}
                            configMap={{
                              Active: APPLICATION_STATUSES.Approved,
                              Pending: APPLICATION_STATUSES['Under Review'],
                              Inactive: APPLICATION_STATUSES.Rejected,
                              Rejected: APPLICATION_STATUSES.Rejected,
                            }}
                          />
                        </td>
                        <td className="px-5 py-3 text-sm text-gray-600 whitespace-nowrap">
                          {formatDate(s.createdAt)}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* ============================================================
            7. UNITS
            ============================================================ */}
        <Card>
          <SectionHeader
            icon={BookOpen}
            title="Unit Overview"
            subtitle="Academic units available for registration"
            action="Manage Units"
            onAction={() => navigate('/admin/units')}
          />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
            {[
              { label: 'Total Units', value: unitStats.total },
              { label: 'Active', value: unitStats.active },
              { label: 'Inactive', value: unitStats.inactive },
              { label: 'This Semester', value: unitStats.this_semester },
            ].map((s) => (
              <div
                key={s.label}
                className="p-3 rounded-lg bg-gray-50 border border-gray-100"
              >
                <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider truncate">
                  {s.label}
                </p>
                <p className="text-lg font-bold text-gray-900 mt-0.5">
                  {s.value}
                </p>
              </div>
            ))}
          </div>

          {recentUnits.length === 0 ? (
            <EmptyState icon={BookOpen} title="No units found." />
          ) : (
            <div className="overflow-x-auto -mx-5">
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="border-b border-gray-200">
                    {[
                      'Unit Code',
                      'Unit Name',
                      'Credit Hrs',
                      'Department',
                      'Program',
                      'Lecturer',
                      'Semester',
                      'Status',
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-5 py-3 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentUnits.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50">
                      <td
                        className="px-5 py-3 text-sm font-semibold whitespace-nowrap"
                        style={{ color: BRAND.primary }}
                      >
                        {u.unitCode || '—'}
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-900 max-w-[220px] truncate">
                        {u.unitName || '—'}
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-600 whitespace-nowrap">
                        {u.creditHours || '—'}
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-600 max-w-[160px] truncate">
                        {u.department || '—'}
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-600 max-w-[160px] truncate">
                        {u.program || '—'}
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-600 max-w-[160px] truncate">
                        {u.lecturer || '—'}
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-600 whitespace-nowrap">
                        {u.semester || '—'}
                      </td>
                      <td className="px-5 py-3">
                        <StatusBadge
                          status={u.status || 'Active'}
                          configMap={{
                            Active: APPLICATION_STATUSES.Approved,
                            Inactive: APPLICATION_STATUSES.Draft,
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* ============================================================
            8. UNIT REGISTRATION
            ============================================================ */}
        <Card>
          <SectionHeader
            icon={ClipboardList}
            title="Unit Registration Overview"
            subtitle="Student unit registrations across the semester"
            action="Manage Registrations"
            onAction={() => navigate('/admin/unit-registration')}
          />

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-5">
            {[
              { label: 'Total', value: registrationStats.total },
              { label: 'Pending', value: registrationStats.Pending },
              { label: 'Registered', value: registrationStats.Registered },
              { label: 'Dropped', value: registrationStats.Dropped },
              { label: 'Completed', value: registrationStats.Completed },
            ].map((s) => (
              <div
                key={s.label}
                className="p-3 rounded-lg bg-gray-50 border border-gray-100"
              >
                <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider truncate">
                  {s.label}
                </p>
                <p className="text-lg font-bold text-gray-900 mt-0.5">
                  {s.value}
                </p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Unit Registration Status
              </p>
              {regBarData.length === 0 ? (
                <EmptyState
                  icon={BarChart3}
                  title="No registration data available."
                />
              ) : (
                <div style={{ width: '100%', height: 260 }}>
                  <ResponsiveContainer>
                    <BarChart data={regBarData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis
                        dataKey="name"
                        tick={{ fontSize: 11, fill: '#6b7280' }}
                      />
                      <YAxis
                        allowDecimals={false}
                        tick={{ fontSize: 11, fill: '#6b7280' }}
                      />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Bar
                        dataKey="value"
                        name="Registrations"
                        radius={[6, 6, 0, 0]}
                      >
                        {regBarData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={UNIT_REG_COLORS[entry.name] || BAR_COLOR}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Unit Registration Trend
              </p>
              {registrationTrend.every((t) => t.count === 0) ? (
                <EmptyState
                  icon={LineIcon}
                  title="No historical registration data available."
                />
              ) : (
                <div style={{ width: '100%', height: 260 }}>
                  <ResponsiveContainer>
                    <LineChart data={registrationTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis
                        dataKey="month"
                        tick={{ fontSize: 11, fill: '#6b7280' }}
                      />
                      <YAxis
                        allowDecimals={false}
                        tick={{ fontSize: 11, fill: '#6b7280' }}
                      />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Line
                        type="monotone"
                        dataKey="count"
                        name="Registrations"
                        stroke={LINE_COLOR}
                        strokeWidth={2.5}
                        dot={{
                          r: 4,
                          fill: LINE_COLOR,
                          strokeWidth: 2,
                          stroke: '#fff',
                        }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* ============================================================
            9. RECENT REGISTRATIONS
            ============================================================ */}
        <Card>
          <SectionHeader
            icon={ClipboardList}
            title="Recent Unit Registrations"
            subtitle="Latest student registrations"
            action="View All"
            onAction={() => navigate('/admin/unit-registration')}
          />
          {recentRegistrations.length === 0 ? (
            <EmptyState icon={ClipboardList} title="No registrations found." />
          ) : (
            <div className="overflow-x-auto -mx-5">
              <table className="w-full min-w-[1000px]">
                <thead>
                  <tr className="border-b border-gray-200">
                    {[
                      'Reg ID',
                      'Student ID',
                      'Student Name',
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
                        className="px-5 py-3 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentRegistrations.map((r) => (
                    <tr key={r.id} className="hover:bg-gray-50">
                      <td
                        className="px-5 py-3 text-sm font-semibold whitespace-nowrap"
                        style={{ color: BRAND.primary }}
                      >
                        #{r.id}
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-700 whitespace-nowrap">
                        {r.studentId || '—'}
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-900 max-w-[180px] truncate">
                        {r.studentName || '—'}
                      </td>
                      <td
                        className="px-5 py-3 text-sm font-semibold whitespace-nowrap"
                        style={{ color: BRAND.primary }}
                      >
                        {r.unitCode || '—'}
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-600 max-w-[220px] truncate">
                        {r.unitName || '—'}
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-600 whitespace-nowrap">
                        {r.creditHours || '—'}
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-600 whitespace-nowrap">
                        {r.semester || '—'}
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-600 whitespace-nowrap">
                        {r.academicYear || '—'}
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-600 whitespace-nowrap">
                        {formatDate(r.registrationDate || r.createdAt)}
                      </td>
                      <td className="px-5 py-3">
                        <StatusBadge
                          status={r.status}
                          configMap={REGISTRATION_STATUSES}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* ============================================================
            10. MARKS & RESULTS
            ============================================================ */}
        <Card>
          <SectionHeader
            icon={Award}
            title="Marks & Results Overview"
            subtitle="Academic results and performance analytics"
            action="Manage Results"
            onAction={() => navigate('/admin/marks')}
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-5">
            {[
              { label: 'Total Results', value: resultStats.total },
              { label: 'Pending', value: resultStats.Pending },
              { label: 'Published', value: resultStats.Published },
              { label: 'Withheld', value: resultStats.Withheld },
              { label: 'Incomplete', value: resultStats.Incomplete },
              {
                label: 'Students with Results',
                value: resultStats.students_with_results,
              },
              {
                label: 'Average GPA',
                value: formatNumber(resultStats.average_gpa),
              },
              {
                label: 'Highest GPA',
                value: formatNumber(resultStats.highest_gpa),
              },
            ].map((s) => (
              <div
                key={s.label}
                className="p-3 rounded-lg bg-gray-50 border border-gray-100"
              >
                <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider truncate">
                  {s.label}
                </p>
                <p className="text-lg font-bold text-gray-900 mt-0.5">
                  {s.value}
                </p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Grade Distribution
              </p>
              {gradeBarData.length === 0 ? (
                <EmptyState
                  icon={BarChart3}
                  title="No published results available."
                />
              ) : (
                <div style={{ width: '100%', height: 260 }}>
                  <ResponsiveContainer>
                    <BarChart data={gradeBarData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis
                        dataKey="grade"
                        tick={{ fontSize: 11, fill: '#6b7280' }}
                      />
                      <YAxis
                        allowDecimals={false}
                        tick={{ fontSize: 11, fill: '#6b7280' }}
                      />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Bar
                        dataKey="count"
                        name="Students"
                        fill={BAR_COLOR}
                        radius={[6, 6, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Average GPA by Semester
              </p>
              {gpaTrend.length === 0 ? (
                <EmptyState
                  icon={LineIcon}
                  title="No GPA trend data available."
                />
              ) : (
                <div style={{ width: '100%', height: 260 }}>
                  <ResponsiveContainer>
                    <LineChart data={gpaTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis
                        dataKey="semester"
                        tick={{ fontSize: 11, fill: '#6b7280' }}
                      />
                      <YAxis
                        domain={[0, 4]}
                        tick={{ fontSize: 11, fill: '#6b7280' }}
                      />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Line
                        type="monotone"
                        dataKey="gpa"
                        name="Average GPA"
                        stroke={LINE_COLOR}
                        strokeWidth={2.5}
                        dot={{
                          r: 4,
                          fill: LINE_COLOR,
                          strokeWidth: 2,
                          stroke: '#fff',
                        }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* ============================================================
            11. RECENT RESULTS
            ============================================================ */}
        <Card>
          <SectionHeader
            icon={Award}
            title="Recent Results"
            subtitle="Latest published academic results"
            action="View All"
            onAction={() => navigate('/admin/marks')}
          />
          {recentResults.length === 0 ? (
            <EmptyState icon={Award} title="No published results." />
          ) : (
            <div className="overflow-x-auto -mx-5">
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="border-b border-gray-200">
                    {[
                      'Student ID',
                      'Student Name',
                      'Unit Code',
                      'Unit Name',
                      'Total',
                      'Grade',
                      'GP',
                      'Semester',
                      'Status',
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-5 py-3 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentResults.map((r) => (
                    <tr key={r.id} className="hover:bg-gray-50">
                      <td
                        className="px-5 py-3 text-sm font-semibold whitespace-nowrap"
                        style={{ color: BRAND.primary }}
                      >
                        {r.studentId || '—'}
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-900 max-w-[180px] truncate">
                        {r.studentName || '—'}
                      </td>
                      <td
                        className="px-5 py-3 text-sm font-semibold whitespace-nowrap"
                        style={{ color: BRAND.primary }}
                      >
                        {r.unitCode || '—'}
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-600 max-w-[220px] truncate">
                        {r.unitName || '—'}
                      </td>
                      <td className="px-5 py-3 text-sm font-semibold text-gray-900 whitespace-nowrap">
                        {formatNumber(r.totalMarks, 1)}
                      </td>
                      <td className="px-5 py-3">
                        <GradeBadge grade={r.grade} />
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-600 whitespace-nowrap">
                        {formatNumber(r.gradePoint, 1)}
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-600 whitespace-nowrap">
                        {r.semester || '—'}
                      </td>
                      <td className="px-5 py-3">
                        <StatusBadge
                          status={r.status}
                          configMap={RESULT_STATUSES}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* ============================================================
            12. USERS & STAFF
            ============================================================ */}
        <Card>
          <SectionHeader
            icon={UserCog}
            title="Users & Staff Summary"
            subtitle="System accounts across all roles"
            action="Manage Users"
            onAction={() => navigate('/admin/users')}
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
            {[
              { label: 'Total Users', value: userStats.total },
              { label: 'Students', value: userStats.students },
              { label: 'Lecturers', value: userStats.lecturers },
              { label: 'Staff', value: userStats.staff },
              { label: 'Administrators', value: userStats.administrators },
              { label: 'Active', value: userStats.active },
              { label: 'Inactive', value: userStats.inactive },
            ].map((s) => (
              <div
                key={s.label}
                className="p-3 rounded-lg bg-gray-50 border border-gray-100"
              >
                <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider truncate">
                  {s.label}
                </p>
                <p className="text-lg font-bold text-gray-900 mt-0.5">
                  {s.value}
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* ============================================================
            13. ACTIVITY + QUICK ACTIONS
            ============================================================ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <SectionHeader
                icon={Activity}
                title="Recent System Activity"
                subtitle="Latest administrative actions"
              />
              {recentActivity.length === 0 ? (
                <EmptyState icon={Activity} title="No recent activity." />
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto -mx-5">
                  {recentActivity.map((a) => (
                    <div
                      key={a.id}
                      className="px-5 py-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className="p-2 rounded-lg flex-shrink-0 mt-0.5"
                          style={{ backgroundColor: BRAND.primarySoft }}
                        >
                          <Activity
                            className="w-3.5 h-3.5"
                            style={{ color: BRAND.primary }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            {a.activity}
                          </p>
                          {a.details && (
                            <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                              {a.details}
                            </p>
                          )}
                          <div className="flex items-center gap-3 mt-1 text-[10px] text-gray-400">
                            {a.user_name && (
                              <span className="inline-flex items-center gap-1">
                                <User className="w-3 h-3" />
                                {a.user_name}
                              </span>
                            )}
                            <span className="inline-flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatDateTime(a.created_at)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          <Card>
            <SectionHeader
              icon={LayoutDashboard}
              title="Quick Actions"
              subtitle="Jump to admin modules"
            />
            <div className="grid grid-cols-1 gap-2">
              {[
                {
                  icon: FileText,
                  label: 'Review Applications',
                  path: '/admin/applications',
                },
                {
                  icon: GraduationCap,
                  label: 'Manage Students',
                  path: '/admin/students',
                },
                {
                  icon: BookOpen,
                  label: 'Manage Units',
                  path: '/admin/units',
                },
                {
                  icon: ClipboardList,
                  label: 'Unit Registration',
                  path: '/admin/unit-registration',
                },
                {
                  icon: Award,
                  label: 'Marks & Results',
                  path: '/admin/marks',
                },
                {
                  icon: UserCog,
                  label: 'Users & Staff',
                  path: '/admin/users',
                },
                {
                  icon: Settings,
                  label: 'Settings',
                  path: '/admin/settings',
                },
              ].map(({ icon: Icon, label, path }) => (
                <button
                  key={path}
                  onClick={() => navigate(path)}
                  className="flex items-center justify-between gap-3 p-3 rounded-lg border border-gray-200 hover:border-[#E0D3C0] hover:bg-[#F5EFE6]/60 transition-all text-left group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="p-2 rounded-lg flex-shrink-0"
                      style={{ backgroundColor: BRAND.primarySoft }}
                    >
                      <Icon
                        className="w-4 h-4"
                        style={{ color: BRAND.primary }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-800 truncate">
                      {label}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#6B4423] transition-colors flex-shrink-0" />
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* ============================================================
            14. ANNOUNCEMENTS
            ============================================================ */}
        <Card>
          <SectionHeader
            icon={Megaphone}
            title="Recent Announcements"
            subtitle="Latest university-wide notices"
            action="Manage in Settings"
            onAction={() => navigate('/admin/settings')}
          />
          {recentAnnouncements.length === 0 ? (
            <EmptyState icon={Megaphone} title="No announcements." />
          ) : (
            <div className="space-y-3">
              {recentAnnouncements.map((a) => (
                <div
                  key={a.id}
                  className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-gray-900">
                        {a.title}
                      </h4>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {formatDate(a.createdAt || a.created_at)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {a.priority && (
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider ${
                            a.priority === 'Urgent'
                              ? 'bg-red-100 text-red-700'
                              : a.priority === 'High'
                              ? 'bg-orange-100 text-orange-700'
                              : a.priority === 'Low'
                              ? 'bg-gray-100 text-gray-600'
                              : 'bg-blue-50 text-blue-700'
                          }`}
                        >
                          {a.priority}
                        </span>
                      )}
                      {a.status && (
                        <StatusBadge
                          status={a.status}
                          configMap={{
                            Published: APPLICATION_STATUSES.Approved,
                            Draft: APPLICATION_STATUSES.Draft,
                            Archived: {
                              bg: 'bg-amber-50',
                              text: 'text-amber-700',
                              border: 'border-amber-200',
                              icon: FileWarning,
                            },
                          }}
                        />
                      )}
                    </div>
                  </div>
                  {a.content && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {a.content}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;