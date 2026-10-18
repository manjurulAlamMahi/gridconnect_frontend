export interface ICancelSubscriptionResponse {
  success: boolean;
  message: string;
}

export interface ISubscriptionPlan {
  id: number;
  name: string;
  price: string;
  duration: string;
  stripe_price_id: string;
  stripe_product_id: string;
  included_tokens: number;
  features: string;
  description: string;
  is_active: boolean;
}

export interface IPlansResponse {
  success: boolean;
  message: string;
  data: {
    plans: ISubscriptionPlan[];
  };
}

export interface IInvoice {
  invoice_url: string;
  invoice_id: string;
  amount_paid: number;
  currency: string;
  status: "paid" | "pending" | "failed";
  date: string;
}

export interface IPaymentHistoryResponse {
  success: boolean;
  message: string;
  data: IInvoice | IInvoice[];
}

export interface ICurrentSubscriptionResponse {
  success: boolean;
  message: string;
  data: {
    subscription: {
      id: number;
      driver_id: number;
      plan_id: number;
      stripe_subscription_id: string;
      stripe_customer_id: string;
      stripe_invoice_id: string;
      status: string;
      current_tokens: number;
      purchased_tokens: number;
      current_period_end: string;
      auto_renewal_count: number | null;
      last_renewed_at: string | null;
      canceled_at: string | null;
      plan: ISubscriptionPlan;
    } | null;
    total_tokens: number;
  };
}