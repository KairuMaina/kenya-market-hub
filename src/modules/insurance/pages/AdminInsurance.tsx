import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Plus, Search, Shield } from 'lucide-react';
import { useInsurance } from '../hooks/useInsurance';
import { InsurancePlan } from '../types';
import AdminLayout from '@/components/admin/AdminLayout';
import ProtectedAdminRoute from '@/components/ProtectedAdminRoute';

const AdminInsurance: React.FC = () => {
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState<InsurancePlan | null>(null);
  const { loading, error, getInsurancePlans } = useInsurance();
  const [plans, setPlans] = useState<InsurancePlan[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    providerName: '',
    coverageType: '',
    premium: 0,
    coverageAmount: 0,
    features: '',
    terms: '',
    isActive: true
  });

  useEffect(() => {
    fetchPlans();
  }, [search]);

  const fetchPlans = async () => {
    const fetchedPlans = await getInsurancePlans();
    setPlans(fetchedPlans);
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement create/update plan functionality
    setShowForm(false);
    await fetchPlans();
  };

  const handleAddPlan = () => {
    setEditingPlan(null);
    setFormData({
      name: '',
      description: '',
      category: '',
      providerName: '',
      coverageType: '',
      premium: 0,
      coverageAmount: 0,
      features: '',
      terms: '',
      isActive: true
    });
    setShowForm(true);
  };

  const handleEditPlan = (plan: InsurancePlan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      description: plan.description,
      category: plan.category,
      providerName: plan.providerName || '',
      coverageType: plan.coverageType,
      premium: plan.premium,
      coverageAmount: plan.coverageAmount,
      features: plan.features.join('\n'),
      terms: plan.terms,
      isActive: plan.isActive
    });
    setShowForm(true);
  };

  const handleDeletePlan = async (id: string) => {
    // TODO: Implement delete plan functionality
    await fetchPlans();
  };

  return (
    <ProtectedAdminRoute>
      <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold mb-2">Insurance Hub Management</h1>
            <p className="text-gray-600">
              {loading ? 'Loading...' : `${plans.length} Total Plans`}
            </p>
          </div>
          <Button onClick={handleAddPlan}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Plan
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Total Plans</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{plans.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Active Plans</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {plans.filter(p => p.isActive).length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Total Providers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {new Set(plans.map(p => p.providerName)).size}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {new Set(plans.map(p => p.category)).size}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Insurance Plans</CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search plans..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Premium</TableHead>
                    <TableHead>Coverage</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : plans.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="text-center">
                          <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-semibold mb-2">No plans found</h3>
                          <p className="text-gray-600 mb-4">
                            Get started by adding your first insurance plan.
                          </p>
                          <Button onClick={handleAddPlan}>Add New Plan</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    plans.map((plan) => (
                      <TableRow key={plan.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{plan.name}</div>
                            <div className="text-sm text-gray-500">{plan.coverageType}</div>
                          </div>
                        </TableCell>
                        <TableCell>{plan.providerName || '-'}</TableCell>
                        <TableCell>{plan.category}</TableCell>
                        <TableCell>KSh {plan.premium.toLocaleString()}</TableCell>
                        <TableCell>KSh {plan.coverageAmount.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant={plan.isActive ? 'default' : 'secondary'}>
                            {plan.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditPlan(plan)}
                            >
                              Edit
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                >
                                  Delete
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Plan</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this insurance plan? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeletePlan(plan.id)}
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingPlan ? 'Edit Insurance Plan' : 'Create New Insurance Plan'}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Plan Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="providerName">Provider Name</Label>
                  <Input
                    id="providerName"
                    name="providerName"
                    value={formData.providerName}
                    onChange={handleFormChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleFormChange}
                    className="w-full border rounded-md p-2"
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="Medical">Medical</option>
                    <option value="Motor">Motor</option>
                    <option value="Life/Accident">Life/Accident</option>
                    <option value="Business/Property">Business/Property</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="coverageType">Coverage Type *</Label>
                  <select
                    id="coverageType"
                    name="coverageType"
                    value={formData.coverageType}
                    onChange={handleFormChange}
                    className="w-full border rounded-md p-2"
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="Comprehensive">Comprehensive</option>
                    <option value="Third Party">Third Party</option>
                    <option value="Basic">Basic</option>
                    <option value="Premium">Premium</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="premium">Premium (KSh) *</Label>
                  <Input
                    id="premium"
                    name="premium"
                    type="number"
                    value={formData.premium}
                    onChange={handleFormChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="coverageAmount">Coverage Amount (KSh) *</Label>
                  <Input
                    id="coverageAmount"
                    name="coverageAmount"
                    type="number"
                    value={formData.coverageAmount}
                    onChange={handleFormChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="features">Features (one per line) *</Label>
                <Textarea
                  id="features"
                  name="features"
                  value={formData.features}
                  onChange={handleFormChange}
                  rows={4}
                  placeholder="Enter each feature on a new line"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="terms">Terms and Conditions *</Label>
                <Textarea
                  id="terms"
                  name="terms"
                  value={formData.terms}
                  onChange={handleFormChange}
                  rows={3}
                  required
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setEditingPlan(null);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingPlan ? 'Update Plan' : 'Create Plan'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      </AdminLayout>
    </ProtectedAdminRoute>
  );
};

export default AdminInsurance;
