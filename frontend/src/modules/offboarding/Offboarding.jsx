import React, { useState } from 'react';
import { FaUserSlash, FaTasks, FaSignOutAlt, FaCommentDots } from 'react-icons/fa';
import ModuleLayout from '../../components/common/ModuleLayout';
import ModulePlaceholder from '../../components/common/ModulePlaceholder';

const Offboarding = () => {
    const [activeSub, setActiveSub] = useState('requests');

    const subModules = [
        { id: 'requests', name: 'Resignations', icon: <FaUserSlash /> },
        { id: 'tasks', name: 'Exit Tasks', icon: <FaTasks /> },
        { id: 'interview', name: 'Exit Interviews', icon: <FaCommentDots /> },
        { id: 'clearance', name: 'Full Settlement', icon: <FaSignOutAlt /> },
    ];

    const renderContent = () => {
        switch (activeSub) {
            case 'requests': return <ModulePlaceholder name="Termination & Resignation" description="Manage employee exit requests" />;
            case 'tasks': return <ModulePlaceholder name="Offboarding Checklist" description="Assets recovery and knowledge transfer" />;
            case 'interview': return <ModulePlaceholder name="Exit Interview Surveys" description="Gather feedback from departing employees" />;
            case 'clearance': return <ModulePlaceholder name="Final Settlement" description="Gratuity, notice pay and final clearance" />;
            default: return null;
        }
    };

    return (
        <ModuleLayout
            title="Offboarding"
            subModules={subModules}
            activeSubModule={activeSub}
            onSubModuleChange={setActiveSub}
        >
            {renderContent()}
        </ModuleLayout>
    );
};

export default Offboarding;
