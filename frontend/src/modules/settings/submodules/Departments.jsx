import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSitemap, FaPlus, FaEdit, FaTrash, FaBuilding } from 'react-icons/fa';

const Departments = () => {
    const [records, setRecords] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [formData, setFormData] = useState({
        department: '',
        company_id: []
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [depRes, compRes] = await Promise.all([
                api.get('/base/departments/'),
                api.get('/base/companies/')
            ]);
            setRecords(depRes.data.results || depRes.data || []);
            setCompanies(compRes.data.results || compRes.data || []);
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
                department: record.department,
                company_id: record.company_id || []
            });
        } else {
            setEditingRecord(null);
            setFormData({
                department: '',
                company_id: []
            });
        }
        setShowModal(true);
    };

    const handleCompanyToggle = (companyId) => {
        setFormData(prev => {
            const isSelected = prev.company_id.includes(companyId);
            if (isSelected) {
                return { ...prev, company_id: prev.company_id.filter(id => id !== companyId) };
            } else {
                return { ...prev, company_id: [...prev.company_id, companyId] };
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingRecord) {
                await api.put(`/base/departments/${editingRecord.id}/`, formData);
            } else {
                await api.post('/base/departments/', formData);
            }
            fetchData();
            setShowModal(false);
        } catch (error) {
            console.error("Error saving department:", error);
            alert(error.response?.data?.error || "Failed to save department");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this department?")) {
            try {
                await api.delete(`/base/departments/${id}/`);
                fetchData();
            } catch (error) {
                console.error("Error deleting department:", error);
            }
        }
    };

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading departments...</div>;

    return (
        <div style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b' }}>Departments</h2>
                    <p style={{ color: '#64748b', marginTop: '0.25rem' }}>Organize your workforce into functional units</p>
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
                    <FaPlus /> Add Department
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                {records.map((record) => (
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
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '10px',
                                    backgroundColor: 'rgba(79, 70, 229, 0.1)',
                                    color: 'var(--primary-color)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1rem'
                                }}>
                                    <FaSitemap />
                                </div>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>{record.department}</h3>
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

                        <div style={{ marginTop: '1rem' }}>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                {record.company_id?.map(compId => {
                                    const comp = companies.find(c => c.id === compId);
                                    return comp ? (
                                        <span key={compId} style={{
                                            fontSize: '0.75rem',
                                            padding: '4px 10px',
                                            backgroundColor: '#f8fafc',
                                            color: '#64748b',
                                            borderRadius: '8px',
                                            border: '1px solid #eef2f6',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.4rem'
                                        }}>
                                            <FaBuilding size={10} /> {comp.company}
                                        </span>
                                    ) : null;
                                })}
                            </div>
                        </div>
                    </motion.div>
                ))}
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
                                maxWidth: '500px',
                                boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b' }}>{editingRecord ? 'Edit Department' : 'Add Department'}</h2>
                                <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#94a3b8' }}>&times;</button>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>Department Name *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.department}
                                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #e2e8f0', outline: 'none' }}
                                    />
                                </div>

                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>Assigned Companies</label>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '200px', overflowY: 'auto', padding: '0.5rem', border: '1px solid #f1f5f9', borderRadius: '10px' }}>
                                        {companies.map(comp => (
                                            <div
                                                key={comp.id}
                                                onClick={() => handleCompanyToggle(comp.id)}
                                                style={{
                                                    padding: '0.75rem',
                                                    borderRadius: '8px',
                                                    cursor: 'pointer',
                                                    backgroundColor: formData.company_id.includes(comp.id) ? 'rgba(79, 70, 229, 0.05)' : 'transparent',
                                                    border: '1px solid',
                                                    borderColor: formData.company_id.includes(comp.id) ? 'var(--primary-color)' : '#f1f5f9',
                                                    color: formData.company_id.includes(comp.id) ? 'var(--primary-color)' : '#64748b',
                                                    fontSize: '0.875rem',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.75rem',
                                                    transition: 'all 0.2s'
                                                }}
                                            >
                                                <input type="checkbox" checked={formData.company_id.includes(comp.id)} readOnly style={{ cursor: 'pointer' }} />
                                                <span>{comp.company}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <button
                                        type="submit"
                                        style={{ flex: 1, padding: '0.75rem', borderRadius: '12px', border: 'none', backgroundColor: 'var(--primary-color)', color: 'white', fontWeight: 600, cursor: 'pointer' }}
                                    >
                                        {editingRecord ? 'Update' : 'Create'}
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
        </div>
    );
};

export default Departments;
