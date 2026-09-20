// src/users/pages/Settings.jsx
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Settings as SettingsIcon,
  Mail,
  Phone,
  Hash,
  CheckCircle,
  Bell,
  BellRing,
  Lock,
  Shield,
  Eye,
  EyeOff,
  Loader2,
  Save,
  RefreshCw,
  AlertTriangle,
  UserX,
  LogOut,
  Monitor,
  Smartphone,
  Clock,
  MapPin,
  Info,
  ChevronRight,
  Globe,
  Users,
  MessageSquare,
  BookOpen,
  Award,
  Megaphone,
  Calendar,
  AlertCircle,
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

function getAuthStorage() {
  return localStorage.getItem('user') ? localStorage : sessionStorage;
}

function getStudentKey(student) {
  if (!student) return null;
  return student.studentId || student.id || null;
}

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
// VALIDATION
// ============================================================

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

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

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

// ============================================================
// SUB-COMPONENTS
// ============================================================

const SettingsSkeleton = () => (
  <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-pulse space-y-6">
    <div className="h-10 bg-gray-200 rounded w-64" />
    <div className="h-4 bg-gray-200 rounded w-80" />
    <div className="h-64 bg-gray-200 rounded-xl" />
    <div className="h-80 bg-gray-200 rounded-xl" />
    <div className="h-64 bg-gray-200 rounded-xl" />
  </div>
);

const SectionCard = ({ icon: Icon, title, subtitle, children, badge }) => (
  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
    <div
      className="px-5 py-3 border-b border-gray-200 flex items-center justify-between"
      style={{ backgroundColor: BRAND.primarySoft }}
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
      {badge}
    </div>
    <div className="p-5">
      {subtitle && (
        <p className="text-xs text-gray-500 mb-4">{subtitle}</p>
      )}
      {children}
    </div>
  </div>
);

const InfoField = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
    <div
      className="p-2 rounded-lg flex-shrink-0"
      style={{ backgroundColor: BRAND.primarySoft }}
    >
      <Icon className="w-4 h-4" style={{ color: BRAND.primary }} />
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

const Toggle = ({ checked, onChange, label, description, icon: Icon, disabled }) => (
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
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors flex-shrink-0 ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      }`}
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

const PasswordField = ({
  label,
  name,
  register,
  errors,
  show,
  onToggle,
  placeholder,
  disabled,
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
          disabled={disabled}
          className={`w-full pl-10 pr-12 py-2.5 text-sm border rounded-lg outline-none transition-all ${
            error ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
          } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
        />
        <button
          type="button"
          onClick={onToggle}
          disabled={disabled}
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

const ConfirmModal = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  loading,
  variant = 'danger',
}) => {
  if (!open) return null;

  const btnColor = variant === 'danger' ? '#dc2626' : BRAND.primary;
  const btnHover = variant === 'danger' ? '#b91c1c' : BRAND.primaryDark;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="p-6 text-center">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
              variant === 'danger' ? 'bg-red-50' : ''
            }`}
            style={
              variant !== 'danger' ? { backgroundColor: BRAND.primarySoft } : {}
            }
          >
            <AlertTriangle
              className={`w-8 h-8 ${variant === 'danger' ? 'text-red-600' : ''}`}
              style={variant !== 'danger' ? { color: BRAND.primary } : {}}
            />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-sm text-gray-600">{message}</p>
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
            style={{ backgroundColor: btnColor }}
            onMouseEnter={(e) => {
              if (!loading) e.currentTarget.style.backgroundColor = btnHover;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = btnColor;
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

const Settings = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [loggingOutSessions, setLoggingOutSessions] = useState(false);
  const [requestingDeactivation, setRequestingDeactivation] = useState(false);

  const [accountId, setAccountId] = useState(null);
  const [account, setAccount] = useState({
    email: '',
    phone: '',
    account_status: 'Active',
    student_id: '',
  });

  const [notifications, setNotifications] = useState({
    email_application_updates: true,
    email_unit_registration: true,
    email_results_published: true,
    email_announcements: false,
    portal_academic_updates: true,
    portal_registration_reminders: true,
    portal_application_notifications: true,
    portal_system_notifications: true,
  });

  const [privacy, setPrivacy] = useState({
    profile_visibility: 'University Only',
    academic_visibility: 'Advisor Only',
    allow_communication: true,
  });

  const [sessionInfo, setSessionInfo] = useState({
    last_login: null,
    current_device: 'This device',
    current_ip: null,
    current_location: null,
    other_sessions: 0,
  });

  const [settingsId, setSettingsId] = useState(null);

  const [showCurrentPwd, setShowCurrentPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);

  const [logoutSessionsModal, setLogoutSessionsModal] = useState(false);
  const [deactivationModal, setDeactivationModal] = useState(false);

  // Password form
  const {
    register: registerPwd,
    handleSubmit: handleSubmitPwd,
    formState: { errors: pwdErrors },
    reset: resetPwd,
  } = useForm({
    resolver: yupResolver(passwordSchema),
    mode: 'onChange',
    defaultValues: {
      current_password: '',
      new_password: '',
      confirm_password: '',
    },
  });

  // ============================================================
  // API — FETCH SETTINGS
  // ============================================================

  const fetchSettings = useCallback(async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const student = getCurrentStudent();
      if (!student) {
        setLoading(false);
        setRefreshing(false);
        return;
      }

      const studentKey = getStudentKey(student);

      // 1) Load account (authoritative for email / phone / status / password)
      let acc = null;
      if (student.id) {
        try {
          const r = await api.get(`/accounts/${student.id}`);
          if (r.data && !Array.isArray(r.data)) acc = r.data;
        } catch {
          /* fallthrough */
        }
      }
      if (!acc && studentKey) {
        const r = await api.get('/accounts', {
          params: { studentId: studentKey },
        });
        const arr = Array.isArray(r.data) ? r.data : [];
        acc = arr[0] || null;
      }

      if (acc) {
        setAccountId(acc.id);
        setAccount({
          email: acc.email || '',
          phone: acc.phone || '',
          account_status: acc.accountStatus || acc.status || 'Active',
          student_id: acc.studentId || '',
        });
      }

      // 2) Load per-student settings (notification prefs + privacy)
      let settings = null;
      if (studentKey) {
        try {
          const r = await api.get('/settings', {
            params: { studentId: studentKey },
          });
          const arr = Array.isArray(r.data) ? r.data : [];
          settings = arr[0] || null;
        } catch {
          settings = null;
        }
      }

      if (settings) {
        setSettingsId(settings.id);
        if (settings.notifications) {
          setNotifications((prev) => ({
            ...prev,
            ...settings.notifications,
          }));
        }
        if (settings.privacy) {
          setPrivacy((prev) => ({ ...prev, ...settings.privacy }));
        }
      }

      // 3) Basic session info — stored in localStorage at login time
      setSessionInfo((prev) => ({
        ...prev,
        last_login: student.lastLogin || prev.last_login,
        current_device:
          typeof navigator !== 'undefined'
            ? `${navigator.platform || 'Device'} · ${
                navigator.userAgent.includes('Chrome')
                  ? 'Chrome'
                  : navigator.userAgent.includes('Firefox')
                  ? 'Firefox'
                  : navigator.userAgent.includes('Safari')
                  ? 'Safari'
                  : 'Browser'
              }`
            : 'This device',
        other_sessions: 0,
      }));

      if (showRefresh) toast.success('Settings refreshed successfully');
    } catch (error) {
      console.error('Error fetching settings:', error);
      if (!error.response) {
        toast.error(
          'Cannot reach JSON Server. Make sure it is running on port 5000.'
        );
      } else {
        toast.error('Unable to load your settings.');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // ============================================================
  // SAVE NOTIFICATIONS + PRIVACY → /settings
  // ============================================================

  const handleSaveNotifications = async () => {
    setSavingSettings(true);
    try {
      const student = getCurrentStudent();
      const studentKey = getStudentKey(student);
      const now = new Date().toISOString();

      const payload = {
        studentId: studentKey,
        accountId,
        notifications,
        privacy,
        updatedAt: now,
      };

      if (settingsId) {
        await api.patch(`/settings/${settingsId}`, payload);
      } else {
        const created = await api.post('/settings', {
          ...payload,
          createdAt: now,
        });
        if (created.data?.id) setSettingsId(created.data.id);
      }

      toast.success('Settings saved successfully.');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Unable to save settings.');
    } finally {
      setSavingSettings(false);
    }
  };

  // ============================================================
  // CHANGE PASSWORD → PATCH /accounts/:id
  // ============================================================

  const handleChangePassword = async (data) => {
    if (!accountId) {
      toast.error('Account not found. Please log in again.');
      return;
    }

    setChangingPassword(true);
    try {
      // 1) Fetch the latest account record
      const accRes = await api.get(`/accounts/${accountId}`);
      const current = accRes.data;

      // 2) Verify current password
      if (!current || current.password !== data.current_password) {
        toast.error('Current password is incorrect.');
        setChangingPassword(false);
        return;
      }

      // 3) Prevent reusing the same password
      if (data.current_password === data.new_password) {
        toast.error('New password must be different from the current one.');
        setChangingPassword(false);
        return;
      }

      // 4) Persist the new password to db.json
      const updates = {
        password: data.new_password,
        passwordUpdatedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      try {
        await api.patch(`/accounts/${accountId}`, updates);
      } catch (patchErr) {
        if (patchErr.response?.status === 404) throw patchErr;
        // PUT fallback
        await api.put(`/accounts/${accountId}`, { ...current, ...updates });
      }

      // 5) Keep the local user session in sync
      const storage = getAuthStorage();
      if (storage) {
        try {
          const cached = JSON.parse(storage.getItem('user') || '{}');
          cached.password = data.new_password;
          storage.setItem('user', JSON.stringify(cached));
        } catch {
          /* ignore */
        }
      }

      toast.success('Password changed successfully.');
      resetPwd();
      setShowCurrentPwd(false);
      setShowNewPwd(false);
      setShowConfirmPwd(false);
    } catch (error) {
      console.error('Error changing password:', error);
      if (!error.response) {
        toast.error('Network error. Make sure JSON Server is running.');
      } else {
        toast.error('Unable to change password. Please try again.');
      }
    } finally {
      setChangingPassword(false);
    }
  };

  // ============================================================
  // LOGOUT OTHER SESSIONS — no backend in JSON Server, just UI
  // ============================================================

  const handleLogoutOtherSessions = async () => {
    setLoggingOutSessions(true);
    try {
      // JSON Server has no session store. We simulate the effect
      // by clearing any locally cached "other session" markers.
      await new Promise((r) => setTimeout(r, 400));
      setSessionInfo((prev) => ({ ...prev, other_sessions: 0 }));
      toast.success('Other sessions logged out successfully.');
      setLogoutSessionsModal(false);
    } catch (error) {
      console.error('Error logging out sessions:', error);
      toast.error('Unable to logout other sessions.');
    } finally {
      setLoggingOutSessions(false);
    }
  };

  // ============================================================
  // DEACTIVATION REQUEST — write into /notifications (audit trail)
  // ============================================================

  const handleRequestDeactivation = async () => {
    setRequestingDeactivation(true);
    try {
      const student = getCurrentStudent();
      const studentKey = getStudentKey(student);

      await api.post('/notifications', {
        type: 'deactivation_request',
        studentId: studentKey,
        accountId,
        fullName: student?.fullName || '',
        email: student?.email || '',
        status: 'pending',
        message:
          'Account deactivation requested from the student settings page.',
        createdAt: new Date().toISOString(),
      });

      toast.success(
        'Account deactivation request submitted. The university will review it shortly.'
      );
      setDeactivationModal(false);
    } catch (error) {
      console.error('Error requesting deactivation:', error);
      toast.error('Unable to submit deactivation request.');
    } finally {
      setRequestingDeactivation(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // ============================================================
  // RENDER — LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ToastContainer position="top-right" autoClose={4000} theme="light" />
        <SettingsSkeleton />
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

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
                Settings
              </h1>
              <p className="text-sm text-gray-500 mt-1 ml-11">
                Manage your account, notifications, privacy, and security
                preferences.
              </p>
            </div>

            <div className="ml-11 sm:ml-0">
              <button
                onClick={() => fetchSettings(true)}
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

        <div className="space-y-6">
          {/* ACCOUNT INFO */}
          <SectionCard
            icon={Hash}
            title="Account Information"
            subtitle="Your registered account details. Contact the registrar if these need updating."
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <InfoField
                icon={Hash}
                label="Student ID"
                value={account.student_id}
              />
              <InfoField
                icon={Mail}
                label="Email Address"
                value={account.email}
              />
              <InfoField
                icon={Phone}
                label="Phone Number"
                value={account.phone}
              />
              <InfoField
                icon={CheckCircle}
                label="Account Status"
                value={account.account_status}
              />
            </div>
          </SectionCard>

          {/* NOTIFICATIONS */}
          <SectionCard
            icon={Bell}
            title="Notification Preferences"
            subtitle="Choose how and when you want to be notified about your account."
          >
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Mail className="w-4 h-4" style={{ color: BRAND.accent }} />
                <h4
                  className="text-xs font-bold uppercase tracking-wider"
                  style={{ color: BRAND.accent }}
                >
                  Email Notifications
                </h4>
              </div>
              <div className="space-y-0">
                <Toggle
                  icon={BookOpen}
                  label="Application Updates"
                  description="Get notified when your applications change status."
                  checked={notifications.email_application_updates}
                  onChange={(v) =>
                    setNotifications((prev) => ({
                      ...prev,
                      email_application_updates: v,
                    }))
                  }
                />
                <Toggle
                  icon={Calendar}
                  label="Unit Registration Updates"
                  description="Updates about your unit registration."
                  checked={notifications.email_unit_registration}
                  onChange={(v) =>
                    setNotifications((prev) => ({
                      ...prev,
                      email_unit_registration: v,
                    }))
                  }
                />
                <Toggle
                  icon={Award}
                  label="Results Published"
                  description="Receive an email when new results are published."
                  checked={notifications.email_results_published}
                  onChange={(v) =>
                    setNotifications((prev) => ({
                      ...prev,
                      email_results_published: v,
                    }))
                  }
                />
                <Toggle
                  icon={Megaphone}
                  label="University Announcements"
                  description="General announcements from the university."
                  checked={notifications.email_announcements}
                  onChange={(v) =>
                    setNotifications((prev) => ({
                      ...prev,
                      email_announcements: v,
                    }))
                  }
                />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <BellRing className="w-4 h-4" style={{ color: BRAND.accent }} />
                <h4
                  className="text-xs font-bold uppercase tracking-wider"
                  style={{ color: BRAND.accent }}
                >
                  Portal Notifications
                </h4>
              </div>
              <div className="space-y-0">
                <Toggle
                  icon={BookOpen}
                  label="Academic Updates"
                  description="In-app academic updates."
                  checked={notifications.portal_academic_updates}
                  onChange={(v) =>
                    setNotifications((prev) => ({
                      ...prev,
                      portal_academic_updates: v,
                    }))
                  }
                />
                <Toggle
                  icon={Calendar}
                  label="Registration Reminders"
                  description="Reminders about upcoming registration windows."
                  checked={notifications.portal_registration_reminders}
                  onChange={(v) =>
                    setNotifications((prev) => ({
                      ...prev,
                      portal_registration_reminders: v,
                    }))
                  }
                />
                <Toggle
                  icon={MessageSquare}
                  label="Application Notifications"
                  description="In-app notifications about your applications."
                  checked={notifications.portal_application_notifications}
                  onChange={(v) =>
                    setNotifications((prev) => ({
                      ...prev,
                      portal_application_notifications: v,
                    }))
                  }
                />
                <Toggle
                  icon={Info}
                  label="System Notifications"
                  description="Important system and maintenance notices."
                  checked={notifications.portal_system_notifications}
                  onChange={(v) =>
                    setNotifications((prev) => ({
                      ...prev,
                      portal_system_notifications: v,
                    }))
                  }
                />
              </div>
            </div>

            <div className="flex justify-end pt-5 mt-5 border-t border-gray-200">
              <button
                type="button"
                onClick={handleSaveNotifications}
                disabled={savingSettings}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white rounded-lg transition-colors shadow-sm disabled:opacity-60"
                style={{ backgroundColor: BRAND.primary }}
                onMouseEnter={(e) => {
                  if (!savingSettings)
                    e.currentTarget.style.backgroundColor = BRAND.primaryDark;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = BRAND.primary;
                }}
              >
                {savingSettings ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {savingSettings ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </SectionCard>

          {/* PASSWORD & SECURITY */}
          <SectionCard
            icon={Lock}
            title="Password & Security"
            subtitle="Change your password anytime. It is saved securely to your account."
          >
            <form
              onSubmit={handleSubmitPwd(handleChangePassword)}
              className="space-y-4"
            >
              <PasswordField
                label="Current Password"
                name="current_password"
                register={registerPwd}
                errors={pwdErrors}
                show={showCurrentPwd}
                onToggle={() => setShowCurrentPwd((v) => !v)}
                placeholder="Enter your current password"
                disabled={changingPassword}
              />
              <PasswordField
                label="New Password"
                name="new_password"
                register={registerPwd}
                errors={pwdErrors}
                show={showNewPwd}
                onToggle={() => setShowNewPwd((v) => !v)}
                placeholder="Enter a new password"
                disabled={changingPassword}
              />
              <PasswordField
                label="Confirm New Password"
                name="confirm_password"
                register={registerPwd}
                errors={pwdErrors}
                show={showConfirmPwd}
                onToggle={() => setShowConfirmPwd((v) => !v)}
                placeholder="Re-enter your new password"
                disabled={changingPassword}
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
                <ul
                  className="text-xs space-y-0.5"
                  style={{ color: BRAND.accent }}
                >
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
                  onMouseEnter={(e) => {
                    if (!changingPassword)
                      e.currentTarget.style.backgroundColor =
                        BRAND.primaryDark;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = BRAND.primary;
                  }}
                >
                  {changingPassword ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Lock className="w-4 h-4" />
                  )}
                  {changingPassword ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </SectionCard>

          {/* SESSION SECURITY */}
          <SectionCard
            icon={Shield}
            title="Session Security"
            subtitle="Review your recent login activity and manage other active sessions."
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
              <InfoField
                icon={Clock}
                label="Last Login"
                value={formatDateTime(sessionInfo.last_login)}
              />
              <InfoField
                icon={Monitor}
                label="Current Device"
                value={sessionInfo.current_device}
              />
              <InfoField
                icon={Globe}
                label="IP Address"
                value={sessionInfo.current_ip}
              />
              <InfoField
                icon={MapPin}
                label="Location"
                value={sessionInfo.current_location}
              />
            </div>

            <div
              className="flex items-center justify-between gap-4 p-3 rounded-lg border"
              style={{
                backgroundColor: BRAND.primarySoft,
                borderColor: BRAND.primaryBorder,
              }}
            >
              <div className="flex items-center gap-3">
                <Smartphone
                  className="w-5 h-5"
                  style={{ color: BRAND.primary }}
                />
                <div>
                  <p
                    className="text-sm font-semibold"
                    style={{ color: BRAND.primaryDark }}
                  >
                    Other Active Sessions
                  </p>
                  <p className="text-xs" style={{ color: BRAND.accent }}>
                    {sessionInfo.other_sessions > 0
                      ? `${sessionInfo.other_sessions} other device(s) currently signed in`
                      : 'No other active sessions'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setLogoutSessionsModal(true)}
                disabled={sessionInfo.other_sessions === 0}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: BRAND.primary }}
                onMouseEnter={(e) => {
                  if (sessionInfo.other_sessions > 0)
                    e.currentTarget.style.backgroundColor =
                      BRAND.primaryDark;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = BRAND.primary;
                }}
              >
                <LogOut className="w-4 h-4" />
                Logout Others
              </button>
            </div>
          </SectionCard>

          {/* PRIVACY */}
          <SectionCard
            icon={Eye}
            title="Privacy Preferences"
            subtitle="Control who can see your profile and academic information."
          >
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Profile Visibility
                </label>
                <select
                  value={privacy.profile_visibility}
                  onChange={(e) =>
                    setPrivacy((p) => ({
                      ...p,
                      profile_visibility: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg outline-none"
                >
                  <option value="Public">Public</option>
                  <option value="University Only">University Only</option>
                  <option value="Advisor Only">Advisor Only</option>
                  <option value="Private">Private</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Controls who can view your basic profile information.
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Academic Information Visibility
                </label>
                <select
                  value={privacy.academic_visibility}
                  onChange={(e) =>
                    setPrivacy((p) => ({
                      ...p,
                      academic_visibility: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg outline-none"
                >
                  <option value="Public">Public</option>
                  <option value="University Only">University Only</option>
                  <option value="Advisor Only">Advisor Only</option>
                  <option value="Private">Private</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Controls visibility of your program, department, and
                  academic year.
                </p>
              </div>

              <div className="pt-2 border-t border-gray-100">
                <Toggle
                  icon={Users}
                  label="Allow Direct Communication"
                  description="Allow other students and staff to contact you through the portal."
                  checked={privacy.allow_communication}
                  onChange={(v) =>
                    setPrivacy((p) => ({ ...p, allow_communication: v }))
                  }
                />
              </div>
            </div>
          </SectionCard>

          {/* DANGER ZONE */}
          <div className="bg-white rounded-xl border-2 border-red-200 overflow-hidden">
            <div className="px-5 py-3 border-b border-red-200 bg-red-50 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <h3 className="text-sm font-semibold uppercase tracking-wider text-red-700">
                Danger Zone
              </h3>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700">
                  The following actions affect your account access. Deactivation
                  requests are reviewed by the university and are not
                  processed automatically.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start gap-3 flex-1">
                  <UserX className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-red-800">
                      Request Account Deactivation
                    </p>
                    <p className="text-xs text-red-700 mt-0.5">
                      Temporarily disable your account. You can reactivate it
                      later by contacting the registrar.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setDeactivationModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors shadow-sm whitespace-nowrap"
                >
                  <AlertTriangle className="w-4 h-4" />
                  Request Deactivation
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2 p-3 bg-gray-100 border border-gray-200 rounded-lg">
            <Info className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-gray-600">
              Some account information (Student ID, program details, account
              status) is managed by the university and cannot be edited here.
              Contact the Registrar's Office for assistance.
            </p>
          </div>
        </div>
      </div>

      {/* MODALS */}
      <ConfirmModal
        open={logoutSessionsModal}
        onClose={() => setLogoutSessionsModal(false)}
        onConfirm={handleLogoutOtherSessions}
        title="Logout Other Sessions?"
        message={`This will immediately sign you out from all other devices where you are currently logged in (${sessionInfo.other_sessions} session${
          sessionInfo.other_sessions === 1 ? '' : 's'
        }). You will remain logged in on this device.`}
        confirmText="Logout Other Sessions"
        loading={loggingOutSessions}
        variant="primary"
      />

      <ConfirmModal
        open={deactivationModal}
        onClose={() => setDeactivationModal(false)}
        onConfirm={handleRequestDeactivation}
        title="Request Account Deactivation?"
        message="Your account will not be deactivated immediately. The university will review your request and contact you via email. You will continue to have access until the request is approved."
        confirmText="Submit Request"
        loading={requestingDeactivation}
        variant="danger"
      />
    </div>
  );
};

export default Settings;