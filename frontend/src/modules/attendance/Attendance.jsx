import React, { useState } from 'react';
import { FaHistory, FaCalendarAlt, FaExclamationTriangle, FaUserClock } from 'react-icons/fa';
import ModuleLayout from '../../components/common/ModuleLayout';
import AttendanceLogs from './submodules/AttendanceLogs';
import ModulePlaceholder from '../../components/common/ModulePlaceholder';

const Attendance = () => {
    const [activeSub, setActiveSub] = useState('logs');

    const subModules = [
        { id: 'logs', name: 'Attendance Logs', icon: <FaHistory /> },
        { id: 'history', name: 'Monthly History', icon: <FaCalendarAlt /> },
        { id: 'requests', name: 'Correction Requests', icon: <FaExclamationTriangle /> },
        { id: 'late', name: 'Late & Absences', icon: <FaUserClock /> },
    ];

    const renderContent = () => {
        switch (activeSub) {
            case 'logs': return <AttendanceLogs />;
            case 'history': return <ModulePlaceholder name="Monthly Attendance History" description="Comprehensive calendar view of employee attendance, overtime, and work-hour summaries." />;
            case 'requests': return <ModulePlaceholder name="Attendance Corrections" description="Review and approve employee requests for clock-in/out adjustments." />;
            case 'late': return <ModulePlaceholder name="Late & Absence Tracking" description="Automated monitoring of late arrivals, early departures, and unauthorized absences." />;
            default: return null;
        }
    };

    return (
        <ModuleLayout
            title="Attendance"
            subModules={subModules}
            activeSubModule={activeSub}
            onSubModuleChange={setActiveSub}
        >
            {renderContent()}
        </ModuleLayout>
    );
};

export default Attendance;
