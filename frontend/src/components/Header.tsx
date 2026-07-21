import { NavLink, Link } from "react-router-dom"
import userProfileImg from "../assets/user-profile.png"
import { useState } from "react"

export default function Header({username} : {username : string}){
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinkClass = ({ isActive } : {isActive : boolean}) =>
  isActive
    ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 font-semibold"
    : "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400";
  return(
      <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 sm:px-6">
        <div className="hidden sm:flex flex-1 justify-center items-center gap-4">
          <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            <NavLink to={'/'} end className={navLinkClass}>Dashboard</NavLink>
          </h1>
          <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            <NavLink to={'/courses'} className={navLinkClass}>Courses</NavLink>
          </h1>
          <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            <NavLink to={'/progress'} className={navLinkClass}>Progress</NavLink>
          </h1>
        </div>

        {/* Mobile hamburger */}
        <button
          className="sm:hidden flex flex-col gap-1 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`block w-5 h-0.5 bg-gray-700 dark:bg-gray-300 transition-transform ${menuOpen ? "rotate-45 translate-y-1.5" : ""}`}/>
          <span className={`block w-5 h-0.5 bg-gray-700 dark:bg-gray-300 transition-opacity ${menuOpen ? "opacity-0" : ""}`}/>
          <span className={`block w-5 h-0.5 bg-gray-700 dark:bg-gray-300 transition-transform ${menuOpen ? "-rotate-45 -translate-y-1.5" : ""}`}/>
        </button>

        <div className="flex items-center gap-4">
          <Link to={'/profile'} className="flex flex-row gap-2 items-center">
            <span className="text-sm text-gray-600 dark:text-gray-300 hidden md:inline">{username}</span>
            <div className="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-600">
              <img src={userProfileImg} className="rounded-2xl"/>
            </div>
          </Link>
        </div>

        {/* Mobile menu dropdown */}
        {menuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-lg sm:hidden z-50">
            <nav className="flex flex-col p-4 gap-3">
              <NavLink to={'/'} end className={navLinkClass} onClick={() => setMenuOpen(false)}>Dashboard</NavLink>
              <NavLink to={'/courses'} className={navLinkClass} onClick={() => setMenuOpen(false)}>Courses</NavLink>
              <NavLink to={'/progress'} className={navLinkClass} onClick={() => setMenuOpen(false)}>Progress</NavLink>
            </nav>
          </div>
        )}
      </header>
  )
}