import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, Grid, LinearProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from '@mui/material';
import { FaTrophy, FaComments } from 'react-icons/fa';
import api from '../../../services/api';

const PerformanceFeedback = ({ employeeId }) => {
    const [objectives, setObjectives] = useState([]);
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch objectives
                const objRes = await api.get(`/pms/employee-objective/?employee_id=${employeeId}`);
                setObjectives(objRes.data.results || objRes.data || []);

                // Fetch feedbacks
                const feedRes = await api.get(`/pms/feedback/?employee_id=${employeeId}`);
                setFeedbacks(feedRes.data.results || feedRes.data || []);
            } catch (error) {
                console.error("Error fetching performance data:", error);
            } finally {
                setLoading(false);
            }
        };
        if (employeeId) fetchData();
    }, [employeeId]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'On Track': return '#10b981';
            case 'At Risk': return '#f59e0b';
            case 'Behind': return '#ef4444';
            case 'Closed': return '#64748b';
            default: return '#3b82f6';
        }
    };

    if (loading) return <Typography sx={{ p: 4, textAlign: 'center' }}>Loading performance data...</Typography>;

    return (
        <Box>
            <Grid container spacing={4}>
                {/* Objectives Section */}
                <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                        <Box sx={{ p: 1, borderRadius: '8px', bgcolor: '#eff6ff', color: '#3b82f6' }}>
                            <FaTrophy />
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>Objectives & OKRs</Typography>
                    </Box>
                    <Grid container spacing={2}>
                        {objectives.length > 0 ? objectives.map((obj) => (
                            <Grid item xs={12} md={6} key={obj.id}>
                                <Paper sx={{ p: 3, borderRadius: '16px', border: '1px solid #eef2f6', boxShadow: 'none' }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1e293b' }}>{obj.objective || 'Unnamed Objective'}</Typography>
                                        <Chip
                                            label={obj.status}
                                            size="small"
                                            sx={{
                                                bgcolor: `${getStatusColor(obj.status)}15`,
                                                color: getStatusColor(obj.status),
                                                fontWeight: 700,
                                                fontSize: '0.7rem'
                                            }}
                                        />
                                    </Box>
                                    <Box sx={{ mb: 1 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                            <Typography variant="caption" color="textSecondary">Progress</Typography>
                                            <Typography variant="caption" sx={{ fontWeight: 700 }}>{obj.progress_percentage}%</Typography>
                                        </Box>
                                        <LinearProgress
                                            variant="determinate"
                                            value={obj.progress_percentage}
                                            sx={{ height: 6, borderRadius: 3, bgcolor: '#f1f5f9', '& .MuiLinearProgress-bar': { bgcolor: getStatusColor(obj.status) } }}
                                        />
                                    </Box>
                                    <Typography variant="caption" sx={{ color: '#64748b' }}>Due: {obj.end_date}</Typography>
                                </Paper>
                            </Grid>
                        )) : (
                            <Grid item xs={12}>
                                <Paper sx={{ p: 4, textAlign: 'center', borderRadius: '16px', border: '1px solid #eef2f6', boxShadow: 'none' }}>
                                    <Typography variant="body2" color="textSecondary">No active objectives assigned.</Typography>
                                </Paper>
                            </Grid>
                        )}
                    </Grid>
                </Grid>

                {/* Feedback Section */}
                <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                        <Box sx={{ p: 1, borderRadius: '8px', bgcolor: '#f5f3ff', color: '#8b5cf6' }}>
                            <FaComments />
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>Feedback Reviews</Typography>
                    </Box>
                    <TableContainer component={Paper} sx={{ borderRadius: '16px', border: '1px solid #eef2f6', boxShadow: 'none' }}>
                        <Table>
                            <TableHead sx={{ bgcolor: '#f8fafc' }}>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 600 }}>Review Cycle</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Reviewer</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 600 }}>Period</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {feedbacks.length > 0 ? feedbacks.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell sx={{ fontWeight: 600 }}>{item.review_cycle}</TableCell>
                                        <TableCell>{item.manager_name || 'Manager'}</TableCell>
                                        <TableCell>
                                            <Chip label={item.status} size="small" variant="outlined" />
                                        </TableCell>
                                        <TableCell align="right" sx={{ color: '#64748b', fontSize: '0.8rem' }}>
                                            {item.start_date} - {item.end_date}
                                        </TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={4} align="center" sx={{ py: 4, color: '#94a3b8' }}>No feedback reviews found.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
        </Box>
    );
};

export default PerformanceFeedback;
