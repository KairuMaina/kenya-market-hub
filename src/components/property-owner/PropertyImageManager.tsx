
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Upload, X, Star, Move } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

interface PropertyImageManagerProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  onNewImagesUpload: (files: File[]) => void;
  maxImages?: number;
  primaryImageIndex?: number;
  onPrimaryImageChange?: (index: number) => void;
}

const PropertyImageManager: React.FC<PropertyImageManagerProps> = ({
  images,
  onImagesChange,
  onNewImagesUpload,
  maxImages = 10,
  primaryImageIndex = 0,
  onPrimaryImageChange
}) => {
  const { toast } = useToast();
  const [draggedOver, setDraggedOver] = useState(false);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    if (files.length + images.length > maxImages) {
      toast({
        title: "Too many images",
        description: `Maximum ${maxImages} images allowed`,
        variant: "destructive"
      });
      return;
    }

    const validFiles = files.filter(file => file.type.startsWith('image/'));
    if (validFiles.length !== files.length) {
      toast({
        title: "Invalid file type",
        description: "Only image files are allowed",
        variant: "destructive"
      });
    }

    if (validFiles.length > 0) {
      onNewImagesUpload(validFiles);
    }
  }, [images.length, maxImages, onNewImagesUpload, toast]);

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setDraggedOver(false);
    
    const files = Array.from(event.dataTransfer.files);
    if (files.length + images.length > maxImages) {
      toast({
        title: "Too many images",
        description: `Maximum ${maxImages} images allowed`,
        variant: "destructive"
      });
      return;
    }

    const validFiles = files.filter(file => file.type.startsWith('image/'));
    if (validFiles.length > 0) {
      onNewImagesUpload(validFiles);
    }
  }, [images.length, maxImages, onNewImagesUpload, toast]);

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setDraggedOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDraggedOver(false);
  }, []);

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const newImages = Array.from(images);
    const [reorderedItem] = newImages.splice(result.source.index, 1);
    newImages.splice(result.destination.index, 0, reorderedItem);

    onImagesChange(newImages);
  };

  const setPrimaryImage = (index: number) => {
    if (onPrimaryImageChange) {
      onPrimaryImageChange(index);
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          draggedOver 
            ? 'border-purple-500 bg-purple-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-lg font-medium text-gray-700 mb-2">
          Drop images here or click to upload
        </p>
        <p className="text-sm text-gray-500 mb-4">
          {images.length} of {maxImages} images uploaded
        </p>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          id="image-upload"
        />
        <Button 
          type="button"
          variant="outline" 
          onClick={() => document.getElementById('image-upload')?.click()}
          disabled={images.length >= maxImages}
        >
          <Upload className="h-4 w-4 mr-2" />
          Choose Images
        </Button>
      </div>

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-4">Property Images</h3>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="images" direction="horizontal">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                >
                  {images.map((image, index) => (
                    <Draggable key={image} draggableId={image} index={index}>
                      {(provided, snapshot) => (
                        <Card
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`relative group ${snapshot.isDragging ? 'shadow-lg' : ''}`}
                        >
                          <CardContent className="p-2">
                            <div className="relative aspect-square">
                              <img
                                src={image}
                                alt={`Property image ${index + 1}`}
                                className="w-full h-full object-cover rounded-md"
                              />
                              
                              {/* Primary Image Badge */}
                              {index === primaryImageIndex && (
                                <Badge className="absolute top-2 left-2 bg-yellow-500">
                                  <Star className="h-3 w-3 mr-1" />
                                  Primary
                                </Badge>
                              )}

                              {/* Action Buttons */}
                              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                {index !== primaryImageIndex && onPrimaryImageChange && (
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="secondary"
                                    onClick={() => setPrimaryImage(index)}
                                    className="h-8 w-8 p-0"
                                  >
                                    <Star className="h-3 w-3" />
                                  </Button>
                                )}
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => removeImage(index)}
                                  className="h-8 w-8 p-0"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>

                              {/* Drag Handle */}
                              <div
                                {...provided.dragHandleProps}
                                className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded p-1"
                              >
                                <Move className="h-4 w-4 text-gray-600" />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      )}
    </div>
  );
};

export default PropertyImageManager;
