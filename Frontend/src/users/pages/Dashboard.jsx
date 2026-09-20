// src/users/pages/Dashboard.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
// API CONFIGURATION — JSON SERVER
// ============================================================

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// ============================================================
// HELPERS — CURRENT STUDENT
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

function getStudentKeys(student) {
  if (!student) return [];
  return [
    student.studentId,
    student.id,
    student.accountId,
    student.admissionNumber,
  ]
    .filter((v) => v !== null && v !== undefined && v !== '')
    .map(String);
}

function belongsToStudent(record, keys) {
  if (!record || !keys.length) return false;
  const candidates = [
    record.studentId,
    record.accountId,
    record.admissionNumber,
    record.student_id,
    record.account_id,
    record.admission_number,
  ]
    .filter((v) => v !== null && v !== undefined && v !== '')
    .map(String);
  return candidates.some((c) => keys.includes(c));
}

/**
 * A unit registration is considered "active" (i.e. currently enrolled)
 * if its status is anything EXCEPT "Dropped" or "Rejected".
 * This includes: Pending, Approved, Registered, Completed, undefined.
 */
function isActiveRegistration(unit) {
  if (!unit) return false;
  const status = unit.status;
  if (!status) return true;
  return !['Dropped', 'Rejected'].includes(status);
}

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
  Rejected: {
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
    .trim()
    .split(/\s+/)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

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
      {status || 'Pending'}
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
    emerald: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-600',
      bar: 'bg-emerald-500',
    },
    blue: { bg: 'bg-blue-50', text: 'text-blue-600', bar: 'bg-blue-500' },
    purple: {
      bg: 'bg-purple-50',
      text: 'text-purple-600',
      bar: 'bg-purple-500',
    },
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
            <p className="text-xs text-gray-400 mt-1 truncate">
              {description}
            </p>
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
        {subtitle && (
          <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
        )}
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

  const [student, setStudent] = useState(null);
  const [units, setUnits] = useState([]);
  const [results, setResults] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [application, setApplication] = useState(null);
  const [registrationHistory, setRegistrationHistory] = useState([]);
  const [semesters, setSemesters] = useState([]);

  // ============================================================
  // FETCH ALL DASHBOARD DATA
  // ============================================================

  const fetchDashboard = useCallback(async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const cached = getCurrentStudent();
      if (!cached) {
        toast.error('Please log in to view your dashboard.');
        setLoading(false);
        setRefreshing(false);
        return;
      }

      const keys = getStudentKeys(cached);
      const accountId = cached.id;

      const [
        accountsRes,
        profilesRes,
        unitsRes,
        registrationsRes,
        resultsRes,
        applicationsRes,
        notificationsRes,
        regHistoryRes,
        semestersRes,
      ] = await Promise.allSettled([
        api.get('/accounts'),
        api.get('/profiles'),
        api.get('/units'),
        api.get('/unitRegistrations'),
        api.get('/results'),
        api.get('/applications'),
        api.get('/notifications'),
        api.get('/registrationHistory'),
        api.get('/semesters'),
      ]);

      const safeArr = (res) =>
        res.status === 'fulfilled' && Array.isArray(res.value.data)
          ? res.value.data
          : [];

      const allAccounts = safeArr(accountsRes);
      const allProfiles = safeArr(profilesRes);
      const allUnits = safeArr(unitsRes);
      const allRegistrations = safeArr(registrationsRes);
      const allResults = safeArr(resultsRes);
      const allApps = safeArr(applicationsRes);
      const allNotifs = safeArr(notificationsRes);
      const allRegHistory = safeArr(regHistoryRes);
      const allSemesters = safeArr(semestersRes);

      // Match this student
      const matchedAccount =
        allAccounts.find((a) => belongsToStudent(a, keys)) ||
        allAccounts.find((a) => String(a.id) === String(accountId)) ||
        cached;

      const matchedProfile =
        allProfiles.find(
          (p) =>
            belongsToStudent(p, keys) ||
            String(p.accountId) === String(matchedAccount.id)
        ) || null;

      // Current unit registrations (ALL of them — we decide later
      // which to display, but stat card counts active ones)
      const myRegs = allRegistrations.filter((r) =>
        belongsToStudent(r, keys)
      );

      const enrichedUnits = myRegs.map((r) => {
        const unit = allUnits.find(
          (u) =>
            String(u.id) === String(r.unitId) ||
            String(u.unitCode) === String(r.unitCode)
        );
        return {
          ...r,
          unitCode: r.unitCode || unit?.unitCode || '—',
          unitName: r.unitName || unit?.unitName || '—',
          creditHours: r.creditHours ?? unit?.creditHours ?? 0,
          lecturer: r.lecturer || unit?.lecturer || '',
          semester: r.semester || unit?.semester || '',
          academicYear: r.academicYear || unit?.academicYear || '',
        };
      });

      // Results for this student (published only)
      const myResults = allResults
        .filter((r) => belongsToStudent(r, keys))
        .map((r) => {
          const unit = allUnits.find(
            (u) =>
              String(u.id) === String(r.unitId) ||
              String(u.unitCode) === String(r.unitCode)
          );
          return {
            ...r,
            unitCode: r.unitCode || unit?.unitCode || '—',
            unitName: r.unitName || unit?.unitName || '—',
            creditHours: r.creditHours ?? unit?.creditHours ?? 0,
          };
        });

      const publishedResults = myResults.filter(
        (r) => String(r.status || '').toLowerCase() === 'published'
      );

      // Application (latest)
      const myApps = allApps
        .filter((a) => belongsToStudent(a, keys))
        .sort(
          (a, b) =>
            new Date(b.submittedAt || b.createdAt || 0) -
            new Date(a.submittedAt || a.createdAt || 0)
        );
      const myApp = myApps[0] || null;

      // Notifications
      const myNotifs = allNotifs
        .filter(
          (n) =>
            !n.studentId ||
            belongsToStudent(n, keys) ||
            String(n.accountId) === String(matchedAccount.id)
        )
        .sort(
          (a, b) =>
            new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
        );

      // Registration history
      const myRegHistory = allRegHistory
        .filter((h) => belongsToStudent(h, keys))
        .sort(
          (a, b) =>
            new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
        );

      // Semesters sorted
      const sortedSemesters = [...allSemesters].sort(
        (a, b) =>
          new Date(a.startDate || a.createdAt || 0) -
          new Date(b.startDate || b.createdAt || 0)
      );

      // Build merged student view
      const merged = {
        id: matchedAccount.id,
        studentId: matchedAccount.studentId,
        admissionNumber: matchedAccount.admissionNumber,
        email: matchedAccount.email,

        fullName:
          matchedProfile?.fullName ||
          matchedAccount.fullName ||
          cached.fullName ||
          'Student',
        profilePhoto:
          matchedProfile?.profilePhoto ||
          matchedAccount.profilePhoto ||
          cached.profilePhoto ||
          null,

        dateOfBirth: matchedProfile?.dateOfBirth || null,
        gender: matchedProfile?.gender || null,
        nationality: matchedProfile?.nationality || null,
        phone:
          matchedProfile?.phone || matchedAccount.phone || cached.phone || null,
        alternativePhone: matchedProfile?.alternativePhone || null,
        county: matchedProfile?.county || null,
        city: matchedProfile?.city || null,
        physicalAddress: matchedProfile?.physicalAddress || null,

        program: matchedAccount.program || null,
        department: matchedAccount.department || null,
        yearOfStudy: matchedAccount.yearOfStudy || null,
        academicYear:
          matchedAccount.academicYear ||
          enrichedUnits[0]?.academicYear ||
          null,
        currentSemester:
          matchedAccount.semester ||
          enrichedUnits[0]?.semester ||
          null,
        accountStatus:
          matchedAccount.accountStatus ||
          matchedAccount.status ||
          'Active',
      };

      setStudent(merged);
      setUnits(enrichedUnits);
      setResults(publishedResults);
      setApplication(myApp);
      setNotifications(myNotifs);
      setRegistrationHistory(myRegHistory);
      setSemesters(sortedSemesters);

      // Sync localStorage
      try {
        const storage = localStorage.getItem('user')
          ? localStorage
          : sessionStorage;
        storage.setItem(
          'user',
          JSON.stringify({
            ...cached,
            ...matchedAccount,
            profilePhoto: merged.profilePhoto,
            fullName: merged.fullName,
          })
        );
      } catch {
        /* ignore */
      }

      if (showRefresh) toast.success('Dashboard refreshed');
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
  // DERIVED DATA
  // ============================================================

  // ⚡ ACTIVE UNITS — anything not Dropped / Rejected
  const activeUnits = useMemo(
    () => units.filter(isActiveRegistration),
    [units]
  );

  // ⚡ Registered Units count = active units
  const registeredUnitsCount = activeUnits.length;

  // ⚡ Credit hours from active units only
  const activeCreditHours = useMemo(
    () =>
      activeUnits.reduce(
        (sum, u) => sum + (parseFloat(u.creditHours) || 0),
        0
      ),
    [activeUnits]
  );

  // Pie — unit status composition (excludes dropped/rejected so total matches stat card)
  const unitStatusData = useMemo(() => {
    const counts = { Registered: 0, Pending: 0, Completed: 0 };
    activeUnits.forEach((u) => {
      const raw = u.status || 'Pending';
      const normalized = raw === 'Approved' ? 'Registered' : raw;
      if (counts[normalized] !== undefined) counts[normalized] += 1;
    });
    return Object.entries(counts)
      .filter(([, value]) => value > 0)
      .map(([name, value]) => ({ name, value }));
  }, [activeUnits]);

  // GPA line chart — uses /semesters order when available
  const gpaLineData = useMemo(() => {
    if (!results.length && !semesters.length) return [];

    const bySem = {};
    results.forEach((r) => {
      const gp = parseFloat(r.gradePoint);
      if (isNaN(gp)) return;
      const label = r.semester || '—';
      if (!bySem[label]) {
        bySem[label] = { totalPoints: 0, totalCredits: 0 };
      }
      const credits = parseFloat(r.creditHours) || 0;
      bySem[label].totalPoints += gp * credits;
      bySem[label].totalCredits += credits;
    });

    if (semesters.length) {
      return semesters
        .map((s) => {
          const label = s.name || s.semester || s.code || '—';
          const bucket = bySem[label];
          if (!bucket || bucket.totalCredits === 0) {
            return { semester: label, gpa: 0 };
          }
          return {
            semester: label,
            gpa: parseFloat(
              (bucket.totalPoints / bucket.totalCredits).toFixed(2)
            ),
          };
        })
        .filter((x) => x.gpa > 0 || semesters.length <= 8);
    }

    return Object.entries(bySem)
      .filter(([, b]) => b.totalCredits > 0)
      .map(([label, b]) => ({
        semester: label,
        gpa: parseFloat((b.totalPoints / b.totalCredits).toFixed(2)),
      }));
  }, [results, semesters]);

  // Bar chart — total marks per unit
  const barChartData = useMemo(
    () =>
      results.slice(0, 8).map((r) => ({
        unit: r.unitCode || '—',
        total: parseFloat(r.totalMarks) || 0,
      })),
    [results]
  );

  // Current semester GPA
  const currentGPA = useMemo(() => {
    const inSem = results.filter(
      (r) => r.semester === student?.currentSemester
    );
    const credits = inSem.reduce(
      (s, r) => s + (parseFloat(r.creditHours) || 0),
      0
    );
    const points = inSem.reduce(
      (s, r) =>
        s +
        (parseFloat(r.gradePoint) || 0) * (parseFloat(r.creditHours) || 0),
      0
    );
    return credits > 0 ? points / credits : null;
  }, [results, student?.currentSemester]);

  // Cumulative GPA
  const cumulativeGPA = useMemo(() => {
    const credits = results.reduce(
      (s, r) => s + (parseFloat(r.creditHours) || 0),
      0
    );
    const points = results.reduce(
      (s, r) =>
        s +
        (parseFloat(r.gradePoint) || 0) * (parseFloat(r.creditHours) || 0),
      0
    );
    return credits > 0 ? points / credits : null;
  }, [results]);

  // Completed units
  const completedUnits = useMemo(
    () =>
      results.filter((r) => r.grade && !['E', 'F'].includes(r.grade)).length,
    [results]
  );

  // Recent results
  const recentResults = useMemo(
    () =>
      [...results]
        .sort(
          (a, b) =>
            new Date(b.publishedAt || b.updatedAt || 0) -
            new Date(a.publishedAt || a.updatedAt || 0)
        )
        .slice(0, 5),
    [results]
  );

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Registration activity line chart data
  const regActivityData = useMemo(
    () =>
      registrationHistory.map((h) => ({
        period: h.period || h.semester || h.label || '—',
        units: parseInt(h.units ?? h.count ?? 0) || 0,
      })),
    [registrationHistory]
  );

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
              <div className="w-16 h-16 rounded-full bg-gray-200" />
              <div className="flex-1 space-y-2">
                <div className="h-5 bg-gray-200 rounded w-64" />
                <div className="h-3 bg-gray-200 rounded w-96" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[...Array(6)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <SkeletonChart />
            </Card>
            <Card>
              <SkeletonChart />
            </Card>
          </div>

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
              <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center flex-shrink-0 border border-white/20 overflow-hidden">
                {student?.profilePhoto ? (
                  <img
                    src={student.profilePhoto}
                    alt={student.fullName || 'Student'}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement.innerHTML = `<span class="text-xl font-bold">${getInitials(
                        student.fullName
                      )}</span>`;
                    }}
                  />
                ) : (
                  <span className="text-xl font-bold">
                    {getInitials(student?.fullName || 'Student')}
                  </span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold truncate">
                  Welcome back,{' '}
                  {student?.fullName?.split(' ')[0] || 'Student'}
                </h1>
                <p className="text-sm text-white/80 mt-0.5">
                  {student?.program || 'Program'} ·{' '}
                  {student?.department || 'Department'}
                </p>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-xs">
                  {student?.studentId && (
                    <span className="inline-flex items-center gap-1.5 text-white/80">
                      <Hash className="w-3.5 h-3.5" />
                      {student.studentId}
                    </span>
                  )}
                  {student?.admissionNumber && (
                    <span className="inline-flex items-center gap-1.5 text-white/80">
                      <IdCard className="w-3.5 h-3.5" />
                      {student.admissionNumber}
                    </span>
                  )}
                  {student?.yearOfStudy && (
                    <span className="inline-flex items-center gap-1.5 text-white/80">
                      <Layers className="w-3.5 h-3.5" />
                      {student.yearOfStudy}
                    </span>
                  )}
                  {student?.academicYear && (
                    <span className="inline-flex items-center gap-1.5 text-white/80">
                      <Calendar className="w-3.5 h-3.5" />
                      {student.academicYear}
                    </span>
                  )}
                  {student?.currentSemester && (
                    <span className="inline-flex items-center gap-1.5 text-white/80">
                      <BookMarked className="w-3.5 h-3.5" />
                      {student.currentSemester}
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
            value={registeredUnitsCount}
            description="Currently enrolled"
            accent="brown"
          />
          <StatCard
            icon={Award}
            title="Completed Units"
            value={completedUnits}
            description="Successfully passed"
            accent="emerald"
          />
          <StatCard
            icon={Percent}
            title="Current GPA"
            value={formatNumber(currentGPA)}
            description="This semester"
            accent="amber"
          />
          <StatCard
            icon={TrendingUp}
            title="Cumulative GPA"
            value={formatNumber(cumulativeGPA)}
            description="Overall"
            accent="purple"
          />
          <StatCard
            icon={Clock}
            title="Pending Application"
            value={
              application &&
              application.status !== 'Approved' &&
              application.status !== 'Rejected'
                ? 1
                : 0
            }
            description="Awaiting action"
            accent="blue"
          />
          <StatCard
            icon={Layers}
            title="Credit Hours"
            value={activeCreditHours}
            description="Total registered"
            accent="red"
          />
        </div>

        {/* ============================================================
            3. APPLICATION STATUS + PROFILE SUMMARY
            ============================================================ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                  <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">
                        Current Status
                      </p>
                      <p className="text-sm font-semibold text-gray-900 mt-0.5">
                        {application.applicationType ||
                          application.type ||
                          'Application'}
                      </p>
                    </div>
                    <StatusBadge
                      status={application.status}
                      configMap={APPLICATION_STATUSES}
                    />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      {
                        label: 'Application ID',
                        value: application.id,
                        icon: Hash,
                      },
                      {
                        label: 'Program',
                        value: application.program,
                        icon: BookOpen,
                      },
                      {
                        label: 'Academic Year',
                        value: application.academicYear,
                        icon: Calendar,
                      },
                      {
                        label: 'Semester',
                        value: application.semester,
                        icon: Calendar,
                      },
                      {
                        label: 'Submission Date',
                        value: formatDate(
                          application.submittedAt || application.createdAt
                        ),
                        icon: Clock,
                      },
                      {
                        label: 'Last Updated',
                        value: formatDate(application.updatedAt),
                        icon: RefreshCw,
                      },
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
                <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden"
                    style={{ backgroundColor: BRAND.primarySoft }}
                  >
                    {student.profilePhoto ? (
                      <img
                        src={student.profilePhoto}
                        alt={student.fullName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.parentElement.innerHTML = `<span class="text-sm font-bold" style="color: ${BRAND.primary}">${getInitials(
                            student.fullName
                          )}</span>`;
                        }}
                      />
                    ) : (
                      <span
                        className="text-sm font-bold"
                        style={{ color: BRAND.primary }}
                      >
                        {getInitials(student.fullName)}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {student.fullName || '—'}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {student.studentId || '—'}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  {[
                    { icon: BookOpen, label: 'Program', value: student.program },
                    {
                      icon: Building2,
                      label: 'Dept.',
                      value: student.department,
                    },
                    { icon: Layers, label: 'Year', value: student.yearOfStudy },
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
                        <span className="text-gray-500 w-14 flex-shrink-0">
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
            4. UNIT REGISTRATION TABLE — only active units
            ============================================================ */}
        <Card>
          <SectionHeader
            icon={BookOpen}
            title="Current Registered Units"
            subtitle={`${registeredUnitsCount} unit${
              registeredUnitsCount === 1 ? '' : 's'
            } this semester`}
            action="View All Units"
            onAction={() => navigate('/user/my-registered-units')}
          />

          {activeUnits.length === 0 ? (
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
                  {activeUnits.slice(0, 6).map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50">
                      <td
                        className="px-5 py-3 text-sm font-semibold whitespace-nowrap"
                        style={{ color: BRAND.primary }}
                      >
                        {u.unitCode || '—'}
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-700 max-w-[220px] truncate">
                        {u.unitName || '—'}
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-600 whitespace-nowrap">
                        {u.creditHours || '—'}
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-600 max-w-[160px] truncate">
                        {u.lecturer || '—'}
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-600 whitespace-nowrap">
                        {u.semester || '—'}
                      </td>
                      <td className="px-5 py-3 text-sm text-gray-600 whitespace-nowrap">
                        {u.academicYear || '—'}
                      </td>
                      <td className="px-5 py-3">
                        <StatusBadge
                          status={u.status || 'Pending'}
                          configMap={UNIT_STATUSES}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {activeUnits.length > 6 && (
                <div className="px-5 pt-3 text-xs text-gray-500 text-center">
                  Showing 6 of {activeUnits.length} units. Click "View All
                  Units" to see more.
                </div>
              )}
            </div>
          )}
        </Card>

        {/* ============================================================
            5. CHARTS — Pie + GPA Line
            ============================================================ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
          </Card>
        </div>

        {/* ============================================================
            5b. REGISTRATION ACTIVITY
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
          </Card>
        )}

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
                value: formatNumber(currentGPA),
                icon: Percent,
              },
              {
                label: 'Cumulative GPA',
                value: formatNumber(cumulativeGPA),
                icon: TrendingUp,
              },
              {
                label: 'Completed Units',
                value: completedUnits,
                icon: Award,
              },
              {
                label: 'Total Credit Hours',
                value: activeCreditHours,
                icon: Layers,
              },
              {
                label: 'Academic Standing',
                value:
                  cumulativeGPA == null
                    ? '—'
                    : cumulativeGPA >= 3.6
                    ? 'First Class'
                    : cumulativeGPA >= 3.0
                    ? 'Second Class Upper'
                    : cumulativeGPA >= 2.0
                    ? 'Second Class Lower'
                    : cumulativeGPA >= 1.5
                    ? 'Pass'
                    : 'Fail',
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
            7. RESULTS — Recent + Bar chart
            ============================================================ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                      {['Unit', 'CAT', 'Exam', 'Total', 'Grade', 'GP'].map(
                        (h) => (
                          <th
                            key={h}
                            className="px-5 py-3 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap"
                          >
                            {h}
                          </th>
                        )
                      )}
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
                            {r.unitCode || '—'}
                          </p>
                          <p className="text-xs text-gray-500 max-w-[160px] truncate">
                            {r.unitName || ''}
                          </p>
                        </td>
                        <td className="px-5 py-3 text-sm text-gray-700">
                          {formatNumber(r.catMarks, 1)}
                        </td>
                        <td className="px-5 py-3 text-sm text-gray-700">
                          {formatNumber(r.examMarks, 1)}
                        </td>
                        <td className="px-5 py-3 text-sm font-semibold text-gray-900">
                          {formatNumber(r.totalMarks, 1)}
                        </td>
                        <td className="px-5 py-3">
                          <GradeBadge grade={r.grade} />
                        </td>
                        <td className="px-5 py-3 text-sm text-gray-700">
                          {formatNumber(r.gradePoint, 1)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>

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
            8. NOTIFICATIONS + QUICK ACTIONS
            ============================================================ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                            !n.read
                              ? { backgroundColor: BRAND.primarySoft }
                              : {}
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
                              {n.title || n.type || 'Notification'}
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
                            {formatDateTime(n.createdAt || n.created_at)}
                          </p>
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
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#6B4423] transition-colors flex-shrink-0" />
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