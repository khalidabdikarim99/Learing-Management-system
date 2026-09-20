// src/Admin/pages/Applications.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  FileText,
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Download,
  RefreshCw,
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Building2,
  BookOpen,
  GraduationCap,
  FileCheck,
  FileX,
  FileWarning,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ArrowRight,
  Edit3,
  Send,
  FileDown,
  Hash,
  Globe,
  Home,
  Award,
  Layers,
  Info,
  AlertTriangle,
  MessageSquare,
  Paperclip,
  Briefcase,
  Users,
  MoreVertical,
} from 'lucide-react';

// ============================================================
// API CONFIGURATION — JSON SERVER
// ============================================================

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
// CONSTANTS — Status & Type Config
// ============================================================

const STATUSES = [
  'Draft',
  'Submitted',
  'Under Review',
  'Approved',
  'Rejected',
  'Requires Correction',
];

const STATUS_CONFIG = {
  Draft: {
    bg: 'bg-gray-50',
    text: 'text-gray-700',
    border: 'border-gray-200',
    icon: FileText,
    dot: 'bg-gray-500',
  },
  Submitted: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    icon: Send,
    dot: 'bg-blue-500',
  },
  'Under Review': {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    icon: Clock,
    dot: 'bg-amber-500',
  },
  Approved: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    icon: CheckCircle,
    dot: 'bg-emerald-500',
  },
  Rejected: {
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
    icon: XCircle,
    dot: 'bg-red-500',
  },
  'Requires Correction': {
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    border: 'border-orange-200',
    icon: FileWarning,
    dot: 'bg-orange-500',
  },
};

const APPLICATION_TYPES = [
  'Undergraduate',
  'Postgraduate',
  'Diploma',
  'Certificate',
  'New Application',
  'Change of Program',
  'Change of Course',
  'Deferment',
  'Interruption of Studies',
  'Reinstatement',
  'Transfer',
  'Graduation',
  'Transcript Request',
];

const ITEMS_PER_PAGE = 10;

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

const StatCard = ({ icon: Icon, label, value, accent, active, onClick }) => {
  const accentMap = {
    brown: { bg: 'bg-[#F5EFE6]', text: 'text-[#6B4423]', bar: 'bg-[#6B4423]' },
    tan: { bg: 'bg-[#F5EFE6]', text: 'text-[#8B5E34]', bar: 'bg-[#8B5E34]' },
    gray: { bg: 'bg-gray-100', text: 'text-gray-600', bar: 'bg-gray-500' },
    blue: { bg: 'bg-blue-50', text: 'text-blue-600', bar: 'bg-blue-500' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-600', bar: 'bg-amber-500' },
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', bar: 'bg-emerald-500' },
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
        <div className="h-4 bg-gray-200 rounded w-28" />
        <div className="h-4 bg-gray-200 rounded w-40" />
        <div className="h-4 bg-gray-200 rounded w-24" />
        <div className="h-4 bg-gray-200 rounded w-20" />
        <div className="h-4 bg-gray-200 rounded w-24" />
      </div>
    ))}
  </div>
);

const EmptyState = ({ filtered }) => (
  <div className="flex flex-col items-center justify-center py-16 px-4">
    <div
      className="w-20 h-20 rounded-full flex items-center justify-center mb-5"
      style={{ backgroundColor: BRAND.primarySoft }}
    >
      {filtered ? (
        <Search className="w-10 h-10" style={{ color: BRAND.primary }} />
      ) : (
        <FileText className="w-10 h-10" style={{ color: BRAND.primary }} />
      )}
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">
      {filtered ? 'No Matching Applications' : 'No Applications Yet'}
    </h3>
    <p className="text-sm text-gray-500 text-center max-w-md">
      {filtered
        ? 'No applications match your current search or filter criteria. Try adjusting your filters.'
        : 'Student applications will appear here once submitted.'}
    </p>
  </div>
);

// ============================================================
// APPLICATION DETAIL MODAL
// ============================================================

const ApplicationDetailModal = ({ open, onClose, application, loading }) => {
  const [activeTab, setActiveTab] = useState('details');

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

  const renderTimeline = () => {
    if (!application) return null;
    const statusOrder = ['Draft', 'Submitted', 'Under Review'];
    const finalStatuses = ['Approved', 'Rejected', 'Requires Correction'];
    const currentStatus = application.status;
    const isFinal = finalStatuses.includes(currentStatus);
    const currentIdx = statusOrder.indexOf(currentStatus);

    return (
      <div className="p-5">
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-4">
          {statusOrder.map((s, idx) => {
            const completed = isFinal || idx <= currentIdx;
            const isCurrent = !isFinal && idx === currentIdx;
            const Icon = STATUS_CONFIG[s]?.icon || FileText;
            return (
              <React.Fragment key={s}>
                <div className="flex flex-col items-center gap-2 min-w-[80px]">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                      completed
                        ? 'text-white border-transparent'
                        : 'bg-white border-gray-300 text-gray-400'
                    }`}
                    style={completed ? { backgroundColor: BRAND.primary } : {}}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span
                    className={`text-xs font-medium text-center ${
                      isCurrent ? 'font-bold' : ''
                    }`}
                    style={isCurrent ? { color: BRAND.primary } : {}}
                  >
                    {s}
                  </span>
                </div>
                {idx < statusOrder.length - 1 && (
                  <ArrowRight
                    className="w-5 h-5 flex-shrink-0"
                    style={{
                      color:
                        completed && idx < currentIdx
                          ? BRAND.primary
                          : '#d1d5db',
                    }}
                  />
                )}
              </React.Fragment>
            );
          })}
          <ArrowRight
            className="w-5 h-5 flex-shrink-0"
            style={{ color: isFinal ? BRAND.primary : '#d1d5db' }}
          />
          <div className="flex flex-col items-center gap-2 min-w-[100px]">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                isFinal
                  ? 'text-white border-transparent'
                  : 'bg-white border-gray-300 text-gray-400'
              }`}
              style={isFinal ? { backgroundColor: BRAND.primary } : {}}
            >
              {isFinal ? (
                currentStatus === 'Approved' ? (
                  <CheckCircle className="w-5 h-5" />
                ) : currentStatus === 'Rejected' ? (
                  <XCircle className="w-5 h-5" />
                ) : (
                  <FileWarning className="w-5 h-5" />
                )
              ) : (
                <Award className="w-5 h-5" />
              )}
            </div>
            <span
              className="text-xs font-bold text-center"
              style={{ color: isFinal ? BRAND.primary : '#9ca3af' }}
            >
              {isFinal ? currentStatus : 'Decision'}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col">
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
              <FileText className="w-5 h-5" style={{ color: BRAND.primary }} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Application Details
              </h2>
              {application && (
                <p className="text-xs text-gray-500">
                  #{application.id || application.application_id}
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

        {/* Tabs */}
        <div className="border-b border-gray-200 bg-white px-5">
          <div className="flex gap-1 overflow-x-auto">
            {[
              { key: 'details', label: 'Applicant Details', icon: User },
              { key: 'application', label: 'Application', icon: FileText },
              { key: 'documents', label: 'Documents', icon: Paperclip },
              { key: 'timeline', label: 'Timeline', icon: Clock },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === key
                    ? 'border-transparent'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
                style={
                  activeTab === key
                    ? {
                        color: BRAND.primary,
                        borderBottomColor: BRAND.primary,
                      }
                    : {}
                }
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {loading || !application ? (
            <div className="flex items-center justify-center py-20">
              <Loader2
                className="w-8 h-8 animate-spin"
                style={{ color: BRAND.primary }}
              />
            </div>
          ) : activeTab === 'details' ? (
            <div className="p-5 space-y-5">
              {/* Personal Info */}
              <div>
                <h4
                  className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2"
                  style={{ color: BRAND.accent }}
                >
                  <User className="w-4 h-4" /> Personal Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {renderField(
                    User,
                    'Full Name',
                    application.fullName ||
                      `${application.first_name || ''} ${
                        application.last_name || ''
                      }`.trim()
                  )}
                  {renderField(
                    Calendar,
                    'Date of Birth',
                    formatDate(application.dateOfBirth || application.date_of_birth)
                  )}
                  {renderField(
                    Users,
                    'Gender',
                    application.gender
                  )}
                  {renderField(
                    Globe,
                    'Nationality',
                    application.nationality
                  )}
                  {renderField(
                    Hash,
                    'ID / Passport Number',
                    application.idNumber ||
                      application.id_number ||
                      application.passport_number
                  )}
                  {renderField(
                    Phone,
                    'Phone Number',
                    application.phone
                  )}
                  {renderField(
                    Mail,
                    'Email Address',
                    application.email
                  )}
                </div>
              </div>

              {/* Address */}
              <div>
                <h4
                  className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2"
                  style={{ color: BRAND.accent }}
                >
                  <MapPin className="w-4 h-4" /> Address
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {renderField(
                    MapPin,
                    'Address',
                    application.address ||
                      application.physical_address ||
                      application.postal_address
                  )}
                  {renderField(MapPin, 'City', application.city)}
                  {renderField(MapPin, 'County / State', application.county)}
                </div>
              </div>

              {/* Academic */}
              <div>
                <h4
                  className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2"
                  style={{ color: BRAND.accent }}
                >
                  <GraduationCap className="w-4 h-4" /> Academic Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {renderField(
                    Hash,
                    'Student ID',
                    application.studentId || application.student_id
                  )}
                  {renderField(
                    Hash,
                    'Admission Number',
                    application.admissionNumber || application.admission_number
                  )}
                  {renderField(BookOpen, 'Program', application.program)}
                  {renderField(
                    Building2,
                    'Department',
                    application.department
                  )}
                  {renderField(Building2, 'Faculty', application.faculty)}
                  {renderField(
                    Layers,
                    'Year of Study',
                    application.yearOfStudy || application.year_of_study
                      ? `Year ${
                          application.yearOfStudy || application.year_of_study
                        }`
                      : null
                  )}
                  {renderField(
                    Calendar,
                    'Academic Year',
                    application.academicYear || application.academic_year
                  )}
                  {renderField(
                    Calendar,
                    'Semester',
                    application.semester
                  )}
                </div>
              </div>
            </div>
          ) : activeTab === 'application' ? (
            <div className="p-5 space-y-4">
              {renderField(
                FileText,
                'Application Type',
                application.applicationType || application.application_type
              )}
              {renderField(
                Info,
                'Reason',
                application.reason
              )}
              {renderField(
                MessageSquare,
                'Additional Information',
                application.additionalInfo || application.additional_info
              )}

              {(application.adminComment ||
                application.adminComments ||
                application.reviewComment) && (
                <div
                  className="rounded-lg p-4 border"
                  style={{
                    backgroundColor: BRAND.primarySoft,
                    borderColor: BRAND.primaryBorder,
                  }}
                >
                  <p
                    className="text-xs font-bold uppercase tracking-wider mb-1.5 flex items-center gap-2"
                    style={{ color: BRAND.accent }}
                  >
                    <MessageSquare className="w-4 h-4" /> Admin Comments
                  </p>
                  <p className="text-sm" style={{ color: BRAND.primaryDark }}>
                    {application.adminComment ||
                      application.adminComments ||
                      application.reviewComment}
                  </p>
                </div>
              )}
            </div>
          ) : activeTab === 'documents' ? (
            <div className="p-5">
              <h4
                className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2"
                style={{ color: BRAND.accent }}
              >
                <Paperclip className="w-4 h-4" /> Submitted Documents
              </h4>
              {(() => {
                const docs =
                  application.documents ||
                  application.files ||
                  (application.document_urls &&
                    Object.entries(application.document_urls).map(
                      ([k, v]) => ({ name: k, url: v })
                    )) ||
                  [];
                if (!Array.isArray(docs) || docs.length === 0) {
                  return (
                    <div className="text-center py-10">
                      <Paperclip className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">
                        No documents uploaded.
                      </p>
                    </div>
                  );
                }
                return (
                  <div className="space-y-2">
                    {docs.map((doc, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className="p-2 rounded-lg flex-shrink-0"
                            style={{ backgroundColor: BRAND.primarySoft }}
                          >
                            <FileText
                              className="w-4 h-4"
                              style={{ color: BRAND.primary }}
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {doc.name ||
                                doc.document_name ||
                                `Document ${i + 1}`}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {doc.type || 'Uploaded file'}
                            </p>
                          </div>
                        </div>
                        {doc.url && (
                          <a
                            href={doc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-gray-500 rounded-lg transition-colors flex-shrink-0"
                            style={{ color: BRAND.primary }}
                            title="Download / View"
                          >
                            <Download className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          ) : (
            renderTimeline()
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 p-5 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span>
              Submitted:{' '}
              {formatDate(
                application?.submittedAt ||
                  application?.submitted_at ||
                  application?.createdAt ||
                  application?.created_at
              )}
            </span>
            <span className="hidden sm:inline">·</span>
            <span className="hidden sm:inline">
              Updated:{' '}
              {formatDate(application?.updatedAt || application?.updated_at)}
            </span>
          </div>
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
// CONFIRMATION MODAL (generic)
// ============================================================

const ActionModal = ({
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
  children,
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

          {children}
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

const Applications = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    Draft: 0,
    Submitted: 0,
    'Under Review': 0,
    Approved: 0,
    Rejected: 0,
    'Requires Correction': 0,
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    applicationType: '',
    program: '',
    department: '',
    academicYear: '',
    semester: '',
    submissionDate: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const [approveModal, setApproveModal] = useState(false);
  const [rejectModal, setRejectModal] = useState(false);
  const [correctionModal, setCorrectionModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionApp, setActionApp] = useState(null);

  const [rejectReason, setRejectReason] = useState('');
  const [rejectError, setRejectError] = useState('');
  const [correctionComment, setCorrectionComment] = useState('');
  const [correctionError, setCorrectionError] = useState('');

  // ============================================================
  // API — JSON SERVER ENDPOINTS
  // ============================================================

  const fetchApplications = useCallback(
    async (showRefresh = false) => {
      if (showRefresh) setRefreshing(true);
      else setLoading(true);

      try {
        const params = {};
        if (filters.status) params.status = filters.status;
        if (filters.applicationType)
          params.applicationType = filters.applicationType;
        if (filters.program) params.program = filters.program;
        if (filters.department) params.department = filters.department;
        if (filters.academicYear) params.academicYear = filters.academicYear;
        if (filters.semester) params.semester = filters.semester;

        // JSON Server: GET /applications?status=...&applicationType=...
        const response = await api.get('/applications', { params });

        // JSON Server returns a plain array
        const list = Array.isArray(response.data) ? response.data : [];

        setApplications(list);

        // Compute stats locally
        const computed = {
          total: list.length,
          Draft: list.filter((a) => a.status === 'Draft').length,
          Submitted: list.filter((a) => a.status === 'Submitted').length,
          'Under Review': list.filter((a) => a.status === 'Under Review')
            .length,
          Approved: list.filter((a) => a.status === 'Approved').length,
          Rejected: list.filter((a) => a.status === 'Rejected').length,
          'Requires Correction': list.filter(
            (a) => a.status === 'Requires Correction'
          ).length,
        };
        setStats(computed);

        if (showRefresh) toast.success('Applications refreshed');
      } catch (error) {
        console.error('Error fetching applications:', error);
        if (!error.response) {
          toast.error(
            'Cannot reach JSON Server. Make sure it is running on port 5000.'
          );
        } else {
          toast.error(
            error.response?.data?.message ||
              'Applications could not be loaded. Please try again.'
          );
        }
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [filters]
  );

  const fetchApplicationDetails = async (id) => {
    setLoadingDetail(true);
    try {
      // JSON Server: GET /applications/:id
      const response = await api.get(`/applications/${id}`);
      return response.data;
    } catch (error) {
      toast.error('Application details could not be loaded.');
      return null;
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleView = async (app) => {
    setSelectedApp(app);
    setDetailOpen(true);
    const full = await fetchApplicationDetails(app.id);
    if (full) setSelectedApp(full);
  };

  // ---- APPROVE ----
  const handleApprove = async () => {
    if (!actionApp) return;
    setActionLoading(true);
    try {
      // JSON Server: PATCH /applications/:id
      await api.patch(`/applications/${actionApp.id}`, {
        status: 'Approved',
        adminComment: 'Application approved.',
        updatedAt: new Date().toISOString(),
      });
      toast.success('Application approved successfully.');
      setApproveModal(false);
      setActionApp(null);
      fetchApplications(true);
    } catch (error) {
      console.error('Approve error:', error);
      toast.error('Unable to approve application.');
    } finally {
      setActionLoading(false);
    }
  };

  // ---- REJECT ----
  const handleReject = async () => {
    if (!actionApp) return;
    if (!rejectReason.trim()) {
      setRejectError('Rejection reason is required.');
      return;
    }
    setActionLoading(true);
    try {
      await api.patch(`/applications/${actionApp.id}`, {
        status: 'Rejected',
        adminComment: rejectReason.trim(),
        updatedAt: new Date().toISOString(),
      });
      toast.success('Application rejected successfully.');
      setRejectModal(false);
      setActionApp(null);
      setRejectReason('');
      setRejectError('');
      fetchApplications(true);
    } catch (error) {
      console.error('Reject error:', error);
      toast.error('Unable to reject application.');
    } finally {
      setActionLoading(false);
    }
  };

  // ---- REQUEST CORRECTION ----
  const handleRequestCorrection = async () => {
    if (!actionApp) return;
    if (!correctionComment.trim()) {
      setCorrectionError('Please provide comments for the correction request.');
      return;
    }
    setActionLoading(true);
    try {
      await api.patch(`/applications/${actionApp.id}`, {
        status: 'Requires Correction',
        adminComment: correctionComment.trim(),
        updatedAt: new Date().toISOString(),
      });
      toast.success('Correction requested successfully.');
      setCorrectionModal(false);
      setActionApp(null);
      setCorrectionComment('');
      setCorrectionError('');
      fetchApplications(true);
    } catch (error) {
      console.error('Correction error:', error);
      toast.error('Unable to request correction.');
    } finally {
      setActionLoading(false);
    }
  };

  // ---- DOWNLOAD ----
  const handleDownloadDocuments = async (app) => {
    try {
      const docs = app.documents || app.files || [];
      if (!Array.isArray(docs) || docs.length === 0) {
        toast.error('No documents available for download.');
        return;
      }
      // Open the first document URL, or download all as JSON
      const downloadable = docs.filter((d) => d.url);
      if (downloadable.length > 0) {
        downloadable.forEach((d, i) => {
          setTimeout(() => window.open(d.url, '_blank'), i * 300);
        });
        toast.success('Opening documents...');
      } else {
        // Fallback: download metadata as JSON
        const blob = new Blob([JSON.stringify(docs, null, 2)], {
          type: 'application/json',
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Application_${app.id}_documents.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        toast.success('Documents metadata downloaded');
      }
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Documents are currently unavailable.');
    }
  };

  // ============================================================
  // FILTERING
  // ============================================================

  const filteredApplications = useMemo(() => {
    let result = [...applications];

    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      result = result.filter(
        (a) =>
          String(a.id || a.application_id || '')
            .toLowerCase()
            .includes(s) ||
          String(a.studentId || a.student_id || '')
            .toLowerCase()
            .includes(s) ||
          String(a.fullName || `${a.first_name || ''} ${a.last_name || ''}`)
            .toLowerCase()
            .includes(s) ||
          String(a.email || '')
            .toLowerCase()
            .includes(s)
      );
    }

    if (filters.status)
      result = result.filter((a) => a.status === filters.status);
    if (filters.applicationType)
      result = result.filter(
        (a) =>
          (a.applicationType || a.application_type) === filters.applicationType
      );
    if (filters.program)
      result = result.filter((a) => a.program === filters.program);
    if (filters.department)
      result = result.filter((a) => a.department === filters.department);
    if (filters.academicYear)
      result = result.filter(
        (a) =>
          (a.academicYear || a.academic_year) === filters.academicYear
      );
    if (filters.semester)
      result = result.filter((a) => a.semester === filters.semester);
    if (filters.submissionDate) {
      const targetDate = new Date(filters.submissionDate).toDateString();
      result = result.filter((a) => {
        const d = a.submittedAt || a.submitted_at || a.createdAt || a.created_at;
        return d && new Date(d).toDateString() === targetDate;
      });
    }

    return result;
  }, [applications, searchTerm, filters]);

  const totalPages = Math.ceil(filteredApplications.length / ITEMS_PER_PAGE);
  const paginated = filteredApplications.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const hasActiveFilters = Boolean(
    searchTerm ||
      filters.status ||
      filters.applicationType ||
      filters.program ||
      filters.department ||
      filters.academicYear ||
      filters.semester ||
      filters.submissionDate
  );

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilters({
      status: '',
      applicationType: '',
      program: '',
      department: '',
      academicYear: '',
      semester: '',
      submissionDate: '',
    });
  };

  // ============================================================
  // EFFECTS
  // ============================================================

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  // ============================================================
  // DERIVED OPTIONS
  // ============================================================

  const programOptions = useMemo(
    () => [...new Set(applications.map((a) => a.program).filter(Boolean))],
    [applications]
  );
  const departmentOptions = useMemo(
    () => [...new Set(applications.map((a) => a.department).filter(Boolean))],
    [applications]
  );
  const academicYearOptions = useMemo(
    () => [
      ...new Set(
        applications
          .map((a) => a.academicYear || a.academic_year)
          .filter(Boolean)
      ),
    ],
    [applications]
  );
  const semesterOptions = useMemo(
    () => [...new Set(applications.map((a) => a.semester).filter(Boolean))],
    [applications]
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
                  <FileText
                    className="w-6 h-6"
                    style={{ color: BRAND.primary }}
                  />
                </div>
                Applications
              </h1>
              <p className="text-sm text-gray-500 mt-1 ml-11">
                Review and manage student applications.
              </p>
            </div>
            <div className="flex items-center gap-2 ml-11 sm:ml-0">
              <button
                onClick={() => fetchApplications(true)}
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

        {/* STATISTICS CARDS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
          <StatCard
            icon={FileText}
            label="Total"
            value={stats.total}
            accent="brown"
            active={!filters.status}
            onClick={() => setFilters((f) => ({ ...f, status: '' }))}
          />
          <StatCard
            icon={FileText}
            label="Draft"
            value={stats.Draft}
            accent="gray"
            active={filters.status === 'Draft'}
            onClick={() =>
              setFilters((f) => ({
                ...f,
                status: f.status === 'Draft' ? '' : 'Draft',
              }))
            }
          />
          <StatCard
            icon={Send}
            label="Submitted"
            value={stats.Submitted}
            accent="blue"
            active={filters.status === 'Submitted'}
            onClick={() =>
              setFilters((f) => ({
                ...f,
                status: f.status === 'Submitted' ? '' : 'Submitted',
              }))
            }
          />
          <StatCard
            icon={Clock}
            label="Under Review"
            value={stats['Under Review']}
            accent="amber"
            active={filters.status === 'Under Review'}
            onClick={() =>
              setFilters((f) => ({
                ...f,
                status: f.status === 'Under Review' ? '' : 'Under Review',
              }))
            }
          />
          <StatCard
            icon={CheckCircle}
            label="Approved"
            value={stats.Approved}
            accent="emerald"
            active={filters.status === 'Approved'}
            onClick={() =>
              setFilters((f) => ({
                ...f,
                status: f.status === 'Approved' ? '' : 'Approved',
              }))
            }
          />
          <StatCard
            icon={XCircle}
            label="Rejected"
            value={stats.Rejected}
            accent="red"
            active={filters.status === 'Rejected'}
            onClick={() =>
              setFilters((f) => ({
                ...f,
                status: f.status === 'Rejected' ? '' : 'Rejected',
              }))
            }
          />
          <StatCard
            icon={FileWarning}
            label="Correction"
            value={stats['Requires Correction']}
            accent="orange"
            active={filters.status === 'Requires Correction'}
            onClick={() =>
              setFilters((f) => ({
                ...f,
                status:
                  f.status === 'Requires Correction'
                    ? ''
                    : 'Requires Correction',
              }))
            }
          />
        </div>

        {/* SEARCH & FILTERS */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by application ID, student ID, name, email..."
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
                      filters.status,
                      filters.applicationType,
                      filters.program,
                      filters.department,
                      filters.academicYear,
                      filters.semester,
                      filters.submissionDate,
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
                  { key: 'status', label: 'Status', options: STATUSES },
                  {
                    key: 'applicationType',
                    label: 'Application Type',
                    options: APPLICATION_TYPES,
                  },
                  { key: 'program', label: 'Program', options: programOptions },
                  {
                    key: 'department',
                    label: 'Department',
                    options: departmentOptions,
                  },
                  {
                    key: 'academicYear',
                    label: 'Academic Year',
                    options: academicYearOptions,
                  },
                  {
                    key: 'semester',
                    label: 'Semester',
                    options: semesterOptions,
                  },
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

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">
                    Submission Date
                  </label>
                  <input
                    type="date"
                    value={filters.submissionDate}
                    onChange={(e) =>
                      setFilters((f) => ({
                        ...f,
                        submissionDate: e.target.value,
                      }))
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
                  />
                </div>
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

        {/* APPLICATIONS TABLE */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {loading ? (
            <TableSkeleton />
          ) : filteredApplications.length === 0 ? (
            <EmptyState filtered={applications.length > 0} />
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
                        'App ID',
                        'Student ID',
                        'Student Name',
                        'Application Type',
                        'Program',
                        'Department',
                        'Academic Year',
                        'Semester',
                        'Submitted',
                        'Updated',
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
                    {paginated.map((app) => (
                      <tr
                        key={app.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-3.5">
                          <span
                            className="text-sm font-semibold"
                            style={{ color: BRAND.primary }}
                          >
                            {app.id || app.application_id}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="text-sm text-gray-700">
                            {app.studentId || app.student_id || '—'}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="min-w-0">
                            <span className="text-sm font-medium text-gray-900 block truncate">
                              {app.fullName ||
                                `${app.first_name || ''} ${
                                  app.last_name || ''
                                }`.trim() ||
                                '—'}
                            </span>
                            {app.email && (
                              <span className="text-xs text-gray-500 block truncate">
                                {app.email}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="text-sm text-gray-600">
                            {app.applicationType ||
                              app.application_type ||
                              '—'}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="text-sm text-gray-600">
                            {app.program || '—'}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="text-sm text-gray-600">
                            {app.department || '—'}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="text-sm text-gray-600">
                            {app.academicYear || app.academic_year || '—'}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="text-sm text-gray-600">
                            {app.semester || '—'}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="text-sm text-gray-600 whitespace-nowrap">
                            {formatDate(
                              app.submittedAt ||
                                app.submitted_at ||
                                app.createdAt ||
                                app.created_at
                            )}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="text-sm text-gray-600 whitespace-nowrap">
                            {formatDate(app.updatedAt || app.updated_at)}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <StatusBadge status={app.status} />
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => handleView(app)}
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

                            {(app.status === 'Submitted' ||
                              app.status === 'Under Review') && (
                              <>
                                <button
                                  onClick={() => {
                                    setActionApp(app);
                                    setApproveModal(true);
                                  }}
                                  className="p-1.5 text-gray-500 rounded-lg transition-colors"
                                  title="Approve"
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
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => {
                                    setActionApp(app);
                                    setRejectReason('');
                                    setRejectError('');
                                    setRejectModal(true);
                                  }}
                                  className="p-1.5 text-gray-500 rounded-lg transition-colors"
                                  title="Reject"
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
                                  <XCircle className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => {
                                    setActionApp(app);
                                    setCorrectionComment('');
                                    setCorrectionError('');
                                    setCorrectionModal(true);
                                  }}
                                  className="p-1.5 text-gray-500 rounded-lg transition-colors"
                                  title="Request Correction"
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
                                  <FileWarning className="w-4 h-4" />
                                </button>
                              </>
                            )}

                            <button
                              onClick={() => handleDownloadDocuments(app)}
                              className="p-1.5 text-gray-500 rounded-lg transition-colors"
                              title="Download Documents"
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
                {paginated.map((app) => (
                  <div
                    key={app.id}
                    className="p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span
                            className="text-sm font-bold"
                            style={{ color: BRAND.primary }}
                          >
                            {app.id || app.application_id}
                          </span>
                          <StatusBadge status={app.status} />
                        </div>
                        <h3 className="text-sm font-semibold text-gray-900 truncate">
                          {app.fullName ||
                            `${app.first_name || ''} ${
                              app.last_name || ''
                            }`.trim() ||
                            'Unknown Student'}
                        </h3>
                        <p className="text-xs text-gray-500 truncate">
                          {app.email}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <Hash className="w-3.5 h-3.5 text-gray-400" />
                        {app.studentId || app.student_id || '—'}
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <FileText className="w-3.5 h-3.5 text-gray-400" />
                        {app.applicationType || app.application_type || '—'}
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <BookOpen className="w-3.5 h-3.5 text-gray-400" />
                        {app.program || '—'}
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        {formatDate(
                          app.submittedAt ||
                            app.submitted_at ||
                            app.createdAt ||
                            app.created_at
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-3 border-t border-gray-100 flex-wrap">
                      <button
                        onClick={() => handleView(app)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg transition-colors"
                        style={{
                          color: BRAND.primary,
                          backgroundColor: BRAND.primarySoft,
                        }}
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View
                      </button>
                      {(app.status === 'Submitted' ||
                        app.status === 'Under Review') && (
                        <>
                          <button
                            onClick={() => {
                              setActionApp(app);
                              setApproveModal(true);
                            }}
                            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-emerald-700 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            Approve
                          </button>
                          <button
                            onClick={() => {
                              setActionApp(app);
                              setRejectReason('');
                              setRejectError('');
                              setRejectModal(true);
                            }}
                            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            Reject
                          </button>
                        </>
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
                        filteredApplications.length
                      )}
                    </span>{' '}
                    of{' '}
                    <span className="font-semibold">
                      {filteredApplications.length}
                    </span>{' '}
                    applications
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
      </div>

      {/* DETAIL MODAL */}
      <ApplicationDetailModal
        open={detailOpen}
        onClose={() => {
          setDetailOpen(false);
          setSelectedApp(null);
        }}
        application={selectedApp}
        loading={loadingDetail}
      />

      {/* APPROVE MODAL */}
      <ActionModal
        open={approveModal}
        onClose={() => {
          setApproveModal(false);
          setActionApp(null);
        }}
        onConfirm={handleApprove}
        title="Approve Application?"
        message={`Are you sure you want to approve application ${
          actionApp?.id || actionApp?.application_id
        }? The student will be notified.`}
        confirmText="Approve Application"
        loading={actionLoading}
        variant="primary"
      />

      {/* REJECT MODAL */}
      <ActionModal
        open={rejectModal}
        onClose={() => {
          setRejectModal(false);
          setActionApp(null);
          setRejectReason('');
          setRejectError('');
        }}
        onConfirm={handleReject}
        title="Reject Application"
        message={`Please provide a clear reason for rejecting application ${
          actionApp?.id || actionApp?.application_id
        }. The student will see this reason.`}
        confirmText="Reject Application"
        loading={actionLoading}
        variant="danger"
        requireInput
        inputLabel="Rejection Reason"
        inputPlaceholder="Explain why this application is being rejected..."
        inputValue={rejectReason}
        onInputChange={(v) => {
          setRejectReason(v);
          if (v.trim()) setRejectError('');
        }}
        inputRequired
        inputError={rejectError}
      />

      {/* CORRECTION MODAL */}
      <ActionModal
        open={correctionModal}
        onClose={() => {
          setCorrectionModal(false);
          setActionApp(null);
          setCorrectionComment('');
          setCorrectionError('');
        }}
        onConfirm={handleRequestCorrection}
        title="Request Correction"
        message={`Ask the student to correct or resubmit application ${
          actionApp?.id || actionApp?.application_id
        }. Be specific about what needs fixing.`}
        confirmText="Request Correction"
        loading={actionLoading}
        variant="warning"
        requireInput
        inputLabel="Correction Comments"
        inputPlaceholder="Explain what needs to be corrected..."
        inputValue={correctionComment}
        onInputChange={(v) => {
          setCorrectionComment(v);
          if (v.trim()) setCorrectionError('');
        }}
        inputRequired
        inputError={correctionError}
      />
    </div>
  );
};

export default Applications;