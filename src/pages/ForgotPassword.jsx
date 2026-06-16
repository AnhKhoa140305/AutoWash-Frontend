import React, { useState, useEffect, useRef } from 'react';
import { Form, Button, Row, Col, Spinner, InputGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FiMail, FiLock, FiArrowLeft, FiCheckCircle, FiActivity } from 'react-icons/fi';

const ForgotPassword = () => {
  // Refs
  const emailInputRef = useRef(null);

  // States
  const [step, setStep] = useState(1); // 1: Enter Email, 2: Check Mailbox Success
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0); // 60s countdown for resending

  // Error States
  const [errors, setErrors] = useState({ email: '', submit: '' });

  // 1. Auto-focus Email input on Step 1 load
  useEffect(() => {
    if (step === 1 && emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, [step]);

  // 2. Cooldown timer for resending email
  useEffect(() => {
    let timer = null;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown(prev => prev - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [cooldown]);

  // 3. Email format validation
  const validateEmail = (val) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!val) {
      return 'Vui lòng nhập địa chỉ email.';
    } else if (!emailRegex.test(val)) {
      return 'Định dạng email không hợp lệ (ví dụ: name@domain.com).';
    }
    return '';
  };

  const handleRequestSubmit = async (e) => {
    if (e) e.preventDefault();
    if (isLoading) return;

    const emailError = validateEmail(email);
    if (emailError) {
      setErrors({ email: emailError, submit: '' });
      return;
    }

    setErrors({ email: '', submit: '' });
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        let errMsg = 'Có lỗi xảy ra, vui lòng thử lại';
        try {
          const errorData = await response.json();
          errMsg = errorData.error || errorData.message || errMsg;
        } catch (err) {}
        throw new Error(errMsg);
      }

      // Successful request submission
      setStep(2);
      setCooldown(60); // Start 60s countdown cooldown

    } catch (error) {
      setErrors(prev => ({
        ...prev,
        submit: error.message || 'Có lỗi xảy ra, vui lòng thử lại'
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = () => {
    if (cooldown > 0 || isLoading) return;
    handleRequestSubmit(null);
  };

  return (
    <div className="login-page-wrapper">
      <Row className="g-0 min-vh-100">
        {/* Left: Branding Panel (Exactly Identical to Login/Register) */}
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

            <div className="illustration-container my-4">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 600 300" 
                width="100%" 
                max-width="450" 
                style={{ fill: 'currentColor' }}
              >
                <circle cx="150" cy="100" r="15" fill="#3b82f6" opacity="0.2" />
                <circle cx="450" cy="80" r="25" fill="#3b82f6" opacity="0.15" />
                <circle cx="380" cy="220" r="12" fill="#0A6EBD" opacity="0.25" />
                <circle cx="200" cy="210" r="20" fill="#0A6EBD" opacity="0.1" />
                
                <path d="M 50 240 L 550 240" stroke="rgba(255,255,255,0.15)" strokeWidth="6" strokeLinecap="round" />
                <path d="M 100 240 L 500 240" stroke="#0A6EBD" strokeWidth="4" strokeLinecap="round" />

                <path d="M 150 200 C 150 180, 180 180, 200 160 C 220 140, 250 120, 300 120 C 350 120, 390 140, 410 160 C 430 180, 460 180, 460 200 C 460 215, 440 215, 430 215 L 180 215 C 170 215, 150 215, 150 200 Z" fill="#0A6EBD" />
                
                <path d="M 280 132 L 232 165 C 228 168, 230 172, 235 172 L 280 172 Z" fill="rgba(255,255,255,0.3)" />
                <path d="M 292 132 L 340 132 C 348 132, 362 142, 368 152 L 382 172 L 292 172 Z" fill="rgba(255,255,255,0.3)" />

                <circle cx="210" cy="225" r="25" fill="#1e293b" stroke="#0f172a" strokeWidth="6" />
                <circle cx="210" cy="225" r="8" fill="#94a3b8" />
                <circle cx="400" cy="225" r="25" fill="#1e293b" stroke="#0f172a" strokeWidth="6" />
                <circle cx="400" cy="225" r="8" fill="#94a3b8" />

                <path d="M 458 190 L 465 192 A 3 3 0 0 1 465 198 L 458 195 Z" fill="#f59e0b" />
                <rect x="150" y="193" width="10" height="5" rx="2" fill="#ef4444" />
                
                <path d="M 330 80 Q 340 90, 330 100 T 330 110" fill="none" stroke="#60a5fa" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
                <path d="M 220 90 Q 230 100, 220 110" fill="none" stroke="#60a5fa" strokeWidth="3" strokeLinecap="round" opacity="0.4" />
                <path d="M 390 100 Q 380 110, 390 120" fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
              </svg>
            </div>
          </div>
        </Col>

        {/* Right: Forgot Password Panel (2 Steps) */}
        <Col xs={12} lg={6} className="login-panel d-flex align-items-center justify-content-center">
          <div className="login-form-box w-100 p-4 p-sm-5 text-center text-lg-start" style={{ maxWidth: '480px' }}>
            <div className="d-flex d-lg-none align-items-center justify-content-center mb-4">
              <FiActivity className="text-primary me-2 fs-2" />
              <h2 className="logo-text text-dark m-0 font-weight-bold">
                Auto<span className="text-primary">Wash</span>
              </h2>
            </div>

            {step === 1 ? (
              /* --- STEP 1: ENTER EMAIL --- */
              <div className="fade-in-section">
                <div className="mb-4 text-center">
                  <div 
                    className="bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center mb-3 mx-auto"
                    style={{ width: '80px', height: '80px', fontSize: '2.5rem' }}
                  >
                    <FiLock style={{ color: '#0A6EBD' }} />
                  </div>
                  <h3 className="font-weight-bold text-dark mb-2">Quên mật khẩu?</h3>
                  <p className="text-muted" style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
                    Nhập email đã đăng ký, chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu vào email của bạn
                  </p>
                </div>

                <Form onSubmit={handleRequestSubmit} noValidate>
                  {errors.submit && (
                    <div className="alert-error-box mb-3 p-3 rounded text-start" style={{ backgroundColor: 'rgba(229, 62, 62, 0.1)', border: '1px solid rgba(229, 62, 62, 0.2)', color: '#E53E3E', fontSize: '0.875rem' }}>
                      {errors.submit}
                    </div>
                  )}

                  <Form.Group className="mb-4" controlId="formResetEmail">
                    <Form.Label className="font-weight-bold text-start w-100" style={{ fontSize: '0.9rem', color: '#1A1A2E' }}>Email</Form.Label>
                    <InputGroup>
                      <InputGroup.Text className="bg-transparent border-end-0 text-muted">
                        <FiMail />
                      </InputGroup.Text>
                      <Form.Control 
                        type="email" 
                        placeholder="example@gmail.com" 
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
                        <Form.Control.Feedback type="invalid" className="d-block text-start" style={{ color: '#E53E3E', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                          {errors.email}
                        </Form.Control.Feedback>
                      )}
                    </InputGroup>
                  </Form.Group>

                  <Button 
                    type="submit" 
                    className="w-100 btn-primary d-flex align-items-center justify-content-center mb-3"
                    disabled={isLoading}
                    style={{ backgroundColor: '#0A6EBD', borderColor: '#0A6EBD', padding: '0.75rem', fontWeight: 600 }}
                  >
                    {isLoading ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Đang gửi yêu cầu...
                      </>
                    ) : 'Gửi yêu cầu'}
                  </Button>
                </Form>

                <div className="text-center mt-3">
                  <Link to="/login" className="d-inline-flex align-items-center gap-1.5 text-secondary" style={{ textDecoration: 'none', fontWeight: 500 }}>
                    <FiArrowLeft /> Quay lại đăng nhập
                  </Link>
                </div>
              </div>
            ) : (
              /* --- STEP 2: CHECK MAILBOX SUCCESS --- */
              <div className="fade-in-section text-center">
                <div className="mb-4">
                  <div 
                    className="bg-success-subtle text-success rounded-circle d-flex align-items-center justify-content-center mb-3 mx-auto animated-success-icon"
                    style={{ width: '80px', height: '80px', fontSize: '3rem', animation: 'successPop 0.5s ease-out forwards' }}
                  >
                    <FiCheckCircle style={{ color: '#38A169' }} />
                  </div>
                  <h3 className="font-weight-bold text-dark mb-2">Kiểm tra hộp thư!</h3>
                  <p className="text-muted mb-4" style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
                    Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến <strong className="text-dark">{email}</strong>
                  </p>
                </div>

                <div className="mb-4">
                  <Button 
                    onClick={handleResend}
                    disabled={cooldown > 0 || isLoading}
                    className="w-100 d-flex align-items-center justify-content-center"
                    style={{ 
                      backgroundColor: cooldown > 0 ? '#e2e8f0' : '#0A6EBD', 
                      borderColor: cooldown > 0 ? '#e2e8f0' : '#0A6EBD', 
                      color: cooldown > 0 ? '#94a3b8' : '#ffffff',
                      padding: '0.75rem', 
                      fontWeight: 600 
                    }}
                  >
                    {isLoading ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Đang gửi lại...
                      </>
                    ) : (
                      cooldown > 0 ? `Gửi lại sau ${cooldown}s` : 'Gửi lại email'
                    )}
                  </Button>
                </div>

                <div className="text-center mt-3">
                  <Link to="/login" className="d-inline-flex align-items-center gap-1.5 text-secondary" style={{ textDecoration: 'none', fontWeight: 500 }}>
                    <FiArrowLeft /> Quay lại đăng nhập
                  </Link>
                </div>
              </div>
            )}
          </div>
        </Col>
      </Row>

      {/* Inline styles for Step 2 checkmark popping animation */}
      <style>{`
        @keyframes successPop {
          0% { transform: scale(0.6); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default ForgotPassword;
