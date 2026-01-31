import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import ChatBot from '../common/ChatBot';

const Layout = () => {
    const layoutStyle = {
        marginLeft: '260px',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        width: 'calc(100% - 260px)',
        backgroundColor: '#fcfcfd'
    };

    const mainStyle = {
        flex: 1,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column'
    };

    return (
        <div>
            <Sidebar />
            <div style={layoutStyle}>
                <Header />
                <main style={mainStyle}>
                    <Outlet />
                </main>
                <ChatBot />
            </div>
        </div>
    );
};

export default Layout;
