import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { FaPlus } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const JobSettings = ({ defaultTab = 'position' }) => {
    const [positions, setPositions] = useState([]);
    const [roles, setRoles] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeSubTab, setActiveSubTab] = useState(defaultTab);

    // Position Modal
    const [isPosModalOpen, setIsPosModalOpen] = useState(false);
    const [posFormData, setPosFormData] = useState({
        job_position: '', department_id: '', company_id: []
    });
    const [editingPosId, setEditingPosId] = useState(null);

    // Role Modal
    const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
    const [roleFormData, setRoleFormData] = useState({
        job_role: '', job_position_id: '', company_id: []
    });
    const [editingRoleId, setEditingRoleId] = useState(null);

    const fetchData = async () => {
        try {
            const [posRes, roleRes, deptRes, compRes] = await Promise.all([
                api.get('/base/job-positions/'),
                api.get('/base/job-roles/'),
                api.get('/base/departments/'),
                api.get('/base/companies/')
            ]);
            setPositions(posRes.data.results || posRes.data || []);
            setRoles(roleRes.data.results || roleRes.data || []);
            setDepartments(deptRes.data.results || deptRes.data || []);
            setCompanies(compRes.data.results || compRes.data || []);
        } catch (error) {
            console.error("Error fetching data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handlePosSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingPosId) {
                await api.put(`/base/job-positions/${editingPosId}/`, posFormData);
            } else {
                await api.post('/base/job-positions/', posFormData);
            }
            setIsPosModalOpen(false);
            fetchData();
        } catch (error) {
            alert("Error saving position");
        }
    };

    const handleRoleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingRoleId) {
                await api.put(`/base/job-roles/${editingRoleId}/`, roleFormData);
            } else {
                await api.post('/base/job-roles/', roleFormData);
            }
            setIsRoleModalOpen(false);
            fetchData();
        } catch (error) {
            alert("Error saving role");
        }
    };

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading Job Master...</div>;

    const subTabButtonStyle = (isActive) => ({
        padding: '0.5rem 1.25rem',
        borderRadius: '8px',
        border: 'none',
        backgroundColor: isActive ? 'var(--primary-color)' : 'transparent',
        color: isActive ? '#fff' : '#64748b',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.2s',
        fontSize: '0.875rem'
    });

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', backgroundColor: '#f1f5f9', padding: '0.25rem', borderRadius: '10px' }}>
                    <button style={subTabButtonStyle(activeSubTab === 'position')} onClick={() => setActiveSubTab('position')}>Job Positions</button>
                    <button style={subTabButtonStyle(activeSubTab === 'role')} onClick={() => setActiveSubTab('role')}>Job Roles</button>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={() => {
                        if (activeSubTab === 'position') {
                            setEditingPosId(null);
                            setPosFormData({ job_position: '', department_id: '', company_id: [] });
                            setIsPosModalOpen(true);
                        } else {
                            setEditingRoleId(null);
                            setRoleFormData({ job_role: '', job_position_id: '', company_id: [] });
                            setIsRoleModalOpen(true);
                        }
                    }}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    <FaPlus /> {activeSubTab === 'position' ? 'Add Position' : 'Add Role'}
                </button>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeSubTab}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
                >
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                                <th style={{ padding: '1.25rem 1rem', textAlign: 'left', color: '#64748b', fontWeight: 600, fontSize: '0.875rem' }}>
                                    {activeSubTab === 'position' ? 'Position Name' : 'Role Name'}
                                </th>
                                <th style={{ padding: '1.25rem 1rem', textAlign: 'left', color: '#64748b', fontWeight: 600, fontSize: '0.875rem' }}>
                                    {activeSubTab === 'position' ? 'Department' : 'Position'}
                                </th>
                                <th style={{ padding: '1.25rem 1rem', textAlign: 'right', color: '#64748b', fontWeight: 600, fontSize: '0.875rem' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {activeSubTab === 'position' ? (
                                positions.map(pos => (
                                    <tr key={pos.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        <td style={{ padding: '1rem', color: '#1e293b', fontWeight: 500 }}>{pos.job_position}</td>
                                        <td style={{ padding: '1rem', color: '#475569' }}>{departments.find(d => d.id === pos.department_id)?.department || 'N/A'}</td>
                                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                                            <button onClick={() => {
                                                setPosFormData({
                                                    job_position: pos.job_position,
                                                    department_id: pos.department_id,
                                                    company_id: pos.company_id.map(c => typeof c === 'object' ? c.id : c)
                                                });
                                                setEditingPosId(pos.id);
                                                setIsPosModalOpen(true);
                                            }} style={{ color: 'var(--primary-color)', border: 'none', background: 'none', cursor: 'pointer' }}>Edit</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                roles.map(role => (
                                    <tr key={role.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        <td style={{ padding: '1rem', color: '#1e293b', fontWeight: 500 }}>{role.job_role}</td>
                                        <td style={{ padding: '1rem', color: '#475569' }}>{positions.find(p => p.id === role.job_position_id)?.job_position || 'N/A'}</td>
                                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                                            <button onClick={() => {
                                                setRoleFormData({
                                                    job_role: role.job_role,
                                                    job_position_id: role.job_position_id,
                                                    company_id: role.company_id.map(c => typeof c === 'object' ? c.id : c)
                                                });
                                                setEditingRoleId(role.id);
                                                setIsRoleModalOpen(true);
                                            }} style={{ color: 'var(--primary-color)', border: 'none', background: 'none', cursor: 'pointer' }}>Edit</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </motion.div>
            </AnimatePresence>

            {/* Modals with same premium styling... */}
            {isPosModalOpen && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ backgroundColor: '#fff', width: '100%', maxWidth: '450px', borderRadius: '16px', overflow: 'hidden' }}>
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between' }}>
                            <h3 style={{ margin: 0 }}>{editingPosId ? 'Edit Position' : 'Add Position'}</h3>
                            <button onClick={() => setIsPosModalOpen(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.5rem' }}>&times;</button>
                        </div>
                        <form onSubmit={handlePosSubmit} style={{ padding: '1.5rem' }}>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Position Name</label>
                                <input value={posFormData.job_position} onChange={e => setPosFormData({ ...posFormData, job_position: e.target.value })} style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #d1d5db' }} required />
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Department</label>
                                <select value={posFormData.department_id} onChange={e => setPosFormData({ ...posFormData, department_id: e.target.value })} style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #d1d5db' }} required>
                                    <option value="">Select Department</option>
                                    {departments.map(d => <option key={d.id} value={d.id}>{d.department}</option>)}
                                </select>
                            </div>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Companies</label>
                                <select multiple value={posFormData.company_id} onChange={e => setPosFormData({ ...posFormData, company_id: Array.from(e.target.selectedOptions, o => parseInt(o.value)) })} style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #d1d5db', height: '100px' }}>
                                    {companies.map(c => <option key={c.id} value={c.id}>{c.company}</option>)}
                                </select>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                                <button type="button" onClick={() => setIsPosModalOpen(false)} style={{ padding: '0.6rem 1.2rem', borderRadius: '8px', border: '1px solid #d1d5db', background: '#fff' }}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Save Changes</button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}

            {isRoleModalOpen && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ backgroundColor: '#fff', width: '100%', maxWidth: '450px', borderRadius: '16px', overflow: 'hidden' }}>
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between' }}>
                            <h3 style={{ margin: 0 }}>{editingRoleId ? 'Edit Role' : 'Add Role'}</h3>
                            <button onClick={() => setIsRoleModalOpen(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.5rem' }}>&times;</button>
                        </div>
                        <form onSubmit={handleRoleSubmit} style={{ padding: '1.5rem' }}>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Role Name</label>
                                <input value={roleFormData.job_role} onChange={e => setRoleFormData({ ...roleFormData, job_role: e.target.value })} style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #d1d5db' }} required />
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Job Position</label>
                                <select value={roleFormData.job_position_id} onChange={e => setRoleFormData({ ...roleFormData, job_position_id: e.target.value })} style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #d1d5db' }} required>
                                    <option value="">Select Position</option>
                                    {positions.map(p => <option key={p.id} value={p.id}>{p.job_position}</option>)}
                                </select>
                            </div>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Companies</label>
                                <select multiple value={roleFormData.company_id} onChange={e => setRoleFormData({ ...roleFormData, company_id: Array.from(e.target.selectedOptions, o => parseInt(o.value)) })} style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #d1d5db', height: '100px' }}>
                                    {companies.map(c => <option key={c.id} value={c.id}>{c.company}</option>)}
                                </select>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                                <button type="button" onClick={() => setIsRoleModalOpen(false)} style={{ padding: '0.6rem 1.2rem', borderRadius: '8px', border: '1px solid #d1d5db', background: '#fff' }}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Save Changes</button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default JobSettings;
