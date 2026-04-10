import emailjs from "@emailjs/browser";

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

// Template IDs from environment variables
const TEMPLATE_IDS = {
  applied: import.meta.env.VITE_EMAILJS_APPLIED_TEMPLATE_ID,
  shortlisted: import.meta.env.VITE_EMAILJS_SHORTLIST_TEMPLATE_ID,
  interviewing: import.meta.env.VITE_EMAILJS_INTERVIER_SCHECULER_TEMPLATE_ID,
  hired: import.meta.env.VITE_EMAILJS_SELECTED_TEMPLATE_ID,
  rejected: import.meta.env.VITE_EMAILJS_REJECTED_TEMPLATE_ID,
};

export const sendStatusUpdateEmail = async (params) => {
  const status = (params.status || "applied").toLowerCase();
  const templateId = TEMPLATE_IDS[status] || TEMPLATE_IDS.applied;

  if (!SERVICE_ID || !templateId || !PUBLIC_KEY) {
    console.warn("EmailJS credentials or template missing for status:", status);
    return;
  }

  const templateParams = {
    to_name: params.candidate_name || "Candidate",
    to_email: params.candidate_email,
    name: params.candidate_name || "Candidate", // Redundant for template flexibility
    email: params.candidate_email, // Redundant for template flexibility
    job_title: params.job_title || "Internship Role",
    company_name: params.company_name || "Our Company",
    status: (params.status || "Updated").toUpperCase(),
    from_name: params.recruiter_name || "Hiring Manager",
    message: `Your application for ${params.job_title} at ${params.company_name} is now ${params.status}.`,
  };

  try {
    const response = await emailjs.send(
      SERVICE_ID,
      templateId,
      templateParams,
      PUBLIC_KEY
    );

    return response;

  } catch (error) {
    console.error("❌ Email Failed:", error);
    throw error;
  }
};

export const sendApplicationEmail = async (params) => {
  const templateId = TEMPLATE_IDS.applied;

  if (!SERVICE_ID || !templateId || !PUBLIC_KEY) {
    console.warn("EmailJS credentials missing for application email");
    return;
  }

  const templateParams = {
    to_name: params.candidate_name || "Candidate",
    to_email: params.candidate_email,
    name: params.candidate_name || "Candidate",
    email: params.candidate_email,
    job_title: params.job_title || "Internship Role",
    company_name: params.company_name || "Our Company",
    status: "APPLIED",
    from_name: "Internship Portal",
    message: `Thank you for applying for the ${params.job_title} role at ${params.company_name}. The recruiter will review your application soon.`,
  };

  try {
    const response = await emailjs.send(SERVICE_ID, templateId, templateParams, PUBLIC_KEY);
    return response;
  } catch (error) {
    console.error("❌ Application Email Failed:", error);
    throw error;
  }
};