import { useState } from 'react';
import { Eye, EyeOff, Lock, CheckCircle2, Trash2 } from 'lucide-react';
import type { User, UserAddress } from '../types';
import useToast from '../hooks/useToast';
import { storage } from '../utils/storage';

type ProfileSection = 'main' | 'change-password';

interface ChangePasswordForm {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

type PasswordFieldKey = keyof ChangePasswordForm;

function getInitialSection(): ProfileSection {
  const params = new URLSearchParams(window.location.search);
  return params.get('section') === 'change-password'
    ? 'change-password'
    : 'main';
}

const INPUT_CLS =
  'w-full px-4 py-3 rounded-xl border border-black/10 bg-[#F5F0EB] ' +
  'text-sm text-[#252422] placeholder:text-[#7A7570] outline-none ' +
  'focus:border-[#EB5E28] focus:bg-white focus:ring-2 ' +
  'focus:ring-[#EB5E28]/15 transition-all';

const MOCK_USER: User = {
  user_id: 1,
  name: 'Nguyễn Văn A',
  phone: '0912345678',
  email: 'nguyenvana@email.com',
  password_hash: '',
  role: 'customer',
  created_at: '2024-01-15T08:00:00',
};

const INITIAL_MOCK_ADDRESSES: UserAddress[] = [
  {
    address_id: 1,
    user_id: 1,
    address_text: '122 Hoàng Quốc Việt, Nghĩa Đô, Cầu Giấy, Hà Nội',
    is_default: true,
  },
  {
    address_id: 2,
    user_id: 1,
    address_text: '96A Đ.Trần Phú, Hà Đông, Hà Nội',
    is_default: false,
  },
];

interface PasswordInputProps {
  id: string;
  label: string;
  value: string;
  placeholder?: string;
  hint?: string;
  error?: string;
  onChange: (val: string) => void;
}

function PasswordInput({
  id,
  label,
  value,
  placeholder,
  hint,
  error,
  onChange,
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-semibold text-[#252422] mb-1.5"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete="off"
          className={`${INPUT_CLS} pr-11 ${
            error
              ? 'border-red-400 focus:border-red-400 focus:ring-red-400/15'
              : ''
          }`}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A7570]
                     hover:text-[#252422] transition-colors"
          aria-label={visible ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
        >
          {visible ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      {error && (
        <p className="text-xs text-red-500 font-medium mt-1.5">{error}</p>
      )}
      {hint && !error && (
        <p className="text-xs text-[#7A7570] mt-1.5">{hint}</p>
      )}
    </div>
  );
}

function getStrength(pw: string) {
  if (!pw) return { score: 0, label: '', color: '' };
  if (pw.length < 6) return { score: 1, label: 'Yếu', color: 'bg-red-400' };
  if (pw.length < 10)
    return { score: 2, label: 'Trung bình', color: 'bg-yellow-400' };
  if (!/[A-Z]/.test(pw) || !/[0-9]/.test(pw))
    return { score: 3, label: 'Khá', color: 'bg-blue-400' };
  return { score: 4, label: 'Mạnh', color: 'bg-emerald-500' };
}

function PasswordStrengthBar({ password }: { password: string }) {
  const { score, label, color } = getStrength(password);
  if (score === 0) return null;
  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[1, 2, 3, 4].map((n) => (
          <div
            key={n}
            className={`h-1 flex-1 rounded-full transition-all duration-300
                        ${n <= score ? color : 'bg-[#E5E0DB]'}`}
          />
        ))}
      </div>
      <p
        className={`text-xs font-medium ${
          score === 1
            ? 'text-red-500'
            : score === 2
              ? 'text-yellow-600'
              : score === 3
                ? 'text-blue-600'
                : 'text-emerald-600'
        }`}
      >
        Độ mạnh: {label}
      </p>
    </div>
  );
}

function ChangePasswordSection({ onBack }: { onBack: () => void }) {
  const { showToast } = useToast();
  const [form, setForm] = useState<ChangePasswordForm>({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Partial<ChangePasswordForm>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  function setField(key: PasswordFieldKey, val: string) {
    setForm((f) => ({ ...f, [key]: val }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function validate(): boolean {
    const next: Partial<ChangePasswordForm> = {};
    if (!form.oldPassword)
      next.oldPassword = 'Vui lòng nhập mật khẩu hiện tại.';
    if (!form.newPassword) next.newPassword = 'Vui lòng nhập mật khẩu mới.';
    else if (form.newPassword.length < 6)
      next.newPassword = 'Mật khẩu mới phải có ít nhất 6 ký tự.';
    else if (form.newPassword === form.oldPassword)
      next.newPassword = 'Mật khẩu mới phải khác mật khẩu hiện tại.';
    if (!form.confirmPassword)
      next.confirmPassword = 'Vui lòng xác nhận mật khẩu mới.';
    else if (form.confirmPassword !== form.newPassword)
      next.confirmPassword = 'Mật khẩu xác nhận không khớp.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 900));
    setSubmitting(false);
    setSuccess(true);
    showToast('Đổi mật khẩu thành công!');
    setTimeout(() => {
      setForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setSuccess(false);
      window.history.replaceState({}, '', '/profile');
      onBack();
    }, 1800);
  }

  return (
    <div className="bg-white rounded-2xl border border-black/[0.07] overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-black/[0.06] bg-[#FFFBF7]">
        <button
          onClick={onBack}
          className="w-8 h-8 rounded-full border border-black/10 flex items-center
                     justify-center text-[#252422] hover:bg-[#F5F0EB] transition-colors
                     shrink-0 text-sm"
          aria-label="Quay lại"
        >
          ←
        </button>
        <div className="flex items-center gap-2">
          <Lock size={16} className="text-[#EB5E28]" />
          <p className="font-display font-bold text-[#252422]">Đổi mật khẩu</p>
        </div>
      </div>

      <div className="px-6 py-6">
        {success ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <CheckCircle2 size={48} className="text-emerald-500" />
            <p className="font-display font-bold text-[#252422]">
              Đổi mật khẩu thành công!
            </p>
            <p className="text-sm text-[#7A7570]">
              Đang quay lại trang hồ sơ...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <PasswordInput
              id="old-password"
              label="Mật khẩu hiện tại"
              value={form.oldPassword}
              placeholder="Nhập mật khẩu hiện tại"
              error={errors.oldPassword}
              onChange={(val) => setField('oldPassword', val)}
            />
            <div>
              <PasswordInput
                id="new-password"
                label="Mật khẩu mới"
                value={form.newPassword}
                placeholder="Tối thiểu 6 ký tự"
                hint="Nên kết hợp chữ hoa, số để tăng độ bảo mật."
                error={errors.newPassword}
                onChange={(val) => setField('newPassword', val)}
              />
              <PasswordStrengthBar password={form.newPassword} />
            </div>
            <PasswordInput
              id="confirm-password"
              label="Xác nhận mật khẩu mới"
              value={form.confirmPassword}
              placeholder="Nhập lại mật khẩu mới"
              error={errors.confirmPassword}
              onChange={(val) => setField('confirmPassword', val)}
            />
            <div className="flex gap-3 pt-1">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-3 rounded-full bg-[#EB5E28] text-white font-bold
                           text-sm hover:bg-[#d44e1e] active:scale-95 transition-all
                           disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Đang lưu...
                  </>
                ) : (
                  'Lưu mật khẩu mới'
                )}
              </button>
              <button
                type="button"
                onClick={onBack}
                disabled={submitting}
                className="flex-1 py-3 rounded-full border border-black/10 text-[#252422]
                           font-bold text-sm hover:bg-[#F5F0EB] active:scale-95 transition-all"
              >
                Huỷ
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export function UserProfilePage() {
  const { showToast } = useToast();
  const [user, setUser] = useState<User>(() => {
    return storage.get<User>('user', MOCK_USER);
  });
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user.name, email: user.email });
  const [section, setSection] = useState<ProfileSection>(getInitialSection);

  function handleBack() {
    window.history.replaceState({}, '', '/profile');
    setSection('main');
  }

  function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    const updatedUser = { ...user, name: form.name, email: form.email };
    setUser(updatedUser);
    storage.set('user', updatedUser);
    setEditing(false);
    showToast('Cập nhật thông tin thành công!');
  }

  if (section === 'change-password') {
    return (
      <div className="min-h-screen bg-[#FFFBF7] px-4 py-8">
        <div className="max-w-xl mx-auto space-y-5">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-sm text-[#7A7570] hover:text-[#252422] transition-colors"
          >
            ← Quay lại
          </button>
          <h1 className="font-display font-bold text-2xl text-[#252422]">
            Bảo mật tài khoản
          </h1>
          <ChangePasswordSection onBack={handleBack} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFBF7] px-4 py-8">
      <div className="max-w-xl mx-auto space-y-5">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-sm text-[#7A7570] hover:text-[#252422] transition-colors"
        >
          ← Quay lại
        </button>

        <h1 className="font-display font-bold text-2xl text-[#252422]">
          Tài khoản của tôi
        </h1>

        <div className="bg-white rounded-2xl border border-black/[0.07] p-6">
          <div className="flex items-center justify-between mb-5">
            <p className="font-semibold text-sm text-[#252422]">
              Thông tin cá nhân
            </p>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="text-xs text-[#EB5E28] font-semibold hover:underline"
              >
                Chỉnh sửa
              </button>
            )}
          </div>

          {editing ? (
            <form onSubmit={handleSaveProfile} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#7A7570] mb-1">
                  Họ và tên
                </label>
                <input
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-black/10 bg-[#F5F0EB] text-sm outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#7A7570] mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-black/10 bg-[#F5F0EB] text-sm outline-none"
                />
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-full bg-[#EB5E28] text-white font-bold text-sm"
                >
                  Lưu thay đổi
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="flex-1 py-2.5 rounded-full border text-[#252422] font-bold text-sm"
                >
                  Huỷ
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-3 text-sm">
              <ProfileRow label="Họ và tên" value={user.name} />
              <ProfileRow label="Số điện thoại" value={user.phone} />
              <ProfileRow label="Email" value={user.email} />
              <ProfileRow
                label="Vai trò"
                value={user.role === 'customer' ? 'Khách hàng' : user.role}
              />
              <ProfileRow
                label="Ngày tham gia"
                value={new Date(user.created_at).toLocaleDateString('vi-VN')}
              />
            </div>
          )}
        </div>

        <AddressManager />

        <div className="bg-white rounded-2xl border border-black/[0.07] divide-y divide-black/[0.06]">
          {[
            { label: 'Đơn hàng của tôi', href: '/orders', icon: '📦' },
            { label: 'Đánh giá của tôi', href: '/reviews', icon: '⭐' },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="flex items-center justify-between px-5 py-4 hover:bg-[#F5F0EB] transition-colors text-sm font-medium text-[#252422]"
            >
              <div className="flex items-center gap-3">
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </div>
              <span className="text-[#7A7570]">›</span>
            </a>
          ))}

          <button
            onClick={() => setSection('change-password')}
            className="w-full flex items-center justify-between px-5 py-4 hover:bg-[#F5F0EB] transition-colors text-sm font-medium text-[#252422] text-left"
          >
            <div className="flex items-center gap-3">
              <span>🔒</span>
              <span>Đổi mật khẩu</span>
            </div>
            <span className="text-[#7A7570]">›</span>
          </button>
        </div>

        <button
          onClick={() => {
            storage.remove('user');
            showToast('Đã đăng xuất.');
            window.location.href = '/';
          }}
          className="w-full py-3 rounded-full border-2 border-red-200 text-red-500 font-bold text-sm hover:bg-red-50 transition-colors"
        >
          Đăng xuất
        </button>
      </div>
    </div>
  );
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-[#7A7570]">{label}</span>
      <span className="font-medium text-[#252422]">{value}</span>
    </div>
  );
}

function AddressManager() {
  const { showToast } = useToast();

  const [addresses, setAddresses] = useState<UserAddress[]>(() => {
    const savedAddresses = storage.get<UserAddress[]>('user_addresses', []);
    if (savedAddresses.length > 0) {
      return savedAddresses;
    }
    storage.set('user_addresses', INITIAL_MOCK_ADDRESSES);
    return INITIAL_MOCK_ADDRESSES;
  });

  const [newAddress, setNewAddress] = useState('');
  const [adding, setAdding] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  function handleSetDefault(address_id: number) {
    const updated = addresses.map((a) => ({
      ...a,
      is_default: a.address_id === address_id,
    }));
    setAddresses(updated);
    storage.set('user_addresses', updated);
    showToast('Đã thay đổi địa chỉ mặc định!');
  }

  function handleAddAddress(e: React.FormEvent) {
    e.preventDefault();
    if (!newAddress.trim()) return;

    const updated = [
      ...addresses,
      {
        address_id: Date.now(),
        user_id: 1,
        address_text: newAddress.trim(),
        is_default: addresses.length === 0,
      },
    ];

    setAddresses(updated);
    storage.set('user_addresses', updated);

    setNewAddress('');
    setAdding(false);
    showToast('Thêm địa chỉ thành công!');
  }

  function executeDeleteAddress() {
    if (deleteTargetId === null) return;

    const addressToDelete = addresses.find(
      (a) => a.address_id === deleteTargetId,
    );
    let updated = addresses.filter((a) => a.address_id !== deleteTargetId);

    if (addressToDelete?.is_default && updated.length > 0) {
      updated = updated.map((addr, index) =>
        index === 0 ? { ...addr, is_default: true } : addr,
      );
    }

    setAddresses(updated);
    storage.set('user_addresses', updated);
    showToast('Đã xoá địa chỉ!');
    setDeleteTargetId(null);
  }

  return (
    <div className="bg-white rounded-2xl border border-black/[0.07] p-6">
      <div className="flex items-center justify-between mb-4">
        <p className="font-semibold text-sm text-[#252422]">Sổ địa chỉ</p>
        {!adding && (
          <button
            onClick={() => setAdding(true)}
            className="text-xs text-[#EB5E28] font-semibold hover:underline"
          >
            + Thêm mới
          </button>
        )}
      </div>
      {adding && (
        <form onSubmit={handleAddAddress} className="mb-4 space-y-2">
          <input
            value={newAddress}
            onChange={(e) => setNewAddress(e.target.value)}
            placeholder="Nhập địa chỉ mới"
            className="w-full px-4 py-2 rounded-xl border border-black/10 bg-[#F5F0EB] text-sm outline-none"
            autoFocus
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-1.5 rounded-full bg-[#EB5E28] text-white text-xs font-bold"
            >
              Lưu
            </button>
            <button
              type="button"
              onClick={() => setAdding(false)}
              className="px-4 py-1.5 rounded-full border text-xs font-bold"
            >
              Hủy
            </button>
          </div>
        </form>
      )}
      <div className="space-y-3">
        {addresses.map((addr) => (
          <div
            key={addr.address_id}
            className="flex items-start justify-between gap-4 text-sm py-1"
          >
            <p className="text-[#252422] flex-1 leading-relaxed">
              {addr.address_text}
            </p>

            <div className="flex items-center gap-3 shrink-0">
              {addr.is_default ? (
                <span className="text-xs bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-md font-medium">
                  Mặc định
                </span>
              ) : (
                <button
                  onClick={() => handleSetDefault(addr.address_id)}
                  className="text-xs text-[#7A7570] hover:text-[#EB5E28] transition-colors"
                >
                  Đặt mặc định
                </button>
              )}

              <button
                onClick={() => setDeleteTargetId(addr.address_id)}
                className="text-[#7A7570] hover:text-red-500 p-1 rounded-md transition-colors"
                title="Xoá địa chỉ"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}

        {addresses.length === 0 && (
          <p className="text-xs text-[#7A7570] text-center py-2 italic">
            Danh sách địa chỉ trống.
          </p>
        )}
      </div>

      {deleteTargetId !== null && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all animate-fade-in">
          <div className="bg-white rounded-2xl border border-black/[0.07] p-6 max-w-sm w-full shadow-2xl space-y-4 text-center transform scale-100 transition-transform">
            <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto text-xl">
              ⚠️
            </div>
            <div className="space-y-1">
              <p className="font-display font-bold text-base text-[#252422]">
                Xác nhận xoá địa chỉ
              </p>
              <p className="text-sm text-[#7A7570] px-2 leading-relaxed">
                Bạn có chắc chắn muốn xoá địa chỉ này không? Hành động này không
                thể hoàn tác.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTargetId(null)}
                className="flex-1 py-2.5 rounded-full border border-black/10 text-xs font-bold text-[#252422] hover:bg-[#F5F0EB] active:scale-95 transition-all"
              >
                Huỷ bỏ
              </button>
              <button
                type="button"
                onClick={executeDeleteAddress}
                className="flex-1 py-2.5 rounded-full bg-red-500 text-white text-xs font-bold hover:bg-red-600 active:scale-95 transition-all shadow-md shadow-red-500/10"
              >
                Xoá ngay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
