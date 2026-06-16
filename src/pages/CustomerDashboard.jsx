import React, { useContext, useState } from 'react';
import { Container, Row, Col, Card, Table, Button, Modal, Form, ProgressBar, Badge } from 'react-bootstrap';
import { FiStar, FiCalendar, FiLogOut, FiPlus, FiClock, FiActivity, FiUser, FiTruck } from 'react-icons/fi';
import { DataContext } from '../context/DataContext';
import { AuthContext } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';

const CustomerDashboard = () => {
  const { bookings, addBooking, services } = useContext(DataContext);
  const { user, logout } = useContext(AuthContext);

  // States
  const [showModal, setShowModal] = useState(false);
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

    setShowModal(false);
    alert('Đặt lịch thành công! Nhân viên trạm rửa sẽ liên hệ xác nhận.');
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh' }}>
      {/* Top Header Navbar for Customer */}
      <Container className="py-3 px-4 d-flex justify-content-between align-items-center border-bottom bg-white shadow-sm mb-4" fluid>
        <div className="d-flex align-items-center">
          <FiActivity className="text-primary me-2 fs-3" />
          <h4 className="logo-text text-dark m-0 font-weight-bold">
            Auto<span className="text-primary">Wash</span>
          </h4>
          <span className="badge bg-secondary-subtle text-secondary ms-2 px-2 py-1" style={{ fontSize: '0.7rem' }}>Cổng Hội Viên</span>
        </div>
        <div className="d-flex align-items-center gap-3">
          <div className="text-end d-none d-sm-block">
            <p className="mb-0 font-weight-bold" style={{ fontSize: '0.9rem' }}>{customerName}</p>
            <p className="mb-0 text-muted" style={{ fontSize: '0.75rem' }}>Hạng Bạc</p>
          </div>
          <Button variant="outline-danger" size="sm" onClick={logout} className="d-flex align-items-center gap-1">
            <FiLogOut /> Đăng xuất
          </Button>
        </div>
      </Container>

      <Container className="pb-5">
        <Row className="g-4">
          {/* Welcome Card & Membership Loyalty */}
          <Col xs={12} lg={4}>
            <div className="d-flex flex-column gap-4">
              {/* Virtual Membership Card */}
              <Card className="autowash-card border-0 text-white gradient-card-blue p-4 shadow-lg position-relative overflow-hidden" style={{ borderRadius: '20px' }}>
                <div className="position-absolute opacity-10 end-0 bottom-0" style={{ transform: 'translate(20px, 20px)' }}>
                  <FiStar style={{ fontSize: '12rem' }} />
                </div>
                <div className="d-flex justify-content-between align-items-start mb-4">
                  <div>
                    <span className="text-white-50 d-block" style={{ fontSize: '0.8rem' }}>THẺ HỘI VIÊN AUTOWASH</span>
                    <strong className="fs-5">{customerName}</strong>
                  </div>
                  <Badge bg="warning" className="text-dark">SILVER MEMBER</Badge>
                </div>
                <div className="mt-4 pt-3 mb-2">
                  <div className="d-flex justify-content-between align-items-end mb-1">
                    <span className="text-white-50" style={{ fontSize: '0.75rem' }}>Tích lũy điểm thưởng:</span>
                    <strong className="fs-5">{loyaltyPoints} điểm</strong>
                  </div>
                  <ProgressBar variant="warning" now={loyaltyPoints % 100} max={100} style={{ height: '6px' }} />
                  <small className="text-white-50 d-block mt-1.5" style={{ fontSize: '0.7rem' }}>Còn {100 - (loyaltyPoints % 100)} điểm để thăng hạng Vàng</small>
                </div>
              </Card>

              {/* Registered Car Profile */}
              <Card className="autowash-card border-0">
                <Card.Body className="p-0">
                  <h6 className="font-weight-bold text-secondary mb-3">Phương tiện đã đăng ký</h6>
                  <div className="d-flex align-items-center gap-3 p-3 bg-light rounded">
                    <div className="bg-primary-subtle text-primary rounded-circle p-2.5 fs-4 d-flex align-items-center justify-content-center">
                      <FiTruck />
                    </div>
                    <div>
                      <span className="badge bg-secondary-subtle text-secondary-emphasis fs-6 font-weight-bold mb-1">{licensePlate}</span>
                      <small className="text-muted d-block">{carType} (5 chỗ)</small>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </div>
          </Col>

          {/* Booking History & Quick Booking Trigger */}
          <Col xs={12} lg={8}>
            <div className="autowash-card mb-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="font-weight-bold m-0 text-dark">Lịch sử rửa xe của bạn</h5>
                <Button onClick={handleOpenModal} className="btn-primary d-flex align-items-center gap-1.5">
                  <FiPlus /> Đặt lịch rửa xe ngay
                </Button>
              </div>

              <div className="table-responsive">
                <Table className="custom-table" hover>
                  <thead>
                    <tr>
                      <th>Dịch vụ đã chọn</th>
                      <th>Thời gian đặt</th>
                      <th>Thanh toán</th>
                      <th>Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myBookings.length > 0 ? (
                      myBookings.map((b) => (
                        <tr key={b.id}>
                          <td>
                            <div>
                              <strong>{b.serviceName}</strong>
                              <div className="text-primary font-weight-bold" style={{ fontSize: '0.85rem' }}>{formatVND(b.price)}</div>
                            </div>
                          </td>
                          <td>
                            <span style={{ fontSize: '0.85rem' }}>
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
                        <td colSpan="4" className="text-center py-5 text-muted">
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

      {/* Simplified Customer Booking Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontWeight: 600 }}>Đặt lịch rửa xe</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleBookingSubmit}>
          <Modal.Body className="px-4 py-3">
            <Form.Group className="mb-3">
              <Form.Label>Chọn dịch vụ mong muốn</Form.Label>
              <Form.Select 
                value={selectedServiceId} 
                onChange={(e) => setSelectedServiceId(e.target.value)}
                required
              >
                {services.filter(s => s.isActive).map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} - {formatVND(s.price)}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Thời gian hẹn rửa xe</Form.Label>
              <Form.Control 
                type="datetime-local" 
                required 
                value={dateTime} 
                onChange={(e) => setDateTime(e.target.value)} 
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Ghi chú yêu cầu riêng (nếu có)</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3} 
                placeholder="Ví dụ: Rửa kỹ gầm xe, hút bụi khoang hành lý..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)} 
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={() => setShowModal(false)}>
              Đóng
            </Button>
            <Button type="submit" className="btn-primary">
              Xác nhận Đặt lịch
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default CustomerDashboard;
