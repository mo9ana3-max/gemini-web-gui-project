import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { ScrollArea } from '@/components/ui/scroll-area.jsx'
import { Separator } from '@/components/ui/separator.jsx'
import { 
  ChevronRight, 
  ChevronDown, 
  File, 
  Folder, 
  FolderOpen,
  Plus,
  Upload,
  Search
} from 'lucide-react'
import { Input } from '@/components/ui/input.jsx'

const mockFileTree = [
  {
    name: 'src',
    type: 'folder',
    expanded: true,
    children: [
      { name: 'components', type: 'folder', expanded: false, children: [
        { name: 'Header.jsx', type: 'file' },
        { name: 'Sidebar.jsx', type: 'file' },
        { name: 'ChatArea.jsx', type: 'file' },
      ]},
      { name: 'utils', type: 'folder', expanded: false, children: [
        { name: 'api.js', type: 'file' },
        { name: 'auth.js', type: 'file' },
      ]},
      { name: 'App.jsx', type: 'file' },
      { name: 'main.jsx', type: 'file' },
    ]
  },
  {
    name: 'public',
    type: 'folder',
    expanded: false,
    children: [
      { name: 'index.html', type: 'file' },
      { name: 'favicon.ico', type: 'file' },
    ]
  },
  { name: 'package.json', type: 'file' },
  { name: 'README.md', type: 'file' },
  { name: '.gitignore', type: 'file' },
]

function FileTreeItem({ item, level = 0, onFileSelect, selectedFile }) {
  const [expanded, setExpanded] = useState(item.expanded || false)
  
  const handleToggle = () => {
    if (item.type === 'folder') {
      setExpanded(!expanded)
    } else {
      onFileSelect?.(item)
    }
  }

  const isSelected = selectedFile?.name === item.name

  return (
    <div>
      <div 
        className={`flex items-center py-1 px-2 hover:bg-accent hover:text-accent-foreground cursor-pointer rounded-sm ${
          isSelected ? 'bg-accent text-accent-foreground' : ''
        }`}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={handleToggle}
      >
        {item.type === 'folder' && (
          <div className="mr-1">
            {expanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </div>
        )}
        <div className="mr-2">
          {item.type === 'folder' ? (
            expanded ? (
              <FolderOpen className="h-4 w-4" />
            ) : (
              <Folder className="h-4 w-4" />
            )
          ) : (
            <File className="h-4 w-4" />
          )}
        </div>
        <span className="text-sm truncate">{item.name}</span>
      </div>
      {item.type === 'folder' && expanded && item.children && (
        <div>
          {item.children.map((child, index) => (
            <FileTreeItem 
              key={index} 
              item={child} 
              level={level + 1}
              onFileSelect={onFileSelect}
              selectedFile={selectedFile}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function Sidebar({ onFileSelect, selectedFile, isCollapsed, onToggleCollapse }) {
  const [searchQuery, setSearchQuery] = useState('')

  if (isCollapsed) {
    return (
      <div className="w-12 border-r bg-sidebar flex flex-col items-center py-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapse}
          className="w-8 h-8 p-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <div className="w-64 border-r bg-sidebar flex flex-col">
      {/* Header */}
      <div className="p-3 border-b">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold">Explorer</h2>
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="sm" className="w-6 h-6 p-0">
              <Plus className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="sm" className="w-6 h-6 p-0">
              <Upload className="h-3 w-3" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-6 h-6 p-0"
              onClick={onToggleCollapse}
            >
              <ChevronRight className="h-3 w-3 rotate-180" />
            </Button>
          </div>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
          <Input
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-7 h-7 text-xs"
          />
        </div>
      </div>

      {/* File Tree */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {mockFileTree.map((item, index) => (
            <FileTreeItem 
              key={index} 
              item={item}
              onFileSelect={onFileSelect}
              selectedFile={selectedFile}
            />
          ))}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-2 border-t">
        <div className="text-xs text-muted-foreground">
          {mockFileTree.length} items
        </div>
      </div>
    </div>
  )
}

