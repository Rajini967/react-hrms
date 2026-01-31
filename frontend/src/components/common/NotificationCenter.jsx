import React, { useState, useEffect } from 'react';
import { FaBell } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';

const NotificationCenter = () => {
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const toggleNotifications = () => {
        setShowNotifications(!showNotifications);
        if (!showNotifications) {
            // markAsRead();
        }
    };

    const fetchNotifications = async () => {
        try {
            // Placeholder: Replace with actual API endpoint
            // const response = await api.get('/notifications/');
            // setNotifications(response.data);
            // setUnreadCount(response.data.filter(n => !n.read).length);
            setNotifications([]);
            setUnreadCount(0);
        } catch (error) {
            console.error('Failed to fetch notifications');
        }
    };

    useEffect(() => {
        // fetchNotifications();
    }, []);

    return (
        <div style={{ position: 'relative' }}>
            <button
                onClick={toggleNotifications}
                style={{
                    position: 'relative',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-secondary)',
                    fontSize: '1.2rem',
                    padding: '0.5rem',
                    borderRadius: '50%',
                    transition: 'background-color 0.2s',
                    ':hover': { backgroundColor: '#f1f5f9' }
                }}
                title="Notifications"
            >
                <FaBell />
                {unreadCount > 0 && (
                    <span
                        style={{
                            position: 'absolute',
                            top: '2px',
                            right: '2px',
                            backgroundColor: '#ef4444',
                            color: 'white',
                            fontSize: '0.65rem',
                            fontWeight: 'bold',
                            minWidth: '16px',
                            height: '16px',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '0 4px',
                            border: '2px solid white'
                        }}
                    >
                        {unreadCount}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {showNotifications && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        style={{
                            position: 'absolute',
                            top: '100%',
                            right: '-10px',
                            width: '320px',
                            backgroundColor: 'white',
                            borderRadius: '12px',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                            border: '1px solid #e2e8f0',
                            marginTop: '0.5rem',
                            zIndex: 100,
                            overflow: 'hidden'
                        }}
                    >
                        <div style={{ padding: '1rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600, color: '#1e293b' }}>Notifications</h3>
                            {unreadCount > 0 && (
                                <button style={{ border: 'none', background: 'none', color: 'var(--primary-color)', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 500 }}>
                                    Mark all read
                                </button>
                            )}
                        </div>
                        <div style={{ maxHeight: '360px', overflowY: 'auto' }}>
                            {notifications.length === 0 ? (
                                <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b', fontSize: '0.9rem' }}>
                                    No new notifications
                                </div>
                            ) : (
                                notifications.map((notification) => (
                                    <div key={notification.id} style={{ padding: '1rem', borderBottom: '1px solid #f1f5f9', cursor: 'pointer', ':hover': { backgroundColor: '#f8fafc' } }}>
                                        <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.9rem', color: '#334155' }}>{notification.message}</p>
                                        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{notification.time}</span>
                                    </div>
                                ))
                            )}
                        </div>
                        <div style={{ padding: '0.75rem', borderTop: '1px solid #f1f5f9', textAlign: 'center' }}>
                            <button style={{ border: 'none', background: 'none', color: 'var(--primary-color)', fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer' }}>
                                View All
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NotificationCenter;
