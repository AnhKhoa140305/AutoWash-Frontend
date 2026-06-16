import React, { useContext, useState } from 'react';
import { Table, Button, Form, Modal, Row, Col, InputGroup } from 'react-bootstrap';
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiCalendar, FiClock } from 'react-icons/fi';
import { DataContext } from '../context/DataContext';
import StatusBadge from '../components/StatusBadge';

const Bookings = () => {
  const { 
    bookings, 
    customers, 
    services, 
    addBooking, 
    updateBooking, 
    deleteBooking, 
    addCustomer 
  } = useContext(DataContext);

  // States
  const [showModal, setShowModal] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  
  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [paymentFilter, setPaymentFilter] = useState('All');

  // Form States
  const [isNewCustomer, setIsNewCustomer] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  
  // Form Fields
  const [custName, setCustName] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custPlate, setCustPlate] = useState('');
  const [custCarType, setCustCarType] = useState('Sedan');
  
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('Unpaid');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [status, setStatus] = useState('Scheduled');
  const [notes, setNotes] = useState('');

  // 1. Calculations
  const formatVND = (num) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);

  // Filters calculation
  const filteredBookings = bookings.filter(b => {
    const matchesSearch = 
      b.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.phone.includes(searchTerm);

    const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
    const matchesPayment = paymentFilter === 'All' || b.paymentStatus === paymentFilter;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  // Modal Open Handlers
  const handleOpenCreateModal = () => {
    setEditingBooking(null);
    setIsNewCustomer(false);
    setSelectedCustomerId(customers[0]?.id || '');
    
    // Clear form
    setCustName('');
    setCustPhone('');
    setCustPlate('');
    setCustCarType('Sedan');
    
    setSelectedServiceId(services[0]?.id || '');
    
    // Default time is today at next hour
    const now = new Date();
    now.setHours(now.getHours() + 1);
    now.setMinutes(0);
    const tzOffset = now.getTimezoneOffset() * 60000;
    const localISODateTime = (new Date(now - tzOffset)).toISOString().slice(0, 16);
    setDateTime(localISODateTime);
    
    setPaymentStatus('Unpaid');
    setPaymentMethod('Cash');
    setStatus('Scheduled');
    setNotes('');
    
    setShowModal(true);
  };

  const handleOpenEditModal = (booking) => {
    setEditingBooking(booking);
    setIsNewCustomer(false);
    setSelectedCustomerId(booking.customerId);
    
    setSelectedServiceId(booking.serviceId);
    setDateTime(booking.dateTime.slice(0, 16));
    setPaymentStatus(booking.paymentStatus);
    setPaymentMethod(booking.paymentMethod || 'Cash');
    setStatus(booking.status);
    setNotes(booking.notes || '');
    
    setShowModal(true);
  };

  // Submit Handler
  const handleSubmit = (e) => {
    e.preventDefault();
    
    let finalCustomer = null;

    if (!editingBooking && isNewCustomer) {
      // Create new customer
      finalCustomer = addCustomer({
        name: custName,
        phone: custPhone,
        licensePlate: custPlate,
        carType: custCarType
      });
    } else {
      // Pick existing customer details
      finalCustomer = customers.find(c => c.id === selectedCustomerId);
    }

    if (!finalCustomer && !editingBooking) {
      alert("Vui lòng chọn hoặc điền thông tin khách hàng.");
      return;
    }

    const selectedService = services.find(s => s.id === selectedServiceId);
    if (!selectedService) {
      alert("Vui lòng chọn dịch vụ.");
      return;
    }

    const bookingPayload = {
      customerId: finalCustomer ? finalCustomer.id : editingBooking.customerId,
      customerName: finalCustomer ? finalCustomer.name : editingBooking.customerName,
      phone: finalCustomer ? finalCustomer.phone : editingBooking.phone,
      licensePlate: finalCustomer ? finalCustomer.licensePlate : editingBooking.licensePlate,
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      dateTime: new Date(dateTime).toISOString(),
      duration: selectedService.duration,
      price: selectedService.price,
      paymentStatus,
      paymentMethod,
      status,
      notes
    };

    if (editingBooking) {
      updateBooking(editingBooking.id, bookingPayload);
    } else {
      addBooking(bookingPayload);
    }

    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa lịch hẹn này không?")) {
      deleteBooking(id);
    }
  };

  const handleQuickStatusUpdate = (id, newStatus) => {
    const updateFields = { status: newStatus };
    if (newStatus === 'Completed') {
      updateFields.paymentStatus = 'Paid';
    }
    updateBooking(id, updateFields);
  };

  return (
    <div className="fade-in-section">
      {/* Top Banner Control */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3 mb-4">
        <div>
          <h5 className="font-weight-bold mb-1 text-secondary">Danh sách lịch hẹn rửa xe</h5>
          <small className="text-muted">Tổng số {filteredBookings.length} lịch hẹn được tìm thấy</small>
        </div>
        <Button onClick={handleOpenCreateModal} className="btn-primary d-flex align-items-center gap-2">
          <FiPlus /> Đặt lịch rửa xe
        </Button>
      </div>

      {/* Filter Toolbar */}
      <div className="autowash-card mb-4 py-3">
        <Row className="g-3">
          <Col xs={12} md={4}>
            <InputGroup>
              <InputGroup.Text className="bg-transparent border-end-0 text-muted">
                <FiSearch />
              </InputGroup.Text>
              <Form.Control 
                type="text" 
                placeholder="Tìm tên, biển số, SĐT..." 
                className="border-start-0"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </Col>
          <Col xs={6} md={4}>
            <Form.Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="All">Tất cả trạng thái rửa</option>
              <option value="Scheduled">Đã đặt lịch</option>
              <option value="In Progress">Đang làm</option>
              <option value="Completed">Hoàn thành</option>
              <option value="Cancelled">Đã hủy</option>
            </Form.Select>
          </Col>
          <Col xs={6} md={4}>
            <Form.Select value={paymentFilter} onChange={(e) => setPaymentFilter(e.target.value)}>
              <option value="All">Tất cả trạng thái thanh toán</option>
              <option value="Paid">Đã thanh toán</option>
              <option value="Unpaid">Chưa thanh toán</option>
            </Form.Select>
          </Col>
        </Row>
      </div>

      {/* Bookings Table */}
      <div className="autowash-card">
        <div className="table-responsive">
          <Table className="custom-table" hover>
            <thead>
              <tr>
                <th>Khách hàng</th>
                <th>Biển số xe</th>
                <th>Dịch vụ rửa</th>
                <th>Thời gian hẹn</th>
                <th>Ghi chú</th>
                <th>Thanh toán</th>
                <th>Trạng thái</th>
                <th className="text-end">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.length > 0 ? (
                filteredBookings.map((b) => (
                  <tr key={b.id}>
                    <td>
                      <div>
                        <strong>{b.customerName}</strong>
                        <div className="text-muted" style={{ fontSize: '0.8rem' }}>{b.phone}</div>
                      </div>
                    </td>
                    <td>
                      <span className="badge bg-secondary-subtle text-secondary-emphasis fs-7 px-2.5 py-1.5">{b.licensePlate}</span>
                    </td>
                    <td>
                      <div>
                        <div>{b.serviceName}</div>
                        <small className="text-primary font-weight-bold">{formatVND(b.price)}</small>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-1.5" style={{ fontSize: '0.875rem' }}>
                        <FiCalendar className="text-secondary" />
                        <span>{new Date(b.dateTime).toLocaleDateString('vi-VN')}</span>
                        <FiClock className="text-secondary ms-1" />
                        <span>{new Date(b.dateTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </td>
                    <td>
                      <span className="text-truncate d-inline-block" style={{ maxWidth: '150px' }} title={b.notes}>
                        {b.notes || <span className="text-muted">Không có</span>}
                      </span>
                    </td>
                    <td>
                      <StatusBadge status={b.paymentStatus} />
                    </td>
                    <td>
                      <StatusBadge status={b.status} />
                    </td>
                    <td className="text-end">
                      <div className="d-flex justify-content-end gap-1.5">
                        {/* Quick Flow Actions */}
                        {b.status === 'Scheduled' && (
                          <Button 
                            size="sm" 
                            variant="outline-primary" 
                            style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
                            onClick={() => handleQuickStatusUpdate(b.id, 'In Progress')}
                          >
                            Làm xe
                          </Button>
                        )}
                        {b.status === 'In Progress' && (
                          <Button 
                            size="sm" 
                            variant="success" 
                            style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
                            onClick={() => handleQuickStatusUpdate(b.id, 'Completed')}
                          >
                            Hoàn tất
                          </Button>
                        )}

                        <Button 
                          size="sm" 
                          variant="link" 
                          className="p-1 text-secondary"
                          onClick={() => handleOpenEditModal(b)}
                        >
                          <FiEdit2 />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="link" 
                          className="p-1 text-danger"
                          onClick={() => handleDelete(b.id)}
                        >
                          <FiTrash2 />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-4 text-muted">
                    Không tìm thấy lịch hẹn rửa xe nào phù hợp
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </div>

      {/* Booking Form Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontWeight: 600 }}>
            {editingBooking ? 'Cập nhật thông tin lịch hẹn' : 'Đặt lịch rửa xe mới'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body className="px-4 py-3">
            {/* Customer section */}
            {!editingBooking && (
              <div className="mb-3 p-3 rounded bg-light">
                <Form.Group className="mb-3">
                  <Form.Label className="font-weight-bold">Đối tượng khách hàng</Form.Label>
                  <div className="d-flex gap-3">
                    <Form.Check 
                      type="radio" 
                      label="Khách hàng đã lưu" 
                      id="oldCust"
                      name="custType"
                      checked={!isNewCustomer}
                      onChange={() => setIsNewCustomer(false)}
                    />
                    <Form.Check 
                      type="radio" 
                      label="Đăng ký khách mới" 
                      id="newCust"
                      name="custType"
                      checked={isNewCustomer}
                      onChange={() => setIsNewCustomer(true)}
                    />
                  </div>
                </Form.Group>

                {isNewCustomer ? (
                  <Row className="g-3">
                    <Col xs={12} sm={6}>
                      <Form.Group>
                        <Form.Label>Họ và tên <span className="text-danger">*</span></Form.Label>
                        <Form.Control 
                          type="text" 
                          required={isNewCustomer} 
                          value={custName} 
                          onChange={(e) => setCustName(e.target.value)} 
                          placeholder="Ví dụ: Nguyễn Văn A"
                        />
                      </Form.Group>
                    </Col>
                    <Col xs={12} sm={6}>
                      <Form.Group>
                        <Form.Label>Số điện thoại <span className="text-danger">*</span></Form.Label>
                        <Form.Control 
                          type="text" 
                          required={isNewCustomer} 
                          value={custPhone} 
                          onChange={(e) => setCustPhone(e.target.value)} 
                          placeholder="Số điện thoại"
                        />
                      </Form.Group>
                    </Col>
                    <Col xs={12} sm={6}>
                      <Form.Group>
                        <Form.Label>Biển số xe <span className="text-danger">*</span></Form.Label>
                        <Form.Control 
                          type="text" 
                          required={isNewCustomer} 
                          value={custPlate} 
                          onChange={(e) => setCustPlate(e.target.value)} 
                          placeholder="30A-XXXXX"
                        />
                      </Form.Group>
                    </Col>
                    <Col xs={12} sm={6}>
                      <Form.Group>
                        <Form.Label>Loại xe</Form.Label>
                        <Form.Select value={custCarType} onChange={(e) => setCustCarType(e.target.value)}>
                          <option value="Sedan">Sedan</option>
                          <option value="SUV">SUV</option>
                          <option value="Crossover">Crossover</option>
                          <option value="Truck">Bán tải (Truck)</option>
                          <option value="MPV">MPV / Hatchback</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                ) : (
                  <Form.Group>
                    <Form.Label>Chọn khách hàng hệ thống <span className="text-danger">*</span></Form.Label>
                    <Form.Select 
                      value={selectedCustomerId} 
                      onChange={(e) => setSelectedCustomerId(e.target.value)}
                      required={!isNewCustomer}
                    >
                      {customers.map(c => (
                        <option key={c.id} value={c.id}>
                          {c.name} - {c.licensePlate} ({c.phone})
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                )}
              </div>
            )}

            {editingBooking && (
              <div className="mb-3 p-2 bg-light rounded">
                <strong>Khách hàng: </strong> {editingBooking.customerName} ({editingBooking.licensePlate})
              </div>
            )}

            {/* Service & Schedule detail */}
            <Row className="g-3">
              <Col xs={12} sm={6}>
                <Form.Group>
                  <Form.Label>Chọn dịch vụ rửa xe <span className="text-danger">*</span></Form.Label>
                  <Form.Select 
                    value={selectedServiceId} 
                    onChange={(e) => setSelectedServiceId(e.target.value)}
                    required
                  >
                    {services.filter(s => s.isActive).map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name} - {formatVND(s.price)} ({s.duration} phút)
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col xs={12} sm={6}>
                <Form.Group>
                  <Form.Label>Ngày & Giờ đặt <span className="text-danger">*</span></Form.Label>
                  <Form.Control 
                    type="datetime-local" 
                    required 
                    value={dateTime} 
                    onChange={(e) => setDateTime(e.target.value)} 
                  />
                </Form.Group>
              </Col>
              
              <Col xs={12} sm={6}>
                <Form.Group>
                  <Form.Label>Trạng thái thanh toán</Form.Label>
                  <Form.Select value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)}>
                    <option value="Unpaid">Chưa thanh toán</option>
                    <option value="Paid">Đã thanh toán</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              {paymentStatus === 'Paid' && (
                <Col xs={12} sm={6}>
                  <Form.Group>
                    <Form.Label>Phương thức thanh toán</Form.Label>
                    <Form.Select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                      <option value="Cash">Tiền mặt (Cash)</option>
                      <option value="Card">Thẻ quét (Card)</option>
                      <option value="Transfer">Chuyển khoản (Transfer)</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              )}

              <Col xs={12} sm={paymentStatus === 'Paid' ? 6 : 12}>
                <Form.Group>
                  <Form.Label>Trạng thái thực hiện</Form.Label>
                  <Form.Select value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="Scheduled">Đã đặt lịch</option>
                    <option value="In Progress">Đang rửa xe</option>
                    <option value="Completed">Hoàn tất công việc</option>
                    <option value="Cancelled">Hủy bỏ lịch</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col xs={12}>
                <Form.Group>
                  <Form.Label>Ghi chú thêm</Form.Label>
                  <Form.Control 
                    as="textarea" 
                    rows={3} 
                    value={notes} 
                    onChange={(e) => setNotes(e.target.value)} 
                    placeholder="Ghi chú yêu cầu riêng (ví dụ: cần hút bụi kỹ hơn, không phun nước hoa...)"
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={() => setShowModal(false)}>
              Đóng
            </Button>
            <Button type="submit" className="btn-primary">
              Lưu lịch hẹn
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default Bookings;
