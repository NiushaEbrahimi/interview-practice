import Background from '../../assets/Background.jpg';
import css from "../../assets/css/signup.module.css"
import { useState, type FormEventHandler } from 'react';
import { checkEmailAvailability } from '../../components/authentication/EmailInput';
import EmailInput from '../../components/authentication/EmailInput';
import PasswordsInput from '../../components/authentication/PasswordsInput';

export default function SignUp(){
    const [emailAvailable, setEmailAvailable] = useState(null);
    const [email, setEmail] = useState('');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [errorEmail, setErrorEmail] = useState<string>('');
    const [errorPassword, setErrorPassword] = useState<string>('');

    const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        
        const isAvailable = await checkEmailAvailability({email, setEmailAvailable});
        
        if (!isAvailable) {
            setErrorEmail('Please use a different email address');
            return;
        }

        if (password !== confirmPassword) {
            setErrorPassword('Passwords do not match');
            return;
        }

    };
    

    return(
        <div className={`min-h-screen ${css.signup} flex justify-center items-center relative`}>
            <img src={Background} alt="Background" className={`w-full h-full object-cover ${css.background}`} />
            <section className={`max-w-md w-full p-6 ${css.formContainer} rounded-lg shadow-lg`}>
                <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <EmailInput email={email} setEmail={setEmail} emailAvailable={emailAvailable} setEmailAvailable={setEmailAvailable} />
                    {errorEmail && <p className="text-red-500">{errorEmail}</p>}
                    <PasswordsInput password={password} setPassword={setPassword} confirmPassword={confirmPassword} setConfirmPassword={setConfirmPassword} />
                    {errorPassword && <p className="text-red-500">{errorPassword}</p>}
                    <button type="submit" className="  bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition duration-300 cursor-pointer">Create Account</button>
                </form>
            </section>
        </div>
    )
}