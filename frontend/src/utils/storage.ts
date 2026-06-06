export const storage = {
  get: <T>(key: string, fallbackValue: T): T => {
    try {
      const item = localStorage.getItem(key);
      if (!item) return fallbackValue;

      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`[Storage Error] Lỗi khi đọc key "${key}":`, error);
      return fallbackValue;
    }
  },

  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`[Storage Error] Lỗi khi ghi key "${key}":`, error);
    }
  },

  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`[Storage Error] Lỗi khi xóa key "${key}":`, error);
    }
  },

  clear: (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('[Storage Error] Lỗi khi clear localStorage:', error);
    }
  },
};
