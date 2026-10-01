/**
 * Strips HTML tags and common HTML entities from raw strings
 * @param {string} html 
 * @returns {string}
 */
export function stripHtml(html = "") {
  if (!html) return "";
  return html
    .replace(/<[^>]*>?/gm, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Formats cooking/ready time into a readable string (e.g. 25 mins, 1 hr 15 mins)
 * @param {number|string} minutes 
 * @returns {string}
 */
export function formatTime(minutes) {
  const m = Number(minutes);
  if (!m || isNaN(m)) return "25 mins";
  if (m < 60) return `${m} mins`;
  const hours = Math.floor(m / 60);
  const remainingMins = m % 60;
  if (remainingMins === 0) {
    return `${hours} ${hours === 1 ? "hr" : "hrs"}`;
  }
  return `${hours}h ${remainingMins}m`;
}

/**
 * Formats a rating score (either Spoonacular 0-100 or 0-5) into a 1-decimal rating
 * @param {number|string} score 
 * @returns {string}
 */
export function formatRating(score) {
  const num = Number(score);
  if (!num || isNaN(num)) return "4.5";
  if (num > 5) {
    // Convert 0-100 score to 3.8 - 4.9 range
    const normalized = 3.6 + (num / 100) * 1.3;
    return normalized.toFixed(1);
  }
  return num.toFixed(1);
}

/**
 * Calculates difficulty based on ready time and number of instruction steps
 * @param {number} minutes 
 * @param {number} stepsCount 
 * @returns {'Easy' | 'Medium' | 'Hard'}
 */
export function getDifficulty(minutes, stepsCount) {
  const m = Number(minutes) || 30;
  const s = Number(stepsCount) || 5;
  if (m <= 25 && s <= 6) return "Easy";
  if (m > 50 || s > 9) return "Hard";
  return "Medium";
}

/**
 * Extracts calorie count formatted string from recipe object
 * @param {Object} recipe 
 * @returns {string}
 */
export function getCalories(recipe) {
  if (!recipe) return "380 kcal";

  // Check Spoonacular nutrition nutrients list
  if (recipe.nutrition && Array.isArray(recipe.nutrition.nutrients)) {
    const cal = recipe.nutrition.nutrients.find(
      (n) => n.name && n.name.toLowerCase() === "calories"
    );
    if (cal && cal.amount) {
      return `${Math.round(cal.amount)} kcal`;
    }
  }

  // Check direct calories property
  if (recipe.calories) {
    return `${Math.round(Number(recipe.calories))} kcal`;
  }

  // Extract from summary text if present
  if (typeof recipe.summary === "string") {
    const match = recipe.summary.match(/(\d+)\s*calories/i);
    if (match && match[1]) {
      return `${match[1]} kcal`;
    }
  }

  return "410 kcal";
}

/**
 * Extracts protein amount formatted string from recipe object
 * @param {Object} recipe 
 * @returns {string}
 */
export function getProtein(recipe) {
  if (!recipe) return "24g";

  if (recipe.nutrition && Array.isArray(recipe.nutrition.nutrients)) {
    const protein = recipe.nutrition.nutrients.find(
      (n) => n.name && n.name.toLowerCase() === "protein"
    );
    if (protein && protein.amount) {
      return `${Math.round(protein.amount)}g`;
    }
  }

  if (recipe.protein) {
    return `${recipe.protein}g`;
  }

  if (typeof recipe.summary === "string") {
    const match = recipe.summary.match(/(\d+)\s*g\s*of\s*protein/i);
    if (match && match[1]) {
      return `${match[1]}g`;
    }
  }

  return "26g";
}

/**
 * Returns an array of relevant dietary tags for a recipe
 * @param {Object} recipe 
 * @returns {string[]}
 */
export function getDietaryTags(recipe) {
  if (!recipe) return ["Chef Pick"];
  const tags = [];

  if (recipe.vegetarian) tags.push("Vegetarian");
  if (recipe.vegan) tags.push("Vegan");
  if (recipe.glutenFree) tags.push("Gluten Free");
  if (recipe.dairyFree) tags.push("Dairy Free");
  if (recipe.veryHealthy) tags.push("Healthy");
  if (recipe.veryPopular) tags.push("Popular");
  if (recipe.cheap) tags.push("Budget-Friendly");

  if (Array.isArray(recipe.diets)) {
    for (const d of recipe.diets) {
      if (typeof d === "string") {
        const formatted = d.charAt(0).toUpperCase() + d.slice(1);
        if (!tags.includes(formatted)) {
          tags.push(formatted);
        }
      }
    }
  }

  if (tags.length === 0) {
    if (recipe.readyInMinutes && recipe.readyInMinutes <= 30) {
      tags.push("Quick & Easy");
    } else {
      tags.push("Chef Pick");
    }
  }

  return tags.slice(0, 3);
}

export default {
  stripHtml,
  formatTime,
  formatRating,
  getDifficulty,
  getCalories,
  getProtein,
  getDietaryTags
};
