import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { motion } from 'framer-motion';
import { FaSave, FaCog } from 'react-icons/fa';

const FaceConfig = () => {
    const [config, setConfig] = useState({
        similarity_threshold: 0.6,
        min_face_size: 20,
        detection_model: 'hog',
        enable_antispoofing: true,
        allow_multiple_faces: false,
        attendance_mode: 'auto'
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchConfig();
    }, []);

    const fetchConfig = async () => {
        try {
            const response = await api.get('/facedetection/config/');
            // Assuming response matches state structure, or mapping it
            if (response.data) {
                setConfig(prev => ({ ...prev, ...response.data }));
            }
        } catch (error) {
            console.error("Error fetching config:", error);
            // If 404 or error, we stick to defaults
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            await api.post('/facedetection/config/', config);
            alert("Configuration saved successfully!");
        } catch (error) {
            console.error("Error saving config:", error);
            alert("Failed to save configuration.");
        }
    };

    return (
        <div style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b' }}>System Configuration</h2>
                    <p style={{ color: '#64748b', marginTop: '0.25rem' }}>Fine-tune face recognition parameters</p>
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ background: '#fff', borderRadius: '16px', padding: '2rem', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', maxWidth: '800px' }}
            >
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>

                    <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#475569' }}>Similarity Threshold (0.1 - 1.0)</label>
                        <input
                            type="number"
                            step="0.05" min="0.1" max="1.0"
                            value={config.similarity_threshold}
                            onChange={(e) => setConfig({ ...config, similarity_threshold: parseFloat(e.target.value) })}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                        />
                        <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.25rem' }}>Higher values are stricter (fewer false positives, more false negatives).</p>
                    </div>

                    <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#475569' }}>Minimum Face Size (px)</label>
                        <input
                            type="number"
                            value={config.min_face_size}
                            onChange={(e) => setConfig({ ...config, min_face_size: parseInt(e.target.value) })}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                        />
                    </div>

                    <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#475569' }}>Detection Model</label>
                        <select
                            value={config.detection_model}
                            onChange={(e) => setConfig({ ...config, detection_model: e.target.value })}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                        >
                            <option value="hog">HOG (Faster, less accurate)</option>
                            <option value="cnn">CNN (Slower, more accurate)</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#475569' }}>Attendance Mode</label>
                        <select
                            value={config.attendance_mode}
                            onChange={(e) => setConfig({ ...config, attendance_mode: e.target.value })}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                        >
                            <option value="auto">Auto Check-in/out</option>
                            <option value="checkin_only">Check-in Only</option>
                            <option value="verify_only">Verification Only (No Attendance)</option>
                        </select>
                    </div>

                    <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <input
                            type="checkbox"
                            checked={config.enable_antispoofing}
                            onChange={(e) => setConfig({ ...config, enable_antispoofing: e.target.checked })}
                            style={{ width: '20px', height: '20px' }}
                        />
                        <label style={{ fontWeight: 600, color: '#475569' }}>Enable Anti-Spoofing (Liveness Check)</label>
                    </div>

                    <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <input
                            type="checkbox"
                            checked={config.allow_multiple_faces}
                            onChange={(e) => setConfig({ ...config, allow_multiple_faces: e.target.checked })}
                            style={{ width: '20px', height: '20px' }}
                        />
                        <label style={{ fontWeight: 600, color: '#475569' }}>Allow Multiple Faces in Frame</label>
                    </div>

                </div>

                <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid #f1f5f9' }}>
                    <button
                        onClick={handleSave}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 2rem', background: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem', fontWeight: 600 }}
                    >
                        <FaSave /> Save Configuration
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default FaceConfig;
