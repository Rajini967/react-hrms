import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
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
    Chip,
    OutlinedInput
} from '@mui/material';
import { Add, Edit, Delete, Refresh } from '@mui/icons-material';
import api from '../../../services/api';
import { toast } from 'react-toastify';
import ViewToolBar from '../../../components/common/ViewToolBar';
import { motion, AnimatePresence } from 'framer-motion';

const FORMAT_CHOICES = [
    { value: "any", label: "Any" },
    { value: "pdf", label: "PDF" },
    { value: "txt", label: "TXT" },
    { value: "docx", label: "DOCX" },
    { value: "xlsx", label: "XLSX" },
    { value: "jpg", label: "JPG" },
    { value: "png", label: "PNG" },
    { value: "jpeg", label: "JPEG" },
];

const DocumentRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('list');
    const [openModal, setOpenModal] = useState(false);
    const [employees, setEmployees] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        employee_id: [],
        format: 'any',
        max_size: '',
        description: ''
    });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchRequests();
        fetchEmployees();
    }, []);

    const fetchRequests = async () => {
        try {
            const response = await api.get('/employee/document-request/');
            const data = response.data.results || response.data;
            setRequests(data);
        } catch (error) {
            console.error('Error fetching document requests:', error);
            toast.error('Failed to load document requests');
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

    const handleOpen = (request = null) => {
        if (request) {
            setEditingId(request.id);
            setFormData({
                title: request.title,
                employee_id: request.employee_id.map(emp => emp.id || emp), // Handle if backend returns full obj or just id
                format: request.format,
                max_size: request.max_size,
                description: request.description
            });
        } else {
            setEditingId(null);
            setFormData({
                title: '',
                employee_id: [],
                format: 'any',
                max_size: '',
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
        req.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async () => {
        try {
            if (editingId) {
                await api.put(`/employee/document-request/${editingId}/`, formData);
                toast.success('Document request updated successfully');
            } else {
                await api.post('/employee/document-request/', formData);
                toast.success('Document request created successfully');
            }
            handleClose();
            fetchRequests();
        } catch (error) {
            console.error('Error saving document request:', error);
            toast.error('Failed to save document request');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this request?')) {
            try {
                await api.delete(`/employee/document-request/${id}/`);
                toast.success('Document request deleted successfully');
                fetchRequests();
            } catch (error) {
                console.error('Error deleting document request:', error);
                toast.error('Failed to delete document request');
            }
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <ViewToolBar
                searchPlaceholder="Search requests..."
                onSearch={setSearchTerm} // I'll add search state below
                onViewChange={setViewMode}
                viewMode={viewMode}
                onCreate={() => handleOpen()}
                createLabel="New Request"
                showFilter={true}
                showGroup={true}
                showActions={true}
            />

            {/* List View */}
            {viewMode === 'list' && (
                <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
                    <Table>
                        <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                            <TableRow>
                                <TableCell>Title</TableCell>
                                <TableCell>Format</TableCell>
                                <TableCell>Max Size (MB)</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredRequests.map((request) => (
                                <TableRow key={request.id} hover>
                                    <TableCell>{request.title}</TableCell>
                                    <TableCell>
                                        <Chip label={request.format.toUpperCase()} size="small" color="primary" variant="outlined" />
                                    </TableCell>
                                    <TableCell>{request.max_size ? `${request.max_size} MB` : 'N/A'}</TableCell>
                                    <TableCell>{request.description || '-'}</TableCell>
                                    <TableCell align="right">
                                        <IconButton size="small" color="primary" onClick={() => handleOpen(request)}>
                                            <Edit />
                                        </IconButton>
                                        <IconButton size="small" color="error" onClick={() => handleDelete(request.id)}>
                                            <Delete />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {filteredRequests.length === 0 && !loading && (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">No document requests found</TableCell>
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
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.2, delay: index * 0.05 }}
                            >
                                <Card sx={{
                                    borderRadius: 4,
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    '&:hover': {
                                        transform: 'translateY(-8px)',
                                        boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
                                        borderColor: 'primary.main'
                                    },
                                    border: '1px solid #f1f5f9'
                                }}>
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                            <Typography variant="h6" fontWeight="bold" sx={{ color: '#1e293b' }}>
                                                {request.title}
                                            </Typography>
                                            <Chip
                                                label={request.format.toUpperCase()}
                                                size="small"
                                                sx={{ borderRadius: '6px', fontWeight: 600, bgcolor: '#eff6ff', color: '#3b82f6' }}
                                            />
                                        </Box>
                                        <Typography variant="body2" color="text.secondary" paragraph sx={{ minHeight: '3em' }}>
                                            {request.description || 'No description provided.'}
                                        </Typography>

                                        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                                            <Chip label={`Max: ${request.max_size || 0} MB`} size="small" variant="outlined" sx={{ borderRadius: '4px' }} />
                                            <Chip label={`${request.employee_id.length} Employees`} size="small" variant="outlined" sx={{ borderRadius: '4px' }} />
                                        </Box>
                                    </CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #f1f5f9', p: 1.5, bgcolor: '#f8fafc', borderRadius: '0 0 16px 16px' }}>
                                        <Button startIcon={<Edit />} size="small" onClick={() => handleOpen(request)} sx={{ textTransform: 'none' }}>Edit</Button>
                                        <Button startIcon={<Delete />} size="small" color="error" onClick={() => handleDelete(request.id)} sx={{ textTransform: 'none' }}>Delete</Button>
                                    </Box>
                                </Card>
                            </Grid>
                        ))}
                    </AnimatePresence>
                </Grid>
            )}

            <Dialog open={openModal} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>{editingId ? 'Edit Document Request' : 'New Document Request'}</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Employees</InputLabel>
                                <Select
                                    multiple
                                    name="employee_id"
                                    value={formData.employee_id}
                                    onChange={handleChange}
                                    input={<OutlinedInput label="Employees" />}
                                    renderValue={(selected) => (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {selected.map((value) => {
                                                const emp = employees.find(e => e.id === value);
                                                return (
                                                    <Chip key={value} label={emp ? `${emp.employee_first_name} ${emp.employee_last_name}` : value} />
                                                )
                                            })}
                                        </Box>
                                    )}
                                >
                                    {employees.map((emp) => (
                                        <MenuItem key={emp.id} value={emp.id}>
                                            {emp.employee_first_name} {emp.employee_last_name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <InputLabel>Format</InputLabel>
                                <Select
                                    name="format"
                                    value={formData.format}
                                    onChange={handleChange}
                                    label="Format"
                                >
                                    {FORMAT_CHOICES.map(option => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Max Size (MB)"
                                name="max_size"
                                type="number"
                                value={formData.max_size}
                                onChange={handleChange}
                            />
                        </Grid>
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

export default DocumentRequests;
