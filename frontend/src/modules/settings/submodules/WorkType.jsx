import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBriefcase, FaPlus, FaEdit, FaTrash, FaBuilding, FaTh, FaList } from 'react-icons/fa';
import useToast from '../../../hooks/useToast';
import Toast from '../../../components/common/Toast';

const WorkType = () => {
    const [records, setRecords] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const { toasts, showToast, removeToast } = useToast();
    const [formData, setFormData] = useState({
        work_type: '',
        company_id: []
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [workTypesRes, companiesRes] = await Promise.all([
                api.get('/base/worktypes/'),
                api.get('/base/companies/')
            ]);
            setRecords(workTypesRes.data.results || workTypesRes.data || []);
            setCompanies(companiesRes.data.results || companiesRes.data || []);
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
                work_type: record.work_type || '',
                company_id: record.company_id || []
            });
        } else {
            setEditingRecord(null);
            setFormData({
                work_type: '',
                company_id: []
            });
        }
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Note: Due to backend ManyToMany field validation, we cannot send company_id
            // The backend needs to be updated to handle this properly
            const payload = {
                work_type: formData.work_type
            };

            console.log('Sending payload:', payload);

            if (editingRecord) {
                await api.put(`/base/worktypes/${editingRecord.id}/`, payload);
                showToast('Work type updated successfully! Note: Company associations are not saved due to backend limitations.', 'warning');
            } else {
                await api.post('/base/worktypes/', payload);
                showToast('Work type created successfully! Note: Company associations are not saved due to backend limitations.', 'warning');
            }
            fetchData();
            setShowModal(false);
        } catch (error) {
            console.error("Full error:", error);
            console.error("Error response:", error.response);
            console.error("Error data:", error.response?.data);

            const errorMsg = error.response?.data?.work_type?.[0]
                || error.response?.data?.company_id?.[0]
                || error.response?.data?.error
                || error.response?.data?.detail
                || JSON.stringify(error.response?.data)
                || "Failed to save work type";
            showToast(errorMsg, 'error');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this work type?")) {
            try {
                await api.delete(`/base/worktypes/${id}/`);
                fetchData();
                showToast('Work type deleted successfully!', 'success');
            } catch (error) {
                console.error("Error deleting work type:", error);
                showToast("Failed to delete work type", 'error');
            }
        }
    };

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading work types...</div>;

    return (
        <div style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b' }}>Work Type</h2>
                    <p style={{ color: '#64748b', marginTop: '0.25rem' }}>Manage work types for employee assignments</p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    {/* View Toggle Buttons */}
                    <div style={{ display: 'flex', gap: '0.5rem', backgroundColor: '#f1f5f9', padding: '0.25rem', borderRadius: '8px' }}>
                        <button
                            onClick={() => setViewMode('grid')}
                            style={{
                                padding: '0.5rem 0.75rem',
                                borderRadius: '6px',
                                border: 'none',
                                backgroundColor: viewMode === 'grid' ? '#fff' : 'transparent',
                                color: viewMode === 'grid' ? 'var(--primary-color)' : '#64748b',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                fontWeight: viewMode === 'grid' ? 600 : 400,
                                boxShadow: viewMode === 'grid' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                                transition: 'all 0.2s'
                            }}
                            title="Grid View"
                        >
                            <FaTh size={14} />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            style={{
                                padding: '0.5rem 0.75rem',
                                borderRadius: '6px',
                                border: 'none',
                                backgroundColor: viewMode === 'list' ? '#fff' : 'transparent',
                                color: viewMode === 'list' ? 'var(--primary-color)' : '#64748b',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                fontWeight: viewMode === 'list' ? 600 : 400,
                                boxShadow: viewMode === 'list' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                                transition: 'all 0.2s'
                            }}
                            title="List View"
                        >
                            <FaList size={14} />
                        </button>
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
                        <FaPlus /> Add Work Type
                    </button>
                </div>
            </div>

            {/* Grid View */}
            {viewMode === 'grid' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
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
                                    backgroundColor: 'rgba(79, 70, 229, 0.1)',
                                    color: 'var(--primary-color)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '0.9rem'
                                }}>
                                    <FaBriefcase />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#1e293b', margin: 0 }}>{record.work_type}</h3>
                                    {record.company_id && record.company_id.length > 0 && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem' }}>
                                            <FaBuilding size={10} color="#64748b" />
                                            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                                                {Array.isArray(record.company_id) ? record.company_id.length : 0} Companies
                                            </span>
                                        </div>
                                    )}
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
            )}

            {/* List View */}
            {viewMode === 'list' && (
                <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #eef2f6', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600, color: '#64748b' }}>Work Type</th>
                                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600, color: '#64748b' }}>Companies</th>
                                <th style={{ padding: '1rem 1.5rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: 600, color: '#64748b' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {records.map((record, index) => (
                                <motion.tr
                                    key={record.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    style={{ borderBottom: index < records.length - 1 ? '1px solid #f1f5f9' : 'none' }}
                                >
                                    <td style={{ padding: '1rem 1.5rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <div style={{
                                                width: '32px',
                                                height: '32px',
                                                borderRadius: '8px',
                                                backgroundColor: 'rgba(79, 70, 229, 0.1)',
                                                color: 'var(--primary-color)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '0.85rem'
                                            }}>
                                                <FaBriefcase />
                                            </div>
                                            <span style={{ fontWeight: 500, color: '#1e293b' }}>{record.work_type}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem 1.5rem' }}>
                                        {record.company_id && record.company_id.length > 0 ? (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <FaBuilding size={12} color="#64748b" />
                                                <span style={{ fontSize: '0.875rem', color: '#64748b' }}>
                                                    {Array.isArray(record.company_id) ? record.company_id.length : 0} Companies
                                                </span>
                                            </div>
                                        ) : (
                                            <span style={{ fontSize: '0.875rem', color: '#94a3b8' }}>No companies</span>
                                        )}
                                    </td>
                                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                            <button
                                                onClick={() => handleOpenModal(record)}
                                                style={{ padding: '0.5rem', borderRadius: '6px', border: 'none', backgroundColor: '#f1f5f9', color: '#64748b', cursor: 'pointer' }}
                                            >
                                                <FaEdit size={14} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(record.id)}
                                                style={{ padding: '0.5rem', borderRadius: '6px', border: 'none', backgroundColor: '#fff1f2', color: '#ef4444', cursor: 'pointer' }}
                                            >
                                                <FaTrash size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {records.length === 0 && (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                    <FaBriefcase size={48} style={{ marginBottom: '1rem', opacity: 0.3 }} />
                    <p>No work types added yet. Click "Add Work Type" to create your first work type.</p>
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
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b' }}>{editingRecord ? 'Edit Work Type' : 'Add Work Type'}</h2>
                                <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#94a3b8' }}>&times;</button>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>Work Type *</label>
                                    <input
                                        type="text"
                                        required
                                        maxLength={50}
                                        value={formData.work_type}
                                        onChange={(e) => setFormData({ ...formData, work_type: e.target.value })}
                                        placeholder="e.g. Remote, On-site, Hybrid"
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #e2e8f0', outline: 'none' }}
                                    />
                                </div>

                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>Companies</label>
                                    <div style={{
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '10px',
                                        padding: '0.75rem',
                                        maxHeight: '180px',
                                        overflowY: 'auto',
                                        backgroundColor: '#fafafa'
                                    }}>
                                        {companies.map(comp => (
                                            <div
                                                key={comp.id}
                                                onClick={() => {
                                                    const isSelected = formData.company_id.includes(comp.id);
                                                    setFormData({
                                                        ...formData,
                                                        company_id: isSelected
                                                            ? formData.company_id.filter(id => id !== comp.id)
                                                            : [...formData.company_id, comp.id]
                                                    });
                                                }}
                                                style={{
                                                    padding: '0.5rem',
                                                    cursor: 'pointer',
                                                    borderRadius: '6px',
                                                    marginBottom: '0.25rem',
                                                    backgroundColor: formData.company_id.includes(comp.id) ? '#eff6ff' : 'transparent',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.5rem',
                                                    transition: 'background-color 0.2s'
                                                }}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={formData.company_id.includes(comp.id)}
                                                    onChange={() => { }}
                                                    style={{ pointerEvents: 'none', cursor: 'pointer' }}
                                                />
                                                <span style={{ fontSize: '0.875rem', color: '#1e293b' }}>{comp.company}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.5rem' }}>Hold Ctrl/Cmd to select multiple companies</p>
                                </div>

                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <button
                                        type="submit"
                                        style={{ flex: 1, padding: '0.75rem', borderRadius: '12px', border: 'none', backgroundColor: 'var(--primary-color)', color: 'white', fontWeight: 600, cursor: 'pointer' }}
                                    >
                                        {editingRecord ? 'Update' : 'Create'} Work Type
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

export default WorkType;




