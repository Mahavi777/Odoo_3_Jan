import React, { useState, useEffect } from 'react';
import { Loader2, User, DollarSign, Briefcase, Building, Hash, TrendingUp, TrendingDown, FileText } from 'lucide-react';
import { toast } from 'react-toastify';
import { getAllUsers } from '../../api/user.api';
import { getSalary, setOrUpdateSalary } from '../../api/salary.api';

const ManageSalary = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [loadingSalary, setLoadingSalary] = useState(false);
    const [salary, setSalary] = useState(null);
    const [wage, setWage] = useState('');

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            setLoadingUsers(true);
            const allUsers = await getAllUsers();
            setUsers(allUsers);
        } catch (error) {
            toast.error('Failed to load users');
        } finally {
            setLoadingUsers(false);
        }
    };

    const handleUserSelect = async (user) => {
        setSelectedUser(user);
        setSalary(null);
        setWage('');
        if (user) {
            try {
                setLoadingSalary(true);
                const salaryData = await getSalary(user._id);
                setSalary(salaryData);
                setWage(salaryData.wage.toString());
            } catch (error) {
                // It's okay if salary is not found, it means it's not set yet
                if (error.response && error.response.status !== 404) {
                    toast.error('Failed to load salary information');
                }
            } finally {
                setLoadingSalary(false);
            }
        }
    };

    const handleSaveSalary = async () => {
        if (!selectedUser || !wage) {
            toast.warn('Please select a user and enter a wage.');
            return;
        }

        try {
            setLoadingSalary(true);
            const updatedSalary = await setOrUpdateSalary(selectedUser._id, { wage: parseFloat(wage) });
            setSalary(updatedSalary);
            setWage(updatedSalary.wage.toString());
            toast.success('Salary updated successfully!');
        } catch (error) {
            toast.error('Failed to update salary.');
        } finally {
            setLoadingSalary(false);
        }
    };

    const InfoCard = ({ icon, label, value, color }) => (
        <div className={`bg-slate-800 p-4 rounded-lg flex items-center gap-4 border-l-4 ${color}`}>
            <div className="text-2xl">{icon}</div>
            <div>
                <p className="text-sm text-slate-400">{label}</p>
                <p className="text-lg font-bold text-white">
                    {typeof value === 'number' ? `₹ ${value.toLocaleString('en-IN', { maximumFractionDigits: 2 })}` : value}
                </p>
            </div>
        </div>
    );


    return (
        <div className="min-h-screen bg-slate-900 text-white p-4 sm:p-6 lg:p-8">
            <h1 className="text-3xl font-bold mb-6">Manage Employee Salaries</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* User List */}
                <div className="lg:col-span-1 bg-slate-800 rounded-xl p-6">
                    <h2 className="text-xl font-semibold mb-4">Employees</h2>
                    {loadingUsers ? (
                        <div className="flex justify-center items-center h-full">
                            <Loader2 className="animate-spin" />
                        </div>
                    ) : (
                        <ul className="space-y-2 max-h-[70vh] overflow-y-auto">
                            {users.map(user => (
                                <li key={user._id}
                                    onClick={() => handleUserSelect(user)}
                                    className={`p-3 rounded-lg cursor-pointer transition-colors ${selectedUser?._id === user._id ? 'bg-purple-600' : 'hover:bg-slate-700'}`}>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-bold">
                                            {user.fullName.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-semibold">{user.fullName}</p>
                                            <p className="text-sm text-slate-400">{user.email}</p>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Salary Details */}
                <div className="lg:col-span-2 bg-slate-800 rounded-xl p-6">
                    {selectedUser ? (
                        <>
                            <h2 className="text-2xl font-semibold mb-6">Salary for {selectedUser.fullName}</h2>

                            <div className="space-y-6">
                                <div className="flex flex-col sm:flex-row gap-4 items-end">
                                    <div className="flex-grow">
                                        <label htmlFor="wage" className="block text-sm font-medium text-slate-400 mb-2">
                                            Monthly CTC (Cost to Company)
                                        </label>
                                        <div className="relative">
                                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20}/>
                                            <input
                                                type="number"
                                                id="wage"
                                                value={wage}
                                                onChange={(e) => setWage(e.target.value)}
                                                className="w-full bg-slate-700 border border-slate-600 rounded-lg pl-10 pr-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                placeholder="e.g., 50000"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleSaveSalary}
                                        disabled={loadingSalary}
                                        className="w-full sm:w-auto px-6 py-3 bg-purple-600 rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {loadingSalary ? <Loader2 className="animate-spin"/> : 'Save'}
                                    </button>
                                </div>

                                {loadingSalary ? (
                                    <div className="flex justify-center items-center h-48">
                                        <Loader2 className="animate-spin text-purple-500" size={32}/>
                                    </div>
                                ) : salary ? (
                                    <div className="space-y-6 pt-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            <InfoCard icon={<DollarSign />} label="Monthly CTC" value={salary.ctc} color="border-purple-500" />
                                            <InfoCard icon={<FileText />} label="Net Salary" value={salary.netSalary} color="border-green-500" />
                                        </div>
                                        <h3 className="text-xl font-semibold border-b border-slate-700 pb-2">Breakdown</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <InfoCard icon={<TrendingUp />} label="Basic Salary" value={salary.basic} color="border-sky-500" />
                                            <InfoCard icon={<TrendingUp />} label="HRA" value={salary.hra} color="border-sky-500" />
                                            <InfoCard icon={<TrendingUp />} label="Allowances" value={salary.allowances} color="border-sky-500" />
                                            <InfoCard icon={<TrendingDown />} label="Provident Fund (PF)" value={salary.pf} color="border-red-500" />
                                            <InfoCard icon={<TrendingDown />} label="Tax" value={salary.tax} color="border-red-500" />
                                        </div>
                                    </div>
                                ) : (
                                     <div className="text-center py-12">
                                        <p className="text-slate-400">No salary information found for this user.</p>
                                        <p className="text-slate-500 text-sm">Enter a wage and save to set up salary.</p>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="flex justify-center items-center h-full">
                            <p className="text-slate-400">Select an employee to view or manage their salary.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManageSalary;
