// src/components/StudentPortal.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  GraduationCap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Phone,
  BookOpen,
  Building2,
  IdCard,
  Calendar,
  ShieldCheck,
  ArrowRight,
  Loader2,
  CheckCircle,
  AlertCircle,
  MapPin,
  Globe,
  Users,
  Home,
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
// STATIC OPTIONS
// ============================================================

const PROGRAM_OPTIONS = [
  'Computer Science',
  'Information Science',
  'Information Technology',
  'Business Information Technology',
  'Software Engineering',
  'Other',
];

const DEPARTMENT_OPTIONS = [
  'Computer Science',
  'Information Science',
  'Information Technology',
  'Business',
  'Other',
];

const YEAR_OPTIONS = ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'];
const GENDER_OPTIONS = ['Male', 'Female', 'Other'];

// ============================================================
// VALIDATION SCHEMAS
// ============================================================

const loginSchema = yup.object().shape({
  email: yup
    .string()
    .required('Email address is required.')
    .email('Please enter a valid email address.'),
  password: yup
    .string()
    .required('Password is required.')
    .min(6, 'Password must contain at least 6 characters.'),
});

const signupSchema = yup.object().shape({
  fullName: yup
    .string()
    .required('Full name is required.')
    .min(2, 'Full name must be at least 2 characters.'),
  studentId: yup.string().required('Student ID is required.'),
  admissionNumber: yup.string().required('Admission number is required.'),
  email: yup
    .string()
    .required('Email address is required.')
    .email('Please enter a valid email address.'),
  phone: yup
    .string()
    .required('Phone number is required.')
    .min(10, 'Please enter a valid phone number.'),
  program: yup.string().required('Please select a program.'),
  department: yup.string().required('Please select a department.'),
  yearOfStudy: yup.string().required('Please select your year of study.'),
  password: yup
    .string()
    .required('Password is required.')
    .min(8, 'Password must contain at least 8 characters.'),
  confirmPassword: yup
    .string()
    .required('Please confirm your password.')
    .oneOf([yup.ref('password'), null], 'Passwords do not match.'),
  terms: yup
    .boolean()
    .oneOf([true], 'You must accept the terms and conditions.')
    .required('You must accept the terms and conditions.'),
});

const profileSchema = yup.object().shape({
  dateOfBirth: yup.string().required('Date of birth is required'),
  gender: yup
    .string()
    .required('Gender is required')
    .oneOf(GENDER_OPTIONS, 'Select a valid gender'),
  nationality: yup.string().required('Nationality is required'),
  altPhone: yup.string().nullable(),
  county: yup.string().required('County/State is required'),
  city: yup.string().required('City is required'),
  postalAddress: yup.string().nullable(),
  physicalAddress: yup.string().required('Physical address is required'),
});

// ============================================================
// SHARED INPUT COMPONENTS
// ============================================================

const InputField = ({
  id,
  label,
  type = 'text',
  placeholder,
  icon: Icon,
  error,
  register,
  name,
  rightElement,
  autoComplete,
}) => (
  <div>
    <label
      htmlFor={id}
      className="block text-xs font-semibold text-gray-700 mb-1.5"
    >
      {label}
    </label>
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      )}
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={error ? 'true' : 'false'}
        {...register(name)}
        className={`w-full ${Icon ? 'pl-10' : 'pl-3.5'} ${
          rightElement ? 'pr-10' : 'pr-3.5'
        } py-2.5 text-sm border rounded-lg outline-none transition-all bg-white ${
          error
            ? 'border-red-300 bg-red-50 focus:border-red-400 focus:ring-2 focus:ring-red-100'
            : 'border-gray-300 focus:border-amber-600 focus:ring-2 focus:ring-amber-100'
        }`}
      />
      {rightElement && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {rightElement}
        </div>
      )}
    </div>
    {error && (
      <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
        <AlertCircle className="w-3 h-3 flex-shrink-0" />
        {error.message}
      </p>
    )}
  </div>
);

const SelectField = ({
  id,
  label,
  options,
  placeholder,
  icon: Icon,
  error,
  register,
  name,
}) => (
  <div>
    <label
      htmlFor={id}
      className="block text-xs font-semibold text-gray-700 mb-1.5"
    >
      {label}
    </label>
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      )}
      <select
        id={id}
        aria-invalid={error ? 'true' : 'false'}
        {...register(name)}
        className={`w-full appearance-none ${
          Icon ? 'pl-10' : 'pl-3.5'
        } pr-10 py-2.5 text-sm border rounded-lg outline-none transition-all bg-white ${
          error
            ? 'border-red-300 bg-red-50 focus:border-red-400 focus:ring-2 focus:ring-red-100'
            : 'border-gray-300 focus:border-amber-600 focus:ring-2 focus:ring-amber-100'
        }`}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg
          className="w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
    {error && (
      <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
        <AlertCircle className="w-3 h-3 flex-shrink-0" />
        {error.message}
      </p>
    )}
  </div>
);

// ============================================================
// MAIN COMPONENT
// ============================================================

const StudentPortal = () => {
  const navigate = useNavigate();
  // mode: 'login' | 'signup' | 'complete-profile'
  const [mode, setMode] = useState('login');

  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loginLoading, setLoginLoading] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);

  const [rememberMe, setRememberMe] = useState(false);

  // Holds the account we just created so we can attach the profile to it
  const [pendingAccount, setPendingAccount] = useState(null);

  // ============================================================
  // LOGIN FORM
  // ============================================================
  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
    reset: resetLogin,
  } = useForm({
    resolver: yupResolver(loginSchema),
    mode: 'onBlur',
    defaultValues: { email: '', password: '' },
  });

  const onLogin = async (data) => {
    setLoginLoading(true);
    try {
      const response = await api.get('/accounts', {
        params: {
          email: data.email.trim().toLowerCase(),
          password: data.password,
        },
      });

      const accounts = Array.isArray(response.data) ? response.data : [];

      if (accounts.length === 0) {
        toast.error('Invalid email or password.');
        return;
      }

      const user = accounts[0];

      if (
        user.accountStatus &&
        user.accountStatus.toLowerCase() === 'inactive'
      ) {
        toast.error(
          'Your account is inactive. Please contact administration.'
        );
        return;
      }

      if (user.role !== 'student') {
        toast.error('You are not authorized to access the Student Portal.');
        return;
      }

      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem('user', JSON.stringify(user));
      storage.setItem('isAuthenticated', 'true');

      if (!rememberMe) {
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
      }

      toast.success('Login successful!');
      navigate('/user/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      if (error.code === 'ERR_NETWORK') {
        toast.error(
          'Unable to connect to the server. Make sure JSON Server is running on port 5000.'
        );
      } else {
        toast.error(
          error.response?.data?.message ||
            'Something went wrong. Please try again.'
        );
      }
    } finally {
      setLoginLoading(false);
    }
  };

  // ============================================================
  // SIGNUP FORM
  // ============================================================
  const {
    register: registerSignup,
    handleSubmit: handleSignupSubmit,
    formState: { errors: signupErrors },
    reset: resetSignup,
  } = useForm({
    resolver: yupResolver(signupSchema),
    mode: 'onBlur',
    defaultValues: {
      fullName: '',
      studentId: '',
      admissionNumber: '',
      email: '',
      phone: '',
      program: '',
      department: '',
      yearOfStudy: '',
      password: '',
      confirmPassword: '',
      terms: false,
    },
  });

  const onSignup = async (data) => {
    setSignupLoading(true);
    try {
      const email = data.email.trim().toLowerCase();
      const studentId = data.studentId.trim();
      const admissionNumber = data.admissionNumber.trim();

      // Duplicate checks
      const [emailCheck, idCheck, admCheck] = await Promise.all([
        api.get('/accounts', { params: { email } }),
        api.get('/accounts', { params: { studentId } }),
        api.get('/accounts', { params: { admissionNumber } }),
      ]);

      if (Array.isArray(emailCheck.data) && emailCheck.data.length > 0) {
        toast.error('An account with this email already exists.');
        return;
      }
      if (Array.isArray(idCheck.data) && idCheck.data.length > 0) {
        toast.error('An account with this Student ID already exists.');
        return;
      }
      if (Array.isArray(admCheck.data) && admCheck.data.length > 0) {
        toast.error('An account with this Admission Number already exists.');
        return;
      }

      // Create the account
      const accountData = {
        studentId,
        admissionNumber,
        fullName: data.fullName.trim(),
        email,
        phone: data.phone.trim(),
        program: data.program,
        department: data.department,
        yearOfStudy: data.yearOfStudy,
        password: data.password, // dev-only
        role: 'student',
        accountStatus: 'Active',
        createdAt: new Date().toISOString(),
      };

      const createRes = await api.post('/accounts', accountData);

      if (createRes.status === 201 || createRes.status === 200) {
        const created = createRes.data;
        setPendingAccount(created);

        toast.success(
          'Account created! Now complete your profile to get started.'
        );

        // Move to profile setup step
        resetSignup();
        setMode('complete-profile');
      } else {
        toast.error('Unable to create account. Please try again.');
      }
    } catch (error) {
      console.error('Signup error:', error);
      if (error.code === 'ERR_NETWORK') {
        toast.error(
          'Unable to connect to the server. Make sure JSON Server is running on port 5000.'
        );
      } else {
        toast.error(
          error.response?.data?.message ||
            'Something went wrong. Please try again.'
        );
      }
    } finally {
      setSignupLoading(false);
    }
  };

  // ============================================================
  // PROFILE FORM (Step 3 after signup)
  // ============================================================
  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
    reset: resetProfile,
  } = useForm({
    resolver: yupResolver(profileSchema),
    mode: 'onBlur',
    defaultValues: {
      dateOfBirth: '',
      gender: '',
      nationality: '',
      altPhone: '',
      county: '',
      city: '',
      postalAddress: '',
      physicalAddress: '',
    },
  });

  const onProfileSubmit = async (data) => {
    if (!pendingAccount) {
      toast.error('Session expired. Please login.');
      setMode('login');
      return;
    }

    setProfileLoading(true);
    try {
      const studentKey = pendingAccount.studentId || pendingAccount.id;

      // Check if a profile already exists (in case of retry)
      const existingRes = await api.get('/profiles', {
        params: { studentId: studentKey },
      });
      const existing = Array.isArray(existingRes.data)
        ? existingRes.data[0]
        : null;

      const profilePayload = {
        studentId: studentKey,
        accountId: pendingAccount.id,
        fullName: pendingAccount.fullName,
        dateOfBirth: data.dateOfBirth || null,
        gender: data.gender || null,
        nationality: data.nationality?.trim() || null,
        phone: pendingAccount.phone,
        alternativePhone: data.altPhone?.trim() || null,
        county: data.county?.trim() || null,
        city: data.city?.trim() || null,
        postalAddress: data.postalAddress?.trim() || null,
        physicalAddress: data.physicalAddress?.trim() || null,
        profilePhoto: null,
        updatedAt: new Date().toISOString(),
      };

      if (existing) {
        await api.patch(`/profiles/${existing.id}`, profilePayload);
      } else {
        await api.post('/profiles', {
          ...profilePayload,
          createdAt: new Date().toISOString(),
        });
      }

      toast.success(
        'Profile saved! You can now log in to your Student Portal.'
      );
      resetProfile();
      setPendingAccount(null);
      setMode('login');
      resetLogin({ email: pendingAccount?.email || '', password: '' });
    } catch (error) {
      console.error('Profile setup error:', error);
      if (error.code === 'ERR_NETWORK') {
        toast.error(
          'Unable to connect to the server. Make sure JSON Server is running on port 5000.'
        );
      } else {
        toast.error('Unable to save your profile. Please try again.');
      }
    } finally {
      setProfileLoading(false);
    }
  };

  const skipProfile = () => {
    toast.info(
      'You can complete your profile later from the Profile page.'
    );
    setPendingAccount(null);
    setMode('login');
  };

  const switchToSignup = () => {
    resetLogin();
    setMode('signup');
  };

  const switchToLogin = () => {
    resetSignup();
    resetProfile();
    setPendingAccount(null);
    setMode('login');
  };

  // ============================================================
  // RENDER — LOGIN
  // ============================================================
  const renderLogin = () => (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-600 shadow-lg mb-4">
          <GraduationCap className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">SkillNest</h1>
        <p className="text-xs text-gray-500 mt-1">
          University Learning Management System
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 sm:p-8">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">Welcome Back</h2>
          <p className="text-sm text-gray-500 mt-1">
            Sign in to your SkillNest Student Portal
          </p>
        </div>

        <form
          onSubmit={handleLoginSubmit(onLogin)}
          className="space-y-4"
          noValidate
        >
          <InputField
            id="login-email"
            name="email"
            label="Email Address"
            type="email"
            placeholder="Enter your email address"
            icon={Mail}
            error={loginErrors.email}
            register={registerLogin}
            autoComplete="email"
          />

          <InputField
            id="login-password"
            name="password"
            label="Password"
            type={showLoginPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            icon={Lock}
            error={loginErrors.password}
            register={registerLogin}
            autoComplete="current-password"
            rightElement={
              <button
                type="button"
                onClick={() => setShowLoginPassword((v) => !v)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                tabIndex={-1}
                aria-label={
                  showLoginPassword ? 'Hide password' : 'Show password'
                }
              >
                {showLoginPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            }
          />

          <div className="flex items-center justify-between text-sm">
            <label className="inline-flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
              />
              <span className="text-gray-700">Remember me</span>
            </label>
            <button
              type="button"
              onClick={() =>
                toast.info(
                  'Password reset will be available soon. Please contact support.'
                )
              }
              className="text-amber-700 hover:text-amber-800 font-medium transition-colors"
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loginLoading}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white rounded-lg bg-amber-600 hover:bg-amber-700 active:bg-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loginLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Signing In...
              </>
            ) : (
              <>
                Login to Student Portal
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={switchToSignup}
              className="font-semibold text-amber-700 hover:text-amber-800 transition-colors"
            >
              Create Account
            </button>
          </p>
        </div>
      </div>

      <div className="mt-6 flex items-start gap-2 p-3 rounded-lg bg-amber-50 border border-amber-100">
        <ShieldCheck className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-900 leading-relaxed">
          Your credentials are transmitted securely. Never share your password
          with anyone.
        </p>
      </div>
    </div>
  );

  // ============================================================
  // RENDER — SIGNUP
  // ============================================================
  const renderSignup = () => (
    <div className="w-full max-w-2xl">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-600 shadow-lg mb-3">
          <GraduationCap className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">SkillNest</h1>
        <p className="text-xs text-gray-500 mt-1">
          University Learning Management System
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 sm:p-8">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            Create Student Account
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Step 1 of 2 — Account basics
          </p>
        </div>

        <form
          onSubmit={handleSignupSubmit(onSignup)}
          className="space-y-4"
          noValidate
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              id="signup-fullName"
              name="fullName"
              label="Full Name"
              placeholder="Enter your full name"
              icon={User}
              error={signupErrors.fullName}
              register={registerSignup}
              autoComplete="name"
            />
            <InputField
              id="signup-studentId"
              name="studentId"
              label="Student ID"
              placeholder="Enter your student ID"
              icon={IdCard}
              error={signupErrors.studentId}
              register={registerSignup}
              autoComplete="off"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              id="signup-admissionNumber"
              name="admissionNumber"
              label="Admission Number"
              placeholder="Enter your admission number"
              icon={IdCard}
              error={signupErrors.admissionNumber}
              register={registerSignup}
              autoComplete="off"
            />
            <InputField
              id="signup-email"
              name="email"
              label="Email Address"
              type="email"
              placeholder="Enter your email address"
              icon={Mail}
              error={signupErrors.email}
              register={registerSignup}
              autoComplete="email"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              id="signup-phone"
              name="phone"
              label="Phone Number"
              placeholder="Enter your phone number"
              icon={Phone}
              error={signupErrors.phone}
              register={registerSignup}
              autoComplete="tel"
            />
            <SelectField
              id="signup-program"
              name="program"
              label="Program"
              placeholder="Select Program"
              options={PROGRAM_OPTIONS}
              icon={BookOpen}
              error={signupErrors.program}
              register={registerSignup}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectField
              id="signup-department"
              name="department"
              label="Department"
              placeholder="Select Department"
              options={DEPARTMENT_OPTIONS}
              icon={Building2}
              error={signupErrors.department}
              register={registerSignup}
            />
            <SelectField
              id="signup-yearOfStudy"
              name="yearOfStudy"
              label="Year of Study"
              placeholder="Select Year"
              options={YEAR_OPTIONS}
              icon={Calendar}
              error={signupErrors.yearOfStudy}
              register={registerSignup}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              id="signup-password"
              name="password"
              label="Password"
              type={showSignupPassword ? 'text' : 'password'}
              placeholder="Create a password"
              icon={Lock}
              error={signupErrors.password}
              register={registerSignup}
              autoComplete="new-password"
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowSignupPassword((v) => !v)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex={-1}
                  aria-label={
                    showSignupPassword ? 'Hide password' : 'Show password'
                  }
                >
                  {showSignupPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              }
            />
            <InputField
              id="signup-confirmPassword"
              name="confirmPassword"
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Re-enter your password"
              icon={Lock}
              error={signupErrors.confirmPassword}
              register={registerSignup}
              autoComplete="new-password"
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex={-1}
                  aria-label={
                    showConfirmPassword ? 'Hide password' : 'Show password'
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              }
            />
          </div>

          <p className="text-xs text-gray-500 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-gray-400" />
            Password must be at least 8 characters long.
          </p>

          <div className="pt-2">
            <label className="inline-flex items-start gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                {...registerSignup('terms')}
                className="mt-0.5 w-4 h-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
                aria-invalid={signupErrors.terms ? 'true' : 'false'}
              />
              <span className="text-sm text-gray-700 leading-snug">
                I agree to the{' '}
                <button
                  type="button"
                  onClick={() =>
                    toast.info(
                      'SkillNest terms and conditions will be available soon.'
                    )
                  }
                  className="font-medium text-amber-700 hover:text-amber-800 underline underline-offset-2"
                >
                  SkillNest terms and conditions
                </button>
              </span>
            </label>
            {signupErrors.terms && (
              <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 flex-shrink-0" />
                {signupErrors.terms.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={signupLoading}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white rounded-lg bg-amber-600 hover:bg-amber-700 active:bg-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {signupLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              <>
                Continue to Profile Setup
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <button
              type="button"
              onClick={switchToLogin}
              className="font-semibold text-amber-700 hover:text-amber-800 transition-colors"
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );

  // ============================================================
  // RENDER — COMPLETE PROFILE (post-signup)
  // ============================================================
  const renderCompleteProfile = () => (
    <div className="w-full max-w-2xl">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-600 shadow-lg mb-3">
          <Sparkles className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">
          Complete Your Profile
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Step 2 of 2 — This helps us personalize your experience
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 sm:p-8">
        <div className="mb-6 flex items-start gap-3 p-3 rounded-lg bg-amber-50 border border-amber-100">
          <User className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-900">
              Welcome, {pendingAccount?.fullName || 'Student'}!
            </p>
            <p className="text-xs text-amber-800 mt-0.5">
              Add a few more details to complete your profile. You can update
              these anytime later.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleProfileSubmit(onProfileSubmit)}
          className="space-y-4"
          noValidate
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              id="profile-dateOfBirth"
              name="dateOfBirth"
              label="Date of Birth"
              type="date"
              icon={Calendar}
              error={profileErrors.dateOfBirth}
              register={registerProfile}
            />
            <SelectField
              id="profile-gender"
              name="gender"
              label="Gender"
              placeholder="Select Gender"
              options={GENDER_OPTIONS}
              icon={Users}
              error={profileErrors.gender}
              register={registerProfile}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              id="profile-nationality"
              name="nationality"
              label="Nationality"
              placeholder="e.g., Kenyan"
              icon={Globe}
              error={profileErrors.nationality}
              register={registerProfile}
            />
            <InputField
              id="profile-altPhone"
              name="altPhone"
              label="Alternative Phone (Optional)"
              placeholder="e.g., 0712345678"
              icon={Phone}
              error={profileErrors.altPhone}
              register={registerProfile}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              id="profile-county"
              name="county"
              label="County / State"
              placeholder="e.g., Nairobi"
              icon={MapPin}
              error={profileErrors.county}
              register={registerProfile}
            />
            <InputField
              id="profile-city"
              name="city"
              label="City / Town"
              placeholder="e.g., Westlands"
              icon={MapPin}
              error={profileErrors.city}
              register={registerProfile}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              id="profile-postalAddress"
              name="postalAddress"
              label="Postal Address (Optional)"
              placeholder="P.O. Box 1234"
              icon={Mail}
              error={profileErrors.postalAddress}
              register={registerProfile}
            />
            <InputField
              id="profile-physicalAddress"
              name="physicalAddress"
              label="Physical Address"
              placeholder="Street, building, house number"
              icon={Home}
              error={profileErrors.physicalAddress}
              register={registerProfile}
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              type="button"
              onClick={skipProfile}
              disabled={profileLoading}
              className="w-full sm:w-auto px-5 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Skip for now
            </button>
            <button
              type="submit"
              disabled={profileLoading}
              className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white rounded-lg bg-amber-600 hover:bg-amber-700 active:bg-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {profileLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving Profile...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Save Profile & Continue
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  // ============================================================
  // MAIN RENDER
  // ============================================================
  return (
    <div className="min-h-full bg-gradient-to-br from-gray-50 via-white to-amber-50/40">
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

      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12 sm:py-16">
        {mode === 'login' && renderLogin()}
        {mode === 'signup' && renderSignup()}
        {mode === 'complete-profile' && renderCompleteProfile()}
      </div>
    </div>
  );
};

export default StudentPortal;