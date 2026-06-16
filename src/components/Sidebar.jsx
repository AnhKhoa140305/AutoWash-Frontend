import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiHome, FiCalendar, FiUsers, FiSettings, FiDollarSign, FiBarChart2, FiActivity } from 'react-icons/fi';

const Sidebar = () => {
  return (
    <div className="sidebar shadow-lg">
      <div className="d-flex align-items-center mb-4 px-2 py-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <FiActivity className="text-primary me-2 fs-3" />
        <h4 className="logo-text text-white m-0 font-weight-bold" style={{ letterSpacing: '0.5px' }}>
          Auto<span className="text-primary">Wash</span>
        </h4>
      </div>

      <nav className="nav-menu">
        <li>
          <NavLink to="/" className={({ isActive }) => `nav-item-link ${isActive ? 'active' : ''}`}>
            <FiHome className="nav-icon" />
            <span className="nav-item-text">Tổng quan</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/bookings" className={({ isActive }) => `nav-item-link ${isActive ? 'active' : ''}`}>
            <FiCalendar className="nav-icon" />
            <span className="nav-item-text">Đặt lịch rửa xe</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/customers" className={({ isActive }) => `nav-item-link ${isActive ? 'active' : ''}`}>
            <FiUsers className="nav-icon" />
            <span className="nav-item-text">Quản lý khách hàng</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/services" className={({ isActive }) => `nav-item-link ${isActive ? 'active' : ''}`}>
            <FiSettings className="nav-icon" />
            <span className="nav-item-text">Quản lý dịch vụ</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/payments" className={({ isActive }) => `nav-item-link ${isActive ? 'active' : ''}`}>
            <FiDollarSign className="nav-icon" />
            <span className="nav-item-text">Theo dõi thanh toán</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/reports" className={({ isActive }) => `nav-item-link ${isActive ? 'active' : ''}`}>
            <FiBarChart2 className="nav-icon" />
            <span className="nav-item-text">Báo cáo thống kê</span>
          </NavLink>
        </li>
      </nav>

      <div className="mt-auto p-2 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <small className="user-profile-details text-muted">AutoWash Premium v1.0</small>
      </div>
    </div>
  );
};

export default Sidebar;
