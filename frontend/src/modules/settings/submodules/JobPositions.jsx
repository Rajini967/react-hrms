import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserTie, FaPlus, FaEdit, FaTrash, FaBuilding, FaSitemap } from 'react-icons/fa';

const JobPositions = () => {
    const [records, setRecords] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [formData, setFormData] = useState({
        job_position: '',
        department_id: '',
        company_id: []
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [posRes, depRes, compRes] = await Promise.all([
                api.get('/base/job-positions/'),
                api.get('/base/departments/'),
                api.get('/base/companies/')
            ]);
            setRecords(posRes.data.results || posRes.data || []);
            setDepartments(depRes.data.results || depRes.data || []);
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
                job_position: record.job_position,
                department_id: record.department_id,
                company_id: record.company_id || []
            });
        } else {
            setEditingRecord(null);
            setFormData({
                job_position: '',
                department_id: departments[0]?.id || '',
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
                await api.put(`/base/job-positions/${editingRecord.id}/`, formData);
            } else {
                await api.post('/base/job-positions/', formData);
            }
            fetchData();
            setShowModal(false);
        } catch (error) {
            console.error("Error saving job position:", error);
            alert(error.response?.data?.error || "Failed to save job position");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this job position?")) {
            try {
                await api.delete(`/base/job-positions/${id}/`);
                fetchData();
            } catch (error) {
                console.error("Error deleting job position:", error);
            }
        }
    };

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading job positions...</div>;

    return (
        <div style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b' }}>Job Positions</h2>
                    <p style={{ color: '#64748b', marginTop: '0.25rem' }}>Define official roles and titles within your organization</p>
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
                    <FaPlus /> Add Job Position
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
                {records.map((record) => {
                    const dept = departments.find(d => d.id === record.department_id);
                    return (
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
                                boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{
                                        width: '44px',
                                        height: '44px',
                                        borderRadius: '12px',
                                        backgroundColor: 'rgba(79, 70, 229, 0.1)',
                                        color: 'var(--primary-color)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '1.1rem'
                                    }}>
                                        <FaUserTie />
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>{record.job_position}</h3>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748b', fontSize: '0.8rem', marginTop: '2px' }}>
                                            <FaSitemap /> {dept?.department || 'Unassigned Department'}
                                        </div>
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

                            <div style={{ marginTop: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                                {record.company_id?.map(compId => {
                                    const comp = companies.find(c => c.id === compId);
                                    return comp ? (
                                        <span key={compId} style={{
                                            fontSize: '0.7rem',
                                            padding: '3px 8px',
                                            backgroundColor: '#f8fafc',
                                            color: '#94a3b8',
                                            borderRadius: '6px',
                                            border: '1px solid #f1f5f9',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.3rem'
                                        }}>
                                            <FaBuilding size={9} /> {comp.company}
                                        </span>
                                    ) : null;
                                })}
                            </div>
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
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b' }}>{editingRecord ? 'Edit Job Position' : 'Add Job Position'}</h2>
                                <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#94a3b8' }}>&times;</button>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div style={{ marginBottom: '1.25rem' }}>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>Job Title *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.job_position}
                                        onChange={(e) => setFormData({ ...formData, job_position: e.target.value })}
                                        placeholder="e.g. Senior Software Engineer"
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #e2e8f0', outline: 'none' }}
                                    />
                                </div>

                                <div style={{ marginBottom: '1.25rem' }}>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>Department *</label>
                                    <select
                                        required
                                        value={formData.department_id}
                                        onChange={(e) => setFormData({ ...formData, department_id: e.target.value })}
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #e2e8f0', outline: 'none' }}
                                    >
                                        <option value="">Select Department</option>
                                        {departments.map(dept => (
                                            <option key={dept.id} value={dept.id}>{dept.department}</option>
                                        ))}
                                    </select>
                                </div>

                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>Available in Companies</label>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: '150px', overflowY: 'auto', padding: '0.5rem', border: '1px solid #f1f5f9', borderRadius: '10px' }}>
                                        {companies.map(comp => (
                                            <div
                                                key={comp.id}
                                                onClick={() => handleCompanyToggle(comp.id)}
                                                style={{
                                                    padding: '0.65rem',
                                                    borderRadius: '8px',
                                                    cursor: 'pointer',
                                                    backgroundColor: formData.company_id.includes(comp.id) ? 'rgba(79, 70, 229, 0.05)' : 'transparent',
                                                    border: '1px solid',
                                                    borderColor: formData.company_id.includes(comp.id) ? 'var(--primary-color)' : '#f1f5f9',
                                                    color: formData.company_id.includes(comp.id) ? 'var(--primary-color)' : '#64748b',
                                                    fontSize: '0.875rem',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.65rem'
                                                }}
                                            >
                                                <input type="checkbox" checked={formData.company_id.includes(comp.id)} readOnly />
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
                                        {editingRecord ? 'Update' : 'Create'} Position
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

export default JobPositions;
