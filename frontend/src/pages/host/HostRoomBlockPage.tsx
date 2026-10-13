// UC-07: Host Room Block Page (TypeScript)
import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useStore } from '../../contexts/StoreContext';
import { UCTag, Breadcrumb, Alert } from '../../components/UI';
import {
  CalendarRange,
  CalendarX,
  Trash,
  ExclamationOctagonFill,
  CheckCircleFill,
  ShieldCheck,
} from 'react-bootstrap-icons';
import { RoomBlock } from '../../data';

export default function HostRoomBlockPage() {
  const [searchParams] = useSearchParams();
  const { store, addToast } = useStore();

  const roomId = Number(searchParams.get('roomId')) || 2;
  const room = store.getAllRooms().find(r => r.id === roomId) || store.getAllRooms()[1];

  const [blocks, setBlocks] = useState<RoomBlock[]>(() => store.getRoomBlocks());
  const [start, setStart] = useState('2027-02-10');
  const [end, setEnd] = useState('2027-02-12');
  const [reason, setReason] = useState('Bảo trì điều hoà trung tâm & sơn mới ban công');
  const [testScenario, setTestScenario] = useState<'default' | 'conflict'>('default');
  const [conflictError, setConflictError] = useState('');

  const refreshBlocks = () => {
    setBlocks(store.getRoomBlocks());
  };

  const handleScenarioChange = (scenario: 'default' | 'conflict') => {
    setTestScenario(scenario);
    if (scenario === 'conflict') {
      // Room 2 has booking ODD-DEMO-0004 with Linh Tran: 2027-01-20 -> 2027-01-22 (CONFIRMED)
      setStart('2027-01-20');
      setEnd('2027-01-22');
      setReason('Cần khóa phòng sửa chữa đột xuất');
      setConflictError(
        'Từ chối tạo lịch chặn (TC-13): Khoảng ngày 20/01/2027 – 22/01/2027 đang trùng với đơn đặt phòng #ODD-DEMO-0004 (CONFIRMED). Hệ thống tuân thủ quy tắc bảo đảm BR-04.'
      );
    } else {
      setStart('2027-02-10');
      setEnd('2027-02-12');
      setReason('Bảo trì điều hoà trung tâm & sơn mới ban công');
      setConflictError('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setConflictError('');

    const res = store.addRoomBlock({
      roomId: room.id,
      roomName: room.name,
      start,
      end,
      reason,
    });

    if (!res.success) {
      setConflictError(res.message || 'Lỗi khi tạo lịch chặn');
      addToast(res.message || 'Lỗi xung đột lịch', 'error');
    } else {
      addToast('Đã thiết lập khoảng chặn phòng thành công!', 'success');
      refreshBlocks();
    }
  };

  const handleDeleteBlock = (id: number) => {
    if (window.confirm('Bạn có chắc muốn hủy lịch chặn này?')) {
      store.deleteRoomBlock(id);
      addToast('Đã gỡ bỏ lịch chặn phòng.', 'info');
      refreshBlocks();
    }
  };

  return (
    <div style={{ maxWidth: 1100, margin: '1.5rem auto', padding: '0 1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
        <Breadcrumb
          items={[
            { label: 'Host Portal', to: '/host/properties' },
            { label: 'Quản lý phòng', to: '/host/rooms' },
            { label: `Chặn lịch · ${room.name}` },
          ]}
        />
        <UCTag>
          <CalendarRange /> UC-07 · Lịch chặn phòng (RoomBlock)
        </UCTag>
      </div>

      <h1 className="page-title" style={{ marginBottom: '0.4rem' }}>
        Quản lý lịch chặn phòng (RoomBlock) · {room.name}
      </h1>
      <p className="page-sub" style={{ marginBottom: '1.25rem' }}>
        Chủ động khóa các khoảng ngày tạm dừng nhận khách do kế hoạch sửa chữa, bảo dưỡng hoặc nhu cầu riêng của chủ nhà.
      </p>

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
          Kịch bản kiểm thử UC-07:
        </span>
        <div className="btn-group">
          <button
            type="button"
            className={`btn btn-sm ${testScenario === 'default' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => handleScenarioChange('default')}
          >
            Tạo lịch chặn hợp lệ
          </button>
          <button
            type="button"
            className={`btn btn-sm ${testScenario === 'conflict' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => handleScenarioChange('conflict')}
          >
            Xung đột với đơn đã duyệt (TC-13)
          </button>
        </div>
      </div>

      <div className="layout-side">
        {/* Left Column: Form */}
        <section className="panel">
          {conflictError && (
            <Alert type="error" title="Từ chối tạo lịch chặn: Xung đột đơn đặt phòng (TC-13)">
              <p style={{ margin: '0.35rem 0 0', lineHeight: 1.6 }}>{conflictError}</p>
            </Alert>
          )}

          <h2 style={{ fontSize: '1.2rem', marginTop: conflictError ? '1rem' : 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CalendarX className="text-brand" /> Thiết lập khoảng ngày chặn nhận khách
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="field">
                <label htmlFor="block-start">Từ ngày bắt đầu *</label>
                <input
                  id="block-start"
                  type="date"
                  value={start}
                  onChange={e => setStart(e.target.value)}
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="block-end">Đến ngày kết thúc *</label>
                <input
                  id="block-end"
                  type="date"
                  value={end}
                  onChange={e => setEnd(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="field">
              <label htmlFor="block-reason">Lý do khóa phòng tạm thời *</label>
              <input
                id="block-reason"
                value={reason}
                onChange={e => setReason(e.target.value)}
                placeholder="Ví dụ: Sửa sang nội thất, bảo trì điều hòa..."
                required
              />
            </div>

            <div style={{ background: '#f8fafc', padding: '0.9rem', borderRadius: 10, border: '1px dashed var(--line)', margin: '1.25rem 0' }}>
              <p className="muted" style={{ margin: 0, fontSize: '0.85rem', lineHeight: 1.6 }}>
                💡 <strong>Quy tắc BR-04:</strong> Không cho phép tạo lịch bảo trì <code>RoomBlock</code> đè lên khoảng ngày đã có đơn giữ phòng hợp lệ của khách nhằm bảo vệ quyền lợi người tiêu dùng.
              </p>
            </div>

            <button type="submit" className="btn btn-primary btn-block" style={{ padding: '0.8rem', fontSize: '1rem' }}>
              <CalendarX /> Lưu lịch chặn phòng
            </button>
          </form>
        </section>

        {/* Right Column: Existing Blocks */}
        <aside>
          <div className="panel" style={{ boxShadow: 'var(--shadow-md)' }}>
            <h3 style={{ fontSize: '1.15rem', marginTop: 0, marginBottom: '1rem', borderBottom: '1px solid var(--line)', paddingBottom: '0.75rem' }}>
              Các khoảng ngày đang khóa ({blocks.length})
            </h3>

            {blocks.length === 0 ? (
              <p className="muted" style={{ fontSize: '0.88rem' }}>
                Hiện không có lịch chặn nào cho phòng này.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {blocks.map(b => (
                  <div
                    key={b.id}
                    style={{
                      border: '1px solid var(--line)',
                      borderRadius: 8,
                      padding: '0.85rem',
                      background: '#fff',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <strong style={{ display: 'block', fontSize: '0.92rem' }}>
                        {b.start} → {b.end}
                      </strong>
                      <span className="muted" style={{ fontSize: '0.82rem' }}>
                        {b.reason}
                      </span>
                    </div>
                    <button
                      type="button"
                      className="btn btn-outline btn-xs"
                      style={{ color: '#dc2626' }}
                      title="Gỡ lịch chặn"
                      onClick={() => handleDeleteBlock(b.id)}
                    >
                      <Trash />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
