import React, { useState, useEffect, useMemo } from 'react';
import { getAllUsers } from '../../api/user.api.js';
import { getSalaryStructure, createSalaryStructure, updateSalaryStructure } from '../../api/salary.api.js';
import { toast } from 'react-toastify';

const Salary = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');
    const [salaryStructure, setSalaryStructure] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const allUsers = await getAllUsers();
                setUsers(allUsers);
            } catch (error) {
                toast.error('Failed to fetch users');
            }
        };
        fetchUsers();
    }, []);

    useEffect(() => {
        if (selectedUser) {
            const fetchSalaryStructure = async () => {
                setLoading(true);
                try {
                    const structure = await getSalaryStructure(selectedUser);
                    setSalaryStructure(structure);
                } catch (error) {
                    setSalaryStructure({
                        wage: { monthlyWage: 0, workingDaysPerWeek: 5, breakTime: 1 },
                        components: [],
                        pfConfiguration: { pfPercentage: 12 },
                        deductions: [],
                    });
                    if (error.response && error.response.status === 404) {
                        toast.info('No salary structure found for this user. You can create one.');
                    } else {
                        toast.error('Failed to fetch salary structure');
                    }
                } finally {
                    setLoading(false);
                }
            };
            fetchSalaryStructure();
        } else {
            setSalaryStructure(null);
        }
    }, [selectedUser]);

    const handleInputChange = (e, section, index, field) => {
        const { value, type } = e.target;
        const updatedStructure = { ...salaryStructure };
        const parsedValue = type === 'number' ? parseFloat(value) : value;

        if (section) {
            if (index !== null) {
                updatedStructure[section][index][field] = parsedValue;
            } else {
                updatedStructure[section][field] = parsedValue;
            }
        } else {
            updatedStructure[field] = parsedValue;
        }

        setSalaryStructure(updatedStructure);
    };
    
    const addComponent = () => {
        const updatedStructure = { ...salaryStructure };
        updatedStructure.components.push({ name: '', computationType: 'PERCENTAGE', value: 0 });
        setSalaryStructure(updatedStructure);
    };

    const removeComponent = (index) => {
        const updatedStructure = { ...salaryStructure };
        updatedStructure.components.splice(index, 1);
        setSalaryStructure(updatedStructure);
    };

    const addDeduction = () => {
        const updatedStructure = { ...salaryStructure };
        updatedStructure.deductions.push({ name: '', amount: 0 });
        setSalaryStructure(updatedStructure);
    };

    const removeDeduction = (index) => {
        const updatedStructure = { ...salaryStructure };
        updatedStructure.deductions.splice(index, 1);
        setSalaryStructure(updatedStructure);
    };
    
    const handleSave = async () => {
        setLoading(true);
        try {
            if (salaryStructure._id) {
                await updateSalaryStructure(selectedUser, salaryStructure);
                toast.success('Salary structure updated successfully');
            } else {
                await createSalaryStructure({ ...salaryStructure, userId: selectedUser });
                toast.success('Salary structure created successfully');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save salary structure');
        } finally {
            setLoading(false);
        }
    };

    const summary = useMemo(() => {
        if (!salaryStructure) return { monthlyGrossSalary: 0, totalDeductions: 0, netSalary: 0 };

        let monthlyGrossSalary = 0;
        let basicSalary = 0;
        salaryStructure.components.forEach(c => {
            const value = c.computationType === 'PERCENTAGE' ? (salaryStructure.wage.monthlyWage * c.value) / 100 : c.value;
            monthlyGrossSalary += value;
            if(c.name.toLowerCase() === 'basic salary') basicSalary = value;
        });

        const employeePF = (basicSalary * salaryStructure.pfConfiguration.pfPercentage) / 100;
        let totalDeductions = employeePF;
        salaryStructure.deductions.forEach(d => {
            totalDeductions += d.amount;
        });

        const netSalary = monthlyGrossSalary - totalDeductions;
        return { monthlyGrossSalary, totalDeductions, netSalary };
    }, [salaryStructure]);
    
    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">Salary Management</h1>
                <div className="mb-6">
                    <label htmlFor="user-select" className="block text-sm font-medium text-gray-700">Select Employee</label>
                    <select
                        id="user-select"
                        value={selectedUser}
                        onChange={(e) => setSelectedUser(e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                        <option value="">-- Select an employee --</option>
                        {users.map(user => (
                            <option key={user._id} value={user._id}>{user.fullName} ({user.email})</option>
                        ))}
                    </select>
                </div>

                {loading && <div className="text-center">Loading...</div>}

                {selectedUser && !loading && salaryStructure && (
                    <div className="space-y-8">
                        {/* Wage Definition */}
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h2 className="text-xl font-semibold mb-4 text-gray-700">Wage Definition</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium">Monthly Wage</label>
                                    <input type="number" value={salaryStructure.wage.monthlyWage} onChange={(e) => handleInputChange(e, 'wage', null, 'monthlyWage')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Working Days/Week</label>
                                    <input type="number" value={salaryStructure.wage.workingDaysPerWeek} onChange={(e) => handleInputChange(e, 'wage', null, 'workingDaysPerWeek')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                                </div>
                            </div>
                        </div>

                        {/* Salary Components */}
                        <div className="bg-white p-6 rounded-lg shadow">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold text-gray-700">Salary Components (Earnings)</h2>
                                <button onClick={addComponent} className="text-indigo-600 hover:text-indigo-900 font-medium">Add Component</button>
                            </div>
                            <div className="space-y-4">
                                {salaryStructure.components.map((component, index) => (
                                    <div key={index} className="grid grid-cols-12 gap-4 items-center">
                                        <div className="col-span-4">
                                            <input type="text" placeholder="Component Name" value={component.name} onChange={(e) => handleInputChange(e, 'components', index, 'name')} className="block w-full rounded-md border-gray-300 shadow-sm" />
                                        </div>
                                        <div className="col-span-3">
                                            <select value={component.computationType} onChange={(e) => handleInputChange(e, 'components', index, 'computationType')} className="block w-full rounded-md border-gray-300 shadow-sm">
                                                <option value="PERCENTAGE">Percentage</option>
                                                <option value="FIXED">Fixed</option>
                                            </select>
                                        </div>
                                        <div className="col-span-3">
                                            <input type="number" placeholder="Value" value={component.value} onChange={(e) => handleInputChange(e, 'components', index, 'value')} className="block w-full rounded-md border-gray-300 shadow-sm" />
                                        </div>
                                        <div className="col-span-2">
                                            <button onClick={() => removeComponent(index)} className="text-red-600 hover:text-red-900">Remove</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* PF & Deductions */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-white p-6 rounded-lg shadow">
                                <h2 className="text-xl font-semibold mb-4 text-gray-700">Provident Fund (PF)</h2>
                                <div>
                                    <label className="block text-sm font-medium">PF Percentage</label>
                                    <input type="number" value={salaryStructure.pfConfiguration.pfPercentage} onChange={(e) => handleInputChange(e, 'pfConfiguration', null, 'pfPercentage')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-semibold text-gray-700">Deductions</h2>
                                    <button onClick={addDeduction} className="text-indigo-600 hover:text-indigo-900 font-medium">Add Deduction</button>
                                </div>
                                <div className="space-y-4">
                                    {salaryStructure.deductions.map((deduction, index) => (
                                        <div key={index} className="grid grid-cols-12 gap-4 items-center">
                                            <div className="col-span-6">
                                                <input type="text" placeholder="Deduction Name" value={deduction.name} onChange={(e) => handleInputChange(e, 'deductions', index, 'name')} className="block w-full rounded-md border-gray-300 shadow-sm" />
                                            </div>
                                            <div className="col-span-4">
                                                <input type="number" placeholder="Amount" value={deduction.amount} onChange={(e) => handleInputChange(e, 'deductions', index, 'amount')} className="block w-full rounded-md border-gray-300 shadow-sm" />
                                            </div>
                                            <div className="col-span-2">
                                                <button onClick={() => removeDeduction(index)} className="text-red-600 hover:text-red-900">Remove</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Salary Summary */}
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h2 className="text-xl font-semibold mb-4 text-gray-700">Salary Summary</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                                <div>
                                    <p className="text-sm text-gray-500">Monthly Gross Salary</p>
                                    <p className="text-2xl font-semibold text-green-600">₹{summary.monthlyGrossSalary.toFixed(2)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Total Deductions</p>
                                    <p className="text-2xl font-semibold text-red-600">₹{summary.totalDeductions.toFixed(2)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Net Salary</p>
                                    <p className="text-2xl font-semibold text-gray-800">₹{summary.netSalary.toFixed(2)}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <button onClick={handleSave} disabled={loading} className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400">
                                {loading ? 'Saving...' : (salaryStructure._id ? 'Update Structure' : 'Create Structure')}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Salary;
