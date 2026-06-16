import React from 'react';
import { Container, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FiUsers } from 'react-icons/fi';

const Register = () => {
  return (
    <Container className="d-flex align-items-center justify-content-center min-vh-100" style={{ backgroundColor: '#F4F6FA' }}>
      <Card className="autowash-card border-0 p-4 w-100 text-center" style={{ maxWidth: '400px' }}>
        <FiUsers className="text-primary fs-1 mb-3 mx-auto" />
        <h4 className="font-weight-bold mb-2">Đăng ký tài khoản</h4>
        <p className="text-muted" style={{ fontSize: '0.9rem' }}>Chức năng đăng ký đang được phát triển liên kết API.</p>
        <Button as={Link} to="/login" style={{ backgroundColor: '#0A6EBD', borderColor: '#0A6EBD' }} className="mt-3 w-100">
          Quay lại Đăng nhập
        </Button>
      </Card>
    </Container>
  );
};

export default Register;
