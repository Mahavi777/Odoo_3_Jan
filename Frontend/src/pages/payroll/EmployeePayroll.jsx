import React, { useState, useEffect } from 'react';
import { DollarSign, Calendar, Building2, FileText, Download, Loader2, AlertCircle } from 'lucide-react';
import { getMyPayroll } from '../../api/payroll.api';
import { toast } from 'react-toastify';

export default function EmployeePayroll() {
  const [payroll, setPayroll] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPayroll();
  }, []);

  const loadPayroll = async () => {
    try {
      setLoading(true);
      const data = await getMyPayroll();
      setPayroll(data);
    } catch (error) {
      console.error('Error loading payroll:', error);
      toast.error('Failed to load payroll information');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: payroll?.currency || 'INR',
    }).format(amount || 0);
  };

  const handleDownloadSlip = () => {
    // Generate PDF logic would go here
    toast.info('Salary slip download feature coming soon');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading payroll information...</p>
        </div>
      </div>
    );
  }

  if (!payroll) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Payroll Information</h2>
          <p className="text-gray-600">Your payroll information has not been set up yet. Please contact HR.</p>
        </div>
      </div>
    );
  }

  const salaryStructure = payroll.salaryStructure || {};
  const bankDetails = payroll.bankDetails || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <DollarSign className="w-8 h-8 text-indigo-600" />
                My Payroll
              </h1>
              <p className="text-gray-600 mt-1">View your salary and payroll information</p>
            </div>
            <button
              onClick={handleDownloadSlip}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
            >
              <Download className="w-5 h-5" />
              Download Salary Slip
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Salary Structure Card */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <FileText className="w-6 h-6 text-indigo-600" />
              Salary Structure
            </h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="text-gray-600 font-medium">Basic Salary</span>
                <span className="text-lg font-bold text-gray-900">{formatCurrency(salaryStructure.basicSalary)}</span>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="text-gray-600 font-medium">HRA (House Rent Allowance)</span>
                <span className="text-lg font-bold text-green-600">+ {formatCurrency(salaryStructure.hra)}</span>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="text-gray-600 font-medium">Allowances</span>
                <span className="text-lg font-bold text-green-600">+ {formatCurrency(salaryStructure.allowances)}</span>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="text-gray-600 font-medium">Deductions</span>
                <span className="text-lg font-bold text-red-600">- {formatCurrency(salaryStructure.deductions)}</span>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="text-gray-600 font-medium">Tax</span>
                <span className="text-lg font-bold text-red-600">- {formatCurrency(salaryStructure.tax)}</span>
              </div>
              
              <div className="flex justify-between items-center py-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl px-4 mt-4">
                <span className="text-lg font-bold text-gray-900">Net Salary</span>
                <span className="text-2xl font-bold text-indigo-600">{formatCurrency(salaryStructure.netSalary)}</span>
              </div>
            </div>
          </div>

          {/* Bank Details & Info Card */}
          <div className="space-y-6">
            {/* Bank Details */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Building2 className="w-6 h-6 text-indigo-600" />
                Bank Details
              </h2>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Bank Name</p>
                  <p className="text-gray-900 font-medium">{bankDetails.bankName || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Account Number</p>
                  <p className="text-gray-900 font-medium">{bankDetails.accountNumber ? `****${bankDetails.accountNumber.slice(-4)}` : 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">IFSC Code</p>
                  <p className="text-gray-900 font-medium">{bankDetails.ifscCode || 'Not provided'}</p>
                </div>
              </div>
            </div>

            {/* Payroll Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-indigo-600" />
                Payroll Information
              </h2>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Pay Frequency</p>
                  <p className="text-gray-900 font-medium">{payroll.payFrequency || 'Monthly'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Currency</p>
                  <p className="text-gray-900 font-medium">{payroll.currency || 'INR'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Effective Date</p>
                  <p className="text-gray-900 font-medium">
                    {payroll.effectiveDate ? new Date(payroll.effectiveDate).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    payroll.status === 'ACTIVE' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {payroll.status || 'ACTIVE'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

