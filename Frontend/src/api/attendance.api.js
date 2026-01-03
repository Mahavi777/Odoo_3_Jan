import api from '../services/api';

export const checkIn = async () => {
	const res = await api.post('/attendance/checkin');
	return res.data;
};

export const checkOut = async () => {
	const res = await api.post('/attendance/checkout');
	return res.data;
};

export const getMyAttendance = async (month, year) => {
	const params = {};
	if (month && year) {
		params.month = month;
		params.year = year;
	}
	const res = await api.get('/attendance/me', { params });
	return res.data;
};

export const getUserAttendance = async (userId, month, year) => {
	const params = {};
	if (month && year) {
		params.month = month;
		params.year = year;
	}
	const res = await api.get(`/attendance/user/${userId}`, { params });
	return res.data;
};
