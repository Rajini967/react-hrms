import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMoneyBillWave, FaCalendarAlt, FaToggleOn, FaToggleOff, FaBuilding, FaSave } from 'react-icons/fa';
import useToast from '../../../hooks/useToast';
import Toast from '../../../components/common/Toast';

const PayslipAutoGeneration = () => {
    const [config, setConfig] = useState(null);
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const { toasts, showToast, removeToast } = useToast();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [configRes, companyRes] = await Promise.all([
                api.get('/payroll/auto-payslip-settings/'),
                api.get('/base/companies/')
            ]);

            if (configRes.data) {
                const data = Array.isArray(configRes.data) ? configRes.data[0] : configRes.data;
                setConfig(data || { auto_generate: false, generate_day: '1', company_id: null });
            }
            setCompanies(companyRes.data || []);
        } catch (error) {
            console.error("Error fetching payroll settings:", error);
            setConfig({ auto_generate: false, generate_day: '1', company_id: null });
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.post('/payroll/auto-payslip-settings/', config);
            showToast('Payroll automation settings saved', 'success');
        } catch (error) {
            showToast('Failed to save settings', 'error');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div style={{ padding: '4rem', textAlign: 'center' }}>Accessing payroll ledger...</div>;

    const days = Array.from({ length: 28 }, (_, i) => (i + 1).toString());

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ maxWidth: '800px', margin: '0 2rem' }}
        >
            <div style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.025em' }}>Payslip Automation</h2>
                <p style={{ color: '#64748b' }}>Configure automatic monthly payslip generation for your organization.</p>
            </div>

            <form onSubmit={handleSave} style={{
                backgroundColor: '#fff',
                padding: '2.5rem',
                borderRadius: '24px',
                border: '1px solid #f1f5f9',
                boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem', padding: '1.5rem', backgroundColor: '#f8fafc', borderRadius: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            backgroundColor: config.auto_generate ? 'rgba(79, 70, 229, 0.1)' : '#f1f5f9',
                            color: config.auto_generate ? 'var(--primary-color)' : '#94a3b8',
                            borderRadius: '14px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.25rem'
                        }}>
                            <FaMoneyBillWave />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: '#1e293b' }}>Automated Generation</h3>
                            <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>Enable or disable automatic monthly processing</p>
                        </div>
                    </div>
                    <div
                        onClick={() => setConfig({ ...config, auto_generate: !config.auto_generate })}
                        style={{
                            width: '56px',
                            height: '30px',
                            backgroundColor: config.auto_generate ? 'var(--primary-color)' : '#e2e8f0',
                            borderRadius: '15px',
                            padding: '4px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: config.auto_generate ? 'flex-end' : 'flex-start',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                    >
                        <motion.div
                            layout
                            style={{ width: '22px', height: '22px', backgroundColor: '#fff', borderRadius: '50%', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
                        />
                    </div>
                </div>

                <AnimatePresence>
                    {config?.auto_generate && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            style={{ overflow: 'hidden' }}
                        >
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                                <div>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 700, color: '#475569', marginBottom: '0.75rem' }}>
                                        <FaCalendarAlt /> Generation Day
                                    </label>
                                    <select
                                        value={config.generate_day}
                                        onChange={(e) => setConfig({ ...config, generate_day: e.target.value })}
                                        style={{
                                            width: '100%',
                                            padding: '0.875rem 1rem',
                                            borderRadius: '12px',
                                            border: '1px solid #e2e8f0',
                                            backgroundColor: '#f8fafc',
                                            fontSize: '0.95rem',
                                            outline: 'none',
                                            color: '#1e293b'
                                        }}
                                    >
                                        {days.map(day => (
                                            <option key={day} value={day}>{day}{day === '1' ? 'st' : day === '2' ? 'nd' : day === '3' ? 'rd' : 'th'} of month</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 700, color: '#475569', marginBottom: '0.75rem' }}>
                                        <FaBuilding /> Target Company
                                    </label>
                                    <select
                                        value={config.company_id || ''}
                                        onChange={(e) => setConfig({ ...config, company_id: e.target.value || null })}
                                        style={{
                                            width: '100%',
                                            padding: '0.875rem 1rem',
                                            borderRadius: '12px',
                                            border: '1px solid #e2e8f0',
                                            backgroundColor: '#f8fafc',
                                            fontSize: '0.95rem',
                                            outline: 'none',
                                            color: '#1e293b'
                                        }}
                                    >
                                        <option value="">All Companies</option>
                                        {companies.map(company => (
                                            <option key={company.id} value={company.id}>{company.company}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #f1f5f9', paddingTop: '2rem' }}>
                    <button
                        type="submit"
                        disabled={saving}
                        className="btn btn-primary"
                        style={{
                            padding: '0.875rem 3rem',
                            borderRadius: '12px',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)'
                        }}
                    >
                        {saving ? 'Saving...' : <><FaSave /> Save Configuration</>}
                    </button>
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

export default PayslipAutoGeneration;
