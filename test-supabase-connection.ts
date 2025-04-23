import { supabase } from './turf-app/lib/supabase/client';

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