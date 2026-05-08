import React, { useState } from 'react';

const Auth = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const handleAuth = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    const cleanUsername=username.trim();
    const endpoint = isLogin?'/api/login':'/api/register';
    try {
      const response=await fetch(`http://localhost:5000${endpoint}`, {
        method:'POST',
        headers:{ 'Content-Type':'application/json' },
        body:JSON.stringify({ username: cleanUsername, password })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }
      onLogin(cleanUsername);
      localStorage.setItem('current_user', cleanUsername);
      
    } catch(err) {
      setErrorMessage(err.message);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <header>
          <h2>{isLogin ? 'Welcome Back' : 'Get Started'}</h2>
          <p className="auth-subtitle">
            {isLogin ? "Good to see you again!" : "Organize your life in one place."}
          </p>
        </header>

        {errorMessage && <div className="auth-error">{errorMessage}</div>}

        <form className="auth-form" onSubmit={handleAuth}>
          <div className="auth-group">
            <label htmlFor="username">Username</label>
            <input 
              id="username"
              className="auth-input"
              type="text" 
              placeholder="Enter your username"
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
            />
          </div>
          
          <div className="auth-group">
            <label htmlFor="password">Password</label>
            <input 
              id="password"
              className="auth-input"
              type="password" 
              placeholder="Enter Your Password"
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>

          <button type="submit" className="auth-submit-btn">
            {isLogin ? 'Login' : 'Create Account'}
          </button>
        </form>

        <footer className="auth-footer">
          <p>
            {isLogin ? "New here?" : "Already joined?"}{' '}
            <button 
              className="auth-toggle-link" 
              onClick={() => { setIsLogin(!isLogin); setErrorMessage(''); }}
              type="button"
            >
              {isLogin ? 'Create an account' : 'Sign in instead'}
            </button>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Auth;
