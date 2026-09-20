// src/Admin/pages/UsersStaff.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Eye,
  Edit,
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
  Mail,
  Phone,
  User,
  Shield,
  ShieldCheck,
  Key,
  Lock,
  Unlock,
  GraduationCap,
  BookOpen,
  Building2,
  Briefcase,
  Calendar,
  Hash,
  Info,
  Save,
  UserCog,
  UserX,
  UserCheck,
  Send,
  Award,
  ClipboardList,
  FileText,
  BookMarked,
  Power,
  PowerOff,
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

const ROLES = ['Student', 'Lecturer', 'Staff', 'Administrator'];
const STATUSES = ['Active', 'Inactive', 'Suspended'];

const ROLE_CONFIG = {
  Student: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    icon: GraduationCap,
  },
  Lecturer: {
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-200',
    icon: BookOpen,
  },
  Staff: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    icon: Briefcase,
  },
  Administrator: {
    bg: 'bg-[#F5EFE6]',
    text: 'text-[#6B4423]',
    border: 'border-[#E0D3C0]',
    icon: ShieldCheck,
  },
};

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
  Suspended: {
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
    icon: Lock,
  },
};

const ITEMS_PER_PAGE = 10;

// ============================================================
// VALIDATION SCHEMA
// ============================================================

const kenyanPhoneRegex = /^(?:\+?254|0)?[17]\d{8}$/;

const userSchema = yup.object().shape({
  first_name: yup
    .string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name is too long'),
  middle_name: yup
    .string()
    .nullable()
    .max(50, 'Middle name is too long')
    .transform((v) => (v === '' ? null : v)),
  last_name: yup
    .string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name is too long'),
  email: yup
    .string()
    .required('Email is required')
    .email('Enter a valid email address'),
  phone: yup
    .string()
    .required('Phone number is required')
    .matches(kenyanPhoneRegex, 'Enter a valid phone number'),
  role: yup
    .string()
    .required('Role is required')
    .oneOf(ROLES, 'Select a valid role'),
  department: yup.string().required('Department is required'),
  status: yup
    .string()
    .required('Status is required')
    .oneOf(STATUSES, 'Select a valid status'),
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

const formatDateTime = (dateString) => {
  if (!dateString) return 'Never';
  try {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return 'Never';
  }
};

const getInitials = (first, last) => {
  const f = (first || '').charAt(0).toUpperCase();
  const l = (last || '').charAt(0).toUpperCase();
  return `${f}${l}` || 'U';
};

const getFullName = (user) => {
  if (!user) return 'Unknown';
  return [user.first_name, user.middle_name, user.last_name]
    .filter(Boolean)
    .join(' ');
};

// Role → permissions mapping (display only; backend is authority)
const ROLE_PERMISSIONS = {
  Student: [
    'View own profile',
    'Register for units',
    'View published results',
    'View registered units',
    'Submit applications',
    'Submit renovation requests',
  ],
  Lecturer: [
    'View assigned students',
    'Enter CAT and exam marks',
    'View course units',
    'Access teaching resources',
    'Manage attendance',
  ],
  Staff: [
    'Manage student records',
    'Process registrations',
    'Handle applications',
    'Generate reports',
    'View department data',
  ],
  Administrator: [
    'Full system access',
    'Manage users and roles',
    'Manage academic units',
    'Approve registrations',
    'Publish results',
    'Configure system settings',
    'Access all reports',
  ],
};

// ============================================================
// SUB-COMPONENTS
// ============================================================

const RoleBadge = ({ role }) => {
  const config = ROLE_CONFIG[role] || ROLE_CONFIG.Student;
  const Icon = config.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.bg} ${config.text} ${config.border}`}
    >
      <Icon className="w-3.5 h-3.5" />
      {role || 'Student'}
    </span>
  );
};

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
    blue: { bg: 'bg-blue-50', text: 'text-blue-600', bar: 'bg-blue-500' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-600', bar: 'bg-purple-500' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-600', bar: 'bg-amber-500' },
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', bar: 'bg-emerald-500' },
    gray: { bg: 'bg-gray-100', text: 'text-gray-600', bar: 'bg-gray-500' },
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
        <div className="h-4 bg-gray-200 rounded w-32" />
        <div className="h-4 bg-gray-200 rounded w-40" />
        <div className="h-4 bg-gray-200 rounded w-24" />
        <div className="h-4 bg-gray-200 rounded w-20" />
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
        <Users className="w-10 h-10" style={{ color: BRAND.primary }} />
      )}
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">
      {filtered ? 'No Matching Users' : 'No Users Yet'}
    </h3>
    <p className="text-sm text-gray-500 text-center max-w-md mb-6">
      {filtered
        ? 'No users match your current search or filter criteria. Try adjusting your filters.'
        : 'Start by adding the first student, lecturer, or staff member to the system.'}
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
        <UserPlus className="w-4 h-4" />
        Add First User
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
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        ) : (
          <input
            {...register(name)}
            type={type}
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
// USER FORM MODAL (Add/Edit)
// ============================================================

const UserFormModal = ({
  open,
  onClose,
  onSubmit,
  editingUser,
  loading,
  departmentOptions,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(userSchema),
    mode: 'onChange',
    defaultValues: {
      first_name: '',
      middle_name: '',
      last_name: '',
      email: '',
      phone: '',
      role: '',
      department: '',
      status: 'Active',
    },
  });

  useEffect(() => {
    if (open) {
      if (editingUser) {
        reset({
          first_name: editingUser.first_name || '',
          middle_name: editingUser.middle_name || '',
          last_name: editingUser.last_name || '',
          email: editingUser.email || '',
          phone: editingUser.phone || '',
          role: editingUser.role || '',
          department: editingUser.department || '',
          status: editingUser.status || 'Active',
        });
      } else {
        reset({
          first_name: '',
          middle_name: '',
          last_name: '',
          email: '',
          phone: '',
          role: '',
          department: '',
          status: 'Active',
        });
      }
    }
  }, [open, editingUser, reset]);

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
              {editingUser ? (
                <Edit className="w-5 h-5" style={{ color: BRAND.primary }} />
              ) : (
                <UserPlus className="w-5 h-5" style={{ color: BRAND.primary }} />
              )}
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                {editingUser ? 'Edit User' : 'Add New User'}
              </h2>
              <p className="text-xs text-gray-500">
                {editingUser
                  ? `Updating ${getFullName(editingUser)}`
                  : 'Create a new system account'}
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
            {/* Personal Info */}
            <div>
              <h4
                className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2"
                style={{ color: BRAND.accent }}
              >
                <User className="w-4 h-4" /> Personal Information
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  label="First Name"
                  name="first_name"
                  register={register}
                  errors={errors}
                  required
                  icon={User}
                  placeholder="e.g., John"
                />
                <FormField
                  label="Middle Name (Optional)"
                  name="middle_name"
                  register={register}
                  errors={errors}
                  icon={User}
                  placeholder="e.g., Kamau"
                />
                <FormField
                  label="Last Name"
                  name="last_name"
                  register={register}
                  errors={errors}
                  required
                  icon={User}
                  placeholder="e.g., Mwangi"
                />
                <FormField
                  label="Phone Number"
                  name="phone"
                  register={register}
                  errors={errors}
                  required
                  icon={Phone}
                  placeholder="e.g., 0712345678"
                />
              </div>
            </div>

            {/* Account Details */}
            <div>
              <h4
                className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2"
                style={{ color: BRAND.accent }}
              >
                <Shield className="w-4 h-4" /> Account Details
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <FormField
                    label="Email Address"
                    name="email"
                    register={register}
                    errors={errors}
                    type="email"
                    required
                    icon={Mail}
                    placeholder="user@skillnest.ac.ke"
                  />
                </div>
                <FormField
                  label="Role"
                  name="role"
                  register={register}
                  errors={errors}
                  required
                  options={ROLES}
                  icon={UserCog}
                />
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
                <FormField
                  label="Account Status"
                  name="status"
                  register={register}
                  errors={errors}
                  required
                  options={STATUSES}
                  icon={Power}
                />
              </div>
              {!editingUser && (
                <p className="mt-3 text-xs text-gray-500 flex items-start gap-1.5 p-3 rounded-lg bg-gray-50 border border-gray-200">
                  <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-gray-400" />
                  A temporary password will be generated by the system and sent
                  to the user's email address. You will not see or set the
                  password.
                </p>
              )}
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
                {editingUser ? 'Update User' : 'Create User'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// USER DETAILS MODAL
// ============================================================

const UserDetailModal = ({ open, onClose, user, loading }) => {
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

  const permissions = user ? ROLE_PERMISSIONS[user.role] || [] : [];

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
                User Details
              </h2>
              {user && (
                <p className="text-xs text-gray-500">
                  #{user.id || user.user_id}
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
          {loading || !user ? (
            <div className="flex items-center justify-center py-20">
              <Loader2
                className="w-8 h-8 animate-spin"
                style={{ color: BRAND.primary }}
              />
            </div>
          ) : (
            <div className="p-5 space-y-5">
              {/* Header */}
              <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: BRAND.primarySoft }}
                >
                  <span
                    className="text-xl font-bold"
                    style={{ color: BRAND.primary }}
                  >
                    {getInitials(user.first_name, user.last_name)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold text-gray-900">
                    {getFullName(user)}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <RoleBadge role={user.role} />
                    <StatusBadge status={user.status} />
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {renderField(Hash, 'User ID', user.id || user.user_id)}
                {renderField(Mail, 'Email', user.email)}
                {renderField(Phone, 'Phone', user.phone)}
                {renderField(Building2, 'Department', user.department)}
                {renderField(
                  Calendar,
                  'Account Created',
                  formatDate(user.created_at)
                )}
                {renderField(
                  Clock,
                  'Last Login',
                  formatDateTime(user.last_login)
                )}
              </div>

              {/* Permissions */}
              <div>
                <h4
                  className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2"
                  style={{ color: BRAND.accent }}
                >
                  <ShieldCheck className="w-4 h-4" /> Role Permissions
                </h4>
                <div
                  className="rounded-lg p-4 border"
                  style={{
                    backgroundColor: BRAND.primarySoft,
                    borderColor: BRAND.primaryBorder,
                  }}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {permissions.map((perm) => (
                      <div
                        key={perm}
                        className="flex items-center gap-2 text-xs"
                        style={{ color: BRAND.primaryDark }}
                      >
                        <CheckCircle
                          className="w-3.5 h-3.5 flex-shrink-0"
                          style={{ color: BRAND.primary }}
                        />
                        {perm}
                      </div>
                    ))}
                  </div>
                </div>
                <p className="mt-2 text-xs text-gray-500 flex items-center gap-1">
                  <Info className="w-3 h-3" />
                  Permissions are enforced by the backend and reflect the
                  user's assigned role.
                </p>
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
  icon: CustomIcon,
}) => {
  if (!open) return null;

  const colors = {
    primary: { bg: BRAND.primary, hover: BRAND.primaryDark, icon: CheckCircle },
    danger: { bg: '#dc2626', hover: '#b91c1c', icon: UserX },
    warning: { bg: '#ea580c', hover: '#c2410c', icon: Lock },
  };
  const c = colors[variant] || colors.primary;
  const Icon = CustomIcon || c.icon;

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

const UsersStaff = () => {
  // State
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    students: 0,
    lecturers: 0,
    staff: 0,
    administrators: 0,
    active: 0,
    inactive: 0,
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    role: '',
    department: '',
    status: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  // Modals
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [statusAction, setStatusAction] = useState(null); // 'activate' | 'deactivate'
  const [actionUser, setActionUser] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [resetUser, setResetUser] = useState(null);
  const [resetLoading, setResetLoading] = useState(false);

  // ============================================================
  // API
  // ============================================================

  const fetchUsers = useCallback(
    async (showRefresh = false) => {
      if (showRefresh) setRefreshing(true);
      else setLoading(true);

      try {
        const params = {};
        if (filters.role) params.role = filters.role;
        if (filters.department) params.department = filters.department;
        if (filters.status) params.status = filters.status;

        const response = await api.get('/api/admin/users', { params });

        if (response.data.success) {
          const list = response.data.users || [];
          setUsers(list);

          const s = response.data.stats || {};
          setStats({
            total: s.total ?? list.length,
            students:
              s.students ?? list.filter((u) => u.role === 'Student').length,
            lecturers:
              s.lecturers ?? list.filter((u) => u.role === 'Lecturer').length,
            staff:
              s.staff ??
              list.filter((u) => u.role === 'Staff').length,
            administrators:
              s.administrators ??
              list.filter((u) => u.role === 'Administrator').length,
            active:
              s.active ?? list.filter((u) => u.status === 'Active').length,
            inactive:
              s.inactive ?? list.filter((u) => u.status !== 'Active').length,
          });

          if (showRefresh) toast.success('Users refreshed successfully');
        } else {
          toast.error(response.data.message || 'Users could not be loaded.');
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error(
          error.response?.data?.message ||
            'Users could not be loaded. Please try again.'
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [filters]
  );

  const fetchUserDetails = async (id) => {
    setLoadingDetail(true);
    try {
      const response = await api.get(`/api/admin/users/${id}`);
      if (response.data.success) return response.data.user;
      throw new Error(response.data.message || 'Failed to load user');
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'User details could not be loaded.'
      );
      return null;
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleCreateOrUpdate = async (data) => {
    setSubmitting(true);
    try {
      const isEdit = Boolean(editingUser);
      const url = isEdit
        ? `/api/admin/users/${editingUser.id || editingUser.user_id}`
        : '/api/admin/users';

      const response = isEdit
        ? await api.patch(url, data)
        : await api.post(url, data);

      if (response.data.success) {
        toast.success(
          isEdit ? 'User updated successfully.' : 'User created successfully.'
        );
        setFormModalOpen(false);
        setEditingUser(null);
        fetchUsers(true);
      } else {
        toast.error(
          response.data.message ||
            (isEdit ? 'Unable to update user.' : 'Unable to create user.')
        );
      }
    } catch (error) {
      console.error('Save error:', error);
      toast.error(
        error.response?.data?.message ||
          (editingUser ? 'Unable to update user.' : 'Unable to create user.')
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleView = async (user) => {
    setSelectedUser(user);
    setDetailOpen(true);
    const full = await fetchUserDetails(user.id || user.user_id);
    if (full) setSelectedUser(full);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormModalOpen(true);
  };

  const handleOpenStatusModal = (user, action) => {
    setActionUser(user);
    setStatusAction(action);
    setStatusModalOpen(true);
  };

  const handleConfirmStatusChange = async () => {
    if (!actionUser || !statusAction) return;
    setActionLoading(true);
    try {
      const endpoint =
        statusAction === 'activate' ? 'activate' : 'deactivate';
      const response = await api.patch(
        `/api/admin/users/${actionUser.id || actionUser.user_id}/${endpoint}`
      );
      if (response.data.success) {
        toast.success(
          statusAction === 'activate'
            ? 'User activated successfully.'
            : 'User deactivated successfully.'
        );
        setStatusModalOpen(false);
        setActionUser(null);
        setStatusAction(null);
        fetchUsers(true);
      } else {
        toast.error(
          response.data.message ||
            (statusAction === 'activate'
              ? 'Unable to activate user.'
              : 'Unable to deactivate user.')
        );
      }
    } catch (error) {
      console.error('Status change error:', error);
      toast.error(
        error.response?.data?.message ||
          (statusAction === 'activate'
            ? 'Unable to activate user.'
            : 'Unable to deactivate user.')
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleOpenResetModal = (user) => {
    setResetUser(user);
    setResetModalOpen(true);
  };

  const handleConfirmReset = async () => {
    if (!resetUser) return;
    setResetLoading(true);
    try {
      const response = await api.post(
        `/api/admin/users/${resetUser.id || resetUser.user_id}/password-reset`
      );
      if (response.data.success) {
        toast.success(
          'Password reset link has been sent to the user\'s email.'
        );
        setResetModalOpen(false);
        setResetUser(null);
      } else {
        toast.error(
          response.data.message || 'Unable to initiate password reset.'
        );
      }
    } catch (error) {
      console.error('Password reset error:', error);
      toast.error(
        error.response?.data?.message ||
          'Unable to initiate password reset.'
      );
    } finally {
      setResetLoading(false);
    }
  };

  // ============================================================
  // FILTERING
  // ============================================================

  const filteredUsers = useMemo(() => {
    let list = [...users];
    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      list = list.filter((u) => {
        const fullName = getFullName(u).toLowerCase();
        return (
          String(u.id || u.user_id || '').toLowerCase().includes(s) ||
          fullName.includes(s) ||
          String(u.email || '').toLowerCase().includes(s) ||
          String(u.phone || '').toLowerCase().includes(s)
        );
      });
    }
    if (filters.role) list = list.filter((u) => u.role === filters.role);
    if (filters.department)
      list = list.filter((u) => u.department === filters.department);
    if (filters.status) list = list.filter((u) => u.status === filters.status);
    return list;
  }, [users, searchTerm, filters]);

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const paginated = filteredUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const hasActiveFilters = Boolean(
    searchTerm || filters.role || filters.department || filters.status
  );

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilters({ role: '', department: '', status: '' });
  };

  // ============================================================
  // EFFECTS
  // ============================================================

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const departmentOptions = useMemo(
    () => [...new Set(users.map((u) => u.department).filter(Boolean))],
    [users]
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
                  <Users
                    className="w-6 h-6"
                    style={{ color: BRAND.primary }}
                  />
                </div>
                Users & Staff
              </h1>
              <p className="text-sm text-gray-500 mt-1 ml-11">
                Manage system accounts, roles and permissions.
              </p>
            </div>

            <div className="flex items-center gap-2 ml-11 sm:ml-0">
              <button
                onClick={() => fetchUsers(true)}
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
                  setEditingUser(null);
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
                <UserPlus className="w-4 h-4" />
                <span className="hidden sm:inline">Add User</span>
                <span className="sm:hidden">Add</span>
              </button>
            </div>
          </div>
        </div>

        {/* ============================================================
            STATISTICS CARDS
            ============================================================ */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
          <StatCard
            icon={Users}
            label="Total Users"
            value={stats.total}
            accent="brown"
            active={!filters.role && !filters.status}
            onClick={() =>
              setFilters((f) => ({ ...f, role: '', status: '' }))
            }
          />
          <StatCard
            icon={GraduationCap}
            label="Students"
            value={stats.students}
            accent="blue"
            active={filters.role === 'Student'}
            onClick={() =>
              setFilters((f) => ({
                ...f,
                role: f.role === 'Student' ? '' : 'Student',
              }))
            }
          />
          <StatCard
            icon={BookOpen}
            label="Lecturers"
            value={stats.lecturers}
            accent="purple"
            active={filters.role === 'Lecturer'}
            onClick={() =>
              setFilters((f) => ({
                ...f,
                role: f.role === 'Lecturer' ? '' : 'Lecturer',
              }))
            }
          />
          <StatCard
            icon={Briefcase}
            label="Staff"
            value={stats.staff}
            accent="amber"
            active={filters.role === 'Staff'}
            onClick={() =>
              setFilters((f) => ({
                ...f,
                role: f.role === 'Staff' ? '' : 'Staff',
              }))
            }
          />
          <StatCard
            icon={ShieldCheck}
            label="Administrators"
            value={stats.administrators}
            accent="tan"
            active={filters.role === 'Administrator'}
            onClick={() =>
              setFilters((f) => ({
                ...f,
                role: f.role === 'Administrator' ? '' : 'Administrator',
              }))
            }
          />
          <StatCard
            icon={CheckCircle}
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
            icon={XCircle}
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
                placeholder="Search by name, email, user ID, or phone..."
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
                    [filters.role, filters.department, filters.status].filter(
                      Boolean
                    ).length
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
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { key: 'role', label: 'Role', options: ROLES },
                  {
                    key: 'department',
                    label: 'Department',
                    options: departmentOptions,
                  },
                  { key: 'status', label: 'Account Status', options: STATUSES },
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
            USERS TABLE
            ============================================================ */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {loading ? (
            <TableSkeleton />
          ) : filteredUsers.length === 0 ? (
            <EmptyState
              filtered={users.length > 0}
              onAdd={() => {
                setEditingUser(null);
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
                        'User ID',
                        'Full Name',
                        'Email',
                        'Phone',
                        'Role',
                        'Department',
                        'Status',
                        'Last Login',
                        'Created',
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
                    {paginated.map((user) => (
                      <tr
                        key={user.id || user.user_id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-3.5">
                          <span
                            className="text-xs font-semibold"
                            style={{ color: BRAND.primary }}
                          >
                            #{user.id || user.user_id}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div
                              className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                              style={{ backgroundColor: BRAND.primarySoft }}
                            >
                              <span
                                className="text-xs font-bold"
                                style={{ color: BRAND.primary }}
                              >
                                {getInitials(
                                  user.first_name,
                                  user.last_name
                                )}
                              </span>
                            </div>
                            <div className="min-w-0">
                              <span className="text-sm font-medium text-gray-900 block max-w-[180px] truncate">
                                {getFullName(user)}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="text-sm text-gray-600 block max-w-[200px] truncate">
                            {user.email || '—'}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="text-sm text-gray-600 whitespace-nowrap">
                            {user.phone || '—'}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <RoleBadge role={user.role} />
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="text-sm text-gray-600 block max-w-[150px] truncate">
                            {user.department || '—'}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <StatusBadge status={user.status} />
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="text-xs text-gray-600 whitespace-nowrap">
                            {formatDateTime(user.last_login)}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="text-xs text-gray-600 whitespace-nowrap">
                            {formatDate(user.created_at)}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => handleView(user)}
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
                              onClick={() => handleEdit(user)}
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
                            {user.status === 'Active' ? (
                              <button
                                onClick={() =>
                                  handleOpenStatusModal(user, 'deactivate')
                                }
                                className="p-1.5 text-gray-500 rounded-lg transition-colors"
                                title="Deactivate"
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
                                <PowerOff className="w-4 h-4" />
                              </button>
                            ) : (
                              <button
                                onClick={() =>
                                  handleOpenStatusModal(user, 'activate')
                                }
                                className="p-1.5 text-gray-500 rounded-lg transition-colors"
                                title="Activate"
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
                                <Power className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => handleOpenResetModal(user)}
                              className="p-1.5 text-gray-500 rounded-lg transition-colors"
                              title="Reset Password"
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
                              <Key className="w-4 h-4" />
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
                {paginated.map((user) => (
                  <div
                    key={user.id || user.user_id}
                    className="p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div
                        className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: BRAND.primarySoft }}
                      >
                        <span
                          className="text-sm font-bold"
                          style={{ color: BRAND.primary }}
                        >
                          {getInitials(user.first_name, user.last_name)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="text-sm font-semibold text-gray-900 truncate">
                            {getFullName(user)}
                          </h3>
                          <RoleBadge role={user.role} />
                        </div>
                        <p className="text-xs text-gray-500 truncate">
                          {user.email}
                        </p>
                        <div className="mt-1">
                          <StatusBadge status={user.status} />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <Hash className="w-3.5 h-3.5 text-gray-400" />
                        #{user.id || user.user_id}
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <Phone className="w-3.5 h-3.5 text-gray-400" />
                        {user.phone || '—'}
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <Building2 className="w-3.5 h-3.5 text-gray-400" />
                        {user.department || '—'}
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        {formatDateTime(user.last_login)}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-3 border-t border-gray-100 flex-wrap">
                      <button
                        onClick={() => handleView(user)}
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
                        onClick={() => handleEdit(user)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        Edit
                      </button>
                      {user.status === 'Active' ? (
                        <button
                          onClick={() =>
                            handleOpenStatusModal(user, 'deactivate')
                          }
                          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                        >
                          <PowerOff className="w-3.5 h-3.5" />
                          Off
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            handleOpenStatusModal(user, 'activate')
                          }
                          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-emerald-700 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors"
                        >
                          <Power className="w-3.5 h-3.5" />
                          On
                        </button>
                      )}
                      <button
                        onClick={() => handleOpenResetModal(user)}
                        className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-orange-700 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
                        title="Reset Password"
                      >
                        <Key className="w-3.5 h-3.5" />
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
                        filteredUsers.length
                      )}
                    </span>{' '}
                    of <span className="font-semibold">{filteredUsers.length}</span> users
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
        {!loading && users.length > 0 && (
          <div
            className="mt-4 flex items-start gap-2 p-3 rounded-lg border"
            style={{
              backgroundColor: BRAND.primarySoft,
              borderColor: BRAND.primaryBorder,
            }}
          >
            <Shield
              className="w-4 h-4 flex-shrink-0 mt-0.5"
              style={{ color: BRAND.primary }}
            />
            <p className="text-xs" style={{ color: BRAND.primaryDark }}>
              Passwords and authentication secrets are never displayed or
              handled by this interface. Password resets initiate a secure
              email-based flow managed by the backend.
            </p>
          </div>
        )}
      </div>

      {/* ============================================================
          MODALS
          ============================================================ */}
      <UserFormModal
        open={formModalOpen}
        onClose={() => {
          setFormModalOpen(false);
          setEditingUser(null);
        }}
        onSubmit={handleCreateOrUpdate}
        editingUser={editingUser}
        loading={submitting}
        departmentOptions={departmentOptions}
      />

      <UserDetailModal
        open={detailOpen}
        onClose={() => {
          setDetailOpen(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
        loading={loadingDetail}
      />

      <ConfirmModal
        open={statusModalOpen}
        onClose={() => {
          setStatusModalOpen(false);
          setActionUser(null);
          setStatusAction(null);
        }}
        onConfirm={handleConfirmStatusChange}
        title={
          statusAction === 'activate'
            ? 'Activate User?'
            : 'Deactivate User?'
        }
        message={
          statusAction === 'activate'
            ? `Activating ${getFullName(
                actionUser
              )} will restore their access to the system. They will be able to log in immediately.`
            : `Deactivating ${getFullName(
                actionUser
              )} will immediately prevent them from logging in. Existing sessions may be terminated.`
        }
        confirmText={
          statusAction === 'activate' ? 'Activate User' : 'Deactivate User'
        }
        loading={actionLoading}
        variant={statusAction === 'activate' ? 'primary' : 'danger'}
        icon={statusAction === 'activate' ? Power : PowerOff}
      />

      <ConfirmModal
        open={resetModalOpen}
        onClose={() => {
          setResetModalOpen(false);
          setResetUser(null);
        }}
        onConfirm={handleConfirmReset}
        title="Reset User Password?"
        message={`A secure password reset link will be sent to ${
          resetUser?.email || 'the user\'s email address'
        }. The user will be required to set a new password themselves. You will not see or set the password.`}
        confirmText="Send Reset Link"
        loading={resetLoading}
        variant="warning"
        icon={Key}
      />
    </div>
  );
};

export default UsersStaff;