// UC-10: Admin User Management & RBAC Page (TypeScript)
import React, { useState } from 'react';
import { useStore } from '../../contexts/StoreContext';
import { UCTag, Breadcrumb } from '../../components/UI';
import {
  PeopleFill,
  PersonPlusFill,
  ShieldLock,
  LockFill,
  UnlockFill,
  ShieldCheck,
  Search,
  PersonFill,
  At,
  KeyFill,
  Telephone,
} from 'react-bootstrap-icons';
import { User } from '../../data';

export default function AdminUsersPage() {
  const { store, currentUser, addToast } = useStore();

  const [users, setUsers] = useState<User[]>(() => store.getAllUsers());
  const [kw, setKw] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showAddForm, setShowAddForm] = useState(false);

  // Add user form state
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('123');
  const [newFullName, setNewFullName] = useState('');
  const [newPhone, setNewPhone] = useState('0900000099');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<'ADMIN' | 'HOST' | 'GUEST'>('HOST');

  const refreshList = () => {
    setUsers(store.getAllUsers());
  };

  const handleToggleStatus = (u: User) => {
    // Safety check: Cannot lock own admin account
    if (u.username === currentUser?.username || u.username === 'admin') {
      addToast('Quy tắc an toàn (ASSUM-01): Quản trị viên không thể tự khóa tài khoản chính mình!', 'error');
      return;
    }

    const res = store.toggleUserStatus(u.id);
    if (res.success) {
      addToast(`Đã chuyển trạng thái tài khoản ${u.username} sang ${res.newStatus}`, 'success');
      refreshList();
    }
  };

  const handleChangeRole = (u: User, newR: User['role']) => {
    if (u.username === 'admin' && newR !== 'ADMIN') {
      addToast('Quy tắc an toàn (ASSUM-01): Hệ thống phải duy trì ít nhất 01 Quản trị viên tối cao!', 'error');
      return;
    }

    store.changeUserRole(u.id, newR);
    addToast(`Đã đổi vai trò tài khoản ${u.username} thành ${newR}`, 'info');
    refreshList();
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    const res = store.addUser({
      username: newUsername,
      password: newPassword,
      fullName: newFullName,
      phone: newPhone,
      email: newEmail,
      role: newRole,
      status: 'ACTIVE',
    });

    if (res.success) {
      addToast(`Đã tạo tài khoản thành công cho ${newUsername}!`, 'success');
      setShowAddForm(false);
      refreshList();
      setNewUsername('');
      setNewFullName('');
      setNewEmail('');
    } else {
      addToast(res.message || 'Lỗi khi tạo tài khoản', 'error');
    }
  };

  const activeCount = users.filter(u => u.status === 'ACTIVE').length;
  const lockedCount = users.filter(u => u.status === 'LOCKED').length;

  const filteredUsers = users.filter(u => {
    const matchKw =
      !kw ||
      u.fullName.toLowerCase().includes(kw.toLowerCase()) ||
      u.username.toLowerCase().includes(kw.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(kw.toLowerCase());
    const matchRole = roleFilter === 'ALL' || u.role === roleFilter;
    const matchStatus = statusFilter === 'ALL' || u.status === statusFilter;
    return matchKw && matchRole && matchStatus;
  });

  return (
    <div style={{ maxWidth: 1200, margin: '1.5rem auto', padding: '0 1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
        <Breadcrumb items={[{ label: 'Admin Console', to: '/admin/users' }, { label: 'Quản lý người dùng & RBAC' }]} />
        <UCTag>
          <PeopleFill /> UC-10 · Quản lý tài khoản &amp; RBAC
        </UCTag>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <h1 className="page-title" style={{ margin: '0 0 0.35rem' }}>
            Quản lý tài khoản &amp; Phân quyền RBAC
          </h1>
          <p className="page-sub" style={{ margin: 0 }}>
            Kiểm soát tài khoản, thay đổi quyền hạn và khóa người dùng vi phạm. Bảo đảm quy tắc ASSUM-01.
          </p>
        </div>
        <button type="button" className="btn btn-primary" onClick={() => setShowAddForm(true)}>
          <PersonPlusFill /> Tạo tài khoản nội bộ
        </button>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-3" style={{ marginBottom: '1.75rem' }}>
        <div className="panel" style={{ borderLeft: '4px solid var(--brand)', padding: '1.25rem' }}>
          <span className="muted" style={{ fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>
            Tổng số tài khoản
          </span>
          <p style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--ink)', margin: '0.25rem 0 0' }}>
            {users.length} tài khoản
          </p>
          <span className="muted" style={{ fontSize: '0.8rem' }}>
            Toàn bộ thành viên trong CSDL
          </span>
        </div>

        <div className="panel" style={{ borderLeft: '4px solid var(--ok)', padding: '1.25rem' }}>
          <span className="muted" style={{ fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>
            Đang hoạt động bình thường
          </span>
          <p style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--ok)', margin: '0.25rem 0 0' }}>
            {activeCount} tài khoản
          </p>
          <span className="muted" style={{ fontSize: '0.8rem' }}>
            Trạng thái ACTIVE
          </span>
        </div>

        <div className="panel" style={{ borderLeft: '4px solid var(--danger)', padding: '1.25rem' }}>
          <span className="muted" style={{ fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>
            Đang bị khóa truy cập (LOCKED)
          </span>
          <p style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--danger)', margin: '0.25rem 0 0' }}>
            {lockedCount} tài khoản
          </p>
          <span className="muted" style={{ fontSize: '0.8rem' }}>
            Tài khoản vi phạm quy chuẩn
          </span>
        </div>
      </div>

      {/* Add User Modal / Form */}
      {showAddForm && (
        <section className="panel" style={{ marginBottom: '1.5rem', border: '2px solid var(--brand)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ margin: 0, fontSize: '1.2rem' }}>Thêm tài khoản người dùng mới</h2>
            <button type="button" className="btn btn-outline btn-xs" onClick={() => setShowAddForm(false)}>
              Đóng form
            </button>
          </div>

          <form onSubmit={handleAddUser}>
            <div className="row">
              <div className="field">
                <label>Họ và tên *</label>
                <input
                  value={newFullName}
                  onChange={e => setNewFullName(e.target.value)}
                  placeholder="Ví dụ: Hoàng Đức Minh"
                  required
                />
              </div>
              <div className="field">
                <label>Tên đăng nhập *</label>
                <input
                  value={newUsername}
                  onChange={e => setNewUsername(e.target.value)}
                  placeholder="Ví dụ: minh.hoang"
                  required
                />
              </div>
            </div>

            <div className="row">
              <div className="field">
                <label>Số điện thoại *</label>
                <input
                  value={newPhone}
                  onChange={e => setNewPhone(e.target.value)}
                  placeholder="0912345678"
                  required
                />
              </div>
              <div className="field">
                <label>Email liên hệ *</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={e => setNewEmail(e.target.value)}
                  placeholder="minh@odauday.vn"
                  required
                />
              </div>
            </div>

            <div className="row">
              <div className="field">
                <label>Mật khẩu ban đầu</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div className="field">
                <label>Phân quyền (RBAC) *</label>
                <select value={newRole} onChange={e => setNewRole(e.target.value as any)}>
                  <option value="GUEST">GUEST (Khách thuê homestay)</option>
                  <option value="HOST">HOST (Đối tác chủ nhà)</option>
                  <option value="ADMIN">ADMIN (Quản trị viên hệ thống)</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
              <button type="submit" className="btn btn-primary">
                Tạo tài khoản
              </button>
              <button type="button" className="btn btn-outline" onClick={() => setShowAddForm(false)}>
                Hủy
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Filter Controls Panel */}
      <section className="panel" style={{ marginBottom: '1.5rem' }}>
        <div className="row-3" style={{ alignItems: 'end' }}>
          <div className="field">
            <label htmlFor="user-kw">
              <Search /> Tìm theo họ tên / username / email
            </label>
            <input
              id="user-kw"
              value={kw}
              onChange={e => setKw(e.target.value)}
              placeholder="admin, host.demo, guest.demo..."
            />
          </div>
          <div className="field">
            <label htmlFor="user-role">
              <ShieldLock /> Lọc theo vai trò (Role)
            </label>
            <select id="user-role" value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
              <option value="ALL">Tất cả vai trò</option>
              <option value="ADMIN">ADMIN (Quản trị viên)</option>
              <option value="HOST">HOST (Chủ nhà)</option>
              <option value="GUEST">GUEST (Khách thuê)</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="user-status">Trạng thái hoạt động</label>
            <select id="user-status" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="ALL">Tất cả trạng thái</option>
              <option value="ACTIVE">ACTIVE (Đang hoạt động)</option>
              <option value="LOCKED">LOCKED (Đang bị khóa)</option>
            </select>
          </div>
        </div>
      </section>

      {/* Users Table Panel */}
      <section className="panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--line)', paddingBottom: '0.75rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.2rem' }}>
            <PeopleFill className="text-brand" /> Danh sách người dùng ({filteredUsers.length})
          </h2>
          <span className="badge badge-active">
            <ShieldCheck /> Chuẩn RBAC
          </span>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th style={{ padding: '0.75rem' }}>Thành viên</th>
                <th style={{ padding: '0.75rem' }}>Tên đăng nhập</th>
                <th style={{ padding: '0.75rem' }}>Số điện thoại</th>
                <th style={{ padding: '0.75rem' }}>Vai trò RBAC</th>
                <th style={{ padding: '0.75rem' }}>Trạng thái</th>
                <th style={{ textAlign: 'right', padding: '0.75rem' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(u => (
                <tr key={u.id}>
                  <td style={{ padding: '0.75rem' }}>
                    <strong>{u.fullName}</strong>
                    <span className="muted" style={{ display: 'block', fontSize: '0.78rem' }}>
                      {u.email}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    <code style={{ fontSize: '0.9rem' }}>{u.username}</code>
                  </td>
                  <td style={{ padding: '0.75rem', fontSize: '0.88rem' }}>{u.phone}</td>
                  <td style={{ padding: '0.75rem' }}>
                    <select
                      value={u.role}
                      onChange={e => handleChangeRole(u, e.target.value as any)}
                      style={{ fontSize: '0.85rem', padding: '0.3rem 0.5rem', fontWeight: 600 }}
                    >
                      <option value="ADMIN">ADMIN</option>
                      <option value="HOST">HOST</option>
                      <option value="GUEST">GUEST</option>
                    </select>
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    <span className={`badge ${u.status === 'ACTIVE' ? 'badge-active' : 'badge-cancelled'}`}>
                      {u.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right', padding: '0.75rem' }}>
                    <div className="btn-group" style={{ justifyContent: 'flex-end' }}>
                      <button
                        type="button"
                        className={`btn btn-xs ${u.status === 'ACTIVE' ? 'btn-outline' : 'btn-primary'}`}
                        style={u.status === 'ACTIVE' ? { color: '#dc2626', borderColor: '#fca5a5' } : {}}
                        onClick={() => handleToggleStatus(u)}
                      >
                        {u.status === 'ACTIVE' ? (
                          <>
                            <LockFill /> Khóa tài khoản
                          </>
                        ) : (
                          <>
                            <UnlockFill /> Mở khóa
                          </>
                        )}
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
