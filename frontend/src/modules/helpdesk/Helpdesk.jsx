import React, { useState } from 'react';
import { FaTicketAlt, FaInbox, FaUserSecret, FaQuestionCircle } from 'react-icons/fa';
import ModuleLayout from '../../components/common/ModuleLayout';
import ModulePlaceholder from '../../components/common/ModulePlaceholder';

const Helpdesk = () => {
    const [activeSub, setActiveSub] = useState('tickets');

    const subModules = [
        { id: 'tickets', name: 'Open Tickets', icon: <FaTicketAlt /> },
        { id: 'assigned', name: 'My Tickets', icon: <FaInbox /> },
        { id: 'whistle', name: 'Whistleblower', icon: <FaUserSecret /> },
        { id: 'kb', name: 'Knowledge Base', icon: <FaQuestionCircle /> },
    ];

    const renderContent = () => {
        switch (activeSub) {
            case 'tickets': return <ModulePlaceholder name="Support Queue" description="Overview of all pending support requests" />;
            case 'assigned': return <ModulePlaceholder name="Personal Workspace" description="Tickets assigned to you for resolution" />;
            case 'whistle': return <ModulePlaceholder name="Anonymous Grievance" description="Secure portal for reporting workplace issues" />;
            case 'kb': return <ModulePlaceholder name="FAQ & Guides" description="Company self-help documentation and policies" />;
            default: return null;
        }
    };

    return (
        <ModuleLayout
            title="Helpdesk"
            subModules={subModules}
            activeSubModule={activeSub}
            onSubModuleChange={setActiveSub}
        >
            {renderContent()}
        </ModuleLayout>
    );
};

export default Helpdesk;
