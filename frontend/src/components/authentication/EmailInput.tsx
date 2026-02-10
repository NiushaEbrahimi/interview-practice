import axios from 'axios';
import React, { useState } from 'react';

export async function checkEmailAvailability({emailValue, setEmailAvailable, setEmailError}
     : {emailValue:string,
        setEmailAvailable: React.Dispatch<React.SetStateAction<boolean>>,
        setEmailError: React.Dispatch<React.SetStateAction<string>>}) {
    try {
        const response = await axios.post(
            'http://127.0.0.1:8000/api/auth/check-email/',
            { email: emailValue }
        );
        setEmailAvailable(response.data.available);
        setEmailError(response.data.exists ? 'Email is already registered' : '');
        
        return response.data.available;
    } catch (error) {
        console.error('Error checking email:', error);
        setEmailError('Error checking email availability');
        return false;
    }
};
    
export default function EmailInput({email, setEmail}:{email : string, setEmail : (email : string) => void}){
    const [emailError, setEmailError] = useState('');
    const [emailAvailable, setEmailAvailable] = useState(null);
    const handleEmailChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEmail(value);
        
        if (value && value.includes('@gmail.com')) {
            setTimeout(() => checkEmailAvailability({
                emailValue: value,
                setEmailAvailable,
                setEmailError
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
                <span style={{ color: 'red' }}>{emailError}</span>
            )}
            {emailAvailable === true && (
                <span style={{ color: 'green' }}>✓ Email is available</span>
            )}
        </div>
    )
}