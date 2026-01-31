import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaTrash, FaEdit, FaLayerGroup, FaCheckCircle } from 'react-icons/fa';

const OnboardingStages = () => {
    const [stages, setStages] = useState([]);
    const [recruitments, setRecruitments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ stage_title: '', recruitment_id: '', sequence: 0, is_final_stage: false });
    const [editingId, setEditingId] = useState(null);

    const fetchData = async () => {
        try {
            const [stagesRes, recruitmentsRes] = await Promise.all([
                api.get('/onboarding/stages/'),
                api.get('/recruitment/recruitments/')
            ]);
            setStages(stagesRes.data.results || stagesRes.data || []);
            setRecruitments(recruitmentsRes.data.results || recruitmentsRes.data || []);
        } catch (error) {
            console.error("Error fetching onboarding stages:", error);
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
                await api.put(`/onboarding/stages/${editingId}/`, formData);
            } else {
                await api.post('/onboarding/stages/', formData);
            }
            setIsModalOpen(false);
            setFormData({ stage_title: '', recruitment_id: '', sequence: 0, is_final_stage: false });
            setEditingId(null);
            fetchData();
        } catch (error) {
            alert("Error saving stage");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this stage?")) {
            try {
                await api.delete(`/onboarding/stages/${id}/`);
                fetchData();
            } catch (error) {
                alert("Error deleting stage");
            }
        }
    };

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading stages...</div>;

    return (
        <div style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b' }}>Onboarding Stages</h2>
                    <p style={{ color: '#64748b', marginTop: '0.25rem' }}>Configure the workflow steps for corporate onboarding</p>
                </div>
                <button
                    onClick={() => { setEditingId(null); setFormData({ stage_title: '', recruitment_id: '', sequence: 0, is_final_stage: false }); setIsModalOpen(true); }}
                    className="btn btn-primary"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    <FaPlus /> Add Stage
                </button>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
                {stages.map((stage, idx) => (
                    <motion.div
                        key={stage.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        style={{
                            backgroundColor: '#fff',
                            padding: '1.5rem',
                            borderRadius: '20px',
                            border: '1px solid #eef2f6',
                            minWidth: '280px',
                            flex: '1 1 280px',
                            position: 'relative',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.02)'
                        }}
                    >
                        <div style={{ position: 'absolute', top: '-10px', left: '1.5rem', backgroundColor: 'var(--primary-color)', color: '#fff', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, border: '2px solid #fff' }}>
                            {stage.sequence}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                            <div>
                                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.25rem' }}>{stage.stage_title}</h3>
                                <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Recruitment: {stage.recruitment_title || 'N/A'}</p>
                            </div>
                            {stage.is_final_stage && <FaCheckCircle color="#10b981" title="Final Stage" />}
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #f8fafc' }}>
                            <button
                                onClick={() => {
                                    setEditingId(stage.id);
                                    setFormData({
                                        stage_title: stage.stage_title,
                                        recruitment_id: stage.recruitment_id,
                                        sequence: stage.sequence,
                                        is_final_stage: stage.is_final_stage
                                    });
                                    setIsModalOpen(true);
                                }}
                                style={{ flex: 1, padding: '0.5rem', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff', color: '#64748b', cursor: 'pointer', fontSize: '0.875rem' }}
                            >
                                <FaEdit /> Edit
                            </button>
                            <button
                                onClick={() => handleDelete(stage.id)}
                                style={{ flex: 1, padding: '0.5rem', borderRadius: '8px', border: '1px solid #fee2e2', background: '#fffcfc', color: '#ef4444', cursor: 'pointer', fontSize: '0.875rem' }}
                            >
                                <FaTrash /> Delete
                            </button>
                        </div>
                    </motion.div>
                ))}
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
                            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>{editingId ? 'Edit Stage' : 'Add New Stage'}</h3>
                            <form onSubmit={handleSubmit}>
                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#475569' }}>Stage Title</label>
                                    <input
                                        type="text"
                                        value={formData.stage_title}
                                        onChange={(e) => setFormData({ ...formData, stage_title: e.target.value })}
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #d1d5db' }}
                                        required
                                    />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#475569' }}>Sequence</label>
                                        <input
                                            type="number"
                                            value={formData.sequence}
                                            onChange={(e) => setFormData({ ...formData, sequence: parseInt(e.target.value) })}
                                            style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #d1d5db' }}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#475569' }}>Recruitment</label>
                                        <select
                                            value={formData.recruitment_id}
                                            onChange={(e) => setFormData({ ...formData, recruitment_id: e.target.value })}
                                            style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #d1d5db' }}
                                            required
                                        >
                                            <option value="">Select...</option>
                                            {recruitments.map(r => <option key={r.id} value={r.id}>{r.title}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <input
                                        type="checkbox"
                                        id="isFinal"
                                        checked={formData.is_final_stage}
                                        onChange={(e) => setFormData({ ...formData, is_final_stage: e.target.checked })}
                                    />
                                    <label htmlFor="isFinal" style={{ fontWeight: 600, color: '#475569' }}>Is Final Stage?</label>
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                                    <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '0.75rem 1.5rem', borderRadius: '10px', border: '1px solid #d1d5db', background: '#fff' }}>Cancel</button>
                                    <button type="submit" className="btn btn-primary">{editingId ? 'Update' : 'Create'} Stage</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default OnboardingStages;
