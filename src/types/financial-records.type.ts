export interface FinancialRecords {
  currencies: {
    name: string;
    code: string;
    symbol: string;
  }[];
  exchange_history: {
    created_at: string;
    from_currency: string;
    id: string;
    rate: number;
    relation_id: string;
    to_currency: string;
    updated_at: string;
  };
  total_product: number;
  total_stock: number;
}
