import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabase/client';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get user IDs from query params (comma-separated list)
  const { ids } = req.query;
  
  if (!ids) {
    // If no IDs specified, fetch a limited number of users
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .limit(20);

      if (error) {
        throw error;
      }

      return res.status(200).json({ data });
    } catch (error) {
      console.error('Error fetching users:', error);
      return res.status(500).json({ error: 'Failed to fetch users' });
    }
  }
  
  // Parse the comma-separated list of user IDs
  const userIds = typeof ids === 'string' ? ids.split(',') : Array.isArray(ids) ? ids : [];

  if (userIds.length === 0) {
    return res.status(400).json({ error: 'Invalid user IDs format' });
  }

  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .in('id', userIds);

    if (error) {
      throw error;
    }

    // Create a map of user data indexed by ID for easy access
    const usersMap = data.reduce((acc: Record<string, any>, user) => {
      acc[user.id] = user;
      return acc;
    }, {});

    return res.status(200).json({ data: usersMap });
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ error: 'Failed to fetch users' });
  }
} 