import supabaseClient, { supabaseUrl } from "@/Utils/SuperBase";

export async function getCandidateProfile(token, { user_id }) {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase
    .from("candidates")
    .select("*")
    .eq("auth_user_id", user_id)   // <-- use auth_user_id
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Error fetching Candidate Profile:", error);
    return null;
  }
  return data;
}

export async function updateCandidateProfile(token, _, profileData) {
  const supabase = await supabaseClient(token);

  let resumeUrl = profileData.resume;

  // If the resume is a file, upload it to Supabase Storage
  if (profileData.resume instanceof File) {
    const random = Math.floor(Math.random() * 90000);
    const fileName = `resume-${random}-${profileData.user_id}`;
    const { error: storageError } = await supabase.storage
      .from("resume")
      .upload(fileName, profileData.resume);

    if (storageError) throw new Error("Error uploading Resume");

    const { data: publicUrlData } = supabase.storage
      .from("resume")
      .getPublicUrl(fileName);

    resumeUrl = publicUrlData.publicUrl;
  }

  const { data, error } = await supabase
    .from("candidates")
    .upsert(
      [
        {
          auth_user_id: profileData.user_id,
          name: profileData.name,
          email: profileData.email,
          skills: profileData.skills,
          resume_url: resumeUrl,
          headlines: profileData.headlines,
          location: profileData.location,
          created_at: new Date().toISOString(),
        },
      ],
      { onConflict: "auth_user_id" }
    )
    .select();

  if (error) {
    console.error("Error updating Candidate Profile:", error);
    throw new Error(error.message || "Error updating Candidate Profile");
  }

  return data;
}

export async function getAllCandidates(token) {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase
    .from("candidates")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching all candidates:", error);
    return null;
  }

  return data;
}
