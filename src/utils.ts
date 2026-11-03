/**
 * Format số tiền theo định dạng Việt Nam
 */
export function formatCurrency(
  amount: number,
  currency: string = 'VND'
): string {
  const formatted = new Intl.NumberFormat('vi-VN').format(amount);

  if (currency === 'VND' || currency === '₫') {
    return `${formatted} ₫`;
  }

  return `${formatted} ${currency}`;
}

/**
 * Cắt ngắn chuỗi và thêm ... nếu vượt quá maxLength
 */
export function truncateText(
  text: string,
  maxLength: number
): string {
  if (text.length <= maxLength) {
    return text;
  }

  return text.slice(0, maxLength) + '...';
}

/**
 * Kiểm tra email hợp lệ
 */
export function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

/**
 * Debounce function
 */
export function debounce<Args extends unknown[]>(
  fn: (...args: Args) => void,
  delay: number
): (...args: Args) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (...args: Args): void => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}
