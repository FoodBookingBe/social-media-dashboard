import { NextApiRequest, NextApiResponse } from 'next';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // If Supabase not configured, return helpful message
    if (!isSupabaseConfigured || !supabase) {
      return res.status(200).json({
        status: 'not-configured',
        message: 'Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in frontend/.env.local',
        url: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'configured' : 'missing'
      });
    }

    // Test Supabase connection
    const { data, error } = await supabase
      .from('social_media_posts')
      .select('id', { count: 'exact' })
      .limit(1);

    if (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Supabase query failed',
        details: error.message
      });
    }

    // If we got here, connection is working
    return res.status(200).json({
      status: 'success',
      message: 'Supabase is connected and working!',
      url: process.env.NEXT_PUBLIC_SUPABASE_URL,
      rowCount: data?.length || 0
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Health check failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
