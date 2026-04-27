import express from "express";
import { upload } from "../Utils/Multer.js";
import { extractText } from "../Utils/extractText.js";
import { parseResume } from "../Utils/resumeparse.js";

const router = express.Router();

router.post(
  "/upload",
  upload.single("file"),
  async (req, res) => {
    try {

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded",
        });
      }

      const extractedText = await extractText(req.file);

      const parsedData = parseResume(extractedText);



      return res.status(200).json({
        success: true,
        parsedData,
      });

    } catch (error) {
      console.error("Document Upload Error:", error);

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

export default router;