import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

type paramsURLType = {
    label : string,
    level? : string
}

export default function Dropdown({label} : {label: string}) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedLevel, setSelectedLevel] = useState("Choose Level");

    const levels = ["Easy", "Medium", "Hard"];

    const params = useParams<paramsURLType>();
    useEffect(() => {
        if(params.level){
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setSelectedLevel(params.level);
        }
    }, [params.level]);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const navigate = useNavigate();

    const handleSelect = (level: string) => {
        setSelectedLevel(level);
        navigate(`/courses/${label}/${level}`);
        setIsOpen(false);
    };

    return (
        <div className="relative inline-block text-left">
        <button
            onClick={toggleDropdown}
            className="cursor-pointer inline-flex justify-between items-center ms-8 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
        >
            {selectedLevel}
            <svg
            className="ml-2 w-4 h-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
        </button>

        {isOpen && (
            <div className="absolute mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
            {levels.map((level) => (
                <button
                key={level}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                onClick={() => handleSelect(level)}
                >
                {level}
                </button>
            ))}
            </div>
        )}
        </div>
    );
}
