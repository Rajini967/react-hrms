import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../../services/api';
import { FaClock, FaSignOutAlt, FaCog, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import useToast from '../../../hooks/useToast';
import Toast from '../../../components/common/Toast';

const AttendanceGeneralSettings = () => {
    const [loading, setLoading] = useState(false);
    const [settings, setSettings] = useState({
        time_runner: true,
        enable_check_in: true,
    });
    const { toasts, showToast, removeToast } = useToast();

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const response = await api.get('/base/general-settings/');
            if (response.data) {
                // The general settings might returning a list or single object
                const data = Array.isArray(response.data) ? response.data[0] : response.data;
                if (data) {
                    setSettings({
                        time_runner: data.time_runner ?? true,
                        enable_check_in: data.enable_check_in ?? true
                    });
                }
            }
        } catch (error) {
            console.error('Error fetching attendance general settings:', error);
            // Don't show toast if it's just a 404/empty
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = async (key) => {
        const newValue = !settings[key];
        const updatedSettings = { ...settings, [key]: newValue };

        try {
            await api.post('/base/general-settings/', updatedSettings);
            setSettings(updatedSettings);
            showToast('Settings updated successfully', 'success');
        } catch (error) {
            console.error('Error updating settings:', error);
            showToast('Failed to update settings', 'error');
        }
    };

    const ToggleCard = ({ active, onToggle, label, description, icon: Icon }) => (
        <motion.div
            whileHover={{ y: -2 }}
            style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1.5rem',
                backgroundColor: '#fff',
                borderRadius: '16px',
                border: '1px solid #f1f5f9',
                boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                marginBottom: '1rem'
            }}
        >
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    backgroundColor: active ? 'rgba(79, 70, 229, 0.1)' : '#f8fafc',
                    color: active ? 'var(--primary-color)' : '#94a3b8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.25rem'
                }}>
                    <Icon />
                </div>
                <div>
                    <div style={{ fontWeight: 600, color: '#1e293b', marginBottom: '0.25rem' }}>{label}</div>
                    {description && <div style={{ fontSize: '0.85rem', color: '#64748b', maxWidth: '350px' }}>{description}</div>}
                </div>
            </div>
            <div
                onClick={onToggle}
                style={{
                    width: '48px',
                    height: '26px',
                    backgroundColor: active ? 'var(--primary-color)' : '#e2e8f0',
                    borderRadius: '13px',
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
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    style={{
                        width: '20px',
                        height: '20px',
                        backgroundColor: 'white',
                        borderRadius: '50%',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                    }}
                />
            </div>
        </motion.div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ padding: '2rem' }}
        >
            <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.025em' }}>
                    Attendance Settings
                </h2>
                <p style={{ color: '#64748b' }}>
                    Configure global behavior for attendance tracking and reporting.
                </p>
            </div>

            <div style={{ maxWidth: '700px' }}>
                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            style={{ width: '32px', height: '32px', border: '3px solid #e2e8f0', borderTopColor: 'var(--primary-color)', borderRadius: '50%' }}
                        />
                    </div>
                ) : (
                    <>
                        <ToggleCard
                            label="Background Time Runner"
                            description="Enables automated background processing of attendance records to ensure real-time accuracy in work entries."
                            active={settings.time_runner}
                            onToggle={() => handleToggle('time_runner')}
                            icon={FaClock}
                        />
                        <ToggleCard
                            label="Enable Check-In / Check-Out"
                            description="Allows employees to manually record their daily attendance using the desktop and mobile interface buttons."
                            active={settings.enable_check_in}
                            onToggle={() => handleToggle('enable_check_in')}
                            icon={FaSignOutAlt}
                        />

                        <div style={{
                            marginTop: '2rem',
                            padding: '1.25rem',
                            backgroundColor: 'rgba(79, 70, 229, 0.05)',
                            borderRadius: '12px',
                            border: '1px dashed rgba(79, 70, 229, 0.3)',
                            display: 'flex',
                            gap: '1rem'
                        }}>
                            <div style={{ color: 'var(--primary-color)', marginTop: '2px' }}><FaCog /></div>
                            <div>
                                <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary-color)' }}>Global Configuration</h4>
                                <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b', lineHeight: '1.5' }}>
                                    Changes made here affect all employees across all departments. Ensure the background runner is enabled for accurate overtime and late-in reporting.
                                </p>
                            </div>
                        </div>
                    </>
                )}
            </div>

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

export default AttendanceGeneralSettings;

