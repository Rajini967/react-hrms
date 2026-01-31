import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserTag, FaPlus, FaEdit, FaTrash, FaBuilding } from 'react-icons/fa';
import useToast from '../../../hooks/useToast';
import Toast from '../../../components/common/Toast';

const EmployeeType = () => {
    const [records, setRecords] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const { toasts, showToast, removeToast } = useToast();
    const [formData, setFormData] = useState({
        employee_type: '',
        company_id: []
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [employeeTypesRes, companiesRes] = await Promise.all([
                api.get('/employee/employee-type/'),
                api.get('/base/companies/')
            ]);
            setRecords(employeeTypesRes.data.results || employeeTypesRes.data || []);
            setCompanies(companiesRes.data.results || companiesRes.data || []);
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
                employee_type: record.employee_type || '',
                company_id: record.company_id || []
            });
        } else {
            setEditingRecord(null);
            setFormData({
                employee_type: '',
                company_id: []
            });
        }
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                employee_type: formData.employee_type,
                company_id: Array.isArray(formData.company_id) ? formData.company_id : []
            };

            if (editingRecord) {
                await api.put(`/employee/employee-type/${editingRecord.id}/`, payload);
                showToast('Employee type updated successfully!', 'success');
            } else {
                await api.post('/employee/employee-type/', payload);
                showToast('Employee type created successfully!', 'success');
            }
            fetchData();
            setShowModal(false);
        } catch (error) {
            console.error("Error saving employee type:", error);
            const errorMsg = error.response?.data?.employee_type?.[0] || error.response?.data?.error || "Failed to save employee type";
            showToast(errorMsg, 'error');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this employee type?")) {
            try {
                await api.delete(`/employee/employee-type/${id}/`);
                fetchData();
                showToast('Employee type deleted successfully!', 'success');
            } catch (error) {
                console.error("Error deleting employee type:", error);
                showToast("Failed to delete employee type", 'error');
            }
        }
    };

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading employee types...</div>;

    return (
        <div style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b' }}>Employee Type</h2>
                    <p style={{ color: '#64748b', marginTop: '0.25rem' }}>Manage employee types for categorization</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    style={{
                        padding: '0.75rem 1.5rem',
                        borderRadius: '12px',
                        backgroundColor: 'var(--primary-color)',
                        color: 'white',
                        border: 'none',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(79, 70, 229, 0.2)'
                    }}
                >
                    <FaPlus /> Add Employee Type
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                {records.map((record) => (
                    <motion.div
                        key={record.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={{
                            backgroundColor: '#fff',
                            borderRadius: '12px',
                            padding: '1.25rem',
                            border: '1px solid #eef2f6',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.75rem'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
                            <div style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '8px',
                                backgroundColor: 'rgba(79, 70, 229, 0.1)',
                                color: 'var(--primary-color)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.9rem'
                            }}>
                                <FaUserTag />
                            </div>
                            <div style={{ flex: 1 }}>
                                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#1e293b', margin: 0 }}>{record.employee_type}</h3>
                                {record.company_id && record.company_id.length > 0 && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem' }}>
                                        <FaBuilding size={10} color="#64748b" />
                                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                                            {Array.isArray(record.company_id) ? record.company_id.length : 0} Companies
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                            <button
                                onClick={() => handleOpenModal(record)}
                                style={{ padding: '0.35rem', borderRadius: '6px', border: 'none', backgroundColor: '#f1f5f9', color: '#64748b', cursor: 'pointer' }}
                            >
                                <FaEdit size={11} />
                            </button>
                            <button
                                onClick={() => handleDelete(record.id)}
                                style={{ padding: '0.35rem', borderRadius: '6px', border: 'none', backgroundColor: '#fff1f2', color: '#ef4444', cursor: 'pointer' }}
                            >
                                <FaTrash size={11} />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {records.length === 0 && (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                    <FaUserTag size={48} style={{ marginBottom: '1rem', opacity: 0.3 }} />
                    <p>No employee types added yet. Click "Add Employee Type" to create your first employee type.</p>
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
                                maxWidth: '500px',
                                boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b' }}>{editingRecord ? 'Edit Employee Type' : 'Add Employee Type'}</h2>
                                <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#94a3b8' }}>&times;</button>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>Employee Type *</label>
                                    <input
                                        type="text"
                                        required
                                        maxLength={50}
                                        value={formData.employee_type}
                                        onChange={(e) => setFormData({ ...formData, employee_type: e.target.value })}
                                        placeholder="e.g. Full Time, Part Time, Contract"
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #e2e8f0', outline: 'none' }}
                                    />
                                </div>

                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>Companies</label>
                                    <select
                                        multiple
                                        value={formData.company_id}
                                        onChange={(e) => {
                                            const selected = Array.from(e.target.selectedOptions, option => parseInt(option.value));
                                            setFormData({ ...formData, company_id: selected });
                                        }}
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #e2e8f0', outline: 'none', minHeight: '100px', color: '#1e293b' }}
                                    >
                                        {companies.map(comp => (
                                            <option key={comp.id} value={comp.id} style={{ color: '#1e293b' }}>{comp.company}</option>
                                        ))}
                                    </select>
                                    <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.5rem' }}>Hold Ctrl/Cmd to select multiple companies</p>
                                </div>

                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <button
                                        type="submit"
                                        style={{ flex: 1, padding: '0.75rem', borderRadius: '12px', border: 'none', backgroundColor: 'var(--primary-color)', color: 'white', fontWeight: 600, cursor: 'pointer' }}
                                    >
                                        {editingRecord ? 'Update' : 'Create'} Employee Type
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        style={{ flex: 1, padding: '0.75rem', borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: 'white', color: '#64748b', fontWeight: 600, cursor: 'pointer' }}
                                    >
                                        Cancel
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

export default EmployeeType;




