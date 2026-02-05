import { NavLink, Link } from "react-router-dom"
import userProfileImg from "../assets/user-profile.png"
export default function Header({username} : {username : string}){
  const navLinkClass = ({ isActive } : {isActive : boolean}) =>
  isActive
    ? "text-blue-600 border-b-2 border-blue-600 font-semibold"
    : "text-gray-600 hover:text-blue-600";
  return(
      <header className="h-16 bg-white border-b flex items-center justify-between px-6">
        <div className="flex-1 flex justify-center items-center gap-4">
          <h1 className="text-lg font-semibold text-gray-800">
            <NavLink to={'/'} end className={navLinkClass}>Dashboard</NavLink>
          </h1>
          <h1 className="text-lg font-semibold text-gray-800">
            <NavLink to={'/courses'} className={navLinkClass}>Courses</NavLink>
          </h1>
          <h1 className="text-lg font-semibold text-gray-800">
            <NavLink to={'/progress'} className={navLinkClass}>Progress</NavLink>
          </h1>
        </div>

        <div className="flex-10px flex items-center gap-4">
          <Link to={'/profile'} className="flex flex-row gap-2 items-center">
            <span className="text-sm text-gray-600">{username}</span>
            <div className="h-8 w-8 rounded-full bg-gray-300">
              <img src={userProfileImg} className="rounded-2xl"/>
            </div>
          </Link>
        </div>
      </header>
  )
}