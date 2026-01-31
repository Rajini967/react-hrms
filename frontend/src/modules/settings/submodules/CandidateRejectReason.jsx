import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBan, FaPlus, FaEdit, FaTrash, FaBuilding } from 'react-icons/fa';
import useToast from '../../../hooks/useToast';
import Toast from '../../../components/common/Toast';

const CandidateRejectReason = () => {
    const [records, setRecords] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const { toasts, showToast, removeToast } = useToast();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        company_id: null
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [reasonRes, compRes] = await Promise.all([
                api.get('/recruitment/reject-reasons/'),
                api.get('/base/companies/')
            ]);
            console.log('Companies response:', compRes.data);
            const companiesData = compRes.data.results || compRes.data || [];
            console.log('Companies array:', companiesData);
            setRecords(reasonRes.data.results || reasonRes.data || []);
            setCompanies(companiesData);
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
                title: record.title,
                description: record.description || '',
                company_id: record.company_id
            });
        } else {
            setEditingRecord(null);
            setFormData({
                title: '',
                description: '',
                company_id: companies[0]?.id || null
            });
        }
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingRecord) {
                await api.put(`/recruitment/reject-reasons/${editingRecord.id}/`, formData);
                showToast('Reject reason updated successfully!', 'success');
            } else {
                await api.post('/recruitment/reject-reasons/', formData);
                showToast('Reject reason created successfully!', 'success');
            }
            fetchData();
            setShowModal(false);
        } catch (error) {
            console.error("Error saving reject reason:", error);
            showToast(error.response?.data?.error || "Failed to save reject reason", 'error');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this reject reason?")) {
            try {
                await api.delete(`/recruitment/reject-reasons/${id}/`);
                fetchData();
                showToast('Reject reason deleted successfully!', 'success');
            } catch (error) {
                console.error("Error deleting reject reason:", error);
                showToast("Failed to delete reject reason", 'error');
            }
        }
    };

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading reject reasons...</div>;

    return (
        <div style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b' }}>Candidate Reject Reasons</h2>
                    <p style={{ color: '#64748b', marginTop: '0.25rem' }}>Manage standardized rejection reasons for candidates</p>
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
                    <FaPlus /> Add Reject Reason
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
                {records.map((record) => {
                    const company = companies.find(c => c.id === record.company_id);
                    return (
                        <motion.div
                            key={record.id}
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{
                                backgroundColor: '#fff',
                                borderRadius: '16px',
                                padding: '1.5rem',
                                border: '1px solid #eef2f6',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                                    <div style={{
                                        width: '44px',
                                        height: '44px',
                                        borderRadius: '12px',
                                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                        color: '#ef4444',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '1.1rem'
                                    }}>
                                        <FaBan />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>{record.title}</h3>
                                        {company && (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748b', fontSize: '0.8rem', marginTop: '2px' }}>
                                                <FaBuilding size={10} /> {company.company}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button
                                        onClick={() => handleOpenModal(record)}
                                        style={{ padding: '0.4rem', borderRadius: '8px', border: 'none', backgroundColor: '#f1f5f9', color: '#64748b', cursor: 'pointer' }}
                                    >
                                        <FaEdit size={12} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(record.id)}
                                        style={{ padding: '0.4rem', borderRadius: '8px', border: 'none', backgroundColor: '#fff1f2', color: '#ef4444', cursor: 'pointer' }}
                                    >
                                        <FaTrash size={12} />
                                    </button>
                                </div>
                            </div>

                            {record.description && (
                                <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.75rem', lineHeight: '1.5' }}>
                                    {record.description}
                                </p>
                            )}
                        </motion.div>
                    );
                })}
            </div>

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
                                maxWidth: '550px',
                                boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b' }}>{editingRecord ? 'Edit Reject Reason' : 'Add Reject Reason'}</h2>
                                <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#94a3b8' }}>&times;</button>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div style={{ marginBottom: '1.25rem' }}>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>Reason Title *</label>
                                    <input
                                        type="text"
                                        required
                                        maxLength={50}
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="e.g. Lack of Required Skills"
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #e2e8f0', outline: 'none' }}
                                    />
                                </div>

                                <div style={{ marginBottom: '1.25rem' }}>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>Description</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        maxLength={255}
                                        placeholder="Optional detailed description..."
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #e2e8f0', outline: 'none', minHeight: '100px', resize: 'vertical' }}
                                    />
                                </div>

                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>Company</label>
                                    <select
                                        value={formData.company_id || ''}
                                        onChange={(e) => setFormData({ ...formData, company_id: e.target.value ? parseInt(e.target.value) : null })}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            borderRadius: '10px',
                                            border: '1px solid #e2e8f0',
                                            outline: 'none',
                                            backgroundColor: 'white',
                                            color: '#1e293b',
                                            fontSize: '0.95rem',
                                            cursor: 'pointer',
                                            appearance: 'auto'
                                        }}
                                    >
                                        <option value="">All Companies</option>
                                        {companies.length === 0 ? (
                                            <option disabled style={{ color: '#1e293b' }}>No companies available</option>
                                        ) : (
                                            companies.map(comp => (
                                                <option key={comp.id} value={comp.id} style={{ color: '#1e293b' }}>{comp.company}</option>
                                            ))
                                        )}
                                    </select>
                                    {companies.length === 0 && (
                                        <p style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.5rem' }}>
                                            No companies found. Please add companies in Base settings first.
                                        </p>
                                    )}
                                </div>

                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <button
                                        type="submit"
                                        style={{ flex: 1, padding: '0.75rem', borderRadius: '12px', border: 'none', backgroundColor: 'var(--primary-color)', color: 'white', fontWeight: 600, cursor: 'pointer' }}
                                    >
                                        {editingRecord ? 'Update' : 'Create'} Reason
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

export default CandidateRejectReason;
