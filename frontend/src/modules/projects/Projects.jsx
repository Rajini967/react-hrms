import React, { useState } from 'react';
import { FaProjectDiagram, FaTasks, FaUserClock, FaFileInvoiceDollar } from 'react-icons/fa';
import ModuleLayout from '../../components/common/ModuleLayout';
import ModulePlaceholder from '../../components/common/ModulePlaceholder';

const Projects = () => {
    const [activeSub, setActiveSub] = useState('list');

    const subModules = [
        { id: 'list', name: 'Project List', icon: <FaProjectDiagram /> },
        { id: 'tasks', name: 'Project Tasks', icon: <FaTasks /> },
        { id: 'timesheets', name: 'Timesheets', icon: <FaUserClock /> },
        { id: 'budget', name: 'Budgeting', icon: <FaFileInvoiceDollar /> },
    ];

    const renderContent = () => {
        switch (activeSub) {
            case 'list': return <ModulePlaceholder name="Active Projects" description="Overview of client and internal projects" />;
            case 'tasks': return <ModulePlaceholder name="Milestones & Tasks" description="Track progress on deliverables" />;
            case 'timesheets': return <ModulePlaceholder name="Employee Timesheets" description="Time tracking logged against projects" />;
            case 'budget': return <ModulePlaceholder name="Financial Tracking" description="Manage project expenses and billing" />;
            default: return null;
        }
    };

    return (
        <ModuleLayout
            title="Projects"
            subModules={subModules}
            activeSubModule={activeSub}
            onSubModuleChange={setActiveSub}
        >
            {renderContent()}
        </ModuleLayout>
    );
};

export default Projects;
