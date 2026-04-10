import supabaseClient from "@/Utils/SuperBase";

export async function getJobs(token, {location, company_id, searchquery}) {

    const supabase = await supabaseClient(token)

    let query = supabase.from("jobs").select("*,saved: saved_job(id),company:companies(name,logo_url), applications: applications(id)");
    
    if(location){
        query=query.eq("location", location)
    }
    if(company_id){
        query=query.eq("company_id", company_id)
    }
    if(searchquery){
        query=query.ilike("title",`%${searchquery}%`)
    }

    const {data,error}=await query;
    
    if(error){
        console.error("error fetching jobs:",error);
        return null;
    }
    
    return data;
    
}
export async function saveJob(token,{alreadysaved},saveData) {
    const supabase = await supabaseClient(token);

    if(alreadysaved){
         const {data,error:deleteError}=await supabase.from("saved_job").delete().eq("job_id",saveData.job_id)

          if(deleteError){
        console.error("error  deleting saved job",deleteError);
        return data;
    }
    return data;
}else{
     const {data,error:insertError}=await supabase.from("saved_job").insert([saveData]).select()


         if(insertError){
        console.error("error fetching job",insertError);
        return data;
    }
    return data
}
}

export async function getSingleJob(token,{job_id}){
  const supabase = await supabaseClient(token);
  let query= supabase.from("jobs").select("*,company:companies(name,logo_url),applications:applications(*)").eq("id",job_id).single();
  const {data, error}= await query
  if(error){
    return null 
  }
  return data
}
   export async function updateHiringStatus(token,{job_id},isOpen){
  const supabase = await supabaseClient(token);
  const {data, error}= await supabase.from("jobs").update({isOpen}).eq("id",job_id).select()

  if(error){
    return null 
  }
  return data
}

export async function addNewJob(token, _, jobData){
  const supabase = await supabaseClient(token);
  const {data, error}= await supabase.from("jobs").insert([jobData]).select()

  if(error){
    return null 
  }
  return data
}

export async function getSavedJobs(token) {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase
    .from("saved_job")
    .select("*, job: jobs(*, company: companies(name,logo_url), applications: applications(id))");

  if (error) {
    console.error("Error fetching Saved Jobs:", error);
    return null;
  }

  return data;
}

export async function getMyJobs(token, { recruiter_id }) {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("jobs")
    .select("*, company: companies(name,logo_url), applications: applications(id, status)")
    .eq("recruiter_id", recruiter_id);

  if (error) {
    console.error("Error fetching Jobs:", error);
    return null;
  }

  return data;
}

export async function deleteJob(token, { job_id }) {
  const supabase = await supabaseClient(token);

  // Delete associated applications first to handle foreign key constraints
  const { error: appError } = await supabase
    .from("applications")
    .delete()
    .eq("job_id", job_id);

  if (appError) {
    console.error("❌ Error deleting associated applications:", appError);
  }

  // Delete associated saved jobs
  const { error: saveError } = await supabase
    .from("saved_job")
    .delete()
    .eq("job_id", job_id);

  if (saveError) {
    console.error("❌ Error deleting associated saved jobs:", saveError);
  }

  // Finally delete the job itself
  const { data, error } = await supabase
    .from("jobs")
    .delete()
    .eq("id", job_id)
    .select();

  if (error) {
    console.error("❌ Final error deleting job:", error);
    return null;
  }

  return data;
}
   