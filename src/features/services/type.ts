export enum InvoiceStatus {
  Outstanding,
  Overdue,
  Paid,
  Pending,
  Processing,
}
export interface ServicesResponse {
  billed_date: string;
  created_at: string;
  created_by: string;
  due_date: string;
  id: string;
  name: string;
  ordered_by: string;
  payment_date: string;
  quantity: number;
  relation_id: string;
  relation_type: number;
  remark: string;
  service_type_id: string;
  status: number;
  tax: number;
  unit_rate: number;
  updated_at: string;
  service_type_name: string;
  ordered_user: {
    id: string;
    location_id: string;
    firstname: string;
    lastname: string;
    email: string;
  };
  brand_name: string;
  billing_amount: number;
  overdue_days: number;
  overdue_amount: number;
  total_gross: number;
  sale_tax_amount: number;
  firstname: string;
  lastname: string;
}

export interface ServicesForm {
  service_type_id: string;
  brand_id: string;
  ordered_by: string;
  unit_rate: number | string;
  quantity: number | string;
  tax: number | string;
  remark: string;
  brand_name?: string;
  ordered_by_name?: string;
}

export enum RoleIndex {
  TiscRolesAdmin = 1,
  TiscRolesConsultant = 2,
  BrandRolesAdmin = 3,
  BrandRolesMember = 4,
  DesignFirmRolesAdmin = 5,
  DesignFirmRolesMember = 6,
}

export interface SummaryService {
  grandTotal: number;
  offline_marketing_sale: number;
  online_marketing_sale: number;
  product_card_conversion: number;
  others: number;
}
