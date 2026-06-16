import React, { useContext } from 'react';
import { Row, Col, Table, Button } from 'react-bootstrap';
import { FiDollarSign, FiClock, FiUsers, FiTrendingUp, FiCalendar, FiPlus, FiArrowRight } from 'react-icons/fi';
import { DataContext } from '../context/DataContext';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import { Link, useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const { bookings, customers, payments, updateBooking } = useContext(DataContext);
  const navigate = useNavigate();

  // 1. Calculations
  const formatVND = (num) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);

  // Today stats
  const todayStr = new Date().toISOString().split('T')[0];
  const todayPayments = payments.filter(p => p.date.startsWith(todayStr) && p.status === 'Paid');
  const todayRevenue = todayPayments.reduce((sum, p) => sum + p.amount, 0);

  const activeBookings = bookings.filter(b => b.status === 'Scheduled' || b.status === 'In Progress');
  const totalCustomers = customers.length;
  
  const completedToday = bookings.filter(b => b.status === 'Completed' && b.dateTime.startsWith(todayStr)).length;

  // Chart data: past 7 days revenue
  const getPastDaysData = () => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayPayments = payments.filter(p => p.date.startsWith(dateStr) && p.status === 'Paid');
      const revenue = dayPayments.reduce((sum, p) => sum + p.amount, 0);

      const label = date.toLocaleDateString('vi-VN', { weekday: 'short', day: 'numeric' });
      data.push({ name: label, 'Doanh thu': revenue });
    }
    return data;
  };

  const chartData = getPastDaysData();

  // Filter 5 most recent bookings
  const recentBookings = bookings.slice(0, 5);

  const handleQuickStatusChange = (bookingId, newStatus) => {
    const fields = { status: newStatus };
    if (newStatus === 'Completed') {
      fields.paymentStatus = 'Paid';
    }
    updateBooking(bookingId, fields);
  };

  return (
    <div className="fade-in-section">
      {/* Metrics Row */}
      <Row className="g-4 mb-4">
        <Col xs={12} md={6} lg={3}>
          <StatCard 
            title="Doanh thu hôm nay" 
            value={formatVND(todayRevenue)} 
            icon={FiDollarSign} 
            trend="+15%" 
            trendText="so với hôm qua" 
            gradientClass="gradient-card-blue text-white"
          />
        </Col>
        <Col xs={12} md={6} lg={3}>
          <StatCard 
            title="Lịch đang chờ/Đang làm" 
            value={`${activeBookings.length} xe`} 
            icon={FiClock} 
            trend={activeBookings.filter(b => b.status === 'In Progress').length + " đang rửa"} 
            trendText="" 
            gradientClass="gradient-card-purple text-white"
          />
        </Col>
        <Col xs={12} md={6} lg={3}>
          <StatCard 
            title="Tổng khách hàng" 
            value={`${totalCustomers} thành viên`} 
            icon={FiUsers} 
            trend="+2 mới" 
            trendText="trong tuần này" 
          />
        </Col>
        <Col xs={12} md={6} lg={3}>
          <StatCard 
            title="Đã rửa xong hôm nay" 
            value={`${completedToday} lượt`} 
            icon={FiTrendingUp} 
            trend="Hiệu suất tốt" 
            trendText="" 
          />
        </Col>
      </Row>

      {/* Main Charts & Quick Actions Row */}
      <Row className="g-4 mb-4">
        <Col xs={12} lg={8}>
          <div className="autowash-card h-100">
            <h6 className="font-weight-bold mb-3 text-secondary">Biểu đồ doanh thu 7 ngày qua</h6>
            <div style={{ width: '100%', height: '260px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                  <XAxis dataKey="name" stroke="var(--text-tertiary)" fontSize={11} tickLine={false} />
                  <YAxis 
                    stroke="var(--text-tertiary)" 
                    fontSize={11} 
                    tickFormatter={(val) => val >= 1000000 ? `${val/1000000}M` : `${val/1000}k`}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip 
                    formatter={(value) => [formatVND(value), 'Doanh thu']} 
                    contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)' }}
                  />
                  <Area type="monotone" dataKey="Doanh thu" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Col>

        {/* Quick Actions Panel */}
        <Col xs={12} lg={4}>
          <div className="autowash-card h-100 d-flex flex-column">
            <h6 className="font-weight-bold mb-3 text-secondary">Thao tác nhanh</h6>
            <div className="d-flex flex-column gap-3 flex-grow-1 justify-content-center">
              <div className="quick-action-item d-flex align-items-center justify-content-between" onClick={() => navigate('/bookings')}>
                <div className="d-flex align-items-center">
                  <FiCalendar className="text-primary fs-4 me-3" />
                  <div>
                    <p className="mb-0 font-weight-bold" style={{ fontSize: '0.9rem' }}>Đặt lịch rửa xe</p>
                    <small className="text-muted">Lập lịch mới cho khách</small>
                  </div>
                </div>
                <FiPlus />
              </div>
              <div className="quick-action-item d-flex align-items-center justify-content-between" onClick={() => navigate('/customers')}>
                <div className="d-flex align-items-center">
                  <FiUsers className="text-success fs-4 me-3" />
                  <div>
                    <p className="mb-0 font-weight-bold" style={{ fontSize: '0.9rem' }}>Thêm khách hàng</p>
                    <small className="text-muted">Đăng ký hội viên mới</small>
                  </div>
                </div>
                <FiPlus />
              </div>
              <div className="quick-action-item d-flex align-items-center justify-content-between" onClick={() => navigate('/services')}>
                <div className="d-flex align-items-center">
                  <FiDollarSign className="text-warning fs-4 me-3" />
                  <div>
                    <p className="mb-0 font-weight-bold" style={{ fontSize: '0.9rem' }}>Quản lý bảng giá</p>
                    <small className="text-muted">Điều chỉnh dịch vụ & giá cả</small>
                  </div>
                </div>
                <FiArrowRight />
              </div>
            </div>
          </div>
        </Col>
      </Row>

      {/* Recent Activity Table */}
      <div className="autowash-card mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="font-weight-bold m-0 text-secondary">Lịch hẹn gần đây nhất</h6>
          <Button as={Link} to="/bookings" variant="link" className="p-0 text-primary d-flex align-items-center gap-1 font-weight-bold" style={{ textDecoration: 'none', fontSize: '0.9rem' }}>
            Xem tất cả lịch hẹn <FiArrowRight />
          </Button>
        </div>
        <div className="table-responsive">
          <Table className="custom-table" hover>
            <thead>
              <tr>
                <th>Khách hàng / Biển số</th>
                <th>Dịch vụ</th>
                <th>Thời gian hẹn</th>
                <th>Thanh toán</th>
                <th>Trạng thái</th>
                <th className="text-end">Hành động nhanh</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.length > 0 ? (
                recentBookings.map((b) => (
                  <tr key={b.id}>
                    <td>
                      <div>
                        <strong style={{ fontSize: '0.95rem' }}>{b.customerName}</strong>
                        <div className="text-muted" style={{ fontSize: '0.8rem' }}>{b.phone} | <span className="badge bg-secondary-subtle text-secondary-emphasis">{b.licensePlate}</span></div>
                      </div>
                    </td>
                    <td>
                      <div>
                        <div>{b.serviceName}</div>
                        <small className="text-primary font-weight-bold">{formatVND(b.price)}</small>
                      </div>
                    </td>
                    <td>
                      <small className="text-secondary">
                        {new Date(b.dateTime).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })}
                      </small>
                    </td>
                    <td>
                      <StatusBadge status={b.paymentStatus} />
                    </td>
                    <td>
                      <StatusBadge status={b.status} />
                    </td>
                    <td className="text-end">
                      <div className="d-flex justify-content-end gap-2">
                        {b.status === 'Scheduled' && (
                          <Button 
                            size="sm" 
                            variant="outline-primary" 
                            style={{ padding: '0.2rem 0.6rem', fontSize: '0.8rem' }}
                            onClick={() => handleQuickStatusChange(b.id, 'In Progress')}
                          >
                            Rửa xe
                          </Button>
                        )}
                        {b.status === 'In Progress' && (
                          <Button 
                            size="sm" 
                            variant="success" 
                            style={{ padding: '0.2rem 0.6rem', fontSize: '0.8rem' }}
                            onClick={() => handleQuickStatusChange(b.id, 'Completed')}
                          >
                            Hoàn tất
                          </Button>
                        )}
                        {b.status !== 'Completed' && b.status !== 'Cancelled' && (
                          <Button 
                            size="sm" 
                            variant="outline-danger" 
                            style={{ padding: '0.2rem 0.6rem', fontSize: '0.8rem' }}
                            onClick={() => handleQuickStatusChange(b.id, 'Cancelled')}
                          >
                            Hủy
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-muted">
                    Không có lịch hẹn nào gần đây
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
