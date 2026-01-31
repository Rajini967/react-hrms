import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { motion } from 'framer-motion';

const EmployeeTypeSettings = () => {
    const [employeeTypes, setEmployeeTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        employee_type: ''
    });
    const [editingId, setEditingId] = useState(null);

    const fetchData = async () => {
        try {
            const response = await api.get('/employee/employee-type/');
            setEmployeeTypes(response.data.results || response.data || []);
        } catch (error) {
            console.error("Error fetching employee types", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.put(`/employee/employee-type/${editingId}/`, formData);
            } else {
                await api.post('/employee/employee-type/', formData);
            }
            setIsModalOpen(false);
            setEditingId(null);
            setFormData({ employee_type: '' });
            fetchData();
        } catch (error) {
            console.error("Error saving employee type", error.response?.data);
            alert("Error saving employee type");
        }
    };

    const handleEdit = (type) => {
        setFormData({
            employee_type: type.employee_type
        });
        setEditingId(type.id);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete this employee type?")) {
            try {
                await api.delete(`/employee/employee-type/${id}/`);
                fetchData();
            } catch (error) {
                console.error("Error deleting", error);
            }
        }
    };

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading Employee Types...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#1e293b' }}>Employee Types</h2>
                <button
                    className="btn btn-primary"
                    onClick={() => {
                        setEditingId(null);
                        setFormData({ employee_type: '' });
                        setIsModalOpen(true);
                    }}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    <FaPlus /> Add Employee Type
                </button>
            </div>

            <div style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                            <th style={{ padding: '1.25rem 1rem', textAlign: 'left', color: '#64748b', fontWeight: 600, fontSize: '0.875rem' }}>Employee Type</th>
                            <th style={{ padding: '1.25rem 1rem', textAlign: 'right', color: '#64748b', fontWeight: 600, fontSize: '0.875rem' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employeeTypes.map(type => (
                            <tr key={type.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '1rem', color: '#1e293b', fontWeight: 500 }}>{type.employee_type}</td>
                                <td style={{ padding: '1rem', textAlign: 'right' }}>
                                    <button onClick={() => handleEdit(type)} style={{ marginRight: '1rem', color: 'var(--primary-color)', border: 'none', background: 'none', cursor: 'pointer' }}>Edit</button>
                                    <button onClick={() => handleDelete(type.id)} style={{ color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer' }}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ backgroundColor: '#fff', width: '100%', maxWidth: '400px', borderRadius: '16px', overflow: 'hidden' }}>
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between' }}>
                            <h3 style={{ margin: 0 }}>{editingId ? 'Edit Employee Type' : 'Add Employee Type'}</h3>
                            <button onClick={() => setIsModalOpen(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.5rem' }}>&times;</button>
                        </div>
                        <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Employee Type Name</label>
                                <input value={formData.employee_type} onChange={e => setFormData({ employee_type: e.target.value })} style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #d1d5db' }} required />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                                <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '0.6rem 1.2rem', borderRadius: '8px', border: '1px solid #d1d5db', background: '#fff' }}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Save Changes</button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default EmployeeTypeSettings;
