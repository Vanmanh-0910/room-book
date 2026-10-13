// UC-02: Property Detail Page (TypeScript)
import React, { useState } from 'react';
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useStore } from '../../contexts/StoreContext';
import { UCTag, Breadcrumb, Alert, Badge } from '../../components/UI';
import { formatVND } from '../../constants';
import {
  Compass,
  GeoAltFill,
  StarFill,
  PatchCheckFill,
  Heart,
  Share,
  Wifi,
  Tv,
  CupHot,
  Snow,
  ShieldCheck,
  CalendarCheck,
  PeopleFill,
  DoorOpen,
  ArrowRight,
  ChatQuoteFill,
} from 'react-bootstrap-icons';

export default function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const { store } = useStore();
  const navigate = useNavigate();

  const propertyId = Number(id) || 1;
  const property = store.getProperty(propertyId) || store.getProperty(1)!;
  const rooms = store.getRoomsByProperty(property.id);
  const reviews = store.getReviewsByProperty(property.id);

  const [checkIn, setCheckIn] = useState(searchParams.get('in') || '2027-01-10');
  const [checkOut, setCheckOut] = useState(searchParams.get('out') || '2027-01-12');
  const [guests, setGuests] = useState(searchParams.get('guests') || '2');
  const [selectedRoomId, setSelectedRoomId] = useState<number>(rooms[0]?.id || 1);

  const selectedRoom = rooms.find(r => r.id === selectedRoomId) || rooms[0];

  const handleBookNow = (roomId?: number) => {
    const rId = roomId || selectedRoomId;
    const params = new URLSearchParams({
      propertyId: String(property.id),
      roomId: String(rId),
      in: checkIn,
      out: checkOut,
      guests,
    });
    navigate(`/booking-quote?${params.toString()}`);
  };

  const calculateNights = () => {
    const d1 = new Date(checkIn);
    const d2 = new Date(checkOut);
    if (d2 <= d1) return 1;
    return Math.max(1, Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24)));
  };

  const nights = calculateNights();
  const totalPrice = (selectedRoom?.price || property.priceMin) * nights;

  return (
    <main>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
        <Breadcrumb
          items={[
            { label: 'Trang chủ', to: '/' },
            { label: property.city, to: `/search?kw=${property.city}` },
            { label: property.name },
          ]}
        />
        <UCTag>
          <Compass /> UC-02 · Chi tiết chỗ ở &amp; phòng
        </UCTag>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '1.25rem' }}>
        <div>
          <h1 className="page-title" style={{ marginBottom: '0.4rem' }}>
            {property.name}
          </h1>
          <p className="page-sub" style={{ marginBottom: 0 }}>
            <GeoAltFill className="text-danger" /> <strong>{property.address}</strong> ·{' '}
            <StarFill style={{ color: '#f59e0b' }} /> <strong>{property.rating}</strong>{' '}
            <span className="muted">({reviews.length} đánh giá xác thực sau lưu trú)</span> ·{' '}
            <span className="badge badge-completed">
              <PatchCheckFill /> Homestay đã kiểm duyệt
            </span>
          </p>
        </div>
        <div className="btn-group">
          <button type="button" className="btn btn-outline btn-sm">
            <Heart /> Lưu yêu thích
          </button>
          <button type="button" className="btn btn-outline btn-sm">
            <Share /> Chia sẻ chỗ ở
          </button>
        </div>
      </div>

      {/* 5-Photo Collage Gallery */}
      <div className="gallery-collage" style={{ marginBottom: '2rem' }}>
        <div
          className="collage-item-main"
          style={{
            backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 60%), url('${property.image}')`,
          }}
        >
          <span
            style={{
              position: 'absolute',
              bottom: '1.25rem',
              left: '1.5rem',
              color: '#fff',
              fontWeight: 700,
              fontSize: '1.1rem',
              textShadow: '0 2px 4px rgba(0,0,0,0.8)',
            }}
          >
            Mặt trước chỗ ở &amp; Không gian chính
          </span>
        </div>
        <div
          className="collage-item"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80')`,
          }}
        >
          <span style={{ position: 'absolute', bottom: '0.75rem', left: '1rem', color: '#fff', fontWeight: 600, fontSize: '0.85rem' }}>
            Phòng ngủ cao cấp
          </span>
        </div>
        <div
          className="collage-item"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=600&q=80')`,
          }}
        >
          <span style={{ position: 'absolute', bottom: '0.75rem', left: '1rem', color: '#fff', fontWeight: 600, fontSize: '0.85rem' }}>
            Ban công thoáng đãng
          </span>
        </div>
        <div
          className="collage-item"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=600&q=80')`,
          }}
        >
          <span style={{ position: 'absolute', bottom: '0.75rem', left: '1rem', color: '#fff', fontWeight: 600, fontSize: '0.85rem' }}>
            Phòng sinh hoạt chung
          </span>
        </div>
        <div
          className="collage-item"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80')`,
          }}
        >
          <span style={{ position: 'absolute', bottom: '0.75rem', left: '1rem', color: '#fff', fontWeight: 600, fontSize: '0.85rem' }}>
            Khu bếp tiện nghi
          </span>
        </div>
      </div>

      {/* Main Content & Sticky Booking Widget */}
      <div className="layout-side">
        {/* Left Column: Details & Rooms */}
        <div>
          {/* Host Info */}
          <section className="panel" style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--line)', paddingBottom: '1.25rem', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: '50%',
                    background: 'var(--brand-gradient)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '1.2rem',
                  }}
                >
                  HD
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.15rem' }}>
                    Chủ nhà: <code>{property.owner}</code> <Badge variant="active">Siêu chủ nhà</Badge>
                  </h3>
                  <p className="muted" style={{ margin: '0.2rem 0 0', fontSize: '0.85rem' }}>
                    Tham gia từ 2026 · Tỉ lệ phản hồi 100% trong 1 giờ
                  </p>
                </div>
              </div>
              <span className="badge" style={{ background: '#f1f5f9', color: '#334155', padding: '0.4rem 0.85rem' }}>
                <ShieldCheck className="text-success" /> Danh tính đã xác minh
              </span>
            </div>

            <h2>Mô tả chỗ ở</h2>
            <p style={{ color: 'var(--ink-secondary)', fontSize: '1.02rem', lineHeight: 1.75, marginBottom: '1.5rem' }}>
              {property.desc}
            </p>

            <h3>Tiện ích nổi bật được cung cấp</h3>
            <div className="grid grid-3" style={{ marginTop: '1rem', gap: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: '#f8fafc', borderRadius: 8 }}>
                <Wifi className="text-primary" />
                <div>
                  <strong>Wifi tốc độ cao</strong>
                  <span className="muted" style={{ fontSize: '0.78rem', display: 'block' }}>
                    Băng thông 500Mbps
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: '#f8fafc', borderRadius: 8 }}>
                <Tv className="text-primary" />
                <div>
                  <strong>Smart TV 55 inch</strong>
                  <span className="muted" style={{ fontSize: '0.78rem', display: 'block' }}>
                    Netflix &amp; YouTube
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: '#f8fafc', borderRadius: 8 }}>
                <Snow className="text-primary" />
                <div>
                  <strong>Điều hòa 2 chiều</strong>
                  <span className="muted" style={{ fontSize: '0.78rem', display: 'block' }}>
                    Inverter tiết kiệm điện
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Rooms List */}
          <section className="panel" style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: 0 }}>
              <DoorOpen className="text-brand" /> Các hạng phòng hiện có ({rooms.length})
            </h2>
            <p className="page-sub" style={{ marginBottom: '1.25rem' }}>
              Chọn phòng phù hợp với số lượng thành viên trong đoàn lưu trú:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {rooms.map(room => (
                <div
                  key={room.id}
                  style={{
                    border: selectedRoomId === room.id ? '2px solid var(--brand)' : '1px solid var(--line)',
                    borderRadius: 12,
                    padding: '1.25rem',
                    background: selectedRoomId === room.id ? '#f0fdfa' : '#fff',
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <h3 style={{ margin: '0 0 0.35rem', fontSize: '1.2rem' }}>{room.name}</h3>
                      <p className="muted" style={{ margin: 0, fontSize: '0.88rem' }}>
                        {room.desc}
                      </p>
                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                        <span className="badge" style={{ background: '#f1f5f9', color: '#475569' }}>
                          <PeopleFill /> Sức chứa: {room.capacity} khách
                        </span>
                        <span className="badge badge-active">Sẵn sàng đón khách</span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span className="card-price" style={{ fontSize: '1.35rem', display: 'block' }}>
                        {formatVND(room.price)}
                      </span>
                      <span className="muted" style={{ fontSize: '0.78rem' }}>
                        / đêm
                      </span>
                      <div style={{ marginTop: '0.75rem' }}>
                        <button
                          type="button"
                          className={`btn ${selectedRoomId === room.id ? 'btn-primary' : 'btn-outline'} btn-sm`}
                          onClick={() => {
                            setSelectedRoomId(room.id);
                            handleBookNow(room.id);
                          }}
                        >
                          Chọn phòng này <ArrowRight />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Reviews Section */}
          <section className="panel">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.2rem' }}>
                <ChatQuoteFill className="text-brand" /> Đánh giá từ khách đã lưu trú ({reviews.length})
              </h2>
              <span className="badge badge-completed">100% Xác thực sau lưu trú</span>
            </div>

            {reviews.length === 0 ? (
              <p className="muted">Chưa có đánh giá nào cho chỗ ở này.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {reviews.map(rev => (
                  <div key={rev.id} style={{ borderBottom: '1px solid var(--line)', paddingBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                      <strong>{rev.guestName}</strong>
                      <span className="muted" style={{ fontSize: '0.8rem' }}>
                        {rev.date}
                      </span>
                    </div>
                    <div style={{ color: '#f59e0b', marginBottom: '0.4rem', fontSize: '0.9rem' }}>
                      {'★'.repeat(rev.rating)}
                    </div>
                    <p style={{ margin: 0, fontSize: '0.92rem', color: 'var(--ink-secondary)', lineHeight: 1.6 }}>
                      {rev.comment}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Right Sticky Booking Widget */}
        <aside>
          <div className="panel" style={{ position: 'sticky', top: '1.5rem', boxShadow: 'var(--shadow-lg)' }}>
            <div style={{ borderBottom: '1px solid var(--line)', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
              <span className="muted" style={{ fontSize: '0.8rem', display: 'block' }}>
                Hạng phòng đang chọn
              </span>
              <strong style={{ fontSize: '1.15rem' }}>{selectedRoom?.name || 'Phòng Homestay'}</strong>
              <div style={{ marginTop: '0.35rem' }}>
                <span className="card-price" style={{ fontSize: '1.45rem' }}>
                  {formatVND(selectedRoom?.price || property.priceMin)}
                </span>
                <span className="muted" style={{ fontSize: '0.82rem' }}>
                  / đêm
                </span>
              </div>
            </div>

            <div className="field">
              <label htmlFor="detail-in">
                <CalendarCheck /> Ngày nhận phòng
              </label>
              <input
                id="detail-in"
                type="date"
                value={checkIn}
                onChange={e => setCheckIn(e.target.value)}
              />
            </div>

            <div className="field">
              <label htmlFor="detail-out">
                <CalendarCheck /> Ngày trả phòng
              </label>
              <input
                id="detail-out"
                type="date"
                value={checkOut}
                onChange={e => setCheckOut(e.target.value)}
              />
            </div>

            <div className="field">
              <label htmlFor="detail-guests">
                <PeopleFill /> Số lượng khách
              </label>
              <select id="detail-guests" value={guests} onChange={e => setGuests(e.target.value)}>
                <option value="1">1 khách</option>
                <option value="2">2 khách</option>
                <option value="3">3 khách</option>
                <option value="4">4 khách</option>
              </select>
            </div>

            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 10, margin: '1rem 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                <span>
                  {formatVND(selectedRoom?.price || property.priceMin)} × {nights} đêm
                </span>
                <span>{formatVND(totalPrice)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                <span>Phí dịch vụ OTA</span>
                <span className="text-ok">0đ (Miễn phí)</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  borderTop: '1px solid var(--line)',
                  paddingTop: '0.5rem',
                  fontWeight: 800,
                  fontSize: '1.1rem',
                  color: 'var(--brand)',
                }}
              >
                <span>Tổng tạm tính</span>
                <span>{formatVND(totalPrice)}</span>
              </div>
            </div>

            <button
              type="button"
              className="btn btn-primary btn-block"
              style={{ padding: '0.85rem', fontSize: '1rem', fontWeight: 700 }}
              onClick={() => handleBookNow()}
            >
              Tiến hành đặt phòng (UC-03)
            </button>
            <p className="muted" style={{ textAlign: 'center', fontSize: '0.78rem', marginTop: '0.75rem', marginBottom: 0 }}>
              Bạn chưa bị trừ tiền ở bước này.
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}
