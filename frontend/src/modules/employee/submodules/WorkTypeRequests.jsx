import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    TextField,
    Typography,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    FormControlLabel,
    Checkbox,
    Chip
} from '@mui/material';
import { Add, Edit, Delete, Refresh } from '@mui/icons-material';
import api from '../../../services/api';
import { toast } from 'react-toastify';
import ViewToolBar from '../../../components/common/ViewToolBar';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Close } from '@mui/icons-material';

const WorkTypeRequests = ({ employeeId }) => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('list');
    const [openModal, setOpenModal] = useState(false);
    const [employees, setEmployees] = useState([]);
    const [workTypes, setWorkTypes] = useState([]);
    const [formData, setFormData] = useState({
        employee_id: '',
        work_type_id: '',
        requested_date: new Date().toISOString().split('T')[0],
        requested_till: '',
        is_permanent_work_type: false,
        description: ''
    });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchRequests();
        fetchEmployees();
        fetchWorkTypes();
    }, []);

    const fetchRequests = async () => {
        try {
            const url = employeeId
                ? `/base/worktype-requests/?employee_id=${employeeId}`
                : '/base/worktype-requests/';
            const response = await api.get(url);
            const data = response.data.results || response.data;
            setRequests(data);
        } catch (error) {
            console.error('Error fetching work type requests:', error);
            toast.error('Failed to load work type requests');
        } finally {
            setLoading(false);
        }
    };

    const fetchEmployees = async () => {
        try {
            const response = await api.get('/employee/employees/');
            const data = response.data.results || response.data;
            setEmployees(data);
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };

    const fetchWorkTypes = async () => {
        try {
            const response = await api.get('/base/work_type/');
            const data = response.data.results || response.data;
            setWorkTypes(data);
        } catch (error) {
            console.error('Error fetching work types:', error);
        }
    };

    const handleOpen = (request = null) => {
        if (request) {
            setEditingId(request.id);
            setFormData({
                employee_id: request.employee_id.id || request.employee_id,
                work_type_id: request.work_type_id.id || request.work_type_id,
                requested_date: request.requested_date,
                requested_till: request.requested_till || '',
                is_permanent_work_type: request.is_permanent_work_type,
                description: request.description
            });
        } else {
            setEditingId(null);
            setFormData({
                employee_id: '',
                work_type_id: '',
                requested_date: new Date().toISOString().split('T')[0],
                requested_till: '',
                is_permanent_work_type: false,
                description: ''
            });
        }
        setOpenModal(true);
    };

    const handleClose = () => {
        setOpenModal(false);
        setEditingId(null);
    };

    const filteredRequests = requests.filter(req =>
        (req.employee_first_name + ' ' + req.employee_last_name).toLowerCase().includes(searchTerm.toLowerCase()) ||
        (req.work_type_name || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleChange = (e) => {
        const { name, value, checked, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async () => {
        try {
            if (editingId) {
                await api.put(`/base/worktype-requests/${editingId}/`, formData);
                toast.success('Work type request updated successfully');
            } else {
                await api.post('/base/worktype-requests/', formData);
                toast.success('Work type request created successfully');
            }
            handleClose();
            fetchRequests();
        } catch (error) {
            console.error('Error saving work type request:', error);
            toast.error('Failed to save request');
        }
    };

    const handleApprove = async (id) => {
        try {
            await api.post(`/base/worktype-requests-approve/${id}/`);
            toast.success('Work type request approved successfully');
            fetchRequests();
        } catch (error) {
            console.error('Error approving work type request:', error);
            toast.error('Failed to approve work type request');
        }
    };

    const handleCancel = async (id) => {
        if (window.confirm('Are you sure you want to cancel this request?')) {
            try {
                await api.post(`/base/worktype-requests-cancel/${id}/`);
                toast.success('Work type request canceled successfully');
                fetchRequests();
            } catch (error) {
                console.error('Error canceling work type request:', error);
                toast.error('Failed to cancel work type request');
            }
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this request?')) {
            try {
                await api.delete(`/base/worktype-requests/${id}/`);
                toast.success('Request deleted successfully');
                fetchRequests();
            } catch (error) {
                console.error('Error deleting request:', error);
                toast.error('Failed to delete request');
            }
        }
    };

    return (
        <Box sx={{ p: employeeId ? 0 : 3 }}>
            {!employeeId && (
                <ViewToolBar
                    searchPlaceholder="Search requests..."
                    onSearch={setSearchTerm}
                    onViewChange={setViewMode}
                    viewMode={viewMode}
                    onCreate={() => handleOpen()}
                    createLabel="New Request"
                    showFilter={true}
                    showGroup={true}
                    showActions={true}
                />
            )}

            {/* List View */}
            {viewMode === 'list' && (
                <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
                    <Table>
                        <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                            <TableRow>
                                <TableCell>Employee</TableCell>
                                <TableCell>Requested Work Type</TableCell>
                                <TableCell>From Date</TableCell>
                                <TableCell>To Date</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Permanent</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredRequests.map((request) => (
                                <TableRow key={request.id} hover>
                                    <TableCell>{request.employee_first_name} {request.employee_last_name}</TableCell>
                                    <TableCell>{request.work_type_name}</TableCell>
                                    <TableCell>{request.requested_date}</TableCell>
                                    <TableCell>{request.is_permanent_work_type ? '-' : request.requested_till}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={request.approved ? "Approved" : (request.canceled ? "Canceled" : "Requested")}
                                            color={request.approved ? "success" : (request.canceled ? "error" : "warning")}
                                            size="small"
                                            variant="outlined"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {request.is_permanent_work_type ? <Chip label="Yes" color="info" size="small" /> : "No"}
                                    </TableCell>
                                    <TableCell align="right">
                                        {!request.approved && !request.canceled && (
                                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                                                <IconButton size="small" color="success" onClick={() => handleApprove(request.id)} title="Approve">
                                                    <Check />
                                                </IconButton>
                                                <IconButton size="small" color="error" onClick={() => handleCancel(request.id)} title="Cancel">
                                                    <Close />
                                                </IconButton>
                                                <IconButton size="small" color="primary" onClick={() => handleOpen(request)} title="Edit">
                                                    <Edit />
                                                </IconButton>
                                                <IconButton size="small" color="error" onClick={() => handleDelete(request.id)} title="Delete">
                                                    <Delete />
                                                </IconButton>
                                            </Box>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {filteredRequests.length === 0 && !loading && (
                                <TableRow>
                                    <TableCell colSpan={7} align="center">No work type requests found</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* Grid View */}
            {viewMode === 'grid' && (
                <Grid container spacing={3}>
                    <AnimatePresence>
                        {filteredRequests.map((request, index) => (
                            <Grid item xs={12} sm={6} md={4} key={request.id} component={motion.div}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.2, delay: index * 0.05 }}
                            >
                                <Box sx={{
                                    p: 3,
                                    bgcolor: 'white',
                                    borderRadius: 4,
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    border: '1px solid #f1f5f9',
                                    '&:hover': { transform: 'translateY(-8px)', boxShadow: '0 12px 24px rgba(0,0,0,0.1)', borderColor: 'primary.main' },
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                        <Box>
                                            <Typography variant="h6" fontWeight="bold" sx={{ color: '#1e293b' }}>
                                                {request.employee_first_name} {request.employee_last_name}
                                            </Typography>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                                                <Chip
                                                    label={request.work_type_name || "Unknown Work Type"}
                                                    size="small"
                                                    sx={{ bgcolor: '#eff6ff', color: '#3b82f6', fontWeight: 600, fontSize: '0.75rem', height: '24px' }}
                                                />
                                            </div>
                                        </Box>
                                        <Chip
                                            label={request.approved ? "Approved" : (request.canceled ? "Canceled" : "Requested")}
                                            color={request.approved ? "success" : (request.canceled ? "error" : "warning")}
                                            size="small"
                                            variant="filled"
                                            sx={{ borderRadius: '6px' }}
                                        />
                                    </Box>

                                    <Box sx={{ mb: 3, flexGrow: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.875rem' }}>
                                            <span style={{ color: '#64748b' }}>From:</span>
                                            <span style={{ fontWeight: 500 }}>{request.requested_date}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.875rem' }}>
                                            <span style={{ color: '#64748b' }}>To:</span>
                                            <span style={{ fontWeight: 500 }}>{request.is_permanent_work_type ? 'Permanent' : request.requested_till}</span>
                                        </div>
                                        {request.description && (
                                            <Typography variant="body2" sx={{ color: '#64748b', fontStyle: 'italic', borderLeft: '3px solid #e2e8f0', pl: 1 }}>
                                                "{request.description}"
                                            </Typography>
                                        )}
                                    </Box>

                                    {!request.approved && !request.canceled && (
                                        <Box sx={{ pt: 2, borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', gap: 1 }}>
                                            <Box>
                                                <Button variant="outlined" color="success" size="small" startIcon={<Check />} onClick={() => handleApprove(request.id)} sx={{ textTransform: 'none', mr: 1 }}>Approve</Button>
                                                <Button variant="outlined" color="error" size="small" startIcon={<Close />} onClick={() => handleCancel(request.id)} sx={{ textTransform: 'none' }}>Cancel</Button>
                                            </Box>
                                            <Box>
                                                <IconButton size="small" onClick={() => handleOpen(request)}><Edit /></IconButton>
                                                <IconButton size="small" color="error" onClick={() => handleDelete(request.id)}><Delete /></IconButton>
                                            </Box>
                                        </Box>
                                    )}
                                </Box>
                            </Grid>
                        ))}
                    </AnimatePresence>
                </Grid>
            )}

            <Dialog open={openModal} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>{editingId ? 'Edit Work Type Request' : 'New Work Type Request'}</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <FormControl fullWidth required>
                                <InputLabel>Employee</InputLabel>
                                <Select
                                    name="employee_id"
                                    value={formData.employee_id}
                                    onChange={handleChange}
                                    label="Employee"
                                >
                                    {employees.map((emp) => (
                                        <MenuItem key={emp.id} value={emp.id}>
                                            {emp.employee_first_name} {emp.employee_last_name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth required>
                                <InputLabel>Requested Work Type</InputLabel>
                                <Select
                                    name="work_type_id"
                                    value={formData.work_type_id}
                                    onChange={handleChange}
                                    label="Requested Work Type"
                                >
                                    {workTypes.map((type) => (
                                        <MenuItem key={type.id} value={type.id}>
                                            {type.work_type}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={formData.is_permanent_work_type}
                                        onChange={handleChange}
                                        name="is_permanent_work_type"
                                        color="primary"
                                    />
                                }
                                label="Permanent Request"
                            />
                        </Grid>
                        <Grid item xs={formData.is_permanent_work_type ? 12 : 6}>
                            <TextField
                                fullWidth
                                label="Requested Date"
                                name="requested_date"
                                type="date"
                                value={formData.requested_date}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                                required
                            />
                        </Grid>
                        {!formData.is_permanent_work_type && (
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="Requested Till"
                                    name="requested_till"
                                    type="date"
                                    value={formData.requested_till}
                                    onChange={handleChange}
                                    InputLabelProps={{ shrink: true }}
                                    required
                                />
                            </Grid>
                        )}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Description"
                                name="description"
                                multiline
                                rows={3}
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained" color="primary">
                        {editingId ? 'Update' : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default WorkTypeRequests;
