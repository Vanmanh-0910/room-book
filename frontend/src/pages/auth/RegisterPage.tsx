// Standardized Luxury Register Page (TypeScript)
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../../contexts/StoreContext';
import { Button, InputField, Card, Alert } from '../../components';
import { HouseDoorFill, KeyFill } from 'react-bootstrap-icons';

export default function RegisterPage() {
  const { store, addToast } = useStore();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'GUEST' | 'HOST'>('GUEST');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const res = store.register({
      username,
      password,
      fullName,
      phone,
      email,
      role,
    });

    if (!res.success) {
      setErrorMsg(res.message || 'Đăng ký không thành công.');
      addToast(res.message || 'Đăng ký thất bại', 'error');
    } else {
      addToast('Đăng ký tài khoản thành công! Vui lòng đăng nhập.', 'success');
      navigate('/login');
    }
  };

  return (
    <div style={{ maxWidth: 540, margin: '2.5rem auto 4.5rem', padding: '0 1.25rem' }}>
      <Card
        variant="elevated"
        padding="none"
        title={
          <div style={{ textAlign: 'center', width: '100%' }}>
            <span style={{ fontSize: '1.05rem', fontWeight: 700, color: '#222222' }}>
              Đăng ký tài khoản ODauDay Stay
            </span>
          </div>
        }
      >
        <div style={{ padding: '2rem 2rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.4rem', color: '#222222', letterSpacing: '-0.02em' }}>
            Chào mừng bạn đến với ODauDay Stay
          </h1>
          <p style={{ margin: '0 0 1.75rem', color: '#717171', fontSize: '0.92rem' }}>
            Tạo tài khoản để bắt đầu đặt phòng hoặc đăng tin đón tiếp khách
          </p>

          {errorMsg && (
            <Alert type="error" title="Lỗi đăng ký">
              <p style={{ margin: 0, fontSize: '0.88rem' }}>{errorMsg}</p>
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            {/* Full Name */}
            <InputField
              label="Họ và tên đầy đủ"
              required
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              placeholder="Ví dụ: Nguyễn Văn An"
            />

            {/* Username & Password */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <InputField
                label="Tên đăng nhập"
                required
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="an.nguyen"
              />
              <InputField
                label="Mật khẩu"
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            {/* Phone & Email */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <InputField
                label="Số điện thoại"
                required
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="0912345678"
              />
              <InputField
                label="Email liên hệ"
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="an@gmail.com"
              />
            </div>

            {/* Visual Role Picker */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#222222', marginBottom: '0.5rem' }}>
                Mục đích sử dụng chính <span style={{ color: '#FF385C' }}>*</span>
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                <div
                  onClick={() => setRole('GUEST')}
                  style={{
                    border: role === 'GUEST' ? '2px solid #222222' : '1px solid #DDDDDD',
                    borderRadius: '10px',
                    padding: '0.85rem',
                    cursor: 'pointer',
                    background: role === 'GUEST' ? '#F7F7F7' : '#ffffff',
                    transition: 'all 0.15s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.25rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, fontSize: '0.92rem' }}>
                    <HouseDoorFill style={{ color: '#FF385C' }} />
                    <span>Khách thuê</span>
                  </div>
                  <span style={{ fontSize: '0.78rem', color: '#717171' }}>
                    Đặt homestay &amp; biệt thự nghỉ dưỡng
                  </span>
                </div>

                <div
                  onClick={() => setRole('HOST')}
                  style={{
                    border: role === 'HOST' ? '2px solid #222222' : '1px solid #DDDDDD',
                    borderRadius: '10px',
                    padding: '0.85rem',
                    cursor: 'pointer',
                    background: role === 'HOST' ? '#F7F7F7' : '#ffffff',
                    transition: 'all 0.15s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.25rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, fontSize: '0.92rem' }}>
                    <KeyFill style={{ color: '#FF385C' }} />
                    <span>Chủ nhà</span>
                  </div>
                  <span style={{ fontSize: '0.78rem', color: '#717171' }}>
                    Đăng chỗ ở &amp; quản lý cho thuê
                  </span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <Button variant="primary" size="lg" block type="submit">
              Hoàn tất đăng ký
            </Button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', marginBottom: 0, fontSize: '0.9rem', color: '#717171' }}>
            Đã có tài khoản?{' '}
            <Link to="/login" style={{ fontWeight: 700, color: '#222222', textDecoration: 'underline' }}>
              Đăng nhập ngay
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}
