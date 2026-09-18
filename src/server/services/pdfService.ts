import PDFDocument from 'pdfkit';
import axios from 'axios';
import { Readable } from 'stream';

export interface RecipePdfData {
  title: string;
  image?: string;
  summary?: string;
  readyInMinutes?: number;
  servings?: number;
  cuisines?: string[];
  diets?: string[];
  extendedIngredients?: Array<{ original?: string; name?: string; amount?: number; unit?: string }>;
  analyzedInstructions?: Array<{
    steps?: Array<{ number: number; step: string }>;
  }>;
  instructions?: string;
}

function stripHtml(html: string = ''): string {
  return html
    .replace(/<[^>]*>?/gm, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

export async function createRecipePdfStream(recipe: RecipePdfData): Promise<Readable> {
  const doc = new PDFDocument({
    size: 'A4',
    margins: { top: 40, bottom: 50, left: 50, right: 50 },
    info: {
      Title: recipe.title || 'SmartRecipe Export',
      Author: 'SmartRecipe Platform',
      Subject: 'Recipe card export',
      Keywords: 'recipe, cooking, smartrecipe, ingredients',
    },
  });

  // Fetch image buffer if available
  let imageBuffer: Buffer | null = null;
  if (recipe.image && (recipe.image.startsWith('http://') || recipe.image.startsWith('https://'))) {
    try {
      const imgRes = await axios.get(recipe.image, {
        responseType: 'arraybuffer',
        timeout: 4000,
      });
      imageBuffer = Buffer.from(imgRes.data);
    } catch {
      // Ignore image download failure gracefully
      imageBuffer = null;
    }
  }

  // --- Header Banner ---
  doc
    .rect(50, 40, 495, 30)
    .fill('#15803D'); // Forest emerald green
  doc
    .fillColor('#FFFFFF')
    .font('Helvetica-Bold')
    .fontSize(12)
    .text('SMARTRECIPE  •  KITCHEN COMPANION', 65, 49, { characterSpacing: 1 });

  doc.moveDown(2);

  // --- Title & Metadata ---
  doc
    .fillColor('#1F2937')
    .font('Helvetica-Bold')
    .fontSize(22)
    .text(recipe.title || 'Delicious Recipe', 50, 85, { width: 495 });

  const metaY = doc.y + 6;
  const metaItems = [];
  if (recipe.readyInMinutes) metaItems.push(`Ready in: ${recipe.readyInMinutes} mins`);
  if (recipe.servings) metaItems.push(`Servings: ${recipe.servings}`);
  if (recipe.cuisines && recipe.cuisines.length > 0) metaItems.push(`Cuisine: ${recipe.cuisines.slice(0, 2).join(', ')}`);
  if (recipe.diets && recipe.diets.length > 0) metaItems.push(`Diet: ${recipe.diets.slice(0, 3).join(', ')}`);

  doc
    .fillColor('#4B5563')
    .font('Helvetica')
    .fontSize(10)
    .text(metaItems.join('   |   '), 50, metaY);

  doc.moveDown(1);
  const dividerY = doc.y + 5;
  doc
    .strokeColor('#E5E7EB')
    .lineWidth(1)
    .moveTo(50, dividerY)
    .lineTo(545, dividerY)
    .stroke();

  doc.y = dividerY + 15;

  // Optional: Place image on right if available
  if (imageBuffer) {
    try {
      const imgY = doc.y;
      doc.image(imageBuffer, 375, imgY, { width: 170, height: 120, fit: [170, 120] });
      // Summary on left
      const summaryText = stripHtml(recipe.summary || '');
      if (summaryText) {
        doc
          .fillColor('#374151')
          .font('Helvetica-Oblique')
          .fontSize(9.5)
          .text(summaryText.length > 320 ? summaryText.slice(0, 317) + '...' : summaryText, 50, imgY, {
            width: 310,
            lineGap: 2,
          });
      }
      doc.y = Math.max(doc.y, imgY + 130);
    } catch {
      // If rendering image fails, fallback to full-width text
      const summaryText = stripHtml(recipe.summary || '');
      if (summaryText) {
        doc
          .fillColor('#374151')
          .font('Helvetica-Oblique')
          .fontSize(9.5)
          .text(summaryText.length > 350 ? summaryText.slice(0, 347) + '...' : summaryText, 50, doc.y, {
            width: 495,
            lineGap: 2,
          });
        doc.moveDown(1);
      }
    }
  } else {
    const summaryText = stripHtml(recipe.summary || '');
    if (summaryText) {
      doc
        .fillColor('#374151')
        .font('Helvetica-Oblique')
        .fontSize(9.5)
        .text(summaryText.length > 350 ? summaryText.slice(0, 347) + '...' : summaryText, 50, doc.y, {
          width: 495,
          lineGap: 2,
        });
      doc.moveDown(1);
    }
  }

  // --- Ingredients Section ---
  doc.moveDown(0.8);
  doc
    .fillColor('#15803D')
    .font('Helvetica-Bold')
    .fontSize(13)
    .text('INGREDIENTS', 50, doc.y);

  doc.moveDown(0.4);

  const ingredients = recipe.extendedIngredients || [];
  if (ingredients.length > 0) {
    doc.font('Helvetica').fontSize(9.5).fillColor('#1F2937');
    ingredients.forEach((ing) => {
      const text = ing.original || `${ing.amount || ''} ${ing.unit || ''} ${ing.name || ''}`.trim();
      if (text) {
        if (doc.y > 740) doc.addPage();
        doc.text(`[  ]  ${text}`, { indent: 10, lineGap: 3 });
      }
    });
  } else {
    doc.font('Helvetica-Oblique').fontSize(9.5).fillColor('#6B7280').text('No ingredient details listed.', { indent: 10 });
  }

  // --- Instructions Section ---
  doc.moveDown(1);
  if (doc.y > 680) doc.addPage();

  doc
    .fillColor('#15803D')
    .font('Helvetica-Bold')
    .fontSize(13)
    .text('STEP-BY-STEP INSTRUCTIONS');

  doc.moveDown(0.4);

  const steps =
    recipe.analyzedInstructions && recipe.analyzedInstructions.length > 0
      ? recipe.analyzedInstructions[0].steps || []
      : [];

  if (steps.length > 0) {
    doc.font('Helvetica').fontSize(9.5).fillColor('#1F2937');
    steps.forEach((stepItem) => {
      if (doc.y > 740) doc.addPage();
      doc
        .font('Helvetica-Bold')
        .fillColor('#15803D')
        .text(`Step ${stepItem.number}`, { continued: false });
      doc
        .font('Helvetica')
        .fillColor('#374151')
        .text(stepItem.step, { indent: 12, lineGap: 3 });
      doc.moveDown(0.5);
    });
  } else if (recipe.instructions) {
    const cleanInstructions = stripHtml(recipe.instructions);
    const splitSteps = cleanInstructions.split(/\r?\n+/).filter((s) => s.trim().length > 0);
    doc.font('Helvetica').fontSize(9.5).fillColor('#374151');
    splitSteps.forEach((s, idx) => {
      if (doc.y > 740) doc.addPage();
      doc.text(`${idx + 1}. ${s}`, { lineGap: 3 });
      doc.moveDown(0.3);
    });
  } else {
    doc.font('Helvetica-Oblique').fontSize(9.5).fillColor('#6B7280').text('No step-by-step instructions available.');
  }

  // --- Footer ---
  const pages = doc.bufferedPageRange();
  for (let i = 0; i < pages.count; i++) {
    doc.switchToPage(i);
    doc
      .fillColor('#9CA3AF')
      .font('Helvetica')
      .fontSize(8)
      .text(
        `SmartRecipe • Generated on ${new Date().toLocaleDateString()} • Page ${i + 1} of ${pages.count}`,
        50,
        790,
        { align: 'center', width: 495 }
      );
  }

  doc.end();
  return doc;
}
