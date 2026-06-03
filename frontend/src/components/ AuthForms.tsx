import { useState } from 'react';
import useToast from '../hooks/useToast';

// ─── LoginForm ────────────────────────────────────────────────────────────────

export function LoginForm() {
  const { showToast } = useToast();
  const [form, setForm] = useState({ phone: '', password: '' });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.phone || !form.password) {
      showToast('Vui lòng điền đầy đủ thông tin.');
      return;
    }
    showToast('Đang đăng nhập...');
  }

  return (
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
          <p className="text-sm text-[#7A7570] mt-1">Chào mừng bạn trở lại!</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* phone → maps to users.phone (unique) */}
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
            className="w-full py-3 rounded-full bg-[#EB5E28] text-white font-bold
                       text-sm hover:bg-[#d44e1e] active:scale-95 transition-all mt-2"
          >
            Đăng nhập
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
  );
}

// ─── RegisterForm ─────────────────────────────────────────────────────────────

export function RegisterForm() {
  const { showToast } = useToast();
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      showToast('Mật khẩu xác nhận không khớp.');
      return;
    }
    showToast('Đang tạo tài khoản...');
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
          {/* users.name */}
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

          {/* users.phone (unique) */}
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

          {/* users.email */}
          <div>
            <label className="block text-sm font-semibold text-[#252422] mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm((f) => ({ ...f, email: e.target.value }))
              }
              placeholder="example@email.com"
              className="w-full px-4 py-3 rounded-xl border border-black/10 bg-[#F5F0EB]
                         text-sm placeholder:text-[#7A7570] outline-none
                         focus:border-[#EB5E28] focus:bg-white focus:ring-2
                         focus:ring-[#EB5E28]/15 transition-all"
              required
            />
          </div>

          {/* users.password_hash (raw on FE) */}
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
              placeholder="Tối thiểu 8 ký tự"
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
            className="w-full py-3 rounded-full bg-[#EB5E28] text-white font-bold
                       text-sm hover:bg-[#d44e1e] active:scale-95 transition-all mt-2"
          >
            Đăng ký
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
