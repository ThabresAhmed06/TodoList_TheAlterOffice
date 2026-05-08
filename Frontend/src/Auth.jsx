import React, { useState } from 'react';

const Auth = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleAuth = (e) => {
    e.preventDefault();
    setErrorMessage(''); // Clear errors on new attempt

    const existingUsers = JSON.parse(localStorage.getItem('todo_users') || '[]');
    const cleanUsername = username.trim();

    if (isLogin) {
      // --- Login Flow ---
      const foundUser = existingUsers.find(
        u => u.username === cleanUsername && u.password === password
      );

      if (!foundUser) {
        return setErrorMessage('Wrong username or password. Try again!');
      }

      onLogin(foundUser.username);
    } else {
      // --- Signup Flow ---
      const userExists = existingUsers.some(u => u.username === cleanUsername);

      if (userExists) {
        return setErrorMessage('That username is already taken.');
      }

      const newUser = { username: cleanUsername, password };
      const updatedUsers = [...existingUsers, newUser];
      
      localStorage.setItem('todo_users', JSON.stringify(updatedUsers));
      onLogin(newUser.username);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setErrorMessage('');
    setUsername('');
    setPassword('');
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <header>
          <h2>{isLogin ? 'Welcome Back' : 'Get Started'}</h2>
          <p className="auth-subtitle">
            {isLogin ? "Good to see you again! Let's get to work." : "Organize your life in one place."}
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
              placeholder="Enter Your Username"
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
            <button className="auth-toggle-link" onClick={toggleMode}>
              {isLogin ? 'Create an account' : 'Sign in instead'}
            </button>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Auth;
