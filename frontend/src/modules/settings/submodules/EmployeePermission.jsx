import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../../services/api';
import { FaUserShield, FaSearch, FaChevronRight, FaLock, FaCheckSquare, FaSquare } from 'react-icons/fa';
import useToast from '../../../hooks/useToast';
import Toast from '../../../components/common/Toast';

const EmployeePermission = () => {
    const [employees, setEmployees] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [userPermissions, setUserPermissions] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const { toasts, showToast, removeToast } = useToast();

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            const [empRes, permRes] = await Promise.all([
                api.get('/employee/employees/'),
                api.get('/base/permissions/')
            ]);
            setEmployees(empRes.data.results || empRes.data);
            setPermissions(permRes.data);
        } catch (error) {
            showToast('Failed to load data', 'error');
        } finally {
            setLoading(false);
        }
    };

    const fetchUserPermissions = async (empId) => {
        try {
            const response = await api.get(`/base/employee-permissions/${empId}/`);
            setUserPermissions(response.data.map(p => p.id));
        } catch (error) {
            showToast('Failed to fetch user permissions', 'error');
        }
    };

    const togglePermission = (id) => {
        setUserPermissions(prev =>
            prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
        );
    };

    const handleSave = async () => {
        if (!selectedEmployee) return;
        setSaving(true);
        try {
            await api.post(`/base/employee-permissions/${selectedEmployee.id}/`, {
                permissions: userPermissions
            });
            showToast('Permissions updated successfully', 'success');
        } catch (error) {
            showToast('Failed to update permissions', 'error');
        } finally {
            setSaving(false);
        }
    };

    const styles = {
        container: {
            display: 'grid',
            gridTemplateColumns: '350px 1fr',
            gap: '2rem',
            height: 'calc(100vh - 160px)'
        },
        sidebar: {
            backgroundColor: 'white',
            borderRadius: '24px',
            border: '1px solid #f1f5f9',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
        },
        content: {
            backgroundColor: 'white',
            borderRadius: '24px',
            border: '1px solid #f1f5f9',
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
        },
        searchBox: {
            padding: '1.5rem',
            borderBottom: '1px solid #f1f5f9'
        },
        list: {
            flex: 1,
            overflowY: 'auto',
            padding: '1rem'
        },
        employeeItem: (isSelected) => ({
            padding: '1rem',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            backgroundColor: isSelected ? '#f8fafc' : 'transparent',
            border: isSelected ? '1px solid #e2e8f0' : '1px solid transparent',
            marginBottom: '0.5rem',
            transition: 'all 0.2s'
        }),
        permissionGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1rem',
            padding: '1rem',
            overflowY: 'auto',
            flex: 1
        },
        permissionCard: (isActive) => ({
            padding: '1rem',
            borderRadius: '12px',
            border: isActive ? '2px solid #6366f1' : '1px solid #e2e8f0',
            backgroundColor: isActive ? '#f5f3ff' : 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            transition: 'all 0.2s'
        })
    };

    const filteredEmployees = employees.filter(emp =>
        `${emp.employee_first_name} ${emp.employee_last_name}`.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>Employee Permissions</h1>
                <p style={{ color: '#64748b' }}>Control granular access rights for individual employees.</p>
            </div>

            <div style={styles.container}>
                <div style={styles.sidebar}>
                    <div style={styles.searchBox}>
                        <div style={{ position: 'relative' }}>
                            <FaSearch style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                            <input
                                placeholder="Search employees..."
                                style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none' }}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>
                    <div style={styles.list}>
                        {filteredEmployees.map(emp => (
                            <div
                                key={emp.id}
                                style={styles.employeeItem(selectedEmployee?.id === emp.id)}
                                onClick={() => {
                                    setSelectedEmployee(emp);
                                    fetchUserPermissions(emp.id);
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <img
                                        src={emp.employee_profile || 'https://via.placeholder.com/40'}
                                        alt=""
                                        style={{ width: '40px', height: '40px', borderRadius: '10px', objectFit: 'cover' }}
                                    />
                                    <div>
                                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{emp.employee_first_name} {emp.employee_last_name}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{emp.email}</div>
                                    </div>
                                </div>
                                <FaChevronRight size={12} color="#94a3b8" />
                            </div>
                        ))}
                    </div>
                </div>

                <div style={styles.content}>
                    {selectedEmployee ? (
                        <>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', padding: '0 1rem' }}>
                                <div>
                                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{selectedEmployee.employee_first_name}'s Access</h2>
                                    <p style={{ fontSize: '0.875rem', color: '#64748b' }}>Select permissions to grant or revoke.</p>
                                </div>
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    style={{
                                        backgroundColor: '#0f172a',
                                        color: 'white',
                                        padding: '0.75rem 1.5rem',
                                        borderRadius: '12px',
                                        border: 'none',
                                        fontWeight: 700,
                                        cursor: 'pointer'
                                    }}
                                >
                                    {saving ? 'Updating...' : 'Save Permissions'}
                                </button>
                            </div>
                            <div style={styles.permissionGrid}>
                                {permissions.map(perm => {
                                    const isActive = userPermissions.includes(perm.id);
                                    return (
                                        <div
                                            key={perm.id}
                                            style={styles.permissionCard(isActive)}
                                            onClick={() => togglePermission(perm.id)}
                                        >
                                            {isActive ? <FaCheckSquare color="#6366f1" size={20} /> : <FaSquare color="#e2e8f0" size={20} />}
                                            <div>
                                                <div style={{ fontWeight: 600, fontSize: '0.875rem', color: isActive ? '#4338ca' : '#1e293b' }}>
                                                    {perm.name}
                                                </div>
                                                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{perm.codename}</div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    ) : (
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                            <FaLock size={48} style={{ marginBottom: '1rem', opacity: 0.2 }} />
                            <h3>Select an employee to manage permissions</h3>
                        </div>
                    )}
                </div>
            </div>

            <AnimatePresence>
                {toasts.map(toast => (
                    <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => removeToast(toast.id)} />
                ))}
            </AnimatePresence>
        </div>
    );
};

export default EmployeePermission;
