// UC-03: Booking Success Page (TypeScript)
import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useStore } from '../../contexts/StoreContext';
import { UCTag, Breadcrumb } from '../../components/UI';
import { formatVND } from '../../constants';
import {
  Diagram3,
  CheckCircleFill,
  HourglassSplit,
  HouseDoorFill,
  BagCheckFill,
  InfoCircle,
} from 'react-bootstrap-icons';

export default function BookingSuccessPage() {
  const [searchParams] = useSearchParams();
  const { store } = useStore();

  const code = searchParams.get('code') || 'ODD-DEMO-0002';
  const booking = store.getBooking(code) || store.getAllBookings()[0];

  return (
    <div style={{ maxWidth: 840, margin: '1.5rem auto', padding: '0 1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
        <Breadcrumb items={[{ label: 'Trang chủ', to: '/' }, { label: 'Xác nhận đặt phòng thành công' }]} />
        <UCTag>
          <Diagram3 /> UC-03 · Đặt phòng
        </UCTag>
      </div>

      {/* Steps */}
      <div className="steps" style={{ marginBottom: '2rem' }}>
        <span className="step done">1. Báo giá</span>
        <span className="sep">›</span>
        <span className="step done">2. Xác nhận</span>
        <span className="sep">›</span>
        <span className="step current">3. Giữ chỗ thành công</span>
      </div>

      <section className="panel" style={{ boxShadow: 'var(--shadow-lg)' }}>
        <div className="alert alert-ok" role="status" style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', padding: '1.25rem 1.5rem' }}>
          <CheckCircleFill className="text-ok" style={{ fontSize: '2rem', lineHeight: 1 }} />
          <div>
            <strong style={{ margin: '0 0 0.35rem', fontSize: '1.15rem', display: 'block' }}>
              Đã tạo thành công đơn đặt phòng (TC-04)
            </strong>
            <span style={{ fontSize: '0.92rem', lineHeight: 1.6, display: 'block', color: 'var(--ink-secondary)' }}>
              Yêu cầu lưu trú của bạn đã được ghi nhận vào cơ sở dữ liệu và đang chờ chủ nhà xem xét phê duyệt.
            </span>
          </div>
        </div>

        {/* Order Code Banner */}
        <div
          style={{
            background: 'var(--brand-soft)',
            border: '1.5px dashed var(--brand)',
            padding: '1.25rem 1.5rem',
            borderRadius: 12,
            margin: '1.5rem 0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>
            <span className="muted" style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700, display: 'block' }}>
              MÃ ĐƠN HÀNG (BOOKING CODE)
            </span>
            <p style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--brand-dark)', margin: '0.25rem 0 0', letterSpacing: '0.04em', fontFamily: 'monospace' }}>
              {booking?.code || code}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span className="badge badge-pending" style={{ fontSize: '0.85rem', padding: '0.4rem 0.9rem' }}>
              <HourglassSplit /> TRẠNG THÁI: {booking?.status || 'PENDING'}
            </span>
            <span className="muted" style={{ display: 'block', fontSize: '0.78rem', marginTop: '0.35rem' }}>
              Chờ chủ nhà xác nhận
            </span>
          </div>
        </div>

        <h3 style={{ fontSize: '1.1rem', margin: '1.5rem 0 0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <InfoCircle className="text-brand" /> Chi tiết phiếu xác nhận đặt chỗ
        </h3>

        <table style={{ width: '100%', marginBottom: '1.5rem' }}>
          <tbody>
            <tr>
              <th style={{ width: '38%', padding: '0.75rem', borderBottom: '1px solid var(--line)' }}>Cơ sở lưu trú &amp; Hạng phòng</th>
              <td style={{ padding: '0.75rem', borderBottom: '1px solid var(--line)' }}>
                <strong>{booking?.propertyName || 'ODauDay Stay Hồ Tây'}</strong> · {booking?.roomName || 'Phòng Garden'}
              </td>
            </tr>
            <tr>
              <th style={{ padding: '0.75rem', borderBottom: '1px solid var(--line)' }}>Thời gian lưu trú</th>
              <td style={{ padding: '0.75rem', borderBottom: '1px solid var(--line)' }}>
                {booking?.checkIn} → {booking?.checkOut} <strong>({booking?.nights} đêm lưu trú)</strong>
              </td>
            </tr>
            <tr>
              <th style={{ padding: '0.75rem', borderBottom: '1px solid var(--line)' }}>Thời gian check-in / check-out</th>
              <td style={{ padding: '0.75rem', borderBottom: '1px solid var(--line)' }}>
                Nhận phòng từ 14:00 · Trả phòng trước 12:00 trưa
              </td>
            </tr>
            <tr>
              <th style={{ padding: '0.75rem', borderBottom: '1px solid var(--line)' }}>Số lượng khách đăng ký</th>
              <td style={{ padding: '0.75rem', borderBottom: '1px solid var(--line)' }}>
                {booking?.guests} người lớn (Tuân thủ sức chứa BR-02)
              </td>
            </tr>
            <tr>
              <th style={{ padding: '0.75rem', borderBottom: '1px solid var(--line)' }}>Tổng tiền đã snapshot</th>
              <td style={{ padding: '0.75rem', borderBottom: '1px solid var(--line)' }}>
                <span className="card-price" style={{ fontSize: '1.35rem' }}>
                  {formatVND(booking?.total || 1300000)}
                </span>{' '}
                <small className="muted">(Cố định theo BR-05)</small>
              </td>
            </tr>
            <tr>
              <th style={{ padding: '0.75rem' }}>Người đại diện đặt phòng</th>
              <td style={{ padding: '0.75rem' }}>
                {booking?.guestName} · {booking?.guestPhone}
              </td>
            </tr>
          </tbody>
        </table>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1.5rem', flexWrap: 'wrap' }}>
          <Link to="/my-bookings" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
            <BagCheckFill /> Quản lý đơn của tôi (UC-04)
          </Link>
          <Link to="/" className="btn btn-outline" style={{ padding: '0.75rem 1.5rem' }}>
            <HouseDoorFill /> Về trang chủ
          </Link>
        </div>
      </section>
    </div>
  );
}
