import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaTrash, FaEdit, FaTasks } from 'react-icons/fa';

const OnboardingTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [stages, setStages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ task_title: '', stage_id: '' });
    const [editingId, setEditingId] = useState(null);

    const fetchData = async () => {
        try {
            const [tasksRes, stagesRes] = await Promise.all([
                api.get('/onboarding/tasks/'),
                api.get('/onboarding/stages/')
            ]);
            setTasks(tasksRes.data.results || tasksRes.data || []);
            setStages(stagesRes.data.results || stagesRes.data || []);
        } catch (error) {
            console.error("Error fetching onboarding tasks:", error);
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
                await api.put(`/onboarding/tasks/${editingId}/`, formData);
            } else {
                await api.post('/onboarding/tasks/', formData);
            }
            setIsModalOpen(false);
            setFormData({ task_title: '', stage_id: '' });
            setEditingId(null);
            fetchData();
        } catch (error) {
            alert("Error saving task");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this task?")) {
            try {
                await api.delete(`/onboarding/tasks/${id}/`);
                fetchData();
            } catch (error) {
                alert("Error deleting task");
            }
        }
    };

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading tasks...</div>;

    return (
        <div style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b' }}>Onboarding Tasks</h2>
                    <p style={{ color: '#64748b', marginTop: '0.25rem' }}>Define master task lists allocated to new hires</p>
                </div>
                <button
                    onClick={() => { setEditingId(null); setFormData({ task_title: '', stage_id: '' }); setIsModalOpen(true); }}
                    className="btn btn-primary"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    <FaPlus /> Add Task
                </button>
            </div>

            <div style={{ backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #eef2f6', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #eef2f6' }}>
                            <th style={{ padding: '1.25rem', textAlign: 'left', color: '#64748b', fontWeight: 600 }}>Task Title</th>
                            <th style={{ padding: '1.25rem', textAlign: 'left', color: '#64748b', fontWeight: 600 }}>Stage</th>
                            <th style={{ padding: '1.25rem', textAlign: 'right', color: '#64748b', fontWeight: 600 }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.map((task) => (
                            <tr key={task.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '1.25rem', fontWeight: 500, color: '#1e293b' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <FaTasks color="#94a3b8" /> {task.task_title}
                                    </div>
                                </td>
                                <td style={{ padding: '1.25rem', color: '#64748b' }}>
                                    <span style={{ padding: '0.25rem 0.6rem', backgroundColor: '#f1f5f9', borderRadius: '6px', fontSize: '0.8rem' }}>
                                        {task.stage_title || 'No Stage'}
                                    </span>
                                </td>
                                <td style={{ padding: '1.25rem', textAlign: 'right' }}>
                                    <button
                                        onClick={() => { setEditingId(task.id); setFormData({ task_title: task.task_title, stage_id: task.stage_id }); setIsModalOpen(true); }}
                                        style={{ border: 'none', background: 'none', color: 'var(--primary-color)', cursor: 'pointer', marginRight: '1rem' }}
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(task.id)}
                                        style={{ border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer' }}
                                    >
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <AnimatePresence>
                {isModalOpen && (
                    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '24px', width: '100%', maxWidth: '450px' }}
                        >
                            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>{editingId ? 'Edit Task' : 'Add New Task'}</h3>
                            <form onSubmit={handleSubmit}>
                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#475569' }}>Task Title</label>
                                    <input
                                        type="text"
                                        value={formData.task_title}
                                        onChange={(e) => setFormData({ ...formData, task_title: e.target.value })}
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #d1d5db' }}
                                        placeholder="e.g. IT Asset Collection"
                                        required
                                    />
                                </div>
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#475569' }}>Onboarding Stage</label>
                                    <select
                                        value={formData.stage_id}
                                        onChange={(e) => setFormData({ ...formData, stage_id: e.target.value })}
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #d1d5db' }}
                                        required
                                    >
                                        <option value="">Select Stage...</option>
                                        {stages.map(s => <option key={s.id} value={s.id}>{s.stage_title}</option>)}
                                    </select>
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                                    <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '0.75rem 1.5rem', borderRadius: '10px', border: '1px solid #d1d5db', background: '#fff' }}>Cancel</button>
                                    <button type="submit" className="btn btn-primary">{editingId ? 'Update' : 'Create'} Task</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default OnboardingTasks;
