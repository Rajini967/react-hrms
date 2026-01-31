import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ModuleLayout = ({ title, subModules, activeSubModule, onSubModuleChange, children }) => {
    return (
        <div style={{ display: 'flex', height: 'calc(100vh - 64px)', width: '100%', overflow: 'hidden' }}>
            {/* Inner Module Sidebar */}
            <div style={{
                width: '240px',
                backgroundColor: '#fff',
                borderRight: '1px solid #f1f5f9',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                overflowY: 'auto',
                scrollbarWidth: 'thin'
            }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', color: '#1e293b' }}>{title}</h2>
                {subModules.map((sub) => (
                    <button
                        key={sub.id}
                        onClick={() => onSubModuleChange(sub.id)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            padding: '0.75rem 1rem',
                            borderRadius: '10px',
                            border: 'none',
                            backgroundColor: activeSubModule === sub.id ? 'var(--primary-color)' : 'transparent',
                            color: activeSubModule === sub.id ? '#fff' : '#64748b',
                            cursor: 'pointer',
                            fontSize: '0.9375rem',
                            fontWeight: 600,
                            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                            textAlign: 'left'
                        }}
                    >
                        <span style={{ fontSize: '1.1rem' }}>{sub.icon}</span>
                        {sub.name}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div style={{ flex: 1, padding: '2rem', overflowY: 'auto', position: 'relative' }}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeSubModule}
                        initial={{ opacity: 0, y: 10, filter: 'blur(5px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, y: -10, filter: 'blur(5px)' }}
                        transition={{ duration: 0.25 }}
                        style={{ height: '100%' }}
                    >
                        {children}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ModuleLayout;
