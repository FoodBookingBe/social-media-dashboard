import { NextApiRequest, NextApiResponse } from 'next';
import AIRouter from '../ai/ai-router';

const aiRouter = new AIRouter();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { taskType, content, options } = req.body;

    if (!taskType || !content) {
      return res.status(400).json({ error: 'Missing required fields: taskType and content' });
    }

    // Validate taskType
    const validTaskTypes = ['simple_text', 'content_creation', 'complex_analysis', 'strategic_planning', 'image_generation'];
    if (!validTaskTypes.includes(taskType)) {
      return res.status(400).json({
        error: 'Invalid taskType',
        validTypes: validTaskTypes
      });
    }

    const result = await aiRouter.routeTask(taskType as any, content, options);

    // Log usage (this would be handled by the router, but we can add additional logging here)
    console.log(`AI Task completed: ${taskType}, Model: ${result.model}, Tokens: ${result.usage?.total_tokens || 0}`);

    res.status(200).json(result);
  } catch (error) {
    console.error('AI API Error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
