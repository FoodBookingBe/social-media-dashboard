'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle2, Loader2, ExternalLink } from 'lucide-react';

export function SupabaseStatus() {
  const [status, setStatus] = useState<'loading' | 'connected' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [details, setDetails] = useState<any>(null);

  useEffect(() => {
    checkSupabaseStatus();
  }, []);

  const checkSupabaseStatus = async () => {
    try {
      const response = await fetch('/api/health');
      const data = await response.json();

      if (response.ok && data.status === 'success') {
        setStatus('connected');
        setMessage('Supabase is connected and ready! 🎉');
        setDetails(data);
      } else {
        setStatus('error');
        setMessage(data.message || 'Supabase is not configured');
        setDetails(data);
      }
    } catch (error) {
      setStatus('error');
      setMessage('Could not reach health check endpoint');
      setDetails(error);
    }
  };

  if (status === 'loading') {
    return (
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-6 flex items-center space-x-3">
          <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
          <span className="text-sm text-blue-900">Checking Supabase connection...</span>
        </CardContent>
      </Card>
    );
  }

  if (status === 'error') {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <span className="text-red-900">Supabase Not Connected</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-red-800">{message}</p>
          {details?.details && (
            <details className="bg-white rounded p-3 border border-red-200">
              <summary className="cursor-pointer font-mono text-xs text-red-700">
                Error Details
              </summary>
              <pre className="mt-2 text-xs overflow-auto bg-gray-100 p-2 rounded">
                {typeof details.details === 'string' 
                  ? details.details 
                  : JSON.stringify(details.details, null, 2)}
              </pre>
            </details>
          )}
          <div className="bg-white rounded p-3 border border-red-200">
            <p className="text-xs font-semibold text-red-900 mb-2">📋 Next Steps:</p>
            <ol className="text-xs text-red-800 space-y-1 list-decimal list-inside">
              <li>Read SUPABASE_SETUP.md in your project root</li>
              <li>Create a Supabase project at https://supabase.com</li>
              <li>Get your API keys from Settings → API</li>
              <li>Add them to frontend/.env.local</li>
              <li>Execute database/schema.sql in Supabase SQL Editor</li>
              <li>Restart your dev server (npm run dev)</li>
            </ol>
          </div>
          <Button 
            onClick={checkSupabaseStatus}
            variant="outline"
            size="sm"
            className="w-full"
          >
            Retry Connection
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-green-200 bg-green-50">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
          <span className="text-green-900">Supabase Connected</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-green-800">{message}</p>
        <div className="bg-white rounded p-3 border border-green-200 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-mono text-gray-600">Database URL:</span>
            <Badge variant="secondary">{details?.url?.split('//')[1]?.split('.')[0]}</Badge>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="font-mono text-gray-600">Posts in DB:</span>
            <Badge className="bg-green-100 text-green-800">{details?.rowCount || 0}</Badge>
          </div>
        </div>
        <p className="text-xs text-green-700 font-semibold">✅ Your dashboard is ready to fetch real data!</p>
      </CardContent>
    </Card>
  );
}
