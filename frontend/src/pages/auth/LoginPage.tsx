// Standardized Luxury Login Page (TypeScript)
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../../contexts/StoreContext';
import { Button, InputField, Card, Alert } from '../../components';

export default function LoginPage() {
  const { login, addToast } = useStore();
  const navigate = useNavigate();

  const [username, setUsername] = useState('guest.demo');
  const [password, setPassword] = useState('123');
  const [errorMsg, setErrorMsg] = useState('');

  const fillCredentials = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
    setErrorMsg('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const res = login(username, password);
    if (!res.success) {
      setErrorMsg(res.message || 'Đăng nhập không thành công.');
      addToast(res.message || 'Đăng nhập thất bại', 'error');
    } else {
      addToast(`Xin chào ${res.user?.fullName || username}!`, 'success');
      if (res.user?.role === 'HOST') navigate('/host/properties');
      else if (res.user?.role === 'ADMIN') navigate('/admin/users');
      else navigate('/');
    }
  };

  return (
    <div style={{ maxWidth: 520, margin: '3.5rem auto 5rem', padding: '0 1.5rem' }}>
      <Card
        variant="elevated"
        padding="none"
        title={
          <div style={{ textAlign: 'center', width: '100%' }}>
            <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#222222' }}>
              Đăng nhập hoặc đăng ký
            </span>
          </div>
        }
      >
        <div style={{ padding: '2rem 1.75rem' }}>
          <h1 style={{ fontSize: '1.45rem', fontWeight: 800, margin: '0 0 0.5rem', color: '#222222' }}>
            Chào mừng bạn đến với ODauDay Stay
          </h1>
          <p style={{ margin: '0 0 1.5rem', color: '#717171', fontSize: '0.92rem' }}>
            Khám phá và đặt các chỗ ở nghỉ dưỡng tuyệt vời trên toàn quốc.
          </p>

          {errorMsg && (
            <Alert type="error" title="Lỗi đăng nhập">
              <p style={{ margin: 0, fontSize: '0.88rem' }}>{errorMsg}</p>
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <InputField
              label="Tên đăng nhập"
              required
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Nhập tên đăng nhập"
            />

            <InputField
              label="Mật khẩu"
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
            />

            <Button variant="primary" size="lg" block type="submit" style={{ marginTop: '0.5rem' }}>
              Đăng nhập
            </Button>
          </form>

          {/* Quick Demo Login Shortcut */}
          <div style={{ margin: '1.75rem 0 1.25rem', textAlign: 'center', position: 'relative' }}>
            <div style={{ height: 1, background: '#EBEBEB', width: '100%' }} />
            <span
              style={{
                position: 'absolute',
                top: -10,
                left: '50%',
                transform: 'translateX(-50%)',
                background: '#ffffff',
                padding: '0 0.75rem',
                fontSize: '0.78rem',
                color: '#717171',
              }}
            >
              đăng nhập nhanh thử nghiệm
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <Button
              type="button"
              variant="outline"
              size="xs"
              onClick={() => fillCredentials('guest.demo', '123')}
            >
              Khách thuê
            </Button>
            <Button
              type="button"
              variant="outline"
              size="xs"
              onClick={() => fillCredentials('host.demo', '123')}
            >
              Chủ nhà
            </Button>
            <Button
              type="button"
              variant="outline"
              size="xs"
              onClick={() => fillCredentials('admin', '123')}
            >
              Quản trị viên
            </Button>
          </div>

          <p style={{ textAlign: 'center', margin: 0, fontSize: '0.88rem', color: '#717171' }}>
            Chưa có tài khoản?{' '}
            <Link to="/register" style={{ fontWeight: 700, color: '#222222', textDecoration: 'underline' }}>
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}
