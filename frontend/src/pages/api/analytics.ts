import { NextApiRequest, NextApiResponse } from 'next';
import { analyticsService, alertService, reviewService, contentService } from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, query } = req;
  const endpoint = query.endpoint as string;

  try {
    // Analytics endpoints
    if (endpoint === 'analytics') {
      if (method === 'GET') {
        const { platform, days } = query;
        const metrics = await analyticsService.getEngagementMetrics(
          (platform as string) || 'instagram',
          parseInt(days as string) || 7
        );
        return res.status(200).json(metrics);
      }
    }

    // Trends endpoint
    if (endpoint === 'trends') {
      if (method === 'GET') {
        const { platform, days } = query;
        const trends = await analyticsService.getEngagementTrends(
          (platform as string) || 'instagram',
          parseInt(days as string) || 7
        );
        return res.status(200).json(trends);
      }
    }

    // Top content endpoint
    if (endpoint === 'top-content') {
      if (method === 'GET') {
        const { limit } = query;
        const content = await analyticsService.getTopPerformingContent(
          parseInt(limit as string) || 10
        );
        return res.status(200).json(content);
      }
    }

    // Alerts endpoints
    if (endpoint === 'alerts') {
      if (method === 'GET') {
        const { severity, acknowledged } = query;
        const alerts = await alertService.getAlerts({
          severity: severity as string,
          acknowledged: acknowledged === 'true'
        });
        return res.status(200).json(alerts);
      }

      if (method === 'POST') {
        const alert = await alertService.createAlert(req.body);
        return res.status(201).json(alert);
      }
    }

    // Alert acknowledge endpoint
    if (endpoint === 'alerts-acknowledge') {
      if (method === 'PUT') {
        const { alertId } = query;
        const updated = await alertService.acknowledgeAlert(alertId as string);
        return res.status(200).json(updated);
      }
    }

    // Reviews endpoints
    if (endpoint === 'reviews') {
      if (method === 'GET') {
        const { sentiment, urgency } = query;
        const reviews = await reviewService.getReviews({
          sentiment: sentiment as string,
          urgency: urgency as string
        });
        return res.status(200).json(reviews);
      }
    }

    // Critical reviews endpoint
    if (endpoint === 'critical-reviews') {
      if (method === 'GET') {
        const critical = await reviewService.getCriticalReviews();
        return res.status(200).json(critical);
      }
    }

    // Content endpoints
    if (endpoint === 'content') {
      if (method === 'GET') {
        const content = await contentService.getGeneratedContent();
        return res.status(200).json(content);
      }

      if (method === 'POST') {
        const content = await contentService.generateContent(
          req.body.prompt,
          req.body.platform
        );
        return res.status(201).json(content);
      }
    }

    // Publish content endpoint
    if (endpoint === 'content-publish') {
      if (method === 'PUT') {
        const { contentId } = query;
        const published = await contentService.publishContent(contentId as string);
        return res.status(200).json(published);
      }
    }

    return res.status(404).json({ error: 'Endpoint not found' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
