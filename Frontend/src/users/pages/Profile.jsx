// src/users/pages/Profile.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  Building2,
  BookOpen,
  Edit,
  Save,
  X,
  Camera,
  Shield,
  CheckCircle,
  AlertCircle,
  Loader2,
  RefreshCw,
  UserCircle,
  Users,
  Globe,
  Home,
  Briefcase,
  Award,
  Layers,
  Hash,
  Clock,
  Lock,
  ChevronRight,
  Info,
  Sparkles,
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

/**
 * The "student key" is whatever we can use to look up both
 * `/accounts` and `/profiles` records. We prefer studentId, then id.
 */
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
// VALIDATION SCHEMA
// ============================================================

const kenyanPhoneRegex = /^(?:\+?254|0)?[17]\d{8}$/;

const profileSchema = yup.object().shape({
  fullName: yup
    .string()
    .required('Full name is required')
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name is too long'),
  dateOfBirth: yup
    .string()
    .nullable()
    .test('not-future', 'Date of birth cannot be in the future', (value) => {
      if (!value) return true;
      return new Date(value) < new Date();
    }),
  gender: yup
    .string()
    .nullable()
    .oneOf(['Male', 'Female', 'Other', ''], 'Select a valid gender'),
  nationality: yup.string().nullable(),
  phone: yup
    .string()
    .required('Phone number is required')
    .matches(kenyanPhoneRegex, 'Enter a valid phone number'),
  alternativePhone: yup
    .string()
    .nullable()
    .transform((v) => (v === '' ? null : v))
    .test(
      'valid-alt-phone',
      'Enter a valid alternative phone number',
      (value) => !value || kenyanPhoneRegex.test(value)
    ),
  email: yup
    .string()
    .required('Email is required')
    .email('Enter a valid email address'),
  county: yup.string().nullable(),
  city: yup.string().nullable(),
  postalAddress: yup.string().nullable(),
  physicalAddress: yup.string().nullable(),
});

// ============================================================
// UTILITY
// ============================================================

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return 'N/A';
  }
};

const getInitials = (name) => {
  if (!name) return 'ST';
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.charAt(0) || '';
  const last = parts[parts.length - 1]?.charAt(0) || '';
  return `${first}${last}`.toUpperCase() || 'ST';
};

// ============================================================
// SUB-COMPONENTS
// ============================================================

const ProfileSkeleton = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
    <div className="animate-pulse space-y-6">
      <div className="h-10 bg-gray-200 rounded w-64" />
      <div className="h-4 bg-gray-200 rounded w-80" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-1 h-80 bg-gray-200 rounded-xl" />
        <div className="lg:col-span-2 h-80 bg-gray-200 rounded-xl" />
      </div>
      <div className="h-96 bg-gray-200 rounded-xl" />
    </div>
  </div>
);

/**
 * Empty state — shown when there is NO profile record AND
 * we can't determine an account either. Offers to create a profile.
 */
const EmptyState = ({ onCreate, onRetry }) => (
  <div className="max-w-2xl mx-auto px-4 py-20 text-center">
    <div
      className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
      style={{ backgroundColor: BRAND.primarySoft }}
    >
      <UserCircle className="w-10 h-10" style={{ color: BRAND.primary }} />
    </div>
    <h2 className="text-xl font-bold text-gray-900 mb-2">
      No Profile Yet
    </h2>
    <p className="text-sm text-gray-500 mb-6">
      You haven't set up your profile yet. Create it now to personalize your
      student portal experience. You can edit it anytime afterwards.
    </p>
    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
      <button
        onClick={onCreate}
        className="inline-flex items-center gap-2 px-5 py-2.5 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm"
        style={{ backgroundColor: BRAND.primary }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor = BRAND.primaryDark)
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = BRAND.primary)
        }
      >
        <Edit className="w-4 h-4" />
        Create Profile
      </button>
      <button
        onClick={onRetry}
        className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <RefreshCw className="w-4 h-4" />
        Refresh
      </button>
    </div>
  </div>
);

const InfoField = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
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

const FormField = ({
  label,
  name,
  register,
  errors,
  type = 'text',
  placeholder,
  options = null,
  required = false,
  disabled = false,
  icon: Icon,
  multiline = false,
}) => {
  const error = errors[name];
  const inputClasses = `w-full px-3 py-2.5 text-sm border rounded-lg outline-none transition-all ${
    error ? 'border-red-300 bg-red-50' : 'border-gray-300'
  } ${disabled ? 'bg-gray-100 cursor-not-allowed text-gray-500' : 'bg-white'}`;

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
          <Icon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
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
        ) : multiline ? (
          <textarea
            {...register(name)}
            placeholder={placeholder}
            disabled={disabled}
            rows={3}
            className={`${inputClasses} ${Icon ? 'pl-10' : ''} resize-none`}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
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
// MAIN COMPONENT
// ============================================================

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [profile, setProfile] = useState(null);
  const [account, setAccount] = useState(null);
  const [profileId, setProfileId] = useState(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const fileInputRef = useRef(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(profileSchema),
    mode: 'onChange',
    defaultValues: {
      fullName: '',
      dateOfBirth: '',
      gender: '',
      nationality: '',
      phone: '',
      alternativePhone: '',
      email: '',
      county: '',
      city: '',
      postalAddress: '',
      physicalAddress: '',
    },
  });

  // ============================================================
  // CORE: fetch account + profile from JSON Server
  // ============================================================

  const fetchProfile = useCallback(
    async (showRefresh = false) => {
      if (showRefresh) setRefreshing(true);
      else setLoading(true);

      try {
        const student = getCurrentStudent();
        if (!student) {
          setProfile(null);
          setAccount(null);
          setLoading(false);
          setRefreshing(false);
          return;
        }

        const studentKey = getStudentKey(student);

        // ----- 1) Find the account (by numeric id or by studentId) -----
        let accountData = null;
        try {
          if (student.id) {
            const accRes = await api.get(`/accounts/${student.id}`);
            if (accRes.data && !Array.isArray(accRes.data)) {
              accountData = accRes.data;
            }
          }
        } catch {
          // ignore, fall through to query
        }
        if (!accountData && studentKey) {
          try {
            const accRes = await api.get('/accounts', {
              params: { studentId: studentKey },
            });
            const arr = Array.isArray(accRes.data) ? accRes.data : [];
            accountData = arr[0] || null;
          } catch {
            accountData = null;
          }
        }

        // ----- 2) Find the profile record -----
        let profileData = null;
        if (studentKey) {
          try {
            const profRes = await api.get('/profiles', {
              params: { studentId: studentKey },
            });
            const arr = Array.isArray(profRes.data) ? profRes.data : [];
            profileData = arr[0] || null;
          } catch {
            profileData = null;
          }
        }

        // ----- 3) Build merged view (works even without a profile) -----
        const merged = {
          id: profileData?.id || null,
          accountId: accountData?.id || null,
          studentId:
            accountData?.studentId ||
            profileData?.studentId ||
            student.studentId ||
            '',

          // personal
          fullName:
            profileData?.fullName ||
            accountData?.fullName ||
            student.fullName ||
            '',
          dateOfBirth: profileData?.dateOfBirth || '',
          gender: profileData?.gender || '',
          nationality: profileData?.nationality || '',

          // contact
          phone:
            profileData?.phone || accountData?.phone || student.phone || '',
          alternativePhone: profileData?.alternativePhone || '',
          email:
            accountData?.email || profileData?.email || student.email || '',
          county: profileData?.county || '',
          city: profileData?.city || '',
          postalAddress: profileData?.postalAddress || '',
          physicalAddress: profileData?.physicalAddress || '',

          // academic (read-only in UI)
          admissionNumber: accountData?.admissionNumber || '',
          program: accountData?.program || '',
          department: accountData?.department || '',
          faculty: accountData?.faculty || '',
          studyLevel: accountData?.studyLevel || accountData?.program || '',
          yearOfStudy: accountData?.yearOfStudy || '',
          academicYear: accountData?.academicYear || '',

          // photo + status
          profilePhoto:
            profileData?.profilePhoto || accountData?.profilePhoto || '',
          accountStatus:
            accountData?.accountStatus || accountData?.status || 'Active',

          // flag: no profile record exists yet
          _isNew: !profileData,
        };

        setAccount(accountData);
        setProfile(merged);
        setProfileId(profileData?.id || null);

        // ----- 4) Prime the form -----
        reset({
          fullName: merged.fullName || '',
          dateOfBirth: merged.dateOfBirth
            ? new Date(merged.dateOfBirth).toISOString().split('T')[0]
            : '',
          gender: merged.gender || '',
          nationality: merged.nationality || '',
          phone: merged.phone || '',
          alternativePhone: merged.alternativePhone || '',
          email: merged.email || '',
          county: merged.county || '',
          city: merged.city || '',
          postalAddress: merged.postalAddress || '',
          physicalAddress: merged.physicalAddress || '',
        });

        if (showRefresh) toast.success('Profile refreshed successfully');
      } catch (error) {
        console.error('Error fetching profile:', error);
        setProfile(null);
        if (!error.response) {
          toast.error(
            'Unable to reach the server. Make sure JSON Server is running on port 5000.'
          );
        } else {
          toast.error('Unable to load your profile. Please try again.');
        }
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [reset]
  );

  // ============================================================
  // SAVE PROFILE — upsert into /profiles, update email in /accounts
  // ============================================================

  const handleSaveProfile = async (data) => {
    setSaving(true);
    try {
      const student = getCurrentStudent();
      const studentKey = getStudentKey(student);

      const profilePayload = {
        studentId: studentKey,
        accountId: account?.id || null,
        fullName: data.fullName?.trim() || '',
        dateOfBirth: data.dateOfBirth || null,
        gender: data.gender || null,
        nationality: data.nationality?.trim() || null,
        phone: data.phone?.trim() || '',
        alternativePhone: data.alternativePhone?.trim() || null,
        county: data.county?.trim() || null,
        city: data.city?.trim() || null,
        postalAddress: data.postalAddress?.trim() || null,
        physicalAddress: data.physicalAddress?.trim() || null,
        updatedAt: new Date().toISOString(),
      };

      // ----- 1) Upsert the profile record -----
      if (profileId) {
        // Try PATCH first
        try {
          await api.patch(`/profiles/${profileId}`, profilePayload);
        } catch (patchErr) {
          console.warn('PATCH /profiles failed, trying PUT:', patchErr);
          await api.put(`/profiles/${profileId}`, {
            ...profilePayload,
            id: profileId,
            createdAt: profile?.createdAt || new Date().toISOString(),
          });
        }
      } else {
        // No profile yet — create it, then remember its id
        const created = await api.post('/profiles', {
          ...profilePayload,
          createdAt: new Date().toISOString(),
        });
        if (created.data?.id) setProfileId(created.data.id);
      }

      // ----- 2) Update email on the account if changed -----
      const newEmail = data.email?.trim().toLowerCase();
      if (account?.id && newEmail && newEmail !== account.email) {
        try {
          await api.patch(`/accounts/${account.id}`, {
            email: newEmail,
            updatedAt: new Date().toISOString(),
          });
        } catch (accErr) {
          console.warn('Could not update account email:', accErr);
        }
      }

      toast.success(
        profile._isNew
          ? 'Profile created successfully.'
          : 'Profile updated successfully.'
      );
      setEditing(false);

      // ----- 3) Re-fetch to guarantee DB sync -----
      await fetchProfile(true);
    } catch (error) {
      console.error('Error saving profile:', error);
      if (!error.response) {
        toast.error(
          'Network error. Make sure JSON Server is running on port 5000.'
        );
      } else {
        toast.error(
          error.response?.data?.message ||
            'Unable to update your profile. Please try again.'
        );
      }
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    if (profile) {
      reset({
        fullName: profile.fullName || '',
        dateOfBirth: profile.dateOfBirth
          ? new Date(profile.dateOfBirth).toISOString().split('T')[0]
          : '',
        gender: profile.gender || '',
        nationality: profile.nationality || '',
        phone: profile.phone || '',
        alternativePhone: profile.alternativePhone || '',
        email: profile.email || '',
        county: profile.county || '',
        city: profile.city || '',
        postalAddress: profile.postalAddress || '',
        physicalAddress: profile.physicalAddress || '',
      });
    }
    setEditing(false);
  };

  // ============================================================
  // PHOTO UPLOAD — stored as data URL on profile record
  // ============================================================

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Only JPEG, PNG, or WEBP images are allowed.');
      return;
    }
    // JSON Server stores base64 — keep it small
    if (file.size > 1.5 * 1024 * 1024) {
      toast.error('Image size must be less than 1.5MB (stored inline).');
      return;
    }

    setSelectedPhoto(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      setPhotoPreview(e.target.result);
      setPhotoModalOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadPhoto = async () => {
    if (!photoPreview || !profile) return;

    setUploadingPhoto(true);
    try {
      const student = getCurrentStudent();
      const studentKey = getStudentKey(student);

      const payload = {
        studentId: studentKey,
        accountId: account?.id || null,
        fullName: profile.fullName,
        profilePhoto: photoPreview,
        updatedAt: new Date().toISOString(),
      };

      if (profileId) {
        try {
          await api.patch(`/profiles/${profileId}`, payload);
        } catch {
          await api.put(`/profiles/${profileId}`, {
            ...profile,
            ...payload,
            id: profileId,
          });
        }
      } else {
        // If no profile exists yet, create a full record
        const created = await api.post('/profiles', {
          studentId: studentKey,
          accountId: account?.id || null,
          fullName: profile.fullName,
          dateOfBirth: profile.dateOfBirth || null,
          gender: profile.gender || null,
          nationality: profile.nationality || null,
          phone: profile.phone || '',
          alternativePhone: profile.alternativePhone || null,
          county: profile.county || null,
          city: profile.city || null,
          postalAddress: profile.postalAddress || null,
          physicalAddress: profile.physicalAddress || null,
          profilePhoto: photoPreview,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        if (created.data?.id) setProfileId(created.data.id);
      }

      setProfile((prev) => ({ ...prev, profilePhoto: photoPreview }));
      toast.success('Profile photo updated successfully.');
      setPhotoModalOpen(false);
      setSelectedPhoto(null);
      setPhotoPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = '';

      // Refresh from DB
      await fetchProfile();
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast.error('Unable to update profile photo.');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleCancelPhoto = () => {
    setPhotoModalOpen(false);
    setSelectedPhoto(null);
    setPhotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSecuritySettings = () => {
    window.location.href = '/user/settings';
  };

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const fullName = profile?.fullName || 'Student';
  const initials = getInitials(profile?.fullName);
  const genderOptions = ['Male', 'Female', 'Other'];

  // ============================================================
  // RENDER — LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ToastContainer position="top-right" autoClose={4000} theme="light" />
        <ProfileSkeleton />
      </div>
    );
  }

  // ============================================================
  // RENDER — NO PROFILE AT ALL
  // ============================================================

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ToastContainer position="top-right" autoClose={4000} theme="light" />
        <EmptyState
          onRetry={() => fetchProfile()}
          onCreate={() => {
            // Seed a minimal profile so the page renders in edit mode
            const student = getCurrentStudent();
            setProfile({
              id: null,
              accountId: null,
              studentId: student?.studentId || '',
              fullName: student?.fullName || '',
              dateOfBirth: '',
              gender: '',
              nationality: '',
              phone: student?.phone || '',
              alternativePhone: '',
              email: student?.email || '',
              county: '',
              city: '',
              postalAddress: '',
              physicalAddress: '',
              admissionNumber: student?.admissionNumber || '',
              program: student?.program || '',
              department: student?.department || '',
              faculty: '',
              studyLevel: '',
              yearOfStudy: student?.yearOfStudy || '',
              academicYear: '',
              profilePhoto: '',
              accountStatus: 'Active',
              _isNew: true,
            });
            reset({
              fullName: student?.fullName || '',
              dateOfBirth: '',
              gender: '',
              nationality: '',
              phone: student?.phone || '',
              alternativePhone: '',
              email: student?.email || '',
              county: '',
              city: '',
              postalAddress: '',
              physicalAddress: '',
            });
            setEditing(true);
          }}
        />
      </div>
    );
  }

  // ============================================================
  // RENDER — MAIN VIEW
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
                  <UserCircle
                    className="w-6 h-6"
                    style={{ color: BRAND.primary }}
                  />
                </div>
                My Profile
              </h1>
              <p className="text-sm text-gray-500 mt-1 ml-11">
                View and manage your personal and academic information.
              </p>
            </div>

            <div className="flex items-center gap-2 ml-11 sm:ml-0">
              <button
                onClick={() => fetchProfile(true)}
                disabled={refreshing}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <RefreshCw
                  className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`}
                />
                <span className="hidden sm:inline">Refresh</span>
              </button>
              <button
                onClick={handleSecuritySettings}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Shield className="w-4 h-4" />
                <span className="hidden sm:inline">Security Settings</span>
                <span className="sm:hidden">Security</span>
              </button>
            </div>
          </div>
        </div>

        {/* NEW PROFILE BANNER */}
        {profile._isNew && (
          <div
            className="mb-6 flex items-start gap-3 p-4 rounded-xl border"
            style={{
              backgroundColor: BRAND.primarySoft,
              borderColor: BRAND.primaryBorder,
            }}
          >
            <Sparkles
              className="w-5 h-5 flex-shrink-0 mt-0.5"
              style={{ color: BRAND.primary }}
            />
            <div>
              <p
                className="text-sm font-semibold"
                style={{ color: BRAND.primaryDark }}
              >
                You're creating your profile
              </p>
              <p
                className="text-xs mt-0.5 leading-relaxed"
                style={{ color: BRAND.accent }}
              >
                Fill in your personal details below and click{' '}
                <span className="font-semibold">Save Changes</span> to create
                your profile. You can edit it anytime afterwards.
              </p>
            </div>
          </div>
        )}

        {/* PROFILE HEADER CARD */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
          <div
            className="h-24"
            style={{
              background: `linear-gradient(135deg, ${BRAND.primary} 0%, ${BRAND.accent} 100%)`,
            }}
          />
          <div className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div
                  className="w-28 h-28 rounded-full overflow-hidden bg-white flex items-center justify-center border-4"
                  style={{ borderColor: '#ffffff' }}
                >
                  {profile.profilePhoto ? (
                    <img
                      src={profile.profilePhoto}
                      alt={fullName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement.innerHTML = `<span class="text-3xl font-bold" style="color: ${BRAND.primary}">${initials}</span>`;
                      }}
                    />
                  ) : (
                    <span
                      className="text-3xl font-bold"
                      style={{ color: BRAND.primary }}
                    >
                      {initials}
                    </span>
                  )}
                </div>
                <button
                  onClick={handlePhotoClick}
                  className="absolute bottom-0 right-0 p-2 rounded-full shadow-lg border-2 border-white transition-colors"
                  style={{ backgroundColor: BRAND.primary }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = BRAND.primaryDark)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = BRAND.primary)
                  }
                  title="Change Profile Photo"
                >
                  <Camera className="w-4 h-4 text-white" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  className="hidden"
                  onChange={handlePhotoChange}
                />
              </div>

              {/* Name + meta */}
              <div className="flex-1 min-w-0 sm:pb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                    {fullName}
                  </h2>
                  {!profile._isNew && (
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                        String(profile.accountStatus).toLowerCase() === 'active'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-red-50 text-red-700 border-red-200'
                      }`}
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      {profile.accountStatus || 'Active'}
                    </span>
                  )}
                  {profile._isNew && (
                    <span
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border"
                      style={{
                        color: BRAND.primary,
                        borderColor: BRAND.primaryBorder,
                        backgroundColor: BRAND.primarySoft,
                      }}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      New
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 flex-wrap mt-2 text-sm text-gray-600">
                  {profile.studentId && (
                    <span className="inline-flex items-center gap-1.5">
                      <Hash className="w-4 h-4 text-gray-400" />
                      {profile.studentId}
                    </span>
                  )}
                  {profile.program && (
                    <span className="inline-flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-gray-400" />
                      {profile.program}
                    </span>
                  )}
                  {profile.department && (
                    <span className="inline-flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-gray-400" />
                      {profile.department}
                    </span>
                  )}
                  {profile.yearOfStudy && (
                    <span className="inline-flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-gray-400" />
                      {profile.yearOfStudy}
                    </span>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 sm:pb-2">
                {!editing ? (
                  <button
                    onClick={() => setEditing(true)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white rounded-lg transition-colors shadow-sm"
                    style={{ backgroundColor: BRAND.primary }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        BRAND.primaryDark)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = BRAND.primary)
                    }
                  >
                    <Edit className="w-4 h-4" />
                    Edit Profile
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleCancelEdit}
                      disabled={saving}
                      className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmit(handleSaveProfile)}
                      disabled={saving}
                      className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white rounded-lg transition-colors shadow-sm disabled:opacity-60"
                      style={{ backgroundColor: BRAND.primary }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor =
                          BRAND.primaryDark)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = BRAND.primary)
                      }
                    >
                      {saving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      {saving
                        ? 'Saving...'
                        : profile._isNew
                        ? 'Create Profile'
                        : 'Save Changes'}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT GRID */}
        <form onSubmit={handleSubmit(handleSaveProfile)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* LEFT COLUMN */}
            <div className="lg:col-span-2 space-y-6">
              {/* PERSONAL INFORMATION */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div
                  className="px-5 py-3 border-b border-gray-200 flex items-center justify-between"
                  style={{ backgroundColor: BRAND.primarySoft }}
                >
                  <h3
                    className="text-sm font-semibold uppercase tracking-wider flex items-center gap-2"
                    style={{ color: BRAND.primaryDark }}
                  >
                    <User className="w-4 h-4" />
                    Personal Information
                  </h3>
                  {editing && (
                    <span
                      className="text-xs font-medium px-2 py-0.5 rounded-full bg-white border"
                      style={{
                        color: BRAND.primary,
                        borderColor: BRAND.primaryBorder,
                      }}
                    >
                      Editing
                    </span>
                  )}
                </div>
                <div className="p-5">
                  {editing ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <FormField
                          label="Full Name"
                          name="fullName"
                          register={register}
                          errors={errors}
                          required
                          icon={User}
                          placeholder="Enter your full name"
                        />
                      </div>
                      <FormField
                        label="Date of Birth"
                        name="dateOfBirth"
                        register={register}
                        errors={errors}
                        type="date"
                        icon={Calendar}
                      />
                      <FormField
                        label="Gender"
                        name="gender"
                        register={register}
                        errors={errors}
                        options={genderOptions}
                        icon={Users}
                      />
                      <div className="sm:col-span-2">
                        <FormField
                          label="Nationality"
                          name="nationality"
                          register={register}
                          errors={errors}
                          icon={Globe}
                          placeholder="e.g., Kenyan"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                      <div className="sm:col-span-2">
                        <InfoField
                          icon={User}
                          label="Full Name"
                          value={profile.fullName}
                        />
                      </div>
                      <InfoField
                        icon={Calendar}
                        label="Date of Birth"
                        value={formatDate(profile.dateOfBirth)}
                      />
                      <InfoField
                        icon={Users}
                        label="Gender"
                        value={profile.gender}
                      />
                      <InfoField
                        icon={Globe}
                        label="Nationality"
                        value={profile.nationality}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* CONTACT INFORMATION */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div
                  className="px-5 py-3 border-b border-gray-200"
                  style={{ backgroundColor: BRAND.primarySoft }}
                >
                  <h3
                    className="text-sm font-semibold uppercase tracking-wider flex items-center gap-2"
                    style={{ color: BRAND.primaryDark }}
                  >
                    <Phone className="w-4 h-4" />
                    Contact Information
                  </h3>
                </div>
                <div className="p-5">
                  {editing ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        label="Phone Number"
                        name="phone"
                        register={register}
                        errors={errors}
                        required
                        icon={Phone}
                        placeholder="e.g., 0712345678"
                      />
                      <FormField
                        label="Alternative Phone"
                        name="alternativePhone"
                        register={register}
                        errors={errors}
                        icon={Phone}
                        placeholder="Optional"
                      />
                      <div className="sm:col-span-2">
                        <FormField
                          label="Email Address"
                          name="email"
                          register={register}
                          errors={errors}
                          type="email"
                          required
                          icon={Mail}
                          placeholder="you@example.com"
                        />
                      </div>
                      <FormField
                        label="County / State"
                        name="county"
                        register={register}
                        errors={errors}
                        icon={MapPin}
                        placeholder="e.g., Nairobi"
                      />
                      <FormField
                        label="City"
                        name="city"
                        register={register}
                        errors={errors}
                        icon={MapPin}
                        placeholder="e.g., Westlands"
                      />
                      <FormField
                        label="Postal Address"
                        name="postalAddress"
                        register={register}
                        errors={errors}
                        icon={Mail}
                        placeholder="P.O. Box 1234"
                      />
                      <div className="sm:col-span-2">
                        <FormField
                          label="Physical Address"
                          name="physicalAddress"
                          register={register}
                          errors={errors}
                          icon={Home}
                          placeholder="Street, building, house number"
                          multiline
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                      <InfoField
                        icon={Phone}
                        label="Phone Number"
                        value={profile.phone}
                      />
                      <InfoField
                        icon={Phone}
                        label="Alternative Phone"
                        value={profile.alternativePhone}
                      />
                      <InfoField
                        icon={Mail}
                        label="Email Address"
                        value={profile.email}
                      />
                      <InfoField
                        icon={MapPin}
                        label="County / State"
                        value={profile.county}
                      />
                      <InfoField
                        icon={MapPin}
                        label="City"
                        value={profile.city}
                      />
                      <InfoField
                        icon={Mail}
                        label="Postal Address"
                        value={profile.postalAddress}
                      />
                      <div className="sm:col-span-2">
                        <InfoField
                          icon={Home}
                          label="Physical Address"
                          value={profile.physicalAddress}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div
                  className="px-5 py-3 border-b border-gray-200 flex items-center justify-between"
                  style={{ backgroundColor: BRAND.primarySoft }}
                >
                  <h3
                    className="text-sm font-semibold uppercase tracking-wider flex items-center gap-2"
                    style={{ color: BRAND.primaryDark }}
                  >
                    <GraduationCap className="w-4 h-4" />
                    Academic Information
                  </h3>
                  <span
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white border"
                    style={{
                      color: BRAND.accent,
                      borderColor: BRAND.primaryBorder,
                    }}
                    title="Academic information is maintained by the university"
                  >
                    <Lock className="w-3 h-3" />
                    Read-only
                  </span>
                </div>
                <div className="p-5 space-y-1">
                  <InfoField
                    icon={Hash}
                    label="Student ID"
                    value={profile.studentId}
                  />
                  <InfoField
                    icon={Hash}
                    label="Admission Number"
                    value={profile.admissionNumber}
                  />
                  <InfoField
                    icon={BookOpen}
                    label="Program"
                    value={profile.program}
                  />
                  <InfoField
                    icon={Building2}
                    label="Department"
                    value={profile.department}
                  />
                  <InfoField
                    icon={Building2}
                    label="Faculty"
                    value={profile.faculty}
                  />
                  <InfoField
                    icon={Briefcase}
                    label="Study Level"
                    value={profile.studyLevel}
                  />
                  <InfoField
                    icon={Layers}
                    label="Year of Study"
                    value={profile.yearOfStudy}
                  />
                  <InfoField
                    icon={Calendar}
                    label="Academic Year"
                    value={profile.academicYear}
                  />
                </div>
              </div>

              {/* Helpful info */}
              <div
                className="rounded-xl border p-4"
                style={{
                  backgroundColor: BRAND.primarySoft,
                  borderColor: BRAND.primaryBorder,
                }}
              >
                <div className="flex items-start gap-3">
                  <Info
                    className="w-5 h-5 flex-shrink-0 mt-0.5"
                    style={{ color: BRAND.primary }}
                  />
                  <div>
                    <p
                      className="text-sm font-semibold"
                      style={{ color: BRAND.primaryDark }}
                    >
                      Need to update academic details?
                    </p>
                    <p
                      className="text-xs mt-1 leading-relaxed"
                      style={{ color: BRAND.accent }}
                    >
                      Academic information such as program, department, and
                      year of study can only be changed by the university
                      registrar. Please visit the Registrar's Office if you
                      notice any discrepancies.
                    </p>
                  </div>
                </div>
              </div>

              {/* Security card */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div
                  className="px-5 py-3 border-b border-gray-200"
                  style={{ backgroundColor: BRAND.primarySoft }}
                >
                  <h3
                    className="text-sm font-semibold uppercase tracking-wider flex items-center gap-2"
                    style={{ color: BRAND.primaryDark }}
                  >
                    <Shield className="w-4 h-4" />
                    Account Security
                  </h3>
                </div>
                <div className="p-5">
                  <p className="text-xs text-gray-600 mb-4">
                    Manage your password, two-factor authentication, and
                    active sessions.
                  </p>
                  <button
                    type="button"
                    onClick={handleSecuritySettings}
                    className="w-full inline-flex items-center justify-between gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg border transition-colors"
                    style={{
                      color: BRAND.primary,
                      borderColor: BRAND.primaryBorder,
                      backgroundColor: '#ffffff',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor =
                        BRAND.primarySoft;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#ffffff';
                    }}
                  >
                    <span className="inline-flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      Security Settings
                    </span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Save Bar (mobile) */}
          {editing && (
            <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 sm:hidden">
              <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-full shadow-2xl border border-gray-200">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  disabled={saving}
                  className="px-4 py-2 text-sm font-medium text-gray-700 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white rounded-full transition-colors shadow-sm disabled:opacity-60"
                  style={{ backgroundColor: BRAND.primary }}
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>

      {/* PHOTO MODAL */}
      {photoModalOpen && photoPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
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
                  <Camera
                    className="w-5 h-5"
                    style={{ color: BRAND.primary }}
                  />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Update Profile Photo
                  </h2>
                  <p className="text-xs text-gray-500">
                    Preview your new photo
                  </p>
                </div>
              </div>
              <button
                onClick={handleCancelPhoto}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                disabled={uploadingPhoto}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 flex justify-center">
              <div
                className="w-40 h-40 rounded-full overflow-hidden border-4"
                style={{ borderColor: BRAND.primary }}
              >
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 p-5 border-t border-gray-200 bg-gray-50">
              <button
                onClick={handleCancelPhoto}
                disabled={uploadingPhoto}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUploadPhoto}
                disabled={uploadingPhoto}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white rounded-lg transition-colors shadow-sm disabled:opacity-60"
                style={{ backgroundColor: BRAND.primary }}
                onMouseEnter={(e) => {
                  if (!uploadingPhoto)
                    e.currentTarget.style.backgroundColor = BRAND.primaryDark;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = BRAND.primary;
                }}
              >
                {uploadingPhoto ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Photo
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;