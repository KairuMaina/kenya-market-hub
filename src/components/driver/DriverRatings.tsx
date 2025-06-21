import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, Users, MessageSquare } from 'lucide-react';
import { useDriverRatings } from '@/hooks/useDriver';
import { timeAgo } from '@/utils/time';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const DriverRatings = () => {
  const { data: ratingsData, isLoading, error } = useDriverRatings();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
        <p className="ml-4 text-gray-600">Loading Ratings...</p>
      </div>
    );
  }

  if (error || !ratingsData) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">Could not load ratings data.</p>
        <p className="text-gray-500 text-sm mt-2">
          {(error as Error)?.message || 'An error occurred.'}
        </p>
      </div>
    );
  }

  const { overallRating, totalReviews, fiveStarPercentage, recentReviews } = ratingsData;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Ratings & Reviews</h1>
        <p className="text-gray-600">Track your customer satisfaction</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overall Rating</p>
                <p className="text-3xl font-bold">{overallRating.toFixed(1)}</p>
                <div className="flex items-center mt-1">
                  <Star className="h-3 w-3 text-yellow-500 fill-current mr-1" />
                  <span className="text-xs text-gray-600">Based on {totalReviews} reviews</span>
                </div>
              </div>
              <Star className="h-8 w-8 text-yellow-500 fill-current" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Reviews</p>
                <p className="text-3xl font-bold">{totalReviews}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">5-Star Rides</p>
                <p className="text-3xl font-bold">{fiveStarPercentage}%</p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentReviews.length > 0 ? recentReviews.map((review) => (
              <div key={review.id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{review.user_name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm">{review.user_name}</h4>
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${
                              i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    {review.comment && (
                      <p className="text-sm text-gray-600 mt-1">{review.comment}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">{timeAgo(review.date)}</p>
                  </div>
                </div>
              </div>
            )) : (
              <p className="text-center text-gray-500 py-4">No reviews yet.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DriverRatings;
