import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookies from "cookie-parser";
import authRoutes from "./modules/auth/auth.routes.js";
import availabilityRoutes from "./modules/availability/availability.routes.js";
// import { errorHandler } from "./middleware/error.middleware.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookies());
app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running"
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/availability", availabilityRoutes); 

// app.use(errorHandler);

export default app;