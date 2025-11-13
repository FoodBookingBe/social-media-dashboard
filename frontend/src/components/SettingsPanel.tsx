'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Settings, Save, Lock, Database, Zap, Globe, Palette } from 'lucide-react';

interface APIKey {
  platform: string;
  key: string;
  active: boolean;
  lastUpdated: string;
}

interface Settings {
  apiKeys: APIKey[];
  autoPublish: boolean;
  aiModel: string;
  refreshInterval: number;
  theme: 'light' | 'dark' | 'auto';
}

export default function SettingsPanel() {
  const [activeTab, setActiveTab] = useState<'api' | 'ai' | 'notifications' | 'appearance'>('api');
  const [settings, setSettings] = useState<Settings>({
    apiKeys: [
      { platform: 'Instagram', key: '••••••••••••', active: true, lastUpdated: '2024-11-10' },
      { platform: 'Facebook', key: '••••••••••••', active: true, lastUpdated: '2024-11-08' },
      { platform: 'LinkedIn', key: '••••••••••••', active: false, lastUpdated: '2024-10-15' },
      { platform: 'Twitter/X', key: '••••••••••••', active: true, lastUpdated: '2024-11-11' }
    ],
    autoPublish: false,
    aiModel: 'gpt-3.5-turbo',
    refreshInterval: 300,
    theme: 'auto'
  });
  const [newApiKey, setNewApiKey] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSaveSettings = async () => {
    setSaving(true);
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      alert('Instellingen opgeslagen!');
    }, 500);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            Dashboard Instellingen
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b">
            <button
              onClick={() => setActiveTab('api')}
              className={`px-4 py-2 font-medium border-b-2 transition ${
                activeTab === 'api'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Lock className="h-4 w-4 inline mr-2" />
              API Keys
            </button>
            <button
              onClick={() => setActiveTab('ai')}
              className={`px-4 py-2 font-medium border-b-2 transition ${
                activeTab === 'ai'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Zap className="h-4 w-4 inline mr-2" />
              AI Model
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`px-4 py-2 font-medium border-b-2 transition ${
                activeTab === 'notifications'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Database className="h-4 w-4 inline mr-2" />
              Data
            </button>
            <button
              onClick={() => setActiveTab('appearance')}
              className={`px-4 py-2 font-medium border-b-2 transition ${
                activeTab === 'appearance'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Palette className="h-4 w-4 inline mr-2" />
              Appearance
            </button>
          </div>

          {/* API Keys Tab */}
          {activeTab === 'api' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Gekoppelde Platforms</h3>
                <div className="space-y-3">
                  {settings.apiKeys.map((apiKey) => (
                    <div key={apiKey.platform} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">{apiKey.platform}</h4>
                          <p className="text-xs text-gray-500 mt-1">Bijgewerkt: {apiKey.lastUpdated}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant={apiKey.active ? 'default' : 'secondary'}>
                            {apiKey.active ? 'Actief' : 'Inactief'}
                          </Badge>
                          <Button size="sm" variant="outline">
                            Bijwerken
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Nieuw API Key toevoegen</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      API Key
                    </label>
                    <Input
                      type="password"
                      value={newApiKey}
                      onChange={(e) => setNewApiKey(e.target.value)}
                      placeholder="Plak hier je API key..."
                      className="w-full"
                    />
                  </div>
                  <Button className="w-full">
                    <Globe className="h-4 w-4 mr-2" />
                    API Key Toevoegen
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* AI Model Tab */}
          {activeTab === 'ai' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-4">AI Model Selectie</h3>
                <div className="space-y-3">
                  {['gpt-3.5-turbo', 'gpt-4', 'claude-3-sonnet', 'llama-2'].map((model) => (
                    <div key={model} className="p-4 border border-gray-200 rounded-lg hover:border-blue-400 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">{model}</h4>
                          <p className="text-xs text-gray-500 mt-1">
                            {model === 'gpt-3.5-turbo' ? 'Snel en betrouwbaar (Standaard)' : 'Alternatief model'}
                          </p>
                        </div>
                        <input
                          type="radio"
                          name="model"
                          value={model}
                          checked={settings.aiModel === model}
                          onChange={(e) => setSettings({ ...settings, aiModel: e.target.value })}
                          className="h-4 w-4"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Model Instellingen</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Data Refresh Interval (seconden)
                    </label>
                    <input
                      type="number"
                      value={settings.refreshInterval}
                      onChange={(e) => setSettings({ ...settings, refreshInterval: parseInt(e.target.value) })}
                      min={60}
                      max={3600}
                      step={60}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                    <p className="text-xs text-gray-500 mt-1">Hoe vaak data wordt opgehaald</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Data Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Data Management</h3>
                <div className="space-y-3">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Database Status</h4>
                    <p className="text-sm text-blue-800 mb-3">Supabase PostgreSQL - Gekoppeld</p>
                    <Button size="sm" variant="outline" className="w-full">
                      Verbinding Testen
                    </Button>
                  </div>

                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Data Export</h4>
                    <p className="text-sm text-gray-600 mb-3">Download je analyticsgegevens</p>
                    <Button size="sm" variant="outline" className="w-full">
                      CSV Exporteren
                    </Button>
                  </div>

                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h4 className="font-medium text-red-900 mb-2">Gevaarlijke Zone</h4>
                    <p className="text-sm text-red-800 mb-3">Verwijder alle dashboard gegevens</p>
                    <Button size="sm" variant="destructive" className="w-full">
                      Alles Wissen
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Appearance Tab */}
          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Thema</h3>
                <div className="space-y-3">
                  {['light', 'dark', 'auto'].map((theme) => (
                    <div key={theme} className="p-4 border border-gray-200 rounded-lg hover:border-blue-400">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900 capitalize">{theme} Mode</h4>
                          <p className="text-xs text-gray-500 mt-1">
                            {theme === 'auto' ? 'Volg systeem instellingen' : `${theme} thema`}
                          </p>
                        </div>
                        <input
                          type="radio"
                          name="theme"
                          value={theme}
                          checked={settings.theme === theme}
                          onChange={(e) => setSettings({ ...settings, theme: e.target.value as any })}
                          className="h-4 w-4"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Andere Opties</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.autoPublish}
                      onChange={(e) => setSettings({ ...settings, autoPublish: e.target.checked })}
                      className="h-4 w-4"
                    />
                    <div>
                      <p className="font-medium text-gray-900">Auto-publish posts</p>
                      <p className="text-xs text-gray-500">Posts automatisch publiceren op optimale tijden</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="mt-8 flex gap-3 pt-6 border-t">
            <Button
              onClick={handleSaveSettings}
              disabled={saving}
              className="flex-1"
            >
              {saving ? 'Opslaan...' : <>
                <Save className="h-4 w-4 mr-2" />
                Wijzigingen Opslaan
              </>}
            </Button>
            <Button variant="outline" className="flex-1">
              Annuleren
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
