// UC-09: Host Revenue & Reports Page (TypeScript)
import React, { useState } from 'react';
import { useStore } from '../../contexts/StoreContext';
import { UCTag, Breadcrumb } from '../../components/UI';
import { formatVND, BADGE_CLASS, BADGE_LABEL } from '../../constants';
import {
  GraphUpArrow,
  FileEarmarkSpreadsheet,
  CheckCircle,
  DoorClosed,
  Filter,
  CashStack,
  ExclamationCircle,
} from 'react-bootstrap-icons';

export default function HostRevenuePage() {
  const { store, currentUser, addToast } = useStore();
  const owner = currentUser?.username || 'host.demo';

  const [fromMonth, setFromMonth] = useState('2026-12');
  const [toMonth, setToMonth] = useState('2027-02');
  const [propertyFilter, setPropertyFilter] = useState('Tất cả cơ sở');

  const revData = store.getRevenueData(owner);
  const completedBookings = revData.completedBookings;
  const cancelledBookings = revData.cancelledBookings;
  const pendingBookings = revData.pendingBookings;

  const handleExportCSV = () => {
    addToast('Đã xuất báo cáo doanh thu tài chính định dạng CSV/Excel!', 'success');
  };

  return (
    <div style={{ maxWidth: 1200, margin: '1.5rem auto', padding: '0 1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
        <Breadcrumb items={[{ label: 'Host Portal', to: '/host/properties' }, { label: 'Báo cáo doanh thu tài chính' }]} />
        <UCTag>
          <GraphUpArrow /> UC-09 · Báo cáo doanh thu &amp; Thống kê
        </UCTag>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <h1 className="page-title" style={{ margin: '0 0 0.35rem' }}>
            Báo cáo doanh thu &amp; Thống kê lưu trú
          </h1>
          <p className="page-sub" style={{ margin: 0 }}>
            Dòng tiền chỉ được tổng hợp từ các đơn đặt phòng đã hoàn tất kỳ lưu trú thực tế (<code>COMPLETED</code>) theo quy tắc kế toán BR-08.
          </p>
        </div>
        <button type="button" className="btn btn-outline" style={{ fontSize: '0.85rem' }} onClick={handleExportCSV}>
          <FileEarmarkSpreadsheet /> Xuất file Excel / CSV
        </button>
      </div>

      {/* Filter Controls Panel */}
      <section className="panel" style={{ marginBottom: '1.5rem' }}>
        <div className="row-3" style={{ alignItems: 'end' }}>
          <div className="field">
            <label htmlFor="rev-from">Từ kỳ tháng</label>
            <input
              id="rev-from"
              type="month"
              value={fromMonth}
              onChange={e => setFromMonth(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="rev-to">Đến kỳ tháng</label>
            <input
              id="rev-to"
              type="month"
              value={toMonth}
              onChange={e => setToMonth(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="rev-prop">Cơ sở kinh doanh</label>
            <select id="rev-prop" value={propertyFilter} onChange={e => setPropertyFilter(e.target.value)}>
              <option value="Tất cả cơ sở">Tất cả cơ sở sở hữu</option>
              <option value="ODauDay Stay Hồ Tây">ODauDay Stay Hồ Tây</option>
              <option value="ODauDay Stay Ba Vì">ODauDay Stay Ba Vì</option>
            </select>
          </div>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          style={{ marginTop: '0.75rem' }}
          onClick={() => addToast('Đã áp dụng bộ lọc kỳ báo cáo doanh thu', 'info')}
        >
          <Filter /> Lọc dữ liệu báo cáo
        </button>
      </section>

      {/* KPI Metric Cards */}
      <div className="grid grid-3" style={{ marginBottom: '1.75rem' }}>
        {/* Total Net Revenue */}
        <div className="panel" style={{ borderLeft: '4px solid var(--brand)', padding: '1.25rem' }}>
          <span className="muted" style={{ fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>
            Doanh thu thực nhận
          </span>
          <p className="card-price" style={{ fontSize: '2rem', margin: '0.35rem 0 0', color: 'var(--brand)', fontWeight: 800 }}>
            {formatVND(revData.totalRevenue)}
          </p>
          <span className="muted" style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.35rem' }}>
            <CheckCircle className="text-ok" /> Phí nền tảng 0đ · Thực nhận 100%
          </span>
        </div>

        {/* Completed Bookings */}
        <div className="panel" style={{ borderLeft: '4px solid var(--ok)', padding: '1.25rem' }}>
          <span className="muted" style={{ fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>
            Đơn lưu trú thành công
          </span>
          <p style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--ok)', margin: '0.35rem 0 0' }}>
            {completedBookings.length} đơn
          </p>
          <span className="muted" style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.35rem' }}>
            <DoorClosed className="text-ok" /> Khách đã hoàn tất trả phòng (Check-out)
          </span>
        </div>

        {/* Excluded Bookings (TC-14) */}
        <div className="panel" style={{ borderLeft: '4px solid var(--subtle)', padding: '1.25rem' }}>
          <span className="muted" style={{ fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>
            Đơn loại trừ không tính (TC-14)
          </span>
          <p style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--muted)', margin: '0.35rem 0 0' }}>
            {cancelledBookings.length + pendingBookings.length} đơn
          </p>
          <span className="muted" style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.35rem' }}>
            <ExclamationCircle className="text-warn" /> Bao gồm đơn đã hủy &amp; đơn chờ duyệt
          </span>
        </div>
      </div>

      {/* Completed Bookings Revenue Table */}
      <section className="panel">
        <h2 style={{ fontSize: '1.2rem', marginTop: 0, marginBottom: '1rem', borderBottom: '1px solid var(--line)', paddingBottom: '0.75rem' }}>
          Chi tiết danh sách đơn được ghi nhận vào doanh thu (BR-08)
        </h2>

        {completedBookings.length === 0 ? (
          <p className="muted">Chưa có đơn nào hoàn tất (COMPLETED) trong kỳ này.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th style={{ padding: '0.75rem' }}>Mã đơn</th>
                  <th style={{ padding: '0.75rem' }}>Khách lưu trú</th>
                  <th style={{ padding: '0.75rem' }}>Cơ sở &amp; Phòng</th>
                  <th style={{ padding: '0.75rem' }}>Khoảng ngày ở</th>
                  <th style={{ padding: '0.75rem' }}>Doanh thu ghi nhận</th>
                  <th style={{ padding: '0.75rem' }}>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {completedBookings.map(b => (
                  <tr key={b.code}>
                    <td style={{ padding: '0.75rem' }}>
                      <strong style={{ fontFamily: 'monospace' }}>{b.code}</strong>
                    </td>
                    <td style={{ padding: '0.75rem' }}>{b.guestName}</td>
                    <td style={{ padding: '0.75rem' }}>
                      {b.propertyName} · {b.roomName}
                    </td>
                    <td style={{ padding: '0.75rem', fontSize: '0.88rem' }}>
                      {b.checkIn} → {b.checkOut} ({b.nights} đêm)
                    </td>
                    <td style={{ padding: '0.75rem', fontWeight: 700, color: 'var(--brand)' }}>
                      {formatVND(b.total)}
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <span className="badge badge-completed">COMPLETED</span>
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
