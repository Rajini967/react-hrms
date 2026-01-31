import React, { useState } from 'react';
import { FaPaperPlane, FaChartPie, FaListAlt, FaCalendarAlt } from 'react-icons/fa';
import ModuleLayout from '../../components/common/ModuleLayout';
import LeaveRequests from './submodules/LeaveRequests';
import ModulePlaceholder from '../../components/common/ModulePlaceholder';

const Leave = () => {
    const [activeSub, setActiveSub] = useState('requests');

    const subModules = [
        { id: 'requests', name: 'Leave Requests', icon: <FaPaperPlane /> },
        { id: 'balance', name: 'Leave Balance', icon: <FaChartPie /> },
        { id: 'rules', name: 'Accrual Rules', icon: <FaListAlt /> },
        { id: 'holidays', name: 'Public Holidays', icon: <FaCalendarAlt /> },
    ];

    const renderContent = () => {
        switch (activeSub) {
            case 'requests': return <LeaveRequests />;
            case 'balance': return <ModulePlaceholder name="Leave Balances" description="View available leave days, historical usage, and entitlement summaries for all employees." />;
            case 'rules': return <ModulePlaceholder name="Leave Accrual Rules" description="Configure how leave days are earned based on tenure, contract type, and company policy." />;
            case 'holidays': return <ModulePlaceholder name="Public Holidays" description="Manage company-wide holidays and regional calendar observations." />;
            default: return null;
        }
    };

    return (
        <ModuleLayout
            title="Leave Management"
            subModules={subModules}
            activeSubModule={activeSub}
            onSubModuleChange={setActiveSub}
        >
            {renderContent()}
        </ModuleLayout>
    );
};

export default Leave;
