import supabaseClient, { supabaseUrl } from "@/Utils/SuperBase";

export async function applyToJob(token,_,jobData){
  const supabase = await supabaseClient(token);

  const random=Math.floor(Math.random()*90000);
  const fileName = `resume-${random}-${jobData.candidate_id}`;
  const {error:storageError}=await supabase.storage.from('resume').upload(fileName,jobData.resume)

 if (storageError) throw new Error("Error uploading Resume");

  const { data: publicUrlData } = supabase
  .storage
  .from("resume")
  .getPublicUrl(fileName);

const resume = publicUrlData.publicUrl;

  const {data, error}= await supabase.from("applications").insert([{
    ...jobData,
    resume,
  },]).select()

 if (error) {
    throw new Error("Error submitting Application");
  }
  return data
}
// - Edit Application Status ( recruiter )
export async function updateApplicationStatus(token, { job_id }, status) {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase
    .from("applications")
    .update({ status })
    .eq("id", job_id) // Here job_id actually represents the application's unique ID from Application_card
    .select();

  if (error || data.length === 0) {
    console.error("Error Updating Application Status:", error);
    return null;
  }

  return data;
}

export async function getApplications(token, { user_id }) {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase
    .from("applications")
    .select("*, job:jobs(title, company:companies(name))")
    .eq("candidate_id", user_id);

  if (error) {
    console.error("Error fetching Applications:", error);
    return null;
  }

  return data;
}

export async function getAllApplications(token) {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase
    .from("applications")
    .select("*, job:jobs(title, company:companies(name, logo_url))")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching all Applications:", error);
    return null;
  }

  return data;
}

export async function getApplicationsForRecruiter(token, { recruiter_id }) {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase
    .from("applications")
    .select("*, job:jobs(title, company:companies(name, logo_url))")
    .eq("job.recruiter_id", recruiter_id); // This might not work directly in Supabase joined filter

  if (error) {
    console.error("Error fetching Applications:", error);
    return null;
  }

  return data;
}