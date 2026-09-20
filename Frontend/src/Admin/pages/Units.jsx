// src/Admin/pages/Units.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  BookOpen,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Plus,
  RefreshCw,
  X,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  CheckCircle,
  XCircle,
  AlertCircle,
  AlertTriangle,
  Layers,
  Building2,
  GraduationCap,
  Calendar,
  User,
  Hash,
  FileText,
  Award,
  Info,
  Power,
  PowerOff,
  Save,
  BookMarked,
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
const STATUSES = ['Active', 'Inactive'];

const STATUS_CONFIG = {
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
};

const ITEMS_PER_PAGE = 10;

// ============================================================
// VALIDATION SCHEMA
// ============================================================

const unitSchema = yup.object().shape({
  unitCode: yup
    .string()
    .required('Unit code is required')
    .min(2, 'Unit code must be at least 2 characters')
    .max(20, 'Unit code is too long')
    .matches(
      /^[A-Za-z0-9\s-]+$/,
      'Only letters, numbers, spaces and hyphens allowed'
    ),
  unitName: yup
    .string()
    .required('Unit name is required')
    .min(3, 'Unit name must be at least 3 characters')
    .max(150, 'Unit name is too long'),
  description: yup
    .string()
    .nullable()
    .max(1000, 'Description is too long')
    .transform((v) => (v === '' ? null : v)),
  creditHours: yup
    .number()
    .typeError('Credit hours must be a number')
    .required('Credit hours is required')
    .integer('Credit hours must be a whole number')
    .min(1, 'Credit hours must be at least 1')
    .max(12, 'Credit hours cannot exceed 12'),
  department: yup.string().required('Department is required'),
  program: yup.string().required('Program is required'),
  faculty: yup.string().nullable(),
  semester: yup.string().required('Semester is required'),
  academicYear: yup.string().required('Academic year is required'),
  lecturer: yup.string().required('Lecturer is required'),
  prerequisites: yup.string().nullable(),
  status: yup
    .string()
    .required('Status is required')
    .oneOf(['Active', 'Inactive']),
});

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
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.Inactive;
  const Icon = config.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.bg} ${config.text} ${config.border}`}
    >
      <Icon className="w-3.5 h-3.5" />
      {status || 'Inactive'}
    </span>
  );
};

const StatCard = ({ icon: Icon, label, value, accent, active, onClick }) => {
  const accentMap = {
    brown: { bg: 'bg-[#F5EFE6]', text: 'text-[#6B4423]', bar: 'bg-[#6B4423]' },
    tan: { bg: 'bg-[#F5EFE6]', text: 'text-[#8B5E34]', bar: 'bg-[#8B5E34]' },
    emerald: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-600',
      bar: 'bg-emerald-500',
    },
    gray: { bg: 'bg-gray-100', text: 'text-gray-600', bar: 'bg-gray-500' },
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
        <div className="h-4 bg-gray-200 rounded w-20" />
        <div className="h-4 bg-gray-200 rounded w-16" />
        <div className="h-4 bg-gray-200 rounded w-48" />
        <div className="h-4 bg-gray-200 rounded w-12" />
        <div className="h-4 bg-gray-200 rounded w-32" />
        <div className="h-4 bg-gray-200 rounded w-24" />
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
        <BookOpen className="w-10 h-10" style={{ color: BRAND.primary }} />
      )}
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">
      {filtered ? 'No Matching Units' : 'No Units Yet'}
    </h3>
    <p className="text-sm text-gray-500 text-center max-w-md mb-6">
      {filtered
        ? 'No units match your current search or filter criteria. Try adjusting your filters.'
        : 'Create your first academic unit to make it available for student registration.'}
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
        Add First Unit
      </button>
    )}
  </div>
);

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
  multiline = false,
  rows = 3,
  step,
}) => {
  const error = errors[name];
  const inputClasses = `w-full px-3 py-2.5 text-sm border rounded-lg outline-none transition-all ${
    error ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
  }`;

  const handleFocus = (e) => {
    if (!error) {
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
            className={`${inputClasses} ${Icon ? 'pl-10' : ''} appearance-none`}
            onFocus={handleFocus}
            onBlur={handleBlur}
          >
            <option value="">Select {label}</option>
            {options.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        ) : multiline ? (
          <textarea
            {...register(name)}
            placeholder={placeholder}
            rows={rows}
            className={`${inputClasses} ${Icon ? 'pl-10' : ''} resize-none`}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        ) : (
          <input
            {...register(name)}
            type={type}
            step={step}
            placeholder={placeholder}
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
// UNIT FORM MODAL (Add/Edit)
// ============================================================

const UnitFormModal = ({
  open,
  onClose,
  onSubmit,
  editingUnit,
  loading,
  departmentOptions,
  programOptions,
  lecturerOptions,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(unitSchema),
    mode: 'onChange',
    defaultValues: {
      unitCode: '',
      unitName: '',
      description: '',
      creditHours: 3,
      department: '',
      program: '',
      faculty: '',
      semester: '',
      academicYear: '',
      lecturer: '',
      prerequisites: '',
      status: 'Active',
    },
  });

  useEffect(() => {
    if (open) {
      if (editingUnit) {
        reset({
          unitCode: editingUnit.unitCode || '',
          unitName: editingUnit.unitName || '',
          description: editingUnit.description || '',
          creditHours: editingUnit.creditHours || 3,
          department: editingUnit.department || '',
          program: editingUnit.program || '',
          faculty: editingUnit.faculty || '',
          semester: editingUnit.semester || '',
          academicYear: editingUnit.academicYear || '',
          lecturer: editingUnit.lecturer || '',
          prerequisites: Array.isArray(editingUnit.prerequisites)
            ? editingUnit.prerequisites.join(', ')
            : editingUnit.prerequisites || '',
          status: editingUnit.status || 'Active',
        });
      } else {
        reset({
          unitCode: '',
          unitName: '',
          description: '',
          creditHours: 3,
          department: '',
          program: '',
          faculty: '',
          semester: '',
          academicYear: '',
          lecturer: '',
          prerequisites: '',
          status: 'Active',
        });
      }
    }
  }, [open, editingUnit, reset]);

  if (!open) return null;

  const handleFormSubmit = (data) => {
    const payload = {
      ...data,
      unitCode: data.unitCode.trim().toUpperCase(),
      unitName: data.unitName.trim(),
      description: data.description?.trim() || null,
      prerequisites: data.prerequisites
        ? data.prerequisites
            .split(',')
            .map((p) => p.trim())
            .filter(Boolean)
        : [],
    };
    onSubmit(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[95vh] overflow-hidden flex flex-col">
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
              {editingUnit ? (
                <Edit className="w-5 h-5" style={{ color: BRAND.primary }} />
              ) : (
                <Plus className="w-5 h-5" style={{ color: BRAND.primary }} />
              )}
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                {editingUnit ? 'Edit Unit' : 'Add New Unit'}
              </h2>
              <p className="text-xs text-gray-500">
                {editingUnit
                  ? `Updating ${editingUnit.unitCode}`
                  : 'Create a new academic unit'}
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
          onSubmit={handleSubmit(handleFormSubmit)}
          className="flex-1 overflow-y-auto"
        >
          <div className="p-6 space-y-6">
            <div>
              <h4
                className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2"
                style={{ color: BRAND.accent }}
              >
                <BookOpen className="w-4 h-4" /> Basic Information
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  label="Unit Code"
                  name="unitCode"
                  register={register}
                  errors={errors}
                  required
                  icon={Hash}
                  placeholder="e.g., CS101"
                />
                <FormField
                  label="Unit Name"
                  name="unitName"
                  register={register}
                  errors={errors}
                  required
                  icon={BookOpen}
                  placeholder="e.g., Introduction to Programming"
                />
                <FormField
                  label="Credit Hours"
                  name="creditHours"
                  register={register}
                  errors={errors}
                  type="number"
                  step="1"
                  required
                  icon={Layers}
                  placeholder="3"
                />
                <FormField
                  label="Status"
                  name="status"
                  register={register}
                  errors={errors}
                  required
                  options={STATUSES}
                  icon={Power}
                />
                <div className="sm:col-span-2">
                  <FormField
                    label="Description"
                    name="description"
                    register={register}
                    errors={errors}
                    icon={FileText}
                    placeholder="Short description of the unit content and objectives"
                    multiline
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <div>
              <h4
                className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2"
                style={{ color: BRAND.accent }}
              >
                <GraduationCap className="w-4 h-4" /> Academic Placement
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {departmentOptions.length > 0 ? (
                  <FormField
                    label="Department"
                    name="department"
                    register={register}
                    errors={errors}
                    required
                    options={departmentOptions}
                    icon={Building2}
                  />
                ) : (
                  <FormField
                    label="Department"
                    name="department"
                    register={register}
                    errors={errors}
                    required
                    icon={Building2}
                    placeholder="e.g., Computer Science"
                  />
                )}
                {programOptions.length > 0 ? (
                  <FormField
                    label="Program"
                    name="program"
                    register={register}
                    errors={errors}
                    required
                    options={programOptions}
                    icon={BookMarked}
                  />
                ) : (
                  <FormField
                    label="Program"
                    name="program"
                    register={register}
                    errors={errors}
                    required
                    icon={BookMarked}
                    placeholder="e.g., BSc Computer Science"
                  />
                )}
                <FormField
                  label="Faculty (Optional)"
                  name="faculty"
                  register={register}
                  errors={errors}
                  icon={Building2}
                  placeholder="e.g., Faculty of Science & Technology"
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
                <FormField
                  label="Academic Year"
                  name="academicYear"
                  register={register}
                  errors={errors}
                  required
                  options={ACADEMIC_YEARS}
                  icon={Calendar}
                />
                {lecturerOptions.length > 0 ? (
                  <FormField
                    label="Lecturer"
                    name="lecturer"
                    register={register}
                    errors={errors}
                    required
                    options={lecturerOptions}
                    icon={User}
                  />
                ) : (
                  <FormField
                    label="Lecturer"
                    name="lecturer"
                    register={register}
                    errors={errors}
                    required
                    icon={User}
                    placeholder="e.g., Dr. Jane Smith"
                  />
                )}
              </div>
            </div>

            <div>
              <h4
                className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2"
                style={{ color: BRAND.accent }}
              >
                <Award className="w-4 h-4" /> Prerequisites
              </h4>
              <FormField
                label="Prerequisites (comma-separated unit codes)"
                name="prerequisites"
                register={register}
                errors={errors}
                icon={Award}
                placeholder="e.g., CS100, MATH101"
              />
              <p className="text-xs text-gray-500 mt-1.5">
                Leave blank if there are no prerequisites.
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
            onClick={handleSubmit(handleFormSubmit)}
            disabled={loading}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white rounded-lg transition-colors shadow-sm disabled:opacity-60"
            style={{ backgroundColor: BRAND.primary }}
            onMouseEnter={(e) => {
              if (!loading)
                e.currentTarget.style.backgroundColor = BRAND.primaryDark;
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
                {editingUnit ? 'Update Unit' : 'Create Unit'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// UNIT DETAILS MODAL
// ============================================================

const UnitDetailsModal = ({ open, onClose, unit, loading }) => {
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
              <BookOpen className="w-5 h-5" style={{ color: BRAND.primary }} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Unit Details</h2>
              {unit && (
                <p className="text-xs text-gray-500">{unit.unitCode}</p>
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
          {loading || !unit ? (
            <div className="flex items-center justify-center py-20">
              <Loader2
                className="w-8 h-8 animate-spin"
                style={{ color: BRAND.primary }}
              />
            </div>
          ) : (
            <div className="p-5 space-y-4">
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-gray-100">
                <div className="flex-1">
                  <p
                    className="text-xs font-semibold uppercase tracking-wider"
                    style={{ color: BRAND.primary }}
                  >
                    {unit.unitCode}
                  </p>
                  <h3 className="text-xl font-bold text-gray-900 mt-0.5">
                    {unit.unitName}
                  </h3>
                </div>
                <StatusBadge status={unit.status} />
              </div>

              {unit.description && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                    Description
                  </p>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {unit.description}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {renderField(Layers, 'Credit Hours', unit.creditHours)}
                {renderField(User, 'Lecturer', unit.lecturer)}
                {renderField(Building2, 'Department', unit.department)}
                {renderField(BookMarked, 'Program', unit.program)}
                {renderField(Building2, 'Faculty', unit.faculty)}
                {renderField(Calendar, 'Semester', unit.semester)}
                {renderField(Calendar, 'Academic Year', unit.academicYear)}
                {renderField(
                  Award,
                  'Prerequisites',
                  Array.isArray(unit.prerequisites)
                    ? unit.prerequisites.join(', ')
                    : unit.prerequisites || 'None'
                )}
                {renderField(Calendar, 'Created', formatDate(unit.createdAt))}
                {renderField(
                  Calendar,
                  'Last Updated',
                  formatDate(unit.updatedAt)
                )}
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
// DELETE MODAL
// ============================================================

const DeleteModal = ({ open, onClose, onConfirm, unit, loading, error }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Delete Unit?
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            This action cannot be undone. The unit will be permanently removed.
          </p>

          {unit && (
            <div className="p-3 bg-gray-50 rounded-xl text-left">
              <p
                className="text-xs font-semibold mb-0.5"
                style={{ color: BRAND.primary }}
              >
                {unit.unitCode}
              </p>
              <p className="text-sm font-semibold text-gray-900">
                {unit.unitName}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {unit.creditHours} Credit Hours · {unit.department}
              </p>
            </div>
          )}

          <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg mt-4 text-left">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800">
              If this unit has active student registrations, it cannot be
              deleted. Consider deactivating it instead.
            </p>
          </div>

          {error && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg mt-3 text-left">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-800">{error}</p>
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
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                Delete Unit
              </>
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

const Units = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [units, setUnits] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    thisSemester: 0,
    departments: 0,
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    department: '',
    program: '',
    semester: '',
    academicYear: '',
    status: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [detailsUnit, setDetailsUnit] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [unitToDelete, setUnitToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const [togglingId, setTogglingId] = useState(null);

  // ============================================================
  // API — JSON SERVER
  // ============================================================

  const fetchUnits = useCallback(
    async (showRefresh = false) => {
      if (showRefresh) setRefreshing(true);
      else setLoading(true);

      try {
        const params = {};
        if (filters.department) params.department = filters.department;
        if (filters.program) params.program = filters.program;
        if (filters.semester) params.semester = filters.semester;
        if (filters.academicYear) params.academicYear = filters.academicYear;
        if (filters.status) params.status = filters.status;

        // GET /units
        const response = await api.get('/units', { params });
        const list = Array.isArray(response.data) ? response.data : [];

        setUnits(list);

        // Stats
        const departments = new Set(
          list.map((u) => u.department).filter(Boolean)
        );
        const semesterCounts = {};
        list.forEach((u) => {
          if (u.semester) {
            semesterCounts[u.semester] = (semesterCounts[u.semester] || 0) + 1;
          }
        });
        const topSemester = Object.entries(semesterCounts).sort(
          (a, b) => b[1] - a[1]
        )[0]?.[0];
        const thisSemester = topSemester
          ? list.filter((u) => u.semester === topSemester).length
          : 0;

        setStats({
          total: list.length,
          active: list.filter((u) => u.status === 'Active').length,
          inactive: list.filter((u) => u.status === 'Inactive').length,
          thisSemester,
          departments: departments.size,
        });

        if (showRefresh) toast.success('Units refreshed successfully');
      } catch (error) {
        console.error('Error fetching units:', error);
        if (!error.response) {
          toast.error(
            'Cannot reach JSON Server. Make sure it is running on port 5000.'
          );
        } else {
          toast.error('Units could not be loaded. Please try again.');
        }
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [filters]
  );

  const fetchUnitDetails = async (id) => {
    setLoadingDetails(true);
    try {
      const response = await api.get(`/units/${id}`);
      return response.data;
    } catch (error) {
      toast.error('Unit details could not be loaded.');
      return null;
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleCreateOrUpdateUnit = async (data) => {
    setSubmitting(true);
    try {
      const isEdit = Boolean(editingUnit);
      const now = new Date().toISOString();

      if (isEdit) {
        await api.patch(`/units/${editingUnit.id}`, {
          ...data,
          updatedAt: now,
        });
        toast.success('Unit updated successfully.');
      } else {
        await api.post('/units', {
          ...data,
          createdAt: now,
          updatedAt: now,
        });
        toast.success('Unit created successfully.');
      }

      setFormModalOpen(false);
      setEditingUnit(null);
      fetchUnits(true);
    } catch (error) {
      console.error('Save unit error:', error);
      toast.error(
        editingUnit ? 'Unable to update unit.' : 'Unable to create unit.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleViewUnit = async (unit) => {
    setDetailsUnit(unit);
    setDetailsModalOpen(true);
    const full = await fetchUnitDetails(unit.id);
    if (full) setDetailsUnit(full);
  };

  const handleEditUnit = (unit) => {
    setEditingUnit(unit);
    setFormModalOpen(true);
  };

  const handleOpenDelete = (unit) => {
    setUnitToDelete(unit);
    setDeleteError('');
    setDeleteModalOpen(true);
  };

  const handleDeleteUnit = async () => {
    if (!unitToDelete) return;
    setDeleting(true);
    setDeleteError('');
    try {
      // DELETE /units/:id
      await api.delete(`/units/${unitToDelete.id}`);
      toast.success('Unit deleted successfully.');
      setDeleteModalOpen(false);
      setUnitToDelete(null);
      fetchUnits(true);
    } catch (error) {
      console.error('Delete unit error:', error);
      const msg = 'Unit could not be deleted. Please try again.';
      setDeleteError(msg);
      toast.error(msg);
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleStatus = async (unit) => {
    const newStatus = unit.status === 'Active' ? 'Inactive' : 'Active';
    setTogglingId(unit.id);
    try {
      // PATCH /units/:id
      await api.patch(`/units/${unit.id}`, {
        status: newStatus,
        updatedAt: new Date().toISOString(),
      });
      toast.success(
        `Unit ${newStatus === 'Active' ? 'activated' : 'deactivated'} successfully.`
      );
      setUnits((prev) =>
        prev.map((u) => (u.id === unit.id ? { ...u, status: newStatus } : u))
      );
      fetchUnits();
    } catch (error) {
      console.error('Toggle status error:', error);
      toast.error('Unable to update unit status.');
    } finally {
      setTogglingId(null);
    }
  };

  // ============================================================
  // FILTERING
  // ============================================================

  const filteredUnits = useMemo(() => {
    let result = [...units];
    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      result = result.filter(
        (u) =>
          String(u.unitCode || '').toLowerCase().includes(s) ||
          String(u.unitName || '').toLowerCase().includes(s) ||
          String(u.lecturer || '').toLowerCase().includes(s)
      );
    }
    if (filters.department)
      result = result.filter((u) => u.department === filters.department);
    if (filters.program)
      result = result.filter((u) => u.program === filters.program);
    if (filters.semester)
      result = result.filter((u) => u.semester === filters.semester);
    if (filters.academicYear)
      result = result.filter((u) => u.academicYear === filters.academicYear);
    if (filters.status)
      result = result.filter((u) => u.status === filters.status);
    return result;
  }, [units, searchTerm, filters]);

  const totalPages = Math.ceil(filteredUnits.length / ITEMS_PER_PAGE);
  const paginated = filteredUnits.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const hasActiveFilters = Boolean(
    searchTerm ||
      filters.department ||
      filters.program ||
      filters.semester ||
      filters.academicYear ||
      filters.status
  );

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilters({
      department: '',
      program: '',
      semester: '',
      academicYear: '',
      status: '',
    });
  };

  useEffect(() => {
    fetchUnits();
  }, [fetchUnits]);

  const departmentOptions = useMemo(
    () => [...new Set(units.map((u) => u.department).filter(Boolean))],
    [units]
  );
  const programOptions = useMemo(
    () => [...new Set(units.map((u) => u.program).filter(Boolean))],
    [units]
  );
  const lecturerOptions = useMemo(
    () => [...new Set(units.map((u) => u.lecturer).filter(Boolean))],
    [units]
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
                  <BookOpen
                    className="w-6 h-6"
                    style={{ color: BRAND.primary }}
                  />
                </div>
                Units
              </h1>
              <p className="text-sm text-gray-500 mt-1 ml-11">
                Manage university courses and academic units.
              </p>
            </div>

            <div className="flex items-center gap-2 ml-11 sm:ml-0">
              <button
                onClick={() => fetchUnits(true)}
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
                  setEditingUnit(null);
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
                <span className="hidden sm:inline">Add Unit</span>
                <span className="sm:hidden">Add</span>
              </button>
            </div>
          </div>
        </div>

        {/* STATISTICS */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
          <StatCard
            icon={BookOpen}
            label="Total Units"
            value={stats.total}
            accent="brown"
            active={!filters.status}
            onClick={() => setFilters((f) => ({ ...f, status: '' }))}
          />
          <StatCard
            icon={CheckCircle}
            label="Active Units"
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
            icon={XCircle}
            label="Inactive Units"
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
            icon={Calendar}
            label="This Semester"
            value={stats.thisSemester}
            accent="blue"
            active={false}
            onClick={() => {}}
          />
          <StatCard
            icon={Building2}
            label="Departments"
            value={stats.departments}
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
                      filters.department,
                      filters.program,
                      filters.semester,
                      filters.academicYear,
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {[
                  {
                    key: 'department',
                    label: 'Department',
                    options: departmentOptions,
                  },
                  { key: 'program', label: 'Program', options: programOptions },
                  { key: 'semester', label: 'Semester', options: SEMESTERS },
                  {
                    key: 'academicYear',
                    label: 'Academic Year',
                    options: ACADEMIC_YEARS,
                  },
                  { key: 'status', label: 'Status', options: STATUSES },
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

        {/* UNITS TABLE */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {loading ? (
            <TableSkeleton />
          ) : filteredUnits.length === 0 ? (
            <EmptyState
              filtered={units.length > 0}
              onAdd={() => {
                setEditingUnit(null);
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
                        'Unit ID',
                        'Unit Code',
                        'Unit Name',
                        'Credit Hrs',
                        'Department',
                        'Program',
                        'Semester',
                        'Academic Year',
                        'Lecturer',
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
                    {paginated.map((unit) => (
                      <tr
                        key={unit.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-3.5">
                          <span className="text-xs text-gray-500">
                            #{unit.id}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span
                            className="text-sm font-semibold"
                            style={{ color: BRAND.primary }}
                          >
                            {unit.unitCode}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="text-sm font-medium text-gray-900 block max-w-[220px] truncate">
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
                            {unit.department || '—'}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="text-sm text-gray-600">
                            {unit.program || '—'}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="text-sm text-gray-600">
                            {unit.semester || '—'}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="text-sm text-gray-600 whitespace-nowrap">
                            {unit.academicYear || '—'}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="text-sm text-gray-600">
                            {unit.lecturer || '—'}
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
                              onClick={() => handleEditUnit(unit)}
                              className="p-1.5 text-gray-500 rounded-lg transition-colors"
                              title="Edit"
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
                            <button
                              onClick={() => handleToggleStatus(unit)}
                              disabled={togglingId === unit.id}
                              className="p-1.5 text-gray-500 rounded-lg transition-colors disabled:opacity-50"
                              title={
                                unit.status === 'Active'
                                  ? 'Deactivate'
                                  : 'Activate'
                              }
                              onMouseEnter={(e) => {
                                e.currentTarget.style.color =
                                  unit.status === 'Active'
                                    ? '#d97706'
                                    : '#059669';
                                e.currentTarget.style.backgroundColor =
                                  unit.status === 'Active'
                                    ? '#fffbeb'
                                    : '#ecfdf5';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.color = '#6b7280';
                                e.currentTarget.style.backgroundColor =
                                  'transparent';
                              }}
                            >
                              {togglingId === unit.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : unit.status === 'Active' ? (
                                <PowerOff className="w-4 h-4" />
                              ) : (
                                <Power className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              onClick={() => handleOpenDelete(unit)}
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
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="lg:hidden divide-y divide-gray-100">
                {paginated.map((unit) => (
                  <div
                    key={unit.id}
                    className="p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span
                            className="text-sm font-bold"
                            style={{ color: BRAND.primary }}
                          >
                            {unit.unitCode}
                          </span>
                          <StatusBadge status={unit.status} />
                        </div>
                        <h3 className="text-sm font-semibold text-gray-900">
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
                        {unit.department || '—'}
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <User className="w-3.5 h-3.5 text-gray-400" />
                        {unit.lecturer || '—'}
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        {unit.semester || '—'}
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
                        onClick={() => handleEditUnit(unit)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleToggleStatus(unit)}
                        disabled={togglingId === unit.id}
                        className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg transition-colors disabled:opacity-50"
                        style={{
                          color:
                            unit.status === 'Active' ? '#d97706' : '#059669',
                          backgroundColor:
                            unit.status === 'Active' ? '#fffbeb' : '#ecfdf5',
                        }}
                      >
                        {togglingId === unit.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : unit.status === 'Active' ? (
                          <PowerOff className="w-3.5 h-3.5" />
                        ) : (
                          <Power className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <button
                        onClick={() => handleOpenDelete(unit)}
                        className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
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
        {!loading && units.length > 0 && (
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
              Active units automatically appear on the student side at{' '}
              <span className="font-semibold">/user/register-units</span>. Any
              changes here are reflected in real-time.
            </p>
          </div>
        )}
      </div>

      {/* MODALS */}
      <UnitFormModal
        open={formModalOpen}
        onClose={() => {
          setFormModalOpen(false);
          setEditingUnit(null);
        }}
        onSubmit={handleCreateOrUpdateUnit}
        editingUnit={editingUnit}
        loading={submitting}
        departmentOptions={departmentOptions}
        programOptions={programOptions}
        lecturerOptions={lecturerOptions}
      />

      <UnitDetailsModal
        open={detailsModalOpen}
        onClose={() => {
          setDetailsModalOpen(false);
          setDetailsUnit(null);
        }}
        unit={detailsUnit}
        loading={loadingDetails}
      />

      <DeleteModal
        open={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setUnitToDelete(null);
          setDeleteError('');
        }}
        onConfirm={handleDeleteUnit}
        unit={unitToDelete}
        loading={deleting}
        error={deleteError}
      />
    </div>
  );
};

export default Units;