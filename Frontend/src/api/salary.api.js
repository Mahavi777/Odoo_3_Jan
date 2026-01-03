import api from '../services/api';

export const getAllSalaries = async () => {
    const response = await api.get('/salary');
    return response.data.data;
};

export const getSalary = async (userId) => {
    const response = await api.get(`/salary/${userId}`);
    return response.data.data;
};

export const setOrUpdateSalary = async (userId, data) => {
    const response = await api.post(`/salary/${userId}`, data);
    return response.data.data;
};

export const getSalaryStructure = async (userId) => {
    const response = await api.get(`/salary/structure/${userId}`);
    return response.data;
};

export const createSalaryStructure = async (data) => {
    const response = await api.post('/salary/structure', data);
    return response.data;
};

export const updateSalaryStructure = async (userId, data) => {
    const response = await api.put(`/salary/structure/${userId}`, data);
    return response.data;
};