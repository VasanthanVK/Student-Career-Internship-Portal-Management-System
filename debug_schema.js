
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCompanies() {
  const { data, error } = await supabase.from("companies").select("*").limit(5);
  if (error) {
    console.error("Error fetching companies:", error);
  } else {
    if (data.length > 0) {
      console.warn(JSON.stringify(data[0], null, 2));
      console.warn("\nAll keys:", Object.keys(data[0]));
    } else {
      console.warn("No records found in companies table.");
    }
  }
}

checkCompanies();
