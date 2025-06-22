
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, TrendingUp, Calendar, Clock } from 'lucide-react';
import { useDriverEarnings } from '@/hooks/useDriverMatching';

const DriverEarningsCard = () => {
  const { data: earnings, isLoading } = useDriverEarnings();

  if (isLoading) {
    return (
      <Card className="shadow-lg">
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
          <span className="ml-2">Loading earnings...</span>
        </CardContent>
      </Card>
    );
  }

  if (!earnings) {
    return (
      <Card className="shadow-lg">
        <CardContent className="text-center py-8">
          <p className="text-gray-600">No earnings data available</p>
        </CardContent>
      </Card>
    );
  }

  // Calculate commission (5% of total earnings)
  const totalCommission = earnings.totalEarnings * 0.05;
  const netEarnings = earnings.totalEarnings - totalCommission;

  return (
    <div className="space-y-4">
      {/* Total Earnings Summary */}
      <Card className="shadow-lg border-2 border-green-200 bg-gradient-to-br from-green-50 to-white">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl flex items-center gap-2 text-green-800">
            <DollarSign className="h-6 w-6" />
            Total Earnings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-green-100 rounded-lg">
              <p className="text-2xl font-bold text-green-700">
                KSh {netEarnings.toLocaleString()}
              </p>
              <p className="text-sm text-green-600">Net Earnings</p>
            </div>
            <div className="text-center p-4 bg-orange-100 rounded-lg">
              <p className="text-2xl font-bold text-orange-700">
                KSh {totalCommission.toLocaleString()}
              </p>
              <p className="text-sm text-orange-600">Commission (5%)</p>
            </div>
          </div>
          
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center gap-4">
              <div>
                <p className="text-lg font-bold text-gray-700">{earnings.ridesCompleted}</p>
                <p className="text-xs text-gray-500">Total Trips</p>
              </div>
              <div>
                <p className="text-lg font-bold text-gray-700">
                  KSh {earnings.totalEarnings.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">Gross Earnings</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Today's Earnings */}
      <Card className="shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2 text-blue-800">
            <Clock className="h-5 w-5" />
            Today's Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <p className="font-bold text-blue-700">0</p>
              <p className="text-xs text-blue-600">Trips</p>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <p className="font-bold text-green-700">KSh 0</p>
              <p className="text-xs text-green-600">Net</p>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <p className="font-bold text-orange-700">KSh 0</p>
              <p className="text-xs text-orange-600">Commission</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Earnings */}
      <Card className="shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2 text-purple-800">
            <Calendar className="h-5 w-5" />
            This Week
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <p className="font-bold text-purple-700">{earnings.ridesCompleted}</p>
              <p className="text-xs text-purple-600">Trips</p>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <p className="font-bold text-green-700">
                KSh {netEarnings.toLocaleString()}
              </p>
              <p className="text-xs text-green-600">Net</p>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <p className="font-bold text-orange-700">
                KSh {totalCommission.toLocaleString()}
              </p>
              <p className="text-xs text-orange-600">Commission</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Commission Info */}
      <Card className="shadow-lg border-orange-200">
        <CardContent className="pt-6">
          <div className="text-center">
            <Badge variant="outline" className="text-orange-700 border-orange-300">
              <TrendingUp className="h-3 w-3 mr-1" />
              5% Platform Commission
            </Badge>
            <p className="text-xs text-gray-500 mt-2">
              Commission is automatically deducted from each completed trip
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DriverEarningsCard;
