// Airbnb-Inspired Booking Checkout Page (Standardized Components)
import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useStore } from '../../contexts/StoreContext';
import {
  Breadcrumb,
  Alert,
  InputField,
  Button,
  Card,
  Badge,
} from '../../components';
import { formatVND } from '../../constants';
import {
  ChevronLeft,
  StarFill,
  CreditCard,
  CashCoin,
  ShieldCheck,
  CalendarCheck,
} from 'react-bootstrap-icons';

export default function BookingQuotePage() {
  const [searchParams] = useSearchParams();
  const { store, currentUser, addToast } = useStore();
  const navigate = useNavigate();

  const propertyId = Number(searchParams.get('propertyId')) || 1;
  const roomId = Number(searchParams.get('roomId')) || 1;

  const [checkIn] = useState(searchParams.get('in') || '2027-01-10');
  const [checkOut] = useState(searchParams.get('out') || '2027-01-12');
  const [guests] = useState(searchParams.get('guests') || '2');
  const [guestName, setGuestName] = useState(currentUser?.fullName || 'Khách thuê');
  const [guestPhone, setGuestPhone] = useState(currentUser?.phone || '0900000003');
  const [guestEmail, setGuestEmail] = useState(currentUser?.email || 'guest@odauday.vn');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bank'>('cod');

  const property = store.getProperty(propertyId) || store.getProperty(1)!;
  const room = store.getAllRooms().find(r => r.id === roomId) || store.getAllRooms()[0];

  // Live price quote calculation
  const quote = store.calculateQuote(room.id, checkIn, checkOut, guests);

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
      addToast('Đặt phòng thành công!', 'success');
      navigate(`/booking-success?code=${res.booking?.code}`);
    }
  };

  return (
    <div style={{ maxWidth: 1080, margin: '2rem auto 4rem', padding: '0 1.5rem' }}>
      {/* Back button and page title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <Button
          variant="outline"
          size="sm"
          icon={<ChevronLeft />}
          onClick={() => navigate(-1)}
          aria-label="Quay lại"
        />
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, margin: 0, color: '#1E293B' }}>
          Yêu cầu đặt phòng / chỗ ở
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(340px, 400px)', gap: '3rem', alignItems: 'start' }}>
          {/* Left Column: Guest Trip & Contact Details */}
          <div>
            {/* Warning if room conflict or capacity issue */}
            {!quote.success && (
              <div style={{ marginBottom: '1.5rem' }}>
                <Alert type="error" title="Không thể đặt phòng với thông tin này">
                  <p style={{ margin: 0, fontSize: '0.9rem' }}>{quote.message}</p>
                </Alert>
              </div>
            )}

            {/* Trip details */}
            <Card title="Chuyến đi của bạn" style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', borderBottom: '1px solid #F1F5F9', paddingBottom: '1rem' }}>
                <div>
                  <strong style={{ display: 'block', fontSize: '0.98rem', color: '#1E293B' }}>Ngày lưu trú</strong>
                  <span style={{ color: '#64748B', fontSize: '0.9rem' }}>
                    {checkIn} – {checkOut} ({quote.nights || 2} đêm)
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <strong style={{ display: 'block', fontSize: '0.98rem', color: '#1E293B' }}>Số lượng khách</strong>
                  <span style={{ color: '#64748B', fontSize: '0.9rem' }}>
                    {guests} khách (Sức chứa tối đa: {room.capacity} khách)
                  </span>
                </div>
              </div>
            </Card>

            {/* Contact details */}
            <Card title="Thông tin người đại diện đặt phòng" style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <InputField
                  id="checkout-name"
                  label="Họ và tên"
                  required
                  value={guestName}
                  onChange={e => setGuestName(e.target.value)}
                />
                <InputField
                  id="checkout-phone"
                  label="Số điện thoại"
                  required
                  value={guestPhone}
                  onChange={e => setGuestPhone(e.target.value)}
                />
              </div>

              <InputField
                id="checkout-email"
                type="email"
                label="Email nhận phiếu xác nhận"
                required
                value={guestEmail}
                onChange={e => setGuestEmail(e.target.value)}
              />
            </Card>

            {/* Payment Method */}
            <Card title="Phương thức thanh toán" style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1rem 1.25rem',
                    border: paymentMethod === 'cod' ? '2px solid #222222' : '1px solid #E2E8F0',
                    borderRadius: 14,
                    cursor: 'pointer',
                    background: paymentMethod === 'cod' ? '#F8FAFC' : '#ffffff',
                    transition: 'border 0.2s ease',
                  }}
                >
                  <input
                    type="radio"
                    name="pay"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                  />
                  <CashCoin style={{ fontSize: '1.4rem', color: '#059669' }} />
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.95rem', color: '#1E293B' }}>
                      Thanh toán khi nhận phòng (COD)
                    </strong>
                    <span style={{ fontSize: '0.82rem', color: '#64748B' }}>
                      Thanh toán trực tiếp cho chủ nhà khi bạn làm thủ tục nhận phòng.
                    </span>
                  </div>
                </label>

                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1rem 1.25rem',
                    border: paymentMethod === 'bank' ? '2px solid #222222' : '1px solid #E2E8F0',
                    borderRadius: 14,
                    cursor: 'pointer',
                    background: paymentMethod === 'bank' ? '#F8FAFC' : '#ffffff',
                    transition: 'border 0.2s ease',
                  }}
                >
                  <input
                    type="radio"
                    name="pay"
                    checked={paymentMethod === 'bank'}
                    onChange={() => setPaymentMethod('bank')}
                  />
                  <CreditCard style={{ fontSize: '1.4rem', color: '#E11D48' }} />
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.95rem', color: '#1E293B' }}>
                      Chuyển khoản qua mã QR (VietQR)
                    </strong>
                    <span style={{ fontSize: '0.82rem', color: '#64748B' }}>
                      Chuyển khoản tức thì sau khi nhận được thông báo xác nhận từ chủ nhà.
                    </span>
                  </div>
                </label>
              </div>
            </Card>

            {/* Cancellation Policy */}
            <Card title="Chính sách hủy phòng" style={{ marginBottom: '2rem' }}>
              <p style={{ color: '#64748B', fontSize: '0.92rem', lineHeight: 1.6, margin: 0 }}>
                Hủy miễn phí trước 48 giờ so với thời điểm nhận phòng. Sau thời gian này, việc hủy phòng sẽ tuân theo thỏa thuận trực tiếp cùng chủ nhà.
              </p>
            </Card>

            {/* Submit Button */}
            <div>
              <p style={{ fontSize: '0.8rem', color: '#64748B', lineHeight: 1.6, marginBottom: '1rem' }}>
                Bằng cách chọn nút bên dưới, bạn đồng ý với Nội quy nhà của Chủ nhà, Các quy tắc nền tảng của ODauDay Stay và Điều khoản dịch vụ.
              </p>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={!quote.success}
                icon={<CalendarCheck />}
              >
                Xác nhận và đặt phòng
              </Button>
            </div>
          </div>

          {/* Right Column: Sticky Summary Card */}
          <aside>
            <div style={{ position: 'sticky', top: '6rem' }}>
              <Card variant="elevated">
                {/* Property summary */}
                <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '1.25rem', marginBottom: '1.25rem' }}>
                  <img
                    src={property.image}
                    alt={property.name}
                    style={{ width: 100, height: 90, borderRadius: 10, objectFit: 'cover' }}
                  />
                  <div>
                    <span style={{ fontSize: '0.8rem', color: '#64748B', display: 'block' }}>
                      {property.type} · {property.city}
                    </span>
                    <strong style={{ fontSize: '0.98rem', display: 'block', margin: '0.2rem 0', color: '#1E293B' }}>
                      {property.name}
                    </strong>
                    <span style={{ fontSize: '0.85rem', color: '#475569' }}>
                      Hạng phòng: {room.name}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.82rem', marginTop: '0.25rem' }}>
                      <StarFill style={{ fontSize: '0.75rem', color: '#E11D48' }} />
                      <span style={{ fontWeight: 700 }}>{property.rating ? property.rating.toFixed(2) : '4.95'}</span>
                      <span style={{ color: '#64748B' }}>(18 đánh giá)</span>
                    </div>
                  </div>
                </div>

                {/* AirCover Included */}
                <div style={{ borderBottom: '1px solid #E2E8F0', paddingBottom: '1.25rem', marginBottom: '1.25rem' }}>
                  <Badge variant="brand" dot icon={<ShieldCheck />}>
                    Bảo đảm với ODauDay Cover
                  </Badge>
                </div>

                {/* Price Details */}
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 1rem', color: '#1E293B' }}>Chi tiết giá</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.92rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#475569' }}>
                      {formatVND(room.price)} × {quote.nights || 2} đêm
                    </span>
                    <span style={{ fontWeight: 600 }}>{formatVND(quote.subtotal || room.price * 2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#475569' }}>Phí dịch vụ ODauDay Stay</span>
                    <span style={{ color: '#059669', fontWeight: 600 }}>0₫ (Miễn phí)</span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      borderTop: '1px solid #E2E8F0',
                      paddingTop: '0.85rem',
                      fontWeight: 800,
                      fontSize: '1.1rem',
                    }}
                  >
                    <span>Tổng tiền (VND)</span>
                    <span style={{ color: 'var(--airbnb-pink)' }}>{formatVND(quote.total || room.price * 2)}</span>
                  </div>
                </div>
              </Card>
            </div>
          </aside>
        </div>
      </form>
    </div>
  );
}
