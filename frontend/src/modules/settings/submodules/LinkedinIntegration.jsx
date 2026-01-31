import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { FaLinkedin, FaPlus, FaEdit, FaTrash, FaCheckCircle, FaTimesCircle, FaBuilding } from 'react-icons/fa';
import useToast from '../../../hooks/useToast';
import Toast from '../../../components/common/Toast';

const LinkedinIntegration = () => {
    const [records, setRecords] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const { toasts, showToast, removeToast } = useToast();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        api_token: '',
        company_id: null,
        is_active: true
    });

    // Toggle Switch Component
    const ToggleSwitch = ({ checked, onChange, disabled = false }) => (
        <label
            style={{
                position: 'relative',
                display: 'inline-block',
                width: '52px',
                height: '28px',
                opacity: disabled ? 0.5 : 1,
                cursor: disabled ? 'not-allowed' : 'pointer',
                userSelect: 'none',
                flexShrink: 0
            }}
            onClick={(e) => {
                if (!disabled) {
                    e.preventDefault();
                    onChange();
                }
            }}
        >
            <input
                type="checkbox"
                checked={checked}
                disabled={disabled}
                onChange={() => !disabled && onChange()}
                style={{ 
                    position: 'absolute', 
                    opacity: 0, 
                    width: 0, 
                    height: 0,
                    pointerEvents: 'none'
                }}
            />
            <span
                style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: checked ? '#f97316' : '#cbd5e1',
                    borderRadius: 999,
                    transition: 'background-color 0.3s ease',
                    boxShadow: checked 
                        ? '0 0 0 2px rgba(249, 115, 22, 0.2)' 
                        : 'inset 0 2px 4px rgba(0,0,0,0.1)'
                }}
            />
            <span
                style={{
                    position: 'absolute',
                    top: '4px',
                    left: checked ? '26px' : '4px',
                    width: '20px',
                    height: '20px',
                    backgroundColor: '#fff',
                    borderRadius: '50%',
                    transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
                    border: '1px solid rgba(0,0,0,0.05)'
                }}
            />
        </label>
    );

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [linkedinRes, compRes] = await Promise.all([
                api.get('/recruitment/linkedin-accounts/'),
                api.get('/base/companies/')
            ]);
            setRecords(linkedinRes.data.results || linkedinRes.data || []);
            setCompanies(compRes.data.results || compRes.data || []);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (record = null) => {
        if (record) {
            setEditingRecord(record);
            setFormData({
                username: record.username,
                email: record.email,
                api_token: record.api_token,
                company_id: record.company_id,
                is_active: record.is_active !== undefined ? record.is_active : true
            });
        } else {
            setEditingRecord(null);
            setFormData({
                username: '',
                email: '',
                api_token: '',
                company_id: companies[0]?.id || null,
                is_active: true
            });
        }
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingRecord) {
                await api.put(`/recruitment/linkedin-accounts/${editingRecord.id}/`, formData);
                showToast('LinkedIn account updated successfully!', 'success');
            } else {
                await api.post('/recruitment/linkedin-accounts/', formData);
                showToast('LinkedIn account connected successfully!', 'success');
            }
            fetchData();
            setShowModal(false);
        } catch (error) {
            console.error("Error saving LinkedIn account:", error);
            const errorMsg = error.response?.data?.email?.[0] || error.response?.data?.error || "Failed to save LinkedIn account. Please check your credentials.";
            showToast(errorMsg, 'error');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this LinkedIn account?")) {
            try {
                await api.delete(`/recruitment/linkedin-accounts/${id}/`);
                fetchData();
                showToast('LinkedIn account deleted successfully!', 'success');
            } catch (error) {
                console.error("Error deleting LinkedIn account:", error);
                showToast("Failed to delete LinkedIn account", 'error');
            }
        }
    };

    const toggleActive = async (id, currentStatus) => {
        try {
            await api.patch(`/recruitment/linkedin-accounts/${id}/`, { is_active: !currentStatus });
            fetchData();
        } catch (error) {
            console.error("Error toggling active status:", error);
        }
    };

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading LinkedIn accounts...</div>;

    return (
        <div style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b' }}>LinkedIn Integration</h2>
                    <p style={{ color: '#64748b', marginTop: '0.25rem' }}>Connect LinkedIn accounts to post job openings automatically</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    style={{
                        padding: '0.75rem 1.5rem',
                        borderRadius: '12px',
                        backgroundColor: '#0077b5',
                        color: 'white',
                        border: 'none',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(0, 119, 181, 0.3)'
                    }}
                >
                    <FaPlus /> Add LinkedIn Account
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '1.5rem' }}>
                {records.map((record) => {
                    const company = companies.find(c => c.id === record.company_id);
                    return (
                        <motion.div
                            key={record.id}
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{
                                backgroundColor: '#fff',
                                borderRadius: '16px',
                                padding: '1.5rem',
                                border: '1px solid #eef2f6',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                                position: 'relative'
                            }}
                        >
                            {record.is_active && (
                                <div style={{
                                    position: 'absolute',
                                    top: '1rem',
                                    right: '1rem',
                                    backgroundColor: '#10b981',
                                    color: 'white',
                                    padding: '4px 10px',
                                    borderRadius: '12px',
                                    fontSize: '0.7rem',
                                    fontWeight: 600,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px'
                                }}>
                                    <FaCheckCircle size={10} /> ACTIVE
                                </div>
                            )}

                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '12px',
                                    backgroundColor: '#0077b5',
                                    color: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1.3rem'
                                }}>
                                    <FaLinkedin />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>{record.username}</h3>
                                    <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '2px 0 0 0' }}>{record.email}</p>
                                </div>
                            </div>

                            {company && (
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '0.5rem',
                                    backgroundColor: '#f8fafc',
                                    borderRadius: '8px',
                                    marginBottom: '1rem'
                                }}>
                                    <FaBuilding size={12} color="#64748b" />
                                    <span style={{ fontSize: '0.85rem', color: '#64748b' }}>{company.company}</span>
                                </div>
                            )}

                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.5rem',
                                backgroundColor: '#fef3c7',
                                borderRadius: '8px',
                                marginBottom: '1rem'
                            }}>
                                <span style={{ fontSize: '0.75rem', color: '#92400e', fontWeight: 500 }}>
                                    Sub ID: {record.sub_id || 'Not verified'}
                                </span>
                            </div>

                            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                                <button
                                    onClick={() => toggleActive(record.id, record.is_active)}
                                    style={{
                                        flex: 1,
                                        padding: '0.6rem',
                                        borderRadius: '8px',
                                        border: 'none',
                                        backgroundColor: record.is_active ? '#fef2f2' : '#f0fdf4',
                                        color: record.is_active ? '#dc2626' : '#16a34a',
                                        fontSize: '0.8rem',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.4rem'
                                    }}
                                >
                                    {record.is_active ? <><FaTimesCircle size={12} /> Deactivate</> : <><FaCheckCircle size={12} /> Activate</>}
                                </button>
                                <button
                                    onClick={() => handleOpenModal(record)}
                                    style={{ padding: '0.6rem', borderRadius: '8px', border: 'none', backgroundColor: '#f1f5f9', color: '#64748b', cursor: 'pointer' }}
                                >
                                    <FaEdit size={14} />
                                </button>
                                <button
                                    onClick={() => handleDelete(record.id)}
                                    style={{ padding: '0.6rem', borderRadius: '8px', border: 'none', backgroundColor: '#fff1f2', color: '#ef4444', cursor: 'pointer' }}
                                >
                                    <FaTrash size={14} />
                                </button>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {records.length === 0 && (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                    <FaLinkedin size={64} style={{ marginBottom: '1rem', opacity: 0.3 }} />
                    <p>No LinkedIn accounts connected. Click "Add LinkedIn Account" to get started.</p>
                </div>
            )}

            {/* Modal */}
            <AnimatePresence>
                {showModal && (
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1100,
                        backdropFilter: 'blur(4px)'
                    }}>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            style={{
                                backgroundColor: 'white',
                                borderRadius: '24px',
                                padding: '2rem',
                                width: '100%',
                                maxWidth: '700px',
                                boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <FaLinkedin size={28} color="#0077b5" />
                                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>
                                        {editingRecord ? 'Edit LinkedIn Account' : 'Create LinkedIn Account'}
                                    </h2>
                                </div>
                                <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#94a3b8' }}>&times;</button>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
                                    {/* Left Column */}
                                    <div>
                                        <div style={{ marginBottom: '1.25rem' }}>
                                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>Username *</label>
                                            <input
                                                type="text"
                                                required
                                                maxLength={250}
                                                value={formData.username}
                                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                                placeholder="Username"
                                                style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #e2e8f0', outline: 'none' }}
                                            />
                                        </div>

                                        <div style={{ marginBottom: '1.25rem' }}>
                                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>API Token *</label>
                                            <input
                                                type="password"
                                                required
                                                maxLength={500}
                                                value={formData.api_token}
                                                onChange={(e) => setFormData({ ...formData, api_token: e.target.value })}
                                                placeholder="Api Token"
                                                style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #e2e8f0', outline: 'none' }}
                                            />
                                        </div>

                                        <div style={{ marginBottom: '1.25rem' }}>
                                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>Company id *</label>
                                            <select
                                                value={formData.company_id || ''}
                                                onChange={(e) => setFormData({ ...formData, company_id: e.target.value ? parseInt(e.target.value) : null })}
                                                required
                                                style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #e2e8f0', outline: 'none' }}
                                            >
                                                <option value="">Select Company</option>
                                                {companies.map(comp => (
                                                    <option key={comp.id} value={comp.id}>{comp.company}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Right Column */}
                                    <div>
                                        <div style={{ marginBottom: '1.25rem' }}>
                                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>Email *</label>
                                            <input
                                                type="email"
                                                required
                                                maxLength={254}
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                placeholder="Email"
                                                style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #e2e8f0', outline: 'none' }}
                                            />
                                        </div>

                                        <div style={{ marginBottom: '1.25rem' }}>
                                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>Is Active</label>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                <ToggleSwitch
                                                    checked={formData.is_active}
                                                    onChange={() => setFormData({ ...formData, is_active: !formData.is_active })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                                    <button
                                        type="submit"
                                        style={{ padding: '0.75rem 1.5rem', borderRadius: '12px', border: 'none', backgroundColor: '#0077b5', color: 'white', fontWeight: 600, cursor: 'pointer' }}
                                    >
                                        Save
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Toast Notifications */}
            <AnimatePresence>
                {toasts.map(toast => (
                    <Toast
                        key={toast.id}
                        message={toast.message}
                        type={toast.type}
                        onClose={() => removeToast(toast.id)}
                        duration={toast.duration}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
};

export default LinkedinIntegration;
