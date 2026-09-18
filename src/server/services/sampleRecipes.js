const SAMPLE_RECIPES = [
  {
    id: 90001,
    title: "Creamy Garlic Parmesan Pasta",
    image: "https://images.unsplash.com/photo-1621996346565-e3d5d6281292?w=800&auto=format&fit=crop&q=80",
    readyInMinutes: 25,
    servings: 4,
    healthScore: 82,
    spoonacularScore: 94,
    cuisines: ["Italian", "Mediterranean"],
    dishTypes: ["main course", "dinner"],
    diets: ["vegetarian"],
    vegetarian: true,
    vegan: false,
    glutenFree: false,
    dairyFree: false,
    veryHealthy: true,
    cheap: true,
    summary: "A velvety, restaurant-quality garlic parmesan fettuccine made in under 30 minutes with everyday kitchen staples.",
    extendedIngredients: [
      { id: 1001, name: "butter", original: "3 tbsp unsalted butter", amount: 3, unit: "tbsp", aisle: "Dairy", image: "butter.jpg" },
      { id: 11215, name: "garlic", original: "4 cloves garlic, minced", amount: 4, unit: "cloves", aisle: "Produce", image: "garlic.jpg" },
      { id: 1077, name: "milk", original: "1.5 cups whole milk", amount: 1.5, unit: "cups", aisle: "Dairy", image: "milk.jpg" },
      { id: 1033, name: "parmesan cheese", original: "1 cup freshly grated parmesan", amount: 1, unit: "cup", aisle: "Cheese", image: "parmesan.jpg" },
      { id: 20420, name: "pasta", original: "300g fettuccine pasta", amount: 300, unit: "g", aisle: "Pasta", image: "fettuccine.jpg" },
      { id: 11297, name: "parsley", original: "2 tbsp fresh chopped parsley", amount: 2, unit: "tbsp", aisle: "Produce", image: "parsley.jpg" }
    ],
    analyzedInstructions: [
      {
        name: "",
        steps: [
          { number: 1, step: "Bring a large pot of salted water to a rolling boil and cook fettuccine until al dente." },
          { number: 2, step: "In a wide skillet, melt butter over medium heat and sauté minced garlic until fragrant (about 1 minute)." },
          { number: 3, step: "Pour in milk, stir continuously and let it gently simmer for 3 minutes." },
          { number: 4, step: "Whisk in freshly grated parmesan cheese until the sauce turns smooth and creamy." },
          { number: 5, step: "Toss cooked pasta directly into the garlic cream sauce, garnish with parsley, and serve immediately." }
        ]
      }
    ],
    nutrition: {
      nutrients: [
        { name: "Calories", amount: 480, unit: "kcal" },
        { name: "Protein", amount: 19, unit: "g" },
        { name: "Fat", amount: 16, unit: "g" },
        { name: "Carbohydrates", amount: 64, unit: "g" }
      ]
    }
  },
  {
    id: 90002,
    title: "Lemon Herb Roasted Chicken Breast",
    image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800&auto=format&fit=crop&q=80",
    readyInMinutes: 30,
    servings: 3,
    healthScore: 92,
    spoonacularScore: 95,
    cuisines: ["American", "Mediterranean"],
    dishTypes: ["main course", "dinner", "lunch"],
    diets: ["gluten-free", "dairy-free", "ketogenic", "paleo"],
    vegetarian: false,
    vegan: false,
    glutenFree: true,
    dairyFree: true,
    veryHealthy: true,
    cheap: false,
    summary: "Juicy, herb-crusted pan-seared chicken breasts bathed in garlic lemon sauce with fresh oregano and rosemary.",
    extendedIngredients: [
      { id: 5062, name: "chicken", original: "500g skinless chicken breasts", amount: 500, unit: "g", aisle: "Meat", image: "chicken-breast.jpg" },
      { id: 9150, name: "lemon", original: "1 fresh lemon, juiced and zested", amount: 1, unit: "", aisle: "Produce", image: "lemon.jpg" },
      { id: 4053, name: "olive oil", original: "2 tbsp extra virgin olive oil", amount: 2, unit: "tbsp", aisle: "Oils", image: "olive-oil.jpg" },
      { id: 11215, name: "garlic", original: "3 cloves garlic, crushed", amount: 3, unit: "cloves", aisle: "Produce", image: "garlic.jpg" },
      { id: 2029, name: "oregano", original: "1 tsp dried oregano", amount: 1, unit: "tsp", aisle: "Spices", image: "oregano.jpg" },
      { id: 1102047, name: "salt and pepper", original: "Salt & black pepper to taste", amount: 1, unit: "pinch", aisle: "Spices", image: "salt-pepper.jpg" }
    ],
    analyzedInstructions: [
      {
        name: "",
        steps: [
          { number: 1, step: "Season chicken breasts evenly on both sides with salt, pepper, and dried oregano." },
          { number: 2, step: "Heat olive oil in an oven-safe skillet over medium-high heat." },
          { number: 3, step: "Sear chicken breasts for 6-7 minutes per side until golden brown and cooked through (165°F)." },
          { number: 4, step: "Deglaze pan with freshly squeezed lemon juice and crushed garlic for 1 minute." },
          { number: 5, step: "Drizzle the pan juices over chicken and let rest for 5 minutes before slicing." }
        ]
      }
    ],
    nutrition: {
      nutrients: [
        { name: "Calories", amount: 320, unit: "kcal" },
        { name: "Protein", amount: 42, unit: "g" },
        { name: "Fat", amount: 14, unit: "g" },
        { name: "Carbohydrates", amount: 3, unit: "g" }
      ]
    }
  },
  {
    id: 90003,
    title: "Classic Margherita Tomato Basil Pizza",
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&auto=format&fit=crop&q=80",
    readyInMinutes: 25,
    servings: 4,
    healthScore: 78,
    spoonacularScore: 91,
    cuisines: ["Italian"],
    dishTypes: ["main course", "dinner", "snack"],
    diets: ["vegetarian"],
    vegetarian: true,
    vegan: false,
    glutenFree: false,
    dairyFree: false,
    veryHealthy: false,
    cheap: true,
    summary: "Thin-crust homemade pizza topped with crushed San Marzano tomato sauce, fresh mozzarella, and sweet basil leaves.",
    extendedIngredients: [
      { id: 1026, name: "cheese", original: "200g fresh mozzarella cheese", amount: 200, unit: "g", aisle: "Cheese", image: "mozzarella.jpg" },
      { id: 11529, name: "tomato", original: "3 ripe roma tomatoes, sliced", amount: 3, unit: "", aisle: "Produce", image: "tomato.jpg" },
      { id: 2044, name: "basil", original: "Handful of fresh basil leaves", amount: 1, unit: "handful", aisle: "Produce", image: "basil.jpg" },
      { id: 20081, name: "flour", original: "2 cups all-purpose flour", amount: 2, unit: "cups", aisle: "Baking", image: "flour.jpg" },
      { id: 4053, name: "olive oil", original: "1 tbsp olive oil", amount: 1, unit: "tbsp", aisle: "Oils", image: "olive-oil.jpg" }
    ],
    analyzedInstructions: [
      {
        name: "",
        steps: [
          { number: 1, step: "Preheat oven to 475°F (245°C) with a pizza stone or heavy baking sheet inside." },
          { number: 2, step: "Roll out the pizza dough onto parchment paper into a 12-inch circle." },
          { number: 3, step: "Spread crushed seasoned tomatoes over the base, leaving a 1/2-inch border." },
          { number: 4, step: "Top with torn fresh mozzarella and sliced ripe tomatoes." },
          { number: 5, step: "Bake for 10-12 minutes until crust is bubbly and golden, then scatter fresh basil." }
        ]
      }
    ],
    nutrition: {
      nutrients: [
        { name: "Calories", amount: 410, unit: "kcal" },
        { name: "Protein", amount: 16, unit: "g" },
        { name: "Fat", amount: 15, unit: "g" },
        { name: "Carbohydrates", amount: 52, unit: "g" }
      ]
    }
  },
  {
    id: 90004,
    title: "Fresh Mediterranean Garden Salad",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80",
    readyInMinutes: 15,
    servings: 2,
    healthScore: 98,
    spoonacularScore: 96,
    cuisines: ["Mediterranean", "Greek"],
    dishTypes: ["salad", "side dish", "lunch"],
    diets: ["vegetarian", "gluten-free"],
    vegetarian: true,
    vegan: false,
    glutenFree: true,
    dairyFree: false,
    veryHealthy: true,
    cheap: true,
    summary: "Crisp cucumbers, juicy cherry tomatoes, kalamata olives, and creamy feta dressed in oregano lemon vinaigrette.",
    extendedIngredients: [
      { id: 11529, name: "tomato", original: "1 cup cherry tomatoes, halved", amount: 1, unit: "cup", aisle: "Produce", image: "cherry-tomatoes.jpg" },
      { id: 11206, name: "cucumber", original: "1 English cucumber, diced", amount: 1, unit: "", aisle: "Produce", image: "cucumber.jpg" },
      { id: 1019, name: "feta cheese", original: "100g crumbled feta cheese", amount: 100, unit: "g", aisle: "Cheese", image: "feta.jpg" },
      { id: 9195, name: "olives", original: "1/3 cup kalamata olives", amount: 0.33, unit: "cup", aisle: "Canned", image: "olives.jpg" },
      { id: 11282, name: "onion", original: "1/4 red onion, thinly sliced", amount: 0.25, unit: "", aisle: "Produce", image: "red-onion.jpg" },
      { id: 4053, name: "olive oil", original: "2 tbsp extra virgin olive oil", amount: 2, unit: "tbsp", aisle: "Oils", image: "olive-oil.jpg" }
    ],
    analyzedInstructions: [
      {
        name: "",
        steps: [
          { number: 1, step: "In a large salad bowl, combine diced cucumbers, cherry tomatoes, and red onion." },
          { number: 2, step: "Add kalamata olives and crumbled feta cheese over the top." },
          { number: 3, step: "Whisk olive oil, lemon juice, dried oregano, salt, and pepper in a small bowl." },
          { number: 4, step: "Drizzle dressing over the salad and toss gently to serve." }
        ]
      }
    ],
    nutrition: {
      nutrients: [
        { name: "Calories", amount: 240, unit: "kcal" },
        { name: "Protein", amount: 8, unit: "g" },
        { name: "Fat", amount: 20, unit: "g" },
        { name: "Carbohydrates", amount: 10, unit: "g" }
      ]
    }
  },
  {
    id: 90005,
    title: "Hearty Tomato Basil Soup",
    image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&auto=format&fit=crop&q=80",
    readyInMinutes: 30,
    servings: 4,
    healthScore: 89,
    spoonacularScore: 92,
    cuisines: ["American", "French"],
    dishTypes: ["soup", "starter", "lunch"],
    diets: ["vegetarian", "gluten-free"],
    vegetarian: true,
    vegan: false,
    glutenFree: true,
    dairyFree: false,
    veryHealthy: true,
    cheap: true,
    summary: "Silky roasted tomato soup infused with caramelized onions, garlic, and fresh basil, perfect with grilled cheese.",
    extendedIngredients: [
      { id: 11529, name: "tomato", original: "800g whole peeled canned tomatoes", amount: 800, unit: "g", aisle: "Canned", image: "canned-tomatoes.jpg" },
      { id: 11282, name: "onion", original: "1 yellow onion, chopped", amount: 1, unit: "", aisle: "Produce", image: "onion.jpg" },
      { id: 11215, name: "garlic", original: "3 cloves garlic, minced", amount: 3, unit: "cloves", aisle: "Produce", image: "garlic.jpg" },
      { id: 1053, name: "cream", original: "1/4 cup heavy cream or coconut milk", amount: 0.25, unit: "cup", aisle: "Dairy", image: "cream.jpg" },
      { id: 2044, name: "basil", original: "1/2 cup fresh basil leaves", amount: 0.5, unit: "cup", aisle: "Produce", image: "basil.jpg" },
      { id: 6615, name: "vegetable broth", original: "2 cups vegetable broth", amount: 2, unit: "cups", aisle: "Soup", image: "broth.jpg" }
    ],
    analyzedInstructions: [
      {
        name: "",
        steps: [
          { number: 1, step: "Sauté chopped onion and garlic in olive oil until soft and translucent (about 5 minutes)." },
          { number: 2, step: "Add tomatoes with their juices and pour in vegetable broth. Bring to a simmer." },
          { number: 3, step: "Cook on low heat for 15 minutes to let flavors meld." },
          { number: 4, step: "Blend soup using an immersion blender until velvety smooth." },
          { number: 5, step: "Stir in cream and fresh basil leaves, season with black pepper, and serve hot." }
        ]
      }
    ],
    nutrition: {
      nutrients: [
        { name: "Calories", amount: 185, unit: "kcal" },
        { name: "Protein", amount: 5, unit: "g" },
        { name: "Fat", amount: 8, unit: "g" },
        { name: "Carbohydrates", amount: 24, unit: "g" }
      ]
    }
  },
  {
    id: 90006,
    title: "Quick Fluffy Veggie Omelette",
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&auto=format&fit=crop&q=80",
    readyInMinutes: 12,
    servings: 1,
    healthScore: 90,
    spoonacularScore: 93,
    cuisines: ["French", "American"],
    dishTypes: ["breakfast", "brunch"],
    diets: ["vegetarian", "gluten-free", "ketogenic"],
    vegetarian: true,
    vegan: false,
    glutenFree: true,
    dairyFree: false,
    veryHealthy: true,
    cheap: true,
    summary: "A golden French-style omelette filled with baby spinach, sweet bell peppers, and melted cheddar.",
    extendedIngredients: [
      { id: 1123, name: "egg", original: "3 large organic eggs", amount: 3, unit: "", aisle: "Dairy", image: "eggs.jpg" },
      { id: 11457, name: "spinach", original: "1 cup fresh baby spinach", amount: 1, unit: "cup", aisle: "Produce", image: "spinach.jpg" },
      { id: 1009, name: "cheese", original: "1/4 cup grated cheddar cheese", amount: 0.25, unit: "cup", aisle: "Cheese", image: "cheddar.jpg" },
      { id: 1001, name: "butter", original: "1 tbsp butter", amount: 1, unit: "tbsp", aisle: "Dairy", image: "butter.jpg" },
      { id: 11821, name: "bell pepper", original: "1/4 bell pepper, diced", amount: 0.25, unit: "", aisle: "Produce", image: "bell-pepper.jpg" }
    ],
    analyzedInstructions: [
      {
        name: "",
        steps: [
          { number: 1, step: "Whisk eggs with a pinch of salt and black pepper until completely smooth and frothy." },
          { number: 2, step: "Melt butter in a non-stick pan over medium-low heat." },
          { number: 3, step: "Pour in eggs, tilt pan to spread evenly, and gently pull cooked edges inward." },
          { number: 4, step: "Scatter spinach, diced bell peppers, and cheddar over one half." },
          { number: 5, step: "Fold omelette gently in half, slide onto a warm plate, and serve." }
        ]
      }
    ],
    nutrition: {
      nutrients: [
        { name: "Calories", amount: 290, unit: "kcal" },
        { name: "Protein", amount: 22, unit: "g" },
        { name: "Fat", amount: 21, unit: "g" },
        { name: "Carbohydrates", amount: 4, unit: "g" }
      ]
    }
  },
  {
    id: 90007,
    title: "Golden Garlic Butter Fried Rice",
    image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&auto=format&fit=crop&q=80",
    readyInMinutes: 18,
    servings: 2,
    healthScore: 80,
    spoonacularScore: 89,
    cuisines: ["Asian", "Japanese"],
    dishTypes: ["main course", "lunch", "dinner"],
    diets: ["vegetarian"],
    vegetarian: true,
    vegan: false,
    glutenFree: false,
    dairyFree: false,
    veryHealthy: false,
    cheap: true,
    summary: "Fragrant, Japanese-style teppanyaki fried rice packed with browned garlic chips, scrambled egg, and green onion.",
    extendedIngredients: [
      { id: 20444, name: "rice", original: "2 cups cooked chilled white or jasmine rice", amount: 2, unit: "cups", aisle: "Grains", image: "rice.jpg" },
      { id: 1123, name: "egg", original: "2 eggs, lightly beaten", amount: 2, unit: "", aisle: "Dairy", image: "eggs.jpg" },
      { id: 11215, name: "garlic", original: "5 cloves garlic, sliced thin", amount: 5, unit: "cloves", aisle: "Produce", image: "garlic.jpg" },
      { id: 1001, name: "butter", original: "2 tbsp unsalted butter", amount: 2, unit: "tbsp", aisle: "Dairy", image: "butter.jpg" },
      { id: 16124, name: "soy sauce", original: "1.5 tbsp soy sauce", amount: 1.5, unit: "tbsp", aisle: "Condiments", image: "soy-sauce.jpg" },
      { id: 11291, name: "green onion", original: "2 green onions, chopped", amount: 2, unit: "", aisle: "Produce", image: "spring-onion.jpg" }
    ],
    analyzedInstructions: [
      {
        name: "",
        steps: [
          { number: 1, step: "Sauté garlic slices in melted butter until crispy and golden, then set aside half for garnish." },
          { number: 2, step: "Push garlic to the side of the wok, pour in beaten eggs, and scramble quickly." },
          { number: 3, step: "Add chilled cooked rice, breaking up any clumps with a spatula over high heat." },
          { number: 4, step: "Drizzle soy sauce around the rim of the pan and toss vigorously for 2 minutes." },
          { number: 5, step: "Stir in chopped green onions and top with reserved crispy garlic chips." }
        ]
      }
    ],
    nutrition: {
      nutrients: [
        { name: "Calories", amount: 375, unit: "kcal" },
        { name: "Protein", amount: 11, unit: "g" },
        { name: "Fat", amount: 15, unit: "g" },
        { name: "Carbohydrates", amount: 48, unit: "g" }
      ]
    }
  },
  {
    id: 90008,
    title: "Pan-Seared Salmon with Asparagus",
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&auto=format&fit=crop&q=80",
    readyInMinutes: 20,
    servings: 2,
    healthScore: 96,
    spoonacularScore: 98,
    cuisines: ["Mediterranean", "American"],
    dishTypes: ["main course", "dinner"],
    diets: ["gluten-free", "dairy-free", "pescatarian", "ketogenic", "paleo"],
    vegetarian: false,
    vegan: false,
    glutenFree: true,
    dairyFree: true,
    veryHealthy: true,
    cheap: false,
    summary: "Crispy skin salmon fillets accompanied by tender tender asparagus tips sautéed in lemon garlic oil.",
    extendedIngredients: [
      { id: 15076, name: "salmon", original: "2 fresh salmon fillets (6oz each)", amount: 2, unit: "fillets", aisle: "Seafood", image: "salmon.jpg" },
      { id: 11011, name: "asparagus", original: "1 bunch fresh asparagus, woody ends trimmed", amount: 1, unit: "bunch", aisle: "Produce", image: "asparagus.jpg" },
      { id: 4053, name: "olive oil", original: "2 tbsp olive oil", amount: 2, unit: "tbsp", aisle: "Oils", image: "olive-oil.jpg" },
      { id: 9150, name: "lemon", original: "1 lemon, cut into wedges", amount: 1, unit: "", aisle: "Produce", image: "lemon.jpg" },
      { id: 11215, name: "garlic", original: "2 cloves garlic, minced", amount: 2, unit: "cloves", aisle: "Produce", image: "garlic.jpg" }
    ],
    analyzedInstructions: [
      {
        name: "",
        steps: [
          { number: 1, step: "Pat salmon fillets thoroughly dry with paper towels and season with sea salt." },
          { number: 2, step: "Heat 1 tbsp olive oil in a heavy skillet over medium-high heat until shimmering." },
          { number: 3, step: "Place salmon skin-side down and press gently for 20 seconds. Cook for 5 minutes until skin is crispy." },
          { number: 4, step: "Flip salmon and sear for another 3 minutes until just cooked through, then remove." },
          { number: 5, step: "In the same pan, toss trimmed asparagus and garlic with remaining oil and lemon juice for 4 minutes." }
        ]
      }
    ],
    nutrition: {
      nutrients: [
        { name: "Calories", amount: 390, unit: "kcal" },
        { name: "Protein", amount: 38, unit: "g" },
        { name: "Fat", amount: 22, unit: "g" },
        { name: "Carbohydrates", amount: 6, unit: "g" }
      ]
    }
  },
  {
    id: 90009,
    title: "Crispy Roasted Rosemary Potatoes",
    image: "https://images.unsplash.com/photo-1592417817098-8f3d6eb22521?w=800&auto=format&fit=crop&q=80",
    readyInMinutes: 35,
    servings: 4,
    healthScore: 84,
    spoonacularScore: 90,
    cuisines: ["American", "Mediterranean"],
    dishTypes: ["side dish", "snack"],
    diets: ["vegan", "vegetarian", "gluten-free", "dairy-free"],
    vegetarian: true,
    vegan: true,
    glutenFree: true,
    dairyFree: true,
    veryHealthy: true,
    cheap: true,
    summary: "Crispy on the outside, fluffy on the inside roasted baby potatoes tossed with rosemary, garlic, and sea salt.",
    extendedIngredients: [
      { id: 11362, name: "potato", original: "700g baby potatoes, halved", amount: 700, unit: "g", aisle: "Produce", image: "potatoes.jpg" },
      { id: 2036, name: "rosemary", original: "2 tbsp fresh chopped rosemary", amount: 2, unit: "tbsp", aisle: "Produce", image: "rosemary.jpg" },
      { id: 4053, name: "olive oil", original: "3 tbsp olive oil", amount: 3, unit: "tbsp", aisle: "Oils", image: "olive-oil.jpg" },
      { id: 11215, name: "garlic", original: "4 cloves garlic, unpeeled and smashed", amount: 4, unit: "cloves", aisle: "Produce", image: "garlic.jpg" },
      { id: 2047, name: "salt", original: "1 tsp coarse sea salt", amount: 1, unit: "tsp", aisle: "Spices", image: "salt.jpg" }
    ],
    analyzedInstructions: [
      {
        name: "",
        steps: [
          { number: 1, step: "Preheat oven to 425°F (220°C) and line a large baking sheet with parchment paper." },
          { number: 2, step: "Toss halved potatoes with olive oil, chopped rosemary, smashed garlic, and sea salt." },
          { number: 3, step: "Arrange potatoes cut-side down in a single layer on the baking sheet." },
          { number: 4, step: "Roast for 30-35 minutes until deep golden brown and crispy." }
        ]
      }
    ],
    nutrition: {
      nutrients: [
        { name: "Calories", amount: 210, unit: "kcal" },
        { name: "Protein", amount: 4, unit: "g" },
        { name: "Fat", amount: 10, unit: "g" },
        { name: "Carbohydrates", amount: 28, unit: "g" }
      ]
    }
  },
  {
    id: 90010,
    title: "Warm Fudgy Chocolate Brownies",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&auto=format&fit=crop&q=80",
    readyInMinutes: 35,
    servings: 8,
    healthScore: 65,
    spoonacularScore: 88,
    cuisines: ["American"],
    dishTypes: ["dessert"],
    diets: ["vegetarian"],
    vegetarian: true,
    vegan: false,
    glutenFree: false,
    dairyFree: false,
    veryHealthy: false,
    cheap: true,
    summary: "Decadent, rich chocolate brownies with crackly tops, chewy edges, and gooey centers.",
    extendedIngredients: [
      { id: 1001, name: "butter", original: "1/2 cup melted butter", amount: 0.5, unit: "cup", aisle: "Dairy", image: "butter.jpg" },
      { id: 19335, name: "sugar", original: "1 cup granulated sugar", amount: 1, unit: "cup", aisle: "Baking", image: "sugar.jpg" },
      { id: 1123, name: "egg", original: "2 large eggs", amount: 2, unit: "", aisle: "Dairy", image: "eggs.jpg" },
      { id: 19165, name: "cocoa powder", original: "1/2 cup unsweetened cocoa powder", amount: 0.5, unit: "cup", aisle: "Baking", image: "cocoa-powder.jpg" },
      { id: 20081, name: "flour", original: "1/2 cup all-purpose flour", amount: 0.5, unit: "cup", aisle: "Baking", image: "flour.jpg" },
      { id: 19081, name: "chocolate", original: "1/2 cup semi-sweet chocolate chips", amount: 0.5, unit: "cup", aisle: "Baking", image: "chocolate-chips.jpg" }
    ],
    analyzedInstructions: [
      {
        name: "",
        steps: [
          { number: 1, step: "Preheat oven to 350°F (175°C) and grease an 8x8 inch baking dish." },
          { number: 2, step: "Whisk melted butter and sugar vigorously for 1 minute, then beat in eggs one at a time." },
          { number: 3, step: "Fold in cocoa powder, flour, and a pinch of salt until just combined." },
          { number: 4, step: "Stir in chocolate chips and pour batter into prepared dish." },
          { number: 5, step: "Bake for 22-25 minutes until a toothpick inserted comes out with fudgy crumbs." }
        ]
      }
    ],
    nutrition: {
      nutrients: [
        { name: "Calories", amount: 280, unit: "kcal" },
        { name: "Protein", amount: 4, unit: "g" },
        { name: "Fat", amount: 14, unit: "g" },
        { name: "Carbohydrates", amount: 36, unit: "g" }
      ]
    }
  }
];

function findSampleRecipes({ query, ingredients, cuisine, diet, mealType, maxReadyTime, sort, number = 12 }) {
  let list = [...SAMPLE_RECIPES];

  if (query && query.trim()) {
    const q = query.trim().toLowerCase();
    list = list.filter((r) => {
      const matchTitle = r.title.toLowerCase().includes(q);
      const matchCuisine = r.cuisines?.some((c) => c.toLowerCase().includes(q));
      const matchIng = r.extendedIngredients?.some((i) => i.name.toLowerCase().includes(q));
      return matchTitle || matchCuisine || matchIng;
    });
  }

  if (ingredients && ingredients.length > 0) {
    const ings = ingredients.map((i) => i.trim().toLowerCase()).filter(Boolean);
    list = list.filter((r) => {
      const recipeIngredients = r.extendedIngredients?.map((i) => i.name.toLowerCase()) || [];
      return ings.some((ing) =>
        recipeIngredients.some((ri) => ri.includes(ing) || ing.includes(ri))
      );
    });
  }

  if (cuisine && cuisine.trim()) {
    const c = cuisine.trim().toLowerCase();
    list = list.filter((r) => r.cuisines?.some((item) => item.toLowerCase().includes(c)));
  }

  if (diet && diet.trim()) {
    const d = diet.trim().toLowerCase();
    list = list.filter((r) => {
      if (d === "vegetarian" && r.vegetarian) return true;
      if (d === "vegan" && r.vegan) return true;
      if (d === "gluten-free" && r.glutenFree) return true;
      if (d === "dairy-free" && r.dairyFree) return true;
      return r.diets?.some((item) => item.toLowerCase().includes(d));
    });
  }

  if (mealType && mealType.trim()) {
    const m = mealType.trim().toLowerCase();
    list = list.filter((r) => r.dishTypes?.some((item) => item.toLowerCase().includes(m)));
  }

  if (maxReadyTime && Number(maxReadyTime) > 0) {
    list = list.filter((r) => r.readyInMinutes <= Number(maxReadyTime));
  }

  if (sort === "time") {
    list.sort((a, b) => a.readyInMinutes - b.readyInMinutes);
  } else if (sort === "healthiness") {
    list.sort((a, b) => b.healthScore - a.healthScore);
  } else {
    list.sort((a, b) => b.spoonacularScore - a.spoonacularScore);
  }

  return {
    results: list.slice(0, number),
    totalResults: list.length,
    offset: 0,
    number
  };
}

function getSampleRecipeById(id) {
  const numId = Number(id);
  return SAMPLE_RECIPES.find((r) => r.id === numId) || null;
}

export {
  SAMPLE_RECIPES,
  findSampleRecipes,
  getSampleRecipeById
};
