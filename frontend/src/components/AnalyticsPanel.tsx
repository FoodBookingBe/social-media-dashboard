'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, LineChart, PieChart, TrendingUp, Calendar, Users, Eye, MessageSquare } from 'lucide-react';

interface EngagementData {
  date: string;
  instagram: number;
  facebook: number;
  linkedin: number;
  twitter: number;
}

export default function AnalyticsPanel() {
  const [timeRange, setTimeRange] = useState('7d');

  // Mock engagement trend data
  const engagementData: EngagementData[] = [
    { date: 'Ma', instagram: 1200, facebook: 890, linkedin: 340, twitter: 560 },
    { date: 'Di', instagram: 1900, facebook: 1200, linkedin: 450, twitter: 680 },
    { date: 'Wo', instagram: 1500, facebook: 980, linkedin: 380, twitter: 520 },
    { date: 'Do', instagram: 2200, facebook: 1400, linkedin: 520, twitter: 780 },
    { date: 'Vr', instagram: 2800, facebook: 1600, linkedin: 680, twitter: 950 },
    { date: 'Za', instagram: 3100, facebook: 1900, linkedin: 450, twitter: 1100 },
    { date: 'Zo', instagram: 2400, facebook: 1500, linkedin: 380, twitter: 820 }
  ];

  // Platform performance summary
  const platformStats = [
    {
      name: 'Instagram',
      color: 'pink',
      totalEngagement: 15800,
      growth: '+22%',
      topMetric: 'Likes: 12,500',
      icon: Users
    },
    {
      name: 'Facebook',
      color: 'blue',
      totalEngagement: 10070,
      growth: '+15%',
      topMetric: 'Shares: 1,890',
      icon: MessageSquare
    },
    {
      name: 'LinkedIn',
      color: 'indigo',
      totalEngagement: 3360,
      growth: '+18%',
      topMetric: 'Views: 8,500',
      icon: Eye
    },
    {
      name: 'Twitter/X',
      color: 'gray',
      totalEngagement: 5410,
      growth: '+12%',
      topMetric: 'Retweets: 890',
      icon: TrendingUp
    }
  ];

  // Content performance
  const topContent = [
    {
      title: 'Product Launch Announcement',
      platform: 'Instagram',
      engagement: 2845,
      reach: 45320,
      sentiment: 'positive',
      date: '2 days ago'
    },
    {
      title: 'Behind the Scenes Video',
      platform: 'Instagram',
      engagement: 2134,
      reach: 38900,
      sentiment: 'positive',
      date: '3 days ago'
    },
    {
      title: 'Customer Testimonial',
      platform: 'LinkedIn',
      engagement: 890,
      reach: 12340,
      sentiment: 'positive',
      date: '5 days ago'
    },
    {
      title: 'Sustainability Initiative',
      platform: 'Facebook',
      engagement: 1560,
      reach: 28900,
      sentiment: 'very positive',
      date: '1 week ago'
    }
  ];

  const sentimentColors = {
    positive: 'text-green-600 bg-green-50',
    'very positive': 'text-emerald-600 bg-emerald-50',
    negative: 'text-red-600 bg-red-50',
    neutral: 'text-gray-600 bg-gray-50'
  };

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex gap-2">
        {['24h', '7d', '30d', '90d'].map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`px-3 py-1 rounded text-sm font-medium transition ${
              timeRange === range
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {range === '24h' ? '24 uur' : range === '7d' ? '7 dagen' : range === '30d' ? '30 dagen' : '90 dagen'}
          </button>
        ))}
      </div>

      {/* Platform Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {platformStats.map((platform) => {
          const Icon = platform.icon;
          return (
            <Card key={platform.name}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold">{platform.name}</CardTitle>
                  <Icon className="h-4 w-4 text-gray-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{platform.totalEngagement.toLocaleString()}</p>
                    <p className="text-xs text-gray-600 mt-1">Total Engagement</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-green-600">{platform.growth}</span>
                    <span className="text-xs text-gray-500">{platform.topMetric}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Engagement Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <LineChart className="h-5 w-5 mr-2" />
            Engagement Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Simple Bar Chart Representation */}
            {engagementData.map((day) => (
              <div key={day.date}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{day.date}</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {(day.instagram + day.facebook + day.linkedin + day.twitter).toLocaleString()}
                  </span>
                </div>
                <div className="flex gap-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="bg-pink-500"
                    style={{
                      width: `${(day.instagram / (day.instagram + day.facebook + day.linkedin + day.twitter)) * 100}%`
                    }}
                    title="Instagram"
                  ></div>
                  <div
                    className="bg-blue-500"
                    style={{
                      width: `${(day.facebook / (day.instagram + day.facebook + day.linkedin + day.twitter)) * 100}%`
                    }}
                    title="Facebook"
                  ></div>
                  <div
                    className="bg-indigo-500"
                    style={{
                      width: `${(day.linkedin / (day.instagram + day.facebook + day.linkedin + day.twitter)) * 100}%`
                    }}
                    title="LinkedIn"
                  ></div>
                  <div
                    className="bg-gray-500"
                    style={{
                      width: `${(day.twitter / (day.instagram + day.facebook + day.linkedin + day.twitter)) * 100}%`
                    }}
                    title="Twitter"
                  ></div>
                </div>
              </div>
            ))}

            <div className="flex gap-4 mt-6 pt-4 border-t">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-pink-500"></div>
                <span className="text-xs text-gray-600">Instagram</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-xs text-gray-600">Facebook</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                <span className="text-xs text-gray-600">LinkedIn</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                <span className="text-xs text-gray-600">Twitter</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Performing Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Top Performing Content
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topContent.map((content, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900">{content.title}</h4>
                    <p className="text-xs text-gray-600 mt-1">{content.platform} • {content.date}</p>
                  </div>
                  <Badge className={sentimentColors[content.sentiment as keyof typeof sentimentColors]}>
                    {content.sentiment}
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Engagement</p>
                    <p className="font-semibold text-gray-900">{content.engagement.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Reach</p>
                    <p className="font-semibold text-gray-900">{(content.reach / 1000).toFixed(1)}k</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Engagement Rate</p>
                    <p className="font-semibold text-gray-900">
                      {((content.engagement / content.reach) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
