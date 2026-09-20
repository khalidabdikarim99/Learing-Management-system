// src/users/pages/RegisterUnits.jsx
import { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  BookOpen,
  Calendar,
  GraduationCap,
  Clock,
  Search,
  Filter,
  X,
  Eye,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RefreshCw,
  ChevronRight,
  Users,
  FileText,
  Info,
  Hash,
  Building2,
  Award,
  Ban,
  ChevronDown,
  ShieldCheck,
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
   HELPERS — CURRENT STUDENT
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
   API SERVICE — JSON SERVER
   =============================================================
   JSON Server resources:
     GET    /units?status=Active               → available units
     GET    /unitRegistrations?studentId=...   → already registered
     POST   /unitRegistrations                 → register units
     DELETE /unitRegistrations/:id             → drop unit
   ============================================================= */

const unitService = {
  /**
   * Get available units (active only).
   */
  getAvailableUnits: async (params = {}) => {
    const res = await api.get("/units", {
      params: { status: "Active", ...params },
    });
    return { data: Array.isArray(res.data) ? res.data : [] };
  },

  /**
   * Derive registration period from available units + student profile.
   * JSON Server has no dedicated resource for this.
   */
  getRegistrationPeriod: async (units) => {
    const student = getCurrentStudent();
    if (!student) return { data: null };

    // Pick semester/academic year from the first unit (they share the same)
    const sample = units[0] || {};
    return {
      data: {
        studentId: student.studentId,
        academicYear: sample.academicYear || "2025/2026",
        semester: sample.semester || "Semester 1",
        program: student.program || sample.program || "—",
        yearOfStudy: student.yearOfStudy || "—",
        registrationPeriod: "Open",
        deadline: null,
        maxCreditHours: 24,
        requiredUnitsCount: 6,
        isOpen: true,
      },
    };
  },

  /**
   * Get currently registered units for this student.
   */
  getRegisteredUnits: async () => {
    const student = getCurrentStudent();
    if (!student?.studentId) return { data: [] };
    const res = await api.get("/unitRegistrations", {
      params: { studentId: student.studentId },
    });
    return { data: Array.isArray(res.data) ? res.data : [] };
  },

  /**
   * Register selected units — POST one record per unit.
   */
  registerUnits: async (payload) => {
    const { studentId, units, academicYear, semester } = payload;
    const student = getCurrentStudent();

    const results = await Promise.all(
      units.map((unit) =>
        api.post("/unitRegistrations", {
          studentId,
          studentName: student?.fullName || "",
          program: student?.program || unit.program || "",
          department: unit.department || "",
          unitId: unit.id,
          unitCode: unit.unitCode,
          unitName: unit.unitName,
          creditHours: unit.creditHours,
          lecturer: unit.lecturer || "",
          academicYear,
          semester,
          status: "Pending",
          registrationDate: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
      )
    );
    return { data: results.map((r) => r.data) };
  },

  /**
   * Drop a registration by id.
   */
  dropUnit: async (registrationId) => {
    return api.delete(`/unitRegistrations/${registrationId}`);
  },
};

/* =============================================================
   MAIN COMPONENT
   ============================================================= */

const RegisterUnits = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [period, setPeriod] = useState(null);
  const [units, setUnits] = useState([]);
  const [selected, setSelected] = useState([]);
  const [alreadyRegistered, setAlreadyRegistered] = useState([]);

  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [semester, setSemester] = useState("");
  const [level, setLevel] = useState("");
  const [credits, setCredits] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const [detailUnit, setDetailUnit] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  /* ---------------- FETCH ALL ---------------- */
  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [unitsRes, registeredRes] = await Promise.allSettled([
        unitService.getAvailableUnits(),
        unitService.getRegisteredUnits(),
      ]);

      let fetchedUnits = [];

      /* Available units */
      if (unitsRes.status === "fulfilled") {
        fetchedUnits = toArray(unwrap(unitsRes.value.data, []));
        setUnits(fetchedUnits);
      } else {
        const reason = unitsRes.reason;
        if (!reason?.response) {
          toast.error("Network error. Please check your connection.");
          setError("network");
        } else {
          toast.error("Failed to load available units.");
          setError("server");
        }
      }

      /* Derive registration period */
      try {
        const periodRes = await unitService.getRegistrationPeriod(fetchedUnits);
        setPeriod(unwrap(periodRes.data, null));
      } catch {
        setPeriod(null);
      }

      /* Already registered */
      if (registeredRes.status === "fulfilled") {
        setAlreadyRegistered(toArray(unwrap(registeredRes.value.data, [])));
      } else {
        setAlreadyRegistered([]);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  /* ---------------- DERIVED ---------------- */
  const alreadyRegisteredIds = useMemo(
    () => new Set(alreadyRegistered.map((r) => r.unitId || r.id)),
    [alreadyRegistered]
  );

  const departments = useMemo(
    () => [...new Set(units.map((u) => u.department).filter(Boolean))].sort(),
    [units]
  );

  const semesters = useMemo(
    () => [...new Set(units.map((u) => u.semester).filter(Boolean))].sort(),
    [units]
  );

  const levels = useMemo(
    () => [...new Set(units.map((u) => u.level).filter(Boolean))].sort(),
    [units]
  );

  const creditOptions = useMemo(
    () =>
      [...new Set(units.map((u) => u.creditHours).filter(Boolean))].sort(
        (a, b) => a - b
      ),
    [units]
  );

  const filteredUnits = useMemo(() => {
    const q = search.trim().toLowerCase();
    return units.filter((u) => {
      if (q && !`${u.unitCode} ${u.unitName}`.toLowerCase().includes(q))
        return false;
      if (department && u.department !== department) return false;
      if (semester && u.semester !== semester) return false;
      if (level && u.level !== level) return false;
      if (credits && String(u.creditHours) !== String(credits)) return false;
      return true;
    });
  }, [units, search, department, semester, level, credits]);

  const maxCredits = Number(period?.maxCreditHours) || 24;
  const selectedCredits = selected.reduce(
    (sum, u) => sum + Number(u.creditHours || 0),
    0
  );
  const remainingCredits = Math.max(maxCredits - selectedCredits, 0);

  const requiredUnitsCount =
    Number(period?.requiredUnitsCount) || selected.length;

  /* ---------------- SELECTION ---------------- */
  const isSelected = (unit) => selected.some((s) => s.id === unit.id);
  const isRegistered = (unit) => alreadyRegisteredIds.has(unit.id);

  const toggleSelect = (unit) => {
    if (isRegistered(unit)) {
      toast.info("This unit is already registered.");
      return;
    }

    if (isSelected(unit)) {
      setSelected((prev) => prev.filter((s) => s.id !== unit.id));
      return;
    }

    if (selected.some((s) => s.unitCode === unit.unitCode)) {
      toast.warn("This unit is already selected.");
      return;
    }

    const newTotal = selectedCredits + Number(unit.creditHours || 0);
    if (newTotal > maxCredits) {
      toast.error(
        `Adding this unit exceeds the max credit limit of ${maxCredits}.`
      );
      return;
    }

    if (Array.isArray(unit.prerequisites) && unit.prerequisites.length > 0) {
      const missing = unit.prerequisites.filter(
        (p) => typeof p === "object" && !p.completed && !p.met
      );
      if (missing.length > 0 && unit.enforcePrerequisites) {
        toast.error(
          `Missing prerequisites: ${missing
            .map((p) => p.code || p.name)
            .join(", ")}`
        );
        return;
      }
    }

    if (unit.status && unit.status !== "Active") {
      toast.error("This unit is not open for registration.");
      return;
    }

    setSelected((prev) => [...prev, unit]);
  };

  const removeSelected = (id) =>
    setSelected((prev) => prev.filter((s) => s.id !== id));

  /* ---------------- REGISTRATION ---------------- */
  const handleRegisterClick = () => {
    if (selected.length === 0) {
      toast.info("Please select at least one unit.");
      return;
    }
    if (period && period.isOpen === false) {
      toast.error("Registration period is closed.");
      return;
    }
    setConfirmOpen(true);
  };

  const handleConfirmRegister = async () => {
    setSubmitting(true);
    try {
      const student = getCurrentStudent();
      const payload = {
        studentId: student?.studentId,
        academicYear: period?.academicYear,
        semester: period?.semester,
        units: selected,
      };

      await unitService.registerUnits(payload);
      toast.success("Units registered successfully.");
      setConfirmOpen(false);
      setSelected([]);
      setTimeout(() => navigate("/user/my-registered-units"), 1200);
    } catch (err) {
      if (!err.response) {
        toast.error("Network error. Please try again.");
      } else {
        toast.error("Failed to register units.");
      }
    } finally {
      setSubmitting(false);
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
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-24 bg-white border border-gray-200 rounded-xl animate-pulse"
            />
          ))}
        </div>
        <div className="h-96 bg-white border border-gray-200 rounded-xl animate-pulse" />
      </div>
    );
  }

  /* =============================================================
     ERROR
     ============================================================= */
  if (error === "network") {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="max-w-md w-full bg-white border border-gray-200 rounded-xl p-8 text-center">
          <div className="w-14 h-14 mx-auto rounded-full bg-red-50 flex items-center justify-center">
            <AlertCircle className="w-7 h-7 text-red-600" />
          </div>
          <h2 className="mt-4 text-lg font-bold text-black">
            Couldn't Load Units
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            We couldn't reach the server. Make sure JSON Server is running on
            port 5000.
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
              Register Units
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Select the units you want to register for the current semester.
            </p>
          </div>
          <button
            onClick={fetchAll}
            className="self-start inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:border-amber-800 hover:text-amber-800 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
        </div>

        {/* SEMESTER INFO */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
            <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center">
              <Calendar className="w-4 h-4 text-amber-800" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-black">
                Semester Information
              </h2>
              <p className="text-[11px] text-gray-500">
                Your current registration window and program
              </p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <SemesterItem
              icon={Calendar}
              label="Academic Year"
              value={period?.academicYear}
            />
            <SemesterItem
              icon={BookOpen}
              label="Semester"
              value={period?.semester}
            />
            <SemesterItem
              icon={GraduationCap}
              label="Program"
              value={period?.program}
            />
            <SemesterItem
              icon={Users}
              label="Year of Study"
              value={period?.yearOfStudy}
            />
            <SemesterItem
              icon={Clock}
              label="Registration Period"
              value={period?.registrationPeriod}
            />
            <SemesterItem
              icon={AlertCircle}
              label="Deadline"
              value={period?.deadline}
              highlight
            />
          </div>

          {period?.isOpen === false && (
            <div className="mt-4 flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg p-3">
              <Ban className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <p className="text-xs text-red-800">
                Registration is currently <strong>closed</strong>. Please
                contact the academic office.
              </p>
            </div>
          )}
        </div>

        {/* SUMMARY */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <SummaryCard
            icon={BookOpen}
            label="Required Units"
            value={requiredUnitsCount}
            tone="gray"
          />
          <SummaryCard
            icon={CheckCircle2}
            label="Selected Units"
            value={selected.length}
            tone="amber"
          />
          <SummaryCard
            icon={Award}
            label="Total Credits"
            value={selectedCredits}
            tone="amber"
          />
          <SummaryCard
            icon={ShieldCheck}
            label="Max Credits"
            value={maxCredits}
            tone="gray"
          />
          <SummaryCard
            icon={Clock}
            label="Remaining"
            value={remainingCredits}
            tone={remainingCredits === 0 ? "red" : "green"}
          />
        </div>

        {/* TWO COLUMN LAYOUT */}
        <div className="grid lg:grid-cols-3 gap-5">
          {/* AVAILABLE UNITS */}
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                    <BookOpen className="w-4 h-4 text-amber-800" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-sm font-bold text-black truncate">
                      Available Units
                    </h2>
                    <p className="text-[11px] text-gray-500 truncate">
                      {filteredUnits.length} unit
                      {filteredUnits.length === 1 ? "" : "s"} found
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowFilters((v) => !v)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                    showFilters
                      ? "bg-amber-900 text-white border-amber-900"
                      : "bg-white text-gray-700 border-gray-200 hover:border-amber-800 hover:text-amber-800"
                  }`}
                >
                  <Filter className="w-3.5 h-3.5" />
                  Filters
                </button>
              </div>

              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by unit code or name..."
                  className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:border-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-800/10 transition-all"
                />
              </div>

              {showFilters && (
                <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-gray-100">
                  <FilterSelect
                    label="Department"
                    value={department}
                    onChange={setDepartment}
                    options={departments}
                  />
                  <FilterSelect
                    label="Semester"
                    value={semester}
                    onChange={setSemester}
                    options={semesters}
                  />
                  <FilterSelect
                    label="Level"
                    value={level}
                    onChange={setLevel}
                    options={levels}
                  />
                  <FilterSelect
                    label="Credits"
                    value={credits}
                    onChange={setCredits}
                    options={creditOptions}
                  />

                  <div className="col-span-2 sm:col-span-4 flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        setSearch("");
                        setDepartment("");
                        setSemester("");
                        setLevel("");
                        setCredits("");
                      }}
                      className="text-xs font-semibold text-amber-800 hover:text-amber-900"
                    >
                      Clear all filters
                    </button>
                  </div>
                </div>
              )}
            </div>

            {filteredUnits.length === 0 ? (
              <div className="p-10 text-center">
                <FileText className="w-10 h-10 mx-auto text-gray-300" />
                <p className="mt-3 text-sm font-semibold text-black">
                  No units found
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Try adjusting your search or filters.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr className="text-left">
                      <th className="px-3 py-2.5 w-10"></th>
                      <th className="px-3 py-2.5 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                        Code
                      </th>
                      <th className="px-3 py-2.5 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                        Unit Name
                      </th>
                      <th className="px-3 py-2.5 text-[10px] font-bold uppercase tracking-widest text-gray-500 hidden md:table-cell">
                        Credits
                      </th>
                      <th className="px-3 py-2.5 text-[10px] font-bold uppercase tracking-widest text-gray-500 hidden lg:table-cell">
                        Lecturer
                      </th>
                      <th className="px-3 py-2.5 text-[10px] font-bold uppercase tracking-widest text-gray-500 hidden lg:table-cell">
                        Status
                      </th>
                      <th className="px-3 py-2.5 w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredUnits.map((unit) => {
                      const registered = isRegistered(unit);
                      const selectedUnit = isSelected(unit);

                      return (
                        <tr
                          key={unit.id}
                          className={`transition-colors ${
                            selectedUnit
                              ? "bg-amber-50/60"
                              : registered
                              ? "bg-gray-50/50"
                              : "hover:bg-gray-50"
                          }`}
                        >
                          <td className="px-3 py-3">
                            <input
                              type="checkbox"
                              checked={selectedUnit}
                              disabled={registered}
                              onChange={() => toggleSelect(unit)}
                              className="w-4 h-4 rounded border-gray-300 text-amber-800 focus:ring-amber-800/20 cursor-pointer disabled:cursor-not-allowed"
                            />
                          </td>
                          <td className="px-3 py-3">
                            <span className="text-xs font-bold text-black">
                              {unit.unitCode}
                            </span>
                          </td>
                          <td className="px-3 py-3">
                            <p className="text-xs font-semibold text-black truncate max-w-[240px]">
                              {unit.unitName}
                            </p>
                            <p className="text-[10px] text-gray-500 truncate max-w-[240px] mt-0.5">
                              {unit.description}
                            </p>
                          </td>
                          <td className="px-3 py-3 hidden md:table-cell">
                            <span className="text-xs font-semibold text-black">
                              {unit.creditHours}
                            </span>
                          </td>
                          <td className="px-3 py-3 hidden lg:table-cell">
                            <span className="text-xs text-gray-600 truncate max-w-[140px] inline-block">
                              {unit.lecturer}
                            </span>
                          </td>
                          <td className="px-3 py-3 hidden lg:table-cell">
                            {registered ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-50 text-green-700 border border-green-200">
                                <CheckCircle2 className="w-2.5 h-2.5" />
                                Registered
                              </span>
                            ) : unit.status === "Inactive" ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-50 text-red-700 border border-red-200">
                                <Ban className="w-2.5 h-2.5" />
                                Closed
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                                Open
                              </span>
                            )}
                          </td>
                          <td className="px-3 py-3">
                            <button
                              type="button"
                              onClick={() => setDetailUnit(unit)}
                              className="p-1.5 rounded-md text-gray-400 hover:text-amber-800 hover:bg-white transition-colors"
                              aria-label="View unit details"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* SELECTED UNITS */}
          <div className="lg:col-span-1 space-y-5">
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-amber-800" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-sm font-bold text-black truncate">
                      Selected Units
                    </h2>
                    <p className="text-[11px] text-gray-500 truncate">
                      {selected.length} selected
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5">
                {selected.length === 0 ? (
                  <div className="text-center py-6">
                    <BookOpen className="w-8 h-8 mx-auto text-gray-300" />
                    <p className="mt-3 text-xs text-gray-500">
                      No units selected yet.
                    </p>
                    <p className="text-[11px] text-gray-400 mt-1">
                      Pick units from the table to get started.
                    </p>
                  </div>
                ) : (
                  <ul className="space-y-2">
                    {selected.map((u) => (
                      <li
                        key={u.id}
                        className="flex items-center gap-2.5 p-2.5 bg-gray-50 border border-gray-100 rounded-lg"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-black truncate">
                            {u.unitCode}
                          </p>
                          <p className="text-[10px] text-gray-500 truncate">
                            {u.unitName}
                          </p>
                        </div>
                        <span className="text-[10px] font-semibold text-amber-800 shrink-0">
                          {u.creditHours} cr
                        </span>
                        <button
                          type="button"
                          onClick={() => removeSelected(u.id)}
                          className="p-1 rounded-md text-gray-400 hover:text-red-600 hover:bg-white transition-colors shrink-0"
                          aria-label="Remove unit"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

                {selected.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      Total credits
                    </span>
                    <span className="text-sm font-bold text-black">
                      {selectedCredits} / {maxCredits}
                    </span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleRegisterClick}
                  disabled={selected.length === 0 || submitting}
                  className="mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-amber-900 rounded-lg hover:bg-amber-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Registering...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Register Selected Units
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Already registered */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4 text-amber-800" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-sm font-bold text-black truncate">
                    Already Registered
                  </h2>
                  <p className="text-[11px] text-gray-500 truncate">
                    {alreadyRegistered.length} unit
                    {alreadyRegistered.length === 1 ? "" : "s"}
                  </p>
                </div>
              </div>

              <div className="p-5">
                {alreadyRegistered.length === 0 ? (
                  <p className="text-xs text-gray-500 text-center py-3">
                    You haven't registered any units yet.
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {alreadyRegistered.slice(0, 5).map((r, idx) => (
                      <li
                        key={r.id || idx}
                        className="flex items-center justify-between gap-2 p-2 bg-gray-50 border border-gray-100 rounded-lg"
                      >
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-black truncate">
                            {r.unitCode}
                          </p>
                          <p className="text-[10px] text-gray-500 truncate">
                            {r.unitName}
                          </p>
                        </div>
                        <span className="text-[10px] font-semibold text-green-700 shrink-0">
                          {r.creditHours} cr
                        </span>
                      </li>
                    ))}
                    {alreadyRegistered.length > 5 && (
                      <li className="text-center pt-2">
                        <button
                          onClick={() => navigate("/user/my-registered-units")}
                          className="text-[11px] font-semibold text-amber-800 hover:text-amber-900 inline-flex items-center gap-1"
                        >
                          View all {alreadyRegistered.length} units
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </li>
                    )}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* UNIT DETAILS DRAWER */}
      {detailUnit && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="flex-1 bg-black/50"
            onClick={() => setDetailUnit(null)}
          />
          <aside className="w-full max-w-md h-full bg-white flex flex-col shadow-2xl">
            <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                  <BookOpen className="w-4 h-4 text-amber-800" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-black truncate">
                    {detailUnit.unitCode}
                  </p>
                  <p className="text-[11px] text-gray-500 truncate">
                    Unit details
                  </p>
                </div>
              </div>
              <button
                onClick={() => setDetailUnit(null)}
                className="p-1.5 rounded-md text-gray-400 hover:bg-gray-100 hover:text-black transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              <div>
                <p className="text-base font-bold text-black">
                  {detailUnit.unitName}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                    <Award className="w-2.5 h-2.5" />
                    {detailUnit.creditHours} credit hours
                  </span>
                  {detailUnit.semester && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-700 border border-gray-200">
                      {detailUnit.semester}
                    </span>
                  )}
                </div>
              </div>

              {detailUnit.description && (
                <DrawerBlock title="Description">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {detailUnit.description}
                  </p>
                </DrawerBlock>
              )}

              {Array.isArray(detailUnit.objectives) &&
                detailUnit.objectives.length > 0 && (
                  <DrawerBlock title="Learning Objectives">
                    <ul className="space-y-1.5">
                      {detailUnit.objectives.map((o, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sm text-gray-700"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-800 shrink-0 mt-0.5" />
                          {o}
                        </li>
                      ))}
                    </ul>
                  </DrawerBlock>
                )}

              {Array.isArray(detailUnit.prerequisites) &&
                detailUnit.prerequisites.length > 0 && (
                  <DrawerBlock title="Prerequisites">
                    <ul className="space-y-1.5">
                      {detailUnit.prerequisites.map((p, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sm text-gray-700"
                        >
                          <Info className="w-3.5 h-3.5 text-amber-800 shrink-0 mt-0.5" />
                          {typeof p === "object"
                            ? `${p.code || ""} — ${p.name || ""}`
                            : p}
                        </li>
                      ))}
                    </ul>
                  </DrawerBlock>
                )}

              <div className="grid grid-cols-2 gap-3">
                <MiniInfo
                  icon={GraduationCap}
                  label="Lecturer"
                  value={detailUnit.lecturer}
                />
                <MiniInfo
                  icon={Building2}
                  label="Department"
                  value={detailUnit.department}
                />
                <MiniInfo
                  icon={Hash}
                  label="Code"
                  value={detailUnit.unitCode}
                />
                <MiniInfo
                  icon={Users}
                  label="Level"
                  value={detailUnit.level}
                />
              </div>
            </div>

            <div className="border-t border-gray-100 p-4 flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  toggleSelect(detailUnit);
                  setDetailUnit(null);
                }}
                disabled={isRegistered(detailUnit)}
                className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg transition-colors ${
                  isRegistered(detailUnit)
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : isSelected(detailUnit)
                    ? "bg-white text-red-600 border border-red-200 hover:bg-red-50"
                    : "bg-amber-900 text-white hover:bg-amber-800"
                }`}
              >
                {isRegistered(detailUnit) ? (
                  "Already registered"
                ) : isSelected(detailUnit) ? (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Remove
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Select Unit
                  </>
                )}
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* CONFIRMATION MODAL */}
      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => !submitting && setConfirmOpen(false)}
          />
          <div className="relative w-full max-w-md bg-white rounded-xl overflow-hidden">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6 text-amber-800" />
              </div>
              <h3 className="mt-4 text-base font-bold text-black text-center">
                Are you sure you want to register these units?
              </h3>
              <p className="mt-2 text-sm text-gray-600 text-center">
                You're about to register{" "}
                <strong className="text-black">{selected.length}</strong> unit
                {selected.length === 1 ? "" : "s"} totaling{" "}
                <strong className="text-black">{selectedCredits}</strong> credit
                hours.
              </p>

              <ul className="mt-4 max-h-40 overflow-y-auto space-y-1.5 bg-gray-50 border border-gray-100 rounded-lg p-3">
                {selected.map((u) => (
                  <li
                    key={u.id}
                    className="flex items-center justify-between gap-2 text-xs"
                  >
                    <span className="font-semibold text-black truncate">
                      {u.unitCode}
                    </span>
                    <span className="text-gray-500 truncate flex-1 ml-2">
                      {u.unitName}
                    </span>
                    <span className="text-amber-800 font-semibold shrink-0">
                      {u.creditHours} cr
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center gap-2 px-6 py-4 bg-gray-50 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                disabled={submitting}
                className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmRegister}
                disabled={submitting}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-amber-900 rounded-lg hover:bg-amber-800 transition-colors disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Registering...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Confirm
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

/* =============================================================
   SMALL SUBCOMPONENTS
   ============================================================= */
function SemesterItem({ icon: Icon, label, value, highlight }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-gray-500 font-semibold">
        <Icon className="w-3 h-3" />
        {label}
      </div>
      <p
        className={`mt-1 text-xs font-bold truncate ${
          highlight ? "text-amber-800" : "text-black"
        }`}
      >
        {value || "—"}
      </p>
    </div>
  );
}

function SummaryCard({ icon: Icon, label, value, tone = "gray" }) {
  const toneMap = {
    gray: "bg-gray-50 border-gray-200 text-gray-500",
    amber: "bg-amber-50 border-amber-200 text-amber-800",
    green: "bg-green-50 border-green-200 text-green-700",
    red: "bg-red-50 border-red-200 text-red-700",
  };
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <div
        className={`w-9 h-9 rounded-lg flex items-center justify-center border ${toneMap[tone]}`}
      >
        <Icon className="w-4 h-4" />
      </div>
      <p className="mt-3 text-xl font-bold text-black">{value}</p>
      <p className="text-[11px] text-gray-500 font-medium mt-0.5">{label}</p>
    </div>
  );
}

function FilterSelect({ label, value, onChange, options }) {
  return (
    <div>
      <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-lg focus:border-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-800/10 transition-all appearance-none pr-8"
        >
          <option value="">All</option>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
    </div>
  );
}

function DrawerBlock({ title, children }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2">
        {title}
      </p>
      {children}
    </div>
  );
}

function MiniInfo({ icon: Icon, label, value }) {
  return (
    <div className="p-3 bg-gray-50 border border-gray-100 rounded-lg">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-gray-500 font-semibold">
        <Icon className="w-3 h-3" />
        {label}
      </div>
      <p className="mt-1 text-xs font-semibold text-black truncate">
        {value || "—"}
      </p>
    </div>
  );
}

export default RegisterUnits;