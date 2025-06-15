
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAddFareCalculation, NewFareData } from '@/hooks/useRidePricing';
import { Loader2 } from 'lucide-react';

const fareSchema = z.object({
  vehicle_type: z.enum(['sedan', 'suv', 'van', 'boda']),
  base_fare: z.coerce.number().min(0, "Base fare must be non-negative"),
  per_km_rate: z.coerce.number().min(0, "Rate per KM must be non-negative"),
  per_minute_rate: z.coerce.number().min(0, "Rate per minute must be non-negative"),
  minimum_fare: z.coerce.number().min(0, "Minimum fare must be non-negative"),
});

interface AddFareModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const AddFareModal: React.FC<AddFareModalProps> = ({ isOpen, onOpenChange }) => {
  const { mutate: addFare, isPending } = useAddFareCalculation();

  const form = useForm<NewFareData>({
    resolver: zodResolver(fareSchema),
    defaultValues: {
      vehicle_type: 'sedan',
      base_fare: 0,
      per_km_rate: 0,
      per_minute_rate: 0,
      minimum_fare: 0,
    },
  });

  const onSubmit = (values: NewFareData) => {
    addFare(values, {
      onSuccess: () => {
        form.reset();
        onOpenChange(false);
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Fare Calculation</DialogTitle>
          <DialogDescription>
            Set the pricing for a new vehicle type.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="vehicle_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vehicle Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a vehicle type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="sedan">Sedan</SelectItem>
                      <SelectItem value="suv">SUV</SelectItem>
                      <SelectItem value="van">Van</SelectItem>
                      <SelectItem value="boda">Boda</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField control={form.control} name="base_fare" render={({ field }) => (
                <FormItem>
                  <FormLabel>Base Fare (KSH)</FormLabel>
                  <FormControl><Input type="number" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField control={form.control} name="per_km_rate" render={({ field }) => (
                <FormItem>
                  <FormLabel>Rate per KM (KSH)</FormLabel>
                  <FormControl><Input type="number" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField control={form.control} name="per_minute_rate" render={({ field }) => (
                <FormItem>
                  <FormLabel>Rate per Minute (KSH)</FormLabel>
                  <FormControl><Input type="number" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField control={form.control} name="minimum_fare" render={({ field }) => (
                <FormItem>
                  <FormLabel>Minimum Fare (KSH)</FormLabel>
                  <FormControl><Input type="number" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Fare
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddFareModal;
