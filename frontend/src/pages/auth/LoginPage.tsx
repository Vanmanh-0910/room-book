// UC-01: Login Page (TypeScript)
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../../contexts/StoreContext';
import { UCTag, Alert } from '../../components/UI';
import { BoxArrowInRight, ShieldCheck, PersonFill, KeyFill, LockFill } from 'react-bootstrap-icons';

export default function LoginPage() {
  const { login, addToast } = useStore();
  const navigate = useNavigate();

  const [username, setUsername] = useState('guest.demo');
  const [password, setPassword] = useState('123');
  const [testState, setTestState] = useState<'default' | 'error_tc02' | 'error_locked'>('default');
  const [errorMsg, setErrorMsg] = useState('');

  const fillCredentials = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
    setErrorMsg('');
  };

  const handleStateChange = (state: 'default' | 'error_tc02' | 'error_locked') => {
    setTestState(state);
    if (state === 'error_tc02') {
      setUsername('guest.demo');
      setPassword('sai-mat-khau-999');
      setErrorMsg('Mật khẩu không chính xác (TC-02). Vui lòng kiểm tra lại!');
    } else if (state === 'error_locked') {
      setUsername('minh.pham');
      setPassword('123');
      setErrorMsg('Tài khoản này đang bị khóa bởi Quản trị viên (ASSUM-01).');
    } else {
      setUsername('guest.demo');
      setPassword('123');
      setErrorMsg('');
    }
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
    <div style={{ maxWidth: 960, margin: '2rem auto', padding: '0 1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <UCTag>
          <BoxArrowInRight /> UC-01 · Đăng nhập & Xác thực
        </UCTag>
      </div>

      {/* State Switcher for Business Test Cases */}
      <div
        style={{
          background: '#ffffff',
          border: '1px solid var(--line)',
          borderRadius: 'var(--radius)',
          padding: '0.85rem 1.25rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
          boxShadow: 'var(--shadow-xs)',
        }}
      >
        <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--ink-secondary)' }}>
          Kịch bản kiểm thử UC-01:
        </span>
        <div className="btn-group">
          <button
            type="button"
            className={`btn btn-sm ${testState === 'default' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => handleStateChange('default')}
          >
            Đăng nhập hợp lệ (TC-01)
          </button>
          <button
            type="button"
            className={`btn btn-sm ${testState === 'error_tc02' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => handleStateChange('error_tc02')}
          >
            Sai mật khẩu (TC-02)
          </button>
          <button
            type="button"
            className={`btn btn-sm ${testState === 'error_locked' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => handleStateChange('error_locked')}
          >
            Tài khoản bị khóa
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        {/* Left Form */}
        <section className="panel" style={{ boxShadow: 'var(--shadow-md)' }}>
          <h1 className="page-title" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
            Đăng nhập tài khoản
          </h1>
          <p className="page-sub" style={{ marginBottom: '1.25rem' }}>
            Chào mừng bạn trở lại với ODauDay Stay
          </p>

          {errorMsg && (
            <Alert type="error" title="Lỗi đăng nhập">
              <p style={{ margin: '0.25rem 0 0', fontSize: '0.88rem' }}>{errorMsg}</p>
            </Alert>
          )}

          <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
            <div className="field">
              <label htmlFor="login-username">
                <PersonFill /> Tên đăng nhập *
              </label>
              <input
                id="login-username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Nhập tên đăng nhập"
                required
              />
            </div>

            <div className="field">
              <label htmlFor="login-password">
                <KeyFill /> Mật khẩu *
              </label>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block" style={{ padding: '0.8rem', marginTop: '1rem' }}>
              <BoxArrowInRight /> Đăng nhập hệ thống
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.88rem', color: 'var(--ink-secondary)' }}>
            Chưa có tài khoản?{' '}
            <Link to="/register" style={{ fontWeight: 600, color: 'var(--brand)' }}>
              Đăng ký ngay
            </Link>
          </p>
        </section>

        {/* Right Demo Helper */}
        <section className="panel" style={{ background: '#f8fafc', border: '1px dashed var(--line)' }}>
          <h2 style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: 0 }}>
            <ShieldCheck className="text-brand" /> Tài khoản mẫu kiểm thử
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--ink-secondary)', lineHeight: 1.6 }}>
            Bấm nhanh vào một trong các tài khoản dưới đây để tự động điền thông tin và kiểm tra các vai trò RBAC:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
            <button
              type="button"
              className="btn btn-outline"
              style={{ textAlign: 'left', display: 'flex', justifyContent: 'space-between', padding: '0.75rem 1rem' }}
              onClick={() => fillCredentials('guest.demo', '123')}
            >
              <div>
                <strong>Khách thuê Demo (GUEST)</strong>
                <span className="muted" style={{ display: 'block', fontSize: '0.78rem' }}>
                  user: guest.demo · pass: 123
                </span>
              </div>
              <span className="badge badge-active">Khách</span>
            </button>

            <button
              type="button"
              className="btn btn-outline"
              style={{ textAlign: 'left', display: 'flex', justifyContent: 'space-between', padding: '0.75rem 1rem' }}
              onClick={() => fillCredentials('host.demo', '123')}
            >
              <div>
                <strong>Chủ nhà Demo (HOST)</strong>
                <span className="muted" style={{ display: 'block', fontSize: '0.78rem' }}>
                  user: host.demo · pass: 123
                </span>
              </div>
              <span className="badge badge-confirmed">Chủ nhà</span>
            </button>

            <button
              type="button"
              className="btn btn-outline"
              style={{ textAlign: 'left', display: 'flex', justifyContent: 'space-between', padding: '0.75rem 1rem' }}
              onClick={() => fillCredentials('admin', '123')}
            >
              <div>
                <strong>Quản trị viên (ADMIN)</strong>
                <span className="muted" style={{ display: 'block', fontSize: '0.78rem' }}>
                  user: admin · pass: 123
                </span>
              </div>
              <span className="badge badge-completed">Admin</span>
            </button>

            <button
              type="button"
              className="btn btn-outline"
              style={{ textAlign: 'left', display: 'flex', justifyContent: 'space-between', padding: '0.75rem 1rem', borderColor: '#fca5a5' }}
              onClick={() => fillCredentials('minh.pham', '123')}
            >
              <div>
                <strong style={{ color: '#dc2626' }}>Tài khoản bị khóa (LOCKED)</strong>
                <span className="muted" style={{ display: 'block', fontSize: '0.78rem' }}>
                  user: minh.pham · pass: 123
                </span>
              </div>
              <span className="badge badge-cancelled">Bị khóa</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
