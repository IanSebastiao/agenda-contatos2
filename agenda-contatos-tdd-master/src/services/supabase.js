import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://buthvwkrystyweaphqoj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1dGh2d2tyeXN0eXdlYXBocW9qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MDA4MzAsImV4cCI6MjA2OTk3NjgzMH0.rSHiqkKKoHe6eHh4w6_SVXI1u1G24rn8arIuSx3ayjk';
export const supabase = createClient(supabaseUrl, supabaseKey);