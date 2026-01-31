import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { motion } from 'framer-motion';
import { FaLaptop, FaMobileAlt, FaHdd, FaBarcode, FaTools, FaPlus } from 'react-icons/fa';

const AssetInventory = () => {
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAssets = async () => {
            try {
                const response = await api.get('/asset/assets/');
                setAssets(response.data.results || response.data || []);
            } catch (error) {
                console.error("Error fetching assets:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAssets();
    }, []);

    const getStatusStyle = (status) => {
        switch (status?.toLowerCase()) {
            case 'available': return { bg: '#ecfdf5', text: '#10b981' };
            case 'allocated': return { bg: '#eff6ff', text: '#3b82f6' };
            case 'damaged': return { bg: '#fef2f2', text: '#ef4444' };
            default: return { bg: '#f8fafc', text: '#64748b' };
        }
    };

    const getIcon = (category) => {
        const cat = category?.toLowerCase();
        if (cat?.includes('laptop')) return <FaLaptop />;
        if (cat?.includes('mobile')) return <FaMobileAlt />;
        return <FaHdd />;
    };

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading asset inventory...</div>;

    return (
        <div style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b' }}>Asset Inventory</h2>
                    <p style={{ color: '#64748b', marginTop: '0.25rem' }}>Track company hardware and equipment</p>
                </div>
                <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FaPlus /> Add Asset
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                {assets.map((asset, idx) => {
                    const status = asset.asset_status || 'Available';
                    const { bg, text } = getStatusStyle(status);
                    return (
                        <motion.div
                            key={asset.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.05 }}
                            style={{
                                backgroundColor: '#fff',
                                borderRadius: '24px',
                                padding: '1.5rem',
                                border: '1px solid #eef2f6',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1rem',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.02)'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-color)', fontSize: '1.5rem' }}>
                                    {getIcon(asset.asset_category_name)}
                                </div>
                                <span style={{ padding: '0.35rem 0.75rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700, backgroundColor: bg, color: text }}>
                                    {status}
                                </span>
                            </div>

                            <div>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.25rem' }}>{asset.asset_name}</h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#64748b' }}>
                                    <FaBarcode /> <span>{asset.asset_lot_number || 'No SKU'}</span>
                                </div>
                            </div>

                            <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid #f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>ID: {asset.id}</span>
                                <button style={{ border: 'none', background: 'none', color: '#64748b', cursor: 'pointer' }}><FaTools /></button>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
            {assets.length === 0 && (
                <div style={{ padding: '4rem', textAlign: 'center', color: '#64748b', border: '1px dashed #e2e8f0', borderRadius: '24px' }}>
                    No assets registered in the inventory.
                </div>
            )}
        </div>
    );
};

export default AssetInventory;
