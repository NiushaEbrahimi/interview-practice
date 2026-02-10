import Background from '../../assets/Background.jpg';
import css from "../../assets/css/signup.module.css"
import { useState, type FormEventHandler } from 'react';
import { checkEmailAvailability } from '../../components/authentication/EmailInput';
import { useNavigate, Link } from 'react-router-dom';

import EmailInput from '../../components/authentication/EmailInput';
import PasswordsInput from '../../components/authentication/PasswordsInput';
import FullName from '../../components/authentication/FullName';
import Experience from '../../components/authentication/ExxperienceInput';

import axios from 'axios';

export default function SignUp(){
    const navigate = useNavigate();
    const [buttonContent, setButtonContent] = useState('Create Account');
    
    const [emailAvailable, setEmailAvailable] = useState(null);
    const [email, setEmail] = useState('');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [fullName, setFullName] = useState('');
    const [experienceLevel, setExperienceLevel] = useState('');

    const [errorEmail, setErrorEmail] = useState<string>('');
    const [errorPassword, setErrorPassword] = useState<string>('');

    const [continueInfo,setContinueInfo] = useState(false);

    const handleSubmitForm1: FormEventHandler<HTMLFormElement> = async (e) => {
        setErrorEmail('');
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

        if( isAvailable && password === confirmPassword){
            setContinueInfo(true);
        }

    };

    const handleSubmitForm2: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        if(experienceLevel && fullName){
            try{
                await axios.post('http://127.0.0.1:8000/api/auth/register/', {
                email: email,
                password: password,
                password2: confirmPassword,
                full_name: fullName,
                experience_level: experienceLevel,
                known_technologies: [],
                learning_technologies: [] 
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        // console.log('Registration successful:', response.data);
        setButtonContent('loading')
        navigate('/login');
            }catch(error){
                console.log(error)
            }
        }
    }
    

    return(
        <div className={`min-h-screen ${css.signup} flex justify-center items-center relative`}>
            <img src={Background} alt="Background" className={`w-full h-full object-cover ${css.background}`} />
            <section className={`max-w-md w-full p-6 ${css.formContainer} rounded-lg shadow-lg`}>
                <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
                {!continueInfo &&
                    <form className="space-y-4" onSubmit={handleSubmitForm1}>
                        <EmailInput email={email} setEmail={setEmail} emailAvailable={emailAvailable} setEmailAvailable={setEmailAvailable} />
                        {errorEmail && <p className="text-red-500">{errorEmail}</p>}
                        <PasswordsInput password={password} setPassword={setPassword} confirmPassword={confirmPassword} setConfirmPassword={setConfirmPassword} />
                        {errorPassword && <p className="text-red-500">{errorPassword}</p>}
                        <button type="submit" className="  bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition duration-300 cursor-pointer">Create Account</button>
                        <Link to="/login"><p className='underline-offset-1 underline'>already have an account? </p></Link>
                    </form>}

                {continueInfo && 
                    <form className="space-y-4" onSubmit={handleSubmitForm2}>
                        <FullName fullName={fullName} setFullName={setFullName}/>
                        <Experience experienceLevel={experienceLevel} setExperienceLevel={setExperienceLevel} />
                        {/* TODO: */}
                        {/* <KnownTechs/> */}
                        <button type="submit" className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition duration-300 cursor-pointer">
                            {buttonContent === 'Create Account' ? 'Create Account' : 'Loading...'}
                        </button>
                    </form>
                }
            </section>
        </div>
    )
}