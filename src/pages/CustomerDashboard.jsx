import React, { useContext, useState } from 'react';
import { Container, Row, Col, Card, Table, Button, Modal, Form, ProgressBar, Badge, Navbar } from 'react-bootstrap';
import { FiStar, FiCalendar, FiLogOut, FiPlus, FiClock, FiActivity, FiUser, FiTruck, FiCheckCircle, FiHome } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { DataContext } from '../context/DataContext';
import { AuthContext } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';

const CustomerDashboard = () => {
  const { bookings, addBooking, services } = useContext(DataContext);
  const { user, logout } = useContext(AuthContext);

  // States
  const [showModal, setShowModal] = useState(false);
  const [isBookingSuccess, setIsBookingSuccess] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState(services[0]?.id || '');
  const [dateTime, setDateTime] = useState('');
  const [notes, setNotes] = useState('');

  // Helpers
  const formatVND = (num) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);

  // Fetch customer stats
  const customerName = user?.fullName || 'Khách hàng';
  const customerEmail = user?.email || '';
  
  // Find customer plate & points from mock database
  const myBookings = bookings.filter(b => b.email === customerEmail || b.customerName === customerName);
  const licensePlate = myBookings[0]?.licensePlate || '30A-999.99';
  const carType = myBookings[0]?.carType || 'Sedan';
  const loyaltyPoints = myBookings.length * 20; // 20 points per completed/booked wash

  const handleOpenModal = () => {
    setSelectedServiceId(services[0]?.id || '');
    
    const now = new Date();
    now.setHours(now.getHours() + 2); // default to 2 hours from now
    now.setMinutes(0);
    const tzOffset = now.getTimezoneOffset() * 60000;
    const localISODateTime = (new Date(now - tzOffset)).toISOString().slice(0, 16);
    setDateTime(localISODateTime);
    setNotes('');
    setIsBookingSuccess(false);
    setShowModal(true);
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    const selectedService = services.find(s => s.id === selectedServiceId);
    if (!selectedService) return;

    addBooking({
      customerId: user?.userId || 'C_TEMP',
      customerName: customerName,
      phone: '0988776655', // default temp phone
      licensePlate,
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      dateTime: new Date(dateTime).toISOString(),
      duration: selectedService.duration,
      price: selectedService.price,
      paymentStatus: 'Unpaid',
      status: 'Scheduled',
      notes
    });

    setIsBookingSuccess(true);
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh', fontFamily: 'var(--font-family)' }}>
      
      {/* Top Header Navbar for Customer */}
      <Navbar bg="white" className="py-3 px-4 border-bottom shadow-sm mb-4 sticky-top">
        <Container fluid className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <Link to="/" className="d-flex align-items-center text-decoration-none">
              <FiActivity className="text-primary me-2.5 fs-3" />
              <h4 className="logo-text text-dark m-0" style={{ fontWeight: 800, fontSize: '1.4rem' }}>
                Auto<span className="text-primary">Wash</span>
              </h4>
            </Link>
            <span className="badge bg-primary-subtle text-primary ms-3 px-2.5 py-1.5" style={{ fontSize: '0.75rem', fontWeight: 600 }}>Cổng Hội Viên</span>
          </div>

          <div className="d-flex align-items-center gap-3">
            {/* Back to Home Button */}
            <Button 
              as={Link} 
              to="/" 
              variant="outline-primary" 
              size="md" 
              className="d-flex align-items-center gap-1.5" 
              style={{ borderColor: '#0A6EBD', color: '#0A6EBD', fontWeight: 600, borderRadius: '8px', padding: '0.5rem 1.1rem' }}
            >
              <FiHome /> Về Trang Chủ
            </Button>
            
            <div className="text-end d-none d-md-block border-start ps-3 me-2">
              <p className="mb-0 font-weight-bold" style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>{customerName}</p>
              <p className="mb-0 text-muted" style={{ fontSize: '0.8rem', fontWeight: 500 }}>Hạng Bạc (Silver)</p>
            </div>
            
            <Button variant="outline-danger" size="md" onClick={logout} className="d-flex align-items-center gap-1.5" style={{ borderRadius: '8px', padding: '0.5rem 1.1rem', fontWeight: 600 }}>
              <FiLogOut /> Đăng xuất
            </Button>
          </div>
        </Container>
      </Navbar>

      <Container className="pb-5">
        <Row className="g-4">
          {/* Welcome Card & Membership Loyalty */}
          <Col xs={12} lg={4}>
            <div className="d-flex flex-column gap-4">
              {/* Virtual Membership Card */}
              <Card className="autowash-card border-0 text-white gradient-card-blue p-4 shadow position-relative overflow-hidden" style={{ borderRadius: '20px' }}>
                <div className="position-absolute opacity-10 end-0 bottom-0" style={{ transform: 'translate(20px, 20px)' }}>
                  <FiStar style={{ fontSize: '13rem' }} />
                </div>
                <div className="d-flex justify-content-between align-items-start mb-4" style={{ zIndex: 2 }}>
                  <div>
                    <span className="text-white-50 d-block mb-1" style={{ fontSize: '0.85rem', letterSpacing: '0.5px' }}>THẺ HỘI VIÊN AUTOWASH</span>
                    <strong style={{ fontSize: '1.4rem', fontWeight: 700 }}>{customerName}</strong>
                  </div>
                  <Badge bg="warning" className="text-dark py-2 px-3 fs-8 rounded" style={{ fontWeight: 700 }}>SILVER MEMBER</Badge>
                </div>
                <div className="mt-4 pt-3 mb-2" style={{ zIndex: 2 }}>
                  <div className="d-flex justify-content-between align-items-end mb-2">
                    <span className="text-white-50" style={{ fontSize: '0.85rem' }}>Tích lũy điểm thưởng:</span>
                    <strong style={{ fontSize: '1.4rem', fontWeight: 800 }}>{loyaltyPoints} điểm</strong>
                  </div>
                  <ProgressBar variant="warning" now={loyaltyPoints % 100} max={100} style={{ height: '7px' }} className="shadow-sm" />
                  <small className="text-white-50 d-block mt-2" style={{ fontSize: '0.8rem' }}>Còn {100 - (loyaltyPoints % 100)} điểm để thăng hạng Vàng</small>
                </div>
              </Card>

              {/* Registered Car Profile */}
              <Card className="autowash-card border-0 shadow-sm" style={{ borderRadius: '16px' }}>
                <Card.Body className="p-4">
                  <h5 className="font-weight-bold text-dark mb-3.5" style={{ fontSize: '1.1rem' }}>Phương tiện đã đăng ký</h5>
                  <div className="d-flex align-items-center gap-3 p-3 bg-light rounded-3" style={{ border: '1px solid rgba(0,0,0,0.04)' }}>
                    <div className="bg-primary-subtle text-primary rounded-circle p-3 fs-3 d-flex align-items-center justify-content-center">
                      <FiTruck />
                    </div>
                    <div>
                      <span className="badge bg-primary text-white fs-6 font-weight-bold mb-1.5" style={{ padding: '0.4rem 0.8rem', borderRadius: '6px', letterSpacing: '0.5px' }}>{licensePlate}</span>
                      <small className="text-secondary d-block font-weight-medium" style={{ fontSize: '0.9rem' }}>{carType} (5 chỗ)</small>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </div>
          </Col>

          {/* Booking History & Quick Booking Trigger */}
          <Col xs={12} lg={8}>
            <div className="autowash-card border-0 mb-4 shadow-sm" style={{ borderRadius: '20px', padding: '2rem' }}>
              <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3 mb-4">
                <div>
                  <h4 className="font-weight-bold m-0 text-dark" style={{ fontSize: '1.4rem' }}>Lịch sử rửa xe của bạn</h4>
                  <p className="text-muted m-0 mt-1" style={{ fontSize: '0.9rem' }}>Theo dõi trạng thái và nhật ký đặt lịch rửa xe tự động</p>
                </div>
                <Button onClick={handleOpenModal} className="btn-primary d-flex align-items-center gap-1.5 px-4 py-2.5" style={{ borderRadius: '10px', fontWeight: 600 }}>
                  <FiPlus className="fs-5" /> Đặt lịch rửa xe ngay
                </Button>
              </div>

              <div className="table-responsive">
                <Table className="custom-table" hover style={{ verticalAlign: 'middle' }}>
                  <thead>
                    <tr>
                      <th style={{ fontSize: '0.95rem' }}>Dịch vụ đã chọn</th>
                      <th style={{ fontSize: '0.95rem' }}>Thời gian đặt</th>
                      <th style={{ fontSize: '0.95rem' }}>Thanh toán</th>
                      <th style={{ fontSize: '0.95rem' }}>Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myBookings.length > 0 ? (
                      myBookings.map((b) => (
                        <tr key={b.id}>
                          <td>
                            <div className="py-1">
                              <span className="font-weight-bold text-dark d-block mb-1" style={{ fontSize: '1rem' }}>{b.serviceName}</span>
                              <span className="text-primary font-weight-bold" style={{ fontSize: '0.9rem' }}>{formatVND(b.price)}</span>
                            </div>
                          </td>
                          <td>
                            <span className="text-secondary" style={{ fontSize: '0.95rem', fontWeight: 500 }}>
                              {new Date(b.dateTime).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })}
                            </span>
                          </td>
                          <td>
                            <StatusBadge status={b.paymentStatus} />
                          </td>
                          <td>
                            <StatusBadge status={b.status} />
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center py-5 text-secondary" style={{ fontSize: '1rem' }}>
                          Bạn chưa thực hiện lịch hẹn nào. Hãy đặt lịch ngay để nhận nhiều điểm thưởng!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Modern Customer Booking Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        {!isBookingSuccess ? (
          <>
            <Modal.Header closeButton className="px-4 pt-4 border-0">
              <Modal.Title style={{ fontWeight: 700, fontSize: '1.4rem' }}>Đặt lịch rửa xe</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleBookingSubmit}>
              <Modal.Body className="px-4 pb-4">
                <Form.Group className="mb-3.5">
                  <Form.Label className="font-weight-semibold text-secondary mb-1.5" style={{ fontSize: '0.9rem' }}>Chọn dịch vụ mong muốn</Form.Label>
                  <Form.Select 
                    value={selectedServiceId} 
                    onChange={(e) => setSelectedServiceId(e.target.value)}
                    required
                    style={{ padding: '0.7rem 1rem' }}
                  >
                    {services.filter(s => s.isActive).map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name} - {formatVND(s.price)}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3.5">
                  <Form.Label className="font-weight-semibold text-secondary mb-1.5" style={{ fontSize: '0.9rem' }}>Thời gian hẹn rửa xe</Form.Label>
                  <Form.Control 
                    type="datetime-local" 
                    required 
                    value={dateTime} 
                    onChange={(e) => setDateTime(e.target.value)} 
                    style={{ padding: '0.7rem 1rem' }}
                  />
                </Form.Group>

                <Form.Group className="mb-2">
                  <Form.Label className="font-weight-semibold text-secondary mb-1.5" style={{ fontSize: '0.9rem' }}>Ghi chú yêu cầu riêng (nếu có)</Form.Label>
                  <Form.Control 
                    as="textarea" 
                    rows={3} 
                    placeholder="Ví dụ: Rửa kỹ gầm xe, hút bụi khoang hành lý..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)} 
                    style={{ padding: '0.7rem 1rem' }}
                  />
                </Form.Group>
              </Modal.Body>
              <Modal.Footer className="px-4 pb-4 border-0 pt-0">
                <Button variant="outline-secondary" onClick={() => setShowModal(false)} style={{ borderRadius: '8px', padding: '0.6rem 1.2rem', fontWeight: 600 }}>
                  Đóng
                </Button>
                <Button type="submit" className="btn-primary" style={{ borderRadius: '8px', padding: '0.6rem 1.5rem', fontWeight: 600 }}>
                  Xác nhận Đặt lịch
                </Button>
              </Modal.Footer>
            </Form>
          </>
        ) : (
          <>
            <Modal.Body className="text-center p-5">
              <div 
                className="bg-success-subtle text-success rounded-circle d-flex align-items-center justify-content-center mb-4 mx-auto"
                style={{ width: '80px', height: '80px', fontSize: '3rem', backgroundColor: 'rgba(56, 161, 105, 0.1)' }}
              >
                <FiCheckCircle style={{ color: '#38A169' }} />
              </div>
              <h4 className="font-weight-bold text-dark mb-3" style={{ fontSize: '1.4rem' }}>Đặt lịch thành công!</h4>
              <p className="text-secondary mb-4.5" style={{ fontSize: '1rem', lineHeight: '1.6' }}>
                Lịch rửa xe của bạn đã được tiếp nhận. Nhân viên trạm rửa sẽ liên hệ xác nhận trong giây lát.
              </p>
              <Button 
                onClick={() => setShowModal(false)} 
                className="btn-primary px-4 py-2.5"
                style={{ backgroundColor: '#0A6EBD', borderColor: '#0A6EBD', fontWeight: 700, borderRadius: '8px' }}
              >
                Hoàn thành
              </Button>
            </Modal.Body>
          </>
        )}
      </Modal>
    </div>
  );
};

export default CustomerDashboard;
