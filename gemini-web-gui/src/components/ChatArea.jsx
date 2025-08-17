import { useEffect, useRef } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.jsx'
import { Card } from '@/components/ui/card.jsx'
import { Copy, ThumbsUp, ThumbsDown, RotateCcw } from 'lucide-react'
import { Badge } from '@/components/ui/badge.jsx'

function MessageBubble({ message, onCopy, onRegenerate }) {
  const isUser = message.role === 'user'
  const isSystem = message.role === 'system'

  if (isSystem) {
    return (
      <div className="flex justify-center my-4">
        <Badge variant="secondary" className="text-xs">
          {message.content}
        </Badge>
      </div>
    )
  }

  return (
    <div className={`flex gap-3 mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <Avatar className="h-8 w-8 mt-1">
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs">
            G
          </AvatarFallback>
        </Avatar>
      )}
      
      <div className={`max-w-[80%] ${isUser ? 'order-first' : ''}`}>
        <Card className={`p-4 ${
          isUser 
            ? 'bg-primary text-primary-foreground ml-auto' 
            : 'bg-muted'
        }`}>
          <div className="prose prose-sm max-w-none dark:prose-invert">
            {message.content.split('\n').map((line, index) => {
              if (line.startsWith('```')) {
                return null // Handle code blocks separately if needed
              }
              return (
                <p key={index} className={`${index === 0 ? 'mt-0' : ''} ${
                  index === message.content.split('\n').length - 1 ? 'mb-0' : ''
                }`}>
                  {line}
                </p>
              )
            })}
          </div>
          
          {message.files && message.files.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {message.files.map((file, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  📎 {file.name}
                </Badge>
              ))}
            </div>
          )}
        </Card>
        
        {!isUser && (
          <div className="flex items-center gap-1 mt-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs"
              onClick={() => onCopy?.(message.content)}
            >
              <Copy className="h-3 w-3 mr-1" />
              Copy
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs"
              onClick={() => onRegenerate?.(message)}
            >
              <RotateCcw className="h-3 w-3 mr-1" />
              Regenerate
            </Button>
            <Button variant="ghost" size="sm" className="h-6 px-1">
              <ThumbsUp className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="sm" className="h-6 px-1">
              <ThumbsDown className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>
      
      {isUser && (
        <Avatar className="h-8 w-8 mt-1">
          <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">
            U
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  )
}

function TypingIndicator() {
  return (
    <div className="flex gap-3 mb-6">
      <Avatar className="h-8 w-8 mt-1">
        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs">
          G
        </AvatarFallback>
      </Avatar>
      
      <Card className="p-4 bg-muted">
        <div className="flex items-center gap-1">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
          </div>
          <span className="text-sm text-muted-foreground ml-2">Gemini is thinking...</span>
        </div>
      </Card>
    </div>
  )
}

export function ChatArea({ messages, isTyping, onCopyMessage, onRegenerateMessage }) {
  const scrollAreaRef = useRef(null)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const handleCopy = async (content) => {
    try {
      await navigator.clipboard.writeText(content)
      onCopyMessage?.(content)
    } catch (err) {
      console.error('Failed to copy text:', err)
    }
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">G</span>
          </div>
          <h2 className="text-2xl font-semibold mb-2">Welcome to Gemini CLI</h2>
          <p className="text-muted-foreground mb-6">
            Start a conversation with Gemini AI. You can ask questions, get help with code, 
            analyze files, or use slash commands for specific tasks.
          </p>
          <div className="grid grid-cols-1 gap-2 text-sm">
            <Card className="p-3 text-left hover:bg-accent cursor-pointer transition-colors">
              <div className="font-medium">💬 Ask a question</div>
              <div className="text-muted-foreground">Get help with coding, writing, or general questions</div>
            </Card>
            <Card className="p-3 text-left hover:bg-accent cursor-pointer transition-colors">
              <div className="font-medium">📁 Analyze files</div>
              <div className="text-muted-foreground">Upload or select files for analysis and review</div>
            </Card>
            <Card className="p-3 text-left hover:bg-accent cursor-pointer transition-colors">
              <div className="font-medium">⚡ Use commands</div>
              <div className="text-muted-foreground">Type / to see available slash commands</div>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col bg-background">
      <ScrollArea ref={scrollAreaRef} className="flex-1">
        <div className="p-4 max-w-4xl mx-auto">
          {messages.map((message, index) => (
            <MessageBubble
              key={index}
              message={message}
              onCopy={handleCopy}
              onRegenerate={onRegenerateMessage}
            />
          ))}
          {isTyping && <TypingIndicator />}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>
    </div>
  )
}

