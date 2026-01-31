import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, Grid, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from '@mui/material';
import { FaFileAlt, FaDownload, FaFileUpload } from 'react-icons/fa';
import api from '../../../services/api';

const EmployeeDocuments = ({ employeeId }) => {
    const [documents, setDocuments] = useState([]);
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch employee basic info to get core docs
                const empRes = await api.get(`/employee/employees/${employeeId}/`);
                setEmployee(empRes.data);

                // Fetch other documents
                const docRes = await api.get(`/employee/documents/?employee_id=${employeeId}`);
                setDocuments(docRes.data.results || docRes.data || []);
            } catch (error) {
                console.error("Error fetching documents:", error);
            } finally {
                setLoading(false);
            }
        };
        if (employeeId) fetchData();
    }, [employeeId]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved': return '#10b981';
            case 'rejected': return '#ef4444';
            default: return '#f59e0b';
        }
    };

    if (loading) return <Typography sx={{ p: 4, textAlign: 'center' }}>Loading documents...</Typography>;

    const coreDocs = [
        { label: 'Resume', file: employee?.resume_document, name: 'resume' },
        { label: 'Aadhaar Card', file: employee?.aadhaar_document, name: 'aadhaar' },
        { label: 'PAN Card', file: employee?.pan_document, name: 'pan' },
    ].filter(d => d.file);

    return (
        <Box>
            {/* Core Documents Section */}
            <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                    <Box sx={{ p: 1, borderRadius: '8px', bgcolor: '#f0f9ff', color: '#0ea5e9' }}>
                        <FaFileAlt />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>Core Documents</Typography>
                </Box>
                <Grid container spacing={3}>
                    {coreDocs.length > 0 ? coreDocs.map((doc, idx) => (
                        <Grid item xs={12} sm={6} md={4} key={idx}>
                            <Paper sx={{ p: 2, borderRadius: '16px', border: '1px solid #eef2f6', boxShadow: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Box sx={{ p: 1, borderRadius: '8px', bgcolor: '#f1f5f9' }}>
                                        <FaFileAlt color="#64748b" />
                                    </Box>
                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{doc.label}</Typography>
                                </Box>
                                <Button size="small" component="a" href={doc.file} target="_blank" startIcon={<FaDownload />}>Download</Button>
                            </Paper>
                        </Grid>
                    )) : (
                        <Grid item xs={12}>
                            <Typography variant="body2" color="textSecondary" sx={{ px: 1 }}>No core documents uploaded.</Typography>
                        </Grid>
                    )}
                </Grid>
            </Box>

            {/* Other Documents Section */}
            <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                    <Box sx={{ p: 1, borderRadius: '8px', bgcolor: '#f1f5f9', color: '#64748b' }}>
                        <FaFileUpload />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>Additional Documents</Typography>
                </Box>
                <TableContainer component={Paper} sx={{ borderRadius: '16px', border: '1px solid #eef2f6', boxShadow: 'none' }}>
                    <Table>
                        <TableHead sx={{ bgcolor: '#f8fafc' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 600 }}>Title</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Expiry Date</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 600 }}>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {documents.length > 0 ? documents.map((doc) => (
                                <TableRow key={doc.id}>
                                    <TableCell sx={{ fontWeight: 600 }}>{doc.title}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={doc.status}
                                            size="small"
                                            sx={{
                                                bgcolor: `${getStatusColor(doc.status)}15`,
                                                color: getStatusColor(doc.status),
                                                fontWeight: 700,
                                                fontSize: '0.7rem'
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell sx={{ color: '#64748b' }}>{doc.expiry_date || 'N/A'}</TableCell>
                                    <TableCell align="right">
                                        {doc.document ? (
                                            <Button size="small" component="a" href={doc.document} target="_blank">View</Button>
                                        ) : (
                                            <Typography variant="caption" color="textSecondary">No file</Typography>
                                        )}
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={4} align="center" sx={{ py: 4, color: '#94a3b8' }}>No additional documents found.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Box>
    );
};

export default EmployeeDocuments;
