# 6651071060_LAB2 – Công thức nấu ăn

## Thông tin cá nhân hóa (MSSV: 6651071060)

| Biến | Giá trị | Ý nghĩa |
|------|---------|---------|
| **S** | 32 | Tổng các chữ số |
| **D** | 2 | Chủ đề: **Công thức nấu ăn** (API TheMealDB) |
| **F** | 0 | 3 tính năng: Tìm kiếm + lọc nâng cao (debounce 300ms) · Phân trang · Dark/Light mode |
| **C** | 1 | Màu chủ đạo: **Emerald (#059669)** |

## Công nghệ

- React 18 + TypeScript (strict)
- Vite
- Tailwind CSS (dark mode class)
- React Router v6
- Vitest
- ESLint

## Cài đặt & chạy

```bash
cd 6651071060_LAB2
npm install
npm run dev
```

## Scripts

- `npm run dev` – dev server
- `npm run build` – build production
- `npm run test` – chạy 7 test case
- `npm run lint` – ESLint
- `npx tsc --noEmit` – kiểm tra TypeScript

## Cấu trúc

```
6651071060_LAB2/
├── public/
├── src/
│   ├── assets/
│   ├── components/   # Header, MealCard, SearchFilter, Pagination
│   ├── pages/        # ListPage, DetailPage
│   ├── context/      # ThemeContext (Dark/Light)
│   ├── api.ts
│   ├── types.ts
│   ├── utils.ts      # 4 hàm bắt buộc
│   ├── utils.test.ts
│   ├── App.tsx
│   └── main.tsx
├── design/
├── eslint.config.js
├── tailwind.config.js
└── package.json
```

## Tính năng bắt buộc (F=0)

1. **Tìm kiếm + lọc nâng cao** – debounce 300ms, lọc theo category & area
2. **Phân trang** – 12 món/trang
3. **Dark/Light mode** – lưu localStorage, toggle trong header

## Deploy

Khuyến nghị Vercel / Netlify.
Repository gợi ý: `6651071060-lab2-cong-thuc-nau-an`
