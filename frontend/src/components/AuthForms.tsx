import { useState } from 'react';
import useToast from '../hooks/useToast';
import { api } from '../utils/api';
import { storage } from '../utils/storage';

type ForgotStep = 'phone' | 'otp' | 'reset' | 'done';

function ForgotPasswordModal({ onClose }: { onClose: () => void }) {
  const { showToast } = useToast();
  const [step, setStep] = useState<ForgotStep>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSendOtp() {
    if (!phone.trim()) {
      showToast('Vui lòng nhập số điện thoại!');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        'http://localhost:3000/api/auth/forgot-password',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone }),
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      showToast('Đã gửi OTP về số điện thoại!');
      setStep('otp');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Có lỗi xảy ra!');
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp() {
    if (!otp.trim()) {
      showToast('Vui lòng nhập mã OTP!');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3000/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setResetToken(data.reset_token);
      setStep('reset');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Có lỗi xảy ra!');
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword() {
    if (!newPassword || !confirmPassword) {
      showToast('Vui lòng điền đầy đủ thông tin!');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('Mật khẩu xác nhận không khớp!');
      return;
    }
    if (newPassword.length < 6) {
      showToast('Mật khẩu phải có ít nhất 6 ký tự!');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3000/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reset_token: resetToken,
          new_password: newPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setStep('done');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Có lỗi xảy ra!');
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    'w-full px-4 py-3 rounded-xl border border-black/10 bg-[#F5F0EB] text-sm placeholder:text-[#7A7570] outline-none focus:border-[#EB5E28] focus:bg-white focus:ring-2 focus:ring-[#EB5E28]/15 transition-all';

  const btnClass =
    'w-full py-3 rounded-full bg-[#EB5E28] text-white font-bold text-sm hover:bg-[#d44e1e] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed';

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{
        backgroundColor: 'rgba(37,36,34,0.55)',
        backdropFilter: 'blur(2px)',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-sm bg-white rounded-3xl border border-black/[0.07] shadow-2xl p-8 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full bg-[#F5F0EB] text-[#7A7570] hover:bg-[#EB5E28]/10 hover:text-[#EB5E28] transition-all text-lg font-bold"
          aria-label="Đóng"
        >
          ×
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#EB5E28]/10 flex items-center justify-center mx-auto mb-3">
            {step === 'done' ? (
              <svg
                className="w-6 h-6 text-[#EB5E28]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6 text-[#EB5E28]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 11c0-1.657-1.343-3-3-3S6 9.343 6 11v1H4v8h16v-8h-2v-1c0-1.657-1.343-3-3-3s-3 1.343-3 3v1H9v-1zm3 0v1H9v-1c0-1.657 1.343-3 3-3s3 1.343 3 3v1H9v-1c0-1.657 1.343-3 3-3s3 1.343 3 3z"
                />
                <circle cx="12" cy="16" r="1.5" fill="currentColor" />
              </svg>
            )}
          </div>

          <h2 className="font-display font-bold text-lg text-[#252422]">
            {step === 'phone' && 'Quên mật khẩu'}
            {step === 'otp' && 'Xác minh OTP'}
            {step === 'reset' && 'Đặt mật khẩu mới'}
            {step === 'done' && 'Thành công!'}
          </h2>
          <p className="text-xs text-[#7A7570] mt-1">
            {step === 'phone' && 'Nhập số điện thoại để nhận mã OTP'}
            {step === 'otp' && `Mã OTP đã gửi đến ${phone}`}
            {step === 'reset' && 'Tạo mật khẩu mới cho tài khoản'}
            {step === 'done' && 'Mật khẩu đã được cập nhật thành công'}
          </p>
        </div>

        {/* Step indicator */}
        {step !== 'done' && (
          <div className="flex items-center justify-center gap-1.5 mb-6">
            {(['phone', 'otp', 'reset'] as ForgotStep[]).map((s, i) => (
              <div
                key={s}
                className={`rounded-full transition-all ${
                  s === step
                    ? 'w-6 h-1.5 bg-[#EB5E28]'
                    : ['phone', 'otp', 'reset'].indexOf(step) > i
                      ? 'w-1.5 h-1.5 bg-[#EB5E28]/40'
                      : 'w-1.5 h-1.5 bg-black/10'
                }`}
              />
            ))}
          </div>
        )}

        {/* Step 1: Phone */}
        {step === 'phone' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-[#252422] mb-1.5">
                Số điện thoại
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0912 345 678"
                className={inputClass}
                onKeyDown={(e) => e.key === 'Enter' && handleSendOtp()}
                autoFocus
              />
            </div>
            <button
              onClick={handleSendOtp}
              disabled={loading}
              className={btnClass}
            >
              {loading ? 'Đang gửi...' : 'Gửi mã OTP'}
            </button>
          </div>
        )}

        {/* Step 2: OTP */}
        {step === 'otp' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-[#252422] mb-1.5">
                Mã OTP (6 chữ số)
              </label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="• • • • • •"
                className={
                  inputClass + ' tracking-[0.3em] text-center font-bold text-lg'
                }
                onKeyDown={(e) => e.key === 'Enter' && handleVerifyOtp()}
                autoFocus
              />
            </div>
            <button
              onClick={handleVerifyOtp}
              disabled={loading}
              className={btnClass}
            >
              {loading ? 'Đang xác minh...' : 'Xác minh OTP'}
            </button>
            <button
              onClick={() => {
                setOtp('');
                handleSendOtp();
              }}
              disabled={loading}
              className="w-full text-center text-xs text-[#7A7570] hover:text-[#EB5E28] transition-colors py-1"
            >
              Chưa nhận được mã?{' '}
              <span className="font-semibold text-[#EB5E28]">Gửi lại</span>
            </button>
          </div>
        )}

        {/* Step 3: New password */}
        {step === 'reset' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-[#252422] mb-1.5">
                Mật khẩu mới
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Tối thiểu 6 ký tự"
                className={inputClass}
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#252422] mb-1.5">
                Xác nhận mật khẩu
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Nhập lại mật khẩu"
                className={inputClass}
                onKeyDown={(e) => e.key === 'Enter' && handleResetPassword()}
              />
            </div>
            <button
              onClick={handleResetPassword}
              disabled={loading}
              className={btnClass}
            >
              {loading ? 'Đang cập nhật...' : 'Đặt mật khẩu mới'}
            </button>
          </div>
        )}

        {/* Step done */}
        {step === 'done' && (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#EB5E28]/10 flex items-center justify-center mx-auto">
              <svg
                className="w-8 h-8 text-[#EB5E28]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <p className="text-sm text-[#7A7570]">
              Bạn có thể đăng nhập với mật khẩu mới ngay bây giờ.
            </p>
            <button onClick={onClose} className={btnClass}>
              Đăng nhập ngay
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function LoginForm() {
  const { showToast } = useToast();
  const [form, setForm] = useState({ phone: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.phone || !form.password) {
      showToast('Vui lòng điền đầy đủ thông tin.');
      return;
    }

    setLoading(true);
    try {
      const response = await api.login(form.phone, form.password);

      const userData = {
        name: response.user.name,
        phone: response.user.phone,
        avatarInitial: response.user.name.charAt(0).toUpperCase(),
      };

      storage.set('authToken', response.token);
      storage.set('user', userData);
      storage.set('currentUser', response.user);

      console.log('Login successful, saved to localStorage:', {
        user: storage.get('user', null),
        currentUser: storage.get('currentUser', null),
      });

      window.dispatchEvent(new Event('userLoggedIn'));
      showToast('Đăng nhập thành công!');

      const redirectUrl = storage.get<string | null>(
        'redirectAfterLogin',
        null,
      );
      const currentPath = window.location.pathname;

      if (redirectUrl) {
        storage.remove('redirectAfterLogin');
        window.location.href = redirectUrl;
      } else if (currentPath === '/login') {
        if (response.user.role === 'admin') {
          window.location.href = '/admin';
        } else if (response.user.role === 'merchant') {
          window.location.href = '/merchant';
        } else if (response.user.role === 'staff') {
          window.location.href = '/staff';
        } else {
          window.location.href = '/';
        }
      }
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {showForgot && (
        <ForgotPasswordModal onClose={() => setShowForgot(false)} />
      )}

      <div className="min-h-screen bg-[#FFFBF7] flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-3xl border border-black/[0.07] shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-1.5 font-display font-extrabold text-2xl text-[#252422] mb-1">
              ZestyDash
              <span className="w-2.5 h-2.5 rounded-full bg-[#EB5E28] inline-block mb-0.5" />
            </div>
            <h1 className="font-display font-bold text-xl text-[#252422]">
              Đăng nhập
            </h1>
            <p className="text-sm text-[#7A7570] mt-1">
              Chào mừng bạn trở lại!
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label className="block text-sm font-semibold text-[#252422] mb-1.5">
                Số điện thoại
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) =>
                  setForm((f) => ({ ...f, phone: e.target.value }))
                }
                placeholder="0912 345 678"
                className="w-full px-4 py-3 rounded-xl border border-black/10 bg-[#F5F0EB]
                           text-sm placeholder:text-[#7A7570] outline-none
                           focus:border-[#EB5E28] focus:bg-white focus:ring-2
                           focus:ring-[#EB5E28]/15 transition-all"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-semibold text-[#252422]">
                  Mật khẩu
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgot(true)}
                  className="text-xs font-semibold text-[#EB5E28] hover:text-[#d44e1e] hover:underline transition-colors"
                >
                  Quên mật khẩu?
                </button>
              </div>
              <input
                type="password"
                value={form.password}
                onChange={(e) =>
                  setForm((f) => ({ ...f, password: e.target.value }))
                }
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-black/10 bg-[#F5F0EB]
                           text-sm placeholder:text-[#7A7570] outline-none
                           focus:border-[#EB5E28] focus:bg-white focus:ring-2
                           focus:ring-[#EB5E28]/15 transition-all"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-full bg-[#EB5E28] text-white font-bold
                         text-sm hover:bg-[#d44e1e] active:scale-95 transition-all mt-2
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </form>

          <p className="text-center text-sm text-[#7A7570] mt-5">
            Chưa có tài khoản?{' '}
            <a
              href="/register"
              className="text-[#EB5E28] font-semibold hover:underline"
            >
              Đăng ký ngay
            </a>
          </p>
        </div>
      </div>
    </>
  );
}

export function RegisterForm() {
  const { showToast } = useToast();
  const [form, setForm] = useState({
    name: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.phone || !form.password) {
      showToast('Vui lòng điền đầy đủ thông tin.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      showToast('Mật khẩu xác nhận không khớp.');
      return;
    }
    if (form.password.length < 6) {
      showToast('Mật khẩu phải có ít nhất 6 ký tự.');
      return;
    }

    setLoading(true);
    try {
      await api.register(form.name, form.phone, form.password);
      showToast('Đăng ký thành công! Chuyển hướng đến đăng nhập...');
      window.location.href = '/login';
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Đăng ký thất bại');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#FFFBF7] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-3xl border border-black/[0.07] shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 font-display font-extrabold text-2xl text-[#252422] mb-1">
            ZestyDash
            <span className="w-2.5 h-2.5 rounded-full bg-[#EB5E28] inline-block mb-0.5" />
          </div>
          <h1 className="font-display font-bold text-xl text-[#252422]">
            Tạo tài khoản
          </h1>
          <p className="text-sm text-[#7A7570] mt-1">
            Đăng ký để bắt đầu đặt món
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label className="block text-sm font-semibold text-[#252422] mb-1.5">
              Họ và tên
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Nguyễn Văn A"
              className="w-full px-4 py-3 rounded-xl border border-black/10 bg-[#F5F0EB]
                         text-sm placeholder:text-[#7A7570] outline-none
                         focus:border-[#EB5E28] focus:bg-white focus:ring-2
                         focus:ring-[#EB5E28]/15 transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#252422] mb-1.5">
              Số điện thoại
            </label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) =>
                setForm((f) => ({ ...f, phone: e.target.value }))
              }
              placeholder="0912 345 678"
              className="w-full px-4 py-3 rounded-xl border border-black/10 bg-[#F5F0EB]
                         text-sm placeholder:text-[#7A7570] outline-none
                         focus:border-[#EB5E28] focus:bg-white focus:ring-2
                         focus:ring-[#EB5E28]/15 transition-all"
              required
            />
          </div>

        

          <div>
            <label className="block text-sm font-semibold text-[#252422] mb-1.5">
              Mật khẩu
            </label>
            <input
              type="password"
              value={form.password}
              onChange={(e) =>
                setForm((f) => ({ ...f, password: e.target.value }))
              }
              placeholder="Tối thiểu 6 ký tự"
              className="w-full px-4 py-3 rounded-xl border border-black/10 bg-[#F5F0EB]
                         text-sm placeholder:text-[#7A7570] outline-none
                         focus:border-[#EB5E28] focus:bg-white focus:ring-2
                         focus:ring-[#EB5E28]/15 transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#252422] mb-1.5">
              Xác nhận mật khẩu
            </label>
            <input
              type="password"
              value={form.confirmPassword}
              onChange={(e) =>
                setForm((f) => ({ ...f, confirmPassword: e.target.value }))
              }
              placeholder="Nhập lại mật khẩu"
              className="w-full px-4 py-3 rounded-xl border border-black/10 bg-[#F5F0EB]
                         text-sm placeholder:text-[#7A7570] outline-none
                         focus:border-[#EB5E28] focus:bg-white focus:ring-2
                         focus:ring-[#EB5E28]/15 transition-all"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full bg-[#EB5E28] text-white font-bold
                       text-sm hover:bg-[#d44e1e] active:scale-95 transition-all mt-2
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Đang đăng ký...' : 'Đăng ký'}
          </button>
        </form>

        <p className="text-center text-sm text-[#7A7570] mt-5">
          Đã có tài khoản?{' '}
          <a
            href="/login"
            className="text-[#EB5E28] font-semibold hover:underline"
          >
            Đăng nhập
          </a>
        </p>
      </div>
    </div>
  );
}
console.log('RegisterForm');
