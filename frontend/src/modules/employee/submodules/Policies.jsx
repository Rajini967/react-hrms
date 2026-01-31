
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
    Card,
    CardContent,
    Chip,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    OutlinedInput,
    FormControlLabel,
    Switch,
    CardActions
} from '@mui/material';
import { Add, Edit, Delete, Refresh, AttachFile } from '@mui/icons-material';
import api from '../../../services/api';
import { toast } from 'react-toastify';
import ViewToolBar from '../../../components/common/ViewToolBar';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

const Policies = () => {
    const [policies, setPolicies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('grid');
    const [openModal, setOpenModal] = useState(false);
    const [employees, setEmployees] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        body: '',
        is_visible_to_all: true,
        specific_employees: [],
        company_id: [],
        attachments: []
    });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchPolicies();
        fetchEmployees();
        fetchCompanies();
    }, []);

    const fetchPolicies = async () => {
        try {
            const response = await api.get('/employee/policies/');
            const data = response.data.results || response.data;
            setPolicies(data);
        } catch (error) {
            console.error('Error fetching policies:', error);
            toast.error('Failed to load policies');
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

    const fetchCompanies = async () => {
        try {
            const response = await api.get('/base/companies/');
            const data = response.data.results || response.data;
            setCompanies(data);
        } catch (error) {
            console.error('Error fetching companies:', error);
        }
    }

    const handleOpen = (policy = null) => {
        if (policy) {
            setEditingId(policy.id);
            setFormData({
                title: policy.title,
                body: policy.body,
                is_visible_to_all: policy.is_visible_to_all,
                specific_employees: policy.specific_employees.map(e => e.id || e),
                company_id: policy.company_id.map(c => c.id || c),
                attachments: []
            });
        } else {
            setEditingId(null);
            setFormData({
                title: '',
                body: '',
                is_visible_to_all: true,
                specific_employees: [],
                company_id: [],
                attachments: []
            });
        }
        setOpenModal(true);
    };

    const handleClose = () => {
        setOpenModal(false);
        setEditingId(null);
    };

    const filteredPolicies = policies.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.body.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleChange = (e) => {
        const { name, value, checked, type, files } = e.target;
        if (name === 'attachments') {
            setFormData(prev => ({ ...prev, attachments: Array.from(files) }));
        } else {
            setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
        }
    };

    const handleSubmit = async () => {
        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('body', formData.body);
            data.append('is_visible_to_all', formData.is_visible_to_all);

            formData.company_id.forEach(id => data.append('company_id', id));

            if (!formData.is_visible_to_all) {
                formData.specific_employees.forEach(id => data.append('specific_employees', id));
            }

            formData.attachments.forEach(file => {
                data.append('attachments', file); // Note: Backend needs to support multiple files with same key or specific logic
            });


            const config = { headers: { 'Content-Type': 'multipart/form-data' } };

            if (editingId) {
                await api.put(`/employee/policies/${editingId}/`, data, config); // Might need specific partial update logic
                toast.success('Policy updated successfully');
            } else {
                await api.post('/employee/policies/', data, config);
                toast.success('Policy created successfully');
            }
            handleClose();
            fetchPolicies();
        } catch (error) {
            console.error('Error saving policy:', error);
            toast.error('Failed to save policy');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this policy?')) {
            try {
                await api.delete(`/employee/policies/${id}/`);
                toast.success('Policy deleted successfully');
                fetchPolicies();
            } catch (error) {
                console.error('Error deleting policy:', error);
                toast.error('Failed to delete policy');
            }
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <ViewToolBar
                searchPlaceholder="Search policies..."
                onSearch={setSearchTerm}
                onViewChange={setViewMode}
                viewMode={viewMode}
                onCreate={() => handleOpen()}
                createLabel="New Policy"
                showFilter={true}
                showGroup={true}
                showActions={true}
            />

            {/* Grid View */}
            {viewMode === 'grid' && (
                <Grid container spacing={3}>
                    <AnimatePresence>
                        {filteredPolicies.map((policy, index) => (
                            <Grid item xs={12} sm={6} md={4} key={policy.id} component={motion.div}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.2, delay: index * 0.05 }}
                            >
                                <Card sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    borderRadius: 4,
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    border: '1px solid #f1f5f9',
                                    '&:hover': {
                                        transform: 'translateY(-8px)',
                                        boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
                                        borderColor: 'primary.main'
                                    }
                                }}>
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                            <Typography variant="h6" fontWeight="bold" sx={{ color: '#1e293b' }}>{policy.title}</Typography>
                                            <Chip
                                                label={policy.is_visible_to_all ? "Global" : "Restricted"}
                                                size="small"
                                                color={policy.is_visible_to_all ? "primary" : "warning"}
                                                sx={{ borderRadius: '6px' }}
                                            />
                                        </Box>
                                        <Typography variant="body2" color="textSecondary" paragraph sx={{ minHeight: '3em' }}>
                                            {policy.body.length > 120 ? `${policy.body.substring(0, 120)}...` : policy.body}
                                        </Typography>
                                    </CardContent>
                                    <CardActions sx={{ borderTop: '1px solid #f8fafc', px: 2, py: 1.5, bgcolor: '#f8fafc' }}>
                                        <Button size="small" startIcon={<Edit />} onClick={() => handleOpen(policy)} sx={{ textTransform: 'none' }}>Edit</Button>
                                        <Button size="small" color="error" startIcon={<Delete />} onClick={() => handleDelete(policy.id)} sx={{ textTransform: 'none' }}>Delete</Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </AnimatePresence>
                </Grid>
            )}

            {/* List View */}
            {viewMode === 'list' && (
                <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
                    <Table>
                        <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                            <TableRow>
                                <TableCell>Policy Title</TableCell>
                                <TableCell>Visibility</TableCell>
                                <TableCell>Created Date</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredPolicies.map((policy) => (
                                <TableRow key={policy.id} hover>
                                    <TableCell sx={{ fontWeight: 600 }}>{policy.title}</TableCell>
                                    <TableCell>
                                        {policy.is_visible_to_all ?
                                            <Chip label="Global" color="primary" size="small" variant="outlined" /> :
                                            <Chip label="Restricted" color="warning" size="small" variant="outlined" />
                                        }
                                    </TableCell>
                                    <TableCell>{new Date().toLocaleDateString()}</TableCell> {/* Mocking date if not in API */}
                                    <TableCell align="right">
                                        <IconButton size="small" color="primary" onClick={() => handleOpen(policy)}><Edit /></IconButton>
                                        <IconButton size="small" color="error" onClick={() => handleDelete(policy.id)}><Delete /></IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <Dialog open={openModal} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogTitle>{editingId ? 'Edit Policy' : 'New Policy'}</DialogTitle>
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
                            <FormControlLabel
                                control={<Switch checked={formData.is_visible_to_all} onChange={handleChange} name="is_visible_to_all" />}
                                label="Visible to All Employees"
                            />
                        </Grid>
                        {!formData.is_visible_to_all && (
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel>Specific Employees</InputLabel>
                                    <Select
                                        multiple
                                        name="specific_employees"
                                        value={formData.specific_employees}
                                        onChange={handleChange}
                                        input={<OutlinedInput label="Specific Employees" />}
                                        renderValue={(selected) => (
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                {selected.map((value) => {
                                                    const emp = employees.find(e => e.id === value);
                                                    return <Chip key={value} label={emp ? emp.employee_first_name : value} />
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
                        )}

                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Companies</InputLabel>
                                <Select
                                    multiple
                                    name="company_id"
                                    value={formData.company_id}
                                    onChange={handleChange}
                                    input={<OutlinedInput label="Companies" />}
                                    renderValue={(selected) => (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {selected.map((value) => {
                                                const comp = companies.find(c => c.id === value);
                                                return <Chip key={value} label={comp ? comp.company_name : value} />
                                            })}
                                        </Box>
                                    )}
                                >
                                    {companies.map((company) => (
                                        <MenuItem key={company.id} value={company.id}>
                                            {company.company_name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Policy Body"
                                name="body"
                                multiline
                                rows={6}
                                value={formData.body}
                                onChange={handleChange}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                variant="outlined"
                                component="label"
                                startIcon={<AttachFile />}
                            >
                                Upload Attachments
                                <input
                                    type="file"
                                    hidden
                                    multiple
                                    name="attachments"
                                    onChange={handleChange}
                                />
                            </Button>
                            {formData.attachments.length > 0 && (
                                <Box sx={{ mt: 1 }}>
                                    {formData.attachments.map((file, index) => (
                                        <Chip key={index} label={file.name} onDelete={() => {
                                            const newFiles = [...formData.attachments];
                                            newFiles.splice(index, 1);
                                            setFormData(prev => ({ ...prev, attachments: newFiles }));
                                        }} sx={{ mr: 1 }} />
                                    ))}
                                </Box>
                            )}
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

export default Policies;
