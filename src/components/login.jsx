import React, { useRef, useState } from 'react';
import '../style/login.css';
import { doSignInWithEmailAndPassword, doSignInWithGoogle } from '../firebase/auth.js';
import { useAuth } from '../context/index';
import { FcGoogle } from 'react-icons/fc';
import { FiMail, FiLock } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import {motion} from 'framer-motion';
function Login() {
  const { userLoggedIn } = useAuth();
  const emailRef = useRef();
  const passwordRef = useRef();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({ type: '', message: '' }); // Initialize as object
  const navigate = useNavigate();
  
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError({ type: '', message: '' }); // Reset error state

    try {
      const userCredential = await doSignInWithEmailAndPassword(
        emailRef.current.value,
        passwordRef.current.value
      );

      if (!userCredential.user.emailVerified) {
        await sendEmailVerification(userCredential.user);
        setError({
          type: 'verify',
          message: 'Please verify your email first. We sent a new verification email.'
        });
        return;
      }

      // Successful login
      navigate("/");

    } catch (error) {
      let errorMessage = '';
      let errorType = 'general';

      switch (error.code) {
        case 'auth/invalid-credential':
        case 'auth/wrong-password':
        case 'auth/user-not-found':
          errorType = 'credentials';
          errorMessage = 'Incorrect email or password';
          break;

        case 'auth/too-many-requests':
          errorMessage = 'Account temporarily locked. Try again later.';
          break;

        default:
          errorMessage = error.message || 'Login failed. Please try again.';
      }

      setError({
        type: errorType,
        message: errorMessage
      });

    } finally {
      setLoading(false);
    }
  };
  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await doSignInWithGoogle();
      // Successful login
      navigate("/");
    } catch (error) {
      console.error("Error logging in with Google:", error.message);
    } finally {
      setLoading(false);

    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <motion.div 
          className="login-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="auth-header">
            <Link to="/" className="logo">
              <span className="logo-icon">
                <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 16H28" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                  <path d="M4 8H28" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                  <path d="M4 24H28" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                </svg>
              </span>
              <span className="logo-text">Choose<span className="logo-highlight">&</span>Get</span>
            </Link>
            <h2>Welcome Back</h2>
            <p className="subtitle">Continue to your account</p>
          </div>

          {error.message && (
            <motion.div 
              className={`alert-message ${error.type}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              {error.type === 'verify' ? (
                <FiCheckCircle className="alert-icon" />
              ) : (
                <FiAlertTriangle className="alert-icon" />
              )}
              <div className="alert-content">
                <span>{error.message}</span>
                {error.type === 'verify' && (
                  <button
                    className="resend-link"
                    onClick={async () => {
                      try {
                        await sendEmailVerification(auth.currentUser);
                        setError({
                          type: 'verify',
                          message: 'Verification email resent! Check your inbox.'
                        });
                      } catch (err) {
                        setError({
                          type: 'general',
                          message: 'Failed to resend verification email'
                        });
                      }
                    }}
                  >
                    Resend Email
                  </button>
                )}
              </div>
            </motion.div>
          )}

          <form className="login-form" onSubmit={handleLogin}>
            <div className="input-group">
              <FiMail className="input-icon" />
              <input
                type="email"
                placeholder="Email"
                ref={emailRef}
                required
                className="auth-input"
              />
              <div className="input-border"></div>
            </div>

            <div className="input-group">
              <FiLock className="input-icon" />
              <input
                type="password"
                placeholder="Password"
                ref={passwordRef}
                required
                className="auth-input"
              />
              <div className="input-border"></div>
            </div>

            <motion.button 
              whileTap={{ scale: 0.98 }}
              type="submit" 
              className="auth-btn primary"
              disabled={loading}
            >
              {loading ? (
                <div className="spinner"></div>
              ) : 'Sign In'}
            </motion.button>
          </form>

          <div className="auth-divider">
            <span className="divider-line"></span>
            <span className="divider-text">OR</span>
            <span className="divider-line"></span>
          </div>

          <motion.button
            whileTap={{ scale: 0.98 }}
            className="auth-btn google"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            <FcGoogle className="auth-btn-icon" />
            Continue with Google
          </motion.button>

          <div className="auth-footer">
            <Link to="/forgot-password" className="auth-link">
              Forgot password?
            </Link>
            <span className="auth-footer-text">
              Don't have an account?{' '}
              <Link to="/signup" className="auth-link accent">
                Create account
              </Link>
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Login;