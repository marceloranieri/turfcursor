// Import Supabase client
const { createClient } = require('@supabase/supabase-js');

// Supabase credentials
const supabaseUrl = 'https://csfdshydwdzexxosevml.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzZmRzaHlkd2R6ZXh4b3Nldm1sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzNjY1MTUsImV4cCI6MjA2MDk0MjUxNX0.psZNkXCiyhIgHetnjF1NxwY40jYSZb3qlor78T-FPcg';

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSupabaseConnection() {
  console.log('Testing Supabase connection...');
  
  try {
    // Check if we can connect to Supabase
    const { data, error } = await supabase.from('users').select('count').single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // This error means the table doesn't exist yet
        console.log('The database is connected, but the users table does not exist yet.');
        console.log('Please run the SQL schema to create the tables.');
      } else {
        console.error('Error connecting to Supabase:', error);
      }
    } else {
      console.log('Successfully connected to Supabase!');
      console.log('User count:', data.count);
    }

    // Test if we can add a circle
    console.log('Testing circle creation...');
    const { data: circle, error: circleError } = await supabase
      .from('circles')
      .insert([
        { topic: 'Test Circle' }
      ])
      .select();
    
    if (circleError) {
      if (circleError.code === '42P01') {
        console.log('The circles table does not exist yet. Please run the SQL schema.');
      } else {
        console.error('Error creating circle:', circleError);
      }
    } else {
      console.log('Successfully created test circle:', circle);
    }

  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

// Run the test
testSupabaseConnection(); 