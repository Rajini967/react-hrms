import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { FaPlus } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const WorkTypeSettings = () => {
    const [subTab, setSubTab] = useState('standard');
    const [workTypes, setWorkTypes] = useState([]);
    const [rotatingWorkTypes, setRotatingWorkTypes] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);

    const [isWTModalOpen, setIsWTModalOpen] = useState(false);
    const [wtFormData, setWtFormData] = useState({ work_type: '', company_id: [] });
    const [editingWTId, setEditingWTId] = useState(null);

    const [isRWTModalOpen, setIsRWTModalOpen] = useState(false);
    const [rwtFormData, setRwtFormData] = useState({
        name: '', work_type1: '', work_type2: '', additional_data: { additional_work_types: [] }
    });
    const [editingRWTId, setEditingRWTId] = useState(null);

    const fetchData = async () => {
        try {
            const [wtRes, rwtRes, compRes] = await Promise.all([
                api.get('/base/worktypes/'),
                api.get('/base/rotating-worktypes/'),
                api.get('/base/companies/')
            ]);
            setWorkTypes(wtRes.data.results || wtRes.data || []);
            setRotatingWorkTypes(rwtRes.data.results || rwtRes.data || []);
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

    const handleWTSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingWTId) {
                await api.put(`/base/worktypes/${editingWTId}/`, wtFormData);
            } else {
                await api.post('/base/worktypes/', wtFormData);
            }
            setIsWTModalOpen(false);
            fetchData();
        } catch (error) {
            alert("Error saving work type");
        }
    };

    const handleRWTSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingRWTId) {
                await api.put(`/base/rotating-worktypes/${editingRWTId}/`, rwtFormData);
            } else {
                await api.post('/base/rotating-worktypes/', rwtFormData);
            }
            setIsRWTModalOpen(false);
            fetchData();
        } catch (error) {
            alert("Error saving rotating work type");
        }
    };

    const addAdditionalWT = () => {
        setRwtFormData(prev => ({
            ...prev,
            additional_data: {
                ...prev.additional_data,
                additional_work_types: [...(prev.additional_data?.additional_work_types || []), '']
            }
        }));
    };

    const removeAdditionalWT = (index) => {
        const newWTs = [...rwtFormData.additional_data.additional_work_types];
        newWTs.splice(index, 1);
        setRwtFormData(prev => ({
            ...prev,
            additional_data: { ...prev.additional_data, additional_work_types: newWTs }
        }));
    };

    const updateAdditionalWT = (index, value) => {
        const newWTs = [...rwtFormData.additional_data.additional_work_types];
        newWTs[index] = value;
        setRwtFormData(prev => ({
            ...prev,
            additional_data: { ...prev.additional_data, additional_work_types: newWTs }
        }));
    };

    const handleWTDelete = async (id) => {
        if (window.confirm("Delete work type?")) {
            await api.delete(`/base/worktypes/${id}/`);
            fetchData();
        }
    };

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;

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
                    <button style={subTabButtonStyle(subTab === 'standard')} onClick={() => setSubTab('standard')}>Standard</button>
                    <button style={subTabButtonStyle(subTab === 'rotating')} onClick={() => setSubTab('rotating')}>Rotating</button>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={() => {
                        if (subTab === 'standard') {
                            setEditingWTId(null);
                            setWtFormData({ work_type: '', company_id: [] });
                            setIsWTModalOpen(true);
                        } else {
                            setEditingRWTId(null);
                            setRwtFormData({ name: '', work_type1: '', work_type2: '', additional_data: { additional_work_types: [] } });
                            setIsRWTModalOpen(true);
                        }
                    }}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    <FaPlus /> {subTab === 'standard' ? 'Add Work Type' : 'Add Rotating Work Type'}
                </button>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={subTab}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
                >
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                                <th style={{ padding: '1.25rem 1rem', textAlign: 'left', color: '#64748b', fontWeight: 600, fontSize: '0.875rem' }}>Name</th>
                                <th style={{ padding: '1.25rem 1rem', textAlign: 'left', color: '#64748b', fontWeight: 600, fontSize: '0.875rem' }}>
                                    {subTab === 'standard' ? 'Companies' : 'Switch Details'}
                                </th>
                                <th style={{ padding: '1.25rem 1rem', textAlign: 'right', color: '#64748b', fontWeight: 600, fontSize: '0.875rem' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subTab === 'standard' ? (
                                workTypes.map(wt => (
                                    <tr key={wt.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        <td style={{ padding: '1rem', color: '#1e293b', fontWeight: 500 }}>{wt.work_type}</td>
                                        <td style={{ padding: '1rem', color: '#475569' }}>
                                            {wt.company_id.map(id => companies.find(c => c.id === id)?.company).filter(Boolean).join(', ')}
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                                            <button onClick={() => { setWtFormData({ work_type: wt.work_type, company_id: wt.company_id }); setEditingWTId(wt.id); setIsWTModalOpen(true); }} style={{ marginRight: '1rem', color: 'var(--primary-color)', border: 'none', background: 'none', cursor: 'pointer' }}>Edit</button>
                                            <button onClick={() => handleWTDelete(wt.id)} style={{ color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer' }}>Delete</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                rotatingWorkTypes.map(rwt => (
                                    <tr key={rwt.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        <td style={{ padding: '1rem', color: '#1e293b', fontWeight: 500 }}>{rwt.name}</td>
                                        <td style={{ padding: '1rem', color: '#475569' }}>
                                            {workTypes.find(w => w.id === rwt.work_type1)?.work_type} &harr; {workTypes.find(w => w.id === rwt.work_type2)?.work_type}
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                                            <button onClick={() => {
                                                setRwtFormData({
                                                    name: rwt.name,
                                                    work_type1: rwt.work_type1,
                                                    work_type2: rwt.work_type2,
                                                    additional_data: rwt.additional_data || { additional_work_types: [] }
                                                });
                                                setEditingRWTId(rwt.id);
                                                setIsRWTModalOpen(true);
                                            }} style={{ marginRight: '1rem', color: 'var(--primary-color)', border: 'none', background: 'none', cursor: 'pointer' }}>Edit</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </motion.div>
            </AnimatePresence>

            {/* WT Modal */}
            {isWTModalOpen && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ backgroundColor: '#fff', width: '100%', maxWidth: '400px', borderRadius: '16px', overflow: 'hidden' }}>
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between' }}>
                            <h3 style={{ margin: 0 }}>{editingWTId ? 'Edit Work Type' : 'Add Work Type'}</h3>
                            <button onClick={() => setIsWTModalOpen(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.5rem' }}>&times;</button>
                        </div>
                        <form onSubmit={handleWTSubmit} style={{ padding: '1.5rem' }}>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Work Type Name</label>
                                <input value={wtFormData.work_type} onChange={e => setWtFormData({ ...wtFormData, work_type: e.target.value })} style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #d1d5db' }} required />
                            </div>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Companies</label>
                                <select multiple value={wtFormData.company_id} onChange={e => setWtFormData({ ...wtFormData, company_id: Array.from(e.target.selectedOptions, o => parseInt(o.value)) })} style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #d1d5db', height: '100px' }}>
                                    {companies.map(c => <option key={c.id} value={c.id}>{c.company}</option>)}
                                </select>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                                <button type="button" onClick={() => setIsWTModalOpen(false)} style={{ padding: '0.6rem 1.2rem', borderRadius: '8px', border: '1px solid #d1d5db', background: '#fff' }}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Save Changes</button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}

            {/* RWT Modal */}
            {isRWTModalOpen && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ backgroundColor: '#fff', width: '100%', maxWidth: '450px', borderRadius: '16px', overflow: 'hidden' }}>
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between' }}>
                            <h3 style={{ margin: 0 }}>{editingRWTId ? 'Edit Rotating Work Type' : 'Add Rotating Work Type'}</h3>
                            <button onClick={() => setIsRWTModalOpen(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.5rem' }}>&times;</button>
                        </div>
                        <form onSubmit={handleRWTSubmit} style={{ padding: '1.5rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Name</label>
                                    <input value={rwtFormData.name} onChange={e => setRwtFormData({ ...rwtFormData, name: e.target.value })} style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #d1d5db' }} required />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Work Type 1</label>
                                        <select value={rwtFormData.work_type1} onChange={e => setRwtFormData({ ...rwtFormData, work_type1: e.target.value })} style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #d1d5db' }} required>
                                            <option value="">Select...</option>
                                            {workTypes.map(wt => <option key={wt.id} value={wt.id}>{wt.work_type}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Work Type 2</label>
                                        <select value={rwtFormData.work_type2} onChange={e => setRwtFormData({ ...rwtFormData, work_type2: e.target.value })} style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #d1d5db' }} required>
                                            <option value="">Select...</option>
                                            {workTypes.map(wt => <option key={wt.id} value={wt.id}>{wt.work_type}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div style={{ maxHeight: '200px', overflowY: 'auto', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
                                    <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', fontWeight: 600 }}>
                                        Additional Work Types
                                        <button type="button" onClick={addAdditionalWT} style={{ color: 'var(--primary-color)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8rem' }}>+ Add More</button>
                                    </label>
                                    {(rwtFormData.additional_data?.additional_work_types || []).map((wt, idx) => (
                                        <div key={idx} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                            <select
                                                value={wt}
                                                onChange={e => updateAdditionalWT(idx, e.target.value)}
                                                style={{ flex: 1, padding: '0.6rem', borderRadius: '8px', border: '1px solid #d1d5db' }}
                                            >
                                                <option value="">Select...</option>
                                                {workTypes.map(w => <option key={w.id} value={w.id}>{w.work_type}</option>)}
                                            </select>
                                            <button type="button" onClick={() => removeAdditionalWT(idx)} style={{ color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer' }}>&times;</button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                                <button type="button" onClick={() => setIsRWTModalOpen(false)} style={{ padding: '0.6rem 1.2rem', borderRadius: '8px', border: '1px solid #d1d5db', background: '#fff' }}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Save Changes</button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default WorkTypeSettings;
