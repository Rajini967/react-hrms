import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { motion } from 'framer-motion';
import { FaClock, FaSignInAlt, FaSignOutAlt, FaCalendarCheck, FaFilter } from 'react-icons/fa';

const AttendanceLogs = ({ employeeId }) => {
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAttendance = async () => {
            try {
                const url = employeeId
                    ? `/attendance/attendance/?employee_id=${employeeId}`
                    : '/attendance/attendance/';
                const response = await api.get(url);
                setAttendance(response.data.results || response.data || []);
            } catch (error) {
                console.error("Error fetching attendance:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAttendance();
    }, []);

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'present': return ['#ecfdf5', '#10b981'];
            case 'absent': return ['#fef2f2', '#ef4444'];
            case 'on leave': return ['#eff6ff', '#3b82f6'];
            default: return ['#f8fafc', '#64748b'];
        }
    };

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading logs...</div>;

    return (
        <div style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b' }}>Attendance Logs</h2>
                    <p style={{ color: '#64748b', marginTop: '0.25rem' }}>Real-time check-in/out records for today</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <FaClock /> Clock In Now
                    </button>
                    <button style={{ padding: '0.75rem 1.25rem', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b' }}>
                        <FaFilter /> Filter Date
                    </button>
                </div>
            </div>

            <div style={{ backgroundColor: '#fff', borderRadius: '24px', border: '1px solid #eef2f6', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #eef2f6' }}>
                            <th style={{ padding: '1.25rem', textAlign: 'left', color: '#64748b', fontWeight: 600 }}>Employee</th>
                            <th style={{ padding: '1.25rem', textAlign: 'left', color: '#64748b', fontWeight: 600 }}>Date</th>
                            <th style={{ padding: '1.25rem', textAlign: 'left', color: '#64748b', fontWeight: 600 }}>Check In</th>
                            <th style={{ padding: '1.25rem', textAlign: 'left', color: '#64748b', fontWeight: 600 }}>Check Out</th>
                            <th style={{ padding: '1.25rem', textAlign: 'left', color: '#64748b', fontWeight: 600 }}>Total Hours</th>
                            <th style={{ padding: '1.25rem', textAlign: 'left', color: '#64748b', fontWeight: 600 }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {attendance.map((log, idx) => {
                            const [bg, color] = getStatusColor(log.attendance_validated ? 'Present' : 'Pending');
                            return (
                                <motion.tr
                                    key={log.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: idx * 0.05 }}
                                    style={{ borderBottom: '1px solid #f1f5f9' }}
                                >
                                    <td style={{ padding: '1.25rem' }}>
                                        <div style={{ fontWeight: 600, color: '#1e293b' }}>{log.employee_name || 'N/A'}</div>
                                    </td>
                                    <td style={{ padding: '1.25rem', color: '#444' }}>{log.attendance_date}</td>
                                    <td style={{ padding: '1.25rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', fontWeight: 500 }}>
                                            <FaSignInAlt size={12} /> {log.attendance_clock_in || '--:--'}
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.25rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444', fontWeight: 500 }}>
                                            <FaSignOutAlt size={12} /> {log.attendance_clock_out || '--:--'}
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.25rem', fontWeight: 700, color: '#1e293b' }}>
                                        {log.attendance_worked_hour || '0:00'}
                                    </td>
                                    <td style={{ padding: '1.25rem' }}>
                                        <span style={{
                                            padding: '0.35rem 0.75rem',
                                            borderRadius: '20px',
                                            backgroundColor: bg,
                                            color: color,
                                            fontSize: '0.75rem',
                                            fontWeight: 700,
                                            textTransform: 'uppercase'
                                        }}>
                                            {log.attendance_validated ? 'Validated' : 'Pending'}
                                        </span>
                                    </td>
                                </motion.tr>
                            );
                        })}
                    </tbody>
                </table>
                {attendance.length === 0 && (
                    <div style={{ padding: '4rem', textAlign: 'center', color: '#94a3b8' }}>
                        No attendance records found for the selected period.
                    </div>
                )}
            </div>
        </div>
    );
};

export default AttendanceLogs;
