// src/users/pages/ViewMarks.jsx
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  GraduationCap,
  Award,
  BookOpen,
  Layers,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  X,
  Info,
  Loader2,
  Download,
  RefreshCw,
  Eye,
  TrendingUp,
  Target,
  FileText,
  User,
  ChevronDown,
  Shield,
  AlertTriangle,
  Percent,
} from 'lucide-react';

// ============================================================
// API CONFIGURATION
// ============================================================

const getApiBaseUrl = () => {
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  if (typeof process !== 'undefined' && process.env?.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  return 'http://localhost:5000';
};

const API_BASE_URL = getApiBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
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
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

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

// Result publication statuses
const RESULT_STATUS_CONFIG = {
  Published: {
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
  Withheld: {
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
    icon: XCircle,
  },
  Incomplete: {
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    border: 'border-orange-200',
    icon: AlertCircle,
  },
};

// Grade styling — subtle colors so brown chrome remains dominant
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

const getGradeStyle = (grade) =>
  GRADE_STYLES[grade] || 'bg-gray-100 text-gray-700 border-gray-200';

// Academic standing styling
const STANDING_STYLES = {
  'First Class': 'text-emerald-700 bg-emerald-50 border-emerald-200',
  'Second Class Upper': 'text-blue-700 bg-blue-50 border-blue-200',
  'Second Class Lower': 'text-amber-700 bg-amber-50 border-amber-200',
  Pass: 'text-gray-700 bg-gray-50 border-gray-200',
  Fail: 'text-red-700 bg-red-50 border-red-200',
  Probation: 'text-red-700 bg-red-50 border-red-200',
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

const formatNumber = (val, decimals = 2) => {
  if (val === null || val === undefined || val === '') return '—';
  const num = parseFloat(val);
  if (isNaN(num)) return '—';
  return num.toFixed(decimals);
};

// ============================================================
// SUB-COMPONENTS
// ============================================================

const ResultStatusBadge = ({ status }) => {
  const config = RESULT_STATUS_CONFIG[status] || RESULT_STATUS_CONFIG.Pending;
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
  if (!grade) {
    return <span className="text-sm text-gray-400">—</span>;
  }
  return (
    <span
      className={`inline-flex items-center justify-center min-w-[38px] px-2.5 py-1 rounded-lg text-sm font-bold border ${getGradeStyle(
        grade
      )}`}
    >
      {grade}
    </span>
  );
};

// Summary Card — brown accents
const SummaryCard = ({ icon: Icon, label, value, accent, subtitle }) => {
  const accentMap = {
    brown: {
      bg: 'bg-[#F5EFE6]',
      text: 'text-[#6B4423]',
      bar: 'bg-[#6B4423]',
    },
    tan: {
      bg: 'bg-[#F5EFE6]',
      text: 'text-[#8B5E34]',
      bar: 'bg-[#8B5E34]',
    },
    cream: {
      bg: 'bg-[#F5EFE6]',
      text: 'text-[#A67C52]',
      bar: 'bg-[#A67C52]',
    },
    emerald: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-600',
      bar: 'bg-emerald-500',
    },
    blue: {
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      bar: 'bg-blue-500',
    },
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
    {[...Array(6)].map((_, i) => (
      <div key={i} className="flex items-center gap-4 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-20" />
        <div className="h-4 bg-gray-200 rounded w-48" />
        <div className="h-4 bg-gray-200 rounded w-12" />
        <div className="h-4 bg-gray-200 rounded w-16" />
        <div className="h-4 bg-gray-200 rounded w-16" />
        <div className="h-4 bg-gray-200 rounded w-16" />
        <div className="h-4 bg-gray-200 rounded w-12" />
      </div>
    ))}
  </div>
);

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-16 px-4">
    <div
      className="w-20 h-20 rounded-full flex items-center justify-center mb-5"
      style={{ backgroundColor: BRAND.primarySoft }}
    >
      <GraduationCap className="w-10 h-10" style={{ color: BRAND.primary }} />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">
      No Results Published
    </h3>
    <p className="text-sm text-gray-500 text-center max-w-md">
      Your results for the selected semester have not been published yet.
      Please check back later or contact your department.
    </p>
  </div>
);

// ============================================================
// MAIN COMPONENT
// ============================================================

const ViewMarks = () => {
  // ============================================================
  // STATE MANAGEMENT
  // ============================================================

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const [results, setResults] = useState([]);
  const [summary, setSummary] = useState({
    currentGPA: null,
    cumulativeGPA: null,
    totalUnitsCompleted: 0,
    totalCreditHours: 0,
    currentSemester: null,
    academicStanding: null,
  });
  const [semesterSummary, setSemesterSummary] = useState({
    totalCreditHours: 0,
    totalGradePoints: 0,
    semesterGPA: null,
  });
  const [cumulativeSummary, setCumulativeSummary] = useState({
    cumulativeGPA: null,
    completedCredits: 0,
    academicStanding: null,
  });

  const [filters, setFilters] = useState({
    academicYear: '',
    semester: '',
  });

  const [availablePeriods, setAvailablePeriods] = useState({
    academicYears: [],
    semesters: [],
  });

  const [selectedResult, setSelectedResult] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  // ============================================================
  // API FUNCTIONS
  // ============================================================

  const fetchResults = useCallback(
    async (showRefresh = false, customFilters = null) => {
      if (showRefresh) setRefreshing(true);
      else setLoading(true);

      const activeFilters = customFilters || filters;

      try {
        const params = {};
        if (activeFilters.academicYear)
          params.academicYear = activeFilters.academicYear;
        if (activeFilters.semester) params.semester = activeFilters.semester;

        // Fetch results + GPA in parallel
        const [resultsRes, gpaRes] = await Promise.all([
          api.get('/api/student/results', { params }),
          api.get('/api/student/gpa', { params }),
        ]);

        if (resultsRes.data.success) {
          const data = resultsRes.data;
          setResults(data.results || []);

          // Available periods from backend for the dropdown
          if (data.availablePeriods) {
            setAvailablePeriods({
              academicYears: data.availablePeriods.academicYears || [],
              semesters: data.availablePeriods.semesters || [],
            });
          }

          // Summary block (backend authoritative)
          if (data.summary) {
            setSummary({
              currentGPA: data.summary.currentGPA ?? null,
              cumulativeGPA: data.summary.cumulativeGPA ?? null,
              totalUnitsCompleted: data.summary.totalUnitsCompleted ?? 0,
              totalCreditHours: data.summary.totalCreditHours ?? 0,
              currentSemester: data.summary.currentSemester ?? null,
              academicStanding: data.summary.academicStanding ?? null,
            });
          }

          // Semester summary block
          if (data.semesterSummary) {
            setSemesterSummary({
              totalCreditHours:
                data.semesterSummary.totalCreditHours ?? 0,
              totalGradePoints:
                data.semesterSummary.totalGradePoints ?? 0,
              semesterGPA: data.semesterSummary.semesterGPA ?? null,
            });
          } else {
            // Fallback: compute what backend didn't send — but only display
            // what the backend provides. Never invent official values.
            setSemesterSummary({
              totalCreditHours: 0,
              totalGradePoints: 0,
              semesterGPA: null,
            });
          }
        } else {
          toast.error(
            resultsRes.data.message || 'Results could not be loaded.'
          );
        }

        if (gpaRes.data.success && gpaRes.data.cumulative) {
          setCumulativeSummary({
            cumulativeGPA: gpaRes.data.cumulative.cumulativeGPA ?? null,
            completedCredits:
              gpaRes.data.cumulative.completedCredits ?? 0,
            academicStanding:
              gpaRes.data.cumulative.academicStanding ?? null,
          });
        }

        if (showRefresh) toast.success('Results refreshed successfully');
      } catch (error) {
        console.error('Error fetching results:', error);
        toast.error(
          error.response?.data?.message ||
            'Results could not be loaded. Please try again.'
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [filters]
  );

  const fetchResultDetails = async (resultId) => {
    try {
      const response = await api.get(
        `/api/student/results/${resultId}`
      );
      if (response.data.success) return response.data.result;
      throw new Error(
        response.data.message || 'Failed to fetch result details'
      );
    } catch (error) {
      console.error('Error fetching result details:', error);
      throw error;
    }
  };

  const handleDownloadSlip = async () => {
    setDownloading(true);
    try {
      const params = {};
      if (filters.academicYear) params.academicYear = filters.academicYear;
      if (filters.semester) params.semester = filters.semester;

      const response = await api.get('/api/student/result-slip', {
        params,
        responseType: 'blob',
      });

      const contentType = response.headers['content-type'];

      if (contentType && contentType.includes('application/json')) {
        const text = await response.data.text();
        const data = JSON.parse(text);
        if (data.pdfUrl) {
          window.open(data.pdfUrl, '_blank');
          toast.success('Result slip opened');
        } else {
          toast.error('Result slip is currently unavailable.');
        }
      } else {
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Result_Slip_${
          filters.academicYear || 'current'
        }_${filters.semester || ''}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        toast.success('Result slip downloaded successfully');
      }
    } catch (error) {
      console.error('Error downloading result slip:', error);

      if (error.response?.data) {
        try {
          const text = await error.response.data.text?.();
          const data = JSON.parse(text);
          if (data.pdfUrl) {
            window.open(data.pdfUrl, '_blank');
            toast.success('Result slip opened');
            return;
          }
        } catch {
          /* ignore */
        }
      }

      toast.error(
        error.response?.data?.message ||
          'Result slip is currently unavailable.'
      );
    } finally {
      setDownloading(false);
    }
  };

  const handleViewDetails = async (result) => {
    // If backend already provided full detail, use it
    if (
      result.catMarks !== undefined &&
      result.examMarks !== undefined &&
      result.publicationDate
    ) {
      setSelectedResult(result);
      setDetailModalOpen(true);
      return;
    }

    try {
      const id = result.id || result.resultId;
      const fullResult = await fetchResultDetails(id);
      setSelectedResult(fullResult);
      setDetailModalOpen(true);
    } catch {
      toast.error('Result details could not be loaded.');
    }
  };

  const handleFilterChange = (key, value) => {
    const next = { ...filters, [key]: value };
    setFilters(next);
    // Reset dependent filter if needed
    fetchResults(false, next);
  };

  // ============================================================
  // EFFECTS
  // ============================================================

  useEffect(() => {
    fetchResults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ============================================================
  // DERIVED VALUES
  // ============================================================

  const academicYears =
    availablePeriods.academicYears.length > 0
      ? availablePeriods.academicYears
      : ACADEMIC_YEARS;

  const semesters =
    availablePeriods.semesters.length > 0
      ? availablePeriods.semesters
      : SEMESTERS;

  const hasResults = results.length > 0;

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
        {/* ============================================================
            PAGE HEADER
            ============================================================ */}
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
                  <GraduationCap
                    className="w-6 h-6"
                    style={{ color: BRAND.primary }}
                  />
                </div>
                Marks & Results
              </h1>
              <p className="text-sm text-gray-500 mt-1 ml-11">
                View your academic performance and semester results.
              </p>
            </div>

            <div className="flex items-center gap-2 ml-11 sm:ml-0">
              <button
                onClick={() => fetchResults(true)}
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
                disabled={downloading || !hasResults}
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
                  {downloading ? 'Downloading...' : 'Download Result Slip'}
                </span>
                <span className="sm:hidden">Slip</span>
              </button>
            </div>
          </div>
        </div>

        {/* ============================================================
            IMPORTANT NOTICE
            ============================================================ */}
        <div
          className="flex items-start gap-3 p-4 rounded-xl mb-6 border"
          style={{
            backgroundColor: BRAND.primarySoft,
            borderColor: BRAND.primaryBorder,
          }}
        >
          <Shield
            className="w-5 h-5 flex-shrink-0 mt-0.5"
            style={{ color: BRAND.primary }}
          />
          <div>
            <p
              className="text-sm font-semibold"
              style={{ color: BRAND.primaryDark }}
            >
              Official Results Notice
            </p>
            <p
              className="text-sm mt-0.5"
              style={{ color: BRAND.accent }}
            >
              Only officially published results are displayed. Official marks,
              grades, and GPA are maintained by the University and cannot be
              edited.
            </p>
          </div>
        </div>

        {/* ============================================================
            ACADEMIC PERFORMANCE SUMMARY
            ============================================================ */}
        {!loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
            <SummaryCard
              icon={Percent}
              label="Current GPA"
              value={formatNumber(summary.currentGPA)}
              accent="brown"
              subtitle="This semester"
            />
            <SummaryCard
              icon={TrendingUp}
              label="Cumulative GPA"
              value={formatNumber(summary.cumulativeGPA)}
              accent="tan"
              subtitle="Overall"
            />
            <SummaryCard
              icon={CheckCircle}
              label="Units Completed"
              value={summary.totalUnitsCompleted}
              accent="emerald"
              subtitle="Passed"
            />
            <SummaryCard
              icon={Layers}
              label="Credit Hours"
              value={summary.totalCreditHours}
              accent="cream"
              subtitle="Total earned"
            />
            <SummaryCard
              icon={Calendar}
              label="Current Semester"
              value={summary.currentSemester || '—'}
              accent="blue"
              subtitle="Active"
            />
            <SummaryCard
              icon={Award}
              label="Academic Standing"
              value={summary.academicStanding || '—'}
              accent="brown"
              subtitle="Current"
            />
          </div>
        )}

        {/* ============================================================
            SEMESTER FILTER
            ============================================================ */}
        {!loading && (
          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar
                className="w-5 h-5"
                style={{ color: BRAND.primary }}
              />
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                Select Academic Period
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Academic Year
                </label>
                <select
                  value={filters.academicYear}
                  onChange={(e) =>
                    handleFilterChange('academicYear', e.target.value)
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
                  <option value="">All Academic Years</option>
                  {academicYears.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Semester
                </label>
                <select
                  value={filters.semester}
                  onChange={(e) =>
                    handleFilterChange('semester', e.target.value)
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
                  <option value="">All Semesters</option>
                  {semesters.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end sm:col-span-2 lg:col-span-2">
                <p className="text-xs text-gray-500">
                  Showing results for{' '}
                  <span className="font-semibold text-gray-700">
                    {filters.academicYear || 'all years'}
                  </span>{' '}
                  ·{' '}
                  <span className="font-semibold text-gray-700">
                    {filters.semester || 'all semesters'}
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================
            RESULTS TABLE
            ============================================================ */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
          {loading ? (
            <TableSkeleton />
          ) : !hasResults ? (
            <EmptyState />
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
                        'CAT Marks',
                        'Exam Marks',
                        'Total Marks',
                        'Grade',
                        'Grade Point',
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
                    {results.map((r) => (
                      <tr
                        key={r.id || r.resultId}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-3.5">
                          <span
                            className="text-sm font-semibold"
                            style={{ color: BRAND.primary }}
                          >
                            {r.unitCode}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="text-sm font-medium text-gray-900">
                            {r.unitName}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="inline-flex items-center gap-1 text-sm text-gray-700">
                            <Layers className="w-3.5 h-3.5 text-gray-400" />
                            {r.creditHours ?? '—'}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="text-sm text-gray-700">
                            {formatNumber(r.catMarks, 1)}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="text-sm text-gray-700">
                            {formatNumber(r.examMarks, 1)}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="text-sm font-semibold text-gray-900">
                            {formatNumber(r.totalMarks, 1)}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <GradeBadge grade={r.grade} />
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="text-sm text-gray-700">
                            {formatNumber(r.gradePoint, 1)}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <ResultStatusBadge status={r.status} />
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center justify-center">
                            <button
                              onClick={() => handleViewDetails(r)}
                              className="p-1.5 text-gray-500 rounded-lg transition-colors"
                              title="View Result Details"
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
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="lg:hidden divide-y divide-gray-100">
                {results.map((r) => (
                  <div
                    key={r.id || r.resultId}
                    className="p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span
                            className="text-sm font-bold"
                            style={{ color: BRAND.primary }}
                          >
                            {r.unitCode}
                          </span>
                          <GradeBadge grade={r.grade} />
                          <ResultStatusBadge status={r.status} />
                        </div>
                        <h3 className="text-sm font-semibold text-gray-900 truncate">
                          {r.unitName}
                        </h3>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <Layers className="w-3.5 h-3.5 text-gray-400" />
                        {r.creditHours ?? '—'} Credit Hours
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <Target className="w-3.5 h-3.5 text-gray-400" />
                        Total: {formatNumber(r.totalMarks, 1)}
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <FileText className="w-3.5 h-3.5 text-gray-400" />
                        CAT: {formatNumber(r.catMarks, 1)}
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <Award className="w-3.5 h-3.5 text-gray-400" />
                        Exam: {formatNumber(r.examMarks, 1)}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-gray-100">
                      <button
                        onClick={() => handleViewDetails(r)}
                        className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg transition-colors"
                        style={{
                          color: BRAND.primary,
                          backgroundColor: BRAND.primarySoft,
                        }}
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* ============================================================
            SEMESTER GPA + CUMULATIVE PERFORMANCE
            ============================================================ */}
        {!loading && hasResults && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Semester GPA */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div
                className="px-5 py-3 border-b border-gray-200"
                style={{ backgroundColor: BRAND.primarySoft }}
              >
                <h3
                  className="text-sm font-semibold uppercase tracking-wider flex items-center gap-2"
                  style={{ color: BRAND.primaryDark }}
                >
                  <BookOpen className="w-4 h-4" />
                  Semester GPA
                </h3>
              </div>
              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    Total Credit Hours
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    {semesterSummary.totalCreditHours}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    Total Grade Points
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    {formatNumber(semesterSummary.totalGradePoints, 2)}
                  </span>
                </div>
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span
                    className="text-sm font-semibold"
                    style={{ color: BRAND.primaryDark }}
                  >
                    Semester GPA
                  </span>
                  <span
                    className="text-2xl font-bold"
                    style={{ color: BRAND.primary }}
                  >
                    {formatNumber(semesterSummary.semesterGPA, 2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Cumulative Performance */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div
                className="px-5 py-3 border-b border-gray-200"
                style={{ backgroundColor: BRAND.primarySoft }}
              >
                <h3
                  className="text-sm font-semibold uppercase tracking-wider flex items-center gap-2"
                  style={{ color: BRAND.primaryDark }}
                >
                  <TrendingUp className="w-4 h-4" />
                  Cumulative Performance
                </h3>
              </div>
              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    Completed Credits
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    {cumulativeSummary.completedCredits}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    Academic Standing
                  </span>
                  {cumulativeSummary.academicStanding ? (
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full border ${
                        STANDING_STYLES[
                          cumulativeSummary.academicStanding
                        ] || 'text-gray-700 bg-gray-50 border-gray-200'
                      }`}
                    >
                      {cumulativeSummary.academicStanding}
                    </span>
                  ) : (
                    <span className="text-sm text-gray-400">—</span>
                  )}
                </div>
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span
                    className="text-sm font-semibold"
                    style={{ color: BRAND.primaryDark }}
                  >
                    Cumulative GPA
                  </span>
                  <span
                    className="text-2xl font-bold"
                    style={{ color: BRAND.primary }}
                  >
                    {formatNumber(cumulativeSummary.cumulativeGPA, 2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================
            FOOTER REMINDER
            ============================================================ */}
        {!loading && hasResults && (
          <div className="mt-6 flex items-start gap-2 p-3 bg-gray-100 border border-gray-200 rounded-lg">
            <Info className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-gray-600">
              All marks, grades, grade points, and GPA values shown above are
              provided by the University's official records. For any
              discrepancies, please contact the Registrar's Office.
            </p>
          </div>
        )}
      </div>

      {/* ============================================================
          RESULT DETAILS MODAL
          ============================================================ */}
      {detailModalOpen && selectedResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
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
                  <FileText
                    className="w-5 h-5"
                    style={{ color: BRAND.primary }}
                  />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Result Details
                  </h2>
                  <p className="text-xs text-gray-500">
                    {selectedResult.unitCode}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setDetailModalOpen(false);
                  setSelectedResult(null);
                }}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Unit header */}
              <div className="mb-6">
                <div className="flex items-start justify-between gap-4 mb-3 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-xs font-semibold uppercase tracking-wider mb-1"
                      style={{ color: BRAND.primary }}
                    >
                      {selectedResult.unitCode}
                    </p>
                    <h3 className="text-xl font-bold text-gray-900">
                      {selectedResult.unitName}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <GradeBadge grade={selectedResult.grade} />
                    <ResultStatusBadge status={selectedResult.status} />
                  </div>
                </div>
              </div>

              {/* Marks grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-1">
                    <FileText className="w-4 h-4 text-gray-400" />
                    <p className="text-xs font-medium text-gray-500">
                      CAT Marks
                    </p>
                  </div>
                  <p className="text-lg font-bold text-gray-900">
                    {formatNumber(selectedResult.catMarks, 1)}
                  </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-1">
                    <Award className="w-4 h-4 text-gray-400" />
                    <p className="text-xs font-medium text-gray-500">
                      Exam Marks
                    </p>
                  </div>
                  <p className="text-lg font-bold text-gray-900">
                    {formatNumber(selectedResult.examMarks, 1)}
                  </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-1">
                    <Target className="w-4 h-4 text-gray-400" />
                    <p className="text-xs font-medium text-gray-500">
                      Total Marks
                    </p>
                  </div>
                  <p className="text-lg font-bold text-gray-900">
                    {formatNumber(selectedResult.totalMarks, 1)}
                  </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-1">
                    <Award className="w-4 h-4 text-gray-400" />
                    <p className="text-xs font-medium text-gray-500">
                      Grade
                    </p>
                  </div>
                  <div className="mt-1">
                    <GradeBadge grade={selectedResult.grade} />
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="w-4 h-4 text-gray-400" />
                    <p className="text-xs font-medium text-gray-500">
                      Grade Point
                    </p>
                  </div>
                  <p className="text-lg font-bold text-gray-900">
                    {formatNumber(selectedResult.gradePoint, 1)}
                  </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-1">
                    <Layers className="w-4 h-4 text-gray-400" />
                    <p className="text-xs font-medium text-gray-500">
                      Credit Hours
                    </p>
                  </div>
                  <p className="text-lg font-bold text-gray-900">
                    {selectedResult.creditHours ?? '—'}
                  </p>
                </div>
              </div>

              {/* Meta info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 border border-gray-200 rounded-xl">
                  <div className="flex items-center gap-2 mb-1">
                    <User className="w-4 h-4 text-gray-400" />
                    <p className="text-xs font-medium text-gray-500">
                      Lecturer
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">
                    {selectedResult.lecturer || 'Not assigned'}
                  </p>
                </div>

                <div className="p-4 border border-gray-200 rounded-xl">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <p className="text-xs font-medium text-gray-500">
                      Semester
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">
                    {selectedResult.semester || '—'}
                    {selectedResult.academicYear
                      ? ` · ${selectedResult.academicYear}`
                      : ''}
                  </p>
                </div>

                <div className="p-4 border border-gray-200 rounded-xl sm:col-span-2">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <p className="text-xs font-medium text-gray-500">
                      Publication Date
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">
                    {formatDate(selectedResult.publicationDate)}
                  </p>
                </div>
              </div>

              {/* Remarks if present */}
              {selectedResult.remarks && (
                <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                  <p className="text-xs font-semibold text-amber-800 mb-1">
                    Remarks
                  </p>
                  <p className="text-sm text-amber-700">
                    {selectedResult.remarks}
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-5 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => {
                  setDetailModalOpen(false);
                  setSelectedResult(null);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewMarks;