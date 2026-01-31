import React, { useState } from 'react';
import { FaUserShield, FaCogs, FaChartPie, FaUsers, FaCamera } from 'react-icons/fa';
import ModuleLayout from '../../components/common/ModuleLayout';
import FaceConfig from './submodules/FaceConfig';
import FaceStats from './submodules/FaceStats';
import EmployeeFaceData from './submodules/EmployeeFaceData';
import ModulePlaceholder from '../../components/common/ModulePlaceholder';

const FaceDetection = () => {
    const [activeSub, setActiveSub] = useState('stats');

    const subModules = [
        { id: 'stats', name: 'Overview & Stats', icon: <FaChartPie /> },
        { id: 'employees', name: 'Employee Data', icon: <FaUsers /> },
        { id: 'config', name: 'Configuration', icon: <FaCogs /> },
        { id: 'verify', name: 'Live Verification', icon: <FaCamera /> },
    ];

    const renderContent = () => {
        switch (activeSub) {
            case 'stats': return <FaceStats />;
            case 'employees': return <EmployeeFaceData />;
            case 'config': return <FaceConfig />;
            case 'verify': return <ModulePlaceholder name="Live Verification" description="Use webcam to verify employee identity in real-time." />;
            default: return null;
        }
    };

    return (
        <ModuleLayout
            title="Face Recognition System"
            subModules={subModules}
            activeSubModule={activeSub}
            onSubModuleChange={setActiveSub}
        >
            {renderContent()}
        </ModuleLayout>
    );
};

export default FaceDetection;
