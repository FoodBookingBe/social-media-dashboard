import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = !!(supabaseUrl && supabaseKey);

// Only create Supabase client if both credentials are provided
let supabaseClient: any = null;
if (isSupabaseConfigured) {
  supabaseClient = createClient(supabaseUrl, supabaseKey);
}

export const supabase = supabaseClient;

// Analytics & Engagement
export const analyticsService = {
  async getEngagementMetrics(platform: string, days: number = 7) {
    if (!supabase) throw new Error('Supabase is not configured');
    const { data, error } = await supabase
      .from('social_media_posts')
      .select('*')
      .eq('platform', platform)
      .gte('posted_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
      .order('posted_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getEngagementTrends(platform: string, days: number = 7) {
    if (!supabase) throw new Error('Supabase is not configured');
    const { data, error } = await supabase
      .from('social_media_analytics')
      .select('*')
      .eq('platform', platform)
      .gte('date', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
      .order('date', { ascending: true });

    if (error) throw error;
    return data;
  },

  async getTopPerformingContent(limit: number = 10) {
    if (!supabase) throw new Error('Supabase is not configured');
    const { data, error } = await supabase
      .from('social_media_posts')
      .select('*')
      .order('engagement_score', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  },

  async getContentPerformance() {
    if (!supabase) throw new Error('Supabase is not configured');
    const { data, error } = await supabase
      .from('content_performance')
      .select('*')
      .order('engagement_score', { ascending: false });

    if (error) throw error;
    return data;
  }
};

// Content Generation & Publishing
export const contentService = {
  async generateContent(prompt: string, platform: string) {
    if (!supabase) throw new Error('Supabase is not configured');
    const { data, error } = await supabase
      .from('ai_generated_content')
      .insert([
        {
          prompt,
          platform,
          status: 'draft',
          created_at: new Date().toISOString()
        }
      ])
      .select();

    if (error) throw error;
    return data?.[0];
  },

  async getGeneratedContent() {
    if (!supabase) throw new Error('Supabase is not configured');
    const { data, error } = await supabase
      .from('ai_generated_content')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async publishContent(contentId: string) {
    if (!supabase) throw new Error('Supabase is not configured');
    const { data, error } = await supabase
      .from('ai_generated_content')
      .update({ status: 'published', published_at: new Date().toISOString() })
      .eq('id', contentId)
      .select();

    if (error) throw error;
    return data?.[0];
  },

  async updateContentPerformance(contentId: string, performance: any) {
    if (!supabase) throw new Error('Supabase is not configured');
    const { data, error } = await supabase
      .from('ai_generated_content')
      .update(performance)
      .eq('id', contentId)
      .select();

    if (error) throw error;
    return data?.[0];
  }
};

// Alerts Management
export const alertService = {
  async getAlerts(filters?: { severity?: string; acknowledged?: boolean }) {
    if (!supabase) throw new Error('Supabase is not configured');
    let query = supabase.from('alerts').select('*');

    if (filters?.severity) {
      query = query.eq('severity', filters.severity);
    }

    if (filters?.acknowledged !== undefined) {
      query = query.eq('acknowledged', filters.acknowledged);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async createAlert(alert: any) {
    if (!supabase) throw new Error('Supabase is not configured');
    const { data, error } = await supabase
      .from('alerts')
      .insert([{ ...alert, created_at: new Date().toISOString() }])
      .select();

    if (error) throw error;
    return data?.[0];
  },

  async acknowledgeAlert(alertId: string) {
    if (!supabase) throw new Error('Supabase is not configured');
    const { data, error } = await supabase
      .from('alerts')
      .update({ acknowledged: true, acknowledged_at: new Date().toISOString() })
      .eq('id', alertId)
      .select();

    if (error) throw error;
    return data?.[0];
  },

  async deleteAlert(alertId: string) {
    if (!supabase) throw new Error('Supabase is not configured');
    const { error } = await supabase.from('alerts').delete().eq('id', alertId);
    if (error) throw error;
  }
};

// Reviews Management
export const reviewService = {
  async getReviews(filters?: { sentiment?: string; urgency?: string }) {
    if (!supabase) throw new Error('Supabase is not configured');
    let query = supabase.from('reviews').select('*');

    if (filters?.sentiment) {
      query = query.eq('sentiment', filters.sentiment);
    }

    if (filters?.urgency) {
      query = query.eq('urgency', filters.urgency);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async getCriticalReviews() {
    if (!supabase) throw new Error('Supabase is not configured');
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('sentiment', 'negative')
      .eq('urgency', 'high')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async respondToReview(reviewId: string, response: string) {
    if (!supabase) throw new Error('Supabase is not configured');
    const { data, error } = await supabase
      .from('reviews')
      .update({ response, responded_at: new Date().toISOString() })
      .eq('id', reviewId)
      .select();

    if (error) throw error;
    return data?.[0];
  }
};

// Predictive Analytics
export const predictiveService = {
  async getPredictiveModels() {
    if (!supabase) throw new Error('Supabase is not configured');
    const { data, error } = await supabase
      .from('predictive_models')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async updateModelAccuracy(modelId: string, accuracy: number) {
    if (!supabase) throw new Error('Supabase is not configured');
    const { data, error } = await supabase
      .from('predictive_models')
      .update({ accuracy, last_updated: new Date().toISOString() })
      .eq('id', modelId)
      .select();

    if (error) throw error;
    return data?.[0];
  }
};

// Real-time Subscriptions
export const subscriptions = {
  subscribeToAlerts(callback: (alerts: any) => void) {
    if (!supabase) throw new Error('Supabase is not configured');
    return supabase
      .channel('public:alerts')
      .on('*', { event: '*' }, (payload: any) => callback(payload.new))
      .subscribe();
  },

  subscribeToEngagement(callback: (metrics: any) => void) {
    if (!supabase) throw new Error('Supabase is not configured');
    return supabase
      .channel('public:engagement_metrics')
      .on('*', { event: '*' }, (payload: any) => callback(payload.new))
      .subscribe();
  }
};
