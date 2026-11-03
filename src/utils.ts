/**
 * Format số tiền theo định dạng Việt Nam
 */
export function formatCurrency(amount: number, currency: string = 'VND'): string {
  const formatted = new Intl.NumberFormat('vi-VN').format(amount);
  if (currency === 'VND' || currency === '₫') {
    return `${formatted} ₫`;
  }
  return `${formatted} ${currency}`;
}

/**
 * Cắt ngắn chuỗi và thêm ... nếu vượt quá maxLength
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength) + '...';
}

/**
 * Kiểm tra email hợp lệ (đơn giản)
 */
export function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

/**
 * Debounce function - delay theo tham số (thường 300ms)
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<T extends (...args: any[]) => void>(fn: T, delay: number): T {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  const debounced = ((...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      fn(...args);
    }, delay);
  }) as T;

  return debounced;
}
