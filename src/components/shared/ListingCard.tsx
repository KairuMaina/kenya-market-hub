
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Heart, Star } from 'lucide-react';

interface ListingCardProps {
  id: string;
  title: string;
  price?: number;
  image?: string;
  category?: string;
  rating?: number;
  reviews?: number;
  location?: string;
  badge?: string;
  onClick?: () => void;
  onFavorite?: () => void;
  onView?: () => void;
  isFavorited?: boolean;
  children?: React.ReactNode;
}

const ListingCard = ({
  id,
  title,
  price,
  image,
  category,
  rating,
  reviews,
  location,
  badge,
  onClick,
  onFavorite,
  onView,
  isFavorited = false,
  children
}: ListingCardProps) => {
  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border hover:border-orange-200 rounded-2xl overflow-hidden transform hover:scale-105 cursor-pointer">
      {/* Square Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {image ? (
          <img 
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            onClick={onClick}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <span className="text-gray-400 text-sm">No Image</span>
          </div>
        )}
        
        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex gap-2">
            {onView && (
              <Button
                size="sm"
                variant="secondary"
                className="h-8 w-8 p-0 bg-white/90 hover:bg-white rounded-lg"
                onClick={(e) => {
                  e.stopPropagation();
                  onView();
                }}
              >
                <Eye className="h-4 w-4" />
              </Button>
            )}
            {onFavorite && (
              <Button
                size="sm"
                variant="secondary"
                className="h-8 w-8 p-0 bg-white/90 hover:bg-white rounded-lg"
                onClick={(e) => {
                  e.stopPropagation();
                  onFavorite();
                }}
              >
                <Heart className={`h-4 w-4 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
            )}
          </div>
        </div>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
          {badge && (
            <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs rounded-lg">
              {badge}
            </Badge>
          )}
          {category && (
            <Badge variant="secondary" className="bg-white/90 text-gray-800 text-xs rounded-lg">
              {category}
            </Badge>
          )}
        </div>

        {/* Price Tag */}
        {price !== undefined && (
          <div className="absolute bottom-3 right-3">
            <Badge className="bg-white/95 text-gray-900 text-sm font-bold rounded-lg px-2 py-1">
              KSH {price.toLocaleString()}
            </Badge>
          </div>
        )}
      </div>

      {/* Card Content */}
      <CardHeader className="pb-2 px-4 pt-4">
        <h3 
          className="text-base font-semibold line-clamp-2 cursor-pointer hover:text-orange-600 transition-colors min-h-[48px]"
          onClick={onClick}
        >
          {title}
        </h3>
        
        {/* Rating and Reviews */}
        {rating !== undefined && (
          <div className="flex items-center gap-1 mt-1">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`h-3 w-3 ${
                    i < Math.floor(rating) 
                      ? 'fill-yellow-400 text-yellow-400' 
                      : 'text-gray-300'
                  }`} 
                />
              ))}
            </div>
            {reviews !== undefined && (
              <span className="text-xs text-gray-600">({reviews})</span>
            )}
          </div>
        )}

        {/* Location */}
        {location && (
          <p className="text-xs text-gray-500 mt-1 line-clamp-1">{location}</p>
        )}
      </CardHeader>

      {/* Custom Content */}
      {children && (
        <CardContent className="px-4 pb-4">
          {children}
        </CardContent>
      )}
    </Card>
  );
};

export default ListingCard;
