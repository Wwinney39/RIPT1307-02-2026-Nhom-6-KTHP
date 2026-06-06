import useToast from '../../hooks/useToast';
import { CheckIcon } from './Icons';

export function ToastContainer() {
  const { toasts, dismissToast } = useToast();

  return (
    <div
      className="fixed bottom-8 right-8 z-50 flex flex-col gap-3 pointer-events-none"
      aria-live="polite"
      aria-atomic="false"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-center gap-3 bg-[#252422] text-white
                     px-4 py-3 rounded-2xl shadow-2xl max-w-xs text-sm
                     animate-slide-up"
          role="alert"
        >
          <span
            className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center text-[#EB5E28]"
            aria-hidden="true"
          >
            <CheckIcon size={14} />
          </span>
          <span
            className="leading-snug"
            dangerouslySetInnerHTML={{ __html: toast.message }}
          />
          <button
            onClick={() => dismissToast(toast.id)}
            className="ml-auto flex-shrink-0 text-white/40 hover:text-white/80 transition-colors"
            aria-label="Đóng thông báo"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
