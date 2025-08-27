import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tmmitcgiikblvmdoxord.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRtbWl0Y2dpaWtibHZtZG94b3JkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2MDYwNDksImV4cCI6MjA3MDE4MjA0OX0.3de_hKIpUCQl72fapVvhiIwDdwEW0Pmf-kKuR2SRQCk';
export const supabase = createClient(supabaseUrl, supabaseKey);