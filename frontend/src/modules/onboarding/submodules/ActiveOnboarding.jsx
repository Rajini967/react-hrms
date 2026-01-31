import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { motion } from 'framer-motion';
import { FaUserCircle, FaTasks, FaChevronRight, FaCalendarAlt } from 'react-icons/fa';

const ActiveOnboarding = () => {
    const [candidateStages, setCandidateStages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchActiveOnboarding = async () => {
            try {
                const response = await api.get('/onboarding/candidate-stages/');
                setCandidateStages(response.data.results || response.data || []);
            } catch (error) {
                console.error("Error fetching active onboarding:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchActiveOnboarding();
    }, []);

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>Loading active onboardings...</div>;

    return (
        <div style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b' }}>Active Onboarding</h2>
                    <p style={{ color: '#64748b', marginTop: '0.25rem' }}>Track progress of new hires joining the team</p>
                </div>
                <button className="btn btn-primary">Initial Portals</button>
            </div>

            <div style={{ display: 'grid', gap: '1rem' }}>
                {candidateStages.length > 0 ? (
                    candidateStages.map((cs) => (
                        <motion.div
                            key={cs.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            whileHover={{ scale: 1.005, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                            style={{
                                backgroundColor: '#fff',
                                padding: '1.25rem',
                                borderRadius: '16px',
                                border: '1px solid #eef2f6',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '12px',
                                    backgroundColor: '#f1f5f9',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'var(--primary-color)',
                                    fontSize: '1.5rem'
                                }}>
                                    <FaUserCircle />
                                </div>
                                <div>
                                    <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600, color: '#1e293b' }}>{cs.candidate_name}</h4>
                                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.25rem', fontSize: '0.85rem', color: '#64748b' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                            <FaCalendarAlt size={12} /> Target: {cs.onboarding_end_date || 'N/A'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
                                <div style={{ textAlign: 'right' }}>
                                    <span style={{
                                        padding: '0.4rem 0.8rem',
                                        borderRadius: '20px',
                                        backgroundColor: 'rgba(79, 70, 229, 0.1)',
                                        color: 'var(--primary-color)',
                                        fontSize: '0.75rem',
                                        fontWeight: 700,
                                        textTransform: 'uppercase'
                                    }}>
                                        {cs.stage_title}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: '120px' }}>
                                    <div style={{ flex: 1, height: '6px', backgroundColor: '#f1f5f9', borderRadius: '3px', position: 'relative' }}>
                                        <div style={{
                                            position: 'absolute',
                                            left: 0,
                                            top: 0,
                                            height: '100%',
                                            width: '45%',
                                            backgroundColor: 'var(--primary-color)',
                                            borderRadius: '3px'
                                        }} />
                                    </div>
                                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>45%</span>
                                </div>
                                <FaChevronRight color="#94a3b8" />
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div style={{ padding: '4rem', textAlign: 'center', backgroundColor: '#fff', borderRadius: '16px', border: '1px dashed #e2e8f0' }}>
                        <p style={{ color: '#64748b' }}>No active onboardings found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ActiveOnboarding;
