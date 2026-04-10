import { transporter } from "./Mailer.js";

export const sendCompanyStatusEmail = async ({
  status,
  companyName,
  companyEmail,
  companyLogo,
  adminName,
}) => {

  const logoHtml = companyLogo
    ? `<div style="margin-bottom:20px;"><img src="${companyLogo}" alt="${companyName}" width="120" /></div>`
    : "";

  let subject = "";
  let message = "";

  if (status === "approved") {
    subject = `🎉 Your Company Registration is Approved – ${companyName}`;
    message = `
<div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; padding:20px; border:1px solid #e0e0e0; border-radius:8px;">
  ${logoHtml}
  <h2 style="color:#16a34a;">Congratulations! Your Registration is Approved ✅</h2>
  <p>Dear <b>${companyName}</b> Team,</p>
  <p>We are pleased to inform you that your company registration on the <b>Internship Portal</b> has been <b>approved</b> by our admin team.</p>
  <p>You can now:</p>
  <ul>
    <li>Post internship and job listings</li>
    <li>Browse and shortlist candidates</li>
    <li>Manage your hiring pipeline</li>
  </ul>
  <p>Log in to your company portal to get started right away.</p>
  <br/>
  <p>Best regards,<br/><b>Admin Team</b><br/>Internship Portal</p>
</div>`;
  } else if (status === "rejected") {
    subject = `Company Registration Update – ${companyName}`;
    message = `
<div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; padding:20px; border:1px solid #e0e0e0; border-radius:8px;">
  ${logoHtml}
  <h2 style="color:#dc2626;">Registration Not Approved ❌</h2>
  <p>Dear <b>${companyName}</b> Team,</p>
  <p>Thank you for registering on the <b>Internship Portal</b>.</p>
  <p>After careful review, we regret to inform you that your company registration has <b>not been approved</b> at this time.</p>
  <p>If you believe this is an error or wish to resubmit with corrected information, please contact our support team.</p>
  <br/>
  <p>We appreciate your interest and encourage you to reapply once the issues are resolved.</p>
  <br/>
  <p>Sincerely,<br/><b>Admin Team</b><br/>Internship Portal</p>
</div>`;
  } else {
    console.warn("Unknown company status:", status);
    return;
  }

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: companyEmail,
      subject,
      html: message,
    });
    return info;
  } catch (error) {
    console.error("❌ Company status email failed:", error);
    throw error;
  }
};

export const sendStatusEmail = async ({
  status,
  candidateName,
  candidateEmail,
  jobTitle,
  companyName,
  companyLogo,
}) => {

  let subject = "";
  let message = "";

  const zoomLink = process.env.ZOOM_MEETING_LINK;
  const MeetingId = process.env.MEETING_ID;
  const MeetingPassword = process.env.MEETING_PASSWORD;

  const formattedStatus = status?.toLowerCase();

  // logoHtml is a const — do NOT reassign it in branches
  const logoHtml = companyLogo
    ? `<div style="margin-bottom:20px;"><img src="${companyLogo}" alt="${companyName}" width="120" /></div>`
    : "";

  if (formattedStatus === "applied") {
    subject = `Application Received – ${jobTitle} | ${companyName}`;
    message = `
<div style="font-family: Arial, sans-serif; max-width:600px; margin:auto;">
  ${logoHtml}
  <p>Dear ${candidateName},</p>
  <p>Thank you for applying for the <b>${jobTitle}</b> position at <b>${companyName}</b>.</p>
  <p>We have successfully received your application. Our recruitment team will review your profile and notify you about the next steps.</p>
  <br/>
  <p>Best regards,<br/>Recruitment Team<br/>${companyName}</p>
</div>`;

  } else if (formattedStatus === "shortlisted") {
    subject = `Application Update: Shortlisted for ${jobTitle}`;
    message = `
<div style="font-family: Arial, sans-serif; max-width:600px; margin:auto;">
  ${logoHtml}
  <p>Dear ${candidateName},</p>
  <p><b>Congratulations!</b></p>
  <p>You have been shortlisted for the <b>${jobTitle}</b> position at <b>${companyName}</b>.</p>
  <p>Our hiring team will contact you soon regarding the next steps.</p>
  <br/>
  <p>Best regards,<br/>Hiring Team<br/>${companyName}</p>
</div>`;

  } else if (formattedStatus === "interviewing") {
    subject = `Interview Invitation – ${jobTitle} | ${companyName}`;
    message = `
<div style="font-family: Arial, sans-serif; max-width:600px; margin:auto;">
  ${logoHtml}
  <p>Dear ${candidateName},</p>
  <p>We are pleased to invite you for an interview for the <b>${jobTitle}</b> role at <b>${companyName}</b>.</p>

  <p><b>Interview Details:</b></p>
  <p>
    Date: To be scheduled<br/>
    Time: To be scheduled
  </p>

  <p>
    Join Zoom Meeting:<br/>
    <a href="${zoomLink}" target="_blank">${zoomLink}</a>
  </p>
  <p>
    Meeting ID: ${MeetingId}<br/>
    Meeting Password: ${MeetingPassword}
  </p>
  <br/>

  <a href="${zoomLink}"
     style="background:#007bff;color:white;padding:10px 18px;
     text-decoration:none;border-radius:5px;">
     Join Interview
  </a>

  <br/><br/>
  <p>Kind regards,<br/>HR Department<br/>${companyName}</p>
</div>`;

  } else if (formattedStatus === "selected") {
    subject = `Congratulations! Selected for ${jobTitle}`;
    message = `
<div style="font-family: Arial, sans-serif; max-width:600px; margin:auto;">
  ${logoHtml}
  <p>Dear ${candidateName},</p>
  <p style="font-size:16px;"><b>Congratulations!</b></p>
  <p>We are delighted to inform you that you have been <b>SELECTED</b> for the <b>${jobTitle}</b> position at <b>${companyName}</b>.</p>
  <p>Our HR team will contact you shortly with your <b>offer letter</b> and further onboarding instructions.</p>
  <br/>
  <p>We look forward to welcoming you to our team!</p>
  <br/>
  <p>Best regards,<br/>HR Team<br/>${companyName}</p>
</div>`;

  } else if (formattedStatus === "offer_letter") {
    subject = `Offer Letter – ${jobTitle} | ${companyName}`;
    message = `
<div style="font-family: Arial, sans-serif; max-width:600px; margin:auto;">
  ${logoHtml}
  <p>Dear ${candidateName},</p>
  <p>We are delighted to offer you the position of <b>${jobTitle}</b> at <b>${companyName}</b>.</p>
  <p>Your official <b>Offer Letter</b> has been prepared and is now available in your candidate portal.</p>
  <p>Please review the offer details carefully and confirm your acceptance at your earliest convenience.</p>

  <div style="text-align:center; margin:25px 0;">
    <a href="${portalLink}"
       style="background:#28a745;color:white;padding:12px 20px;
       text-decoration:none;border-radius:5px;font-weight:bold;">
       View Offer Letter
    </a>
  </div>

  <p>We are excited about the possibility of you joining our team and look forward to working together.</p>
  <br/>
  <p>Warm regards,<br/>HR Department<br/>${companyName}</p>
</div>`;

  } else if (formattedStatus === "rejected") {
    subject = `Application Update – ${jobTitle} | ${companyName}`;
    message = `
<div style="font-family: Arial, sans-serif; max-width:600px; margin:auto;">
  ${logoHtml}
  <p>Dear ${candidateName},</p>
  <p>Thank you for taking the time to apply for the <b>${jobTitle}</b> position at <b>${companyName}</b>.</p>
  <p>We truly appreciate your interest and the effort you invested during the process.</p>
  <p>After careful evaluation, we regret to inform you that we will not be moving forward with your application at this time.</p>
  <p>We were impressed with your profile and encourage you to apply for future opportunities with <b>${companyName}</b>.</p>
  <br/>
  <p>We wish you success in your career journey.</p>
  <br/>
  <p>Sincerely,<br/>Recruitment Team<br/>${companyName}</p>
</div>`;

  } else {
    subject = `Application Update – ${jobTitle}`;
    message = `
<div style="font-family: Arial, sans-serif; max-width:600px; margin:auto;">
  ${logoHtml}
  <p>Dear ${candidateName},</p>
  <p>There is an update regarding your application for <b>${jobTitle}</b> at <b>${companyName}</b>.</p>
  <p>Please log in to the portal to see more details.</p>
  <br/>
  <p>Best regards,<br/>${companyName}</p>
</div>`;
  }

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: candidateEmail,
      subject,
      html: message,
    });
    return info;
  } catch (error) {
    console.error("❌ Nodemailer error:", error);
    throw error;
  }
};