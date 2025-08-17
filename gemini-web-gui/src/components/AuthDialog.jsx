import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Alert, AlertDescription } from '@/components/ui/alert.jsx'
import { Loader2, Key, User, Cloud } from 'lucide-react'

export function AuthDialog({ onAuthenticate, isLoading, error }) {
  const [activeTab, setActiveTab] = useState('oauth')
  const [apiKey, setApiKey] = useState('')
  const [projectId, setProjectId] = useState('')

  const handleOAuthLogin = () => {
    onAuthenticate({ type: 'oauth' })
  }

  const handleApiKeyLogin = () => {
    if (!apiKey.trim()) return
    onAuthenticate({ 
      type: 'api_key', 
      apiKey: apiKey.trim() 
    })
  }

  const handleVertexAILogin = () => {
    if (!apiKey.trim() || !projectId.trim()) return
    onAuthenticate({ 
      type: 'vertex_ai', 
      apiKey: apiKey.trim(),
      projectId: projectId.trim()
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">G</span>
          </div>
          <CardTitle className="text-2xl">Welcome to Gemini CLI</CardTitle>
          <CardDescription>
            Choose your authentication method to get started
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="oauth" className="text-xs">OAuth</TabsTrigger>
              <TabsTrigger value="api_key" className="text-xs">API Key</TabsTrigger>
              <TabsTrigger value="vertex_ai" className="text-xs">Vertex AI</TabsTrigger>
            </TabsList>
            
            <TabsContent value="oauth" className="space-y-4">
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full mx-auto">
                  <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold">Sign in with Google</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Free tier: 60 requests/min, 1,000 requests/day
                  </p>
                </div>
                <Button 
                  onClick={handleOAuthLogin}
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <User className="mr-2 h-4 w-4" />
                  )}
                  Continue with Google
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="api_key" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full mx-auto">
                  <Key className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="text-center">
                  <h3 className="font-semibold">Gemini API Key</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Free tier: 100 requests/day
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="api-key">API Key</Label>
                  <Input
                    id="api-key"
                    type="password"
                    placeholder="Enter your Gemini API key"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    disabled={isLoading}
                  />
                  <p className="text-xs text-muted-foreground">
                    Get your key from{' '}
                    <a 
                      href="https://aistudio.google.com/apikey" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Google AI Studio
                    </a>
                  </p>
                </div>
                <Button 
                  onClick={handleApiKeyLogin}
                  disabled={isLoading || !apiKey.trim()}
                  className="w-full"
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Key className="mr-2 h-4 w-4" />
                  )}
                  Connect with API Key
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="vertex_ai" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full mx-auto">
                  <Cloud className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="text-center">
                  <h3 className="font-semibold">Vertex AI</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Enterprise features with scalable limits
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="vertex-key">API Key</Label>
                    <Input
                      id="vertex-key"
                      type="password"
                      placeholder="Enter your Vertex AI API key"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="project-id">Project ID</Label>
                    <Input
                      id="project-id"
                      placeholder="Enter your Google Cloud Project ID"
                      value={projectId}
                      onChange={(e) => setProjectId(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Get your credentials from{' '}
                    <a 
                      href="https://console.cloud.google.com/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Google Cloud Console
                    </a>
                  </p>
                </div>
                <Button 
                  onClick={handleVertexAILogin}
                  disabled={isLoading || !apiKey.trim() || !projectId.trim()}
                  className="w-full"
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Cloud className="mr-2 h-4 w-4" />
                  )}
                  Connect with Vertex AI
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

