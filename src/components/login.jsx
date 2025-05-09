import React, { useRef, useState } from 'react';
import '../style/login.css';
import { doSignInWithEmailAndPassword, doSignInWithGoogle } from '../firebase/auth.js';
import { useAuth } from '../context/index';
import { FcGoogle } from 'react-icons/fc';
import { FiMail, FiLock } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
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
    } catch (error) {
      console.error("Error logging in with Google:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="login-page">
        <div className="login-container">
          <div className="login-brand">
            <Link to="/" className="logo">
              <span className="logo-icon">🛍️</span>
              <span className="logo-text">Choose&Get</span>
            </Link>
          </div>

          <div className="login-card">
            <h2>Welcome Back</h2>
            <p className="subtitle">Please enter your details</p>

            {error.message && (
              <div className={`error-message ${error.type}`}>
                {error.message}
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
            )}

            <form className="login-form" onSubmit={handleLogin}>
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
                  type="password"
                  placeholder="Password"
                  ref={passwordRef}
                  required
                />
              </div>

              <button type="submit" className="login-btn" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="divider">
              <span>OR</span>
            </div>

            <button
              className="google-btn"
              onClick={handleGoogleLogin}
              disabled={loading}
            >
              <FcGoogle className="google-icon" />
              Sign in with Google
            </button>

            <div className="footer-links">
              <Link to="/forgot-password">Forgot password?</Link>
              <span>Don't have an account? <Link to="/signup">Sign up</Link></span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;