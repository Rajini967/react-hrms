import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaCheck, FaTimes, FaCalendarDay, FaUserAlt } from 'react-icons/fa';

const LeaveRequests = ({ employeeId }) => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const url = employeeId
                    ? `/leave/leave-request/?employee_id=${employeeId}`
                    : '/leave/leave-request/';
                const response = await api.get(url);
                setRequests(response.data.results || response.data || []);
            } catch (error) {
                console.error("Error fetching leave requests:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRequests();
    }, []);

    const getStatusStyle = (status) => {
        switch (status?.toLowerCase()) {
            case 'approved': return { bg: '#ecfdf5', text: '#10b981' };
            case 'rejected': return { bg: '#fef2f2', text: '#ef4444' };
            case 'requested': return { bg: '#eff6ff', text: '#3b82f6' };
            default: return { bg: '#f8fafc', text: '#64748b' };
        }
    };

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading leave requests...</div>;

    return (
        <div style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b' }}>Leave Requests</h2>
                    <p style={{ color: '#64748b', marginTop: '0.25rem' }}>Review and manage employee time-off applications</p>
                </div>
                <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FaPlus /> Apply Leave
                </button>
            </div>

            <div style={{ backgroundColor: '#fff', borderRadius: '24px', border: '1px solid #eef2f6', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #eef2f6' }}>
                            <th style={{ padding: '1.25rem', textAlign: 'left', color: '#64748b', fontWeight: 600 }}>Employee</th>
                            <th style={{ padding: '1.25rem', textAlign: 'left', color: '#64748b', fontWeight: 600 }}>Leave Type</th>
                            <th style={{ padding: '1.25rem', textAlign: 'left', color: '#64748b', fontWeight: 600 }}>Duration</th>
                            <th style={{ padding: '1.25rem', textAlign: 'left', color: '#64748b', fontWeight: 600 }}>Days</th>
                            <th style={{ padding: '1.25rem', textAlign: 'left', color: '#64748b', fontWeight: 600 }}>Status</th>
                            <th style={{ padding: '1.25rem', textAlign: 'right', color: '#64748b', fontWeight: 600 }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map((req, idx) => {
                            const { bg, text } = getStatusStyle(req.status);
                            return (
                                <motion.tr
                                    key={req.id}
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    style={{ borderBottom: '1px solid #f1f5f9' }}
                                >
                                    <td style={{ padding: '1.25rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                                                <FaUserAlt size={14} />
                                            </div>
                                            <span style={{ fontWeight: 600, color: '#1e293b' }}>{req.employee_name || 'N/A'}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.25rem', color: '#4b5563', fontWeight: 500 }}>{req.leave_type_title}</td>
                                    <td style={{ padding: '1.25rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.875rem' }}>
                                            <FaCalendarDay size={12} /> {req.start_date} <span style={{ color: '#cbd5e1' }}>→</span> {req.end_date}
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.25rem', fontWeight: 700, color: '#1e293b' }}>{req.requested_days || 0}</td>
                                    <td style={{ padding: '1.25rem' }}>
                                        <span style={{
                                            padding: '0.35rem 0.75rem',
                                            borderRadius: '20px',
                                            backgroundColor: bg,
                                            color: text,
                                            fontSize: '0.75rem',
                                            fontWeight: 700,
                                            textTransform: 'uppercase'
                                        }}>
                                            {req.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1.25rem', textAlign: 'right' }}>
                                        {req.status?.toLowerCase() === 'requested' && (
                                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                                <button style={{ padding: '0.4rem', borderRadius: '8px', border: '1px solid #10b981', color: '#10b981', background: 'none', cursor: 'pointer' }} title="Approve"><FaCheck /></button>
                                                <button style={{ padding: '0.4rem', borderRadius: '8px', border: '1px solid #ef4444', color: '#ef4444', background: 'none', cursor: 'pointer' }} title="Reject"><FaTimes /></button>
                                            </div>
                                        )}
                                    </td>
                                </motion.tr>
                            );
                        })}
                    </tbody>
                </table>
                {requests.length === 0 && (
                    <div style={{ padding: '4rem', textAlign: 'center', color: '#94a3b8' }}>
                        No leave requests found.
                    </div>
                )}
            </div>
        </div>
    );
};

export default LeaveRequests;
