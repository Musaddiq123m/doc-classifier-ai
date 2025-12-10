import { useState, useMemo } from 'react';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { useDocumentStore } from '@/store/documentStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

type ClassificationStep = 'numbered' | 'musaddiq' | 'complete';

export function ClassifyView() {
  const { documents, setClassification, setCurrentView, setIsClassified } = useDocumentStore();
  const { toast } = useToast();
  
  const [step, setStep] = useState<ClassificationStep>('numbered');
  const [numberedClassification, setNumberedClassification] = useState('');
  const [musaddiqClassification, setMusaddiqClassification] = useState('');

  // Get a random numbered document (1-14)
  const randomNumberedDoc = useMemo(() => {
    const numberedDocs = documents.filter((doc) => {
      const match = doc.name.match(/^(\d+)\.(png|jpg|jpeg)$/i);
      return match && parseInt(match[1]) >= 1 && parseInt(match[1]) <= 14;
    });
    if (numberedDocs.length === 0) return null;
    return numberedDocs[Math.floor(Math.random() * numberedDocs.length)];
  }, [documents]);

  // Get musaddiq documents
  const musaddiqDocs = useMemo(() => {
    return documents.filter((doc) => 
      doc.name.toLowerCase().includes('musaddiq')
    );
  }, [documents]);

  // Get all numbered document IDs
  const numberedDocIds = useMemo(() => {
    return documents
      .filter((doc) => {
        const match = doc.name.match(/^(\d+)\.(png|jpg|jpeg)$/i);
        return match && parseInt(match[1]) >= 1 && parseInt(match[1]) <= 14;
      })
      .map((doc) => doc.id);
  }, [documents]);

  const handleNumberedClassification = () => {
    if (!numberedClassification.trim()) {
      toast({
        title: "Classification required",
        description: "Please enter a classification type",
        variant: "destructive",
      });
      return;
    }

    setClassification(numberedClassification.trim(), numberedDocIds);
    toast({
      title: "Classification applied",
      description: `Applied "${numberedClassification}" to ${numberedDocIds.length} documents`,
    });
    setStep('musaddiq');
  };

  const handleMusaddiqClassification = () => {
    if (!musaddiqClassification.trim()) {
      toast({
        title: "Classification required",
        description: "Please enter a classification type",
        variant: "destructive",
      });
      return;
    }

    const musaddiqIds = musaddiqDocs.map((doc) => doc.id);
    setClassification(musaddiqClassification.trim(), musaddiqIds);
    toast({
      title: "Classification applied",
      description: `Applied "${musaddiqClassification}" to ${musaddiqIds.length} documents`,
    });
    setStep('complete');
    setIsClassified(true);
  };

  if (documents.length === 0) {
    return (
      <div className="p-8 max-w-4xl mx-auto animate-fade-in">
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-foreground mb-4">No Documents</h2>
          <p className="text-muted-foreground mb-6">
            Please upload documents first before classification.
          </p>
          <Button onClick={() => setCurrentView('upload')}>
            Go to Upload
          </Button>
        </div>
      </div>
    );
  }

  if (step === 'complete') {
    return (
      <div className="p-8 max-w-4xl mx-auto animate-fade-in">
        <div className="text-center py-16">
          <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-success" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-4">Classification Complete!</h2>
          <p className="text-muted-foreground mb-8">
            All documents have been successfully classified.
          </p>
          <Button 
            size="lg"
            onClick={() => setCurrentView('view')}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            View Documents
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Classify Documents</h2>
        <p className="text-muted-foreground">
          {step === 'numbered' 
            ? 'Step 1: Classify numbered documents (1-14)' 
            : 'Step 2: Classify Musaddiq documents'}
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center gap-4 mb-8">
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
          step === 'numbered' ? 'bg-primary text-primary-foreground' : 'bg-success text-success-foreground'
        }`}>
          {step === 'numbered' ? '1' : <CheckCircle2 className="w-4 h-4" />}
          <span>Numbered Docs</span>
        </div>
        <div className="h-0.5 w-8 bg-border" />
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
          step === 'musaddiq' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
        }`}>
          2
          <span>Musaddiq Docs</span>
        </div>
      </div>

      {step === 'numbered' && randomNumberedDoc && (
        <div className="grid md:grid-cols-2 gap-8">
          {/* Sample Image */}
          <div className="bg-card rounded-xl border border-border overflow-hidden shadow-card">
            <div className="p-4 border-b border-border">
              <p className="text-sm font-medium text-card-foreground">Sample Document</p>
              <p className="text-xs text-muted-foreground">{randomNumberedDoc.name}</p>
            </div>
            <div className="aspect-[4/3] bg-muted">
              <img 
                src={randomNumberedDoc.url} 
                alt={randomNumberedDoc.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Classification Input */}
          <div className="flex flex-col justify-center">
            <div className="bg-card rounded-xl border border-border p-6 shadow-card">
              <h3 className="text-lg font-semibold text-card-foreground mb-4">
                What type of document is this?
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                This classification will be applied to all {numberedDocIds.length} numbered documents (1-14).
              </p>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="classification">Classification Type</Label>
                  <Input
                    id="classification"
                    placeholder="e.g., Invoice, Receipt, Contract..."
                    value={numberedClassification}
                    onChange={(e) => setNumberedClassification(e.target.value)}
                    className="mt-2"
                  />
                </div>
                
                <Button 
                  onClick={handleNumberedClassification}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Apply Classification
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 'musaddiq' && musaddiqDocs.length > 0 && (
        <div className="space-y-8">
          {/* Musaddiq Documents Display */}
          <div className="grid md:grid-cols-2 gap-6">
            {musaddiqDocs.map((doc) => (
              <div key={doc.id} className="bg-card rounded-xl border border-border overflow-hidden shadow-card">
                <div className="p-4 border-b border-border">
                  <p className="text-sm font-medium text-card-foreground">{doc.name}</p>
                </div>
                <div className="aspect-[4/3] bg-muted">
                  <img 
                    src={doc.url} 
                    alt={doc.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Classification Input */}
          <div className="bg-card rounded-xl border border-border p-6 shadow-card max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">
              Classify Musaddiq Documents
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              Enter the classification for both Musaddiq documents shown above.
            </p>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="musaddiq-classification">Classification Type</Label>
                <Input
                  id="musaddiq-classification"
                  placeholder="e.g., ID Document, Personal..."
                  value={musaddiqClassification}
                  onChange={(e) => setMusaddiqClassification(e.target.value)}
                  className="mt-2"
                />
              </div>
              
              <Button 
                onClick={handleMusaddiqClassification}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Complete Classification
                <CheckCircle2 className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
