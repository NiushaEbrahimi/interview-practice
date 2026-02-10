import Background from '../../assets/Background.jpg';
import css from "../../assets/css/signup.module.css";
import { useState, type FormEventHandler } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
    const navigate = useNavigate();
    const [buttonContent, setButtonContent] = useState('Login');
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [error, setError] = useState<string>('');

    const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        setError('');
        setButtonContent('Loading...');

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/auth/login/', {
                email: email,
                password: password
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const { access, refresh } = response.data;
            localStorage.setItem('authTokens', JSON.stringify({
                access: access,
                refresh: refresh
            }));

            console.log('Login successful');
            
            navigate('/profile');
            
        } catch (error : any) {
            console.error('Login error:', error);
            
            if (error.response) {
                if (error.response.status === 401) {
                    setError('Invalid email or password');
                } else if (error.response.data?.email) {
                    setError(error.response.data.email[0] || 'Invalid email');
                } else if (error.response.data?.password) {
                    setError(error.response.data.password[0] || 'Invalid password');
                } else if (error.response.data?.detail) {
                    setError(error.response.data.detail);
                } else {
                    setError('Login failed. Please try again.');
                }
            } else if (error.request) {
                setError('No response from server. Please check your connection.');
            } else {
                setError('An error occurred. Please try again.');
            }
            
            setButtonContent('Login');
        }
    };

    return (
        <div className={`min-h-screen ${css.signup} flex justify-center items-center relative`}>
            <img src={Background} alt="Background" className={`w-full h-full object-cover ${css.background}`} />
            <section className={`max-w-md w-full p-6 ${css.formContainer} rounded-lg shadow-lg`}>
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <button 
                        type="submit" 
                        className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition duration-300 cursor-pointer w-full"
                        disabled={buttonContent === 'Loading...'}
                    >
                        {buttonContent}
                    </button>

                    <div className="text-center">
                        <Link to="/signup" className="text-blue-600 hover:text-blue-800 underline">
                            Don't have an account? Sign Up
                        </Link>
                    </div>
                </form>
            </section>
        </div>
    );
}