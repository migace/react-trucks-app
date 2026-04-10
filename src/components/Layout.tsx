import { Outlet, NavLink } from "react-router-dom";
import { useFleetStore } from "@/store/fleetStore";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
    isActive
      ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
  }`;

export const Layout = () => {
  const { darkMode, toggleDarkMode } = useFleetStore();

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

          <header className="flex items-center justify-between mb-10">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                Fleet Manager
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Manage your truck fleet
              </p>
            </div>

            <div className="flex items-center gap-3">
              <nav className="flex items-center gap-1">
                <NavLink to="/" end className={navLinkClass}>
                  Fleet
                </NavLink>
                <NavLink to="/trucks/new" className={navLinkClass}>
                  Add Truck
                </NavLink>
              </nav>

              <button
                onClick={toggleDarkMode}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shadow-sm"
              >
                {darkMode ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 7a5 5 0 100 10A5 5 0 0012 7z" />
                    </svg>
                    Light mode
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                    Dark mode
                  </>
                )}
              </button>
            </div>
          </header>

          <main>
            <Outlet />
          </main>

        </div>
      </div>
    </div>
  );
};
