import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { FaShieldAlt, FaPlus, FaTrash, FaEdit, FaCalendarAlt, FaBuilding, FaExclamationTriangle } from 'react-icons/fa';
import useToast from '../../../hooks/useToast';
import Toast from '../../../components/common/Toast';

const LeaveRestrictions = () => {
    const [restrictions, setRestrictions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingRestriction, setEditingRestriction] = useState(null);
    const { toasts, showToast, removeToast } = useToast();

    // Related data for dropdowns
    const [departments, setDepartments] = useState([]);
    const [leaveTypes, setLeaveTypes] = useState([]);
    const [jobPositions, setJobPositions] = useState([]);

    const [formData, setFormData] = useState({
        title: '',
        start_date: '',
        end_date: '',
        department: '',
        job_position: [],
        include_all: true,
        specific_leave_types: [],
        excluded_leave_types: [],
        description: ''
    });

    useEffect(() => {
        fetchRestrictions();
        fetchRelatedData();
    }, []);

    const fetchRestrictions = async () => {
        setLoading(true);
        try {
            // Placeholder endpoint - adjust based on real API availability
            const response = await api.get('/leave/restrict-leaves/');
            setRestrictions(response.data.results || response.data || []);
        } catch (error) {
            console.error("Error fetching restrictions:", error);
            setRestrictions([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchRelatedData = async () => {
        try {
            const [depRes, leaveRes, jobRes] = await Promise.all([
                api.get('/base/departments/'),
                api.get('/leave/leave-types/'),
                api.get('/base/job-positions/')
            ]);
            setDepartments(depRes.data || []);
            setLeaveTypes(leaveRes.data.results || leaveRes.data || []);
            setJobPositions(jobRes.data.results || jobRes.data || []);
        } catch (error) {
            console.error("Error fetching form data:", error);
        }
    };

    const handleOpenModal = (restriction = null) => {
        if (restriction) {
            setEditingRestriction(restriction);
            setFormData({
                ...restriction,
                department: restriction.department?.id || restriction.department,
                job_position: (restriction.job_position || []).map(j => j.id || j),
                specific_leave_types: (restriction.specific_leave_types || []).map(l => l.id || l),
                excluded_leave_types: (restriction.excluded_leave_types || []).map(l => l.id || l)
            });
        } else {
            setEditingRestriction(null);
            setFormData({
                title: '',
                start_date: '',
                end_date: '',
                department: '',
                job_position: [],
                include_all: true,
                specific_leave_types: [],
                excluded_leave_types: [],
                description: ''
            });
        }
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingRestriction) {
                await api.put(`/leave/restrict-leaves/${editingRestriction.id}/`, formData);
                showToast('Restriction updated', 'success');
            } else {
                await api.post('/leave/restrict-leaves/', formData);
                showToast('New restriction created', 'success');
            }
            fetchRestrictions();
            setShowModal(false);
        } catch (error) {
            showToast('API Endpoint not available or failed to save', 'error');
        }
    };

    if (loading) return <div style={{ padding: '4rem', textAlign: 'center' }}>Analyzing blackout dates...</div>;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Leave Blackout Periods</h2>
                    <p style={{ color: '#64748b', marginTop: '0.25rem' }}>Restrict leave requests during critical business periods or for specific departments.</p>
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
                        backgroundColor: '#0f172a',
                        borderColor: '#0f172a',
                        boxShadow: '0 4px 12px rgba(15, 23, 42, 0.2)'
                    }}
                >
                    <FaPlus /> Define Blackout
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
                {restrictions.map(item => (
                    <motion.div
                        key={item.id}
                        whileHover={{ y: -4 }}
                        style={{
                            backgroundColor: '#fff',
                            borderRadius: '24px',
                            padding: '1.75rem',
                            border: '1px solid #f1f5f9',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <div style={{ backgroundColor: '#fef2f2', color: '#ef4444', padding: '0.5rem 1rem', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <FaExclamationTriangle size={12} /> Restricted
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button onClick={() => handleOpenModal(item)} style={{ color: '#64748b', background: '#f8fafc', border: 'none', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer' }}><FaEdit size={14} /></button>
                                <button onClick={() => showToast('Delete functionality pending API', 'info')} style={{ color: '#ef4444', background: '#fee2e2', border: 'none', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer' }}><FaTrash size={14} /></button>
                            </div>
                        </div>

                        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e293b', marginBottom: '1rem' }}>{item.title}</h3>

                        <div style={{ spaceY: '0.75rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#64748b', fontSize: '0.9rem' }}>
                                <FaCalendarAlt />
                                <span>{item.start_date} to {item.end_date}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#64748b', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                                <FaBuilding />
                                <span>{typeof item.department === 'object' ? item.department.department : 'Department Restricted'}</span>
                            </div>
                        </div>

                        <p style={{ marginTop: '1.25rem', fontSize: '0.85rem', color: '#94a3b8', borderTop: '1px solid #f8fafc', paddingTop: '1rem' }}>
                            {item.description || 'No additional details provided.'}
                        </p>
                    </motion.div>
                ))}
            </div>

            {restrictions.length === 0 && (
                <div style={{ textAlign: 'center', padding: '5rem 0' }}>
                    <div style={{ width: '80px', height: '80px', backgroundColor: '#f8fafc', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                        <FaShieldAlt size={32} style={{ color: '#e2e8f0' }} />
                    </div>
                    <h3 style={{ color: '#1e293b', fontWeight: 700 }}>No Restrictions Active</h3>
                    <p style={{ color: '#94a3b8', maxWidth: '300px', margin: '0.5rem auto' }}>Define blackout dates where leave requests will be restricted.</p>
                </div>
            )}

            {/* Modal - Simplified for brevity but still premium */}
            <AnimatePresence>
                {showModal && (
                    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1200 }}>
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ backgroundColor: '#fff', borderRadius: '32px', padding: '3rem', width: '100%', maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                                <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>{editingRestriction ? 'Modify Blackout' : 'Define Blackout'}</h3>
                                <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', color: '#94a3b8', cursor: 'pointer' }}>&times;</button>
                            </div>

                            <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <div style={{ gridColumn: 'span 2' }}>
                                    <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.9rem', fontWeight: 700, color: '#475569' }}>Restriction Title</label>
                                    <input type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required style={{ width: '100%', padding: '1rem', borderRadius: '16px', border: '1px solid #e2e8f0', outline: 'none' }} placeholder="e.g. Year-end Peak Season" />
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.9rem', fontWeight: 700, color: '#475569' }}>Start Date</label>
                                    <input type="date" value={formData.start_date} onChange={e => setFormData({ ...formData, start_date: e.target.value })} required style={{ width: '100%', padding: '1rem', borderRadius: '16px', border: '1px solid #e2e8f0', outline: 'none' }} />
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.9rem', fontWeight: 700, color: '#475569' }}>End Date</label>
                                    <input type="date" value={formData.end_date} onChange={e => setFormData({ ...formData, end_date: e.target.value })} required style={{ width: '100%', padding: '1rem', borderRadius: '16px', border: '1px solid #e2e8f0', outline: 'none' }} />
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.9rem', fontWeight: 700, color: '#475569' }}>Target Department</label>
                                    <select value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })} required style={{ width: '100%', padding: '1rem', borderRadius: '16px', border: '1px solid #e2e8f0', outline: 'none', backgroundColor: '#f8fafc' }}>
                                        <option value="">Select Department</option>
                                        {departments.map(d => <option key={d.id} value={d.id}>{d.department}</option>)}
                                    </select>
                                </div>

                                <div style={{ gridColumn: 'span 2', marginTop: '1rem' }}>
                                    <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1.25rem', borderRadius: '20px', fontWeight: 800, backgroundColor: '#0f172a', borderColor: '#0f172a' }}>
                                        Save Restriction Policy
                                    </button>
                                </div>
                            </form>
                            <p style={{ marginTop: '1.5rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.8rem' }}>
                                Note: This feature requires backend API support for full functionality.
                            </p>
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

export default LeaveRestrictions;
