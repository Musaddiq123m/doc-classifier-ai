import { AppSidebar } from '@/components/layout/AppSidebar';
import { UploadView } from '@/components/views/UploadView';
import { ClassifyView } from '@/components/views/ClassifyView';
import { ViewDocumentsView } from '@/components/views/ViewDocumentsView';
import { SearchByImageView } from '@/components/views/SearchByImageView';
import { SearchByPromptView } from '@/components/views/SearchByPromptView';
import { useDocumentStore } from '@/store/documentStore';

const Index = () => {
  const { currentView } = useDocumentStore();

  const renderView = () => {
    switch (currentView) {
      case 'upload':
        return <UploadView />;
      case 'classify':
        return <ClassifyView />;
      case 'view':
        return <ViewDocumentsView />;
      case 'search-image':
        return <SearchByImageView />;
      case 'search-prompt':
        return <SearchByPromptView />;
      default:
        return <UploadView />;
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      <AppSidebar />
      <main className="flex-1 overflow-auto">
        {renderView()}
      </main>
    </div>
  );
};

export default Index;
