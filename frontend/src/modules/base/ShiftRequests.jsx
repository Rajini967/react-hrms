import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { motion } from 'framer-motion';
import { FaPlus, FaCheck, FaTimes, FaFilter, FaSearch, FaHistory } from 'react-icons/fa';

const ShiftRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        shift_id: '',
        requested_date: new Date().toISOString().split('T')[0],
        requested_till: '',
        is_permanent_shift: false,
        description: ''
    });
    const [shifts, setShifts] = useState([]);

    useEffect(() => {
        fetchRequests();
        fetchShifts();
    }, []);

    const fetchRequests = async () => {
        try {
            const response = await api.get('/base/shift-requests/');
            setRequests(response.data.results || response.data);
        } catch (error) {
            console.error('Error fetching shift requests:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchShifts = async () => {
        try {
            const response = await api.get('/base/employee-shift/');
            setShifts(response.data.results || response.data);
        } catch (error) {
            console.error('Error fetching shifts:', error);
        }
    };

    const handleApprove = async (id) => {
        try {
            await api.post(`/base/shift-request-approve/${id}`);
            fetchRequests();
        } catch (error) {
            alert('Error approving request: ' + (error.response?.data?.error || 'Unknown error'));
        }
    };

    const handleCancel = async (id) => {
        try {
            await api.post(`/base/shift-request-cancel/${id}`);
            fetchRequests();
        } catch (error) {
            alert('Error canceling request');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/base/shift-requests/', formData);
            setIsModalOpen(false);
            fetchRequests();
        } catch (error) {
            alert('Error creating request: ' + JSON.stringify(error.response?.data));
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'approved': return '#48bb78';
            case 'requested': return '#ed8936';
            case 'cancelled': return '#f56565';
            default: return '#718096';
        }
    };

    const filteredRequests = requests.filter(req => {
        if (activeTab === 'all') return true;
        return req.status?.toLowerCase() === activeTab;
    });

    return (
        <div style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>Shift Requests</h1>
                    <p style={{ color: '#718096', margin: '0.25rem 0 0 0' }}>Manage shift change requests from employees.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="btn btn-primary"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem' }}
                >
                    <FaPlus /> New Request
                </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', backgroundColor: '#fff', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    {['all', 'requested', 'approved', 'cancelled'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            style={{
                                padding: '0.5rem 1rem',
                                borderRadius: '8px',
                                border: 'none',
                                backgroundColor: activeTab === tab ? 'var(--primary-color)' : 'transparent',
                                color: activeTab === tab ? '#fff' : '#718096',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                textTransform: 'capitalize'
                            }}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ backgroundColor: '#f8fafc' }}>
                        <tr>
                            <th style={{ textAlign: 'left', padding: '1rem', color: '#4a5568', fontWeight: 600, borderBottom: '1px solid #e2e8f0' }}>Employee</th>
                            <th style={{ textAlign: 'left', padding: '1rem', color: '#4a5568', fontWeight: 600, borderBottom: '1px solid #e2e8f0' }}>Requested Shift</th>
                            <th style={{ textAlign: 'left', padding: '1rem', color: '#4a5568', fontWeight: 600, borderBottom: '1px solid #e2e8f0' }}>Requested Date</th>
                            <th style={{ textAlign: 'left', padding: '1rem', color: '#4a5568', fontWeight: 600, borderBottom: '1px solid #e2e8f0' }}>Duration</th>
                            <th style={{ textAlign: 'center', padding: '1rem', color: '#4a5568', fontWeight: 600, borderBottom: '1px solid #e2e8f0' }}>Status</th>
                            <th style={{ textAlign: 'right', padding: '1rem', color: '#4a5568', fontWeight: 600, borderBottom: '1px solid #e2e8f0' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRequests.map(req => (
                            <tr key={req.id} style={{ borderBottom: '1px solid #edf2f7' }}>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ fontWeight: 600, color: '#2d3748' }}>{req.employee_first_name} {req.employee_last_name}</div>
                                    <div style={{ fontSize: '0.75rem', color: '#718096' }}>ID: {req.employee_id}</div>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ color: '#4a5568' }}>{req.shift_name}</div>
                                    {req.is_permanent_shift && <span style={{ fontSize: '0.7rem', backgroundColor: '#ebf8ff', color: '#3182ce', padding: '2px 6px', borderRadius: '4px' }}>Permanent</span>}
                                </td>
                                <td style={{ padding: '1rem', color: '#4a5568' }}>{new Date(req.requested_date).toLocaleDateString()}</td>
                                <td style={{ padding: '1rem', color: '#4a5568' }}>
                                    {req.is_permanent_shift ? 'N/A' : `${req.requested_date} to ${req.requested_till}`}
                                </td>
                                <td style={{ padding: '1rem', textAlign: 'center' }}>
                                    <span style={{
                                        padding: '4px 12px',
                                        borderRadius: '20px',
                                        fontSize: '0.8rem',
                                        fontWeight: 600,
                                        backgroundColor: `${getStatusColor(req.status)}20`,
                                        color: getStatusColor(req.status)
                                    }}>
                                        {req.status}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem', textAlign: 'right' }}>
                                    {req.status?.toLowerCase() === 'requested' && (
                                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                            <button
                                                onClick={() => handleApprove(req.id)}
                                                style={{ padding: '0.4rem', borderRadius: '6px', border: '1px solid #48bb78', color: '#48bb78', backgroundColor: '#fff', cursor: 'pointer' }}
                                                title="Approve"
                                            >
                                                <FaCheck />
                                            </button>
                                            <button
                                                onClick={() => handleCancel(req.id)}
                                                style={{ padding: '0.4rem', borderRadius: '6px', border: '1px solid #f56565', color: '#f56565', backgroundColor: '#fff', cursor: 'pointer' }}
                                                title="Cancel"
                                            >
                                                <FaTimes />
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Create Request Modal */}
            {isModalOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '16px', width: '500px', maxWidth: '90%' }}
                    >
                        <h2 style={{ marginBottom: '1.5rem' }}>New Shift Change Request</h2>
                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Shift</label>
                                <select
                                    className="form-control"
                                    required
                                    value={formData.shift_id}
                                    onChange={(e) => setFormData({ ...formData, shift_id: e.target.value })}
                                >
                                    <option value="">Select Shift</option>
                                    {shifts.map(s => <option key={s.id} value={s.id}>{s.employee_shift}</option>)}
                                </select>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Start Date</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        required
                                        value={formData.requested_date}
                                        onChange={(e) => setFormData({ ...formData, requested_date: e.target.value })}
                                    />
                                </div>
                                {!formData.is_permanent_shift && (
                                    <div style={{ flex: 1 }}>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>End Date</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            required={!formData.is_permanent_shift}
                                            value={formData.requested_till}
                                            onChange={(e) => setFormData({ ...formData, requested_till: e.target.value })}
                                        />
                                    </div>
                                )}
                            </div>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        checked={formData.is_permanent_shift}
                                        onChange={(e) => setFormData({ ...formData, is_permanent_shift: e.target.checked })}
                                    />
                                    <span>Is Permanent Shift</span>
                                </label>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">Cancel</button>
                                <button type="submit" className="btn btn-primary">Submit Request</button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default ShiftRequests;
