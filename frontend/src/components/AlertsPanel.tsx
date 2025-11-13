'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, MessageSquare, Star, TrendingDown, Bell, CheckCircle2, Loader2 } from 'lucide-react';

interface Alert {
  id: number;
  type: 'negative_review' | 'engagement_drop' | 'opportunity' | 'engagement_spike' | 'crisis';
  severity: 'high' | 'medium' | 'low';
  title: string;
  message: string;
  time: string;
  platform: string;
  icon: React.ComponentType<any>;
  color: 'red' | 'yellow' | 'blue' | 'green' | 'purple';
  actionable: boolean;
  acknowledged: boolean;
}

export default function AlertsPanel() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'critical'>('all');
  const [acknowledgingId, setAcknowledgingId] = useState<number | null>(null);

  useEffect(() => {
    // Simulate fetching alerts from backend
    setTimeout(() => {
      const mockAlerts: Alert[] = [
        {
          id: 1,
          type: 'negative_review',
          severity: 'high',
          title: 'Kritieke review ontvangen',
          message: 'Klant klaagt over service kwaliteit - AI adviseert snelle reactie',
          time: '32 minuten geleden',
          platform: 'Google Reviews',
          icon: Star,
          color: 'red',
          actionable: true,
          acknowledged: false
        },
        {
          id: 2,
          type: 'engagement_spike',
          severity: 'low',
          title: 'Engagement spike gedetecteerd! 🎉',
          message: 'Post 12% hoger engagement dan verwacht - momentum behouden!',
          time: '1 uur geleden',
          platform: 'Instagram',
          icon: TrendingDown,
          color: 'green',
          actionable: false,
          acknowledged: true
        },
        {
          id: 3,
          type: 'engagement_drop',
          severity: 'medium',
          title: 'Engagement daling waarschuwing',
          message: 'Instagram engagement 18% lager dan gemiddeld deze week',
          time: '2 uur geleden',
          platform: 'Instagram',
          icon: TrendingDown,
          color: 'yellow',
          actionable: true,
          acknowledged: false
        },
        {
          id: 4,
          type: 'opportunity',
          severity: 'low',
          title: 'Content opportunity geïdentificeerd',
          message: 'Trending topic #Duurzaamheid kans - AI kan content genereren',
          time: '3 uur geleden',
          platform: 'Twitter/X',
          icon: MessageSquare,
          color: 'blue',
          actionable: true,
          acknowledged: false
        },
        {
          id: 5,
          type: 'crisis',
          severity: 'high',
          title: 'Mogelijke crisis-situatie',
          message: 'Negatief sentiment surge in comments - AI adviseert escalatie',
          time: '4 uur geleden',
          platform: 'Facebook',
          icon: AlertTriangle,
          color: 'purple',
          actionable: true,
          acknowledged: false
        }
      ];
      setAlerts(mockAlerts);
      setLoading(false);
    }, 500);
  }, []);

  const handleAcknowledge = async (alertId: number) => {
    setAcknowledgingId(alertId);
    
    // Simulate API call
    setTimeout(() => {
      setAlerts(alerts.map(alert =>
        alert.id === alertId ? { ...alert, acknowledged: true } : alert
      ));
      setAcknowledgingId(null);
    }, 300);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'secondary';
    }
  };

  const getFilteredAlerts = () => {
    if (filter === 'critical') {
      return alerts.filter(a => a.severity === 'high');
    }
    if (filter === 'unread') {
      return alerts.filter(a => !a.acknowledged);
    }
    return alerts;
  };

  const filteredAlerts = getFilteredAlerts();
  const unreadCount = alerts.filter(a => !a.acknowledged).length;
  const criticalCount = alerts.filter(a => a.severity === 'high').length;

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Actieve Alerts
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-40">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Bell className="h-5 w-5 mr-2" />
            Actieve Alerts
            {unreadCount > 0 && (
              <Badge className="ml-2 bg-red-100 text-red-700">
                {unreadCount} ongelezen
              </Badge>
            )}
          </CardTitle>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 text-sm rounded ${
              filter === 'all' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Alle ({alerts.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-3 py-1 text-sm rounded ${
              filter === 'unread' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Ongelezen ({unreadCount})
          </button>
          <button
            onClick={() => setFilter('critical')}
            className={`px-3 py-1 text-sm rounded ${
              filter === 'critical' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Kritiek ({criticalCount})
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {filteredAlerts.length > 0 ? (
            filteredAlerts.map((alert) => {
              const Icon = alert.icon;
              return (
                <div
                  key={alert.id}
                  className={`p-4 border-l-4 rounded-lg transition ${
                    alert.acknowledged ? 'opacity-60 bg-gray-50 border-l-gray-300' : 'bg-white border-l-red-500 hover:shadow-md'
                  } ${
                    alert.color === 'red' ? 'border-l-red-500' :
                    alert.color === 'yellow' ? 'border-l-yellow-500' :
                    alert.color === 'green' ? 'border-l-green-500' :
                    alert.color === 'blue' ? 'border-l-blue-500' : 'border-l-purple-500'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      alert.color === 'red' ? 'bg-red-100' :
                      alert.color === 'yellow' ? 'bg-yellow-100' :
                      alert.color === 'green' ? 'bg-green-100' :
                      alert.color === 'blue' ? 'bg-blue-100' : 'bg-purple-100'
                    }`}>
                      <Icon className={`h-5 w-5 ${
                        alert.color === 'red' ? 'text-red-600' :
                        alert.color === 'yellow' ? 'text-yellow-600' :
                        alert.color === 'green' ? 'text-green-600' :
                        alert.color === 'blue' ? 'text-blue-600' : 'text-purple-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900">{alert.title}</h4>
                        <Badge variant={getSeverityColor(alert.severity) as any}>
                          {alert.severity}
                        </Badge>
                        {alert.acknowledged && (
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{alert.message}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="font-medium">{alert.platform}</span>
                          <span>{alert.time}</span>
                        </div>
                        {!alert.acknowledged && alert.actionable && (
                          <button
                            onClick={() => handleAcknowledge(alert.id)}
                            disabled={acknowledgingId === alert.id}
                            className="px-3 py-1 text-xs bg-blue-50 text-blue-600 rounded hover:bg-blue-100 disabled:opacity-50"
                          >
                            {acknowledgingId === alert.id ? 'Verwerking...' : 'Markeer als gelezen'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-gray-500">
              <CheckCircle2 className="mx-auto h-12 w-12 text-gray-300 mb-2" />
              <p className="text-sm">
                {filter === 'all' ? 'Geen alerts' : 'Geen alerts in deze categorie'}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
