import { useState, useCallback } from 'react';
import { Upload, CheckCircle2, FileImage } from 'lucide-react';
import { useDocumentStore } from '@/store/documentStore';
import { Document } from '@/types/document';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export function UploadView() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const { addDocuments, setCurrentView, documents } = useDocumentStore();
  const { toast } = useToast();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processFiles = (files: FileList) => {
    const newDocs: Document[] = [];
    const fileNames: string[] = [];

    Array.from(files).forEach((file) => {
      const url = URL.createObjectURL(file);
      newDocs.push({
        id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        url,
        uploadedAt: new Date(),
      });
      fileNames.push(file.name);
    });

    addDocuments(newDocs);
    setUploadedFiles((prev) => [...prev, ...fileNames]);
    
    toast({
      title: "Documents uploaded",
      description: `${files.length} document(s) uploaded successfully`,
    });
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const handleProceedToClassify = () => {
    if (documents.length === 0) {
      toast({
        title: "No documents",
        description: "Please upload documents first",
        variant: "destructive",
      });
      return;
    }
    setCurrentView('classify');
  };

  return (
    <div className="p-8 max-w-4xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Upload Documents</h2>
        <p className="text-muted-foreground">
          Upload your documents for classification. Supports PNG, JPG, and other image formats.
        </p>
      </div>

      {/* Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300
          ${isDragging 
            ? 'border-primary bg-primary/5 scale-[1.02]' 
            : 'border-border hover:border-primary/50 hover:bg-muted/50'
          }
        `}
      >
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="flex flex-col items-center gap-4">
          <div className={`
            w-16 h-16 rounded-full flex items-center justify-center transition-colors duration-300
            ${isDragging ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}
          `}>
            <Upload className="w-8 h-8" />
          </div>
          
          <div>
            <p className="text-lg font-medium text-foreground mb-1">
              {isDragging ? 'Drop files here' : 'Drag and drop files here'}
            </p>
            <p className="text-sm text-muted-foreground">
              or click to browse from your computer
            </p>
          </div>
        </div>
      </div>

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="mt-8 animate-slide-up">
          <h3 className="text-lg font-semibold mb-4 text-foreground">
            Uploaded Files ({uploadedFiles.length})
          </h3>
          <div className="bg-card rounded-xl border border-border p-4 max-h-64 overflow-y-auto">
            <ul className="space-y-2">
              {uploadedFiles.map((fileName, index) => (
                <li 
                  key={index}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <FileImage className="w-5 h-5 text-primary" />
                  <span className="text-sm text-card-foreground flex-1 truncate">
                    {fileName}
                  </span>
                  <CheckCircle2 className="w-5 h-5 text-success" />
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Proceed Button */}
      {documents.length > 0 && (
        <div className="mt-8 flex justify-end animate-slide-up">
          <Button 
            size="lg"
            onClick={handleProceedToClassify}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Proceed to Classification
          </Button>
        </div>
      )}
    </div>
  );
}
