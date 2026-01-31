import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSyncAlt, FaPlus, FaTrash, FaEdit, FaUserTie, FaClock, FaChevronRight } from 'react-icons/fa';
import useToast from '../../../hooks/useToast';
import Toast from '../../../components/common/Toast';

const RotatingShift = () => {
    const [records, setRecords] = useState([]);
    const [shifts, setShifts] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const { toasts, showToast, removeToast } = useToast();

    const [formData, setFormData] = useState({
        name: '',
        shift1: '',
        shift2: '',
        employee_id: [],
        additional_data: {
            additional_shifts: []
        }
    });

    useEffect(() => {
        fetchData();
        fetchRelatedData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await api.get('/base/rotating-shifts/');
            setRecords(response.data || []);
        } catch (error) {
            console.error("Error fetching rotating shifts:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchRelatedData = async () => {
        try {
            const [shiftRes, empRes] = await Promise.all([
                api.get('/base/employee-shift/'),
                api.get('/employee/employee/')
            ]);
            setShifts(shiftRes.data || []);
            setEmployees(empRes.data.results || empRes.data || []);
        } catch (error) {
            console.error("Error fetching related data:", error);
        }
    };

    const handleOpenModal = (record = null) => {
        if (record) {
            setEditingRecord(record);
            setFormData({
                name: record.name || '',
                shift1: record.shift1 || '',
                shift2: record.shift2 || '',
                employee_id: record.employee_id || [],
                additional_data: record.additional_data || { additional_shifts: [] }
            });
        } else {
            setEditingRecord(null);
            setFormData({
                name: '',
                shift1: '',
                shift2: '',
                employee_id: [],
                additional_data: { additional_shifts: [] }
            });
        }
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingRecord) {
                await api.put(`/base/rotating-shifts/${editingRecord.id}/`, formData);
                showToast('Rotating shift updated', 'success');
            } else {
                await api.post('/base/rotating-shifts/', formData);
                showToast('Rotating shift created', 'success');
            }
            fetchData();
            setShowModal(false);
        } catch (error) {
            showToast('Failed to save rotating shift', 'error');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete this rotating shift configuration?")) {
            try {
                await api.delete(`/base/rotating-shifts/${id}/`);
                setRecords(prev => prev.filter(r => r.id !== id));
                showToast('Configuration deleted', 'success');
            } catch (error) {
                showToast('Failed to delete', 'error');
            }
        }
    };

    const getShiftName = (id) => shifts.find(s => s.id === id)?.employee_shift || 'N/A';

    if (loading) return <div style={{ padding: '3rem', textAlign: 'center' }}>Loading shift policies...</div>;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Rotating Shifts</h2>
                    <p style={{ color: '#64748b', marginTop: '0.25rem' }}>Define patterns for automated employee shift rotation.</p>
                </div>
                <button onClick={() => handleOpenModal()} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: '12px', padding: '0.75rem 1.5rem' }}>
                    <FaPlus /> New Shift Pattern
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
                            <div style={{ width: '48px', height: '48px', backgroundColor: 'rgba(79, 70, 229, 0.1)', color: 'var(--primary-color)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                                <FaSyncAlt />
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button onClick={() => handleOpenModal(record)} style={{ color: '#64748b', background: '#f8fafc', border: 'none', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer' }}><FaEdit size={14} /></button>
                                <button onClick={() => handleDelete(record.id)} style={{ color: '#ef4444', background: '#fee2e2', border: 'none', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer' }}><FaTrash size={14} /></button>
                            </div>
                        </div>

                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', marginBottom: '1rem' }}>{record.name}</h3>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                            <div style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem', backgroundColor: '#f1f5f9', borderRadius: '8px', color: '#475569', fontWeight: 600 }}>{getShiftName(record.shift1)}</div>
                            <FaChevronRight size={10} style={{ color: '#94a3b8' }} />
                            <div style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem', backgroundColor: '#f1f5f9', borderRadius: '8px', color: '#475569', fontWeight: 600 }}>{getShiftName(record.shift2)}</div>
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
                    <FaSyncAlt size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                    <p>No rotating shift patterns defined yet.</p>
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
                                    <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none' }} placeholder="e.g. Day-Night Rotation" />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 700, color: '#475569' }}>Primary Shift</label>
                                        <select value={formData.shift1} onChange={e => setFormData({ ...formData, shift1: e.target.value })} required style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none', color: '#1e293b' }}>
                                            <option value="" style={{ color: '#1e293b' }}>Select Shift</option>
                                            {shifts.map(s => <option key={s.id} value={s.id} style={{ color: '#1e293b' }}>{s.employee_shift}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 700, color: '#475569' }}>Secondary Shift</label>
                                        <select value={formData.shift2} onChange={e => setFormData({ ...formData, shift2: e.target.value })} required style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none', color: '#1e293b' }}>
                                            <option value="" style={{ color: '#1e293b' }}>Select Shift</option>
                                            {shifts.map(s => <option key={s.id} value={s.id} style={{ color: '#1e293b' }}>{s.employee_shift}</option>)}
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

                                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', borderRadius: '14px', fontWeight: 700, boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)' }}>
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

export default RotatingShift;

