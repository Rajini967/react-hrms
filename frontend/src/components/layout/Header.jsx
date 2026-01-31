import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { FaUserCircle, FaSignOutAlt, FaCog } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import NotificationCenter from '../common/NotificationCenter';

const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const headerStyle = {
        height: '64px',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 2rem',
        position: 'sticky',
        top: 0,
        zIndex: 90,
    };

    return (
        <header style={headerStyle}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                <div style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 500 }}>
                    <span style={{ cursor: 'pointer', hover: { color: 'var(--primary-color)' } }}>Main</span>
                    <span style={{ margin: '0 0.5rem', color: '#cbd5e1' }}>/</span>
                    <span style={{ color: '#1e293b', fontWeight: 600 }}>{window.location.pathname.split('/')[1] || 'Dashboard'}</span>
                </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <button
                    onClick={() => navigate('/settings')}
                    style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', background: 'none', border: 'none', cursor: 'pointer' }}
                    title="Settings"
                >
                    <FaCog />
                </button>
                <NotificationCenter />
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 1rem', borderRadius: '12px', backgroundColor: '#f8fafc', border: '1px solid #f1f5f9' }}>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e293b' }}>{user?.username || 'User'}</div>
                        <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Administrator</div>
                    </div>
                    <FaUserCircle style={{ fontSize: '1.75rem', color: 'var(--primary-color)' }} />
                </div>
                <button onClick={logout} style={{ color: '#ef4444', fontSize: '1.2rem', paddingLeft: '0.5rem', background: 'none', border: 'none', cursor: 'pointer' }} title="Logout">
                    <FaSignOutAlt />
                </button>
            </div>
        </header>
    );
};

export default Header;
