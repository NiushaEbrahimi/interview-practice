import axios from 'axios';
import React from 'react';

// eslint-disable-next-line react-refresh/only-export-components
export async function checkEmailAvailability(
    {email,
    setEmailAvailable
    }
    :{email: string,
    setEmailAvailable: React.Dispatch<React.SetStateAction<boolean | null>>
}) {
    try {
        const response = await axios.post(
            'http://127.0.0.1:8000/api/auth/check-email/',
            { email: email }
        );
        console.log(response.data)
        setEmailAvailable(response.data.available);
        return response.data.available;
    } catch (error) {
        console.error('Error checking email:', error);
        return false;
    }
};
    
export default function EmailInput(
    {email, setEmail, emailAvailable, setEmailAvailable}
    :
    {email : string, 
    setEmail : (email : string) => void,
    emailAvailable: boolean | null,
    setEmailAvailable: React.Dispatch<React.SetStateAction<boolean | null>>
}){

    const handleEmailChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEmail(value);
        
        if (value && value.includes('@gmail.com')) {
            console.log(emailAvailable)
            setTimeout(() => checkEmailAvailability({
                email,
                setEmailAvailable
        }), 500);
        }
    };

    return(
        <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
            <input 
                type="email" 
                id="email" 
                name="email" 
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                value={email}
                onChange={handleEmailChange}
                required
            />
            {emailAvailable === false && (
                <span style={{ color: 'red' }}>Invalid Email</span>
            )}
            {emailAvailable === true && (
                <span style={{ color: 'green' }}>✓ Email is available</span>
            )}
        </div>
    )
}