import { useState } from 'react';
import type { Review } from '../types';
import useToast from '../hooks/useToast';

const MOCK_REVIEWS: Review[] = [
  {
    review_id: 1,
    user_id: 2,
    restaurant_id: 1,
    rating: 5,
    comment: 'Pizza rất ngon, giao hàng nhanh!',
    created_at: '2024-09-20T14:00:00',
  },
  {
    review_id: 2,
    user_id: 3,
    restaurant_id: 1,
    rating: 4,
    comment: 'Chất lượng tốt, nhưng hơi chậm một chút.',
    created_at: '2024-09-25T09:30:00',
  },
  {
    review_id: 3,
    user_id: 4,
    restaurant_id: 1,
    rating: 5,
    comment: 'Sẽ đặt lại lần sau!',
    created_at: '2024-10-01T20:15:00',
  },
];

// ─── StarRatingInput ──────────────────────────────────────────────────────────

function StarRatingInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="text-2xl transition-transform hover:scale-110"
          aria-label={`${star} sao`}
        >
          {star <= (hovered || value) ? '⭐' : '☆'}
        </button>
      ))}
    </div>
  );
}

// ─── ReviewCard ───────────────────────────────────────────────────────────────

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="bg-white rounded-2xl border border-black/[0.07] p-5">
      <div className="flex items-center justify-between mb-2">
        {/* reviews.rating */}
        <div className="flex">
          {Array.from({ length: 5 }, (_, i) => (
            <span
              key={i}
              className={i < review.rating ? 'text-amber-400' : 'text-gray-200'}
            >
              ★
            </span>
          ))}
        </div>
        {/* reviews.created_at */}
        <span className="text-xs text-[#7A7570]">
          {new Date(review.created_at).toLocaleDateString('vi-VN')}
        </span>
      </div>
      {/* reviews.comment */}
      <p className="text-sm text-[#252422]">{review.comment}</p>
      <p className="text-xs text-[#7A7570] mt-2">
        Người dùng #{review.user_id}
      </p>
    </div>
  );
}

// ─── ReviewsPage ──────────────────────────────────────────────────────────────

export function ReviewsPage({ restaurantId = 1 }: { restaurantId?: number }) {
  const { showToast } = useToast();
  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS);

  // New review form state
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const avgRating = reviews.length
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : 0;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) {
      showToast('Vui lòng chọn số sao đánh giá.');
      return;
    }
    if (!comment.trim()) {
      showToast('Vui lòng nhập nhận xét của bạn.');
      return;
    }

    // reviews table: user_id, restaurant_id, rating, comment, created_at
    const newReview: Review = {
      review_id: Date.now(),
      user_id: 1,
      restaurant_id: restaurantId,
      rating,
      comment: comment.trim(),
      created_at: new Date().toISOString(),
    };

    setReviews((prev) => [newReview, ...prev]);
    setRating(0);
    setComment('');
    showToast('Cảm ơn bạn đã đánh giá!');
  }

  return (
    <div className="min-h-screen bg-[#FFFBF7] px-4 py-8">
      <div className="max-w-xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-display font-bold text-2xl text-[#252422]">
            Đánh giá & Nhận xét
          </h1>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-3xl font-display font-bold text-[#EB5E28]">
              {avgRating.toFixed(1)}
            </span>
            <div>
              <div className="flex">
                {Array.from({ length: 5 }, (_, i) => (
                  <span
                    key={i}
                    className={
                      i < Math.round(avgRating)
                        ? 'text-amber-400'
                        : 'text-gray-200'
                    }
                  >
                    ★
                  </span>
                ))}
              </div>
              <p className="text-xs text-[#7A7570]">
                {reviews.length} đánh giá
              </p>
            </div>
          </div>
        </div>

        {/* Submit review form */}
        <div className="bg-white rounded-2xl border border-black/[0.07] p-5">
          <p className="font-semibold text-sm text-[#252422] mb-4">
            Viết đánh giá của bạn
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* reviews.rating */}
            <div>
              <label className="block text-xs font-semibold text-[#7A7570] mb-2">
                Số sao
              </label>
              <StarRatingInput value={rating} onChange={setRating} />
            </div>
            {/* reviews.comment */}
            <div>
              <label className="block text-xs font-semibold text-[#7A7570] mb-2">
                Nhận xét
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Chia sẻ trải nghiệm của bạn về nhà hàng này..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-black/10 bg-[#F5F0EB]
                           text-sm placeholder:text-[#7A7570] outline-none resize-none
                           focus:border-[#EB5E28] focus:bg-white focus:ring-2
                           focus:ring-[#EB5E28]/15 transition-all"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-full bg-[#EB5E28] text-white font-bold text-sm
                         hover:bg-[#d44e1e] active:scale-95 transition-all"
            >
              Gửi đánh giá
            </button>
          </form>
        </div>

        {/* Reviews list */}
        <div className="space-y-3">
          {reviews.map((review) => (
            <ReviewCard key={review.review_id} review={review} />
          ))}
        </div>
      </div>
    </div>
  );
}
