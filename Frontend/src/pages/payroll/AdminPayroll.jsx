import React, { useState, useEffect } from 'react';
import { DollarSign, Search, Plus, Edit2, Save, X, Download, Mail, CheckCircle, AlertCircle, Loader2, Users, FileText, Calculator } from 'lucide-react';
import { getAllPayrolls, getUserPayroll, updatePayrollByUserId, createPayroll } from '../../api/payroll.api';
import { getAllUsers } from '../../api/user.api';
import { toast } from 'react-toastify';

export default function AdminPayroll() {
  const [payrolls, setPayrolls] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    basicSalary: 0,
    hra: 0,
    allowances: 0,
    deductions: 0,
    tax: 0,
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    payFrequency: 'Monthly',
    currency: 'INR',
    effectiveDate: new Date().toISOString().split('T')[0],
    status: 'ACTIVE',
  });
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [payrollsData, usersData] = await Promise.all([
        getAllPayrolls(),
        getAllUsers(),
      ]);
      setPayrolls(payrollsData);
      setEmployees(usersData.filter(u => u.role === 'EMPLOYEE'));
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load payroll data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validatePayroll = () => {
    const errors = {};
    
    if (!formData.basicSalary || formData.basicSalary < 0) {
      errors.basicSalary = 'Basic salary must be a positive number';
    }
    if (formData.hra < 0) errors.hra = 'HRA cannot be negative';
    if (formData.allowances < 0) errors.allowances = 'Allowances cannot be negative';
    if (formData.deductions < 0) errors.deductions = 'Deductions cannot be negative';
    if (formData.tax < 0) errors.tax = 'Tax cannot be negative';
    
    const netSalary = (formData.basicSalary || 0) + (formData.hra || 0) + (formData.allowances || 0) - (formData.deductions || 0) - (formData.tax || 0);
    if (netSalary < 0) {
      errors.netSalary = 'Net salary cannot be negative';
    }
    
    if (formData.bankName && !formData.accountNumber) {
      errors.accountNumber = 'Account number is required if bank name is provided';
    }
    if (formData.accountNumber && !formData.ifscCode) {
      errors.ifscCode = 'IFSC code is required if account number is provided';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const calculateNetSalary = () => {
    const basic = parseFloat(formData.basicSalary) || 0;
    const hra = parseFloat(formData.hra) || 0;
    const allowances = parseFloat(formData.allowances) || 0;
    const deductions = parseFloat(formData.deductions) || 0;
    const tax = parseFloat(formData.tax) || 0;
    return basic + hra + allowances - deductions - tax;
  };

  const handleEdit = async (employeeId) => {
    try {
      setLoading(true);
      const payroll = await getUserPayroll(employeeId);
      const employee = employees.find(e => e._id === employeeId);
      setSelectedEmployee(employee);
      
      if (payroll) {
        setFormData({
          basicSalary: payroll.salaryStructure?.basicSalary || 0,
          hra: payroll.salaryStructure?.hra || 0,
          allowances: payroll.salaryStructure?.allowances || 0,
          deductions: payroll.salaryStructure?.deductions || 0,
          tax: payroll.salaryStructure?.tax || 0,
          bankName: payroll.bankDetails?.bankName || '',
          accountNumber: payroll.bankDetails?.accountNumber || '',
          ifscCode: payroll.bankDetails?.ifscCode || '',
          payFrequency: payroll.payFrequency || 'Monthly',
          currency: payroll.currency || 'INR',
          effectiveDate: payroll.effectiveDate ? new Date(payroll.effectiveDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          status: payroll.status || 'ACTIVE',
        });
      }
      setIsEditing(true);
    } catch (error) {
      console.error('Error loading payroll:', error);
      toast.error('Failed to load payroll information');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!validatePayroll()) {
      toast.error('Please fix validation errors before saving');
      return;
    }

    try {
      setSaving(true);
      const payrollData = {
        salaryStructure: {
          basicSalary: parseFloat(formData.basicSalary),
          hra: parseFloat(formData.hra),
          allowances: parseFloat(formData.allowances),
          deductions: parseFloat(formData.deductions),
          tax: parseFloat(formData.tax),
        },
        bankDetails: {
          bankName: formData.bankName,
          accountNumber: formData.accountNumber,
          ifscCode: formData.ifscCode,
        },
        payFrequency: formData.payFrequency,
        currency: formData.currency,
        effectiveDate: formData.effectiveDate,
        status: formData.status,
      };

      if (selectedEmployee) {
        await updatePayrollByUserId(selectedEmployee._id, payrollData);
        toast.success('Payroll updated successfully!');
      } else {
        toast.error('No employee selected');
        return;
      }

      setIsEditing(false);
      setSelectedEmployee(null);
      loadData();
    } catch (error) {
      console.error('Error saving payroll:', error);
      toast.error(error.response?.data?.message || 'Failed to update payroll');
    } finally {
      setSaving(false);
    }
  };

  const handleCreate = async () => {
    if (!selectedEmployee) {
      toast.error('Please select an employee');
      return;
    }

    if (!validatePayroll()) {
      toast.error('Please fix validation errors before creating');
      return;
    }

    try {
      setSaving(true);
      const payrollData = {
        userId: selectedEmployee._id,
        salaryStructure: {
          basicSalary: parseFloat(formData.basicSalary),
          hra: parseFloat(formData.hra),
          allowances: parseFloat(formData.allowances),
          deductions: parseFloat(formData.deductions),
          tax: parseFloat(formData.tax),
        },
        bankDetails: {
          bankName: formData.bankName,
          accountNumber: formData.accountNumber,
          ifscCode: formData.ifscCode,
        },
        payFrequency: formData.payFrequency,
        currency: formData.currency,
        effectiveDate: formData.effectiveDate,
      };

      await createPayroll(payrollData);
      toast.success('Payroll created successfully!');
      setShowCreateModal(false);
      setSelectedEmployee(null);
      loadData();
    } catch (error) {
      console.error('Error creating payroll:', error);
      toast.error(error.response?.data?.message || 'Failed to create payroll');
    } finally {
      setSaving(false);
    }
  };

  const handleGenerateSlip = async (employeeId) => {
    toast.info('Salary slip generation feature coming soon');
    // Implementation for generating and sending salary slips
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount || 0);
  };

  const filteredPayrolls = payrolls.filter(p => {
    const userName = p.user?.fullName || p.user?.email || '';
    return userName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (loading && !payrolls.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading payroll data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <DollarSign className="w-8 h-8 text-indigo-600" />
                Payroll Management
              </h1>
              <p className="text-gray-600 mt-1">Manage all employee payrolls and salary structures</p>
            </div>
            <button
              onClick={() => {
                setSelectedEmployee(null);
                setFormData({
                  basicSalary: 0,
                  hra: 0,
                  allowances: 0,
                  deductions: 0,
                  tax: 0,
                  bankName: '',
                  accountNumber: '',
                  ifscCode: '',
                  payFrequency: 'Monthly',
                  currency: 'INR',
                  effectiveDate: new Date().toISOString().split('T')[0],
                  status: 'ACTIVE',
                });
                setShowCreateModal(true);
              }}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
            >
              <Plus className="w-5 h-5" />
              Create Payroll
            </button>
          </div>
        </div>

        {isEditing ? (
          /* Edit Form */
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Edit Payroll - {selectedEmployee?.fullName || selectedEmployee?.email}
              </h2>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setSelectedEmployee(null);
                    setValidationErrors({});
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <X className="w-5 h-5 inline mr-2" />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Salary Structure */}
              <div className="lg:col-span-2">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-indigo-600" />
                  Salary Structure
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Basic Salary *</label>
                    <input
                      type="number"
                      value={formData.basicSalary}
                      onChange={(e) => handleInputChange('basicSalary', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${validationErrors.basicSalary ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {validationErrors.basicSalary && (
                      <p className="text-red-500 text-sm mt-1">{validationErrors.basicSalary}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">HRA</label>
                    <input
                      type="number"
                      value={formData.hra}
                      onChange={(e) => handleInputChange('hra', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${validationErrors.hra ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {validationErrors.hra && (
                      <p className="text-red-500 text-sm mt-1">{validationErrors.hra}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Allowances</label>
                    <input
                      type="number"
                      value={formData.allowances}
                      onChange={(e) => handleInputChange('allowances', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${validationErrors.allowances ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {validationErrors.allowances && (
                      <p className="text-red-500 text-sm mt-1">{validationErrors.allowances}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Deductions</label>
                    <input
                      type="number"
                      value={formData.deductions}
                      onChange={(e) => handleInputChange('deductions', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${validationErrors.deductions ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {validationErrors.deductions && (
                      <p className="text-red-500 text-sm mt-1">{validationErrors.deductions}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tax</label>
                    <input
                      type="number"
                      value={formData.tax}
                      onChange={(e) => handleInputChange('tax', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${validationErrors.tax ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {validationErrors.tax && (
                      <p className="text-red-500 text-sm mt-1">{validationErrors.tax}</p>
                    )}
                  </div>
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Net Salary (Calculated)</label>
                    <p className="text-2xl font-bold text-indigo-600">{formatCurrency(calculateNetSalary())}</p>
                    {validationErrors.netSalary && (
                      <p className="text-red-500 text-sm mt-1">{validationErrors.netSalary}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Bank Details */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Bank Details</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
                    <input
                      type="text"
                      value={formData.bankName}
                      onChange={(e) => handleInputChange('bankName', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                    <input
                      type="text"
                      value={formData.accountNumber}
                      onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${validationErrors.accountNumber ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {validationErrors.accountNumber && (
                      <p className="text-red-500 text-sm mt-1">{validationErrors.accountNumber}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">IFSC Code</label>
                    <input
                      type="text"
                      value={formData.ifscCode}
                      onChange={(e) => handleInputChange('ifscCode', e.target.value.toUpperCase())}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${validationErrors.ifscCode ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {validationErrors.ifscCode && (
                      <p className="text-red-500 text-sm mt-1">{validationErrors.ifscCode}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Payroll Settings */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Payroll Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pay Frequency</label>
                    <select
                      value={formData.payFrequency}
                      onChange={(e) => handleInputChange('payFrequency', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="Monthly">Monthly</option>
                      <option value="Bi-weekly">Bi-weekly</option>
                      <option value="Weekly">Weekly</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                    <select
                      value={formData.currency}
                      onChange={(e) => handleInputChange('currency', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="INR">INR (₹)</option>
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Effective Date</label>
                    <input
                      type="date"
                      value={formData.effectiveDate}
                      onChange={(e) => handleInputChange('effectiveDate', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="ACTIVE">Active</option>
                      <option value="INACTIVE">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Search Bar */}
            <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search employees..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Payroll List */}
            <div className="grid grid-cols-1 gap-4">
              {filteredPayrolls.map((payroll) => {
                const employee = payroll.user;
                const netSalary = payroll.salaryStructure?.netSalary || 0;
                
                return (
                  <div key={payroll._id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                          {employee?.fullName?.charAt(0) || employee?.email?.charAt(0) || 'E'}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{employee?.fullName || employee?.email || 'Unknown'}</h3>
                          <p className="text-sm text-gray-500">{employee?.email}</p>
                          <p className="text-xs text-gray-400">{employee?.employeeId || 'N/A'}</p>
                        </div>
                      </div>
                      
                      <div className="text-right mr-8">
                        <p className="text-sm text-gray-500">Net Salary</p>
                        <p className="text-2xl font-bold text-indigo-600">{formatCurrency(netSalary)}</p>
                        <p className="text-xs text-gray-400 mt-1">{payroll.payFrequency || 'Monthly'}</p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(employee?._id)}
                          className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors flex items-center gap-2"
                        >
                          <Edit2 className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleGenerateSlip(employee?._id)}
                          className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors flex items-center gap-2"
                        >
                          <Download className="w-4 h-4" />
                          Generate Slip
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-4 pt-4 border-t border-gray-200">
                      <div>
                        <p className="text-xs text-gray-500">Basic</p>
                        <p className="text-sm font-semibold">{formatCurrency(payroll.salaryStructure?.basicSalary)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">HRA</p>
                        <p className="text-sm font-semibold text-green-600">+ {formatCurrency(payroll.salaryStructure?.hra)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Allowances</p>
                        <p className="text-sm font-semibold text-green-600">+ {formatCurrency(payroll.salaryStructure?.allowances)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Deductions</p>
                        <p className="text-sm font-semibold text-red-600">- {formatCurrency(payroll.salaryStructure?.deductions)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Tax</p>
                        <p className="text-sm font-semibold text-red-600">- {formatCurrency(payroll.salaryStructure?.tax)}</p>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          payroll.status === 'ACTIVE' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {payroll.status}
                        </span>
                        <span className="text-gray-500">
                          Effective: {payroll.effectiveDate ? new Date(payroll.effectiveDate).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredPayrolls.length === 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">No Payrolls Found</h3>
                <p className="text-gray-600 mb-6">Create a new payroll or adjust your search query</p>
              </div>
            )}
          </>
        )}

        {/* Create Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Create New Payroll</h2>
                  <button
                    onClick={() => {
                      setShowCreateModal(false);
                      setSelectedEmployee(null);
                      setValidationErrors({});
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Employee</label>
                  <select
                    value={selectedEmployee?._id || ''}
                    onChange={(e) => {
                      const empId = e.target.value;
                      const emp = employees.find(emp => emp._id === empId);
                      setSelectedEmployee(emp);
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select an employee...</option>
                    {employees
                      .filter(emp => !payrolls.find(p => p.user?._id === emp._id))
                      .map(emp => (
                        <option key={emp._id} value={emp._id}>
                          {emp.fullName} ({emp.email})
                        </option>
                      ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Basic Salary *</label>
                    <input
                      type="number"
                      value={formData.basicSalary}
                      onChange={(e) => handleInputChange('basicSalary', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${validationErrors.basicSalary ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {validationErrors.basicSalary && (
                      <p className="text-red-500 text-sm mt-1">{validationErrors.basicSalary}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">HRA</label>
                    <input
                      type="number"
                      value={formData.hra}
                      onChange={(e) => handleInputChange('hra', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Allowances</label>
                    <input
                      type="number"
                      value={formData.allowances}
                      onChange={(e) => handleInputChange('allowances', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Deductions</label>
                    <input
                      type="number"
                      value={formData.deductions}
                      onChange={(e) => handleInputChange('deductions', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tax</label>
                    <input
                      type="number"
                      value={formData.tax}
                      onChange={(e) => handleInputChange('tax', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Net Salary</label>
                    <p className="text-xl font-bold text-indigo-600">{formatCurrency(calculateNetSalary())}</p>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => {
                      setShowCreateModal(false);
                      setSelectedEmployee(null);
                      setValidationErrors({});
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreate}
                    disabled={saving || !selectedEmployee}
                    className="flex-1 px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    {saving ? 'Creating...' : 'Create Payroll'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

