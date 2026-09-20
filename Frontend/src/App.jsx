import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// ================= PUBLIC COMPONENTS =================
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// ================= PUBLIC PAGES =================
import Home from "./components/Home";
import Courses from "./components/Courses";
import About from "./components/About";
import Instructors from "./components/Instructors";
import Pricing from "./components/Pricing";
import Contact from "./components/Contact";
import StudentPortal from "./components/StudentPortal";

// ================= USER DASHBOARD =================
import Userdashbboard from "./users/layout/Userdashbboard";

// User Pages
import Dashboard from "./users/pages/Dashboard";
import ApplicationForm from "./users/pages/ApplicationForm";
import Application from "./users/pages/Application";
import RegisterUnits from "./users/pages/RegisterUnits";
import MyRegisteredUnits from "./users/pages/MyRegisteredUnits";
import ViewMarks from "./users/pages/ViewMarks";
import Profile from "./users/pages/Profile";
import Settings from "./users/pages/Settings";

// ================= ADMIN DASHBOARD =================
import Admindashboard from "./Admin/layout/Admindashboard";

// Admin Pages
import AdminDashboard from "./Admin/pages/Dashboard";
import Applications from "./Admin/pages/Applications";
import Students from "./Admin/pages/Students";
import Units from "./Admin/pages/Units";
import UnitRegistration from "./Admin/pages/UnitRegistration";
import MarksResults from "./Admin/pages/MarksResults";
import UsersStaff from "./Admin/pages/UsersStaff";
import AdminSettings from "./Admin/pages/Settings";


function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* ================================================== */}
        {/*                    PUBLIC WEBSITE                  */}
        {/* ================================================== */}

        {/* Home */}
        <Route
          path="/"
          element={
            <div className="min-h-screen flex flex-col">
              <Navbar />

              <main className="flex-1">
                <Home />
              </main>

              <Footer />
            </div>
          }
        />

        {/* Courses */}
        <Route
          path="/courses"
          element={
            <div className="min-h-screen flex flex-col">
              <Navbar />

              <main className="flex-1">
                <Courses />
              </main>

              <Footer />
            </div>
          }
        />

        {/* About */}
        <Route
          path="/about"
          element={
            <div className="min-h-screen flex flex-col">
              <Navbar />

              <main className="flex-1">
                <About />
              </main>

              <Footer />
            </div>
          }
        />

        {/* Instructors */}
        <Route
          path="/instructors"
          element={
            <div className="min-h-screen flex flex-col">
              <Navbar />

              <main className="flex-1">
                <Instructors />
              </main>

              <Footer />
            </div>
          }
        />

        {/* Pricing */}
        <Route
          path="/pricing"
          element={
            <div className="min-h-screen flex flex-col">
              <Navbar />

              <main className="flex-1">
                <Pricing />
              </main>

              <Footer />
            </div>
          }
        />

        {/* Contact */}
        <Route
          path="/contact"
          element={
            <div className="min-h-screen flex flex-col">
              <Navbar />

              <main className="flex-1">
                <Contact />
              </main>

              <Footer />
            </div>
          }
        />

        {/* Student Portal */}
        <Route
          path="/student-portal"
          element={
            <div className="min-h-screen flex flex-col">
              <Navbar />

              <main className="flex-1">
                <StudentPortal />
              </main>

              <Footer />
            </div>
          }
        />


        {/* ================================================== */}
        {/*                    STUDENT DASHBOARD                */}
        {/* ================================================== */}

        <Route
          path="/user"
          element={<Userdashbboard />}
        >

          {/* /user → /user/dashboard */}
          <Route
            index
            element={
              <Navigate
                to="/user/dashboard"
                replace
              />
            }
          />

          {/* Dashboard */}
          <Route
            path="dashboard"
            element={<Dashboard />}
          />

          {/* Application Form */}
          <Route
            path="application-form"
            element={<ApplicationForm />}
          />

          {/* Application */}
          <Route
            path="application"
            element={<Application />}
          />

          {/* Register Units */}
          <Route
            path="register-units"
            element={<RegisterUnits />}
          />

          {/* My Registered Units */}
          <Route
            path="my-registered-units"
            element={<MyRegisteredUnits />}
          />

          {/* View Marks */}
          <Route
            path="view-marks"
            element={<ViewMarks />}
          />

          {/* Profile */}
          <Route
            path="profile"
            element={<Profile />}
          />

          {/* Settings */}
          <Route
            path="settings"
            element={<Settings />}
          />

        </Route>


        {/* ================================================== */}
        {/*                     ADMIN DASHBOARD                 */}
        {/* ================================================== */}

        <Route
          path="/admin"
          element={<Admindashboard />}
        >

          {/* /admin → /admin/dashboard */}
          <Route
            index
            element={
              <Navigate
                to="/admin/dashboard"
                replace
              />
            }
          />

          {/* Admin Dashboard */}
          <Route
            path="dashboard"
            element={<AdminDashboard />}
          />

          {/* Applications */}
          <Route
            path="applications"
            element={<Applications />}
          />

          {/* Students */}
          <Route
            path="students"
            element={<Students />}
          />

          {/* Units */}
          <Route
            path="units"
            element={<Units />}
          />

          {/* Unit Registration */}
          <Route
            path="unit-registration"
            element={<UnitRegistration />}
          />

          {/* Marks & Results */}
          <Route
            path="marks"
            element={<MarksResults />}
          />

          {/* Users & Staff */}
          <Route
            path="users"
            element={<UsersStaff />}
          />

          {/* Settings */}
          <Route
            path="settings"
            element={<AdminSettings />}
          />

        </Route>

      </Routes>

    </BrowserRouter>
  );
}

export default App;