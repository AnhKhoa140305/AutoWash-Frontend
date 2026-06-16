import React, { useContext, useState } from 'react';
import { Table, Row, Col, Form, Button, Modal, InputGroup } from 'react-bootstrap';
import { FiDollarSign, FiSearch, FiPrinter, FiEye, FiDownload } from 'react-icons/fi';
import { DataContext } from '../context/DataContext';
import StatusBadge from '../components/StatusBadge';
import StatCard from '../components/StatCard';

const Payments = () => {
  const { payments } = useContext(DataContext);

  // States
  const [searchTerm, setSearchTerm] = useState('');
  const [methodFilter, setMethodFilter] = useState('All');
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  // Helpers
  const formatVND = (num) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);

  // Filter calculations
  const filteredPayments = payments.filter(p => {
    const matchesSearch = 
      p.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesMethod = methodFilter === 'All' || p.paymentMethod === methodFilter;

    return matchesSearch && matchesMethod;
  });

  // KPI Calculations
  const totalRevenue = filteredPayments.reduce((sum, p) => sum + p.amount, 0);
  const cashTotal = filteredPayments.filter(p => p.paymentMethod === 'Cash').reduce((sum, p) => sum + p.amount, 0);
  const cardTotal = filteredPayments.filter(p => p.paymentMethod === 'Card').reduce((sum, p) => sum + p.amount, 0);
  const transferTotal = filteredPayments.filter(p => p.paymentMethod === 'Transfer').reduce((sum, p) => sum + p.amount, 0);

  const handleOpenInvoice = (payment) => {
    setSelectedPayment(payment);
    setShowInvoiceModal(true);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fade-in-section">
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3 mb-4">
        <div>
          <h5 className="font-weight-bold mb-1 text-secondary">Báo cáo & Theo dõi thanh toán</h5>
          <small className="text-muted">Quản lý giao dịch thu tiền, xuất hóa đơn và đối soát quỹ trạm rửa</small>
        </div>
      </div>

      {/* Revenue channel counters */}
      <Row className="g-4 mb-4">
        <Col xs={12} md={6} lg={3}>
          <StatCard 
            title="Tổng doanh thu thực nhận" 
            value={formatVND(totalRevenue)} 
            icon={FiDollarSign} 
            gradientClass="gradient-card-blue text-white"
          />
        </Col>
        <Col xs={12} md={6} lg={3}>
          <StatCard 
            title="Thu tiền mặt (Cash)" 
            value={formatVND(cashTotal)} 
            icon={FiDollarSign} 
            gradientClass="gradient-card-amber text-white"
          />
        </Col>
        <Col xs={12} md={6} lg={3}>
          <StatCard 
            title="Cà thẻ ngân hàng (Card)" 
            value={formatVND(cardTotal)} 
            icon={FiDollarSign} 
            gradientClass="gradient-card-purple text-white"
          />
        </Col>
        <Col xs={12} md={6} lg={3}>
          <StatCard 
            title="Chuyển khoản (Transfer)" 
            value={formatVND(transferTotal)} 
            icon={FiDollarSign} 
            gradientClass="gradient-card-emerald text-white"
          />
        </Col>
      </Row>

      {/* Filters */}
      <div className="autowash-card mb-4 py-3">
        <Row className="g-3">
          <Col xs={12} md={6}>
            <InputGroup>
              <InputGroup.Text className="bg-transparent border-end-0 text-muted">
                <FiSearch />
              </InputGroup.Text>
              <Form.Control 
                type="text" 
                placeholder="Tìm theo Mã GD, Tên khách hàng, Dịch vụ..." 
                className="border-start-0"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </Col>
          <Col xs={12} md={4} lg={3}>
            <Form.Select value={methodFilter} onChange={(e) => setMethodFilter(e.target.value)}>
              <option value="All">Tất cả phương thức</option>
              <option value="Cash">Tiền mặt (Cash)</option>
              <option value="Card">Thẻ quẹt (Card)</option>
              <option value="Transfer">Chuyển khoản (Transfer)</option>
            </Form.Select>
          </Col>
        </Row>
      </div>

      {/* Transaction Table */}
      <div className="autowash-card">
        <h6 className="font-weight-bold mb-3 text-secondary">Nhật ký giao dịch gần đây</h6>
        <div className="table-responsive">
          <Table className="custom-table" hover>
            <thead>
              <tr>
                <th>Mã GD</th>
                <th>Khách hàng</th>
                <th>Dịch vụ rửa</th>
                <th>Phương thức</th>
                <th>Thời gian</th>
                <th>Số tiền</th>
                <th>Trạng thái</th>
                <th className="text-end">Hóa đơn</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.length > 0 ? (
                filteredPayments.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <strong className="text-primary">{p.id}</strong>
                    </td>
                    <td>
                      <strong>{p.customerName}</strong>
                    </td>
                    <td>{p.serviceName}</td>
                    <td>
                      <Badge bg={p.paymentMethod === 'Cash' ? 'warning-subtle text-warning-emphasis' : (p.paymentMethod === 'Card' ? 'primary-subtle text-primary' : 'success-subtle text-success-emphasis')} className="px-2 py-1">
                        {p.paymentMethod === 'Cash' ? 'Tiền mặt' : (p.paymentMethod === 'Card' ? 'Cà thẻ' : 'Chuyển khoản')}
                      </Badge>
                    </td>
                    <td>
                      <small className="text-secondary">
                        {new Date(p.date).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })}
                      </small>
                    </td>
                    <td>
                      <strong className="text-success">{formatVND(p.amount)}</strong>
                    </td>
                    <td>
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="text-end">
                      <Button 
                        size="sm" 
                        variant="outline-primary"
                        onClick={() => handleOpenInvoice(p)}
                        className="d-inline-flex align-items-center gap-1.5"
                      >
                        <FiEye /> Xem
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-4 text-muted">
                    Không tìm thấy dữ liệu giao dịch thanh toán nào
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </div>

      {/* Invoice Details Modal */}
      <Modal show={showInvoiceModal} onHide={() => setShowInvoiceModal(false)} size="md" centered>
        <Modal.Header closeButton className="d-print-none">
          <Modal.Title style={{ fontWeight: 600 }}>Chi tiết hóa đơn dịch vụ</Modal.Title>
        </Modal.Header>
        {selectedPayment && (
          <Modal.Body className="p-4" id="printable-invoice">
            {/* Invoice Print Box Layout */}
            <div className="invoice-header d-flex justify-content-between align-items-start mb-4">
              <div>
                <h4 className="font-weight-bold text-primary mb-1">AutoWash Center</h4>
                <small className="text-muted d-block">123 Đường Cầu Giấy, Hà Nội</small>
                <small className="text-muted d-block">Hotline: 1900 8888</small>
              </div>
              <div className="text-end">
                <h5 className="font-weight-bold text-dark mb-0">HÓA ĐƠN</h5>
                <small className="text-primary d-block font-weight-bold">Số: {selectedPayment.id}</small>
                <small className="text-muted d-block">Ngày: {new Date(selectedPayment.date).toLocaleDateString('vi-VN')}</small>
              </div>
            </div>

            <hr style={{ borderColor: 'var(--border-color)' }} />

            <div className="invoice-client-details my-3">
              <p className="mb-1 text-secondary" style={{ fontSize: '0.85rem' }}>Khách hàng:</p>
              <strong className="text-dark d-block fs-5 mb-1">{selectedPayment.customerName}</strong>
              <small className="text-muted d-block">Hình thức thanh toán: <strong>{selectedPayment.paymentMethod === 'Cash' ? 'Tiền mặt' : (selectedPayment.paymentMethod === 'Card' ? 'Cà thẻ' : 'Chuyển khoản')}</strong></small>
            </div>

            <Table borderless className="my-4 table-sm" style={{ fontSize: '0.9rem' }}>
              <thead>
                <tr className="border-bottom" style={{ borderColor: 'var(--border-color)' }}>
                  <th className="py-2 text-start text-secondary">TÊN DỊCH VỤ VÀ GÓI SẢN PHẨM</th>
                  <th className="py-2 text-end text-secondary">ĐƠN GIÁ</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-bottom" style={{ borderColor: 'var(--border-color)' }}>
                  <td className="py-3 text-start text-dark font-weight-bold">
                    {selectedPayment.serviceName}
                    <small className="text-muted d-block font-weight-normal mt-1">Dịch vụ chăm sóc rửa xe tự động chất lượng cao</small>
                  </td>
                  <td className="py-3 text-end text-dark font-weight-bold">{formatVND(selectedPayment.amount)}</td>
                </tr>
                <tr>
                  <td className="py-2 text-start text-muted">Cộng tiền dịch vụ:</td>
                  <td className="py-2 text-end text-dark">{formatVND(selectedPayment.amount)}</td>
                </tr>
                <tr>
                  <td className="py-2 text-start text-muted">Thuế GTGT (VAT 0%):</td>
                  <td className="py-2 text-end text-dark">0 ₫</td>
                </tr>
                <tr className="border-top fs-5" style={{ borderColor: 'var(--text-primary)' }}>
                  <td className="py-3 text-start font-weight-bold text-dark">TỔNG CỘNG THANH TOÁN:</td>
                  <td className="py-3 text-end font-weight-bold text-success">{formatVND(selectedPayment.amount)}</td>
                </tr>
              </tbody>
            </Table>

            <div className="d-flex flex-column align-items-center justify-content-center bg-light p-3 rounded text-center my-3 gap-2">
              <div 
                className="bg-white border p-2 rounded" 
                style={{ width: '100px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                {/* Visual Placeholder QR payment scanner */}
                <div style={{ width: '80px', height: '80px', background: 'radial-gradient(circle, #333 30%, transparent 31%), repeating-linear-gradient(45deg, #000, #000 2px, #fff 2px, #fff 4px)', opacity: 0.85 }} />
              </div>
              <div>
                <small className="text-muted d-block" style={{ fontSize: '0.75rem' }}>Quét mã QR để đối soát giao dịch thanh toán</small>
                <small className="text-primary font-weight-bold" style={{ fontSize: '0.8rem' }}>CẢM ƠN QUÝ KHÁCH & HẸN GẶP LẠI!</small>
              </div>
            </div>
          </Modal.Body>
        )}
        <Modal.Footer className="d-print-none">
          <Button variant="outline-secondary" onClick={() => setShowInvoiceModal(false)}>
            Đóng
          </Button>
          <Button variant="outline-primary" onClick={handlePrint} className="d-flex align-items-center gap-1.5">
            <FiPrinter /> In hóa đơn
          </Button>
          <Button variant="primary" onClick={() => setShowInvoiceModal(false)} className="d-flex align-items-center gap-1.5">
            <FiDownload /> Xuất PDF
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Payments;
