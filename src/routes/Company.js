import express from "express";
import { sendCompanyStatusEmail } from "../Utils/sendMail.js";

const router = express.Router();

// POST /api/company/status-email
router.post("/status-email", async (req, res) => {
  try {
    const { status, companyName, companyEmail, companyLogo, adminName } = req.body;

    if (!companyEmail || !status || !companyName) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: companyEmail, status, companyName",
      });
    }

    await sendCompanyStatusEmail({ status, companyName, companyEmail, companyLogo, adminName });

    res.json({ success: true, message: "Company status email sent successfully" });
  } catch (error) {
    console.error("❌ Company email route error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send company status email",
      error: error.message,
    });
  }
});

export default router;
