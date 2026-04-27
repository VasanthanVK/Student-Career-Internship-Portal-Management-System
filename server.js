import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import applicationRoutes from "./src/routes/Application.js";
import companyRoutes from "./src/routes/Company.js";
import resumeRoutes from "./src/routes/resume.js";
import AiresumeRoutes from "./src/routes/Airesume.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use("/api/application", applicationRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/ai/resume", AiresumeRoutes);

// Health Check
app.get("/", (req, res) => {
  res.send("Internship Portal Backend is running...");
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
