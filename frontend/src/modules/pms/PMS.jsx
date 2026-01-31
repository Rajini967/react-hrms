import React, { useState } from 'react';
import { FaUserEdit, FaBullseye, FaSync, FaAward } from 'react-icons/fa';
import ModuleLayout from '../../components/common/ModuleLayout';
import Goals from './submodules/Goals';
import ModulePlaceholder from '../../components/common/ModulePlaceholder';

const PMS = () => {
    const [activeSub, setActiveSub] = useState('goals');

    const subModules = [
        { id: 'appraisals', name: 'Appraisals', icon: <FaUserEdit /> },
        { id: 'goals', name: 'Goals & OKRs', icon: <FaBullseye /> },
        { id: 'feedback', name: '360 Feedback', icon: <FaSync /> },
        { id: 'recognition', name: 'Recognition', icon: <FaAward /> },
    ];

    const renderContent = () => {
        switch (activeSub) {
            case 'appraisals': return <ModulePlaceholder name="Performance Appraisals" description="Conduct annual and quarterly performance reviews, manage self-assessments, and review manager feedback." />;
            case 'goals': return <Goals />;
            case 'feedback': return <ModulePlaceholder name="360° Feedback" description="Gather multi-perspective feedback from peers, subordinates, and supervisors to gain a holistic view of performance." />;
            case 'recognition': return <ModulePlaceholder name="Employee Recognition" description="Celebrate achievements, award badges, and showcase top performers across the organization." />;
            default: return null;
        }
    };

    return (
        <ModuleLayout
            title="Performance"
            subModules={subModules}
            activeSubModule={activeSub}
            onSubModuleChange={setActiveSub}
        >
            {renderContent()}
        </ModuleLayout>
    );
};

export default PMS;
