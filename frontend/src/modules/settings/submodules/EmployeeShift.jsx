import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { FaClock, FaPlus, FaEdit, FaTrash, FaBuilding, FaRegClock } from 'react-icons/fa';
import useToast from '../../../hooks/useToast';
import Toast from '../../../components/common/Toast';

const EmployeeShift = () => {
    const [records, setRecords] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [graceTimes, setGraceTimes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const { toasts, showToast, removeToast } = useToast();
    const [formData, setFormData] = useState({
        shift_name: 'General',
        employee_shift: '',
        weekly_full_time: '40:00',
        full_time: '200:00',
        company_id: [],
        grace_time_id: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [shiftsRes, companiesRes, graceRes] = await Promise.all([
                api.get('/base/employee-shift/'),
                api.get('/base/companies/'),
                api.get('/attendance/grace-time/').catch(() => ({ data: [] }))
            ]);
            setRecords(shiftsRes.data.results || shiftsRes.data || []);
            setCompanies(companiesRes.data.results || companiesRes.data || []);
            setGraceTimes(graceRes.data.results || graceRes.data || []);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (record = null) => {
        if (record) {
            setEditingRecord(record);
            setFormData({
                shift_name: record.shift_name || 'General',
                employee_shift: record.employee_shift || '',
                weekly_full_time: record.weekly_full_time || '40:00',
                full_time: record.full_time || '200:00',
                company_id: record.company_id || [],
                grace_time_id: record.grace_time_id || ''
            });
        } else {
            setEditingRecord(null);
            setFormData({
                shift_name: 'General',
                employee_shift: '',
                weekly_full_time: '40:00',
                full_time: '200:00',
                company_id: [],
                grace_time_id: ''
            });
        }
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                company_id: Array.isArray(formData.company_id) ? formData.company_id : [],
                grace_time_id: formData.grace_time_id || null
            };

            if (editingRecord) {
                await api.put(`/base/employee-shift/${editingRecord.id}/`, payload);
                showToast('Employee shift updated successfully!', 'success');
            } else {
                await api.post('/base/employee-shift/', payload);
                showToast('Employee shift created successfully!', 'success');
            }
            fetchData();
            setShowModal(false);
        } catch (error) {
            console.error("Error saving employee shift:", error);
            const errorMsg = error.response?.data?.employee_shift?.[0] || error.response?.data?.error || "Failed to save employee shift";
            showToast(errorMsg, 'error');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this employee shift?")) {
            try {
                await api.delete(`/base/employee-shift/${id}/`);
                fetchData();
                showToast('Employee shift deleted successfully!', 'success');
            } catch (error) {
                console.error("Error deleting employee shift:", error);
                showToast("Failed to delete employee shift", 'error');
            }
        }
    };

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading employee shifts...</div>;

    return (
        <div style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b' }}>Employee Shift</h2>
                    <p style={{ color: '#64748b', marginTop: '0.25rem' }}>Define and manage working shifts for employees</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    style={{
                        padding: '0.75rem 1.5rem',
                        borderRadius: '12px',
                        backgroundColor: 'var(--primary-color)',
                        color: 'white',
                        border: 'none',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(79, 70, 229, 0.2)'
                    }}
                >
                    <FaPlus /> Add Shift
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                {records.map((record) => (
                    <motion.div
                        key={record.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={{
                            backgroundColor: '#fff',
                            borderRadius: '16px',
                            padding: '1.5rem',
                            border: '1px solid #eef2f6',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem'
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '12px',
                                    backgroundColor: 'rgba(79, 70, 229, 0.1)',
                                    color: 'var(--primary-color)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1.25rem'
                                }}>
                                    <FaClock />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>{record.employee_shift}</h3>
                                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{record.shift_name}</span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button
                                    onClick={() => handleOpenModal(record)}
                                    style={{ padding: '0.5rem', borderRadius: '8px', border: 'none', backgroundColor: '#f1f5f9', color: '#64748b', cursor: 'pointer', transition: 'all 0.2s' }}
                                    title="Edit Shift"
                                >
                                    <FaEdit size={14} />
                                </button>
                                <button
                                    onClick={() => handleDelete(record.id)}
                                    style={{ padding: '0.5rem', borderRadius: '8px', border: 'none', backgroundColor: '#fff1f2', color: '#ef4444', cursor: 'pointer', transition: 'all 0.2s' }}
                                    title="Delete Shift"
                                >
                                    <FaTrash size={14} />
                                </button>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '12px' }}>
                            <div>
                                <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>Weekly Hours</span>
                                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155' }}>{record.weekly_full_time} hrs</span>
                            </div>
                            <div>
                                <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>Monthly Hours</span>
                                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155' }}>{record.full_time} hrs</span>
                            </div>
                        </div>

                        {record.company_id && record.company_id.length > 0 && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <FaBuilding size={12} color="#94a3b8" />
                                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                                    {Array.isArray(record.company_id) ? record.company_id.length : 0} Companies assigned
                                </span>
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>

            {records.length === 0 && (
                <div style={{ textAlign: 'center', padding: '5rem 2rem', color: '#94a3b8' }}>
                    <FaRegClock size={64} style={{ marginBottom: '1.5rem', opacity: 0.2 }} />
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#475569' }}>No shifts found</h3>
                    <p style={{ marginTop: '0.5rem' }}>Start by adding a new working shift for your organization.</p>
                </div>
            )}

            {/* Modal */}
            <AnimatePresence>
                {showModal && (
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(15, 23, 42, 0.6)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1100,
                        backdropFilter: 'blur(8px)'
                    }}>
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            style={{
                                backgroundColor: 'white',
                                borderRadius: '24px',
                                padding: '2.5rem',
                                width: '100%',
                                maxWidth: '600px',
                                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                                maxHeight: '90vh',
                                overflowY: 'auto'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                <div>
                                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>
                                        {editingRecord ? 'Edit Shift' : 'Create New Shift'}
                                    </h2>
                                    <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.25rem' }}>Enter shift details and assignments</p>
                                </div>
                                <button
                                    onClick={() => setShowModal(false)}
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        border: 'none',
                                        backgroundColor: '#f1f5f9',
                                        color: '#64748b',
                                        fontSize: '1.25rem',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >&times;</button>
                            </div>

                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: '#334155', marginBottom: '0.5rem' }}>Employee Shift *</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.employee_shift}
                                            onChange={(e) => setFormData({ ...formData, employee_shift: e.target.value })}
                                            placeholder="e.g. Morning Shift"
                                            style={{ width: '100%', padding: '0.875rem', borderRadius: '12px', border: '2px solid #e2e8f0', outline: 'none', fontSize: '0.95rem', transition: 'border-color 0.2s' }}
                                            onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
                                            onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: '#334155', marginBottom: '0.5rem' }}>Shift Name</label>
                                        <input
                                            type="text"
                                            value={formData.shift_name}
                                            onChange={(e) => setFormData({ ...formData, shift_name: e.target.value })}
                                            placeholder="Internal Name"
                                            style={{ width: '100%', padding: '0.875rem', borderRadius: '12px', border: '2px solid #e2e8f0', outline: 'none', fontSize: '0.95rem' }}
                                        />
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: '#334155', marginBottom: '0.5rem' }}>Weekly Full Time (HH:MM)</label>
                                        <input
                                            type="text"
                                            value={formData.weekly_full_time}
                                            onChange={(e) => setFormData({ ...formData, weekly_full_time: e.target.value })}
                                            placeholder="40:00"
                                            style={{ width: '100%', padding: '0.875rem', borderRadius: '12px', border: '2px solid #e2e8f0', outline: 'none', fontSize: '0.95rem' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: '#334155', marginBottom: '0.5rem' }}>Monthly Full Time (HH:MM)</label>
                                        <input
                                            type="text"
                                            value={formData.full_time}
                                            onChange={(e) => setFormData({ ...formData, full_time: e.target.value })}
                                            placeholder="200:00"
                                            style={{ width: '100%', padding: '0.875rem', borderRadius: '12px', border: '2px solid #e2e8f0', outline: 'none', fontSize: '0.95rem' }}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: '#334155', marginBottom: '0.5rem' }}>Grace Time Policy</label>
                                    <select
                                        value={formData.grace_time_id}
                                        onChange={(e) => setFormData({ ...formData, grace_time_id: e.target.value })}
                                        style={{ width: '100%', padding: '0.875rem', borderRadius: '12px', border: '2px solid #e2e8f0', outline: 'none', backgroundColor: '#fff', fontSize: '0.95rem' }}
                                    >
                                        <option value="">No Grace Time</option>
                                        {graceTimes.map(gt => (
                                            <option key={gt.id} value={gt.id}>{gt.grace_time}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: '#334155', marginBottom: '0.5rem' }}>Assign Companies</label>
                                    <select
                                        multiple
                                        value={formData.company_id}
                                        onChange={(e) => {
                                            const selected = Array.from(e.target.selectedOptions, option => parseInt(option.value));
                                            setFormData({ ...formData, company_id: selected });
                                        }}
                                        style={{ width: '100%', padding: '0.875rem', borderRadius: '12px', border: '2px solid #e2e8f0', outline: 'none', minHeight: '120px', fontSize: '0.95rem' }}
                                    >
                                        {companies.map(comp => (
                                            <option key={comp.id} value={comp.id}>{comp.company}</option>
                                        ))}
                                    </select>
                                    <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.5rem' }}>Hold Ctrl/Cmd to select multiple companies</p>
                                </div>

                                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                    <button
                                        type="submit"
                                        style={{ flex: 2, padding: '1rem', borderRadius: '12px', border: 'none', backgroundColor: 'var(--primary-color)', color: 'white', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)' }}
                                    >
                                        {editingRecord ? 'Update' : 'Create'} Shift
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        style={{ flex: 1, padding: '1rem', borderRadius: '12px', border: '2px solid #e2e8f0', backgroundColor: 'white', color: '#64748b', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Toast Notifications */}
            <AnimatePresence>
                {toasts.map(toast => (
                    <Toast
                        key={toast.id}
                        message={toast.message}
                        type={toast.type}
                        onClose={() => removeToast(toast.id)}
                        duration={toast.duration}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
};

export default EmployeeShift;

