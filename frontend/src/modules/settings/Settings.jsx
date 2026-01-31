import React, { useState } from 'react';
import {
    FaArrowLeft, FaCog, FaLock, FaUserShield, FaUsers,
    FaCalendarAlt, FaTags, FaEnvelope, FaDatabase,
    FaRegBuilding, FaUserTie, FaUserFriends, FaClock,
    FaCalendarCheck, FaMoneyCheckAlt, FaChartLine, FaHeadset,
    FaProjectDiagram, FaMapMarkedAlt, FaRobot, FaLaptop, FaSlidersH
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import GeneralSettings from './submodules/GeneralSettings';
import DateTimeSettings from './submodules/DateTimeSettings';
import MailServerSettings from './submodules/MailServerSettings';
import Configuration from '../configuration/Configuration';
import Companies from './submodules/Companies';
import Departments from './submodules/Departments';
import JobPositions from './submodules/JobPositions';
import JobRoles from './submodules/JobRoles';
import CandidateSelfTracking from './submodules/CandidateSelfTracking';
import CandidateRejectReason from './submodules/CandidateRejectReason';
import Skills from './submodules/Skills';
import LinkedinIntegration from './submodules/LinkedinIntegration';
import WorkType from './submodules/WorkType';
import RotatingWorkType from './submodules/RotatingWorkType';
import EmployeeShift from './submodules/EmployeeShift';
import RotatingShift from './submodules/RotatingShift';
import EmployeeShiftSchedule from './submodules/EmployeeShiftSchedule';
import EmployeeType from './submodules/EmployeeType';
import DisciplinaryAction from './submodules/DisciplinaryAction';
import EmployeeTags from './submodules/EmployeeTags';
import EmployeePermission from './submodules/EmployeePermission';
import AccessibilityRestriction from './submodules/AccessibilityRestriction';
import UserGroup from './submodules/UserGroup';
import HistoryTags from './submodules/HistoryTags';
import GDriveBackup from './submodules/GDriveBackup';

import GeoFaceConfig from './submodules/GeoFaceConfig';
import AttendanceGeneralSettings from './submodules/AttendanceGeneralSettings';
import GraceTime from './submodules/GraceTime';
import AttendanceValidationCondition from './submodules/AttendanceValidationCondition';

import LeaveRestrictions from './submodules/LeaveRestrictions';
import CompensatoryLeave from './submodules/CompensatoryLeave';
import LeaveTypes from './submodules/LeaveTypes';
import CompanyLeaves from './submodules/CompanyLeaves';
import Holidays from './submodules/Holidays';
import PayslipAutoGeneration from './submodules/PayslipAutoGeneration';
import BonusPointSetting from './submodules/BonusPointSetting';
import DepartmentManagers from './submodules/DepartmentManagers';
import TicketTypeSetting from './submodules/TicketTypeSetting';

const Settings = () => {
    const navigate = useNavigate();
    const [activeCategory, setActiveCategory] = useState('General');
    const [activeSubModule, setActiveSubModule] = useState('General Settings');

    const categories = [
        {
            name: 'General', icon: <FaCog />, subModules: [
                'General Settings', 'Employee Permission', 'Accessibility Restriction',
                'User Group', 'Date & Time Format', 'History Tags', 'Mail Server', 'Gdrive Backup'
            ]
        },
        {
            name: 'Base',
            icon: <FaRegBuilding />,
            subModules: ['Company', 'Department', 'Job Positions', 'Job Role']
        },
        { name: 'Recruitment', icon: <FaUserTie />, subModules: ['Candidate Self Tracking', 'Candidate Reject Reason', 'Skills', 'Linkedin Integration'] },
        { name: 'Employee', icon: <FaUserFriends />, subModules: ['Work Type', 'Rotating Work Type', 'Employee Shift', 'Rotating Shift', 'Employee Shift Schedule', 'Employee Type', 'Disciplinary Action', 'Employee Tags'] },
        { name: 'Attendance', icon: <FaClock />, subModules: ['Check In/Check Out', 'Grace Time', 'Validation Condition', 'Geo & Face Config'] },
        { name: 'Leave', icon: <FaCalendarCheck />, subModules: ['Leave Types', 'Company Leaves', 'Holidays', 'Restrictions', 'Compensatory Leave'] },
        { name: 'Payroll', icon: <FaMoneyCheckAlt />, subModules: ['Payslip Auto Generation'] },
        { name: 'Performance', icon: <FaChartLine />, subModules: ['Bonus Point Setting'] },
        { name: 'Helpdesk', icon: <FaHeadset />, subModules: ['Department Managers', 'Ticket Type', 'Helpdesk Tags'] },
    ];

    const styles = {
        container: {
            display: 'flex',
            height: 'calc(100vh - 64px)',
            backgroundColor: '#f8f9fa',
        },
        sidebar: {
            width: '280px',
            backgroundColor: '#ffffff',
            borderRight: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
        },
        sidebarHeader: {
            padding: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            borderBottom: '1px solid var(--border-color)',
            cursor: 'pointer',
        },
        categoryList: {
            padding: '1rem 0',
        },
        categoryItem: {
            padding: '0.75rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            cursor: 'pointer',
            color: 'var(--text-secondary)',
            fontSize: '0.95rem',
            transition: 'all 0.2s',
        },
        activeCategory: {
            backgroundColor: '#f0f4ff',
            color: 'var(--primary-color)',
            fontWeight: 600,
        },
        subModuleList: {
            paddingLeft: '3rem',
            paddingBottom: '0.5rem',
        },
        subModuleItem: {
            padding: '0.5rem 0',
            fontSize: '0.85rem',
            cursor: 'pointer',
            color: 'var(--text-secondary)',
            transition: 'color 0.2s',
        },
        activeSubModule: {
            color: 'var(--primary-color)',
            fontWeight: 600,
        },
        content: {
            flex: 1,
            padding: '2rem',
            overflowY: 'auto',
        }
    };

    const renderContent = () => {
        if (activeCategory === 'General') {
            switch (activeSubModule) {
                case 'General Settings':
                    return <GeneralSettings />;
                case 'Date & Time Format':
                    return <DateTimeSettings />;
                case 'Mail Server':
                    return <MailServerSettings />;
                case 'Employee Permission':
                    return <EmployeePermission />;
                case 'Accessibility Restriction':
                    return <AccessibilityRestriction />;
                case 'User Group':
                    return <UserGroup />;
                case 'History Tags':
                    return <HistoryTags />;
                case 'Gdrive Backup':
                    return <GDriveBackup />;
                default:
                    return (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'var(--text-secondary)' }}>
                            <h3>{activeSubModule} module is under development</h3>
                        </div>
                    );
            }
        }
        if (activeCategory === 'Recruitment') {
            switch (activeSubModule) {
                case 'Candidate Self Tracking':
                    return <CandidateSelfTracking />;
                case 'Candidate Reject Reason':
                    return <CandidateRejectReason />;
                case 'Skills':
                    return <Skills />;
                case 'Linkedin Integration':
                    return <LinkedinIntegration />;
                default:
                    return null;
            }
        }
        if (activeCategory === 'Base') {
            switch (activeSubModule) {
                case 'Company':
                    return <Companies />;
                case 'Department':
                    return <Departments />;
                case 'Job Positions':
                    return <JobPositions />;
                case 'Job Role':
                    return <JobRoles />;
                default:
                    return null;
            }
        }
        if (activeCategory === 'Employee') {
            switch (activeSubModule) {
                case 'Work Type':
                    return <WorkType />;
                case 'Rotating Work Type':
                    return <RotatingWorkType />;
                case 'Employee Shift':
                    return <EmployeeShift />;
                case 'Rotating Shift':
                    return <RotatingShift />;
                case 'Employee Shift Schedule':
                    return <EmployeeShiftSchedule />;
                case 'Employee Type':
                    return <EmployeeType />;
                case 'Disciplinary Action':
                    return <DisciplinaryAction />;
                case 'Employee Tags':
                    return <EmployeeTags />;
                default:
                    return null;
            }
        }
        if (activeCategory === 'Attendance') {
            switch (activeSubModule) {
                case 'Geo & Face Config':
                    return <GeoFaceConfig />;
                case 'Check In/Check Out':
                    return <AttendanceGeneralSettings />;
                case 'Grace Time':
                    return <GraceTime />;
                case 'Validation Condition':
                    return <AttendanceValidationCondition />;
                default:
                    return (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'var(--text-secondary)' }}>
                            <h3>{activeSubModule} module is under development</h3>
                        </div>
                    );
            }
        }
        if (activeCategory === 'Leave') {
            switch (activeSubModule) {
                case 'Leave Types':
                    return <LeaveTypes />;
                case 'Company Leaves':
                    return <CompanyLeaves />;
                case 'Holidays':
                    return <Holidays />;
                case 'Restrictions':
                    return <LeaveRestrictions />;
                case 'Compensatory Leave':
                    return <CompensatoryLeave />;
                default:
                    return null;
            }
        }
        if (activeCategory === 'Payroll') {
            switch (activeSubModule) {
                case 'Payslip Auto Generation':
                    return <PayslipAutoGeneration />;
                default:
                    return null;
            }
        }
        if (activeCategory === 'Performance') {
            switch (activeSubModule) {
                case 'Bonus Point Setting':
                    return <BonusPointSetting />;
                default:
                    return null;
            }
        }
        if (activeCategory === 'Helpdesk') {
            switch (activeSubModule) {
                case 'Department Managers':
                    return <DepartmentManagers />;
                case 'Ticket Type':
                    return <TicketTypeSetting />;
                case 'Helpdesk Tags':
                    return <EmployeeTags />; // Placeholder for Tags
                default:
                    return null;
            }
        }
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'var(--text-secondary)' }}>
                <h3>{activeCategory} - {activeSubModule} module is under development</h3>
            </div>
        );
    };

    return (
        <div style={styles.container}>
            <div style={styles.sidebar}>
                <div style={styles.sidebarHeader} onClick={() => navigate(-1)}>
                    <FaArrowLeft />
                    <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Settings</h2>
                </div>
                <div style={styles.categoryList}>
                    {categories.map((cat) => (
                        <div key={cat.name}>
                            <div
                                style={{
                                    ...styles.categoryItem,
                                    ...(activeCategory === cat.name ? styles.activeCategory : {})
                                }}
                                onClick={() => {
                                    setActiveCategory(cat.name);
                                    setActiveSubModule(cat.subModules[0]);
                                }}
                            >
                                {cat.icon}
                                <span>{cat.name}</span>
                            </div>
                            {activeCategory === cat.name && (
                                <div style={styles.subModuleList}>
                                    {cat.subModules.map((sub) => (
                                        <div
                                            key={sub}
                                            style={{
                                                ...styles.subModuleItem,
                                                ...(activeSubModule === sub ? styles.activeSubModule : {})
                                            }}
                                            onClick={() => setActiveSubModule(sub)}
                                        >
                                            {sub}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <div style={styles.content}>
                {renderContent()}
            </div>
        </div>
    );
};

export default Settings;
