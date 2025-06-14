
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import { useReviews, useAddReview } from '@/hooks/useReviews';
import { useAuth } from '@/contexts/AuthContext';

interface ProductReviewsProps {
  productId: string;
}

const ProductReviews = ({ productId }: ProductReviewsProps) => {
  const { user } = useAuth();
  const { data: reviews, isLoading } = useReviews(productId);
  const addReview = useAddReview();
  const [showAddReview, setShowAddReview] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    addReview.mutate({ productId, rating, comment }, {
      onSuccess: () => {
        setComment('');
        setRating(5);
        setShowAddReview(false);
      }
    });
  };

  if (isLoading) {
    return <div className="animate-pulse">Loading reviews...</div>;
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Customer Reviews ({reviews?.length || 0})</CardTitle>
          {user && (
            <Button 
              onClick={() => setShowAddReview(!showAddReview)}
              variant="outline"
              size="sm"
            >
              Write Review
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {showAddReview && user && (
          <form onSubmit={handleSubmitReview} className="border rounded-lg p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Rating</label>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`p-1 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                  >
                    <Star className="h-5 w-5 fill-current" />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Comment</label>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience with this product..."
                required
              />
            </div>
            <div className="flex space-x-2">
              <Button type="submit" disabled={addReview.isPending}>
                {addReview.isPending ? 'Submitting...' : 'Submit Review'}
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowAddReview(false)}>
                Cancel
              </Button>
            </div>
          </form>
        )}

        {reviews?.map((review) => (
          <div key={review.id} className="border-b pb-4 last:border-b-0">
            <div className="flex items-center space-x-2 mb-2">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${
                      star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {new Date(review.created_at).toLocaleDateString()}
              </span>
            </div>
            <p className="text-gray-700">{review.comment}</p>
          </div>
        ))}

        {!reviews?.length && (
          <p className="text-center text-gray-500 py-8">
            No reviews yet. Be the first to review this product!
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductReviews;
