import { useState } from 'react';
import useToast from '../hooks/useToast';
import { api } from '../utils/api';
import { storage } from '../utils/storage';

export function LoginForm() {
  const { showToast } = useToast();
  const [form, setForm] = useState({ phone: '', password: '' });
  const [loading, setLoading] = useState(false);

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
