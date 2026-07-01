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
    <div className="fixed top-5 left-5 text-center py-2 px-4 text-sm font-medium flex">
      <button className={`px-4 py-3 rounded-2xl cursor-pointer shadow bg-black hover:bg-gray-800 ${style.demoBadge}`} onClick={() => toggle()}>
        Demo
      </button>
      <div className={`rounded-2xl px-4 py-3 bg-black text-white ${style.demoBadgeTooltip} ${styleDemo}`} >
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
