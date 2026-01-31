import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../../services/api';
import { FaShieldAlt, FaListOl, FaBullhorn, FaUserEdit, FaPowerOff, FaWalking } from 'react-icons/fa';
import useToast from '../../../hooks/useToast';
import Toast from '../../../components/common/Toast';

const GeneralSettings = () => {
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(null);
    const { toasts, showToast, removeToast } = useToast();
    const [settings, setSettings] = useState({
        announcement_expire_days: 30,
        pagination: 50,
        restrict_login: false,
        restrict_profile_edit: false,
        resignation_request: true,
        at_work_tracker: true
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const response = await api.get('/base/general-settings/');
            if (response.data) {
                setSettings(response.data);
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (section, data) => {
        setSaving(section);
        try {
            await api.post('/base/general-settings/', data);
            setSettings(prev => ({ ...prev, ...data }));
            showToast('Configuration updated', 'success');
        } catch (error) {
            showToast('Update failed', 'error');
        } finally {
            setSaving(null);
        }
    };

    const Header = () => (
        <div style={{ marginBottom: '3rem' }}>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <h1 style={{ fontSize: '2.25rem', fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-0.025em' }}>General Core</h1>
                <p style={{ color: '#64748b', marginTop: '0.5rem', fontSize: '1.1rem' }}>Global configurations governing organization-wide behavior and security.</p>
            </motion.div>
        </div>
    );

    const Card = ({ title, description, children, onSave, sectionKey, icon: Icon }) => (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
                backgroundColor: '#ffffff',
                borderRadius: '28px',
                padding: '2rem',
                marginBottom: '1.5rem',
                border: '1px solid #f1f5f9',
                boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', gap: '1.25rem' }}>
                    <div style={{ width: '48px', height: '48px', backgroundColor: '#f8fafc', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366f1' }}>
                        <Icon size={20} />
                    </div>
                    <div>
                        <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#1e293b' }}>{title}</h3>
                        <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', color: '#64748b' }}>{description}</p>
                    </div>
                </div>
                {onSave && (
                    <button
                        className="btn btn-primary"
                        onClick={onSave}
                        disabled={saving === sectionKey}
                        style={{ borderRadius: '12px', padding: '0.6rem 1.25rem', fontWeight: 700, backgroundColor: '#0f172a', borderColor: '#0f172a' }}
                    >
                        {saving === sectionKey ? '...' : 'Save'}
                    </button>
                )}
            </div>
            {children}
        </motion.div>
    );

    const ToggleRow = ({ active, onToggle, label, subLabel }) => (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0' }}>
            <div>
                <div style={{ fontWeight: 700, color: '#334155', fontSize: '0.95rem' }}>{label}</div>
                {subLabel && <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.1rem' }}>{subLabel}</div>}
            </div>
            <div
                onClick={onToggle}
                style={{
                    width: '52px',
                    height: '28px',
                    backgroundColor: active ? '#10b981' : '#e2e8f0',
                    borderRadius: '14px',
                    padding: '3px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    justifyContent: active ? 'flex-end' : 'flex-start'
                }}
            >
                <motion.div
                    layout
                    style={{
                        width: '22px',
                        height: '22px',
                        backgroundColor: 'white',
                        borderRadius: '50%',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                />
            </div>
        </div>
    );

    if (loading) return <div style={{ padding: '5rem', textAlign: 'center' }}>Synchronizing global parameters...</div>;

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '4rem' }}>
            <Header />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <Card
                    title="Communication Policy"
                    description="Announcement lifespan and automated archival rules."
                    sectionKey="announcement"
                    icon={FaBullhorn}
                    onSave={() => handleSave('announcement', { announcement_expire_days: settings.announcement_expire_days })}
                >
                    <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Default Expire Days</label>
                    <input
                        type="number"
                        className="form-control"
                        value={settings.announcement_expire_days}
                        onChange={(e) => setSettings(prev => ({ ...prev, announcement_expire_days: e.target.value }))}
                        style={{ borderRadius: '14px', border: '1px solid #e2e8f0', padding: '0.75rem', marginTop: '0.5rem' }}
                    />
                </Card>

                <Card
                    title="Data Presentation"
                    description="Standard pagination limits for all module tables."
                    sectionKey="pagination"
                    icon={FaListOl}
                    onSave={() => handleSave('pagination', { pagination: settings.pagination })}
                >
                    <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Density Limit</label>
                    <input
                        type="number"
                        className="form-control"
                        value={settings.pagination}
                        onChange={(e) => setSettings(prev => ({ ...prev, pagination: e.target.value }))}
                        style={{ borderRadius: '14px', border: '1px solid #e2e8f0', padding: '0.75rem', marginTop: '0.5rem' }}
                    />
                </Card>

                <div style={{ gridColumn: 'span 2' }}>
                    <Card title="Security & Governance" icon={FaShieldAlt} description="Global access controls and profile integrity settings.">
                        <ToggleRow
                            label="Hard Lockdown (Login Restrict)"
                            subLabel="Block interactive portal access for all non-privileged accounts."
                            active={settings.restrict_login}
                            onToggle={() => handleSave('restrict_login', { restrict_login: !settings.restrict_login })}
                        />
                        <div style={{ height: '1px', backgroundColor: '#f1f5f9', margin: '0.5rem 0' }} />
                        <ToggleRow
                            label="Immutable Profiles"
                            subLabel="Prevent self-service modification of identity and employment data."
                            active={settings.restrict_profile_edit}
                            onToggle={() => handleSave('restrict_profile_edit', { restrict_profile_edit: !settings.restrict_profile_edit })}
                        />
                        <div style={{ height: '1px', backgroundColor: '#f1f5f9', margin: '0.5rem 0' }} />
                        <ToggleRow
                            label="Resignation Workflow"
                            subLabel="Allow employees to initiate formal departure requests via dashboard."
                            active={settings.resignation_request}
                            onToggle={() => handleSave('resignation_request', { resignation_request: !settings.resignation_request })}
                        />
                    </Card>

                    <Card title="Pulse Monitoring" icon={FaWalking} description="Real-time status indicators and active session tracking.">
                        <ToggleRow
                            label="Presence Engine (At-Work Tracker)"
                            subLabel="Monitor active work status indicators across the organization."
                            active={settings.at_work_tracker}
                            onToggle={() => handleSave('at_work_tracker', { at_work_tracker: !settings.at_work_tracker })}
                        />
                    </Card>
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

export default GeneralSettings;
