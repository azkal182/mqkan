import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  process.env.SUPABASE_PROJECT_URL ||
  'https://tizoiyihjofpuxdnsnrb.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY!;
export const supabase = createClient(supabaseUrl, supabaseKey);
