import React from "react"
export default function FullName({fullName, setFullName}:{
    fullName: string,
    setFullName: React.Dispatch<React.SetStateAction<string>>
}){
    return(
        <div>
            <label htmlFor="full-name" className="block text-sm font-medium mb-1">Full Name</label>
            <input 
                id="full-name" 
                name="full-name" 
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                value={fullName}
                onChange={(e)=>{
                    setFullName(e.target.value)
                }}
                required
            />
        </div>
    )
}