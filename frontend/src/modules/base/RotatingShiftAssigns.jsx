import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { motion } from 'framer-motion';
import { FaPlus, FaTrash, FaEdit, FaSearch, FaSync } from 'react-icons/fa';

const RotatingShiftAssigns = () => {
    const [assigns, setAssigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [employees, setEmployees] = useState([]);
    const [rotatingShifts, setRotatingShifts] = useState([]);
    const [formData, setFormData] = useState({
        employee_id: '',
        rotating_shift_id: '',
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [assignRes, empRes, rsRes] = await Promise.all([
                api.get('/base/rotating-shift-assigns/'),
                api.get('/employee/employee/'),
                api.get('/base/rotating-shifts/')
            ]);
            setAssigns(assignRes.data.results || assignRes.data);
            setEmployees(empRes.data.results || empRes.data);
            setRotatingShifts(rsRes.data.results || rsRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this assignment?')) {
            try {
                await api.delete(`/base/rotating-shift-assigns/${id}/`);
                fetchData();
            } catch (error) {
                alert('Error deleting assignment');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/base/rotating-shift-assigns/', formData);
            setIsModalOpen(false);
            fetchData();
        } catch (error) {
            alert('Error creating assignment: ' + JSON.stringify(error.response?.data));
        }
    };

    return (
        <div style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>Rotating Shift Assignments</h1>
                    <p style={{ color: '#718096', margin: '0.25rem 0 0 0' }}>Assign and manage rotating shifts for employees.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="btn btn-primary"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    <FaPlus /> Assign Shift
                </button>
            </div>

            <div style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ backgroundColor: '#f8fafc' }}>
                        <tr>
                            <th style={{ textAlign: 'left', padding: '1rem', borderBottom: '1px solid #e2e8f0' }}>Employee</th>
                            <th style={{ textAlign: 'left', padding: '1rem', borderBottom: '1px solid #e2e8f0' }}>Rotating Shift</th>
                            <th style={{ textAlign: 'left', padding: '1rem', borderBottom: '1px solid #e2e8f0' }}>Current Shift</th>
                            <th style={{ textAlign: 'left', padding: '1rem', borderBottom: '1px solid #e2e8f0' }}>Next Change</th>
                            <th style={{ textAlign: 'right', padding: '1rem', borderBottom: '1px solid #e2e8f0' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {assigns.map(assign => (
                            <tr key={assign.id} style={{ borderBottom: '1px solid #edf2f7' }}>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ fontWeight: 600 }}>{assign.employee_name || assign.employee_id}</div>
                                </td>
                                <td style={{ padding: '1rem' }}>{assign.rotating_shift_name || assign.rotating_shift_id}</td>
                                <td style={{ padding: '1rem' }}>{assign.current_shift_name || 'N/A'}</td>
                                <td style={{ padding: '1rem' }}>{assign.next_change_date || 'N/A'}</td>
                                <td style={{ padding: '1rem', textAlign: 'right' }}>
                                    <button onClick={() => handleDelete(assign.id)} className="btn-icon text-danger">
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '16px', width: '450px' }}
                    >
                        <h2 style={{ marginBottom: '1.5rem' }}>Assign Rotating Shift</h2>
                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Employee</label>
                                <select
                                    className="form-control"
                                    required
                                    value={formData.employee_id}
                                    onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })}
                                >
                                    <option value="">Select Employee</option>
                                    {employees.map(emp => (
                                        <option key={emp.id} value={emp.id}>{emp.employee_first_name} {emp.employee_last_name}</option>
                                    ))}
                                </select>
                            </div>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Rotating Shift</label>
                                <select
                                    className="form-control"
                                    required
                                    value={formData.rotating_shift_id}
                                    onChange={(e) => setFormData({ ...formData, rotating_shift_id: e.target.value })}
                                >
                                    <option value="">Select Rotating Shift</option>
                                    {rotatingShifts.map(rs => (
                                        <option key={rs.id} value={rs.id}>{rs.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">Cancel</button>
                                <button type="submit" className="btn btn-primary">Assign</button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default RotatingShiftAssigns;
