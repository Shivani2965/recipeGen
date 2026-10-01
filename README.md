# 🍳 SmartRecipe — Intelligent Recipe Discovery & Cooking Assistant

SmartRecipe is a modern, full-stack culinary web application designed to help home cooks and food enthusiasts discover delicious meals using ingredients they already have in their kitchen. Powered by the **Spoonacular Food API**, **Firebase Authentication & Cloud Firestore**, and a **Node.js/Express PDF engine**, SmartRecipe streamlines meal planning, reduces food waste, and provides a polished cooking experience.

---

## ✨ Features

- **🥫 Ingredient-Based Search ("Pantry Mode")**: Enter whatever ingredients you have in your fridge or pantry (e.g., *chicken, garlic, spinach*) to instantly find recipes you can cook right now without an extra grocery run.
- **🔍 Advanced Recipe Exploration**: Filter recipes by culinary style (Italian, Mexican, Asian, Mediterranean, etc.), dietary preferences (Vegetarian, Vegan, Gluten-Free, Ketogenic, Dairy-Free), meal type, intolerances, and maximum prep/cook time.
- **📖 Rich Recipe Details**:
  - Interactive **serving size calculator** (dynamically scales ingredient amounts).
  - One-click **Unit Converter** (switch between Metric and US Imperial units).
  - Interactive **cooking checklist** (tap ingredients as you prep to cross them off).
  - Step-by-step **cooking instructions** with progress tracking.
  - Complete **macronutrient breakdown** (calories, protein, carbohydrates, fats).
- **📄 Printable PDF Recipe Cards**: Export any recipe into a PDF card generated server-side with **PDFKit**, formatted with ingredients, instructions, and nutritional details.
- **🔐 Firebase User Authentication**:
  - Secure Email & Password sign-up and sign-in.
  - One-click **Google Sign-In** via OAuth popup.
  - **Instant Demo Guest Mode** for test-driving without creating an account.
- **☁️ Cloud Firestore Sync**:
  - **Favorite Recipes**: Heart and bookmark recipes for quick access.
  - **Saved Collections**: Organize meal ideas into your personal vault.
  - **Cooking History**: Automatic tracking of recently viewed recipes.
  - **Search History**: Save recent ingredient searches for quick recall.
  - **Personal Dashboard**: High-level overview of saved recipes, cooking stats, and curated suggestions.
- **🎨 Warm Rustic Culinary Theme**: Crafted with warm amber, copper, and terracotta tones, smooth transitions, responsive mobile-first navigation, and zero visual clutter.

---

## 🛠️ Tech Stack

### **Frontend**
- **React 19** & **Vite 8** (High-performance build tooling & modern React hooks)
- **Tailwind CSS v4** (Utility-first styling with `@tailwindcss/vite`)
- **React Router v7** (Client-side routing with animated transitions)
- **Lucide React** (Clean, consistent iconography)
- **Motion / Framer Motion** (Smooth UI animations & micro-interactions)

### **Backend (Full-Stack)**
- **Express.js** (REST API mounted directly into Vite dev server and standalone production server)
- **PDFKit** (Dynamic server-side PDF document generation)
- **Axios** (Robust HTTP requests to external recipe APIs with resilient local fallbacks)
- **dotenv** (Environment variable management)

### **Cloud & Database**
- **Firebase Authentication** (Identity management, session state, Google OAuth)
- **Google Cloud Firestore** (Real-time cloud NoSQL document storage)
- **Firestore Security Rules** (Strict user-isolated data access controls)

---

## 📋 Prerequisites

Before installing, ensure you have the following installed on your machine:

- **Node.js**: `v18.0.0` or higher (`v20.x` or `v22.x` recommended)
- **npm** (comes with Node.js) or **pnpm** / **yarn** / **bun**
- *(Optional)* A free **Spoonacular API Key** from [spoonacular.com/food-api](https://spoonacular.com/food-api/console#Dashboard)
- *(Optional)* A **Firebase Project** if you wish to link your own database (a working configuration is already included)

---

## 🚀 Quick Start & Installation

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/smartrecipe.git
cd smartrecipe
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy the example environment file:
```bash
cp .env.example .env
```

Open `.env` in your text editor and adjust the settings:
```env
# Server Port (Default is 3000)
PORT=3000

# Spoonacular Recipe API Key
# Get a free API key at: https://spoonacular.com/food-api/console#Dashboard
SPOONACULAR_API_KEY=your_spoonacular_api_key_here

# Firebase Web Configuration
# (Already pre-configured in firebase-applet-config.json, or configure your own here:)
VITE_FIREBASE_API_KEY="your-api-key"
VITE_FIREBASE_AUTH_DOMAIN="your-app.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="your-project-id"
VITE_FIREBASE_STORAGE_BUCKET="your-app.firebasestorage.app"
VITE_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
VITE_FIREBASE_APP_ID="your-app-id"
VITE_FIREBASE_FIRESTORE_DATABASE_ID="(default)"
```

> **Note on Spoonacular API**: If you do not supply an API key or if the Spoonacular daily quota is exhausted, the backend automatically falls back to an extensive built-in database of culinary recipes so the application remains fully functional!

### 4. Run the Development Server
```bash
npm run dev
```

Open your browser and navigate to:
```
http://localhost:3000
```
The Vite development server will automatically mount the Express API routes at `/api/*` and enable rapid hot module loading.

---

## 🏗️ Production Build & Deployment

### Build the Application
Compile the React frontend into the optimized production bundle (`dist/`):
```bash
npm run build
```

### Start the Production Server
Run the standalone full-stack Node/Express server:
```bash
npm start
```
The server will start on `http://localhost:3000` (or `process.env.PORT`), serving both the static frontend files and the `/api/*` routes.

### Preview the Vite Build Directly
```bash
npm run preview
```

### Run Type Checking
```bash
npm run lint
```

---

## 📁 Project Structure

```text
├── .env.example                 # Example environment variables template
├── firebase-applet-config.json  # Firebase client credentials
├── firebase-blueprint.json      # Firestore collection schema definitions
├── firestore.rules              # Firebase security rules (user-isolated data)
├── index.html                   # HTML entry point with metadata and fonts
├── package.json                 # Project dependencies & npm scripts
├── server.js                    # Production Express server entry point
├── tsconfig.json                # TypeScript & JSX compiler configuration
├── vite.config.js               # Vite configuration with Express middleware & Tailwind
│
├── public/                      # Static public assets
│   ├── assets/
│   │   ├── hero-bg.jpg          # Homepage culinary hero background
│   │   └── secondary-bg.jpg     # Dashboard & banner culinary background
│   └── favicon.svg              # App icon
│
├── server/                      # Server-side standalone services
│   ├── routes/
│   │   └── pdfRoutes.js         # PDF generation route handler
│   └── services/
│       └── pdfService.js        # PDFKit culinary document generator
│
└── src/                         # Application source code
    ├── components/              # Reusable React UI components
    │   ├── FilterPanel.jsx      # Dietary, cuisine & sorting filters
    │   ├── Footer.jsx           # Global culinary footer
    │   ├── IngredientSelector.jsx# Interactive ingredient tag input & suggestions
    │   ├── Navbar.jsx           # Top navigation bar & mobile drawer
    │   └── RecipeCard.jsx       # Card component for recipe display
    ├── context/
    │   └── AuthContext.jsx      # Firebase Auth provider & user state hook
    ├── pages/                   # Application route views
    │   ├── Dashboard.jsx        # User analytics, saved stats & shortcuts
    │   ├── Explore.jsx          # Recipe browse, search & filter page
    │   ├── Favorites.jsx        # User favorite recipes collection
    │   ├── History.jsx          # Recently viewed recipes & searches
    │   ├── Home.jsx             # Landing page with hero & pantry search
    │   ├── Login.jsx            # Sign in view (Email/Password & Google)
    │   ├── NotFound.jsx         # 404 error page
    │   ├── Profile.jsx          # User account settings & preferences
    │   ├── RecipeDetails.jsx    # Complete recipe instructions, checklist & scaling
    │   ├── Register.jsx         # Sign up view
    │   └── SavedRecipes.jsx     # Saved recipe collections
    ├── server/                  # Vite middleware API server
    │   ├── apiApp.js            # Express app configuration for /api routes
    │   ├── controllers/         # API controllers
    │   ├── middleware/          # Error handling & logging middleware
    │   ├── routes/              # Express API route endpoints
    │   └── services/            # Spoonacular API client & fallback datasets
    ├── services/                # Client-side cloud & API services
    │   ├── authService.js       # Firebase Auth wrappers (login, logout, google)
    │   ├── firebase.js          # Firebase app & Firestore initialization
    │   ├── firestoreService.js  # User-specific Firestore CRUD operations
    │   └── recipeService.js     # Client API client for fetching recipes
    └── utils/                   # Helper functions (unit conversions, formatters)
```

---

## 🔌 API Endpoints Reference

The backend provides RESTful API endpoints under `/api`:

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Health check route returning service status and timestamp |
| `GET` | `/api/recipes/search` | Search recipes with query terms, cuisine, diet, and intolerances |
| `GET` | `/api/recipes/findByIngredients` | Find recipes matching a comma-separated list of kitchen ingredients |
| `GET` | `/api/recipes/random` | Retrieve random or trending recipes for the Explore page |
| `GET` | `/api/recipes/:id` | Fetch full details, nutrition facts, and instructions for a specific recipe |
| `GET` | `/api/recipes/:id/pdf` | Download a formatted, printable PDF of the recipe |

---

## 🔒 Firebase Configuration & Security

The app uses Firebase for user authentication and personal data storage.

### Data Collections
All user data is strictly scoped to the authenticated user ID (`request.auth.uid`):

- **`/users/{userId}`**: User profile information and dietary preferences.
- **`/favorites/{docId}`**: User's favorited recipes (`userId` field enforced).
- **`/savedRecipes/{docId}`**: User's saved collections (`userId` field enforced).
- **`/recentlyViewed/{docId}`**: Cooking history and recently opened recipes.
- **`/searchHistory/{docId}`**: Search term and ingredient history.

### Setting Up Your Own Firebase Project
1. Go to the [Firebase Console](https://console.firebase.google.com/) and create a project.
2. Enable **Authentication** and turn on **Email/Password** and **Google** providers.
   * Make sure to add `localhost` (and your deployed domain) to the **Authorized Domains** list in the Firebase Authentication settings.
3. Enable **Cloud Firestore** in production mode.
4. Deploy the rules provided in `firestore.rules` or copy them to your Firebase Console under **Firestore Database > Rules**.
5. Copy your Firebase Web App configuration credentials into `firebase-applet-config.json` or your `.env` file.

---

## ❓ Troubleshooting & FAQs

#### 1. Why am I seeing fallback recipes instead of live Spoonacular results?
- Verify that `SPOONACULAR_API_KEY` is defined in your `.env` file.
- Check your Spoonacular dashboard to ensure your daily point quota (150 free points/day) has not been exceeded.
- The built-in fallback system ensures the app never crashes or displays empty screens even if your quota is exhausted.

#### 2. Google Sign-In gives `auth/unauthorized-domain`:
- In the Firebase Console, go to **Authentication > Settings > Authorized domains** and ensure `localhost` (and your deployment domain) is listed.

#### 3. How do I change the server port?
- Change the `PORT` variable in `.env`, or run:
  ```bash
  PORT=8080 npm run dev
  ```

---

## 📄 License

This project is licensed under the MIT License. Feel free to use, modify, and distribute it for personal or commercial projects.
