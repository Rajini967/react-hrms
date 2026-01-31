import React, { useState } from 'react';
import { FaCogs, FaFileInvoiceDollar, FaGift, FaFileContract } from 'react-icons/fa';
import ModuleLayout from '../../components/common/ModuleLayout';
import Payslips from './submodules/Payslips';
import ModulePlaceholder from '../../components/common/ModulePlaceholder';

const Payroll = () => {
    const [activeSub, setActiveSub] = useState('payslips');

    const subModules = [
        { id: 'run', name: 'Payroll Run', icon: <FaCogs /> },
        { id: 'payslips', name: 'Payslips', icon: <FaFileInvoiceDollar /> },
        { id: 'benefits', name: 'Benefit Plans', icon: <FaGift /> },
        { id: 'contracts', name: 'Salary Contracts', icon: <FaFileContract /> },
    ];

    const renderContent = () => {
        switch (activeSub) {
            case 'run': return <ModulePlaceholder name="Payroll Execution" description="Process monthly salaries, calculate bonuses, and handle tax deductions for the current cycle." />;
            case 'payslips': return <Payslips />;
            case 'benefits': return <ModulePlaceholder name="Benefit Schemes" description="Manage employee health plans, insurance, retirement funds, and other perks." />;
            case 'contracts': return <ModulePlaceholder name="Employee Contracts" description="Review and manage individual salary agreements, increments, and payment terms." />;
            default: return null;
        }
    };

    return (
        <ModuleLayout
            title="Payroll"
            subModules={subModules}
            activeSubModule={activeSub}
            onSubModuleChange={setActiveSub}
        >
            {renderContent()}
        </ModuleLayout>
    );
};

export default Payroll;
