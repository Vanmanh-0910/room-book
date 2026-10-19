// Airbnb-Inspired Booking Success / Confirmation Page (TypeScript)
import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useStore } from '../../contexts/StoreContext';
import { formatVND } from '../../constants';
import {
  CheckCircleFill,
  CalendarCheck,
  GeoAltFill,
  HouseDoor,
  BagCheck,
  ShieldCheck,
} from 'react-bootstrap-icons';

export default function BookingSuccessPage() {
  const [searchParams] = useSearchParams();
  const { store } = useStore();

  const code = searchParams.get('code') || 'ODD-DEMO-0002';
  const booking = store.getBooking(code) || store.getAllBookings()[0];

  return (
    <div style={{ maxWidth: 720, margin: '3rem auto 5rem', padding: '0 1.5rem' }}>
      {/* Success Hero Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: 'var(--radius-full)',
            background: '#ecfdf5',
            color: '#059669',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2.5rem',
            margin: '0 auto 1.25rem',
          }}
        >
          <CheckCircleFill />
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 0.5rem', color: 'var(--ink)' }}>
          Đặt phòng thành công!
        </h1>
        <p style={{ color: 'var(--ink-secondary)', fontSize: '1.05rem', margin: 0 }}>
          Yêu cầu lưu trú của bạn đã được gửi tới chủ nhà và đang được giữ chỗ an toàn.
        </p>
      </div>

      {/* Confirmation Receipt Card */}
      <div
        style={{
          border: '1px solid var(--line)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-card)',
          background: '#ffffff',
          overflow: 'hidden',
          marginBottom: '2rem',
        }}
      >
        {/* Code Header Bar */}
        <div
          style={{
            background: 'var(--surface-alt)',
            padding: '1.25rem 1.75rem',
            borderBottom: '1px solid var(--line)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--ink-secondary)' }}>
              Mã xác nhận đặt phòng
            </span>
            <p style={{ margin: '0.2rem 0 0', fontSize: '1.4rem', fontWeight: 800, fontFamily: 'monospace', color: 'var(--ink)' }}>
              {booking?.code || code}
            </p>
          </div>
          <span
            style={{
              background: '#fef3c7',
              color: '#92400e',
              padding: '0.35rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.82rem',
              fontWeight: 700,
            }}
          >
            Trạng thái: Chờ chủ nhà duyệt
          </span>
        </div>

        {/* Details Table */}
        <div style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--line)', paddingBottom: '1rem' }}>
              <span style={{ color: 'var(--ink-secondary)', fontSize: '0.92rem' }}>Chỗ ở & Hạng phòng</span>
              <div style={{ textAlign: 'right' }}>
                <strong style={{ fontSize: '0.98rem', display: 'block' }}>
                  {booking?.propertyName || 'ODauDay Stay'}
                </strong>
                <span style={{ fontSize: '0.85rem', color: 'var(--ink-secondary)' }}>
                  {booking?.roomName || 'Phòng nghỉ dưỡng'}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--line)', paddingBottom: '1rem' }}>
              <span style={{ color: 'var(--ink-secondary)', fontSize: '0.92rem' }}>Thời gian lưu trú</span>
              <div style={{ textAlign: 'right' }}>
                <strong style={{ fontSize: '0.95rem', display: 'block' }}>
                  {booking?.checkIn} → {booking?.checkOut}
                </strong>
                <span style={{ fontSize: '0.85rem', color: 'var(--ink-secondary)' }}>
                  {booking?.nights} đêm · Nhận phòng từ 14:00
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--line)', paddingBottom: '1rem' }}>
              <span style={{ color: 'var(--ink-secondary)', fontSize: '0.92rem' }}>Số lượng khách</span>
              <span style={{ fontWeight: 600 }}>{booking?.guests} khách</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--line)', paddingBottom: '1rem' }}>
              <span style={{ color: 'var(--ink-secondary)', fontSize: '0.92rem' }}>Người liên hệ</span>
              <span style={{ fontWeight: 600 }}>{booking?.guestName} ({booking?.guestPhone})</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingTop: '0.25rem' }}>
              <span style={{ fontSize: '1.05rem', fontWeight: 700 }}>Tổng số tiền thanh toán</span>
              <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--airbnb-pink)' }}>
                {formatVND(booking?.total || 1300000)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link
          to="/my-bookings"
          className="btn btn-primary"
          style={{
            padding: '0.85rem 1.75rem',
            fontWeight: 700,
            fontSize: '0.95rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <BagCheck />
          <span>Xem chuyến đi của bạn</span>
        </Link>

        <Link
          to="/"
          className="btn btn-outline"
          style={{
            padding: '0.85rem 1.75rem',
            fontWeight: 700,
            fontSize: '0.95rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <HouseDoor />
          <span>Khám phá thêm chỗ ở</span>
        </Link>
      </div>
    </div>
  );
}
