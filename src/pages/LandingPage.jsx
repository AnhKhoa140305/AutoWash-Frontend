import React, { useContext } from 'react';
import { Container, Row, Col, Card, Button, Navbar, Nav, Badge } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FiCalendar, FiLogOut, FiActivity, FiStar, FiCheck, FiArrowRight, FiPhone, FiMapPin, FiClock } from 'react-icons/fi';
import { AuthContext } from '../context/AuthContext';

const LandingPage = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Helpers
  const formatVND = (num) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);

  const handleBookingCTA = () => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      navigate(user?.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard');
    }
  };

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', scrollBehavior: 'smooth', fontFamily: 'var(--font-family)' }}>
      
      {/* 1. Header Navigation */}
      <Navbar bg="white" expand="lg" className="py-3.5 sticky-top border-bottom" style={{ zIndex: 1000, boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
        <Container>
          <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
            <FiActivity className="text-primary me-2.5 fs-2" />
            <span className="logo-text text-dark m-0" style={{ fontSize: '1.75rem', fontWeight: 850, letterSpacing: '-0.5px' }}>
              Auto<span className="text-primary">Wash</span>
            </span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="autowash-nav" />
          <Navbar.Collapse id="autowash-nav">
            <Nav className="mx-auto gap-2 gap-lg-4 font-weight-bold" style={{ fontWeight: 600, fontSize: '1.05rem' }}>
              <Nav.Link href="#home" className="px-2">Trang chủ</Nav.Link>
              <Nav.Link href="#packages" className="px-2">Gói dịch vụ</Nav.Link>
              <Nav.Link href="#loyalty" className="px-2">Tích lũy điểm</Nav.Link>
              <Nav.Link href="#contact" className="px-2">Liên hệ</Nav.Link>
            </Nav>
            <div className="d-flex align-items-center gap-3 mt-3 mt-lg-0">
              {isAuthenticated ? (
                <>
                  <span className="d-none d-sm-inline" style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>
                    Xin chào, <strong>{user?.fullName}</strong>!
                  </span>
                  <Button 
                    as={Link} 
                    to={user?.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard'} 
                    style={{ backgroundColor: '#0A6EBD', borderColor: '#0A6EBD', fontWeight: 600, padding: '0.6rem 1.4rem', fontSize: '1rem', borderRadius: '10px' }}
                    className="btn-primary"
                  >
                    {user?.role === 'ADMIN' ? 'Trang quản trị' : 'Trang cá nhân'}
                  </Button>
                  <Button variant="outline-danger" size="md" onClick={logout} className="d-flex align-items-center justify-content-center" style={{ padding: '0.6rem 0.8rem', borderRadius: '10px' }}>
                    <FiLogOut className="fs-5" />
                  </Button>
                </>
              ) : (
                <>
                  <Button as={Link} to="/login" variant="outline-primary" style={{ borderColor: '#0A6EBD', color: '#0A6EBD', fontWeight: 600, padding: '0.6rem 1.4rem', fontSize: '1rem', borderRadius: '10px' }}>
                    Đăng nhập
                  </Button>
                  <Button as={Link} to="/register" style={{ backgroundColor: '#0A6EBD', borderColor: '#0A6EBD', fontWeight: 600, padding: '0.6rem 1.4rem', fontSize: '1rem', borderRadius: '10px' }} className="btn-primary">
                    Đăng ký
                  </Button>
                </>
              )}
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* 2. Hero Section */}
      <section id="home" className="py-5 position-relative overflow-hidden" style={{ minHeight: '85vh', display: 'flex', alignItems: 'center', background: 'radial-gradient(circle at 80% 20%, rgba(10, 110, 189, 0.07) 0%, rgba(255, 255, 255, 0) 60%), linear-gradient(180deg, #F8FAFC 0%, #E2E8F0 100%)' }}>
        <Container>
          <Row className="align-items-center g-5">
            <Col lg={6} className="text-center text-lg-start">
              <Badge 
                className="px-4.5 py-3 mb-4 rounded-pill text-white" 
                style={{ 
                  background: 'linear-gradient(135deg, #0A6EBD 0%, #3b82f6 100%)', 
                  fontSize: '1.15rem', 
                  fontWeight: 700, 
                  letterSpacing: '0.5px',
                  boxShadow: '0 6px 20px rgba(10, 110, 189, 0.25)',
                  border: 'none',
                  display: 'inline-block'
                }}
              >
                Hệ thống Rửa xe Tự động Công nghệ mới
              </Badge>
              <h1 className="display-3 text-dark mb-4" style={{ fontWeight: 900, lineHeight: 1.15, fontSize: '3.6rem', letterSpacing: '-1px' }}>
                Rửa xe siêu tốc,<br />
                Sạch sâu trong <span style={{ color: '#0A6EBD', background: 'linear-gradient(120deg, #0A6EBD, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>15 phút</span>
              </h1>
              <p className="lead text-secondary mb-5" style={{ fontSize: '1.25rem', lineHeight: '1.8', fontWeight: 400 }}>
                AutoWash kết hợp công nghệ vòi xịt áp lực cao đa chiều cùng hệ thống chổi mềm chuẩn quốc tế. Rửa vỏ gầm sạch bong, sấy khô nhanh chóng mà không gây xước sơn xe.
              </p>
              <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center justify-content-lg-start mt-2">
                <Button 
                  onClick={handleBookingCTA}
                  size="lg" 
                  className="btn-primary px-5 py-3.5 d-inline-flex align-items-center justify-content-center gap-2"
                  style={{ backgroundColor: '#0A6EBD', borderColor: '#0A6EBD', fontWeight: 700, fontSize: '1.15rem', borderRadius: '12px', boxShadow: '0 8px 25px rgba(10, 110, 189, 0.25)' }}
                >
                  <FiCalendar className="fs-5" /> Đặt lịch rửa xe ngay <FiArrowRight />
                </Button>
                <Button 
                  href="#packages" 
                  variant="outline-secondary" 
                  size="lg" 
                  className="px-5 py-3.5"
                  style={{ fontWeight: 600, fontSize: '1.15rem', borderRadius: '12px', borderWidth: '2px' }}
                >
                  Xem bảng giá dịch vụ
                </Button>
              </div>
            </Col>
            
            {/* Visual Vector Illustration */}
            <Col lg={6} className="text-center">
              <div 
                className="position-relative mx-auto"
                style={{ 
                  maxWidth: '520px', 
                  filter: 'drop-shadow(0 20px 40px rgba(10, 110, 189, 0.18))',
                  animation: 'floatAnimation 5s ease-in-out infinite' 
                }}
              >
                <svg viewBox="0 0 500 400" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%' }}>
                  <defs>
                    <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#0a6ebd" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.4" />
                    </linearGradient>
                  </defs>
                  {/* Decorative backgrounds */}
                  <circle cx="250" cy="200" r="160" fill="url(#bgGrad)" />
                  <circle cx="120" cy="100" r="30" fill="#60a5fa" opacity="0.3" />
                  <circle cx="400" cy="280" r="45" fill="#3b82f6" opacity="0.2" />
                  <circle cx="80" cy="300" r="20" fill="#0A6EBD" opacity="0.15" />

                  {/* Ground base */}
                  <line x1="80" y1="310" x2="420" y2="310" stroke="#cbd5e1" strokeWidth="6" strokeLinecap="round" />
                  <line x1="120" y1="310" x2="380" y2="310" stroke="#0a6ebd" strokeWidth="4" strokeLinecap="round" />

                  {/* Main Car silhouette */}
                  <path d="M 140 270 C 140 250, 170 250, 190 230 C 210 210, 240 190, 280 190 C 330 190, 360 210, 380 230 C 400 250, 420 250, 420 270 C 420 282, 400 282, 390 282 L 170 282 C 160 282, 140 282, 140 270 Z" fill="#1e293b" />
                  
                  {/* Glass */}
                  <path d="M 265 200 L 220 232 C 217 235, 218 238, 222 238 L 265 238 Z" fill="#3b82f6" opacity="0.6" />
                  <path d="M 275 200 L 320 200 C 326 200, 335 210, 340 218 L 350 238 L 275 238 Z" fill="#3b82f6" opacity="0.6" />

                  {/* Wheels */}
                  <circle cx="200" cy="290" r="26" fill="#0f172a" stroke="#cbd5e1" strokeWidth="4" />
                  <circle cx="200" cy="290" r="8" fill="#94a3b8" />
                  <circle cx="350" cy="290" r="26" fill="#0f172a" stroke="#cbd5e1" strokeWidth="4" />
                  <circle cx="350" cy="290" r="8" fill="#94a3b8" />

                  {/* Headlights */}
                  <path d="M 416 260 L 422 262 A 3 3 0 0 1 422 268 L 416 265 Z" fill="#f59e0b" />
                  
                  {/* Clean Sparkles */}
                  <path d="M 280 140 L 285 155 L 300 160 L 285 165 L 280 180 L 275 165 L 260 160 L 275 155 Z" fill="#fbbf24" />
                  <path d="M 160 160 L 163 170 L 173 173 L 163 176 L 160 186 L 157 176 L 147 173 L 157 170 Z" fill="#38a169" opacity="0.8" />
                  <path d="M 390 150 L 392 158 L 400 160 L 392 162 L 390 170 L 388 162 L 380 160 L 388 158 Z" fill="#60a5fa" />
                </svg>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* 3. Service Packages Section */}
      <section id="packages" className="py-5">
        <Container className="py-5">
          <div className="text-center mb-5">
            <h2 className="text-dark mb-3" style={{ fontWeight: 800, fontSize: '2.5rem', letterSpacing: '-0.5px' }}>Bảng Giá Gói Dịch Vụ Rửa Xe</h2>
            <p className="text-secondary mx-auto" style={{ maxWidth: '750px', fontSize: '1.15rem', lineHeight: '1.7' }}>
              Hãy chọn gói rửa xe tối ưu nhất cho xế yêu của bạn. Tất cả các dịch vụ đều sử dụng hóa chất sinh học chất lượng cao, bảo vệ tối đa bề mặt sơn sơn xe.
            </p>
          </div>

          <Row className="g-4 justify-content-center mt-3">
            {/* Package 1 */}
            <Col xs={12} md={6} lg={4}>
              <Card className="autowash-card border-0 h-100 p-4.5 shadow-sm text-center d-flex flex-column justify-content-between" style={{ borderRadius: '20px' }}>
                <Card.Body className="p-0">
                  <div className="mb-3">
                    <span className="badge bg-secondary-subtle text-secondary-emphasis px-3.5 py-2 rounded-pill font-weight-bold" style={{ fontSize: '0.85rem', letterSpacing: '0.5px' }}>GÓI CƠ BẢN</span>
                  </div>
                  <h3 className="text-dark mb-2" style={{ fontWeight: 800, fontSize: '1.6rem' }}>Standard Exterior</h3>
                  <p className="text-secondary mb-4" style={{ fontSize: '1rem', lineHeight: '1.5' }}>Dành cho xe bám bụi mỏng cần rửa nhanh vỏ ngoài</p>
                  
                  <div className="mb-4 bg-light py-3 rounded-4">
                    <h2 className="text-primary mb-1" style={{ fontWeight: 900, fontSize: '2.6rem' }}>{formatVND(100000)}</h2>
                    <small className="text-secondary d-flex align-items-center justify-content-center gap-1.5" style={{ fontSize: '0.95rem', fontWeight: 500 }}>
                      <FiClock /> Thực hiện trong 20 phút
                    </small>
                  </div>

                  <hr style={{ borderColor: 'var(--border-color)', margin: '1.5rem 0' }} />

                  <ul className="list-unstyled text-start mb-5 d-flex flex-column gap-3" style={{ fontSize: '1.05rem', color: '#475569' }}>
                    <li className="d-flex align-items-start gap-2.5">
                      <FiCheck className="text-success mt-1 fs-5 flex-shrink-0" /> <span>Xịt rửa áp lực cao loại bỏ bùn đất</span>
                    </li>
                    <li className="d-flex align-items-start gap-2.5">
                      <FiCheck className="text-success mt-1 fs-5 flex-shrink-0" /> <span>Rửa vỏ ngoài bằng bọt tuyết chuyên dụng</span>
                    </li>
                    <li className="d-flex align-items-start gap-2.5">
                      <FiCheck className="text-success mt-1 fs-5 flex-shrink-0" /> <span>Xịt gầm làm sạch cát đá bám</span>
                    </li>
                    <li className="d-flex align-items-start gap-2.5">
                      <FiCheck className="text-success mt-1 fs-5 flex-shrink-0" /> <span>Lau khô vỏ và lau kính bên ngoài</span>
                    </li>
                    <li className="d-flex align-items-start gap-2.5">
                      <FiCheck className="text-success mt-1 fs-5 flex-shrink-0" /> <span>Làm sạch lốp xe cơ bản</span>
                    </li>
                  </ul>
                </Card.Body>
                
                <Button 
                  onClick={handleBookingCTA}
                  className="w-100 btn-outline-primary py-3" 
                  variant="outline-primary"
                  style={{ fontWeight: 700, fontSize: '1.05rem', borderRadius: '10px', borderWidth: '2px' }}
                >
                  Đặt lịch gói này
                </Button>
              </Card>
            </Col>

            {/* Package 2 */}
            <Col xs={12} md={6} lg={4}>
              <Card 
                className="autowash-card h-100 p-4.5 shadow d-flex flex-column justify-content-between position-relative"
                style={{ borderTop: '6px solid #0A6EBD', borderRadius: '20px', transform: 'translateY(-5px)', boxShadow: '0 10px 30px rgba(10, 110, 189, 0.1)' }}
              >
                <div className="position-absolute top-0 start-50 translate-middle">
                  <Badge bg="warning" className="text-dark py-2 px-4 rounded-pill font-weight-bold shadow-sm" style={{ fontSize: '0.85rem', letterSpacing: '0.5px' }}>BÁN CHẠY NHẤT</Badge>
                </div>
                <Card.Body className="p-0 text-center">
                  <div className="mb-3 mt-2">
                    <span className="badge bg-primary-subtle text-primary px-3.5 py-2 rounded-pill font-weight-bold" style={{ fontSize: '0.85rem', letterSpacing: '0.5px' }}>GÓI TOÀN DIỆN</span>
                  </div>
                  <h3 className="text-dark mb-2" style={{ fontWeight: 800, fontSize: '1.6rem' }}>Premium Wash</h3>
                  <p className="text-secondary mb-4" style={{ fontSize: '1rem', lineHeight: '1.5' }}>Vệ sinh hoàn hảo cả trong lẫn ngoài cabin xe</p>
                  
                  <div className="mb-4 bg-primary-subtle py-3 rounded-4" style={{ backgroundColor: 'rgba(10, 110, 189, 0.08)' }}>
                    <h2 className="text-primary mb-1" style={{ fontWeight: 900, fontSize: '2.6rem' }}>{formatVND(180000)}</h2>
                    <small className="text-secondary d-flex align-items-center justify-content-center gap-1.5" style={{ fontSize: '0.95rem', fontWeight: 500 }}>
                      <FiClock /> Thực hiện trong 35 phút
                    </small>
                  </div>

                  <hr style={{ borderColor: 'var(--border-color)', margin: '1.5rem 0' }} />

                  <ul className="list-unstyled text-start mb-5 d-flex flex-column gap-3" style={{ fontSize: '1.05rem', color: '#475569' }}>
                    <li className="d-flex align-items-start gap-2.5">
                      <FiCheck className="text-success mt-1 fs-5 flex-shrink-0" /> <span>Các bước của gói <strong>Standard</strong></span>
                    </li>
                    <li className="d-flex align-items-start gap-2.5">
                      <FiCheck className="text-success mt-1 fs-5 flex-shrink-0" /> <span>Hút bụi thảm sàn, kẽ ghế sâu</span>
                    </li>
                    <li className="d-flex align-items-start gap-2.5">
                      <FiCheck className="text-success mt-1 fs-5 flex-shrink-0" /> <span>Lau dưỡng táp lô, táp li bằng dung dịch chuyên dụng</span>
                    </li>
                    <li className="d-flex align-items-start gap-2.5">
                      <FiCheck className="text-success mt-1 fs-5 flex-shrink-0" /> <span>Khử trùng, xông tinh dầu khử mùi khoang lái</span>
                    </li>
                    <li className="d-flex align-items-start gap-2.5">
                      <FiCheck className="text-success mt-1 fs-5 flex-shrink-0" /> <span>Quét wax dưỡng bóng lốp xe</span>
                    </li>
                  </ul>
                </Card.Body>
                
                <Button 
                  onClick={handleBookingCTA}
                  className="w-100 btn-primary py-3" 
                  style={{ backgroundColor: '#0A6EBD', borderColor: '#0A6EBD', fontWeight: 700, fontSize: '1.05rem', borderRadius: '10px', boxShadow: '0 5px 15px rgba(10, 110, 189, 0.2)' }}
                >
                  Đặt lịch gói này
                </Button>
              </Card>
            </Col>

            {/* Package 3 */}
            <Col xs={12} md={6} lg={4}>
              <Card className="autowash-card border-0 h-100 p-4.5 shadow-sm text-center d-flex flex-column justify-content-between" style={{ borderRadius: '20px' }}>
                <Card.Body className="p-0">
                  <div className="mb-3">
                    <span className="badge bg-purple-subtle text-purple px-3.5 py-2 rounded-pill font-weight-bold" style={{ fontSize: '0.85rem', backgroundColor: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', letterSpacing: '0.5px' }}>GÓI CHUYÊN SÂU</span>
                  </div>
                  <h3 className="text-dark mb-2" style={{ fontWeight: 800, fontSize: '1.6rem' }}>Ultimate Detail & Wax</h3>
                  <p className="text-secondary mb-4" style={{ fontSize: '1rem', lineHeight: '1.5' }}>Bảo vệ sơn và làm sạch sâu từng chi tiết nhỏ</p>
                  
                  <div className="mb-4 bg-light py-3 rounded-4">
                    <h2 className="text-primary mb-1" style={{ fontWeight: 900, fontSize: '2.6rem' }}>{formatVND(350000)}</h2>
                    <small className="text-secondary d-flex align-items-center justify-content-center gap-1.5" style={{ fontSize: '0.95rem', fontWeight: 500 }}>
                      <FiClock /> Thực hiện trong 60 phút
                    </small>
                  </div>

                  <hr style={{ borderColor: 'var(--border-color)', margin: '1.5rem 0' }} />

                  <ul className="list-unstyled text-start mb-5 d-flex flex-column gap-3" style={{ fontSize: '1.05rem', color: '#475569' }}>
                    <li className="d-flex align-items-start gap-2.5">
                      <FiCheck className="text-success mt-1 fs-5 flex-shrink-0" /> <span>Các bước của gói <strong>Premium</strong></span>
                    </li>
                    <li className="d-flex align-items-start gap-2.5">
                      <FiCheck className="text-success mt-1 fs-5 flex-shrink-0" /> <span>Tẩy nhựa đường và bụi sắt cứng đầu trên vỏ sơn</span>
                    </li>
                    <li className="d-flex align-items-start gap-2.5">
                      <FiCheck className="text-success mt-1 fs-5 flex-shrink-0" /> <span>Vệ sinh chi tiết và dưỡng nhựa khoang động cơ</span>
                    </li>
                    <li className="d-flex align-items-start gap-2.5">
                      <FiCheck className="text-success mt-1 fs-5 flex-shrink-0" /> <span>Phủ Wax bóng ceramic bảo vệ tối đa bề mặt sơn</span>
                    </li>
                    <li className="d-flex align-items-start gap-2.5">
                      <FiCheck className="text-success mt-1 fs-5 flex-shrink-0" /> <span>Dưỡng da/nỉ ghế nội thất cao cấp</span>
                    </li>
                  </ul>
                </Card.Body>
                
                <Button 
                  onClick={handleBookingCTA}
                  className="w-100 btn-outline-primary py-3" 
                  variant="outline-primary"
                  style={{ fontWeight: 700, fontSize: '1.05rem', borderRadius: '10px', borderWidth: '2px' }}
                >
                  Đặt lịch gói này
                </Button>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* 4. Loyalty points system Section */}
      <section id="loyalty" className="py-5 bg-light">
        <Container className="py-5">
          <Row className="align-items-center g-5">
            <Col lg={5} className="text-center text-lg-start">
              <div 
                className="bg-primary-subtle text-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-4"
                style={{ width: '70px', height: '70px', fontSize: '2rem' }}
              >
                <FiStar style={{ fill: 'currentColor' }} />
              </div>
              <h2 className="text-dark mb-4" style={{ fontWeight: 800, fontSize: '2.4rem', lineHeight: '1.25', letterSpacing: '-0.5px' }}>
                Hệ Thống Tích Điểm Hội Viên<br />
                Nhận Ưu Đãi Giảm Giá Cực Khủng!
              </h2>
              <p className="text-secondary mb-5" style={{ fontSize: '1.15rem', lineHeight: '1.8' }}>
                Đăng ký hội viên AutoWash để nhận cơ chế tích lũy điểm thưởng tự động mỗi lần rửa xe. Sử dụng điểm tích lũy để quy đổi thành các voucher giảm giá hóa đơn hoặc các lượt rửa xe hoàn toàn miễn phí.
              </p>
              
              {!isAuthenticated && (
                <Button 
                  as={Link} 
                  to="/register" 
                  className="btn-primary px-4 py-3" 
                  style={{ backgroundColor: '#0A6EBD', borderColor: '#0A6EBD', fontWeight: 750, fontSize: '1.05rem', borderRadius: '10px', boxShadow: '0 5px 15px rgba(10, 110, 189, 0.15)' }}
                >
                  Đăng ký hội viên ngay (+50đ chào mừng)
                </Button>
              )}
            </Col>

            {/* Infographic Steps/Rules */}
            <Col lg={7}>
              <Row className="g-4">
                <Col xs={12} sm={6}>
                  <Card className="autowash-card border-0 h-100 p-4" style={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                    <div className="d-flex align-items-center gap-3 mb-3">
                      <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center font-weight-bold" style={{ width: '36px', height: '36px', fontSize: '1.05rem' }}>1</div>
                      <h5 className="font-weight-bold m-0 text-dark" style={{ fontSize: '1.2rem' }}>Rửa xe & Tích lũy</h5>
                    </div>
                    <p className="text-secondary m-0" style={{ fontSize: '1rem', lineHeight: '1.6' }}>
                      Cứ mỗi <strong>10.000 ₫</strong> chi tiêu cho các gói dịch vụ &rarr; tích lũy ngay <strong>1 điểm thưởng</strong>. (Tương đương tỷ lệ hoàn tiền <strong>10%</strong>).
                    </p>
                  </Card>
                </Col>

                <Col xs={12} sm={6}>
                  <Card className="autowash-card border-0 h-100 p-4" style={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                    <div className="d-flex align-items-center gap-3 mb-3">
                      <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center font-weight-bold" style={{ width: '36px', height: '36px', fontSize: '1.05rem' }}>2</div>
                      <h5 className="font-weight-bold m-0 text-dark" style={{ fontSize: '1.2rem' }}>Hạng Thành Viên</h5>
                    </div>
                    <p className="text-secondary m-0" style={{ fontSize: '1rem', lineHeight: '1.6' }}>
                      Hạng Bạc (100đ): Giảm <strong>5%</strong> hóa đơn.<br />
                      Hạng Vàng (300đ): Giảm <strong>10%</strong> hóa đơn.<br />
                      Mở khóa các voucher chăm sóc xe VIP.
                    </p>
                  </Card>
                </Col>

                <Col xs={12} sm={6}>
                  <Card className="autowash-card border-0 h-100 p-4" style={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                    <div className="d-flex align-items-center gap-3 mb-3">
                      <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center font-weight-bold" style={{ width: '36px', height: '36px', fontSize: '1.05rem' }}>3</div>
                      <h5 className="font-weight-bold m-0 text-dark" style={{ fontSize: '1.2rem' }}>Đổi mã giảm giá</h5>
                    </div>
                    <p className="text-secondary m-0" style={{ fontSize: '1rem', lineHeight: '1.6' }}>
                      Quy đổi điểm thưởng bất cứ lúc nào:<br />
                      <strong>50 điểm</strong> = Voucher giảm <strong>50.000 ₫</strong>.<br />
                      <strong>100 điểm</strong> = Voucher giảm <strong>100.000 ₫</strong>.
                    </p>
                  </Card>
                </Col>

                <Col xs={12} sm={6}>
                  <Card className="autowash-card border-0 h-100 p-4" style={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                    <div className="d-flex align-items-center gap-3 mb-3">
                      <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center font-weight-bold" style={{ width: '36px', height: '36px', fontSize: '1.05rem' }}>4</div>
                      <h5 className="font-weight-bold m-0 text-dark" style={{ fontSize: '1.2rem' }}>Lượt rửa xe miễn phí</h5>
                    </div>
                    <p className="text-secondary m-0" style={{ fontSize: '1rem', lineHeight: '1.6' }}>
                      Đổi <strong>100 điểm</strong> lấy 1 lượt rửa vỏ <em>Standard</em> miễn phí, hoặc <strong>180 điểm</strong> lấy 1 lượt rửa toàn diện <em>Premium</em> miễn phí.
                    </p>
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </section>

      {/* 5. Contact / Footer Section */}
      <footer id="contact" className="py-5 bg-dark text-white">
        <Container className="py-5">
          <Row className="g-4 mb-4">
            <Col xs={12} lg={4}>
              <div className="d-flex align-items-center mb-3">
                <FiActivity className="text-primary me-2.5 fs-3" />
                <h4 className="logo-text text-white m-0" style={{ fontWeight: 800, fontSize: '1.6rem' }}>
                  Auto<span className="text-primary">Wash</span>
                </h4>
              </div>
              <p className="text-white-50" style={{ fontSize: '0.95rem', lineHeight: '1.7' }}>
                AutoWash là hệ thống trạm quản lý và cung cấp dịch vụ rửa xe tự động hàng đầu, ứng dụng công nghệ làm sạch và sấy khô xe siêu tốc bảo vệ lớp sơn bóng nguyên bản của xe.
              </p>
            </Col>

            <Col xs={12} sm={6} lg={4}>
              <h5 className="font-weight-bold mb-3.5 text-white" style={{ letterSpacing: '0.5px' }}>THÔNG TIN LIÊN HỆ</h5>
              <ul className="list-unstyled text-white-50 d-flex flex-column gap-3" style={{ fontSize: '0.95rem' }}>
                <li className="d-flex align-items-center gap-2">
                  <FiMapPin className="text-primary fs-5 flex-shrink-0" /> <span>Trụ sở chính: 123 Đường Cầu Giấy, Hà Nội</span>
                </li>
                <li className="d-flex align-items-center gap-2">
                  <FiPhone className="text-primary fs-5 flex-shrink-0" /> <span>Hotline dịch vụ: 1900 8888</span>
                </li>
                <li className="d-flex align-items-center gap-2">
                  <FiClock className="text-primary fs-5 flex-shrink-0" /> <span>Giờ làm việc: 7:00 AM - 10:00 PM (Mỗi ngày)</span>
                </li>
              </ul>
            </Col>

            <Col xs={12} sm={6} lg={4}>
              <h5 className="font-weight-bold mb-3.5 text-white" style={{ letterSpacing: '0.5px' }}>DỊCH VỤ CỦA CHÚNG TÔI</h5>
              <ul className="list-unstyled text-white-50 d-flex flex-column gap-2.5" style={{ fontSize: '0.95rem' }}>
                <li>Rửa xe nhanh tự động vòi áp lực cao</li>
                <li>Hút bụi chuyên sâu khoang cabin nội thất</li>
                <li>Vệ sinh máy hơi nước nóng cao cấp</li>
                <li>Đánh bóng sơn & phủ Wax dưỡng Ceramic</li>
              </ul>
            </Col>
          </Row>

          <hr style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '2rem 0' }} />

          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center text-white-50 mt-3" style={{ fontSize: '0.9rem' }}>
            <p className="mb-0">© {new Date().getFullYear()} AutoWash Center. Tất cả các quyền được bảo lưu.</p>
            <p className="mb-0 mt-2 mt-sm-0">Thiết kế bởi Antigravity AI</p>
          </div>
        </Container>
      </footer>

      {/* Embedded float keyframe animation for Hero section */}
      <style>{`
        @keyframes floatAnimation {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
          100% { transform: translateY(0px); }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
