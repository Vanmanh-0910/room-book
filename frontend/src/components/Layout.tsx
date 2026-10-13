// Shared Layout Components: Header, Footer, DemoBar, Toast (TypeScript)
import React, { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '../contexts/StoreContext';
import { ROLES } from '../constants';
import {
  HouseDoorFill,
  Compass,
  BagCheck,
  BoxArrowInRight,
  BoxArrowRight,
  PersonCircle,
  Building,
  DoorOpen,
  CalendarCheck,
  GraphUpArrow,
  PeopleFill,
  Diagram3,
  ShieldLockFill,
  ArrowCounterclockwise,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  CheckCircleFill,
  InfoCircleFill,
  ExclamationTriangleFill,
  ExclamationOctagonFill,
} from 'react-bootstrap-icons';

// ── Header Navigation ──────────────────────────────────────────────────
const GUEST_NAV = [
  { to: '/', icon: <Compass />, label: 'Trang chủ' },
  { to: '/search', icon: <Compass />, label: 'Tìm kiếm (UC-02)' },
  { to: '/my-bookings', icon: <BagCheck />, label: 'Đơn của tôi (UC-04)' },
];
const HOST_NAV = [
  { to: '/host/properties', icon: <Building />, label: 'Nhà của tôi (UC-06)' },
  { to: '/host/rooms', icon: <DoorOpen />, label: 'Hạng phòng (UC-07)' },
  { to: '/host/bookings', icon: <CalendarCheck />, label: 'Duyệt đơn (UC-08)' },
  { to: '/host/revenue', icon: <GraphUpArrow />, label: 'Doanh thu (UC-09)' },
];
const ADMIN_NAV = [
  { to: '/admin/users', icon: <PeopleFill />, label: 'Quản lý tài khoản (UC-10)' },
];

export function Header() {
  const { currentUser, logout } = useStore();
  const location = useLocation();
  const navigate = useNavigate();
  const role = currentUser?.role;
  const nav = role === ROLES.HOST ? HOST_NAV : role === ROLES.ADMIN ? ADMIN_NAV : GUEST_NAV;
  const sub =
    role === ROLES.HOST
      ? '· khu vực chủ nhà (Host Portal)'
      : role === ROLES.ADMIN
      ? '· khu vực quản trị (Admin Console)'
      : '· homestay & nghỉ dưỡng';
  const home = role === ROLES.HOST ? '/host/properties' : role === ROLES.ADMIN ? '/admin/users' : '/';

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    logout();
    navigate('/login');
  };

  return (
    <header className="site-header">
      <div className="bar">
        <Link className="brand" to={home}>
          <span>
            ODauDay Stay <small className="brand-sub">{sub}</small>
          </span>
        </Link>
        <nav className="nav" aria-label="Điều hướng chính">
          {nav.map(item => (
            <Link key={item.to} to={item.to} className={location.pathname === item.to ? 'active' : ''}>
              {item.icon} {item.label}
            </Link>
          ))}
        </nav>
        {currentUser ? (
          <div className="user-pill">
            <PersonCircle className="text-brand" />
            <span className="user-name">{currentUser.fullName}</span>
            <a href="#logout" id="odd-logout-btn" title="Đăng xuất" onClick={handleLogout}>
              <BoxArrowRight /> Thoát
            </a>
          </div>
        ) : (
          <div className="btn-group">
            <Link className="btn btn-outline btn-sm" to="/login">
              <BoxArrowInRight /> Đăng nhập
            </Link>
            <Link className="btn btn-primary btn-sm" to="/register">
              Đăng ký
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

// ── DemoBar ────────────────────────────────────────────────────────────
export function DemoBar() {
  const { currentUser, switchRole, resetStore } = useStore();
  const currentRole = currentUser?.role?.toLowerCase() || 'logout';

  return (
    <aside className="demo-bar" aria-label="Thanh công cụ kiểm thử nghiệp vụ">
      <div className="demo-inner">
        <span className="demo-chip">
          <Diagram3 /> Antigravity Prototype
        </span>
        <label htmlFor="odd-role-select">
          <ShieldLockFill /> Chuyển vai trò thử nghiệm:
        </label>
        <select
          id="odd-role-select"
          value={currentRole}
          onChange={e => switchRole(e.target.value)}
          aria-label="Chọn vai trò người dùng"
        >
          <option value="guest">Khách thuê (guest.demo / 123)</option>
          <option value="host">Chủ nhà (host.demo / 123)</option>
          <option value="admin">Quản trị viên (admin / 123)</option>
          <option value="logout">Chưa đăng nhập (Khách vãng lai)</option>
        </select>
        <span className="demo-divider">|</span>
        <button
          id="odd-reset-data"
          className="demo-btn"
          type="button"
          onClick={resetStore}
          title="Khôi phục CSDL mẫu ban đầu"
        >
          <ArrowCounterclockwise /> Khôi phục CSDL mẫu
        </button>
      </div>
    </aside>
  );
}

// ── Footer ─────────────────────────────────────────────────────────────
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-content">
        <div className="footer-grid">
          <div>
            <div className="brand footer-brand">
              <HouseDoorFill className="footer-icon" />
              <strong>ODauDay Stay</strong>
            </div>
            <p className="footer-desc">
              Hệ thống trung gian đặt phòng trực tuyến (OTA) kết nối khách thuê homestay và chủ nhà trên toàn quốc. Đề
              tài Phân tích &amp; Thiết kế Hướng đối tượng (OOAD) 2026.
            </p>
            <div className="footer-socials">
              <a href="#fb" aria-label="Facebook">
                <Facebook />
              </a>
              <a href="#tw" aria-label="Twitter">
                <Twitter />
              </a>
              <a href="#ig" aria-label="Instagram">
                <Instagram />
              </a>
              <a href="#yt" aria-label="YouTube">
                <Youtube />
              </a>
            </div>
          </div>
          <div>
            <p className="footer-col-title">Sơ đồ Use Case</p>
            <ul className="footer-links">
              <li>
                <Link to="/login">UC-01 · Đăng nhập &amp; Xác thực</Link>
              </li>
              <li>
                <Link to="/search">UC-02 · Tìm kiếm &amp; Chi tiết</Link>
              </li>
              <li>
                <Link to="/booking-quote?propertyId=1&roomId=1">UC-03 · Báo giá &amp; Giữ chỗ</Link>
              </li>
              <li>
                <Link to="/my-bookings">UC-04 · Quản lý đơn của khách</Link>
              </li>
              <li>
                <Link to="/review?bookingCode=ODD-DEMO-0001">UC-05 · Đánh giá lưu trú</Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="footer-col-title">Khu vực Quản trị</p>
            <ul className="footer-links">
              <li>
                <Link to="/host/properties">UC-06 · Quản lý cơ sở lưu trú</Link>
              </li>
              <li>
                <Link to="/host/rooms">UC-07 · Hạng phòng &amp; Lịch chặn</Link>
              </li>
              <li>
                <Link to="/host/bookings">UC-08 · Duyệt &amp; Vận hành đơn</Link>
              </li>
              <li>
                <Link to="/host/revenue">UC-09 · Báo cáo doanh thu</Link>
              </li>
              <li>
                <Link to="/admin/users">UC-10 · Quản lý tài khoản RBAC</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 ODauDay Stay Prototype · Học phần Phân tích &amp; Thiết kế Hướng đối tượng (OOAD).</p>
          <div className="footer-meta">
            <span>Phiên bản v2.0-React-TSX</span>
            <span>·</span>
            <span className="badge badge-active">CSDL LocalStorage</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ── Toast Container ────────────────────────────────────────────────────
export function ToastContainer() {
  const { toasts, removeToast } = useStore();

  const iconMap: Record<string, ReactNode> = {
    success: <CheckCircleFill className="text-ok" />,
    error: <ExclamationOctagonFill className="text-danger" />,
    warn: <ExclamationTriangleFill className="text-warn" />,
    info: <InfoCircleFill className="text-info" />,
  };

  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast-${t.type}`} role="alert" onClick={() => removeToast(t.id)}>
          {iconMap[t.type]}
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}
