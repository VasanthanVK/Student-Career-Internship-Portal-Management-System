import supabaseClient, { supabaseUrl } from "@/Utils/SuperBase";

export async function getCompanies(token) {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase.from("companies").select("*");

  if (error) {
    console.error("error fetching companies:", error);
    return null;
  }
  return data;
}

export async function addNewCompany(token, _, companyData) {
  const supabase = await supabaseClient(token);

  const random = Math.floor(Math.random() * 90000);
  const fileName = `logo-${random}-${companyData.name}`;

  const { error: storageError } = await supabase.storage
    .from("company-logo")
    .upload(fileName, companyData.logo);

  if (storageError) throw new Error("Error uploading logo");

  const logo_url = `${supabaseUrl}/storage/v1/object/public/company-logo/${fileName}`;

  const { data, error } = await supabase
    .from("companies")
    .insert([
      {
        name: companyData.name,
        logo_url: logo_url,
        company_email: companyData.company_email,
        hr_phone: companyData.hr_phone,
        company_address: companyData.company_address,
        company_website: companyData.company_website,
        status: "pending", 
      },
    ])
    .select();

  if (error) {
    console.error("Error submitting companies:", error);
    throw new Error(error.message || "Error submitting companies");
  }
  return data;
}

export async function updateCompanyStatus(token, _, { company_id, status, approved_by }) {
  const supabase = await supabaseClient(token);
  
  if (!company_id || company_id === "undefined") {
    console.error("Invalid ID provided for status update:", company_id);
    throw new Error("Invalid ID for update");
  }

  const { data, error } = await supabase
  .from("companies")
  .update({ 
    status, 
    approves_at: new Date().toISOString() 
  })
  .eq("id", company_id)
  .select();

  if (error) {
    console.error("Error updating company status:", error);
    throw new Error(error.message || "Error updating status");
  }
  return data;
}