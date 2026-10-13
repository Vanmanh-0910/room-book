// UC-04: Guest My Bookings Page (TypeScript)
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../contexts/StoreContext';
import { UCTag, Breadcrumb, Badge } from '../../components/UI';
import { formatVND, BADGE_CLASS, BADGE_LABEL } from '../../constants';
import {
  BagCheckFill,
  Search,
  ShieldCheck,
  Eye,
  PencilSquare,
  XCircle,
  HourglassSplit,
} from 'react-bootstrap-icons';
import { Booking } from '../../data';

export default function MyBookingsPage() {
  const { store, currentUser, addToast } = useStore();
  const username = currentUser?.username || 'guest.demo';

  const [activeTab, setActiveTab] = useState<'ALL' | 'PENDING' | 'COMPLETED' | 'CANCELLED'>('ALL');

  const myBookings = store.getMyBookings(username);

  const totalSpent = myBookings
    .filter(b => b.status === 'COMPLETED')
    .reduce((sum, b) => sum + b.total, 0);

  const pendingCount = myBookings.filter(b => b.status === 'PENDING').length;

  const filteredBookings = myBookings.filter(b => {
    if (activeTab === 'ALL') return true;
    return b.status === activeTab;
  });

  const handleCancelBooking = (code: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn hủy đơn #${code}?`)) {
      const res = store.cancelBooking(code);
      if (res.success) {
        addToast(`Đã hủy thành công đơn #${code}`, 'success');
      } else {
        addToast(res.message || 'Không thể hủy đơn', 'error');
      }
    }
  };

  return (
    <main>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
        <Breadcrumb items={[{ label: 'Trang chủ', to: '/' }, { label: 'Lịch sử đặt phòng cá nhân' }]} />
        <UCTag>
          <BagCheckFill /> UC-04 · Quản lý đơn của khách
        </UCTag>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <h1 className="page-title" style={{ margin: '0 0 0.35rem' }}>
            Lịch sử &amp; Quản lý đơn lưu trú
          </h1>
          <p className="page-sub" style={{ margin: 0 }}>
            Danh sách các yêu cầu giữ chỗ và kỳ nghỉ dưỡng của tài khoản khách thuê (<strong>{username}</strong>).
          </p>
        </div>
        <Link className="btn btn-primary" to="/search">
          <Search /> Đặt thêm chỗ ở mới
        </Link>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-3" style={{ marginBottom: '1.75rem' }}>
        <div className="panel" style={{ borderLeft: '4px solid var(--brand)', padding: '1.25rem' }}>
          <span className="muted" style={{ fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>
            Tổng số đơn đã tạo
          </span>
          <p style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--ink)', margin: '0.25rem 0 0' }}>
            {myBookings.length} đơn
          </p>
          <span className="muted" style={{ fontSize: '0.8rem' }}>
            Toàn bộ lịch sử đặt phòng
          </span>
        </div>

        <div className="panel" style={{ borderLeft: '4px solid var(--warn)', padding: '1.25rem' }}>
          <span className="muted" style={{ fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>
            Đơn chờ phê duyệt
          </span>
          <p style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--warn)', margin: '0.25rem 0 0' }}>
            {pendingCount} đơn
          </p>
          <span className="muted" style={{ fontSize: '0.8rem' }}>
            Đang đợi chủ nhà duyệt (PENDING)
          </span>
        </div>

        <div className="panel" style={{ borderLeft: '4px solid var(--ok)', padding: '1.25rem' }}>
          <span className="muted" style={{ fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>
            Tổng chi tiêu tích lũy
          </span>
          <p style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--ok)', margin: '0.25rem 0 0' }}>
            {formatVND(totalSpent)}
          </p>
          <span className="muted" style={{ fontSize: '0.8rem' }}>
            Chỉ tính đơn hoàn tất (COMPLETED)
          </span>
        </div>
      </div>

      {/* Bookings Table Panel */}
      <section className="panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--line)', paddingBottom: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto' }}>
            <button
              type="button"
              className={`badge ${activeTab === 'ALL' ? 'badge-active' : ''}`}
              style={{
                padding: '0.45rem 1rem',
                fontSize: '0.85rem',
                border: 'none',
                cursor: 'pointer',
                background: activeTab === 'ALL' ? 'var(--brand)' : '#f1f5f9',
                color: activeTab === 'ALL' ? '#fff' : 'var(--ink-secondary)',
              }}
              onClick={() => setActiveTab('ALL')}
            >
              Tất cả đơn ({myBookings.length})
            </button>
            <button
              type="button"
              className={`badge ${activeTab === 'PENDING' ? 'badge-active' : ''}`}
              style={{
                padding: '0.45rem 1rem',
                fontSize: '0.85rem',
                border: 'none',
                cursor: 'pointer',
                background: activeTab === 'PENDING' ? 'var(--brand)' : '#f1f5f9',
                color: activeTab === 'PENDING' ? '#fff' : 'var(--ink-secondary)',
              }}
              onClick={() => setActiveTab('PENDING')}
            >
              Chờ xác nhận ({pendingCount})
            </button>
            <button
              type="button"
              className={`badge ${activeTab === 'COMPLETED' ? 'badge-active' : ''}`}
              style={{
                padding: '0.45rem 1rem',
                fontSize: '0.85rem',
                border: 'none',
                cursor: 'pointer',
                background: activeTab === 'COMPLETED' ? 'var(--brand)' : '#f1f5f9',
                color: activeTab === 'COMPLETED' ? '#fff' : 'var(--ink-secondary)',
              }}
              onClick={() => setActiveTab('COMPLETED')}
            >
              Đã hoàn thành ({myBookings.filter(b => b.status === 'COMPLETED').length})
            </button>
            <button
              type="button"
              className={`badge ${activeTab === 'CANCELLED' ? 'badge-active' : ''}`}
              style={{
                padding: '0.45rem 1rem',
                fontSize: '0.85rem',
                border: 'none',
                cursor: 'pointer',
                background: activeTab === 'CANCELLED' ? 'var(--brand)' : '#f1f5f9',
                color: activeTab === 'CANCELLED' ? '#fff' : 'var(--ink-secondary)',
              }}
              onClick={() => setActiveTab('CANCELLED')}
            >
              Đã huỷ ({myBookings.filter(b => b.status === 'CANCELLED').length})
            </button>
          </div>
          <span className="muted" style={{ fontSize: '0.82rem' }}>
            <ShieldCheck className="text-brand" /> Phân quyền dữ liệu theo vai trò người dùng (BR-06)
          </span>
        </div>

        {filteredBookings.length === 0 ? (
          <p className="muted" style={{ textAlign: 'center', padding: '2rem 0' }}>
            Không có đơn đặt phòng nào trong danh mục này.
          </p>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th style={{ padding: '0.75rem' }}>Mã đơn hàng</th>
                  <th style={{ padding: '0.75rem' }}>Cơ sở &amp; Hạng phòng</th>
                  <th style={{ padding: '0.75rem' }}>Thời gian lưu trú</th>
                  <th style={{ padding: '0.75rem' }}>Tổng tiền</th>
                  <th style={{ padding: '0.75rem' }}>Trạng thái</th>
                  <th style={{ textAlign: 'right', padding: '0.75rem' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map(b => (
                  <tr key={b.code}>
                    <td style={{ padding: '0.75rem' }}>
                      <strong style={{ fontFamily: 'monospace', color: 'var(--brand-dark)' }}>{b.code}</strong>
                      <span className="muted" style={{ display: 'block', fontSize: '0.78rem' }}>
                        Tạo ngày {b.createdAt}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <strong>{b.propertyName}</strong>
                      <span className="muted" style={{ display: 'block', fontSize: '0.82rem' }}>
                        {b.roomName}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem', fontSize: '0.88rem' }}>
                      {b.checkIn} → {b.checkOut}
                      <span className="muted" style={{ display: 'block', fontSize: '0.78rem' }}>
                        {b.nights} đêm · {b.guests} khách
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <strong className="card-price" style={{ fontSize: '1rem' }}>
                        {formatVND(b.total)}
                      </strong>
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <span className={`badge ${BADGE_CLASS[b.status] || 'badge-pending'}`}>
                        {BADGE_LABEL[b.status] || b.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right', padding: '0.75rem' }}>
                      <div className="btn-group" style={{ justifyContent: 'flex-end' }}>
                        <Link to={`/my-bookings/${b.code}`} className="btn btn-outline btn-xs">
                          <Eye /> Xem chi tiết
                        </Link>
                        {b.status === 'COMPLETED' && !b.isReviewed && (
                          <Link to={`/review?bookingCode=${b.code}`} className="btn btn-primary btn-xs">
                            <PencilSquare /> Đánh giá (UC-05)
                          </Link>
                        )}
                        {(b.status === 'PENDING' || b.status === 'CONFIRMED') && (
                          <button
                            type="button"
                            className="btn btn-outline btn-xs"
                            style={{ color: '#dc2626', borderColor: '#fca5a5' }}
                            onClick={() => handleCancelBooking(b.code)}
                          >
                            <XCircle /> Hủy đơn
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
