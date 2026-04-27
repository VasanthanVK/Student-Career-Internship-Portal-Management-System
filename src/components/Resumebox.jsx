import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Upload } from "lucide-react";

export default function ResumeAnalysisDialog({ onResumeParsed }) {
  const [file, setFile] = useState(null);
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);

    // 👉 Example API call
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:3000/api/resume/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log(data);
      
      if (data.success && data.parsedData && onResumeParsed) {
        onResumeParsed(data.parsedData);
      }
      
      // Ensure score is a valid number
      const scoreValue = typeof data.score === 'number' ? data.score : 100;
      setScore(scoreValue);
    } catch (err) {
      console.error(err);
      setScore(0);
    }

    setLoading(false);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Analyze Resume</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Resume Analysis</DialogTitle>
        </DialogHeader>

        {/* Upload */}
        <div className="space-y-4">
          <Input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) =>
              setFile(e.target.files ? e.target.files[0] : null)
            }
          />

          <Button
            onClick={handleUpload}
            disabled={!file || loading}
            className="w-full"
          >
            <Upload className="mr-2 h-4 w-4" />
            {loading ? "Analyzing..." : "Upload & Analyze"}
          </Button>

          {/* Result */}
          {score !== null && (
            <div className="space-y-2">
              <p className="text-sm font-medium">
                Resume Score: {score}%
              </p>
              <Progress value={score} />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}