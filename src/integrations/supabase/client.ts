// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://mnffqbapmvaiuonbqsjn.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1uZmZxYmFwbXZhaXVvbmJxc2puIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxOTM4OTUsImV4cCI6MjA2MTc2OTg5NX0.VM6YtuLd25_fgo3A3hXZX3NjaCuIBAYlZWvgYR7Oo8A";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);