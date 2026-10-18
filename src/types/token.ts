export interface ITokenPackage {
  id: number;
  name: string;
  tokens: number;
  price: string;
  description: string;
  stripe_price_id: string;
  stripe_product_id: string;
  is_popular: boolean;
  is_active: boolean;
}

export type TokenPurchaseStatus =
  | "succeeded"
  | "paid"
  | "pending"
  | "processing"
  | "failed"
  | "canceled"
  | "refunded"
  | "requires_action"
  | "requires_payment_method"
  | (string & {});

export interface ITokenPurchase {
  id: string | number;
  purchased_at: string;
  package_name: string;
  amount: number;
  tokens_purchased: number;
  status: TokenPurchaseStatus;
}

export interface ITokenPackagesResponse {
  success: boolean;
  message: string;
  data: {
    packages: ITokenPackage[];
  };
}

export interface ITokenPurchaseHistoryResponse {
  success: boolean;
  data: {
    purchases: ITokenPurchase[];
  };
}

export interface IAvailableTokensResponse {
  success: boolean;
  message: string;
  data: {
    subscription_tokens: number;
    subscription_plan: string;
    token_purchases: number;
    total_tokens: number;
  };
}
