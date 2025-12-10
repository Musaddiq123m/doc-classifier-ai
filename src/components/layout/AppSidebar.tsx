import { Upload, FolderOpen, ScanSearch, MessageSquareText, FileText } from 'lucide-react';
import { useDocumentStore } from '@/store/documentStore';
import { ViewType } from '@/types/document';
import { cn } from '@/lib/utils';

const navItems: { id: ViewType; label: string; icon: React.ElementType }[] = [
  { id: 'upload', label: 'Upload Documents', icon: Upload },
  { id: 'view', label: 'View Documents', icon: FolderOpen },
  { id: 'search-image', label: 'Search by Image', icon: ScanSearch },
  { id: 'search-prompt', label: 'Search by Prompt', icon: MessageSquareText },
];

export function AppSidebar() {
  const { currentView, setCurrentView, documents } = useDocumentStore();

  return (
    <aside className="w-64 min-h-screen bg-sidebar text-sidebar-foreground flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-sidebar-primary flex items-center justify-center">
            <FileText className="w-5 h-5 text-sidebar-primary-foreground" />
          </div>
          <div>
            <h1 className="font-semibold text-sm">Document</h1>
            <p className="text-xs text-sidebar-foreground/70">Classification System</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => setCurrentView(item.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive 
                      ? "bg-sidebar-primary text-sidebar-primary-foreground" 
                      : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Stats */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="bg-sidebar-accent rounded-lg p-4">
          <p className="text-xs text-sidebar-foreground/70 mb-1">Total Documents</p>
          <p className="text-2xl font-bold text-sidebar-foreground">{documents.length}</p>
        </div>
      </div>
    </aside>
  );
}
