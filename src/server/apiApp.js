import express from "express";
import dotenv from "dotenv";
import recipeRoutes from "./routes/recipeRoutes.js";
import pdfRoutes from "./routes/pdfRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";
dotenv.config();
dotenv.config({ path: ".env.example" });
const apiApp = express();
apiApp.use(express.json({ limit: "5mb" }));
apiApp.use(express.urlencoded({ extended: true }));
apiApp.use("/api/recipes", pdfRoutes);
apiApp.use("/api/recipes", recipeRoutes);
apiApp.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "SmartRecipe Backend", timestamp: (/* @__PURE__ */ new Date()).toISOString() });
});
apiApp.use(errorHandler);
var stdin_default = apiApp;
export {
  stdin_default as default
};
