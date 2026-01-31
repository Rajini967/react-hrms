import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, Grid, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { FaPlusCircle, FaMinusCircle } from 'react-icons/fa';
import api from '../../../services/api';

const AllowanceDeduction = ({ employeeId }) => {
    const [allowances, setAllowances] = useState([]);
    const [deductions, setDeductions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch allowances assigned to worker
                const alRes = await api.get(`/payroll/allowance/?employee_id=${employeeId}`);
                setAllowances(alRes.data.results || alRes.data || []);

                // Fetch deductions assigned to worker
                const deRes = await api.get(`/payroll/deduction/?employee_id=${employeeId}`);
                setDeductions(deRes.data.results || deRes.data || []);
            } catch (error) {
                console.error("Error fetching allowances/deductions:", error);
            } finally {
                setLoading(false);
            }
        };
        if (employeeId) fetchData();
    }, [employeeId]);

    if (loading) return <Typography sx={{ p: 4, textAlign: 'center' }}>Loading records...</Typography>;

    return (
        <Box>
            <Grid container spacing={4}>
                {/* Allowances Section */}
                <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                        <Box sx={{ p: 1, borderRadius: '8px', bgcolor: '#ecfdf5', color: '#10b981' }}>
                            <FaPlusCircle />
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>Allowances</Typography>
                    </Box>
                    <TableContainer component={Paper} sx={{ borderRadius: '16px', border: '1px solid #eef2f6', boxShadow: 'none' }}>
                        <Table>
                            <TableHead sx={{ bgcolor: '#f8fafc' }}>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 600 }}>Allowance</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 600 }}>Amount</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {allowances.length > 0 ? allowances.map((row) => (
                                    <TableRow key={row.id}>
                                        <TableCell>
                                            <Typography variant="body2" sx={{ fontWeight: 600 }}>{row.title}</Typography>
                                            <Typography variant="caption" sx={{ color: '#64748b' }}>{row.is_taxable ? 'Taxable' : 'Non-taxable'}</Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Typography variant="body2" sx={{ fontWeight: 700, color: '#10b981' }}>
                                                {row.is_fixed ? `${row.amount}` : `${row.amount_rate}%`}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={2} align="center" sx={{ py: 4, color: '#94a3b8' }}>No allowances found</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>

                {/* Deductions Section */}
                <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                        <Box sx={{ p: 1, borderRadius: '8px', bgcolor: '#fef2f2', color: '#ef4444' }}>
                            <FaMinusCircle />
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>Deductions</Typography>
                    </Box>
                    <TableContainer component={Paper} sx={{ borderRadius: '16px', border: '1px solid #eef2f6', boxShadow: 'none' }}>
                        <Table>
                            <TableHead sx={{ bgcolor: '#f8fafc' }}>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 600 }}>Deduction</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 600 }}>Amount</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {deductions.length > 0 ? deductions.map((row) => (
                                    <TableRow key={row.id}>
                                        <TableCell>
                                            <Typography variant="body2" sx={{ fontWeight: 600 }}>{row.title}</Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Typography variant="body2" sx={{ fontWeight: 700, color: '#ef4444' }}>
                                                {row.amount}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={2} align="center" sx={{ py: 4, color: '#94a3b8' }}>No deductions found</TableCell>
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

export default AllowanceDeduction;
