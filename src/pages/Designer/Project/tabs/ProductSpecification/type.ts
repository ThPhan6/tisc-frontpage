export interface DetailItem {
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
  items: DetailItem[];
}

export interface CoverPreamble {
  config: {
    created_at: string;
    created_by: string;
    document_title: string;
    has_cover: false;
    id: string;
    issuing_date: string;
    issuing_for_id: string;
    location_id: string;
    project_id: string;
    revision: string;
    template_ids: string[];
    updated_at: null;
  };
  templates: {
    cover: TemplatesItem[];
    specification: TemplatesItem[];
  };
}
