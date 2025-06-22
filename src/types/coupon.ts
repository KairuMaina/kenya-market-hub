
export interface Coupon {
  id: string;
  code: string;
  name: string;
  description?: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  discount_amount?: number; // Alias for discount_value
  minimum_order_amount?: number;
  maximum_discount_amount?: number;
  usage_limit?: number;
  usage_count?: number;
  used_count?: number; // Alias for usage_count
  user_usage_limit?: number;
  start_date: string;
  end_date: string;
  expires_at?: string; // Alias for end_date
  is_active: boolean;
  applicable_products?: string[];
  applicable_categories?: string[];
  created_by?: string;
  created_at: string;
  updated_at: string;
}
