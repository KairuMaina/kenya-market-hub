
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Plus, Eye, Edit2, Trash2, Check, X, RotateCcw } from 'lucide-react';

interface ActionButtonProps {
  onClick?: () => void;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const AddButton: React.FC<ActionButtonProps> = ({ onClick, loading, disabled, className = '', children }) => (
  <Button
    onClick={onClick}
    disabled={disabled || loading}
    className={`bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white shadow-md ${className}`}
  >
    {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
    {children || 'Add'}
  </Button>
);

export const ViewButton: React.FC<ActionButtonProps> = ({ onClick, loading, disabled, className = '' }) => (
  <Button
    variant="outline"
    size="sm"
    onClick={onClick}
    disabled={disabled || loading}
    className={`border-orange-200 text-orange-600 hover:bg-orange-50 ${className}`}
  >
    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Eye className="h-4 w-4" />}
  </Button>
);

export const EditButton: React.FC<ActionButtonProps> = ({ onClick, loading, disabled, className = '' }) => (
  <Button
    variant="outline"
    size="sm"
    onClick={onClick}
    disabled={disabled || loading}
    className={`border-orange-200 text-orange-600 hover:bg-orange-50 ${className}`}
  >
    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Edit2 className="h-4 w-4" />}
  </Button>
);

export const DeleteButton: React.FC<ActionButtonProps> = ({ onClick, loading, disabled, className = '' }) => (
  <Button
    variant="destructive"
    size="sm"
    onClick={onClick}
    disabled={disabled || loading}
    className={className}
  >
    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
  </Button>
);

export const ApproveButton: React.FC<ActionButtonProps> = ({ onClick, loading, disabled, className = '' }) => (
  <Button
    variant="outline"
    size="sm"
    onClick={onClick}
    disabled={disabled || loading}
    className={`border-green-200 text-green-600 hover:bg-green-50 ${className}`}
  >
    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
  </Button>
);

export const RejectButton: React.FC<ActionButtonProps> = ({ onClick, loading, disabled, className = '' }) => (
  <Button
    variant="destructive"
    size="sm"
    onClick={onClick}
    disabled={disabled || loading}
    className={className}
  >
    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
  </Button>
);

export const ReapproveButton: React.FC<ActionButtonProps> = ({ onClick, loading, disabled, className = '' }) => (
  <Button
    variant="outline"
    size="sm"
    onClick={onClick}
    disabled={disabled || loading}
    className={`border-orange-200 text-orange-600 hover:bg-orange-50 ${className}`}
  >
    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RotateCcw className="h-4 w-4" />}
  </Button>
);
