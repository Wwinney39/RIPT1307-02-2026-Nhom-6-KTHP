import { useState } from 'react';
import type { Voucher } from '../../types/index';

const MOCK_VOUCHERS: Voucher[] = [
  {
    voucher_id: 1,
    code: 'WELCOME2025',
    discount_percent: 15,
    max_discount_amount: 30000,
    min_order_amount: 100000,
    expiry_date: '2025-12-31',
    max_uses: 500,
    used_count: 312,
  },
  {
    voucher_id: 2,
    code: 'SUMMER50K',
    discount_percent: 20,
    max_discount_amount: 50000,
    min_order_amount: 200000,
    expiry_date: '2025-08-31',
    max_uses: 200,
    used_count: 187,
  },
  {
    voucher_id: 3,
    code: 'FREESHIP',
    discount_percent: 10,
    max_discount_amount: 20000,
    min_order_amount: 50000,
    expiry_date: '2025-07-15',
    max_uses: 1000,
    used_count: 44,
  },
  {
    voucher_id: 4,
    code: 'VIP30',
    discount_percent: 30,
    max_discount_amount: 100000,
    min_order_amount: 300000,
    expiry_date: '2025-06-30',
    max_uses: 50,
    used_count: 50,
  },
];

function fmt(n: number) {
  return n.toLocaleString('vi-VN') + '₫';
}

function isExpired(dateStr: string): boolean {
  return new Date(dateStr) < new Date();
}

function usageBarColor(used: number, max: number): string {
  const pct = used / max;
  if (pct >= 1) return 'bg-red-400';
  if (pct >= 0.8) return 'bg-orange-400';
  return 'bg-green-400';
}

interface VoucherForm {
  code: string;
  discount_percent: string;
  max_discount_amount: string;
  min_order_amount: string;
  expiry_date: string;
  max_uses: string;
}

const EMPTY_FORM: VoucherForm = {
  code: '',
  discount_percent: '',
  max_discount_amount: '',
  min_order_amount: '',
  expiry_date: '',
  max_uses: '',
};

export function ManageVouchers() {
  const [vouchers, setVouchers] = useState<Voucher[]>(MOCK_VOUCHERS);
  const [form, setForm] = useState<VoucherForm>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<VoucherForm>>({});
  const [successMsg, setSuccessMsg] = useState('');

  function validate(): boolean {
    const e: Partial<VoucherForm> = {};
    if (!form.code.trim()) e.code = 'Mã không được để trống';
    else if (vouchers.some((v) => v.code === form.code.trim().toUpperCase()))
      e.code = 'Mã đã tồn tại';
    if (
      !form.discount_percent ||
      Number(form.discount_percent) <= 0 ||
      Number(form.discount_percent) > 100
    )
      e.discount_percent = 'Từ 1 đến 100%';
    if (!form.max_discount_amount || Number(form.max_discount_amount) <= 0)
      e.max_discount_amount = 'Bắt buộc';
    if (!form.min_order_amount || Number(form.min_order_amount) <= 0)
      e.min_order_amount = 'Bắt buộc';
    if (!form.expiry_date) e.expiry_date = 'Bắt buộc';
    if (!form.max_uses || Number(form.max_uses) <= 0) e.max_uses = 'Bắt buộc';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleCreate() {
    if (!validate()) return;
    const newVoucher: Voucher = {
      voucher_id: Date.now(),
      code: form.code.trim().toUpperCase(),
      discount_percent: Number(form.discount_percent),
      max_discount_amount: Number(form.max_discount_amount),
      min_order_amount: Number(form.min_order_amount),
      expiry_date: form.expiry_date,
      max_uses: Number(form.max_uses),
      used_count: 0,
    };
    setVouchers((prev) => [newVoucher, ...prev]);
    setForm(EMPTY_FORM);
    setErrors({});
    setSuccessMsg(`Voucher "${newVoucher.code}" đã được tạo thành công!`);
    setTimeout(() => setSuccessMsg(''), 3000);
  }

  function handleDelete(id: number) {
    if (!confirm('Xoá voucher này? Hành động không thể hoàn tác.')) return;
    setVouchers((prev) => prev.filter((v) => v.voucher_id !== id));
  }

  function fieldProps(key: keyof VoucherForm) {
    return {
      value: form[key],
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((p) => ({ ...p, [key]: e.target.value }));
        setErrors((p) => ({ ...p, [key]: undefined }));
      },
    };
  }

  const inputBase =
    'w-full bg-white border rounded-lg px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none transition';
  const inputOk =
    'border-gray-200 focus:border-orange-400 focus:ring-1 focus:ring-orange-200';
  const inputErr =
    'border-red-300 bg-red-50 focus:border-red-400 focus:ring-1 focus:ring-red-200';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Quản lý mã giảm giá</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {vouchers.length} mã đang hoạt động trong hệ thống
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-5">
          <span className="w-7 h-7 rounded-lg bg-orange-100 flex items-center justify-center text-orange-500 text-sm">
            🏷️
          </span>
          <h2 className="text-sm font-bold text-gray-800">
            Tạo mã giảm giá mới
          </h2>
        </div>

        {successMsg && (
          <div className="mb-5 px-4 py-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm font-medium flex items-center gap-2">
            <span>✅</span>
            {successMsg}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Mã voucher
            </label>
            <input
              type="text"
              placeholder="VD: SUMMER25"
              {...fieldProps('code')}
              className={`${inputBase} uppercase tracking-widest font-mono ${errors.code ? inputErr : inputOk}`}
            />
            {errors.code && (
              <p className="text-xs text-red-500 mt-1">{errors.code}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Phần trăm giảm (%)
            </label>
            <input
              type="number"
              placeholder="VD: 20"
              min={1}
              max={100}
              {...fieldProps('discount_percent')}
              className={`${inputBase} ${errors.discount_percent ? inputErr : inputOk}`}
            />
            {errors.discount_percent && (
              <p className="text-xs text-red-500 mt-1">
                {errors.discount_percent}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Giảm tối đa (₫)
            </label>
            <input
              type="number"
              placeholder="VD: 50000"
              min={1}
              {...fieldProps('max_discount_amount')}
              className={`${inputBase} ${errors.max_discount_amount ? inputErr : inputOk}`}
            />
            {errors.max_discount_amount && (
              <p className="text-xs text-red-500 mt-1">
                {errors.max_discount_amount}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Đơn hàng tối thiểu (₫)
            </label>
            <input
              type="number"
              placeholder="VD: 100000"
              min={1}
              {...fieldProps('min_order_amount')}
              className={`${inputBase} ${errors.min_order_amount ? inputErr : inputOk}`}
            />
            {errors.min_order_amount && (
              <p className="text-xs text-red-500 mt-1">
                {errors.min_order_amount}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Ngày hết hạn
            </label>
            <input
              type="date"
              {...fieldProps('expiry_date')}
              className={`${inputBase} ${errors.expiry_date ? inputErr : inputOk}`}
            />
            {errors.expiry_date && (
              <p className="text-xs text-red-500 mt-1">{errors.expiry_date}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Số lần dùng tối đa
            </label>
            <input
              type="number"
              placeholder="VD: 500"
              min={1}
              {...fieldProps('max_uses')}
              className={`${inputBase} ${errors.max_uses ? inputErr : inputOk}`}
            />
            {errors.max_uses && (
              <p className="text-xs text-red-500 mt-1">{errors.max_uses}</p>
            )}
          </div>
        </div>

        <div className="mt-5 flex items-center gap-3">
          <button
            onClick={handleCreate}
            className="px-5 py-2.5 rounded-lg bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white text-sm font-semibold transition-colors shadow-sm"
          >
            Tạo mã giảm giá
          </button>
          <button
            onClick={() => {
              setForm(EMPTY_FORM);
              setErrors({});
            }}
            className="px-4 py-2.5 rounded-lg border border-gray-200 text-gray-500 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Xoá trắng
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <h2 className="text-sm font-bold text-gray-800">
            Danh sách mã giảm giá
          </h2>
          <span className="text-xs text-gray-400 bg-white border border-gray-200 px-2.5 py-0.5 rounded-full">
            {vouchers.length} mã
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Mã
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Giảm
                </th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Tối đa
                </th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Đơn tối thiểu
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Hết hạn
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Đã dùng
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {vouchers.map((v) => {
                const expired = isExpired(v.expiry_date);
                const exhausted = v.used_count >= v.max_uses;
                const usagePct = Math.min(
                  (v.used_count / v.max_uses) * 100,
                  100,
                );

                return (
                  <tr
                    key={v.voucher_id}
                    className={`hover:bg-orange-50/30 transition-colors ${expired || exhausted ? 'opacity-50' : ''}`}
                  >
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm font-bold text-orange-600 tracking-widest">
                        {v.code}
                      </span>
                      {expired && (
                        <span className="ml-2 text-xs text-red-500 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded-md">
                          Hết hạn
                        </span>
                      )}
                      {exhausted && !expired && (
                        <span className="ml-2 text-xs text-gray-400 bg-gray-100 border border-gray-200 px-1.5 py-0.5 rounded-md">
                          Đã dùng hết
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-800">
                      {v.discount_percent}%
                    </td>
                    <td className="px-6 py-4 text-right text-gray-500">
                      {fmt(v.max_discount_amount)}
                    </td>
                    <td className="px-6 py-4 text-right text-gray-500">
                      {fmt(v.min_order_amount)}
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-xs">
                      {v.expiry_date}
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1 min-w-[110px]">
                        <div className="flex justify-between text-xs text-gray-400">
                          <span>{v.used_count.toLocaleString('vi-VN')}</span>
                          <span>{v.max_uses.toLocaleString('vi-VN')}</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${usageBarColor(v.used_count, v.max_uses)}`}
                            style={{ width: `${usagePct}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDelete(v.voucher_id)}
                        className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:border-red-300 hover:text-red-500 hover:bg-red-50 transition-all font-medium"
                      >
                        Xoá
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
