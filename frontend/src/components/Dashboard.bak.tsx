'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  BarChart3,
  TrendingUp,
  MessageSquare,
  Users,
  AlertTriangle,
  Zap,
  Brain,
  Target,
  Calendar,
  Settings,
  Moon,
  Sun,
  Monitor
} from 'lucide-react';
// Theme hook removed for now
import KPICards from './KPICards';
import SocialMediaOverview from './SocialMediaOverview';
import ContentGenerator from './ContentGenerator';
import AlertsPanel from './AlertsPanel';
import PredictiveInsights from './PredictiveInsights';
import SettingsPanel from './SettingsPanel';
import AnalyticsPanel from './AnalyticsPanel';

interface DashboardData {
  totalPosts: number;
  totalEngagement: number;
  avgSentiment: number;
  activeAlerts: number;
  aiGeneratedContent: number;
  topPerformingPost: any;
}

const defaultDashboardData: DashboardData = {
  totalPosts: 1247,
  totalEngagement: 45632,
  avgSentiment: 0.73,
  activeAlerts: 3,
  aiGeneratedContent: 89,
  topPerformingPost: {
    content: "Onze nieuwe lente collectie is gearriveerd! 🌸 #Fashion #Spring",
    engagement: 1250,
    platform: "Instagram"
  }
};

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white'} shadow-sm border-b`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Brain className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold">
                  🚀 Super Slim AI Marketing Dashboard
                </h1>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Autonoom AI-gedreven marketing management
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="flex items-center">
                <Zap className="h-4 w-4 mr-1" />
                AI Actief
              </Badge>

              {/* Theme Toggle */}
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowThemeMenu(!showThemeMenu)}
                  className="relative"
                >
                  {theme === 'light' ? (
                    <Sun className="h-4 w-4" />
                  ) : theme === 'dark' ? (
                    <Moon className="h-4 w-4" />
                  ) : (
                    <Monitor className="h-4 w-4" />
                  )}
                </Button>

                {showThemeMenu && (
                  <div className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg z-50 ${
                    isDark ? 'bg-gray-700' : 'bg-white'
                  } border`}>
                    <button
                      onClick={() => {
                        setTheme('light');
                        setShowThemeMenu(false);
                      }}
                      className={`w-full text-left px-4 py-2 flex items-center gap-2 hover:bg-blue-50 ${
                        theme === 'light' ? 'bg-blue-100 text-blue-700' : ''
                      } rounded-t-lg`}
                    >
                      <Sun className="h-4 w-4" /> Light Mode
                    </button>
                    <button
                      onClick={() => {
                        setTheme('dark');
                        setShowThemeMenu(false);
                      }}
                      className={`w-full text-left px-4 py-2 flex items-center gap-2 hover:bg-gray-700 ${
                        theme === 'dark' ? 'bg-gray-600' : ''
                      }`}
                    >
                      <Moon className="h-4 w-4" /> Dark Mode
                    </button>
                    <button
                      onClick={() => {
                        setTheme('auto');
                        setShowThemeMenu(false);
                      }}
                      className={`w-full text-left px-4 py-2 flex items-center gap-2 hover:bg-gray-700 ${
                        theme === 'auto' ? 'bg-gray-600' : ''
                      } rounded-b-lg`}
                    >
                      <Monitor className="h-4 w-4" /> Auto
                    </button>
                  </div>
                )}
              </div>

              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Instellingen
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KPI Cards */}
        <KPICards data={defaultDashboardData} />

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="overview" className="mt-8">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overzicht</TabsTrigger>
            <TabsTrigger value="content">Content AI</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="settings">Instellingen</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SocialMediaOverview />
              <PredictiveInsights />
            </div>
          </TabsContent>

          <TabsContent value="content" className="mt-6">
            <ContentGenerator />
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <AnalyticsPanel />
          </TabsContent>

          <TabsContent value="alerts" className="mt-6">
            <AlertsPanel />
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <SettingsPanel />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
