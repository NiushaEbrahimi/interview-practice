import { isDemo } from "../mock/mockApi";
import style from "../assets/css/demoBadge.module.css";
import { useState, useEffect } from "react";

export default function DemoBanner() {
  const [styleDemo,setStyleDemo] = useState(style.demoBadgeTooltipOff);
  const isDemoMode = isDemo();

  useEffect(() => {
    if (!isDemoMode) return;

    const handleBodyClick = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest(`.${style.demoBadge}`)) {
        setStyleDemo(style.demoBadgeTooltipOff);
      }
    };

    document.querySelector("body")?.addEventListener("click", handleBodyClick);
    return () => {
      document.querySelector("body")?.removeEventListener("click", handleBodyClick);
    };
  }, [isDemoMode]);
  
  if (!isDemoMode) return null;

  const toggle = () => {
    if(styleDemo===style.demoBadgeTooltipOff){
      setStyleDemo(style.demoBadgeTooltipOn);
    }else{
      setStyleDemo(style.demoBadgeTooltipOff);
    }
  }
  
  return (
    <div className="fixed top-13 sm:top-1 left-1 text-center p-0 text-xs font-light flex">
      <button className={`px-2 py-1 sm:px-4 sm:py-3 rounded-2xl cursor-pointer shadow bg-black dark:bg-white dark:text-black hover:dark:bg-gray-400 hover:bg-gray-800 ${style.demoBadge}`} onClick={() => toggle()}>
        Demo
      </button>
      <div className={`rounded-2xl px-1 py-1 sm:px-4 sm:py-3 dark:bg-white dark:text-black bg-black text-white ${style.demoBadgeTooltip} ${styleDemo}`}>
        Demo Mode — Data is simulated.{" "}
        <a
          href="https://github.com/NiushaEbrahimi/interview-practice"
          className="underline "
          target="_blank"
          rel="noopener noreferrer"
        >
          Run the backend
        </a>{" "}
        for full functionality.
      </div>
    </div>
  );
}
