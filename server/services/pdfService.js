import PDFDocument from 'pdfkit';
import axios from 'axios';

/**
 * Strips HTML tags and entities from raw text strings
 * @param {string} html 
 * @returns {string}
 */
export function stripHtml(html = '') {
  if (!html) return '';
  return html
    .replace(/<[^>]*>?/gm, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Generates a recipe PDF document using PDFKit and pipes to output stream
 * @param {Object} recipe - Recipe object from Spoonacular API
 * @param {import('stream').Writable} [outputStream] - Optional writable stream (e.g. Express res)
 * @returns {Promise<PDFKit.PDFDocument>}
 */
export async function generateRecipePdf(recipe, outputStream = null) {
  const doc = new PDFDocument({
    size: 'A4',
    margins: { top: 40, bottom: 50, left: 50, right: 50 },
    info: {
      Title: recipe.title || 'SmartRecipe Card',
      Author: 'SmartRecipe - Powered by Spoonacular',
      Subject: 'Recipe Export',
      Keywords: 'recipe, cooking, spoonacular, pdf',
    },
    bufferPages: true,
  });

  if (outputStream) {
    doc.pipe(outputStream);
  }

  // Attempt to fetch recipe hero image if provided
  let imageBuffer = null;
  if (recipe.image && (recipe.image.startsWith('http://') || recipe.image.startsWith('https://'))) {
    try {
      const imgRes = await axios.get(recipe.image, {
        responseType: 'arraybuffer',
        timeout: 4000,
      });
      imageBuffer = Buffer.from(imgRes.data);
    } catch {
      imageBuffer = null; // Gracefully continue if image unavailable
    }
  }

  // --- 1. Top Header Banner ---
  doc
    .rect(50, 40, 495, 28)
    .fill('#15803D'); // Emerald primary

  doc
    .fillColor('#FFFFFF')
    .font('Helvetica-Bold')
    .fontSize(11)
    .text('SMARTRECIPE  •  CHEF COLLECTION', 65, 48, { characterSpacing: 1 });

  doc.moveDown(2);

  // --- 2. Recipe Title ---
  doc
    .fillColor('#1F2937')
    .font('Helvetica-Bold')
    .fontSize(22)
    .text(recipe.title || 'Delicious Recipe', 50, 84, { width: 495 });

  // --- 3. Key Recipe Badges (Time, Servings, Cuisines, Diets) ---
  const metaY = doc.y + 6;
  const metaParts = [];
  if (recipe.readyInMinutes) metaParts.push(`Ready in: ${recipe.readyInMinutes} min`);
  if (recipe.servings) metaParts.push(`Servings: ${recipe.servings}`);
  if (recipe.cuisines && recipe.cuisines.length > 0) {
    metaParts.push(`Cuisine: ${recipe.cuisines.slice(0, 2).join(', ')}`);
  }
  if (recipe.diets && recipe.diets.length > 0) {
    metaParts.push(`Diet: ${recipe.diets.slice(0, 3).join(', ')}`);
  }
  if (recipe.healthScore) {
    metaParts.push(`Health Score: ${recipe.healthScore}/100`);
  }

  doc
    .fillColor('#4B5563')
    .font('Helvetica')
    .fontSize(9.5)
    .text(metaParts.join('   |   '), 50, metaY);

  // Divider rule
  const dividerY = doc.y + 8;
  doc
    .strokeColor('#E5E7EB')
    .lineWidth(1)
    .moveTo(50, dividerY)
    .lineTo(545, dividerY)
    .stroke();

  doc.y = dividerY + 14;

  // --- 4. Recipe Summary & Image ---
  const currentY = doc.y;
  if (imageBuffer) {
    try {
      doc.image(imageBuffer, 375, currentY, { width: 170, height: 115, fit: [170, 115] });
      const summaryText = stripHtml(recipe.summary || '');
      if (summaryText) {
        doc
          .fillColor('#374151')
          .font('Helvetica-Oblique')
          .fontSize(9)
          .text(
            summaryText.length > 300 ? summaryText.slice(0, 297) + '...' : summaryText,
            50,
            currentY,
            { width: 310, lineGap: 2 }
          );
      }
      doc.y = Math.max(doc.y, currentY + 125);
    } catch {
      const summaryText = stripHtml(recipe.summary || '');
      if (summaryText) {
        doc
          .fillColor('#374151')
          .font('Helvetica-Oblique')
          .fontSize(9)
          .text(summaryText.length > 340 ? summaryText.slice(0, 337) + '...' : summaryText, 50, currentY, {
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
        .fontSize(9)
        .text(summaryText.length > 340 ? summaryText.slice(0, 337) + '...' : summaryText, 50, currentY, {
          width: 495,
          lineGap: 2,
        });
      doc.moveDown(1);
    }
  }

  // --- 5. Ingredients Section ---
  doc.moveDown(0.6);
  if (doc.y > 700) doc.addPage();

  doc
    .fillColor('#15803D')
    .font('Helvetica-Bold')
    .fontSize(12)
    .text('INGREDIENTS CHECKLIST', 50, doc.y);

  doc.moveDown(0.3);

  const ingredients = recipe.extendedIngredients || [];
  if (ingredients.length > 0) {
    doc.font('Helvetica').fontSize(9).fillColor('#1F2937');
    ingredients.forEach((ing) => {
      const text = ing.original || `${ing.amount || ''} ${ing.unit || ''} ${ing.name || ''}`.trim();
      if (text) {
        if (doc.y > 740) doc.addPage();
        doc.text(`[  ]  ${text}`, { indent: 10, lineGap: 2.5 });
      }
    });
  } else {
    doc.font('Helvetica-Oblique').fontSize(9).fillColor('#6B7280').text('No ingredient details available.', { indent: 10 });
  }

  // --- 6. Step-by-Step Instructions ---
  doc.moveDown(0.8);
  if (doc.y > 680) doc.addPage();

  doc
    .fillColor('#15803D')
    .font('Helvetica-Bold')
    .fontSize(12)
    .text('PREPARATION & INSTRUCTIONS');

  doc.moveDown(0.4);

  const steps =
    recipe.analyzedInstructions && recipe.analyzedInstructions.length > 0
      ? recipe.analyzedInstructions[0].steps || []
      : [];

  if (steps.length > 0) {
    doc.font('Helvetica').fontSize(9).fillColor('#1F2937');
    steps.forEach((stepItem) => {
      if (doc.y > 730) doc.addPage();
      doc
        .font('Helvetica-Bold')
        .fillColor('#15803D')
        .text(`Step ${stepItem.number}`);
      doc
        .font('Helvetica')
        .fillColor('#374151')
        .text(stepItem.step, { indent: 12, lineGap: 3 });
      doc.moveDown(0.4);
    });
  } else if (recipe.instructions) {
    const cleanInstructions = stripHtml(recipe.instructions);
    const splitSteps = cleanInstructions.split(/\r?\n+/).filter((s) => s.trim().length > 0);
    doc.font('Helvetica').fontSize(9).fillColor('#374151');
    splitSteps.forEach((s, idx) => {
      if (doc.y > 730) doc.addPage();
      doc.text(`${idx + 1}. ${s}`, { lineGap: 3 });
      doc.moveDown(0.3);
    });
  } else {
    doc.font('Helvetica-Oblique').fontSize(9).fillColor('#6B7280').text('No step-by-step instructions available.');
  }

  // --- 7. Page Footers ---
  const range = doc.bufferedPageRange();
  for (let i = 0; i < range.count; i++) {
    doc.switchToPage(i);
    doc
      .fillColor('#9CA3AF')
      .font('Helvetica')
      .fontSize(8)
      .text(
        `SmartRecipe • Generated on ${new Date().toLocaleDateString()} • Page ${i + 1} of ${range.count}`,
        50,
        790,
        { align: 'center', width: 495 }
      );
  }

  doc.end();
  return doc;
}

export default {
  generateRecipePdf,
  stripHtml,
};
