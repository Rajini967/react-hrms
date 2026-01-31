import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';
import { motion } from 'framer-motion';

const DateTimeSettings = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [selectedDate, setSelectedDate] = useState('MMM. D, YYYY');
    const [selectedTime, setSelectedTime] = useState('HH:mm');

    const dateFormats = [
        'MMM. D, YYYY', 'YYYY-MM-DD', 'DD/MM/YYYY', 'MM/DD/YYYY', 'D MMM YYYY'
    ];
    const timeFormats = [
        'HH:mm', 'hh:mm A', 'H:mm', 'h:mm A'
    ];

    useEffect(() => {
        fetchCompanySettings();
    }, []);

    const fetchCompanySettings = async () => {
        if (!user?.companyId) {
            setLoading(false);
            return;
        }
        try {
            const response = await api.get(`/base/companies/${user.companyId}/`);
            if (response.data) {
                if (response.data.date_format) setSelectedDate(response.data.date_format);
                if (response.data.time_format) setSelectedTime(response.data.time_format);
            }
        } catch (error) {
            console.error('Error fetching company settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!user?.companyId) return;
        setSaving(true);
        try {
            await api.put(`/base/companies/${user.companyId}/`, {
                date_format: selectedDate,
                time_format: selectedTime
            });
            alert('Date and Time settings saved successfully!');
        } catch (error) {
            console.error('Error saving settings:', error);
            alert('Failed to save settings.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;

    const cardStyle = {
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '2rem',
        marginBottom: '1.5rem',
        border: '1px solid var(--border-color)',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            style={{ maxWidth: '800px', margin: '0 auto' }}
        >
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#1a202c', margin: 0 }}>Date & Time Format</h1>
                <p style={{ color: '#718096', marginTop: '0.5rem' }}>Configure how dates and times are displayed across the application.</p>
            </div>

            <div style={cardStyle}>
                <div style={{ marginBottom: '2rem' }}>
                    <label style={{ fontSize: '1rem', fontWeight: 600, color: '#2d3748', display: 'block', marginBottom: '1rem' }}>
                        Preferred Date Format
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                        {dateFormats.map(fmt => (
                            <div
                                key={fmt}
                                onClick={() => setSelectedDate(fmt)}
                                style={{
                                    padding: '1rem',
                                    borderRadius: '8px',
                                    border: selectedDate === fmt ? '2px solid var(--primary-color)' : '1px solid #e2e8f0',
                                    backgroundColor: selectedDate === fmt ? '#f0f7ff' : '#fff',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '0.25rem'
                                }}
                            >
                                <span style={{ fontSize: '0.9rem', fontWeight: 500, color: selectedDate === fmt ? 'var(--primary-color)' : '#4a5568' }}>{fmt}</span>
                                <span style={{ fontSize: '0.8rem', color: '#718096' }}>Example: {new Date().toLocaleDateString()}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ height: '1px', backgroundColor: '#edf2f7', margin: '2rem 0' }} />

                <div style={{ marginBottom: '2rem' }}>
                    <label style={{ fontSize: '1rem', fontWeight: 600, color: '#2d3748', display: 'block', marginBottom: '1rem' }}>
                        Preferred Time Format
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                        {timeFormats.map(fmt => (
                            <div
                                key={fmt}
                                onClick={() => setSelectedTime(fmt)}
                                style={{
                                    padding: '1rem',
                                    borderRadius: '8px',
                                    border: selectedTime === fmt ? '2px solid var(--primary-color)' : '1px solid #e2e8f0',
                                    backgroundColor: selectedTime === fmt ? '#f0f7ff' : '#fff',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '0.25rem'
                                }}
                            >
                                <span style={{ fontSize: '0.9rem', fontWeight: 500, color: selectedTime === fmt ? 'var(--primary-color)' : '#4a5568' }}>{fmt}</span>
                                <span style={{ fontSize: '0.8rem', color: '#718096' }}>Example: {new Date().toLocaleTimeString()}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                    <button
                        className="btn btn-primary"
                        onClick={handleSave}
                        disabled={saving}
                        style={{ padding: '0.75rem 2rem', fontSize: '1rem' }}
                    >
                        {saving ? 'Saving...' : 'Save All Changes'}
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default DateTimeSettings;
