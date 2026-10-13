// UC-02: Home Page — Full Prototype Layout (TypeScript)
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../../contexts/StoreContext';
import { UCTag, PropertyCard } from '../../components/UI';
import {
  Compass,
  GeoAltFill,
  CalendarCheck,
  CalendarX,
  PeopleFill,
  Search,
  PatchCheckFill,
  ShieldCheck,
  CashCoin,
  Headset,
  ExclamationOctagon,
  ArrowRight,
  Broadcast,
  SearchHeart,
  GridFill,
  Water,
  TreeFill,
  Building,
  Fire,
  Percent,
} from 'react-bootstrap-icons';

const CATEGORIES = [
  { id: 'all', name: 'Tất cả chỗ ở', icon: <GridFill /> },
  { id: 'homestay', name: 'Homestay ven hồ Tây', icon: <Water /> },
  { id: 'villa', name: 'Biệt thự sinh thái Ba Vì', icon: <TreeFill /> },
  { id: 'apartment', name: 'Căn hộ Studio trung tâm', icon: <Building /> },
  { id: 'bungalow', name: 'Nhà gỗ view thung lũng', icon: <Fire /> },
  { id: 'deal', name: 'Ưu đãi cuối tuần', icon: <Percent /> },
];

export default function HomePage() {
  const { store } = useStore();
  const navigate = useNavigate();

  const [kw, setKw] = useState('Hồ Tây');
  const [checkIn, setCheckIn] = useState('2027-01-10');
  const [checkOut, setCheckOut] = useState('2027-01-12');
  const [guests, setGuests] = useState('2');
  const [activeCategory, setActiveCategory] = useState('all');

  const data = store.getData();
  const properties = data.properties || [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (kw) params.set('kw', kw);
    if (checkIn) params.set('in', checkIn);
    if (checkOut) params.set('out', checkOut);
    if (guests) params.set('guests', guests);
    navigate(`/search?${params.toString()}`);
  };

  const filteredProperties = properties.filter(p => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'homestay') return p.type.toLowerCase().includes('homestay');
    if (activeCategory === 'villa') return p.type.toLowerCase().includes('biệt thự') || p.type.toLowerCase().includes('villa');
    if (activeCategory === 'apartment') return p.type.toLowerCase().includes('căn hộ');
    if (activeCategory === 'bungalow') return p.type.toLowerCase().includes('gỗ') || p.type.toLowerCase().includes('bungalow');
    return true;
  });

  return (
    <main>
      {/* Breadcrumb & Tag */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.5rem' }}>
        <UCTag>
          <Compass /> UC-02 · Tìm kiếm và xem chỗ ở
        </UCTag>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--muted)' }}>
          <GeoAltFill className="text-danger" /> <span>Địa điểm phổ biến: <strong>Hồ Tây, Hà Nội</strong></span>
        </div>
      </div>

      {/* Hero Title */}
      <h1 className="page-title">Khám phá &amp; Đặt Homestay, Biệt Thự Nghỉ Dưỡng Cao Cấp</h1>
      <p className="page-sub">
        Hệ thống số hóa quy trình tìm kiếm và đặt phòng, tự động kiểm tra lịch khả dụng theo thời gian thực, ngăn chặn đặt trùng phòng và minh bạch chính sách giá theo tiêu chuẩn OOAD.
      </p>

      {/* Quick Category Filter Pills */}
      <div className="category-pills">
        {CATEGORIES.map(cat => (
          <div
            key={cat.id}
            className={`category-pill ${activeCategory === cat.id ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat.id)}
            style={{ cursor: 'pointer' }}
          >
            {cat.icon} {cat.name}
          </div>
        ))}
      </div>

      {/* Search Hero Panel (Airbnb & Booking.com Standard) */}
      <section className="ota-search-hero" aria-label="Bộ lọc tìm kiếm">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--ink)' }}>
              <SearchHeart className="text-brand" /> Tìm kiếm phòng trống &amp; Báo giá tức thì
            </h2>
            <span className="muted" style={{ fontSize: '0.88rem' }}>
              Khớp tự động lịch trống và kiểm tra xung đột thời gian thực (BR-03 / BR-04)
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="badge badge-active">
              <Broadcast /> Trực tuyến 24/7
            </span>
            <span className="badge badge-completed">
              <ShieldCheck /> Xác thực tức thì
            </span>
          </div>
        </div>

        <form onSubmit={handleSearch}>
          <div className="ota-search-bar">
            <div className="ota-search-item">
              <label htmlFor="kw">
                <GeoAltFill className="text-danger" /> ĐỊA ĐIỂM / KHU VỰC
              </label>
              <input
                id="kw"
                type="text"
                placeholder="Bạn muốn đến đâu? (VD: Hồ Tây, Ba Vì...)"
                value={kw}
                onChange={e => setKw(e.target.value)}
                required
              />
            </div>

            <div className="ota-search-item">
              <label htmlFor="in">
                <CalendarCheck className="text-brand" /> NHẬN PHÒNG
              </label>
              <input
                id="in"
                type="date"
                value={checkIn}
                onChange={e => setCheckIn(e.target.value)}
                required
              />
            </div>

            <div className="ota-search-item">
              <label htmlFor="out">
                <CalendarX className="text-brand" /> TRẢ PHÒNG
              </label>
              <input
                id="out"
                type="date"
                value={checkOut}
                onChange={e => setCheckOut(e.target.value)}
                required
              />
            </div>

            <div className="ota-search-item">
              <label htmlFor="guests">
                <PeopleFill className="text-brand" /> KHÁCH &amp; LOẠI HÌNH
              </label>
              <select
                id="guests"
                value={guests}
                onChange={e => setGuests(e.target.value)}
              >
                <option value="1">1 khách · Homestay</option>
                <option value="2">2 khách · Homestay</option>
                <option value="3">3 khách · Căn hộ</option>
                <option value="4">4 khách · Villa nghỉ dưỡng</option>
              </select>
            </div>

            <div>
              <button type="submit" className="ota-search-btn">
                <Search /> <span>Tìm kiếm</span>
              </button>
            </div>
          </div>

          {/* Secondary Filters & Test Shortcuts */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
              marginTop: '1.15rem',
              paddingTop: '1rem',
              borderTop: '1px solid #f1f5f9',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', fontSize: '0.86rem', color: 'var(--ink-secondary)' }}>
              <span>
                <strong>Lọc nhanh:</strong>
              </span>
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', margin: 0, cursor: 'pointer' }}>
                <input type="checkbox" defaultChecked /> Có bếp riêng
              </label>
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', margin: 0, cursor: 'pointer' }}>
                <input type="checkbox" defaultChecked /> View trọn hồ
              </label>
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', margin: 0, cursor: 'pointer' }}>
                <input type="checkbox" /> Tự nhận phòng (Smartlock)
              </label>
            </div>

            <div className="btn-group">
              <Link
                className="btn btn-outline btn-sm"
                to="/search?in=2027-01-15&out=2027-01-10"
                style={{ fontSize: '0.8rem', borderRadius: 'var(--radius-full)' }}
              >
                <ExclamationOctagon className="text-danger" /> Thử nghiệm lỗi ngày đi ≤ ngày đến (TC-03)
              </Link>
            </div>
          </div>
        </form>
      </section>

      {/* Featured Properties Section Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '3.5rem', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.65rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
            Chỗ ở nổi bật được đánh giá cao nhất
          </h2>
          <p className="muted" style={{ margin: '0.35rem 0 0', fontSize: '0.96rem' }}>
            Những homestay đạt tiêu chuẩn chất lượng cao, có phản hồi nhanh từ chủ nhà và điểm đánh giá từ 4.5 sao trở lên ({filteredProperties.length} chỗ ở)
          </p>
        </div>
        <Link
          to="/search"
          style={{ fontWeight: 700, fontSize: '0.95rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
        >
          Xem toàn bộ danh sách <ArrowRight />
        </Link>
      </div>

      {/* Properties Grid */}
      <div className="grid grid-4" style={{ marginBottom: '3.5rem' }}>
        {filteredProperties.map(property => (
          <PropertyCard
            key={property.id}
            property={property}
            checkIn={checkIn}
            checkOut={checkOut}
            guests={guests}
          />
        ))}
      </div>

      {/* Value Propositions */}
      <section
        style={{
          background: 'linear-gradient(135deg, #f0fdfa 0%, #e0f2fe 100%)',
          border: '1px solid #ccfbf1',
          borderRadius: 'var(--radius)',
          padding: '2.5rem',
          marginBottom: '3.5rem',
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 2rem' }}>
          <span
            style={{
              fontSize: '0.82rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--brand)',
            }}
          >
            Tại sao chọn ODauDay Stay?
          </span>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0.5rem 0' }}>
            Trải nghiệm đặt phòng an tâm tuyệt đối
          </h3>
        </div>
        <div className="grid grid-3">
          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
            <PatchCheckFill style={{ fontSize: '2rem', color: 'var(--brand)', marginBottom: '0.75rem' }} />
            <h4 style={{ margin: '0 0 0.5rem', fontSize: '1.1rem' }}>Cơ sở đã kiểm duyệt</h4>
            <p className="muted" style={{ margin: 0, fontSize: '0.88rem', lineHeight: 1.6 }}>
              100% hình ảnh thực tế, tiện nghi được xác minh và kiểm tra tiêu chuẩn trước khi niêm yết.
            </p>
          </div>
          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
            <CashCoin style={{ fontSize: '2rem', color: '#059669', marginBottom: '0.75rem' }} />
            <h4 style={{ margin: '0 0 0.5rem', fontSize: '1.1rem' }}>Giá gốc từ chủ nhà</h4>
            <p className="muted" style={{ margin: 0, fontSize: '0.88rem', lineHeight: 1.6 }}>
              Không phí dịch vụ ẩn (BR-05). Giá báo là giá thanh toán cuối cùng, cam kết minh bạch.
            </p>
          </div>
          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
            <Headset style={{ fontSize: '2rem', color: '#3b82f6', marginBottom: '0.75rem' }} />
            <h4 style={{ margin: '0 0 0.5rem', fontSize: '1.1rem' }}>Hỗ trợ tức thời 24/7</h4>
            <p className="muted" style={{ margin: 0, fontSize: '0.88rem', lineHeight: 1.6 }}>
              Đội ngũ chăm sóc khách hàng và chủ nhà luôn đồng hành trong suốt chuyến đi của bạn.
            </p>
          </div>
        </div>
      </section>

      {/* Host Invitation Banner */}
      <section
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          color: '#fff',
          borderRadius: 'var(--radius)',
          padding: '2.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.5rem',
        }}
      >
        <div style={{ maxWidth: 540 }}>
          <span
            style={{
              fontSize: '0.82rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: '#38bdf8',
            }}
          >
            Dành cho chủ nhà &amp; Đối tác
          </span>
          <h3 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0.5rem 0 0.75rem' }}>
            Bạn đang sở hữu căn hộ hoặc homestay?
          </h3>
          <p style={{ margin: 0, opacity: 0.85, fontSize: '0.95rem', lineHeight: 1.6 }}>
            Gia nhập mạng lưới ODauDay Stay để tiếp cận hàng nghìn du khách, quản lý lịch phòng tự động và tối ưu
            doanh thu với công cụ chuyên biệt.
          </p>
        </div>
        <Link
          to="/register"
          className="btn btn-primary"
          style={{ padding: '0.9rem 1.8rem', fontSize: '1rem', fontWeight: 700 }}
        >
          Đăng ký làm chủ nhà ngay
        </Link>
      </section>
    </main>
  );
}
