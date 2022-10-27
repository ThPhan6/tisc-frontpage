export interface PdfTemplateItem {
  created_at: string;
  group: number;
  id: string;
  name: string;
  pdf_url: string;
  preview_url: string;
  sequence: number;
  updated_at: string;
}

export interface TemplatesItem {
  name: string;
  items: PdfTemplateItem[];
}

export interface PdfDetail {
  config: {
    created_at: string;
    created_by: string;
    document_title: string;
    has_cover: boolean;
    id: string;
    issuing_date: string;
    issuing_for_id: string;
    location_id: string;
    project_id: string;
    revision: string;
    template_ids: string[];
    updated_at: string;
    template_cover_ids: string[];
    template_standard_ids: string[];
  };
  templates: {
    cover: TemplatesItem[];
    specification: TemplatesItem[];
  };
}
