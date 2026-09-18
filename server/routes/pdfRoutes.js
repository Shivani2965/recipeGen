import { Router } from 'express';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { generateRecipePdf } from '../services/pdfService.js';
import { getSampleRecipeById } from '../../src/server/services/sampleRecipes.js';

const router = Router();
const SPOONACULAR_BASE_URL = 'https://api.spoonacular.com';

function getSpoonacularKey() {
  let rawKey = process.env.SPOONACULAR_API_KEY || process.env.VITE_SPOONACULAR_API_KEY;
  if (!rawKey || rawKey.trim() === '' || rawKey === 'your_spoonacular_api_key_here') {
    const envPaths = [path.resolve(process.cwd(), '.env'), path.resolve(process.cwd(), '.env.example')];
    for (const p of envPaths) {
      if (fs.existsSync(p)) {
        try {
          const content = fs.readFileSync(p, 'utf-8');
          const match = content.match(/^SPOONACULAR_API_KEY\s*=\s*(.+)$/m);
          if (match && match[1]) {
            const parsed = match[1].trim().replace(/^["']|["']$/g, '');
            if (parsed && parsed !== 'your_spoonacular_api_key_here') {
              rawKey = parsed;
              process.env.SPOONACULAR_API_KEY = parsed;
              break;
            }
          }
        } catch {
          // ignore
        }
      }
    }
  }
  if (!rawKey) return null;
  const key = rawKey.trim().replace(/^["']|["']$/g, '');
  if (!key || key === 'your_spoonacular_api_key_here') return null;
  return key;
}

/**
 * Controller to fetch recipe from Spoonacular API and generate PDF
 */
async function handleRecipePdf(req, res, next) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Recipe ID is required in URL parameter /api/recipes/:id/pdf',
      });
    }

    let recipeData = req.body?.recipe;

    // If recipe data is not already provided in POST body, fetch fresh or use sample recipe
    if (!recipeData) {
      const sampleRecipe = getSampleRecipeById(id);
      if (sampleRecipe) {
        recipeData = sampleRecipe;
      }
    }

    if (!recipeData) {
      const apiKey = getSpoonacularKey();
      if (!apiKey) {
        return res.status(500).json({
          success: false,
          message:
            'SPOONACULAR_API_KEY is not configured on the server. Please set your Spoonacular API key in your environment settings.',
        });
      }

      try {
        const response = await axios.get(
          `${SPOONACULAR_BASE_URL}/recipes/${id}/information`,
          {
            params: {
              apiKey,
              includeNutrition: true,
            },
            timeout: 12000,
          }
        );
        recipeData = response.data;
      } catch (err) {
        const fallback = getSampleRecipeById(id);
        if (fallback) {
          recipeData = fallback;
        } else if (err.response) {
          const status = err.response.status;
          if (status === 404) {
            return res.status(404).json({
              success: false,
              message: `Recipe with ID ${id} was not found.`,
            });
          }
          if (status === 401) {
            return res.status(401).json({
              success: false,
              message: 'Invalid Spoonacular API key. Please check your credentials.',
            });
          }
          if (status === 402) {
            return res.status(402).json({
              success: false,
              message:
                'Spoonacular daily API request quota exceeded. Please try again tomorrow or upgrade your plan.',
            });
          }
          return res.status(status).json({
            success: false,
            message: `Spoonacular API error (${status}): ${err.response.data?.message || err.response.statusText}`,
          });
        } else if (err.code === 'ECONNABORTED') {
          return res.status(504).json({
            success: false,
            message: 'Request to Spoonacular timed out. Please try again.',
          });
        } else {
          throw err;
        }
      }
    }

    if (!recipeData) {
      return res.status(404).json({
        success: false,
        message: 'Could not obtain recipe details for PDF export.',
      });
    }

    // Format safe download filename
    const safeTitle = (recipeData.title || `recipe-${id}`)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 40);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${safeTitle}.pdf"`);

    // Stream PDF directly to client response
    await generateRecipePdf(recipeData, res);
  } catch (error) {
    next(error);
  }
}

// Support when mounted at /api/recipes
router.get('/:id/pdf', handleRecipePdf);
router.post('/:id/pdf', handleRecipePdf);

// Also support when mounted at root /
router.get('/api/recipes/:id/pdf', handleRecipePdf);
router.post('/api/recipes/:id/pdf', handleRecipePdf);

export default router;
