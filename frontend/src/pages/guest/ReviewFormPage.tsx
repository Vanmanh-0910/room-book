// Airbnb-Inspired Review Form Page (TypeScript)
import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useStore } from '../../contexts/StoreContext';
import { Breadcrumb } from '../../components/UI';
import {
  StarFill,
  CheckCircleFill,
  ShieldCheck,
} from 'react-bootstrap-icons';

export default function ReviewFormPage() {
  const [searchParams] = useSearchParams();
  const { store, currentUser, addToast } = useStore();
  const navigate = useNavigate();

  const bookingCode = searchParams.get('bookingCode') || 'ODD-DEMO-0001';
  const booking = store.getBooking(bookingCode) || store.getAllBookings()[0];

  const [rating, setRating] = useState('5');
  const [comment, setComment] = useState('Phòng sạch sẽ, view thoáng đãng và chủ nhà hỗ trợ đón tiếp rất nhiệt tình!');
  const [isSubmitted, setIsSubmitted] = useState(booking?.isReviewed || false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (booking?.isReviewed || isSubmitted) {
      addToast('Chuyến đi này đã được gửi đánh giá trước đó.', 'error');
      return;
    }

    const res = store.submitReview({
      bookingCode,
      propertyId: booking?.propertyId || 1,
      guestUsername: currentUser?.username || 'guest.demo',
      guestName: currentUser?.fullName || 'Khách thuê',
      rating: Number(rating),
      comment,
    });

    if (res.success) {
      addToast('Cảm ơn bạn! Đánh giá đã được gửi thành công.', 'success');
      setIsSubmitted(true);
    } else {
      addToast(res.message || 'Lỗi khi gửi đánh giá', 'error');
    }
  };

  return (
    <div style={{ maxWidth: 720, margin: '2rem auto 5rem', padding: '0 1.5rem' }}>
      <Breadcrumb
        items={[
          { label: 'Trang chủ', to: '/' },
          { label: 'Chuyến đi', to: '/my-bookings' },
          { label: `Đánh giá #${bookingCode}` },
        ]}
      />

      {!isSubmitted ? (
        <div
          style={{
            border: '1px solid var(--line-strong)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-card)',
            background: '#ffffff',
            padding: '2.5rem 2rem',
          }}
        >
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 0.5rem', color: 'var(--ink)' }}>
            Kỳ nghỉ của bạn như thế nào?
          </h1>
          <p style={{ margin: '0 0 1.5rem', color: 'var(--ink-secondary)', fontSize: '0.95rem' }}>
            Chia sẻ trải nghiệm lưu trú tại <strong>{booking?.propertyName || 'ODauDay Stay'}</strong> để giúp chủ nhà hoàn thiện và hỗ trợ các du khách khác.
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label htmlFor="review-stars" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                Đánh giá tổng quan
              </label>
              <select
                id="review-stars"
                value={rating}
                onChange={e => setRating(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--line-strong)',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <option value="5">★★★★★ 5 sao — Rất tuyệt vời, vượt trên mong đợi</option>
                <option value="4">★★★★☆ 4 sao — Hài lòng, phòng sạch và tiện nghi</option>
                <option value="3">★★★☆☆ 3 sao — Bình thường, đáp ứng nhu cầu cơ bản</option>
                <option value="2">★★☆☆☆ 2 sao — Chưa hài lòng, cần cải thiện</option>
                <option value="1">★☆☆☆☆ 1 sao — Trải nghiệm thất vọng</option>
              </select>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label htmlFor="review-text" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                Cảm nhận chi tiết
              </label>
              <textarea
                id="review-text"
                value={comment}
                onChange={e => setComment(e.target.value)}
                rows={4}
                required
                placeholder="Chia sẻ về không gian, sự sạch sẽ, vị trí và sự hỗ trợ từ chủ nhà..."
                style={{
                  width: '100%',
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--line-strong)',
                  fontSize: '0.95rem',
                  lineHeight: 1.6,
                  resize: 'vertical',
                }}
              />
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.82rem',
                color: 'var(--ink-secondary)',
                marginBottom: '1.5rem',
              }}
            >
              <ShieldCheck style={{ fontSize: '1.1rem', color: '#059669', flexShrink: 0 }} />
              <span>Đánh giá được xác thực sau kỳ nghỉ thực tế để bảo đảm sự chân thực và uy tín.</span>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{
                padding: '0.9rem 2rem',
                fontSize: '1rem',
                fontWeight: 700,
                borderRadius: 'var(--radius-md)',
              }}
            >
              Gửi đánh giá
            </button>
          </form>
        </div>
      ) : (
        <div
          style={{
            border: '1px solid var(--line-strong)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-card)',
            background: '#ffffff',
            padding: '3rem 2rem',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 'var(--radius-full)',
              background: '#ecfdf5',
              color: '#059669',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              margin: '0 auto 1.25rem',
            }}
          >
            <CheckCircleFill />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.5rem' }}>
            Cảm ơn bạn đã gửi đánh giá!
          </h2>
          <p style={{ color: 'var(--ink-secondary)', maxWidth: 450, margin: '0 auto 1.5rem', lineHeight: 1.6 }}>
            Đánh giá của bạn đã được lưu và hiển thị công khai trên trang thông tin chỗ ở.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link
              to={`/property/${booking?.propertyId || 1}`}
              className="btn btn-primary"
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: 'var(--radius-md)',
                fontWeight: 700,
                fontSize: '0.92rem',
              }}
            >
              Xem chỗ ở
            </Link>
            <Link
              to="/my-bookings"
              className="btn btn-outline"
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: 'var(--radius-md)',
                fontWeight: 600,
                fontSize: '0.92rem',
              }}
            >
              Về danh sách chuyến đi
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
