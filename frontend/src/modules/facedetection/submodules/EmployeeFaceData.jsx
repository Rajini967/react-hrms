import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { motion } from 'framer-motion';
import { FaUser, FaCamera, FaTimes, FaCheck } from 'react-icons/fa';

const EmployeeFaceData = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            // Need an endpoint that returns employees and their face registration status
            const response = await api.get('/facedetection/employees/');
            setEmployees(response.data.results || response.data || []);
        } catch (error) {
            console.error("Error fetching employees:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = (id) => {
        // Redirect to a registration page or open modal
        alert(`Open registration camera for employee ${id}`);
    };

    const filteredEmployees = employees.filter(emp =>
        emp.employee_first_name?.toLowerCase().includes(search.toLowerCase()) ||
        emp.employee_last_name?.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return <div>Loading employee data...</div>;

    return (
        <div style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b' }}>Employee Face Data</h2>
                    <p style={{ color: '#64748b', marginTop: '0.25rem' }}>Manage facial recognition data for employees</p>
                </div>
                <input
                    type="text"
                    placeholder="Search employees..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0', width: '250px' }}
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {filteredEmployees.map((emp, idx) => (
                    <motion.div
                        key={emp.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        style={{
                            background: '#fff',
                            borderRadius: '16px',
                            padding: '1.5rem',
                            border: '1px solid #eef2f6',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.01)',
                            display: 'flex',
                            gap: '1rem',
                            alignItems: 'center'
                        }}
                    >
                        <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#f1f5f9', overflow: 'hidden' }}>
                            {emp.employee_profile_picture ? (
                                <img src={emp.employee_profile_picture} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}><FaUser /></div>
                            )}
                        </div>
                        <div style={{ flex: 1 }}>
                            <h4 style={{ margin: 0, color: '#1e293b' }}>{emp.employee_first_name} {emp.employee_last_name}</h4>
                            <p style={{ margin: '0.25rem 0', fontSize: '0.85rem', color: '#64748b' }}>{emp.employee_work_email}</p>

                            <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                {emp.has_face_data ? (
                                    <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', borderRadius: '4px', background: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                        <FaCheck /> Registered
                                    </span>
                                ) : (
                                    <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', borderRadius: '4px', background: '#fffbeb', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                        Not Registered
                                    </span>
                                )}
                            </div>
                        </div>
                        <div>
                            <button
                                onClick={() => handleRegister(emp.id)}
                                style={{ border: 'none', background: '#eff6ff', color: '#3b82f6', width: '36px', height: '36px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                                <FaCamera />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default EmployeeFaceData;
