import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { FaPlus, FaTrash, FaEdit } from 'react-icons/fa';
import { motion } from 'framer-motion';

const DepartmentSettings = () => {
    const [departments, setDepartments] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        department: '',
        company_id: []
    });
    const [editingId, setEditingId] = useState(null);

    const fetchData = async () => {
        try {
            const [deptRes, compRes] = await Promise.all([
                api.get('/base/departments/'),
                api.get('/base/companies/')
            ]);
            setDepartments(deptRes.data.results || deptRes.data || []);
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCompanyChange = (e) => {
        const options = e.target.options;
        const value = [];
        for (let i = 0, l = options.length; i < l; i++) {
            if (options[i].selected) {
                value.push(parseInt(options[i].value));
            }
        }
        setFormData(prev => ({ ...prev, company_id: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.put(`/base/departments/${editingId}/`, formData);
            } else {
                await api.post('/base/departments/', formData);
            }
            setIsModalOpen(false);
            setEditingId(null);
            fetchData();
        } catch (error) {
            console.error("Error saving department", error.response?.data);
            alert("Error saving department");
        }
    };

    const handleEdit = (dept) => {
        setFormData({
            department: dept.department,
            company_id: dept.company_id.map(c => typeof c === 'object' ? c.id : c)
        });
        setEditingId(dept.id);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete this department?")) {
            try {
                await api.delete(`/base/departments/${id}/`);
                fetchData();
            } catch (error) {
                console.error("Error deleting", error);
            }
        }
    };

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading Departments...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#1e293b' }}>Departments</h2>
                <button
                    className="btn btn-primary"
                    onClick={() => {
                        setEditingId(null);
                        setFormData({ department: '', company_id: [] });
                        setIsModalOpen(true);
                    }}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    <FaPlus /> Add Department
                </button>
            </div>

            <div style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                            <th style={{ padding: '1.25rem 1rem', textAlign: 'left', color: '#64748b', fontWeight: 600, fontSize: '0.875rem' }}>Department Name</th>
                            <th style={{ padding: '1.25rem 1rem', textAlign: 'left', color: '#64748b', fontWeight: 600, fontSize: '0.875rem' }}>Associated Companies</th>
                            <th style={{ padding: '1.25rem 1rem', textAlign: 'right', color: '#64748b', fontWeight: 600, fontSize: '0.875rem' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {departments.map(dept => (
                            <tr key={dept.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '1rem', color: '#1e293b', fontWeight: 500 }}>{dept.department}</td>
                                <td style={{ padding: '1rem', color: '#475569' }}>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                        {dept.company_id.map(id => {
                                            const co = companies.find(c => c.id === id);
                                            return co ? (
                                                <span key={id} style={{ backgroundColor: '#f1f5f9', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem' }}>
                                                    {co.company}
                                                </span>
                                            ) : null;
                                        })}
                                    </div>
                                </td>
                                <td style={{ padding: '1rem', textAlign: 'right' }}>
                                    <button onClick={() => handleEdit(dept)} style={{ marginRight: '1rem', color: 'var(--primary-color)', border: 'none', background: 'none', cursor: 'pointer' }}>Edit</button>
                                    <button onClick={() => handleDelete(dept.id)} style={{ color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer' }}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ backgroundColor: '#fff', width: '100%', maxWidth: '450px', borderRadius: '16px', overflow: 'hidden' }}>
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between' }}>
                            <h3 style={{ margin: 0 }}>{editingId ? 'Edit Department' : 'Add Department'}</h3>
                            <button onClick={() => setIsModalOpen(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.5rem' }}>&times;</button>
                        </div>
                        <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
                            <div style={{ marginBottom: '1.25rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>Department Name</label>
                                <input name="department" value={formData.department} onChange={handleInputChange} style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #d1d5db' }} required />
                            </div>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>Companies (Select Multiple)</label>
                                <select
                                    multiple
                                    name="company_id"
                                    value={formData.company_id}
                                    onChange={handleCompanyChange}
                                    style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #d1d5db', minHeight: '120px' }}
                                >
                                    {companies.map(c => <option key={c.id} value={c.id}>{c.company}</option>)}
                                </select>
                                <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem' }}>Hold Ctrl (Win) or Cmd (Mac) to select multiple companies.</p>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
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

export default DepartmentSettings;
