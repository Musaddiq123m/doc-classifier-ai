import { useState } from 'react';
import { Search, Sparkles, FileSearch } from 'lucide-react';
import { useDocumentStore } from '@/store/documentStore';
import { DocumentCard } from '@/components/documents/DocumentCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function SearchByPromptView() {
  const { documents } = useDocumentStore();
  const [prompt, setPrompt] = useState('');
  const [searchResults, setSearchResults] = useState<typeof documents>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = () => {
    if (!prompt.trim()) return;
    
    setIsSearching(true);
    
    // Simulate search delay
    setTimeout(() => {
      // Hardcoded: Return 6.jpg, 9.jpg, and 10.jpg
      const results = documents.filter((doc) => {
        const match = doc.name.match(/^(\d+)\.(png|jpg|jpeg)$/i);
        if (match) {
          const num = parseInt(match[1]);
          return num === 6 || num === 9 || num === 10;
        }
        return false;
      });
      
      setSearchResults(results);
      setHasSearched(true);
      setIsSearching(false);
    }, 500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Search by Prompt</h2>
        <p className="text-muted-foreground">
          Describe what you're looking for and find matching documents.
        </p>
      </div>

      {/* Search Input */}
      <div className="bg-card rounded-xl border border-border p-6 shadow-card mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-primary" />
          <span className="text-sm font-medium text-card-foreground">AI-Powered Search</span>
        </div>
        
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Describe the document you're looking for..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pl-12 h-12 text-base"
            />
          </div>
          <Button 
            onClick={handleSearch}
            disabled={!prompt.trim() || isSearching}
            className="h-12 px-6 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isSearching ? (
              <>
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                Searching...
              </>
            ) : (
              <>
                <Search className="w-4 h-4 mr-2" />
                Search
              </>
            )}
          </Button>
        </div>

        {/* Suggested prompts */}
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="text-xs text-muted-foreground">Try:</span>
          {['Find all invoices', 'Show receipts from last month', 'Documents with signatures'].map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => setPrompt(suggestion)}
              className="text-xs px-3 py-1 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">
          {hasSearched ? `Results (${searchResults.length})` : 'Search Results'}
        </h3>
        
        {!hasSearched ? (
          <div className="bg-muted/50 rounded-xl p-12 text-center">
            <FileSearch className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium text-foreground mb-2">
              Enter a search prompt
            </p>
            <p className="text-muted-foreground">
              Describe what you're looking for in natural language
            </p>
          </div>
        ) : searchResults.length === 0 ? (
          <div className="bg-muted/50 rounded-xl p-12 text-center">
            <p className="text-muted-foreground">No documents match your search</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {searchResults.map((doc, index) => (
              <div 
                key={doc.id}
                style={{ animationDelay: `${index * 100}ms` }}
                className="animate-slide-up"
              >
                <DocumentCard document={doc} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
