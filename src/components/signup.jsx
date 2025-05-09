import React, { useRef, useState } from 'react';
import '../style/signUp.css';
import { doCreateUserWithEmailAndPassword, doSignInWithGoogle } from '../firebase/auth.js';
import { useAuth } from '../context/index';
import { FcGoogle } from 'react-icons/fc';
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff } from 'react-icons/fi';
import { Link } from 'react-router-dom';
function Signup() {
  const { userLoggedIn } = useAuth();
  const emailRef = useRef();
  const passwordRef = useRef();
  const nameRef = useRef();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Add this line
  const [error, setError] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await doCreateUserWithEmailAndPassword(
        emailRef.current.value,
        passwordRef.current.value
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    try {
      await doSignInWithGoogle();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
    <div className="signup-container">
    <div className="login-brand">
    <Link to="/" className="logo">
      <span className="logo-icon">🛍️</span>
      <span className="logo-text">Choose&Get</span>
    </Link>
  
  </div>
      <div className="signup-card">
        <h2>Create Account</h2>
        <p className="subtitle">Get started with your journey</p>
        
        {error && <div className="error-message">{error}</div>}

        <form className="signup-form" onSubmit={handleSignup}>
          <div className="input-group">
            <FiUser className="input-icon" />
            <input 
              type="text" 
              placeholder="Full Name" 
              ref={nameRef} 
              required 
            />
          </div>
          
          <div className="input-group">
            <FiMail className="input-icon" />
            <input 
              type="email" 
              placeholder="Email" 
              ref={emailRef} 
              required 
            />
          </div>
          
          <div className="input-group">
            <FiLock className="input-icon" />
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Password" 
              ref={passwordRef} 
              required 
              minLength="6"
            />
            <button 
              type="button" 
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
          
          <button type="submit" className="signup-btn" disabled={loading}>
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>
        
        <div className="divider">
          <span>OR</span>
        </div>
        
        <button 
          className="google-btn" 
          onClick={handleGoogleSignup}
          disabled={loading}
        >
          <FcGoogle className="google-icon" />
          Sign up with Google
        </button>
        
        <div className="footer-links">
          <span>Already have an account? <Link to="/login">Sign in</Link></span>
        </div>
      </div>
    </div>
    </div>
  );
}

export default Signup;