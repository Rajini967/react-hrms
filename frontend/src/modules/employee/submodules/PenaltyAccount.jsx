import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, Grid, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { FaExclamationTriangle } from 'react-icons/fa';
import api from '../../../services/api';

const PenaltyAccount = ({ employeeId }) => {
    const [penalties, setPenalties] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPenalties = async () => {
            try {
                // Fetch penalty accounts for employee
                const response = await api.get(`/base/penalty-accounts/?employee_id=${employeeId}`);
                setPenalties(response.data.results || response.data || []);
            } catch (error) {
                console.error("Error fetching penalties:", error);
            } finally {
                setLoading(false);
            }
        };
        if (employeeId) fetchPenalties();
    }, [employeeId]);

    if (loading) return <Typography sx={{ p: 4, textAlign: 'center' }}>Loading penalties...</Typography>;

    return (
        <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                <Box sx={{ p: 1, borderRadius: '8px', bgcolor: '#fef2f2', color: '#ef4444' }}>
                    <FaExclamationTriangle />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>Penalty Records</Typography>
            </Box>

            <TableContainer component={Paper} sx={{ borderRadius: '16px', border: '1px solid #eef2f6', boxShadow: 'none', overflow: 'hidden' }}>
                <Table>
                    <TableHead sx={{ bgcolor: '#f8fafc' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 600 }}>Reason / Type</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Deduction</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 600 }}>Amount</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {penalties.length > 0 ? penalties.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell>
                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                        {item.late_early_id ? 'Late Clock-in / Early Out' : (item.leave_request_id ? 'Leave Penalty' : 'General Penalty')}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: '#64748b' }}>
                                        {item.created_at?.split('T')[0] || 'Recently'}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    {item.minus_leaves > 0 && (
                                        <Chip
                                            label={`-${item.minus_leaves} Leaves`}
                                            size="small"
                                            sx={{ bgcolor: '#fff1f2', color: '#e11d48', fontWeight: 600 }}
                                        />
                                    )}
                                    {item.minus_leaves === 0 && <Typography variant="caption" color="textSecondary">Salary Deduction Only</Typography>}
                                </TableCell>
                                <TableCell align="right">
                                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#ef4444' }}>
                                        {item.penalty_amount > 0 ? `-${item.penalty_amount}` : '--'}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={3} align="center" sx={{ py: 6 }}>
                                    <Typography variant="body1" sx={{ color: '#94a3b8' }}>Great! No penalty records found for this employee.</Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default PenaltyAccount;
