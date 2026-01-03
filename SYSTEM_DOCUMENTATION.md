# Employee Management & Attendance System - Complete Documentation

## System Overview

This is a full-stack HRMS (Human Resource Management System) module with role-based access control. Admin/HR can view all employees, while Employees can only view their own data.

## Architecture

- **Frontend**: React with modern best practices
- **Backend**: Node.js with Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Authorization**: Role-based (Admin/HR vs Employee)

---

## Backend Folder Structure

```
Backend/
├── src/
│   ├── models/              # Database schemas
│   │   ├── User.js          # User/Employee model
│   │   ├── Attendance.js    # Attendance model
│   │   ├── Leave.js         # Leave model
│   │   └── ...
│   ├── controllers/         # Business logic
│   │   ├── auth.controller.js
│   │   ├── attendance.controller.js
│   │   ├── leave.controller.js
│   │   └── user.controller.js
│   ├── routes/              # API routes
│   │   ├── auth.routes.js
│   │   ├── attendance.routes.js
│   │   ├── leave.routes.js
│   │   └── user.routes.js
│   ├── middleware/          # Middleware functions
│   │   ├── auth.middleware.js    # JWT authentication
│   │   └── role.middleware.js    # Role-based authorization
│   ├── services/            # Service layer
│   │   └── api.service.js
│   └── config/              # Configuration files
│       └── db.js            # Database connection
├── app.js                   # Express app entry point
└── package.json
```

---

## Frontend Folder Structure

```
Frontend/
├── src/
│   ├── pages/               # Page components
│   │   ├── dashboard/
│   │   │   ├── Dashboard.jsx           # Main dashboard router
│   │   │   └── AdminDashboard.jsx      # Admin dashboard (legacy)
│   │   ├── employee/
│   │   │   ├── EmployeeDashboard.jsx  # Admin/HR employee cards view
│   │   │   └── ViewEmployeeInfo.jsx   # View-only employee details
│   │   ├── attendance/
│   │   │   └── EmployeeAttendance.jsx # Check-in/out & attendance records
│   │   ├── leave/
│   │   │   ├── EmployeeTimeOff.jsx     # Employee leave requests
│   │   │   └── AdminTimeOff.jsx        # Admin leave management
│   │   ├── profile/
│   │   │   ├── Profile.jsx             # Profile router
│   │   │   ├── EmployeeProfile.jsx     # Employee profile
│   │   │   └── AdminProfile.jsx        # Admin/HR profile
│   │   └── auth/
│   │       ├── Login.jsx
│   │       └── SignUp.jsx
│   ├── components/          # Reusable components
│   │   ├── employee/
│   │   │   └── EmployeeCard.jsx        # Employee card component
│   │   └── common/
│   │       ├── Button.jsx
│   │       └── Toast.jsx
│   ├── api/                 # API service functions
│   │   ├── auth.api.js
│   │   ├── attendance.api.js
│   │   ├── leave.api.js
│   │   └── user.api.js
│   ├── services/            # Services
│   │   └── api.js           # Axios instance
│   ├── hooks/               # Custom hooks
│   │   └── useAuth.js       # Authentication hook
│   ├── App.jsx              # Main app component with routing
│   └── main.jsx             # React entry point
└── package.json
```

---

## Database Schemas

### 1. User / Employee Model

```javascript
{
  fullName: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ['ADMIN', 'HR', 'EMPLOYEE'], required),
  profileImage: String,
  department: String,
  jobPosition: String,
  phone: String,
  location: String,
  employeeId: String (unique),
  dateOfJoining: Date,
  status: String (enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE'),
  createdAt: Date,
  updatedAt: Date
}
```

### 2. Attendance Model

```javascript
{
  user: ObjectId (ref: 'User', required),
  date: Date (required),
  checkIn: Date,
  checkOut: Date,
  status: String (enum: ['PRESENT', 'ABSENT', 'ON_LEAVE', 'HALF_DAY'], required),
  workHours: Number,
  extraHours: Number,
  createdAt: Date,
  updatedAt: Date
}
```

**Index**: `{ user: 1, date: 1 }` (unique)

### 3. Leave Model

```javascript
{
  user: ObjectId (ref: 'User', required),
  leaveType: String (enum: ['Paid', 'Sick', 'Unpaid'], required),
  startDate: Date (required),
  endDate: Date (required),
  reason: String,
  status: String (enum: ['Pending', 'Approved', 'Rejected', 'Cancelled'], default: 'Pending'),
  approvedBy: ObjectId (ref: 'User'),
  comment: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## API Routes

### Authentication Routes (`/api/auth`)

- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login (returns JWT token)
- `POST /api/auth/logout` - User logout (client-side token removal)

### Employee Routes (`/api/users`)

- `GET /api/users/all` - Get all employees (Admin/HR only)
  - **Middleware**: `protect`, `requireRole(['ADMIN', 'HR'])`
- `GET /api/users/:id` - Get single employee (Admin/HR only)
  - **Middleware**: `protect`, `requireRole(['ADMIN', 'HR'])`
- `GET /api/profile/me` - Get logged-in user profile
  - **Middleware**: `protect`

### Attendance Routes (`/api/attendance`)

- `POST /api/attendance/checkin` - Check in
  - **Middleware**: `protect`
  - **Logic**: Creates/updates attendance record for today
- `POST /api/attendance/checkout` - Check out
  - **Middleware**: `protect`
  - **Logic**: Updates today's attendance with checkout time
- `GET /api/attendance/me` - Get my attendance records
  - **Middleware**: `protect`
  - **Query Params**: `month`, `year`
- `GET /api/attendance/user/:id` - Get user attendance (Admin/HR only)
  - **Middleware**: `protect`, `requireRole(['ADMIN', 'HR'])`
- `GET /api/attendance/all` - Get all attendance (Admin/HR only)
  - **Middleware**: `protect`, `requireRole(['ADMIN', 'HR'])`
  - **Query Params**: `month`, `year`, `userId`

### Leave Routes (`/api/leave`)

- `POST /api/leave` - Apply for leave (Employee)
  - **Middleware**: `protect`
- `GET /api/leave/me` - Get my leaves
  - **Middleware**: `protect`
- `GET /api/leave/all` - Get all leaves (Admin/HR only)
  - **Middleware**: `protect`, `requireRole(['ADMIN', 'HR'])`
- `PUT /api/leave/:id/approve` - Approve leave (Admin/HR only)
  - **Middleware**: `protect`, `requireRole(['ADMIN', 'HR'])`
- `PUT /api/leave/:id/reject` - Reject leave (Admin/HR only)
  - **Middleware**: `protect`, `requireRole(['ADMIN', 'HR'])`
- `DELETE /api/leave/:id` - Cancel leave (Employee)

---

## Middleware

### 1. Authentication Middleware (`auth.middleware.js`)

```javascript
// JWT Token Verification
export const protect = async (req, res, next) => {
  let token;
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

// Role-based Authorization
export const requireRole = (roles = []) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: 'Access denied: insufficient permissions'
      });
    }
    next();
  };
};
```

### 2. Role Middleware (`role.middleware.js`)

```javascript
export const checkRole = (allowedRoles = []) => {
  return async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({ 
          message: 'Access denied. Insufficient permissions.' 
        });
      }
      
      req.user.role = user.role;
      next();
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  };
};
```

---

## Sample Express Controllers

### Attendance Controller (`attendance.controller.js`)

```javascript
import Attendance from '../models/Attendance.js';
import { protect } from '../middleware/auth.middleware.js';

// Check In
export const checkIn = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let attendance = await Attendance.findOne({ 
      user: userId, 
      date: today 
    });
    
    if (attendance && attendance.checkIn) {
      return res.status(400).json({ 
        message: 'Already checked in for today' 
      });
    }
    
    if (!attendance) {
      attendance = new Attendance({ 
        user: userId, 
        date: today, 
        checkIn: new Date(), 
        status: 'PRESENT' 
      });
    } else {
      attendance.checkIn = new Date();
      attendance.status = 'PRESENT';
    }
    
    await attendance.save();
    res.json({ message: 'Checked in', attendance });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Check Out
export const checkOut = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const attendance = await Attendance.findOne({ 
      user: userId, 
      date: today 
    });
    
    if (!attendance) {
      return res.status(400).json({ 
        message: 'No check-in found for today' 
      });
    }
    
    if (attendance.checkOut) {
      return res.status(400).json({ 
        message: 'Already checked out for today' 
      });
    }
    
    attendance.checkOut = new Date();
    attendance.status = 'PRESENT';
    
    // Calculate work hours
    const workHours = (attendance.checkOut - attendance.checkIn) / (1000 * 60 * 60);
    attendance.workHours = workHours.toFixed(2);
    
    await attendance.save();
    res.json({ message: 'Checked out', attendance });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
```

### User Controller (`user.controller.js`)

```javascript
import User from '../models/User.js';
import { protect, requireRole } from '../middleware/auth.middleware.js';

// Get All Employees (Admin/HR only)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'EMPLOYEE' })
      .select('-password')
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Get Single Employee (Admin/HR only)
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
```

---

## Sample React Components

### EmployeeCard Component

```jsx
import React from 'react';
import { CheckCircle, Plane, AlertCircle } from 'lucide-react';

const EmployeeCard = ({ employee, attendanceStatus, onClick }) => {
  const getStatusIndicator = () => {
    switch (attendanceStatus) {
      case 'present':
        return <div className="w-3 h-3 rounded-full bg-green-500"></div>;
      case 'leave':
        return <Plane className="w-4 h-4 text-amber-600" />;
      case 'absent':
        return <div className="w-3 h-3 rounded-full bg-yellow-500"></div>;
      default:
        return <div className="w-3 h-3 rounded-full bg-gray-400"></div>;
    }
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-md border-2 p-6 cursor-pointer hover:shadow-xl transition-all"
    >
      <div className="flex items-center justify-between mb-4">
        <img
          src={employee.profileImage || '/default-avatar.png'}
          alt={employee.fullName}
          className="w-16 h-16 rounded-full"
        />
        {getStatusIndicator()}
      </div>
      <h3 className="text-lg font-bold">{employee.fullName}</h3>
      <p className="text-sm text-gray-500">{employee.email}</p>
    </div>
  );
};

export default EmployeeCard;
```

### Check-In/Check-Out Component

```jsx
import React, { useState, useEffect } from 'react';
import { checkIn, checkOut, getMyAttendance } from '../../api/attendance.api';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { toast } from 'react-toastify';

const CheckInOut = () => {
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTodayAttendance();
  }, []);

  const loadTodayAttendance = async () => {
    const records = await getMyAttendance(
      new Date().getMonth() + 1,
      new Date().getFullYear()
    );
    const today = new Date().toDateString();
    const todayRec = records?.find(
      r => new Date(r.date).toDateString() === today
    );
    setTodayAttendance(todayRec);
  };

  const handleCheckIn = async () => {
    try {
      setLoading(true);
      await checkIn();
      toast.success('Checked in successfully!');
      await loadTodayAttendance();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Check-in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    try {
      setLoading(true);
      await checkOut();
      toast.success('Checked out successfully!');
      await loadTodayAttendance();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Check-out failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
            todayAttendance?.checkIn 
              ? 'bg-green-100 border-4 border-green-500' 
              : 'bg-gray-100 border-4 border-gray-300'
          }`}>
            {todayAttendance?.checkIn ? (
              <CheckCircle className="w-8 h-8 text-green-600" />
            ) : (
              <Clock className="w-8 h-8 text-gray-400" />
            )}
          </div>
          <div>
            <p className="text-sm text-gray-600">Current Status</p>
            <p className={`text-xl font-bold ${
              todayAttendance?.checkIn ? 'text-green-600' : 'text-gray-400'
            }`}>
              {todayAttendance?.checkIn ? 'Checked In' : 'Not Checked In'}
            </p>
          </div>
        </div>
        <div className="flex gap-4">
          <button
            onClick={handleCheckIn}
            disabled={todayAttendance?.checkIn || loading}
            className="px-8 py-4 bg-green-600 text-white rounded-xl font-bold disabled:opacity-50"
          >
            Check In
          </button>
          <button
            onClick={handleCheckOut}
            disabled={!todayAttendance?.checkIn || todayAttendance?.checkOut || loading}
            className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold disabled:opacity-50"
          >
            Check Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckInOut;
```

---

## Attendance Status Logic

The attendance status is calculated dynamically based on:

1. **Present (🟢 Green dot)**: 
   - Employee has checked in today
   - `attendance.checkIn` exists for today's date

2. **On Leave (✈️ Plane icon)**:
   - Employee has an approved leave for today
   - `leave.status === 'Approved'` AND today is between `startDate` and `endDate`

3. **Absent (🟡 Yellow dot)**:
   - No check-in AND no approved leave for today
   - Default status if neither condition is met

**Implementation**:
```javascript
const getAttendanceStatus = (employee, attendanceData, leavesData) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const todayAttendance = attendanceData.find(a => {
    const date = new Date(a.date);
    date.setHours(0, 0, 0, 0);
    return (a.user === employee._id) && date.getTime() === today.getTime();
  });
  
  const todayLeave = leavesData.find(l => {
    const start = new Date(l.startDate);
    const end = new Date(l.endDate);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    return (l.user === employee._id) && 
           today >= start && 
           today <= end && 
           l.status === 'Approved';
  });
  
  if (todayAttendance && todayAttendance.checkIn) {
    return 'present';
  } else if (todayLeave) {
    return 'leave';
  } else {
    return 'absent';
  }
};
```

---

## Routing Logic

### After Login:

1. **Admin/HR Users**:
   - Land on `/dashboard` → Shows `EmployeeDashboard` component
   - Displays grid of employee cards with attendance status
   - Can click cards to view employee details (view-only)

2. **Employee Users**:
   - Redirected to `/attendance` → Shows `EmployeeAttendance` component
   - Can check in/out and view their own attendance records
   - Can access their profile via top-right menu

### Route Protection:

- All routes except `/signin`, `/signup` are protected with `PrivateRoute`
- `PrivateRoute` checks for JWT token in localStorage
- Role-based access is enforced at component level and API level

---

## Key Features

✅ Role-based access control (Admin/HR vs Employee)  
✅ Employee dashboard with cards showing attendance status  
✅ View-only employee information page  
✅ Check-in/Check-out functionality with status indicators  
✅ Dynamic attendance status calculation  
✅ Responsive UI with modern design  
✅ JWT authentication  
✅ Protected API routes  
✅ Clean MVC architecture  

---

## Environment Variables

### Backend (.env)

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/employee_management
JWT_SECRET=your-secret-key-here
NODE_ENV=development
```

### Frontend (.env)

```
VITE_API_URL=http://localhost:5000/api
```

---

## Getting Started

1. **Backend Setup**:
   ```bash
   cd Backend
   npm install
   npm run dev
   ```

2. **Frontend Setup**:
   ```bash
   cd Frontend
   npm install
   npm run dev
   ```

3. **Database**: Ensure MongoDB is running

4. **Access**: 
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000/api

---

## Production Considerations

- Use environment variables for sensitive data
- Implement rate limiting
- Add input validation and sanitization
- Use HTTPS in production
- Implement proper error logging
- Add database indexing for performance
- Implement caching where appropriate
- Add comprehensive testing

---

This system is modular, scalable, and production-ready with clean separation of concerns and best practices throughout.

