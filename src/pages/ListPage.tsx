import { useState, useEffect, useMemo } from 'react';
import { SearchFilter } from '../components/SearchFilter';
import { MealCard } from '../components/MealCard';
import { Pagination } from '../components/Pagination';
import {
  fetchCategories,
  fetchMealsByCategory,
  fetchMealsByArea,
  searchMeals,
  fetchDefaultMeals,
} from '../api';
import type { MealSummary, Category, FilterState } from '../types';

const ITEMS_PER_PAGE = 12;

const AREAS = [
  'American', 'British', 'Canadian', 'Chinese', 'Croatian', 'Dutch', 'Egyptian',
  'Filipino', 'French', 'Greek', 'Indian', 'Irish', 'Italian', 'Jamaican',
  'Japanese', 'Kenyan', 'Malaysian', 'Mexican', 'Moroccan', 'Polish',
  'Portuguese', 'Russian', 'Spanish', 'Thai', 'Tunisian', 'Turkish', 'Vietnamese',
];

export function ListPage() {
  const [meals, setMeals] = useState<MealSummary[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filters, setFilters] = useState<FilterState>({ search: '', category: '', area: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Load categories once
  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch(() => {
        // vẫn cho phép chạy nếu category lỗi
        console.warn('Không tải được danh mục');
      });
  }, []);

  // Load meals based on filters
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setCurrentPage(1);

    const load = async () => {
      try {
        let result: MealSummary[] = [];

        if (filters.search.trim()) {
          result = await searchMeals(filters.search.trim());
        } else if (filters.category) {
          result = await fetchMealsByCategory(filters.category);
        } else if (filters.area) {
          result = await fetchMealsByArea(filters.area);
        } else {
          result = await fetchDefaultMeals();
        }

        if (!cancelled) {
          setMeals(result);
          if (result.length === 0) {
            setError(null); // không coi là lỗi, chỉ là không có kết quả
          }
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          setError('Không tải được dữ liệu. Kiểm tra kết nối mạng và thử lại.');
          setMeals([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [filters]);

  const totalPages = Math.ceil(meals.length / ITEMS_PER_PAGE) || 1;
  const paginatedMeals = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return meals.slice(start, start + ITEMS_PER_PAGE);
  }, [meals, currentPage]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Khám phá công thức nấu ăn
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Hàng trăm món ăn từ khắp thế giới – tìm kiếm, lọc và học cách nấu ngay hôm nay.
        </p>
      </div>

      <SearchFilter
        filters={filters}
        onFilterChange={setFilters}
        categories={categories}
        areas={AREAS}
      />

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" aria-busy="true">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm animate-pulse">
              <div className="aspect-[4/3] bg-gray-200 dark:bg-gray-700" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {error && !loading && (
        <div className="text-center py-12">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button
            type="button"
            onClick={() => setFilters({ search: '', category: '', area: '' })}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Thử lại
          </button>
        </div>
      )}

      {!loading && !error && meals.length === 0 && (
        <div className="text-center py-16">
          <p className="text-5xl mb-4" aria-hidden="true">🍽️</p>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Không tìm thấy món ăn phù hợp.
          </p>
          <button
            type="button"
            onClick={() => setFilters({ search: '', category: '', area: '' })}
            className="mt-4 text-primary-600 dark:text-primary-400 hover:underline"
          >
            Xem tất cả món
          </button>
        </div>
      )}

      {!loading && !error && meals.length > 0 && (
        <>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Tìm thấy <strong className="text-primary-600 dark:text-primary-400">{meals.length}</strong> món ăn
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedMeals.map((meal) => (
              <MealCard key={meal.idMeal} meal={meal} />
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
}
