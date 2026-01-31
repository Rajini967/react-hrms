import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../../services/api';
import { FaPlus, FaTrash, FaEdit, FaClock } from 'react-icons/fa';
import { toast } from 'react-toastify';

const GraceTime = () => {
    const [graceTimes, setGraceTimes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        allowed_time: '00:00:00',
        allowed_clock_in: true,
        allowed_clock_out: false,
        is_default: false
    });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchGraceTimes();
    }, []);

    const fetchGraceTimes = async () => {
        setLoading(true);
        try {
            const response = await api.get('/attendance/grace-time/');
            if (response.data) {
                setGraceTimes(response.data);
            }
        } catch (error) {
            console.error('Error fetching grace times:', error);
            // toast.error('Failed to load grace times');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.put(`/attendance/grace-time/${editingId}/`, formData);
                toast.success('Grace time updated');
            } else {
                await api.post('/attendance/grace-time/', formData);
                toast.success('Grace time added');
            }
            fetchGraceTimes();
            setShowForm(false);
            resetForm();
        } catch (error) {
            console.error('Error saving grace time:', error);
            toast.error('Failed to save grace time');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this grace time?')) {
            try {
                await api.delete(`/attendance/grace-time/${id}/`);
                toast.success('Grace time deleted');
                fetchGraceTimes();
            } catch (error) {
                console.error('Error deleting grace time:', error);
                toast.error('Failed to delete grace time');
            }
        }
    };

    const handleEdit = (item) => {
        setFormData({
            allowed_time: item.allowed_time,
            allowed_clock_in: item.allowed_clock_in,
            allowed_clock_out: item.allowed_clock_out,
            is_default: item.is_default
        });
        setEditingId(item.id);
        setShowForm(true);
    };

    const resetForm = () => {
        setFormData({
            allowed_time: '00:00:00',
            allowed_clock_in: true,
            allowed_clock_out: false,
            is_default: false
        });
        setEditingId(null);
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            style={{ padding: '1.5rem' }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0, color: '#1e293b' }}>Grace Time</h2>
                    <p style={{ color: '#64748b', margin: '0.5rem 0 0' }}>Manage grace periods for attendance.</p>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={() => { resetForm(); setShowForm(true); }}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    <FaPlus /> Add New
                </button>
            </div>

            {showForm && (
                <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem', border: '1px solid #e2e8f0' }}>
                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#475569' }}>Allowed Time (HH:MM:SS)</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={formData.allowed_time}
                                    onChange={(e) => setFormData({ ...formData, allowed_time: e.target.value })}
                                    required
                                    placeholder="00:15:00"
                                />
                            </div>
                            <div style={{ paddingTop: '2rem' }}>
                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                        <input
                                            type="checkbox"
                                            checked={formData.allowed_clock_in}
                                            onChange={(e) => setFormData({ ...formData, allowed_clock_in: e.target.checked })}
                                        />
                                        Allowed for Clock-In
                                    </label>
                                </div>
                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                        <input
                                            type="checkbox"
                                            checked={formData.allowed_clock_out}
                                            onChange={(e) => setFormData({ ...formData, allowed_clock_out: e.target.checked })}
                                        />
                                        Allowed for Clock-Out
                                    </label>
                                </div>
                                <div>
                                    <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                        <input
                                            type="checkbox"
                                            checked={formData.is_default}
                                            onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
                                        />
                                        Is Default
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => setShowForm(false)}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                            >
                                {editingId ? 'Update' : 'Save'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {loading ? (
                    <div>Loading...</div>
                ) : graceTimes.length === 0 ? (
                    <div style={{ color: '#64748b', fontStyle: 'italic' }}>No grace times found.</div>
                ) : (
                    graceTimes.map(item => (
                        <div key={item.id} style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', position: 'relative' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                                <div style={{ background: '#e0f2fe', color: '#0284c7', padding: '0.5rem', borderRadius: '8px' }}>
                                    <FaClock />
                                </div>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#1e293b' }}>{item.allowed_time}</div>
                                    {item.is_default && <span style={{ fontSize: '0.75rem', background: '#dcfce7', color: '#166534', padding: '2px 8px', borderRadius: '10px', marginTop: '4px', display: 'inline-block' }}>Default</span>}
                                </div>
                            </div>
                            <div style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '1.5rem' }}>
                                {item.allowed_clock_in && <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FaCheck size={12} color="#10b981" /> Clock-In</div>}
                                {item.allowed_clock_out && <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FaCheck size={12} color="#10b981" /> Clock-Out</div>}
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
                                <button
                                    onClick={() => handleEdit(item)}
                                    className="btn btn-sm"
                                    style={{ flex: 1, color: '#475569', background: '#f1f5f9' }}
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(item.id)}
                                    className="btn btn-sm"
                                    style={{ width: '40px', color: '#ef4444', background: '#fee2e2' }}
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </motion.div>
    );
};

export default GraceTime;
