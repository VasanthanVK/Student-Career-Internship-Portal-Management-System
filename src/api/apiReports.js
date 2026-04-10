import supabaseClient from "@/Utils/SuperBase";

// Submit a new report
export async function submitReport(token, _, reportData) {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("reports")
    .insert([
      {
        reporter_name: reportData.reporter_name,
        reporter_role: reportData.reporter_role,
        reporter_email: reportData.reporter_email,
        subject: reportData.subject,
        message: reportData.message,
        is_read: false,
        created_at: new Date().toISOString(),
      },
    ])
    .select();

  if (error) {
    console.error("Error submitting report:", error);
    throw new Error(error.message || "Failed to submit report");
  }

  return data;
}

// Get all reports (admin only)
export async function getAllReports(token) {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("reports")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching reports:", error);
    return null;
  }

  return data;
}

// Mark a report as read (admin only)
export async function markReportRead(token, _, { report_id }) {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("reports")
    .update({ is_read: true })
    .eq("id", report_id)
    .select();

  if (error) {
    console.error("Error marking report as read:", error);
    throw new Error(error.message);
  }

  return data;
}
