import React from 'react';
import { FiCheckCircle, FiLoader, FiClock, FiXCircle, FiDollarSign } from 'react-icons/fi';

const StatusBadge = ({ status }) => {
  let label = status;
  let styleClass = '';
  let Icon = null;

  switch (status) {
    // Booking Statuses
    case 'Completed':
      label = 'Hoàn thành';
      styleClass = 'success';
      Icon = FiCheckCircle;
      break;
    case 'In Progress':
      label = 'Đang làm';
      styleClass = 'purple';
      Icon = FiLoader;
      break;
    case 'Scheduled':
      label = 'Đã đặt lịch';
      styleClass = 'warning';
      Icon = FiClock;
      break;
    case 'Cancelled':
      label = 'Đã hủy';
      styleClass = 'danger';
      Icon = FiXCircle;
      break;

    // Payment Statuses
    case 'Paid':
      label = 'Đã thanh toán';
      styleClass = 'success';
      Icon = FiDollarSign;
      break;
    case 'Unpaid':
      label = 'Chưa thanh toán';
      styleClass = 'danger';
      Icon = FiClock;
      break;
    case 'Refunded':
      label = 'Đã hoàn tiền';
      styleClass = 'info';
      Icon = FiXCircle;
      break;
    default:
      styleClass = 'secondary';
  }

  return (
    <span className={`badge-custom ${styleClass}`}>
      {Icon && <Icon style={{ fontSize: '0.9em' }} />}
      {label}
    </span>
  );
};

export default StatusBadge;
