import React, { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { Flag, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import useFetch from "@/hooks/usefetch";
import { submitReport } from "@/api/apiReports";

const ReportDialog = () => {
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const { loading, fn: fnSubmitReport } = useFetch(submitReport);

  const role = user?.unsafeMetadata?.role || "user";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.subject.trim() || !form.message.trim()) return;

    try {
      await fnSubmitReport({
        reporter_name: user?.fullName || user?.firstName || "Anonymous",
        reporter_role: role,
        reporter_email: user?.primaryEmailAddress?.emailAddress || "",
        subject: form.subject,
        message: form.message,
      });
      setSubmitted(true);
      setForm({ subject: "", message: "" });
    } catch (err) {
      console.error("Report submission failed:", err);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSubmitted(false);
    setForm({ subject: "", message: "" });
  };

  return (
    <>
      {/* Trigger Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 border-red-500/40 text-red-400 hover:bg-red-500/10 hover:text-red-400"
        id="report-dialog-trigger"
      >
        <Flag size={14} />
        Report an Issue
      </Button>

      {/* Backdrop + Modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={handleClose}
        >
          <div
            className="relative w-full max-w-md mx-4 bg-card border border-border rounded-2xl shadow-2xl p-6 flex flex-col gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flag size={18} className="text-red-400" />
                <h2 className="text-lg font-bold">Report an Issue</h2>
              </div>
              <button
                onClick={handleClose}
                className="text-muted-foreground hover:text-foreground transition-colors"
                id="report-dialog-close"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-sm text-muted-foreground">
              Your report will be sent directly to the admin team. Please describe the issue clearly.
            </p>

            {submitted ? (
              <div className="flex flex-col items-center gap-3 py-6 text-center">
                <div className="h-14 w-14 rounded-full bg-green-500/10 flex items-center justify-center">
                  <Send size={24} className="text-green-500" />
                </div>
                <p className="font-semibold text-green-500">Report Submitted!</p>
                <p className="text-sm text-muted-foreground">
                  The admin team has been notified and will review your report.
                </p>
                <Button onClick={handleClose} variant="outline" size="sm" className="mt-2">
                  Close
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* Reporter info (read-only display) */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 rounded-lg px-3 py-2">
                  <span className="capitalize font-semibold text-primary">{role}</span>
                  <span>·</span>
                  <span>{user?.primaryEmailAddress?.emailAddress}</span>
                </div>

                {/* Subject */}
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium" htmlFor="report-subject">
                    Subject
                  </label>
                  <input
                    id="report-subject"
                    type="text"
                    placeholder="e.g. Inappropriate job listing, spam..."
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    required
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                {/* Message */}
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium" htmlFor="report-message">
                    Description
                  </label>
                  <textarea
                    id="report-message"
                    rows={4}
                    placeholder="Describe the issue in detail..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    required
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading || !form.subject.trim() || !form.message.trim()}
                  className="w-full flex items-center justify-center gap-2"
                  id="report-submit-btn"
                >
                  {loading ? (
                    "Submitting..."
                  ) : (
                    <>
                      <Send size={14} /> Submit Report
                    </>
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ReportDialog;
