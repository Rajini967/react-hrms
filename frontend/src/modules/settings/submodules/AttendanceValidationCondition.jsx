import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../../services/api';
import { FaSave, FaClock, FaCalendarCheck, FaBuilding, FaChevronRight } from 'react-icons/fa';
import useToast from '../../../hooks/useToast';
import Toast from '../../../components/common/Toast';

const AttendanceValidationCondition = () => {
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [companies, setCompanies] = useState([]);
    const [config, setConfig] = useState({
        validation_at_work: '08:00:00',
        minimum_overtime_to_approve: '00:30:00',
        overtime_cutoff: '04:00:00',
        auto_approve_ot: false,
        company_id: []
    });
    const { toasts, showToast, removeToast } = useToast();

    useEffect(() => {
        fetchConfig();
        fetchCompanies();
    }, []);

    const fetchConfig = async () => {
        setLoading(true);
        try {
            const response = await api.get('/attendance/validation-condition/');
            if (response.data) {
                const data = Array.isArray(response.data) ? response.data[0] : response.data;
                if (data) {
                    setConfig({
                        ...data,
                        company_id: data.company_id || []
                    });
                }
            }
        } catch (error) {
            console.error('Error fetching validation conditions:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCompanies = async () => {
        try {
            const response = await api.get('/base/companies/');
            setCompanies(response.data || []);
        } catch (error) {
            console.error('Error fetching companies:', error);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            // Backend might expect company_id as list of IDs
            await api.post('/attendance/validation-condition/', config);
            showToast('Validation conditions saved successfully', 'success');
        } catch (error) {
            console.error('Error saving conditions:', error);
            showToast('Failed to save conditions', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setConfig(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const toggleCompany = (companyId) => {
        setConfig(prev => {
            const current = prev.company_id || [];
            if (current.includes(companyId)) {
                return { ...prev, company_id: current.filter(id => id !== companyId) };
            } else {
                return { ...prev, company_id: [...current, companyId] };
            }
        });
    };

    const FormSection = ({ title, children, icon: Icon }) => (
        <div style={{ marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div style={{ color: 'var(--primary-color)', fontSize: '1.1rem' }}><Icon /></div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1e293b', margin: 0 }}>{title}</h3>
            </div>
            <div style={{ paddingLeft: '1.85rem' }}>
                {children}
            </div>
        </div>
    );

    if (loading) return <div style={{ padding: '3rem', textAlign: 'center' }}>Loading configurations...</div>;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ padding: '2rem' }}
        >
            <div style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.025em' }}>
                    Validation Rules
                </h2>
                <p style={{ color: '#64748b' }}>
                    Define the parameters for automated attendance validation and overtime processing.
                </p>
            </div>

            <div style={{
                background: 'white',
                padding: '2.5rem',
                borderRadius: '20px',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)',
                maxWidth: '800px',
                border: '1px solid #f1f5f9'
            }}>
                <form onSubmit={handleSave}>
                    <FormSection title="Attendance Validation" icon={FaCalendarCheck}>
                        <div style={{ maxWidth: '400px' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: '#475569' }}>
                                Worked Hours Threshold (HH:MM:SS)
                            </label>
                            <input
                                type="text"
                                name="validation_at_work"
                                value={config.validation_at_work}
                                onChange={handleChange}
                                placeholder="08:00:00"
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 1rem',
                                    borderRadius: '10px',
                                    border: '1px solid #e2e8f0',
                                    outline: 'none',
                                    fontSize: '0.95rem'
                                }}
                            />
                            <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.5rem' }}>
                                Attendance will be auto-approved if the total worked hours exceed this duration.
                            </p>
                        </div>
                    </FormSection>

                    <FormSection title="Overtime Policy" icon={FaClock}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: '#475569' }}>
                                    Minimum Overtime
                                </label>
                                <input
                                    type="text"
                                    name="minimum_overtime_to_approve"
                                    value={config.minimum_overtime_to_approve}
                                    onChange={handleChange}
                                    placeholder="00:30:00"
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem 1rem',
                                        borderRadius: '10px',
                                        border: '1px solid #e2e8f0',
                                        outline: 'none',
                                        fontSize: '0.95rem'
                                    }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: '#475569' }}>
                                    Overtime Cutoff
                                </label>
                                <input
                                    type="text"
                                    name="overtime_cutoff"
                                    value={config.overtime_cutoff}
                                    onChange={handleChange}
                                    placeholder="04:00:00"
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem 1rem',
                                        borderRadius: '10px',
                                        border: '1px solid #e2e8f0',
                                        outline: 'none',
                                        fontSize: '0.95rem'
                                    }}
                                />
                            </div>
                        </div>

                        <label style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            cursor: 'pointer',
                            padding: '1rem',
                            borderRadius: '12px',
                            background: config.auto_approve_ot ? 'rgba(79, 70, 229, 0.05)' : '#f8fafc',
                            border: `1px solid ${config.auto_approve_ot ? 'rgba(79, 70, 229, 0.2)' : '#e2e8f0'}`,
                            transition: 'all 0.2s ease'
                        }}>
                            <div style={{
                                width: '40px',
                                height: '22px',
                                backgroundColor: config.auto_approve_ot ? 'var(--primary-color)' : '#cbd5e0',
                                borderRadius: '11px',
                                padding: '2px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: config.auto_approve_ot ? 'flex-end' : 'flex-start',
                                transition: 'all 0.3s'
                            }}>
                                <div style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: 'white' }} />
                                <input
                                    type="checkbox"
                                    name="auto_approve_ot"
                                    checked={config.auto_approve_ot}
                                    onChange={handleChange}
                                    style={{ display: 'none' }}
                                />
                            </div>
                            <div>
                                <span style={{ fontWeight: 600, color: config.auto_approve_ot ? '#1e293b' : '#64748b' }}>
                                    Auto Approve Overtime
                                </span>
                                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Automatically approve OT when criteria are met.</div>
                            </div>
                        </label>
                    </FormSection>

                    <FormSection title="Company Assignment" icon={FaBuilding}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                            {companies.map(company => (
                                <button
                                    key={company.id}
                                    type="button"
                                    onClick={() => toggleCompany(company.id)}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        borderRadius: '8px',
                                        border: '1px solid',
                                        borderColor: config.company_id.includes(company.id) ? 'var(--primary-color)' : '#e2e8f0',
                                        backgroundColor: config.company_id.includes(company.id) ? 'rgba(79, 70, 229, 0.1)' : 'white',
                                        color: config.company_id.includes(company.id) ? 'var(--primary-color)' : '#64748b',
                                        fontSize: '0.85rem',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem'
                                    }}
                                >
                                    {config.company_id.includes(company.id) && <FaChevronRight size={10} />}
                                    {company.company}
                                </button>
                            ))}
                        </div>
                        <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '1rem' }}>
                            Select the companies where these validation rules should be applied.
                        </p>
                    </FormSection>

                    <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'flex-end' }}>
                        <button
                            type="submit"
                            disabled={saving}
                            style={{
                                padding: '0.875rem 2.5rem',
                                background: 'var(--primary-color)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                fontWeight: 700,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)',
                                opacity: saving ? 0.7 : 1
                            }}
                        >
                            {saving ? 'Saving...' : <><FaSave /> Save Configuration</>}
                        </button>
                    </div>
                </form>
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

export default AttendanceValidationCondition;

