import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { FaExclamationTriangle, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import useToast from '../../../hooks/useToast';
import Toast from '../../../components/common/Toast';

const DisciplinaryAction = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const { toasts, showToast, removeToast } = useToast();
    const [formData, setFormData] = useState({
        title: '',
        action_type: 'warning',
        block_option: false
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await api.get('/employee/disciplinary-action-type/');
            setRecords(response.data.results || response.data || []);
        } catch (error) {
            console.error("Error fetching disciplinary actions:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (record = null) => {
        if (record) {
            setEditingRecord(record);
            setFormData({
                title: record.title || '',
                action_type: record.action_type || 'warning',
                block_option: record.block_option !== undefined ? record.block_option : false
            });
        } else {
            setEditingRecord(null);
            setFormData({
                title: '',
                action_type: 'warning',
                block_option: false
            });
        }
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingRecord) {
                await api.put(`/employee/disciplinary-action-type/${editingRecord.id}/`, formData);
                showToast('Disciplinary action type updated successfully!', 'success');
            } else {
                await api.post('/employee/disciplinary-action-type/', formData);
                showToast('Disciplinary action type created successfully!', 'success');
            }
            fetchData();
            setShowModal(false);
        } catch (error) {
            console.error("Error saving disciplinary action:", error);
            const errorMsg = error.response?.data?.title?.[0] || error.response?.data?.error || "Failed to save disciplinary action type";
            showToast(errorMsg, 'error');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this disciplinary action type?")) {
            try {
                await api.delete(`/employee/disciplinary-action-type/${id}/`);
                fetchData();
                showToast('Disciplinary action type deleted successfully!', 'success');
            } catch (error) {
                console.error("Error deleting disciplinary action:", error);
                showToast("Failed to delete disciplinary action type", 'error');
            }
        }
    };

    const getActionTypeColor = (actionType) => {
        switch (actionType) {
            case 'warning': return '#f59e0b';
            case 'suspension': return '#ef4444';
            case 'dismissal': return '#dc2626';
            default: return '#64748b';
        }
    };

    const getActionTypeLabel = (actionType) => {
        switch (actionType) {
            case 'warning': return 'Warning';
            case 'suspension': return 'Suspension';
            case 'dismissal': return 'Dismissal';
            default: return actionType;
        }
    };

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading disciplinary action types...</div>;

    return (
        <div style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b' }}>Disciplinary Action</h2>
                    <p style={{ color: '#64748b', marginTop: '0.25rem' }}>Manage disciplinary action types for employee management</p>
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
                    <FaPlus /> Add Action Type
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                {records.map((record) => (
                    <motion.div
                        key={record.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={{
                            backgroundColor: '#fff',
                            borderRadius: '12px',
                            padding: '1.25rem',
                            border: '1px solid #eef2f6',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.75rem'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
                            <div style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '8px',
                                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                color: '#ef4444',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.9rem'
                            }}>
                                <FaExclamationTriangle />
                            </div>
                            <div style={{ flex: 1 }}>
                                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#1e293b', margin: 0 }}>{record.title}</h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                                    <span style={{
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        color: getActionTypeColor(record.action_type),
                                        backgroundColor: `${getActionTypeColor(record.action_type)}15`,
                                        padding: '2px 8px',
                                        borderRadius: '4px'
                                    }}>
                                        {getActionTypeLabel(record.action_type)}
                                    </span>
                                    {record.block_option !== undefined && record.block_option && (
                                        <span style={{
                                            fontSize: '0.75rem',
                                            fontWeight: 600,
                                            color: '#dc2626',
                                            backgroundColor: '#fee2e2',
                                            padding: '2px 8px',
                                            borderRadius: '4px'
                                        }}>
                                            Login Block Enabled
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                            <button
                                onClick={() => handleOpenModal(record)}
                                style={{ padding: '0.35rem', borderRadius: '6px', border: 'none', backgroundColor: '#f1f5f9', color: '#64748b', cursor: 'pointer' }}
                            >
                                <FaEdit size={11} />
                            </button>
                            <button
                                onClick={() => handleDelete(record.id)}
                                style={{ padding: '0.35rem', borderRadius: '6px', border: 'none', backgroundColor: '#fff1f2', color: '#ef4444', cursor: 'pointer' }}
                            >
                                <FaTrash size={11} />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {records.length === 0 && (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                    <FaExclamationTriangle size={48} style={{ marginBottom: '1rem', opacity: 0.3 }} />
                    <p>No disciplinary action types added yet. Click "Add Action Type" to create your first action type.</p>
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
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1100,
                        backdropFilter: 'blur(4px)'
                    }}>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            style={{
                                backgroundColor: 'white',
                                borderRadius: '24px',
                                padding: '2rem',
                                width: '100%',
                                maxWidth: '500px',
                                boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b' }}>{editingRecord ? 'Edit Action Type' : 'Add Action Type'}</h2>
                                <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#94a3b8' }}>&times;</button>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>Title *</label>
                                    <input
                                        type="text"
                                        required
                                        maxLength={50}
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="e.g. Verbal Warning, Written Warning"
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #e2e8f0', outline: 'none' }}
                                    />
                                </div>

                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>Action Type *</label>
                                    <select
                                        value={formData.action_type}
                                        onChange={(e) => setFormData({ ...formData, action_type: e.target.value })}
                                        required
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #e2e8f0', outline: 'none' }}
                                    >
                                        <option value="warning">Warning</option>
                                        <option value="suspension">Suspension</option>
                                        <option value="dismissal">Dismissal</option>
                                    </select>
                                </div>

                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem', fontWeight: 600, color: '#475569', cursor: 'pointer' }}>
                                        <input
                                            type="checkbox"
                                            checked={formData.block_option}
                                            onChange={(e) => setFormData({ ...formData, block_option: e.target.checked })}
                                            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                        />
                                        <span>Enable login block</span>
                                    </label>
                                    <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.5rem', marginLeft: '2rem' }}>
                                        If enabled, employee login will be blocked based on period of suspension or dismissal
                                    </p>
                                </div>

                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <button
                                        type="submit"
                                        style={{ flex: 1, padding: '0.75rem', borderRadius: '12px', border: 'none', backgroundColor: 'var(--primary-color)', color: 'white', fontWeight: 600, cursor: 'pointer' }}
                                    >
                                        {editingRecord ? 'Update' : 'Create'} Action Type
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        style={{ flex: 1, padding: '0.75rem', borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: 'white', color: '#64748b', fontWeight: 600, cursor: 'pointer' }}
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

export default DisciplinaryAction;

