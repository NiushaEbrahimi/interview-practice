import Background from '../../assets/Background.jpg';
import css from '../../assets/css/signup.module.css';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [buttonContent, setButtonContent] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setButtonContent(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/auth/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Invalid credentials');
      }

      const data = await response.json();
      
      if (data.token && data.user) {
        console.log('Login successful:', data);
        
        login(data.token, data.user);
        
        navigate('/', { replace: true });
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setButtonContent(false);
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
                        disabled={buttonContent === true}
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