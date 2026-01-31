import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { FaPlus } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const ShiftSettings = () => {
    const [subTab, setSubTab] = useState('standard');
    const [shifts, setShifts] = useState([]);
    const [rotatingShifts, setRotatingShifts] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);

    const [isShiftModalOpen, setIsShiftModalOpen] = useState(false);
    const [shiftFormData, setShiftFormData] = useState({
        shift_name: '', employee_shift: '', weekly_full_time: '40:00', full_time: '200:00', company_id: []
    });
    const [editingShiftId, setEditingShiftId] = useState(null);

    const [isRSModalOpen, setIsRSModalOpen] = useState(false);
    const [rsFormData, setRsFormData] = useState({
        name: '', shift1: '', shift2: '', additional_data: { additional_shifts: [] }
    });
    const [editingRSId, setEditingRSId] = useState(null);

    const fetchData = async () => {
        try {
            const [shiftRes, rsRes, compRes] = await Promise.all([
                api.get('/base/employee-shift/'),
                api.get('/base/rotating-shifts/'),
                api.get('/base/companies/')
            ]);
            setShifts(shiftRes.data.results || shiftRes.data || []);
            setRotatingShifts(rsRes.data.results || rsRes.data || []);
            setCompanies(compRes.data.results || compRes.data || []);
        } catch (error) {
            console.error("Error fetching data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleShiftSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingShiftId) {
                await api.put(`/base/employee-shift/${editingShiftId}/`, shiftFormData);
            } else {
                await api.post('/base/employee-shift/', shiftFormData);
            }
            setIsShiftModalOpen(false);
            fetchData();
        } catch (error) {
            alert("Error saving shift");
        }
    };

    const handleRSSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingRSId) {
                await api.put(`/base/rotating-shifts/${editingRSId}/`, rsFormData);
            } else {
                await api.post('/base/rotating-shifts/', rsFormData);
            }
            setIsRSModalOpen(false);
            fetchData();
        } catch (error) {
            alert("Error saving rotating shift");
        }
    };

    const addAdditionalShift = () => {
        setRsFormData(prev => ({
            ...prev,
            additional_data: {
                ...prev.additional_data,
                additional_shifts: [...(prev.additional_data?.additional_shifts || []), '']
            }
        }));
    };

    const removeAdditionalShift = (index) => {
        const newShifts = [...rsFormData.additional_data.additional_shifts];
        newShifts.splice(index, 1);
        setRsFormData(prev => ({
            ...prev,
            additional_data: { ...prev.additional_data, additional_shifts: newShifts }
        }));
    };

    const updateAdditionalShift = (index, value) => {
        const newShifts = [...rsFormData.additional_data.additional_shifts];
        newShifts[index] = value;
        setRsFormData(prev => ({
            ...prev,
            additional_data: { ...prev.additional_data, additional_shifts: newShifts }
        }));
    };

    const handleShiftDelete = async (id) => {
        // ... existing shift delete code ...

        if (window.confirm("Delete shift?")) {
            await api.delete(`/base/employee-shift/${id}/`);
            fetchData();
        }
    };

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;

    const subTabButtonStyle = (isActive) => ({
        padding: '0.5rem 1.25rem',
        borderRadius: '8px',
        border: 'none',
        backgroundColor: isActive ? 'var(--primary-color)' : 'transparent',
        color: isActive ? '#fff' : '#64748b',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.2s',
        fontSize: '0.875rem'
    });

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', backgroundColor: '#f1f5f9', padding: '0.25rem', borderRadius: '10px' }}>
                    <button style={subTabButtonStyle(subTab === 'standard')} onClick={() => setSubTab('standard')}>Employee Shifts</button>
                    <button style={subTabButtonStyle(subTab === 'rotating')} onClick={() => setSubTab('rotating')}>Rotating Shifts</button>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={() => {
                        if (subTab === 'standard') {
                            setEditingShiftId(null);
                            setShiftFormData({ shift_name: '', employee_shift: '', weekly_full_time: '40:00', full_time: '200:00', company_id: [] });
                            setIsShiftModalOpen(true);
                        } else {
                            setEditingRSId(null);
                            setRsFormData({ name: '', shift1: '', shift2: '', additional_data: { additional_shifts: [] } });
                            setIsRSModalOpen(true);
                        }
                    }}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    <FaPlus /> {subTab === 'standard' ? 'Add Shift' : 'Add Rotating Shift'}
                </button>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={subTab}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
                >
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                                <th style={{ padding: '1.25rem 1rem', textAlign: 'left', color: '#64748b', fontWeight: 600, fontSize: '0.875rem' }}>Name</th>
                                {subTab === 'standard' && <th style={{ padding: '1.25rem 1rem', textAlign: 'left', color: '#64748b', fontWeight: 600, fontSize: '0.875rem' }}>Weekly Hours</th>}
                                <th style={{ padding: '1.25rem 1rem', textAlign: 'left', color: '#64748b', fontWeight: 600, fontSize: '0.875rem' }}>
                                    {subTab === 'standard' ? 'Companies' : 'Switch Details'}
                                </th>
                                <th style={{ padding: '1.25rem 1rem', textAlign: 'right', color: '#64748b', fontWeight: 600, fontSize: '0.875rem' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subTab === 'standard' ? (
                                shifts.map(shift => (
                                    <tr key={shift.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        <td style={{ padding: '1rem', color: '#1e293b', fontWeight: 500 }}>
                                            {shift.employee_shift}
                                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{shift.shift_name}</div>
                                        </td>
                                        <td style={{ padding: '1rem', color: '#475569' }}>{shift.weekly_full_time}</td>
                                        <td style={{ padding: '1rem', color: '#475569' }}>
                                            {shift.company_id?.map(id => companies.find(c => c.id === id)?.company).filter(Boolean).join(', ') || 'All'}
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                                            <button onClick={() => {
                                                setShiftFormData({
                                                    shift_name: shift.shift_name,
                                                    employee_shift: shift.employee_shift,
                                                    weekly_full_time: shift.weekly_full_time,
                                                    full_time: shift.full_time,
                                                    company_id: shift.company_id || []
                                                });
                                                setEditingShiftId(shift.id);
                                                setIsShiftModalOpen(true);
                                            }} style={{ marginRight: '1rem', color: 'var(--primary-color)', border: 'none', background: 'none', cursor: 'pointer' }}>Edit</button>
                                            <button onClick={() => handleShiftDelete(shift.id)} style={{ color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer' }}>Delete</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                rotatingShifts.map(rs => (
                                    <tr key={rs.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        <td style={{ padding: '1rem', color: '#1e293b', fontWeight: 500 }}>{rs.name}</td>
                                        <td style={{ padding: '1rem', color: '#475569' }}>
                                            {shifts.find(s => s.id === rs.shift1)?.employee_shift} &harr; {shifts.find(s => s.id === rs.shift2)?.employee_shift}
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                                            <button onClick={() => {
                                                setRsFormData({
                                                    name: rs.name,
                                                    shift1: rs.shift1,
                                                    shift2: rs.shift2,
                                                    additional_data: rs.additional_data || { additional_shifts: [] }
                                                });
                                                setEditingRSId(rs.id);
                                                setIsRSModalOpen(true);
                                            }} style={{ marginRight: '1rem', color: 'var(--primary-color)', border: 'none', background: 'none', cursor: 'pointer' }}>Edit</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </motion.div>
            </AnimatePresence>

            {/* Shift Modal */}
            {isShiftModalOpen && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ backgroundColor: '#fff', width: '100%', maxWidth: '450px', borderRadius: '16px', overflow: 'hidden' }}>
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between' }}>
                            <h3 style={{ margin: 0 }}>{editingShiftId ? 'Edit Shift' : 'Add Shift'}</h3>
                            <button onClick={() => setIsShiftModalOpen(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.5rem' }}>&times;</button>
                        </div>
                        <form onSubmit={handleShiftSubmit} style={{ padding: '1.5rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Shift Name (Code)</label>
                                    <input value={shiftFormData.shift_name} onChange={e => setShiftFormData({ ...shiftFormData, shift_name: e.target.value })} style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #d1d5db' }} required />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Display Name</label>
                                    <input value={shiftFormData.employee_shift} onChange={e => setShiftFormData({ ...shiftFormData, employee_shift: e.target.value })} style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #d1d5db' }} required />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Weekly Hours</label>
                                        <input value={shiftFormData.weekly_full_time} onChange={e => setShiftFormData({ ...shiftFormData, weekly_full_time: e.target.value })} style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #d1d5db' }} placeholder="40:00" />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Monthly Hours</label>
                                        <input value={shiftFormData.full_time} onChange={e => setShiftFormData({ ...shiftFormData, full_time: e.target.value })} style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #d1d5db' }} placeholder="200:00" />
                                    </div>
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Companies</label>
                                    <select multiple value={shiftFormData.company_id} onChange={e => setShiftFormData({ ...shiftFormData, company_id: Array.from(e.target.selectedOptions, o => parseInt(o.value)) })} style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #d1d5db', height: '100px' }}>
                                        {companies.map(c => <option key={c.id} value={c.id}>{c.company}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                                <button type="button" onClick={() => setIsShiftModalOpen(false)} style={{ padding: '0.6rem 1.2rem', borderRadius: '8px', border: '1px solid #d1d5db', background: '#fff' }}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Save Changes</button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}

            {/* RS Modal */}
            {isRSModalOpen && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ backgroundColor: '#fff', width: '100%', maxWidth: '450px', borderRadius: '16px', overflow: 'hidden' }}>
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between' }}>
                            <h3 style={{ margin: 0 }}>{editingRSId ? 'Edit Rotating Shift' : 'Add Rotating Shift'}</h3>
                            <button onClick={() => setIsRSModalOpen(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.5rem' }}>&times;</button>
                        </div>
                        <form onSubmit={handleRSSubmit} style={{ padding: '1.5rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Name</label>
                                    <input value={rsFormData.name} onChange={e => setRsFormData({ ...rsFormData, name: e.target.value })} style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #d1d5db' }} required />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Shift 1</label>
                                        <select value={rsFormData.shift1} onChange={e => setRsFormData({ ...rsFormData, shift1: e.target.value })} style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #d1d5db' }} required>
                                            <option value="">Select...</option>
                                            {shifts.map(s => <option key={s.id} value={s.id}>{s.employee_shift}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Shift 2</label>
                                        <select value={rsFormData.shift2} onChange={e => setRsFormData({ ...rsFormData, shift2: e.target.value })} style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #d1d5db' }} required>
                                            <option value="">Select...</option>
                                            {shifts.map(s => <option key={s.id} value={s.id}>{s.employee_shift}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div style={{ maxHeight: '200px', overflowY: 'auto', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
                                    <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', fontWeight: 600 }}>
                                        Additional Shifts
                                        <button type="button" onClick={addAdditionalShift} style={{ color: 'var(--primary-color)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8rem' }}>+ Add More</button>
                                    </label>
                                    {(rsFormData.additional_data?.additional_shifts || []).map((as, idx) => (
                                        <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                            <select
                                                value={as}
                                                onChange={e => updateAdditionalShift(idx, e.target.value)}
                                                style={{ flex: 1, padding: '0.6rem', borderRadius: '8px', border: '1px solid #d1d5db' }}
                                            >
                                                <option value="">Select...</option>
                                                {shifts.map(s => <option key={s.id} value={s.id}>{s.employee_shift}</option>)}
                                            </select>
                                            <button type="button" onClick={() => removeAdditionalShift(idx)} style={{ color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer' }}>&times;</button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                                <button type="button" onClick={() => setIsRSModalOpen(false)} style={{ padding: '0.6rem 1.2rem', borderRadius: '8px', border: '1px solid #d1d5db', background: '#fff' }}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Save Changes</button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}

        </div>
    );
};

export default ShiftSettings;
