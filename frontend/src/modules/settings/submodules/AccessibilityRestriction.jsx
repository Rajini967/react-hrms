import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../../services/api';
import { FaUniversalAccess, FaShieldAlt, FaEyeSlash, FaFilter } from 'react-icons/fa';
import useToast from '../../../hooks/useToast';
import Toast from '../../../components/common/Toast';

const AccessibilityRestriction = () => {
    const [config, setConfig] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(null);
    const { toasts, showToast, removeToast } = useToast();

    const features = [
        { id: 'attendance', name: 'Attendance', description: 'Restrict viewing of attendance records.' },
        { id: 'employee', name: 'Employee', description: 'Control visibility of employee profiles.' },
        { id: 'payroll', name: 'Payroll', description: 'Lock down salary and payslip information.' },
        { id: 'leave', name: 'Leave', description: 'Restrict access to leave applications.' },
        { id: 'recruitment', name: 'Recruitment', description: 'Control access to candidate data.' }
    ];

    useEffect(() => {
        fetchAccessibility();
    }, []);

    const fetchAccessibility = async () => {
        try {
            const response = await api.get('/base/accessibility/');
            setConfig(response.data);
        } catch (error) {
            showToast('Failed to load accessibility settings', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (featureId, field, value) => {
        setSaving(featureId);
        try {
            await api.post('/base/accessibility/', {
                feature: featureId,
                [field]: value
            });
            showToast('Visibility rules updated', 'success');
            fetchAccessibility();
        } catch (error) {
            showToast('Update failed', 'error');
        } finally {
            setSaving(null);
        }
    };

    const getFeatureConfig = (id) => config.find(c => c.feature === id) || { is_active: false, is_restricted: false };

    const Card = ({ feature }) => {
        const item = getFeatureConfig(feature.id);
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                    backgroundColor: 'white',
                    borderRadius: '24px',
                    padding: '1.5rem',
                    border: '1px solid #f1f5f9',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)'
                }}
            >
                <div style={{ display: 'flex', gap: '1.25rem', marginBottom: '1.5rem' }}>
                    <div style={{ width: '48px', height: '48px', backgroundColor: '#f8fafc', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366f1' }}>
                        <FaFilter size={20} />
                    </div>
                    <div>
                        <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>{feature.name}</h3>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>{feature.description}</p>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <ToggleRow
                        label="Enable Filter"
                        subLabel="Apply visibility filters based on hierarchy."
                        active={item.is_active}
                        onToggle={() => handleUpdate(feature.id, 'is_active', !item.is_active)}
                    />
                    <div style={{ height: '1px', backgroundColor: '#f1f5f9' }} />
                    <ToggleRow
                        label="Strict Access"
                        subLabel="Block all unauthorized views for this module."
                        active={item.is_restricted}
                        onToggle={() => handleUpdate(feature.id, 'is_restricted', !item.is_restricted)}
                    />
                </div>
            </motion.div>
        );
    };

    const ToggleRow = ({ active, onToggle, label, subLabel }) => (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0' }}>
            <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1e293b' }}>{label}</div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{subLabel}</div>
            </div>
            <div
                onClick={onToggle}
                style={{
                    width: '44px',
                    height: '24px',
                    backgroundColor: active ? '#10b981' : '#e2e8f0',
                    borderRadius: '12px',
                    padding: '2px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    transition: 'all 0.3s',
                    justifyContent: active ? 'flex-end' : 'flex-start'
                }}
            >
                <motion.div layout style={{ width: '20px', height: '20px', backgroundColor: 'white', borderRadius: '50%' }} />
            </div>
        </div>
    );

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2.25rem', fontWeight: 900, color: '#0f172a' }}>Visibility Engine</h1>
                <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Define data masking and accessibility boundaries across the ecosystem.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                {features.map(f => <Card key={f.id} feature={f} />)}
            </div>

            <AnimatePresence>
                {toasts.map(toast => (
                    <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => removeToast(toast.id)} />
                ))}
            </AnimatePresence>
        </div>
    );
};

export default AccessibilityRestriction;
