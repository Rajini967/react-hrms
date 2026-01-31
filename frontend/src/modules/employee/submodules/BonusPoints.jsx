import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, Grid, Chip } from '@mui/material';
import { FaStar } from 'react-icons/fa';
import api from '../../../services/api';

const BonusPoints = ({ employeeId }) => {
    const [points, setPoints] = useState(0);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch points balance
                const balanceRes = await api.get(`/pms/bonus-points/?employee_id=${employeeId}`);
                const balanceData = balanceRes.data.results || balanceRes.data;
                if (balanceData.length > 0) {
                    setPoints(balanceData[0].points);
                }

                // Fetch points history/logs if available
                const historyRes = await api.get(`/pms/employee-bonus-points/?employee_id=${employeeId}`);
                setHistory(historyRes.data.results || historyRes.data || []);
            } catch (error) {
                console.error("Error fetching bonus points:", error);
            } finally {
                setLoading(false);
            }
        };
        if (employeeId) fetchData();
    }, [employeeId]);

    if (loading) return <Typography sx={{ p: 4, textAlign: 'center' }}>Loading points...</Typography>;

    return (
        <Box>
            <Paper sx={{ p: 4, borderRadius: '16px', border: '1px solid #eef2f6', boxShadow: 'none', mb: 3, bgcolor: '#fff' }}>
                <Grid container alignItems="center" spacing={3}>
                    <Grid item>
                        <Box sx={{
                            width: 64, height: 64, borderRadius: '16px', bgcolor: '#fffbeb',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b'
                        }}>
                            <FaStar size={32} />
                        </Box>
                    </Grid>
                    <Grid item xs>
                        <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b' }}>{points}</Typography>
                        <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>Total Bonus Points Earned</Typography>
                    </Grid>
                </Grid>
            </Paper>

            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, color: '#1e293b' }}>Points History</Typography>
            <Paper sx={{ borderRadius: '16px', border: '1px solid #eef2f6', boxShadow: 'none', overflow: 'hidden' }}>
                {history.length > 0 ? (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #eef2f6' }}>
                                <th style={{ padding: '12px 20px', textAlign: 'left', color: '#64748b' }}>Reason / Description</th>
                                <th style={{ padding: '12px 20px', textAlign: 'left', color: '#64748b' }}>Date</th>
                                <th style={{ padding: '12px 20px', textAlign: 'right', color: '#64748b' }}>Points</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.map((item) => (
                                <tr key={item.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                                    <td style={{ padding: '16px 20px', color: '#1e293b', fontWeight: 500 }}>{item.reason || 'Achievement Bonus'}</td>
                                    <td style={{ padding: '16px 20px', color: '#64748b' }}>{item.created_at?.split('T')[0] || item.date}</td>
                                    <td style={{ padding: '16px 20px', textAlign: 'right', color: '#10b981', fontWeight: 700 }}>+{item.points}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <Box sx={{ p: 4, textAlign: 'center' }}>
                        <Typography variant="body2" sx={{ color: '#64748b' }}>No point history available for this employee.</Typography>
                    </Box>
                )}
            </Paper>
        </Box>
    );
};

export default BonusPoints;
