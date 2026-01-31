import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUmbrellaBeach, FaPlus, FaTrash, FaEdit, FaCalendarDay, FaBuilding } from 'react-icons/fa';
import useToast from '../../../hooks/useToast';
import Toast from '../../../components/common/Toast';

const Holidays = () => {
    const [holidays, setHolidays] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingHoliday, setEditingHoliday] = useState(null);
    const { toasts, showToast, removeToast } = useToast();

    const [formData, setFormData] = useState({
        name: '',
        date: '',
        company_id: null
    });

    useEffect(() => {
        fetchHolidays();
        fetchCompanies();
    }, []);

    const fetchHolidays = async () => {
        setLoading(true);
        try {
            const response = await api.get('/leave/holidays/');
            setHolidays(response.data.results || response.data || []);
        } catch (error) {
            console.error("Error fetching holidays:", error);
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

    const handleOpenModal = (holiday = null) => {
        if (holiday) {
            setEditingHoliday(holiday);
            setFormData({
                name: holiday.name || '',
                date: holiday.date || '',
                company_id: holiday.company_id?.id || holiday.company_id
            });
        } else {
            setEditingHoliday(null);
            setFormData({ name: '', date: '', company_id: null });
        }
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingHoliday) {
                await api.put(`/leave/holidays/${editingHoliday.id}/`, formData);
                showToast('Holiday updated', 'success');
            } else {
                await api.post('/leave/holidays/', formData);
                showToast('New holiday created', 'success');
            }
            fetchHolidays();
            setShowModal(false);
        } catch (error) {
            showToast('Failed to save holiday', 'error');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete this holiday?")) {
            try {
                await api.delete(`/leave/holidays/${id}/`);
                setHolidays(prev => prev.filter(h => h.id !== id));
                showToast('Holiday deleted', 'success');
            } catch (error) {
                showToast('Failed to delete', 'error');
            }
        }
    };

    if (loading) return <div style={{ padding: '4rem', textAlign: 'center' }}>Syncing public calendar...</div>;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Public Holidays</h2>
                    <p style={{ color: '#64748b', marginTop: '0.25rem' }}>Set organization-wide official non-working days.</p>
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
                        backgroundColor: '#f59e0b',
                        borderColor: '#f59e0b',
                        boxShadow: '0 4px 12px rgba(245, 158, 11, 0.25)'
                    }}
                >
                    <FaPlus /> Add Holiday
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                {holidays.map(item => (
                    <motion.div
                        key={item.id}
                        whileHover={{ y: -4 }}
                        style={{
                            backgroundColor: '#fff',
                            borderRadius: '24px',
                            padding: '1.75rem',
                            border: '1px solid #f1f5f9',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                            <div style={{
                                width: '56px',
                                height: '56px',
                                backgroundColor: '#fef3c7',
                                color: '#d97706',
                                borderRadius: '18px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.5rem'
                            }}>
                                <FaUmbrellaBeach />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>{item.name}</h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748b', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                                    <FaCalendarDay size={12} />
                                    <span>{new Date(item.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                                </div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button onClick={() => handleOpenModal(item)} style={{ color: '#64748b', background: '#f8fafc', border: 'none', padding: '0.5rem', borderRadius: '10px', cursor: 'pointer' }}><FaEdit size={14} /></button>
                            <button onClick={() => handleDelete(item.id)} style={{ color: '#ef4444', background: '#fee2e2', border: 'none', padding: '0.5rem', borderRadius: '10px', cursor: 'pointer' }}><FaTrash size={14} /></button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {holidays.length === 0 && (
                <div style={{ textAlign: 'center', padding: '5rem 0', color: '#94a3b8' }}>
                    <FaCalendarDay size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                    <p>No holidays recorded for this year.</p>
                </div>
            )}

            {/* Modal */}
            <AnimatePresence>
                {showModal && (
                    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1200 }}>
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ backgroundColor: '#fff', borderRadius: '28px', padding: '2.5rem', width: '100%', maxWidth: '500px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>{editingHoliday ? 'Edit Holiday' : 'New Holiday'}</h3>
                                <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', color: '#94a3b8', cursor: 'pointer' }}>&times;</button>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 700, color: '#475569' }}>Holiday Name</label>
                                    <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required style={{ width: '100%', padding: '0.875rem 1rem', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none' }} placeholder="e.g. Independence Day" />
                                </div>

                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 700, color: '#475569' }}>Event Date</label>
                                    <input type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} required style={{ width: '100%', padding: '0.875rem 1rem', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none' }} />
                                </div>

                                <div style={{ marginBottom: '2.5rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 700, color: '#475569' }}>Assigned Company</label>
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
                                        backgroundColor: '#f59e0b',
                                        borderColor: '#f59e0b',
                                        boxShadow: '0 4px 12px rgba(245, 158, 11, 0.25)'
                                    }}
                                >
                                    {editingHoliday ? 'Update Holiday' : 'Create Holiday'}
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

export default Holidays;
