import React, { useContext } from 'react';
import { Container, Row, Col, Card, Button, Navbar, Nav, Badge } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FiCalendar, FiLogOut, FiActivity, FiStar, FiAward, FiCheck, FiArrowRight, FiPhone, FiMapPin, FiClock } from 'react-icons/fi';
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
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', scrollBehavior: 'smooth' }}>
      
      {/* 1. Header Navigation */}
      <Navbar bg="white" expand="lg" className="py-3 sticky-top border-bottom" style={{ zIndex: 1000 }}>
        <Container>
          <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
            <FiActivity className="text-primary me-2 fs-3" />
            <span className="logo-text text-dark m-0 font-weight-bold" style={{ fontSize: '1.5rem', fontWeight: 800 }}>
              Auto<span className="text-primary">Wash</span>
            </span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="autowash-nav" />
          <Navbar.Collapse id="autowash-nav">
            <Nav className="mx-auto gap-2 gap-lg-4 font-weight-bold" style={{ fontWeight: 500 }}>
              <Nav.Link href="#home">Trang chủ</Nav.Link>
              <Nav.Link href="#packages">Gói dịch vụ</Nav.Link>
              <Nav.Link href="#loyalty">Tích lũy điểm</Nav.Link>
              <Nav.Link href="#contact">Liên hệ</Nav.Link>
            </Nav>
            <div className="d-flex align-items-center gap-3 mt-3 mt-lg-0">
              {isAuthenticated ? (
                <>
                  <span className="text-muted d-none d-sm-inline">Xin chào, <strong>{user?.fullName}</strong>!</span>
                  <Button 
                    as={Link} 
                    to={user?.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard'} 
                    style={{ backgroundColor: '#0A6EBD', borderColor: '#0A6EBD' }}
                    className="btn-primary"
                  >
                    Vào Dashboard
                  </Button>
                  <Button variant="outline-danger" size="sm" onClick={logout} className="d-flex align-items-center gap-1">
                    <FiLogOut />
                  </Button>
                </>
              ) : (
                <>
                  <Button as={Link} to="/login" variant="outline-primary" style={{ borderColor: '#0A6EBD', color: '#0A6EBD' }}>
                    Đăng nhập
                  </Button>
                  <Button as={Link} to="/register" style={{ backgroundColor: '#0A6EBD', borderColor: '#0A6EBD' }} className="btn-primary">
                    Đăng ký
                  </Button>
                </>
              )}
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* 2. Hero Section */}
      <section id="home" className="py-5 bg-light position-relative overflow-hidden" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
        <Container>
          <Row className="align-items-center g-5">
            <Col lg={6}>
              <Badge bg="primary-subtle" className="text-primary px-3 py-2 mb-3 fs-7 rounded-pill">
                Hệ thống Rửa xe Tự động Công nghệ mới
              </Badge>
              <h1 className="display-4 font-weight-bold text-dark mb-3" style={{ fontWeight: 800, lineHeight: 1.2 }}>
                Rửa xe siêu tốc,<br />
                Sạch sâu trong <span className="text-primary">15 phút</span>
              </h1>
              <p className="lead text-secondary mb-4" style={{ fontSize: '1.1rem', lineHeight: '1.7' }}>
                AutoWash kết hợp công nghệ vòi xịt áp lực cao đa chiều cùng hệ thống chổi mềm chuẩn quốc tế. Rửa vỏ gầm sạch bong, sấy khô nhanh chóng mà không gây xước sơn xe.
              </p>
              <div className="d-flex flex-column flex-sm-row gap-3">
                <Button 
                  onClick={handleBookingCTA}
                  size="lg" 
                  className="btn-primary px-4 py-3 d-inline-flex align-items-center justify-content-center gap-2"
                  style={{ backgroundColor: '#0A6EBD', borderColor: '#0A6EBD', fontWeight: 600 }}
                >
                  <FiCalendar className="fs-5" /> Đặt lịch rửa xe ngay <FiArrowRight />
                </Button>
                <Button href="#packages" variant="outline-secondary" size="lg" className="px-4 py-3">
                  Xem bảng giá dịch vụ
                </Button>
              </div>
            </Col>
            
            {/* Visual Vector Illustration */}
            <Col lg={6} className="text-center">
              <div 
                className="position-relative mx-auto"
                style={{ 
                  maxWidth: '480px', 
                  filter: 'drop-shadow(0 20px 30px rgba(10, 110, 189, 0.15))',
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
        <Container className="py-4">
          <div className="text-center mb-5">
            <h2 className="font-weight-bold text-dark mb-2" style={{ fontWeight: 750 }}>Bảng giá Gói Dịch Vụ Rửa Xe</h2>
            <p className="text-muted mx-auto" style={{ maxWidth: '600px', fontSize: '0.95rem' }}>
              Hãy chọn gói rửa xe tối ưu nhất cho xế yêu của bạn. Tất cả các dịch vụ đều sử dụng hóa chất sinh học thân thiện với sơn xe.
            </p>
          </div>

          <Row className="g-4 justify-content-center">
            {/* Package 1 */}
            <Col xs={12} md={6} lg={4}>
              <Card className="autowash-card border-0 h-100 p-4 shadow-sm text-center d-flex flex-column justify-content-between">
                <Card.Body className="p-0">
                  <div className="mb-3">
                    <span className="badge bg-secondary-subtle text-secondary-emphasis px-3 py-1.5 rounded-pill font-weight-bold" style={{ fontSize: '0.75rem' }}>GÓI CƠ BẢN</span>
                  </div>
                  <h4 className="font-weight-bold text-dark mb-1">Standard Exterior</h4>
                  <p className="text-muted mb-4" style={{ fontSize: '0.85rem' }}>Dành cho xe bám bụi mỏng cần rửa nhanh vỏ ngoài</p>
                  
                  <div className="mb-4">
                    <h2 className="text-primary font-weight-bold mb-0">{formatVND(100000)}</h2>
                    <small className="text-muted"><FiClock /> Thực hiện trong 20 phút</small>
                  </div>

                  <hr style={{ borderColor: 'var(--border-color)' }} />

                  <ul className="list-unstyled text-start mb-4 d-flex flex-column gap-2.5" style={{ fontSize: '0.9rem', color: '#475569' }}>
                    <li className="d-flex align-items-center gap-2">
                      <FiCheck className="text-success" /> <span>Xịt rửa áp lực cao loại bỏ bùn đất</span>
                    </li>
                    <li className="d-flex align-items-center gap-2">
                      <FiCheck className="text-success" /> <span>Rửa vỏ ngoài bằng bọt tuyết chuyên dụng</span>
                    </li>
                    <li className="d-flex align-items-center gap-2">
                      <FiCheck className="text-success" /> <span>Xịt gầm làm sạch cát đá bám</span>
                    </li>
                    <li className="d-flex align-items-center gap-2">
                      <FiCheck className="text-success" /> <span>Lau khô vỏ và lau kính bên ngoài</span>
                    </li>
                    <li className="d-flex align-items-center gap-2">
                      <FiCheck className="text-success" /> <span>Làm sạch lốp xe cơ bản</span>
                    </li>
                  </ul>
                </Card.Body>
                
                <Button 
                  onClick={handleBookingCTA}
                  className="w-100 btn-outline-primary py-2.5" 
                  variant="outline-primary"
                  style={{ fontWeight: 600 }}
                >
                  Đặt lịch gói này
                </Button>
              </Card>
            </Col>

            {/* Package 2 */}
            <Col xs={12} md={6} lg={4}>
              <Card 
                className="autowash-card h-100 p-4 shadow text-center d-flex flex-column justify-content-between position-relative"
                style={{ borderTop: '5px solid #0A6EBD' }}
              >
                <div className="position-absolute top-0 start-50 translate-middle">
                  <Badge bg="warning" className="text-dark py-1.5 px-3 rounded-pill font-weight-bold">BÁN CHẠY NHẤT</Badge>
                </div>
                <Card.Body className="p-0">
                  <div className="mb-3">
                    <span className="badge bg-primary-subtle text-primary px-3 py-1.5 rounded-pill font-weight-bold" style={{ fontSize: '0.75rem' }}>GÓI TOÀN DIỆN</span>
                  </div>
                  <h4 className="font-weight-bold text-dark mb-1">Premium Wash</h4>
                  <p className="text-muted mb-4" style={{ fontSize: '0.85rem' }}>Vệ sinh hoàn hảo cả trong lẫn ngoài cabin xe</p>
                  
                  <div className="mb-4">
                    <h2 className="text-primary font-weight-bold mb-0">{formatVND(180000)}</h2>
                    <small className="text-muted"><FiClock /> Thực hiện trong 35 phút</small>
                  </div>

                  <hr style={{ borderColor: 'var(--border-color)' }} />

                  <ul className="list-unstyled text-start mb-4 d-flex flex-column gap-2.5" style={{ fontSize: '0.9rem', color: '#475569' }}>
                    <li className="d-flex align-items-center gap-2">
                      <FiCheck className="text-success" /> <span>Các bước của gói **Standard**</span>
                    </li>
                    <li className="d-flex align-items-center gap-2">
                      <FiCheck className="text-success" /> <span>Hút bụi thảm sàn, kẽ ghế sâu</span>
                    </li>
                    <li className="d-flex align-items-center gap-2">
                      <FiCheck className="text-success" /> <span>Lau dưỡng táp lô, táp li bằng dung dịch chuyên dụng</span>
                    </li>
                    <li className="d-flex align-items-center gap-2">
                      <FiCheck className="text-success" /> <span>Khử trùng, xông tinh dầu khử mùi khoang lái</span>
                    </li>
                    <li className="d-flex align-items-center gap-2">
                      <FiCheck className="text-success" /> <span>Quét wax dưỡng bóng lốp xe</span>
                    </li>
                  </ul>
                </Card.Body>
                
                <Button 
                  onClick={handleBookingCTA}
                  className="w-100 btn-primary py-2.5" 
                  style={{ backgroundColor: '#0A6EBD', borderColor: '#0A6EBD', fontWeight: 600 }}
                >
                  Đặt lịch gói này
                </Button>
              </Card>
            </Col>

            {/* Package 3 */}
            <Col xs={12} md={6} lg={4}>
              <Card className="autowash-card border-0 h-100 p-4 shadow-sm text-center d-flex flex-column justify-content-between">
                <Card.Body className="p-0">
                  <div className="mb-3">
                    <span className="badge bg-purple-subtle text-purple px-3 py-1.5 rounded-pill font-weight-bold" style={{ fontSize: '0.75rem', backgroundColor: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' }}>GÓI CHUYÊN SÂU</span>
                  </div>
                  <h4 className="font-weight-bold text-dark mb-1">Ultimate Detail & Wax</h4>
                  <p className="text-muted mb-4" style={{ fontSize: '0.85rem' }}>Bảo vệ sơn và làm sạch sâu từng chi tiết nhỏ</p>
                  
                  <div className="mb-4">
                    <h2 className="text-primary font-weight-bold mb-0">{formatVND(350000)}</h2>
                    <small className="text-muted"><FiClock /> Thực hiện trong 60 phút</small>
                  </div>

                  <hr style={{ borderColor: 'var(--border-color)' }} />

                  <ul className="list-unstyled text-start mb-4 d-flex flex-column gap-2.5" style={{ fontSize: '0.9rem', color: '#475569' }}>
                    <li className="d-flex align-items-center gap-2">
                      <FiCheck className="text-success" /> <span>Các bước của gói **Premium**</span>
                    </li>
                    <li className="d-flex align-items-center gap-2">
                      <FiCheck className="text-success" /> <span>Tẩy nhựa đường và bụi sắt cứng đầu trên vỏ sơn</span>
                    </li>
                    <li className="d-flex align-items-center gap-2">
                      <FiCheck className="text-success" /> <span>Vệ sinh chi tiết và dưỡng nhựa khoang động cơ</span>
                    </li>
                    <li className="d-flex align-items-center gap-2">
                      <FiCheck className="text-success" /> <span>Phủ Wax bóng ceramic bảo vệ tối đa bề mặt sơn</span>
                    </li>
                    <li className="d-flex align-items-center gap-2">
                      <FiCheck className="text-success" /> <span>Dưỡng da/nỉ ghế nội thất cao cấp</span>
                    </li>
                  </ul>
                </Card.Body>
                
                <Button 
                  onClick={handleBookingCTA}
                  className="w-100 btn-outline-primary py-2.5" 
                  variant="outline-primary"
                  style={{ fontWeight: 600 }}
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
        <Container className="py-4">
          <Row className="align-items-center g-5">
            <Col lg={5} className="text-center text-lg-start">
              <div 
                className="bg-primary-subtle text-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                style={{ width: '60px', height: '60px', fontSize: '1.75rem' }}
              >
                <FiStar style={{ fill: 'currentColor' }} />
              </div>
              <h2 className="font-weight-bold text-dark mb-3" style={{ fontWeight: 750 }}>
                Hệ thống tích điểm hội viên<br />
                nhận ưu đãi giảm giá cực khủng!
              </h2>
              <p className="text-secondary mb-4" style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>
                Đăng ký hội viên AutoWash để nhận cơ chế tích lũy điểm thưởng tự động mỗi lần rửa xe. Sử dụng điểm tích lũy để quy đổi thành các voucher giảm giá hóa đơn hoặc các lượt rửa xe hoàn toàn miễn phí.
              </p>
              
              {!isAuthenticated && (
                <Button 
                  as={Link} 
                  to="/register" 
                  className="btn-primary px-4 py-2.5" 
                  style={{ backgroundColor: '#0A6EBD', borderColor: '#0A6EBD', fontWeight: 600 }}
                >
                  Đăng ký hội viên ngay (+50đ chào mừng)
                </Button>
              )}
            </Col>

            {/* Infographic Steps/Rules */}
            <Col lg={7}>
              <Row className="g-4">
                <Col xs={12} sm={6}>
                  <Card className="autowash-card border-0 h-100 p-4">
                    <div className="d-flex align-items-center gap-2 mb-3">
                      <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center font-weight-bold" style={{ width: '28px', height: '28px', fontSize: '0.85rem' }}>1</div>
                      <h6 className="font-weight-bold m-0 text-dark">Rửa xe & Tích lũy</h6>
                    </div>
                    <p className="text-muted m-0" style={{ fontSize: '0.85rem', lineHeight: '1.5' }}>
                      Cứ mỗi **10.000 ₫** chi tiêu cho các gói dịch vụ $\rightarrow$ tích lũy ngay **1 điểm thưởng**. (Tương đương tỷ lệ hoàn tiền **10%**).
                    </p>
                  </Card>
                </Col>

                <Col xs={12} sm={6}>
                  <Card className="autowash-card border-0 h-100 p-4">
                    <div className="d-flex align-items-center gap-2 mb-3">
                      <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center font-weight-bold" style={{ width: '28px', height: '28px', fontSize: '0.85rem' }}>2</div>
                      <h6 className="font-weight-bold m-0 text-dark">Hạng Thành Viên</h6>
                    </div>
                    <p className="text-muted m-0" style={{ fontSize: '0.85rem', lineHeight: '1.5' }}>
                      Hạng Bạc (100đ): Giảm **5%** hóa đơn.<br />
                      Hạng Vàng (300đ): Giảm **10%** hóa đơn.<br />
                      Mở khóa các voucher chăm sóc xe VIP.
                    </p>
                  </Card>
                </Col>

                <Col xs={12} sm={6}>
                  <Card className="autowash-card border-0 h-100 p-4">
                    <div className="d-flex align-items-center gap-2 mb-3">
                      <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center font-weight-bold" style={{ width: '28px', height: '28px', fontSize: '0.85rem' }}>3</div>
                      <h6 className="font-weight-bold m-0 text-dark">Đổi mã giảm giá</h6>
                    </div>
                    <p className="text-muted m-0" style={{ fontSize: '0.85rem', lineHeight: '1.5' }}>
                      Quy đổi điểm thưởng bất cứ lúc nào:<br />
                      **50 điểm** = Voucher giảm **50.000 ₫**.<br />
                      **100 điểm** = Voucher giảm **100.000 ₫**.
                    </p>
                  </Card>
                </Col>

                <Col xs={12} sm={6}>
                  <Card className="autowash-card border-0 h-100 p-4">
                    <div className="d-flex align-items-center gap-2 mb-3">
                      <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center font-weight-bold" style={{ width: '28px', height: '28px', fontSize: '0.85rem' }}>4</div>
                      <h6 className="font-weight-bold m-0 text-dark">Lượt rửa xe miễn phí</h6>
                    </div>
                    <p className="text-muted m-0" style={{ fontSize: '0.85rem', lineHeight: '1.5' }}>
                      Đổi **100 điểm** lấy 1 lượt rửa vỏ *Standard* miễn phí, hoặc **180 điểm** lấy 1 lượt rửa toàn diện *Premium* miễn phí.
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
        <Container className="py-4">
          <Row className="g-4 mb-4">
            <Col xs={12} lg={4}>
              <div className="d-flex align-items-center mb-3">
                <FiActivity className="text-primary me-2 fs-3" />
                <h4 className="logo-text text-white m-0 font-weight-bold">
                  Auto<span className="text-primary">Wash</span>
                </h4>
              </div>
              <p className="text-white-50" style={{ fontSize: '0.85rem', lineHeight: '1.6' }}>
                AutoWash là hệ thống trạm quản lý và cung cấp dịch vụ rửa xe tự động hàng đầu, ứng dụng công nghệ làm sạch và sấy khô xe siêu tốc bảo vệ lớp sơn bóng nguyên bản của xe.
              </p>
            </Col>

            <Col xs={12} sm={6} lg={4}>
              <h6 className="font-weight-bold mb-3 text-white" style={{ letterSpacing: '0.5px' }}>THÔNG TIN LIÊN HỆ</h6>
              <ul className="list-unstyled text-white-50 d-flex flex-column gap-2.5" style={{ fontSize: '0.85rem' }}>
                <li className="d-flex align-items-center gap-2">
                  <FiMapPin className="text-primary" /> <span>Trụ sở chính: 123 Đường Cầu Giấy, Hà Nội</span>
                </li>
                <li className="d-flex align-items-center gap-2">
                  <FiPhone className="text-primary" /> <span>Hotline dịch vụ: 1900 8888</span>
                </li>
                <li className="d-flex align-items-center gap-2">
                  <FiClock className="text-primary" /> <span>Giờ làm việc: 7:00 AM - 10:00 PM (Mỗi ngày)</span>
                </li>
              </ul>
            </Col>

            <Col xs={12} sm={6} lg={4}>
              <h6 className="font-weight-bold mb-3 text-white" style={{ letterSpacing: '0.5px' }}>DỊCH VỤ CỦA CHÚNG TÔI</h6>
              <ul className="list-unstyled text-white-50 d-flex flex-column gap-2" style={{ fontSize: '0.85rem' }}>
                <li>Rửa xe nhanh tự động vòi áp lực cao</li>
                <li>Hút bụi chuyên sâu khoang cabin nội thất</li>
                <li>Vệ sinh máy hơi nước nóng cao cấp</li>
                <li>Đánh bóng sơn & phủ Wax dưỡng Ceramic</li>
              </ul>
            </Col>
          </Row>

          <hr style={{ borderColor: 'rgba(255,255,255,0.1)' }} />

          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center text-white-50 mt-3" style={{ fontSize: '0.8rem' }}>
            <p className="mb-0">© {new Date().getFullYear()} AutoWash Center. Tất cả các quyền được bảo lưu.</p>
            <p className="mb-0 mt-2 mt-sm-0">Thiết kế bởi Antigravity AI</p>
          </div>
        </Container>
      </footer>

      {/* Embedded float keyframe animation for Hero section */}
      <style>{`
        @keyframes floatAnimation {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
