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

export interface DetailPDF {
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

export const DEFAULT_VALUE = {
  config: {
    created_at: '',
    created_by: '',
    document_title: '',
    has_cover: false,
    id: '',
    issuing_date: '',
    issuing_for_id: '',
    location_id: '',
    project_id: '',
    revision: '',
    template_ids: [''],
    template_cover_ids: [''],
    template_standard_ids: [''],
    updated_at: '',
  },
  templates: {
    cover: [
      {
        name: '',
        items: [
          {
            created_at: '',
            group: 0,
            id: '',
            name: '',
            pdf_url: '',
            preview_url: '',
            sequence: 0,
            updated_at: '',
          },
        ],
      },
    ],
    specification: [
      {
        name: '',
        items: [
          {
            created_at: '',
            group: 0,
            id: '',
            name: '',
            pdf_url: '',
            preview_url: '',
            sequence: 0,
            updated_at: '',
          },
        ],
      },
    ],
  },
};
