// UC-05: Review Form Page (TypeScript)
import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useStore } from '../../contexts/StoreContext';
import { UCTag, Breadcrumb, Alert } from '../../components/UI';
import {
  ChatQuoteFill,
  StarFill,
  ShieldCheck,
  SendCheck,
  CheckCircleFill,
  ClockHistory,
} from 'react-bootstrap-icons';

export default function ReviewFormPage() {
  const [searchParams] = useSearchParams();
  const { store, currentUser, addToast } = useStore();
  const navigate = useNavigate();

  const bookingCode = searchParams.get('bookingCode') || 'ODD-DEMO-0001';
  const booking = store.getBooking(bookingCode) || store.getAllBookings()[0];

  const [rating, setRating] = useState('5');
  const [comment, setComment] = useState('Phòng sạch sẽ, view vườn thoáng mát và chủ nhà hỗ trợ check-in rất nhiệt tình!');
  const [testScenario, setTestScenario] = useState<'tc11' | 'tc12'>(booking?.isReviewed ? 'tc12' : 'tc11');

  const handleScenarioChange = (scenario: 'tc11' | 'tc12') => {
    setTestScenario(scenario);
    if (scenario === 'tc12') {
      addToast('Mô phỏng TC-12: Đơn đã gửi đánh giá trước đó', 'info');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (testScenario === 'tc12' || booking?.isReviewed) {
      addToast('Từ chối gửi: Đơn này đã được đánh giá trước đó (TC-12)!', 'error');
      return;
    }

    const res = store.submitReview({
      bookingCode,
      propertyId: booking?.propertyId || 1,
      guestUsername: currentUser?.username || 'guest.demo',
      guestName: currentUser?.fullName || 'Khách thuê Demo',
      rating: Number(rating),
      comment,
    });

    if (res.success) {
      addToast('Cảm ơn bạn! Đánh giá đã được đăng công khai (TC-11).', 'success');
      setTestScenario('tc12');
    } else {
      addToast(res.message || 'Lỗi khi gửi đánh giá', 'error');
    }
  };

  return (
    <div style={{ maxWidth: 840, margin: '1.5rem auto', padding: '0 1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
        <Breadcrumb
          items={[
            { label: 'Trang chủ', to: '/' },
            { label: 'Đơn của tôi', to: '/my-bookings' },
            { label: `Đánh giá đơn #${bookingCode}` },
          ]}
        />
        <UCTag>
          <ChatQuoteFill /> UC-05 · Đánh giá kỳ lưu trú
        </UCTag>
      </div>

      <h1 className="page-title" style={{ marginBottom: '0.4rem' }}>
        Đánh giá &amp; Chia sẻ trải nghiệm lưu trú
      </h1>
      <p className="page-sub" style={{ marginBottom: '1.25rem' }}>
        Khách thuê chỉ được đánh giá các đơn đã hoàn thành thực tế (<code>COMPLETED</code>), mỗi đơn gửi tối đa một lần để
        bảo đảm tính khách quan (quy tắc BR-07).
      </p>

      {/* State Switcher */}
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
          Chọn kịch bản kiểm thử:
        </span>
        <div className="btn-group">
          <button
            type="button"
            className={`btn btn-sm ${testScenario === 'tc11' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => handleScenarioChange('tc11')}
          >
            Chưa đánh giá (TC-11)
          </button>
          <button
            type="button"
            className={`btn btn-sm ${testScenario === 'tc12' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => handleScenarioChange('tc12')}
          >
            Đã gửi đánh giá trước đó (TC-12)
          </button>
        </div>
      </div>

      {testScenario === 'tc11' ? (
        <section className="panel" style={{ boxShadow: 'var(--shadow-md)' }}>
          <Alert type="info" title={`Đơn #${bookingCode} · Trạng thái COMPLETED`}>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.88rem' }}>
              Kỳ nghỉ của bạn tại <strong>{booking?.propertyName || 'ODauDay Stay Hồ Tây'}</strong> đã kết thúc tốt đẹp.
              Bạn có quyền gửi 01 đánh giá công khai kèm số sao để giúp cộng đồng du khách có góc nhìn chân thực.
            </p>
          </Alert>

          <form onSubmit={handleSubmit} style={{ marginTop: '1.25rem' }}>
            <div className="field">
              <label htmlFor="review-rating">
                <StarFill className="text-brand" /> Mức độ hài lòng chung (1 – 5 sao) *
              </label>
              <select
                id="review-rating"
                value={rating}
                onChange={e => setRating(e.target.value)}
                style={{ fontWeight: 600, fontSize: '0.95rem' }}
              >
                <option value="5">★★★★★ 5 sao — Rất hài lòng, dịch vụ và phòng nghỉ tuyệt vời</option>
                <option value="4">★★★★☆ 4 sao — Hài lòng, chỗ ở sạch sẽ và tiện nghi</option>
                <option value="3">★★★☆☆ 3 sao — Bình thường, đạt yêu cầu cơ bản</option>
                <option value="2">★★☆☆☆ 2 sao — Chưa hài lòng, cần cải thiện</option>
                <option value="1">★☆☆☆☆ 1 sao — Trải nghiệm rất thất vọng</option>
              </select>
            </div>

            <div className="field">
              <label htmlFor="review-cmt">
                <ChatQuoteFill className="text-brand" /> Cảm nhận &amp; Góp ý chi tiết cho chủ nhà *
              </label>
              <textarea
                id="review-cmt"
                value={comment}
                onChange={e => setComment(e.target.value)}
                rows={4}
                required
              />
            </div>

            <div style={{ background: '#f0fdfa', border: '1px solid #ccfbf1', borderRadius: 8, padding: '0.75rem 1rem', fontSize: '0.82rem', color: '#0f766e', marginBottom: '1.25rem' }}>
              <ShieldCheck /> Đánh giá sau khi gửi sẽ được gắn nhãn <strong>Khách thuê xác thực (Verified Stay)</strong> và hiển thị công khai trên trang chi tiết chỗ ở.
            </div>

            <button type="submit" className="btn btn-primary btn-block" style={{ padding: '0.85rem', fontSize: '1rem' }}>
              <SendCheck /> Gửi đánh giá công khai (TC-11)
            </button>
          </form>
        </section>
      ) : (
        <section className="panel" style={{ boxShadow: 'var(--shadow-md)', textAlign: 'center', padding: '3rem 2rem' }}>
          <CheckCircleFill style={{ fontSize: '3rem', color: 'var(--ok)', marginBottom: '1rem' }} />
          <h2 style={{ fontSize: '1.35rem', marginBottom: '0.5rem' }}>Đơn này đã được gửi đánh giá trước đó (TC-12)</h2>
          <p className="muted" style={{ maxWidth: 520, margin: '0 auto 1.5rem', lineHeight: 1.6 }}>
            Theo quy tắc bảo đảm tính khách quan BR-07: Mỗi đơn đặt phòng hoàn tất chỉ được gửi đánh giá đúng 01 lần duy
            nhất nhằm bảo vệ uy tín dữ liệu.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link to={`/property/${booking?.propertyId || 1}`} className="btn btn-primary">
              Xem đánh giá tại trang chỗ ở
            </Link>
            <Link to="/my-bookings" className="btn btn-outline">
              Quay lại Đơn của tôi
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
