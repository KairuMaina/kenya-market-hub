
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Plus, Edit2, Trash2, Eye, Check, X, Phone, Calendar, ShoppingCart, Heart, Search, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UnifiedButtonProps {
  onClick?: () => void;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
  size?: 'sm' | 'default' | 'lg';
  fullWidth?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

// Primary Action Buttons
export const PrimaryButton: React.FC<UnifiedButtonProps> = ({ 
  onClick, loading, disabled, className, children, size = 'default', fullWidth, type = 'button'
}) => (
  <Button
    type={type}
    onClick={onClick}
    disabled={disabled || loading}
    size={size}
    className={cn(
      "bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700",
      "text-white shadow-md transition-all duration-200",
      fullWidth && "w-full",
      className
    )}
  >
    {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
    {children}
  </Button>
);

export const SecondaryButton: React.FC<UnifiedButtonProps> = ({ 
  onClick, loading, disabled, className, children, size = 'default', fullWidth, type = 'button'
}) => (
  <Button
    type={type}
    variant="outline"
    onClick={onClick}
    disabled={disabled || loading}
    size={size}
    className={cn(
      "border-orange-200 text-orange-600 hover:bg-orange-50",
      "transition-all duration-200",
      fullWidth && "w-full",
      className
    )}
  >
    {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
    {children}
  </Button>
);

// Action-specific buttons with consistent styling
export const AddButton: React.FC<UnifiedButtonProps> = (props) => (
  <PrimaryButton {...props}>
    {props.loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
    {props.children || 'Add'}
  </PrimaryButton>
);

export const EditButton: React.FC<UnifiedButtonProps> = (props) => (
  <SecondaryButton {...props} size="sm">
    {props.loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Edit2 className="h-4 w-4" />}
  </SecondaryButton>
);

export const DeleteButton: React.FC<UnifiedButtonProps> = (props) => (
  <Button
    type={props.type || 'button'}
    variant="destructive"
    onClick={props.onClick}
    disabled={props.disabled || props.loading}
    size="sm"
    className={cn("transition-all duration-200", props.className)}
  >
    {props.loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
  </Button>
);

export const ViewButton: React.FC<UnifiedButtonProps> = (props) => (
  <SecondaryButton {...props} size="sm">
    {props.loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Eye className="h-4 w-4" />}
  </SecondaryButton>
);
