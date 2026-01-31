import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaUser, FaBriefcase, FaEnvelope, FaPhone, FaMapMarkerAlt, FaGlobe, FaMap, FaCity,
    FaGraduationCap, FaCalendarAlt, FaStar, FaUsers, FaBirthdayCake, FaTransgender,
    FaUniversity, FaFileAlt, FaEdit, FaPlus, FaClock, FaSync, FaUserCircle, FaPaperclip,
    FaArrowLeft, FaSuitcase, FaBuilding, FaLink, FaChild, FaPhoneSquare, FaUserShield, FaTrash
} from 'react-icons/fa';
import { Box, Chip, Grid, Typography, IconButton, Button, Paper, Divider, Tab, Tabs, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

import WorkTypeRequests from './WorkTypeRequests';
import ShiftRequests from './ShiftRequests';
import RotatingWorkTypeAssign from './RotatingWorkTypeAssign';
import RotatingShiftAssign from './RotatingShiftAssign';
import EmployeeDocuments from './EmployeeDocuments';
import AttendanceLogs from '../../attendance/submodules/AttendanceLogs';
import LeaveRequests from '../../leave/submodules/LeaveRequests';
import Payslips from '../../payroll/submodules/Payslips';
import AllowanceDeduction from './AllowanceDeduction';
import PenaltyAccount from './PenaltyAccount';
import PerformanceFeedback from './PerformanceFeedback';
import BonusPoints from './BonusPoints';
import ScheduledInterviews from './ScheduledInterviews';
import EmployeeAssets from './EmployeeAssets';


const EmployeeProfile = ({ employeeId, onBack }) => {
    const { user } = useAuth();
    const targetId = employeeId || user?.employeeId;
    const [employee, setEmployee] = useState(null);
    const [workInfo, setWorkInfo] = useState(null);
    const [bankInfo, setBankInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('about');
    const [subTab, setSubTab] = useState('work-type-request');
    const [workTab, setWorkTab] = useState('work');
    const [contracts, setContracts] = useState([]);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                // Fetch Employee Basic Info
                const empRes = await api.get(`/employee/employees/${targetId}/`);
                const empData = empRes.data;
                setEmployee(empData);

                // Fetch Work Info if ID exists
                if (empData.employee_work_info_id) {
                    try {
                        const workRes = await api.get(`/employee/employee-work-information/${empData.employee_work_info_id}/`);
                        setWorkInfo(workRes.data);
                    } catch (e) {
                        console.error("Error fetching work info", e);
                    }
                }

                // Fetch Bank Info if ID exists
                if (empData.employee_bank_details_id) {
                    try {
                        const bankRes = await api.get(`/employee/employee-bank-details/${empData.employee_bank_details_id}/`);
                        setBankInfo(bankRes.data);
                    } catch (e) {
                        console.error("Error fetching bank info", e);
                    }
                }

                // Fetch Contracts
                try {
                    const contractRes = await api.get(`/payroll/contract/?employee_id=${targetId}`);
                    setContracts(contractRes.data.results || contractRes.data);
                } catch (e) {
                    console.error("Error fetching contracts", e);
                }
            } catch (error) {
                console.error("Error fetching employee profile:", error);
            } finally {
                setLoading(false);
            }
        };

        if (targetId) {
            fetchDetails();
        } else {
            setLoading(false);
        }
    }, [targetId]);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    if (loading) return (
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '500px', gap: 2 }}>
            <Box sx={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid #f1f5f9', borderTopColor: 'primary.main', animation: 'spin 1s linear infinite' }} />
            <Typography variant="body1" sx={{ fontWeight: 600, color: '#64748b' }}>Securing Profile Data...</Typography>
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </Box>
    );

    if (!employee) return (
        <Box sx={{ p: 4, textAlign: 'center', maxWidth: 400, mx: 'auto', mt: 8 }}>
            <Box sx={{ mb: 3, color: '#cbd5e1' }}><FaUser size={64} /></Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>Employee Not Found</Typography>
            <Typography variant="body2" sx={{ color: '#64748b', mb: 3 }}>The profile you are looking for might have been moved or deleted.</Typography>
            <Button variant="contained" startIcon={<FaArrowLeft />} onClick={onBack} sx={{ borderRadius: '12px', textTransform: 'none', px: 4 }}>
                Return to Directory
            </Button>
        </Box>
    );

    const InfoItem = ({ icon: Icon, label, value }) => (
        <Box sx={{ mb: 3, minWidth: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <Box sx={{ color: '#94a3b8', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                    <Icon size={14} />
                </Box>
                <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {label}
                </Typography>
            </Box>
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#1e293b', ml: 3, wordBreak: 'break-word' }}>
                {value || 'None'}
            </Typography>
        </Box>
    );

    const renderAboutContent = () => (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, mt: 1 }}>
            {/* Personal Information - Forced 4 columns */}
            <Paper sx={{ p: 4, borderRadius: '4px', border: '1px solid #f1f5f9', boxShadow: 'none', bgcolor: '#fff' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#1e293b', mb: 4, fontSize: '0.95rem' }}>Personal Information</Typography>
                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                        xs: '1fr',
                        sm: 'repeat(2, 1fr)',
                        md: 'repeat(4, 1fr)'
                    },
                    gap: 3
                }}>
                    <InfoItem icon={FaCalendarAlt} label="Date of Birth" value={employee.dob} />
                    <InfoItem icon={FaUser} label="Gender" value={employee.gender} />
                    <InfoItem icon={FaMapMarkerAlt} label="Address" value={employee.address} />
                    <InfoItem icon={FaGlobe} label="Country" value={employee.country} />

                    <InfoItem icon={FaMap} label="State" value={employee.state} />
                    <InfoItem icon={FaCity} label="City" value={employee.city} />
                    <InfoItem icon={FaGraduationCap} label="Qualification" value={employee.qualification} />
                    <InfoItem icon={FaBriefcase} label="Experience" value={employee.experience ? `${employee.experience} Years` : 'None'} />

                    <InfoItem icon={FaLink} label="Marital Status" value={employee.marital_status} />
                    <InfoItem icon={FaChild} label="Children" value={employee.children || 'None'} />
                    <InfoItem icon={FaPhoneSquare} label="Emergency Contact" value={employee.emergency_contact} />
                    <Box></Box> {/* Empty cell to maintain grid */}

                    <InfoItem icon={FaUser} label="Emergency Contact Name" value={employee.emergency_contact_name} />
                    <InfoItem icon={FaUserShield} label="Emergency Contact Relation" value={employee.emergency_contact_relation} />
                </Box>
            </Paper>

            {/* Work & Contract Section - Forced 4 columns */}
            <Paper sx={{ borderRadius: '4px', border: '1px solid #f1f5f9', boxShadow: 'none', overflow: 'hidden', bgcolor: '#fff' }}>
                <Box sx={{ display: 'flex', borderBottom: '1px solid #f1f5f9' }}>
                    <Box
                        onClick={() => setWorkTab('work')}
                        sx={{
                            p: 2, px: 3, display: 'flex', alignItems: 'center', gap: 1.5,
                            borderRight: '1px solid #f1f5f9', cursor: 'pointer',
                            bgcolor: workTab === 'work' ? '#fff' : '#f8fafc',
                            color: workTab === 'work' ? 'primary.main' : '#64748b',
                            transition: '0.2s',
                            borderBottom: workTab === 'work' ? '2px solid' : 'none',
                            borderColor: 'primary.main'
                        }}
                    >
                        <FaBriefcase />
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>Work Information</Typography>
                    </Box>
                    <Box
                        onClick={() => setWorkTab('contract')}
                        sx={{
                            p: 2, px: 3, display: 'flex', alignItems: 'center', gap: 1.5,
                            cursor: 'pointer',
                            bgcolor: workTab === 'contract' ? '#fff' : '#f8fafc',
                            color: workTab === 'contract' ? 'primary.main' : '#64748b',
                            transition: '0.2s',
                            borderBottom: workTab === 'contract' ? '2px solid' : 'none',
                            borderColor: 'primary.main'
                        }}
                    >
                        <FaFileAlt />
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>Contract details</Typography>
                    </Box>
                </Box>

                <Box sx={{ p: 4 }}>
                    {workTab === 'work' ? (
                        <>
                            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#1e293b', mb: 4, fontSize: '0.95rem' }}>Work Information</Typography>
                            <Box sx={{
                                display: 'grid',
                                gridTemplateColumns: {
                                    xs: '1fr',
                                    sm: 'repeat(2, 1fr)',
                                    md: 'repeat(4, 1fr)'
                                },
                                gap: 3
                            }}>
                                <InfoItem icon={FaBriefcase} label="Department" value={workInfo?.department_name} />
                                <InfoItem icon={FaSuitcase} label="Job Position" value={workInfo?.job_position_name} />
                                <InfoItem icon={FaClock} label="Shift Information" value={workInfo?.shift_name} />
                                <InfoItem icon={FaClock} label="Work Type" value={workInfo?.work_type_name} />

                                <InfoItem icon={FaUserCircle} label="Employee Type" value={workInfo?.employee_type_name} />
                                <InfoItem icon={FaUniversity} label="Salary" value={workInfo?.basic_salary} />
                                <InfoItem icon={FaUser} label="Reporting Manager" value={workInfo?.reporting_manager_first_name ? `${workInfo.reporting_manager_first_name} ${workInfo.reporting_manager_last_name}` : 'None'} />
                                <InfoItem icon={FaBuilding} label="Company" value={workInfo?.company_name} />

                                <InfoItem icon={FaMapMarkerAlt} label="Work Location" value={workInfo?.location} />
                                <InfoItem icon={FaCalendarAlt} label="Joining Date" value={workInfo?.date_joining} />
                                <InfoItem icon={FaCalendarAlt} label="End Date" value={workInfo?.contract_end_date} />
                                <InfoItem icon={FaPaperclip} label="Tags" value={workInfo?.tags?.map(t => t.title).join(', ')} />
                            </Box>
                        </>
                    ) : (
                        <Box sx={{ overflowX: 'auto' }}>
                            <TableContainer>
                                <Table sx={{ minWidth: 800 }}>
                                    <TableHead>
                                        <TableRow sx={{ bgcolor: '#f8fafc' }}>
                                            <TableCell sx={{ fontWeight: 700, position: 'sticky', left: 0, bgcolor: '#f8fafc', zIndex: 1, minWidth: 250 }}>Contract</TableCell>
                                            <TableCell sx={{ fontWeight: 700, minWidth: 120 }}>Start Date</TableCell>
                                            <TableCell sx={{ fontWeight: 700, minWidth: 120 }}>End Date</TableCell>
                                            <TableCell sx={{ fontWeight: 700, minWidth: 120 }}>Wage Type</TableCell>
                                            <TableCell sx={{ fontWeight: 700, minWidth: 120 }}>Basic Salary</TableCell>
                                            <TableCell sx={{ fontWeight: 700, minWidth: 150 }}>Filing Status</TableCell>
                                            <TableCell sx={{ fontWeight: 700, minWidth: 100 }}>Status</TableCell>
                                            <TableCell sx={{ fontWeight: 700, textAlign: 'right', minWidth: 100 }}>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {contracts.length > 0 ? (
                                            contracts.map((contract) => (
                                                <TableRow key={contract.id} sx={{ '&:hover': { bgcolor: '#fcfdfe' } }}>
                                                    <TableCell sx={{ fontWeight: 600, position: 'sticky', left: 0, bgcolor: '#fff', borderRight: '1px solid #f1f5f9', zIndex: 1, minWidth: 250 }}>
                                                        {contract.contract_name}
                                                    </TableCell>
                                                    <TableCell>{contract.contract_start_date}</TableCell>
                                                    <TableCell>{contract.contract_end_date || 'None'}</TableCell>
                                                    <TableCell sx={{ textTransform: 'capitalize' }}>{contract.wage_type}</TableCell>
                                                    <TableCell>{contract.wage}</TableCell>
                                                    <TableCell>{contract.filing_status_name || 'None'}</TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            label={contract.contract_status}
                                                            size="small"
                                                            sx={{
                                                                textTransform: 'capitalize',
                                                                bgcolor: contract.contract_status === 'active' ? '#f0fdf4' : '#f8fafc',
                                                                color: contract.contract_status === 'active' ? '#16a34a' : '#64748b',
                                                                fontWeight: 600
                                                            }}
                                                        />
                                                    </TableCell>
                                                    <TableCell sx={{ textAlign: 'right' }}>
                                                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                                                            <IconButton size="small" sx={{ border: '1px solid #eef2f6', color: 'primary.main' }}>
                                                                <FaEdit size={12} />
                                                            </IconButton>
                                                            <IconButton size="small" sx={{ border: '1px solid #fee2e2', color: '#ef4444' }}>
                                                                <FaTrash size={12} />
                                                            </IconButton>
                                                        </Box>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={8} align="center" sx={{ py: 4, color: '#94a3b8' }}>
                                                    No contracts found
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    )}
                </Box>
            </Paper>

            {/* Bank Information - Forced 4 columns */}
            <Paper sx={{ p: 4, borderRadius: '4px', border: '1px solid #f1f5f9', boxShadow: 'none', bgcolor: '#fff' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#1e293b', mb: 4, fontSize: '0.95rem' }}>Bank Information</Typography>
                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                        xs: '1fr',
                        sm: 'repeat(2, 1fr)',
                        md: 'repeat(4, 1fr)'
                    },
                    gap: 3
                }}>
                    <InfoItem icon={FaUniversity} label="Bank Name" value={bankInfo?.bank_name} />
                    <InfoItem icon={FaMapMarkerAlt} label="Branch" value={bankInfo?.branch} />
                    <InfoItem icon={FaFileAlt} label="Account Number" value={bankInfo?.account_number} />
                    <InfoItem icon={FaFileAlt} label="Bank Code #1" value="None" />

                    <InfoItem icon={FaFileAlt} label="Bank Code #2" value="None" />
                    <InfoItem icon={FaGlobe} label="Country" value="None" />
                    <InfoItem icon={FaMapMarkerAlt} label="Bank Address" value="None" />
                </Box>
            </Paper>
        </Box>
    );

    const renderShiftContent = () => {
        const subNavItems = [
            { id: 'work-type-request', label: 'Work type request', icon: FaUserCircle },
            { id: 'rotating-work-type', label: 'Rotating work type', icon: FaSync },
            { id: 'shift-request', label: 'Shift request', icon: FaCalendarAlt },
            { id: 'rotating-shift', label: 'Rotating Shift', icon: FaClock },
        ];

        return (
            <Box>
                <Paper sx={{ mb: 3, borderRadius: '8px', border: '1px solid #eef2f6', overflow: 'hidden', boxShadow: 'none' }}>
                    <Box sx={{ display: 'flex', borderBottom: '1px solid #eef2f6' }}>
                        {subNavItems.map((item, index) => (
                            <Box
                                key={item.id}
                                onClick={() => setSubTab(item.id)}
                                sx={{
                                    flex: 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    p: 2.5,
                                    cursor: 'pointer',
                                    borderRight: index < subNavItems.length - 1 ? '1px solid #eef2f6' : 'none',
                                    bgcolor: subTab === item.id ? '#fff' : '#fcfdfe',
                                    transition: '0.2s',
                                    '&:hover': { bgcolor: '#fff' }
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                    <item.icon size={18} color={subTab === item.id ? '#ff4d4f' : '#64748b'} />
                                    <Typography variant="body2" sx={{
                                        fontWeight: 600,
                                        color: subTab === item.id ? '#1e293b' : '#64748b',
                                        fontSize: '0.85rem'
                                    }}>
                                        {item.label}
                                    </Typography>
                                </Box>
                                <IconButton
                                    size="small"
                                    sx={{
                                        borderRadius: '4px',
                                        border: '1px solid #ff4d4f20',
                                        color: '#ff4d4f',
                                        bgcolor: '#fff1f0',
                                        width: 24,
                                        height: 24,
                                        '&:hover': { bgcolor: '#ffccc7' }
                                    }}
                                >
                                    <FaPlus size={10} />
                                </IconButton>
                            </Box>
                        ))}
                    </Box>
                    <Box sx={{ p: 4 }}>
                        {subTab === 'work-type-request' && <WorkTypeRequests employeeId={targetId} />}
                        {subTab === 'rotating-work-type' && <RotatingWorkTypeAssign employeeId={targetId} />}
                        {subTab === 'shift-request' && <ShiftRequests employeeId={targetId} />}
                        {subTab === 'rotating-shift' && <RotatingShiftAssign employeeId={targetId} />}
                    </Box>
                </Paper>
            </Box>
        );
    };

    const TABS = [
        { label: 'About', value: 'about' },
        { label: 'Work Type & Shift', value: 'shift' },
        { label: 'Attendance', value: 'attendance' },
        { label: 'Leave', value: 'leave' },
        { label: 'Payroll', value: 'payroll' },
        { label: 'Allowance & Deduction', value: 'allowance' },
        { label: 'Penalty Account', value: 'penalty' },
        { label: 'Assets', value: 'assets' },
        { label: 'Performance', value: 'performance' },
        { label: 'Documents', value: 'documents' },
        { label: 'Bonus Points', value: 'bonus' },
        { label: 'Scheduled Interview', value: 'interview' },
    ];

    return (
        <Box sx={{ p: 3 }}>
            {!employeeId && (
                <Typography variant="h4" sx={{ mb: 3, fontWeight: 700, color: '#1e293b' }}>
                    My Profile
                </Typography>
            )}
            {/* Header / Breadcrumb */}
            {employeeId && (
                <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                    <Button
                        startIcon={<FaArrowLeft />}
                        onClick={onBack}
                        sx={{ color: '#64748b', textTransform: 'none', fontWeight: 600, '&:hover': { bgcolor: 'transparent', color: 'primary.main' } }}
                    >
                        Back to Directory
                    </Button>
                </Box>
            )}

            {/* Profile Overview Card */}
            <Paper sx={{
                p: 4,
                borderRadius: '8px',
                mb: 4,
                border: '1px solid #eef2f6',
                boxShadow: 'none',
                position: 'relative',
                bgcolor: '#fff'
            }}>
                <IconButton sx={{ position: 'absolute', top: 16, right: 16, color: 'primary.main', border: '1px solid #e2e8f0', bgcolor: '#fff' }}>
                    <FaEdit size={18} />
                </IconButton>
                <Grid container spacing={4} alignItems="center">
                    <Grid item>
                        <Box sx={{
                            width: 140,
                            height: 140,
                            borderRadius: '12px',
                            overflow: 'hidden',
                            bgcolor: '#2d333b',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            {employee.employee_profile ? (
                                <img src={employee.employee_profile} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <FaUser size={60} color="#fff" />
                            )}
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm>
                        <Typography variant="h3" sx={{ fontWeight: 600, color: '#1e293b', mb: 1 }}>
                            {employee.employee_first_name} {employee.employee_last_name}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={8}>
                        <Grid container spacing={3}>
                            <Grid item xs={6}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: '#64748b', mb: 1.5 }}>
                                    <FaEnvelope size={14} />
                                    <Typography variant="body2" sx={{ fontSize: '0.9rem' }}><span style={{ color: '#94a3b8' }}>Work Email:</span> <span style={{ fontWeight: 600, color: '#1e293b' }}>{employee.work_email || 'None'}</span></Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: '#64748b' }}>
                                    <FaEnvelope size={14} />
                                    <Typography variant="body2" sx={{ fontSize: '0.9rem' }}><span style={{ color: '#94a3b8' }}>Email:</span> <span style={{ fontWeight: 600, color: '#1e293b' }}>{employee.email || 'None'}</span></Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={6}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: '#64748b', mb: 1.5 }}>
                                    <FaPhone size={14} />
                                    <Typography variant="body2" sx={{ fontSize: '0.9rem' }}><span style={{ color: '#94a3b8' }}>Work Phone:</span> <span style={{ fontWeight: 600, color: '#1e293b' }}>{employee.work_phone || 'None'}</span></Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: '#64748b' }}>
                                    <FaPhone size={14} />
                                    <Typography variant="body2" sx={{ fontSize: '0.9rem' }}><span style={{ color: '#94a3b8' }}>Phone:</span> <span style={{ fontWeight: 600, color: '#1e293b' }}>{employee.phone || 'None'}</span></Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>

            {/* Navigation Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{
                        '& .MuiTab-root': {
                            textTransform: 'none',
                            fontWeight: 600,
                            fontSize: '0.9rem',
                            minWidth: 'auto',
                            px: 3,
                            color: '#64748b',
                        },
                        '& .Mui-selected': {
                            color: 'primary.main !important',
                        },
                        '& .MuiTabs-indicator': {
                            height: 3,
                            borderRadius: '3px 3px 0 0',
                        }
                    }}
                >
                    {TABS.map((tab) => (
                        <Tab key={tab.value} label={tab.label} value={tab.value} />
                    ))}
                </Tabs>
            </Box>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                >
                    {activeTab === 'about' && renderAboutContent()}
                    {activeTab === 'shift' && renderShiftContent()}
                    {activeTab === 'attendance' && <AttendanceLogs employeeId={targetId} />}
                    {activeTab === 'leave' && <LeaveRequests employeeId={targetId} />}
                    {activeTab === 'payroll' && <Payslips employeeId={targetId} minimal={true} />}
                    {activeTab === 'allowance' && <AllowanceDeduction employeeId={targetId} />}
                    {activeTab === 'penalty' && <PenaltyAccount employeeId={targetId} />}
                    {activeTab === 'performance' && <PerformanceFeedback employeeId={targetId} />}
                    {activeTab === 'documents' && <EmployeeDocuments employeeId={targetId} />}
                    {activeTab === 'bonus' && <BonusPoints employeeId={targetId} />}
                    {activeTab === 'interview' && <ScheduledInterviews employeeId={targetId} />}
                    {activeTab === 'assets' && <EmployeeAssets employeeId={targetId} />}
                </motion.div>
            </AnimatePresence>
        </Box>
    );
};

export default EmployeeProfile;
