import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useFetch from "@/hooks/usefetch";
import { applyToJob } from "@/api/apiApplications";
import BarLoader from "./ui/BarLoader";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  FileText,
  CheckCircle2,
  Sparkles,
  GraduationCap,
  Upload,
  Send,
  X,
  BookOpen,
  Award,
  Briefcase,
  ExternalLink,
  User,
} from "lucide-react";

/* ─── Zod Schema ─────────────────────────────────────── */
const schema = z.object({
  skills: z.string().min(1, { message: "Skills are required" }),
  education: z.enum(["Graduate", "Post Graduate"], {
    required_error: "Education is required",
    invalid_type_error: "Education is required",
  }),
  resume: z
    .any()
    .optional()
    .refine(
      (file) => {
        if (!file || file.length === 0) return true;
        return [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ].includes(file[0]?.type);
      },
      { message: "Only PDF or Word documents are allowed" }
    ),
});

/* ─── Education Option Card ───────────────────────────── */
const EducationCard = ({ value, label, icon: Icon, desc, selected, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    style={{
      all: "unset",
      display: "flex",
      flexDirection: "column",
      gap: "6px",
      flex: 1,
      padding: "14px 16px",
      borderRadius: "14px",
      cursor: "pointer",
      border: selected
        ? "2px solid hsl(221,83%,60%)"
        : "2px solid rgba(255,255,255,0.08)",
      background: selected
        ? "linear-gradient(135deg, rgba(67,97,238,0.18), rgba(114,9,183,0.12))"
        : "rgba(255,255,255,0.04)",
      transition: "all 0.2s ease",
      boxShadow: selected ? "0 0 0 4px rgba(67,97,238,0.12)" : "none",
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: selected
            ? "linear-gradient(135deg,#4361ee,#7209b7)"
            : "rgba(255,255,255,0.08)",
          transition: "background 0.2s",
        }}
      >
        <Icon size={16} style={{ color: selected ? "#fff" : "#94a3b8" }} />
      </div>
      <span
        style={{
          fontWeight: 600,
          fontSize: "14px",
          color: selected ? "#c7d2fe" : "#94a3b8",
        }}
      >
        {label}
      </span>
      {selected && (
        <CheckCircle2
          size={14}
          style={{ color: "#60a5fa", marginLeft: "auto" }}
        />
      )}
    </div>
    <p style={{ fontSize: "11px", color: "#64748b", paddingLeft: "40px" }}>
      {desc}
    </p>
  </button>
);

/* ─── Skill Chip ─────────────────────────────────────── */
const SkillChip = ({ label }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: "4px",
      padding: "3px 10px",
      borderRadius: "100px",
      fontSize: "11px",
      fontWeight: 600,
      background: "rgba(67,97,238,0.15)",
      color: "#818cf8",
      border: "1px solid rgba(67,97,238,0.25)",
    }}
  >
    {label}
  </span>
);

/* ─── Main Component ─────────────────────────────────── */
export function ApplyJobDrawer({ user, Job, fetchJob, applied = false, candidateProfile }) {
  const [skillChips, setSkillChips] = useState([]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { skills: "", education: undefined },
  });

  /* Auto-fill from profile */
  useEffect(() => {
    if (candidateProfile?.skills) {
      const str = Array.isArray(candidateProfile.skills)
        ? candidateProfile.skills.join(", ")
        : candidateProfile.skills;
      setValue("skills", str);
      setSkillChips(
        str.split(",").map((s) => s.trim()).filter(Boolean)
      );
    }
  }, [candidateProfile, setValue]);

  /* Live skill chip preview */
  const watchedSkills = watch("skills");
  useEffect(() => {
    setSkillChips(
      (watchedSkills || "").split(",").map((s) => s.trim()).filter(Boolean)
    );
  }, [watchedSkills]);

  const watchedResume = watch("resume");
  const hasUploadedFile = watchedResume && watchedResume.length > 0;
  const hasProfileResume = !!candidateProfile?.resume_url;

  const { loading: loadingApply, error: errorApply, fn: fnApply } = useFetch(applyToJob);

  const onSubmit = (data) => {
    const resumeToSubmit = hasUploadedFile ? data.resume[0] : candidateProfile?.resume_url;
    if (!resumeToSubmit) {
      alert("Please upload a resume or add one to your profile first.");
      return;
    }
    fnApply({
      ...data,
      job_id: Job.id,
      candidate_id: user.id,
      name: user.fullName,
      email: user?.primaryEmailAddress?.emailAddress,
      status: "applied",
      resume: resumeToSubmit,
    }).then(() => {
      axios
        .put("http://localhost:3000/api/application/status", {
          status: "applied",
          candidateName: user.fullName || "Candidate",
          candidateEmail: user?.primaryEmailAddress?.emailAddress,
          jobTitle: Job?.title,
          companyName: Job?.company?.name,
        })
        .then((res) => {
          if (res.data.success) {
          } else console.error("⚠️ Email failure:", res.data.message);
        })
        .catch((err) =>
          console.error("❌ Email error:", err.message)
        );
      fetchJob();
      reset();
    });
  };

  return (
    <>
      <Drawer open={applied ? false : undefined}>
        {/* ── Trigger Button ── */}
        <DrawerTrigger asChild>
          <Button
            size="lg"
            style={
              Job?.isOpen && !applied
                ? {
                    background: "linear-gradient(135deg,#4361ee,#7209b7)",
                    color: "#fff",
                    border: "none",
                    fontWeight: 700,
                    letterSpacing: "0.03em",
                    boxShadow: "0 4px 24px rgba(67,97,238,0.35)",
                    transition: "transform 0.15s,box-shadow 0.15s",
                  }
                : {}
            }
            variant={Job?.isOpen && !applied ? undefined : "destructive"}
            disabled={!Job?.isOpen || applied}
            onMouseEnter={(e) => {
              if (Job?.isOpen && !applied) {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 8px 32px rgba(67,97,238,0.45)";
              }
            }}
            onMouseLeave={(e) => {
              if (Job?.isOpen && !applied) {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 4px 24px rgba(67,97,238,0.35)";
              }
            }}
          >
            {Job?.isOpen ? (
              applied ? (
                <>
                  <CheckCircle2 size={18} /> Applied
                </>
              ) : (
                <>
                  <Send size={18} style={{ marginRight: 6 }} /> Apply Now
                </>
              )
            ) : (
              "Internship Closed"
            )}
          </Button>
        </DrawerTrigger>

        {/* ── Drawer Panel ── */}
        <DrawerContent
          style={{
            background:
              "linear-gradient(170deg, #0b0f1e 0%, #0d1225 50%, #0f1530 100%)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderBottom: "none",
            borderRadius: "24px 24px 0 0",
            maxHeight: "92vh",
            overflow: "hidden",
          }}
        >
          <div style={{ overflowY: "auto", maxHeight: "90vh", padding: "0 0 24px" }}>

            {/* ── Header ── */}
            <div
              style={{
                padding: "28px 28px 20px",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                position: "relative",
              }}
            >
              {/* Gradient glow blob */}
              <div
                style={{
                  position: "absolute",
                  top: -40,
                  right: 40,
                  width: 200,
                  height: 200,
                  background:
                    "radial-gradient(circle, rgba(67,97,238,0.18) 0%, transparent 70%)",
                  pointerEvents: "none",
                }}
              />
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                <div>
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      background: "rgba(67,97,238,0.15)",
                      border: "1px solid rgba(67,97,238,0.3)",
                      borderRadius: 100,
                      padding: "4px 12px",
                      marginBottom: 10,
                    }}
                  >
                    <Sparkles size={12} style={{ color: "#818cf8" }} />
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#818cf8", letterSpacing: "0.06em" }}>
                      QUICK APPLY
                    </span>
                  </div>
                  <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#f1f5f9", margin: 0, lineHeight: 1.3 }}>
                    {Job?.title}
                  </h2>
                  <p style={{ fontSize: "13px", color: "#64748b", marginTop: 4 }}>
                    at <span style={{ color: "#94a3b8", fontWeight: 600 }}>{Job?.company?.name}</span>
                    {" · "}
                    {candidateProfile
                      ? "Profile details pre-filled ✦"
                      : "Fill in your details below"}
                  </p>
                </div>
                <DrawerClose asChild>
                  <button
                    type="button"
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "10px",
                      border: "1px solid rgba(255,255,255,0.08)",
                      background: "rgba(255,255,255,0.05)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      color: "#64748b",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "rgba(255,255,255,0.1)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "rgba(255,255,255,0.05)")
                    }
                  >
                    <X size={16} />
                  </button>
                </DrawerClose>
              </div>

              {/* Candidate Profile Badge */}
              {candidateProfile && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginTop: 16,
                    padding: "10px 14px",
                    background: "rgba(16,185,129,0.08)",
                    border: "1px solid rgba(16,185,129,0.2)",
                    borderRadius: 12,
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      overflow: "hidden",
                      border: "2px solid rgba(16,185,129,0.4)",
                      flexShrink: 0,
                    }}
                  >
                    {user?.imageUrl ? (
                      <img src={user.imageUrl} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <div style={{ width: "100%", height: "100%", background: "rgba(16,185,129,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <User size={16} style={{ color: "#10b981" }} />
                      </div>
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: "12px", fontWeight: 700, color: "#10b981", margin: 0 }}>
                      Profile Connected
                    </p>
                    <p style={{ fontSize: "11px", color: "#64748b", margin: 0 }}>
                      Skills &amp; resume auto-filled from your profile
                    </p>
                  </div>
                  <CheckCircle2 size={18} style={{ color: "#10b981", flexShrink: 0 }} />
                </div>
              )}
            </div>

            {/* ── Form ── */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              style={{ display: "flex", flexDirection: "column", gap: 20, padding: "20px 28px 0" }}
            >

              {/* Skills */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <Label
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#94a3b8",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <Award size={13} style={{ color: "#818cf8" }} />
                  Skills
                  {candidateProfile?.skills && (
                    <span
                      style={{
                        marginLeft: 4,
                        padding: "2px 8px",
                        borderRadius: 100,
                        background: "rgba(16,185,129,0.12)",
                        border: "1px solid rgba(16,185,129,0.25)",
                        fontSize: 10,
                        color: "#10b981",
                        fontWeight: 700,
                      }}
                    >
                      Auto-filled
                    </span>
                  )}
                </Label>
                <Input
                  type="text"
                  placeholder="e.g. React, Node.js, Python, AWS"
                  {...register("skills")}
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1.5px solid rgba(255,255,255,0.1)",
                    borderRadius: 12,
                    color: "#f1f5f9",
                    height: 44,
                    fontSize: 14,
                    padding: "0 14px",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) =>
                    (e.target.style.borderColor = "rgba(67,97,238,0.6)")
                  }
                  onBlur={(e) =>
                    (e.target.style.borderColor = "rgba(255,255,255,0.1)")
                  }
                />
                {/* Live skill chip preview */}
                {skillChips.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 2 }}>
                    {skillChips.slice(0, 10).map((s, i) => (
                      <SkillChip key={i} label={s} />
                    ))}
                    {skillChips.length > 10 && (
                      <span style={{ fontSize: 11, color: "#64748b" }}>
                        +{skillChips.length - 10} more
                      </span>
                    )}
                  </div>
                )}
                {errors.skills && (
                  <p style={{ fontSize: 12, color: "#f87171", margin: 0 }}>
                    {errors.skills.message}
                  </p>
                )}
              </div>

              {/* Education */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <Label
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#94a3b8",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <GraduationCap size={13} style={{ color: "#818cf8" }} />
                  Education Level
                </Label>
                <Controller
                  name="education"
                  control={control}
                  render={({ field }) => (
                    <div style={{ display: "flex", gap: 10 }}>
                      <EducationCard
                        value="Graduate"
                        label="UG Graduate"
                        icon={BookOpen}
                        desc="Bachelor's degree"
                        selected={field.value === "Graduate"}
                        onClick={() => field.onChange("Graduate")}
                      />
                      <EducationCard
                        value="Post Graduate"
                        label="PG Graduate"
                        icon={Briefcase}
                        desc="Master's / PhD"
                        selected={field.value === "Post Graduate"}
                        onClick={() => field.onChange("Post Graduate")}
                      />
                    </div>
                  )}
                />
                {errors.education && (
                  <p style={{ fontSize: 12, color: "#f87171", margin: 0 }}>
                    {errors.education.message}
                  </p>
                )}
              </div>

              {/* Resume */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <Label
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#94a3b8",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <FileText size={13} style={{ color: "#818cf8" }} />
                  Resume
                  {hasProfileResume && !hasUploadedFile && (
                    <span
                      style={{
                        marginLeft: 4,
                        padding: "2px 8px",
                        borderRadius: 100,
                        background: "rgba(16,185,129,0.12)",
                        border: "1px solid rgba(16,185,129,0.25)",
                        fontSize: 10,
                        color: "#10b981",
                        fontWeight: 700,
                      }}
                    >
                      Using profile resume
                    </span>
                  )}
                  {hasUploadedFile && (
                    <span
                      style={{
                        marginLeft: 4,
                        padding: "2px 8px",
                        borderRadius: 100,
                        background: "rgba(67,97,238,0.15)",
                        border: "1px solid rgba(67,97,238,0.3)",
                        fontSize: 10,
                        color: "#818cf8",
                        fontWeight: 700,
                      }}
                    >
                      New file selected
                    </span>
                  )}
                </Label>

                {/* Profile resume card */}
                {hasProfileResume && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "12px 14px",
                      background: hasUploadedFile
                        ? "rgba(255,255,255,0.03)"
                        : "rgba(67,97,238,0.08)",
                      border: `1.5px solid ${
                        hasUploadedFile
                          ? "rgba(255,255,255,0.06)"
                          : "rgba(67,97,238,0.25)"
                      }`,
                      borderRadius: 12,
                      transition: "all 0.2s",
                      opacity: hasUploadedFile ? 0.5 : 1,
                    }}
                  >
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 10,
                        background: "linear-gradient(135deg,#4361ee,#7209b7)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <FileText size={18} style={{ color: "#fff" }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>
                        Profile Resume
                      </p>
                      <a
                        href={candidateProfile?.resume_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          fontSize: 13,
                          color: "#818cf8",
                          fontWeight: 600,
                          textDecoration: "none",
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.textDecoration = "underline")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.textDecoration = "none")
                        }
                      >
                        View Resume <ExternalLink size={11} />
                      </a>
                    </div>
                    {!hasUploadedFile && (
                      <CheckCircle2 size={18} style={{ color: "#10b981", flexShrink: 0 }} />
                    )}
                  </div>
                )}

                {/* File upload area */}
                <label
                  htmlFor="resume-upload"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    padding: "20px 16px",
                    borderRadius: 14,
                    border: `2px dashed ${
                      hasUploadedFile
                        ? "rgba(67,97,238,0.5)"
                        : "rgba(255,255,255,0.1)"
                    }`,
                    background: hasUploadedFile
                      ? "rgba(67,97,238,0.08)"
                      : "rgba(255,255,255,0.02)",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "rgba(67,97,238,0.5)";
                    e.currentTarget.style.background = "rgba(67,97,238,0.06)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = hasUploadedFile
                      ? "rgba(67,97,238,0.5)"
                      : "rgba(255,255,255,0.1)";
                    e.currentTarget.style.background = hasUploadedFile
                      ? "rgba(67,97,238,0.08)"
                      : "rgba(255,255,255,0.02)";
                  }}
                >
                  <Upload size={22} style={{ color: hasUploadedFile ? "#818cf8" : "#475569" }} />
                  <div style={{ textAlign: "center" }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: hasUploadedFile ? "#818cf8" : "#64748b", margin: 0 }}>
                      {hasUploadedFile
                        ? watchedResume[0]?.name
                        : hasProfileResume
                        ? "Upload a different resume"
                        : "Click to upload resume"}
                    </p>
                    <p style={{ fontSize: 11, color: "#475569", margin: "2px 0 0" }}>
                      PDF, DOC or DOCX
                    </p>
                  </div>
                  <Input
                    id="resume-upload"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    {...register("resume")}
                    style={{ display: "none" }}
                  />
                </label>

                {!hasProfileResume && errors.resume && (
                  <p style={{ fontSize: 12, color: "#f87171", margin: 0 }}>
                    {errors.resume.message}
                  </p>
                )}
              </div>

              {/* API error */}
              {errorApply?.message && (
                <div
                  style={{
                    padding: "10px 14px",
                    background: "rgba(248,113,113,0.1)",
                    border: "1px solid rgba(248,113,113,0.25)",
                    borderRadius: 10,
                    fontSize: 13,
                    color: "#f87171",
                  }}
                >
                  {errorApply.message}
                </div>
              )}

              {loadingApply && <BarLoader loading={true} />}

              {/* Submit */}
              <button
                type="submit"
                disabled={loadingApply}
                style={{
                  width: "100%",
                  height: 52,
                  borderRadius: 14,
                  border: "none",
                  background: loadingApply
                    ? "rgba(67,97,238,0.4)"
                    : "linear-gradient(135deg,#4361ee 0%,#7209b7 100%)",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 15,
                  letterSpacing: "0.03em",
                  cursor: loadingApply ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  boxShadow: "0 4px 24px rgba(67,97,238,0.3)",
                  transition: "transform 0.15s,box-shadow 0.15s",
                  marginTop: 4,
                }}
                onMouseEnter={(e) => {
                  if (!loadingApply) {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow =
                      "0 8px 32px rgba(67,97,238,0.45)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 24px rgba(67,97,238,0.3)";
                }}
              >
                <Send size={18} />
                {loadingApply ? "Submitting..." : "Submit Application"}
              </button>

              {/* Footer spacer */}
              <div style={{ height: 8 }} />
            </form>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default ApplyJobDrawer;
