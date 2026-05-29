// Returns the correct Tailwind font token for a category based on brand guide rules.
// Glacial Indifference → Health, Food & Recipes, Drinks, Wellness, Training, Nutrition, Mental well-being
// Playfair Display     → Fashion, Beauty, Style, Interior, Luxury, Interviews, Editorial (default)

const WELLNESS_KEYWORDS = [
  'halsa', 'hälsa', 'health',
  'wellness',
  'traning', 'träning', 'fitness',
  'mat', 'food', 'recept', 'recipe',
  'dryck', 'drink',
  'naring', 'näring', 'nutrition', 'kost',
  'mental',
];

export function getCategoryFont(slugOrName = '') {
  const s = (slugOrName || '').toLowerCase();
  return WELLNESS_KEYWORDS.some(kw => s.includes(kw)) ? 'font-secondary' : 'font-display';
}
