// UC-06: Host Properties Management Page (TypeScript)
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../../contexts/StoreContext';
import { UCTag, Breadcrumb } from '../../components/UI';
import { formatVND } from '../../constants';
import {
  Building,
  PlusLg,
  Trash,
  DoorOpen,
  ShieldCheck,
  HouseDoor,
  GeoAltFill,
} from 'react-bootstrap-icons';
import { Property } from '../../data';

export default function HostPropertiesPage() {
  const { store, currentUser, addToast } = useStore();
  const owner = currentUser?.username || 'host.demo';

  const [properties, setProperties] = useState<Property[]>(() => store.getHostProperties(owner));
  const [showAddModal, setShowAddModal] = useState(false);

  // New property form state
  const [name, setName] = useState('');
  const [type, setType] = useState('Homestay');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Hà Nội');
  const [area, setArea] = useState('Hồ Tây');
  const [priceMin, setPriceMin] = useState(650000);
  const [desc, setDesc] = useState('');
  const [image, setImage] = useState('https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80');

  const refreshList = () => {
    setProperties(store.getHostProperties(owner));
  };

  const handleAddProperty = (e: React.FormEvent) => {
    e.preventDefault();
    store.addProperty({
      owner,
      name,
      type,
      address,
      city,
      area,
      priceMin,
      desc,
      image,
      amenities: ['Wifi', 'Điều hòa', 'Bếp riêng'],
    });
    addToast('Đã thêm cơ sở lưu trú mới!', 'success');
    setShowAddModal(false);
    refreshList();
    setName('');
    setAddress('');
    setDesc('');
  };

  const handleDelete = (id: number, pName: string) => {
    if (window.confirm(`Bạn có chắc muốn xóa cơ sở "${pName}"?`)) {
      store.deleteProperty(id);
      addToast('Đã xóa cơ sở lưu trú.', 'info');
      refreshList();
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: '1.5rem auto', padding: '0 1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
        <Breadcrumb items={[{ label: 'Host Portal', to: '/host/properties' }, { label: 'Quản lý cơ sở lưu trú' }]} />
        <UCTag>
          <Building /> UC-06 · Quản lý cơ sở lưu trú
        </UCTag>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <h1 className="page-title" style={{ margin: '0 0 0.35rem' }}>
            Cơ sở lưu trú của tôi
          </h1>
          <p className="page-sub" style={{ margin: 0 }}>
            Chủ nhà chỉ được quyền quản lý các cơ sở thuộc quyền sở hữu của mình (Tài khoản: <strong>{owner}</strong>).
          </p>
        </div>
        <button type="button" className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <PlusLg /> Đăng ký cơ sở mới
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-3" style={{ marginBottom: '1.75rem' }}>
        <div className="panel" style={{ borderLeft: '4px solid var(--brand)', padding: '1.25rem' }}>
          <span className="muted" style={{ fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>
            Tổng số cơ sở sở hữu
          </span>
          <p style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--ink)', margin: '0.25rem 0 0' }}>
            {properties.length} cơ sở
          </p>
          <span className="muted" style={{ fontSize: '0.8rem' }}>
            Tất cả đã kiểm duyệt &amp; đang đón khách
          </span>
        </div>

        <div className="panel" style={{ borderLeft: '4px solid var(--ok)', padding: '1.25rem' }}>
          <span className="muted" style={{ fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>
            Tỷ lệ lấp đầy tháng này
          </span>
          <p style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--ok)', margin: '0.25rem 0 0' }}>
            85%
          </p>
          <span className="muted" style={{ fontSize: '0.8rem' }}>
            Tăng 12% so với tháng trước
          </span>
        </div>

        <div className="panel" style={{ borderLeft: '4px solid #f59e0b', padding: '1.25rem' }}>
          <span className="muted" style={{ fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>
            Đánh giá trung bình
          </span>
          <p style={{ fontSize: '1.85rem', fontWeight: 800, color: '#f59e0b', margin: '0.25rem 0 0' }}>
            5.0 ★
          </p>
          <span className="muted" style={{ fontSize: '0.8rem' }}>
            Đạt tiêu chuẩn Superhost
          </span>
        </div>
      </div>

      {/* Add Property Form Modal / Collapsible */}
      {showAddModal && (
        <section className="panel" style={{ marginBottom: '1.5rem', border: '2px solid var(--brand)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ margin: 0, fontSize: '1.2rem' }}>Thêm cơ sở lưu trú mới</h2>
            <button type="button" className="btn btn-outline btn-xs" onClick={() => setShowAddModal(false)}>
              Đóng form
            </button>
          </div>

          <form onSubmit={handleAddProperty}>
            <div className="row">
              <div className="field">
                <label>Tên cơ sở lưu trú *</label>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Ví dụ: ODauDay Stay Flamingo"
                  required
                />
              </div>
              <div className="field">
                <label>Loại hình chỗ ở *</label>
                <select value={type} onChange={e => setType(e.target.value)}>
                  <option value="Homestay">Homestay</option>
                  <option value="Biệt thự">Biệt thự sinh thái</option>
                  <option value="Căn hộ">Căn hộ dịch vụ</option>
                  <option value="Nhà gỗ">Nhà gỗ nghỉ dưỡng</option>
                </select>
              </div>
            </div>

            <div className="row">
              <div className="field">
                <label>Địa chỉ chi tiết *</label>
                <input
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="Số nhà, ngõ, đường, quận/huyện..."
                  required
                />
              </div>
              <div className="field">
                <label>Tỉnh / Thành phố *</label>
                <input
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  placeholder="Hà Nội, Lào Cai..."
                  required
                />
              </div>
            </div>

            <div className="row">
              <div className="field">
                <label>Khu vực cụ thể</label>
                <input
                  value={area}
                  onChange={e => setArea(e.target.value)}
                  placeholder="Hồ Tây, Sa Pa..."
                />
              </div>
              <div className="field">
                <label>Giá khởi điểm (VNĐ/đêm) *</label>
                <input
                  type="number"
                  value={priceMin}
                  onChange={e => setPriceMin(Number(e.target.value))}
                  required
                />
              </div>
            </div>

            <div className="field">
              <label>Mô tả cơ sở lưu trú *</label>
              <textarea
                value={desc}
                onChange={e => setDesc(e.target.value)}
                placeholder="Giới thiệu điểm nổi bật, view phòng, phong cách trang trí..."
                rows={3}
                required
              />
            </div>

            <div className="field">
              <label>URL Hình ảnh đại diện</label>
              <input
                value={image}
                onChange={e => setImage(e.target.value)}
                placeholder="https://..."
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
              <button type="submit" className="btn btn-primary">
                Lưu cơ sở lưu trú
              </button>
              <button type="button" className="btn btn-outline" onClick={() => setShowAddModal(false)}>
                Hủy
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Properties List Table */}
      <section className="panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--line)', paddingBottom: '0.75rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.2rem' }}>
            <HouseDoor className="text-brand" /> Danh sách cơ sở lưu trú ({properties.length})
          </h2>
          <span className="badge badge-active">
            <ShieldCheck /> Xác thực chủ quyền
          </span>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th style={{ padding: '0.75rem' }}>Cơ sở lưu trú</th>
                <th style={{ padding: '0.75rem' }}>Loại hình</th>
                <th style={{ padding: '0.75rem' }}>Địa chỉ tọa lạc</th>
                <th style={{ padding: '0.75rem' }}>Giá từ</th>
                <th style={{ padding: '0.75rem' }}>Trạng thái</th>
                <th style={{ textAlign: 'right', padding: '0.75rem' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {properties.map(p => (
                <tr key={p.id}>
                  <td style={{ padding: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: 8,
                          backgroundImage: `url('${p.image}')`,
                          backgroundSize: 'cover',
                          flexShrink: 0,
                        }}
                      />
                      <div>
                        <strong style={{ display: 'block' }}>{p.name}</strong>
                        <span className="muted" style={{ fontSize: '0.78rem' }}>
                          {p.area || p.city}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '0.75rem' }}>{p.type}</td>
                  <td style={{ padding: '0.75rem', fontSize: '0.88rem' }}>{p.address}</td>
                  <td style={{ padding: '0.75rem', fontWeight: 700, color: 'var(--brand)' }}>
                    {formatVND(p.priceMin)}
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    <span className="badge badge-active">Đang đón khách</span>
                  </td>
                  <td style={{ textAlign: 'right', padding: '0.75rem' }}>
                    <div className="btn-group" style={{ justifyContent: 'flex-end' }}>
                      <Link to="/host/rooms" className="btn btn-outline btn-xs" title="Quản lý phòng">
                        <DoorOpen /> Quản lý phòng (UC-07)
                      </Link>
                      <button
                        type="button"
                        className="btn btn-outline btn-xs"
                        style={{ color: '#dc2626' }}
                        title="Xóa cơ sở"
                        onClick={() => handleDelete(p.id, p.name)}
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
