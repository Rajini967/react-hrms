import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaMapMarkerAlt, FaBriefcase, FaUsers, FaCalendarAlt, FaEdit, FaTrash } from 'react-icons/fa';

const JobOpenings = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Updated Form Data Structure
    const [formData, setFormData] = useState({
        title: '',
        vacancy: 0,
        description: '',
        company_id: '',
        start_date: '',
        end_date: '',
        job_position_id: '',
        is_event_based: false,
        recruitment_managers: [],
        skills: [],
        survey_templates: [],
        optional_profile_image: false,
        optional_resume: false
    });

    // Choices state
    const [companies, setCompanies] = useState([]);
    const [jobPositions, setJobPositions] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [skills, setSkills] = useState([]);
    const [surveyTemplates, setSurveyTemplates] = useState([]);

    const [editingId, setEditingId] = useState(null);

    const fetchData = async () => {
        try {
            const [jobsRes, companiesRes, jobPositionsRes, employeesRes, skillsRes, surveyTemplatesRes] = await Promise.all([
                api.get('/recruitment/recruitments/'),
                api.get('/base/companies/'),
                api.get('/base/job-positions/'),
                api.get('/employee/employees/'),
                api.get('/recruitment/skills/'),
                api.get('/recruitment/survey-templates/'),
            ]);

            setJobs(jobsRes.data.results || jobsRes.data || []);
            setCompanies(companiesRes.data.results || companiesRes.data || []);
            setJobPositions(jobPositionsRes.data.results || jobPositionsRes.data || []);
            setEmployees(employeesRes.data.results || employeesRes.data || []);
            setSkills(skillsRes.data.results || skillsRes.data || []);
            setSurveyTemplates(surveyTemplatesRes.data.results || surveyTemplatesRes.data || []);

        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const resetForm = () => {
        setFormData({
            title: '',
            vacancy: 0,
            description: '',
            company_id: '',
            start_date: '',
            end_date: '',
            job_position_id: '',
            is_event_based: false,
            recruitment_managers: [],
            skills: [],
            survey_templates: [],
            optional_profile_image: false,
            optional_resume: false
        });
        setEditingId(null);
    };

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
                await api.put(`/recruitment/recruitments/${editingId}/`, formData);
            } else {
                await api.post('/recruitment/recruitments/', formData);
            }
            setIsModalOpen(false);
            resetForm();
            fetchData();
        } catch (error) {
            console.error("Error saving job:", error);
            alert("Error saving job. Please check all required fields.");
        }
    };

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading job vacancies...</div>;

    return (
        <div style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b' }}>Job Openings</h2>
                    <p style={{ color: '#64748b', marginTop: '0.25rem' }}>Manage active recruitment drives and vacancies</p>
                </div>
                <button
                    onClick={() => { resetForm(); setIsModalOpen(true); }}
                    className="btn btn-primary"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    <FaPlus /> Post New Job
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
                {jobs.map((job) => (
                    <motion.div
                        key={job.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                            backgroundColor: '#fff',
                            borderRadius: '24px',
                            padding: '1.5rem',
                            border: '1px solid #eef2f6',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem'
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{
                                padding: '0.75rem',
                                backgroundColor: 'rgba(79, 70, 229, 0.1)',
                                color: 'var(--primary-color)',
                                borderRadius: '14px'
                            }}>
                                <FaBriefcase size={20} />
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button onClick={() => { setEditingId(job.id); setFormData(job); setIsModalOpen(true); }} style={{ border: 'none', background: 'none', color: '#64748b', cursor: 'pointer' }}><FaEdit /></button>
                                <button style={{ border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer' }}><FaTrash /></button>
                            </div>
                        </div>

                        <div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.5rem' }}>{job.title || job.job_position_name}</h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', color: '#64748b', fontSize: '0.875rem' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><FaMapMarkerAlt /> {companies.find(c => c.id === job.company_id)?.company || 'Remote'}</span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><FaUsers /> {job.vacancy} Openings</span>
                            </div>
                        </div>

                        <div style={{
                            backgroundColor: '#f8fafc',
                            padding: '1rem',
                            borderRadius: '16px',
                            fontSize: '0.85rem',
                            color: '#475569',
                            lineHeight: 1.5,
                            minHeight: '80px',
                            overflow: 'hidden',
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical'
                        }}>
                            {job.description || "No description provided."}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: '#94a3b8' }}>
                                <FaCalendarAlt /> Expires: {job.end_date || 'N/A'}
                            </div>
                            <button style={{
                                padding: '0.5rem 1rem',
                                borderRadius: '10px',
                                border: '1px solid var(--primary-color)',
                                color: 'var(--primary-color)',
                                background: 'none',
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                cursor: 'pointer'
                            }}>
                                View Applicants
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
                            style={{ backgroundColor: '#fff', padding: '2.5rem', borderRadius: '28px', width: '100%', maxWidth: '900px', maxHeight: '90vh', overflowY: 'auto' }}
                        >
                            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 800 }}>{editingId ? 'Update Job Posting' : 'Post New Vacancy'}</h3>
                            <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <div style={{ gridColumn: 'span 2' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Recruitment Title</label>
                                    <input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', border: '1px solid #d1d5db' }} placeholder="E.g. Summer Internship Drive 2024" required />
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Job Position</label>
                                    <select value={formData.job_position_id} onChange={e => setFormData({ ...formData, job_position_id: e.target.value })} style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', border: '1px solid #d1d5db' }} required={!formData.is_event_based}>
                                        <option value="">Select Job Position...</option>
                                        {jobPositions.map(j => <option key={j.id} value={j.id}>{j.job_position}</option>)}
                                    </select>
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Company</label>
                                    <select value={formData.company_id} onChange={e => setFormData({ ...formData, company_id: e.target.value })} style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', border: '1px solid #d1d5db' }} required>
                                        <option value="">Select Company...</option>
                                        {companies.map(c => <option key={c.id} value={c.id}>{c.company}</option>)}
                                    </select>
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Vacancy Count</label>
                                    <input type="number" value={formData.vacancy} onChange={e => setFormData({ ...formData, vacancy: parseInt(e.target.value) })} style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', border: '1px solid #d1d5db' }} required />
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1.5rem' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                        <input type="checkbox" checked={formData.is_event_based} onChange={e => setFormData({ ...formData, is_event_based: e.target.checked })} />
                                        Event Based Recruitment
                                    </label>
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Start Date</label>
                                    <input type="date" value={formData.start_date} onChange={e => setFormData({ ...formData, start_date: e.target.value })} style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', border: '1px solid #d1d5db' }} required />
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>End Date</label>
                                    <input type="date" value={formData.end_date} onChange={e => setFormData({ ...formData, end_date: e.target.value })} style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', border: '1px solid #d1d5db' }} />
                                </div>

                                <div style={{ gridColumn: 'span 2' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Recruitment Managers</label>
                                    <select multiple value={formData.recruitment_managers} onChange={(e) => handleMultiSelectChange(e, 'recruitment_managers')} style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', border: '1px solid #d1d5db', height: '100px' }}>
                                        {employees.map(e => <option key={e.id} value={e.id}>{e.employee_first_name} {e.employee_last_name}</option>)}
                                    </select>
                                    <small style={{ color: '#64748b' }}>Hold Ctrl/Cmd to select multiple</small>
                                </div>

                                <div style={{ gridColumn: 'span 2' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Required Skills</label>
                                    <select multiple value={formData.skills} onChange={(e) => handleMultiSelectChange(e, 'skills')} style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', border: '1px solid #d1d5db', height: '100px' }}>
                                        {skills.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                                    </select>
                                </div>

                                <div style={{ gridColumn: 'span 2' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Survey Templates</label>
                                    <select multiple value={formData.survey_templates} onChange={(e) => handleMultiSelectChange(e, 'survey_templates')} style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', border: '1px solid #d1d5db', height: '100px' }}>
                                        {surveyTemplates.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
                                    </select>
                                </div>

                                <div style={{ display: 'flex', gap: '2rem', gridColumn: 'span 2' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                        <input type="checkbox" checked={formData.optional_profile_image} onChange={e => setFormData({ ...formData, optional_profile_image: e.target.checked })} />
                                        Optional Profile Image
                                    </label>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                        <input type="checkbox" checked={formData.optional_resume} onChange={e => setFormData({ ...formData, optional_resume: e.target.checked })} />
                                        Optional Resume
                                    </label>
                                </div>

                                <div style={{ gridColumn: 'span 2' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Description</label>
                                    <textarea rows={4} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', border: '1px solid #d1d5db', resize: 'none' }} />
                                </div>

                                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1rem', gridColumn: 'span 2' }}>
                                    <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '0.85rem 1.75rem', borderRadius: '14px', border: '1px solid #d1d5db', background: '#fff', fontWeight: 600 }}>Cancel</button>
                                    <button type="submit" className="btn btn-primary" style={{ padding: '0.85rem 1.75rem' }}>{editingId ? 'Update Posting' : 'Publish Job'}</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default JobOpenings;
