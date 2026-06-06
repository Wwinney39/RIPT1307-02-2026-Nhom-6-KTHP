import { ShieldAlert, X } from 'lucide-react';

interface AuthGuardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function AuthGuardModal({
  isOpen,
  onClose,
  onConfirm,
}: AuthGuardModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-center shadow-2xl transition-all animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
        >
          <X size={18} />
        </button>

        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-500">
          <ShieldAlert size={28} />
        </div>

        <h3 className="text-lg font-bold text-gray-900 mb-2">
          Yêu cầu đăng nhập
        </h3>
        <p className="text-sm text-gray-500 mb-6 px-2 leading-relaxed">
          Vui lòng đăng nhập vào tài khoản của bạn để sử dụng tính năng theo dõi
          và quản lý đơn hàng của ZestyDash.
        </p>

        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 active:scale-95 transition-all"
          >
            Để sau
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="w-full sm:w-auto px-5 py-2 text-sm font-bold text-white bg-[#EB5E28] rounded-xl hover:bg-[#d44e1e] active:scale-95 transition-all shadow-md shadow-orange-500/10"
          >
            Đăng nhập ngay
          </button>
        </div>
      </div>
    </div>
  );
}
