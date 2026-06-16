import React, { createContext, useState, useEffect } from 'react';

export const DataContext = createContext();

const initialServices = [
  { id: 'S1', name: 'Rửa vỏ tiêu chuẩn', description: 'Rửa vỏ ngoài, xịt gầm, lau kính, làm sạch lốp cơ bản.', price: 100000, duration: 20, category: 'Rửa xe', isActive: true },
  { id: 'S2', name: 'Rửa toàn diện (Full Wash)', description: 'Rửa vỏ ngoài, hút bụi nội thất, làm sạch khoang cabin, dưỡng bóng lốp.', price: 180000, duration: 35, category: 'Rửa xe', isActive: true },
  { id: 'S3', name: 'Rửa cao cấp + Phủ Wax', description: 'Rửa sâu, tẩy nhựa đường, hút bụi kẽ sâu, xông tinh dầu khử mùi, phủ Wax bóng bảo vệ sơn.', price: 350000, duration: 60, category: 'Chăm sóc xe', isActive: true },
  { id: 'S4', name: 'Vệ sinh khoang máy', description: 'Làm sạch chi tiết khoang động cơ bằng hơi nước nóng công nghệ cao, dưỡng bảo vệ nhựa máy.', price: 500000, duration: 90, category: 'Khoang máy', isActive: true },
  { id: 'S5', name: 'Vệ sinh chi tiết nội thất', description: 'Tháo ghế (nếu cần), hút bụi sâu, giặt thảm trần sàn, làm sạch và dưỡng da nội thất bằng dung dịch chuyên dụng.', price: 1200000, duration: 180, category: 'Detailing', isActive: true },
];

const initialCustomers = [
  { id: 'C1', name: 'Nguyễn Văn An', phone: '0987654321', email: 'an.nguyen@gmail.com', licensePlate: '30A-123.45', carType: 'Sedan', loyaltyPoints: 120, status: 'Active' },
  { id: 'C2', name: 'Trần Thị Bình', phone: '0912345678', email: 'binh.tran@gmail.com', licensePlate: '29C-987.65', carType: 'SUV', loyaltyPoints: 80, status: 'Active' },
  { id: 'C3', name: 'Lê Hoàng Cường', phone: '0905556677', email: 'cuong.le@gmail.com', licensePlate: '51F-555.55', carType: 'Sedan', loyaltyPoints: 240, status: 'Active' },
  { id: 'C4', name: 'Phạm Minh Duy', phone: '0933445566', email: 'duy.pham@gmail.com', licensePlate: '43A-888.88', carType: 'Crossover', loyaltyPoints: 40, status: 'Active' },
  { id: 'C5', name: 'Hoàng Thị Hoa', phone: '0944778899', email: 'hoa.hoang@gmail.com', licensePlate: '30E-246.80', carType: 'SUV', loyaltyPoints: 0, status: 'Active' },
];

// Helper to construct ISO dates relative to today
const getRelativeDateStr = (daysOffset, hour, minute) => {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
};

const initialBookings = [
  {
    id: 'B1',
    customerId: 'C1',
    customerName: 'Nguyễn Văn An',
    phone: '0987654321',
    licensePlate: '30A-123.45',
    serviceId: 'S2',
    serviceName: 'Rửa toàn diện (Full Wash)',
    dateTime: getRelativeDateStr(-1, 9, 30),
    duration: 35,
    price: 180000,
    paymentStatus: 'Paid',
    status: 'Completed',
    notes: 'Khách hàng hẹn giờ lấy đúng giờ'
  },
  {
    id: 'B2',
    customerId: 'C2',
    customerName: 'Trần Thị Bình',
    phone: '0912345678',
    licensePlate: '29C-987.65',
    serviceId: 'S3',
    serviceName: 'Rửa cao cấp + Phủ Wax',
    dateTime: getRelativeDateStr(-1, 14, 0),
    duration: 60,
    price: 350000,
    paymentStatus: 'Paid',
    status: 'Completed',
    notes: 'Chú ý vệ sinh bánh xe kỹ'
  },
  {
    id: 'B3',
    customerId: 'C3',
    customerName: 'Lê Hoàng Cường',
    phone: '0905556677',
    licensePlate: '51F-555.55',
    serviceId: 'S5',
    serviceName: 'Vệ sinh chi tiết nội thất',
    dateTime: getRelativeDateStr(0, 10, 0),
    duration: 180,
    price: 1200000,
    paymentStatus: 'Paid',
    status: 'In Progress',
    notes: 'Giặt kỹ đệm ghế da'
  },
  {
    id: 'B4',
    customerId: 'C4',
    customerName: 'Phạm Minh Duy',
    phone: '0933445566',
    licensePlate: '43A-888.88',
    serviceId: 'S1',
    serviceName: 'Rửa vỏ tiêu chuẩn',
    dateTime: getRelativeDateStr(0, 16, 30),
    duration: 20,
    price: 100000,
    paymentStatus: 'Unpaid',
    status: 'Scheduled',
    notes: 'Rửa nhanh để đi tỉnh'
  },
  {
    id: 'B5',
    customerId: 'C1',
    customerName: 'Nguyễn Văn An',
    phone: '0987654321',
    licensePlate: '30A-123.45',
    serviceId: 'S4',
    serviceName: 'Vệ sinh khoang máy',
    dateTime: getRelativeDateStr(1, 9, 0),
    duration: 90,
    price: 500000,
    paymentStatus: 'Unpaid',
    status: 'Scheduled',
    notes: 'Rửa lần 2 giảm giá hoặc cộng điểm'
  }
];

const initialPayments = [
  { id: 'P1', bookingId: 'B1', customerName: 'Nguyễn Văn An', serviceName: 'Rửa toàn diện (Full Wash)', amount: 180000, paymentMethod: 'Cash', date: getRelativeDateStr(-1, 10, 10), status: 'Paid' },
  { id: 'P2', bookingId: 'B2', customerName: 'Trần Thị Bình', serviceName: 'Rửa cao cấp + Phủ Wax', amount: 350000, paymentMethod: 'Card', date: getRelativeDateStr(-1, 15, 0), status: 'Paid' },
  { id: 'P3', bookingId: 'B3', customerName: 'Lê Hoàng Cường', serviceName: 'Vệ sinh chi tiết nội thất', amount: 1200000, paymentMethod: 'Transfer', date: getRelativeDateStr(0, 10, 5), status: 'Paid' }
];

export const DataProvider = ({ children }) => {
  const [services, setServices] = useState(() => {
    const local = localStorage.getItem('autowash_services');
    return local ? JSON.parse(local) : initialServices;
  });

  const [customers, setCustomers] = useState(() => {
    const local = localStorage.getItem('autowash_customers');
    return local ? JSON.parse(local) : initialCustomers;
  });

  const [bookings, setBookings] = useState(() => {
    const local = localStorage.getItem('autowash_bookings');
    return local ? JSON.parse(local) : initialBookings;
  });

  const [payments, setPayments] = useState(() => {
    const local = localStorage.getItem('autowash_payments');
    return local ? JSON.parse(local) : initialPayments;
  });

  const [theme, setTheme] = useState(() => {
    const local = localStorage.getItem('autowash_theme');
    return local ? local : 'light';
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('autowash_services', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem('autowash_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('autowash_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('autowash_payments', JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem('autowash_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // --- CRUD Operations ---

  // Services
  const addService = (service) => {
    const newService = { ...service, id: `S${Date.now()}` };
    setServices(prev => [...prev, newService]);
    return newService;
  };

  const updateService = (id, updatedService) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, ...updatedService } : s));
  };

  const deleteService = (id) => {
    setServices(prev => prev.filter(s => s.id !== id));
  };

  // Customers
  const addCustomer = (customer) => {
    const newCustomer = { 
      ...customer, 
      id: `C${Date.now()}`, 
      loyaltyPoints: customer.loyaltyPoints || 0,
      status: customer.status || 'Active'
    };
    setCustomers(prev => [...prev, newCustomer]);
    return newCustomer;
  };

  const updateCustomer = (id, updatedCustomer) => {
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, ...updatedCustomer } : c));
  };

  const deleteCustomer = (id) => {
    setCustomers(prev => prev.filter(c => c.id !== id));
  };

  // Bookings
  const addBooking = (booking) => {
    const newBooking = { ...booking, id: `B${Date.now()}` };
    setBookings(prev => [newBooking, ...prev]);

    // Handle payment entry creation if already marked as Paid
    if (booking.paymentStatus === 'Paid') {
      addPayment({
        bookingId: newBooking.id,
        customerName: booking.customerName,
        serviceName: booking.serviceName,
        amount: booking.price,
        paymentMethod: booking.paymentMethod || 'Cash',
        date: new Date().toISOString(),
        status: 'Paid'
      });
    }

    // Award loyalty points to customer (1 point per 10,000 VND)
    const pointsToAward = Math.floor(booking.price / 10000);
    setCustomers(prev => prev.map(c => {
      if (c.id === booking.customerId || (booking.phone && c.phone === booking.phone)) {
        return { ...c, loyaltyPoints: c.loyaltyPoints + pointsToAward };
      }
      return c;
    }));

    return newBooking;
  };

  const updateBooking = (id, updatedFields) => {
    setBookings(prev => prev.map(b => {
      if (b.id === id) {
        const result = { ...b, ...updatedFields };
        
        // Handle transitions to 'Paid' and create dynamic payment ledger entry
        if (updatedFields.paymentStatus === 'Paid' && b.paymentStatus !== 'Paid') {
          addPayment({
            bookingId: b.id,
            customerName: result.customerName,
            serviceName: result.serviceName,
            amount: result.price,
            paymentMethod: updatedFields.paymentMethod || 'Cash',
            date: new Date().toISOString(),
            status: 'Paid'
          });
        }
        return result;
      }
      return b;
    }));
  };

  const deleteBooking = (id) => {
    // If deleted, remove associated payments as well
    setPayments(prev => prev.filter(p => p.bookingId !== id));
    setBookings(prev => prev.filter(b => b.id !== id));
  };

  // Payments
  const addPayment = (payment) => {
    const newPayment = { ...payment, id: `P${Date.now()}` };
    setPayments(prev => [newPayment, ...prev]);
    return newPayment;
  };

  return (
    <DataContext.Provider value={{
      services,
      customers,
      bookings,
      payments,
      theme,
      toggleTheme,
      addService,
      updateService,
      deleteService,
      addCustomer,
      updateCustomer,
      deleteCustomer,
      addBooking,
      updateBooking,
      deleteBooking,
      addPayment
    }}>
      {children}
    </DataContext.Provider>
  );
};
