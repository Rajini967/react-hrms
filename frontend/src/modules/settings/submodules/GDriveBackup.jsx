import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../../services/api';
import { FaGoogleDrive, FaCloudUploadAlt, FaHistory, FaKey, FaShieldAlt, FaTerminal } from 'react-icons/fa';
import useToast from '../../../hooks/useToast';
import Toast from '../../../components/common/Toast';

const GDriveBackup = () => {
    const [config, setConfig] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const { toasts, showToast, removeToast } = useToast();

    useEffect(() => {
        fetchConfig();
    }, []);

    const fetchConfig = async () => {
        try {
            const response = await api.get('/base/gdrive-backup/');
            setConfig(response.data);
        } catch (error) {
            console.error('No configuration found');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const response = await api.post('/base/gdrive-backup/', config);
            setConfig(response.data);
            showToast('Backup configuration synchronized', 'success');
        } catch (error) {
            showToast('Synchronization failed', 'error');
        } finally {
            setSaving(false);
        }
    };

    const styles = {
        container: { maxWidth: '900px', margin: '0 auto', paddingBottom: '5rem' },
        card: {
            backgroundColor: 'white',
            borderRadius: '28px',
            padding: '2.5rem',
            border: '1px solid #f1f5f9',
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.04)',
            marginBottom: '2rem'
        },
        input: {
            width: '100%',
            padding: '1rem',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            backgroundColor: '#f8fafc',
            marginTop: '0.5rem',
            outline: 'none',
            fontSize: '1rem',
            fontFamily: 'monospace'
        }
    };

    if (loading) return <div style={{ padding: '5rem', textAlign: 'center' }}>Initializing secure channel...</div>;

    return (
        <div style={styles.container}>
            <div style={{ marginBottom: '3rem' }}>
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 style={{ fontSize: '2.25rem', fontWeight: 900, color: '#0f172a' }}>Cloud Resilience</h1>
                    <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Automated encrypted backups to Google Drive infrastructure.</p>
                </motion.div>
            </div>

            <div style={styles.card}>
                <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2.5rem' }}>
                    <div style={{ width: '64px', height: '64px', backgroundColor: '#f0fdf4', color: '#22c55e', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FaGoogleDrive size={32} />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Drive API Configuration</h2>
                        <p style={{ color: '#64748b' }}>Provide credentials from Google Cloud Console to enable storage.</p>
                    </div>
                </div>

                <form onSubmit={handleSave}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                        <div>
                            <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Client ID</label>
                            <input
                                style={styles.input}
                                value={config?.client_id || ''}
                                onChange={(e) => setConfig({ ...config, client_id: e.target.value })}
                                placeholder="Enter Google Client ID"
                            />
                        </div>
                        <div>
                            <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Client Secret</label>
                            <input
                                style={styles.input}
                                type="password"
                                value={config?.client_secret || ''}
                                onChange={(e) => setConfig({ ...config, client_secret: e.target.value })}
                                placeholder="••••••••••••••••"
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>Redirect URI</label>
                        <input
                            style={styles.input}
                            value={config?.redirect_uri || ''}
                            onChange={(e) => setConfig({ ...config, redirect_uri: e.target.value })}
                            placeholder="https://your-domain.com/oauth/callback"
                        />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem', backgroundColor: '#fdf2f2', borderRadius: '20px', border: '1px solid #fee2e2' }}>
                        <FaShieldAlt style={{ color: '#ef4444' }} />
                        <div style={{ fontSize: '0.875rem', color: '#991b1b' }}>
                            Ensure the Redirect URI exactly matches the one configured in your Google Cloud Project.
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2.5rem' }}>
                        <button
                            type="submit"
                            disabled={saving}
                            style={{
                                backgroundColor: '#1e293b',
                                color: 'white',
                                padding: '1rem 2.5rem',
                                borderRadius: '16px',
                                border: 'none',
                                fontWeight: 800,
                                fontSize: '1rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem'
                            }}
                        >
                            {saving ? 'Synchronizing...' : <><FaCloudUploadAlt /> Initialize Link</>}
                        </button>
                    </div>
                </form>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div style={{ ...styles.card, padding: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <FaHistory color="#6366f1" />
                        <span style={{ fontWeight: 800 }}>Backup Frequency</span>
                    </div>
                    <select style={{ ...styles.input, marginTop: 0 }}>
                        <option>Every 6 Hours</option>
                        <option>Daily at Midnight</option>
                        <option>Weekly (Sunday)</option>
                    </select>
                </div>

                <div style={{ ...styles.card, padding: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <FaTerminal color="#64748b" />
                        <span style={{ fontWeight: 800 }}>Last Status</span>
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#10b981', fontWeight: 600 }}>
                        Stable - Last backup 14 mins ago
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {toasts.map(toast => (
                    <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => removeToast(toast.id)} />
                ))}
            </AnimatePresence>
        </div>
    );
};

export default GDriveBackup;
