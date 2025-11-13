import AIRouter from './ai-router';

interface ContentRequest {
  platform: string;
  topic?: string;
  tone?: string;
  brandGuidelines?: any;
  context?: any;
  maxLength?: number;
}

interface ImageRequest {
  prompt: string;
  style?: string;
  brandColors?: string[];
  size?: string;
}

class ContentAI {
  private aiRouter: AIRouter;

  constructor() {
    this.aiRouter = new AIRouter();
  }

  /**
   * Generate social media post content
   */
  async generatePost(request: ContentRequest): Promise<{
    content: string;
    hashtags: string[];
    caption: string;
    suggestedPostingTime?: string;
  }> {
    const { platform, topic, tone = 'professioneel', brandGuidelines, context, maxLength = 280 } = request;

    // Build prompt for content generation
    const prompt = this.buildContentPrompt({
      platform,
      topic,
      tone,
      brandGuidelines,
      context,
      maxLength
    });

    try {
      const response = await this.aiRouter.routeTask('content_creation', prompt);

      // Parse and structure the response
      return this.parseContentResponse(response.content, platform);
    } catch (error) {
      console.error('Error generating post content:', error);
      throw new Error('Failed to generate post content');
    }
  }

  /**
   * Generate image for social media post
   */
  async generateImage(request: ImageRequest): Promise<{
    imageUrl: string;
    altText: string;
  }> {
    const { prompt, style, brandColors, size = '1024x1024' } = request;

    // Enhance prompt with brand guidelines
    const enhancedPrompt = this.enhanceImagePrompt(prompt, style, brandColors);

    try {
      const response = await this.aiRouter.routeTask('image_generation', enhancedPrompt);

      return {
        imageUrl: response.content, // This would be the image URL from Replicate
        altText: this.generateAltText(prompt)
      };
    } catch (error) {
      console.error('Error generating image:', error);
      throw new Error('Failed to generate image');
    }
  }

  /**
   * Generate hashtags for content
   */
  async generateHashtags(content: string, platform: string, count: number = 5): Promise<string[]> {
    const prompt = `Genereer ${count} relevante hashtags voor dit ${platform} bericht. 
    Gebruik alleen hashtags die passen bij de content en doelgroep.
    Maak ze Nederlands waar mogelijk, maar gebruik ook internationale hashtags.
    
    Content: "${content}"
    
    Geef alleen de hashtags terug, gescheiden door spaties, zonder extra tekst.`;

    try {
      const response = await this.aiRouter.routeTask('simple_text', prompt);
      return this.parseHashtags(response.content);
    } catch (error) {
      console.error('Error generating hashtags:', error);
      return [];
    }
  }

  /**
   * Analyze content performance and suggest improvements
   */
  async analyzeContentPerformance(content: string, platform: string, metrics: any): Promise<{
    score: number;
    suggestions: string[];
    predictedEngagement: number;
  }> {
    const prompt = `Analyseer deze social media post en geef verbeteringssuggesties:

    Platform: ${platform}
    Content: "${content}"
    Metrics: ${JSON.stringify(metrics)}

    Geef een score van 1-10 en suggesties voor verbetering.
    Format: Score: X/10
    Suggesties:
    - Suggestie 1
    - Suggestie 2`;

    try {
      const response = await this.aiRouter.routeTask('complex_analysis', prompt);

      return {
        score: this.extractScore(response.content),
        suggestions: this.extractSuggestions(response.content),
        predictedEngagement: this.predictEngagement(content, platform)
      };
    } catch (error) {
      console.error('Error analyzing content:', error);
      return {
        score: 5,
        suggestions: ['Kon geen analyse uitvoeren'],
        predictedEngagement: 0
      };
    }
  }

  private buildContentPrompt(params: ContentRequest & { maxLength: number }): string {
    const { platform, topic, tone, brandGuidelines, context, maxLength } = params;

    return `Genereer een pakkende ${platform} post in het Nederlands.

    ${topic ? `Onderwerp: ${topic}` : ''}
    ${tone ? `Tone of voice: ${tone}` : ''}
    ${brandGuidelines ? `Merk richtlijnen: ${JSON.stringify(brandGuidelines)}` : ''}
    ${context ? `Context: ${JSON.stringify(context)}` : ''}

    Eisen:
    - Maximaal ${maxLength} karakters
    - Pakkend en engaging
    - Inclusief call-to-action waar relevant
    - Passend bij ${platform} publiek

    Geef alleen de post tekst terug, geen extra uitleg.`;
  }

  private enhanceImagePrompt(prompt: string, style?: string, brandColors?: string[]): string {
    let enhanced = prompt;

    if (style) {
      enhanced += ` in ${style} stijl`;
    }

    if (brandColors && brandColors.length > 0) {
      enhanced += ` met kleuren: ${brandColors.join(', ')}`;
    }

    // Add quality and style instructions for better results
    enhanced += ', professionele kwaliteit, geschikt voor social media, aantrekkelijk en engaging';

    return enhanced;
  }

  private parseContentResponse(content: string, platform: string): any {
    // Clean up the response
    const cleanContent = content.trim();

    // Extract hashtags if present
    const hashtagRegex = /#[a-zA-Z0-9_]+/g;
    const hashtags = cleanContent.match(hashtagRegex) || [];

    // Remove hashtags from main content for caption
    const caption = cleanContent.replace(hashtagRegex, '').trim();

    return {
      content: cleanContent,
      hashtags: hashtags,
      caption: caption,
      suggestedPostingTime: this.getOptimalPostingTime(platform)
    };
  }

  private parseHashtags(content: string): string[] {
    const hashtags = content.match(/#[a-zA-Z0-9_]+/g) || [];
    return hashtags.slice(0, 10); // Limit to 10 hashtags
  }

  private generateAltText(prompt: string): string {
    // Generate descriptive alt text for accessibility
    return `Afbeelding gegenereerd voor: ${prompt.substring(0, 100)}${prompt.length > 100 ? '...' : ''}`;
  }

  private extractScore(content: string): number {
    const scoreMatch = content.match(/Score:\s*(\d+)\/10/);
    return scoreMatch ? parseInt(scoreMatch[1]) : 5;
  }

  private extractSuggestions(content: string): string[] {
    const suggestionsSection = content.split('Suggesties:')[1];
    if (!suggestionsSection) return [];

    return suggestionsSection
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.startsWith('-'))
      .map(line => line.substring(1).trim());
  }

  private predictEngagement(content: string, platform: string): number {
    // Simple heuristic-based prediction
    let baseEngagement = 100;

    // Platform multipliers
    const platformMultipliers: Record<string, number> = {
      'instagram': 1.5,
      'facebook': 1.0,
      'linkedin': 0.8,
      'twitter': 1.2,
      'tiktok': 2.0
    };

    baseEngagement *= platformMultipliers[platform.toLowerCase()] || 1.0;

    // Content quality heuristics
    if (content.includes('?')) baseEngagement *= 1.2; // Questions increase engagement
    if (content.includes('📸') || content.includes('🎉')) baseEngagement *= 1.1; // Emojis help
    if (content.length < 50) baseEngagement *= 0.8; // Too short
    if (content.length > 200) baseEngagement *= 0.9; // Too long

    return Math.round(baseEngagement);
  }

  private getOptimalPostingTime(platform: string): string {
    // Platform-specific optimal posting times (Dutch time)
    const optimalTimes: Record<string, string> = {
      'instagram': 'Donderdag 14:00-16:00',
      'facebook': 'Woensdag 13:00-15:00',
      'linkedin': 'Dinsdag 10:00-12:00',
      'twitter': 'Donderdag 15:00-17:00',
      'tiktok': 'Zaterdag 19:00-21:00'
    };

    return optimalTimes[platform.toLowerCase()] || 'Woensdag 14:00-16:00';
  }
}

export default ContentAI;
