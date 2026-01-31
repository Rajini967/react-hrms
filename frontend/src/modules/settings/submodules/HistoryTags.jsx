import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../../services/api';
import { FaTag, FaPlus, FaTrash, FaPalette } from 'react-icons/fa';
import useToast from '../../../hooks/useToast';
import Toast from '../../../components/common/Toast';

const HistoryTags = () => {
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTag, setNewTag] = useState({ name: '', color: '#6366f1' });
    const { toasts, showToast, removeToast } = useToast();

    const colors = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#8b5cf6', '#06b6d4', '#475569'];

    useEffect(() => {
        fetchTags();
    }, []);

    const fetchTags = async () => {
        try {
            const response = await api.get('/base/audit-tags/');
            setTags(response.data);
        } catch (error) {
            showToast('Failed to load tags', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await api.post('/base/audit-tags/', newTag);
            showToast('Tag created', 'success');
            setIsModalOpen(false);
            setNewTag({ name: '', color: '#6366f1' });
            fetchTags();
        } catch (error) {
            showToast('Failed to create tag', 'error');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this history tag?')) return;
        try {
            await api.delete(`/base/audit-tags/${id}/`);
            showToast('Tag removed', 'success');
            fetchTags();
        } catch (error) {
            showToast('Delete failed', 'error');
        }
    };

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <div>
                    <h1 style={{ fontSize: '2.25rem', fontWeight: 900, color: '#0f172a' }}>History Tags</h1>
                    <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Label and categorize audit logs for better investigation.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    style={{ backgroundColor: '#0f172a', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    <FaPlus /> New Tag
                </button>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '5rem', opacity: 0.5 }}>Syncing audit terminology...</div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
                    {tags.map(tag => (
                        <motion.div
                            key={tag.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            style={{
                                backgroundColor: 'white',
                                borderRadius: '20px',
                                padding: '1.25rem',
                                border: `1px solid ${tag.color}20`,
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                boxShadow: `0 4px 12px ${tag.color}08`
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: tag.color }} />
                                <span style={{ fontWeight: 700, color: '#1e293b' }}>{tag.name}</span>
                            </div>
                            <button
                                onClick={() => handleDelete(tag.id)}
                                style={{ backgroundColor: 'transparent', border: 'none', color: '#cbd5e1', cursor: 'pointer', transition: 'color 0.2s' }}
                                onMouseEnter={(e) => e.target.style.color = '#ef4444'}
                                onMouseLeave={(e) => e.target.style.color = '#cbd5e1'}
                            >
                                <FaTrash size={14} />
                            </button>
                        </motion.div>
                    ))}
                </div>
            )}

            {isModalOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} style={{ backgroundColor: 'white', padding: '2.5rem', borderRadius: '32px', width: '450px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
                        <h2 style={{ marginBottom: '1.5rem', fontWeight: 900 }}>Create Audit Tag</h2>
                        <form onSubmit={handleCreate}>
                            <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Tag Label</label>
                            <input
                                required
                                value={newTag.name}
                                onChange={(e) => setNewTag({ ...newTag, name: e.target.value })}
                                style={{ width: '100%', padding: '1rem', borderRadius: '16px', border: '1px solid #e2e8f0', margin: '0.5rem 0 1.5rem 0', outline: 'none' }}
                                placeholder="e.g. Critical Update"
                            />

                            <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Signature Color</label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', margin: '0.5rem 0 2rem 0' }}>
                                {colors.map(c => (
                                    <div
                                        key={c}
                                        onClick={() => setNewTag({ ...newTag, color: c })}
                                        style={{
                                            width: '32px',
                                            height: '32px',
                                            borderRadius: '50%',
                                            backgroundColor: c,
                                            cursor: 'pointer',
                                            border: newTag.color === c ? '3px solid white' : 'none',
                                            boxShadow: newTag.color === c ? `0 0 0 2px ${c}` : 'none',
                                            transition: 'all 0.2s'
                                        }}
                                    />
                                ))}
                            </div>

                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button type="button" onClick={() => setIsModalOpen(false)} style={{ flex: 1, padding: '1rem', borderRadius: '16px', border: '1px solid #e2e8f0', backgroundColor: 'white', fontWeight: 800 }}>Cancel</button>
                                <button type="submit" style={{ flex: 1, padding: '1rem', borderRadius: '16px', border: 'none', backgroundColor: '#0f172a', color: 'white', fontWeight: 800 }}>Generate Tag</button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}

            <AnimatePresence>
                {toasts.map(toast => (
                    <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => removeToast(toast.id)} />
                ))}
            </AnimatePresence>
        </div>
    );
};

export default HistoryTags;
