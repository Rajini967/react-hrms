import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserTag, FaPlus, FaEdit, FaTrash, FaBuilding, FaUserTie } from 'react-icons/fa';

const JobRoles = () => {
    const [records, setRecords] = useState([]);
    const [positions, setPositions] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [formData, setFormData] = useState({
        job_role: '',
        job_position_id: '',
        company_id: []
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [roleRes, posRes, compRes] = await Promise.all([
                api.get('/base/job-roles/'),
                api.get('/base/job-positions/'),
                api.get('/base/companies/')
            ]);
            setRecords(roleRes.data.results || roleRes.data || []);
            setPositions(posRes.data.results || posRes.data || []);
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
                job_role: record.job_role,
                job_position_id: record.job_position_id,
                company_id: record.company_id || []
            });
        } else {
            setEditingRecord(null);
            setFormData({
                job_role: '',
                job_position_id: positions[0]?.id || '',
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
                await api.put(`/base/job-roles/${editingRecord.id}/`, formData);
            } else {
                await api.post('/base/job-roles/', formData);
            }
            fetchData();
            setShowModal(false);
        } catch (error) {
            console.error("Error saving job role:", error);
            alert(error.response?.data?.error || "Failed to save job role");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this job role?")) {
            try {
                await api.delete(`/base/job-roles/${id}/`);
                fetchData();
            } catch (error) {
                console.error("Error deleting job role:", error);
            }
        }
    };

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading job roles...</div>;

    return (
        <div style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b' }}>Job Roles</h2>
                    <p style={{ color: '#64748b', marginTop: '0.25rem' }}>Specific responsibilities within job positions</p>
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
                    <FaPlus /> Add Job Role
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                {records.map((record) => {
                    const pos = positions.find(p => p.id === record.job_position_id);
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
                                        <FaUserTag />
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>{record.job_role}</h3>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748b', fontSize: '0.8rem', marginTop: '2px' }}>
                                            <FaUserTie size={12} /> {pos?.job_position || 'General Position'}
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

                            <div style={{ marginTop: '0.75rem', display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                                {record.company_id?.map(compId => {
                                    const comp = companies.find(c => c.id === compId);
                                    return comp ? (
                                        <span key={compId} style={{
                                            fontSize: '0.65rem',
                                            padding: '2px 6px',
                                            backgroundColor: '#f8fafc',
                                            color: '#94a3b8',
                                            borderRadius: '4px',
                                            border: '1px solid #f1f5f9',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.25rem'
                                        }}>
                                            <FaBuilding size={8} /> {comp.company}
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
                                maxWidth: '500px',
                                boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b' }}>{editingRecord ? 'Edit Job Role' : 'Add Job Role'}</h2>
                                <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#94a3b8' }}>&times;</button>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div style={{ marginBottom: '1.25rem' }}>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>Role Name *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.job_role}
                                        onChange={(e) => setFormData({ ...formData, job_role: e.target.value })}
                                        placeholder="e.g. Frontend Developer"
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #e2e8f0', outline: 'none' }}
                                    />
                                </div>

                                <div style={{ marginBottom: '1.25rem' }}>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>Job Position *</label>
                                    <select
                                        required
                                        value={formData.job_position_id}
                                        onChange={(e) => setFormData({ ...formData, job_position_id: e.target.value })}
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #e2e8f0', outline: 'none' }}
                                    >
                                        <option value="">Select Position</option>
                                        {positions.map(pos => (
                                            <option key={pos.id} value={pos.id}>{pos.job_position}</option>
                                        ))}
                                    </select>
                                </div>

                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>Applicable Companies</label>
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
                                        {editingRecord ? 'Update' : 'Create'} Role
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

export default JobRoles;
