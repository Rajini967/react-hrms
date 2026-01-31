import React, { useState, useEffect } from 'react';
import {
    FaChartBar, FaTasks, FaBullhorn, FaUserShield, FaSearch,
    FaBirthdayCake, FaUserTie, FaCalendarCheck, FaClock,
    FaMoneyBillWave, FaUserEdit, FaBoxOpen, FaUserGraduate,
    FaUsers, FaExclamationTriangle, FaUserClock, FaHome, FaFileAlt
} from 'react-icons/fa';
import ModuleLayout from '../../components/common/ModuleLayout';
import api from '../../services/api';
import { motion } from 'framer-motion';
import {
    PieChart, Pie, Cell, ResponsiveContainer,
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';

const Widget = ({ title, children, showSearch = false }) => (
    <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #eef2f6',
        padding: '1.25rem',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 2px 4px rgba(0,0,0,0.01)'
    }}>
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem'
        }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{title}</h3>
            {showSearch && (
                <div style={{ position: 'relative' }}>
                    <FaSearch style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.8rem', color: '#94a3b8' }} />
                    <input
                        type="text"
                        placeholder="Search..."
                        style={{
                            padding: '4px 8px 4px 28px',
                            fontSize: '0.75rem',
                            borderRadius: '6px',
                            border: '1px solid #e2e8f0',
                            outline: 'none',
                            width: '100px',
                            backgroundColor: '#f8fafc'
                        }}
                    />
                </div>
            )}
        </div>
        <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'none' }}>
            {children}
        </div>
    </div>
);

const EmptyState = ({ message = "No Records found." }) => (
    <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        color: '#94a3b8',
        padding: '2rem 0',
        minHeight: '150px'
    }}>
        <FaSearch style={{ fontSize: '2rem', marginBottom: '0.75rem', opacity: 0.2 }} />
        <span style={{ fontSize: '0.8rem' }}>{message}</span>
    </div>
);

const Dashboard = () => {
    const [activeSub, setActiveSub] = useState('overview');
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        total_employees: 0,
        leave_today: 0,
        new_hires: 0,
        attendance_ratio: 0,
        offline_count: 0,
        pending_leaves: 0
    });

    const [jobOpenings, setJobOpenings] = useState([]);
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [birthdays, setBirthdays] = useState([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [dashRes, leaveStatusRes, recruitRes, leaveReqRes, attRatioRes, offlineRes, empRes] = await Promise.all([
                    api.get('/employee/dashboard/'),
                    api.get('/leave/status/'),
                    api.get('/recruitment/recruitments/'),
                    api.get('/leave/leave-request/'),
                    api.get('/attendance/today-attendance/'),
                    api.get('/attendance/offline-employees/count/'),
                    api.get('/employee/employees/')
                ]);

                setStats({
                    total_employees: dashRes.data.total_employees || 0,
                    leave_today: dashRes.data.on_leave_today || 0,
                    new_hires: dashRes.data.new_hires || 0,
                    pending_leaves: leaveStatusRes.data.requested || 0,
                    attendance_ratio: parseFloat(attRatioRes.data.marked_attendances_ratio || 0),
                    offline_count: offlineRes.data.count || 0
                });

                setJobOpenings(recruitRes.data.results || []);
                setLeaveRequests(leaveReqRes.data.results || []);

                // Process birthdays
                const today = new Date();
                const currentMonth = today.getMonth();
                const monthEmps = (empRes.data.results || []).filter(emp => {
                    const dob = emp.date_of_birth ? new Date(emp.date_of_birth) : null;
                    return dob && dob.getMonth() === currentMonth;
                });
                setBirthdays(monthEmps);

            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    const subModules = [
        { id: 'overview', name: 'Overview', icon: <FaChartBar /> },
        { id: 'tasks', name: 'My Tasks', icon: <FaTasks /> },
        { id: 'announcements', name: 'Announcements', icon: <FaBullhorn /> },
        { id: 'compliance', name: 'Compliance', icon: <FaUserShield /> },
    ];

    const chartData = [
        { name: 'Active', value: stats.total_employees, color: '#3b82f6' },
        { name: 'Offline', value: stats.offline_count, color: '#f59e0b' },
        { name: 'On Leave', value: stats.leave_today, color: '#ef4444' },
    ];

    const attendanceData = [
        { name: 'Mon', ratio: 85 },
        { name: 'Tue', ratio: 92 },
        { name: 'Wed', ratio: 88 },
        { name: 'Thu', ratio: 95 },
        { name: 'Fri', ratio: stats.attendance_ratio || 80 },
    ];

    const renderOverview = () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '2rem' }}>
            {/* Top Stats Bar */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
                {[
                    { label: 'Total Employees', value: stats.total_employees, color: '#10b981', icon: <FaUsers style={{ opacity: 0.2, fontSize: '2rem' }} /> },
                    { label: 'Leave Today', value: stats.leave_today, color: '#f59e0b', icon: <FaCalendarCheck style={{ opacity: 0.2, fontSize: '2rem' }} /> },
                    { label: 'Pending Approvals', value: stats.pending_leaves, color: '#3b82f6', icon: <FaClock style={{ opacity: 0.2, fontSize: '2rem' }} /> },
                    { label: 'Offline / Late', value: stats.offline_count, color: '#ef4444', icon: <FaExclamationTriangle style={{ opacity: 0.2, fontSize: '2rem' }} /> }
                ].map((item, idx) => (
                    <motion.div
                        key={idx}
                        whileHover={{ y: -5 }}
                        style={{
                            backgroundColor: '#fff',
                            padding: '1.25rem',
                            borderRadius: '12px',
                            boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                            border: '1px solid #f1f5f9',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        <div>
                            <div style={{ color: '#64748b', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem' }}>{item.label}</div>
                            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1e293b' }}>{item.value}</div>
                        </div>
                        <div style={{ color: item.color, fontSize: '2rem', opacity: 0.15 }}>
                            {idx === 0 && <FaUsers />}
                            {idx === 1 && <FaCalendarCheck />}
                            {idx === 2 && <FaClock />}
                            {idx === 3 && <FaUserClock />}
                        </div>
                        <div style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            width: '100%',
                            height: '4px',
                            backgroundColor: item.color,
                            borderRadius: '0 0 12px 12px',
                            opacity: 0.8
                        }} />
                    </motion.div>
                ))}
            </div>

            {/* Row 1: Birthdays, Openings, Announcements */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', minHeight: '320px' }}>
                <Widget title="Birthday of the month">
                    {birthdays.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {birthdays.map(emp => (
                                <div key={emp.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem', backgroundColor: '#f8fafc', borderRadius: '10px' }}>
                                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <FaBirthdayCake style={{ color: '#ec4899', fontSize: '0.8rem' }} />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{emp.employee_first_name} {emp.employee_last_name}</div>
                                        <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{emp.date_of_birth}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : <EmptyState message="No birthdays this month." />}
                </Widget>

                <Widget title="Job Openings" showSearch>
                    {jobOpenings.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {jobOpenings.slice(0, 5).map(job => (
                                <div key={job.id} style={{ padding: '0.75rem', backgroundColor: '#f0fdf4', border: '1px solid #dcfce7', borderRadius: '10px' }}>
                                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#166534' }}>{job.title}</div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '0.7rem', color: '#15803d' }}>
                                        <span>{job.job_type}</span>
                                        <span>{job.no_of_vacancies} Vacancy</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : <EmptyState />}
                </Widget>

                <Widget title="Announcements">
                    <div style={{ backgroundColor: '#fff7ed', padding: '0.75rem', borderRadius: '10px', border: '1px solid #ffedd5' }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#9a3412', marginBottom: '4px' }}>Welcome to Sync HRMS</div>
                        <p style={{ fontSize: '0.75rem', color: '#c2410c', lineHeight: 1.4 }}>The new employee portal is now live. Please update your profile information.</p>
                        <span style={{ fontSize: '0.65rem', color: '#ea580c', display: 'block', marginTop: '8px' }}>Admin • Today</span>
                    </div>
                </Widget>
            </div>

            {/* Row 2: Leave, Overtime, Analytics */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', minHeight: '320px' }}>
                <Widget title="Leave Requests for Approval">
                    {leaveRequests.filter(r => r.status === 'requested').length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {leaveRequests.filter(r => r.status === 'requested').slice(0, 5).map(req => (
                                <div key={req.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem', borderBottom: '1px solid #f1f5f9' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#4f46e5', color: '#fff', fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            {req.employee_name ? req.employee_name[0] : 'E'}
                                        </div>
                                        <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{req.employee_name}</span>
                                    </div>
                                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{req.requested_days} Days</span>
                                </div>
                            ))}
                        </div>
                    ) : <EmptyState />}
                </Widget>

                <Widget title="Attendance Analytics">
                    <div style={{ height: '220px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={attendanceData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                                <YAxis hide />
                                <Tooltip contentStyle={{ fontSize: '10px', borderRadius: '8px' }} />
                                <Line type="monotone" dataKey="ratio" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4, fill: '#4f46e5' }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    <div style={{ textAlign: 'center', color: '#64748b', fontSize: '0.75rem', fontWeight: 600 }}>WEEKLY ATTENDANCE TREND</div>
                </Widget>

                <Widget title="Employee Breakdown">
                    <div style={{ height: '200px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    innerRadius={55}
                                    outerRadius={75}
                                    paddingAngle={8}
                                    dataKey="value"
                                    cornerRadius={4}
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.75rem', fontSize: '0.65rem', fontWeight: 600 }}>
                        {chartData.map(c => (
                            <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: c.color }} />
                                <span style={{ color: '#64748b' }}>{c.name}</span>
                            </div>
                        ))}
                    </div>
                </Widget>
            </div>

            {/* Row 3: Skills, Assets, Summary */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
                <Widget title="Skills Inventory">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {[
                            { name: 'JavaScript', progress: 85, color: '#f59e0b' },
                            { name: 'Python', progress: 70, color: '#3b82f6' },
                            { name: 'UI/UX Design', progress: 60, color: '#ec4899' },
                        ].map((skill, i) => (
                            <div key={i}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                    <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>{skill.name}</span>
                                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{skill.progress}%</span>
                                </div>
                                <div style={{ height: '6px', backgroundColor: '#f1f5f9', borderRadius: '10px' }}>
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${skill.progress}%` }}
                                        style={{ height: '100%', backgroundColor: skill.color, borderRadius: '10px' }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </Widget>

                <Widget title="Company Status Summary">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div style={{ padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '10px', textAlign: 'center' }}>
                            <div style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 700 }}>PAYROLL STATUS</div>
                            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#10b981', marginTop: '4px' }}>NOT STARTED</div>
                        </div>
                        <div style={{ padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '10px', textAlign: 'center' }}>
                            <div style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 700 }}>TAX COMPLIANCE</div>
                            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#ef4444', marginTop: '4px' }}>URGENT</div>
                        </div>
                        <div style={{ padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '10px', textAlign: 'center' }}>
                            <div style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 700 }}>ASSET CAPACITY</div>
                            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#3b82f6', marginTop: '4px' }}>82%</div>
                        </div>
                        <div style={{ padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '10px', textAlign: 'center' }}>
                            <div style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 700 }}>OPEN POSITIONS</div>
                            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#4f46e5', marginTop: '4px' }}>{jobOpenings.length}</div>
                        </div>
                    </div>
                </Widget>

                <Widget title="Policy Updates">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {[
                            { title: 'Leave Policy 2026', date: 'Jan 1', icon: <FaFileAlt style={{ color: '#4f46e5' }} /> },
                            { title: 'Remote Work Guide', date: 'Jan 15', icon: <FaHome style={{ color: '#10b981' }} /> },
                        ].map((doc, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem', border: '1px solid #f1f5f9', borderRadius: '10px' }}>
                                {doc.icon}
                                <div>
                                    <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>{doc.title}</div>
                                    <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Effective: {doc.date}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Widget>
            </div>
        </div>
    );

    const renderContent = () => {
        if (loading) return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px', color: 'var(--primary-color)' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Loading Workspace...</div>
                    <div style={{ fontSize: '0.9rem', color: '#64748b' }}>Fetching your personalized HR dashboard</div>
                </div>
            </div>
        );

        switch (activeSub) {
            case 'overview': return renderOverview();
            case 'tasks': return (
                <div style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '12px', border: '1px solid #eef2f6' }}>
                    <h2 style={{ marginBottom: '1rem' }}>My Workspace</h2>
                    <p style={{ color: '#64748b' }}>Your personal tasks and approvals will appear here.</p>
                </div>
            );
            case 'announcements': return (
                <div style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '12px', border: '1px solid #eef2f6' }}>
                    <h2 style={{ marginBottom: '1rem' }}>Global Announcements</h2>
                    <p style={{ color: '#64748b' }}>Latest news and company-wide notifications.</p>
                </div>
            );
            case 'compliance': return (
                <div style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '12px', border: '1px solid #eef2f6' }}>
                    <h2 style={{ marginBottom: '1rem' }}>Compliance Center</h2>
                    <p style={{ color: '#64748b' }}>All organizational policies and certifications.</p>
                </div>
            );
            default: return null;
        }
    };

    const FaFileAlt = ({ style }) => <span style={style}><FaUserGraduate /></span>;
    const FaExclamationTriangle = ({ style }) => <span style={style}><FaClock /></span>;
    const FaUserClock = ({ style }) => <span style={style}><FaClock /></span>;

    return (
        <ModuleLayout
            title="Dashboard"
            subModules={subModules}
            activeSubModule={activeSub}
            onSubModuleChange={setActiveSub}
        >
            {renderContent()}
        </ModuleLayout>
    );
};

export default Dashboard;
