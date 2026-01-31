import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserCircle, FaMapMarkedAlt, FaPlus, FaTrash, FaSyncAlt, FaShieldAlt } from 'react-icons/fa';
import useToast from '../../../hooks/useToast';
import Toast from '../../../components/common/Toast';

const GeoFaceConfig = () => {
    const [activeTab, setActiveTab] = useState('face');
    const [faceConfig, setFaceConfig] = useState(null);
    const [geoFences, setGeoFences] = useState([]);
    const [loading, setLoading] = useState(true);
    const { toasts, showToast, removeToast } = useToast();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [faceRes, geoRes] = await Promise.all([
                api.get('/facedetection/config/'),
                api.get('/geofencing/geofencings/')
            ]);

            if (faceRes.data) {
                const data = Array.isArray(faceRes.data) ? faceRes.data[0] : faceRes.data;
                setFaceConfig(data);
            }
            setGeoFences(geoRes.data || []);
        } catch (error) {
            console.error("Error fetching Geo/Face data:", error);
        } finally {
            setLoading(false);
        }
    };

    const toggleFaceDetection = async () => {
        if (!faceConfig) return;
        const newStatus = !faceConfig.start;
        try {
            await api.post('/facedetection/config/', { start: newStatus });
            setFaceConfig({ ...faceConfig, start: newStatus });
            showToast(`Face detection ${newStatus ? 'enabled' : 'disabled'}`, 'success');
        } catch (error) {
            showToast('Failed to update face detection', 'error');
        }
    };

    const handleDeleteGeo = async (id) => {
        if (window.confirm("Delete this geofence?")) {
            try {
                await api.delete(`/geofencing/geofencings/${id}/`);
                setGeoFences(prev => prev.filter(g => g.id !== id));
                showToast('Geofence removed', 'success');
            } catch (error) {
                showToast('Failed to delete geofence', 'error');
            }
        }
    };

    const TabButton = ({ id, label, icon: Icon }) => (
        <button
            onClick={() => setActiveTab(id)}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '1rem 2rem',
                border: 'none',
                background: 'none',
                color: activeTab === id ? 'var(--primary-color)' : '#64748b',
                fontWeight: 700,
                fontSize: '0.95rem',
                cursor: 'pointer',
                position: 'relative',
                transition: 'all 0.2s ease'
            }}
        >
            <Icon /> {label}
            {activeTab === id && (
                <motion.div
                    layoutId="activeTabUnderline"
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '3px',
                        backgroundColor: 'var(--primary-color)',
                        borderRadius: '3px 3px 0 0'
                    }}
                />
            )}
        </button>
    );

    if (loading) return <div style={{ padding: '4rem', textAlign: 'center' }}>Synchronizing configurations...</div>;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ padding: '2rem' }}
        >
            <div style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.025em' }}>Security & Attendance</h2>
                <p style={{ color: '#64748b' }}>Configure biometric authentication and location-based attendance rules.</p>
            </div>

            <div style={{ borderBottom: '1px solid #e2e8f0', display: 'flex', marginBottom: '2.5rem' }}>
                <TabButton id="face" label="Face Recognition" icon={FaUserCircle} />
                <TabButton id="geo" label="Geofencing" icon={FaMapMarkedAlt} />
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'face' ? (
                    <motion.div
                        key="face-tab"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        style={{ maxWidth: '700px' }}
                    >
                        <div style={{
                            background: '#fff',
                            padding: '2.5rem',
                            borderRadius: '24px',
                            border: '1px solid #f1f5f9',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e293b', margin: '0 0 0.5rem 0' }}>Biometric Enrollment</h3>
                                    <p style={{ fontSize: '0.9rem', color: '#64748b', margin: 0 }}>Enabling this will require employees to verify their identity via face recognition during check-in.</p>
                                </div>
                                <div
                                    onClick={toggleFaceDetection}
                                    style={{
                                        width: '60px',
                                        height: '32px',
                                        backgroundColor: faceConfig?.start ? 'var(--primary-color)' : '#e2e8f0',
                                        borderRadius: '16px',
                                        padding: '4px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: faceConfig?.start ? 'flex-end' : 'flex-start',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                                    }}
                                >
                                    <motion.div
                                        layout
                                        style={{ width: '24px', height: '24px', backgroundColor: '#fff', borderRadius: '50%', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
                                    />
                                </div>
                            </div>

                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '1.5rem',
                                padding: '1.5rem',
                                backgroundColor: '#f8fafc',
                                borderRadius: '16px',
                                marginTop: '2.5rem'
                            }}>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <div style={{ color: 'var(--primary-color)', fontSize: '1.2rem' }}><FaShieldAlt /></div>
                                    <div>
                                        <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#334155' }}>Liveness Detection</div>
                                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Prevent spoofing with static images</div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <div style={{ color: 'var(--primary-color)', fontSize: '1.2rem' }}><FaSyncAlt /></div>
                                    <div>
                                        <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#334155' }}>Cloud Sync</div>
                                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Automatic model updates across devices</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="geo-tab"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>Active Geofences</h3>
                            <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem' }}>
                                <FaPlus /> Add New Fence
                            </button>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                            {geoFences.map(fence => (
                                <motion.div
                                    key={fence.id}
                                    whileHover={{ y: -4 }}
                                    style={{
                                        background: '#fff',
                                        borderRadius: '20px',
                                        padding: '1.5rem',
                                        border: '1px solid #f1f5f9',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                        <div>
                                            <h4 style={{ margin: '0 0 0.25rem 0', color: '#1e293b', fontWeight: 700 }}>{fence.name}</h4>
                                            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Radius: {fence.radius} meters</div>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteGeo(fence.id)}
                                            style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem' }}
                                        >
                                            <FaTrash size={14} />
                                        </button>
                                    </div>
                                    <div style={{
                                        height: '100px',
                                        background: '#f1f5f9',
                                        borderRadius: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#94a3b8',
                                        fontSize: '0.85rem'
                                    }}>
                                        Lat: {fence.latitude.toFixed(4)}, Long: {fence.longitude.toFixed(4)}
                                    </div>
                                </motion.div>
                            ))}

                            {geoFences.length === 0 && (
                                <div style={{
                                    gridColumn: '1 / -1',
                                    padding: '4rem',
                                    textAlign: 'center',
                                    background: '#fff',
                                    borderRadius: '24px',
                                    border: '1px dashed #e2e8f0',
                                    color: '#94a3b8'
                                }}>
                                    <FaMapMarkedAlt size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                                    <p>No geofences defined. Location-based attendance is currently disabled.</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {toasts.map(toast => (
                    <Toast
                        key={toast.id}
                        message={toast.message}
                        type={toast.type}
                        onClose={() => removeToast(toast.id)}
                    />
                ))}
            </AnimatePresence>
        </motion.div>
    );
};

export default GeoFaceConfig;
