// src/users/pages/ApplicationForm.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  User,
  GraduationCap,
  Phone,
  MapPin,
  FileText,
  Upload,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Save,
  Send,
  Trash2,
  Loader2,
  AlertCircle,
  Calendar,
  Mail,
  Building2,
  BookOpen,
  Users,
  Hash,
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
   CURRENT STUDENT — from localStorage (set by StudentPortal)
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

/* =============================================================
   API SERVICE FUNCTIONS — JSON SERVER
   ============================================================= */

const applicationService = {
  /**
   * Fetch the current student's application, or null if none exists.
   * JSON Server: GET /applications?studentId=...
   */
  getApplication: async () => {
    const student = getCurrentStudent();
    if (!student?.studentId) return { data: null };

    const res = await api.get("/applications", {
      params: { studentId: student.studentId },
    });
    const list = Array.isArray(res.data) ? res.data : [];
    return { data: list[0] || null };
  },

  /**
   * Create a new application record.
   * JSON Server: POST /applications
   */
  createApplication: async (payload) => {
    return api.post("/applications", payload);
  },

  /**
   * Update an existing application record.
   * JSON Server: PATCH /applications/:id
   */
  updateApplication: async (id, payload) => {
    return api.patch(`/applications/${id}`, payload);
  },

  /**
   * Save as draft — PATCH with status = "Draft".
   */
  saveDraft: async (id, payload) => {
    return api.patch(`/applications/${id}`, {
      ...payload,
      status: "Draft",
      updatedAt: new Date().toISOString(),
    });
  },

  /**
   * Submit — PATCH with status = "Submitted".
   */
  submitApplication: async (id, payload) => {
    return api.patch(`/applications/${id}`, {
      ...payload,
      status: "Submitted",
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  },
};

/* =============================================================
   STEPS DEFINITION
   ============================================================= */
const STEPS = [
  { id: 1, name: "Personal", icon: User, description: "Your basic details" },
  {
    id: 2,
    name: "Academic",
    icon: GraduationCap,
    description: "Program & study info",
  },
  {
    id: 3,
    name: "Documents",
    icon: FileText,
    description: "Upload required files",
  },
  {
    id: 4,
    name: "Review",
    icon: CheckCircle2,
    description: "Confirm & submit",
  },
];

const REQUIRED_DOCS = [
  { key: "nationalId", label: "National ID / Passport", required: true },
  { key: "kcseCertificate", label: "KCSE Certificate", required: true },
  { key: "passportPhoto", label: "Passport Photo", required: true },
  {
    key: "recommendation",
    label: "Recommendation Letter",
    required: false,
  },
];

/* =============================================================
   INITIAL FORM STATE
   ============================================================= */
const initialForm = {
  personal: {
    fullName: "",
    dateOfBirth: "",
    gender: "",
    nationality: "",
    phone: "",
    email: "",
    address: "",
  },
  academic: {
    studentId: "",
    program: "",
    department: "",
    faculty: "",
    yearOfStudy: "",
    academicYear: "",
    semester: "",
  },
  applicationType: "Undergraduate",
  documents: [],
};

/* =============================================================
   FIELD WRAPPER
   ============================================================= */
function Field({ label, icon: Icon, required, error, children }) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-xs font-semibold text-black mb-1.5">
        {Icon && <Icon className="w-3.5 h-3.5 text-amber-800" />}
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && (
        <p className="mt-1 text-[11px] text-red-600 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {error}
        </p>
      )}
    </div>
  );
}

/* =============================================================
   TEXT INPUT
   ============================================================= */
function TextInput({ type = "text", value, onChange, placeholder, ...rest }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      {...rest}
      className="w-full px-3.5 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:border-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-800/10 transition-all"
    />
  );
}

/* =============================================================
   SELECT
   ============================================================= */
function Select({ value, onChange, options, placeholder }) {
  return (
    <select
      value={value}
      onChange={onChange}
      className="w-full px-3.5 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:border-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-800/10 transition-all"
    >
      <option value="">{placeholder || "Select an option"}</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

/* =============================================================
   STEPPER
   ============================================================= */
function Stepper({ current, onStepClick }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <ol className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {STEPS.map((step) => {
          const Icon = step.icon;
          const isActive = current === step.id;
          const isCompleted = current > step.id;

          return (
            <li key={step.id}>
              <button
                type="button"
                onClick={() => onStepClick(step.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-all ${
                  isActive
                    ? "bg-black text-white border-black"
                    : isCompleted
                    ? "bg-amber-50 border-amber-200 hover:border-amber-800"
                    : "bg-gray-50 border-gray-200 hover:border-gray-300"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    isActive
                      ? "bg-amber-500 text-amber-950"
                      : isCompleted
                      ? "bg-amber-800 text-white"
                      : "bg-white text-gray-500 border border-gray-200"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p
                    className={`text-xs font-bold truncate ${
                      isActive ? "text-white" : "text-black"
                    }`}
                  >
                    {step.name}
                  </p>
                  <p
                    className={`text-[10px] truncate ${
                      isActive ? "text-amber-200" : "text-gray-500"
                    }`}
                  >
                    {step.description}
                  </p>
                </div>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/* =============================================================
   MAIN COMPONENT
   ============================================================= */
const ApplicationForm = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(null);
  const [applicationId, setApplicationId] = useState(null);

  /* ------------------ FETCH EXISTING DRAFT ------------------ */
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);

      const student = getCurrentStudent();
      if (!student?.studentId) {
        toast.error("Please log in to access the application form.");
        navigate("/student-portal");
        return;
      }

      try {
        const res = await applicationService.getApplication();
        const raw = res?.data;

        if (!cancelled && raw && typeof raw === "object") {
          setApplicationId(raw.id);

          const personal = {
            fullName: raw.fullName || raw.personal?.fullName || "",
            dateOfBirth: raw.dateOfBirth || raw.personal?.dateOfBirth || "",
            gender: raw.gender || raw.personal?.gender || "",
            nationality: raw.nationality || raw.personal?.nationality || "",
            phone: raw.phone || raw.personal?.phone || "",
            email: raw.email || raw.personal?.email || "",
            address: raw.address || raw.personal?.address || "",
          };

          const academic = {
            studentId:
              raw.studentId || raw.academic?.studentId || student.studentId,
            program: raw.program || raw.academic?.program || "",
            department: raw.department || raw.academic?.department || "",
            faculty: raw.faculty || raw.academic?.faculty || "",
            yearOfStudy: raw.yearOfStudy || raw.academic?.yearOfStudy || "",
            academicYear:
              raw.academicYear || raw.academic?.academicYear || "",
            semester: raw.semester || raw.academic?.semester || "",
          };

          setForm({
            personal,
            academic,
            applicationType: raw.applicationType || "Undergraduate",
            documents: Array.isArray(raw.documents) ? raw.documents : [],
          });

          toast.info("Loaded your saved application.");
        } else if (!cancelled) {
          setForm((prev) => ({
            ...prev,
            personal: {
              ...prev.personal,
              fullName: student.fullName || "",
              email: student.email || "",
              phone: student.phone || "",
              nationality: student.nationality || "",
            },
            academic: {
              ...prev.academic,
              studentId: student.studentId || "",
              program: student.program || "",
              department: student.department || "",
              yearOfStudy: student.yearOfStudy || "",
            },
          }));
        }
      } catch (err) {
        if (!err?.response) {
          toast.error(
            "Unable to connect to the server. Make sure JSON Server is running on port 5000."
          );
        } else {
          toast.error("Failed to load your application.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  /* ------------------ FORM CHANGE ------------------ */
  const updateSection = (section, key, value) => {
    setForm((prev) => ({
      ...prev,
      [section]: { ...prev[section], [key]: value },
    }));
    setErrors((prev) => {
      const copy = { ...prev };
      delete copy[`${section}.${key}`];
      return copy;
    });
  };

  /* ------------------ VALIDATION ------------------ */
  const validateStep = (stepId) => {
    const newErrors = {};

    if (stepId === 1) {
      const p = form.personal;
      if (!p.fullName?.trim())
        newErrors["personal.fullName"] = "Full name is required";
      if (!p.dateOfBirth)
        newErrors["personal.dateOfBirth"] = "Date of birth is required";
      if (!p.gender) newErrors["personal.gender"] = "Please select gender";
      if (!p.nationality?.trim())
        newErrors["personal.nationality"] = "Nationality is required";
      if (!p.phone?.trim()) newErrors["personal.phone"] = "Phone is required";
      if (!p.email?.trim()) newErrors["personal.email"] = "Email is required";
      else if (!/^\S+@\S+\.\S+$/.test(p.email))
        newErrors["personal.email"] = "Invalid email format";
      if (!p.address?.trim())
        newErrors["personal.address"] = "Address is required";
    }

    if (stepId === 2) {
      const a = form.academic;
      if (!a.studentId?.trim())
        newErrors["academic.studentId"] = "Student ID is required";
      if (!a.program?.trim())
        newErrors["academic.program"] = "Program is required";
      if (!a.department?.trim())
        newErrors["academic.department"] = "Department is required";
      if (!a.faculty?.trim())
        newErrors["academic.faculty"] = "Faculty is required";
      if (!a.yearOfStudy)
        newErrors["academic.yearOfStudy"] = "Year of study is required";
      if (!a.academicYear?.trim())
        newErrors["academic.academicYear"] = "Academic year is required";
      if (!a.semester)
        newErrors["academic.semester"] = "Semester is required";
    }

    if (stepId === 3) {
      const uploaded = form.documents.map((d) => d.key);
      REQUIRED_DOCS.forEach((doc) => {
        if (doc.required && !uploaded.includes(doc.key)) {
          newErrors[`documents.${doc.key}`] = `${doc.label} is required`;
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ------------------ BUILD PAYLOAD ------------------ */
  const buildPayload = (statusOverride) => {
    const student = getCurrentStudent();
    return {
      studentId: form.academic.studentId || student?.studentId,
      admissionNumber: student?.admissionNumber || null,
      applicationType: form.applicationType,
      status: statusOverride || undefined,

      // Personal (flat fields)
      fullName: form.personal.fullName,
      dateOfBirth: form.personal.dateOfBirth,
      gender: form.personal.gender,
      nationality: form.personal.nationality,
      phone: form.personal.phone,
      email: form.personal.email,
      address: form.personal.address,

      // Academic (flat fields)
      program: form.academic.program,
      department: form.academic.department,
      faculty: form.academic.faculty,
      yearOfStudy: form.academic.yearOfStudy,
      academicYear: form.academic.academicYear,
      semester: form.academic.semester,

      // Documents (metadata only)
      documents: form.documents,
    };
  };

  /* ------------------ NAVIGATION ------------------ */
  const goNext = () => {
    if (validateStep(step)) {
      setStep((s) => Math.min(s + 1, STEPS.length));
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      toast.error("Please fix the errors before continuing.");
    }
  };

  const goPrev = () => {
    setStep((s) => Math.max(s - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goToStep = (id) => {
    if (id > step && !validateStep(step)) {
      toast.error("Please complete the current step first.");
      return;
    }
    setStep(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ------------------ SAVE DRAFT ------------------ */
  const handleSaveDraft = async () => {
    setSaving(true);
    try {
      const payload = buildPayload("Draft");

      if (applicationId) {
        await applicationService.saveDraft(applicationId, payload);
      } else {
        const res = await applicationService.createApplication({
          ...payload,
          status: "Draft",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        if (res.data?.id) setApplicationId(res.data.id);
      }

      toast.success("Draft saved.");
    } catch (err) {
      if (!err.response) {
        toast.error(
          "Unable to connect to the server. Make sure JSON Server is running on port 5000."
        );
      } else {
        toast.error("Failed to save draft.");
      }
    } finally {
      setSaving(false);
    }
  };

  /* ------------------ SUBMIT ------------------ */
  const handleSubmit = async () => {
    const ok1 = validateStep(1);
    const ok2 = validateStep(2);
    const ok3 = validateStep(3);
    if (!ok1 || !ok2 || !ok3) {
      toast.error("Please complete all required fields.");
      setStep(!ok1 ? 1 : !ok2 ? 2 : 3);
      return;
    }

    setSubmitting(true);
    try {
      const payload = buildPayload("Submitted");

      if (applicationId) {
        await applicationService.submitApplication(applicationId, payload);
      } else {
        const res = await applicationService.createApplication({
          ...payload,
          status: "Submitted",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        if (res.data?.id) setApplicationId(res.data.id);
      }

      toast.success("Application submitted successfully!");
      setTimeout(() => navigate("/user/application"), 1200);
    } catch (err) {
      if (!err.response) {
        toast.error(
          "Unable to connect to the server. Make sure JSON Server is running on port 5000."
        );
      } else {
        toast.error("Failed to submit application.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  /* ------------------ DOCUMENT UPLOAD ------------------ */
  const handleUpload = async (docKey, file) => {
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File must be smaller than 5 MB.");
      return;
    }

    setUploading(docKey);
    try {
      const docEntry = {
        key: docKey,
        name: file.name,
        type: file.type,
        size: file.size,
        uploadedAt: new Date().toISOString().split("T")[0],
        status: "Uploaded",
        url: URL.createObjectURL(file),
      };

      const nextDocs = [
        ...form.documents.filter((d) => d.key !== docKey),
        docEntry,
      ];

      setForm((prev) => ({
        ...prev,
        documents: nextDocs,
      }));

      toast.success(`${file.name} attached.`);

      if (applicationId) {
        try {
          await applicationService.saveDraft(applicationId, {
            documents: nextDocs,
          });
        } catch {
          // Silent
        }
      }
    } catch (err) {
      toast.error("Upload failed. Please try again.");
    } finally {
      setUploading(null);
    }
  };

  const removeDocument = async (docKey) => {
    const nextDocs = form.documents.filter((d) => d.key !== docKey);
    setForm((prev) => ({ ...prev, documents: nextDocs }));
    toast.info("Document removed.");

    if (applicationId) {
      try {
        await applicationService.saveDraft(applicationId, {
          documents: nextDocs,
        });
      } catch {
        // Silent
      }
    }
  };

  /* =============================================================
     LOADING
     ============================================================= */
  if (loading) {
    return (
      <div className="space-y-5">
        <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-72 bg-gray-100 rounded animate-pulse" />
        <div className="h-24 bg-white border border-gray-200 rounded-xl animate-pulse" />
        <div className="h-96 bg-white border border-gray-200 rounded-xl animate-pulse" />
      </div>
    );
  }

  /* =============================================================
     RENDER
     ============================================================= */
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="space-y-6">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-black tracking-tight">
              Application Form
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Complete all steps to submit your university application.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:border-amber-800 hover:text-amber-800 transition-colors disabled:opacity-60"
            >
              {saving ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              Save Draft
            </button>
          </div>
        </div>

        {/* STEPPER */}
        <Stepper current={step} onStepClick={goToStep} />

        {/* STEP CONTENT */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          {/* STEP 1: PERSONAL */}
          {step === 1 && (
            <div className="p-6">
              <SectionHeader
                icon={User}
                title="Personal Information"
                subtitle="Tell us about yourself"
              />

              <div className="mt-6 grid sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <Field
                    label="Full Name"
                    icon={User}
                    required
                    error={errors["personal.fullName"]}
                  >
                    <TextInput
                      value={form.personal.fullName}
                      onChange={(e) =>
                        updateSection("personal", "fullName", e.target.value)
                      }
                      placeholder="e.g. Khalid Abdikarim"
                    />
                  </Field>
                </div>

                <Field
                  label="Date of Birth"
                  icon={Calendar}
                  required
                  error={errors["personal.dateOfBirth"]}
                >
                  <TextInput
                    type="date"
                    value={form.personal.dateOfBirth}
                    onChange={(e) =>
                      updateSection(
                        "personal",
                        "dateOfBirth",
                        e.target.value
                      )
                    }
                  />
                </Field>

                <Field
                  label="Gender"
                  icon={Users}
                  required
                  error={errors["personal.gender"]}
                >
                  <Select
                    value={form.personal.gender}
                    onChange={(e) =>
                      updateSection("personal", "gender", e.target.value)
                    }
                    placeholder="Select gender"
                    options={[
                      { value: "Male", label: "Male" },
                      { value: "Female", label: "Female" },
                      { value: "Other", label: "Other" },
                    ]}
                  />
                </Field>

                <Field
                  label="Nationality"
                  icon={MapPin}
                  required
                  error={errors["personal.nationality"]}
                >
                  <TextInput
                    value={form.personal.nationality}
                    onChange={(e) =>
                      updateSection(
                        "personal",
                        "nationality",
                        e.target.value
                      )
                    }
                    placeholder="e.g. Kenyan"
                  />
                </Field>

                <Field
                  label="Phone"
                  icon={Phone}
                  required
                  error={errors["personal.phone"]}
                >
                  <TextInput
                    type="tel"
                    value={form.personal.phone}
                    onChange={(e) =>
                      updateSection("personal", "phone", e.target.value)
                    }
                    placeholder="+254 700 000 000"
                  />
                </Field>

                <div className="sm:col-span-2">
                  <Field
                    label="Email"
                    icon={Mail}
                    required
                    error={errors["personal.email"]}
                  >
                    <TextInput
                      type="email"
                      value={form.personal.email}
                      onChange={(e) =>
                        updateSection("personal", "email", e.target.value)
                      }
                      placeholder="you@example.com"
                    />
                  </Field>
                </div>

                <div className="sm:col-span-2">
                  <Field
                    label="Address"
                    icon={MapPin}
                    required
                    error={errors["personal.address"]}
                  >
                    <textarea
                      rows={3}
                      value={form.personal.address}
                      onChange={(e) =>
                        updateSection("personal", "address", e.target.value)
                      }
                      placeholder="Street, City, Postal Code"
                      className="w-full px-3.5 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:border-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-800/10 transition-all resize-none"
                    />
                  </Field>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: ACADEMIC */}
          {step === 2 && (
            <div className="p-6">
              <SectionHeader
                icon={GraduationCap}
                title="Academic Information"
                subtitle="Your program and study details"
              />

              <div className="mt-6 grid sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <Field label="Application Type" icon={FileText} required>
                    <Select
                      value={form.applicationType}
                      onChange={(e) =>
                        setForm({ ...form, applicationType: e.target.value })
                      }
                      options={[
                        { value: "Undergraduate", label: "Undergraduate" },
                        { value: "Postgraduate", label: "Postgraduate" },
                        { value: "Diploma", label: "Diploma" },
                        { value: "Certificate", label: "Certificate" },
                      ]}
                    />
                  </Field>
                </div>

                <Field
                  label="Student ID"
                  icon={Hash}
                  required
                  error={errors["academic.studentId"]}
                >
                  <TextInput
                    value={form.academic.studentId}
                    onChange={(e) =>
                      updateSection("academic", "studentId", e.target.value)
                    }
                    placeholder="e.g. STU-2026-001"
                  />
                </Field>

                <Field
                  label="Program"
                  icon={BookOpen}
                  required
                  error={errors["academic.program"]}
                >
                  <TextInput
                    value={form.academic.program}
                    onChange={(e) =>
                      updateSection("academic", "program", e.target.value)
                    }
                    placeholder="e.g. BSc Computer Science"
                  />
                </Field>

                <Field
                  label="Department"
                  icon={Building2}
                  required
                  error={errors["academic.department"]}
                >
                  <TextInput
                    value={form.academic.department}
                    onChange={(e) =>
                      updateSection("academic", "department", e.target.value)
                    }
                    placeholder="e.g. Computer Science"
                  />
                </Field>

                <Field
                  label="Faculty"
                  icon={Building2}
                  required
                  error={errors["academic.faculty"]}
                >
                  <TextInput
                    value={form.academic.faculty}
                    onChange={(e) =>
                      updateSection("academic", "faculty", e.target.value)
                    }
                    placeholder="e.g. Faculty of Science"
                  />
                </Field>

                <Field
                  label="Year of Study"
                  icon={Calendar}
                  required
                  error={errors["academic.yearOfStudy"]}
                >
                  <Select
                    value={form.academic.yearOfStudy}
                    onChange={(e) =>
                      updateSection("academic", "yearOfStudy", e.target.value)
                    }
                    placeholder="Select year"
                    options={[
                      { value: "1", label: "Year 1" },
                      { value: "2", label: "Year 2" },
                      { value: "3", label: "Year 3" },
                      { value: "4", label: "Year 4" },
                      { value: "5", label: "Year 5" },
                    ]}
                  />
                </Field>

                <Field
                  label="Academic Year"
                  icon={Calendar}
                  required
                  error={errors["academic.academicYear"]}
                >
                  <TextInput
                    value={form.academic.academicYear}
                    onChange={(e) =>
                      updateSection(
                        "academic",
                        "academicYear",
                        e.target.value
                      )
                    }
                    placeholder="e.g. 2025/2026"
                  />
                </Field>

                <Field
                  label="Semester"
                  icon={Calendar}
                  required
                  error={errors["academic.semester"]}
                >
                  <Select
                    value={form.academic.semester}
                    onChange={(e) =>
                      updateSection("academic", "semester", e.target.value)
                    }
                    placeholder="Select semester"
                    options={[
                      { value: "Semester 1", label: "Semester 1" },
                      { value: "Semester 2", label: "Semester 2" },
                      { value: "Trimester 1", label: "Trimester 1" },
                      { value: "Trimester 2", label: "Trimester 2" },
                      { value: "Trimester 3", label: "Trimester 3" },
                    ]}
                  />
                </Field>
              </div>
            </div>
          )}

          {/* STEP 3: DOCUMENTS */}
          {step === 3 && (
            <div className="p-6">
              <SectionHeader
                icon={FileText}
                title="Supporting Documents"
                subtitle="Attach the required files (max 5 MB each)"
              />

              <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3 mb-5">
                <AlertCircle className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
                <p className="text-xs text-gray-700 leading-relaxed">
                  Document metadata is stored in{" "}
                  <code className="font-mono">db.json</code>. Actual file
                  contents are not persisted in this dev environment.
                </p>
              </div>

              <div className="space-y-3">
                {REQUIRED_DOCS.map((doc) => {
                  const uploaded = form.documents.find(
                    (d) => d.key === doc.key
                  );
                  const isUploading = uploading === doc.key;
                  const err = errors[`documents.${doc.key}`];

                  return (
                    <div
                      key={doc.key}
                      className={`p-4 border rounded-xl transition-all ${
                        err
                          ? "border-red-200 bg-red-50"
                          : uploaded
                          ? "border-amber-200 bg-amber-50/50"
                          : "border-gray-200 bg-white hover:border-amber-800/40"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                            uploaded ? "bg-amber-800" : "bg-amber-50"
                          }`}
                        >
                          {uploaded ? (
                            <CheckCircle2 className="w-5 h-5 text-white" />
                          ) : (
                            <FileText className="w-5 h-5 text-amber-800" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-sm font-bold text-black">
                              {doc.label}
                            </p>
                            {doc.required ? (
                              <span className="text-[10px] font-semibold uppercase tracking-widest text-red-600">
                                Required
                              </span>
                            ) : (
                              <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                                Optional
                              </span>
                            )}
                          </div>

                          {uploaded ? (
                            <div className="mt-1.5 flex items-center gap-2 text-[11px] text-gray-600">
                              <span className="truncate max-w-[220px]">
                                {uploaded.name}
                              </span>
                              <span>·</span>
                              <span>{uploaded.uploadedAt}</span>
                            </div>
                          ) : (
                            <p className="text-[11px] text-gray-500 mt-0.5">
                              PDF, JPG, or PNG · up to 5 MB
                            </p>
                          )}

                          {err && (
                            <p className="mt-1.5 text-[11px] text-red-600 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              {err}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {uploaded && (
                            <button
                              type="button"
                              onClick={() => removeDocument(doc.key)}
                              className="p-2 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                              aria-label="Remove document"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}

                          <label
                            className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg cursor-pointer transition-colors ${
                              isUploading
                                ? "bg-gray-100 text-gray-400 cursor-wait"
                                : uploaded
                                ? "bg-white border border-gray-200 text-gray-700 hover:border-amber-800 hover:text-amber-800"
                                : "bg-amber-900 text-white hover:bg-amber-800"
                            }`}
                          >
                            {isUploading ? (
                              <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                Attaching...
                              </>
                            ) : (
                              <>
                                <Upload className="w-3.5 h-3.5" />
                                {uploaded ? "Replace" : "Upload"}
                              </>
                            )}
                            <input
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleUpload(doc.key, file);
                                e.target.value = "";
                              }}
                              disabled={isUploading}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: REVIEW */}
          {step === 4 && (
            <div className="p-6">
              <SectionHeader
                icon={CheckCircle2}
                title="Review & Submit"
                subtitle="Confirm your information before submission"
              />

              <div className="mt-6 space-y-4">
                <ReviewBlock title="Personal Information" icon={User}>
                  <ReviewRow
                    label="Full Name"
                    value={form.personal.fullName}
                  />
                  <ReviewRow
                    label="Date of Birth"
                    value={form.personal.dateOfBirth}
                  />
                  <ReviewRow label="Gender" value={form.personal.gender} />
                  <ReviewRow
                    label="Nationality"
                    value={form.personal.nationality}
                  />
                  <ReviewRow label="Phone" value={form.personal.phone} />
                  <ReviewRow label="Email" value={form.personal.email} />
                  <ReviewRow label="Address" value={form.personal.address} />
                </ReviewBlock>

                <ReviewBlock title="Academic Information" icon={GraduationCap}>
                  <ReviewRow
                    label="Application Type"
                    value={form.applicationType}
                  />
                  <ReviewRow
                    label="Student ID"
                    value={form.academic.studentId}
                  />
                  <ReviewRow
                    label="Program"
                    value={form.academic.program}
                  />
                  <ReviewRow
                    label="Department"
                    value={form.academic.department}
                  />
                  <ReviewRow
                    label="Faculty"
                    value={form.academic.faculty}
                  />
                  <ReviewRow
                    label="Year of Study"
                    value={form.academic.yearOfStudy}
                  />
                  <ReviewRow
                    label="Academic Year"
                    value={form.academic.academicYear}
                  />
                  <ReviewRow
                    label="Semester"
                    value={form.academic.semester}
                  />
                </ReviewBlock>

                <ReviewBlock title="Supporting Documents" icon={FileText}>
                  {form.documents.length === 0 ? (
                    <p className="text-sm text-gray-500 py-2">
                      No documents uploaded.
                    </p>
                  ) : (
                    form.documents.map((d) => (
                      <div
                        key={d.key}
                        className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-black truncate">
                            {d.name}
                          </p>
                          <p className="text-[11px] text-gray-500">
                            Uploaded {d.uploadedAt}
                          </p>
                        </div>
                        <CheckCircle2 className="w-4 h-4 text-amber-800 shrink-0" />
                      </div>
                    ))
                  )}
                </ReviewBlock>
              </div>

              <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
                <p className="text-xs text-gray-700 leading-relaxed">
                  Please review your information carefully. Once submitted, you
                  cannot edit the application unless it requires correction.
                </p>
              </div>
            </div>
          )}

          {/* NAVIGATION FOOTER */}
          <div className="flex items-center justify-between gap-3 px-6 py-4 bg-gray-50 border-t border-gray-100">
            <button
              type="button"
              onClick={goPrev}
              disabled={step === 1}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:border-amber-800 hover:text-amber-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>

            <span className="text-xs text-gray-500 hidden sm:inline">
              Step {step} of {STEPS.length}
            </span>

            {step < STEPS.length ? (
              <button
                type="button"
                onClick={goNext}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-white bg-amber-900 rounded-lg hover:bg-amber-800 transition-colors"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-white bg-amber-900 rounded-lg hover:bg-amber-800 transition-colors disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Submit Application
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

/* =============================================================
   SMALL SUBCOMPONENTS
   ============================================================= */
function SectionHeader({ icon: Icon, title, subtitle }) {
  return (
    <div className="flex items-center gap-3 pb-5 border-b border-gray-100">
      <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-amber-800" />
      </div>
      <div>
        <h2 className="text-base font-bold text-black">{title}</h2>
        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
      </div>
    </div>
  );
}

function ReviewBlock({ title, icon: Icon, children }) {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-b border-gray-100">
        <Icon className="w-4 h-4 text-amber-800" />
        <p className="text-xs font-bold uppercase tracking-widest text-black">
          {title}
        </p>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function ReviewRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-3 py-2 border-b border-gray-50 last:border-0">
      <span className="text-xs text-gray-500 shrink-0">{label}</span>
      <span className="text-sm font-semibold text-black text-right break-words">
        {value || "—"}
      </span>
    </div>
  );
}

export default ApplicationForm;