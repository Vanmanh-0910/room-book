// UC-08: Host Bookings Management Page (TypeScript)
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../contexts/StoreContext';
import { UCTag, Breadcrumb } from '../../components/UI';
import { formatVND, BADGE_CLASS, BADGE_LABEL } from '../../constants';
import {
  CalendarCheck,
  CheckLg,
  XCircle,
  Eye,
  KeyFill,
  Check2All,
  ShieldLockFill,
  HourglassSplit,
} from 'react-bootstrap-icons';
import { Booking } from '../../data';

export default function HostBookingsPage() {
  const { store, addToast } = useStore();

  const [bookings, setBookings] = useState<Booking[]>(() => store.getAllBookings());
  const [activeTab, setActiveTab] = useState<'ALL' | 'PENDING' | 'CONFIRMED' | 'COMPLETED'>('ALL');

  const refreshList = () => {
    setBookings(store.getAllBookings());
  };

  const handleUpdateStatus = (code: string, newStatus: Booking['status']) => {
    const res = store.updateBookingStatus(code, newStatus);
    if (res.success) {
      addToast(`Đã chuyển trạng thái đơn #${code} sang ${newStatus}`, 'success');
      refreshList();
    } else {
      addToast(res.message || 'Lỗi khi cập nhật trạng thái', 'error');
    }
  };

  const pendingCount = bookings.filter(b => b.status === 'PENDING').length;
  const confirmedCount = bookings.filter(b => b.status === 'CONFIRMED').length;
  const completedCount = bookings.filter(b => b.status === 'COMPLETED').length;

  const filteredBookings = bookings.filter(b => {
    if (activeTab === 'ALL') return true;
    return b.status === activeTab;
  });

  return (
    <div style={{ maxWidth: 1200, margin: '1.5rem auto', padding: '0 1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
        <Breadcrumb items={[{ label: 'Host Portal', to: '/host/properties' }, { label: 'Quản lý đơn đặt phòng' }]} />
        <UCTag>
          <CalendarCheck /> UC-08 · Xử lý &amp; Duyệt đơn
        </UCTag>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <h1 className="page-title" style={{ margin: '0 0 0.35rem' }}>
            Quản lý &amp; Xử lý đơn đặt phòng
          </h1>
          <p className="page-sub" style={{ margin: 0 }}>
            Danh sách các yêu cầu lưu trú của khách thuộc các chỗ ở của chủ nhà (Tài khoản: <strong>host.demo</strong>).
          </p>
        </div>
        <span className="badge badge-active" style={{ padding: '0.4rem 0.9rem', fontSize: '0.85rem' }}>
          Tự động đồng bộ Realtime
        </span>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-3" style={{ marginBottom: '1.75rem' }}>
        <div className="panel" style={{ borderLeft: '4px solid var(--warn)', padding: '1.25rem' }}>
          <span className="muted" style={{ fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>
            Yêu cầu chờ phê duyệt
          </span>
          <p style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--warn)', margin: '0.25rem 0 0' }}>
            {pendingCount} đơn
          </p>
          <span className="muted" style={{ fontSize: '0.8rem' }}>
            Cần phản hồi trong 24h
          </span>
        </div>

        <div className="panel" style={{ borderLeft: '4px solid var(--brand)', padding: '1.25rem' }}>
          <span className="muted" style={{ fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>
            Đơn đã xác nhận (Sắp tới)
          </span>
          <p style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--brand)', margin: '0.25rem 0 0' }}>
            {confirmedCount} đơn
          </p>
          <span className="muted" style={{ fontSize: '0.8rem' }}>
            Chờ đón khách nhận phòng
          </span>
        </div>

        <div className="panel" style={{ borderLeft: '4px solid var(--ok)', padding: '1.25rem' }}>
          <span className="muted" style={{ fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>
            Đơn lưu trú hoàn tất
          </span>
          <p style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--ok)', margin: '0.25rem 0 0' }}>
            {completedCount} đơn
          </p>
          <span className="muted" style={{ fontSize: '0.8rem' }}>
            Đã ghi nhận doanh thu (BR-08)
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
              Tất cả đơn ({bookings.length})
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
              Chờ duyệt ({pendingCount})
            </button>
            <button
              type="button"
              className={`badge ${activeTab === 'CONFIRMED' ? 'badge-active' : ''}`}
              style={{
                padding: '0.45rem 1rem',
                fontSize: '0.85rem',
                border: 'none',
                cursor: 'pointer',
                background: activeTab === 'CONFIRMED' ? 'var(--brand)' : '#f1f5f9',
                color: activeTab === 'CONFIRMED' ? '#fff' : 'var(--ink-secondary)',
              }}
              onClick={() => setActiveTab('CONFIRMED')}
            >
              Đã xác nhận ({confirmedCount})
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
              Hoàn tất ({completedCount})
            </button>
          </div>
          <span className="muted" style={{ fontSize: '0.82rem' }}>
            <ShieldLockFill className="text-brand" /> Bảo mật truy cập dữ liệu chủ quyền (BR-06)
          </span>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th style={{ padding: '0.75rem' }}>Mã đơn</th>
                <th style={{ padding: '0.75rem' }}>Khách đặt phòng</th>
                <th style={{ padding: '0.75rem' }}>Hạng phòng</th>
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
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    <strong>{b.guestName}</strong>
                    <span className="muted" style={{ display: 'block', fontSize: '0.78rem' }}>
                      {b.guestPhone}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    <strong>{b.roomName}</strong>
                    <span className="muted" style={{ display: 'block', fontSize: '0.78rem' }}>
                      {b.propertyName}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem', fontSize: '0.88rem' }}>
                    {b.checkIn} → {b.checkOut}
                    <span className="muted" style={{ display: 'block', fontSize: '0.78rem' }}>
                      {b.nights} đêm · {b.guests} khách
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem', fontWeight: 700, color: 'var(--brand)' }}>
                    {formatVND(b.total)}
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    <span className={`badge ${BADGE_CLASS[b.status] || 'badge-pending'}`}>
                      {BADGE_LABEL[b.status] || b.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right', padding: '0.75rem' }}>
                    <div className="btn-group" style={{ justifyContent: 'flex-end' }}>
                      {b.status === 'PENDING' && (
                        <>
                          <button
                            type="button"
                            className="btn btn-primary btn-xs"
                            onClick={() => handleUpdateStatus(b.code, 'CONFIRMED')}
                          >
                            <CheckLg /> Duyệt đơn
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline btn-xs"
                            style={{ color: '#dc2626' }}
                            onClick={() => handleUpdateStatus(b.code, 'REJECTED')}
                          >
                            <XCircle /> Từ chối
                          </button>
                        </>
                      )}

                      {b.status === 'CONFIRMED' && (
                        <button
                          type="button"
                          className="btn btn-outline btn-xs"
                          onClick={() => handleUpdateStatus(b.code, 'CHECKED_IN')}
                        >
                          <KeyFill /> Check-in
                        </button>
                      )}

                      {b.status === 'CHECKED_IN' && (
                        <button
                          type="button"
                          className="btn btn-primary btn-xs"
                          onClick={() => handleUpdateStatus(b.code, 'COMPLETED')}
                        >
                          <Check2All /> Hoàn tất
                        </button>
                      )}

                      <Link to={`/host/bookings/${b.code}`} className="btn btn-outline btn-xs">
                        <Eye /> Chi tiết
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
