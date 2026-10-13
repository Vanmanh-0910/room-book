// UC-03: Booking Quote & Checkout Page (TypeScript)
import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useStore } from '../../contexts/StoreContext';
import { UCTag, Breadcrumb, Alert } from '../../components/UI';
import { formatVND } from '../../constants';
import {
  Diagram3,
  CalendarCheck,
  PeopleFill,
  PersonFill,
  Telephone,
  ShieldCheck,
  CreditCard,
  Building,
  DoorOpen,
  PatchCheckFill,
} from 'react-bootstrap-icons';

export default function BookingQuotePage() {
  const [searchParams] = useSearchParams();
  const { store, currentUser, addToast } = useStore();
  const navigate = useNavigate();

  const propertyId = Number(searchParams.get('propertyId')) || 1;
  const roomId = Number(searchParams.get('roomId')) || 1;

  const [checkIn, setCheckIn] = useState(searchParams.get('in') || '2027-01-10');
  const [checkOut, setCheckOut] = useState(searchParams.get('out') || '2027-01-12');
  const [guests, setGuests] = useState(searchParams.get('guests') || '2');
  const [guestName, setGuestName] = useState(currentUser?.fullName || 'Khách thuê Demo');
  const [guestPhone, setGuestPhone] = useState(currentUser?.phone || '0900000003');
  const [guestEmail, setGuestEmail] = useState(currentUser?.email || 'guest@odauday.vn');
  const [testScenario, setTestScenario] = useState<'tc04' | 'tc05' | 'tc06'>('tc04');

  const property = store.getProperty(propertyId) || store.getProperty(1)!;
  const room = store.getAllRooms().find(r => r.id === roomId) || store.getAllRooms()[0];

  // Calculate live quote
  const quote = store.calculateQuote(room.id, checkIn, checkOut, guests);

  const handleScenarioChange = (scenario: 'tc04' | 'tc05' | 'tc06') => {
    setTestScenario(scenario);
    if (scenario === 'tc04') {
      setCheckIn('2027-01-10');
      setCheckOut('2027-01-12');
      setGuests('2');
    } else if (scenario === 'tc05') {
      // Room 2 (Phòng Family) has a roomBlock 2027-02-10 -> 2027-02-12
      setCheckIn('2027-02-10');
      setCheckOut('2027-02-12');
      setGuests('2');
    } else if (scenario === 'tc06') {
      // Exceed room capacity (Room 1 has capacity 2, guest picks 5)
      setCheckIn('2027-01-10');
      setCheckOut('2027-01-12');
      setGuests('5');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const res = store.createBooking({
      roomId: room.id,
      checkIn,
      checkOut,
      guests,
      guestName,
      guestPhone,
      guestEmail,
    });

    if (!res.success) {
      addToast(res.message || 'Lỗi khi tạo đơn đặt phòng.', 'error');
    } else {
      addToast('Đặt phòng thành công (TC-04)!', 'success');
      navigate(`/booking-success?code=${res.booking?.code}`);
    }
  };

  return (
    <main>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
        <Breadcrumb
          items={[
            { label: 'Trang chủ', to: '/' },
            { label: property.name, to: `/property/${property.id}` },
            { label: 'Báo giá & Xác nhận lưu trú' },
          ]}
        />
        <UCTag>
          <Diagram3 /> UC-03 · Báo giá &amp; Đặt phòng
        </UCTag>
      </div>

      <h1 className="page-title" style={{ marginBottom: '1rem' }}>
        Xác nhận thông tin &amp; Báo giá lưu trú
      </h1>

      {/* Progress Steps */}
      <div className="steps" style={{ marginBottom: '1.75rem' }}>
        <span className="step current">1. Báo giá chi tiết</span>
        <span className="sep">›</span>
        <span className="step">2. Xác nhận thông tin</span>
        <span className="sep">›</span>
        <span className="step">3. Hoàn tất giữ chỗ</span>
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
          Kịch bản kiểm thử UC-03:
        </span>
        <div className="btn-group">
          <button
            type="button"
            className={`btn btn-sm ${testScenario === 'tc04' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => handleScenarioChange('tc04')}
          >
            Báo giá hợp lệ (TC-04)
          </button>
          <button
            type="button"
            className={`btn btn-sm ${testScenario === 'tc05' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => handleScenarioChange('tc05')}
          >
            Trùng lịch bảo trì (TC-05)
          </button>
          <button
            type="button"
            className={`btn btn-sm ${testScenario === 'tc06' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => handleScenarioChange('tc06')}
          >
            Vượt quá sức chứa BR-02 (TC-06)
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="layout-side">
          {/* Left Form: Customer & Stay Details */}
          <div>
            {/* Conflict or Capacity Exceeded Alerts */}
            {!quote.success && quote.code === 'ROOM_CONFLICT' && (
              <div className="panel" style={{ borderLeft: '4px solid var(--danger)', marginBottom: '1.5rem' }}>
                <Alert type="error" title="Từ chối báo giá: Xung đột lịch phòng (BR-04 / TC-05)">
                  <p style={{ margin: '0.35rem 0 0', lineHeight: 1.6 }}>{quote.message}</p>
                </Alert>
              </div>
            )}

            {!quote.success && quote.code === 'CAPACITY_EXCEEDED' && (
              <div className="panel" style={{ borderLeft: '4px solid var(--danger)', marginBottom: '1.5rem' }}>
                <Alert type="error" title="Từ chối báo giá: Vượt quá sức chứa tối đa (BR-06 / TC-06)">
                  <p style={{ margin: '0.35rem 0 0', lineHeight: 1.6 }}>{quote.message}</p>
                </Alert>
              </div>
            )}

            <section className="panel" style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.2rem', marginTop: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CalendarCheck className="text-brand" /> Thời gian &amp; Số lượng khách
              </h2>

              <div className="row">
                <div className="field">
                  <label htmlFor="quote-in">Ngày nhận phòng (Check-in 14:00) *</label>
                  <input
                    id="quote-in"
                    type="date"
                    value={checkIn}
                    onChange={e => setCheckIn(e.target.value)}
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor="quote-out">Ngày trả phòng (Check-out 12:00) *</label>
                  <input
                    id="quote-out"
                    type="date"
                    value={checkOut}
                    onChange={e => setCheckOut(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="field">
                <label htmlFor="quote-guests">
                  <PeopleFill /> Số lượng khách lưu trú *
                </label>
                <input
                  id="quote-guests"
                  type="number"
                  min="1"
                  max="10"
                  value={guests}
                  onChange={e => setGuests(e.target.value)}
                  required
                />
              </div>

              <div style={{ background: '#f0fdfa', border: '1px solid #ccfbf1', padding: '0.85rem 1rem', borderRadius: 8, marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <ShieldCheck className="text-brand" />
                <span style={{ fontSize: '0.85rem', color: '#0f766e' }}>
                  <strong>{room.name}:</strong> Sức chứa tối đa {room.capacity} khách. Tuân thủ quy tắc BR-02 bảo đảm an toàn nghỉ dưỡng.
                </span>
              </div>
            </section>

            <section className="panel">
              <h2 style={{ fontSize: '1.2rem', marginTop: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <PersonFill className="text-brand" /> Thông tin người đại diện đặt phòng
              </h2>

              <div className="row">
                <div className="field">
                  <label htmlFor="guest-name">Họ và tên người đặt *</label>
                  <input
                    id="guest-name"
                    value={guestName}
                    onChange={e => setGuestName(e.target.value)}
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor="guest-phone">Số điện thoại liên hệ *</label>
                  <input
                    id="guest-phone"
                    value={guestPhone}
                    onChange={e => setGuestPhone(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="field">
                <label htmlFor="guest-email">Email nhận hóa đơn xác nhận *</label>
                <input
                  id="guest-email"
                  type="email"
                  value={guestEmail}
                  onChange={e => setGuestEmail(e.target.value)}
                  required
                />
              </div>

              <div className="field">
                <label>Phương thức thanh toán</label>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500, cursor: 'pointer' }}>
                    <input type="radio" name="payment" defaultChecked /> Thanh toán trực tiếp khi nhận phòng (COD)
                  </label>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: Price Breakdown Snapshot */}
          <aside>
            <div className="panel" style={{ boxShadow: 'var(--shadow-lg)' }}>
              <h3 style={{ fontSize: '1.15rem', marginTop: 0, marginBottom: '1rem', borderBottom: '1px solid var(--line)', paddingBottom: '0.75rem' }}>
                Tóm tắt đơn đặt phòng
              </h3>

              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
                <div
                  style={{
                    width: 70,
                    height: 70,
                    borderRadius: 8,
                    backgroundImage: `url('${property.image}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    flexShrink: 0,
                  }}
                />
                <div>
                  <strong style={{ display: 'block', fontSize: '0.98rem' }}>{property.name}</strong>
                  <span className="muted" style={{ fontSize: '0.85rem' }}>
                    {room.name}
                  </span>
                  <span className="muted" style={{ display: 'block', fontSize: '0.78rem' }}>
                    {property.city}
                  </span>
                </div>
              </div>

              <table style={{ width: '100%', marginBottom: '1rem', fontSize: '0.9rem' }}>
                <tbody>
                  <tr>
                    <td className="muted">Số đêm lưu trú:</td>
                    <td style={{ textAlign: 'right', fontWeight: 600 }}>{quote.nights || 2} đêm</td>
                  </tr>
                  <tr>
                    <td className="muted">Đơn giá / đêm:</td>
                    <td style={{ textAlign: 'right' }}>{formatVND(room.price)}</td>
                  </tr>
                  <tr>
                    <td className="muted">Tiền phòng:</td>
                    <td style={{ textAlign: 'right' }}>{formatVND(quote.subtotal || room.price * 2)}</td>
                  </tr>
                  <tr>
                    <td className="muted">Phí dịch vụ:</td>
                    <td style={{ textAlign: 'right', color: '#059669' }}>0đ (Miễn phí)</td>
                  </tr>
                  <tr style={{ borderTop: '1px solid var(--line)', fontWeight: 800, fontSize: '1.1rem' }}>
                    <td style={{ paddingTop: '0.75rem' }}>Tổng thanh toán:</td>
                    <td style={{ textAlign: 'right', paddingTop: '0.75rem', color: 'var(--brand)' }}>
                      {formatVND(quote.total || room.price * 2)}
                    </td>
                  </tr>
                </tbody>
              </table>

              <button
                type="submit"
                className="btn btn-primary btn-block"
                disabled={!quote.success}
                style={{ padding: '0.85rem', fontSize: '1rem', fontWeight: 700 }}
              >
                Xác nhận đặt phòng (TC-04)
              </button>
              <p className="muted" style={{ textAlign: 'center', fontSize: '0.75rem', marginTop: '0.75rem', marginBottom: 0 }}>
                Bằng việc xác nhận, bạn đồng ý với chính sách lưu trú và quy tắc bảo đảm BR-05.
              </p>
            </div>
          </aside>
        </div>
      </form>
    </main>
  );
}
