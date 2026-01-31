import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserCircle, FaEnvelope, FaPhone, FaFilePdf, FaEllipsisV, FaPlus, FaBriefcase, FaUserTie } from 'react-icons/fa';

const CandidateTracking = () => {
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        gender: 'male',
        dob: '',
        address: '',
        country: '',
        state: '',
        city: '',
        zip: '',
        recruitment_id: '',
        job_position_id: '',
        stage_id: '',
        source: 'application',
        portfolio: '', // Added portfolio as per model
        referral: '',
        // File uploads (handled separately usually but we'll try basic input)
        resume: null,
        profile: null,
    });

    // Choices
    const [recruitments, setRecruitments] = useState([]);
    const [jobPositions, setJobPositions] = useState([]);
    const [stages, setStages] = useState([]);
    const [employees, setEmployees] = useState([]); // For referrals

    const fetchData = async () => {
        try {
            const [candidatesRes, recruitmentsRes, jobsRes, stagesRes, employeesRes] = await Promise.all([
                api.get('/recruitment/candidates/'),
                api.get('/recruitment/recruitments/'),
                api.get('/base/job-positions/'),
                api.get('/recruitment/stages/'),
                api.get('/employee/employees/'),
            ]);
            setCandidates(candidatesRes.data.results || candidatesRes.data || []);
            setRecruitments(recruitmentsRes.data.results || recruitmentsRes.data || []);
            setJobPositions(jobsRes.data.results || jobsRes.data || []);
            setStages(stagesRes.data.results || stagesRes.data || []);
            setEmployees(employeesRes.data.results || employeesRes.data || []);
        } catch (error) {
            console.error("Error fetching candidates:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const resetForm = () => {
        setFormData({
            name: '',
            email: '',
            mobile: '',
            gender: 'male',
            dob: '',
            address: '',
            country: '',
            state: '',
            city: '',
            zip: '',
            recruitment_id: '',
            job_position_id: '',
            stage_id: '',
            source: 'application',
            portfolio: '',
            referral: '',
            resume: null,
            profile: null,
        });
        setEditingId(null);
    };

    const handleFileChange = (e, field) => {
        setFormData({ ...formData, [field]: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(formData).forEach(key => {
            if (formData[key] !== null) {
                // Determine if we need to append file or string
                if (key === 'resume' || key === 'profile') {
                    if (formData[key] instanceof File) {
                        data.append(key, formData[key]);
                    }
                } else {
                    data.append(key, formData[key]);
                }
            }
        });

        try {
            if (editingId) {
                await api.put(`/recruitment/candidates/${editingId}/`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await api.post('/recruitment/candidates/', data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
            setIsModalOpen(false);
            resetForm();
            fetchData();
        } catch (error) {
            console.error("Error saving candidate:", error);
            alert("Error saving candidate.");
        }
    };

    // Filter stages based on selected recruitment if needed, but for now showing all or filtering purely in UI logic could be complex without backend logic. 
    // We will just show all stages or maybe filter if recruitment_id is selected.
    const availableStages = formData.recruitment_id
        ? stages.filter(s => s.recruitment_id === parseInt(formData.recruitment_id))
        : stages;

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading applicants...</div>;

    return (
        <div style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b' }}>Candidate Tracking</h2>
                    <p style={{ color: '#64748b', marginTop: '0.25rem' }}>Monitor applicant progress and manage hiring pipeline</p>
                </div>
                <button
                    onClick={() => { resetForm(); setIsModalOpen(true); }}
                    className="btn btn-primary"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    <FaPlus /> Add Candidate
                </button>
            </div>

            <div style={{ backgroundColor: '#fff', borderRadius: '24px', border: '1px solid #eef2f6', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #eef2f6' }}>
                            <th style={{ padding: '1.25rem', textAlign: 'left', color: '#64748b', fontWeight: 600 }}>Candidate</th>
                            <th style={{ padding: '1.25rem', textAlign: 'left', color: '#64748b', fontWeight: 600 }}>Contact info</th>
                            <th style={{ padding: '1.25rem', textAlign: 'left', color: '#64748b', fontWeight: 600 }}>Applied For</th>
                            <th style={{ padding: '1.25rem', textAlign: 'left', color: '#64748b', fontWeight: 600 }}>Current Stage</th>
                            <th style={{ padding: '1.25rem', textAlign: 'left', color: '#64748b', fontWeight: 600 }}>Documents</th>
                        </tr>
                    </thead>
                    <tbody>
                        {candidates.map((c, idx) => (
                            <motion.tr
                                key={c.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: idx * 0.05 }}
                                style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer' }}
                                onClick={() => {
                                    setEditingId(c.id);
                                    // Populate form data sans files
                                    const { resume, profile, ...rest } = c;
                                    setFormData({ ...formData, ...rest, resume: null, profile: null });
                                    setIsModalOpen(true);
                                }}
                            >
                                <td style={{ padding: '1.25rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-color)', overflow: 'hidden' }}>
                                            {c.profile ? <img src={c.profile} alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <FaUserCircle size={24} />}
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 600, color: '#1e293b' }}>{c.name}</div>
                                            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>ID: {c.id}</div>
                                        </div>
                                    </div>
                                </td>
                                <td style={{ padding: '1.25rem' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.875rem' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#475569' }}><FaEnvelope size={12} color="#94a3b8" /> {c.email}</span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#475569' }}><FaPhone size={12} color="#94a3b8" /> {c.mobile || 'N/A'}</span>
                                    </div>
                                </td>
                                <td style={{ padding: '1.25rem' }}>
                                    <div style={{ fontSize: '0.875rem', color: '#475569' }}>
                                        <div style={{ fontWeight: 600 }}>{c.job_position_title || 'Unknown Position'}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{c.recruitment_title || 'Direct Application'}</div>
                                    </div>
                                </td>
                                <td style={{ padding: '1.25rem' }}>
                                    <span style={{
                                        padding: '0.35rem 0.75rem',
                                        borderRadius: '20px',
                                        backgroundColor: 'rgba(7, 190, 184, 0.1)',
                                        color: '#07beb8',
                                        fontSize: '0.75rem',
                                        fontWeight: 700,
                                        textTransform: 'uppercase'
                                    }}>
                                        {c.stage_title || 'Applied'}
                                    </span>
                                </td>
                                <td style={{ padding: '1.25rem' }} onClick={(e) => e.stopPropagation()}>
                                    {c.resume ? (
                                        <a href={c.resume} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-color)', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500 }}>
                                            <FaFilePdf /> Resume
                                        </a>
                                    ) : <span style={{ color: '#cbd5e1', fontSize: '0.875rem' }}>No Resume</span>}
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
                {candidates.length === 0 && (
                    <div style={{ padding: '4rem', textAlign: 'center', color: '#94a3b8' }}>
                        No candidates have applied for active positions yet.
                    </div>
                )}
            </div>

            <AnimatePresence>
                {isModalOpen && (
                    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            style={{ backgroundColor: '#fff', padding: '2.5rem', borderRadius: '28px', width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto' }}
                        >
                            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 800 }}>{editingId ? 'Edit Candidate' : 'Add New Candidate'}</h3>
                            <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>

                                {/* Personal Details */}
                                <div style={{ gridColumn: 'span 2' }}><h4 style={{ fontSize: '1rem', color: '#64748b' }}>Personal Information</h4></div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Full Name</label>
                                    <input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', border: '1px solid #d1d5db' }} required />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Email</label>
                                    <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', border: '1px solid #d1d5db' }} required />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Mobile</label>
                                    <input value={formData.mobile} onChange={e => setFormData({ ...formData, mobile: e.target.value })} style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', border: '1px solid #d1d5db' }} required />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Gender</label>
                                    <select value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value })} style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', border: '1px solid #d1d5db' }}>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                {/* Address */}
                                <div style={{ gridColumn: 'span 2' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Address</label>
                                    <textarea rows={2} value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', border: '1px solid #d1d5db', resize: 'none' }} />
                                </div>

                                {/* Application Details */}
                                <div style={{ gridColumn: 'span 2', marginTop: '1rem' }}><h4 style={{ fontSize: '1rem', color: '#64748b' }}>Application Details</h4></div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Recruitment Drive</label>
                                    <select value={formData.recruitment_id} onChange={e => setFormData({ ...formData, recruitment_id: e.target.value })} style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', border: '1px solid #d1d5db' }} required>
                                        <option value="">Select Recruitment...</option>
                                        {recruitments.map(r => <option key={r.id} value={r.id}>{r.title}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Job Position</label>
                                    <select value={formData.job_position_id} onChange={e => setFormData({ ...formData, job_position_id: e.target.value })} style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', border: '1px solid #d1d5db' }} required>
                                        <option value="">Select Position...</option>
                                        {jobPositions.map(j => <option key={j.id} value={j.id}>{j.job_position}</option>)}
                                    </select>
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Stage</label>
                                    <select value={formData.stage_id} onChange={e => setFormData({ ...formData, stage_id: e.target.value })} style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', border: '1px solid #d1d5db' }}>
                                        <option value="">Select Stage...</option>
                                        {availableStages.map(s => <option key={s.id} value={s.id}>{s.stage}</option>)}
                                    </select>
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Source</label>
                                    <select value={formData.source} onChange={e => setFormData({ ...formData, source: e.target.value })} style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', border: '1px solid #d1d5db' }}>
                                        <option value="application">Application Form</option>
                                        <option value="software">Inside Software</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                {/* Files */}
                                <div style={{ gridColumn: 'span 2', marginTop: '1rem' }}><h4 style={{ fontSize: '1rem', color: '#64748b' }}>Documents</h4></div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Resume (PDF)</label>
                                    <input type="file" accept=".pdf" onChange={e => handleFileChange(e, 'resume')} style={{ width: '100%', padding: '0.5rem', borderRadius: '12px', border: '1px solid #d1d5db' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Profile Image</label>
                                    <input type="file" accept="image/*" onChange={e => handleFileChange(e, 'profile')} style={{ width: '100%', padding: '0.5rem', borderRadius: '12px', border: '1px solid #d1d5db' }} />
                                </div>

                                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem', gridColumn: 'span 2' }}>
                                    <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '0.85rem 1.75rem', borderRadius: '14px', border: '1px solid #d1d5db', background: '#fff', fontWeight: 600 }}>Cancel</button>
                                    <button type="submit" className="btn btn-primary" style={{ padding: '0.85rem 1.75rem' }}>{editingId ? 'Update Candidate' : 'Add Candidate'}</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CandidateTracking;
