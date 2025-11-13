'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, TrendingUp, Users, MessageSquare, Heart, Share2, Eye, Loader2 } from 'lucide-react';

interface PlatformStats {
  name: string;
  icon: React.ReactNode;
  posts: number;
  engagement: number;
  growth: string;
  likes: number;
  shares: number;
  comments: number;
  views: number;
}

export default function SocialMediaOverview() {
  const [stats, setStats] = useState<PlatformStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate fetching real analytics data
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        
        // In production, this would call your Supabase API
        const mockData: PlatformStats[] = [
          {
            name: 'Instagram',
            icon: <Users className="h-4 w-4 text-pink-600" />,
            posts: 245,
            engagement: 12500,
            growth: '+18%',
            likes: 8750,
            shares: 2100,
            comments: 1650,
            views: 125000
          },
          {
            name: 'Facebook',
            icon: <MessageSquare className="h-4 w-4 text-blue-600" />,
            posts: 189,
            engagement: 8900,
            growth: '+12%',
            likes: 5340,
            shares: 1890,
            comments: 1670,
            views: 89000
          },
          {
            name: 'LinkedIn',
            icon: <TrendingUp className="h-4 w-4 text-blue-700" />,
            posts: 67,
            engagement: 2340,
            growth: '+25%',
            likes: 1470,
            shares: 560,
            comments: 310,
            views: 23400
          },
          {
            name: 'Twitter/X',
            icon: <BarChart3 className="h-4 w-4 text-gray-700" />,
            posts: 156,
            engagement: 5670,
            growth: '+8%',
            likes: 3402,
            shares: 1134,
            comments: 1134,
            views: 56700
          }
        ];

        setStats(mockData);
        setError(null);
      } catch (err) {
        setError('Kon analytics niet laden');
        console.error('Error fetching analytics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Social Media Analytics
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-40">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Social Media Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600">{error}</p>
        </CardContent>
      </Card>
    );
  }

  const totalEngagement = stats.reduce((sum, s) => sum + s.engagement, 0);
  const totalPosts = stats.reduce((sum, s) => sum + s.posts, 0);
  const avgGrowth = ((stats.reduce((sum, s) => sum + parseFloat(s.growth), 0) / stats.length).toFixed(1));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Social Media Analytics
          </div>
          <Badge variant="secondary">Live</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
            <p className="text-xs text-gray-600 mb-1">Totale Posts</p>
            <p className="text-2xl font-bold text-blue-600">{totalPosts}</p>
          </div>
          <div className="p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
            <p className="text-xs text-gray-600 mb-1">Totale Engagement</p>
            <p className="text-2xl font-bold text-green-600">{totalEngagement.toLocaleString()}</p>
          </div>
          <div className="p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
            <p className="text-xs text-gray-600 mb-1">Gem. Groei</p>
            <p className="text-2xl font-bold text-purple-600">+{avgGrowth}%</p>
          </div>
        </div>

        {/* Platform Details */}
        <div className="space-y-3">
          {stats.map((platform) => (
            <div key={platform.name} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    {platform.icon}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{platform.name}</p>
                    <p className="text-sm text-gray-600">{platform.posts} posts totaal</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-gray-900">{platform.engagement.toLocaleString()}</p>
                  <p className="text-sm font-semibold text-green-600">{platform.growth}</p>
                </div>
              </div>

              {/* Engagement Breakdown */}
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div className="p-2 bg-red-50 rounded">
                  <div className="flex items-center justify-center mb-1">
                    <Heart className="h-3 w-3 text-red-500" />
                  </div>
                  <p className="font-semibold text-gray-900">{(platform.likes / 1000).toFixed(1)}k</p>
                  <p className="text-gray-600">Likes</p>
                </div>
                <div className="p-2 bg-blue-50 rounded">
                  <div className="flex items-center justify-center mb-1">
                    <MessageSquare className="h-3 w-3 text-blue-500" />
                  </div>
                  <p className="font-semibold text-gray-900">{(platform.comments / 1000).toFixed(1)}k</p>
                  <p className="text-gray-600">Comments</p>
                </div>
                <div className="p-2 bg-green-50 rounded">
                  <div className="flex items-center justify-center mb-1">
                    <Share2 className="h-3 w-3 text-green-500" />
                  </div>
                  <p className="font-semibold text-gray-900">{(platform.shares / 1000).toFixed(1)}k</p>
                  <p className="text-gray-600">Shares</p>
                </div>
                <div className="p-2 bg-purple-50 rounded">
                  <div className="flex items-center justify-center mb-1">
                    <Eye className="h-3 w-3 text-purple-500" />
                  </div>
                  <p className="font-semibold text-gray-900">{(platform.views / 1000).toFixed(1)}k</p>
                  <p className="text-gray-600">Views</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
