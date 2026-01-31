import React, { useState } from 'react';
import { FaCog, FaDatabase, FaNetworkWired, FaShieldAlt } from 'react-icons/fa';
import ModuleLayout from '../../components/common/ModuleLayout';
import ModulePlaceholder from '../../components/common/ModulePlaceholder';

const Configuration = () => {
    const [activeSub, setActiveSub] = useState('general');

    const subModules = [
        { id: 'general', name: 'General Settings', icon: <FaCog /> },
        { id: 'database', name: 'Database', icon: <FaDatabase /> },
        { id: 'api', name: 'API Configuration', icon: <FaNetworkWired /> },
        { id: 'security', name: 'Security', icon: <FaShieldAlt /> },
    ];

    const renderContent = () => {
        switch (activeSub) {
            case 'general':
                return <ModulePlaceholder name="General Configuration" description="Configure core system behavior, company defaults, and global parameters." />;
            case 'database':
                return <ModulePlaceholder name="Database Settings" description="Manage database connections, backups, and synchronization schedules." />;
            case 'api':
                return <ModulePlaceholder name="API Management" description="Configure external integrations, webhooks, and third-party service credentials." />;
            case 'security':
                return <ModulePlaceholder name="Security Policy" description="Define password policies, MFA requirements, and overall system security hardening." />;
            default:
                return null;
        }
    };

    return (
        <ModuleLayout
            title="Configuration"
            subModules={subModules}
            activeSubModule={activeSub}
            onSubModuleChange={setActiveSub}
        >
            {renderContent()}
        </ModuleLayout>
    );
};

export default Configuration;
