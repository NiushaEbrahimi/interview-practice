import { useState } from "react";

export default function PasswordsInput(
    {password, setPassword, confirmPassword, setConfirmPassword}
    : 
    {
        password: string,
        setPassword: (password: string) => void,
        confirmPassword: string,
        setConfirmPassword: (confirmPassword: string) => void
    }
) {
    const [errorPassword,setErrorPassword] = useState<string>('');
    const rejex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[A-Za-z\d@$!%*?&]{8,}$/;
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        console.log(rejex.test(value));
        if(rejex.test(value)){
            setErrorPassword('');
        } else {
            setErrorPassword('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.');
        }
        setPassword(value);
    };
    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        console.log(value);
        setConfirmPassword(value);
    };
    return(
        <>
            <div>
                <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
                <input 
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={handlePasswordChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
                {password && errorPassword && <span style={{ color: 'red' }}>{errorPassword}</span>}
            </div>
            <div>
                <label htmlFor="password2" className="block text-sm font-medium mb-1">Confirm Password</label>
                <input
                    type="password"
                    id="password2"
                    name="password2"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange} 
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
        </>
    )
}