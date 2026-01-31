import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { motion } from 'framer-motion';
import { FaUserTag, FaPlus, FaCheck, FaTimes, FaSearch } from 'react-icons/fa';

const AssetAllocations = () => {
    const [allocations, setAllocations] = useState([]);
    const [assets, setAssets] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [newAllocation, setNewAllocation] = useState({
        asset: '',
        assigned_to: '',
        allocation_date: new Date().toISOString().split('T')[0],
        return_date: '',
        condition_on_checkout: 'Good'
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [allocRes, assetRes, empRes] = await Promise.all([
                api.get('/asset/asset-allocations/'),
                api.get('/asset/assets/?status=Available'), // Filter available assets
                api.get('/employee/employee-creation/') // Assuming this endpoint exists, or similar
            ]);

            setAllocations(allocRes.data.results || allocRes.data || []);
            setAssets(assetRes.data.results || assetRes.data || []);
            setEmployees(empRes.data.results || empRes.data || []);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAllocate = async () => {
        try {
            const response = await api.post('/asset/asset-allocations/', newAllocation);
            setAllocations([...allocations, response.data]);
            setIsAdding(false);
            setNewAllocation({
                asset: '',
                assigned_to: '',
                allocation_date: new Date().toISOString().split('T')[0],
                return_date: '',
                condition_on_checkout: 'Good'
            });
            // Refresh assets to update availability
            const assetRes = await api.get('/asset/assets/?status=Available');
            setAssets(assetRes.data.results || assetRes.data || []);
        } catch (error) {
            console.error("Error allocating asset:", error);
            alert("Failed to allocate asset. Please check inputs.");
        }
    };

    const handleReturn = async (id) => {
        if (window.confirm("Mark this asset as returned?")) {
            try {
                await api.post(`/asset/asset-return/${id}`); // Using the specific return endpoint
                // Refresh list
                const allocRes = await api.get('/asset/asset-allocations/');
                setAllocations(allocRes.data.results || allocRes.data || []);
            } catch (error) {
                console.error("Error returning asset:", error);
            }
        }
    };

    if (loading) return <div>Loading allocations...</div>;

    return (
        <div style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b' }}>Asset Allocations</h2>
                    <p style={{ color: '#64748b', marginTop: '0.25rem' }}>Assign assets to employees</p>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={() => setIsAdding(true)}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                >
                    <FaPlus /> Allocate Asset
                </button>
            </div>

            {isAdding && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ marginBottom: '2rem', padding: '1.5rem', background: '#fff', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}
                >
                    <h3 style={{ marginBottom: '1rem' }}>New Allocation</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>

                        <select
                            value={newAllocation.asset}
                            onChange={(e) => setNewAllocation({ ...newAllocation, asset: e.target.value })}
                            style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                        >
                            <option value="">Select Asset</option>
                            {assets.map(asset => (
                                <option key={asset.id} value={asset.id}>{asset.asset_name} ({asset.asset_lot_number})</option>
                            ))}
                        </select>

                        <select
                            value={newAllocation.assigned_to}
                            onChange={(e) => setNewAllocation({ ...newAllocation, assigned_to: e.target.value })}
                            style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                        >
                            <option value="">Select Employee</option>
                            {employees.map(emp => (
                                <option key={emp.id} value={emp.id}>{emp.employee_first_name} {emp.employee_last_name}</option>
                            ))}
                        </select>

                        <input
                            type="date"
                            value={newAllocation.allocation_date}
                            onChange={(e) => setNewAllocation({ ...newAllocation, allocation_date: e.target.value })}
                            style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                        />

                        <input
                            type="text"
                            placeholder="Condition (e.g., New, Good)"
                            value={newAllocation.condition_on_checkout}
                            onChange={(e) => setNewAllocation({ ...newAllocation, condition_on_checkout: e.target.value })}
                            style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                        />

                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button onClick={handleAllocate} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                            <FaCheck /> Allocate
                        </button>
                        <button onClick={() => setIsAdding(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                            <FaTimes /> Cancel
                        </button>
                    </div>
                </motion.div>
            )}

            <div style={{ display: 'grid', gap: '1rem' }}>
                {allocations.map((alloc) => (
                    <motion.div
                        key={alloc.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{
                            backgroundColor: '#fff',
                            borderRadius: '12px',
                            padding: '1rem',
                            border: '1px solid #eef2f6',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.01)'
                        }}
                    >
                        <div>
                            <h4 style={{ margin: 0, color: '#1e293b' }}>{alloc.asset_name}</h4>
                            <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: '#64748b' }}>
                                Assigned to: <strong>{alloc.employee}</strong> | Date: {alloc.allocation_date}
                            </p>
                        </div>
                        <div>
                            {alloc.return_date ? (
                                <span style={{ padding: '0.25rem 0.5rem', background: '#e2e8f0', color: '#475569', borderRadius: '6px', fontSize: '0.8rem' }}>Returned: {alloc.return_date}</span>
                            ) : (
                                <button
                                    onClick={() => handleReturn(alloc.id)}
                                    style={{ padding: '0.5rem 1rem', background: '#fff1f2', color: '#be123c', border: '1px solid #fecdd3', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem' }}
                                >
                                    Return Asset
                                </button>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default AssetAllocations;
