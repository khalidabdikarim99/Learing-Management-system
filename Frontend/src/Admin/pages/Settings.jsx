// src/Admin/pages/Settings.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Settings as SettingsIcon,
  Building2,
  Calendar,
  GraduationCap,
  BookOpen,
  Layers,
  Megaphone,
  Shield,
  User,
  Mail,
  Phone,
  Globe,
  MapPin,
  Save,
  Edit,
  Plus,
  X,
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Info,
  ChevronDown,
  RefreshCw,
  Lock,
  FileText,
  Send,
  Archive,
  Power,
  Hash,
  Award,
  CalendarDays,
  AlertTriangle,
  Bell,
  BookMarked,
  Eye,
  EyeOff,
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
// HELPERS — CURRENT ADMIN
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

function getAuthStorage() {
  return localStorage.getItem('adminUser') ? localStorage : sessionStorage;
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
  accentLight: '#C9A87C',
  dark: '#3E2C1C',
};

// ============================================================
// CONSTANTS
// ============================================================

const ACADEMIC_YEAR_STATUSES = ['Upcoming', 'Active', 'Closed'];
const SEMESTER_STATUSES = ['Upcoming', 'Active', 'Closed'];
const GENERAL_STATUSES = ['Active', 'Inactive'];
const STUDY_LEVELS = [
  'Certificate',
  'Diploma',
  'Undergraduate',
  'Postgraduate',
  'Masters',
  'PhD',
];
const ANNOUNCEMENT_PRIORITIES = ['Low', 'Normal', 'High', 'Urgent'];

// ============================================================
// VALIDATION
// ============================================================

const adminProfileSchema = yup.object().shape({
  first_name: yup.string().required('First name is required'),
  last_name: yup.string().required('Last name is required'),
  email: yup.string().required('Email is required').email('Invalid email'),
  phone: yup.string().required('Phone is required'),
});

const passwordSchema = yup.object().shape({
  current_password: yup.string().required('Current password is required'),
  new_password: yup
    .string()
    .required('New password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Must contain at least one lowercase letter')
    .matches(/[0-9]/, 'Must contain at least one number'),
  confirm_password: yup
    .string()
    .required('Please confirm your new password')
    .oneOf([yup.ref('new_password'), null], 'Passwords do not match'),
});

const universitySchema = yup.object().shape({
  university_name: yup.string().required('University name is required'),
  university_code: yup.string().required('University code is required'),
  faculty: yup.string().nullable(),
  contact_email: yup
    .string()
    .required('Email is required')
    .email('Invalid email'),
  contact_phone: yup.string().required('Phone is required'),
  website: yup.string().nullable(),
  address: yup.string().required('Address is required'),
  city: yup.string().required('City is required'),
  country: yup.string().required('Country is required'),
});

const academicYearSchema = yup.object().shape({
  name: yup.string().required('Academic year is required'),
  start_date: yup.string().required('Start date is required'),
  end_date: yup.string().required('End date is required'),
  status: yup
    .string()
    .required('Status is required')
    .oneOf(ACADEMIC_YEAR_STATUSES),
});

const semesterSchema = yup.object().shape({
  name: yup.string().required('Semester name is required'),
  academic_year: yup.string().required('Academic year is required'),
  start_date: yup.string().required('Start date is required'),
  end_date: yup.string().required('End date is required'),
  registration_start: yup.string().required('Registration start is required'),
  registration_end: yup.string().required('Registration end is required'),
  status: yup.string().required('Status is required').oneOf(SEMESTER_STATUSES),
});

const departmentSchema = yup.object().shape({
  name: yup.string().required('Department name is required'),
  code: yup.string().required('Department code is required'),
  faculty: yup.string().required('Faculty is required'),
  status: yup.string().required('Status is required').oneOf(GENERAL_STATUSES),
});

const programSchema = yup.object().shape({
  name: yup.string().required('Program name is required'),
  code: yup.string().required('Program code is required'),
  department: yup.string().required('Department is required'),
  faculty: yup.string().required('Faculty is required'),
  study_level: yup
    .string()
    .required('Study level is required')
    .oneOf(STUDY_LEVELS),
  duration: yup.string().required('Duration is required'),
  status: yup.string().required('Status is required').oneOf(GENERAL_STATUSES),
});

const announcementSchema = yup.object().shape({
  title: yup.string().required('Title is required').max(200, 'Title too long'),
  content: yup.string().required('Content is required'),
  priority: yup
    .string()
    .required('Priority is required')
    .oneOf(ANNOUNCEMENT_PRIORITIES),
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

const SectionCard = ({
  icon: Icon,
  title,
  subtitle,
  children,
  action,
  collapsible = false,
  defaultOpen = true,
}) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
      <div
        className={`px-5 py-3 border-b border-gray-200 flex items-center justify-between ${
          collapsible ? 'cursor-pointer hover:bg-opacity-80' : ''
        }`}
        style={{ backgroundColor: BRAND.primarySoft }}
        onClick={collapsible ? () => setOpen((v) => !v) : undefined}
      >
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4" style={{ color: BRAND.primary }} />
          <h3
            className="text-sm font-semibold uppercase tracking-wider"
            style={{ color: BRAND.primaryDark }}
          >
            {title}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          {action}
          {collapsible && (
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                open ? 'rotate-180' : ''
              }`}
              style={{ color: BRAND.primary }}
            />
          )}
        </div>
      </div>
      {open && (
        <div className="p-5">
          {subtitle && <p className="text-xs text-gray-500 mb-4">{subtitle}</p>}
          {children}
        </div>
      )}
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const config =
    {
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
      Upcoming: {
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        border: 'border-blue-200',
        icon: Clock,
      },
      Closed: {
        bg: 'bg-red-50',
        text: 'text-red-700',
        border: 'border-red-200',
        icon: XCircle,
      },
      Draft: {
        bg: 'bg-gray-50',
        text: 'text-gray-700',
        border: 'border-gray-200',
        icon: FileText,
      },
      Published: {
        bg: 'bg-emerald-50',
        text: 'text-emerald-700',
        border: 'border-emerald-200',
        icon: CheckCircle,
      },
      Archived: {
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        border: 'border-amber-200',
        icon: Archive,
      },
    }[status] || {
      bg: 'bg-gray-100',
      text: 'text-gray-700',
      border: 'border-gray-200',
      icon: Info,
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
  textarea = false,
  rows = 3,
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
        {Icon && !textarea && (
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
        ) : textarea ? (
          <textarea
            {...register(name)}
            placeholder={placeholder}
            rows={rows}
            className={`${inputClasses} resize-none`}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        ) : (
          <input
            {...register(name)}
            type={type}
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

const PasswordField = ({
  label,
  name,
  register,
  errors,
  show,
  onToggle,
  placeholder,
}) => {
  const error = errors[name];
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1.5">
        {label} <span className="text-red-500">*</span>
      </label>
      <div className="relative">
        <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          {...register(name)}
          type={show ? 'text' : 'password'}
          placeholder={placeholder}
          className={`w-full pl-10 pr-12 py-2.5 text-sm border rounded-lg outline-none transition-all ${
            error ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
          }`}
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
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

const Toggle = ({ checked, onChange, label, description, icon: Icon }) => (
  <div className="flex items-start justify-between gap-4 py-3 border-b border-gray-100 last:border-b-0">
    <div className="flex items-start gap-3 flex-1">
      {Icon && (
        <div
          className="p-2 rounded-lg flex-shrink-0"
          style={{ backgroundColor: BRAND.primarySoft }}
        >
          <Icon className="w-4 h-4" style={{ color: BRAND.primary }} />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">{label}</p>
        {description && (
          <p className="text-xs text-gray-500 mt-0.5">{description}</p>
        )}
      </div>
    </div>
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="relative inline-flex items-center h-6 w-11 rounded-full transition-colors flex-shrink-0 cursor-pointer"
      style={{ backgroundColor: checked ? BRAND.primary : '#d1d5db' }}
      role="switch"
      aria-checked={checked}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  </div>
);

const CrudModal = ({
  open,
  onClose,
  title,
  onSubmit,
  loading,
  children,
  submitText = 'Save',
}) => {
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
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={loading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={onSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6">{children}</div>
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
            onClick={onSubmit}
            disabled={loading}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white rounded-lg transition-colors shadow-sm disabled:opacity-60"
            style={{ backgroundColor: BRAND.primary }}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" /> {submitText}
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

const Settings = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Admin record (from /adminCredentials)
  const [adminId, setAdminId] = useState(null);
  const [profile, setProfile] = useState(null);
  const [editingProfile, setEditingProfile] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  // Password change
  const [changingPassword, setChangingPassword] = useState(false);
  const [showCurrentPwd, setShowCurrentPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);

  // University + settings document (from /settings)
  const [settingsId, setSettingsId] = useState(null);
  const [university, setUniversity] = useState(null);
  const [editingUniversity, setEditingUniversity] = useState(false);
  const [savingUniversity, setSavingUniversity] = useState(false);

  // Academic Years
  const [academicYears, setAcademicYears] = useState([]);
  const [ayModalOpen, setAyModalOpen] = useState(false);
  const [editingAY, setEditingAY] = useState(null);
  const [savingAY, setSavingAY] = useState(false);

  // Semesters
  const [semesters, setSemesters] = useState([]);
  const [semModalOpen, setSemModalOpen] = useState(false);
  const [editingSem, setEditingSem] = useState(null);
  const [savingSem, setSavingSem] = useState(false);

  // Departments
  const [departments, setDepartments] = useState([]);
  const [deptModalOpen, setDeptModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [savingDept, setSavingDept] = useState(false);

  // Programs
  const [programs, setPrograms] = useState([]);
  const [progModalOpen, setProgModalOpen] = useState(false);
  const [editingProg, setEditingProg] = useState(null);
  const [savingProg, setSavingProg] = useState(false);

  // Registration settings
  const [registrationSettings, setRegistrationSettings] = useState({
    registration_open: true,
    max_credit_hours: 24,
    min_credit_hours: 12,
    registration_deadline: '',
    allow_unit_dropping: true,
    unit_drop_deadline: '',
  });
  const [savingReg, setSavingReg] = useState(false);

  // Result settings
  const [resultSettings, setResultSettings] = useState({
    result_publication_auto: false,
    require_approval: true,
    result_visibility: 'Published Only',
  });
  const [savingResults, setSavingResults] = useState(false);

  // Announcements
  const [announcements, setAnnouncements] = useState([]);
  const [annModalOpen, setAnnModalOpen] = useState(false);
  const [editingAnn, setEditingAnn] = useState(null);
  const [savingAnn, setSavingAnn] = useState(false);

  // Forms
  const profileForm = useForm({
    resolver: yupResolver(adminProfileSchema),
    mode: 'onChange',
  });
  const passwordForm = useForm({
    resolver: yupResolver(passwordSchema),
    mode: 'onChange',
    defaultValues: {
      current_password: '',
      new_password: '',
      confirm_password: '',
    },
  });
  const universityForm = useForm({
    resolver: yupResolver(universitySchema),
    mode: 'onChange',
  });
  const ayForm = useForm({
    resolver: yupResolver(academicYearSchema),
    mode: 'onChange',
  });
  const semForm = useForm({
    resolver: yupResolver(semesterSchema),
    mode: 'onChange',
  });
  const deptForm = useForm({
    resolver: yupResolver(departmentSchema),
    mode: 'onChange',
  });
  const progForm = useForm({
    resolver: yupResolver(programSchema),
    mode: 'onChange',
  });
  const annForm = useForm({
    resolver: yupResolver(announcementSchema),
    mode: 'onChange',
  });

  // Derived options
  const academicYearOptions = useMemo(
    () => academicYears.map((ay) => ay.name),
    [academicYears]
  );
  const departmentOptions = useMemo(
    () => departments.map((d) => d.name),
    [departments]
  );
  const facultyOptions = useMemo(
    () => [
      ...new Set(
        [
          ...departments.map((d) => d.faculty),
          ...programs.map((p) => p.faculty),
        ].filter(Boolean)
      ),
    ],
    [departments, programs]
  );

  // ============================================================
  // FETCH EVERYTHING
  // ============================================================

  const fetchAllSettings = useCallback(
    async (showRefresh = false) => {
      if (showRefresh) setRefreshing(true);
      else setLoading(true);

      try {
        const currentAdmin = getCurrentAdmin();
        if (!currentAdmin) {
          toast.error('Admin session expired. Please log in again.');
          setTimeout(() => {
            window.location.href = '/adminlogin';
          }, 800);
          setLoading(false);
          setRefreshing(false);
          return;
        }

        const adminKey = currentAdmin.id;

        // 1) Fetch admin record, settings document, and related collections
        const [
          adminRes,
          settingsRes,
          ayRes,
          semRes,
          deptRes,
          progRes,
          annRes,
        ] = await Promise.allSettled([
          api.get(`/adminCredentials/${adminKey}`),
          api.get('/settings'),
          api.get('/academicYears'),
          api.get('/semesters'),
          api.get('/departments'),
          api.get('/programs'),
          api.get('/announcements'),
        ]);

        // --- Admin record ---
        if (adminRes.status === 'fulfilled' && adminRes.value.data) {
          const a = adminRes.value.data;
          setAdminId(a.id);
          setProfile(a);
          profileForm.reset({
            first_name: a.first_name || '',
            last_name: a.last_name || '',
            email: a.email || '',
            phone: a.phone || '',
          });
        }

        // --- Settings document (university + registration + results) ---
        if (settingsRes.status === 'fulfilled') {
          const allSettings = Array.isArray(settingsRes.value.data)
            ? settingsRes.value.data
            : [];
          const doc =
            allSettings.find((s) => String(s.adminId) === String(adminKey)) ||
            allSettings[0] ||
            null;

          if (doc) {
            setSettingsId(doc.id);

            if (doc.university) {
              setUniversity(doc.university);
              universityForm.reset({
                university_name: doc.university.university_name || '',
                university_code: doc.university.university_code || '',
                faculty: doc.university.faculty || '',
                contact_email: doc.university.contact_email || '',
                contact_phone: doc.university.contact_phone || '',
                website: doc.university.website || '',
                address: doc.university.address || '',
                city: doc.university.city || '',
                country: doc.university.country || '',
              });
            }

            if (doc.registration) {
              setRegistrationSettings((prev) => ({
                ...prev,
                ...doc.registration,
              }));
            }

            if (doc.results) {
              setResultSettings((prev) => ({
                ...prev,
                ...doc.results,
              }));
            }
          }
        }

        // --- Collections ---
        const safeArr = (res) =>
          res.status === 'fulfilled' && Array.isArray(res.value.data)
            ? res.value.data
            : [];

        setAcademicYears(safeArr(ayRes));
        setSemesters(safeArr(semRes));
        setDepartments(safeArr(deptRes));
        setPrograms(safeArr(progRes));
        setAnnouncements(safeArr(annRes));

        if (showRefresh) toast.success('Settings refreshed successfully');
      } catch (error) {
        console.error('Error fetching settings:', error);
        if (!error.response) {
          toast.error(
            'Cannot reach JSON Server. Make sure it is running on port 5000.'
          );
        } else {
          toast.error('Some settings could not be loaded.');
        }
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [profileForm, universityForm]
  );

  useEffect(() => {
    fetchAllSettings();
  }, [fetchAllSettings]);

  // ============================================================
  // HANDLERS — Profile
  // ============================================================

  const handleSaveProfile = async (data) => {
    if (!adminId) {
      toast.error('Admin record not found.');
      return;
    }
    setSavingProfile(true);
    try {
      const payload = {
        first_name: data.first_name.trim(),
        last_name: data.last_name.trim(),
        email: data.email.trim().toLowerCase(),
        phone: data.phone.trim(),
        updatedAt: new Date().toISOString(),
      };

      await api.patch(`/adminCredentials/${adminId}`, payload);

      const updated = { ...profile, ...payload };
      setProfile(updated);
      setEditingProfile(false);

      // Sync localStorage so the sidebar/header reflects the change
      const storage = getAuthStorage();
      try {
        const cached = JSON.parse(storage.getItem('adminUser') || '{}');
        storage.setItem(
          'adminUser',
          JSON.stringify({ ...cached, ...payload })
        );
      } catch {
        /* ignore */
      }

      toast.success('Profile updated successfully.');
    } catch (error) {
      console.error('Save profile error:', error);
      toast.error('Unable to update profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  // ============================================================
  // HANDLERS — Password
  // ============================================================

  const handleChangePassword = async (data) => {
    if (!adminId) {
      toast.error('Admin record not found.');
      return;
    }
    setChangingPassword(true);
    try {
      // 1) Read the latest admin record
      const res = await api.get(`/adminCredentials/${adminId}`);
      const current = res.data;

      // 2) Verify current password
      if (!current || current.password !== data.current_password) {
        toast.error('Current password is incorrect.');
        setChangingPassword(false);
        return;
      }

      // 3) Reject reusing the same password
      if (data.current_password === data.new_password) {
        toast.error('New password must be different from the current one.');
        setChangingPassword(false);
        return;
      }

      // 4) Persist the new password
      const updates = {
        password: data.new_password,
        passwordUpdatedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      try {
        await api.patch(`/adminCredentials/${adminId}`, updates);
      } catch (patchErr) {
        if (patchErr.response?.status === 404) throw patchErr;
        // PUT fallback
        await api.put(`/adminCredentials/${adminId}`, {
          ...current,
          ...updates,
        });
      }

      // 5) Sync cached session
      const storage = getAuthStorage();
      try {
        const cached = JSON.parse(storage.getItem('adminUser') || '{}');
        storage.setItem(
          'adminUser',
          JSON.stringify({ ...cached, ...updates })
        );
      } catch {
        /* ignore */
      }

      toast.success('Password changed successfully.');
      passwordForm.reset();
      setShowCurrentPwd(false);
      setShowNewPwd(false);
      setShowConfirmPwd(false);
    } catch (error) {
      console.error('Change password error:', error);
      if (!error.response) {
        toast.error('Cannot reach JSON Server.');
      } else {
        toast.error('Unable to change password. Please try again.');
      }
    } finally {
      setChangingPassword(false);
    }
  };

  // ============================================================
  // HANDLERS — University + Settings
  // ============================================================

  const upsertSettingsDoc = async (partial) => {
    const currentAdmin = getCurrentAdmin();
    const now = new Date().toISOString();

    if (settingsId) {
      await api.patch(`/settings/${settingsId}`, {
        ...partial,
        updatedAt: now,
      });
    } else {
      const created = await api.post('/settings', {
        adminId: currentAdmin?.id || 'admin-1',
        ...partial,
        createdAt: now,
        updatedAt: now,
      });
      if (created.data?.id) setSettingsId(created.data.id);
    }
  };

  const handleSaveUniversity = async (data) => {
    setSavingUniversity(true);
    try {
      await upsertSettingsDoc({ university: data });
      setUniversity(data);
      setEditingUniversity(false);
      toast.success('University information updated successfully.');
    } catch (error) {
      console.error('Save university error:', error);
      toast.error('Unable to update university information.');
    } finally {
      setSavingUniversity(false);
    }
  };

  // ============================================================
  // HANDLERS — Academic Years
  // ============================================================

  const handleOpenAYModal = (ay = null) => {
    setEditingAY(ay);
    if (ay) {
      ayForm.reset({
        name: ay.name || '',
        start_date: ay.start_date || '',
        end_date: ay.end_date || '',
        status: ay.status || 'Upcoming',
      });
    } else {
      ayForm.reset({
        name: '',
        start_date: '',
        end_date: '',
        status: 'Upcoming',
      });
    }
    setAyModalOpen(true);
  };

  const handleSaveAY = async (data) => {
    setSavingAY(true);
    try {
      const now = new Date().toISOString();
      if (editingAY) {
        await api.patch(`/academicYears/${editingAY.id}`, {
          ...data,
          updatedAt: now,
        });
        toast.success('Academic year updated successfully.');
      } else {
        await api.post('/academicYears', {
          ...data,
          createdAt: now,
          updatedAt: now,
        });
        toast.success('Academic year created successfully.');
      }
      setAyModalOpen(false);
      setEditingAY(null);
      await fetchAllSettings(true);
    } catch (error) {
      console.error('Save AY error:', error);
      toast.error('Unable to save academic year.');
    } finally {
      setSavingAY(false);
    }
  };

  // ============================================================
  // HANDLERS — Semesters
  // ============================================================

  const handleOpenSemModal = (sem = null) => {
    setEditingSem(sem);
    if (sem) {
      semForm.reset({
        name: sem.name || '',
        academic_year: sem.academic_year || '',
        start_date: sem.start_date || '',
        end_date: sem.end_date || '',
        registration_start: sem.registration_start || '',
        registration_end: sem.registration_end || '',
        status: sem.status || 'Upcoming',
      });
    } else {
      semForm.reset({
        name: '',
        academic_year: '',
        start_date: '',
        end_date: '',
        registration_start: '',
        registration_end: '',
        status: 'Upcoming',
      });
    }
    setSemModalOpen(true);
  };

  const handleSaveSem = async (data) => {
    setSavingSem(true);
    try {
      const now = new Date().toISOString();
      if (editingSem) {
        await api.patch(`/semesters/${editingSem.id}`, {
          ...data,
          updatedAt: now,
        });
        toast.success('Semester updated successfully.');
      } else {
        await api.post('/semesters', {
          ...data,
          createdAt: now,
          updatedAt: now,
        });
        toast.success('Semester created successfully.');
      }
      setSemModalOpen(false);
      setEditingSem(null);
      await fetchAllSettings(true);
    } catch (error) {
      console.error('Save semester error:', error);
      toast.error('Unable to save semester.');
    } finally {
      setSavingSem(false);
    }
  };

  // ============================================================
  // HANDLERS — Departments
  // ============================================================

  const handleOpenDeptModal = (dept = null) => {
    setEditingDept(dept);
    if (dept) {
      deptForm.reset({
        name: dept.name || '',
        code: dept.code || '',
        faculty: dept.faculty || '',
        status: dept.status || 'Active',
      });
    } else {
      deptForm.reset({
        name: '',
        code: '',
        faculty: '',
        status: 'Active',
      });
    }
    setDeptModalOpen(true);
  };

  const handleSaveDept = async (data) => {
    setSavingDept(true);
    try {
      const now = new Date().toISOString();
      if (editingDept) {
        await api.patch(`/departments/${editingDept.id}`, {
          ...data,
          updatedAt: now,
        });
        toast.success('Department updated successfully.');
      } else {
        await api.post('/departments', {
          ...data,
          createdAt: now,
          updatedAt: now,
        });
        toast.success('Department created successfully.');
      }
      setDeptModalOpen(false);
      setEditingDept(null);
      await fetchAllSettings(true);
    } catch (error) {
      console.error('Save department error:', error);
      toast.error('Unable to save department.');
    } finally {
      setSavingDept(false);
    }
  };

  // ============================================================
  // HANDLERS — Programs
  // ============================================================

  const handleOpenProgModal = (prog = null) => {
    setEditingProg(prog);
    if (prog) {
      progForm.reset({
        name: prog.name || '',
        code: prog.code || '',
        department: prog.department || '',
        faculty: prog.faculty || '',
        study_level: prog.study_level || '',
        duration: prog.duration || '',
        status: prog.status || 'Active',
      });
    } else {
      progForm.reset({
        name: '',
        code: '',
        department: '',
        faculty: '',
        study_level: '',
        duration: '',
        status: 'Active',
      });
    }
    setProgModalOpen(true);
  };

  const handleSaveProg = async (data) => {
    setSavingProg(true);
    try {
      const now = new Date().toISOString();
      if (editingProg) {
        await api.patch(`/programs/${editingProg.id}`, {
          ...data,
          updatedAt: now,
        });
        toast.success('Program updated successfully.');
      } else {
        await api.post('/programs', {
          ...data,
          createdAt: now,
          updatedAt: now,
        });
        toast.success('Program created successfully.');
      }
      setProgModalOpen(false);
      setEditingProg(null);
      await fetchAllSettings(true);
    } catch (error) {
      console.error('Save program error:', error);
      toast.error('Unable to save program.');
    } finally {
      setSavingProg(false);
    }
  };

  // ============================================================
  // HANDLERS — Registration Settings
  // ============================================================

  const handleSaveRegistration = async () => {
    setSavingReg(true);
    try {
      await upsertSettingsDoc({ registration: registrationSettings });
      toast.success('Registration settings saved successfully.');
    } catch (error) {
      console.error('Save registration settings error:', error);
      toast.error('Unable to save registration settings.');
    } finally {
      setSavingReg(false);
    }
  };

  // ============================================================
  // HANDLERS — Result Settings
  // ============================================================

  const handleSaveResultSettings = async () => {
    setSavingResults(true);
    try {
      await upsertSettingsDoc({ results: resultSettings });
      toast.success('Result settings saved successfully.');
    } catch (error) {
      console.error('Save result settings error:', error);
      toast.error('Unable to save result settings.');
    } finally {
      setSavingResults(false);
    }
  };

  // ============================================================
  // HANDLERS — Announcements
  // ============================================================

  const handleOpenAnnModal = (ann = null) => {
    setEditingAnn(ann);
    if (ann) {
      annForm.reset({
        title: ann.title || '',
        content: ann.content || '',
        priority: ann.priority || 'Normal',
      });
    } else {
      annForm.reset({ title: '', content: '', priority: 'Normal' });
    }
    setAnnModalOpen(true);
  };

  const handleSaveAnn = async (data) => {
    setSavingAnn(true);
    try {
      const now = new Date().toISOString();
      if (editingAnn) {
        await api.patch(`/announcements/${editingAnn.id}`, {
          ...data,
          updatedAt: now,
        });
        toast.success('Announcement updated successfully.');
      } else {
        await api.post('/announcements', {
          ...data,
          status: 'Draft',
          createdAt: now,
          updatedAt: now,
        });
        toast.success('Announcement created successfully.');
      }
      setAnnModalOpen(false);
      setEditingAnn(null);
      await fetchAllSettings(true);
    } catch (error) {
      console.error('Save announcement error:', error);
      toast.error('Unable to save announcement.');
    } finally {
      setSavingAnn(false);
    }
  };

  const handlePublishAnn = async (ann) => {
    try {
      await api.patch(`/announcements/${ann.id}`, {
        status: 'Published',
        publishedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      toast.success('Announcement published successfully.');
      await fetchAllSettings(true);
    } catch (error) {
      console.error('Publish error:', error);
      toast.error('Unable to publish announcement.');
    }
  };

  const handleArchiveAnn = async (ann) => {
    try {
      await api.patch(`/announcements/${ann.id}`, {
        status: 'Archived',
        updatedAt: new Date().toISOString(),
      });
      toast.success('Announcement archived successfully.');
      await fetchAllSettings(true);
    } catch (error) {
      console.error('Archive error:', error);
      toast.error('Unable to archive announcement.');
    }
  };

  // ============================================================
  // RENDER — LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ToastContainer position="top-right" autoClose={4000} theme="light" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-pulse space-y-6">
          <div className="h-10 bg-gray-200 rounded w-64" />
          <div className="h-4 bg-gray-200 rounded w-96" />
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  // ============================================================
  // RENDER — MAIN
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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
                  <SettingsIcon
                    className="w-6 h-6"
                    style={{ color: BRAND.primary }}
                  />
                </div>
                System Settings
              </h1>
              <p className="text-sm text-gray-500 mt-1 ml-11">
                Manage SkillNest LMS configuration, your admin account, and
                university academic settings.
              </p>
            </div>
            <div className="ml-11 sm:ml-0">
              <button
                onClick={() => fetchAllSettings(true)}
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

        {/* ============================================================
            1. ADMIN PROFILE
            ============================================================ */}
        <SectionCard
          icon={User}
          title="Admin Profile"
          subtitle="Your administrator account information."
          action={
            !editingProfile ? (
              <button
                onClick={() => setEditingProfile(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors"
                style={{ color: BRAND.primary, backgroundColor: '#ffffff' }}
              >
                <Edit className="w-3.5 h-3.5" />
                Edit
              </button>
            ) : null
          }
        >
          {!editingProfile ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  icon: User,
                  label: 'Name',
                  value: `${profile?.first_name || ''} ${
                    profile?.last_name || ''
                  }`.trim(),
                },
                { icon: Mail, label: 'Email', value: profile?.email },
                { icon: Phone, label: 'Phone', value: profile?.phone },
                {
                  icon: Shield,
                  label: 'Role',
                  value: profile?.role || 'Administrator',
                },
                {
                  icon: CheckCircle,
                  label: 'Account Status',
                  value: profile?.status || 'Active',
                },
              ].map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="flex items-start gap-3 p-3 rounded-lg bg-gray-50"
                >
                  <div
                    className="p-2 rounded-lg flex-shrink-0"
                    style={{ backgroundColor: BRAND.primarySoft }}
                  >
                    <Icon
                      className="w-4 h-4"
                      style={{ color: BRAND.primary }}
                    />
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
              ))}
            </div>
          ) : (
            <form
              onSubmit={profileForm.handleSubmit(handleSaveProfile)}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  label="First Name"
                  name="first_name"
                  register={profileForm.register}
                  errors={profileForm.formState.errors}
                  required
                  icon={User}
                />
                <FormField
                  label="Last Name"
                  name="last_name"
                  register={profileForm.register}
                  errors={profileForm.formState.errors}
                  required
                  icon={User}
                />
                <FormField
                  label="Email"
                  name="email"
                  register={profileForm.register}
                  errors={profileForm.formState.errors}
                  type="email"
                  required
                  icon={Mail}
                />
                <FormField
                  label="Phone"
                  name="phone"
                  register={profileForm.register}
                  errors={profileForm.formState.errors}
                  required
                  icon={Phone}
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setEditingProfile(false);
                    profileForm.reset();
                  }}
                  disabled={savingProfile}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white rounded-lg transition-colors shadow-sm disabled:opacity-60"
                  style={{ backgroundColor: BRAND.primary }}
                >
                  {savingProfile ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" /> Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </SectionCard>

        {/* ============================================================
            1b. CHANGE PASSWORD
            ============================================================ */}
        <SectionCard
          icon={Lock}
          title="Change Password"
          subtitle="Update your administrator password. Your new password is saved securely."
        >
          <form
            onSubmit={passwordForm.handleSubmit(handleChangePassword)}
            className="space-y-4"
          >
            <PasswordField
              label="Current Password"
              name="current_password"
              register={passwordForm.register}
              errors={passwordForm.formState.errors}
              show={showCurrentPwd}
              onToggle={() => setShowCurrentPwd((v) => !v)}
              placeholder="Enter your current password"
            />
            <PasswordField
              label="New Password"
              name="new_password"
              register={passwordForm.register}
              errors={passwordForm.formState.errors}
              show={showNewPwd}
              onToggle={() => setShowNewPwd((v) => !v)}
              placeholder="Enter a new password"
            />
            <PasswordField
              label="Confirm New Password"
              name="confirm_password"
              register={passwordForm.register}
              errors={passwordForm.formState.errors}
              show={showConfirmPwd}
              onToggle={() => setShowConfirmPwd((v) => !v)}
              placeholder="Re-enter your new password"
            />

            <div
              className="rounded-lg p-3 border"
              style={{
                backgroundColor: BRAND.primarySoft,
                borderColor: BRAND.primaryBorder,
              }}
            >
              <p
                className="text-xs font-semibold mb-1.5"
                style={{ color: BRAND.primaryDark }}
              >
                Password must contain:
              </p>
              <ul className="text-xs space-y-0.5" style={{ color: BRAND.accent }}>
                <li>• At least 8 characters</li>
                <li>• At least one uppercase letter</li>
                <li>• At least one lowercase letter</li>
                <li>• At least one number</li>
              </ul>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={changingPassword}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white rounded-lg transition-colors shadow-sm disabled:opacity-60"
                style={{ backgroundColor: BRAND.primary }}
              >
                {changingPassword ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Updating...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" /> Update Password
                  </>
                )}
              </button>
            </div>
          </form>
        </SectionCard>

        {/* ============================================================
            2. UNIVERSITY
            ============================================================ */}
        <SectionCard
          icon={Building2}
          title="University Information"
          subtitle="Official university details used across the platform."
          action={
            !editingUniversity ? (
              <button
                onClick={() => setEditingUniversity(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors"
                style={{ color: BRAND.primary, backgroundColor: '#ffffff' }}
              >
                <Edit className="w-3.5 h-3.5" />
                Edit
              </button>
            ) : null
          }
        >
          {!editingUniversity ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  icon: Building2,
                  label: 'University Name',
                  value: university?.university_name,
                },
                {
                  icon: Hash,
                  label: 'University Code',
                  value: university?.university_code,
                },
                {
                  icon: GraduationCap,
                  label: 'Faculty',
                  value: university?.faculty,
                },
                {
                  icon: Mail,
                  label: 'Contact Email',
                  value: university?.contact_email,
                },
                {
                  icon: Phone,
                  label: 'Contact Phone',
                  value: university?.contact_phone,
                },
                { icon: Globe, label: 'Website', value: university?.website },
                { icon: MapPin, label: 'Address', value: university?.address },
                { icon: MapPin, label: 'City', value: university?.city },
                { icon: Globe, label: 'Country', value: university?.country },
              ].map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="flex items-start gap-3 p-3 rounded-lg bg-gray-50"
                >
                  <div
                    className="p-2 rounded-lg flex-shrink-0"
                    style={{ backgroundColor: BRAND.primarySoft }}
                  >
                    <Icon
                      className="w-4 h-4"
                      style={{ color: BRAND.primary }}
                    />
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
              ))}
            </div>
          ) : (
            <form
              onSubmit={universityForm.handleSubmit(handleSaveUniversity)}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  label="University Name"
                  name="university_name"
                  register={universityForm.register}
                  errors={universityForm.formState.errors}
                  required
                  icon={Building2}
                />
                <FormField
                  label="University Code"
                  name="university_code"
                  register={universityForm.register}
                  errors={universityForm.formState.errors}
                  required
                  icon={Hash}
                />
                <FormField
                  label="Faculty"
                  name="faculty"
                  register={universityForm.register}
                  errors={universityForm.formState.errors}
                  icon={GraduationCap}
                />
                <FormField
                  label="Contact Email"
                  name="contact_email"
                  register={universityForm.register}
                  errors={universityForm.formState.errors}
                  type="email"
                  required
                  icon={Mail}
                />
                <FormField
                  label="Contact Phone"
                  name="contact_phone"
                  register={universityForm.register}
                  errors={universityForm.formState.errors}
                  required
                  icon={Phone}
                />
                <FormField
                  label="Website"
                  name="website"
                  register={universityForm.register}
                  errors={universityForm.formState.errors}
                  icon={Globe}
                />
                <div className="sm:col-span-2">
                  <FormField
                    label="Address"
                    name="address"
                    register={universityForm.register}
                    errors={universityForm.formState.errors}
                    required
                    icon={MapPin}
                  />
                </div>
                <FormField
                  label="City"
                  name="city"
                  register={universityForm.register}
                  errors={universityForm.formState.errors}
                  required
                  icon={MapPin}
                />
                <FormField
                  label="Country"
                  name="country"
                  register={universityForm.register}
                  errors={universityForm.formState.errors}
                  required
                  icon={Globe}
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setEditingUniversity(false);
                    universityForm.reset();
                  }}
                  disabled={savingUniversity}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingUniversity}
                  className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white rounded-lg transition-colors shadow-sm disabled:opacity-60"
                  style={{ backgroundColor: BRAND.primary }}
                >
                  {savingUniversity ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" /> Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </SectionCard>

        {/* ============================================================
            3. ACADEMIC YEARS
            ============================================================ */}
        <SectionCard
          icon={CalendarDays}
          title="Academic Years"
          subtitle="Manage the university's academic calendar cycles."
          action={
            <button
              onClick={() => handleOpenAYModal()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors"
              style={{ color: BRAND.primary, backgroundColor: '#ffffff' }}
            >
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          }
        >
          {academicYears.length === 0 ? (
            <div className="text-center py-8 text-sm text-gray-500">
              No academic years configured yet. Click "Add" to create one.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    {['Name', 'Start Date', 'End Date', 'Status', 'Actions'].map(
                      (h) => (
                        <th
                          key={h}
                          className="px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap"
                        >
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {academicYears.map((ay) => (
                    <tr key={ay.id} className="hover:bg-gray-50">
                      <td
                        className="px-3 py-3 text-sm font-semibold"
                        style={{ color: BRAND.primary }}
                      >
                        {ay.name}
                      </td>
                      <td className="px-3 py-3 text-sm text-gray-600">
                        {formatDate(ay.start_date)}
                      </td>
                      <td className="px-3 py-3 text-sm text-gray-600">
                        {formatDate(ay.end_date)}
                      </td>
                      <td className="px-3 py-3">
                        <StatusBadge status={ay.status} />
                      </td>
                      <td className="px-3 py-3">
                        <button
                          onClick={() => handleOpenAYModal(ay)}
                          className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </SectionCard>

        {/* ============================================================
            4. SEMESTERS
            ============================================================ */}
        <SectionCard
          icon={Calendar}
          title="Semesters"
          subtitle="Semesters control what students see on the unit registration page."
          action={
            <button
              onClick={() => handleOpenSemModal()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors"
              style={{ color: BRAND.primary, backgroundColor: '#ffffff' }}
            >
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          }
        >
          {semesters.length === 0 ? (
            <div className="text-center py-8 text-sm text-gray-500">
              No semesters configured yet. Click "Add" to create one.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    {[
                      'Name',
                      'Academic Year',
                      'Start',
                      'End',
                      'Reg. Start',
                      'Reg. End',
                      'Status',
                      'Actions',
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {semesters.map((s) => (
                    <tr key={s.id} className="hover:bg-gray-50">
                      <td
                        className="px-3 py-3 text-sm font-semibold"
                        style={{ color: BRAND.primary }}
                      >
                        {s.name}
                      </td>
                      <td className="px-3 py-3 text-sm text-gray-600">
                        {s.academic_year}
                      </td>
                      <td className="px-3 py-3 text-sm text-gray-600">
                        {formatDate(s.start_date)}
                      </td>
                      <td className="px-3 py-3 text-sm text-gray-600">
                        {formatDate(s.end_date)}
                      </td>
                      <td className="px-3 py-3 text-sm text-gray-600">
                        {formatDate(s.registration_start)}
                      </td>
                      <td className="px-3 py-3 text-sm text-gray-600">
                        {formatDate(s.registration_end)}
                      </td>
                      <td className="px-3 py-3">
                        <StatusBadge status={s.status} />
                      </td>
                      <td className="px-3 py-3">
                        <button
                          onClick={() => handleOpenSemModal(s)}
                          className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </SectionCard>

        {/* ============================================================
            5. DEPARTMENTS
            ============================================================ */}
        <SectionCard
          icon={Layers}
          title="Departments"
          subtitle="Academic departments used across programs, units and staff."
          action={
            <button
              onClick={() => handleOpenDeptModal()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors"
              style={{ color: BRAND.primary, backgroundColor: '#ffffff' }}
            >
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          }
        >
          {departments.length === 0 ? (
            <div className="text-center py-8 text-sm text-gray-500">
              No departments configured yet. Click "Add" to create one.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    {['Name', 'Code', 'Faculty', 'Status', 'Actions'].map(
                      (h) => (
                        <th
                          key={h}
                          className="px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap"
                        >
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {departments.map((d) => (
                    <tr key={d.id} className="hover:bg-gray-50">
                      <td
                        className="px-3 py-3 text-sm font-semibold"
                        style={{ color: BRAND.primary }}
                      >
                        {d.name}
                      </td>
                      <td className="px-3 py-3 text-sm text-gray-600">
                        {d.code}
                      </td>
                      <td className="px-3 py-3 text-sm text-gray-600">
                        {d.faculty}
                      </td>
                      <td className="px-3 py-3">
                        <StatusBadge status={d.status} />
                      </td>
                      <td className="px-3 py-3">
                        <button
                          onClick={() => handleOpenDeptModal(d)}
                          className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </SectionCard>

        {/* ============================================================
            6. PROGRAMS
            ============================================================ */}
        <SectionCard
          icon={BookOpen}
          title="Programs"
          subtitle="Academic programs used by applications, students and units."
          action={
            <button
              onClick={() => handleOpenProgModal()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors"
              style={{ color: BRAND.primary, backgroundColor: '#ffffff' }}
            >
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          }
        >
          {programs.length === 0 ? (
            <div className="text-center py-8 text-sm text-gray-500">
              No programs configured yet. Click "Add" to create one.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    {[
                      'Name',
                      'Code',
                      'Department',
                      'Faculty',
                      'Level',
                      'Duration',
                      'Status',
                      'Actions',
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {programs.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td
                        className="px-3 py-3 text-sm font-semibold"
                        style={{ color: BRAND.primary }}
                      >
                        {p.name}
                      </td>
                      <td className="px-3 py-3 text-sm text-gray-600">
                        {p.code}
                      </td>
                      <td className="px-3 py-3 text-sm text-gray-600">
                        {p.department}
                      </td>
                      <td className="px-3 py-3 text-sm text-gray-600">
                        {p.faculty}
                      </td>
                      <td className="px-3 py-3 text-sm text-gray-600">
                        {p.study_level}
                      </td>
                      <td className="px-3 py-3 text-sm text-gray-600">
                        {p.duration}
                      </td>
                      <td className="px-3 py-3">
                        <StatusBadge status={p.status} />
                      </td>
                      <td className="px-3 py-3">
                        <button
                          onClick={() => handleOpenProgModal(p)}
                          className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </SectionCard>

        {/* ============================================================
            7. REGISTRATION SETTINGS
            ============================================================ */}
        <SectionCard
          icon={BookMarked}
          title="Registration Settings"
          subtitle="These settings control what students see and can do on the unit registration page."
        >
          <div className="space-y-4">
            <Toggle
              icon={Power}
              label="Registration Open"
              description="Allow students to register for units."
              checked={registrationSettings.registration_open}
              onChange={(v) =>
                setRegistrationSettings((s) => ({
                  ...s,
                  registration_open: v,
                }))
              }
            />
            <Toggle
              icon={XCircle}
              label="Allow Unit Dropping"
              description="Allow students to drop registered units."
              checked={registrationSettings.allow_unit_dropping}
              onChange={(v) =>
                setRegistrationSettings((s) => ({
                  ...s,
                  allow_unit_dropping: v,
                }))
              }
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-gray-100">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Maximum Credit Hours
                </label>
                <input
                  type="number"
                  value={registrationSettings.max_credit_hours}
                  onChange={(e) =>
                    setRegistrationSettings((s) => ({
                      ...s,
                      max_credit_hours: Number(e.target.value),
                    }))
                  }
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Minimum Credit Hours
                </label>
                <input
                  type="number"
                  value={registrationSettings.min_credit_hours}
                  onChange={(e) =>
                    setRegistrationSettings((s) => ({
                      ...s,
                      min_credit_hours: Number(e.target.value),
                    }))
                  }
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Registration Deadline
                </label>
                <input
                  type="date"
                  value={registrationSettings.registration_deadline}
                  onChange={(e) =>
                    setRegistrationSettings((s) => ({
                      ...s,
                      registration_deadline: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Unit Drop Deadline
                </label>
                <input
                  type="date"
                  value={registrationSettings.unit_drop_deadline}
                  onChange={(e) =>
                    setRegistrationSettings((s) => ({
                      ...s,
                      unit_drop_deadline: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-gray-200">
              <button
                onClick={handleSaveRegistration}
                disabled={savingReg}
                className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white rounded-lg transition-colors shadow-sm disabled:opacity-60"
                style={{ backgroundColor: BRAND.primary }}
              >
                {savingReg ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" /> Save Registration Settings
                  </>
                )}
              </button>
            </div>
          </div>
        </SectionCard>

        {/* ============================================================
            8. RESULT SETTINGS
            ============================================================ */}
        <SectionCard
          icon={Award}
          title="Result Settings"
          subtitle="Configure how results are published and made visible to students."
        >
          <div className="space-y-4">
            <Toggle
              icon={Send}
              label="Auto-Publish Results"
              description="Automatically publish results when marks are finalized."
              checked={resultSettings.result_publication_auto}
              onChange={(v) =>
                setResultSettings((s) => ({
                  ...s,
                  result_publication_auto: v,
                }))
              }
            />
            <Toggle
              icon={Shield}
              label="Require Approval Before Publishing"
              description="Results must be approved by an administrator before students can see them."
              checked={resultSettings.require_approval}
              onChange={(v) =>
                setResultSettings((s) => ({ ...s, require_approval: v }))
              }
            />

            <div className="pt-3 border-t border-gray-100">
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Result Visibility
              </label>
              <select
                value={resultSettings.result_visibility}
                onChange={(e) =>
                  setResultSettings((s) => ({
                    ...s,
                    result_visibility: e.target.value,
                  }))
                }
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg outline-none"
              >
                <option value="Published Only">Published Only</option>
                <option value="Published + Provisional">
                  Published + Provisional
                </option>
                <option value="All Results">All Results</option>
              </select>
            </div>

            <div
              className="flex items-start gap-2 p-3 rounded-lg border"
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
                GPA calculation and official grading rules are handled by the
                backend. Contact your system administrator to configure these.
              </p>
            </div>

            <div className="flex justify-end pt-3 border-t border-gray-200">
              <button
                onClick={handleSaveResultSettings}
                disabled={savingResults}
                className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white rounded-lg transition-colors shadow-sm disabled:opacity-60"
                style={{ backgroundColor: BRAND.primary }}
              >
                {savingResults ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" /> Save Result Settings
                  </>
                )}
              </button>
            </div>
          </div>
        </SectionCard>

        {/* ============================================================
            9. ANNOUNCEMENTS
            ============================================================ */}
        <SectionCard
          icon={Megaphone}
          title="Announcements"
          subtitle="Publish important notices to students and staff."
          action={
            <button
              onClick={() => handleOpenAnnModal()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors"
              style={{ color: BRAND.primary, backgroundColor: '#ffffff' }}
            >
              <Plus className="w-3.5 h-3.5" /> New
            </button>
          }
        >
          {announcements.length === 0 ? (
            <div className="text-center py-8 text-sm text-gray-500">
              No announcements yet. Click "New" to create one.
            </div>
          ) : (
            <div className="space-y-3">
              {announcements.map((ann) => (
                <div
                  key={ann.id}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3 flex-wrap mb-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-gray-900">
                        {ann.title}
                      </h4>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Created: {formatDate(ann.createdAt || ann.created_at)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
                      {ann.priority && (
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                            ann.priority === 'Urgent'
                              ? 'bg-red-50 text-red-700'
                              : ann.priority === 'High'
                              ? 'bg-orange-50 text-orange-700'
                              : ann.priority === 'Low'
                              ? 'bg-gray-100 text-gray-600'
                              : 'bg-blue-50 text-blue-700'
                          }`}
                        >
                          {ann.priority}
                        </span>
                      )}
                      <StatusBadge status={ann.status} />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                    {ann.content}
                  </p>
                  <div className="flex items-center gap-2 pt-3 border-t border-gray-100 flex-wrap">
                    <button
                      onClick={() => handleOpenAnnModal(ann)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <Edit className="w-3.5 h-3.5" /> Edit
                    </button>
                    {ann.status !== 'Published' && (
                      <button
                        onClick={() => handlePublishAnn(ann)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors"
                      >
                        <Send className="w-3.5 h-3.5" /> Publish
                      </button>
                    )}
                    {ann.status === 'Published' && (
                      <button
                        onClick={() => handleArchiveAnn(ann)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-700 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors"
                      >
                        <Archive className="w-3.5 h-3.5" /> Archive
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        {/* ============================================================
            10. SECURITY
            ============================================================ */}
        <SectionCard
          icon={Shield}
          title="Security"
          subtitle="System-wide authentication and session policies."
        >
          <div className="space-y-3">
            {[
              {
                icon: Clock,
                label: 'Session Timeout',
                value: '30 minutes of inactivity',
              },
              {
                icon: Lock,
                label: 'Login Attempts Limit',
                value: '5 attempts before temporary lockout',
              },
              {
                icon: Shield,
                label: 'Admin Authentication',
                value: 'Email + password (single-admin mode)',
              },
              {
                icon: AlertTriangle,
                label: 'Password Policy',
                value: 'Minimum 8 characters, mixed case, number required',
              },
            ].map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="flex items-start gap-3 p-3 rounded-lg bg-gray-50"
              >
                <div
                  className="p-2 rounded-lg flex-shrink-0"
                  style={{ backgroundColor: BRAND.primarySoft }}
                >
                  <Icon
                    className="w-4 h-4"
                    style={{ color: BRAND.primary }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {label}
                  </p>
                  <p className="text-sm font-semibold text-gray-900 mt-0.5">
                    {value}
                  </p>
                </div>
              </div>
            ))}
            <div
              className="flex items-start gap-2 p-3 rounded-lg border"
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
                Use the Change Password section above to update your admin
                credentials. All changes are persisted to{' '}
                <code className="font-mono">db.json</code>.
              </p>
            </div>
          </div>
        </SectionCard>
      </div>

      {/* ============================================================
          MODALS
          ============================================================ */}

      {/* Academic Year Modal */}
      <CrudModal
        open={ayModalOpen}
        onClose={() => {
          setAyModalOpen(false);
          setEditingAY(null);
        }}
        title={editingAY ? 'Edit Academic Year' : 'Add Academic Year'}
        onSubmit={ayForm.handleSubmit(handleSaveAY)}
        loading={savingAY}
        submitText={editingAY ? 'Update' : 'Create'}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <FormField
              label="Academic Year Name"
              name="name"
              register={ayForm.register}
              errors={ayForm.formState.errors}
              required
              placeholder="e.g., 2024/2025"
              icon={CalendarDays}
            />
          </div>
          <FormField
            label="Start Date"
            name="start_date"
            register={ayForm.register}
            errors={ayForm.formState.errors}
            type="date"
            required
            icon={Calendar}
          />
          <FormField
            label="End Date"
            name="end_date"
            register={ayForm.register}
            errors={ayForm.formState.errors}
            type="date"
            required
            icon={Calendar}
          />
          <div className="sm:col-span-2">
            <FormField
              label="Status"
              name="status"
              register={ayForm.register}
              errors={ayForm.formState.errors}
              required
              options={ACADEMIC_YEAR_STATUSES}
              icon={Power}
            />
          </div>
        </div>
      </CrudModal>

      {/* Semester Modal */}
      <CrudModal
        open={semModalOpen}
        onClose={() => {
          setSemModalOpen(false);
          setEditingSem(null);
        }}
        title={editingSem ? 'Edit Semester' : 'Add Semester'}
        onSubmit={semForm.handleSubmit(handleSaveSem)}
        loading={savingSem}
        submitText={editingSem ? 'Update' : 'Create'}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            label="Semester Name"
            name="name"
            register={semForm.register}
            errors={semForm.formState.errors}
            required
            placeholder="e.g., Semester 1"
            icon={Calendar}
          />
          <FormField
            label="Academic Year"
            name="academic_year"
            register={semForm.register}
            errors={semForm.formState.errors}
            required
            options={
              academicYearOptions.length > 0
                ? academicYearOptions
                : ['2024/2025', '2025/2026']
            }
            icon={CalendarDays}
          />
          <FormField
            label="Start Date"
            name="start_date"
            register={semForm.register}
            errors={semForm.formState.errors}
            type="date"
            required
            icon={Calendar}
          />
          <FormField
            label="End Date"
            name="end_date"
            register={semForm.register}
            errors={semForm.formState.errors}
            type="date"
            required
            icon={Calendar}
          />
          <FormField
            label="Registration Start"
            name="registration_start"
            register={semForm.register}
            errors={semForm.formState.errors}
            type="date"
            required
            icon={Calendar}
          />
          <FormField
            label="Registration End"
            name="registration_end"
            register={semForm.register}
            errors={semForm.formState.errors}
            type="date"
            required
            icon={Calendar}
          />
          <div className="sm:col-span-2">
            <FormField
              label="Status"
              name="status"
              register={semForm.register}
              errors={semForm.formState.errors}
              required
              options={SEMESTER_STATUSES}
              icon={Power}
            />
          </div>
        </div>
      </CrudModal>

      {/* Department Modal */}
      <CrudModal
        open={deptModalOpen}
        onClose={() => {
          setDeptModalOpen(false);
          setEditingDept(null);
        }}
        title={editingDept ? 'Edit Department' : 'Add Department'}
        onSubmit={deptForm.handleSubmit(handleSaveDept)}
        loading={savingDept}
        submitText={editingDept ? 'Update' : 'Create'}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            label="Department Name"
            name="name"
            register={deptForm.register}
            errors={deptForm.formState.errors}
            required
            placeholder="e.g., Computer Science"
            icon={Layers}
          />
          <FormField
            label="Department Code"
            name="code"
            register={deptForm.register}
            errors={deptForm.formState.errors}
            required
            placeholder="e.g., CS"
            icon={Hash}
          />
          <div className="sm:col-span-2">
            <FormField
              label="Faculty"
              name="faculty"
              register={deptForm.register}
              errors={deptForm.formState.errors}
              required
              options={
                facultyOptions.length > 0
                  ? facultyOptions
                  : [
                      'Faculty of Science & Technology',
                      'Faculty of Business',
                      'Faculty of Arts',
                    ]
              }
              icon={GraduationCap}
            />
          </div>
          <div className="sm:col-span-2">
            <FormField
              label="Status"
              name="status"
              register={deptForm.register}
              errors={deptForm.formState.errors}
              required
              options={GENERAL_STATUSES}
              icon={Power}
            />
          </div>
        </div>
      </CrudModal>

      {/* Program Modal */}
      <CrudModal
        open={progModalOpen}
        onClose={() => {
          setProgModalOpen(false);
          setEditingProg(null);
        }}
        title={editingProg ? 'Edit Program' : 'Add Program'}
        onSubmit={progForm.handleSubmit(handleSaveProg)}
        loading={savingProg}
        submitText={editingProg ? 'Update' : 'Create'}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            label="Program Name"
            name="name"
            register={progForm.register}
            errors={progForm.formState.errors}
            required
            placeholder="e.g., BSc Computer Science"
            icon={BookOpen}
          />
          <FormField
            label="Program Code"
            name="code"
            register={progForm.register}
            errors={progForm.formState.errors}
            required
            placeholder="e.g., BSCS"
            icon={Hash}
          />
          <FormField
            label="Department"
            name="department"
            register={progForm.register}
            errors={progForm.formState.errors}
            required
            options={
              departmentOptions.length > 0
                ? departmentOptions
                : ['Computer Science', 'Business', 'Engineering']
            }
            icon={Layers}
          />
          <FormField
            label="Faculty"
            name="faculty"
            register={progForm.register}
            errors={progForm.formState.errors}
            required
            options={
              facultyOptions.length > 0
                ? facultyOptions
                : [
                    'Faculty of Science & Technology',
                    'Faculty of Business',
                  ]
            }
            icon={GraduationCap}
          />
          <FormField
            label="Study Level"
            name="study_level"
            register={progForm.register}
            errors={progForm.formState.errors}
            required
            options={STUDY_LEVELS}
            icon={Award}
          />
          <FormField
            label="Duration"
            name="duration"
            register={progForm.register}
            errors={progForm.formState.errors}
            required
            placeholder="e.g., 4 years"
            icon={Clock}
          />
          <div className="sm:col-span-2">
            <FormField
              label="Status"
              name="status"
              register={progForm.register}
              errors={progForm.formState.errors}
              required
              options={GENERAL_STATUSES}
              icon={Power}
            />
          </div>
        </div>
      </CrudModal>

      {/* Announcement Modal */}
      <CrudModal
        open={annModalOpen}
        onClose={() => {
          setAnnModalOpen(false);
          setEditingAnn(null);
        }}
        title={editingAnn ? 'Edit Announcement' : 'New Announcement'}
        onSubmit={annForm.handleSubmit(handleSaveAnn)}
        loading={savingAnn}
        submitText={editingAnn ? 'Update' : 'Create'}
      >
        <div className="grid grid-cols-1 gap-4">
          <FormField
            label="Title"
            name="title"
            register={annForm.register}
            errors={annForm.formState.errors}
            required
            placeholder="Announcement title"
            icon={Megaphone}
          />
          <FormField
            label="Content"
            name="content"
            register={annForm.register}
            errors={annForm.formState.errors}
            required
            textarea
            rows={5}
            placeholder="Write your announcement..."
          />
          <FormField
            label="Priority"
            name="priority"
            register={annForm.register}
            errors={annForm.formState.errors}
            required
            options={ANNOUNCEMENT_PRIORITIES}
            icon={Bell}
          />
        </div>
      </CrudModal>
    </div>
  );
};

export default Settings;