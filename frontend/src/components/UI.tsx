// Shared Reusable UI Components (TypeScript)
import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { StarFill, GeoAltFill, PeopleFill } from 'react-bootstrap-icons';
import { formatVND } from '../constants';
import { Property } from '../data';

// ── UCTag ──────────────────────────────────────────────────────────────
export interface UCTagProps {
  children: ReactNode;
}
export function UCTag({ children }: UCTagProps) {
  return <span className="uc-tag">{children}</span>;
}

// ── Breadcrumb ──────────────────────────────────────────────────────────
export interface BreadcrumbItem {
  label: string;
  to?: string;
}
export interface BreadcrumbProps {
  items: BreadcrumbItem[];
}
export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <p className="breadcrumb">
      {items.map((item, i) => (
        <span key={i}>
          {item.to ? <Link to={item.to}>{item.label}</Link> : <span>{item.label}</span>}
          {i < items.length - 1 && <span style={{ color: 'var(--subtle)', fontSize: '0.7rem' }}> › </span>}
        </span>
      ))}
    </p>
  );
}

// ── Alert ──────────────────────────────────────────────────────────────
export interface AlertProps {
  type?: 'info' | 'ok' | 'warn' | 'error';
  title?: string;
  children: ReactNode;
}
export function Alert({ type = 'info', title, children }: AlertProps) {
  return (
    <div className={`alert alert-${type}`} role="alert">
      {title && <strong>{title}</strong>}
      {children}
    </div>
  );
}

// ── Badge ──────────────────────────────────────────────────────────────
export interface BadgeProps {
  variant?: 'active' | 'pending' | 'confirmed' | 'checked' | 'completed' | 'cancelled' | 'rejected' | 'outline';
  children: ReactNode;
  style?: React.CSSProperties;
}
export function Badge({ variant = 'active', children, style }: BadgeProps) {
  return (
    <span className={`badge badge-${variant}`} style={style}>
      {children}
    </span>
  );
}

// ── Property Card ──────────────────────────────────────────────────────
export interface PropertyCardProps {
  property: Property;
  checkIn?: string;
  checkOut?: string;
  guests?: number | string;
}
export function PropertyCard({ property, checkIn, checkOut, guests }: PropertyCardProps) {
  const params = new URLSearchParams();
  if (checkIn) params.set('in', checkIn);
  if (checkOut) params.set('out', checkOut);
  if (guests) params.set('guests', String(guests));
  const detailUrl = `/property/${property.id}${params.toString() ? '?' + params.toString() : ''}`;

  return (
    <article className="card">
      <div
        className="thumb"
        style={{
          backgroundImage: `linear-gradient(to top, rgba(15,23,42,0.85) 0%, rgba(15,23,42,0.1) 60%), url('${property.image}')`,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <span>{property.type}</span>
          {property.badge && <span className="badge badge-active">{property.badge}</span>}
        </div>
      </div>
      <div className="body">
        <h3>
          <Link to={detailUrl} style={{ color: 'inherit' }}>
            {property.name}
          </Link>
        </h3>
        <p className="meta">
          <GeoAltFill style={{ color: 'var(--brand)' }} /> {property.address}
        </p>
        <p className="meta stars">
          {'★'.repeat(Math.round(property.rating || 5))}{' '}
          <span className="muted">
            {property.rating?.toFixed(1) || '5.0'} ({property.reviewsCount || 20} đánh giá)
          </span>
        </p>
        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', margin: '0.4rem 0 0.8rem' }}>
          {property.amenities?.slice(0, 2).map((a, idx) => (
            <span key={idx} className="badge" style={{ background: '#f1f5f9', color: '#475569', fontSize: '0.72rem' }}>
              {a}
            </span>
          ))}
        </div>
        <p className="price">
          từ {formatVND(property.priceMin)} <small>/ đêm</small>
        </p>
        <Link className="btn btn-outline btn-sm btn-block" to={detailUrl}>
          Xem chi tiết phòng
        </Link>
      </div>
    </article>
  );
}

// ── State Banner ───────────────────────────────────────────────────────
export interface StateBannerProps {
  currentKey: string;
  options: { key: string; label: string; desc?: string }[];
  onChange: (key: string) => void;
}
export function StateBanner({ currentKey, options, onChange }: StateBannerProps) {
  return (
    <div
      style={{
        background: '#ffffff',
        border: '1px solid var(--line)',
        borderRadius: 'var(--radius)',
        padding: '0.75rem 1.25rem',
        marginBottom: '1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
        boxShadow: 'var(--shadow-xs)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--ink-secondary)' }}>
        <span>Chọn kịch bản kiểm thử:</span>
      </div>
      <div className="btn-group">
        {options.map(opt => (
          <button
            key={opt.key}
            type="button"
            className={`btn btn-sm ${currentKey === opt.key ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => onChange(opt.key)}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
