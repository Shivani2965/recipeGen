export function stripHtml(html: string = ''): string {
  return html
    .replace(/<[^>]*>?/gm, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

export function formatTime(minutes?: number): string {
  if (!minutes || minutes <= 0) return '20 min';
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  return remaining > 0 ? `${hours}h ${remaining}m` : `${hours}h`;
}

export function formatRating(score?: number): string {
  if (!score || score <= 0) return '4.5';
  // Spoonacular score is usually 0-100, normalize to 5-star scale
  if (score > 5) {
    return (score / 20).toFixed(1);
  }
  return score.toFixed(1);
}

export function getDifficulty(readyInMinutes: number = 30, stepsCount: number = 4): string {
  if (readyInMinutes <= 25 && stepsCount <= 5) return 'Easy';
  if (readyInMinutes <= 50 && stepsCount <= 9) return 'Medium';
  return 'Advanced';
}

export function getNutritionValue(recipe: any, nutrientName: string): string | null {
  if (!recipe?.nutrition?.nutrients) return null;
  const match = recipe.nutrition.nutrients.find(
    (n: any) => n.name?.toLowerCase() === nutrientName.toLowerCase()
  );
  if (!match) return null;
  return `${Math.round(match.amount)} ${match.unit || ''}`.trim();
}

export function getCalories(recipe: any): string | null {
  return getNutritionValue(recipe, 'calories');
}

export function getProtein(recipe: any): string | null {
  return getNutritionValue(recipe, 'protein');
}

export function getDietaryTags(recipe: any): string[] {
  const tags: string[] = [];
  if (recipe.vegetarian) tags.push('Vegetarian');
  if (recipe.vegan) tags.push('Vegan');
  if (recipe.glutenFree) tags.push('Gluten-Free');
  if (recipe.dairyFree) tags.push('Dairy-Free');
  if (recipe.veryHealthy) tags.push('Healthy');
  if (recipe.cheap) tags.push('Budget-Friendly');
  if (recipe.diets && Array.isArray(recipe.diets)) {
    recipe.diets.forEach((d: string) => {
      const cap = d.charAt(0).toUpperCase() + d.slice(1);
      if (!tags.includes(cap) && tags.length < 4) tags.push(cap);
    });
  }
  return tags.slice(0, 4);
}

export function truncateText(text: string = '', maxLength: number = 100): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}
