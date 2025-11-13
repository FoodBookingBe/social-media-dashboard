'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  MessageSquare,
  TrendingUp,
  Heart,
  AlertTriangle,
  Brain,
  Target
} from 'lucide-react';

interface DashboardData {
  totalPosts: number;
  totalEngagement: number;
  avgSentiment: number;
  activeAlerts: number;
  aiGeneratedContent: number;
  topPerformingPost: any;
}

interface KPICardsProps {
  data: DashboardData;
}

export default function KPICards({ data }: KPICardsProps) {
  const kpiCards = [
    {
      title: 'Totaal Posts',
      value: data.totalPosts.toLocaleString(),
      change: '+12%',
      changeType: 'positive' as const,
      icon: MessageSquare,
      description: 'Social media posts afgelopen maand'
    },
    {
      title: 'Totale Engagement',
      value: data.totalEngagement.toLocaleString(),
      change: '+8%',
      changeType: 'positive' as const,
      icon: Heart,
      description: 'Likes, shares en comments'
    },
    {
      title: 'Gemiddelde Sentiment',
      value: `${(data.avgSentiment * 100).toFixed(1)}%`,
      change: '+5%',
      changeType: 'positive' as const,
      icon: TrendingUp,
      description: 'Positieve sentiment score'
    },
    {
      title: 'AI Content',
      value: data.aiGeneratedContent.toString(),
      change: '+15%',
      changeType: 'positive' as const,
      icon: Brain,
      description: 'Automatisch gegenereerde posts'
    },
    {
      title: 'Actieve Alerts',
      value: data.activeAlerts.toString(),
      change: data.activeAlerts > 0 ? 'Actie nodig' : 'Alles OK',
      changeType: data.activeAlerts > 0 ? 'warning' as const : 'positive' as const,
      icon: AlertTriangle,
      description: 'Reviews en problemen om aandacht'
    },
    {
      title: 'Top Post',
      value: data.topPerformingPost?.engagement?.toLocaleString() || '0',
      change: data.topPerformingPost?.platform || 'Instagram',
      changeType: 'neutral' as const,
      icon: Target,
      description: 'Hoogste engagement deze week'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
      {kpiCards.map((kpi, index) => {
        const Icon = kpi.icon;
        return (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {kpi.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {kpi.value}
              </div>
              <div className="flex items-center justify-between mt-2">
                <p className={`text-xs ${
                  kpi.changeType === 'positive' ? 'text-green-600' :
                  kpi.changeType === 'warning' ? 'text-yellow-600' :
                  'text-gray-600'
                }`}>
                  {kpi.change}
                </p>
                <p className="text-xs text-gray-500">
                  {kpi.description}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
