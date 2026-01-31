import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { motion } from 'framer-motion';
import { FaUsers, FaBriefcase, FaLayerGroup, FaUserCheck, FaClock } from 'react-icons/fa';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';

const RecruitmentOverview = () => {
    const [stats, setStats] = useState({
        totalJobs: 0,
        totalCandidates: 0,
        activeStages: 0,
        hiredThisMonth: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [jobsRes, candidatesRes, stagesRes] = await Promise.all([
                    api.get('/recruitment/recruitments/'),
                    api.get('/recruitment/candidates/'),
                    api.get('/recruitment/stages/')
                ]);

                setStats({
                    totalJobs: jobsRes.data.count || 0,
                    totalCandidates: candidatesRes.data.count || 0,
                    activeStages: stagesRes.data.count || 0,
                    hiredThisMonth: 2 // Mocked as usually would need filtered query
                });
            } catch (error) {
                console.error("Error fetching recruitment stats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const pipelineData = [
        { name: 'Applied', value: stats.totalCandidates },
        { name: 'Screening', value: Math.floor(stats.totalCandidates * 0.6) },
        { name: 'Interview', value: Math.floor(stats.totalCandidates * 0.3) },
        { name: 'Offered', value: Math.floor(stats.totalCandidates * 0.1) },
        { name: 'Hired', value: stats.hiredThisMonth },
    ];

    const COLORS = ['#4f46e5', '#818cf8', '#6366f1', '#a5b4fc', '#c7d2fe'];

    const summaryCards = [
        { label: 'Active Openings', value: stats.totalJobs, icon: <FaBriefcase />, color: '#4f46e5' },
        { label: 'Total Candidates', value: stats.totalCandidates, icon: <FaUsers />, color: '#10b981' },
        { label: 'Pipeline Stages', value: stats.activeStages, icon: <FaLayerGroup />, color: '#f59e0b' },
        { label: 'Hired (Monthly)', value: stats.hiredThisMonth, icon: <FaUserCheck />, color: '#ef4444' },
    ];

    return (
        <div style={{ paddingBottom: '2rem' }}>
            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
                {summaryCards.map((card, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        style={{
                            backgroundColor: '#fff',
                            padding: '1.5rem',
                            borderRadius: '16px',
                            border: '1px solid #eef2f6',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.02)'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '10px',
                                backgroundColor: `${card.color}15`,
                                color: card.color,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.2rem'
                            }}>
                                {card.icon}
                            </div>
                            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#64748b' }}>{card.label}</span>
                        </div>
                        <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1e293b' }}>{card.value}</div>
                    </motion.div>
                ))}
            </div>

            {/* Content Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
                {/* Pipeline Funnel Bar Chart */}
                <div style={{
                    backgroundColor: '#fff',
                    padding: '1.5rem',
                    borderRadius: '16px',
                    border: '1px solid #eef2f6',
                    height: '400px'
                }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem' }}>Recruitment Pipeline Funnel</h3>
                    <div style={{ height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={pipelineData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} fontSize={12} width={80} />
                                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={32}>
                                    {pipelineData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Status Breakdown */}
                <div style={{
                    backgroundColor: '#fff',
                    padding: '1.5rem',
                    borderRadius: '16px',
                    border: '1px solid #eef2f6'
                }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem' }}>Candidate Distribution</h3>
                    <div style={{ height: '250px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pipelineData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pipelineData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
                        {pipelineData.map((item, idx) => (
                            <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: COLORS[idx] }} />
                                    <span style={{ fontSize: '0.85rem', color: '#64748b' }}>{item.name}</span>
                                </div>
                                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{item.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Row - Activity Feed */}
            <div style={{ marginTop: '1.5rem', backgroundColor: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #eef2f6' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Recent Activity</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {[
                        { text: "New candidate applied for Senior React Developer", time: "2 hours ago", type: "application" },
                        { text: "Interview scheduled for UI/UX Designer role", time: "5 hours ago", type: "interview" },
                        { text: "Recruitment stage 'Technical Round' updated", time: "Yesterday", type: "stage" }
                    ].map((activity, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem', borderRadius: '12px', backgroundColor: '#f8fafc' }}>
                            <div style={{ color: '#4f46e5' }}><FaClock /></div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '0.9rem', color: '#1e293b', fontWeight: 500 }}>{activity.text}</div>
                                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{activity.time}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RecruitmentOverview;
