import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserPlus, FaTrash, FaBuilding, FaUserTie, FaShieldAlt } from 'react-icons/fa';
import useToast from '../../../hooks/useToast';
import Toast from '../../../components/common/Toast';

const DepartmentManagers = () => {
    const [managers, setManagers] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const { toasts, showToast, removeToast } = useToast();

    const [formData, setFormData] = useState({
        manager: '',
        department: ''
    });

    useEffect(() => {
        fetchData();
        fetchRelatedData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await api.get('/helpdesk/department-managers/');
            setManagers(response.data.results || response.data || []);
        } catch (error) {
            console.error("Error fetching department managers:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchRelatedData = async () => {
        try {
            const [empRes, depRes] = await Promise.all([
                api.get('/employee/employee/'),
                api.get('/base/departments/')
            ]);
            setEmployees(empRes.data.results || empRes.data || []);
            setDepartments(depRes.data || []);
        } catch (error) {
            console.error("Error fetching related data:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/helpdesk/department-managers/', formData);
            showToast('Helpdesk manager assigned', 'success');
            fetchData();
            setShowModal(false);
            setFormData({ manager: '', department: '' });
        } catch (error) {
            const errorMsg = error.response?.data?.non_field_errors?.[0] || 'Failed to assign manager';
            showToast(errorMsg, 'error');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Revoke helpdesk management permissions for this assignment?")) {
            try {
                await api.delete(`/helpdesk/department-managers/${id}/`);
                setManagers(prev => prev.filter(m => m.id !== id));
                showToast('Assignment revoked', 'success');
            } catch (error) {
                showToast('Failed to revoke', 'error');
            }
        }
    };

    if (loading) return <div style={{ padding: '4rem', textAlign: 'center' }}>Loading authority matrix...</div>;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Helpdesk Authorities</h2>
                    <p style={{ color: '#64748b', marginTop: '0.25rem' }}>Assign managers who will handle tickets for specific departments.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="btn btn-primary"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        borderRadius: '12px',
                        padding: '0.75rem 1.5rem',
                        backgroundColor: '#6366f1',
                        boxShadow: '0 4px 12px rgba(99, 102, 241, 0.25)'
                    }}
                >
                    <FaUserPlus /> Assign Manager
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
                {managers.map(item => (
                    <motion.div
                        key={item.id}
                        whileHover={{ y: -4 }}
                        style={{
                            backgroundColor: '#fff',
                            borderRadius: '24px',
                            padding: '1.75rem',
                            border: '1px solid #f1f5f9',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                            <div style={{ position: 'relative' }}>
                                <div style={{
                                    width: '56px',
                                    height: '56px',
                                    borderRadius: '18px',
                                    backgroundColor: '#f1f5f9',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#6366f1',
                                    fontSize: '1.5rem'
                                }}>
                                    <FaUserTie />
                                </div>
                                <div style={{
                                    position: 'absolute',
                                    bottom: '-4px',
                                    right: '-4px',
                                    width: '20px',
                                    height: '20px',
                                    backgroundColor: '#10b981',
                                    borderRadius: '50%',
                                    border: '3px solid #fff',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '0.6rem',
                                    color: '#fff'
                                }}>
                                    <FaShieldAlt size={8} />
                                </div>
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>
                                    {typeof item.manager === 'object' ? item.manager.full_name : 'Assigned Manager'}
                                </h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748b', fontSize: '0.85rem', marginTop: '0.2rem' }}>
                                    <FaBuilding size={12} />
                                    <span>{typeof item.department === 'object' ? item.department.department : item.department}</span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => handleDelete(item.id)}
                            style={{
                                color: '#ef4444',
                                background: '#fee2e2',
                                border: 'none',
                                padding: '0.6rem',
                                borderRadius: '10px',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            <FaTrash size={14} />
                        </button>
                    </motion.div>
                ))}
            </div>

            {managers.length === 0 && (
                <div style={{ textAlign: 'center', padding: '5rem 0', color: '#94a3b8' }}>
                    <FaShieldAlt size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                    <p>No department managers assigned for helpdesk yet.</p>
                </div>
            )}

            {/* Modal */}
            <AnimatePresence>
                {showModal && (
                    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1200 }}>
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ backgroundColor: '#fff', borderRadius: '28px', padding: '2.5rem', width: '100%', maxWidth: '500px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>Assign Manager</h3>
                                <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', color: '#94a3b8', cursor: 'pointer' }}>&times;</button>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 700, color: '#475569' }}>Select Department</label>
                                    <select
                                        value={formData.department}
                                        onChange={e => setFormData({ ...formData, department: e.target.value })}
                                        required
                                        style={{ width: '100%', padding: '0.875rem 1rem', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none', backgroundColor: '#f8fafc', color: '#1e293b' }}
                                    >
                                        <option value="">Select Department</option>
                                        {departments.map(d => <option key={d.id} value={d.id}>{d.department}</option>)}
                                    </select>
                                </div>

                                <div style={{ marginBottom: '2.5rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 700, color: '#475569' }}>Select Employee</label>
                                    <select
                                        value={formData.manager}
                                        onChange={e => setFormData({ ...formData, manager: e.target.value })}
                                        required
                                        style={{ width: '100%', padding: '0.875rem 1rem', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none', backgroundColor: '#f8fafc', color: '#1e293b' }}
                                    >
                                        <option value="">Select Employee</option>
                                        {employees.map(e => <option key={e.id} value={e.id}>{e.employee_first_name} {e.employee_last_name}</option>)}
                                    </select>
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    style={{
                                        width: '100%',
                                        padding: '1rem',
                                        borderRadius: '16px',
                                        fontWeight: 700,
                                        backgroundColor: '#6366f1',
                                        boxShadow: '0 4px 12px rgba(99, 102, 241, 0.25)'
                                    }}
                                >
                                    Confirm Assignment
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

export default DepartmentManagers;
