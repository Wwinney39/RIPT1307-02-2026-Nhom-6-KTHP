import type { DeliveryLog, DeliveryStatus } from '../types';

interface DeliveryStep {
  status: DeliveryStatus;
  label: string;
  sublabel: string;
  icon: string;
}

const DELIVERY_STEPS: DeliveryStep[] = [
  {
    status: 'assigned',
    label: 'Đã tìm được tài xế',
    sublabel: 'Tài xế đang đến nhà hàng',
    icon: '👤',
  },
  {
    status: 'picked_up',
    label: 'Đã lấy hàng',
    sublabel: 'Tài xế đã nhận đơn từ nhà hàng',
    icon: '📦',
  },
  {
    status: 'on_the_way',
    label: 'Đang trên đường giao',
    sublabel: 'Đơn hàng đang đến chỗ bạn',
    icon: '🛵',
  },
  {
    status: 'delivered',
    label: 'Giao hàng thành công',
    sublabel: 'Chúc bạn ngon miệng!',
    icon: '🎉',
  },
];

const STEP_ORDER: DeliveryStatus[] = [
  'assigned',
  'picked_up',
  'on_the_way',
  'delivered',
];

const MOCK_LOGS: DeliveryLog[] = [
  {
    log_id: 1,
    order_id: 1002,
    status: 'assigned',
    updated_at: '2024-10-05T18:12:00',
  },
  {
    log_id: 2,
    order_id: 1002,
    status: 'picked_up',
    updated_at: '2024-10-05T18:25:00',
  },
  {
    log_id: 3,
    order_id: 1002,
    status: 'on_the_way',
    updated_at: '2024-10-05T18:30:00',
  },
];

const MOCK_DRIVER = {
  name: 'Nguyễn Minh Tuấn',
  plate: '51G1 - 489.23',
  phone: '0901 234 567',
  avatar: '🧑‍✈️',
};

export function DeliveryTrackingPage({ orderId = 1002 }: { orderId?: number }) {
  const logs = MOCK_LOGS.filter((l) => l.order_id === orderId);
  const completedStatuses = new Set(logs.map((l) => l.status));

  const currentStepIdx = STEP_ORDER.reduce(
    (acc, s, i) => (completedStatuses.has(s) ? i : acc),
    -1,
  );

  const currentStep = DELIVERY_STEPS[currentStepIdx] ?? DELIVERY_STEPS[0];
  const isDelivered = completedStatuses.has('delivered');

  return (
    <div className="min-h-screen bg-[#FFFBF7]">
      <div
        className="sticky top-0 z-10 bg-[#FFFBF7]/90 backdrop-blur-md
                      border-b border-black/[0.06] px-4 py-4"
      >
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <button
            onClick={() => window.history.back()}
            className="w-9 h-9 rounded-full border border-black/10 bg-white
                       flex items-center justify-center text-[#252422]
                       hover:bg-[#F5F0EB] transition-colors shrink-0"
            aria-label="Quay lại"
          >
            ←
          </button>
          <div>
            <h1 className="font-display font-bold text-lg text-[#252422] leading-tight">
              Theo dõi đơn hàng
            </h1>
            <p className="text-xs text-[#7A7570]">Đơn #{orderId}</p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
        <div className="bg-[#252422] rounded-2xl p-6 text-center relative overflow-hidden">
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            aria-hidden="true"
          >
            <div className="w-64 h-64 rounded-full bg-[#EB5E28]/10 blur-3xl" />
          </div>

          <div className="relative z-10">
            <div className="text-5xl mb-3">{currentStep.icon}</div>
            <p className="font-display font-bold text-white text-xl">
              {currentStep.label}
            </p>
            <p className="text-white/50 text-sm mt-1">{currentStep.sublabel}</p>

            {!isDelivered && (
              <div
                className="mt-5 inline-flex items-center gap-2 bg-white/10
                              border border-white/10 rounded-xl px-5 py-3"
              >
                <span className="text-white/55 text-xs uppercase tracking-widest">
                  Dự kiến giao lúc
                </span>
                <span className="font-display font-bold text-white text-xl">
                  18:50
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-black/[0.07] p-6">
          <p className="font-display font-bold text-[#252422] mb-5">
            Trạng thái vận chuyển
          </p>

          <div className="relative">
            <div
              className="absolute left-[19px] top-5 bottom-5 w-0.5 bg-[#F5F0EB]"
              aria-hidden="true"
            />

            <div className="space-y-0">
              {DELIVERY_STEPS.map((step, idx) => {
                const isCompleted = completedStatuses.has(step.status);
                const isCurrent = idx === currentStepIdx;
                const log = logs.find((l) => l.status === step.status);
                const isPending = !isCompleted && !isCurrent;

                return (
                  <div
                    key={step.status}
                    className="flex items-start gap-4 relative py-3"
                  >
                    <div
                      className={`
                        relative z-10 w-10 h-10 rounded-full flex items-center
                        justify-center text-base shrink-0 border-2 transition-all duration-300
                        ${
                          isCompleted
                            ? 'bg-[#EB5E28]  border-[#EB5E28]  text-white shadow-[0_0_0_4px_rgba(235,94,40,0.15)]'
                            : isCurrent
                              ? 'bg-orange-50  border-[#EB5E28]  text-[#EB5E28] shadow-[0_0_0_4px_rgba(235,94,40,0.12)] animate-pulse'
                              : 'bg-white      border-[#E5E0DB] text-[#B0AAA4]'
                        }
                      `}
                    >
                      {isCompleted ? '✓' : step.icon}
                    </div>

                    <div className="pt-2 flex-1 min-w-0">
                      <p
                        className={`text-sm font-semibold leading-tight
                          ${isPending ? 'text-[#B0AAA4]' : 'text-[#252422]'}`}
                      >
                        {step.label}
                      </p>
                      {log ? (
                        <p className="text-xs text-[#7A7570] mt-0.5">
                          {new Date(log.updated_at).toLocaleTimeString(
                            'vi-VN',
                            {
                              hour: '2-digit',
                              minute: '2-digit',
                            },
                          )}
                        </p>
                      ) : (
                        <p
                          className={`text-xs mt-0.5
                          ${isPending ? 'text-[#C8C2BC]' : 'text-[#7A7570]'}`}
                        >
                          {step.sublabel}
                        </p>
                      )}
                    </div>

                    {isCurrent && (
                      <span
                        className="shrink-0 mt-3 w-2 h-2 rounded-full bg-[#EB5E28]
                                       animate-pulse"
                        aria-hidden="true"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        {!isDelivered && (
          <div className="bg-white rounded-2xl border border-black/[0.07] p-5">
            <p className="font-display font-bold text-[#252422] mb-4">
              🏍️ Thông tin tài xế
            </p>

            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-2xl bg-[#F5F0EB] flex items-center
                              justify-center text-3xl shrink-0"
              >
                {MOCK_DRIVER.avatar}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-display font-bold text-[#252422]">
                  {MOCK_DRIVER.name}
                </p>
                <p className="text-sm text-[#7A7570] mt-0.5">
                  🏍 {MOCK_DRIVER.plate}
                </p>
              </div>

              <a
                href={`tel:${MOCK_DRIVER.phone}`}
                className="w-11 h-11 rounded-full bg-[#EB5E28] flex items-center
                           justify-center text-white text-lg hover:bg-[#d44e1e]
                           transition-colors shadow-md shrink-0"
                aria-label={`Gọi cho ${MOCK_DRIVER.name}`}
              >
                📞
              </a>
            </div>

            <div
              className="mt-4 px-4 py-3 rounded-xl bg-[#F5F0EB] flex items-center
                            justify-between"
            >
              <span className="text-xs text-[#7A7570]">Số điện thoại</span>
              <span className="text-sm font-semibold text-[#252422]">
                {MOCK_DRIVER.phone}
              </span>
            </div>
          </div>
        )}

        {isDelivered && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-center">
            <p className="text-3xl mb-2">🎉</p>
            <p className="font-display font-bold text-emerald-700">
              Đơn hàng đã được giao thành công!
            </p>
            <p className="text-sm text-emerald-600/80 mt-1">
              Cảm ơn bạn đã tin tưởng ZestyDash
            </p>
            <button
              onClick={() =>
                (window.location.href = `/reviews?order=${orderId}`)
              }
              className="mt-4 px-6 py-2.5 rounded-full bg-emerald-600 text-white
                         font-bold text-sm hover:bg-emerald-700 transition-colors"
            >
              ⭐ Đánh giá ngay
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
