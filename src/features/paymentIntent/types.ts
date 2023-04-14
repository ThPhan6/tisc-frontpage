export interface PaymentIntentResponse {
  id: string;
  client_secret: string;
  request_id: string;
  amount: number;
  base_amount: number;
  currency: 'SGD';
  merchant_order_id: string;
  metadata: {
    created_by: string;
    invoice_id: string;
  };
  status:
    | ''
    | 'SUCCEEDED'
    | 'CANCELLED'
    | 'PENDING'
    | 'REQUIRES_CAPTURE'
    | 'REQUIRES_CUSTOMER_ACTION'
    | 'REQUIRES_PAYMENT_METHOD';
  captured_amount: 0;
  created_at: string;
  updated_at: string;
  available_payment_method_types: [
    'axs_kiosk',
    'alipaycn',
    'sam_kiosk',
    'card',
    'wechatpay',
    'enets',
    'atome',
    'paypal',
    'grabpay',
    'applepay',
    'googlepay',
  ];
}

export const PAYMENT_INTENT_DEFAULT: PaymentIntentResponse = {
  id: '',
  client_secret: '',
  request_id: '',
  amount: 0,
  base_amount: 0,
  currency: 'SGD',
  merchant_order_id: '',
  metadata: {
    created_by: '',
    invoice_id: '',
  },
  status: '',
  captured_amount: 0,
  created_at: '',
  updated_at: '',
  available_payment_method_types: [
    'axs_kiosk',
    'alipaycn',
    'sam_kiosk',
    'card',
    'wechatpay',
    'enets',
    'atome',
    'paypal',
    'grabpay',
    'applepay',
    'googlepay',
  ],
};
