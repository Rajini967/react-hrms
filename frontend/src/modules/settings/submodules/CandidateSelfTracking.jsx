import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { FaToggleOn, FaToggleOff, FaSave } from 'react-icons/fa';

const CandidateSelfTracking = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState({
        candidate_self_tracking: false,
        show_overall_rating: false
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const response = await api.get('/recruitment/general-settings/');
            if (response.data) {
                setSettings(response.data);
            }
        } catch (error) {
            console.error("Error fetching settings:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await api.post('/recruitment/general-settings/', settings);
            alert('Settings saved successfully!');
        } catch (error) {
            console.error("Error saving settings:", error);
            alert('Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    const ToggleSwitch = ({ label, description, checked, onChange }) => (
        <div style={{
            backgroundColor: '#fff',
            borderRadius: '16px',
            padding: '1.75rem',
            border: '1px solid #eef2f6',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
            marginBottom: '1.5rem'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>{label}</h3>
                    <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.5rem', marginBottom: 0 }}>{description}</p>
                </div>
                <div
                    onClick={onChange}
                    style={{
                        cursor: 'pointer',
                        fontSize: '2.5rem',
                        color: checked ? 'var(--primary-color)' : '#cbd5e0',
                        transition: 'all 0.3s',
                        marginLeft: '2rem'
                    }}
                >
                    {checked ? <FaToggleOn /> : <FaToggleOff />}
                </div>
            </div>
        </div>
    );

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading settings...</div>;

    return (
        <div style={{ padding: '1rem', maxWidth: '900px' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b' }}>Candidate Self Tracking</h2>
                <p style={{ color: '#64748b', marginTop: '0.25rem' }}>Configure candidate portal access and visibility settings</p>
            </div>

            <ToggleSwitch
                label="Enable Candidate Self Tracking"
                description="Allow candidates to track their application status and progress through the recruitment pipeline"
                checked={settings.candidate_self_tracking}
                onChange={() => setSettings(prev => ({ ...prev, candidate_self_tracking: !prev.candidate_self_tracking }))}
            />

            <ToggleSwitch
                label="Show Overall Rating"
                description="Display overall candidate ratings to candidates in their self-tracking portal"
                checked={settings.show_overall_rating}
                onChange={() => setSettings(prev => ({ ...prev, show_overall_rating: !prev.show_overall_rating }))}
            />

            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                disabled={saving}
                style={{
                    padding: '0.875rem 2rem',
                    borderRadius: '12px',
                    backgroundColor: saving ? '#94a3b8' : 'var(--primary-color)',
                    color: 'white',
                    border: 'none',
                    fontWeight: 600,
                    fontSize: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    cursor: saving ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 12px rgba(79, 70, 229, 0.2)',
                    marginTop: '1.5rem'
                }}
            >
                <FaSave /> {saving ? 'Saving...' : 'Save Settings'}
            </motion.button>
        </div>
    );
};

export default CandidateSelfTracking;
