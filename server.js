import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import applicationRoutes from "./src/routes/Application.js";
import companyRoutes from "./src/routes/Company.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/application", applicationRoutes);
app.use("/api/company", companyRoutes);

// Health Check
app.get("/", (req, res) => {
  res.send("Internship Portal Backend is running...");
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
