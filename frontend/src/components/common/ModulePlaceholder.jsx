import React from 'react';
import { motion } from 'framer-motion';
import { FaRocket, FaHammer, FaDraftingCompass } from 'react-icons/fa';

const ModulePlaceholder = ({ name, description }) => {
    return (
        <div style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            border: '1px dashed #e2e8f0',
            padding: '2rem',
            textAlign: 'center'
        }}>
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, type: 'spring' }}
                style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '20px',
                    backgroundColor: 'rgba(79, 70, 229, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--primary-color)',
                    fontSize: '2.5rem',
                    marginBottom: '1.5rem'
                }}
            >
                <FaRocket />
            </motion.div>

            <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.5rem' }}
            >
                {name}
            </motion.h2>

            <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                style={{ color: '#64748b', fontSize: '1.1rem', maxWidth: '400px', lineHeight: 1.6 }}
            >
                {description || "We are currently building this module to provide you with the best experience. Stay tuned!"}
            </motion.p>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                style={{
                    marginTop: '2rem',
                    display: 'flex',
                    gap: '1rem',
                    alignItems: 'center',
                    color: '#94a3b8',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                }}
            >
                <FaHammer /> <span>Under Construction</span> <FaDraftingCompass />
            </motion.div>
        </div>
    );
};

export default ModulePlaceholder;
