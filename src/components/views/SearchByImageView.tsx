import { useState, useCallback, useRef } from 'react';
import { Upload, Search, ImageIcon } from 'lucide-react';
import { useDocumentStore } from '@/store/documentStore';
import { DocumentCard } from '@/components/documents/DocumentCard';
import { Button } from '@/components/ui/button';

export function SearchByImageView() {
  const { documents } = useDocumentStore();
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [searchResults, setSearchResults] = useState<typeof documents>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      const url = URL.createObjectURL(file);
      setUploadedImage(url);
      setUploadedFileName(file.name);
      setHasSearched(false);
      setSearchResults([]);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setUploadedImage(url);
      setUploadedFileName(file.name);
      setHasSearched(false);
      setSearchResults([]);
    }
  };

  const handleSearch = () => {
    setIsSearching(true);
    
    // Random delay between 1-2 seconds
    const delay = Math.floor(Math.random() * 1000) + 3000;
    
    setTimeout(() => {
      const fileName = uploadedFileName.toLowerCase();
      
      let results: typeof documents = [];

      if (fileName.includes('musaddiq')) {
        // If Musaddiq.JPG -> return musaddiq uni card.jpg and musaddiq visa.jpg
        results = documents.filter((doc) => 
          doc.name.toLowerCase().includes('musaddiq')
        );
      } else if (fileName.includes('us3')) {
        // If us3.jpg -> return id6, lic1, lic2, musaddiq uni card.jpg, musaddiq visa.jpg
        results = documents.filter((doc) => {
          const name = doc.name.toLowerCase();
          return (
            name === 'id6.jpg' ||
            name === 'lic1.jpg' ||
            name === 'lic2.jpg' ||
            name.includes('musaddiq')
          );
        });
      } else {
        // Fallback: randomly return 1 pic
        if (documents.length > 0) {
          const randomIndex = Math.floor(Math.random() * documents.length);
          results = [documents[randomIndex]];
        }
      }

      setSearchResults(results);
      setHasSearched(true);
      setIsSearching(false);
    }, delay);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Search by Image</h2>
        <p className="text-muted-foreground">
          Upload an image to find similar documents in your collection.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Upload Zone */}
        <div>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              relative border-2 border-dashed rounded-2xl overflow-hidden transition-all duration-300
              ${isDragging 
                ? 'border-primary bg-primary/5' 
                : 'border-border hover:border-primary/50'
              }
              ${uploadedImage ? 'aspect-[4/3]' : 'p-12'}
            `}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleFileInput}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            
            {uploadedImage ? (
              <img 
                src={uploadedImage} 
                alt="Uploaded for search"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                  <Upload className="w-8 h-8 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-lg font-medium text-foreground mb-1">
                    Upload an image to search
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Drag and drop or click to browse
                  </p>
                </div>
              </div>
            )}
          </div>

          {uploadedImage && (
            <>
              <p className="text-sm text-muted-foreground mt-2 truncate">
                Uploaded: {uploadedFileName}
              </p>
              <Button 
                onClick={handleSearch}
                disabled={isSearching}
                className="w-full mt-4 bg-primary text-primary-foreground hover:bg-primary/90"
                size="lg"
              >
                {isSearching ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Search Similar Documents
                  </>
                )}
              </Button>
            </>
          )}
        </div>

        {/* Results */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">
            {hasSearched ? `Results (${searchResults.length})` : 'Search Results'}
          </h3>
          
          {!hasSearched ? (
            <div className="bg-muted/50 rounded-xl p-8 text-center">
              <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Upload an image and click search to find similar documents
              </p>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="bg-muted/50 rounded-xl p-8 text-center">
              <p className="text-muted-foreground">No similar documents found</p>
            </div>
          ) : (
            <div className="grid gap-4">
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
    </div>
  );
}
