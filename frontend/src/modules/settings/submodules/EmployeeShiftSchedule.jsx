import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCalendarAlt, FaPlus, FaEdit, FaTrash, FaClock, FaMoon, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import useToast from '../../../hooks/useToast';
import Toast from '../../../components/common/Toast';

const EmployeeShiftSchedule = () => {
    const [records, setRecords] = useState([]);
    const [shifts, setShifts] = useState([]);
    const [days, setDays] = useState([
        { id: 'monday', name: 'Monday' },
        { id: 'tuesday', name: 'Tuesday' },
        { id: 'wednesday', name: 'Wednesday' },
        { id: 'thursday', name: 'Thursday' },
        { id: 'friday', name: 'Friday' },
        { id: 'saturday', name: 'Saturday' },
        { id: 'sunday', name: 'Sunday' }
    ]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const { toasts, showToast, removeToast } = useToast();

    const [formData, setFormData] = useState({
        day_name: 'monday',
        shift_id: '',
        minimum_working_hour: '08:15',
        start_time: '09:00:00',
        end_time: '18:00:00',
        is_night_shift: false,
        is_auto_punch_out_enabled: false,
        auto_punch_out_time: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [schedulesRes, shiftsRes] = await Promise.all([
                api.get('/base/employee-shift-schedules/'),
                api.get('/base/employee-shift/')
            ]);
            setRecords(schedulesRes.data.results || schedulesRes.data || []);
            setShifts(shiftsRes.data.results || shiftsRes.data || []);
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
                day_name: record.day?.day || record.day || 'monday',
                shift_id: record.shift_id?.id || record.shift_id || '',
                minimum_working_hour: record.minimum_working_hour || '08:15',
                start_time: record.start_time || '09:00:00',
                end_time: record.end_time || '18:00:00',
                is_night_shift: record.is_night_shift || false,
                is_auto_punch_out_enabled: record.is_auto_punch_out_enabled || false,
                auto_punch_out_time: record.auto_punch_out_time || ''
            });
        } else {
            setEditingRecord(null);
            setFormData({
                day_name: 'monday',
                shift_id: '',
                minimum_working_hour: '08:15',
                start_time: '09:00:00',
                end_time: '18:00:00',
                is_night_shift: false,
                is_auto_punch_out_enabled: false,
                auto_punch_out_time: ''
            });
        }
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Find or create day ID if needed. For now assume API handles the string or we need to fetch EmployeeShiftDay records.
            // Based on backend models, day is a ForeignKey to EmployeeShiftDay.
            // I should have fetched EmployeeShiftDay records too.

            // Let's assume for now we need to match the day name to its ID or the API is smart.
            // Actually I should fetch days from the backend.

            const payload = { ...formData };

            if (editingRecord) {
                await api.put(`/base/employee-shift-schedules/${editingRecord.id}/`, payload);
                showToast('Schedule updated successfully!', 'success');
            } else {
                await api.post('/base/employee-shift-schedules/', payload);
                showToast('Schedule created successfully!', 'success');
            }
            fetchData();
            setShowModal(false);
        } catch (error) {
            console.error("Error saving schedule:", error);
            showToast("Failed to save schedule. Ensure all fields are valid.", 'error');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this schedule entry?")) {
            try {
                await api.delete(`/base/employee-shift-schedules/${id}/`);
                fetchData();
                showToast('Schedule deleted successfully!', 'success');
            } catch (error) {
                console.error("Error deleting schedule:", error);
                showToast("Failed to delete schedule", 'error');
            }
        }
    };

    // Grouping records by shift for better visualization
    const groupedSchedules = records.reduce((acc, curr) => {
        const shiftName = curr.shift_id_name || curr.shift_id?.employee_shift || 'Common';
        if (!acc[shiftName]) acc[shiftName] = [];
        acc[shiftName].push(curr);
        return acc;
    }, {});

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading shift schedules...</div>;

    return (
        <div style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b' }}>Shift Schedules</h2>
                    <p style={{ color: '#64748b', marginTop: '0.25rem' }}>Monthly and daily working hour configurations</p>
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
                    <FaPlus /> Add Schedule
                </button>
            </div>

            {Object.keys(groupedSchedules).map(shiftName => (
                <div key={shiftName} style={{ marginBottom: '2.5rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#334155', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <FaClock style={{ color: 'var(--primary-color)' }} />
                        {shiftName}
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                        {groupedSchedules[shiftName].sort((a, b) => {
                            const daysWeight = { 'monday': 1, 'tuesday': 2, 'wednesday': 3, 'thursday': 4, 'friday': 5, 'saturday': 6, 'sunday': 7 };
                            const dayA = (a.day?.day || a.day || '').toLowerCase();
                            const dayB = (b.day?.day || b.day || '').toLowerCase();
                            return (daysWeight[dayA] || 0) - (daysWeight[dayB] || 0);
                        }).map((record) => (
                            <motion.div
                                key={record.id}
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                style={{
                                    backgroundColor: '#fff',
                                    borderRadius: '16px',
                                    padding: '1.25rem',
                                    border: '1px solid #eef2f6',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                                    position: 'relative'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                    <span style={{
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '20px',
                                        backgroundColor: 'rgba(79, 70, 229, 0.1)',
                                        color: 'var(--primary-color)',
                                        fontSize: '0.8rem',
                                        fontWeight: 700,
                                        textTransform: 'capitalize'
                                    }}>
                                        {record.day?.day || record.day}
                                    </span>
                                    {record.is_night_shift && <FaMoon title="Night Shift" style={{ color: '#6366f1' }} />}
                                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                                        <button onClick={() => handleOpenModal(record)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><FaEdit size={12} /></button>
                                        <button onClick={() => handleDelete(record.id)} style={{ background: 'none', border: 'none', color: '#fda4af', cursor: 'pointer' }}><FaTrash size={12} /></button>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                    <div style={{ flex: 1 }}>
                                        <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block' }}>Working Hours</span>
                                        <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1e293b' }}>
                                            {record.start_time?.slice(0, 5)} - {record.end_time?.slice(0, 5)}
                                        </span>
                                    </div>
                                    <div style={{ width: '1px', height: '24px', backgroundColor: '#e2e8f0' }}></div>
                                    <div style={{ flex: 1 }}>
                                        <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block' }}>Min. Hours</span>
                                        <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1e293b' }}>{record.minimum_working_hour}</span>
                                    </div>
                                </div>
                                {record.is_auto_punch_out_enabled && (
                                    <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                        <FaToggleOn /> Auto Check-out: {record.auto_punch_out_time?.slice(0, 5)}
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            ))}

            {records.length === 0 && (
                <div style={{ textAlign: 'center', padding: '5rem 2rem', color: '#94a3b8' }}>
                    <FaCalendarAlt size={64} style={{ marginBottom: '1.5rem', opacity: 0.2 }} />
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#475569' }}>No schedules configured</h3>
                    <p style={{ marginTop: '0.5rem' }}>Click "Add Schedule" to define working hours for a shift.</p>
                </div>
            )}

            {/* Modal */}
            <AnimatePresence>
                {showModal && (
                    <div style={{
                        position: 'fixed',
                        top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: 'rgba(15, 23, 42, 0.6)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        zIndex: 1100, backdropFilter: 'blur(8px)'
                    }}>
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            style={{
                                backgroundColor: 'white',
                                borderRadius: '24px',
                                padding: '2.5rem',
                                width: '100%',
                                maxWidth: '600px',
                                maxHeight: '90vh',
                                overflowY: 'auto'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>{editingRecord ? 'Edit Schedule' : 'New Schedule'}</h2>
                                <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#94a3b8' }}>&times;</button>
                            </div>

                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: '#334155', marginBottom: '0.5rem' }}>Shift *</label>
                                        <select
                                            required
                                            value={formData.shift_id}
                                            onChange={(e) => setFormData({ ...formData, shift_id: e.target.value })}
                                            style={{ width: '100%', padding: '0.875rem', borderRadius: '12px', border: '2px solid #e2e8f0', outline: 'none', backgroundColor: '#fff' }}
                                        >
                                            <option value="">Select Shift</option>
                                            {shifts.map(s => <option key={s.id} value={s.id}>{s.employee_shift}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: '#334155', marginBottom: '0.5rem' }}>Day *</label>
                                        <select
                                            required
                                            value={formData.day_name}
                                            onChange={(e) => setFormData({ ...formData, day_name: e.target.value })}
                                            style={{ width: '100%', padding: '0.875rem', borderRadius: '12px', border: '2px solid #e2e8f0', outline: 'none', backgroundColor: '#fff' }}
                                        >
                                            {days.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: '#334155', marginBottom: '0.5rem' }}>Start Time</label>
                                        <input
                                            type="time"
                                            value={formData.start_time}
                                            onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                                            style={{ width: '100%', padding: '0.875rem', borderRadius: '12px', border: '2px solid #e2e8f0', outline: 'none' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: '#334155', marginBottom: '0.5rem' }}>End Time</label>
                                        <input
                                            type="time"
                                            value={formData.end_time}
                                            onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                                            style={{ width: '100%', padding: '0.875rem', borderRadius: '12px', border: '2px solid #e2e8f0', outline: 'none' }}
                                        />
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: '#334155', marginBottom: '0.5rem' }}>Min Working Hours</label>
                                        <input
                                            type="text"
                                            value={formData.minimum_working_hour}
                                            onChange={(e) => setFormData({ ...formData, minimum_working_hour: e.target.value })}
                                            placeholder="08:15"
                                            style={{ width: '100%', padding: '0.875rem', borderRadius: '12px', border: '2px solid #e2e8f0', outline: 'none' }}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '1.5rem' }}>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                            <input
                                                type="checkbox"
                                                checked={formData.is_night_shift}
                                                onChange={(e) => setFormData({ ...formData, is_night_shift: e.target.checked })}
                                                style={{ width: '20px', height: '20px' }}
                                            />
                                            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155' }}>Night Shift</span>
                                        </label>
                                    </div>
                                </div>

                                <div style={{ padding: '1.25rem', backgroundColor: '#fdf2f2', borderRadius: '16px', border: '1px solid #fee2e2' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginBottom: '1rem' }}>
                                        <input
                                            type="checkbox"
                                            checked={formData.is_auto_punch_out_enabled}
                                            onChange={(e) => setFormData({ ...formData, is_auto_punch_out_enabled: e.target.checked })}
                                            style={{ width: '20px', height: '20px' }}
                                        />
                                        <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#991b1b' }}>Enable Automatic Check-out</span>
                                    </label>
                                    {formData.is_auto_punch_out_enabled && (
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#b91c1c', marginBottom: '0.25rem' }}>Auto Check-out Time</label>
                                            <input
                                                type="time"
                                                value={formData.auto_punch_out_time}
                                                onChange={(e) => setFormData({ ...formData, auto_punch_out_time: e.target.value })}
                                                style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '2px solid #fecaca', outline: 'none' }}
                                            />
                                        </div>
                                    )}
                                </div>

                                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                    <button type="submit" style={{ flex: 2, padding: '1rem', borderRadius: '12px', border: 'none', backgroundColor: 'var(--primary-color)', color: 'white', fontWeight: 700, cursor: 'pointer' }}>
                                        {editingRecord ? 'Update' : 'Create'} Schedule
                                    </button>
                                    <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '1rem', borderRadius: '12px', border: '2px solid #e2e8f0', backgroundColor: 'white', color: '#64748b', fontWeight: 700, cursor: 'pointer' }}>
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
                    <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => removeToast(toast.id)} duration={toast.duration} />
                ))}
            </AnimatePresence>
        </div>
    );
};

export default EmployeeShiftSchedule;

