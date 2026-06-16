import React, { useContext, useState } from 'react';
import { Row, Col, Table, Button, Form, Modal, Card, Badge, InputGroup } from 'react-bootstrap';
import { FiPlus, FiSearch, FiEdit, FiTrash2, FiUser, FiMail, FiPhone, FiTruck, FiStar, FiCalendar } from 'react-icons/fi';
import { DataContext } from '../context/DataContext';
import StatusBadge from '../components/StatusBadge';

const Customers = () => {
  const { customers, bookings, addCustomer, updateCustomer, deleteCustomer } = useContext(DataContext);

  // States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState(customers[0]?.id || '');
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  // Form States
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [carType, setCarType] = useState('Sedan');
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);
  const [status, setStatus] = useState('Active');

  // Helpers
  const formatVND = (num) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm) ||
    c.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedCustomer = customers.find(c => c.id === selectedCustomerId) || filteredCustomers[0] || null;

  // Selected customer bookings history
  const customerBookings = selectedCustomer 
    ? bookings.filter(b => b.customerId === selectedCustomer.id || b.phone === selectedCustomer.phone)
    : [];

  const handleOpenCreateModal = () => {
    setEditingCustomer(null);
    setName('');
    setPhone('');
    setEmail('');
    setLicensePlate('');
    setCarType('Sedan');
    setLoyaltyPoints(0);
    setStatus('Active');
    setShowModal(true);
  };

  const handleOpenEditModal = (c) => {
    setEditingCustomer(c);
    setName(c.name);
    setPhone(c.phone);
    setEmail(c.email || '');
    setLicensePlate(c.licensePlate);
    setCarType(c.carType || 'Sedan');
    setLoyaltyPoints(c.loyaltyPoints || 0);
    setStatus(c.status || 'Active');
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const customerPayload = {
      name,
      phone,
      email,
      licensePlate,
      carType,
      loyaltyPoints: Number(loyaltyPoints),
      status
    };

    if (editingCustomer) {
      updateCustomer(editingCustomer.id, customerPayload);
    } else {
      const added = addCustomer(customerPayload);
      setSelectedCustomerId(added.id);
    }
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa khách hàng này khỏi hệ thống không? Hành động này sẽ không xóa lịch sử đặt lịch hiện tại.")) {
      deleteCustomer(id);
      if (selectedCustomerId === id) {
        setSelectedCustomerId(customers.find(c => c.id !== id)?.id || '');
      }
    }
  };

  return (
    <div className="fade-in-section">
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3 mb-4">
        <div>
          <h5 className="font-weight-bold mb-1 text-secondary">Hồ sơ khách hàng</h5>
          <small className="text-muted">Quản lý cơ sở dữ liệu hội viên và điểm thưởng tích lũy</small>
        </div>
        <Button onClick={handleOpenCreateModal} className="btn-primary d-flex align-items-center gap-2">
          <FiPlus /> Thêm hội viên mới
        </Button>
      </div>

      <Row className="g-4">
        {/* Left Side: Customers list */}
        <Col xs={12} lg={7}>
          <div className="autowash-card h-100">
            <InputGroup className="mb-3">
              <InputGroup.Text className="bg-transparent border-end-0 text-muted">
                <FiSearch />
              </InputGroup.Text>
              <Form.Control 
                type="text" 
                placeholder="Tìm tên, SĐT, biển số hoặc email..." 
                className="border-start-0"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>

            <div className="table-responsive" style={{ maxHeight: '550px', overflowY: 'auto' }}>
              <Table className="custom-table" hover style={{ cursor: 'pointer' }}>
                <thead>
                  <tr>
                    <th>Khách hàng</th>
                    <th>Biển số xe</th>
                    <th>Điểm tích</th>
                    <th className="text-end">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.length > 0 ? (
                    filteredCustomers.map((c) => (
                      <tr 
                        key={c.id} 
                        onClick={() => setSelectedCustomerId(c.id)}
                        style={{ 
                          backgroundColor: selectedCustomer?.id === c.id ? 'var(--bg-tertiary)' : 'transparent',
                          fontWeight: selectedCustomer?.id === c.id ? '500' : 'normal'
                        }}
                      >
                        <td>
                          <div>
                            <strong>{c.name}</strong>
                            <div className="text-muted" style={{ fontSize: '0.8rem' }}>{c.phone}</div>
                          </div>
                        </td>
                        <td>
                          <span className="badge bg-secondary-subtle text-secondary-emphasis">{c.licensePlate}</span>
                        </td>
                        <td>
                          <div className="d-flex align-items-center gap-1 text-warning">
                            <FiStar style={{ fill: 'currentColor' }} />
                            <span>{c.loyaltyPoints}</span>
                          </div>
                        </td>
                        <td className="text-end" onClick={(e) => e.stopPropagation()}>
                          <div className="d-flex justify-content-end gap-1">
                            <Button 
                              size="sm" 
                              variant="link" 
                              className="p-1 text-secondary"
                              onClick={() => handleOpenEditModal(c)}
                            >
                              <FiEdit />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="link" 
                              className="p-1 text-danger"
                              onClick={() => handleDelete(c.id)}
                            >
                              <FiTrash2 />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center py-4 text-muted">
                        Không tìm thấy khách hàng nào
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </div>
        </Col>

        {/* Right Side: Customer Detailed Panel & History */}
        <Col xs={12} lg={5}>
          {selectedCustomer ? (
            <div className="d-flex flex-column gap-4">
              {/* Profile Card */}
              <Card className="autowash-card border-0">
                <Card.Body className="p-0">
                  <div className="d-flex align-items-center gap-3 mb-3 pb-3" style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <div 
                      className="bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center"
                      style={{ width: '60px', height: '60px', fontSize: '1.5rem' }}
                    >
                      <FiUser />
                    </div>
                    <div>
                      <h5 className="mb-0 font-weight-bold">{selectedCustomer.name}</h5>
                      <span className={`badge ${selectedCustomer.status === 'Active' ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`} style={{ fontSize: '0.75rem' }}>
                        {selectedCustomer.status === 'Active' ? 'Đang hoạt động' : 'Tạm khóa'}
                      </span>
                    </div>
                  </div>

                  <div className="d-flex flex-column gap-2.5 mb-3" style={{ fontSize: '0.9rem' }}>
                    <div className="d-flex align-items-center text-secondary">
                      <FiPhone className="me-2 text-muted" />
                      <span>SĐT: <strong>{selectedCustomer.phone}</strong></span>
                    </div>
                    {selectedCustomer.email && (
                      <div className="d-flex align-items-center text-secondary">
                        <FiMail className="me-2 text-muted" />
                        <span>Email: {selectedCustomer.email}</span>
                      </div>
                    )}
                    <div className="d-flex align-items-center text-secondary">
                      <FiTruck className="me-2 text-muted" />
                      <span>Xe: <strong>{selectedCustomer.licensePlate}</strong> ({selectedCustomer.carType})</span>
                    </div>
                  </div>

                  <div className="bg-light p-3 rounded d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center gap-2">
                      <FiStar className="text-warning fs-4" style={{ fill: 'currentColor' }} />
                      <div>
                        <p className="mb-0 text-muted" style={{ fontSize: '0.75rem' }}>Điểm tích lũy hội viên</p>
                        <h5 className="mb-0 font-weight-bold text-warning-emphasis">{selectedCustomer.loyaltyPoints} điểm</h5>
                      </div>
                    </div>
                    <Badge bg="warning" className="text-dark py-1.5 px-2.5">Hạng Bạc</Badge>
                  </div>
                </Card.Body>
              </Card>

              {/* Bookings History */}
              <div className="autowash-card">
                <h6 className="font-weight-bold mb-3 text-secondary d-flex align-items-center gap-1">
                  <FiCalendar /> Lịch sử đặt lịch ({customerBookings.length})
                </h6>
                <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
                  {customerBookings.length > 0 ? (
                    customerBookings.map((b) => (
                      <div 
                        key={b.id} 
                        className="p-3 mb-2 rounded border d-flex justify-content-between align-items-start"
                        style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
                      >
                        <div>
                          <strong style={{ fontSize: '0.875rem' }}>{b.serviceName}</strong>
                          <p className="mb-1 text-primary font-weight-bold" style={{ fontSize: '0.8rem' }}>{formatVND(b.price)}</p>
                          <small className="text-muted d-block" style={{ fontSize: '0.75rem' }}>
                            Hẹn: {new Date(b.dateTime).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })}
                          </small>
                        </div>
                        <div className="d-flex flex-column align-items-end gap-1">
                          <StatusBadge status={b.status} />
                          <StatusBadge status={b.paymentStatus} />
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center py-3 text-muted" style={{ fontSize: '0.85rem' }}>
                      Khách hàng này chưa có lịch hẹn nào.
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="autowash-card text-center py-5 text-muted">
              Vui lòng chọn một khách hàng để xem chi tiết thông tin
            </div>
          )}
        </Col>
      </Row>

      {/* Customer Form Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontWeight: 600 }}>
            {editingCustomer ? 'Sửa thông tin khách hàng' : 'Đăng ký khách hàng mới'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body className="px-4 py-3">
            <Form.Group className="mb-3">
              <Form.Label>Họ tên khách hàng <span className="text-danger">*</span></Form.Label>
              <Form.Control 
                type="text" 
                required 
                placeholder="Ví dụ: Nguyễn Văn An"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>

            <Row className="g-3 mb-3">
              <Col xs={12} sm={6}>
                <Form.Group>
                  <Form.Label>Số điện thoại <span className="text-danger">*</span></Form.Label>
                  <Form.Control 
                    type="text" 
                    required 
                    placeholder="SĐT liên hệ"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} sm={6}>
                <Form.Group>
                  <Form.Label>Email</Form.Label>
                  <Form.Control 
                    type="email" 
                    placeholder="Địa chỉ Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="g-3 mb-3">
              <Col xs={12} sm={6}>
                <Form.Group>
                  <Form.Label>Biển số xe <span className="text-danger">*</span></Form.Label>
                  <Form.Control 
                    type="text" 
                    required 
                    placeholder="Ví dụ: 30A-123.45"
                    value={licensePlate}
                    onChange={(e) => setLicensePlate(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} sm={6}>
                <Form.Group>
                  <Form.Label>Loại phương tiện</Form.Label>
                  <Form.Select value={carType} onChange={(e) => setCarType(e.target.value)}>
                    <option value="Sedan">Sedan</option>
                    <option value="SUV">SUV</option>
                    <option value="Crossover">Crossover</option>
                    <option value="Truck">Bán tải (Truck)</option>
                    <option value="MPV">MPV / Hatchback</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            {editingCustomer && (
              <Row className="g-3 mb-3">
                <Col xs={12} sm={6}>
                  <Form.Group>
                    <Form.Label>Điểm tích lũy</Form.Label>
                    <Form.Control 
                      type="number" 
                      min={0}
                      value={loyaltyPoints}
                      onChange={(e) => setLoyaltyPoints(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} sm={6}>
                  <Form.Group>
                    <Form.Label>Trạng thái</Form.Label>
                    <Form.Select value={status} onChange={(e) => setStatus(e.target.value)}>
                      <option value="Active">Đang hoạt động</option>
                      <option value="Suspended">Đã tạm khóa</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={() => setShowModal(false)}>
              Đóng
            </Button>
            <Button type="submit" className="btn-primary">
              Lưu thông tin
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default Customers;
