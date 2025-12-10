import { useState } from 'react';
import { Search, Filter, Grid3X3, List, Trash2 } from 'lucide-react';
import { useDocumentStore } from '@/store/documentStore';
import { DocumentCard } from '@/components/documents/DocumentCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function ViewDocumentsView() {
  const { documents, setCurrentView, deleteDocuments } = useDocumentStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClassification, setFilterClassification] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Get unique classifications
  const classifications = [...new Set(documents
    .map((doc) => doc.classification)
    .filter(Boolean)
  )];

  // Filter documents
  const filteredDocs = documents.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = !filterClassification || doc.classification === filterClassification;
    return matchesSearch && matchesFilter;
  });

  const toggleSelected = (id: string) => {
    setSelectedIds((prev) => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    const confirmed = window.confirm(`Delete ${selectedIds.length} selected document(s)?`);
    if (!confirmed) return;
    deleteDocuments(selectedIds);
    setSelectedIds([]);
  };

  if (documents.length === 0) {
    return (
      <div className="p-8 max-w-4xl mx-auto animate-fade-in">
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-foreground mb-4">No Documents</h2>
          <p className="text-muted-foreground mb-6">
            Upload and classify documents to see them here.
          </p>
          <Button onClick={() => setCurrentView('upload')}>
            Upload Documents
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 animate-fade-in">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">View Documents</h2>
        <p className="text-muted-foreground">
          Browse all uploaded documents and their classifications.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <div className="flex gap-2 flex-wrap">
            <Badge
              variant={filterClassification === null ? "default" : "secondary"}
              className="cursor-pointer"
              onClick={() => setFilterClassification(null)}
            >
              All
            </Badge>
            {classifications.map((classification) => (
              <Badge
                key={classification}
                variant={filterClassification === classification ? "default" : "secondary"}
                className="cursor-pointer"
                onClick={() => setFilterClassification(classification as string)}
              >
                {classification}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <Button
            variant="destructive"
            size="sm"
            disabled={selectedIds.length === 0}
            onClick={handleBulkDelete}
          >
            <Trash2 className="w-4 h-4 mr-2" /> Delete Selected ({selectedIds.length})
          </Button>
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="icon"
            onClick={() => setViewMode('grid')}
          >
            <Grid3X3 className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="icon"
            onClick={() => setViewMode('list')}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Documents Grid/List */}
      {filteredDocs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No documents match your search.</p>
        </div>
      ) : (
        <div className={viewMode === 'grid' 
          ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          : "space-y-4"
        }>
          {filteredDocs.map((doc, index) => (
            <div 
              key={doc.id}
              style={{ animationDelay: `${index * 50}ms` }}
              className="animate-slide-up"
            >
              <div className="relative">
                <input
                  type="checkbox"
                  className="absolute top-2 left-2 z-10 w-4 h-4"
                  checked={selectedIds.includes(doc.id)}
                  onChange={() => toggleSelected(doc.id)}
                  aria-label="Select document"
                />
                <DocumentCard document={doc} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="mt-8 pt-6 border-t border-border">
        <p className="text-sm text-muted-foreground">
          Showing {filteredDocs.length} of {documents.length} documents
        </p>
      </div>
    </div>
  );
}
