import { create } from 'zustand';
import { Document, ViewType } from '@/types/document';

interface DocumentStore {
  documents: Document[];
  currentView: ViewType;
  isClassified: boolean;
  setDocuments: (docs: Document[]) => void;
  addDocuments: (docs: Document[]) => void;
  deleteDocument: (id: string) => void;
  deleteDocuments: (ids: string[]) => void;
  setClassification: (classification: string, docIds: string[]) => void;
  setCurrentView: (view: ViewType) => void;
  setIsClassified: (value: boolean) => void;
  getDocumentsByIds: (ids: string[]) => Document[];
}

export const useDocumentStore = create<DocumentStore>((set, get) => ({
  documents: [],
  currentView: 'upload',
  isClassified: false,
  
  setDocuments: (docs) => set({ documents: docs }),
  
  addDocuments: (docs) => set((state) => ({ 
    documents: [...state.documents, ...docs] 
  })),

  deleteDocument: (id) => set((state) => ({
    documents: state.documents.filter((doc) => doc.id !== id),
  })),

  deleteDocuments: (ids) => set((state) => ({
    documents: state.documents.filter((doc) => !ids.includes(doc.id)),
  })),
  
  setClassification: (classification, docIds) => set((state) => ({
    documents: state.documents.map((doc) => 
      docIds.includes(doc.id) ? { ...doc, classification } : doc
    ),
  })),
  
  setCurrentView: (view) => set({ currentView: view }),
  
  setIsClassified: (value) => set({ isClassified: value }),
  
  getDocumentsByIds: (ids) => {
    const state = get();
    return state.documents.filter((doc) => ids.includes(doc.id));
  },
}));
