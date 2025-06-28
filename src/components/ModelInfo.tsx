import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle2, Copy, ExternalLink } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
const ModelInfo = () => {
  const [isOllamaRunning, setIsOllamaRunning] = useState<boolean | null>(null);
  const [isModelLoaded, setIsModelLoaded] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const checkOllamaStatus = async () => {
    try {
      setIsChecking(true);

      // Check if Ollama is running
      const response = await fetch('http://localhost:11434/api/tags', {
        method: 'GET'
      });
      if (!response.ok) {
        setIsOllamaRunning(false);
        setIsModelLoaded(false);
        return;
      }
      setIsOllamaRunning(true);

      // Check if the model is loaded
      const data = await response.json();
      const hasQwen = data.models?.some((model: any) => model.name.toLowerCase().includes('qwen'));
      setIsModelLoaded(hasQwen);
    } catch (error) {
      console.error('Error checking Ollama status:', error);
      setIsOllamaRunning(false);
      setIsModelLoaded(false);
    } finally {
      setIsChecking(false);
    }
  };
  useEffect(() => {
    checkOllamaStatus();
  }, []);
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast('Command copied to clipboard');
  };
  return <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>AI Engine</CardTitle>
              <CardDescription>
                A lightweight language model for local AI applications
              </CardDescription>
            </div>
            <Badge variant={isModelLoaded ? "default" : "outline"}>
              {isModelLoaded ? "Installed" : "Not Installed"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-medium">Model Status</h3>
            
            <div className="flex items-center gap-2">
              <div className={`h-3 w-3 rounded-full ${isOllamaRunning ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span>{isOllamaRunning ? 'Ollama is running' : 'Ollama is not running'}</span>
            </div>
            
            {isModelLoaded !== null && <div className="flex items-center gap-2">
                {isModelLoaded ? <>
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>Qwen3:1.7b is installed and ready</span>
                  </> : <>
                    <AlertCircle className="h-4 w-4 text-amber-500" />
                    <span>Qwen3:1.7b is not installed</span>
                  </>}
              </div>}
          </div>
          
          <div className="space-y-2">
            <h3 className="font-medium">Model Details</h3>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <dt className="text-muted-foreground">Size</dt>
              <dd>1.7 billion parameters</dd>
              
              <dt className="text-muted-foreground">Developer</dt>
              <dd>Alibaba Cloud</dd>
              
              <dt className="text-muted-foreground">Context Length</dt>
              <dd>8,192 tokens</dd>
              
              <dt className="text-muted-foreground">License</dt>
              <dd>Commercial use allowed</dd>
            </dl>
          </div>
          
          {!isOllamaRunning && <div className="space-y-2 bg-muted p-3 rounded-md">
              <h3 className="font-medium">Installation Instructions</h3>
              <ol className="space-y-2 text-sm pl-5 list-decimal">
                <li>
                  <a href="https://ollama.com/download" target="_blank" rel="noopener noreferrer" className="text-primary flex items-center gap-1">
                    Download and install Ollama <ExternalLink className="h-3 w-3" />
                  </a>
                </li>
                <li>Run Ollama from your applications folder or start menu</li>
                <li>
                  <div className="flex items-center justify-between mt-1 bg-background border rounded p-2">
                    <code className="text-xs">ollama pull qwen3:1.7b</code>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard('ollama pull qwen3:1.7b')}>
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </li>
              </ol>
            </div>}
          
          {!isModelLoaded && isOllamaRunning && <div className="space-y-2 bg-muted p-3 rounded-md">
              <h3 className="font-medium">Installation Instructions</h3>
              <p className="text-sm">Run this command in your terminal to pull the model:</p>
              <div className="flex items-center justify-between mt-1 bg-background border rounded p-2">
                <code className="text-xs">ollama pull qwen3:1.7b</code>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard('ollama pull qwen3:1.7b')}>
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>}
        </CardContent>
      </Card>

      <Button onClick={checkOllamaStatus} variant="outline" disabled={isChecking} className="w-full">
        {isChecking ? 'Checking Status...' : 'Refresh Status'}
      </Button>
    </div>;
};
export default ModelInfo;