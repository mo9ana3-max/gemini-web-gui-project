import { useState, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Card } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { 
  Send, 
  Paperclip, 
  X, 
  Mic, 
  Square,
  Command
} from 'lucide-react'
import { useDropzone } from 'react-dropzone'

const SLASH_COMMANDS = [
  { command: '/help', description: 'Show available commands' },
  { command: '/clear', description: 'Clear conversation history' },
  { command: '/model', description: 'Switch AI model' },
  { command: '/settings', description: 'Open settings' },
  { command: '/export', description: 'Export conversation' },
  { command: '/search', description: 'Search with Google' },
  { command: '/file', description: 'Analyze file' },
  { command: '/code', description: 'Generate code' },
]

function CommandSuggestions({ query, onSelect, onClose }) {
  const filteredCommands = SLASH_COMMANDS.filter(cmd => 
    cmd.command.toLowerCase().includes(query.toLowerCase()) ||
    cmd.description.toLowerCase().includes(query.toLowerCase())
  )

  if (filteredCommands.length === 0) return null

  return (
    <Card className="absolute bottom-full left-0 right-0 mb-2 p-2 shadow-lg border">
      <div className="text-xs text-muted-foreground mb-2 flex items-center">
        <Command className="h-3 w-3 mr-1" />
        Commands
      </div>
      <div className="space-y-1">
        {filteredCommands.map((cmd, index) => (
          <div
            key={cmd.command}
            className="flex items-center justify-between p-2 hover:bg-accent rounded-sm cursor-pointer"
            onClick={() => onSelect(cmd.command)}
          >
            <div>
              <div className="font-mono text-sm">{cmd.command}</div>
              <div className="text-xs text-muted-foreground">{cmd.description}</div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

function FilePreview({ files, onRemove }) {
  if (files.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2 mb-2">
      {files.map((file, index) => (
        <Badge key={index} variant="secondary" className="flex items-center gap-1">
          📎 {file.name}
          <Button
            variant="ghost"
            size="sm"
            className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
            onClick={() => onRemove(index)}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      ))}
    </div>
  )
}

export function InputArea({ 
  onSendMessage, 
  disabled = false, 
  placeholder = "Type your message... (Shift+Enter for new line)" 
}) {
  const [message, setMessage] = useState('')
  const [attachedFiles, setAttachedFiles] = useState([])
  const [showCommands, setShowCommands] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const textareaRef = useRef(null)
  const fileInputRef = useRef(null)

  const onDrop = useCallback((acceptedFiles) => {
    setAttachedFiles(prev => [...prev, ...acceptedFiles])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
    multiple: true,
    accept: {
      'text/*': [],
      'image/*': [],
      'application/pdf': [],
      'application/json': [],
      'application/javascript': [],
      'text/javascript': [],
      'text/typescript': [],
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!message.trim() && attachedFiles.length === 0) return
    if (disabled) return

    onSendMessage({
      content: message.trim(),
      files: attachedFiles
    })

    setMessage('')
    setAttachedFiles([])
    setShowCommands(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
    
    if (e.key === 'Escape') {
      setShowCommands(false)
    }
  }

  const handleInputChange = (e) => {
    const value = e.target.value
    setMessage(value)
    
    // Show command suggestions when typing /
    const lastLine = value.split('\n').pop()
    if (lastLine.startsWith('/') && lastLine.length > 1) {
      setShowCommands(true)
    } else {
      setShowCommands(false)
    }
  }

  const handleCommandSelect = (command) => {
    const lines = message.split('\n')
    const lastLineIndex = lines.length - 1
    const lastLine = lines[lastLineIndex]
    
    if (lastLine.startsWith('/')) {
      lines[lastLineIndex] = command + ' '
      setMessage(lines.join('\n'))
    }
    
    setShowCommands(false)
    textareaRef.current?.focus()
  }

  const removeFile = (index) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleFileSelect = () => {
    fileInputRef.current?.click()
  }

  const handleFileInputChange = (e) => {
    const files = Array.from(e.target.files || [])
    setAttachedFiles(prev => [...prev, ...files])
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)
    // TODO: Implement voice recording functionality
  }

  return (
    <div className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="p-4 max-w-4xl mx-auto">
        <div {...getRootProps()} className="relative">
          <input {...getInputProps()} />
          
          {isDragActive && (
            <div className="absolute inset-0 bg-primary/10 border-2 border-dashed border-primary rounded-lg flex items-center justify-center z-10">
              <div className="text-center">
                <Paperclip className="h-8 w-8 mx-auto mb-2 text-primary" />
                <p className="text-sm font-medium">Drop files here to attach</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-2">
            <FilePreview files={attachedFiles} onRemove={removeFile} />
            
            <div className="relative">
              {showCommands && (
                <CommandSuggestions
                  query={message.split('\n').pop().slice(1)}
                  onSelect={handleCommandSelect}
                  onClose={() => setShowCommands(false)}
                />
              )}
              
              <div className="flex items-end gap-2">
                <div className="flex-1 relative">
                  <Textarea
                    ref={textareaRef}
                    value={message}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    disabled={disabled}
                    className="min-h-[60px] max-h-[200px] resize-none pr-12"
                    rows={1}
                  />
                  
                  <div className="absolute right-2 bottom-2 flex items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={handleFileSelect}
                      disabled={disabled}
                    >
                      <Paperclip className="h-3 w-3" />
                    </Button>
                    
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className={`h-6 w-6 p-0 ${isRecording ? 'text-red-500' : ''}`}
                      onClick={toggleRecording}
                      disabled={disabled}
                    >
                      {isRecording ? (
                        <Square className="h-3 w-3" />
                      ) : (
                        <Mic className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  disabled={disabled || (!message.trim() && attachedFiles.length === 0)}
                  className="h-[60px] px-4"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </form>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={handleFileInputChange}
            accept="text/*,image/*,.pdf,.json,.js,.ts,.jsx,.tsx,.py,.java,.cpp,.c,.html,.css,.md"
          />
        </div>

        <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>Shift+Enter for new line</span>
            <span>Type / for commands</span>
            <span>Drag files to attach</span>
          </div>
          <div>
            {message.length > 0 && (
              <span>{message.length} characters</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

