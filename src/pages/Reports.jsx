import React, { useContext } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { FiTrendingUp, FiCheckCircle, FiUsers, FiClock } from 'react-icons/fi';
import { DataContext } from '../context/DataContext';
import StatCard from '../components/StatCard';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

const Reports = () => {
  const { bookings, payments, customers } = useContext(DataContext);

  // Helper
  const formatVND = (num) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);

  // 1. Core KPIs
  const totalPaidRevenue = payments.filter(p => p.status === 'Paid').reduce((sum, p) => sum + p.amount, 0);
  const totalCompletedBookings = bookings.filter(b => b.status === 'Completed').length;
  
  // Avg revenue per completed wash
  const averageTicket = totalCompletedBookings > 0 ? Math.round(totalPaidRevenue / totalCompletedBookings) : 0;
  
  // Booking completion rate
  const completionRate = bookings.length > 0 
    ? Math.round((bookings.filter(b => b.status === 'Completed').length / bookings.length) * 100) 
    : 0;

  // Active membership (members with > 0 loyalty points)
  const activeMembers = customers.filter(c => c.loyaltyPoints > 0).length;

  // Average washing time (minutes) based on bookings completed
  const totalDurationCompleted = bookings.filter(b => b.status === 'Completed').reduce((sum, b) => sum + b.duration, 0);
  const avgWashTime = totalCompletedBookings > 0 ? Math.round(totalDurationCompleted / totalCompletedBookings) : 0;

  // 2. Data Preparation for charts
  
  // Chart A: Monthly Revenue Trend
  const monthlyData = [
    { name: 'Tháng 1', 'Doanh thu': 4500000 },
    { name: 'Tháng 2', 'Doanh thu': 5200000 },
    { name: 'Tháng 3', 'Doanh thu': 6800000 },
    { name: 'Tháng 4', 'Doanh thu': 8000000 },
    { name: 'Tháng 5', 'Doanh thu': 9500000 },
    { name: 'Tháng 6', 'Doanh thu': totalPaidRevenue + 5000000 } // adding past months offset plus current live payments
  ];

  // Chart B: Service Popularity
  const getServiceStats = () => {
    const serviceCounts = {};
    bookings.forEach(b => {
      serviceCounts[b.serviceName] = (serviceCounts[b.serviceName] || 0) + 1;
    });

    return Object.keys(serviceCounts).map(key => ({
      name: key.length > 20 ? `${key.substring(0, 18)}...` : key,
      'Số lượt': serviceCounts[key]
    }));
  };

  const serviceData = getServiceStats();

  // Chart C: Vehicle Type Composition
  const getCarTypeStats = () => {
    const typeCounts = {};
    customers.forEach(c => {
      const type = c.carType || 'Sedan';
      typeCounts[type] = (typeCounts[type] || 0) + 1;
    });

    return Object.keys(typeCounts).map(key => ({
      name: key,
      value: typeCounts[key]
    }));
  };

  const carTypeData = getCarTypeStats();
  
  // Custom colors for Pie Chart segments
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#ec4899'];

  return (
    <div className="fade-in-section">
      {/* Metric Summaries */}
      <Row className="g-4 mb-4">
        <Col xs={12} md={6} lg={3}>
          <StatCard 
            title="Đơn giá trung bình / xe" 
            value={formatVND(averageTicket)} 
            icon={FiTrendingUp} 
            trend="Xu hướng tăng" 
            trendText="" 
          />
        </Col>
        <Col xs={12} md={6} lg={3}>
          <StatCard 
            title="Tỷ lệ hoàn thành việc" 
            value={`${completionRate}%`} 
            icon={FiCheckCircle} 
            trend="Mục tiêu: >90%" 
            trendText="" 
          />
        </Col>
        <Col xs={12} md={6} lg={3}>
          <StatCard 
            title="Hội viên tích cực" 
            value={`${activeMembers} thành viên`} 
            icon={FiUsers} 
            trend="Có điểm tích lũy" 
            trendText="" 
          />
        </Col>
        <Col xs={12} md={6} lg={3}>
          <StatCard 
            title="Thời gian rửa bình quân" 
            value={`${avgWashTime} phút`} 
            icon={FiClock} 
            trend="Chu kỳ rửa nhanh" 
            trendText="" 
          />
        </Col>
      </Row>

      {/* Main Charts Grid */}
      <Row className="g-4 mb-4">
        {/* Monthly Revenue Trend Line Chart */}
        <Col xs={12} lg={7}>
          <div className="autowash-card h-100">
            <h6 className="font-weight-bold mb-4 text-secondary">Xu hướng doanh thu hàng tháng</h6>
            <div style={{ width: '100%', height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                  <XAxis dataKey="name" stroke="var(--text-tertiary)" fontSize={11} tickLine={false} />
                  <YAxis 
                    stroke="var(--text-tertiary)" 
                    fontSize={11} 
                    tickFormatter={(val) => `${val/1000000}M`}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip 
                    formatter={(value) => [formatVND(value), 'Doanh thu']}
                    contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="Doanh thu" 
                    stroke="#3b82f6" 
                    strokeWidth={3} 
                    activeDot={{ r: 8 }} 
                    dot={{ strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Col>

        {/* Vehicle Composition Pie Chart */}
        <Col xs={12} lg={5}>
          <div className="autowash-card h-100">
            <h6 className="font-weight-bold mb-4 text-secondary">Phân loại phương tiện khách hàng</h6>
            <div style={{ width: '100%', height: '300px' }} className="d-flex align-items-center justify-content-center">
              {carTypeData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={carTypeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {carTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => [`${value} phương tiện`, 'Số lượng']}
                      contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)' }}
                    />
                    <Legend iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <span className="text-muted">Không có dữ liệu</span>
              )}
            </div>
          </div>
        </Col>

        {/* Service Popularity Bar Chart */}
        <Col xs={12}>
          <div className="autowash-card">
            <h6 className="font-weight-bold mb-4 text-secondary">Tỷ lệ đặt lịch theo dịch vụ</h6>
            <div style={{ width: '100%', height: '320px' }}>
              {serviceData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={serviceData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                    <XAxis dataKey="name" stroke="var(--text-tertiary)" fontSize={10} angle={-15} textAnchor="end" interval={0} height={50} />
                    <YAxis stroke="var(--text-tertiary)" fontSize={11} allowDecimals={false} axisLine={false} tickLine={false} />
                    <Tooltip 
                      formatter={(value) => [`${value} lượt đặt`, 'Số lượng']}
                      contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)' }}
                    />
                    <Bar dataKey="Số lượt" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-5 text-muted">Không có dữ liệu thống kê dịch vụ</div>
              )}
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Reports;
