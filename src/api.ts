import type { Meal, MealSummary, Category } from './types';

const BASE = 'https://www.themealdb.com/api/json/v1/1';

export async function fetchCategories(): Promise<Category[]> {
  const res = await fetch(`${BASE}/categories.php`);
  if (!res.ok) throw new Error('Failed to fetch categories');
  const data = await res.json();
  return data.categories ?? [];
}

export async function fetchMealsByCategory(category: string): Promise<MealSummary[]> {
  const res = await fetch(`${BASE}/filter.php?c=${encodeURIComponent(category)}`);
  if (!res.ok) throw new Error('Failed to fetch meals by category');
  const data = await res.json();
  return data.meals ?? [];
}

export async function fetchMealsByArea(area: string): Promise<MealSummary[]> {
  const res = await fetch(`${BASE}/filter.php?a=${encodeURIComponent(area)}`);
  if (!res.ok) throw new Error('Failed to fetch meals by area');
  const data = await res.json();
  return data.meals ?? [];
}

export async function searchMeals(query: string): Promise<MealSummary[]> {
  if (!query.trim()) return [];
  const res = await fetch(`${BASE}/search.php?s=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error('Failed to search meals');
  const data = await res.json();
  return data.meals ?? [];
}

export async function fetchMealById(id: string): Promise<Meal | null> {
  const res = await fetch(`${BASE}/lookup.php?i=${id}`);
  if (!res.ok) throw new Error('Failed to fetch meal');
  const data = await res.json();
  return data.meals?.[0] ?? null;
}

/** Tải danh sách món mặc định (≥ 20) từ các category phổ biến */
export async function fetchDefaultMeals(): Promise<MealSummary[]> {
  const categories = ['Chicken', 'Beef', 'Dessert', 'Seafood', 'Pasta', 'Vegetarian'];
  const all: MealSummary[] = [];
  const seen = new Set<string>();

  // Gọi song song để nhanh hơn
  const results = await Promise.allSettled(
    categories.map((cat) => fetchMealsByCategory(cat))
  );

  for (const result of results) {
    if (result.status === 'fulfilled') {
      for (const meal of result.value) {
        if (!seen.has(meal.idMeal)) {
          seen.add(meal.idMeal);
          all.push(meal);
        }
      }
    }
  }

  // Nếu vẫn ít, bổ sung bằng search một số từ khóa
  if (all.length < 20) {
    const keywords = ['chicken', 'cake', 'soup', 'rice'];
    const extra = await Promise.allSettled(keywords.map((k) => searchMeals(k)));
    for (const result of extra) {
      if (result.status === 'fulfilled') {
        for (const meal of result.value) {
          if (!seen.has(meal.idMeal)) {
            seen.add(meal.idMeal);
            all.push(meal);
          }
        }
      }
    }
  }

  return all.slice(0, 48); // tối đa 48 món để phân trang đẹp
}

export function getIngredients(meal: Meal): { ingredient: string; measure: string }[] {
  const result: { ingredient: string; measure: string }[] = [];
  for (let i = 1; i <= 20; i++) {
    const ing = meal[`strIngredient${i}` as keyof Meal] as string | undefined;
    const measure = meal[`strMeasure${i}` as keyof Meal] as string | undefined;
    if (ing && ing.trim()) {
      result.push({ ingredient: ing.trim(), measure: (measure ?? '').trim() });
    }
  }
  return result;
}
