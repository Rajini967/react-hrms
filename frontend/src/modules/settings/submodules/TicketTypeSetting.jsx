import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTicketAlt, FaPlus, FaTrash, FaEdit, FaHashtag, FaFilter } from 'react-icons/fa';
import useToast from '../../../hooks/useToast';
import Toast from '../../../components/common/Toast';

const TicketTypeSetting = () => {
    const [types, setTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingType, setEditingType] = useState(null);
    const { toasts, showToast, removeToast } = useToast();

    const [formData, setFormData] = useState({
        title: '',
        type: 'service_request',
        prefix: ''
    });

    const ticketCategories = [
        { id: 'suggestion', label: 'Suggestion' },
        { id: 'complaint', label: 'Complaint' },
        { id: 'service_request', label: 'Service Request' },
        { id: 'meeting_request', label: 'Meeting Request' },
        { id: 'anounymous_complaint', label: 'Anonymous Complaint' },
        { id: 'others', label: 'Others' }
    ];

    useEffect(() => {
        fetchTypes();
    }, []);

    const fetchTypes = async () => {
        setLoading(true);
        try {
            const response = await api.get('/helpdesk/ticket-types/');
            setTypes(response.data.results || response.data || []);
        } catch (error) {
            console.error("Error fetching ticket types:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (type = null) => {
        if (type) {
            setEditingType(type);
            setFormData({
                title: type.title || '',
                type: type.type || 'service_request',
                prefix: type.prefix || ''
            });
        } else {
            setEditingType(null);
            setFormData({ title: '', type: 'service_request', prefix: '' });
        }
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingType) {
                await api.put(`/helpdesk/ticket-types/${editingType.id}/`, formData);
                showToast('Ticket type updated', 'success');
            } else {
                await api.post('/helpdesk/ticket-types/', formData);
                showToast('New ticket type created', 'success');
            }
            fetchTypes();
            setShowModal(false);
        } catch (error) {
            showToast('Failed to save ticket type', 'error');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete this ticket type? This may affect existing tickets.")) {
            try {
                await api.delete(`/helpdesk/ticket-types/${id}/`);
                setTypes(prev => prev.filter(t => t.id !== id));
                showToast('Ticket type deleted', 'success');
            } catch (error) {
                showToast('Failed to delete', 'error');
            }
        }
    };

    if (loading) return <div style={{ padding: '4rem', textAlign: 'center' }}>Organizing ticket flow...</div>;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Ticket Taxonomy</h2>
                    <p style={{ color: '#64748b', marginTop: '0.25rem' }}>Define categories and numbering prefixes for support tickets.</p>
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
                        backgroundColor: '#8b5cf6',
                        borderColor: '#8b5cf6',
                        boxShadow: '0 4px 12px rgba(139, 92, 246, 0.25)'
                    }}
                >
                    <FaPlus /> New Ticket Type
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
                {types.map(item => (
                    <motion.div
                        key={item.id}
                        whileHover={{ y: -4 }}
                        style={{
                            backgroundColor: '#fff',
                            borderRadius: '24px',
                            padding: '1.75rem',
                            border: '1px solid #f1f5f9',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                            <div style={{
                                width: '48px',
                                height: '48px',
                                backgroundColor: 'rgba(139, 92, 246, 0.1)',
                                color: '#8b5cf6',
                                borderRadius: '14px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.25rem'
                            }}>
                                <FaTicketAlt />
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button onClick={() => handleOpenModal(item)} style={{ color: '#64748b', background: '#f8fafc', border: 'none', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer' }}><FaEdit size={14} /></button>
                                <button onClick={() => handleDelete(item.id)} style={{ color: '#ef4444', background: '#fee2e2', border: 'none', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer' }}><FaTrash size={14} /></button>
                            </div>
                        </div>

                        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.5rem' }}>{item.title}</h3>

                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748b', fontSize: '0.85rem' }}>
                                <FaHashtag size={12} />
                                <span style={{ fontWeight: 700, color: '#444' }}>{item.prefix}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748b', fontSize: '0.85rem' }}>
                                <FaFilter size={12} />
                                <span>{item.type.replace('_', ' ').toUpperCase()}</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {types.length === 0 && (
                <div style={{ textAlign: 'center', padding: '5rem 0', color: '#94a3b8' }}>
                    <FaTicketAlt size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                    <p>No ticket types defined yet.</p>
                </div>
            )}

            {/* Modal */}
            <AnimatePresence>
                {showModal && (
                    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1200 }}>
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ backgroundColor: '#fff', borderRadius: '28px', padding: '2.5rem', width: '100%', maxWidth: '500px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>{editingType ? 'Edit Ticket Type' : 'New Ticket Type'}</h3>
                                <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', color: '#94a3b8', cursor: 'pointer' }}>&times;</button>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 700, color: '#475569' }}>Title</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        required
                                        style={{ width: '100%', padding: '0.875rem 1rem', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none' }}
                                        placeholder="e.g. IT Support"
                                    />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 700, color: '#475569' }}>Prefix</label>
                                        <input
                                            type="text"
                                            maxLength={3}
                                            value={formData.prefix}
                                            onChange={e => setFormData({ ...formData, prefix: e.target.value.toUpperCase() })}
                                            required
                                            style={{ width: '100%', padding: '0.875rem 1rem', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none' }}
                                            placeholder="ITS"
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 700, color: '#475569' }}>Category</label>
                                        <select
                                            value={formData.type}
                                            onChange={e => setFormData({ ...formData, type: e.target.value })}
                                            required
                                            style={{ width: '100%', padding: '0.875rem 1rem', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none', backgroundColor: '#f8fafc' }}
                                        >
                                            {ticketCategories.map(cat => <option key={cat.id} value={cat.id}>{cat.label}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    style={{
                                        width: '100%',
                                        padding: '1rem',
                                        borderRadius: '16px',
                                        fontWeight: 700,
                                        backgroundColor: '#8b5cf6',
                                        borderColor: '#8b5cf6',
                                        boxShadow: '0 4px 12px rgba(139, 92, 246, 0.25)'
                                    }}
                                >
                                    {editingType ? 'Update Ticket Type' : 'Create Ticket Type'}
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

export default TicketTypeSetting;
