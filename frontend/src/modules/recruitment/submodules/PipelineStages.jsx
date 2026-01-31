import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaLayerGroup, FaEdit, FaTrash, FaEye } from 'react-icons/fa';

const PipelineStages = () => {
    const [stages, setStages] = useState([]);
    const [recruitments, setRecruitments] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        stage: '',
        stage_type: 'interview',
        recruitment_id: '',
        sequence: 0,
        stage_managers: []
    });
    const [editingId, setEditingId] = useState(null);

    const fetchData = async () => {
        try {
            const [stagesRes, recruitmentsRes, employeesRes] = await Promise.all([
                api.get('/recruitment/stages/'),
                api.get('/recruitment/recruitments/'),
                api.get('/employee/employees/')
            ]);
            setStages(stagesRes.data.results || stagesRes.data || []);
            setRecruitments(recruitmentsRes.data.results || recruitmentsRes.data || []);
            setEmployees(employeesRes.data.results || employeesRes.data || []);
        } catch (error) {
            console.error("Error fetching stages:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleMultiSelectChange = (e, field) => {
        const options = e.target.options;
        const value = [];
        for (let i = 0, l = options.length; i < l; i++) {
            if (options[i].selected) {
                value.push(options[i].value);
            }
        }
        setFormData({ ...formData, [field]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.put(`/recruitment/stages/${editingId}/`, formData);
            } else {
                await api.post('/recruitment/stages/', formData);
            }
            setIsModalOpen(false);
            setFormData({ stage: '', stage_type: 'interview', recruitment_id: '', sequence: 0, stage_managers: [] });
            setEditingId(null);
            fetchData();
        } catch (error) {
            alert("Error saving stage");
        }
    };

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading stages...</div>;

    return (
        <div style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b' }}>Recruitment Stages</h2>
                    <p style={{ color: '#64748b', marginTop: '0.25rem' }}>Configure hiring pipelines and candidate flow</p>
                </div>
                <button
                    onClick={() => { setEditingId(null); setFormData({ stage: '', stage_type: 'interview', recruitment_id: '', sequence: 0, stage_managers: [] }); setIsModalOpen(true); }}
                    className="btn btn-primary"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    <FaPlus /> Add Stage
                </button>
            </div>

            <div style={{ backgroundColor: '#fff', borderRadius: '24px', border: '1px solid #eef2f6', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #eef2f6' }}>
                            <th style={{ padding: '1.25rem', textAlign: 'left', color: '#64748b', fontWeight: 600 }}>Sequence</th>
                            <th style={{ padding: '1.25rem', textAlign: 'left', color: '#64748b', fontWeight: 600 }}>Stage Name</th>
                            <th style={{ padding: '1.25rem', textAlign: 'left', color: '#64748b', fontWeight: 600 }}>Type</th>
                            <th style={{ padding: '1.25rem', textAlign: 'left', color: '#64748b', fontWeight: 600 }}>Recruitment</th>
                            <th style={{ padding: '1.25rem', textAlign: 'right', color: '#64748b', fontWeight: 600 }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stages.map((s) => (
                            <tr key={s.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '1.25rem' }}><span style={{ backgroundColor: '#f1f5f9', padding: '0.25rem 0.6rem', borderRadius: '6px', fontWeight: 600 }}>{s.sequence}</span></td>
                                <td style={{ padding: '1.25rem', fontWeight: 600 }}>{s.stage}</td>
                                <td style={{ padding: '1.25rem' }}>
                                    <span style={{
                                        padding: '0.25rem 0.6rem',
                                        borderRadius: '6px',
                                        backgroundColor: '#eff6ff',
                                        color: '#3b82f6',
                                        fontSize: '0.75rem',
                                        fontWeight: 700,
                                        textTransform: 'uppercase'
                                    }}>
                                        {s.stage_type}
                                    </span>
                                </td>
                                <td style={{ padding: '1.25rem', color: '#64748b' }}>{recruitments.find(r => r.id === s.recruitment_id)?.title || s.recruitment_id}</td>
                                <td style={{ padding: '1.25rem', textAlign: 'right' }}>
                                    <button onClick={() => { setEditingId(s.id); setFormData(s); setIsModalOpen(true); }} style={{ border: 'none', background: 'none', color: 'var(--primary-color)', cursor: 'pointer', marginRight: '1rem' }}><FaEdit /></button>
                                    <button style={{ border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer' }}><FaTrash /></button>
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
                            style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '24px', width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}
                        >
                            <h3 style={{ marginBottom: '1.5rem' }}>{editingId ? 'Edit Stage' : 'Add Pipeline Stage'}</h3>
                            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Stage Name</label>
                                    <input value={formData.stage} onChange={e => setFormData({ ...formData, stage: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #d1d5db' }} required />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Sequence</label>
                                        <input type="number" value={formData.sequence} onChange={e => setFormData({ ...formData, sequence: parseInt(e.target.value) })} style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #d1d5db' }} required />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Type</label>
                                        <select value={formData.stage_type} onChange={e => setFormData({ ...formData, stage_type: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #d1d5db' }} required>
                                            <option value="initial">Initial</option>
                                            <option value="applied">Applied</option>
                                            <option value="test">Test</option>
                                            <option value="interview">Interview</option>
                                            <option value="cancelled">Cancelled</option>
                                            <option value="hired">Hired</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Recruitment</label>
                                    <select value={formData.recruitment_id} onChange={e => setFormData({ ...formData, recruitment_id: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #d1d5db' }} required>
                                        <option value="">Select...</option>
                                        {recruitments.map(r => <option key={r.id} value={r.id}>{r.title}</option>)}
                                    </select>
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Stage Managers</label>
                                    <select multiple value={formData.stage_managers} onChange={(e) => handleMultiSelectChange(e, 'stage_managers')} style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', border: '1px solid #d1d5db', height: '100px' }}>
                                        {employees.map(e => <option key={e.id} value={e.id}>{e.employee_first_name} {e.employee_last_name}</option>)}
                                    </select>
                                    <small style={{ color: '#64748b' }}>Hold Ctrl/Cmd to select multiple</small>
                                </div>

                                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                                    <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '0.75rem 1.5rem', borderRadius: '10px', border: '1px solid #d1d5db', background: '#fff' }}>Cancel</button>
                                    <button type="submit" className="btn btn-primary">Save Changes</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default PipelineStages;
