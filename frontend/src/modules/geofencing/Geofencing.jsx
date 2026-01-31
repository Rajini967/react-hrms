import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { motion } from 'framer-motion';
import { FaMapMarkedAlt, FaPlus, FaTrash, FaMapMarkerAlt, FaGlobe } from 'react-icons/fa';
import ModuleLayout from '../../components/common/ModuleLayout';

const Geofencing = () => {
    const [geofences, setGeofences] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [newFence, setNewFence] = useState({
        location: '',
        latitude: '',
        longitude: '',
        radius: 100
    });

    useEffect(() => {
        fetchGeofences();
    }, []);

    const fetchGeofences = async () => {
        try {
            const response = await api.get('/geofencing/geofencings/');
            setGeofences(response.data.results || response.data || []);
        } catch (error) {
            console.error("Error fetching geofences:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            const response = await api.post('/geofencing/geofencings/', newFence);
            setGeofences([...geofences, response.data]);
            setIsAdding(false);
            setNewFence({ location: '', latitude: '', longitude: '', radius: 100 });
        } catch (error) {
            console.error("Error saving geofence:", error);
            alert("Failed to save geofence. Please check coordinates.");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete this geofence?")) {
            try {
                await api.delete(`/geofencing/geofencings/${id}/`);
                setGeofences(geofences.filter(g => g.id !== id));
            } catch (error) {
                console.error("Error deleting geofence:", error);
            }
        }
    };

    // Since Geofencing is a single main view, we can wrap it in ModuleLayout directly or just use a simple layout if it's standalone.
    // However, to keep consistency, we can make it a module. 
    // But `ModuleLayout` expects submodules. If there are none, we can just render the content.
    // Let's create a dummy submodule structure or just allow it to be simple.
    // For now, I'll return the content directly, assuming the parent route handles the main layout wrapper if any.
    // But wait, the user wants "Exact Functionality". Synchr probably has a list.

    return (
        <div style={{ height: '100%', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <FaMapMarkedAlt style={{ color: 'var(--primary-color)' }} />
                        Geofencing
                    </h2>
                    <p style={{ color: '#64748b', marginTop: '0.25rem' }}>Define attendance zones for employees</p>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={() => setIsAdding(true)}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', background: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
                >
                    <FaPlus /> Add Zone
                </button>
            </div>

            {isAdding && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ marginBottom: '2rem', padding: '2rem', background: '#fff', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', maxWidth: '600px' }}
                >
                    <h3 style={{ marginBottom: '1.5rem', color: '#1e293b' }}>New Geofence Zone</h3>
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#475569' }}>Location Name</label>
                            <input
                                type="text"
                                placeholder="e.g. Head Office"
                                value={newFence.location}
                                onChange={(e) => setNewFence({ ...newFence, location: e.target.value })}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                            />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#475569' }}>Latitude</label>
                                <input
                                    type="number"
                                    placeholder="e.g. 12.9716"
                                    value={newFence.latitude}
                                    onChange={(e) => setNewFence({ ...newFence, latitude: e.target.value })}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#475569' }}>Longitude</label>
                                <input
                                    type="number"
                                    placeholder="e.g. 77.5946"
                                    value={newFence.longitude}
                                    onChange={(e) => setNewFence({ ...newFence, longitude: e.target.value })}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                />
                            </div>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#475569' }}>Radius (meters)</label>
                            <input
                                type="number"
                                value={newFence.radius}
                                onChange={(e) => setNewFence({ ...newFence, radius: e.target.value })}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                            />
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                        <button onClick={handleSave} style={{ flex: 1, padding: '0.75rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Create Zone</button>
                        <button onClick={() => setIsAdding(false)} style={{ flex: 1, padding: '0.75rem', background: '#f1f5f9', color: '#64748b', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
                    </div>
                </motion.div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {geofences.map((fence, idx) => (
                    <motion.div
                        key={fence.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        style={{
                            background: '#fff',
                            borderRadius: '16px',
                            padding: '1.5rem',
                            border: '1px solid #eef2f6',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.01)',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        <div style={{ position: 'absolute', top: 0, right: 0, padding: '1rem' }}>
                            <button onClick={() => handleDelete(fence.id)} style={{ border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer' }}><FaTrash /></button>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#eff6ff', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>
                                <FaMapMarkerAlt />
                            </div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>{fence.location}</h3>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem', color: '#64748b' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Latitude</span>
                                <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{fence.latitude}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Longitude</span>
                                <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{fence.longitude}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: '0.5rem', marginTop: '0.5rem' }}>
                                <span>Radius</span>
                                <span style={{ fontWeight: 600, color: '#10b981' }}>{fence.radius}m</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
                {geofences.length === 0 && (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', color: '#94a3b8', border: '1px dashed #e2e8f0', borderRadius: '24px' }}>
                        No geofencing zones defined. Add a zone to enable location-based attendance.
                    </div>
                )}
            </div>
        </div>
    );
};

export default Geofencing;
