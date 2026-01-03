import Leave from '../models/Leave.js';
import User from '../models/User.js';
import Activity from '../models/Activity.js';
import Attendance from '../models/Attendance.js';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// @route   POST /api/leave
// @desc    Apply for leave (Employee)
// @access  Private
export const applyForLeave = async (req, res) => {
  try {
    const { leaveType, startDate, endDate, reason } = req.body;
    const userId = req.user.id;

    if (!leaveType || !startDate || !endDate || !reason) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ message: 'Invalid date format' });
    }

    if (start > end) {
      return res.status(400).json({ message: 'Start date must be before end date' });
    }

    if (start < today) {
      return res.status(400).json({ message: 'Start date cannot be in the past' });
    }

    const leave = new Leave({
      user: userId,
      leaveType,
      startDate: start,
      endDate: end,
      reason,
      status: 'Pending',
    });

    await leave.save();

    // Log activity (don't fail if this fails)
    try {
      await Activity.create({
        user: userId,
        activityType: 'leave_apply',
        description: `Applied for ${leaveType} leave from ${startDate} to ${endDate}`,
      });
    } catch (activityError) {
      console.error('Error logging activity:', activityError);
      // Continue even if activity logging fails
    }

    // Notify HR/Admin via email (don't fail if email fails)
    try {
      const user = await User.findById(userId);
      if (user) {
        const admins = await User.find({ role: { $in: ['ADMIN', 'HR'] } });
        
        if (admins.length > 0 && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
          const adminEmails = admins.map(admin => admin.email).filter(email => email);
          
          if (adminEmails.length > 0) {
            const mailOptions = {
              from: process.env.EMAIL_USER,
              to: adminEmails.join(', '),
              subject: `New Leave Request - ${user.fullName}`,
              html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                  <h2 style="color: #4F46E5;">New Leave Request</h2>
                  <p><strong>Employee:</strong> ${user.fullName} (${user.employeeId || user.email})</p>
                  <p><strong>Leave Type:</strong> ${leaveType}</p>
                  <p><strong>Start Date:</strong> ${startDate}</p>
                  <p><strong>End Date:</strong> ${endDate}</p>
                  <p><strong>Reason:</strong> ${reason}</p>
                  <p>Please review and approve/reject this request.</p>
                </div>
              `,
            };

            transporter.sendMail(mailOptions, (error) => {
              if (error) {
                console.error('Error sending leave notification email:', error);
              }
            });
          }
        }
      }
    } catch (emailError) {
      console.error('Error sending notification email:', emailError);
      // Continue even if email fails
    }

    res.status(201).json(leave);
  } catch (err) {
    console.error('Apply leave error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @route   GET /api/leave/me
// @desc    Get current user's leave requests
// @access  Private
export const getMyLeaves = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status, year } = req.query;

    let filter = { user: userId };
    if (status) {
      filter.status = status;
    }
    if (year) {
      const y = parseInt(year, 10);
      filter.$or = [
        { startDate: { $gte: new Date(y, 0, 1), $lt: new Date(y + 1, 0, 1) } },
        { endDate: { $gte: new Date(y, 0, 1), $lt: new Date(y + 1, 0, 1) } },
      ];
    }

    const leaves = await Leave.find(filter)
      .sort({ createdAt: -1 })
      .populate('approvedBy', 'fullName email');

    res.json(leaves);
  } catch (err) {
    console.error('Get my leaves error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @route   GET /api/leave/all
// @desc    Get all leave requests (Admin/HR only)
// @access  Private (Admin/HR)
export const getAllLeaves = async (req, res) => {
  try {
    const { status, userId, year } = req.query;

    let filter = {};
    if (status) filter.status = status;
    if (userId) filter.user = userId;
    if (year) {
      const y = parseInt(year, 10);
      filter.$or = [
        { startDate: { $gte: new Date(y, 0, 1), $lt: new Date(y + 1, 0, 1) } },
        { endDate: { $gte: new Date(y, 0, 1), $lt: new Date(y + 1, 0, 1) } },
      ];
    }

    const leaves = await Leave.find(filter)
      .populate('user', 'fullName email employeeId profileImage role')
      .populate('approvedBy', 'fullName email')
      .sort({ createdAt: -1 });

    res.json(leaves);
  } catch (err) {
    console.error('Get all leaves error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @route   PUT /api/leave/:id/approve
// @desc    Approve leave request (Admin/HR only)
// @access  Private (Admin/HR)
export const approveLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;
    const approverId = req.user.id;

    const leave = await Leave.findById(id).populate('user');
    if (!leave) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    if (leave.status !== 'Pending') {
      return res.status(400).json({ message: 'Leave request has already been processed' });
    }

    leave.status = 'Approved';
    leave.approvedBy = approverId;
    if (comment) {
      leave.comment = comment;
    }

    await leave.save();

    // Update attendance records for the leave period
    const startDate = new Date(leave.startDate);
    const endDate = new Date(leave.endDate);
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const dateStart = new Date(currentDate.setHours(0, 0, 0, 0));
      await Attendance.findOneAndUpdate(
        { user: leave.user._id, date: dateStart },
        { status: 'Leave', checkIn: null, checkOut: null },
        { upsert: true }
      );
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Log activity
    await Activity.create({
      user: approverId,
      activityType: 'leave_approve',
      description: `Approved leave request for ${leave.user.fullName}`,
    });

    // Notify employee via email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: leave.user.email,
      subject: 'Leave Request Approved - Dayflow HRMS',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #10B981;">Leave Request Approved</h2>
          <p>Your leave request has been approved.</p>
          <p><strong>Leave Type:</strong> ${leave.leaveType}</p>
          <p><strong>Start Date:</strong> ${leave.startDate.toLocaleDateString()}</p>
          <p><strong>End Date:</strong> ${leave.endDate.toLocaleDateString()}</p>
          ${comment ? `<p><strong>Comment:</strong> ${comment}</p>` : ''}
        </div>
      `,
    };

    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        console.error('Error sending approval email:', error);
      }
    });

    res.json(leave);
  } catch (err) {
    console.error('Approve leave error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @route   PUT /api/leave/:id/reject
// @desc    Reject leave request (Admin/HR only)
// @access  Private (Admin/HR)
export const rejectLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;
    const approverId = req.user.id;

    if (!comment) {
      return res.status(400).json({ message: 'Comment is required when rejecting a leave request' });
    }

    const leave = await Leave.findById(id).populate('user');
    if (!leave) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    if (leave.status !== 'Pending') {
      return res.status(400).json({ message: 'Leave request has already been processed' });
    }

    leave.status = 'Rejected';
    leave.approvedBy = approverId;
    leave.comment = comment;

    await leave.save();

    // Log activity
    await Activity.create({
      user: approverId,
      activityType: 'leave_reject',
      description: `Rejected leave request for ${leave.user.fullName}`,
    });

    // Notify employee via email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: leave.user.email,
      subject: 'Leave Request Rejected - Dayflow HRMS',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #EF4444;">Leave Request Rejected</h2>
          <p>Your leave request has been rejected.</p>
          <p><strong>Leave Type:</strong> ${leave.leaveType}</p>
          <p><strong>Start Date:</strong> ${leave.startDate.toLocaleDateString()}</p>
          <p><strong>End Date:</strong> ${leave.endDate.toLocaleDateString()}</p>
          <p><strong>Reason:</strong> ${comment}</p>
        </div>
      `,
    };

    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        console.error('Error sending rejection email:', error);
      }
    });

    res.json(leave);
  } catch (err) {
    console.error('Reject leave error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @route   DELETE /api/leave/:id
// @desc    Cancel leave request (Employee only, if pending)
// @access  Private
export const cancelLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const leave = await Leave.findById(id);
    if (!leave) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    if (leave.user.toString() !== userId) {
      return res.status(403).json({ message: 'You can only cancel your own leave requests' });
    }

    if (leave.status !== 'Pending') {
      return res.status(400).json({ message: 'Only pending leave requests can be cancelled' });
    }

    await Leave.findByIdAndDelete(id);

    await Activity.create({
      user: userId,
      activityType: 'leave_cancel',
      description: 'Cancelled leave request',
    });

    res.json({ message: 'Leave request cancelled successfully' });
  } catch (err) {
    console.error('Cancel leave error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

