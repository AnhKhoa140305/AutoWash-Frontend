import React, { useContext, useState } from 'react';
import { Row, Col, Card, Button, Form, Modal, Badge } from 'react-bootstrap';
import { FiPlus, FiEdit, FiTrash2, FiClock, FiCheck, FiX, FiSearch } from 'react-icons/fi';
import { DataContext } from '../context/DataContext';

const Services = () => {
  const { services, addService, updateService, deleteService } = useContext(DataContext);

  // States
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);

  // Form Fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [duration, setDuration] = useState(30);
  const [category, setCategory] = useState('Rửa xe');
  const [isActive, setIsActive] = useState(true);

  // Helpers
  const formatVND = (num) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);

  const filteredServices = services.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenCreateModal = () => {
    setEditingService(null);
    setName('');
    setDescription('');
    setPrice(100000);
    setDuration(30);
    setCategory('Rửa xe');
    setIsActive(true);
    setShowModal(true);
  };

  const handleOpenEditModal = (s) => {
    setEditingService(s);
    setName(s.name);
    setDescription(s.description || '');
    setPrice(s.price);
    setDuration(s.duration);
    setCategory(s.category || 'Rửa xe');
    setIsActive(s.isActive !== undefined ? s.isActive : true);
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const servicePayload = {
      name,
      description,
      price: Number(price),
      duration: Number(duration),
      category,
      isActive
    };

    if (editingService) {
      updateService(editingService.id, servicePayload);
    } else {
      addService(servicePayload);
    }
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa dịch vụ này không? Các lịch rửa xe đã lưu dịch vụ này trước đây vẫn được giữ nguyên.")) {
      deleteService(id);
    }
  };

  const handleToggleActive = (id, currentVal) => {
    updateService(id, { isActive: !currentVal });
  };

  return (
    <div className="fade-in-section">
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3 mb-4">
        <div>
          <h5 className="font-weight-bold mb-1 text-secondary">Danh mục dịch vụ rửa & chăm sóc xe</h5>
          <small className="text-muted">Cấu hình các gói dịch vụ, thời gian thi công và bảng giá niêm yết</small>
        </div>
        <Button onClick={handleOpenCreateModal} className="btn-primary d-flex align-items-center gap-2">
          <FiPlus /> Thêm dịch vụ mới
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="autowash-card mb-4 py-3">
        <Row>
          <Col xs={12} md={6} lg={4}>
            <div className="position-relative">
              <Form.Control 
                type="text" 
                placeholder="Tìm gói dịch vụ hoặc danh mục..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
              />
              <FiSearch 
                className="position-absolute top-50 translate-middle-y text-muted" 
                style={{ left: '1rem' }}
              />
            </div>
          </Col>
        </Row>
      </div>

      {/* Services Grid */}
      <Row className="g-4">
        {filteredServices.length > 0 ? (
          filteredServices.map((s) => (
            <Col xs={12} md={6} lg={4} key={s.id}>
              <Card 
                className="autowash-card border-0 h-100 d-flex flex-column justify-content-between"
                style={{ 
                  opacity: s.isActive ? 1 : 0.65,
                  borderTop: s.isActive ? '4px solid var(--brand-primary)' : '4px solid var(--text-tertiary)'
                }}
              >
                <Card.Body className="p-0">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <Badge bg="primary-subtle" className="text-primary px-2.5 py-1.5" style={{ fontSize: '0.75rem' }}>
                      {s.category}
                    </Badge>
                    <Form.Check 
                      type="switch"
                      id={`active-switch-${s.id}`}
                      label=""
                      checked={s.isActive}
                      onChange={() => handleToggleActive(s.id, s.isActive)}
                      title={s.isActive ? 'Ngắt hoạt động' : 'Kích hoạt hoạt động'}
                      className="cursor-pointer"
                    />
                  </div>

                  <h5 className="font-weight-bold mb-2 text-dark">{s.name}</h5>
                  <p className="text-muted mb-3" style={{ fontSize: '0.85rem', minHeight: '40px' }}>
                    {s.description || 'Không có mô tả chi tiết cho gói dịch vụ này.'}
                  </p>

                  <div className="d-flex align-items-center gap-3 mb-3 text-secondary" style={{ fontSize: '0.875rem' }}>
                    <div className="d-flex align-items-center gap-1">
                      <FiClock />
                      <span>{s.duration} phút</span>
                    </div>
                    <div className="d-flex align-items-center gap-1">
                      <span className="font-weight-bold text-primary" style={{ fontSize: '1.1rem' }}>
                        {formatVND(s.price)}
                      </span>
                    </div>
                  </div>
                </Card.Body>

                <div 
                  className="pt-3 d-flex justify-content-between align-items-center" 
                  style={{ borderTop: '1px solid var(--border-color)' }}
                >
                  <small className="text-muted">Mã: {s.id}</small>
                  <div className="d-flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline-secondary" 
                      onClick={() => handleOpenEditModal(s)}
                      className="d-flex align-items-center gap-1"
                    >
                      <FiEdit size={13} /> Sửa
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline-danger" 
                      onClick={() => handleDelete(s.id)}
                      className="d-flex align-items-center gap-1"
                    >
                      <FiTrash2 size={13} /> Xóa
                    </Button>
                  </div>
                </div>
              </Card>
            </Col>
          ))
        ) : (
          <Col xs={12}>
            <div className="autowash-card text-center py-5 text-muted">
              Không tìm thấy gói dịch vụ nào khớp với từ khóa tìm kiếm.
            </div>
          </Col>
        )}
      </Row>

      {/* Service Form Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontWeight: 600 }}>
            {editingService ? 'Sửa thông tin gói dịch vụ' : 'Thêm gói dịch vụ mới'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body className="px-4 py-3">
            <Form.Group className="mb-3">
              <Form.Label>Tên gói dịch vụ <span className="text-danger">*</span></Form.Label>
              <Form.Control 
                type="text" 
                required 
                placeholder="Ví dụ: Rửa xe cao cấp + Phủ Ceramic"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Danh mục phân loại</Form.Label>
              <Form.Select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="Rửa xe">Rửa xe (Washing)</option>
                <option value="Chăm sóc xe">Chăm sóc xe (Care)</option>
                <option value="Khoang máy">Khoang máy (Engine)</option>
                <option value="Detailing">Đánh bóng & Phủ bóng (Detailing)</option>
                <option value="Khác">Dịch vụ khác</option>
              </Form.Select>
            </Form.Group>

            <Row className="g-3 mb-3">
              <Col xs={12} sm={6}>
                <Form.Group>
                  <Form.Label>Đơn giá dịch vụ (VND) <span className="text-danger">*</span></Form.Label>
                  <Form.Control 
                    type="number" 
                    required 
                    min={0}
                    step={1000}
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} sm={6}>
                <Form.Group>
                  <Form.Label>Thời gian thi công (Phút) <span className="text-danger">*</span></Form.Label>
                  <Form.Control 
                    type="number" 
                    required 
                    min={1}
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Mô tả dịch vụ</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3} 
                placeholder="Mô tả các hạng mục thực hiện trong gói dịch vụ này..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check 
                type="checkbox"
                id="modal-active-checkbox"
                label="Cho phép đặt lịch dịch vụ này"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={() => setShowModal(false)}>
              Đóng
            </Button>
            <Button type="submit" className="btn-primary">
              Lưu dịch vụ
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default Services;
