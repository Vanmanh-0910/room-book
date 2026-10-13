// UC-07: Host Rooms Management Page (TypeScript)
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../contexts/StoreContext';
import { UCTag, Breadcrumb } from '../../components/UI';
import { formatVND } from '../../constants';
import {
  DoorOpen,
  PlusLg,
  Trash,
  CalendarRange,
  PeopleFill,
  CheckCircleFill,
} from 'react-bootstrap-icons';
import { Room } from '../../data';

export default function HostRoomsPage() {
  const { store, addToast } = useStore();

  const [rooms, setRooms] = useState<Room[]>(() => store.getAllRooms());
  const [showAddForm, setShowAddForm] = useState(false);

  // Add room form state
  const [name, setName] = useState('');
  const [capacity, setCapacity] = useState(2);
  const [price, setPrice] = useState(650000);
  const [desc, setDesc] = useState('');

  const refreshList = () => {
    setRooms(store.getAllRooms());
  };

  const handleAddRoom = (e: React.FormEvent) => {
    e.preventDefault();
    store.addRoom({
      propertyId: 1,
      propertyName: 'ODauDay Stay Hồ Tây',
      name,
      capacity: Number(capacity),
      price: Number(price),
      desc,
      status: 'ACTIVE',
    });
    addToast('Đã thêm hạng phòng mới!', 'success');
    setShowAddForm(false);
    refreshList();
    setName('');
    setDesc('');
  };

  const handleDelete = (id: number, rName: string) => {
    if (window.confirm(`Bạn có chắc muốn xóa phòng "${rName}"?`)) {
      store.deleteRoom(id);
      addToast('Đã xóa hạng phòng.', 'info');
      refreshList();
    }
  };

  return (
    <div style={{ maxWidth: 1100, margin: '1.5rem auto', padding: '0 1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
        <Breadcrumb
          items={[
            { label: 'Host Portal', to: '/host/properties' },
            { label: 'ODauDay Stay Hồ Tây', to: '/host/properties' },
            { label: 'Quản lý phòng & bảng giá' },
          ]}
        />
        <UCTag>
          <DoorOpen /> UC-07 · Quản lý phòng &amp; lịch chặn
        </UCTag>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <h1 className="page-title" style={{ margin: '0 0 0.35rem' }}>
            Danh sách hạng phòng vận hành
          </h1>
          <p className="page-sub" style={{ margin: 0 }}>
            Quản lý sức chứa tối đa (BR-02), đơn giá niêm yết mỗi đêm và lịch chặn bảo trì (RoomBlock).
          </p>
        </div>
        <button type="button" className="btn btn-primary" onClick={() => setShowAddForm(true)}>
          <PlusLg /> Thêm hạng phòng mới
        </button>
      </div>

      {showAddForm && (
        <section className="panel" style={{ marginBottom: '1.5rem', border: '2px solid var(--brand)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ margin: 0, fontSize: '1.2rem' }}>Thêm hạng phòng mới</h2>
            <button type="button" className="btn btn-outline btn-xs" onClick={() => setShowAddForm(false)}>
              Đóng form
            </button>
          </div>

          <form onSubmit={handleAddRoom}>
            <div className="row">
              <div className="field">
                <label>Tên hạng phòng *</label>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Ví dụ: Phòng Panorama Hồ Tây"
                  required
                />
              </div>
              <div className="field">
                <label>Sức chứa tối đa (Người lớn) *</label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={capacity}
                  onChange={e => setCapacity(Number(e.target.value))}
                  required
                />
              </div>
            </div>

            <div className="field">
              <label>Đơn giá / đêm (VNĐ) *</label>
              <input
                type="number"
                value={price}
                onChange={e => setPrice(Number(e.target.value))}
                required
              />
            </div>

            <div className="field">
              <label>Mô tả tiện nghi phòng *</label>
              <textarea
                value={desc}
                onChange={e => setDesc(e.target.value)}
                placeholder="Số lượng giường, loại view, bồn tắm..."
                rows={2}
                required
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
              <button type="submit" className="btn btn-primary">
                Lưu hạng phòng
              </button>
              <button type="button" className="btn btn-outline" onClick={() => setShowAddForm(false)}>
                Hủy
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Rooms Table Panel */}
      <section className="panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--line)', paddingBottom: '0.75rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.2rem' }}>
            <DoorOpen className="text-brand" /> Các hạng phòng đang vận hành ({rooms.length})
          </h2>
          <span className="muted" style={{ fontSize: '0.82rem' }}>
            Đồng bộ thời gian thực
          </span>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th style={{ padding: '0.75rem' }}>Hạng phòng</th>
                <th style={{ padding: '0.75rem' }}>Cơ sở trực thuộc</th>
                <th style={{ padding: '0.75rem' }}>Sức chứa</th>
                <th style={{ padding: '0.75rem' }}>Đơn giá / đêm</th>
                <th style={{ padding: '0.75rem' }}>Trạng thái</th>
                <th style={{ textAlign: 'right', padding: '0.75rem' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map(room => (
                <tr key={room.id}>
                  <td style={{ padding: '0.75rem' }}>
                    <strong>{room.name}</strong>
                    <span className="muted" style={{ display: 'block', fontSize: '0.78rem' }}>
                      {room.desc}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem', fontSize: '0.88rem' }}>{room.propertyName}</td>
                  <td style={{ padding: '0.75rem' }}>
                    <span className="badge" style={{ background: '#f1f5f9', color: 'var(--ink-secondary)' }}>
                      <PeopleFill /> {room.capacity} người
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem', fontWeight: 700, color: 'var(--brand)' }}>
                    {formatVND(room.price)}
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    <span className="badge badge-active">
                      <CheckCircleFill /> ACTIVE
                    </span>
                  </td>
                  <td style={{ textAlign: 'right', padding: '0.75rem' }}>
                    <div className="btn-group" style={{ justifyContent: 'flex-end' }}>
                      <Link
                        to={`/host/roomblock?roomId=${room.id}`}
                        className="btn btn-outline btn-xs"
                        title="Thiết lập lịch chặn"
                      >
                        <CalendarRange /> Chặn lịch (RoomBlock)
                      </Link>
                      <button
                        type="button"
                        className="btn btn-outline btn-xs"
                        style={{ color: '#dc2626' }}
                        title="Xóa phòng"
                        onClick={() => handleDelete(room.id, room.name)}
                      >
                        <Trash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
