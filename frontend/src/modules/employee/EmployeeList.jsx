import React, { useState } from 'react';
import { FaAddressBook, FaSitemap, FaFileAlt, FaExchangeAlt, FaClock, FaSync, FaExclamationTriangle, FaBook, FaUser } from 'react-icons/fa';
import ModuleLayout from '../../components/common/ModuleLayout';
import EmployeeDirectory from './submodules/EmployeeDirectory';
import EmployeeProfile from './submodules/EmployeeProfile';
import DocumentRequests from './submodules/DocumentRequests';
import ShiftRequests from './submodules/ShiftRequests';
import WorkTypeRequests from './submodules/WorkTypeRequests';
import RotatingShiftAssign from './submodules/RotatingShiftAssign';
import RotatingWorkTypeAssign from './submodules/RotatingWorkTypeAssign';
import DisciplinaryActions from './submodules/DisciplinaryActions';
import Policies from './submodules/Policies';
import OrganizationChart from './submodules/OrganizationChart';

const EmployeeList = () => {
    const [activeSub, setActiveSub] = useState('directory');
    const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);

    const handleViewProfile = (id) => {
        setSelectedEmployeeId(id);
        setActiveSub('profile');
    };

    const subModules = [
        { id: 'directory', name: 'Employees', icon: <FaAddressBook /> },
        { id: 'profile', name: 'Profile', icon: <FaUser /> },
        { id: 'document-requests', name: 'Document Requests', icon: <FaFileAlt /> },
        { id: 'shift-requests', name: 'Shift Requests', icon: <FaClock /> },
        { id: 'work-type-requests', name: 'Work Type Requests', icon: <FaExchangeAlt /> },
        { id: 'rotating-shift-assign', name: 'Rotating Shift Assign', icon: <FaSync /> },
        { id: 'rotating-work-type-assign', name: 'Rotating Work Type Assign', icon: <FaSync /> },
        { id: 'disciplinary-actions', name: 'Disciplinary Actions', icon: <FaExclamationTriangle /> },
        { id: 'policies', name: 'Policies', icon: <FaBook /> },
        { id: 'orgchart', name: 'Organization Chart', icon: <FaSitemap /> },
    ];

    const renderContent = () => {
        switch (activeSub) {
            case 'directory':
                return <EmployeeDirectory onViewProfile={handleViewProfile} />;
            case 'profile':
                return <EmployeeProfile employeeId={selectedEmployeeId} onBack={() => setActiveSub('directory')} />;
            case 'document-requests': return <DocumentRequests />;
            case 'shift-requests': return <ShiftRequests />;
            case 'work-type-requests': return <WorkTypeRequests />;
            case 'rotating-shift-assign': return <RotatingShiftAssign />;
            case 'rotating-work-type-assign': return <RotatingWorkTypeAssign />;
            case 'disciplinary-actions': return <DisciplinaryActions />;
            case 'policies': return <Policies />;
            case 'orgchart': return <OrganizationChart />;
            default: return null;
        }
    };

    return (
        <ModuleLayout
            title="Employee Management"
            subModules={subModules}
            activeSubModule={activeSub}
            onSubModuleChange={setActiveSub}
        >
            {renderContent()}
        </ModuleLayout>
    );
};

export default EmployeeList;
