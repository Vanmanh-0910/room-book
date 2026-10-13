// UC-02: Search Results Page (TypeScript)
import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useStore } from '../../contexts/StoreContext';
import { UCTag, Breadcrumb, PropertyCard, Alert } from '../../components/UI';
import {
  Compass,
  Filter,
  Search,
  ExclamationOctagonFill,
  CalendarCheck,
  HouseDoor,
  GeoAltFill,
} from 'react-bootstrap-icons';
import { Property } from '../../data';

export default function SearchResultsPage() {
  const { store } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();

  const [kw, setKw] = useState(searchParams.get('kw') || '');
  const [checkIn, setCheckIn] = useState(searchParams.get('in') || '2027-01-10');
  const [checkOut, setCheckOut] = useState(searchParams.get('out') || '2027-01-12');
  const [guests, setGuests] = useState(searchParams.get('guests') || '2');
  const [type, setType] = useState('Tất cả');
  const [maxPrice, setMaxPrice] = useState(2500000);

  const [testState, setTestState] = useState<'normal' | 'tc03' | 'empty'>('normal');

  useEffect(() => {
    if (searchParams.get('kw')) setKw(searchParams.get('kw') || '');
    if (searchParams.get('in')) setCheckIn(searchParams.get('in') || '');
    if (searchParams.get('out')) setCheckOut(searchParams.get('out') || '');
  }, [searchParams]);

  const handleStateChange = (state: 'normal' | 'tc03' | 'empty') => {
    setTestState(state);
    if (state === 'tc03') {
      setCheckIn('2027-01-15');
      setCheckOut('2027-01-10');
    } else if (state === 'empty') {
      setKw('DiaDiemKhongTonTai9999');
      setCheckIn('2027-01-10');
      setCheckOut('2027-01-12');
    } else {
      setKw('');
      setCheckIn('2027-01-10');
      setCheckOut('2027-01-12');
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ kw, in: checkIn, out: checkOut, guests });
  };

  // Perform search query
  const searchResult = store.search({
    kw,
    checkIn,
    checkOut,
    type,
    maxPrice,
  });

  const properties: Property[] = searchResult.properties || [];
  const isDateError = !searchResult.success && searchResult.code === 'INVALID_DATES';
  const isEmpty = searchResult.success && properties.length === 0;

  return (
    <main>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
        <Breadcrumb items={[{ label: 'Trang chủ', to: '/' }, { label: 'Tìm kiếm cơ sở lưu trú' }]} />
        <UCTag>
          <Compass /> UC-02 · Tìm kiếm phòng &amp; Lọc
        </UCTag>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <h1 className="page-title" style={{ margin: '0 0 0.35rem' }}>
            Kết quả tìm kiếm chỗ ở
          </h1>
          <p className="page-sub" style={{ margin: 0 }}>
            {searchResult.success ? `Tìm thấy ${properties.length} chỗ ở phù hợp yêu cầu` : 'Lỗi tham số tra cứu'}
          </p>
        </div>

        {/* State Switcher for Business Test Cases */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid var(--line)',
            borderRadius: 'var(--radius)',
            padding: '0.5rem 1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: 'var(--shadow-xs)',
          }}
        >
          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--ink-secondary)' }}>
            Kịch bản:
          </span>
          <div className="btn-group">
            <button
              type="button"
              className={`btn btn-xs ${testState === 'normal' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => handleStateChange('normal')}
            >
              Hợp lệ
            </button>
            <button
              type="button"
              className={`btn btn-xs ${testState === 'tc03' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => handleStateChange('tc03')}
            >
              Ngày sai (TC-03)
            </button>
            <button
              type="button"
              className={`btn btn-xs ${testState === 'empty' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => handleStateChange('empty')}
            >
              Trống kết quả
            </button>
          </div>
        </div>
      </div>

      <div className="layout-side">
        {/* Left Filter Sidebar */}
        <aside className="panel" style={{ height: 'fit-content' }}>
          <h2 style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: 0 }}>
            <Filter className="text-brand" /> Bộ lọc tìm kiếm
          </h2>

          <form onSubmit={handleSearchSubmit}>
            <div className="field">
              <label htmlFor="filter-kw">
                <GeoAltFill /> Điểm đến / Từ khóa
              </label>
              <input
                id="filter-kw"
                value={kw}
                onChange={e => setKw(e.target.value)}
                placeholder="Hồ Tây, Ba Vì, Sa Pa..."
              />
            </div>

            <div className="field">
              <label htmlFor="filter-in">
                <CalendarCheck /> Ngày nhận phòng
              </label>
              <input
                id="filter-in"
                type="date"
                value={checkIn}
                onChange={e => setCheckIn(e.target.value)}
              />
            </div>

            <div className="field">
              <label htmlFor="filter-out">
                <CalendarCheck /> Ngày trả phòng
              </label>
              <input
                id="filter-out"
                type="date"
                value={checkOut}
                onChange={e => setCheckOut(e.target.value)}
              />
            </div>

            <div className="field">
              <label htmlFor="filter-type">
                <HouseDoor /> Loại hình lưu trú
              </label>
              <select id="filter-type" value={type} onChange={e => setType(e.target.value)}>
                <option value="Tất cả">Tất cả loại hình</option>
                <option value="Homestay">Homestay</option>
                <option value="Biệt thự">Biệt thự sinh thái</option>
                <option value="Căn hộ">Căn hộ dịch vụ</option>
                <option value="Nhà gỗ">Nhà gỗ view núi</option>
              </select>
            </div>

            <div className="field">
              <label htmlFor="filter-price">
                Mức giá tối đa: <strong>{new Intl.NumberFormat('vi-VN').format(maxPrice)}đ</strong>
              </label>
              <input
                id="filter-price"
                type="range"
                min="500000"
                max="3000000"
                step="100000"
                value={maxPrice}
                onChange={e => setMaxPrice(Number(e.target.value))}
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: '0.75rem' }}>
              <Search /> Áp dụng bộ lọc
            </button>
          </form>
        </aside>

        {/* Right Search Results Content */}
        <section>
          {/* TC-03 Error Case: Invalid Dates */}
          {isDateError && (
            <div className="panel" style={{ borderLeft: '4px solid var(--danger)', marginBottom: '1.5rem' }}>
              <Alert type="error" title="Từ chối tìm kiếm: Vi phạm quy tắc ngày lưu trú (TC-03)">
                <p style={{ margin: '0.35rem 0 0', lineHeight: 1.6 }}>
                  {searchResult.message}
                  <br />
                  <span className="muted" style={{ fontSize: '0.85rem' }}>
                    Quy tắc nghiệp vụ: Ngày trả phòng (Check-out) bắt buộc phải lớn hơn ngày nhận phòng (Check-in) tối
                    thiểu 01 đêm.
                  </span>
                </p>
              </Alert>
            </div>
          )}

          {/* Empty Result Case */}
          {isEmpty && (
            <div className="panel" style={{ textAlign: 'center', padding: '3.5rem 1.5rem' }}>
              <ExclamationOctagonFill style={{ fontSize: '3rem', color: 'var(--subtle)', marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Không tìm thấy chỗ ở phù hợp</h3>
              <p className="muted" style={{ maxWidth: 460, margin: '0 auto 1.5rem', lineHeight: 1.6 }}>
                Không có cơ sở lưu trú nào khớp với tiêu chí tìm kiếm của bạn. Hãy thử thay đổi từ khóa hoặc khoảng
                giá!
              </p>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => {
                  setKw('');
                  setType('Tất cả');
                  setMaxPrice(3000000);
                }}
              >
                Đặt lại bộ lọc
              </button>
            </div>
          )}

          {/* Successful Results Grid */}
          {!isDateError && !isEmpty && (
            <div className="grid grid-2">
              {properties.map(property => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  checkIn={checkIn}
                  checkOut={checkOut}
                  guests={guests}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
