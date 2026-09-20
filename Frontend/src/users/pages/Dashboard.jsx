// src/users/pages/Dashboard.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  LayoutDashboard,
  BookOpen,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Award,
  FileText,
  Send,
  User,
  Mail,
  Phone,
  Building2,
  GraduationCap,
  Layers,
  Calendar,
  Bell,
  Eye,
  RefreshCw,
  Loader2,
  AlertCircle,
  ChevronRight,
  Percent,
  Target,
  Hash,
  IdCard,
  ArrowRight,
  FileCheck,
  FileWarning,
  BookMarked,
  Activity,
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
// API CONFIGURATION
// ============================================================

const getApiBaseUrl = () => {
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  return 'http://localhost:5000';
};

const API_BASE_URL = getApiBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = '/student-portal';
    }
    return Promise.reject(error);
  }
);

// ============================================================
// DESIGN TOKENS — SkillNest Brown/Amber Theme
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

// Chart palette — brown/amber dominant, semantic for statuses
const CHART_COLORS = {
  registered: '#6B4423',
  pending: '#D97706',
  completed: '#059669',
  dropped: '#DC2626',
};

const PIE_COLORS = ['#6B4423', '#D97706', '#059669', '#DC2626'];
const LINE_COLOR = '#6B4423';
const BAR_COLOR = '#8B5E34';

// ============================================================
// CONSTANTS
// ============================================================

const APPLICATION_STATUSES = {
  Draft: {
    bg: 'bg-gray-50',
    text: 'text-gray-700',
    border: 'border-gray-200',
    icon: FileText,
  },
  Submitted: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    icon: Send,
  },
  'Under Review': {
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
  Rejected: {
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
    icon: XCircle,
  },
  'Requires Correction': {
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    border: 'border-orange-200',
    icon: FileWarning,
  },
};

const UNIT_STATUSES = {
  Registered: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    icon: CheckCircle,
  },
  Pending: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    icon: Clock,
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

const RESULT_STATUSES = {
  Pending: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    icon: Clock,
  },
  Published: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    icon: CheckCircle,
  },
  Withheld: {
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
    icon: AlertCircle,
  },
  Incomplete: {
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    border: 'border-orange-200',
    icon: FileWarning,
  },
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

const getInitials = (name) => {
  if (!name) return 'ST';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// ============================================================
// SUB-COMPONENTS
// ============================================================

// Generic status badge
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
      {status}
    </span>
  );
};

// Grade badge
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

// Stat card
const StatCard = ({ icon: Icon, title, value, description, accent = 'brown' }) => {
  const accents = {
    brown: { bg: 'bg-[#F5EFE6]', text: 'text-[#6B4423]', bar: 'bg-[#6B4423]' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-600', bar: 'bg-amber-500' },
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', bar: 'bg-emerald-500' },
    blue: { bg: 'bg-blue-50', text: 'text-blue-600', bar: 'bg-blue-500' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-600', bar: 'bg-purple-500' },
    red: { bg: 'bg-red-50', text: 'text-red-600', bar: 'bg-red-500' },
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

// Section header with optional action
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
        <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ color: BRAND.primaryDark }}>
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
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = BRAND.primaryBorder;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = BRAND.primarySoft;
        }}
      >
        {action}
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
    )}
  </div>
);

// Card wrapper
const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-xl border border-gray-200 p-5 ${className}`}>
    {children}
  </div>
);

// Loading skeleton
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

// Empty state
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
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor = BRAND.primaryDark)
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = BRAND.primary)
        }
      >
        {action}
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    )}
  </div>
);

// ============================================================
// MAIN COMPONENT
// ============================================================

const Dashboard = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Data
  const [student, setStudent] = useState(null);
  const [stats, setStats] = useState(null);
  const [application, setApplication] = useState(null);
  const [units, setUnits] = useState([]);
  const [results, setResults] = useState([]);
  const [gpaHistory, setGpaHistory] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [registrationHistory, setRegistrationHistory] = useState([]);

  // ============================================================
  // FETCH ALL DASHBOARD DATA
  // ============================================================

  const fetchDashboard = useCallback(async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const results = await Promise.allSettled([
        api.get('/api/student/dashboard'),
        api.get('/api/student/application'),
        api.get('/api/student/registered-units'),
        api.get('/api/student/results'),
        api.get('/api/student/results/gpa-history'),
        api.get('/api/student/notifications'),
        api.get('/api/student/dashboard/registration-history'),
      ]);

      const [
        dashboardRes,
        applicationRes,
        unitsRes,
        resultsRes,
        gpaRes,
        notificationsRes,
        regHistoryRes,
      ] = results;

      // Dashboard main payload — student + stats
      if (dashboardRes.status === 'fulfilled' && dashboardRes.value.data?.success) {
        const d = dashboardRes.value.data;
        setStudent(d.student || null);
        setStats(d.stats || null);
      }

      // Application
      if (applicationRes.status === 'fulfilled' && applicationRes.value.data?.success) {
        setApplication(applicationRes.value.data.application || null);
      }

      // Registered units
      if (unitsRes.status === 'fulfilled' && unitsRes.value.data?.success) {
        setUnits(unitsRes.value.data.units || []);
      }

      // Results
      if (resultsRes.status === 'fulfilled' && resultsRes.value.data?.success) {
        setResults(resultsRes.value.data.results || []);
      }

      // GPA history
      if (gpaRes.status === 'fulfilled' && gpaRes.value.data?.success) {
        setGpaHistory(gpaRes.value.data.history || []);
      }

      // Notifications
      if (
        notificationsRes.status === 'fulfilled' &&
        notificationsRes.value.data?.success
      ) {
        setNotifications(notificationsRes.value.data.notifications || []);
      }

      // Registration history
      if (
        regHistoryRes.status === 'fulfilled' &&
        regHistoryRes.value.data?.success
      ) {
        setRegistrationHistory(regHistoryRes.value.data.history || []);
      }

      if (showRefresh) toast.success('Dashboard refreshed');
    } catch (error) {
      console.error('Dashboard error:', error);

      if (error.response?.status === 401) {
        toast.error('Your session has expired. Please login again.');
      } else if (error.response?.status === 403) {
        toast.error('You are not authorized to view this dashboard.');
      } else if (error.response?.status === 500) {
        toast.error('Server error. Please try again later.');
      } else if (!error.response) {
        toast.error('Unable to connect to the server.');
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
  // DERIVED DATA
  // ============================================================

  // Unit registration composition for pie chart
  const unitStatusData = React.useMemo(() => {
    const counts = { Registered: 0, Pending: 0, Completed: 0, Dropped: 0 };
    units.forEach((u) => {
      const status = u.status || 'Registered';
      if (counts[status] !== undefined) counts[status] += 1;
    });
    return Object.entries(counts)
      .filter(([, value]) => value > 0)
      .map(([name, value]) => ({ name, value }));
  }, [units]);

  // Published results — for bar chart and recent table
  const publishedResults = React.useMemo(
    () => results.filter((r) => r.status === 'Published'),
    [results]
  );

  // Bar chart: total marks per unit
  const barChartData = React.useMemo(
    () =>
      publishedResults.slice(0, 8).map((r) => ({
        unit: r.unit_code || '—',
        total: parseFloat(r.total_marks) || 0,
      })),
    [publishedResults]
  );

  // GPA line chart data
  const gpaLineData = React.useMemo(
    () =>
      gpaHistory.map((h) => ({
        semester: h.semester || '—',
        gpa: parseFloat(h.gpa) || 0,
      })),
    [gpaHistory]
  );

  // Registration activity line chart
  const regActivityData = React.useMemo(
    () =>
      registrationHistory.map((h) => ({
        period: h.period || '—',
        units: parseInt(h.units) || 0,
      })),
    [registrationHistory]
  );

  // Recent results (top 5 by date)
  const recentResults = React.useMemo(
    () =>
      [...publishedResults]
        .sort(
          (a, b) =>
            new Date(b.published_at || b.updated_at || 0) -
            new Date(a.published_at || a.updated_at || 0)
        )
        .slice(0, 5),
    [publishedResults]
  );

  // Unread notifications count
  const unreadCount = notifications.filter((n) => !n.read).length;

  // ============================================================
  // LOADING STATE
  // ============================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ToastContainer position="top-right" autoClose={4000} theme="light" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {/* Header skeleton */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gray-200" />
              <div className="flex-1 space-y-2">
                <div className="h-5 bg-gray-200 rounded w-64" />
                <div className="h-3 bg-gray-200 rounded w-96" />
              </div>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[...Array(6)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <SkeletonChart />
            </Card>
            <Card>
              <SkeletonChart />
            </Card>
          </div>

          {/* Tables */}
          <Card>
            <SkeletonTable rows={5} />
          </Card>
        </div>
      </div>
    );
  }

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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* ============================================================
            1. WELCOME SECTION
            ============================================================ */}
        <div
          className="rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${BRAND.primary} 0%, ${BRAND.accent} 100%)`,
          }}
        >
          {/* Decorative circles */}
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
              {/* Avatar */}
              <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center flex-shrink-0 border border-white/20">
                {student?.profile_photo ? (
                  <img
                    src={student.profile_photo}
                    alt={student.full_name || 'Student'}
                    className="w-full h-full rounded-2xl object-cover"
                  />
                ) : (
                  <span className="text-xl font-bold">
                    {getInitials(student?.full_name || 'Student')}
                  </span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold truncate">
                  Welcome back, {student?.full_name?.split(' ')[0] || 'Student'}
                </h1>
                <p className="text-sm text-white/80 mt-0.5">
                  {student?.program || 'Program'} ·{' '}
                  {student?.department || 'Department'}
                </p>

                {/* Meta row */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-xs">
                  {student?.student_id && (
                    <span className="inline-flex items-center gap-1.5 text-white/80">
                      <Hash className="w-3.5 h-3.5" />
                      {student.student_id}
                    </span>
                  )}
                  {student?.admission_number && (
                    <span className="inline-flex items-center gap-1.5 text-white/80">
                      <IdCard className="w-3.5 h-3.5" />
                      {student.admission_number}
                    </span>
                  )}
                  {student?.year_of_study && (
                    <span className="inline-flex items-center gap-1.5 text-white/80">
                      <Layers className="w-3.5 h-3.5" />
                      Year {student.year_of_study}
                    </span>
                  )}
                  {student?.academic_year && (
                    <span className="inline-flex items-center gap-1.5 text-white/80">
                      <Calendar className="w-3.5 h-3.5" />
                      {student.academic_year}
                    </span>
                  )}
                  {student?.current_semester && (
                    <span className="inline-flex items-center gap-1.5 text-white/80">
                      <BookMarked className="w-3.5 h-3.5" />
                      {student.current_semester}
                    </span>
                  )}
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
                onClick={() => navigate('/user/profile')}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-lg bg-white text-[#4A2F17] hover:bg-white/90 transition-colors"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">My Profile</span>
              </button>
            </div>
          </div>
        </div>

        {/* ============================================================
            2. ACADEMIC SUMMARY CARDS
            ============================================================ */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <StatCard
            icon={BookOpen}
            title="Registered Units"
            value={
              stats?.registered_units !== undefined
                ? stats.registered_units
                : units.filter((u) => u.status === 'Registered').length
            }
            description="Currently enrolled"
            accent="brown"
          />
          <StatCard
            icon={Award}
            title="Completed Units"
            value={
              stats?.completed_units !== undefined
                ? stats.completed_units
                : units.filter((u) => u.status === 'Completed').length
            }
            description="Successfully passed"
            accent="emerald"
          />
          <StatCard
            icon={Percent}
            title="Current GPA"
            value={formatNumber(stats?.current_gpa)}
            description="This semester"
            accent="amber"
          />
          <StatCard
            icon={TrendingUp}
            title="Cumulative GPA"
            value={formatNumber(stats?.cumulative_gpa)}
            description="Overall"
            accent="purple"
          />
          <StatCard
            icon={Clock}
            title="Pending Application"
            value={
              stats?.pending_application !== undefined
                ? stats.pending_application
                : application && application.status !== 'Approved' && application.status !== 'Rejected'
                ? 1
                : 0
            }
            description="Awaiting action"
            accent="blue"
          />
          <StatCard
            icon={Layers}
            title="Credit Hours"
            value={
              stats?.total_credit_hours !== undefined
                ? stats.total_credit_hours
                : units.reduce((sum, u) => sum + (parseInt(u.credit_hours) || 0), 0)
            }
            description="Total registered"
            accent="red"
          />
        </div>

        {/* ============================================================
            3. APPLICATION STATUS + 10. PROFILE SUMMARY
            ============================================================ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Application Status */}
          <div className="lg:col-span-2">
            <Card>
              <SectionHeader
                icon={FileText}
                title="Application Status"
                subtitle="Your most recent application"
                action={application ? 'View Application' : null}
                onAction={() => navigate('/user/application')}
              />

              {application ? (
                <div className="space-y-4">
                  {/* Status banner */}
                  <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">
                        Current Status
                      </p>
                      <p className="text-sm font-semibold text-gray-900 mt-0.5">
                        {application.application_type || 'Application'}
                      </p>
                    </div>
                    <StatusBadge
                      status={application.status}
                      configMap={APPLICATION_STATUSES}
                    />
                  </div>

                  {/* Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      { label: 'Application ID', value: application.id || application.application_id, icon: Hash },
                      { label: 'Program', value: application.program, icon: BookOpen },
                      { label: 'Academic Year', value: application.academic_year, icon: Calendar },
                      { label: 'Semester', value: application.semester, icon: Calendar },
                      { label: 'Submission Date', value: formatDate(application.submitted_at || application.created_at), icon: Clock },
                      { label: 'Last Updated', value: formatDate(application.updated_at), icon: RefreshCw },
                    ].map(({ label, value, icon: Icon }) => (
                      <div key={label} className="p-3 rounded-lg bg-gray-50">
                        <div className="flex items-center gap-1.5 mb-1">
                          <Icon className="w-3 h-3 text-gray-400" />
                          <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                            {label}
                          </p>
                        </div>
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {value || '—'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <EmptyState
                  icon={FileText}
                  title="You have not submitted an application yet."
                  description="Submit an application to enroll or update your academic records."
                  action="Start Application"
                  onAction={() => navigate('/user/application-form')}
                />
              )}
            </Card>
          </div>

          {/* Profile Summary */}
          <Card>
            <SectionHeader
              icon={User}
              title="Profile Summary"
              action="View Profile"
              onAction={() => navigate('/user/profile')}
            />

            {student ? (
              <div className="space-y-3">
                {/* Avatar + name */}
                <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: BRAND.primarySoft }}
                  >
                    {student.profile_photo ? (
                      <img
                        src={student.profile_photo}
                        alt={student.full_name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span
                        className="text-sm font-bold"
                        style={{ color: BRAND.primary }}
                      >
                        {getInitials(student.full_name)}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {student.full_name || '—'}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {student.student_id || '—'}
                    </p>
                  </div>
                </div>

                {/* Info rows */}
                <div className="space-y-2 text-xs">
                  {[
                    { icon: BookOpen, label: 'Program', value: student.program },
                    { icon: Building2, label: 'Department', value: student.department },
                    { icon: Layers, label: 'Year', value: student.year_of_study ? `Year ${student.year_of_study}` : null },
                    { icon: Mail, label: 'Email', value: student.email },
                    { icon: Phone, label: 'Phone', value: student.phone },
                  ]
                    .filter((item) => item.value)
                    .map(({ icon: Icon, label, value }) => (
                      <div
                        key={label}
                        className="flex items-center gap-2.5 py-1.5"
                      >
                        <Icon className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                        <span className="text-gray-500 w-16 flex-shrink-0">
                          {label}
                        </span>
                        <span className="text-gray-900 font-medium truncate">
                          {value}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            ) : (
              <EmptyState
                icon={User}
                title="Profile information unavailable"
                description="Please complete your profile to see details here."
              />
            )}
          </Card>
        </div>

        {/* ============================================================
            4. UNIT REGISTRATION OVERVIEW
            ============================================================ */}
        <Card>
          <SectionHeader
            icon={BookOpen}
            title="Current Registered Units"
            subtitle={`${units.length} unit${units.length === 1 ? '' : 's'} this semester`}
            action="View All Units"
            onAction={() => navigate('/user/my-registered-units')}
          />

          {units.length === 0 ? (
            <EmptyState
              icon={BookOpen}
              title="No registered units."
              description="Register for units to start your semester."
              action="Register Units"
              onAction={() => navigate('/user/register-units')}
            />
          ) : (
            <div className="overflow-x-auto -mx-5">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="border-b border-gray-200">
                    {[
                      'Unit Code',
                      'Unit Name',
                      'Credit Hrs',
                      'Lecturer',
                      'Semester',
                      'Academic Year',
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
                  {units.slice(0, 6).map((u) => (
                    <tr key={u.id || u.unit_id} className="hover:bg-gray-50">
                      <td
                        className="px-5 py-3 text-sm font-semibold whitespace-nowrap"
                        style={{ color: BRAND.primary }}
                      >
                        {u.unit_code || '—'}
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-700 max-w-[220px] truncate">
                        {u.unit_name || '—'}
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-600 whitespace-nowrap">
                        {u.credit_hours || '—'}
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-600 max-w-[160px] truncate">
                        {u.lecturer || '—'}
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-600 whitespace-nowrap">
                        {u.semester || '—'}
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-600 whitespace-nowrap">
                        {u.academic_year || '—'}
                      </td>
                      <td className="px-5 py-3">
                        <StatusBadge status={u.status} configMap={UNIT_STATUSES} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {units.length > 6 && (
                <div className="px-5 pt-3 text-xs text-gray-500 text-center">
                  Showing 6 of {units.length} units. Click "View All Units" to
                  see more.
                </div>
              )}
            </div>
          )}
        </Card>

        {/* ============================================================
            5 & 7. CHARTS ROW — Pie Chart + GPA Line Chart
            ============================================================ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pie Chart: Unit Registration Status */}
          <Card>
            <SectionHeader
              icon={Activity}
              title="Unit Registration Status"
              subtitle="Composition of your registered units"
            />

            {unitStatusData.length === 0 ? (
              <EmptyState
                icon={Activity}
                title="No registration data"
                description="Register units to see your composition."
              />
            ) : (
              <div style={{ width: '100%', height: 280 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={unitStatusData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={95}
                      paddingAngle={3}
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                      labelLine={false}
                    >
                      {unitStatusData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            CHART_COLORS[entry.name.toLowerCase()] ||
                            PIE_COLORS[index % PIE_COLORS.length]
                          }
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '12px',
                      }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      iconType="circle"
                      wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </Card>

          {/* Line Chart: GPA Progress */}
          <Card>
            <SectionHeader
              icon={TrendingUp}
              title="GPA Progress"
              subtitle="GPA progression by semester"
            />

            {gpaLineData.length === 0 ? (
              <EmptyState
                icon={TrendingUp}
                title="No GPA history available."
                description="Your GPA progression will appear here once results are published."
              />
            ) : (
              <div style={{ width: '100%', height: 280 }}>
                <ResponsiveContainer>
                  <LineChart data={gpaLineData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="semester"
                      tick={{ fontSize: 11, fill: '#6b7280' }}
                      axisLine={{ stroke: '#e5e7eb' }}
                    />
                    <YAxis
                      domain={[0, 4]}
                      tick={{ fontSize: 11, fill: '#6b7280' }}
                      axisLine={{ stroke: '#e5e7eb' }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '12px',
                      }}
                    />
                    <Legend
                      verticalAlign="top"
                      iconType="circle"
                      wrapperStyle={{ fontSize: '12px' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="gpa"
                      name="GPA"
                      stroke={LINE_COLOR}
                      strokeWidth={2.5}
                      dot={{ r: 4, fill: LINE_COLOR, strokeWidth: 2, stroke: '#fff' }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </Card>
        </div>

        {/* ============================================================
            6. ACADEMIC PERFORMANCE
            ============================================================ */}
        <Card>
          <SectionHeader
            icon={Award}
            title="Academic Performance"
            subtitle="Your official academic standing"
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              {
                label: 'Current GPA',
                value: formatNumber(stats?.current_gpa),
                icon: Percent,
              },
              {
                label: 'Cumulative GPA',
                value: formatNumber(stats?.cumulative_gpa),
                icon: TrendingUp,
              },
              {
                label: 'Completed Units',
                value:
                  stats?.completed_units !== undefined
                    ? stats.completed_units
                    : units.filter((u) => u.status === 'Completed').length,
                icon: Award,
              },
              {
                label: 'Total Credit Hours',
                value:
                  stats?.total_credit_hours !== undefined
                    ? stats.total_credit_hours
                    : units.reduce(
                        (sum, u) => sum + (parseInt(u.credit_hours) || 0),
                        0
                      ),
                icon: Layers,
              },
              {
                label: 'Academic Standing',
                value: stats?.academic_standing || '—',
                icon: GraduationCap,
                isText: true,
              },
            ].map(({ label, value, icon: Icon, isText }) => (
              <div
                key={label}
                className="p-4 rounded-xl bg-gray-50 border border-gray-100"
              >
                <div className="flex items-center gap-1.5 mb-2">
                  <Icon className="w-3.5 h-3.5 text-gray-400" />
                  <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                    {label}
                  </p>
                </div>
                <p
                  className={`font-bold ${
                    isText ? 'text-sm' : 'text-xl'
                  } text-gray-900 truncate`}
                  style={isText ? { color: BRAND.primary } : {}}
                >
                  {value || '—'}
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* ============================================================
            8 & 9. RESULTS — Recent Results + Bar Chart
            ============================================================ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Results Table */}
          <Card>
            <SectionHeader
              icon={FileCheck}
              title="Recent Results"
              subtitle="Your latest published results"
              action={results.length > 0 ? 'View All Results' : null}
              onAction={() => navigate('/user/view-marks')}
            />

            {recentResults.length === 0 ? (
              <EmptyState
                icon={FileCheck}
                title="No published results."
                description="Your official results will appear here once published."
              />
            ) : (
              <div className="overflow-x-auto -mx-5">
                <table className="w-full min-w-[500px]">
                  <thead>
                    <tr className="border-b border-gray-200">
                      {[
                        'Unit',
                        'CAT',
                        'Exam',
                        'Total',
                        'Grade',
                        'GP',
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
                        <td className="px-5 py-3">
                          <p
                            className="text-sm font-semibold"
                            style={{ color: BRAND.primary }}
                          >
                            {r.unit_code || '—'}
                          </p>
                          <p className="text-xs text-gray-500 max-w-[160px] truncate">
                            {r.unit_name || ''}
                          </p>
                        </td>
                        <td className="px-5 py-3 text-sm text-gray-700">
                          {formatNumber(r.cat_marks, 1)}
                        </td>
                        <td className="px-5 py-3 text-sm text-gray-700">
                          {formatNumber(r.exam_marks, 1)}
                        </td>
                        <td className="px-5 py-3 text-sm font-semibold text-gray-900">
                          {formatNumber(r.total_marks, 1)}
                        </td>
                        <td className="px-5 py-3">
                          <GradeBadge grade={r.grade} />
                        </td>
                        <td className="px-5 py-3 text-sm text-gray-700">
                          {formatNumber(r.grade_point, 1)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>

          {/* Bar Chart: Current Semester Performance */}
          <Card>
            <SectionHeader
              icon={Target}
              title="Current Semester Performance"
              subtitle="Total marks per unit (published results)"
            />

            {barChartData.length === 0 ? (
              <EmptyState
                icon={Target}
                title="No published results available."
                description="Published marks will appear here once results are released."
              />
            ) : (
              <div style={{ width: '100%', height: 280 }}>
                <ResponsiveContainer>
                  <BarChart data={barChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="unit"
                      tick={{ fontSize: 11, fill: '#6b7280' }}
                      axisLine={{ stroke: '#e5e7eb' }}
                    />
                    <YAxis
                      domain={[0, 100]}
                      tick={{ fontSize: 11, fill: '#6b7280' }}
                      axisLine={{ stroke: '#e5e7eb' }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '12px',
                      }}
                    />
                    <Legend
                      verticalAlign="top"
                      iconType="circle"
                      wrapperStyle={{ fontSize: '12px' }}
                    />
                    <Bar
                      dataKey="total"
                      name="Total Marks"
                      fill={BAR_COLOR}
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </Card>
        </div>

        {/* ============================================================
            13. OPTIONAL LINE CHART — Unit Registration Activity
            ============================================================ */}
        {regActivityData.length > 0 && (
          <Card>
            <SectionHeader
              icon={Activity}
              title="Unit Registration Activity"
              subtitle="Number of registered units over time"
            />
            <div style={{ width: '100%', height: 260 }}>
              <ResponsiveContainer>
                <LineChart data={regActivityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="period"
                    tick={{ fontSize: 11, fill: '#6b7280' }}
                    axisLine={{ stroke: '#e5e7eb' }}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 11, fill: '#6b7280' }}
                    axisLine={{ stroke: '#e5e7eb' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                  <Legend
                    verticalAlign="top"
                    iconType="circle"
                    wrapperStyle={{ fontSize: '12px' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="units"
                    name="Registered Units"
                    stroke={LINE_COLOR}
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: LINE_COLOR, strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        )}

        {/* ============================================================
            11 & 12. NOTIFICATIONS + QUICK ACTIONS
            ============================================================ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Notifications */}
          <div className="lg:col-span-2">
            <Card>
              <SectionHeader
                icon={Bell}
                title="Recent Notifications"
                subtitle={
                  unreadCount > 0
                    ? `${unreadCount} unread notification${
                        unreadCount === 1 ? '' : 's'
                      }`
                    : 'All caught up'
                }
              />

              {notifications.length === 0 ? (
                <EmptyState
                  icon={Bell}
                  title="No notifications."
                  description="You're all caught up. New updates will appear here."
                />
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto -mx-5">
                  {notifications.slice(0, 8).map((n) => (
                    <div
                      key={n.id}
                      className={`px-5 py-3 border-l-2 transition-colors hover:bg-gray-50 ${
                        n.read
                          ? 'border-transparent'
                          : 'border-[#6B4423] bg-[#F5EFE6]/40'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`p-2 rounded-lg flex-shrink-0 ${
                            n.read ? 'bg-gray-100' : ''
                          }`}
                          style={
                            !n.read ? { backgroundColor: BRAND.primarySoft } : {}
                          }
                        >
                          <Bell
                            className={`w-3.5 h-3.5 ${
                              n.read ? 'text-gray-400' : ''
                            }`}
                            style={!n.read ? { color: BRAND.primary } : {}}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p
                              className={`text-sm ${
                                n.read
                                  ? 'font-medium text-gray-700'
                                  : 'font-semibold text-gray-900'
                              }`}
                            >
                              {n.title || 'Notification'}
                            </p>
                            {!n.read && (
                              <span
                                className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5"
                                style={{ backgroundColor: BRAND.primary }}
                              />
                            )}
                          </div>
                          {n.message && (
                            <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                              {n.message}
                            </p>
                          )}
                          <p className="text-[10px] text-gray-400 mt-1">
                            {formatDateTime(n.created_at)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <SectionHeader
              icon={LayoutDashboard}
              title="Quick Actions"
              subtitle="Navigate to your portal"
            />
            <div className="grid grid-cols-1 gap-2">
              {[
                {
                  icon: FileText,
                  label: 'Application Form',
                  path: '/user/application-form',
                },
                {
                  icon: FileCheck,
                  label: 'My Application',
                  path: '/user/application',
                },
                {
                  icon: BookOpen,
                  label: 'Register Units',
                  path: '/user/register-units',
                },
                {
                  icon: BookMarked,
                  label: 'My Registered Units',
                  path: '/user/my-registered-units',
                },
                {
                  icon: Award,
                  label: 'View Marks',
                  path: '/user/view-marks',
                },
                {
                  icon: User,
                  label: 'My Profile',
                  path: '/user/profile',
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
                  <ChevronRight
                    className="w-4 h-4 text-gray-300 group-hover:text-[#6B4423] transition-colors flex-shrink-0"
                  />
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;