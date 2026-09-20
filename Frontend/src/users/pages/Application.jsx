// src/users/pages/Application.jsx
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FileText,
  Clock,
  User,
  GraduationCap,
  Paperclip,
  MessageSquare,
  Download,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RefreshCw,
  Edit3,
  Send,
  Eye,
  Loader2,
  Calendar,
  Hash,
  Building2,
  BookOpen,
  ArrowRight,
  FileWarning,
  Mail,
  Phone,
} from "lucide-react";

/* =============================================================
   API CONFIGURATION — JSON SERVER
   ============================================================= */

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

/* =============================================================
   HELPERS — CURRENT STUDENT FROM LOCALSTORAGE
   ============================================================= */

function getCurrentStudent() {
  try {
    const raw =
      localStorage.getItem("user") || sessionStorage.getItem("user");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function unwrap(payload, fallback = null) {
  if (payload === null || payload === undefined) return fallback;
  if (Array.isArray(payload)) return payload;
  if (payload.data !== undefined) return unwrap(payload.data, fallback);
  return payload;
}

function toArray(value) {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  if (typeof value === "object") return Object.values(value);
  return [];
}

/* =============================================================
   API SERVICE FUNCTIONS — JSON SERVER
   ============================================================= */

const applicationService = {
  /**
   * Get the current student's application.
   * JSON Server: GET /applications?studentId=...
   */
  getApplication: async () => {
    const student = getCurrentStudent();
    if (!student?.studentId) {
      return { data: null };
    }
    const res = await api.get("/applications", {
      params: { studentId: student.studentId },
    });
    const list = Array.isArray(res.data) ? res.data : [];
    return { data: list[0] || null };
  },

  /**
   * Get timeline events — JSON Server has no timeline resource,
   * so we derive it from the application status.
   */
  getTimeline: async (application) => {
    if (!application) return { data: [] };

    const stages = [
      { status: "Draft", label: "Draft Created" },
      { status: "Submitted", label: "Submitted" },
      { status: "Under Review", label: "Under Review" },
    ];

    const finalStatuses = ["Approved", "Rejected", "Requires Correction"];
    const current = application.status || "Draft";
    const isFinal = finalStatuses.includes(current);
    const currentIdx = stages.findIndex((s) => s.status === current);

    const timeline = stages.map((s, idx) => {
      const completed = isFinal || idx <= currentIdx;
      return {
        status: s.status,
        label: s.label,
        completed,
        date:
          s.status === "Submitted"
            ? application.submittedAt || application.createdAt
            : s.status === "Under Review"
            ? application.updatedAt
            : application.createdAt,
        description: completed
          ? `${s.label} completed.`
          : `Waiting for ${s.label.toLowerCase()}.`,
      };
    });

    if (isFinal) {
      timeline.push({
        status: current,
        label: current,
        completed: true,
        date: application.updatedAt,
        description:
          current === "Approved"
            ? "Your application was approved."
            : current === "Rejected"
            ? "Your application was rejected."
            : "Correction requested by admin.",
      });
    }

    return { data: timeline };
  },

  /**
   * Get uploaded documents — stored as an array on the application.
   */
  getDocuments: async (application) => {
    if (!application) return { data: [] };
    const docs = application.documents || application.files || [];
    return { data: Array.isArray(docs) ? docs : [] };
  },

  /**
   * Resubmit: PATCH /applications/:id with status "Submitted".
   */
  resubmitApplication: async (applicationId) => {
    return api.patch(`/applications/${applicationId}`, {
      status: "Submitted",
      adminComment: null,
      updatedAt: new Date().toISOString(),
    });
  },

  /**
   * Download: return the application's pdfUrl if present.
   */
  getDownloadUrl: async (applicationId) => {
    const res = await api.get(`/applications/${applicationId}`);
    return res.data?.pdfUrl || null;
  },
};

/* =============================================================
   STATUS CONFIG
   ============================================================= */
const STATUS = {
  Draft: {
    label: "Draft",
    color: "bg-gray-100 text-gray-700 border-gray-200",
    icon: FileText,
  },
  Submitted: {
    label: "Submitted",
    color: "bg-blue-50 text-blue-700 border-blue-200",
    icon: Send,
  },
  "Under Review": {
    label: "Under Review",
    color: "bg-amber-50 text-amber-800 border-amber-200",
    icon: Clock,
  },
  Approved: {
    label: "Approved",
    color: "bg-green-50 text-green-700 border-green-200",
    icon: CheckCircle2,
  },
  Rejected: {
    label: "Rejected",
    color: "bg-red-50 text-red-700 border-red-200",
    icon: XCircle,
  },
  "Requires Correction": {
    label: "Requires Correction",
    color: "bg-orange-50 text-orange-700 border-orange-200",
    icon: AlertCircle,
  },
};

/* =============================================================
   STATUS BADGE
   ============================================================= */
function StatusBadge({ status }) {
  const cfg = STATUS[status] || STATUS.Draft;
  const Icon = cfg.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${cfg.color}`}
    >
      <Icon className="w-3.5 h-3.5" />
      {cfg.label}
    </span>
  );
}

/* =============================================================
   SECTION WRAPPER
   ============================================================= */
function Section({ icon: Icon, title, subtitle, children, action }) {
  return (
    <section className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
            <Icon className="w-4 h-4 text-amber-800" />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm font-bold text-black truncate">{title}</h2>
            {subtitle && (
              <p className="text-[11px] text-gray-500 truncate">{subtitle}</p>
            )}
          </div>
        </div>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

/* =============================================================
   INFO ROW
   ============================================================= */
function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-gray-50 last:border-0">
      <div className="w-8 h-8 rounded-md bg-gray-50 flex items-center justify-center shrink-0">
        <Icon className="w-3.5 h-3.5 text-gray-500" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold">
          {label}
        </p>
        <p className="text-sm font-medium text-black truncate">
          {value ?? "—"}
        </p>
      </div>
    </div>
  );
}

/* =============================================================
   ACTION BUTTON
   ============================================================= */
function ActionButton({ icon: Icon, label, onClick, primary, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg transition-colors duration-200 ${
        primary
          ? "bg-amber-900 text-white hover:bg-amber-800"
          : "bg-white text-black border border-gray-200 hover:border-amber-800 hover:text-amber-800"
      } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
    >
      {disabled ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Icon className="w-4 h-4" />
      )}
      {label}
    </button>
  );
}

/* =============================================================
   MAIN COMPONENT
   ============================================================= */
const Application = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [application, setApplication] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  /* ------------------ FETCH ALL ------------------ */
  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);

    const student = getCurrentStudent();

    if (!student?.studentId) {
      setApplication(null);
      setTimeline([]);
      setDocuments([]);
      setLoading(false);
      return;
    }

    try {
      // 1. Fetch application
      let appData = null;
      try {
        const appRes = await applicationService.getApplication();
        const raw = unwrap(appRes?.data, null);
        if (raw && typeof raw === "object" && !Array.isArray(raw)) {
          appData = raw;
        }
      } catch (err) {
        if (!err.response) {
          toast.error(
            "Unable to connect to the server. Make sure JSON Server is running on port 5000."
          );
          setError("network");
          setLoading(false);
          return;
        }
        throw err;
      }

      setApplication(appData);

      // 2. Derive timeline + documents from the application record
      if (appData) {
        const [timelineRes, docsRes] = await Promise.allSettled([
          applicationService.getTimeline(appData),
          applicationService.getDocuments(appData),
        ]);

        if (timelineRes.status === "fulfilled") {
          const raw = unwrap(timelineRes.value?.data, []);
          setTimeline(toArray(raw));
        } else {
          setTimeline([]);
        }

        if (docsRes.status === "fulfilled") {
          const raw = unwrap(docsRes.value?.data, []);
          setDocuments(toArray(raw));
        } else {
          setDocuments([]);
        }
      } else {
        setTimeline([]);
        setDocuments([]);
      }
    } catch (err) {
      const status = err?.response?.status;

      if (status === 401) {
        toast.error("Session expired. Please log in again.");
        setError("unauthorized");
      } else if (status === 403) {
        toast.error("You don't have permission to view this application.");
        setError("forbidden");
      } else if (!err.response) {
        toast.error("Network error. Please check your connection.");
        setError("network");
      } else {
        toast.error("Failed to load application. Please try again.");
        setError("server");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  /* ------------------ RESUBMIT ------------------ */
  const handleResubmit = async () => {
    if (!application?.id) {
      toast.error("Application not found.");
      return;
    }

    setSubmitting(true);
    try {
      await applicationService.resubmitApplication(application.id);
      toast.success("Application resubmitted successfully.");
      fetchAll();
    } catch (err) {
      if (!err.response) {
        toast.error("Network error. Please check your connection.");
      } else {
        toast.error("Failed to resubmit application.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  /* ------------------ DOWNLOAD ------------------ */
  const handleDownload = async () => {
    if (!application?.id) return;

    try {
      const pdfUrl = await applicationService.getDownloadUrl(application.id);

      if (pdfUrl) {
        window.open(pdfUrl, "_blank");
        toast.success("Download started.");
        return;
      }

      // Fallback: export the application record as a JSON file
      const blob = new Blob([JSON.stringify(application, null, 2)], {
        type: "application/json",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `application-${application.id}.json`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Application details downloaded.");
    } catch (err) {
      if (!err.response) {
        toast.error("Network error. Please try again.");
      } else {
        toast.error("Failed to download application.");
      }
    }
  };

  /* =============================================================
     LOADING SKELETON
     ============================================================= */
  if (loading) {
    return (
      <div className="space-y-5">
        <div className="animate-pulse">
          <div className="h-6 w-48 bg-gray-200 rounded" />
          <div className="h-4 w-72 bg-gray-100 rounded mt-2" />
        </div>
        <div className="grid lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 space-y-5">
            <div className="h-48 bg-white border border-gray-200 rounded-xl animate-pulse" />
            <div className="h-64 bg-white border border-gray-200 rounded-xl animate-pulse" />
          </div>
          <div className="space-y-5">
            <div className="h-40 bg-white border border-gray-200 rounded-xl animate-pulse" />
            <div className="h-52 bg-white border border-gray-200 rounded-xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  /* =============================================================
     ERROR STATE
     ============================================================= */
  if (error && error !== "not-found") {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="max-w-md w-full bg-white border border-gray-200 rounded-xl p-8 text-center">
          <div className="w-14 h-14 mx-auto rounded-full bg-red-50 flex items-center justify-center">
            <FileWarning className="w-7 h-7 text-red-600" />
          </div>
          <h2 className="mt-4 text-lg font-bold text-black">
            Couldn't Load Application
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {error === "network"
              ? "We couldn't reach the server. Make sure JSON Server is running on port 5000."
              : error === "unauthorized"
              ? "Your session has expired. Please log in again."
              : error === "forbidden"
              ? "You don't have permission to view this."
              : "Something went wrong on our end. Please try again."}
          </p>
          <button
            onClick={fetchAll}
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-amber-900 text-white text-sm font-semibold rounded-lg hover:bg-amber-800 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  /* =============================================================
     EMPTY STATE
     ============================================================= */
  if (!application) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="max-w-md w-full bg-white border border-gray-200 rounded-xl p-8 text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-amber-50 flex items-center justify-center">
            <FileText className="w-8 h-8 text-amber-800" />
          </div>
          <h2 className="mt-4 text-lg font-bold text-black">
            No Application Yet
          </h2>
          <p className="mt-2 text-sm text-gray-600 leading-relaxed">
            You have not submitted an application yet. Start your journey by
            filling out the application form.
          </p>
          <button
            onClick={() => navigate("/user/application-form")}
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-amber-900 text-white text-sm font-semibold rounded-lg hover:bg-amber-800 transition-colors"
          >
            Start Application
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  /* =============================================================
     DERIVED
     ============================================================= */
  const status = application.status || "Draft";
  const showAdminComment =
    status === "Requires Correction" || status === "Rejected";

  const summary = {
    id: application.id,
    type: application.applicationType || application.type,
    studentId: application.studentId,
    program: application.program,
    academicYear: application.academicYear,
    semester: application.semester,
    submittedAt: application.submittedAt || application.createdAt,
    updatedAt: application.updatedAt,
  };

  const personal = {
    fullName: application.fullName || application.personal?.fullName,
    dateOfBirth: application.dateOfBirth || application.personal?.dateOfBirth,
    gender: application.gender || application.personal?.gender,
    nationality: application.nationality || application.personal?.nationality,
    phone: application.phone || application.personal?.phone,
    email: application.email || application.personal?.email,
    address: application.address || application.personal?.address,
  };

  const academic = {
    studentId: application.studentId || application.academic?.studentId,
    program: application.program || application.academic?.program,
    department: application.department || application.academic?.department,
    faculty: application.faculty || application.academic?.faculty,
    yearOfStudy: application.yearOfStudy || application.academic?.yearOfStudy,
    academicYear: application.academicYear || application.academic?.academicYear,
    semester: application.semester || application.academic?.semester,
  };

  const adminComment =
    application.adminComment || application.reviewComment || null;

  /* =============================================================
     MAIN RENDER
     ============================================================= */
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="space-y-6">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-black tracking-tight">
              My Application
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Track your university application and review your submitted
              information.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchAll}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:border-amber-800 hover:text-amber-800 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Refresh
            </button>
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-amber-900 rounded-lg hover:bg-amber-800 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Download Application
            </button>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid lg:grid-cols-3 gap-5">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-5">
            {/* APPLICATION SUMMARY */}
            <Section
              icon={FileText}
              title="Application Summary"
              subtitle="Overview of your submitted application"
              action={<StatusBadge status={status} />}
            >
              <div className="grid sm:grid-cols-2 gap-x-6">
                <InfoRow icon={Hash} label="Application ID" value={summary.id} />
                <InfoRow
                  icon={FileText}
                  label="Application Type"
                  value={summary.type}
                />
                <InfoRow
                  icon={GraduationCap}
                  label="Student ID"
                  value={summary.studentId}
                />
                <InfoRow
                  icon={BookOpen}
                  label="Program"
                  value={summary.program}
                />
                <InfoRow
                  icon={Calendar}
                  label="Academic Year"
                  value={summary.academicYear}
                />
                <InfoRow
                  icon={Calendar}
                  label="Semester"
                  value={summary.semester}
                />
                <InfoRow
                  icon={Clock}
                  label="Submission Date"
                  value={summary.submittedAt}
                />
                <InfoRow
                  icon={RefreshCw}
                  label="Last Updated"
                  value={summary.updatedAt}
                />
              </div>
            </Section>

            {/* TIMELINE */}
            <Section
              icon={Clock}
              title="Application Timeline"
              subtitle="Progress of your application through review"
            >
              {!Array.isArray(timeline) || timeline.length === 0 ? (
                <p className="text-sm text-gray-500 py-4 text-center">
                  No timeline data available yet.
                </p>
              ) : (
                <ol className="relative">
                  {timeline.map((stage, idx) => {
                    const cfg = STATUS[stage.status] || STATUS.Draft;
                    const Icon = cfg.icon;
                    const isLast = idx === timeline.length - 1;

                    return (
                      <li key={idx} className="relative pb-6 last:pb-0">
                        {!isLast && (
                          <span className="absolute left-4 top-9 bottom-0 w-px bg-gray-200" />
                        )}

                        <div className="flex items-start gap-4">
                          <div
                            className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                              stage.completed
                                ? "bg-amber-800 text-white"
                                : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0 pt-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="text-sm font-bold text-black">
                                {stage.label || cfg.label}
                              </p>
                              {stage.date && (
                                <span className="text-[11px] text-gray-500">
                                  · {stage.date}
                                </span>
                              )}
                            </div>
                            {stage.description && (
                              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                                {stage.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              )}
            </Section>

            {/* PERSONAL INFORMATION */}
            <Section
              icon={User}
              title="Personal Information"
              subtitle="Your submitted personal details"
            >
              <div className="grid sm:grid-cols-2 gap-x-6">
                <InfoRow
                  icon={User}
                  label="Full Name"
                  value={personal.fullName}
                />
                <InfoRow
                  icon={Calendar}
                  label="Date of Birth"
                  value={personal.dateOfBirth}
                />
                <InfoRow icon={User} label="Gender" value={personal.gender} />
                <InfoRow
                  icon={User}
                  label="Nationality"
                  value={personal.nationality}
                />
                <InfoRow icon={Phone} label="Phone" value={personal.phone} />
                <InfoRow icon={Mail} label="Email" value={personal.email} />
                <InfoRow
                  icon={Building2}
                  label="Address"
                  value={personal.address}
                />
              </div>
            </Section>

            {/* ACADEMIC INFORMATION */}
            <Section
              icon={GraduationCap}
              title="Academic Information"
              subtitle="Your program and academic details"
            >
              <div className="grid sm:grid-cols-2 gap-x-6">
                <InfoRow
                  icon={Hash}
                  label="Student ID"
                  value={academic.studentId}
                />
                <InfoRow
                  icon={BookOpen}
                  label="Program"
                  value={academic.program}
                />
                <InfoRow
                  icon={Building2}
                  label="Department"
                  value={academic.department}
                />
                <InfoRow
                  icon={Building2}
                  label="Faculty"
                  value={academic.faculty}
                />
                <InfoRow
                  icon={Calendar}
                  label="Year of Study"
                  value={academic.yearOfStudy}
                />
                <InfoRow
                  icon={Calendar}
                  label="Academic Year"
                  value={academic.academicYear}
                />
                <InfoRow
                  icon={Calendar}
                  label="Semester"
                  value={academic.semester}
                />
              </div>
            </Section>

            {/* ADMIN COMMENTS */}
            {showAdminComment && adminComment && (
              <Section
                icon={MessageSquare}
                title="Admin Comments"
                subtitle="Feedback from the review team"
              >
                <div
                  data-admin-comment
                  className={`rounded-lg border p-4 ${
                    status === "Rejected"
                      ? "bg-red-50 border-red-200"
                      : "bg-orange-50 border-orange-200"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <AlertCircle
                      className={`w-5 h-5 shrink-0 mt-0.5 ${
                        status === "Rejected"
                          ? "text-red-600"
                          : "text-orange-600"
                      }`}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-gray-800 leading-relaxed">
                        {adminComment.message || adminComment}
                      </p>
                      {adminComment.date && (
                        <p className="text-[11px] text-gray-500 mt-2">
                          {adminComment.date}
                        </p>
                      )}
                      {adminComment.actionRequired && (
                        <div className="mt-3 pt-3 border-t border-black/5">
                          <p className="text-[10px] uppercase tracking-widest font-bold text-gray-500">
                            Action Required
                          </p>
                          <p className="text-sm font-semibold text-black mt-1">
                            {adminComment.actionRequired}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Section>
            )}
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-5">
            {/* ACTIONS */}
            <Section
              icon={CheckCircle2}
              title="Actions"
              subtitle="Available steps for your application"
            >
              <div className="space-y-2.5">
                {status === "Draft" && (
                  <ActionButton
                    icon={Edit3}
                    label="Continue Application"
                    onClick={() => navigate("/user/application-form")}
                    primary
                  />
                )}

                {status === "Submitted" && (
                  <ActionButton
                    icon={Eye}
                    label="View Application"
                    onClick={() => navigate("/user/application-form")}
                    primary
                  />
                )}

                {status === "Requires Correction" && (
                  <>
                    <ActionButton
                      icon={Edit3}
                      label="Edit Application"
                      onClick={() => navigate("/user/application-form")}
                    />
                    <ActionButton
                      icon={Send}
                      label={
                        submitting ? "Resubmitting..." : "Resubmit Application"
                      }
                      onClick={handleResubmit}
                      disabled={submitting}
                      primary
                    />
                  </>
                )}

                {status === "Rejected" && (
                  <>
                    <ActionButton
                      icon={MessageSquare}
                      label="View Reason"
                      onClick={() =>
                        document
                          .querySelector("[data-admin-comment]")
                          ?.scrollIntoView({ behavior: "smooth" })
                      }
                    />
                    {application.allowNewApplication && (
                      <ActionButton
                        icon={FileText}
                        label="Start New Application"
                        onClick={() => navigate("/user/application-form")}
                        primary
                      />
                    )}
                  </>
                )}

                {status === "Approved" && (
                  <ActionButton
                    icon={Eye}
                    label="View Approval Details"
                    onClick={() => navigate("/user/application")}
                    primary
                  />
                )}

                {(status === "Under Review" || status === "Submitted") && (
                  <p className="text-xs text-gray-500 italic pt-1">
                    Your application is being processed. You'll be notified when
                    there's an update.
                  </p>
                )}
              </div>
            </Section>

            {/* SUPPORTING DOCUMENTS */}
            <Section
              icon={Paperclip}
              title="Supporting Documents"
              subtitle={`${documents.length} file${
                documents.length === 1 ? "" : "s"
              } uploaded`}
            >
              {!Array.isArray(documents) || documents.length === 0 ? (
                <p className="text-sm text-gray-500 py-2 text-center">
                  No documents uploaded.
                </p>
              ) : (
                <ul className="space-y-2.5">
                  {documents.map((doc, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 p-3 bg-gray-50 border border-gray-100 rounded-lg hover:border-amber-800/30 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-md bg-white border border-gray-200 flex items-center justify-center shrink-0">
                        <FileText className="w-3.5 h-3.5 text-amber-800" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-black truncate">
                          {doc.name}
                        </p>
                        <p className="text-[10px] text-gray-500 mt-0.5 truncate">
                          {doc.type} · {doc.uploadedAt}
                        </p>
                        <div className="mt-1.5">
                          <StatusBadge status={doc.status || "Submitted"} />
                        </div>
                      </div>
                      {doc.url && (
                        <button
                          type="button"
                          onClick={() => window.open(doc.url, "_blank")}
                          className="p-1.5 rounded-md text-gray-500 hover:bg-white hover:text-amber-800 transition-colors shrink-0"
                          aria-label="View document"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </Section>
          </div>
        </div>
      </div>
    </>
  );
};

export default Application;