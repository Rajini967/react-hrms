import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { FaClock, FaCheckCircle, FaTimesCircle, FaToggleOn, FaToggleOff, FaCog, FaSave } from 'react-icons/fa';
import useToast from '../../../hooks/useToast';
import Toast from '../../../components/common/Toast';

const CompensatoryLeave = () => {
    const [config, setConfig] = useState({ enabled: false });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const { toasts, showToast, removeToast } = useToast();

    useEffect(() => {
        fetchConfig();
    }, []);

    const fetchConfig = async () => {
        setLoading(true);
        try {
            // Assume this endpoint returns whether it's enabled or not
            const response = await api.get('/leave/compensatory-leave-settings/');
            setConfig(response.data || { enabled: false });
        } catch (error) {
            console.error("Error fetching comp leave settings:", error);
            setConfig({ enabled: false });
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = async () => {
        const newValue = !config.enabled;
        setSaving(true);
        try {
            await api.post('/leave/enable-compensatory-leave', { enabled: newValue });
            setConfig({ ...config, enabled: newValue });
            showToast(`Compensatory leave ${newValue ? 'enabled' : 'disabled'}`, 'success');
        } catch (error) {
            showToast('Failed to update status', 'error');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div style={{ padding: '4rem', textAlign: 'center' }}>Syncing leaf configurations...</div>;

    return (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} style={{ maxWidth: '800px', margin: '0 2rem' }}>
            <div style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>Compensatory Leave</h2>
                <p style={{ color: '#64748b' }}>Manage policies for time off in lieu of overtime or working on holidays.</p>
            </div>

            <div style={{ backgroundColor: '#fff', borderRadius: '24px', border: '1px solid #f1f5f9', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', padding: '2.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '2rem', backgroundColor: config.enabled ? 'rgba(16, 185, 129, 0.05)' : '#f8fafc', borderRadius: '20px', border: '1px solid', borderColor: config.enabled ? 'rgba(16, 185, 129, 0.1)' : '#f1f5f9' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <div style={{
                            width: '64px',
                            height: '64px',
                            backgroundColor: config.enabled ? '#10b981' : '#e2e8f0',
                            color: '#fff',
                            borderRadius: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.75rem',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}>
                            <FaClock />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>Compensatory Leave System</h3>
                            <p style={{ color: '#64748b', margin: '0.25rem 0 0', fontSize: '0.9rem' }}>
                                Currently {config.enabled ? 'active and accepting requests' : 'globally disabled'}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={handleToggle}
                        disabled={saving}
                        style={{
                            padding: '0.75rem 1.5rem',
                            borderRadius: '14px',
                            border: 'none',
                            backgroundColor: config.enabled ? '#ef4444' : '#10b981',
                            color: '#fff',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            transition: 'all 0.2s'
                        }}
                    >
                        {saving ? 'Processing...' : (config.enabled ? <><FaTimesCircle /> Disable</> : <><FaCheckCircle /> Enable</>)}
                    </button>
                </div>

                <div style={{ marginTop: '2.5rem' }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#475569', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <FaCog /> Advanced Policy Settings
                    </h4>

                    <div style={{ opacity: 0.5, pointerEvents: 'none', filter: 'grayscale(1)' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div style={{ padding: '1.5rem', border: '1px solid #f1f5f9', borderRadius: '16px' }}>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#64748b' }}>Min Overtime (Hours)</label>
                                <input type="number" defaultValue={4} style={{ width: '100%', border: 'none', fontSize: '1.5rem', fontWeight: 800, color: '#1e293b', outline: 'none' }} />
                            </div>
                            <div style={{ padding: '1.5rem', border: '1px solid #f1f5f9', borderRadius: '16px' }}>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#64748b' }}>Expiry (Days)</label>
                                <input type="number" defaultValue={90} style={{ width: '100%', border: 'none', fontSize: '1.5rem', fontWeight: 800, color: '#1e293b', outline: 'none' }} />
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ marginTop: '2.5rem', padding: '1.5rem', backgroundColor: '#fff9eb', borderRadius: '16px', border: '1px solid #fee6b3', display: 'flex', gap: '1rem' }}>
                    <div style={{ color: '#d97706', fontSize: '1.25rem' }}><FaCog /></div>
                    <p style={{ margin: 0, fontSize: '0.875rem', color: '#92400e', lineHeight: 1.5 }}>
                        <strong>Developer Note:</strong> This module is partially implemented based on available backend signals. Full policy configuration requires additional API endpoints.
                    </p>
                </div>
            </div>

            <AnimatePresence>
                {toasts.map(toast => (
                    <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => removeToast(toast.id)} />
                ))}
            </AnimatePresence>
        </motion.div>
    );
};

export default CompensatoryLeave;
