import { Download, FileImage } from 'lucide-react';
import { Document } from '@/types/document';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface DocumentCardProps {
  document: Document;
  showClassification?: boolean;
}

export function DocumentCard({ document, showClassification = true }: DocumentCardProps) {
  const handleDownload = () => {
    const link = window.document.createElement('a');
    link.href = document.url;
    link.download = document.name;
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
  };

  return (
    <div className="group bg-card rounded-xl border border-border overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300 animate-scale-in">
      {/* Image Container */}
      <div className="relative aspect-[4/3] bg-muted overflow-hidden">
        {document.url ? (
          <img
            src={document.url}
            alt={document.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FileImage className="w-12 h-12 text-muted-foreground" />
          </div>
        )}
        
        {/* Download Button Overlay */}
        <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/20 transition-colors duration-300 flex items-center justify-center">
          <Button
            size="sm"
            onClick={handleDownload}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-card text-card-foreground hover:bg-card/90"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="font-medium text-sm text-card-foreground truncate mb-2">
          {document.name}
        </p>
        
        {showClassification && document.classification && (
          <Badge variant="secondary" className="text-xs">
            {document.classification}
          </Badge>
        )}
      </div>
    </div>
  );
}
