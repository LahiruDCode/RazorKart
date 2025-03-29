 import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';
import Loader from '../common/Loader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [showMessage, setShowMessage] = useState('');
  const [authenticatedUser, setAuthenticatedUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSocialLogin = (provider) => {
    setShowMessage(`${provider} login will be implemented soon!`);
    setTimeout(() => setShowMessage(''), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5001/api/auth/login', formData);
      const { user, token } = response.data;

      // Store user data and token
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);

      // Log the user role for debugging
      console.log('User role:', user.role);

      // Set authenticated user for welcome animation
      setAuthenticatedUser(user);
      
      // Delay redirect to show welcome animation
      setTimeout(() => {
        // Redirect based on role
        switch (user.role.toLowerCase()) {
          case 'admin':
            navigate('/admin');
            break;
          case 'buyer':
            navigate('/buyer');
            break;
          case 'seller':
            navigate('/seller');
            break;
          case 'content-manager':
            navigate('/content-manager');
            break;
          case 'inquiry-manager':
            navigate('/inquiry-manager');
            break;
          default:
            console.log('Unknown role:', user.role);
            navigate('/');
        }
      }, 4000); // Wait for logo animation + welcome message
    } catch (error) {
      console.error('Login error:', error);
      setShowMessage(error.response?.data?.message || 'Invalid email or password');
      setTimeout(() => setShowMessage(''), 3000);
      // Only set loading to false if there's an error
      setLoading(false);
    }
    // Remove setLoading(false) from finally block to keep loader visible until redirect
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="login-container">
      {loading && <Loader 
        message={authenticatedUser ? "Preparing dashboard..." : "Authenticating..."} 
        username={authenticatedUser?.username}
      />}
      
      <video autoPlay loop muted className="background-video">
        <source src="/assets/videos/background.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="login-content">
        <div className="login-welcome">
          <h2>Welcome Back</h2>
          <p>Sign in to continue to RazorKart</p>
        </div>
        
        <div className="social-buttons">
          <button 
            className="social-button google"
            onClick={() => handleSocialLogin('Google')}
          >
            <i className="icon">G</i>
            Continue with Google
          </button>

          <button 
            className="social-button facebook"
            onClick={() => handleSocialLogin('Facebook')}
          >
            <i className="icon">f</i>
            Continue with Facebook
          </button>
        </div>

        <div className="divider">
          <span>OR</span>
        </div>
        
        <div className="form-container">
          {showMessage && (
            <div className="message-box">
              {showMessage}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            {/* Hidden honeypot fields to trick browser autofill */}
            <div style={{ display: 'none' }}>
              <input type="text" name="fakeusernameremembered" />
              <input type="password" name="fakepasswordremembered" />
            </div>
            
            <div className="form-group">
              <input
                type="email"
                name="user_email_address" /* Changed from 'email' to prevent autofill */
                placeholder="Email"
                value={formData.email}
                onChange={(e) => {
                  const updatedFormData = {
                    ...formData,
                    email: e.target.value
                  };
                  setFormData(updatedFormData);
                }}
                required
                autoComplete="chrome-off" /* More aggressive approach */
                data-lpignore="true"
              />
            </div>
            <div className="form-group password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="new-password"
                data-lpignore="true"
              />
              <span className="password-toggle-icon" onClick={togglePasswordVisibility}>
                <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
              </span>
            </div>
            <div className="remember-forgot">
              <div className="remember-me">
                <input type="checkbox" id="remember" />
                <label htmlFor="remember">Remember me</label>
              </div>
              <a href="/forgot-password" className="forgot-password">Forgot password?</a>
            </div>
            
            <button type="submit" className="login-button large-button">
              {loading ? 'Logging in...' : 'Sign In'}
            </button>
          </form>
          <p className="signup-link">
            Don't have an account? <a href="/signup">Sign Up</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
