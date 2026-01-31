import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStar, FaPlus, FaTrash, FaEdit, FaSave, FaTrophy } from 'react-icons/fa';
import useToast from '../../../hooks/useToast';
import Toast from '../../../components/common/Toast';

const BonusPointSetting = () => {
    const [settings, setSettings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingSetting, setEditingSetting] = useState(null);
    const { toasts, showToast, removeToast } = useToast();

    const [formData, setFormData] = useState({
        title: '',
        points: 0,
        description: ''
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const response = await api.get('/pms/bonus-point-settings/');
            setSettings(response.data.results || response.data || []);
        } catch (error) {
            console.error("Error fetching bonus settings:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (setting = null) => {
        if (setting) {
            setEditingSetting(setting);
            setFormData({
                title: setting.title || '',
                points: setting.points || 0,
                description: setting.description || ''
            });
        } else {
            setEditingSetting(null);
            setFormData({ title: '', points: 0, description: '' });
        }
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingSetting) {
                await api.put(`/pms/bonus-point-settings/${editingSetting.id}/`, formData);
                showToast('Reward criteria updated', 'success');
            } else {
                await api.post('/pms/bonus-point-settings/', formData);
                showToast('New reward criteria created', 'success');
            }
            fetchSettings();
            setShowModal(false);
        } catch (error) {
            showToast('Failed to save settings', 'error');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Remove this bonus point criteria?")) {
            try {
                await api.delete(`/pms/bonus-point-settings/${id}/`);
                setSettings(prev => prev.filter(s => s.id !== id));
                showToast('Criteria removed', 'success');
            } catch (error) {
                showToast('Failed to delete', 'error');
            }
        }
    };

    if (loading) return <div style={{ padding: '4rem', textAlign: 'center' }}>Calculating reward metrics...</div>;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ padding: '2rem' }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Performance Rewards</h2>
                    <p style={{ color: '#64748b', marginTop: '0.25rem' }}>Configure bonus point criteria for employee recognition and performance tracking.</p>
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
                    <FaPlus /> Define Criteria
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                {settings.map(setting => (
                    <motion.div
                        key={setting.id}
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
                        <div style={{
                            position: 'absolute',
                            top: '-10px',
                            right: '-10px',
                            width: '80px',
                            height: '80px',
                            backgroundColor: 'rgba(245, 158, 11, 0.05)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transform: 'rotate(15deg)'
                        }}>
                            <FaTrophy style={{ color: 'rgba(245, 158, 11, 0.1)', fontSize: '2.5rem' }} />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                            <div style={{
                                padding: '0.5rem 1rem',
                                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                                color: '#d97706',
                                borderRadius: '12px',
                                fontWeight: 800,
                                fontSize: '1.1rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}>
                                <FaStar /> {setting.points}
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem', zIndex: 1 }}>
                                <button onClick={() => handleOpenModal(setting)} style={{ color: '#64748b', background: '#f8fafc', border: 'none', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer' }}><FaEdit size={14} /></button>
                                <button onClick={() => handleDelete(setting.id)} style={{ color: '#ef4444', background: '#fee2e2', border: 'none', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer' }}><FaTrash size={14} /></button>
                            </div>
                        </div>

                        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.5rem' }}>{setting.title}</h3>
                        <p style={{ fontSize: '0.9rem', color: '#64748b', margin: 0, lineHeight: 1.5 }}>{setting.description}</p>
                    </motion.div>
                ))}
            </div>

            {settings.length === 0 && (
                <div style={{ textAlign: 'center', padding: '5rem 0', color: '#94a3b8' }}>
                    <FaTrophy size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                    <p>No performance reward criteria defined yet.</p>
                </div>
            )}

            {/* Modal */}
            <AnimatePresence>
                {showModal && (
                    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1200 }}>
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ backgroundColor: '#fff', borderRadius: '28px', padding: '2.5rem', width: '100%', maxWidth: '500px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>{editingSetting ? 'Edit Criteria' : 'New Criteria'}</h3>
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
                                        placeholder="e.g. Perfect Attendance"
                                    />
                                </div>

                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 700, color: '#475569' }}>Points Reward</label>
                                    <input
                                        type="number"
                                        value={formData.points}
                                        onChange={e => setFormData({ ...formData, points: parseInt(e.target.value) })}
                                        required
                                        style={{ width: '100%', padding: '0.875rem 1rem', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none' }}
                                        placeholder="Points to award"
                                    />
                                </div>

                                <div style={{ marginBottom: '2.5rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 700, color: '#475569' }}>Description</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none', minHeight: '100px', resize: 'vertical' }}
                                        placeholder="Explain how to earn these points..."
                                    />
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
                                    {editingSetting ? 'Update Criteria' : 'Save Criteria'}
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

export default BonusPointSetting;
