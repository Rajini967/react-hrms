import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, Grid, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from '@mui/material';
import { FaCalendarAlt, FaUserTie, FaClock } from 'react-icons/fa';
import api from '../../../services/api';

const ScheduledInterviews = ({ employeeId }) => {
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInterviews = async () => {
            try {
                // Fetch all interviews and filter for this interviewer on client-side if server-side filter not available
                const response = await api.get(`/recruitment/interviews/`);
                const allInterviews = response.data.results || response.data || [];

                // Filter where employeeId is in the interviewer list
                const filtered = allInterviews.filter(item =>
                    item.employee_id && item.employee_id.includes(parseInt(employeeId))
                );

                setInterviews(filtered);
            } catch (error) {
                console.error("Error fetching interviews:", error);
            } finally {
                setLoading(false);
            }
        };
        if (employeeId) fetchInterviews();
    }, [employeeId]);

    if (loading) return <Typography sx={{ p: 4, textAlign: 'center' }}>Loading interview schedule...</Typography>;

    return (
        <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                <Box sx={{ p: 1, borderRadius: '8px', bgcolor: '#f0fdf4', color: '#16a34a' }}>
                    <FaCalendarAlt />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>Interview Assignments</Typography>
            </Box>

            <TableContainer component={Paper} sx={{ borderRadius: '16px', border: '1px solid #eef2f6', boxShadow: 'none' }}>
                <Table>
                    <TableHead sx={{ bgcolor: '#f8fafc' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 600 }}>Candidate</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Date & Time</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {interviews.length > 0 ? interviews.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                        <Box sx={{ p: 1, borderRadius: '50%', bgcolor: '#f1f5f9' }}>
                                            <FaUserTie color="#64748b" />
                                        </Box>
                                        <Box>
                                            <Typography variant="body2" sx={{ fontWeight: 600 }}>{item.candidate_name || 'Candidate'}</Typography>
                                            <Typography variant="caption" color="textSecondary">ID: {item.candidate_id}</Typography>
                                        </Box>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                        <Typography variant="body2" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            <FaCalendarAlt size={12} color="#64748b" /> {item.interview_date}
                                        </Typography>
                                        <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#64748b' }}>
                                            <FaClock size={12} /> {item.interview_time}
                                        </Typography>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={item.completed ? 'Completed' : 'Upcoming'}
                                        size="small"
                                        sx={{
                                            bgcolor: item.completed ? '#f0fdf4' : '#fff7ed',
                                            color: item.completed ? '#16a34a' : '#ea580c',
                                            fontWeight: 700,
                                            fontSize: '0.7rem'
                                        }}
                                    />
                                </TableCell>
                                <TableCell align="right">
                                    <Button size="small" variant="outlined">Details</Button>
                                </TableCell>
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={4} align="center" sx={{ py: 6 }}>
                                    <Typography variant="body1" sx={{ color: '#94a3b8' }}>No interview assignments scheduled.</Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default ScheduledInterviews;
