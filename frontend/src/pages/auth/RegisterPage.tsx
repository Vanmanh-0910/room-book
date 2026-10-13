// UC-01: Register Page (TypeScript)
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../../contexts/StoreContext';
import { UCTag, Alert } from '../../components/UI';
import { PersonVcard, At, Telephone, KeyFill, PersonPlusFill, ShieldCheck } from 'react-bootstrap-icons';

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
  const [testState, setTestState] = useState<'default' | 'error_dup'>('default');

  const handleStateChange = (state: 'default' | 'error_dup') => {
    setTestState(state);
    if (state === 'error_dup') {
      setUsername('guest.demo');
      setPassword('123');
      setFullName('Lê Hoàng Nam (Đã tồn tại)');
      setPhone('0900000003');
      setEmail('guest.demo@gmail.com');
      setErrorMsg('Tên đăng nhập "guest.demo" đã tồn tại, vui lòng chọn tên khác!');
    } else {
      setUsername('');
      setPassword('');
      setFullName('');
      setPhone('');
      setEmail('');
      setErrorMsg('');
    }
  };

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
    <div style={{ maxWidth: 960, margin: '2rem auto', padding: '0 1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <UCTag>
          <PersonPlusFill /> UC-01 · Đăng ký tài khoản
        </UCTag>
      </div>

      {/* State Switcher */}
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
          Kịch bản kiểm thử:
        </span>
        <div className="btn-group">
          <button
            type="button"
            className={`btn btn-sm ${testState === 'default' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => handleStateChange('default')}
          >
            Đăng ký mới
          </button>
          <button
            type="button"
            className={`btn btn-sm ${testState === 'error_dup' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => handleStateChange('error_dup')}
          >
            Trùng tên đăng nhập (TC Lỗi)
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        <section className="panel" style={{ boxShadow: 'var(--shadow-md)' }}>
          <h1 className="page-title" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
            Đăng ký thành viên
          </h1>
          <p className="page-sub" style={{ marginBottom: '1.25rem' }}>
            Tạo tài khoản để đặt phòng hoặc đăng bài cho thuê chỗ ở
          </p>

          {errorMsg && (
            <Alert type="error" title="Lỗi đăng ký">
              <p style={{ margin: '0.25rem 0 0', fontSize: '0.88rem' }}>{errorMsg}</p>
            </Alert>
          )}

          <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
            <div className="field">
              <label htmlFor="reg-fullname">
                <PersonVcard /> Họ và tên đầy đủ *
              </label>
              <input
                id="reg-fullname"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="Ví dụ: Nguyễn Văn An"
                required
              />
            </div>

            <div className="field">
              <label htmlFor="reg-username">
                <At /> Tên đăng nhập *
              </label>
              <input
                id="reg-username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Ví dụ: an.nguyen"
                required
              />
            </div>

            <div className="field">
              <label htmlFor="reg-phone">
                <Telephone /> Số điện thoại *
              </label>
              <input
                id="reg-phone"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="Ví dụ: 0912345678"
                required
              />
            </div>

            <div className="field">
              <label htmlFor="reg-email">
                <At /> Email *
              </label>
              <input
                id="reg-email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Ví dụ: an@gmail.com"
                required
              />
            </div>

            <div className="field">
              <label htmlFor="reg-password">
                <KeyFill /> Mật khẩu *
              </label>
              <input
                id="reg-password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu an toàn"
                required
              />
            </div>

            <div className="field">
              <label htmlFor="reg-role">
                <ShieldCheck /> Loại tài khoản đăng ký *
              </label>
              <select
                id="reg-role"
                value={role}
                onChange={e => setRole(e.target.value as 'GUEST' | 'HOST')}
              >
                <option value="GUEST">Khách thuê (Đặt homestay nghỉ dưỡng)</option>
                <option value="HOST">Chủ nhà (Đăng tin và cho thuê phòng)</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary btn-block" style={{ padding: '0.8rem', marginTop: '1rem' }}>
              <PersonPlusFill /> Hoàn tất đăng ký
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.88rem', color: 'var(--ink-secondary)' }}>
            Đã có tài khoản?{' '}
            <Link to="/login" style={{ fontWeight: 600, color: 'var(--brand)' }}>
              Đăng nhập ngay
            </Link>
          </p>
        </section>

        <section className="panel" style={{ background: '#f8fafc', border: '1px dashed var(--line)' }}>
          <h2 style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: 0 }}>
            <ShieldCheck className="text-brand" /> Quyền lợi thành viên ODauDay Stay
          </h2>
          <ul style={{ paddingLeft: '1.25rem', lineHeight: 1.8, fontSize: '0.9rem', color: 'var(--ink-secondary)' }}>
            <li>Cam kết giá tốt nhất không phụ phí ẩn.</li>
            <li>Xác nhận đặt phòng tự động và hỗ trợ 24/7.</li>
            <li>Đánh giá xác thực (Verified Stay) từ cộng đồng du khách.</li>
            <li>Đối với chủ nhà: Quản lý phòng, lịch chặn và doanh thu minh bạch.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
