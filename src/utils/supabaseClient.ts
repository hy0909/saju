import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ipwnzjqbluuejfzyipbc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlwd256anFibHV1ZWpmenlpcGJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1MzAxMjIsImV4cCI6MjA2MjEwNjEyMn0.OR1E7RzOeoeBhUlIKj3yuMK2aw0spxF0UxUQJ4dpZs8';

export const supabase = createClient(supabaseUrl, supabaseKey); 