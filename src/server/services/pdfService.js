import { generateRecipePdf, stripHtml } from "../../../server/services/pdfService.js";

/**
 * Creates and returns the PDF stream document for a given recipe
 * @param {Object} recipeData 
 * @returns {Promise<import('pdfkit').PDFDocument>}
 */
export async function createRecipePdfStream(recipeData) {
  return await generateRecipePdf(recipeData);
}

export { generateRecipePdf, stripHtml };
export default {
  createRecipePdfStream,
  generateRecipePdf,
  stripHtml
};
