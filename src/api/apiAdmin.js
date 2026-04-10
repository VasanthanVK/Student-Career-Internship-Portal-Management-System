import supabaseClient from "@/Utils/SuperBase";

export async function saveAdminToTable(token, _, { name, email }) {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("admins")
    .insert([
      {
        admin_name: name,
        admin_email: email,
      },
    ])
    .select();

  if (error) {
    console.error("Error saving admin to table:", error);
    throw new Error(error.message || "Error saving admin data");
  }

  return data;
}
