// src/Admin/pages/MarksResults.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  GraduationCap,
  Search,
  Filter,
  Eye,
  Edit,
  Plus,
  RefreshCw,
  X,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  AlertTriangle,
  Award,
  FileText,
  Hash,
  User,
  Users,
  Building2,
  BookOpen,
  Calendar,
  Layers,
  TrendingUp,
  Download,
  Send,
  Info,
  Save,
  Lock,
  FileWarning,
  Percent,
  Target,
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
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');
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

const SEMESTERS = ['Semester 1', 'Semester 2', 'Semester 3'];
const ACADEMIC_YEARS = ['2023/2024', '2024/2025', '2025/2026', '2026/2027'];

const RESULT_STATUSES = [
  'Draft',
  'Pending',
  'Published',
  'Withheld',
  'Incomplete',
];

const STATUS_CONFIG = {
  Draft: {
    bg: 'bg-gray-50',
    text: 'text-gray-700',
    border: 'border-gray-200',
    icon: FileText,
  },
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
    icon: Lock,
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

const getGradeStyle = (grade) =>
  GRADE_STYLES[grade] || 'bg-gray-100 text-gray-700 border-gray-200';

const ITEMS_PER_PAGE = 10;

// ============================================================
// VALIDATION SCHEMA
// ============================================================

const marksSchema = yup.object().shape({
  student_id: yup.string().required('Student is required'),
  unit_id: yup.string().required('Unit is required'),
  academic_year: yup.string().required('Academic year is required'),
  semester: yup.string().required('Semester is required'),
  cat_marks: yup
    .number()
    .typeError('CAT marks must be a number')
    .required('CAT marks is required')
    .min(0, 'CAT marks cannot be negative')
    .max(100, 'CAT marks cannot exceed 100'),
  exam_marks: yup
    .number()
    .typeError('Exam marks must be a number')
    .required('Exam marks is required')
    .min(0, 'Exam marks cannot be negative')
    .max(100, 'Exam marks cannot exceed 100'),
});

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

const StatusBadge = ({ status }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.Draft;
  const Icon = config.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.bg} ${config.text} ${config.border}`}
    >
      <Icon className="w-3.5 h-3.5" />
      {status || 'Draft'}
    </span>
  );
};

const GradeBadge = ({ grade }) => {
  if (!grade) return <span className="text-sm text-gray-400">—</span>;
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

const StatCard = ({ icon: Icon, label, value, accent, active, onClick }) => {
  const accentMap = {
    brown: { bg: 'bg-[#F5EFE6]', text: 'text-[#6B4423]', bar: 'bg-[#6B4423]' },
    tan: { bg: 'bg-[#F5EFE6]', text: 'text-[#8B5E34]', bar: 'bg-[#8B5E34]' },
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', bar: 'bg-emerald-500' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-600', bar: 'bg-amber-500' },
    red: { bg: 'bg-red-50', text: 'text-red-600', bar: 'bg-red-500' },
    orange: { bg: 'bg-orange-50', text: 'text-orange-600', bar: 'bg-orange-500' },
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
        <div className="h-4 bg-gray-200 rounded w-40" />
        <div className="h-4 bg-gray-200 rounded w-20" />
        <div className="h-4 bg-gray-200 rounded w-12" />
        <div className="h-4 bg-gray-200 rounded w-12" />
        <div className="h-4 bg-gray-200 rounded w-12" />
        <div className="h-4 bg-gray-200 rounded w-20" />
      </div>
    ))}
  </div>
);

const EmptyState = ({ filtered, onAdd }) => (
  <div className="flex flex-col items-center justify-center py-16 px-4">
    <div
      className="w-20 h-20 rounded-full flex items-center justify-center mb-5"
      style={{ backgroundColor: BRAND.primarySoft }}
    >
      {filtered ? (
        <Search className="w-10 h-10" style={{ color: BRAND.primary }} />
      ) : (
        <GraduationCap
          className="w-10 h-10"
          style={{ color: BRAND.primary }}
        />
      )}
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">
      {filtered ? 'No Matching Results' : 'No Marks Recorded Yet'}
    </h3>
    <p className="text-sm text-gray-500 text-center max-w-md mb-6">
      {filtered
        ? 'No results match your current search or filter criteria. Try adjusting your filters.'
        : 'Record student marks to begin building the official results database.'}
    </p>
    {!filtered && (
      <button
        onClick={onAdd}
        className="inline-flex items-center gap-2 px-5 py-2.5 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm"
        style={{ backgroundColor: BRAND.primary }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor = BRAND.primaryDark)
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = BRAND.primary)
        }
      >
        <Plus className="w-4 h-4" />
        Record First Result
      </button>
    )}
  </div>
);

// Form field
const FormField = ({
  label,
  name,
  register,
  errors,
  type = 'text',
  placeholder,
  options = null,
  required = false,
  icon: Icon,
  step,
  disabled = false,
}) => {
  const error = errors[name];
  const inputClasses = `w-full px-3 py-2.5 text-sm border rounded-lg outline-none transition-all ${
    error ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
  } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`;

  const handleFocus = (e) => {
    if (!error && !disabled) {
      e.target.style.borderColor = BRAND.primary;
      e.target.style.boxShadow = `0 0 0 3px ${BRAND.primarySoft}`;
    }
  };
  const handleBlur = (e) => {
    e.target.style.borderColor = error ? '#fca5a5' : '#d1d5db';
    e.target.style.boxShadow = 'none';
  };

  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="w-4 h-4 text-gray-400 absolute left-3 top-[1.1rem] pointer-events-none" />
        )}
        {options ? (
          <select
            {...register(name)}
            disabled={disabled}
            className={`${inputClasses} ${Icon ? 'pl-10' : ''} appearance-none`}
            onFocus={handleFocus}
            onBlur={handleBlur}
          >
            <option value="">Select {label}</option>
            {options.map((o) => (
              <option key={o.value ?? o} value={o.value ?? o}>
                {o.label ?? o}
              </option>
            ))}
          </select>
        ) : (
          <input
            {...register(name)}
            type={type}
            step={step}
            placeholder={placeholder}
            disabled={disabled}
            className={`${inputClasses} ${Icon ? 'pl-10' : ''}`}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        )}
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {error.message}
        </p>
      )}
    </div>
  );
};

// ============================================================
// MARKS FORM MODAL (Add/Edit)
// ============================================================

const MarksFormModal = ({
  open,
  onClose,
  onSubmit,
  editingResult,
  loading,
  studentOptions,
  unitOptions,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(marksSchema),
    mode: 'onChange',
    defaultValues: {
      student_id: '',
      unit_id: '',
      academic_year: '',
      semester: '',
      cat_marks: '',
      exam_marks: '',
    },
  });

  const catMarks = watch('cat_marks');
  const examMarks = watch('exam_marks');
  const previewTotal =
    (parseFloat(catMarks) || 0) + (parseFloat(examMarks) || 0);

  useEffect(() => {
    if (open) {
      if (editingResult) {
        reset({
          student_id: editingResult.student_id || '',
          unit_id: editingResult.unit_id || '',
          academic_year: editingResult.academic_year || '',
          semester: editingResult.semester || '',
          cat_marks: editingResult.cat_marks ?? '',
          exam_marks: editingResult.exam_marks ?? '',
        });
      } else {
        reset({
          student_id: '',
          unit_id: '',
          academic_year: '',
          semester: '',
          cat_marks: '',
          exam_marks: '',
        });
      }
    }
  }, [open, editingResult, reset]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[95vh] overflow-hidden flex flex-col">
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
              {editingResult ? (
                <Edit className="w-5 h-5" style={{ color: BRAND.primary }} />
              ) : (
                <Plus className="w-5 h-5" style={{ color: BRAND.primary }} />
              )}
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                {editingResult ? 'Edit Result' : 'Record New Result'}
              </h2>
              <p className="text-xs text-gray-500">
                {editingResult
                  ? `Updating result #${editingResult.id}`
                  : 'Enter CAT and Exam marks for a student'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={loading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 overflow-y-auto"
        >
          <div className="p-6 space-y-5">
            {/* Student & Unit */}
            <div>
              <h4
                className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2"
                style={{ color: BRAND.accent }}
              >
                <User className="w-4 h-4" /> Student & Unit
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  label="Student"
                  name="student_id"
                  register={register}
                  errors={errors}
                  required
                  options={studentOptions}
                  icon={User}
                  disabled={!!editingResult}
                />
                <FormField
                  label="Unit"
                  name="unit_id"
                  register={register}
                  errors={errors}
                  required
                  options={unitOptions}
                  icon={BookOpen}
                  disabled={!!editingResult}
                />
                <FormField
                  label="Academic Year"
                  name="academic_year"
                  register={register}
                  errors={errors}
                  required
                  options={ACADEMIC_YEARS}
                  icon={Calendar}
                />
                <FormField
                  label="Semester"
                  name="semester"
                  register={register}
                  errors={errors}
                  required
                  options={SEMESTERS}
                  icon={Calendar}
                />
              </div>
            </div>

            {/* Marks */}
            <div>
              <h4
                className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2"
                style={{ color: BRAND.accent }}
              >
                <Target className="w-4 h-4" /> Marks
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  label="CAT Marks (0-100)"
                  name="cat_marks"
                  register={register}
                  errors={errors}
                  type="number"
                  step="0.01"
                  required
                  icon={FileText}
                  placeholder="e.g., 28.5"
                />
                <FormField
                  label="Exam Marks (0-100)"
                  name="exam_marks"
                  register={register}
                  errors={errors}
                  type="number"
                  step="0.01"
                  required
                  icon={Award}
                  placeholder="e.g., 55.0"
                />
              </div>

              {/* Preview — total only; grade is determined by backend */}
              <div
                className="mt-4 flex items-center justify-between gap-3 p-4 rounded-lg border"
                style={{
                  backgroundColor: BRAND.primarySoft,
                  borderColor: BRAND.primaryBorder,
                }}
              >
                <div className="flex items-center gap-2">
                  <Percent
                    className="w-4 h-4"
                    style={{ color: BRAND.primary }}
                  />
                  <span
                    className="text-sm font-medium"
                    style={{ color: BRAND.primaryDark }}
                  >
                    Total Preview
                  </span>
                </div>
                <span
                  className="text-lg font-bold"
                  style={{ color: BRAND.primary }}
                >
                  {formatNumber(previewTotal, 2)}
                </span>
              </div>
              <p className="mt-2 text-xs text-gray-500 flex items-center gap-1">
                <Info className="w-3 h-3" />
                Grade and grade point will be assigned by the system based on
                the official grading scale.
              </p>
            </div>
          </div>
        </form>

        <div className="flex items-center gap-3 p-5 border-t border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit(onSubmit)}
            disabled={loading}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white rounded-lg transition-colors shadow-sm disabled:opacity-60"
            style={{ backgroundColor: BRAND.primary }}
            onMouseEnter={(e) => {
              if (!loading) e.currentTarget.style.backgroundColor = BRAND.primaryDark;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = BRAND.primary;
            }}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                {editingResult ? 'Update Result' : 'Save Result'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// RESULT DETAILS MODAL
// ============================================================

const ResultDetailModal = ({ open, onClose, result, loading }) => {
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
              <GraduationCap
                className="w-5 h-5"
                style={{ color: BRAND.primary }}
              />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Result Details
              </h2>
              {result && (
                <p className="text-xs text-gray-500">#{result.id}</p>
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
          {loading || !result ? (
            <div className="flex items-center justify-center py-20">
              <Loader2
                className="w-8 h-8 animate-spin"
                style={{ color: BRAND.primary }}
              />
            </div>
          ) : (
            <div className="p-5 space-y-5">
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-gray-100">
                <div>
                  <p
                    className="text-xs font-semibold uppercase tracking-wider"
                    style={{ color: BRAND.primary }}
                  >
                    {result.unit_code}
                  </p>
                  <h3 className="text-xl font-bold text-gray-900 mt-0.5">
                    {result.unit_name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-0.5">
                    {result.student_name || result.student_id}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <GradeBadge grade={result.grade} />
                  <StatusBadge status={result.status} />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {renderField(FileText, 'CAT Marks', formatNumber(result.cat_marks, 1))}
                {renderField(Award, 'Exam Marks', formatNumber(result.exam_marks, 1))}
                {renderField(Target, 'Total Marks', formatNumber(result.total_marks, 1))}
                {renderField(Percent, 'Grade Point', formatNumber(result.grade_point, 1))}
                {renderField(Layers, 'Credit Hours', result.credit_hours)}
                {renderField(Calendar, 'Semester', result.semester)}
                {renderField(Calendar, 'Academic Year', result.academic_year)}
                {renderField(
                  Clock,
                  'Published At',
                  formatDate(result.published_at)
                )}
              </div>

              {result.remarks && (
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
                    Remarks
                  </p>
                  <p
                    className="text-sm"
                    style={{ color: BRAND.primaryDark }}
                  >
                    {result.remarks}
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
// CONFIRMATION MODAL
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
  requireInput = false,
  inputLabel = '',
  inputPlaceholder = '',
  inputValue = '',
  onInputChange = () => {},
  inputRequired = false,
  inputError = '',
}) => {
  if (!open) return null;

  const colors = {
    primary: { bg: BRAND.primary, hover: BRAND.primaryDark, icon: CheckCircle },
    danger: { bg: '#dc2626', hover: '#b91c1c', icon: XCircle },
    warning: { bg: '#ea580c', hover: '#c2410c', icon: FileWarning },
  };
  const c = colors[variant] || colors.primary;
  const Icon = c.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="p-6">
          <div className="flex items-start gap-4 mb-4">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${c.bg}15` }}
            >
              <Icon className="w-6 h-6" style={{ color: c.bg }} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-1">{title}</h3>
              {message && (
                <p className="text-sm text-gray-600 leading-relaxed">
                  {message}
                </p>
              )}
            </div>
          </div>

          {requireInput && (
            <div className="mt-4">
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                {inputLabel}{' '}
                {inputRequired && <span className="text-red-500">*</span>}
              </label>
              <textarea
                value={inputValue}
                onChange={(e) => onInputChange(e.target.value)}
                placeholder={inputPlaceholder}
                rows={4}
                className={`w-full px-3 py-2.5 text-sm border rounded-lg outline-none transition-all resize-none ${
                  inputError
                    ? 'border-red-300 bg-red-50'
                    : 'border-gray-300 bg-white'
                }`}
                onFocus={(e) => {
                  if (!inputError) {
                    e.target.style.borderColor = BRAND.primary;
                    e.target.style.boxShadow = `0 0 0 3px ${BRAND.primarySoft}`;
                  }
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = inputError
                    ? '#fca5a5'
                    : '#d1d5db';
                  e.target.style.boxShadow = 'none';
                }}
              />
              {inputError && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {inputError}
                </p>
              )}
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

const MarksResults = () => {
  // State
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [results, setResults] = useState([]);
  const [stats, setStats] = useState({
    studentsWithResults: 0,
    pending: 0,
    published: 0,
    withheld: 0,
    incomplete: 0,
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    program: '',
    department: '',
    academicYear: '',
    semester: '',
    unit: '',
    status: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  // Modals
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingResult, setEditingResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const [publishModal, setPublishModal] = useState(false);
  const [withholdModal, setWithholdModal] = useState(false);
  const [actionResult, setActionResult] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [withholdReason, setWithholdReason] = useState('');
  const [withholdError, setWithholdError] = useState('');

  const [slipLoading, setSlipLoading] = useState(false);

  // Options data (populated from backend)
  const [studentOptions, setStudentOptions] = useState([]);
  const [unitOptions, setUnitOptions] = useState([]);

  // ============================================================
  // API
  // ============================================================

  const fetchResults = useCallback(async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const params = {};
      if (filters.program) params.program = filters.program;
      if (filters.department) params.department = filters.department;
      if (filters.academicYear) params.academicYear = filters.academicYear;
      if (filters.semester) params.semester = filters.semester;
      if (filters.unit) params.unit = filters.unit;
      if (filters.status) params.status = filters.status;

      const response = await api.get('/api/admin/marks', { params });

      if (response.data.success) {
        const list = response.data.results || [];
        setResults(list);

        if (response.data.students) {
          setStudentOptions(
            response.data.students.map((s) => ({
              value: s.id || s.student_id,
              label: `${s.student_id || s.id} — ${
                s.full_name || s.student_name
              }`,
            }))
          );
        }
        if (response.data.units) {
          setUnitOptions(
            response.data.units.map((u) => ({
              value: u.id || u.unit_id,
              label: `${u.unit_code} — ${u.unit_name}`,
            }))
          );
        }

        const s = response.data.stats || {};
        const uniqueStudents = new Set(
          list.map((r) => r.student_id).filter(Boolean)
        );
        setStats({
          studentsWithResults:
            s.studentsWithResults ?? uniqueStudents.size,
          pending: s.pending ?? list.filter((r) => r.status === 'Pending').length,
          published:
            s.published ?? list.filter((r) => r.status === 'Published').length,
          withheld:
            s.withheld ?? list.filter((r) => r.status === 'Withheld').length,
          incomplete:
            s.incomplete ?? list.filter((r) => r.status === 'Incomplete').length,
        });

        if (showRefresh) toast.success('Results refreshed successfully');
      } else {
        toast.error(response.data.message || 'Results could not be loaded.');
      }
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
  }, [filters]);

  const fetchResultDetails = async (id) => {
    setLoadingDetail(true);
    try {
      const response = await api.get(`/api/admin/marks/${id}`);
      if (response.data.success) return response.data.result;
      throw new Error(response.data.message || 'Failed to load result');
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Result details could not be loaded.'
      );
      return null;
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleCreateOrUpdate = async (data) => {
    setSubmitting(true);
    try {
      const payload = {
        student_id: data.student_id,
        unit_id: data.unit_id,
        academic_year: data.academic_year,
        semester: data.semester,
        cat_marks: parseFloat(data.cat_marks),
        exam_marks: parseFloat(data.exam_marks),
      };

      const isEdit = Boolean(editingResult);
      const url = isEdit ? `/api/admin/marks/${editingResult.id}` : '/api/admin/marks';
      const response = isEdit
        ? await api.patch(url, payload)
        : await api.post(url, payload);

      if (response.data.success) {
        toast.success(
          isEdit
            ? 'Result updated successfully.'
            : 'Result recorded successfully.'
        );
        setFormModalOpen(false);
        setEditingResult(null);
        fetchResults(true);
      } else {
        toast.error(
          response.data.message ||
            (isEdit ? 'Unable to update result.' : 'Unable to record result.')
        );
      }
    } catch (error) {
      console.error('Save error:', error);
      toast.error(
        error.response?.data?.message ||
          (editingResult ? 'Unable to update result.' : 'Unable to record result.')
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleView = async (result) => {
    setSelectedResult(result);
    setDetailOpen(true);
    const full = await fetchResultDetails(result.id);
    if (full) setSelectedResult(full);
  };

  const handleEdit = (result) => {
    setEditingResult(result);
    setFormModalOpen(true);
  };

  const handlePublish = async () => {
    if (!actionResult) return;
    setActionLoading(true);
    try {
      const response = await api.patch(
        `/api/admin/marks/${actionResult.id}/publish`
      );
      if (response.data.success) {
        toast.success('Result published successfully.');
        setPublishModal(false);
        setActionResult(null);
        fetchResults(true);
      } else {
        toast.error(response.data.message || 'Unable to publish result.');
      }
    } catch (error) {
      console.error('Publish error:', error);
      toast.error(
        error.response?.data?.message || 'Unable to publish result.'
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleWithhold = async () => {
    if (!actionResult) return;
    if (!withholdReason.trim()) {
      setWithholdError('Please provide a reason for withholding.');
      return;
    }
    setActionLoading(true);
    try {
      const response = await api.patch(
        `/api/admin/marks/${actionResult.id}/withhold`,
        { reason: withholdReason.trim() }
      );
      if (response.data.success) {
        toast.success('Result withheld successfully.');
        setWithholdModal(false);
        setActionResult(null);
        setWithholdReason('');
        setWithholdError('');
        fetchResults(true);
      } else {
        toast.error(response.data.message || 'Unable to withhold result.');
      }
    } catch (error) {
      console.error('Withhold error:', error);
      toast.error(
        error.response?.data?.message || 'Unable to withhold result.'
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleGenerateSlip = async (result) => {
    setSlipLoading(true);
    try {
      const response = await api.get(
        `/api/admin/results/${result.id}/slip`,
        { responseType: 'blob' }
      );

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
        link.download = `Result_Slip_${result.student_id}_${result.unit_code}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        toast.success('Result slip downloaded successfully');
      }
    } catch (error) {
      console.error('Slip error:', error);
      toast.error(
        error.response?.data?.message ||
          'Result slip is currently unavailable.'
      );
    } finally {
      setSlipLoading(false);
    }
  };

  // ============================================================
  // FILTERING
  // ============================================================

  const filteredResults = useMemo(() => {
    let list = [...results];
    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      list = list.filter(
        (r) =>
          String(r.student_id || '').toLowerCase().includes(s) ||
          String(r.student_name || '').toLowerCase().includes(s) ||
          String(r.unit_code || '').toLowerCase().includes(s) ||
          String(r.unit_name || '').toLowerCase().includes(s)
      );
    }
    if (filters.program)
      list = list.filter((r) => r.program === filters.program);
    if (filters.department)
      list = list.filter((r) => r.department === filters.department);
    if (filters.academicYear)
      list = list.filter((r) => r.academic_year === filters.academicYear);
    if (filters.semester)
      list = list.filter((r) => r.semester === filters.semester);
    if (filters.unit)
      list = list.filter(
        (r) => r.unit_code === filters.unit || r.unit_name === filters.unit
      );
    if (filters.status) list = list.filter((r) => r.status === filters.status);
    return list;
  }, [results, searchTerm, filters]);

  const totalPages = Math.ceil(filteredResults.length / ITEMS_PER_PAGE);
  const paginated = filteredResults.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const hasActiveFilters = Boolean(
    searchTerm ||
      filters.program ||
      filters.department ||
      filters.academicYear ||
      filters.semester ||
      filters.unit ||
      filters.status
  );

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilters({
      program: '',
      department: '',
      academicYear: '',
      semester: '',
      unit: '',
      status: '',
    });
  };

  // ============================================================
  // EFFECTS
  // ============================================================

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  const programOptions = useMemo(
    () => [...new Set(results.map((r) => r.program).filter(Boolean))],
    [results]
  );
  const departmentOptions = useMemo(
    () => [...new Set(results.map((r) => r.department).filter(Boolean))],
    [results]
  );
  const unitFilterOptions = useMemo(
    () => [
      ...new Set(
        results.map((r) => (r.unit_code ? `${r.unit_code} — ${r.unit_name}` : null)).filter(Boolean)
      ),
    ],
    [results]
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
                Manage student marks, grades, GPA and academic results.
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
                onClick={() => {
                  setEditingResult(null);
                  setFormModalOpen(true);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white rounded-lg transition-colors shadow-sm"
                style={{ backgroundColor: BRAND.primary }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = BRAND.primaryDark)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = BRAND.primary)
                }
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Record Marks</span>
                <span className="sm:hidden">Add</span>
              </button>
            </div>
          </div>
        </div>

        {/* ============================================================
            STATISTICS CARDS
            ============================================================ */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
          <StatCard
            icon={Users}
            label="Students with Results"
            value={stats.studentsWithResults}
            accent="brown"
            active={false}
            onClick={() => {}}
          />
          <StatCard
            icon={Clock}
            label="Pending Results"
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
            label="Published Results"
            value={stats.published}
            accent="emerald"
            active={filters.status === 'Published'}
            onClick={() =>
              setFilters((f) => ({
                ...f,
                status: f.status === 'Published' ? '' : 'Published',
              }))
            }
          />
          <StatCard
            icon={Lock}
            label="Withheld Results"
            value={stats.withheld}
            accent="red"
            active={filters.status === 'Withheld'}
            onClick={() =>
              setFilters((f) => ({
                ...f,
                status: f.status === 'Withheld' ? '' : 'Withheld',
              }))
            }
          />
          <StatCard
            icon={FileWarning}
            label="Incomplete Results"
            value={stats.incomplete}
            accent="orange"
            active={filters.status === 'Incomplete'}
            onClick={() =>
              setFilters((f) => ({
                ...f,
                status: f.status === 'Incomplete' ? '' : 'Incomplete',
              }))
            }
          />
        </div>

        {/* ============================================================
            SEARCH & FILTERS
            ============================================================ */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by student ID, name, unit code, unit name..."
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
                      filters.program,
                      filters.department,
                      filters.academicYear,
                      filters.semester,
                      filters.unit,
                      filters.status,
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
                  { key: 'program', label: 'Program', options: programOptions },
                  { key: 'department', label: 'Department', options: departmentOptions },
                  { key: 'academicYear', label: 'Academic Year', options: ACADEMIC_YEARS },
                  { key: 'semester', label: 'Semester', options: SEMESTERS },
                  { key: 'unit', label: 'Unit', options: unitFilterOptions },
                  { key: 'status', label: 'Result Status', options: RESULT_STATUSES },
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

        {/* ============================================================
            RESULTS TABLE
            ============================================================ */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {loading ? (
            <TableSkeleton />
          ) : filteredResults.length === 0 ? (
            <EmptyState
              filtered={results.length > 0}
              onAdd={() => {
                setEditingResult(null);
                setFormModalOpen(true);
              }}
            />
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
                        'Student ID',
                        'Student Name',
                        'Unit Code',
                        'Unit Name',
                        'Credit Hrs',
                        'CAT',
                        'Exam',
                        'Total',
                        'Grade',
                        'GP',
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
                    {paginated.map((r) => (
                      <tr
                        key={r.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-3.5">
                          <span
                            className="text-sm font-semibold"
                            style={{ color: BRAND.primary }}
                          >
                            {r.student_id}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="text-sm font-medium text-gray-900 block max-w-[180px] truncate">
                            {r.student_name || '—'}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span
                            className="text-sm font-semibold"
                            style={{ color: BRAND.primary }}
                          >
                            {r.unit_code}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="text-sm text-gray-700 block max-w-[220px] truncate">
                            {r.unit_name}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="inline-flex items-center gap-1 text-sm text-gray-700">
                            <Layers className="w-3.5 h-3.5 text-gray-400" />
                            {r.credit_hours ?? '—'}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="text-sm text-gray-700">
                            {formatNumber(r.cat_marks, 1)}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="text-sm text-gray-700">
                            {formatNumber(r.exam_marks, 1)}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="text-sm font-semibold text-gray-900">
                            {formatNumber(r.total_marks, 1)}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <GradeBadge grade={r.grade} />
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="text-sm text-gray-700">
                            {formatNumber(r.grade_point, 1)}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <StatusBadge status={r.status} />
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => handleView(r)}
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
                            {r.status !== 'Published' && (
                              <button
                                onClick={() => handleEdit(r)}
                                className="p-1.5 text-gray-500 rounded-lg transition-colors"
                                title="Edit Marks"
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.color = '#2563eb';
                                  e.currentTarget.style.backgroundColor =
                                    '#eff6ff';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.color = '#6b7280';
                                  e.currentTarget.style.backgroundColor =
                                    'transparent';
                                }}
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                            )}
                            {r.status === 'Draft' || r.status === 'Pending' ? (
                              <button
                                onClick={() => {
                                  setActionResult(r);
                                  setPublishModal(true);
                                }}
                                className="p-1.5 text-gray-500 rounded-lg transition-colors"
                                title="Publish"
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
                                <Send className="w-4 h-4" />
                              </button>
                            ) : null}
                            {r.status === 'Published' && (
                              <button
                                onClick={() => {
                                  setActionResult(r);
                                  setWithholdReason('');
                                  setWithholdError('');
                                  setWithholdModal(true);
                                }}
                                className="p-1.5 text-gray-500 rounded-lg transition-colors"
                                title="Withhold"
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
                                <Lock className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => handleGenerateSlip(r)}
                              disabled={slipLoading}
                              className="p-1.5 text-gray-500 rounded-lg transition-colors disabled:opacity-50"
                              title="Generate Result Slip"
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
                              <Download className="w-4 h-4" />
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
                {paginated.map((r) => (
                  <div
                    key={r.id}
                    className="p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span
                            className="text-sm font-bold"
                            style={{ color: BRAND.primary }}
                          >
                            {r.unit_code}
                          </span>
                          <GradeBadge grade={r.grade} />
                          <StatusBadge status={r.status} />
                        </div>
                        <h3 className="text-sm font-semibold text-gray-900 truncate">
                          {r.unit_name}
                        </h3>
                        <p className="text-xs text-gray-500 truncate">
                          {r.student_name || r.student_id}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <Hash className="w-3.5 h-3.5 text-gray-400" />
                        {r.student_id}
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <Target className="w-3.5 h-3.5 text-gray-400" />
                        Total: {formatNumber(r.total_marks, 1)}
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <FileText className="w-3.5 h-3.5 text-gray-400" />
                        CAT: {formatNumber(r.cat_marks, 1)}
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <Award className="w-3.5 h-3.5 text-gray-400" />
                        Exam: {formatNumber(r.exam_marks, 1)}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-3 border-t border-gray-100 flex-wrap">
                      <button
                        onClick={() => handleView(r)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg transition-colors"
                        style={{
                          color: BRAND.primary,
                          backgroundColor: BRAND.primarySoft,
                        }}
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View
                      </button>
                      {r.status !== 'Published' && (
                        <button
                          onClick={() => handleEdit(r)}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          Edit
                        </button>
                      )}
                      {(r.status === 'Draft' || r.status === 'Pending') && (
                        <button
                          onClick={() => {
                            setActionResult(r);
                            setPublishModal(true);
                          }}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-emerald-700 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors"
                        >
                          <Send className="w-3.5 h-3.5" />
                          Publish
                        </button>
                      )}
                      {r.status === 'Published' && (
                        <button
                          onClick={() => {
                            setActionResult(r);
                            setWithholdReason('');
                            setWithholdError('');
                            setWithholdModal(true);
                          }}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                        >
                          <Lock className="w-3.5 h-3.5" />
                          Withhold
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
                        filteredResults.length
                      )}
                    </span>{' '}
                    of{' '}
                    <span className="font-semibold">
                      {filteredResults.length}
                    </span>{' '}
                    results
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
                            style={active ? { backgroundColor: BRAND.primary } : {}}
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
        {!loading && results.length > 0 && (
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
              Grades and grade points are calculated by the system using the
              official university grading scale. Students will only see results
              marked as <strong>Published</strong> on their dashboard.
            </p>
          </div>
        )}
      </div>

      {/* ============================================================
          MODALS
          ============================================================ */}
      <MarksFormModal
        open={formModalOpen}
        onClose={() => {
          setFormModalOpen(false);
          setEditingResult(null);
        }}
        onSubmit={handleCreateOrUpdate}
        editingResult={editingResult}
        loading={submitting}
        studentOptions={studentOptions}
        unitOptions={unitOptions}
      />

      <ResultDetailModal
        open={detailOpen}
        onClose={() => {
          setDetailOpen(false);
          setSelectedResult(null);
        }}
        result={selectedResult}
        loading={loadingDetail}
      />

      <ConfirmModal
        open={publishModal}
        onClose={() => {
          setPublishModal(false);
          setActionResult(null);
        }}
        onConfirm={handlePublish}
        title="Publish Result?"
        message={`Publishing this result will make it immediately visible to the student on their dashboard. Make sure the marks are correct before publishing.`}
        confirmText="Publish Result"
        loading={actionLoading}
        variant="primary"
      />

      <ConfirmModal
        open={withholdModal}
        onClose={() => {
          setWithholdModal(false);
          setActionResult(null);
          setWithholdReason('');
          setWithholdError('');
        }}
        onConfirm={handleWithhold}
        title="Withhold Result"
        message="Withholding will hide this result from the student until it is re-published. Please provide a reason."
        confirmText="Withhold Result"
        loading={actionLoading}
        variant="danger"
        requireInput
        inputLabel="Reason for Withholding"
        inputPlaceholder="Explain why this result is being withheld..."
        inputValue={withholdReason}
        onInputChange={(v) => {
          setWithholdReason(v);
          if (v.trim()) setWithholdError('');
        }}
        inputRequired
        inputError={withholdError}
      />
    </div>
  );
};

export default MarksResults;