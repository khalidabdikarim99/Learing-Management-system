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
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileWarning,
  RefreshCw,
  Loader2,
  ChevronRight,
  ArrowRight,
  Bell,
  Activity,
  Calendar,
  Hash,
  User,
  BookMarked,
  Percent,
  Target,
  Building2,
  Send,
  Megaphone,
  Layers,
  BarChart3,
  PieChart as PieIcon,
  LineChart as LineIcon,
  Eye,
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
      localStorage.getItem('adminToken') ||
      sessionStorage.getItem('adminToken') ||
      localStorage.getItem('token') ||
      sessionStorage.getItem('token');
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
      window.location.href = '/adminlogin';
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

// Chart palette
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
  Submitted: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: Send },
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
      {status}
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

  // Data
  const [admin, setAdmin] = useState(null);
  const [stats, setStats] = useState(null);
  const [applicationStats, setApplicationStats] = useState(null);
  const [applicationTrend, setApplicationTrend] = useState([]);
  const [studentStats, setStudentStats] = useState(null);
  const [studentsByProgram, setStudentsByProgram] = useState([]);
  const [unitStats, setUnitStats] = useState(null);
  const [recentUnits, setRecentUnits] = useState([]);
  const [registrationStats, setRegistrationStats] = useState(null);
  const [registrationTrend, setRegistrationTrend] = useState([]);
  const [recentRegistrations, setRecentRegistrations] = useState([]);
  const [resultStats, setResultStats] = useState(null);
  const [gradeDistribution, setGradeDistribution] = useState([]);
  const [gpaTrend, setGpaTrend] = useState([]);
  const [recentResults, setRecentResults] = useState([]);
  const [recentApplications, setRecentApplications] = useState([]);
  const [recentStudents, setRecentStudents] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  // ============================================================
  // FETCH
  // ============================================================

  const fetchDashboard = useCallback(async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const results = await Promise.allSettled([
        api.get('/api/admin/dashboard'),
        api.get('/api/admin/applications'),
        api.get('/api/admin/applications/trend'),
        api.get('/api/admin/students/statistics'),
        api.get('/api/admin/students'),
        api.get('/api/admin/units'),
        api.get('/api/admin/unit-registration'),
        api.get('/api/admin/unit-registration/trend'),
        api.get('/api/admin/marks'),
        api.get('/api/admin/results/gpa-trend'),
        api.get('/api/admin/users'),
        api.get('/api/admin/activity'),
        api.get('/api/admin/announcements'),
      ]);

      const [
        dashboardRes,
        applicationsRes,
        appTrendRes,
        studentStatsRes,
        studentsRes,
        unitsRes,
        registrationsRes,
        regTrendRes,
        marksRes,
        gpaTrendRes,
        usersRes,
        activityRes,
        annRes,
      ] = results;

      // Dashboard main payload
      if (dashboardRes.status === 'fulfilled' && dashboardRes.value.data?.success) {
        const d = dashboardRes.value.data;
        setAdmin(d.admin || null);
        setStats(d.stats || null);
      }

      // Applications
      if (applicationsRes.status === 'fulfilled' && applicationsRes.value.data?.success) {
        const d = applicationsRes.value.data;
        setRecentApplications(d.applications?.slice(0, 5) || []);
        setApplicationStats(d.stats || null);
      }

      // Application trend
      if (appTrendRes.status === 'fulfilled' && appTrendRes.value.data?.success) {
        setApplicationTrend(appTrendRes.value.data.trend || []);
      }

      // Student statistics
      if (studentStatsRes.status === 'fulfilled' && studentStatsRes.value.data?.success) {
        const d = studentStatsRes.value.data;
        setStudentStats(d.stats || null);
        setStudentsByProgram(d.byProgram || []);
      }

      // Recent students
      if (studentsRes.status === 'fulfilled' && studentsRes.value.data?.success) {
        setRecentStudents(
          (studentsRes.value.data.students || []).slice(0, 5)
        );
      }

      // Units
      if (unitsRes.status === 'fulfilled' && unitsRes.value.data?.success) {
        const d = unitsRes.value.data;
        setUnitStats(d.stats || null);
        setRecentUnits((d.units || []).slice(0, 5));
      }

      // Registrations
      if (registrationsRes.status === 'fulfilled' && registrationsRes.value.data?.success) {
        const d = registrationsRes.value.data;
        setRegistrationStats(d.stats || null);
        setRecentRegistrations((d.registrations || []).slice(0, 5));
      }

      // Registration trend
      if (regTrendRes.status === 'fulfilled' && regTrendRes.value.data?.success) {
        setRegistrationTrend(regTrendRes.value.data.trend || []);
      }

      // Marks
      if (marksRes.status === 'fulfilled' && marksRes.value.data?.success) {
        const d = marksRes.value.data;
        setResultStats(d.stats || null);
        setGradeDistribution(d.gradeDistribution || []);
        setRecentResults((d.results || []).slice(0, 5));
      }

      // GPA trend
      if (gpaTrendRes.status === 'fulfilled' && gpaTrendRes.value.data?.success) {
        setGpaTrend(gpaTrendRes.value.data.trend || []);
      }

      // Users
      if (usersRes.status === 'fulfilled' && usersRes.value.data?.success) {
        setUserStats(usersRes.value.data.stats || null);
      }

      // Activity
      if (activityRes.status === 'fulfilled' && activityRes.value.data?.success) {
        setRecentActivity(activityRes.value.data.activities || []);
      }

      // Announcements
      if (annRes.status === 'fulfilled' && annRes.value.data?.success) {
        setAnnouncements(
          (annRes.value.data.announcements || []).slice(0, 5)
        );
      }

      if (showRefresh) toast.success('Dashboard refreshed successfully');
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
  // DERIVED DATA FOR CHARTS
  // ============================================================

  // Application pie chart
  const appPieData = useMemo(() => {
    if (!applicationStats) return [];
    const keys = [
      'Draft',
      'Submitted',
      'Under Review',
      'Approved',
      'Rejected',
      'Requires Correction',
    ];
    return keys
      .map((key) => ({
        name: key,
        value: applicationStats[key] || 0,
        key,
      }))
      .filter((d) => d.value > 0);
  }, [applicationStats]);

  // Registration bar chart
  const regBarData = useMemo(() => {
    if (!registrationStats) return [];
    const keys = ['Pending', 'Registered', 'Dropped', 'Completed'];
    return keys
      .map((key) => ({
        name: key,
        value: registrationStats[key] || 0,
        key,
      }))
      .filter((d) => d.value > 0 || true); // keep zeros for consistent axis
  }, [registrationStats]);

  // Grade distribution bar chart
  const gradeBarData = useMemo(() => {
    if (!Array.isArray(gradeDistribution)) return [];
    const order = ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'E', 'F'];
    const map = new Map(gradeDistribution.map((g) => [g.grade, g.count]));
    return order
      .filter((g) => map.has(g))
      .map((g) => ({ grade: g, count: map.get(g) || 0 }));
  }, [gradeDistribution]);

  // ============================================================
  // LOADING STATE
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

  const academicYear =
    admin?.academic_year || studentStats?.academic_year || '2024/2025';
  const currentSemester =
    admin?.current_semester || studentStats?.current_semester || 'Semester 1';

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
            1. ADMIN WELCOME HEADER
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
                  {admin?.full_name || admin?.name || 'Administrator'} ·{' '}
                  {admin?.role || 'Administrator'}
                </p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-xs">
                  <span className="inline-flex items-center gap-1.5 text-white/80">
                    <Calendar className="w-3.5 h-3.5" />
                    Academic Year: {academicYear}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-white/80">
                    <BookMarked className="w-3.5 h-3.5" />
                    Current Semester: {currentSemester}
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
            2. MAIN STATISTICS CARDS
            ============================================================ */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          <StatCard
            icon={GraduationCap}
            title="Total Students"
            value={stats?.total_students ?? studentStats?.total ?? 0}
            description="Registered students"
            accent="brown"
          />
          <StatCard
            icon={CheckCircle}
            title="Active Students"
            value={stats?.active_students ?? studentStats?.active ?? 0}
            description="Currently active"
            accent="emerald"
          />
          <StatCard
            icon={FileText}
            title="Pending Applications"
            value={
              stats?.pending_applications ??
              applicationStats?.Submitted ??
              0
            }
            description="Awaiting review"
            accent="amber"
          />
          <StatCard
            icon={BookOpen}
            title="Total Units"
            value={stats?.total_units ?? unitStats?.total ?? 0}
            description="Academic units"
            accent="blue"
          />
          <StatCard
            icon={ClipboardList}
            title="Unit Registrations"
            value={
              stats?.total_registrations ?? registrationStats?.total ?? 0
            }
            description="All registrations"
            accent="purple"
          />
          <StatCard
            icon={Award}
            title="Published Results"
            value={
              stats?.published_results ?? resultStats?.Published ?? 0
            }
            description="Available to students"
            accent="emerald"
          />
          <StatCard
            icon={UserCog}
            title="Total Users"
            value={stats?.total_users ?? userStats?.total ?? 0}
            description="System accounts"
            accent="brown"
          />
          <StatCard
            icon={Users}
            title="Staff & Lecturers"
            value={
              stats?.total_staff ??
              ((userStats?.lecturers || 0) + (userStats?.staff || 0))
            }
            description="Faculty & staff"
            accent="orange"
          />
        </div>

        {/* ============================================================
            3 & 4 & 5. APPLICATIONS — Stats + Pie + Trend
            ============================================================ */}
        <Card>
          <SectionHeader
            icon={FileText}
            title="Application Overview"
            subtitle="Applications submitted by students"
            action="Review Applications"
            onAction={() => navigate('/admin/applications')}
          />

          {/* Mini stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2 mb-5">
            {[
              { label: 'Total', value: applicationStats?.total || 0, color: 'brown' },
              { label: 'Draft', value: applicationStats?.Draft || 0, color: 'gray' },
              { label: 'Submitted', value: applicationStats?.Submitted || 0, color: 'blue' },
              { label: 'Under Review', value: applicationStats?.['Under Review'] || 0, color: 'amber' },
              { label: 'Approved', value: applicationStats?.Approved || 0, color: 'emerald' },
              { label: 'Rejected', value: applicationStats?.Rejected || 0, color: 'red' },
              { label: 'Correction', value: applicationStats?.['Requires Correction'] || 0, color: 'orange' },
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

          {/* Charts row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pie */}
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

            {/* Line — trend */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Application Submission Trend
              </p>
              {applicationTrend.length === 0 ? (
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
            15. RECENT APPLICATIONS
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
                        {a.student_id || '—'}
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-900 max-w-[180px] truncate">
                        {a.student_name ||
                          `${a.first_name || ''} ${a.last_name || ''}`.trim() ||
                          '—'}
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-600 max-w-[160px] truncate">
                        {a.program || '—'}
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-600 whitespace-nowrap">
                        {a.application_type || '—'}
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-600 whitespace-nowrap">
                        {a.academic_year || '—'}
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-600 whitespace-nowrap">
                        {a.semester || '—'}
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-600 whitespace-nowrap">
                        {formatDate(a.submitted_at || a.created_at)}
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
            6 & 7. STUDENT OVERVIEW + Bar Chart
            ============================================================ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Student stats */}
          <Card>
            <SectionHeader
              icon={GraduationCap}
              title="Student Overview"
              action="Manage Students"
              onAction={() => navigate('/admin/students')}
            />
            <div className="space-y-3">
              {[
                { label: 'Total Students', value: studentStats?.total ?? stats?.total_students ?? 0 },
                { label: 'Active', value: studentStats?.active ?? stats?.active_students ?? 0 },
                { label: 'Inactive', value: studentStats?.inactive ?? 0 },
                { label: 'New This Semester', value: studentStats?.new_students ?? 0 },
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

          {/* Students by program bar chart */}
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
            18. RECENT STUDENTS
            ============================================================ */}
        <Card>
          <SectionHeader
            icon={Users}
            title="Recent Students"
            subtitle="Latest student registrations"
            action="View All"
            onAction={() => navigate('/admin/students')}
          />
          {recentStudents.length === 0 ? (
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
                  {recentStudents.map((s) => (
                    <tr key={s.id} className="hover:bg-gray-50">
                      <td
                        className="px-5 py-3 text-sm font-semibold whitespace-nowrap"
                        style={{ color: BRAND.primary }}
                      >
                        {s.student_id || '—'}
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-900 max-w-[180px] truncate">
                        {s.full_name || s.student_name || '—'}
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-600 max-w-[180px] truncate">
                        {s.program || '—'}
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-600 max-w-[160px] truncate">
                        {s.department || '—'}
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-600 whitespace-nowrap">
                        {s.year_of_study ? `Year ${s.year_of_study}` : '—'}
                      </td>
                      <td className="px-5 py-3">
                        <StatusBadge
                          status={s.status || 'Active'}
                          configMap={{
                            Active: APPLICATION_STATUSES.Approved,
                            Inactive: APPLICATION_STATUSES.Rejected,
                          }}
                        />
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-600 whitespace-nowrap">
                        {formatDate(s.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* ============================================================
            8. UNIT OVERVIEW
            ============================================================ */}
        <Card>
          <SectionHeader
            icon={BookOpen}
            title="Unit Overview"
            subtitle="Academic units available for registration"
            action="Manage Units"
            onAction={() => navigate('/admin/units')}
          />

          {/* Mini stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
            {[
              { label: 'Total Units', value: unitStats?.total || 0 },
              { label: 'Active', value: unitStats?.active || 0 },
              { label: 'Inactive', value: unitStats?.inactive || 0 },
              {
                label: 'This Semester',
                value: unitStats?.this_semester || 0,
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

          {/* Recent units */}
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
                        {u.unit_code || '—'}
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-900 max-w-[220px] truncate">
                        {u.unit_name || '—'}
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-600 whitespace-nowrap">
                        {u.credit_hours || '—'}
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
            9, 10, 11. UNIT REGISTRATION
            ============================================================ */}
        <Card>
          <SectionHeader
            icon={ClipboardList}
            title="Unit Registration Overview"
            subtitle="Student unit registrations across the semester"
            action="Manage Registrations"
            onAction={() => navigate('/admin/unit-registration')}
          />

          {/* Mini stats */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-5">
            {[
              { label: 'Total', value: registrationStats?.total || 0 },
              { label: 'Pending', value: registrationStats?.Pending || 0 },
              { label: 'Registered', value: registrationStats?.Registered || 0 },
              { label: 'Dropped', value: registrationStats?.Dropped || 0 },
              { label: 'Completed', value: registrationStats?.Completed || 0 },
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

          {/* Charts row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bar: Registration Status */}
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

            {/* Line: Registration Trend */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Unit Registration Trend
              </p>
              {registrationTrend.length === 0 ? (
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
            16. RECENT UNIT REGISTRATIONS
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
                        #{r.id || r.registration_id}
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-700 whitespace-nowrap">
                        {r.student_id || '—'}
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-900 max-w-[180px] truncate">
                        {r.student_name || '—'}
                      </td>
                      <td
                        className="px-5 py-3 text-sm font-semibold whitespace-nowrap"
                        style={{ color: BRAND.primary }}
                      >
                        {r.unit_code || '—'}
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-600 max-w-[220px] truncate">
                        {r.unit_name || '—'}
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-600 whitespace-nowrap">
                        {r.credit_hours || '—'}
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-600 whitespace-nowrap">
                        {r.semester || '—'}
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-600 whitespace-nowrap">
                        {r.academic_year || '—'}
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-600 whitespace-nowrap">
                        {formatDate(r.registration_date || r.created_at)}
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
            12, 13, 14. MARKS & RESULTS
            ============================================================ */}
        <Card>
          <SectionHeader
            icon={Award}
            title="Marks & Results Overview"
            subtitle="Academic results and performance analytics"
            action="Manage Results"
            onAction={() => navigate('/admin/marks')}
          />

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-5">
            {[
              { label: 'Total Results', value: resultStats?.total || 0 },
              { label: 'Pending', value: resultStats?.Pending || 0 },
              { label: 'Published', value: resultStats?.Published || 0 },
              { label: 'Withheld', value: resultStats?.Withheld || 0 },
              { label: 'Incomplete', value: resultStats?.Incomplete || 0 },
              {
                label: 'Students with Results',
                value: resultStats?.students_with_results || 0,
              },
              {
                label: 'Average GPA',
                value: formatNumber(resultStats?.average_gpa),
              },
              {
                label: 'Highest GPA',
                value: formatNumber(resultStats?.highest_gpa),
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

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Grade Distribution Bar Chart */}
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

            {/* GPA Trend Line Chart */}
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
            17. RECENT RESULTS
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
                        {r.student_id || '—'}
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-900 max-w-[180px] truncate">
                        {r.student_name || '—'}
                      </td>
                      <td
                        className="px-5 py-3 text-sm font-semibold whitespace-nowrap"
                        style={{ color: BRAND.primary }}
                      >
                        {r.unit_code || '—'}
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-600 max-w-[220px] truncate">
                        {r.unit_name || '—'}
                      </td>
                      <td className="px-5 py-3 text-sm font-semibold text-gray-900 whitespace-nowrap">
                        {formatNumber(r.total_marks, 1)}
                      </td>
                      <td className="px-5 py-3">
                        <GradeBadge grade={r.grade} />
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-600 whitespace-nowrap">
                        {formatNumber(r.grade_point, 1)}
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
            19. USERS & STAFF SUMMARY
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
              { label: 'Total Users', value: userStats?.total || 0 },
              { label: 'Students', value: userStats?.students || 0 },
              { label: 'Lecturers', value: userStats?.lecturers || 0 },
              { label: 'Staff', value: userStats?.staff || 0 },
              { label: 'Administrators', value: userStats?.administrators || 0 },
              { label: 'Active', value: userStats?.active || 0 },
              { label: 'Inactive', value: userStats?.inactive || 0 },
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
            20 & 21 & 22. ACTIVITY + ANNOUNCEMENTS + QUICK ACTIONS
            ============================================================ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
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
                  {recentActivity.slice(0, 10).map((a) => (
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
                            {a.activity || a.action || 'Activity'}
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

          {/* Quick Actions */}
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
            21. ANNOUNCEMENTS
            ============================================================ */}
        <Card>
          <SectionHeader
            icon={Megaphone}
            title="Recent Announcements"
            subtitle="Latest university-wide notices"
            action="Manage in Settings"
            onAction={() => navigate('/admin/settings')}
          />
          {announcements.length === 0 ? (
            <EmptyState icon={Megaphone} title="No announcements." />
          ) : (
            <div className="space-y-3">
              {announcements.map((a) => (
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
                        {formatDate(a.created_at)}
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