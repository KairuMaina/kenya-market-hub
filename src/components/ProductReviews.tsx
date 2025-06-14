
import React, { useState } from 'react';
import { useReviews, useAddReview } from '@/hooks/useReviews';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface ProductReviewsProps {
  productId: string;
}

const ProductReviews = ({ productId }: ProductReviewsProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { data: reviews, isLoading } = useReviews(productId);
  const addReview = useAddReview();
  
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);

  // Check if user has purchased this product
  const { data: hasPurchased } = useQuery({
    queryKey: ['user-purchase', productId, user?.id],
    queryFn: async () => {
      if (!user) return false;
      
      const { data, error } = await supabase
        .from('order_items')
        .select(`
          id,
          orders!inner(
            user_id,
            payment_status
          )
        `)
        .eq('product_id', productId)
        .eq('orders.user_id', user.id)
        .eq('orders.payment_status', 'completed');

      if (error) throw error;
      return data && data.length > 0;
    },
    enabled: !!user && !!productId
  });

  // Check if user has already reviewed this product
  const { data: hasReviewed } = useQuery({
    queryKey: ['user-review', productId, user?.id],
    queryFn: async () => {
      if (!user) return false;
      
      const { data, error } = await supabase
        .from('reviews')
        .select('id')
        .eq('product_id', productId)
        .eq('user_id', user.id);

      if (error) throw error;
      return data && data.length > 0;
    },
    enabled: !!user && !!productId
  });

  const handleSubmitReview = () => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to leave a review",
        variant: "destructive"
      });
      return;
    }

    if (!hasPurchased) {
      toast({
        title: "Purchase required",
        description: "You can only review products you have purchased",
        variant: "destructive"
      });
      return;
    }

    if (rating === 0) {
      toast({
        title: "Rating required",
        description: "Please select a star rating",
        variant: "destructive"
      });
      return;
    }

    addReview.mutate({
      productId,
      rating,
      comment: comment.trim() || null
    }, {
      onSuccess: () => {
        setRating(0);
        setComment('');
        setShowReviewForm(false);
        toast({ title: "Review submitted successfully!" });
      }
    });
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading reviews...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Reviews ({reviews?.length || 0})
          {user && hasPurchased && !hasReviewed && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowReviewForm(!showReviewForm)}
            >
              Write Review
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {showReviewForm && (
          <div className="border rounded-lg p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Rating</label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="text-2xl focus:outline-none"
                  >
                    <Star
                      className={`h-6 w-6 ${
                        star <= rating 
                          ? 'fill-yellow-400 text-yellow-400' 
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Comment (optional)</label>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience with this product..."
                rows={3}
              />
            </div>
            
            <div className="flex space-x-2">
              <Button onClick={handleSubmitReview} disabled={addReview.isPending}>
                {addReview.isPending ? 'Submitting...' : 'Submit Review'}
              </Button>
              <Button variant="outline" onClick={() => setShowReviewForm(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {!user && (
          <p className="text-gray-600 text-sm">
            Please log in and purchase this product to leave a review.
          </p>
        )}

        {user && !hasPurchased && !hasReviewed && (
          <p className="text-gray-600 text-sm">
            You can only review products you have purchased.
          </p>
        )}

        {reviews && reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="border-b pb-4 last:border-b-0">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {new Date(review.created_at).toLocaleDateString()}
                  </span>
                </div>
                {review.comment && (
                  <p className="text-sm text-gray-700">{review.comment}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No reviews yet. Be the first to review this product!</p>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductReviews;
