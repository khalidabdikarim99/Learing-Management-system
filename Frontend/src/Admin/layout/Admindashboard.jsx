import { NavLink, Outlet, useLocation, Link } from "react-router-dom";
import { useState } from "react";
import {
  LayoutDashboard,
  FileText,
  GraduationCap,
  BookOpen,
  ClipboardList,
  BarChart3,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

function AdminDashboard() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Applications", path: "/admin/applications", icon: FileText },
    { name: "Students", path: "/admin/students", icon: GraduationCap },
    { name: "Units", path: "/admin/units", icon: BookOpen },
    { name: "Unit Registration", path: "/admin/unit-registration", icon: ClipboardList },
    { name: "Marks & Results", path: "/admin/marks", icon: BarChart3 },
    { name: "Users & Staff", path: "/admin/users", icon: Users },
    { name: "Settings", path: "/admin/settings", icon: Settings },
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
          <Link to="/admin/dashboard" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-amber-500 flex items-center justify-center shrink-0 shadow-sm">
              <ShieldCheck className="w-5 h-5 text-amber-950" />
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

        {/* ---------- Navigation ---------- */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <p
            className={`text-[10px] uppercase tracking-widest text-amber-200/50 font-semibold mb-3 ${
              collapsed ? "lg:text-center lg:px-0 px-3" : "px-3"
            }`}
          >
            {collapsed ? "•••" : "Administration"}
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
                  Manage SkillNest LMS
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

              {/* Admin (letter avatar) */}
              <Link
                to="/admin/settings"
                className="flex items-center gap-2.5 pl-1 sm:pl-2 rounded-lg hover:bg-gray-50 py-1 pr-1 sm:pr-2 transition-colors"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-amber-950 font-bold text-sm ring-2 ring-amber-100">
                  A
                </div>
                <div className="hidden md:block leading-tight">
                  <p className="text-sm font-semibold text-black">
                    Admin
                  </p>
                  <p className="text-[11px] text-gray-500">
                    Administrator
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

export default AdminDashboard;