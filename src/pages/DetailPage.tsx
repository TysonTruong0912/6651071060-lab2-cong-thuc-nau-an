import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchMealById, getIngredients } from '../api';
import type { Meal } from '../types';

export function DetailPage() {
  const { id } = useParams<{ id: string }>();
  const [meal, setMeal] = useState<Meal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchMealById(id)
      .then((data) => {
        if (!cancelled) {
          if (data) setMeal(data);
          else setError('Không tìm thấy món ăn.');
        }
      })
      .catch(() => {
        if (!cancelled) setError('Lỗi tải dữ liệu.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-6" />
        <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-xl mb-8" />
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6" />
        </div>
      </div>
    );
  }

  if (error || !meal) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-red-600 dark:text-red-400 mb-4">{error ?? 'Không tìm thấy'}</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          ← Quay lại danh sách
        </Link>
      </div>
    );
  }

  const ingredients = getIngredients(meal);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        to="/"
        className="inline-flex items-center gap-1 text-sm text-primary-600 dark:text-primary-400 hover:underline mb-6"
      >
        ← Quay lại danh sách
      </Link>

      <article>
        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            {meal.strMeal}
          </h1>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200">
              {meal.strCategory}
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200">
              {meal.strArea}
            </span>
            {meal.strTags &&
              meal.strTags.split(',').map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                >
                  {tag.trim()}
                </span>
              ))}
          </div>
        </header>

        <div className="rounded-2xl overflow-hidden shadow-lg mb-8 bg-gray-100 dark:bg-gray-700">
          <img
            src={meal.strMealThumb}
            alt={`Hình ảnh món ${meal.strMeal}`}
            className="w-full aspect-video object-cover"
            onError={(e) => {
              const target = e.currentTarget;
              target.onerror = null;
              target.src =
                'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450"%3E%3Crect fill="%23e5e7eb" width="800" height="450"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="24" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EKhông có ảnh%3C/text%3E%3C/svg%3E';
            }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Ingredients */}
          <section className="lg:col-span-1">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span aria-hidden="true">🥕</span> Nguyên liệu
            </h2>
            <ul className="space-y-2 bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
              {ingredients.map((item, idx) => (
                <li
                  key={idx}
                  className="flex justify-between text-sm text-gray-700 dark:text-gray-300 border-b border-gray-50 dark:border-gray-700 last:border-0 pb-2 last:pb-0"
                >
                  <span className="font-medium">{item.ingredient}</span>
                  <span className="text-gray-500 dark:text-gray-400">{item.measure}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Instructions */}
          <section className="lg:col-span-2">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span aria-hidden="true">📝</span> Cách làm
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 prose dark:prose-invert max-w-none">
              {meal.strInstructions.split('\n').filter(Boolean).map((para, idx) => (
                <p key={idx} className="mb-3 text-gray-700 dark:text-gray-300 leading-relaxed">
                  {para}
                </p>
              ))}
            </div>

            {meal.strYoutube && (
              <div className="mt-6">
                <a
                  href={meal.strYoutube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                  Xem video hướng dẫn
                </a>
              </div>
            )}
          </section>
        </div>
      </article>
    </div>
  );
}
