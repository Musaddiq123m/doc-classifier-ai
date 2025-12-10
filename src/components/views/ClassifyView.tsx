import { useState, useMemo } from 'react';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { useDocumentStore } from '@/store/documentStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

type ClassificationStep = 1 | 2 | 3 | 4 | 5 | 'complete';

interface DocTypeGroup {
  name: string;
  docs: { id: string; name: string; url: string }[];
  randomDoc: { id: string; name: string; url: string } | null;
}

export function ClassifyView() {
  const { documents, setClassification, setCurrentView, setIsClassified } = useDocumentStore();
  const { toast } = useToast();
  
  const [step, setStep] = useState<ClassificationStep>(1);
  const [classifications, setClassifications] = useState<Record<number, string>>({
    1: '', 2: '', 3: '', 4: '', 5: ''
  });

  // Group documents by type
  const docGroups: DocTypeGroup[] = useMemo(() => {
    // ID documents (id1.jpg - id17.jpg) AND musaddiq uni card
    const idDocs = documents.filter((doc) => 
      /^id\d+\.jpg$/i.test(doc.name) || 
      (doc.name.toLowerCase().includes('musaddiq') && doc.name.toLowerCase().includes('uni'))
    );
    
    // License documents (lic1.jpg - lic6.jpg)
    const licDocs = documents.filter((doc) => /^lic\d+\.jpg$/i.test(doc.name));
    
    // NIC documents (nic1.jpg - nic26.jpg)
    const nicDocs = documents.filter((doc) => /^nic\d+\.jpg$/i.test(doc.name));
    
    // Passport documents (pass1.jpg - pass8.jpg)
    const passDocs = documents.filter((doc) => /^pass\d+\.jpg$/i.test(doc.name));
    
    // Musaddiq visa
    const visaDocs = documents.filter((doc) => 
      doc.name.toLowerCase().includes('musaddiq') && doc.name.toLowerCase().includes('visa')
    );

    const getRandomDoc = (docs: typeof documents) => {
      if (docs.length === 0) return null;
      return docs[Math.floor(Math.random() * docs.length)];
    };

    return [
      { name: 'ID Documents', docs: idDocs, randomDoc: getRandomDoc(idDocs) },
      { name: 'License Documents', docs: licDocs, randomDoc: getRandomDoc(licDocs) },
      { name: 'NIC Documents', docs: nicDocs, randomDoc: getRandomDoc(nicDocs) },
      { name: 'Passport Documents', docs: passDocs, randomDoc: getRandomDoc(passDocs) },
      { name: 'Visa', docs: visaDocs, randomDoc: getRandomDoc(visaDocs) },
    ];
  }, [documents]);

  // Filter to only groups that have documents
  const activeGroups = useMemo(() => {
    return docGroups.filter(group => group.docs.length > 0);
  }, [docGroups]);

  const totalSteps = activeGroups.length;

  const handleStepSubmit = () => {
    const currentClassification = classifications[step as number];
    
    if (!currentClassification?.trim()) {
      toast({
        title: "Classification required",
        description: "Please enter a classification type",
        variant: "destructive",
      });
      return;
    }

    const currentGroup = activeGroups[(step as number) - 1];
    if (currentGroup) {
      const docIds = currentGroup.docs.map(doc => doc.id);
      setClassification(currentClassification.trim(), docIds);
      toast({
        title: "Classification applied",
        description: `Applied "${currentClassification}" to ${docIds.length} document${docIds.length > 1 ? 's' : ''}`,
      });
    }

    if ((step as number) < totalSteps) {
      setStep(((step as number) + 1) as ClassificationStep);
    } else {
      setStep('complete');
      setIsClassified(true);
    }
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

  if (activeGroups.length === 0) {
    return (
      <div className="p-8 max-w-4xl mx-auto animate-fade-in">
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-foreground mb-4">No Recognizable Documents</h2>
          <p className="text-muted-foreground mb-6">
            No document types were recognized in the uploaded files.
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

  const currentGroup = activeGroups[(step as number) - 1];
  const currentDoc = currentGroup?.randomDoc;
  const currentClassification = classifications[step as number] || '';

  const updateClassification = (value: string) => {
    setClassifications(prev => ({ ...prev, [step as number]: value }));
  };

  return (
    <div className="p-8 max-w-5xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Classify Documents</h2>
        <p className="text-muted-foreground">
          Step {step} of {totalSteps}
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center gap-2 mb-8 flex-wrap">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((s) => (
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
            {s < totalSteps && <div className="h-0.5 w-4 bg-border" />}
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
                Enter the classification for this document. This will apply to {currentGroup.docs.length} document{currentGroup.docs.length > 1 ? 's' : ''}.
              </p>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="classification">Classification Type</Label>
                  <Input
                    id="classification"
                    placeholder="e.g., Invoice, ID Card, Receipt..."
                    value={currentClassification}
                    onChange={(e) => updateClassification(e.target.value)}
                    className="mt-2"
                  />
                </div>
                
                <Button 
                  onClick={handleStepSubmit}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {(step as number) === totalSteps ? 'Complete Classification' : 'Next'}
                  {(step as number) === totalSteps ? <CheckCircle2 className="w-4 h-4 ml-2" /> : <ArrowRight className="w-4 h-4 ml-2" />}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
