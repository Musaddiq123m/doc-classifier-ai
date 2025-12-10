import { useState, useMemo } from 'react';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { useDocumentStore } from '@/store/documentStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

type ClassificationStep = 1 | 2 | 3 | 'complete';

export function ClassifyView() {
  const { documents, setClassification, setCurrentView, setIsClassified } = useDocumentStore();
  const { toast } = useToast();
  
  const [step, setStep] = useState<ClassificationStep>(1);
  const [classification1, setClassification1] = useState('');
  const [classification2, setClassification2] = useState('');
  const [classification3, setClassification3] = useState('');

  // Get a random numbered document (1-14)
  const randomNumberedDoc = useMemo(() => {
    const numberedDocs = documents.filter((doc) => {
      const match = doc.name.match(/^(\d+)\.(png|jpg|jpeg)$/i);
      return match && parseInt(match[1]) >= 1 && parseInt(match[1]) <= 14;
    });
    if (numberedDocs.length === 0) return null;
    return numberedDocs[Math.floor(Math.random() * numberedDocs.length)];
  }, [documents]);

  // Get specific musaddiq documents
  const uniCardDoc = useMemo(() => {
    return documents.find((doc) => 
      doc.name.toLowerCase().includes('musaddiq') && doc.name.toLowerCase().includes('uni')
    );
  }, [documents]);

  const visaDoc = useMemo(() => {
    return documents.find((doc) => 
      doc.name.toLowerCase().includes('musaddiq') && doc.name.toLowerCase().includes('visa')
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

  const handleStep1 = () => {
    if (!classification1.trim()) {
      toast({
        title: "Classification required",
        description: "Please enter a classification type",
        variant: "destructive",
      });
      return;
    }
    // Apply to all numbered documents
    setClassification(classification1.trim(), numberedDocIds);
    toast({
      title: "Classification applied",
      description: `Applied "${classification1}" to ${numberedDocIds.length} documents`,
    });
    setStep(2);
  };

  const handleStep2 = () => {
    if (!classification2.trim()) {
      toast({
        title: "Classification required",
        description: "Please enter a classification type",
        variant: "destructive",
      });
      return;
    }
    if (uniCardDoc) {
      setClassification(classification2.trim(), [uniCardDoc.id]);
      toast({
        title: "Classification applied",
        description: `Applied "${classification2}" to uni card`,
      });
    }
    setStep(3);
  };

  const handleStep3 = () => {
    if (!classification3.trim()) {
      toast({
        title: "Classification required",
        description: "Please enter a classification type",
        variant: "destructive",
      });
      return;
    }
    if (visaDoc) {
      setClassification(classification3.trim(), [visaDoc.id]);
      toast({
        title: "Classification applied",
        description: `Applied "${classification3}" to visa`,
      });
    }
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

  const currentDoc = step === 1 ? randomNumberedDoc : step === 2 ? uniCardDoc : visaDoc;
  const currentClassification = step === 1 ? classification1 : step === 2 ? classification2 : classification3;
  const setCurrentClassification = step === 1 ? setClassification1 : step === 2 ? setClassification2 : setClassification3;
  const handleSubmit = step === 1 ? handleStep1 : step === 2 ? handleStep2 : handleStep3;

  return (
    <div className="p-8 max-w-5xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Classify Documents</h2>
        <p className="text-muted-foreground">
          Step {step} of 3
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center gap-4 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
              step === s 
                ? 'bg-primary text-primary-foreground' 
                : (typeof step === 'number' && s < step) 
                  ? 'bg-success text-success-foreground'
                  : 'bg-muted text-muted-foreground'
            }`}>
              {(typeof step === 'number' && s < step) ? <CheckCircle2 className="w-4 h-4" /> : s}
            </div>
            {s < 3 && <div className="h-0.5 w-8 bg-border" />}
          </div>
        ))}
      </div>

      {currentDoc && (
        <div className="grid md:grid-cols-2 gap-8">
          {/* Sample Image */}
          <div className="bg-card rounded-xl border border-border overflow-hidden shadow-card">
            <div className="p-4 border-b border-border">
              <p className="text-sm font-medium text-card-foreground">Document</p>
              <p className="text-xs text-muted-foreground">{currentDoc.name}</p>
            </div>
            <div className="aspect-[4/3] bg-muted">
              <img 
                src={currentDoc.url} 
                alt={currentDoc.name}
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
                Enter the classification for this document.
              </p>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="classification">Classification Type</Label>
                  <Input
                    id="classification"
                    placeholder="e.g., Invoice, ID Card, Receipt..."
                    value={currentClassification}
                    onChange={(e) => setCurrentClassification(e.target.value)}
                    className="mt-2"
                  />
                </div>
                
                <Button 
                  onClick={handleSubmit}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {step === 3 ? 'Complete Classification' : 'Next'}
                  {step === 3 ? <CheckCircle2 className="w-4 h-4 ml-2" /> : <ArrowRight className="w-4 h-4 ml-2" />}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
