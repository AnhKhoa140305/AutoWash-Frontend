import React, { useState, useEffect, useRef, useContext } from 'react';
import { Form, Button, Row, Col, Spinner, InputGroup } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff, FiMail, FiLock, FiActivity } from 'react-icons/fi';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // Refs
  const emailInputRef = useRef(null);

  // States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Error States
  const [errors, setErrors] = useState({ email: '', password: '', submit: '' });

  // 1. Auto-focus Email and Pre-fill Remembered Email
  useEffect(() => {
    const savedEmail = localStorage.getItem('remembered_email');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
    // Auto-focus email field
    if (emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, []);

  // 2. Validate email format
  const validateEmail = (val) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!val) {
      return 'Vui lòng nhập địa chỉ email.';
    } else if (!emailRegex.test(val)) {
      return 'Định dạng email không hợp lệ (ví dụ: name@domain.com).';
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    // Client-side validations
    const emailError = validateEmail(email);
    const passwordError = !password ? 'Vui lòng nhập mật khẩu.' : '';

    if (emailError || passwordError) {
      setErrors({
        email: emailError,
        password: passwordError,
        submit: ''
      });
      return;
    }

    setErrors({ email: '', password: '', submit: '' });
    setIsLoading(true);

    try {
      const data = await login(email, password);

      // Remember me functionality
      if (rememberMe) {
        localStorage.setItem('remembered_email', email);
      } else {
        localStorage.removeItem('remembered_email');
      }

      // Redirect based on role
      if (data.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        submit: error.message || 'Đăng nhập không thành công. Hãy thử lại.'
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <div className="login-page-wrapper">
      <Row className="g-0 min-vh-100">
        {/* Left: Branding Panel */}
        <Col lg={6} className="d-none d-lg-flex branding-panel align-items-center justify-content-center text-white">
          <div className="text-center px-5">
            <div className="d-flex align-items-center justify-content-center mb-3">
              <FiActivity className="text-primary me-3" style={{ fontSize: '3.5rem' }} />
              <h1 className="display-4 font-weight-bold m-0" style={{ letterSpacing: '1px', fontWeight: 800 }}>
                Auto<span className="text-primary">Wash</span>
              </h1>
            </div>
            <p className="lead text-white-50 mb-5 fs-4" style={{ fontWeight: 400 }}>
              Hệ thống rửa xe thông minh tự động hàng đầu
            </p>

            {/* Custom SVG Car Graphic Illustration */}
            <div className="illustration-container my-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 600 300"
                width="100%"
                max-width="450"
                style={{ fill: 'currentColor' }}
              >
                {/* Background bubbles */}
                <circle cx="150" cy="100" r="15" fill="#3b82f6" opacity="0.2" />
                <circle cx="450" cy="80" r="25" fill="#3b82f6" opacity="0.15" />
                <circle cx="380" cy="220" r="12" fill="#0A6EBD" opacity="0.25" />
                <circle cx="200" cy="210" r="20" fill="#0A6EBD" opacity="0.1" />

                {/* Ground */}
                <path d="M 50 240 L 550 240" stroke="rgba(255,255,255,0.15)" strokeWidth="6" strokeLinecap="round" />
                <path d="M 100 240 L 500 240" stroke="#0A6EBD" strokeWidth="4" strokeLinecap="round" />

                {/* Car Body */}
                <path d="M 150 200 C 150 180, 180 180, 200 160 C 220 140, 250 120, 300 120 C 350 120, 390 140, 410 160 C 430 180, 460 180, 460 200 C 460 215, 440 215, 430 215 L 180 215 C 170 215, 150 215, 150 200 Z" fill="#0A6EBD" />

                {/* Windshield & Windows */}
                <path d="M 280 132 L 232 165 C 228 168, 230 172, 235 172 L 280 172 Z" fill="rgba(255,255,255,0.3)" />
                <path d="M 292 132 L 340 132 C 348 132, 362 142, 368 152 L 382 172 L 292 172 Z" fill="rgba(255,255,255,0.3)" />

                {/* Wheels */}
                <circle cx="210" cy="225" r="25" fill="#1e293b" stroke="#0f172a" strokeWidth="6" />
                <circle cx="210" cy="225" r="8" fill="#94a3b8" />
                <circle cx="400" cy="225" r="25" fill="#1e293b" stroke="#0f172a" strokeWidth="6" />
                <circle cx="400" cy="225" r="8" fill="#94a3b8" />

                {/* Headlights and details */}
                <path d="M 458 190 L 465 192 A 3 3 0 0 1 465 198 L 458 195 Z" fill="#f59e0b" />
                <rect x="150" y="193" width="10" height="5" rx="2" fill="#ef4444" />

                {/* Water Droplets / Soap effects */}
                <path d="M 330 80 Q 340 90, 330 100 T 330 110" fill="none" stroke="#60a5fa" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
                <path d="M 220 90 Q 230 100, 220 110" fill="none" stroke="#60a5fa" strokeWidth="3" strokeLinecap="round" opacity="0.4" />
                <path d="M 390 100 Q 380 110, 390 120" fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
              </svg>
            </div>
          </div>
        </Col>

        {/* Right: Login Form Panel */}
        <Col xs={12} lg={6} className="login-panel d-flex align-items-center justify-content-center">
          <div className="login-form-box w-100 p-4 p-sm-5" style={{ maxWidth: '480px' }}>
            {/* Logo display on mobile */}
            <div className="d-flex d-lg-none align-items-center justify-content-center mb-4">
              <FiActivity className="text-primary me-2 fs-2" />
              <h2 className="logo-text text-dark m-0 font-weight-bold">
                Auto<span className="text-primary">Wash</span>
              </h2>
            </div>

            <div className="mb-4">
              <h3 className="font-weight-bold text-dark mb-1">Đăng nhập</h3>
              <p className="text-muted" style={{ fontSize: '0.9rem' }}>Vui lòng đăng nhập tài khoản để tiếp tục</p>
            </div>

            <Form onSubmit={handleSubmit} noValidate>
              {/* Form submit response error */}
              {errors.submit && (
                <div className="alert-error-box mb-3 p-3 rounded" style={{ backgroundColor: 'rgba(229, 62, 62, 0.1)', border: '1px solid rgba(229, 62, 62, 0.2)', color: '#E53E3E', fontSize: '0.875rem' }}>
                  {errors.submit}
                </div>
              )}

              {/* Email field */}
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label className="font-weight-bold" style={{ fontSize: '0.9rem', color: '#1A1A2E' }}>Email</Form.Label>
                <InputGroup>
                  <InputGroup.Text className="bg-transparent border-end-0 text-muted">
                    <FiMail />
                  </InputGroup.Text>
                  <Form.Control
                    type="email"
                    placeholder="Nhập email của bạn"
                    ref={emailInputRef}
                    value={email}
                    disabled={isLoading}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                    }}
                    className={`border-start-0 ${errors.email ? 'is-invalid border-danger' : ''}`}
                  />
                  {errors.email && (
                    <Form.Control.Feedback type="invalid" className="d-block" style={{ color: '#E53E3E', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                      {errors.email}
                    </Form.Control.Feedback>
                  )}
                </InputGroup>
              </Form.Group>

              {/* Password field */}
              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label className="font-weight-bold" style={{ fontSize: '0.9rem', color: '#1A1A2E' }}>Mật khẩu</Form.Label>
                <InputGroup>
                  <InputGroup.Text className="bg-transparent border-end-0 text-muted">
                    <FiLock />
                  </InputGroup.Text>
                  <Form.Control
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Nhập mật khẩu"
                    value={password}
                    disabled={isLoading}
                    onKeyPress={handlePasswordKeyPress}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
                    }}
                    className={`border-start-0 border-end-0 ${errors.password ? 'is-invalid border-danger' : ''}`}
                  />
                  <InputGroup.Text
                    className="bg-transparent border-start-0 text-muted cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ cursor: 'pointer' }}
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </InputGroup.Text>
                  {errors.password && (
                    <Form.Control.Feedback type="invalid" className="d-block" style={{ color: '#E53E3E', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                      {errors.password}
                    </Form.Control.Feedback>
                  )}
                </InputGroup>
              </Form.Group>

              {/* Remember me & Forgot Password */}
              <div className="d-flex justify-content-between align-items-center mb-4" style={{ fontSize: '0.85rem' }}>
                <Form.Check
                  type="checkbox"
                  id="remember-me-checkbox"
                  label="Ghi nhớ đăng nhập"
                  checked={rememberMe}
                  disabled={isLoading}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <Link to="/forgot-password" style={{ color: '#0A6EBD', textDecoration: 'none', fontWeight: 500 }}>
                  Quên mật khẩu?
                </Link>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-100 btn-primary d-flex align-items-center justify-content-center"
                disabled={isLoading}
                style={{ backgroundColor: '#0A6EBD', borderColor: '#0A6EBD', padding: '0.75rem', fontWeight: 600 }}
              >
                {isLoading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Đang kết nối...
                  </>
                ) : 'Đăng nhập'}
              </Button>
            </Form>

            {/* Registration link */}
            <div className="text-center mt-4" style={{ fontSize: '0.9rem', color: '#1A1A2E' }}>
              <span>Chưa có tài khoản? </span>
              <Link to="/register" style={{ color: '#0A6EBD', textDecoration: 'none', fontWeight: 600 }}>
                Đăng ký ngay
              </Link>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Login;
