import { useState, useEffect, useRef } from 'react';
import { debounce } from '../utils';
import type { FilterState, Category } from '../types';

interface SearchFilterProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  categories: Category[];
  areas: string[];
}

export function SearchFilter({ filters, onFilterChange, categories, areas }: SearchFilterProps) {
  const [searchInput, setSearchInput] = useState('');
  const filtersRef = useRef(filters);
  filtersRef.current = filters;

  // Debounce 300ms – chỉ cập nhật trường search
  const debouncedUpdateSearch = useRef(
    debounce((value: string) => {
      const current = filtersRef.current;
      onFilterChange({
        search: value,
        // Khi đang search thì bỏ category/area để tránh xung đột
        category: value ? '' : current.category,
        area: value ? '' : current.area,
      });
    }, 300)
  ).current;

  // Gọi debounce mỗi khi người dùng gõ
  useEffect(() => {
    debouncedUpdateSearch(searchInput);
  }, [searchInput, debouncedUpdateSearch]);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSearchInput(''); // xóa ô tìm kiếm khi chọn category
    onFilterChange({ search: '', category: value, area: '' });
  };

  const handleAreaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSearchInput(''); // xóa ô tìm kiếm khi chọn area
    onFilterChange({ search: '', category: '', area: value });
  };

  const handleReset = () => {
    setSearchInput('');
    onFilterChange({ search: '', category: '', area: '' });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 sm:p-6 mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="sm:col-span-2 lg:col-span-2">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Tìm kiếm món ăn
          </label>
          <div className="relative">
            <input
              id="search"
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Nhập tên món ăn (vd: chicken, cake...)"
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              aria-label="Tìm kiếm món ăn"
              autoComplete="off"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Category filter */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Danh mục
          </label>
          <select
            id="category"
            value={filters.category}
            onChange={handleCategoryChange}
            className="w-full py-2.5 px-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Tất cả danh mục</option>
            {categories.map((c) => (
              <option key={c.idCategory} value={c.strCategory}>
                {c.strCategory}
              </option>
            ))}
          </select>
        </div>

        {/* Area filter */}
        <div>
          <label htmlFor="area" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Quốc gia / Vùng
          </label>
          <select
            id="area"
            value={filters.area}
            onChange={handleAreaChange}
            className="w-full py-2.5 px-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Tất cả vùng</option>
            {areas.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>
      </div>

      {(filters.search || filters.category || filters.area || searchInput) && (
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={handleReset}
            className="text-sm text-primary-600 dark:text-primary-400 hover:underline font-medium"
          >
            Xóa bộ lọc
          </button>
        </div>
      )}
    </div>
  );
}
