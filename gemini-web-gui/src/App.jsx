import { useState, useEffect } from 'react'
import { Header } from './components/Header.jsx'
import { Sidebar } from './components/Sidebar.jsx'
import { ChatArea } from './components/ChatArea.jsx'
import { InputArea } from './components/InputArea.jsx'
import { AuthDialog } from './components/AuthDialog.jsx'
import { apiService } from './services/api.js'
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [authError, setAuthError] = useState('')
  const [user, setUser] = useState(null)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [messages, setMessages] = useState([])
  const [isTyping, setIsTyping] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  // Initialize theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const shouldUseDark = savedTheme === 'dark' || (!savedTheme && prefersDark)
    
    setIsDarkMode(shouldUseDark)
    document.documentElement.classList.toggle('dark', shouldUseDark)
  }, [])

  // Check for existing authentication
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await apiService.getStatus()
        if (response.authenticated && response.user) {
          setUser(response.user)
          setIsAuthenticated(true)
          // Add welcome message
          setMessages([
            {
              role: 'system',
              content: 'Session started'
            },
            {
              role: 'assistant',
              content: `Welcome back! I'm ready to help you with coding, analysis, and any questions you might have. You can:

• Ask me questions about programming, writing, or general topics
• Upload files for analysis using the paperclip icon
• Use slash commands like /help, /search, /code
• Browse and select files from the sidebar

What would you like to work on today?`,
              timestamp: new Date()
            }
          ])
        }
      } catch (error) {
        console.error('Failed to check auth status:', error)
      }
    }
    
    checkAuth()
  }, [])

  const handleAuthenticate = async (authData) => {
    setIsLoading(true)
    setAuthError('')

    try {
      const response = await apiService.authenticate(authData)
      
      if (response.success) {
        setUser(response.user)
        setIsAuthenticated(true)
        setMessages([
          {
            role: 'system',
            content: 'Session started'
          },
          {
            role: 'assistant',
            content: `Hello! I'm Gemini, your AI assistant. I'm here to help you with:

**Programming & Development:**
• Code review and debugging
• Writing new code in any language
• Explaining complex algorithms
• Architecture and design patterns

**File Analysis:**
• Upload documents, images, or code files
• Get insights and summaries
• Code analysis and suggestions

**General Assistance:**
• Answer questions on any topic
• Help with writing and research
• Problem-solving and brainstorming

**Commands:**
• Type "/" to see available slash commands
• Use /help for detailed command information
• Try /search to find information online

What would you like to explore first?`,
            timestamp: new Date()
          }
        ])
      } else {
        setAuthError(response.error || 'Authentication failed')
      }
    } catch (error) {
      setAuthError(error.message || 'Authentication failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await apiService.logout()
      setIsAuthenticated(false)
      setUser(null)
      setMessages([])
    } catch (error) {
      console.error('Logout failed:', error)
      // Force logout even if API call fails
      setIsAuthenticated(false)
      setUser(null)
      setMessages([])
    }
  }

  const handleThemeToggle = () => {
    const newTheme = !isDarkMode
    setIsDarkMode(newTheme)
    document.documentElement.classList.toggle('dark', newTheme)
    localStorage.setItem('theme', newTheme ? 'dark' : 'light')
  }

  const handleSendMessage = async (messageData) => {
    const userMessage = {
      role: 'user',
      content: messageData.content,
      files: messageData.files,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setIsTyping(true)

    try {
      // Upload files if any
      const uploadedFiles = []
      if (messageData.files && messageData.files.length > 0) {
        for (const file of messageData.files) {
          try {
            const uploadResponse = await apiService.uploadFile(file)
            if (uploadResponse.success) {
              uploadedFiles.push(uploadResponse.file)
            }
          } catch (error) {
            console.error('File upload failed:', error)
          }
        }
      }

      // Send message to backend
      const response = await apiService.sendMessage(messageData.content, uploadedFiles)
      
      if (response.success) {
        const aiResponse = {
          role: 'assistant',
          content: response.response,
          timestamp: new Date(response.timestamp),
          messageId: response.message_id
        }
        
        setMessages(prev => [...prev, aiResponse])
      } else {
        throw new Error(response.error || 'Failed to get response')
      }
    } catch (error) {
      console.error('Message sending failed:', error)
      const errorResponse = {
        role: 'assistant',
        content: `Sorry, I encountered an error: ${error.message}. Please try again.`,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorResponse])
    } finally {
      setIsTyping(false)
    }
  }

  const handleCopyMessage = (content) => {
    // Show a toast or notification that message was copied
    console.log('Message copied:', content)
  }

  const handleRegenerateMessage = (message) => {
    // Implement message regeneration
    console.log('Regenerating message:', message)
  }

  const handleFileSelect = (file) => {
    setSelectedFile(file)
  }

  const handleSettingsClick = () => {
    setShowSettings(true)
  }

  if (!isAuthenticated) {
    return (
      <AuthDialog
        onAuthenticate={handleAuthenticate}
        isLoading={isLoading}
        error={authError}
      />
    )
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      <Header
        onSettingsClick={handleSettingsClick}
        onThemeToggle={handleThemeToggle}
        isDarkMode={isDarkMode}
        user={user}
        onLogout={handleLogout}
      />
      
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          onFileSelect={handleFileSelect}
          selectedFile={selectedFile}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        
        <div className="flex-1 flex flex-col">
          <ChatArea
            messages={messages}
            isTyping={isTyping}
            onCopyMessage={handleCopyMessage}
            onRegenerateMessage={handleRegenerateMessage}
          />
          
          <InputArea
            onSendMessage={handleSendMessage}
            disabled={isTyping}
          />
        </div>
      </div>
    </div>
  )
}

export default App

