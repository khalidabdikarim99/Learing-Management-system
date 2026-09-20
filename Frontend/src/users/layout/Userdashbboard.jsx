import { NavLink, Outlet, useLocation, Link } from "react-router-dom";
import { useState } from "react";
import {
  LayoutDashboard,
  FileText,
  ClipboardList,
  BookOpen,
  Library,
  BarChart3,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
} from "lucide-react";

function UserDashboard() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/user/dashboard", icon: LayoutDashboard },
    { name: "Application Form", path: "/user/application-form", icon: FileText },
    { name: "Application", path: "/user/application", icon: ClipboardList },
    { name: "Register Units", path: "/user/register-units", icon: BookOpen },
    { name: "My Registered Units", path: "/user/my-registered-units", icon: Library },
    { name: "View Marks", path: "/user/view-marks", icon: BarChart3 },
    { name: "Profile", path: "/user/profile", icon: User },
    { name: "Settings", path: "/user/settings", icon: Settings },
  ];

  const currentItem = menuItems.find((item) =>
    location.pathname.startsWith(item.path)
  );
  const pageTitle = currentItem?.name || "Dashboard";

  const sidebarWidth = collapsed ? "lg:w-20" : "lg:w-64";

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* ===================== MOBILE OVERLAY ===================== */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ===================== SIDEBAR ===================== */}
      <aside
        className={`fixed left-0 top-0 z-50 h-screen w-64 ${sidebarWidth} flex flex-col transition-all duration-300 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          background:
            "linear-gradient(180deg, #451a03 0%, #78350f 50%, #451a03 100%)",
        }}
      >

        {/* ---------- Logo + Collapse / Close ---------- */}
        <div
          className={`h-16 flex items-center border-b border-amber-50/10 ${
            collapsed ? "lg:justify-center lg:px-2" : "justify-between px-4"
          }`}
        >
          <Link to="/user/dashboard" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-amber-500 flex items-center justify-center shrink-0 shadow-sm">
              <GraduationCap className="w-5 h-5 text-amber-950" />
            </div>
            <span
              className={`text-lg font-bold text-white whitespace-nowrap transition-all duration-200 ${
                collapsed ? "lg:hidden" : ""
              }`}
            >
              Skill<span className="text-amber-400">Nest</span>
            </span>
          </Link>

          <button
            onClick={() => setCollapsed((v) => !v)}
            className={`hidden lg:inline-flex items-center justify-center w-8 h-8 rounded-md text-amber-100/80 hover:bg-black hover:text-white transition-colors ${
              collapsed ? "lg:absolute lg:top-4 lg:right-2" : ""
            }`}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={collapsed ? "Expand" : "Collapse"}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>

          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-md hover:bg-black text-amber-100 transition-colors"
            aria-label="Close sidebar"
          >
            <X size={16} />
          </button>
        </div>

        {/* ---------- Profile Card ---------- */}
        <div
          className={`border-b border-amber-50/10 ${
            collapsed ? "lg:px-2 lg:py-4 px-4 py-4" : "px-4 py-4"
          }`}
        >
          <div
            className={`flex items-center gap-3 ${
              collapsed ? "lg:justify-center" : ""
            }`}
          >
            <div className="relative shrink-0">
              <img
                src="https://randomuser.me/api/portraits/men/75.jpg"
                alt="Khalid Abdikarim"
                className="w-10 h-10 rounded-full object-cover ring-2 ring-amber-400/50"
                loading="lazy"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full ring-2 ring-amber-900" />
            </div>

            <div
              className={`min-w-0 flex-1 transition-all duration-200 ${
                collapsed ? "lg:hidden" : ""
              }`}
            >
              <p className="text-sm font-semibold text-white truncate">
                Khalid Abdikarim
              </p>
              <p className="text-[11px] text-amber-200/80 truncate">
                ID · 2024-0521
              </p>
            </div>
          </div>
        </div>

        {/* ---------- Navigation ---------- */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <p
            className={`text-[10px] uppercase tracking-widest text-amber-200/50 font-semibold mb-3 ${
              collapsed ? "lg:text-center lg:px-0 px-3" : "px-3"
            }`}
          >
            {collapsed ? "•••" : "Menu"}
          </p>

          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  title={collapsed ? item.name : undefined}
                  className={({ isActive }) =>
                    `group relative flex items-center gap-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                      collapsed ? "lg:justify-center lg:px-2 py-2.5 px-3" : "px-3 py-2.5"
                    } ${
                      isActive
                        ? "bg-black text-white shadow-lg shadow-black/40"
                        : "text-amber-100/80 hover:bg-black hover:text-white"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-amber-500 rounded-r-full" />
                      )}

                      <Icon
                        size={18}
                        className={`shrink-0 ${
                          isActive
                            ? "text-amber-500"
                            : "text-amber-100/80 group-hover:text-white"
                        }`}
                      />

                      <span
                        className={`flex-1 truncate transition-all duration-200 ${
                          collapsed ? "lg:hidden" : ""
                        }`}
                      >
                        {item.name}
                      </span>

                      {isActive && !collapsed && (
                        <ChevronRight
                          size={14}
                          className="text-amber-500 shrink-0"
                        />
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* ---------- Logout ---------- */}
        <div className="border-t border-amber-50/10 p-3">
          <button
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-amber-100/80 hover:bg-black hover:text-white transition-colors duration-200 ${
              collapsed ? "lg:justify-center" : ""
            }`}
            title={collapsed ? "Logout" : undefined}
          >
            <LogOut size={18} className="shrink-0" />
            <span className={collapsed ? "lg:hidden" : ""}>Logout</span>
          </button>
        </div>
      </aside>

      {/* ===================== MAIN AREA ===================== */}
      <div
        className={`flex-1 min-h-screen flex flex-col transition-all duration-300 ${
          collapsed ? "lg:ml-20" : "lg:ml-64"
        }`}
      >

        {/* ------------------- TOPBAR ------------------- */}
        <header className="h-16 bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="h-full px-4 sm:px-6 flex items-center justify-between gap-4">

            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden p-2 -ml-1 rounded-lg hover:bg-gray-100 text-gray-700 transition-colors"
                aria-label="Open sidebar"
              >
                <Menu size={20} />
              </button>

              <div className="min-w-0">
                <h1 className="text-base sm:text-lg font-bold text-black truncate">
                  {pageTitle}
                </h1>
                <p className="hidden sm:block text-xs text-gray-500 truncate">
                  Manage your academic activities
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 sm:gap-2">
              <button
                className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-amber-800 transition-colors"
                aria-label="Search"
              >
                <Search size={19} />
              </button>

              <button
                className="relative p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-amber-800 transition-colors"
                aria-label="Notifications"
              >
                <Bell size={19} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-700 rounded-full ring-2 ring-white" />
              </button>

              <span className="hidden sm:block w-px h-6 bg-gray-200 mx-1" />

              <Link
                to="/user/profile"
                className="flex items-center gap-2.5 pl-1 sm:pl-2 rounded-lg hover:bg-gray-50 py-1 pr-1 sm:pr-2 transition-colors"
              >
                <img
                  src="https://randomuser.me/api/portraits/men/75.jpg"
                  alt="Khalid Abdikarim"
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-amber-100"
                  loading="lazy"
                />
                <div className="hidden md:block leading-tight">
                  <p className="text-sm font-semibold text-black">
                    Khalid Abdikarim
                  </p>
                  <p className="text-[11px] text-gray-500">
                    Student
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </header>

        {/* ------------------- PAGE CONTENT ------------------- */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>

        {/* ------------------- FOOTER ------------------- */}
        <footer className="bg-white border-t border-gray-200 px-6 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-xs text-gray-500">
              © 2026{" "}
              <span className="font-semibold text-black">SkillNest</span>. All
              rights reserved.
            </p>
            <div className="flex items-center gap-4 text-xs">
              <a href="#" className="text-gray-500 hover:text-amber-800 transition-colors">
                Help
              </a>
              <a href="#" className="text-gray-500 hover:text-amber-800 transition-colors">
                Privacy
              </a>
              <a href="#" className="text-gray-500 hover:text-amber-800 transition-colors">
                Terms
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default UserDashboard;