import React, { useState, useEffect } from "react";
import { UploadCloud, FileText, CheckCircle2, XCircle, Lightbulb, Loader2, Briefcase, ChevronRight, FileUp } from "lucide-react";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";
import useFetch from "@/hooks/usefetch";
import { getJobs } from "@/api/apijobs";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ATSanalysis() {
  const { isLoaded } = useUser();
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [selectedJobId, setSelectedJobId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const {
    loading: loadingJobs,
    data: jobs,
    fn: fnJobs,
  } = useFetch(getJobs, {});

  useEffect(() => {
    if (isLoaded) {
      fnJobs();
    }
  }, [isLoaded]);

  const handleJobSelect = (value) => {
    setSelectedJobId(value);
    const selectedJob = jobs?.find(j => j.id.toString() === value);
    if (selectedJob) {
      const combinedDesc = `${selectedJob.title}\n\n${selectedJob.description || ''}\n\n${selectedJob.requirement || ''}`.trim();
      setJobDescription(combinedDesc);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!file || !jobDescription.trim()) {
      setError("Please provide both a resume file and a job description.");
      return;
    }

    setError(null);
    setIsLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("jobDescription", jobDescription);

    try {
      const response = await axios.post("http://localhost:3000/api/ai/resume/ATSresume", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setResult(response.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to analyze resume. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-emerald-500 dark:text-emerald-400";
    if (score >= 60) return "text-amber-500 dark:text-amber-400";
    return "text-rose-500 dark:text-rose-400";
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f1e] relative overflow-hidden transition-colors duration-300">
      {/* Decorative background blobs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-400/20 dark:bg-blue-600/10 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-70 animate-pulse"></div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-400/20 dark:bg-indigo-600/10 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-70 animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute -bottom-32 left-20 w-[500px] h-[500px] bg-purple-400/20 dark:bg-purple-600/10 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-70 animate-pulse" style={{ animationDelay: '4s' }}></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mb-4 transition-colors">
            Smart <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">ATS Analysis</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto transition-colors">
            Optimize your resume for applicant tracking systems. Compare your experience against the job description to reveal missing keywords and boost your match score.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT: Input Form */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-slate-800/50 p-8 transition-all hover:shadow-2xl">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-2">
                <FileUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                Upload Data
              </h2>

              {/* File Upload */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Resume (PDF/DOCX)</label>
                <div className="relative group">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl cursor-pointer bg-slate-50 dark:bg-slate-800/50 hover:bg-blue-50 dark:hover:bg-slate-800 hover:border-blue-400 dark:hover:border-blue-500 transition-all">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                      <UploadCloud className="w-8 h-8 text-slate-400 dark:text-slate-500 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors mb-2" />
                      <p className="text-sm text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 font-medium transition-colors">
                        {file ? file.name : "Click to upload or drag and drop"}
                      </p>
                    </div>
                    <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
                  </label>
                </div>
              </div>

              {/* Job Selection */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Select a Job (Optional)</label>
                {loadingJobs ? (
                  <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <Loader2 className="w-4 h-4 animate-spin" /> Loading jobs...
                  </div>
                ) : (
                  <Select onValueChange={handleJobSelect} value={selectedJobId}>
                    <SelectTrigger className="w-full bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-200 focus:ring-blue-500/50 transition-colors">
                      <SelectValue placeholder="Select a job to auto-fill description" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-slate-900 dark:border-slate-800">
                      <SelectGroup>
                        {jobs?.map((job) => (
                          <SelectItem key={job.id} value={job.id.toString()} className="dark:text-slate-200 dark:focus:bg-slate-800">
                            {job.title} {job.company?.name ? `at ${job.company.name}` : ""}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              </div>

              {/* Job Description */}
              <div className="mb-8">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Job Description</label>
                <textarea
                  className={`w-full p-4 border rounded-2xl outline-none transition-all resize-none ${
                    selectedJobId
                      ? "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed"
                      : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-500/50 focus:border-blue-500 dark:focus:border-transparent hover:bg-white dark:hover:bg-slate-800 text-slate-900 dark:text-slate-200"
                  } placeholder:text-slate-400 dark:placeholder:text-slate-500`}
                  rows="6"
                  placeholder={selectedJobId ? "Job description auto-filled from database" : "Paste a custom job description here..."}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  readOnly={!!selectedJobId}
                ></textarea>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-2xl flex items-start gap-3 text-red-700 dark:text-red-400">
                  <XCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <p className="text-sm font-medium">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                onClick={handleAnalyze}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl text-white font-bold text-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:ring-blue-500/30 dark:focus:ring-blue-500/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Briefcase className="w-6 h-6" />
                    Analyze Resume
                  </>
                )}
              </button>
            </div>
          </div>

          {/* RIGHT: Results */}
          <div className="lg:col-span-7">
            {isLoading ? (
              <div className="h-full bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-slate-800/50 p-12 flex flex-col items-center justify-center min-h-[400px]">
                <div className="relative">
                  <div className="w-24 h-24 border-4 border-blue-100 dark:border-slate-800 rounded-full"></div>
                  <div className="w-24 h-24 border-4 border-blue-600 dark:border-blue-500 rounded-full border-t-transparent animate-spin absolute top-0 left-0"></div>
                  <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mt-6 mb-2">Our AI is reading your resume</h3>
                <p className="text-slate-500 dark:text-slate-400 text-center max-w-sm">Comparing your skills, experience, and keywords against the job description.</p>
              </div>
            ) : result ? (
              <div className="h-full bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-slate-800/50 p-8 transition-all animate-in fade-in slide-in-from-bottom-4 duration-700">
                
                {/* Score Header */}
                <div className="flex flex-col md:flex-row items-center gap-8 pb-8 border-b border-slate-100 dark:border-slate-800/80">
                  <div className="relative flex items-center justify-center shrink-0">
                    <svg className="w-32 h-32 transform -rotate-90">
                      <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100 dark:text-slate-800" />
                      <circle 
                        cx="64" 
                        cy="64" 
                        r="56" 
                        stroke="currentColor" 
                        strokeWidth="12" 
                        fill="transparent" 
                        strokeDasharray={351.8} 
                        strokeDashoffset={351.8 - (351.8 * result.ats_score) / 100} 
                        className={`${getScoreColor(result.ats_score)} transition-all duration-1000 ease-out`} 
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-3xl font-black text-slate-800 dark:text-slate-100">{result.ats_score}%</span>
                    </div>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-2">Match Score</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-lg">
                      {result.ats_score >= 80 ? "Excellent match! Your resume is highly optimized for this role." : result.ats_score >= 60 ? "Good match, but there's room for improvement to guarantee an interview." : "Needs work. You are missing key requirements for this position."}
                    </p>
                  </div>
                </div>

                {/* Skills Sections */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-8 border-b border-slate-100 dark:border-slate-800/80">
                  {/* Matched Skills */}
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
                      Matched Skills
                    </h3>
                    {result.matched_skills?.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {result.matched_skills.map((skill, index) => (
                          <span key={index} className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 rounded-lg text-sm font-semibold border border-emerald-100 dark:border-emerald-500/20 shadow-sm transition-transform hover:scale-105">
                            {skill}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-500 dark:text-slate-400 text-sm italic">No matching skills found.</p>
                    )}
                  </div>

                  {/* Missing Skills */}
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                      <XCircle className="w-5 h-5 text-rose-500 dark:text-rose-400" />
                      Missing Skills
                    </h3>
                    {result.missing_skills?.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {result.missing_skills.map((skill, index) => (
                          <span key={index} className="px-3 py-1.5 bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 rounded-lg text-sm font-semibold border border-rose-100 dark:border-rose-500/20 shadow-sm transition-transform hover:scale-105">
                            {skill}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-500 dark:text-slate-400 text-sm italic">You have all the required skills!</p>
                    )}
                  </div>
                </div>

                {/* Suggestions */}
                <div className="pt-8">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-amber-500 dark:text-amber-400" />
                    Actionable Suggestions
                  </h3>
                  <ul className="space-y-3">
                    {result.suggestions?.map((suggestion, index) => (
                      <li key={index} className="flex gap-3 text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors p-4 rounded-xl border border-slate-100 dark:border-slate-700/50 shadow-sm">
                        <ChevronRight className="w-5 h-5 text-blue-500 dark:text-blue-400 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>
            ) : (
              <div className="h-full bg-white/40 dark:bg-slate-900/40 backdrop-blur-md rounded-3xl border border-white/40 dark:border-slate-800/50 border-dashed p-12 flex flex-col items-center justify-center text-center transition-colors">
                <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-6 shadow-sm">
                  <FileText className="w-10 h-10 text-blue-400 dark:text-blue-500" />
                </div>
                <h3 className="text-2xl font-bold text-slate-700 dark:text-slate-200 mb-3">Ready for Analysis</h3>
                <p className="text-slate-500 dark:text-slate-400 max-w-md">
                  Upload your resume and the target job description. We'll use AI to identify missing keywords and provide actionable feedback to get you past the ATS.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
