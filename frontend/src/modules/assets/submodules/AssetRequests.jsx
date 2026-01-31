import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { motion } from 'framer-motion';
import { FaHandHolding, FaCheck, FaTimes, FaUser, FaClock, FaBox } from 'react-icons/fa';

const AssetRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [assets, setAssets] = useState([]); // Available assets for approval selection
    const [approvingId, setApprovingId] = useState(null);
    const [selectedAssetId, setSelectedAssetId] = useState('');

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const response = await api.get('/asset/asset-requests/');
            setRequests(response.data.results || response.data || []);
        } catch (error) {
            console.error("Error fetching requests:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAvailableAssets = async (categoryName) => {
        // Ideally filter by category, but for now fetch all available
        try {
            const response = await api.get('/asset/assets/?status=Available');
            setAssets(response.data.results || response.data || []);
        } catch (error) {
            console.error("Error fetching assets:", error);
        }
    };

    const handleApproveClick = async (req) => {
        setApprovingId(req.id);
        await fetchAvailableAssets(req.asset_category_name);
    };

    const handleConfirmApprove = async (reqId) => {
        if (!selectedAssetId) {
            alert("Please select an asset to assign.");
            return;
        }
        try {
            await api.put(`/asset/asset-approve/${reqId}`, { asset_id: selectedAssetId });
            alert("Request approved and asset assigned.");
            setApprovingId(null);
            setSelectedAssetId('');
            fetchRequests();
        } catch (error) {
            console.error("Error approving request:", error);
            alert("Failed to approve request.");
        }
    };

    const handleReject = async (id) => {
        if (window.confirm("Are you sure you want to reject this request?")) {
            try {
                await api.put(`/asset/asset-reject/${id}`);
                fetchRequests();
            } catch (error) {
                console.error("Error rejecting request:", error);
            }
        }
    };

    const getStatusBadge = (status) => {
        const s = status?.toLowerCase();
        let color = '#64748b';
        let bg = '#f1f5f9';
        if (s === 'approved') { color = '#10b981'; bg = '#ecfdf5'; }
        if (s === 'rejected') { color = '#ef4444'; bg = '#fef2f2'; }
        if (s === 'requested') { color = '#f59e0b'; bg = '#fffbeb'; }
        return <span style={{ padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600, color, backgroundColor: bg }}>{status}</span>;
    };

    if (loading) return <div>Loading asset requests...</div>;

    return (
        <div style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b' }}>Asset Requests</h2>
                    <p style={{ color: '#64748b', marginTop: '0.25rem' }}>Manage employee requests for equipment</p>
                </div>
            </div>

            <div style={{ display: 'grid', gap: '1rem' }}>
                {requests.map((req, idx) => (
                    <motion.div
                        key={req.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        style={{
                            backgroundColor: '#fff',
                            borderRadius: '16px',
                            padding: '1.5rem',
                            border: '1px solid #eef2f6',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem'
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fff7ed', color: '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>
                                    <FaHandHolding />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1e293b', margin: 0 }}>
                                        {req.asset_category_name || "Asset Request"}
                                    </h3>
                                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', fontSize: '0.9rem', color: '#64748b' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><FaUser /> {req.employee_name}</span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><FaClock /> {req.requested_date}</span>
                                    </div>
                                </div>
                            </div>
                            {getStatusBadge(req.asset_request_status)}
                        </div>

                        {req.description && (
                            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', fontSize: '0.9rem', color: '#475569' }}>
                                "{req.description}"
                            </div>
                        )}

                        {req.asset_request_status === 'Requested' && (
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '0.5rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
                                {approvingId === req.id ? (
                                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                        <select
                                            value={selectedAssetId}
                                            onChange={(e) => setSelectedAssetId(e.target.value)}
                                            style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                                        >
                                            <option value="">Select Asset to Assign</option>
                                            {assets.map(a => (
                                                <option key={a.id} value={a.id}>{a.asset_name} ({a.asset_lot_number})</option>
                                            ))}
                                        </select>
                                        <button onClick={() => handleConfirmApprove(req.id)} style={{ background: '#10b981', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer' }}>Confirm</button>
                                        <button onClick={() => { setApprovingId(null); setSelectedAssetId(''); }} style={{ background: '#64748b', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
                                    </div>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => handleApproveClick(req)}
                                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #bbf7d0', background: '#f0fdf4', color: '#16a34a', cursor: 'pointer', fontWeight: 600 }}
                                        >
                                            <FaCheck /> Approve
                                        </button>
                                        <button
                                            onClick={() => handleReject(req.id)}
                                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #fecdd3', background: '#fff1f2', color: '#e11d48', cursor: 'pointer', fontWeight: 600 }}
                                        >
                                            <FaTimes /> Reject
                                        </button>
                                    </>
                                )}
                            </div>
                        )}
                    </motion.div>
                ))}

                {requests.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>No pending asset requests.</div>
                )}
            </div>
        </div>
    );
};

export default AssetRequests;
