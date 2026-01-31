import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, Grid, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { FaLaptop, FaHandsHelping, FaQuestionCircle } from 'react-icons/fa';
import api from '../../../services/api';

const EmployeeAssets = ({ employeeId }) => {
    const [assets, setAssets] = useState([]);
    const [allocations, setAllocations] = useState([]);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch assets owned by employee
                const assetRes = await api.get(`/asset/assets/?owner=${employeeId}`);
                setAssets(assetRes.data.results || assetRes.data || []);

                // Fetch asset allocations
                const allocRes = await api.get(`/asset/asset-allocations/?assigned_to_employee_id=${employeeId}`);
                setAllocations(allocRes.data.results || allocRes.data || []);

                // Fetch asset requests
                const reqRes = await api.get(`/asset/asset-requests/?requested_employee_id=${employeeId}`);
                setRequests(reqRes.data.results || reqRes.data || []);
            } catch (error) {
                console.error("Error fetching assets:", error);
            } finally {
                setLoading(false);
            }
        };
        if (employeeId) fetchData();
    }, [employeeId]);

    if (loading) return <Typography sx={{ p: 4, textAlign: 'center' }}>Loading asset data...</Typography>;

    return (
        <Box>
            <Grid container spacing={4}>
                {/* Active Assets */}
                <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                        <Box sx={{ p: 1, borderRadius: '8px', bgcolor: '#eff6ff', color: '#3b82f6' }}>
                            <FaLaptop />
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>Active Assets</Typography>
                    </Box>
                    <Grid container spacing={2}>
                        {assets.length > 0 ? assets.map((asset) => (
                            <Grid item xs={12} sm={6} md={4} key={asset.id}>
                                <Paper sx={{ p: 2, borderRadius: '16px', border: '1px solid #eef2f6', boxShadow: 'none' }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{asset.asset_name}</Typography>
                                        <Chip label={asset.asset_status} size="small" color="success" variant="outlined" sx={{ fontSize: '0.65rem', height: 20 }} />
                                    </Box>
                                    <Typography variant="caption" color="textSecondary" display="block">ID: {asset.asset_tracking_id}</Typography>
                                    <Typography variant="caption" color="textSecondary" display="block">Type: {asset.asset_category_name}</Typography>
                                </Paper>
                            </Grid>
                        )) : (
                            <Grid item xs={12}>
                                <Typography variant="body2" color="textSecondary" sx={{ px: 1 }}>No active assets currently held.</Typography>
                            </Grid>
                        )}
                    </Grid>
                </Grid>

                {/* Asset History / Allocations */}
                <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                        <Box sx={{ p: 1, borderRadius: '8px', bgcolor: '#f1f5f9', color: '#64748b' }}>
                            <FaHandsHelping />
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>Assignment History</Typography>
                    </Box>
                    <TableContainer component={Paper} sx={{ borderRadius: '16px', border: '1px solid #eef2f6', boxShadow: 'none' }}>
                        <Table>
                            <TableHead sx={{ bgcolor: '#f8fafc' }}>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 600 }}>Asset</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Assigned Date</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Return Date</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {allocations.length > 0 ? allocations.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell sx={{ fontWeight: 600 }}>{item.asset_name}</TableCell>
                                        <TableCell sx={{ color: '#64748b' }}>{item.assigned_date}</TableCell>
                                        <TableCell sx={{ color: '#64748b' }}>{item.return_date || 'Current'}</TableCell>
                                        <TableCell>
                                            <Chip label={item.return_status || 'In Use'} size="small" variant="outlined" />
                                        </TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={4} align="center" sx={{ py: 4, color: '#94a3b8' }}>No assignment history found.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>

                {/* Asset Requests */}
                <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                        <Box sx={{ p: 1, borderRadius: '8px', bgcolor: '#fff7ed', color: '#ea580c' }}>
                            <FaQuestionCircle />
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>Asset Requests</Typography>
                    </Box>
                    <TableContainer component={Paper} sx={{ borderRadius: '16px', border: '1px solid #eef2f6', boxShadow: 'none' }}>
                        <Table>
                            <TableHead sx={{ bgcolor: '#f8fafc' }}>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Request Date</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {requests.length > 0 ? requests.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell sx={{ fontWeight: 600 }}>{item.asset_category_name}</TableCell>
                                        <TableCell sx={{ color: '#64748b' }}>{item.asset_request_date}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={item.asset_request_status}
                                                size="small"
                                                sx={{
                                                    color: item.asset_request_status === 'Approved' ? '#16a34a' : (item.asset_request_status === 'Rejected' ? '#ef4444' : '#2563eb'),
                                                    bgcolor: item.asset_request_status === 'Approved' ? '#f0fdf4' : (item.asset_request_status === 'Rejected' ? '#fef2f2' : '#eff6ff'),
                                                    fontWeight: 700
                                                }}
                                            />
                                        </TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={3} align="center" sx={{ py: 4, color: '#94a3b8' }}>No asset requests found.</TableCell>
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

export default EmployeeAssets;
