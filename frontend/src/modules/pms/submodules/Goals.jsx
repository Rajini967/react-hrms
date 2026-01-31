import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { motion } from 'framer-motion';
import { FaBullseye, FaChartBar, FaUserCircle, FaPlus } from 'react-icons/fa';

const Goals = () => {
    const [objectives, setObjectives] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchObjectives = async () => {
            try {
                const response = await api.get('/pms/objectives/');
                setObjectives(response.data.results || response.data || []);
            } catch (error) {
                console.error("Error fetching objectives:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchObjectives();
    }, []);

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading objectives...</div>;

    return (
        <div style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b' }}>Company Goals & OKRs</h2>
                    <p style={{ color: '#64748b', marginTop: '0.25rem' }}>Track organizational objectives and key results</p>
                </div>
                <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FaPlus /> Create Objective
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
                {objectives.map((obj, idx) => (
                    <motion.div
                        key={obj.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        style={{
                            backgroundColor: '#fff',
                            borderRadius: '24px',
                            padding: '1.75rem',
                            border: '1px solid #eef2f6',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.02)'
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '12px',
                                    backgroundColor: 'rgba(79, 70, 229, 0.1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'var(--primary-color)'
                                }}>
                                    <FaBullseye size={20} />
                                </div>
                                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Objective</span>
                            </div>
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10b981', backgroundColor: '#ecfdf5', padding: '0.25rem 0.6rem', borderRadius: '6px' }}>On Track</span>
                        </div>

                        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.75rem' }}>{obj.title}</h3>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>
                                <span>Completion</span>
                                <span style={{ fontWeight: 600, color: '#1e293b' }}>65%</span>
                            </div>
                            <div style={{ height: '8px', backgroundColor: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: '65%', backgroundColor: 'var(--primary-color)', borderRadius: '4px' }} />
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingTop: '1.25rem', borderTop: '1px solid #f8fafc' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
                                <FaUserCircle color="#cbd5e1" />
                                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Assigned to: Team Marketing</span>
                            </div>
                            <button style={{ border: 'none', background: 'none', color: 'var(--primary-color)', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' }}>Details</button>
                        </div>
                    </motion.div>
                ))}
            </div>
            {objectives.length === 0 && (
                <div style={{ padding: '4rem', textAlign: 'center', backgroundColor: '#fff', borderRadius: '24px', border: '1px dashed #e2e8f0' }}>
                    <p style={{ color: '#94a3b8' }}>No objectives defined yet.</p>
                </div>
            )}
        </div>
    );
};

export default Goals;
