import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { FaLayerGroup, FaPlus, FaTrash, FaEdit, FaPalette, FaClock, FaCheckCircle, FaMoneyBillWave } from 'react-icons/fa';
import useToast from '../../../hooks/useToast';
import Toast from '../../../components/common/Toast';

const LeaveTypes = () => {
    const [types, setTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingType, setEditingType] = useState(null);
    const { toasts, showToast, removeToast } = useToast();

    const [formData, setFormData] = useState({
        name: '',
        color: '#4f46e5',
        payment: 'unpaid',
        count: 1,
        period_in: 'day',
        limit_leave: true,
        total_days: 1,
        require_approval: 'yes',
        is_encashable: false
    });

    useEffect(() => {
        fetchTypes();
    }, []);

    const fetchTypes = async () => {
        setLoading(true);
        try {
            const response = await api.get('/leave/leave-types/');
            setTypes(response.data.results || response.data || []);
        } catch (error) {
            console.error("Error fetching leave types:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (type = null) => {
        if (type) {
            setEditingType(type);
            setFormData({
                name: type.name || '',
                color: type.color || '#4f46e5',
                payment: type.payment || 'unpaid',
                count: type.count || 1,
                period_in: type.period_in || 'day',
                limit_leave: type.limit_leave ?? true,
                total_days: type.total_days || 1,
                require_approval: type.require_approval || 'yes',
                is_encashable: type.is_encashable ?? false
            });
        } else {
            setEditingType(null);
            setFormData({
                name: '', color: '#4f46e5', payment: 'unpaid', count: 1, period_in: 'day',
                limit_leave: true, total_days: 1, require_approval: 'yes', is_encashable: false
            });
        }
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingType) {
                await api.put(`/leave/leave-types/${editingType.id}/`, formData);
                showToast('Leave type updated', 'success');
            } else {
                await api.post('/leave/leave-types/', formData);
                showToast('New leave type created', 'success');
            }
            fetchTypes();
            setShowModal(false);
        } catch (error) {
            showToast('Failed to save leave type', 'error');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete this leave type? This will affect all associated records.")) {
            try {
                await api.delete(`/leave/leave-types/${id}/`);
                setTypes(prev => prev.filter(t => t.id !== id));
                showToast('Leave type deleted', 'success');
            } catch (error) {
                showToast('Failed to delete', 'error');
            }
        }
    };

    if (loading) return <div style={{ padding: '4rem', textAlign: 'center' }}>Cataloging leave balance...</div>;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Leave Taxonomy</h2>
                    <p style={{ color: '#64748b', marginTop: '0.25rem' }}>Define different types of time-off and their associated policies.</p>
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
                        backgroundColor: '#4f46e5',
                        boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)'
                    }}
                >
                    <FaPlus /> New Leave Type
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                {types.map(item => (
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
                        <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', backgroundColor: item.color }}></div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                            <div style={{
                                width: '44px',
                                height: '44px',
                                backgroundColor: `${item.color}15`,
                                color: item.color,
                                borderRadius: '14px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.1rem'
                            }}>
                                <FaLayerGroup />
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button onClick={() => handleOpenModal(item)} style={{ color: '#64748b', background: '#f8fafc', border: 'none', padding: '0.4rem', borderRadius: '8px', cursor: 'pointer' }}><FaEdit size={14} /></button>
                                <button onClick={() => handleDelete(item.id)} style={{ color: '#ef4444', background: '#fee2e2', border: 'none', padding: '0.4rem', borderRadius: '8px', cursor: 'pointer' }}><FaTrash size={14} /></button>
                            </div>
                        </div>

                        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.5rem' }}>{item.name}</h3>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '1rem' }}>
                            <div style={{ padding: '0.35rem 0.75rem', borderRadius: '10px', backgroundColor: '#f1f5f9', color: '#475569', fontSize: '0.8rem', fontWeight: 700 }}>
                                {item.total_days} {item.period_in}s
                            </div>
                            <div style={{ padding: '0.35rem 0.75rem', borderRadius: '10px', backgroundColor: item.payment === 'paid' ? '#ecfdf5' : '#fff1f2', color: item.payment === 'paid' ? '#10b981' : '#ef4444', fontSize: '0.8rem', fontWeight: 700 }}>
                                {item.payment.toUpperCase()}
                            </div>
                            {item.is_encashable && (
                                <div style={{ padding: '0.35rem 0.75rem', borderRadius: '10px', backgroundColor: '#fefce8', color: '#a16207', fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                    <FaMoneyBillWave size={10} /> Encashable
                                </div>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>

            {types.length === 0 && (
                <div style={{ textAlign: 'center', padding: '5rem 0', color: '#94a3b8' }}>
                    <FaLayerGroup size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                    <p>No leave types configured yet.</p>
                </div>
            )}

            {/* Modal */}
            <AnimatePresence>
                {showModal && (
                    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1200 }}>
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ backgroundColor: '#fff', borderRadius: '32px', padding: '3rem', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>{editingType ? 'Edit Policy' : 'New Policy'}</h3>
                                <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', color: '#94a3b8', cursor: 'pointer' }}>&times;</button>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                                    <div style={{ gridColumn: 'span 2' }}>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 700, color: '#475569' }}>Leave Name</label>
                                        <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required style={{ width: '100%', padding: '0.875rem 1rem', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none' }} placeholder="e.g. Sick Leave" />
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 700, color: '#475569' }}>Identification Color</label>
                                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                            <input type="color" value={formData.color} onChange={e => setFormData({ ...formData, color: e.target.value })} style={{ width: '40px', height: '40px', border: 'none', borderRadius: '8px', cursor: 'pointer' }} />
                                            <span style={{ fontSize: '0.9rem', color: '#64748b', fontFamily: 'monospace' }}>{formData.color}</span>
                                        </div>
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 700, color: '#475569' }}>Payment Type</label>
                                        <select value={formData.payment} onChange={e => setFormData({ ...formData, payment: e.target.value })} style={{ width: '100%', padding: '0.875rem 1rem', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none', backgroundColor: '#f8fafc', color: '#1e293b' }}>
                                            <option value="paid" style={{ color: '#1e293b' }}>Paid</option>
                                            <option value="unpaid" style={{ color: '#1e293b' }}>Unpaid</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 700, color: '#475569' }}>Annual Entitlement</label>
                                        <input type="number" value={formData.total_days} onChange={e => setFormData({ ...formData, total_days: e.target.value })} required style={{ width: '100%', padding: '0.875rem 1rem', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none' }} />
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 700, color: '#475569' }}>Time Period</label>
                                        <select value={formData.period_in} onChange={e => setFormData({ ...formData, period_in: e.target.value })} style={{ width: '100%', padding: '0.875rem 1rem', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none', backgroundColor: '#f8fafc', color: '#1e293b' }}>
                                            <option value="day" style={{ color: '#1e293b' }}>Days</option>
                                            <option value="hour" style={{ color: '#1e293b' }}>Hours</option>
                                        </select>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '2rem', marginBottom: '2.5rem', backgroundColor: '#f8fafc', padding: '1.5rem', borderRadius: '20px' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                                        <input type="checkbox" checked={formData.is_encashable} onChange={e => setFormData({ ...formData, is_encashable: e.target.checked })} style={{ width: '18px', height: '18px', accentColor: '#4f46e5' }} />
                                        <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1e293b' }}>Leave Encashable</span>
                                    </label>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                                        <input type="checkbox" checked={formData.limit_leave} onChange={e => setFormData({ ...formData, limit_leave: e.target.checked })} style={{ width: '18px', height: '18px', accentColor: '#4f46e5' }} />
                                        <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1e293b' }}>Limit Leave Days</span>
                                    </label>
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    style={{
                                        width: '100%',
                                        padding: '1.25rem',
                                        borderRadius: '18px',
                                        fontWeight: 800,
                                        backgroundColor: '#4f46e5',
                                        boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)'
                                    }}
                                >
                                    {editingType ? 'Update Leave Policy' : 'Authorize Leave Type'}
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

export default LeaveTypes;
