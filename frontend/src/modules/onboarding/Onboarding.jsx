import React, { useState } from 'react';
import { FaPlay, FaTasks, FaUserCheck, FaCogs } from 'react-icons/fa';
import ModuleLayout from '../../components/common/ModuleLayout';
import ActiveOnboarding from './submodules/ActiveOnboarding';
import OnboardingTasks from './submodules/OnboardingTasks';
import OnboardingStages from './submodules/OnboardingStages';
import ModulePlaceholder from '../../components/common/ModulePlaceholder';

const Onboarding = () => {
    const [activeSub, setActiveSub] = useState('active');

    const subModules = [
        { id: 'active', name: 'Active Onboarding', icon: <FaPlay /> },
        { id: 'tasks', name: 'Master Tasks', icon: <FaTasks /> },
        { id: 'stages', name: 'Onboarding Stages', icon: <FaCogs /> },
        { id: 'completed', name: 'Completed', icon: <FaUserCheck /> },
    ];

    const renderContent = () => {
        switch (activeSub) {
            case 'active': return <ActiveOnboarding />;
            case 'tasks': return <OnboardingTasks />;
            case 'stages': return <OnboardingStages />;
            case 'completed': return <ModulePlaceholder name="Onboarding History" description="View past successful onboardings and exit documentation." />;
            default: return null;
        }
    };

    return (
        <ModuleLayout
            title="Onboarding"
            subModules={subModules}
            activeSubModule={activeSub}
            onSubModuleChange={setActiveSub}
        >
            {renderContent()}
        </ModuleLayout>
    );
};

export default Onboarding;
