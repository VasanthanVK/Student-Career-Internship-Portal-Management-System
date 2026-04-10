import express from "express";
import { sendStatusEmail } from "../Utils/sendMail.js";

const router = express.Router();

router.put("/status", async (req, res) => {
  try {
    const { status, candidateEmail } = req.body;

    await sendStatusEmail(req.body);

    res.json({ success: true, message: "Email Sent Successfully" });
  } catch (error) {
    console.error("❌ Route Email Error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to send email", 
      error: error.message 
    });
  }
});

export default router;