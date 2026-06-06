import { useState, useCallback } from 'react';
import { storage } from '../../utils/storage';
import { type MenuItem } from '../../types/index';

function generateId(items: MenuItem[]): number {
  return items.length > 0 ? Math.max(...items.map((i) => i.item_id)) + 1 : 1;
}

function formatVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount);
}

interface MenuItemFormData {
  name: string;
  price: string;
  image_url: string;
  is_available: boolean;
}

const EMPTY_FORM: MenuItemFormData = {
  name: '',
  price: '',
  image_url: '',
  is_available: true,
};

interface MenuItemModalProps {
  initial: MenuItemFormData;
  onClose: () => void;
  onSave: (data: MenuItemFormData) => void;
  isEdit: boolean;
}

function MenuItemModal({
  initial,
  onClose,
  onSave,
  isEdit,
}: MenuItemModalProps) {
  const [form, setForm] = useState<MenuItemFormData>(initial);
  const [errors, setErrors] = useState<Partial<MenuItemFormData>>({});

  function validate(): boolean {
    const e: Partial<MenuItemFormData> = {};
    if (!form.name.trim()) e.name = 'Tên món không được để trống';
    const price = parseFloat(form.price);
    if (isNaN(price) || price <= 0) e.price = 'Giá phải lớn hơn 0';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit() {
    if (validate()) onSave(form);
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-up">
        <div className="px-6 py-5 border-b border-orange-100 flex items-center justify-between">
          <h2 className="font-display font-bold text-[#252422] text-lg">
            {isEdit ? 'Chỉnh sửa món ăn' : 'Thêm món mới'}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-orange-50 flex items-center justify-center text-[#9b9b9b] transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#6b6b6b] uppercase tracking-wide mb-1.5">
              Tên món *
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Ví dụ: Phở bò đặc biệt"
              className={`w-full border rounded-xl px-4 py-2.5 text-sm text-[#252422] outline-none transition-all
                focus:ring-2 focus:ring-[#f57c00]/30 focus:border-[#f57c00]
                ${errors.name ? 'border-red-400 bg-red-50' : 'border-orange-100 bg-white hover:border-orange-300'}`}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#6b6b6b] uppercase tracking-wide mb-1.5">
              Giá (VNĐ) *
            </label>
            <input
              type="number"
              value={form.price}
              onChange={(e) =>
                setForm((f) => ({ ...f, price: e.target.value }))
              }
              placeholder="Ví dụ: 75000"
              min={1000}
              className={`w-full border rounded-xl px-4 py-2.5 text-sm text-[#252422] outline-none transition-all
                focus:ring-2 focus:ring-[#f57c00]/30 focus:border-[#f57c00]
                ${errors.price ? 'border-red-400 bg-red-50' : 'border-orange-100 bg-white hover:border-orange-300'}`}
            />
            {errors.price && (
              <p className="text-red-500 text-xs mt-1">{errors.price}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#6b6b6b] uppercase tracking-wide mb-1.5">
              URL hình ảnh
            </label>
            <input
              type="url"
              value={form.image_url}
              onChange={(e) =>
                setForm((f) => ({ ...f, image_url: e.target.value }))
              }
              placeholder="https://example.com/image.jpg"
              className="w-full border border-orange-100 rounded-xl px-4 py-2.5 text-sm text-[#252422] outline-none
                focus:ring-2 focus:ring-[#f57c00]/30 focus:border-[#f57c00] hover:border-orange-300 transition-all"
            />
          </div>

          <div className="flex items-center justify-between bg-orange-50 rounded-xl px-4 py-3">
            <span className="text-sm font-medium text-[#252422]">Đang bán</span>
            <button
              onClick={() =>
                setForm((f) => ({ ...f, is_available: !f.is_available }))
              }
              className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                form.is_available ? 'bg-[#f57c00]' : 'bg-gray-300'
              }`}
            >
              <span
                className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
                  form.is_available ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-orange-100 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-[#6b6b6b] border border-orange-100
              hover:bg-orange-50 transition-colors"
          >
            Huỷ
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-[#f57c00] text-white
              hover:bg-[#e65100] active:scale-95 transition-all shadow-sm"
          >
            {isEdit ? 'Lưu thay đổi' : 'Thêm món'}
          </button>
        </div>
      </div>
    </div>
  );
}

interface ConfirmDeleteProps {
  itemName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

function ConfirmDelete({ itemName, onConfirm, onCancel }: ConfirmDeleteProps) {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-fade-up">
        <div className="px-6 py-6 text-center">
          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-7 h-7 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </div>
          <h3 className="font-display font-bold text-[#252422] text-lg mb-2">
            Xoá món ăn?
          </h3>
          <p className="text-sm text-[#9b9b9b]">
            Bạn có chắc muốn xoá{' '}
            <span className="font-semibold text-[#252422]">"{itemName}"</span>?
            Thao tác này không thể hoàn tác.
          </p>
        </div>
        <div className="px-6 pb-5 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium text-[#6b6b6b] border border-orange-100 hover:bg-orange-50 transition-colors"
          >
            Giữ lại
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-red-500 text-white hover:bg-red-600 active:scale-95 transition-all"
          >
            Xoá ngay
          </button>
        </div>
      </div>
    </div>
  );
}

type ModalState =
  | { type: 'closed' }
  | { type: 'add' }
  | { type: 'edit'; item: MenuItem }
  | { type: 'delete'; item: MenuItem };

export function ManageMenu() {
  const [items, setItems] = useState<MenuItem[]>(() =>
    storage.get<MenuItem[]>('menuItems', []),
  );
  const [modal, setModal] = useState<ModalState>({ type: 'closed' });
  const [search, setSearch] = useState('');

  const persist = useCallback((updated: MenuItem[]) => {
    setItems(updated);
    storage.set('menuItems', updated);
  }, []);

  function handleAdd(data: MenuItemFormData) {
    const newItem: MenuItem = {
      item_id: generateId(items),
      restaurant_id: 1,
      name: data.name.trim(),
      price: parseFloat(data.price),
      image_url: data.image_url.trim(),
      is_available: data.is_available,
    };
    persist([...items, newItem]);
    setModal({ type: 'closed' });
  }

  function handleEdit(data: MenuItemFormData) {
    if (modal.type !== 'edit') return;
    const updated = items.map((i) =>
      i.item_id === modal.item.item_id
        ? {
            ...i,
            name: data.name.trim(),
            price: parseFloat(data.price),
            image_url: data.image_url.trim(),
            is_available: data.is_available,
          }
        : i,
    );
    persist(updated);
    setModal({ type: 'closed' });
  }

  function handleDelete() {
    if (modal.type !== 'delete') return;
    persist(items.filter((i) => i.item_id !== modal.item.item_id));
    setModal({ type: 'closed' });
  }

  function handleToggleStatus(item: MenuItem) {
    persist(
      items.map((i) =>
        i.item_id === item.item_id
          ? { ...i, is_available: !i.is_available }
          : i,
      ),
    );
  }

  const filtered = items.filter((i) =>
    i.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-72">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#c4c4c4]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm tên món..."
            className="w-full pl-9 pr-4 py-2.5 border border-orange-100 rounded-xl text-sm text-[#252422] outline-none
              focus:ring-2 focus:ring-[#f57c00]/30 focus:border-[#f57c00] hover:border-orange-300 transition-all bg-white"
          />
        </div>

        <button
          onClick={() => setModal({ type: 'add' })}
          className="flex items-center gap-2 bg-[#f57c00] text-white px-5 py-2.5 rounded-xl text-sm font-semibold
            hover:bg-[#e65100] active:scale-95 transition-all shadow-sm shadow-orange-200 whitespace-nowrap"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Thêm món mới
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-orange-50 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-[#c4c4c4]">
            <svg
              className="w-14 h-14 mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 10h18M3 14h18M10.5 3a7 7 0 010 18M13.5 3a7 7 0 010 18"
              />
            </svg>
            <p className="text-sm font-medium">
              {search ? 'Không tìm thấy món phù hợp' : 'Chưa có món ăn nào'}
            </p>
            {!search && (
              <button
                onClick={() => setModal({ type: 'add' })}
                className="mt-4 text-xs text-[#f57c00] font-semibold hover:underline"
              >
                + Thêm món đầu tiên
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-orange-50/60 border-b border-orange-100">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-[#9b9b9b] uppercase tracking-wide">
                    Món ăn
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-[#9b9b9b] uppercase tracking-wide">
                    Giá
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-[#9b9b9b] uppercase tracking-wide">
                    Trạng thái
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-[#9b9b9b] uppercase tracking-wide">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-orange-50">
                {filtered.map((item) => (
                  <tr
                    key={item.item_id}
                    className="hover:bg-orange-50/20 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {item.image_url ? (
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className="w-10 h-10 rounded-lg object-cover border border-orange-100 flex-shrink-0"
                            onError={(e) => {
                              (
                                e.currentTarget as HTMLImageElement
                              ).style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
                            <span className="text-lg">🍽️</span>
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-[#252422]">
                            {item.name}
                          </p>
                          <p className="text-xs text-[#c4c4c4] font-mono">
                            ID #{item.item_id}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 font-semibold text-[#f57c00]">
                      {formatVND(item.price)}
                    </td>

                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleStatus(item)}
                        title={
                          item.is_available
                            ? 'Nhấn để tạm ngừng'
                            : 'Nhấn để mở bán'
                        }
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold
                          transition-all hover:opacity-80 cursor-pointer
                          ${
                            item.is_available
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-500'
                          }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${item.is_available ? 'bg-green-500' : 'bg-gray-400'}`}
                        />
                        {item.is_available ? 'Đang bán' : 'Tạm ngừng'}
                      </button>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 justify-end">
                        <button
                          onClick={() => setModal({ type: 'edit', item })}
                          title="Chỉnh sửa"
                          className="w-8 h-8 rounded-lg border border-orange-100 flex items-center justify-center
                            text-[#9b9b9b] hover:text-[#f57c00] hover:border-[#f57c00] hover:bg-orange-50 transition-all"
                        >
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => setModal({ type: 'delete', item })}
                          title="Xoá"
                          className="w-8 h-8 rounded-lg border border-red-100 flex items-center justify-center
                            text-[#9b9b9b] hover:text-red-500 hover:border-red-400 hover:bg-red-50 transition-all"
                        >
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="px-6 py-3 border-t border-orange-50 bg-orange-50/30 text-xs text-[#9b9b9b]">
              Hiển thị {filtered.length} / {items.length} món ăn
            </div>
          </div>
        )}
      </div>
      {modal.type === 'add' && (
        <MenuItemModal
          initial={EMPTY_FORM}
          onClose={() => setModal({ type: 'closed' })}
          onSave={handleAdd}
          isEdit={false}
        />
      )}
      {modal.type === 'edit' && (
        <MenuItemModal
          initial={{
            name: modal.item.name,
            price: String(modal.item.price),
            image_url: modal.item.image_url,
            is_available: modal.item.is_available,
          }}
          onClose={() => setModal({ type: 'closed' })}
          onSave={handleEdit}
          isEdit
        />
      )}
      {modal.type === 'delete' && (
        <ConfirmDelete
          itemName={modal.item.name}
          onConfirm={handleDelete}
          onCancel={() => setModal({ type: 'closed' })}
        />
      )}
    </div>
  );
}
