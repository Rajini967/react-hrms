import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../../services/api';
import { FaUsers, FaPlus, FaTrash, FaEdit, FaCheck } from 'react-icons/fa';
import useToast from '../../../hooks/useToast';
import Toast from '../../../components/common/Toast';

const UserGroup = () => {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingGroup, setEditingGroup] = useState(null);
    const [newGroupName, setNewGroupName] = useState('');
    const { toasts, showToast, removeToast } = useToast();

    useEffect(() => {
        fetchGroups();
    }, []);

    const fetchGroups = async () => {
        try {
            const response = await api.get('/base/groups/');
            setGroups(response.data);
        } catch (error) {
            showToast('Failed to fetch groups', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateOrUpdate = async (e) => {
        e.preventDefault();
        try {
            if (editingGroup) {
                await api.put(`/base/groups/${editingGroup.id}/`, { name: newGroupName });
                showToast('Group updated successfully', 'success');
            } else {
                await api.post('/base/groups/', { name: newGroupName });
                showToast('Group created successfully', 'success');
            }
            setIsModalOpen(false);
            setEditingGroup(null);
            setNewGroupName('');
            fetchGroups();
        } catch (error) {
            showToast('Operation failed', 'error');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this group?')) return;
        try {
            await api.delete(`/base/groups/${id}/`);
            showToast('Group deleted', 'success');
            fetchGroups();
        } catch (error) {
            showToast('Delete failed', 'error');
        }
    };

    const styles = {
        container: {
            maxWidth: '1000px',
            margin: '0 auto',
            padding: '2rem'
        },
        header: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem'
        },
        grid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1.5rem'
        },
        card: {
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '1.5rem',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
            border: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        },
        modal: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
        },
        modalContent: {
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '24px',
            width: '400px',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
        },
        input: {
            width: '100%',
            padding: '0.75rem 1rem',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            marginBottom: '1.5rem',
            marginTop: '0.5rem',
            outline: 'none',
            fontSize: '1rem',
            color: '#1e293b'
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>User Groups</h1>
                    <p style={{ color: '#64748b' }}>Manage security groups and access levels.</p>
                </div>
                <button
                    onClick={() => {
                        setIsModalOpen(true);
                        setEditingGroup(null);
                        setNewGroupName('');
                    }}
                    style={{
                        backgroundColor: '#6366f1',
                        color: 'white',
                        border: 'none',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '12px',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        cursor: 'pointer'
                    }}
                >
                    <FaPlus size={14} /> Create Group
                </button>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem' }}>Loading groups...</div>
            ) : (
                <div style={styles.grid}>
                    {groups.map(group => (
                        <motion.div
                            key={group.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={styles.card}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ width: '40px', height: '40px', backgroundColor: '#f5f3ff', color: '#7c3aed', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <FaUsers />
                                </div>
                                <span style={{ fontWeight: 600, color: '#1e293b' }}>{group.name}</span>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button
                                    onClick={() => {
                                        setEditingGroup(group);
                                        setNewGroupName(group.name);
                                        setIsModalOpen(true);
                                    }}
                                    style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: 'white', color: '#64748b', cursor: 'pointer' }}
                                >
                                    <FaEdit size={12} />
                                </button>
                                <button
                                    onClick={() => handleDelete(group.id)}
                                    style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid #fee2e2', backgroundColor: '#fef2f2', color: '#ef4444', cursor: 'pointer' }}
                                >
                                    <FaTrash size={12} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {isModalOpen && (
                <div style={styles.modal}>
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        style={styles.modalContent}
                    >
                        <h2 style={{ marginBottom: '1.5rem', fontWeight: 800 }}>{editingGroup ? 'Edit Group' : 'New Group'}</h2>
                        <form onSubmit={handleCreateOrUpdate}>
                            <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#64748b' }}>Group Name</label>
                            <input
                                style={styles.input}
                                value={newGroupName}
                                onChange={(e) => setNewGroupName(e.target.value)}
                                placeholder="e.g. Administrators"
                                required
                            />
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    style={{ flex: 1, padding: '0.75rem', borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: 'white', fontWeight: 800 }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    style={{ flex: 1, padding: '0.75rem', borderRadius: '12px', border: 'none', backgroundColor: '#1e293b', color: 'white', fontWeight: 800 }}
                                >
                                    {editingGroup ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}

            <AnimatePresence>
                {toasts.map(toast => (
                    <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => removeToast(toast.id)} />
                ))}
            </AnimatePresence>
        </div>
    );
};

export default UserGroup;
