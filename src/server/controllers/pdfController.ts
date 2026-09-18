import { Request, Response, NextFunction } from 'express';
import { getRecipeById } from '../services/spoonacularService.ts';
import { createRecipePdfStream } from '../services/pdfService.ts';

export async function generateRecipePdfController(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    let recipeData = req.body?.recipe;

    if (!recipeData && id) {
      recipeData = await getRecipeById(id);
    }

    if (!recipeData) {
      res.status(400).json({ success: false, message: 'Recipe data not found for PDF export.' });
      return;
    }

    const safeTitle = (recipeData.title || 'recipe')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 40);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${safeTitle}.pdf"`);

    const pdfStream = await createRecipePdfStream(recipeData);
    pdfStream.pipe(res);
  } catch (err) {
    next(err);
  }
}
