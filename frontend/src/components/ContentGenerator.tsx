'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Brain, Sparkles, Image, MessageSquare, Loader2, Copy, Check, AlertCircle } from 'lucide-react';

interface GeneratedContent {
  content: string;
  hashtags: string[];
  caption: string;
  suggestedPostingTime: string;
  model: string;
  usage?: {
    total_tokens: number;
  };
}

export default function ContentGenerator() {
  const [selectedPlatform, setSelectedPlatform] = useState('instagram');
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const generateContent = async () => {
    if (!topic.trim()) {
      setError('Voer een onderwerp in');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedContent(null);

    try {
      // Use the frontend API endpoint that has mock data
      const response = await fetch('/api/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'generate_post',
          platform: selectedPlatform,
          topic: topic,
          tone: 'professioneel'
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      // Extract content, hashtags, and timing
      const content = data.content || data.caption;
      const hashtags = data.hashtags || extractHashtags(content);
      const suggestedTime = data.suggestedPostingTime || getSuggestedPostingTime(selectedPlatform);

      setGeneratedContent({
        content: content.replace(/#\w+/g, '').trim(), // Remove hashtags from main content
        hashtags,
        caption: content,
        suggestedPostingTime: suggestedTime,
        model: data.model || 'Mock AI',
        usage: data.usage
      });
    } catch (err) {
      console.error('Error generating content:', err);
      setError(err instanceof Error ? err.message : 'Er is een fout opgetreden bij het genereren van content');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateImage = async () => {
    if (!topic.trim()) {
      setError('Voer een onderwerp in voor de afbeelding');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'generate_image',
          platform: selectedPlatform,
          prompt: `Genereer een afbeelding voor ${selectedPlatform} over: ${topic}`
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      // Handle image generation response
      console.log('Image generated:', data);
      setError('✅ Afbeelding gegenereerd! (Dit is een demo-versie)');
    } catch (err) {
      console.error('Error generating image:', err);
      setError(err instanceof Error ? err.message : 'Er is een fout opgetreden bij het genereren van de afbeelding');
    } finally {
      setIsGenerating(false);
    }
  };

  const extractHashtags = (content: string): string[] => {
    const hashtagRegex = /#[\w]+/g;
    const matches = content.match(hashtagRegex);
    return matches || [];
  };

  const getSuggestedPostingTime = (platform: string): string => {
    const times = {
      instagram: 'Dinsdag 11:00-13:00 of Donderdag 14:00-16:00',
      facebook: 'Woensdag 13:00-15:00 of Vrijdag 10:00-12:00',
      linkedin: 'Dinsdag 8:00-10:00 of Donderdag 12:00-14:00',
      twitter: 'Maandag-Vrijdag 9:00-11:00 of 15:00-17:00'
    };
    return times[platform as keyof typeof times] || 'Dagelijks tussen 10:00-16:00';
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const platforms = [
    { id: 'instagram', name: 'Instagram', icon: '📸' },
    { id: 'facebook', name: 'Facebook', icon: '👥' },
    { id: 'linkedin', name: 'LinkedIn', icon: '💼' },
    { id: 'twitter', name: 'Twitter', icon: '🐦' }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="h-5 w-5 mr-2" />
            AI Content Generator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Platform Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kies Platform
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {platforms.map((platform) => (
                  <button
                    key={platform.id}
                    onClick={() => setSelectedPlatform(platform.id)}
                    className={`p-3 border rounded-lg text-center transition-all hover:shadow-md ${
                      selectedPlatform === platform.id
                        ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="text-2xl mb-1">{platform.icon}</div>
                    <div className="text-sm font-medium">{platform.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Topic Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Onderwerp
              </label>
              <Input
                type="text"
                value={topic}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTopic(e.target.value)}
                placeholder="Bijv: nieuwe lente collectie, team uitbreiding, duurzaamheid..."
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={generateContent}
                disabled={isGenerating}
                className="flex items-center justify-center"
              >
                {isGenerating ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4 mr-2" />
                )}
                {isGenerating ? 'Genereren...' : 'Genereer Post'}
              </Button>
              <Button
                variant="outline"
                onClick={generateImage}
                disabled={isGenerating}
                className="flex items-center justify-center"
              >
                {isGenerating ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Image className="h-4 w-4 mr-2" />
                )}
                {isGenerating ? 'Genereren...' : 'Genereer Afbeelding'}
              </Button>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {generatedContent && (
              <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center">
                    <MessageSquare className="h-5 w-5 text-blue-600 mr-2" />
                    <span className="text-sm font-medium text-blue-900">Gegenereerde Content</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="text-xs">
                      {generatedContent.model}
                    </Badge>
                    {generatedContent.usage && (
                      <span className="text-xs text-gray-500">
                        {generatedContent.usage.total_tokens} tokens
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <Textarea
                    value={generatedContent.content}
                    readOnly
                    className="min-h-[80px] bg-white border-gray-200"
                  />

                  {generatedContent.hashtags.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-gray-700 mb-1">Hashtags:</p>
                      <div className="flex flex-wrap gap-1">
                        {generatedContent.hashtags.map((hashtag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {hashtag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="text-xs text-gray-600">
                    <strong>Optimaal posting tijd:</strong> {generatedContent.suggestedPostingTime}
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(generatedContent.content)}
                      className="flex items-center"
                    >
                      {copied ? (
                        <Check className="h-3 w-3 mr-1" />
                      ) : (
                        <Copy className="h-3 w-3 mr-1" />
                      )}
                      {copied ? 'Gekopieerd!' : 'Kopieer'}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(`${generatedContent.content}\n\n${generatedContent.hashtags.join(' ')}`)}
                    >
                      Kopieer met Hashtags
                    </Button>
                    <Button size="sm" variant="default">
                      Publiceer
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recente AI Content</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700">"Onze koffie is niet alleen heerlijk, maar ook fairtrade! ☕ #Kwaliteit #Duurzaam"</p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs text-gray-500">Instagram • 2 uur geleden</span>
                <span className="text-xs text-green-600">156 likes</span>
              </div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700">"Team uitbreiding! Welkom bij ons nieuwe talent 👋 #Teamwork #Groei"</p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs text-gray-500">LinkedIn • 1 dag geleden</span>
                <span className="text-xs text-green-600">89 likes</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
