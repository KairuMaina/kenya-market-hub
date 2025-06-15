
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useValidateCoupon } from '@/hooks/useCoupons';
import { Loader2, Tag } from 'lucide-react';

interface CouponInputProps {
  orderAmount: number;
  onCouponApplied: (discount: any) => void;
  onCouponRemoved: () => void;
  appliedCoupon?: any;
}

const CouponInput = ({ 
  orderAmount, 
  onCouponApplied, 
  onCouponRemoved, 
  appliedCoupon 
}: CouponInputProps) => {
  const [couponCode, setCouponCode] = useState('');
  const validateCoupon = useValidateCoupon();

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) return;

    validateCoupon.mutate({
      code: couponCode.toUpperCase(),
      orderAmount
    }, {
      onSuccess: (data) => {
        // Parse the response if it's a string, otherwise use as-is
        const response = typeof data === 'string' ? JSON.parse(data) : data;
        
        if (response.valid) {
          onCouponApplied(response);
          setCouponCode('');
        }
      }
    });
  };

  const handleRemoveCoupon = () => {
    onCouponRemoved();
    setCouponCode('');
  };

  if (appliedCoupon) {
    return (
      <div className="space-y-2">
        <Label>Applied Coupon</Label>
        <div className="flex items-center justify-between p-3 border rounded-lg bg-green-50">
          <div className="flex items-center space-x-2">
            <Tag className="h-4 w-4 text-green-600" />
            <div>
              <Badge variant="secondary">{appliedCoupon.coupon_code || 'COUPON'}</Badge>
              <p className="text-sm text-green-600 mt-1">
                Discount: KSH {Number(appliedCoupon.discount_amount).toFixed(2)}
              </p>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRemoveCoupon}
          >
            Remove
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="coupon">Have a coupon code?</Label>
      <div className="flex space-x-2">
        <Input
          id="coupon"
          placeholder="Enter coupon code"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
          onKeyPress={(e) => e.key === 'Enter' && handleApplyCoupon()}
        />
        <Button 
          onClick={handleApplyCoupon}
          disabled={!couponCode.trim() || validateCoupon.isPending}
          className="w-auto"
        >
          {validateCoupon.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            'Apply'
          )}
        </Button>
      </div>
    </div>
  );
};

export default CouponInput;
