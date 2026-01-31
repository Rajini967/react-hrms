import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { FaPlus, FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';
import { motion } from 'framer-motion';

const CompanySettings = () => {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        company: '',
        hq: false,
        address: '',
        country: '',
        state: '',
        city: '',
        zip: '',
        phone: '',
        email: '',
        website: '',
    });
    const [editingId, setEditingId] = useState(null);

    const fetchCompanies = async () => {
        try {
            const response = await api.get('/base/companies/');
            setCompanies(response.data.results || response.data || []);
        } catch (error) {
            console.error("Error fetching companies", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCompanies();
    }, []);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.put(`/base/companies/${editingId}/`, formData);
            } else {
                await api.post('/base/companies/', formData);
            }
            setIsModalOpen(false);
            setEditingId(null);
            fetchCompanies();
        } catch (error) {
            console.error("Error saving company", error.response?.data);
            alert("Error saving company: " + JSON.stringify(error.response?.data));
        }
    };

    const handleEdit = (comp) => {
        setFormData({
            company: comp.company,
            hq: comp.hq,
            address: comp.address,
            country: comp.country,
            state: comp.state,
            city: comp.city,
            zip: comp.zip,
            phone: comp.phone || '',
            email: comp.email || '',
            website: comp.website || '',
        });
        setEditingId(comp.id);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this company?")) {
            try {
                await api.delete(`/base/companies/${id}/`);
                fetchCompanies();
            } catch (error) {
                console.error("Error deleting company", error);
            }
        }
    };

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading Companies...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#1e293b' }}>Companies</h2>
                <button
                    className="btn btn-primary"
                    onClick={() => {
                        setEditingId(null);
                        setFormData({
                            company: '', hq: false, address: '', country: '', state: '', city: '', zip: '',
                            phone: '', email: '', website: ''
                        });
                        setIsModalOpen(true);
                    }}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem' }}
                >
                    <FaPlus /> Add Company
                </button>
            </div>

            <div style={{
                backgroundColor: '#fff',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                overflow: 'hidden',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                            <th style={{ padding: '1.25rem 1rem', textAlign: 'left', color: '#64748b', fontWeight: 600, fontSize: '0.875rem' }}>Company Name</th>
                            <th style={{ padding: '1.25rem 1rem', textAlign: 'left', color: '#64748b', fontWeight: 600, fontSize: '0.875rem' }}>Location</th>
                            <th style={{ padding: '1.25rem 1rem', textAlign: 'center', color: '#64748b', fontWeight: 600, fontSize: '0.875rem' }}>HQ</th>
                            <th style={{ padding: '1.25rem 1rem', textAlign: 'right', color: '#64748b', fontWeight: 600, fontSize: '0.875rem' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {companies.map(comp => (
                            <tr key={comp.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background-color 0.2s' }}>
                                <td style={{ padding: '1rem', color: '#1e293b', fontWeight: 500 }}>{comp.company}</td>
                                <td style={{ padding: '1rem', color: '#475569' }}>{comp.city}, {comp.country}</td>
                                <td style={{ padding: '1rem', textAlign: 'center' }}>
                                    {comp.hq ? (
                                        <FaCheck style={{ color: '#22c55e' }} />
                                    ) : (
                                        <FaTimes style={{ color: '#ef4444' }} />
                                    )}
                                </td>
                                <td style={{ padding: '1rem', textAlign: 'right' }}>
                                    <button
                                        onClick={() => handleEdit(comp)}
                                        style={{ marginRight: '1rem', color: 'var(--primary-color)', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 500 }}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(comp.id)}
                                        style={{ color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 500 }}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(15, 23, 42, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
                    backdropFilter: 'blur(4px)'
                }}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        style={{
                            backgroundColor: '#fff',
                            width: '100%',
                            maxWidth: '600px',
                            maxHeight: '90vh',
                            borderRadius: '16px',
                            overflow: 'hidden',
                            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                        }}
                    >
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>{editingId ? 'Edit Company' : 'Add Company'}</h3>
                            <button onClick={() => setIsModalOpen(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#64748b', fontSize: '1.5rem' }}>&times;</button>
                        </div>
                        <form onSubmit={handleSubmit} style={{ padding: '1.5rem', overflowY: 'auto', maxHeight: 'calc(90vh - 120px)' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                                <div style={{ gridColumn: 'span 2' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: '#475569' }}>Company Name</label>
                                    <input name="company" value={formData.company} onChange={handleInputChange} style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #d1d5db' }} required />
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingTop: '1.5rem' }}>
                                    <input type="checkbox" name="hq" checked={formData.hq} onChange={handleInputChange} id="hq-check" style={{ width: '1.2rem', height: '1.2rem', cursor: 'pointer' }} />
                                    <label htmlFor="hq-check" style={{ fontSize: '0.875rem', fontWeight: 600, color: '#475569', cursor: 'pointer' }}>Headquarters (HQ)</label>
                                </div>
                                <div style={{ gridColumn: 'span 2' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: '#475569' }}>Address</label>
                                    <textarea name="address" value={formData.address} onChange={handleInputChange} style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #d1d5db', minHeight: '80px' }} required />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: '#475569' }}>City</label>
                                    <input name="city" value={formData.city} onChange={handleInputChange} style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #d1d5db' }} required />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: '#475569' }}>State</label>
                                    <input name="state" value={formData.state} onChange={handleInputChange} style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #d1d5db' }} required />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: '#475569' }}>Country</label>
                                    <input name="country" value={formData.country} onChange={handleInputChange} style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #d1d5db' }} required />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: '#475569' }}>Zip Code</label>
                                    <input name="zip" value={formData.zip} onChange={handleInputChange} style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #d1d5db' }} required />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: '#475569' }}>Phone</label>
                                    <input name="phone" value={formData.phone} onChange={handleInputChange} style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #d1d5db' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: '#475569' }}>Email</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #d1d5db' }} />
                                </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem', borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem' }}>
                                <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '0.6rem 1.2rem', borderRadius: '8px', border: '1px solid #d1d5db', background: '#fff', cursor: 'pointer' }}>Cancel</button>
                                <button type="submit" className="btn btn-primary" style={{ padding: '0.6rem 2rem' }}>Save Changes</button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default CompanySettings;
