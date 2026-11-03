import { Link } from 'react-router-dom';
import type { MealSummary } from '../types';
import { truncateText } from '../utils';

interface MealCardProps {
  meal: MealSummary;
}

export function MealCard({ meal }: MealCardProps) {
  return (
    <Link
      to={`/item/${meal.idMeal}`}
      className="group block bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
    >
      <div className="aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-700">
        <img
          src={meal.strMealThumb}
          alt={`Món ăn ${meal.strMeal}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={(e) => {
            const target = e.currentTarget;
            target.onerror = null;
            target.src =
              'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect fill="%23e5e7eb" width="400" height="300"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="18" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EKhông có ảnh%3C/text%3E%3C/svg%3E';
          }}
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
          {truncateText(meal.strMeal, 50)}
        </h3>
        <p className="mt-1 text-sm text-primary-600 dark:text-primary-400 font-medium">
          Xem công thức →
        </p>
      </div>
    </Link>
  );
}
