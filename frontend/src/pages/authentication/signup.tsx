import Background from '../../assets/Background.jpg';
import css from "../../assets/css/signup.module.css"
import { useState } from 'react';
import { checkEmailAvailability } from '../../components/authentication/EmailInput';
import EmailInput from '../../components/authentication/EmailInput';

export default function SignUp(){
    const [email, setEmail] = useState('');
    
    const handleSubmit = async (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        
        const isAvailable = await checkEmailAvailability(email);
        
        if (!isAvailable) {
            alert('Please use a different email address');
            return;
        }
        
    };

    return(
        <div className={`min-h-screen ${css.signup} flex justify-center items-center relative`}>
            <img src={Background} alt="Background" className={`w-full h-full object-cover ${css.background}`} />
            <section className={`max-w-md w-full p-6 ${css.formContainer} rounded-lg shadow-lg`}>
                <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <EmailInput email={email} setEmail={setEmail}/>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
                        <input type="password" id="password" name="password" className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                        <label htmlFor="password2" className="block text-sm font-medium mb-1">Confirm Password</label>
                        <input type="password" id="password2" name="password2" className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <button type="submit" className="  bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition duration-300 cursor-pointer">Create Account</button>
                </form>
            </section>
        </div>
    )
}