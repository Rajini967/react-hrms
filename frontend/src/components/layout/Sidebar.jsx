import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    FaHome, FaBriefcase, FaUserPlus, FaUsers, FaClock,
    FaCalendarAlt, FaMoneyBillWave, FaChartLine, FaUserMinus,
    FaBoxOpen, FaHeadset, FaProjectDiagram, FaCog, FaSlidersH
} from 'react-icons/fa';
import { motion } from 'framer-motion';

const Sidebar = () => {
    const menuItems = [
        { path: '/', name: 'Dashboard', icon: <FaHome /> },
        { path: '/recruitment', name: 'Recruitment', icon: <FaBriefcase /> },
        { path: '/onboarding', name: 'Onboarding', icon: <FaUserPlus /> },
        { path: '/employees', name: 'Employee', icon: <FaUsers /> },
        { path: '/attendance', name: 'Attendance', icon: <FaClock /> },
        { path: '/leave', name: 'Leave', icon: <FaCalendarAlt /> },
        { path: '/payroll', name: 'Payroll', icon: <FaMoneyBillWave /> },
        { path: '/pms', name: 'Performance', icon: <FaChartLine /> },
        { path: '/offboarding', name: 'Offboarding', icon: <FaUserMinus /> },
        { path: '/assets', name: 'Assets', icon: <FaBoxOpen /> },
        { path: '/face-recognition', name: 'Face Recognition', icon: <FaUserPlus /> }, // Using UserPlus for now or FaUserShield if imported
        { path: '/geofencing', name: 'Geofencing', icon: <FaProjectDiagram /> }, // Using ProjectDiagram or better icon
        { path: '/helpdesk', name: 'Helpdesk', icon: <FaHeadset /> },
        { path: '/projects', name: 'Project', icon: <FaProjectDiagram /> },
        { path: '/configuration', name: 'Configuration', icon: <FaCog /> },
        { path: '/settings', name: 'Settings', icon: <FaSlidersH /> },
    ];

    const sidebarStyle = {
        width: '260px',
        backgroundColor: '#ffffff',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        borderRight: '1px solid #eef2f6',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1000,
        boxShadow: '4px 0 10px rgba(0,0,0,0.02)',
    };

    const logoStyle = {
        padding: '2rem 1.5rem',
        fontSize: '1.5rem',
        fontWeight: '800',
        background: 'linear-gradient(135deg, var(--primary-color) 0%, #6366f1 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        letterSpacing: '-0.5px',
        borderBottom: '1px solid #f8fafc',
    };

    const menuStyle = {
        padding: '1rem 0.75rem',
        flex: 1,
        overflowY: 'auto',
        scrollbarWidth: 'none',
    };

    const linkStyle = ({ isActive }) => ({
        display: 'flex',
        alignItems: 'center',
        padding: '0.875rem 1rem',
        textDecoration: 'none',
        borderRadius: '12px',
        marginBottom: '4px',
        color: isActive ? 'var(--primary-color)' : '#64748b',
        backgroundColor: isActive ? 'rgba(79, 70, 229, 0.08)' : 'transparent',
        fontWeight: isActive ? 600 : 500,
        fontSize: '0.9375rem',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
    });

    return (
        <div style={sidebarStyle}>
            <div style={logoStyle}>Sync HRMS</div>
            <div style={menuStyle}>
                {menuItems.map((item) => (
                    <NavLink key={item.path} to={item.path} style={linkStyle}>
                        {({ isActive }) => (
                            <>
                                <span style={{
                                    marginRight: '1rem',
                                    fontSize: '1.1rem',
                                    display: 'flex',
                                    color: isActive ? 'var(--primary-color)' : '#94a3b8'
                                }}>
                                    {item.icon}
                                </span>
                                <span>{item.name}</span>
                                {isActive && (
                                    <motion.div
                                        layoutId="active-indicator"
                                        style={{
                                            position: 'absolute',
                                            left: '-0.75rem',
                                            width: '4px',
                                            height: '24px',
                                            backgroundColor: 'var(--primary-color)',
                                            borderRadius: '0 4px 4px 0'
                                        }}
                                    />
                                )}
                            </>
                        )}
                    </NavLink>
                ))}
            </div>
            <div style={{ padding: '1.5rem', borderTop: '1px solid #f1f5f9' }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '0.5rem',
                    borderRadius: '12px',
                    backgroundColor: '#f8fafc'
                }}>
                    <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        backgroundColor: 'var(--primary-color)',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 600
                    }}>JD</div>
                    <div style={{ overflow: 'hidden' }}>
                        <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1e293b', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>John Doe</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Administrator</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
