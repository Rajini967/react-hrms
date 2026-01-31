import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTag, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import useToast from '../../../hooks/useToast';
import Toast from '../../../components/common/Toast';

const EmployeeTags = () => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const { toasts, showToast, removeToast } = useToast();
    const [formData, setFormData] = useState({
        title: '',
        color: '#4f46e5'
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await api.get('/employee/employee-tags/');
            setRecords(response.data.results || response.data || []);
        } catch (error) {
            console.error("Error fetching employee tags:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (record = null) => {
        if (record) {
            setEditingRecord(record);
            setFormData({
                title: record.title || '',
                color: record.color || '#4f46e5'
            });
        } else {
            setEditingRecord(null);
            setFormData({
                title: '',
                color: '#4f46e5'
            });
        }
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingRecord) {
                await api.put(`/employee/employee-tags/${editingRecord.id}/`, formData);
                showToast('Employee tag updated successfully!', 'success');
            } else {
                await api.post('/employee/employee-tags/', formData);
                showToast('Employee tag created successfully!', 'success');
            }
            fetchData();
            setShowModal(false);
        } catch (error) {
            console.error("Error saving employee tag:", error);
            showToast(error.response?.data?.error || "Failed to save employee tag", 'error');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this employee tag?")) {
            try {
                await api.delete(`/employee/employee-tags/${id}/`);
                showToast('Employee tag deleted successfully!', 'success');
                fetchData();
            } catch (error) {
                console.error("Error deleting employee tag:", error);
                showToast("Failed to delete employee tag", 'error');
            }
        }
    };

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading employee tags...</div>;

    return (
        <div style={{ padding: '2rem', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <div>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>Employee Tags</h2>
                        <p style={{ color: '#64748b', marginTop: '0.5rem', fontSize: '0.95rem' }}>Manage tags for categorizing employees</p>
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        style={{
                            padding: '0.625rem 1.25rem',
                            borderRadius: '6px',
                            backgroundColor: '#4f46e5',
                            color: 'white',
                            border: 'none',
                            fontWeight: 500,
                            fontSize: '0.875rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            cursor: 'pointer',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                        }}
                    >
                        + Create
                    </button>
                </div>

                {/* Tags Table */}
                <div style={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                                <th style={{ padding: '0.875rem 1.5rem', textAlign: 'left', fontSize: '0.8125rem', fontWeight: 600, color: '#6b7280', textTransform: 'none' }}>Title</th>
                                <th style={{ padding: '0.875rem 1.5rem', textAlign: 'left', fontSize: '0.8125rem', fontWeight: 600, color: '#6b7280', textTransform: 'none' }}>Color</th>
                                <th style={{ padding: '0.875rem 1.5rem', textAlign: 'right', fontSize: '0.8125rem', fontWeight: 600, color: '#6b7280', textTransform: 'none' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {records.map((tag, index) => (
                                <tr key={tag.id} style={{ borderBottom: index < records.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                                    <td style={{ padding: '1rem 1.5rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <div style={{
                                                width: '20px',
                                                height: '20px',
                                                borderRadius: '50%',
                                                backgroundColor: tag.color,
                                                flexShrink: 0
                                            }} />
                                            <span style={{ fontWeight: 400, color: '#1f2937', fontSize: '0.875rem' }}>{tag.title}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem 1.5rem' }}>
                                        <span style={{ fontSize: '0.875rem', color: '#6b7280', fontFamily: 'monospace' }}>{tag.color}</span>
                                    </td>
                                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                            <button
                                                onClick={() => handleOpenModal(tag)}
                                                style={{
                                                    padding: '0.375rem',
                                                    borderRadius: '4px',
                                                    border: 'none',
                                                    backgroundColor: 'transparent',
                                                    cursor: 'pointer',
                                                    color: '#9ca3af',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}
                                                title="Edit"
                                            >
                                                <FaEdit size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(tag.id)}
                                                style={{
                                                    padding: '0.375rem',
                                                    borderRadius: '4px',
                                                    border: 'none',
                                                    backgroundColor: 'transparent',
                                                    cursor: 'pointer',
                                                    color: '#ef4444',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}
                                                title="Delete"
                                            >
                                                <FaTrash size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {records.length === 0 && (
                                <tr>
                                    <td colSpan="3" style={{ padding: '3rem', textAlign: 'center', color: '#9ca3af' }}>
                                        <FaTag size={48} style={{ marginBottom: '1rem', opacity: 0.3 }} />
                                        <p style={{ margin: 0, fontSize: '0.875rem' }}>No employee tags found. Create one to get started.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
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
                    zIndex: 1000
                }}>
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        style={{
                            backgroundColor: 'white',
                            borderRadius: '8px',
                            width: '480px',
                            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)'
                        }}
                    >
                        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: '#111827' }}>
                                {editingRecord ? 'Edit Employee Tag' : 'Create Employee Tag'}
                            </h3>
                            <button
                                onClick={() => setShowModal(false)}
                                style={{ background: 'none', border: 'none', fontSize: '1.5rem', color: '#9ca3af', cursor: 'pointer', padding: 0, lineHeight: 1 }}
                            >
                                ×
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
                            {/* Title Field */}
                            <div style={{ marginBottom: '1.25rem' }}>
                                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
                                    Title: <span style={{ color: '#ef4444' }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="Title"
                                    style={{
                                        width: '100%',
                                        padding: '0.5rem 0.75rem',
                                        borderRadius: '6px',
                                        border: '1px solid #d1d5db',
                                        fontSize: '0.875rem',
                                        outline: 'none',
                                        transition: 'border-color 0.2s',
                                        boxSizing: 'border-box'
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = '#4f46e5'}
                                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                                />
                            </div>

                            {/* Color Field */}
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
                                    Color:
                                </label>
                                <input
                                    type="color"
                                    value={formData.color}
                                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                    style={{
                                        width: '100%',
                                        height: '38px',
                                        borderRadius: '6px',
                                        border: '1px solid #d1d5db',
                                        cursor: 'pointer',
                                        padding: '2px',
                                        boxSizing: 'border-box'
                                    }}
                                />
                            </div>

                            {/* Action Buttons */}
                            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        borderRadius: '6px',
                                        border: '1px solid #d1d5db',
                                        backgroundColor: 'white',
                                        color: '#374151',
                                        fontWeight: 500,
                                        fontSize: '0.875rem',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    style={{
                                        padding: '0.5rem 1rem',
                                        borderRadius: '6px',
                                        border: 'none',
                                        backgroundColor: '#4f46e5',
                                        color: 'white',
                                        fontWeight: 500,
                                        fontSize: '0.875rem',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}

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

export default EmployeeTags;

