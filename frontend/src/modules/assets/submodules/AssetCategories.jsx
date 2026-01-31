import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { motion } from 'framer-motion';
import { FaTags, FaPlus, FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';

const AssetCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentCategory, setCurrentCategory] = useState({ asset_category_name: '' });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await api.get('/asset/asset-categories/');
            setCategories(response.data.results || response.data || []);
        } catch (error) {
            console.error("Error fetching categories:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            try {
                await api.delete(`/asset/asset-categories/${id}`);
                setCategories(categories.filter(cat => cat.id !== id));
            } catch (error) {
                console.error("Error deleting category:", error);
            }
        }
    };

    const handleEdit = (category) => {
        setCurrentCategory(category);
        setIsEditing(true);
    };

    const handleSave = async () => {
        try {
            if (currentCategory.id) {
                await api.put(`/asset/asset-categories/${currentCategory.id}`, currentCategory);
                setCategories(categories.map(cat => cat.id === currentCategory.id ? currentCategory : cat));
            } else {
                const response = await api.post('/asset/asset-categories/', currentCategory);
                setCategories([...categories, response.data]);
            }
            setIsEditing(false);
            setCurrentCategory({ asset_category_name: '' });
        } catch (error) {
            console.error("Error saving category:", error);
        }
    };

    if (loading) return <div>Loading categories...</div>;

    return (
        <div style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b' }}>Asset Categories</h2>
                    <p style={{ color: '#64748b', marginTop: '0.25rem' }}>Manage types of assets in your organization</p>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={() => { setCurrentCategory({ asset_category_name: '' }); setIsEditing(true); }}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                >
                    <FaPlus /> Add Category
                </button>
            </div>

            {isEditing && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ marginBottom: '2rem', padding: '1.5rem', background: '#fff', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}
                >
                    <h3 style={{ marginBottom: '1rem' }}>{currentCategory.id ? 'Edit Category' : 'New Category'}</h3>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <input
                            type="text"
                            value={currentCategory.asset_category_name}
                            onChange={(e) => setCurrentCategory({ ...currentCategory, asset_category_name: e.target.value })}
                            placeholder="Category Name"
                            style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                        />
                        <button onClick={handleSave} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                            <FaSave /> Save
                        </button>
                        <button onClick={() => setIsEditing(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                            <FaTimes /> Cancel
                        </button>
                    </div>
                </motion.div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
                {categories.map((category, idx) => (
                    <motion.div
                        key={category.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        style={{
                            backgroundColor: '#fff',
                            borderRadius: '16px',
                            padding: '1.5rem',
                            border: '1px solid #eef2f6',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' }}>
                                <FaTags />
                            </div>
                            <span style={{ fontWeight: 600, color: '#1e293b' }}>{category.asset_category_name}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button onClick={() => handleEdit(category)} style={{ border: 'none', background: 'none', color: '#64748b', cursor: 'pointer', padding: '0.25rem' }}><FaEdit /></button>
                            <button onClick={() => handleDelete(category.id)} style={{ border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.25rem' }}><FaTrash /></button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default AssetCategories;
