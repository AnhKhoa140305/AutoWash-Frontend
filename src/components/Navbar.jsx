import React, { useContext } from 'react';
import { Navbar as BsNavbar, Nav, Button, Badge, Dropdown } from 'react-bootstrap';
import { FiSun, FiMoon, FiBell, FiSearch, FiUser } from 'react-icons/fi';
import { DataContext } from '../context/DataContext';

const Navbar = ({ pageTitle = "Hệ thống quản lý AutoWash" }) => {
  const { theme, toggleTheme, bookings } = useContext(DataContext);
  
  // Count scheduled or in-progress bookings for today as notifications
  const pendingBookings = bookings.filter(b => b.status === 'Scheduled' || b.status === 'In Progress').length;

  return (
    <BsNavbar 
      expand="lg" 
      className="px-4 py-3 border-bottom sticky-top" 
      style={{ 
        backgroundColor: 'var(--bg-secondary)', 
        borderColor: 'var(--border-color) !important',
        zIndex: 99
      }}
    >
      <div className="d-flex w-100 justify-content-between align-items-center">
        {/* Left: Dynamic Page Title */}
        <h5 className="mb-0 text-primary font-weight-bold" style={{ fontSize: '1.2rem', fontWeight: 600 }}>
          {pageTitle}
        </h5>

        {/* Right: Controls & Profile */}
        <div className="d-flex align-items-center gap-3">
          {/* Theme Toggle Button */}
          <Button 
            variant="link" 
            onClick={toggleTheme} 
            className="p-2 text-secondary hover-bg-tertiary"
            style={{ borderRadius: '50%', textDecoration: 'none' }}
          >
            {theme === 'dark' ? <FiSun className="fs-5 text-warning" /> : <FiMoon className="fs-5" />}
          </Button>

          {/* Notifications Dropdown */}
          <Dropdown align="end">
            <Dropdown.Toggle 
              as="div" 
              className="position-relative p-2 cursor-pointer text-secondary"
              style={{ cursor: 'pointer' }}
            >
              <FiBell className="fs-5" />
              {pendingBookings > 0 && (
                <Badge 
                  bg="danger" 
                  pill 
                  className="position-absolute translate-middle-y start-50 top-0 fs-7" 
                  style={{ fontSize: '0.65rem' }}
                >
                  {pendingBookings}
                </Badge>
              )}
            </Dropdown.Toggle>
            <Dropdown.Menu className="py-2 mt-2 shadow" style={{ width: '280px' }}>
              <Dropdown.Header className="font-weight-bold">Thông báo công việc</Dropdown.Header>
              {pendingBookings > 0 ? (
                <>
                  <Dropdown.Item className="py-2">
                    <small className="d-block font-weight-bold">Lịch rửa xe chưa hoàn thành</small>
                    <small className="text-muted">Hiện tại có {pendingBookings} lịch hẹn đang chờ xử lý.</small>
                  </Dropdown.Item>
                </>
              ) : (
                <Dropdown.Item className="text-center py-3 text-muted">
                  Không có thông báo mới
                </Dropdown.Item>
              )}
            </Dropdown.Menu>
          </Dropdown>

          {/* User Profile Dropdown */}
          <Dropdown align="end">
            <Dropdown.Toggle 
              as="div" 
              className="d-flex align-items-center cursor-pointer gap-2 text-secondary"
              style={{ cursor: 'pointer' }}
            >
              <div 
                className="bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: '36px', height: '36px' }}
              >
                <FiUser />
              </div>
              <div className="d-none d-md-block text-start">
                <p className="mb-0 font-weight-bold" style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>Admin AutoWash</p>
                <p className="mb-0 text-muted" style={{ fontSize: '0.75rem' }}>Quản lý hệ thống</p>
              </div>
            </Dropdown.Toggle>
            <Dropdown.Menu className="mt-2 shadow">
              <Dropdown.Item>Hồ sơ cá nhân</Dropdown.Item>
              <Dropdown.Item>Cấu hình trạm rửa</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item className="text-danger">Đăng xuất</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
    </BsNavbar>
  );
};

export default Navbar;
