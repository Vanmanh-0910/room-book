// UC-04: Guest Booking Detail Page (TypeScript)
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useStore } from '../../contexts/StoreContext';
import { UCTag, Breadcrumb, Alert, Badge } from '../../components/UI';
import { formatVND, BADGE_CLASS, BADGE_LABEL } from '../../constants';
import {
  Diagram3,
  CalendarCheck,
  HouseDoor,
  PersonFill,
  ClockHistory,
  XCircle,
  PencilSquare,
  CheckCircleFill,
  KeyFill,
  HourglassSplit,
} from 'react-bootstrap-icons';
import { BookingStatus } from '../../constants';

export default function MyBookingDetailPage() {
  const { code } = useParams<{ code: string }>();
  const { store, addToast } = useStore();
  const navigate = useNavigate();

  const bookingCode = code || 'ODD-DEMO-0002';
  const booking = store.getBooking(bookingCode) || store.getAllBookings()[0];

  const [currentStatus, setCurrentStatus] = useState<BookingStatus>(booking?.status || 'PENDING');
  const [testScenario, setTestScenario] = useState<'normal' | 'cancel_success' | 'cancel_fail'>('normal');

  const handleScenarioChange = (scenario: 'normal' | 'cancel_success' | 'cancel_fail') => {
    setTestScenario(scenario);
    if (scenario === 'normal') {
      setCurrentStatus('PENDING');
    } else if (scenario === 'cancel_success') {
      setCurrentStatus('CANCELLED');
      addToast('Mô phỏng hủy đơn thành công (TC-08) -> Chuyển sang CANCELLED', 'warn');
    } else if (scenario === 'cancel_fail') {
      setCurrentStatus('CHECKED_IN');
      addToast('Mô phỏng trạng thái CHECKED_IN -> Từ chối hủy đơn theo quy tắc BR-07', 'error');
    }
  };

  const handleCancel = () => {
    if (['CHECKED_IN', 'COMPLETED'].includes(currentStatus)) {
      addToast('Từ chối hủy đơn: Khách đã nhận phòng hoặc đã hoàn tất lưu trú (BR-07 / TC-09)!', 'error');
      return;
    }

    if (window.confirm(`Bạn có chắc chắn muốn hủy đơn #${bookingCode}?`)) {
      const res = store.cancelBooking(bookingCode);
      if (res.success) {
        setCurrentStatus('CANCELLED');
        addToast(`Đã hủy thành công đơn #${bookingCode} (TC-08)`, 'success');
      } else {
        addToast(res.message || 'Lỗi khi hủy đơn', 'error');
      }
    }
  };

  return (
    <div style={{ maxWidth: 1000, margin: '1.5rem auto', padding: '0 1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
        <Breadcrumb
          items={[
            { label: 'Trang chủ', to: '/' },
            { label: 'Đơn của tôi', to: '/my-bookings' },
            { label: `Chi tiết đơn #${bookingCode}` },
          ]}
        />
        <UCTag>
          <Diagram3 /> UC-04 · Quản lý đơn của khách
        </UCTag>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
          <h1 className="page-title" style={{ margin: 0 }}>
            Đơn #{bookingCode}
          </h1>
          <span className={`badge ${BADGE_CLASS[currentStatus] || 'badge-pending'}`} style={{ fontSize: '0.9rem', padding: '0.4rem 0.9rem' }}>
            <HourglassSplit /> {currentStatus}
          </span>
        </div>
        <span className="muted" style={{ fontSize: '0.85rem' }}>
          <ClockHistory /> Ngày tạo: {booking?.createdAt || '02/01/2027'}
        </span>
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
          Kịch bản kiểm thử UC-04:
        </span>
        <div className="btn-group">
          <button
            type="button"
            className={`btn btn-sm ${testScenario === 'normal' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => handleScenarioChange('normal')}
          >
            Đơn đang chờ duyệt (TC-07)
          </button>
          <button
            type="button"
            className={`btn btn-sm ${testScenario === 'cancel_success' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => handleScenarioChange('cancel_success')}
          >
            Hủy đơn thành công (TC-08)
          </button>
          <button
            type="button"
            className={`btn btn-sm ${testScenario === 'cancel_fail' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => handleScenarioChange('cancel_fail')}
          >
            Đã check-in / Từ chối hủy (TC-09)
          </button>
        </div>
      </div>

      {/* State Machine Steps */}
      <div className="panel" style={{ marginBottom: '1.5rem', padding: '1.25rem 1.5rem' }}>
        <span className="muted" style={{ fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em', display: 'block', marginBottom: '0.75rem' }}>
          Tiến trình vòng đời đơn theo State Machine (Mục 3.3.4)
        </span>
        <div className="steps">
          <span className={`step ${currentStatus === 'PENDING' ? 'current' : 'done'}`}>1. PENDING (Đang chờ)</span>
          <span className="sep">›</span>
          <span className={`step ${currentStatus === 'CONFIRMED' ? 'current' : ['CHECKED_IN', 'COMPLETED'].includes(currentStatus) ? 'done' : ''}`}>2. CONFIRMED (Đã xác nhận)</span>
          <span className="sep">›</span>
          <span className={`step ${currentStatus === 'CHECKED_IN' ? 'current' : currentStatus === 'COMPLETED' ? 'done' : ''}`}>3. CHECKED_IN (Đang ở)</span>
          <span className="sep">›</span>
          <span className={`step ${currentStatus === 'COMPLETED' ? 'current' : ''}`}>4. COMPLETED (Hoàn thành)</span>
        </div>
      </div>

      {currentStatus === 'CANCELLED' && (
        <Alert type="warn" title="Đơn đặt phòng này đã bị hủy">
          <p style={{ margin: '0.25rem 0 0', fontSize: '0.88rem' }}>
            Đơn lưu trú đã kết thúc ở trạng thái CANCELLED. Khoảng ngày tương ứng đã được giải phóng trên lịch phòng.
          </p>
        </Alert>
      )}

      {currentStatus === 'CHECKED_IN' && (
        <Alert type="info" title="Khách đang trong kỳ lưu trú (CHECKED_IN)">
          <p style={{ margin: '0.25rem 0 0', fontSize: '0.88rem' }}>
            Theo quy tắc bảo đảm BR-07: Không cho phép hủy đơn khi đã nhận phòng.
          </p>
        </Alert>
      )}

      <div className="layout-side" style={{ marginTop: '1.5rem' }}>
        {/* Left Column: Stay Info */}
        <section className="panel">
          <h2 style={{ fontSize: '1.2rem', marginTop: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CalendarCheck className="text-brand" /> Thông tin kỳ lưu trú chi tiết
          </h2>

          <table style={{ width: '100%' }}>
            <tbody>
              <tr>
                <th style={{ width: '38%', padding: '0.75rem', borderBottom: '1px solid var(--line)' }}>Cơ sở lưu trú</th>
                <td style={{ padding: '0.75rem', borderBottom: '1px solid var(--line)' }}>
                  <strong>{booking?.propertyName || 'ODauDay Stay Hồ Tây'}</strong>
                </td>
              </tr>
              <tr>
                <th style={{ padding: '0.75rem', borderBottom: '1px solid var(--line)' }}>Hạng phòng</th>
                <td style={{ padding: '0.75rem', borderBottom: '1px solid var(--line)' }}>
                  {booking?.roomName || 'Phòng Garden'}
                </td>
              </tr>
              <tr>
                <th style={{ padding: '0.75rem', borderBottom: '1px solid var(--line)' }}>Thời gian lưu trú</th>
                <td style={{ padding: '0.75rem', borderBottom: '1px solid var(--line)' }}>
                  {booking?.checkIn} (Check-in 14:00) → {booking?.checkOut} (Check-out 12:00) · <strong>{booking?.nights} đêm</strong>
                </td>
              </tr>
              <tr>
                <th style={{ padding: '0.75rem', borderBottom: '1px solid var(--line)' }}>Số lượng khách</th>
                <td style={{ padding: '0.75rem', borderBottom: '1px solid var(--line)' }}>
                  {booking?.guests} người lớn
                </td>
              </tr>
              <tr>
                <th style={{ padding: '0.75rem', borderBottom: '1px solid var(--line)' }}>Người đại diện đặt</th>
                <td style={{ padding: '0.75rem', borderBottom: '1px solid var(--line)' }}>
                  {booking?.guestName} · {booking?.guestPhone}
                </td>
              </tr>
              <tr>
                <th style={{ padding: '0.75rem' }}>Phương thức thanh toán</th>
                <td style={{ padding: '0.75rem' }}>Thanh toán trực tiếp khi nhận phòng (COD)</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Right Column: Actions & Price Snapshot */}
        <aside>
          <div className="panel" style={{ boxShadow: 'var(--shadow-lg)' }}>
            <h3 style={{ fontSize: '1.15rem', marginTop: 0, marginBottom: '1rem', borderBottom: '1px solid var(--line)', paddingBottom: '0.75rem' }}>
              Giá snapshot (BR-05)
            </h3>

            <div style={{ marginBottom: '1.25rem' }}>
              <span className="muted" style={{ fontSize: '0.85rem' }}>
                Tổng tiền đã chốt:
              </span>
              <p className="card-price" style={{ fontSize: '1.75rem', margin: '0.25rem 0 0' }}>
                {formatVND(booking?.total || 1300000)}
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {(currentStatus === 'PENDING' || currentStatus === 'CONFIRMED') && (
                <button
                  type="button"
                  className="btn btn-outline btn-block"
                  style={{ color: '#dc2626', borderColor: '#fca5a5', padding: '0.75rem' }}
                  onClick={handleCancel}
                >
                  <XCircle /> Hủy đặt phòng (TC-08)
                </button>
              )}

              {currentStatus === 'COMPLETED' && !booking?.isReviewed && (
                <Link
                  to={`/review?bookingCode=${bookingCode}`}
                  className="btn btn-primary btn-block"
                  style={{ padding: '0.75rem' }}
                >
                  <PencilSquare /> Viết đánh giá sau lưu trú (UC-05)
                </Link>
              )}

              <Link to="/my-bookings" className="btn btn-outline btn-block" style={{ padding: '0.75rem' }}>
                Quay lại danh sách đơn
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
