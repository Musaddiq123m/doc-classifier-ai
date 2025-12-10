export interface Document {
  id: string;
  name: string;
  url: string;
  classification?: string;
  uploadedAt: Date;
}

export type ViewType = 'upload' | 'classify' | 'view' | 'search-image' | 'search-prompt';
