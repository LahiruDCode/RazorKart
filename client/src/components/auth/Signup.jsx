import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Signup.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const Signup = () => {
  const navigate = useNavigate();
  const [showMessage, setShowMessage] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    contactNumber: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const togglePasswordVisibility = (field) => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else if (field === 'confirmPassword') {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  const handleSocialSignUp = (provider) => {
    setShowMessage(`${provider} sign up will be implemented soon!`);
    setTimeout(() => setShowMessage(''), 3000);
  };

  const validateForm = () => {
    const newErrors = {};

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    // Email validation
    if (!formData.email.includes('@')) {
      newErrors.email = 'Invalid email address';
    }

    // Contact number validation
    if (formData.contactNumber.length !== 10) {
      newErrors.contactNumber = 'Contact number must be 10 digits';
    }

    // Password validation
    if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setShowMessage('Please fix the errors in the form');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5001/api/users/register', {
        username: formData.username,
        email: formData.email,
        contactNumber: formData.contactNumber,
        password: formData.password
      });

      setShowMessage('Account created successfully!');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      console.error('Registration error:', error);
      setShowMessage(error.response?.data?.message || 'Error creating account. Please try again.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <div className="signup-container">
      <video autoPlay loop muted className="background-video">
        <source src="/assets/videos/background.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="signup-content">
        <div className="social-signup">
          <h3>You can also sign in with these :</h3>
          <div className="social-buttons">
            <button 
              className="social-button google"
              onClick={() => handleSocialSignUp('Google')}
            >
              <span className="icon">G</span>
              Google
            </button>

            <button 
              className="social-button facebook"
              onClick={() => handleSocialSignUp('Facebook')}
            >
              <span className="icon">f</span>
              Facebook
            </button>
          </div>
        </div>

        <div className="divider-vertical"></div>

        <div className="signup-form-container">
          <h1>Create a New Account</h1>
          <p className="login-prompt">
            Already have an account? <Link to="/login">Log In</Link> here
          </p>

          <form className="signup-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                name="username"
                placeholder="User Name:"
                required
                className={`dark-input ${errors.username ? 'error' : ''}`}
                value={formData.username}
                onChange={handleChange}
                autoComplete="off"
                data-lpignore="true"
              />
              {errors.username && <span className="error-message">{errors.username}</span>}
            </div>

            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="Email:"
                required
                className={`dark-input ${errors.email ? 'error' : ''}`}
                value={formData.email}
                onChange={handleChange}
                autoComplete="off"
                data-lpignore="true"
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
              <input
                type="tel"
                name="contactNumber"
                placeholder="Contact Number:"
                required
                className={`dark-input ${errors.contactNumber ? 'error' : ''}`}
                value={formData.contactNumber}
                onChange={handleChange}
                autoComplete="off"
                data-lpignore="true"
              />
              {errors.contactNumber && <span className="error-message">{errors.contactNumber}</span>}
            </div>

            <div className="form-group">
              <div className="password-input-container">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password:"
                  required
                  className={`dark-input ${errors.password ? 'error' : ''}`}
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  data-lpignore="true"
                />
                <span className="password-toggle-icon" onClick={() => togglePasswordVisibility('password')}>
                  <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                </span>
              </div>
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            <div className="form-group">
              <div className="password-input-container">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm Password:"
                  required
                  className={`dark-input ${errors.confirmPassword ? 'error' : ''}`}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                  data-lpignore="true"
                />
                <span className="password-toggle-icon" onClick={() => togglePasswordVisibility('confirmPassword')}>
                  <FontAwesomeIcon icon={showConfirmPassword ? faEye : faEyeSlash} />
                </span>
              </div>
              {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
            </div>

            <button type="submit" className="signup-button large-button">
              Create Account
            </button>
          </form>
        </div>
      </div>

      {showMessage && (
        <div className={`message-popup ${showMessage.includes('Error') ? 'error' : 'success'}`}>
          {showMessage}
        </div>
      )}
    </div>
  );
};

export default Signup;
