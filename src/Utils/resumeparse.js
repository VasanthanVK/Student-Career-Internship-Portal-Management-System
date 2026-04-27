export const parseResume = (text) => {

  const cleanText = text.replace(/\r/g, "");
  const lines = cleanText.split("\n").map(l => l.trim()).filter(Boolean);

  /* ---------- NAME ---------- */
  const name = lines[0];

  /* ---------- EMAIL ---------- */
  const emailMatch = text.match(
    /[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i
  );
  const email = emailMatch ? emailMatch[0] : null;

  /* ---------- PHONE ---------- */
  const phoneMatch = text.match(
    /(\+91[\-\s]?)?[6-9]\d{9}/
  );
  const phone = phoneMatch ? phoneMatch[0] : null;

  /* ---------- SKILLS ---------- */
  const SKILLS_DB = [
    "html",
    "css",
    "javascript",
    "react",
    "node",
    "mongodb",
    "mysql",
    "python",
    "java",
    "typescript",
    "express"
  ];

  const skills = SKILLS_DB.filter(skill =>
    text.toLowerCase().includes(skill)
  );

  /* ---------- EDUCATION ---------- */
  const educationKeywords = [
    "education", "university", "college", "school", "institute",
    "academy", "BCA", "MCA", "B.Sc", "M.Sc", "B.Tech", "M.Tech",
    "BE", "ME", "MBA", "B.Com", "M.Com", "BA", "MA", "PhD", "Diploma"
  ];

  const education = lines.filter(line =>
    educationKeywords.some(kw =>
      line.toLowerCase().includes(kw.toLowerCase())
    )
  );

  const degreeKeywords = [
    "BCA", "MCA", "B.Sc", "M.Sc", "B.Tech", "M.Tech",
    "BE", "ME", "MBA", "B.Com", "M.Com", "BA", "MA", "PhD", "Diploma"
  ];

  const degrees = education.filter(line =>
    degreeKeywords.some(degree =>
      line.toLowerCase().includes(degree.toLowerCase())
    )
  );

  /* ---------- GITHUB ---------- */
  const githubMatch = text.match(
    /(https?:\/\/)?(www\.)?github\.com\/[A-Za-z0-9_-]+/i
  );
  const github = githubMatch ? githubMatch[0] : null;

  /* ---------- LINKEDIN ---------- */
  const linkedinMatch = text.match(
    /(https?:\/\/)?(www\.)?linkedin\.com\/in\/[A-Za-z0-9_-]+/i
  );
  const linkedin = linkedinMatch ? linkedinMatch[0] : null;

  /* ---------- PROJECTS ---------- */
  const projectKeywords = [
    "project",
    "analysis",
    "clone",
    "application"
  ];

  const collegeNames = education
    .filter(line => line.toLowerCase().includes("college"))
    .map(line => line.split("|")[0].trim());

  // const projects = lines.filter(line =>
  //   projectKeywords.some(k =>
  //     line.toLowerCase().includes(k)
  //   )
  //);

  return {
    name,
    email,
    phone,
    degrees,
    collegeNames,
    projects,
    skills,
    github,
    linkedin
  };
};