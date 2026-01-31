import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from 'react-icons/fa';

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const getIcon = () => {
        switch (type) {
            case 'success':
                return <FaCheckCircle size={20} />;
            case 'error':
                return <FaExclamationCircle size={20} />;
            case 'info':
                return <FaInfoCircle size={20} />;
            default:
                return <FaCheckCircle size={20} />;
        }
    };

    const getColors = () => {
        switch (type) {
            case 'success':
                return {
                    bg: '#10b981',
                    text: '#ffffff'
                };
            case 'error':
                return {
                    bg: '#ef4444',
                    text: '#ffffff'
                };
            case 'info':
                return {
                    bg: '#3b82f6',
                    text: '#ffffff'
                };
            default:
                return {
                    bg: '#10b981',
                    text: '#ffffff'
                };
        }
    };

    const colors = getColors();

    return (
        <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            style={{
                position: 'fixed',
                top: '2rem',
                right: '2rem',
                backgroundColor: colors.bg,
                color: colors.text,
                padding: '1rem 1.5rem',
                borderRadius: '12px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                zIndex: 9999,
                minWidth: '300px',
                maxWidth: '500px'
            }}
        >
            <div style={{ flexShrink: 0 }}>
                {getIcon()}
            </div>
            <div style={{ flex: 1, fontWeight: 500, fontSize: '0.95rem' }}>
                {message}
            </div>
            <button
                onClick={onClose}
                style={{
                    background: 'none',
                    border: 'none',
                    color: colors.text,
                    cursor: 'pointer',
                    padding: '0.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    opacity: 0.8
                }}
            >
                <FaTimes size={16} />
            </button>
        </motion.div>
    );
};

export default Toast;
