import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBuilding, FaPlus, FaTrash, FaEdit, FaCalendarAlt, FaDoorOpen } from 'react-icons/fa';
import useToast from '../../../hooks/useToast';
import Toast from '../../../components/common/Toast';

const CompanyLeaves = () => {
    const [leaves, setLeaves] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingLeave, setEditingLeave] = useState(null);
    const { toasts, showToast, removeToast } = useToast();

    const [formData, setFormData] = useState({
        title: '',
        start_date: '',
        end_date: '',
        company_id: null
    });

    useEffect(() => {
        fetchLeaves();
        fetchCompanies();
    }, []);

    const fetchLeaves = async () => {
        setLoading(true);
        try {
            const response = await api.get('/leave/company-leaves/');
            setLeaves(response.data.results || response.data || []);
        } catch (error) {
            console.error("Error fetching company leaves:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCompanies = async () => {
        try {
            const response = await api.get('/base/companies/');
            setCompanies(response.data.results || response.data || []);
        } catch (error) {
            console.error("Error fetching companies:", error);
        }
    };

    const handleOpenModal = (leave = null) => {
        if (leave) {
            setEditingLeave(leave);
            setFormData({
                title: leave.title || '',
                start_date: leave.start_date || '',
                end_date: leave.end_date || '',
                company_id: leave.company_id?.id || leave.company_id
            });
        } else {
            setEditingLeave(null);
            setFormData({ title: '', start_date: '', end_date: '', company_id: null });
        }
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingLeave) {
                await api.put(`/leave/company-leaves/${editingLeave.id}/`, formData);
                showToast('Company leave updated', 'success');
            } else {
                await api.post('/leave/company-leaves/', formData);
                showToast('New company leave created', 'success');
            }
            fetchLeaves();
            setShowModal(false);
        } catch (error) {
            showToast('Failed to save company leave', 'error');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete this company-wide leave?")) {
            try {
                await api.delete(`/leave/company-leaves/${id}/`);
                setLeaves(prev => prev.filter(l => l.id !== id));
                showToast('Record removed', 'success');
            } catch (error) {
                showToast('Failed to delete', 'error');
            }
        }
    };

    if (loading) return <div style={{ padding: '4rem', textAlign: 'center' }}>Synchronizing corporate shutdowns...</div>;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Corporate Shutdowns</h2>
                    <p style={{ color: '#64748b', marginTop: '0.25rem' }}>Manage company-wide holidays and office closure dates.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="btn btn-primary"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        borderRadius: '12px',
                        padding: '0.75rem 1.5rem',
                        backgroundColor: '#ec4899',
                        borderColor: '#ec4899',
                        boxShadow: '0 4px 12px rgba(236, 72, 153, 0.25)'
                    }}
                >
                    <FaPlus /> Schedule Shutdown
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
                {leaves.map(item => (
                    <motion.div
                        key={item.id}
                        whileHover={{ y: -4 }}
                        style={{
                            backgroundColor: '#fff',
                            borderRadius: '24px',
                            padding: '1.75rem',
                            border: '1px solid #f1f5f9',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                            <div style={{
                                width: '48px',
                                height: '48px',
                                backgroundColor: '#fdf2f8',
                                color: '#ec4899',
                                borderRadius: '15px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.25rem'
                            }}>
                                <FaDoorOpen />
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button onClick={() => handleOpenModal(item)} style={{ color: '#64748b', background: '#f8fafc', border: 'none', padding: '0.5rem', borderRadius: '10px', cursor: 'pointer' }}><FaEdit size={14} /></button>
                                <button onClick={() => handleDelete(item.id)} style={{ color: '#ef4444', background: '#fee2e2', border: 'none', padding: '0.5rem', borderRadius: '10px', cursor: 'pointer' }}><FaTrash size={14} /></button>
                            </div>
                        </div>

                        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.75rem' }}>{item.title}</h3>

                        <div style={{ spaceY: '0.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.875rem' }}>
                                <FaCalendarAlt size={12} />
                                <span>{item.start_date} → {item.end_date}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.875rem', marginTop: '0.4rem' }}>
                                <FaBuilding size={12} />
                                <span>{item.company_id?.company || 'Organization Wide'}</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {leaves.length === 0 && (
                <div style={{ textAlign: 'center', padding: '5rem 0', color: '#94a3b8' }}>
                    <FaDoorOpen size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                    <p>No corporate shutdowns scheduled.</p>
                </div>
            )}

            {/* Modal */}
            <AnimatePresence>
                {showModal && (
                    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1200 }}>
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ backgroundColor: '#fff', borderRadius: '28px', padding: '2.5rem', width: '100%', maxWidth: '500px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>{editingLeave ? 'Edit Shutdown' : 'Schedule Shutdown'}</h3>
                                <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', color: '#94a3b8', cursor: 'pointer' }}>&times;</button>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 700, color: '#475569' }}>Shutdown Name</label>
                                    <input type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required style={{ width: '100%', padding: '0.875rem 1rem', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none' }} placeholder="e.g. Annual Winter Break" />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 700, color: '#475569' }}>Start Date</label>
                                        <input type="date" value={formData.start_date} onChange={e => setFormData({ ...formData, start_date: e.target.value })} required style={{ width: '100%', padding: '0.875rem 1rem', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none' }} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 700, color: '#475569' }}>End Date</label>
                                        <input type="date" value={formData.end_date} onChange={e => setFormData({ ...formData, end_date: e.target.value })} required style={{ width: '100%', padding: '0.875rem 1rem', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none' }} />
                                    </div>
                                </div>

                                <div style={{ marginBottom: '2.5rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 700, color: '#475569' }}>Target Company</label>
                                    <select value={formData.company_id || ''} onChange={e => setFormData({ ...formData, company_id: e.target.value || null })} style={{ width: '100%', padding: '0.875rem 1rem', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none', backgroundColor: '#f8fafc', color: '#1e293b' }}>
                                        <option value="" style={{ color: '#1e293b' }}>All Companies</option>
                                        {companies.map(c => <option key={c.id} value={c.id} style={{ color: '#1e293b' }}>{c.company}</option>)}
                                    </select>
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    style={{
                                        width: '100%',
                                        padding: '1rem',
                                        borderRadius: '16px',
                                        fontWeight: 700,
                                        backgroundColor: '#ec4899',
                                        borderColor: '#ec4899',
                                        boxShadow: '0 4px 12px rgba(236, 72, 153, 0.25)'
                                    }}
                                >
                                    {editingLeave ? 'Update Record' : 'Commit Schedule'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {toasts.map(toast => (
                    <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => removeToast(toast.id)} />
                ))}
            </AnimatePresence>
        </motion.div>
    );
};

export default CompanyLeaves;
