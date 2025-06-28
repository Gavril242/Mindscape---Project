import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle2, RefreshCw, Settings, ExternalLink, Shield } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { Link } from 'react-router-dom';
import ModelInfo from "@/components/ModelInfo";

const Models = () => {
  const [isCheckingGemini, setIsCheckingGemini] = useState(false);
  const [geminiStatus, setGeminiStatus] = useState<'active' | 'inactive' | 'unknown'>('active');
  const [showOllamaSetup, setShowOllamaSetup] = useState(false);

  const checkGeminiStatus = async () => {
    setIsCheckingGemini(true);
    try {
      // Simulate API check - replace with actual API call later
      await new Promise(resolve => setTimeout(resolve, 1500));
      setGeminiStatus('active');
      toast('Gemini API status checked successfully');
    } catch (error) {
      setGeminiStatus('inactive');
      toast('Failed to check Gemini API status');
    } finally {
      setIsCheckingGemini(false);
    }
  };

  const handleOllamaSetup = () => {
    setShowOllamaSetup(true);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">AI Models Configuration</h1>
          <p className="text-muted-foreground">
            Manage your AI models and view their status
          </p>
        </div>
        <Link to="/terms-and-conditions">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Terms & Conditions
          </Button>
        </Link>
      </div>

      {/* Current AI Model - Gemini */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                Gemini API
                <Badge variant="default">Currently Active</Badge>
              </CardTitle>
              <CardDescription>
                Google's advanced AI model for natural conversations and mental health support
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className={`h-3 w-3 rounded-full ${
                geminiStatus === 'active' ? 'bg-green-500' : 
                geminiStatus === 'inactive' ? 'bg-red-500' : 'bg-yellow-500'
              }`}></div>
              <span className="text-sm">
                {geminiStatus === 'active' ? 'Active' : 
                 geminiStatus === 'inactive' ? 'Inactive' : 'Unknown'}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-muted-foreground">Model Type</dt>
              <dd>Gemini Pro</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Provider</dt>
              <dd>Google AI</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Response Time</dt>
              <dd>~2-3 seconds</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Context Length</dt>
              <dd>32,768 tokens</dd>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
            <CheckCircle2 className="h-4 w-4 text-blue-600" />
            <span className="text-sm">
              This model is optimized for mental health conversations and provides empathetic, helpful responses.
            </span>
          </div>

          <Button 
            onClick={checkGeminiStatus} 
            disabled={isCheckingGemini}
            variant="outline"
            className="w-full"
          >
            {isCheckingGemini ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Checking Status...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Status
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Ollama Configuration */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                Ollama (Local AI)
                <Badge variant="outline">Not Configured</Badge>
              </CardTitle>
              <CardDescription>
                Run AI models locally on your device for enhanced privacy
              </CardDescription>
            </div>
            <Settings className="h-5 w-5 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg">
              <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-amber-800 dark:text-amber-200">Local AI Benefits:</p>
                <ul className="mt-1 text-amber-700 dark:text-amber-300 list-disc list-inside space-y-1">
                  <li>Complete privacy - data never leaves your device</li>
                  <li>No internet required after setup</li>
                  <li>Faster responses once loaded</li>
                  <li>No usage limits or costs</li>
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-muted-foreground">Status</dt>
                <dd>Not installed</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Recommended Model</dt>
                <dd>Qwen3:1.7b</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Storage Required</dt>
                <dd>~2GB</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Privacy</dt>
                <dd>100% Local</dd>
              </div>
            </div>
          </div>

          <Button 
            onClick={handleOllamaSetup} 
            className="w-full"
            variant="secondary"
          >
            Set Up Ollama
          </Button>
        </CardContent>
      </Card>

      {/* Ollama Setup Instructions */}
      {showOllamaSetup && (
        <Card>
          <CardHeader>
            <CardTitle>Ollama Setup Instructions</CardTitle>
            <CardDescription>
              Before you can use local AI models, please review our terms and conditions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg">
              <p className="text-sm font-medium mb-2">📋 Setup Requirements:</p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Review and accept our Terms and Conditions</li>
                <li>• Download and install Ollama application</li>
                <li>• Download the recommended AI model</li>
                <li>• Configure the connection in this app</li>
              </ul>
            </div>

            <div className="flex gap-2">
              <Link to="/terms-and-conditions" className="flex-1">
                <Button variant="outline" className="w-full">
                  <Shield className="h-4 w-4 mr-2" />
                  Review Terms & Conditions
                </Button>
              </Link>
              <Button 
                variant="default" 
                className="flex-1"
                onClick={() => {
                  toast('Please review Terms & Conditions first');
                }}
              >
                Continue Setup
              </Button>
            </div>

            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowOllamaSetup(false)}
              className="w-full"
            >
              Cancel Setup
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Keep existing ModelInfo component for reference */}
      <Card>
        <CardHeader>
          <CardTitle>Legacy Configuration</CardTitle>
          <CardDescription>
            Previous Ollama configuration interface (for reference)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ModelInfo />
        </CardContent>
      </Card>
    </div>
  );
};

export default Models;
