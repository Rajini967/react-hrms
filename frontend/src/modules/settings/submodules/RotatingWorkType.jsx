import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSync, FaPlus, FaTrash, FaEdit, FaUserTie, FaBriefcase, FaChevronRight } from 'react-icons/fa';
import useToast from '../../../hooks/useToast';
import Toast from '../../../components/common/Toast';

const RotatingWorkType = () => {
    const [records, setRecords] = useState([]);
    const [workTypes, setWorkTypes] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const { toasts, showToast, removeToast } = useToast();

    const [formData, setFormData] = useState({
        name: '',
        work_type1: '',
        work_type2: '',
        employee_id: [],
        additional_data: {
            additional_work_types: []
        }
    });

    useEffect(() => {
        fetchData();
        fetchRelatedData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await api.get('/base/rotating-worktypes/');
            setRecords(response.data || []);
        } catch (error) {
            console.error("Error fetching rotating work types:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchRelatedData = async () => {
        try {
            console.log('Fetching work types and employees...');
            const [wtRes, empRes] = await Promise.all([
                api.get('/base/worktypes/'),
                api.get('/employee/employee/')
            ]);

            console.log('Raw Work Types Response:', wtRes.data);
            console.log('Raw Employees Response:', empRes.data);

            // Handle both array and paginated response formats
            const workTypesData = wtRes.data.results || wtRes.data || [];
            const employeesData = empRes.data.results || empRes.data || [];

            console.log('Extracted Work Types:', workTypesData);
            console.log('Extracted Employees:', employeesData);
            console.log('Work Types Count:', workTypesData.length);

            setWorkTypes(workTypesData);
            setEmployees(employeesData);
        } catch (error) {
            console.error("Error fetching related data:", error);
            console.error("Error details:", error.response?.data);
        }
    };

    const handleOpenModal = (record = null) => {
        if (record) {
            setEditingRecord(record);
            setFormData({
                name: record.name || '',
                work_type1: record.work_type1 || '',
                work_type2: record.work_type2 || '',
                employee_id: record.employee_id || [],
                additional_data: record.additional_data || { additional_work_types: [] }
            });
        } else {
            setEditingRecord(null);
            setFormData({
                name: '',
                work_type1: '',
                work_type2: '',
                employee_id: [],
                additional_data: { additional_work_types: [] }
            });
        }
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingRecord) {
                await api.put(`/base/rotating-worktypes/${editingRecord.id}/`, formData);
                showToast('Rotating work type updated', 'success');
            } else {
                await api.post('/base/rotating-worktypes/', formData);
                showToast('Rotating work type created', 'success');
            }
            fetchData();
            setShowModal(false);
        } catch (error) {
            console.error("Error saving rotating work type:", error);
            const errorMsg = error.response?.data?.non_field_errors?.[0] || 'Failed to save configuration';
            showToast(errorMsg, 'error');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete this rotating work type configuration?")) {
            try {
                await api.delete(`/base/rotating-worktypes/${id}/`);
                setRecords(prev => prev.filter(r => r.id !== id));
                showToast('Configuration deleted', 'success');
            } catch (error) {
                showToast('Failed to delete', 'error');
            }
        }
    };

    const getWorkTypeName = (id) => workTypes.find(w => w.id === id)?.work_type || 'N/A';

    if (loading) return <div style={{ padding: '3rem', textAlign: 'center' }}>Loading work type policies...</div>;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Rotating Work Types</h2>
                    <p style={{ color: '#64748b', marginTop: '0.25rem' }}>Manage automated transitions between different work environments (e.g. Remote to On-site).</p>
                </div>
                <button onClick={() => handleOpenModal()} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: '12px', padding: '0.75rem 1.5rem', backgroundColor: '#0ea5e9', boxShadow: '0 4px 12px rgba(14, 165, 233, 0.25)' }}>
                    <FaPlus /> New Pattern
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
                {records.map(record => (
                    <motion.div
                        key={record.id}
                        whileHover={{ y: -4 }}
                        style={{
                            backgroundColor: '#fff',
                            borderRadius: '24px',
                            padding: '1.75rem',
                            border: '1px solid #f1f5f9',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                            <div style={{ width: '48px', height: '48px', backgroundColor: 'rgba(14, 165, 233, 0.1)', color: '#0ea5e9', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                                <FaSync />
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button onClick={() => handleOpenModal(record)} style={{ color: '#64748b', background: '#f8fafc', border: 'none', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer' }}><FaEdit size={14} /></button>
                                <button onClick={() => handleDelete(record.id)} style={{ color: '#ef4444', background: '#fee2e2', border: 'none', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer' }}><FaTrash size={14} /></button>
                            </div>
                        </div>

                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', marginBottom: '1rem' }}>{record.name}</h3>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                            <div style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem', backgroundColor: '#f1f5f9', borderRadius: '8px', color: '#475569', fontWeight: 600 }}>{getWorkTypeName(record.work_type1)}</div>
                            <FaChevronRight size={10} style={{ color: '#94a3b8' }} />
                            <div style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem', backgroundColor: '#f1f5f9', borderRadius: '8px', color: '#475569', fontWeight: 600 }}>{getWorkTypeName(record.work_type2)}</div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.85rem' }}>
                            <FaUserTie size={12} />
                            <span>{record.employee_id?.length || 0} Employees Assigned</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            {records.length === 0 && (
                <div style={{ textAlign: 'center', padding: '5rem 0', color: '#94a3b8' }}>
                    <FaBriefcase size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                    <p>No rotating work type patterns defined yet.</p>
                </div>
            )}

            {/* Modal */}
            <AnimatePresence>
                {showModal && (
                    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1200 }}>
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ backgroundColor: '#fff', borderRadius: '28px', padding: '2.5rem', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>{editingRecord ? 'Edit Pattern' : 'New Rotation Pattern'}</h3>
                                <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', color: '#94a3b8', cursor: 'pointer' }}>&times;</button>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 700, color: '#475569' }}>Pattern Name</label>
                                    <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none' }} placeholder="e.g. Remote-Onsite Cycle" />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 700, color: '#475569' }}>Primary Work Type</label>
                                        <select value={formData.work_type1} onChange={e => setFormData({ ...formData, work_type1: e.target.value })} required style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none', color: '#1e293b' }}>
                                            <option value="" style={{ color: '#1e293b' }}>Select Type</option>
                                            {workTypes.map(w => <option key={w.id} value={w.id} style={{ color: '#1e293b' }}>{w.work_type}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 700, color: '#475569' }}>Secondary Work Type</label>
                                        <select value={formData.work_type2} onChange={e => setFormData({ ...formData, work_type2: e.target.value })} required style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none', color: '#1e293b' }}>
                                            <option value="" style={{ color: '#1e293b' }}>Select Type</option>
                                            {workTypes.map(w => <option key={w.id} value={w.id} style={{ color: '#1e293b' }}>{w.work_type}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div style={{ marginBottom: '2.5rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 700, color: '#475569' }}>Assign Employees</label>
                                    <div style={{ maxHeight: '150px', overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1rem' }}>
                                        {employees.map(emp => (
                                            <label key={emp.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', cursor: 'pointer' }}>
                                                <input
                                                    type="checkbox"
                                                    checked={formData.employee_id.includes(emp.id)}
                                                    onChange={() => {
                                                        const current = formData.employee_id;
                                                        const next = current.includes(emp.id) ? current.filter(id => id !== emp.id) : [...current, emp.id];
                                                        setFormData({ ...formData, employee_id: next });
                                                    }}
                                                />
                                                <span style={{ fontSize: '0.9rem', color: '#334155' }}>{emp.employee_first_name} {emp.employee_last_name}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', borderRadius: '14px', fontWeight: 700, backgroundColor: '#0ea5e9', boxShadow: '0 4px 12px rgba(14, 165, 233, 0.25)' }}>
                                    {editingRecord ? 'Update Configuration' : 'Create Pattern'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {toasts.map(toast => (
                    <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => removeToast(toast.id)} />
                ))}
            </AnimatePresence>
        </motion.div>
    );
};

export default RotatingWorkType;

