import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEnvelope, FaServer, FaLock, FaCheckCircle, FaExclamationTriangle, FaPaperPlane } from 'react-icons/fa';
import useToast from '../../../hooks/useToast';
import Toast from '../../../components/common/Toast';

const MailServerSettings = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [config, setConfig] = useState({
        host: '',
        port: 587,
        from_email: '',
        username: '',
        display_name: '',
        password: '',
        use_tls: true,
        use_ssl: false,
        timeout: 10
    });
    const { toasts, showToast, removeToast } = useToast();

    useEffect(() => {
        fetchConfig();
    }, []);

    const fetchConfig = async () => {
        try {
            const response = await api.get('/base/email-configuration/');
            if (response.data) {
                const data = Array.isArray(response.data) ? response.data[0] : response.data;
                if (data) setConfig(data);
            }
        } catch (error) {
            console.error('Error fetching email config:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.post('/base/email-configuration/', config);
            showToast('SMTP configuration saved successfully', 'success');
        } catch (error) {
            console.error('Error saving email config:', error);
            showToast('Failed to save SMTP configuration', 'error');
        } finally {
            setSaving(false);
        }
    };

    const inputStyle = {
        width: '100%',
        padding: '0.875rem 1rem',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        fontSize: '0.95rem',
        backgroundColor: '#f8fafc',
        outline: 'none',
        transition: 'all 0.2s ease',
        marginTop: '0.5rem'
    };

    if (loading) return <div style={{ padding: '4rem', textAlign: 'center' }}>Connecting to mail server settings...</div>;

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ maxWidth: '1000px', margin: '0 2rem' }}
        >
            <div style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.025em' }}>Mail Server Settings</h2>
                <p style={{ color: '#64748b' }}>Configure the global SMTP server for system notifications, reports, and automated emails.</p>
            </div>

            <form onSubmit={handleSave} style={{
                backgroundColor: '#fff',
                padding: '2.5rem',
                borderRadius: '24px',
                border: '1px solid #f1f5f9',
                boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
            }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
                    <div style={{ gridColumn: 'span 2' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', paddingBottom: '0.75rem', borderBottom: '1px solid #f1f5f9' }}>
                            <FaServer style={{ color: 'var(--primary-color)' }} />
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: '#1e293b' }}>Server Connection</h3>
                        </div>
                    </div>

                    <div>
                        <label style={{ fontSize: '0.875rem', fontWeight: 700, color: '#475569' }}>SMTP Host</label>
                        <input
                            style={inputStyle}
                            type="text"
                            placeholder="e.g. smtp.gmail.com"
                            value={config.host}
                            onChange={(e) => setConfig({ ...config, host: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label style={{ fontSize: '0.875rem', fontWeight: 700, color: '#475569' }}>SMTP Port</label>
                        <input
                            style={inputStyle}
                            type="number"
                            placeholder="e.g. 587"
                            value={config.port}
                            onChange={(e) => setConfig({ ...config, port: parseInt(e.target.value) })}
                            required
                        />
                    </div>

                    <div style={{ gridColumn: 'span 2', marginTop: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', paddingBottom: '0.75rem', borderBottom: '1px solid #f1f5f9' }}>
                            <FaEnvelope style={{ color: 'var(--primary-color)' }} />
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: '#1e293b' }}>Sender Identity</h3>
                        </div>
                    </div>

                    <div>
                        <label style={{ fontSize: '0.875rem', fontWeight: 700, color: '#475569' }}>Default From Email</label>
                        <input
                            style={inputStyle}
                            type="email"
                            placeholder="noreply@synchr.com"
                            value={config.from_email}
                            onChange={(e) => setConfig({ ...config, from_email: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label style={{ fontSize: '0.875rem', fontWeight: 700, color: '#475569' }}>Display Name</label>
                        <input
                            style={inputStyle}
                            type="text"
                            placeholder="SyncHR Notifications"
                            value={config.display_name}
                            onChange={(e) => setConfig({ ...config, display_name: e.target.value })}
                        />
                    </div>

                    <div style={{ gridColumn: 'span 2', marginTop: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', paddingBottom: '0.75rem', borderBottom: '1px solid #f1f5f9' }}>
                            <FaLock style={{ color: 'var(--primary-color)' }} />
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: '#1e293b' }}>Authentication</h3>
                        </div>
                    </div>

                    <div>
                        <label style={{ fontSize: '0.875rem', fontWeight: 700, color: '#475569' }}>Username</label>
                        <input
                            style={inputStyle}
                            type="text"
                            autoComplete="username"
                            value={config.username}
                            onChange={(e) => setConfig({ ...config, username: e.target.value })}
                        />
                    </div>
                    <div>
                        <label style={{ fontSize: '0.875rem', fontWeight: 700, color: '#475569' }}>Password</label>
                        <input
                            style={inputStyle}
                            type="password"
                            autoComplete="current-password"
                            value={config.password}
                            onChange={(e) => setConfig({ ...config, password: e.target.value })}
                        />
                    </div>

                    <div style={{ gridColumn: 'span 2', display: 'flex', gap: '3rem', padding: '1.5rem', backgroundColor: '#f8fafc', borderRadius: '16px', marginTop: '1rem' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                checked={config.use_tls}
                                style={{ width: '18px', height: '18px' }}
                                onChange={(e) => setConfig({ ...config, use_tls: e.target.checked, use_ssl: false })}
                            />
                            <span style={{ fontSize: '0.95rem', fontWeight: 600, color: '#334155' }}>Enable TLS Security</span>
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                checked={config.use_ssl}
                                style={{ width: '18px', height: '18px' }}
                                onChange={(e) => setConfig({ ...config, use_ssl: e.target.checked, use_tls: false })}
                            />
                            <span style={{ fontSize: '0.95rem', fontWeight: 600, color: '#334155' }}>Enable SSL Security</span>
                        </label>
                    </div>
                </div>

                <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.85rem' }}>
                        <FaExclamationTriangle /> Changes take effect immediately after saving.
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button
                            type="button"
                            className="btn"
                            style={{
                                padding: '0.875rem 1.5rem',
                                borderRadius: '12px',
                                backgroundColor: '#f1f5f9',
                                color: '#475569',
                                border: 'none',
                                fontWeight: 700,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            <FaPaperPlane size={14} /> Send Test Email
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="btn btn-primary"
                            style={{
                                padding: '0.875rem 3rem',
                                borderRadius: '12px',
                                fontWeight: 700,
                                boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem'
                            }}
                        >
                            {saving ? 'Synchronizing...' : <><FaCheckCircle /> Save Configuration</>}
                        </button>
                    </div>
                </div>
            </form>

            <AnimatePresence>
                {toasts.map(toast => (
                    <Toast
                        key={toast.id}
                        message={toast.message}
                        type={toast.type}
                        onClose={() => removeToast(toast.id)}
                    />
                ))}
            </AnimatePresence>
        </motion.div>
    );
};

export default MailServerSettings;
