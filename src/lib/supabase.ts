import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://witcuyjpsykbeixvrupt.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndpdGN1eWpwc3lrYmVpeHZydXB0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5OTkzNTQsImV4cCI6MjA2MDU3NTM1NH0.xjPpq1NX1te_qS7n_ulvX5kwSw-_Ayrgx_BaOTMU9Yk"
);
