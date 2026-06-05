import { useState } from 'react';

export function ReviewsPage() {
  const queryParams = new URLSearchParams(window.location.search);
  const restaurantName = queryParams.get('restaurant_name') || 'nhà hàng';
  const restaurantEmoji = queryParams.get('restaurant_emoji') || '🛍️';

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  function handleSubmitReview() {
    if (rating === 0) {
      alert('Vui lòng chọn số sao!');
      return;
    }
    setShowSuccessModal(true);
  }

  return (
    <div className="min-h-screen bg-[#FFFBF7] py-8 px-4 relative">
      <div className="max-w-xl mx-auto space-y-5">
        <button
          onClick={() => window.history.back()}
          className="text-sm text-[#7A7570] flex items-center gap-1 hover:underline"
        >
          ← Quay lại
        </button>

        <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-orange-50 border border-orange-100/60 w-fit">
          <span className="text-xl">{restaurantEmoji}</span>
          <p className="text-xs font-semibold text-[#252422]">
            Đang viết đánh giá cho:{' '}
            <span className="text-[#EB5E28] font-bold">{restaurantName}</span>
          </p>
        </div>

        <div className="space-y-1">
          <h1 className="font-display font-bold text-2xl text-[#252422]">
            Đánh giá & Nhận xét
          </h1>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[#EB5E28]">0.0</span>
            <div className="flex flex-col">
              <span className="text-gray-200 text-sm">★★★★★</span>
              <span className="text-xs text-[#7A7570]">0 đánh giá</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-black/[0.07] p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-[#252422]">
            Viết đánh giá của bạn
          </h2>

          <div className="space-y-1">
            <label className="block text-xs text-[#7A7570]">Số sao</label>
            <div className="flex gap-1 text-2xl">
              {[1, 2, 3, 4, 5].map((star) => {
                const isLit = hoverRating
                  ? star <= hoverRating
                  : star <= rating;
                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className={`transition-all duration-100 ${isLit ? 'text-amber-400' : 'text-gray-200'}`}
                  >
                    ★
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs text-[#7A7570]">Nhận xét</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={`Chia sẻ trải nghiệm về ${restaurantName}...`}
              rows={4}
              className="w-full p-4 rounded-xl border border-orange-500/30 text-sm resize-none bg-white"
            />
          </div>

          <button
            onClick={handleSubmitReview}
            className="w-full py-3 bg-[#EB5E28] text-white font-bold rounded-full hover:bg-[#d44e1e] transition-colors text-sm"
          >
            Gửi đánh giá
          </button>
        </div>

        <div className="text-center py-4 bg-white rounded-xl border border-black/[0.02]">
          <p className="text-xs italic text-[#7A7570]">
            Chưa có đánh giá cho {restaurantName}. Hãy là người đầu tiên!
          </p>
        </div>
      </div>

      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 text-2xl mx-auto">
              🎉
            </div>
            <h3 className="font-bold text-lg">Đã gửi đánh giá!</h3>
            <p className="text-sm text-[#7A7570]">
              Cảm ơn bạn đã góp ý cho {restaurantName}.
            </p>
            <button
              onClick={() => {
                setShowSuccessModal(false);
                window.history.back();
              }}
              className="w-full py-3 rounded-full bg-emerald-600 text-white font-bold text-sm"
            >
              Đóng lại
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
