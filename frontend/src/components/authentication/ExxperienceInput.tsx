import React from "react"
export default function Experience({experienceLevel, setExperienceLevel}:{
    experienceLevel: string,
    setExperienceLevel: React.Dispatch<React.SetStateAction<string>>
}){

    return(
        <div>
            <label className="block text-sm font-medium mb-2">Experience Level</label>
            <div className="flex flex-wrap gap-2">
                {['beginner', 'junior', 'mid-level', 'senior'].map((level) => (
                    <label 
                        key={level}
                        className={`flex-1 min-w-30 cursor-pointer ${
                            experienceLevel === level 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-gray-100 text-gray-700'
                        } px-4 py-2 rounded-md border transition-all hover:bg-blue-500 hover:text-white`}
                    >
                        <input
                            type="radio"
                            name="experience-level"
                            value={level}
                            checked={experienceLevel === level}
                            onChange={(e) => {
                                setExperienceLevel(e.target.value)
                            }}
                            className="hidden"
                        />
                        <span className="capitalize">
                            {level.replace('-', ' ')}
                        </span>
                    </label>
                ))}
            </div>
        </div>
    )
}