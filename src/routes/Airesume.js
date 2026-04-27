import express from "express";
import { upload } from "../Utils/Multer.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import { extractText } from "../Utils/extractText.js";
import fs from "fs";

dotenv.config();


const router=express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/ATSresume",upload.single("file"),async(req,res)=>{
    try {
       
    if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded",
        });
      }
    const resumeText = await extractText(req.file);
    const jobDescription= req.body.jobDescription;

    const prompt = `
You are an ATS Resume Analyzer AI.

STRICT RULES:
- Return ONLY valid JSON
- Do NOT use markdown
- Do NOT add \`\`\`
- Do NOT explain anything

Return format:

{
  "ats_score": number,
  "matched_skills": [],
  "missing_skills": [],
  "suggestions": []
}

Evaluate:
- skill matching
- experience relevance
- resume clarity
- ATS keyword optimization

Job Description:
${jobDescription}

Resume:
${resumeText}
`;
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const response = await model.generateContent(prompt);
    
    const text = response.response.text();
    const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();

const result = JSON.parse(cleanText);

    res.json(result);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "ATS analysis failed" });
  }
})

export default router;
