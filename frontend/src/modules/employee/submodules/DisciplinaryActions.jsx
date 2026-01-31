
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
    OutlinedInput,
    Chip
} from '@mui/material';
import { Add, Edit, Delete, Refresh, AttachFile } from '@mui/icons-material';
import api from '../../../services/api';
import { toast } from 'react-toastify';
import ViewToolBar from '../../../components/common/ViewToolBar';
import { motion, AnimatePresence } from 'framer-motion';

const DisciplinaryActions = () => {
    const [actions, setActions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('list');
    const [openModal, setOpenModal] = useState(false);
    const [employees, setEmployees] = useState([]);
    const [actionTypes, setActionTypes] = useState([]);
    const [formData, setFormData] = useState({
        employee_id: [],
        action: '',
        description: '',
        unit_in: 'days',
        days: 1,
        hours: '00:00',
        start_date: new Date().toISOString().split('T')[0],
        attachment: null
    });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchActions();
        fetchEmployees();
        fetchActionTypes();
    }, []);

    const fetchActions = async () => {
        try {
            const response = await api.get('/employee/disciplinary-action/');
            const data = response.data.results || response.data;
            setActions(data);
        } catch (error) {
            console.error('Error fetching disciplinary actions:', error);
            toast.error('Failed to load disciplinary actions');
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

    const fetchActionTypes = async () => {
        try {
            const response = await api.get('/employee/disciplinary-action-type/');
            const data = response.data.results || response.data;
            setActionTypes(data);
        } catch (error) {
            console.error('Error fetching action types:', error);
        }
    }

    const handleOpen = (action = null) => {
        if (action) {
            setEditingId(action.id);
            setFormData({
                employee_id: action.employee_id.map(e => e.id || e),
                action: action.action.id || action.action,
                description: action.description,
                unit_in: action.unit_in,
                days: action.days,
                hours: action.hours,
                start_date: action.start_date,
                attachment: null // Don't preload file for edit
            });
        } else {
            setEditingId(null);
            setFormData({
                employee_id: [],
                action: '',
                description: '',
                unit_in: 'days',
                days: 1,
                hours: '00:00',
                start_date: new Date().toISOString().split('T')[0],
                attachment: null
            });
        }
        setOpenModal(true);
    };

    const handleClose = () => {
        setOpenModal(false);
        setEditingId(null);
    };

    const filteredActions = actions.filter(a =>
        (a.action_type || getActionName(a.action) || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.employee_id.some(emp => (emp.employee_first_name + ' ' + emp.employee_last_name).toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'attachment') {
            setFormData(prev => ({ ...prev, attachment: files[0] }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async () => {
        try {
            const data = new FormData();
            formData.employee_id.forEach(id => data.append('employee_id', id));
            data.append('action', formData.action);
            data.append('description', formData.description);
            data.append('unit_in', formData.unit_in);
            if (formData.unit_in === 'days') data.append('days', formData.days);
            else data.append('hours', formData.hours);
            data.append('start_date', formData.start_date);
            if (formData.attachment) {
                data.append('attachment', formData.attachment);
            }

            const config = { headers: { 'Content-Type': 'multipart/form-data' } };

            if (editingId) {
                await api.put(`/employee/disciplinary-action/${editingId}/`, data, config);
                toast.success('Disciplinary action updated successfully');
            } else {
                await api.post('/employee/disciplinary-action/', data, config);
                toast.success('Disciplinary action created successfully');
            }
            handleClose();
            fetchActions();
        } catch (error) {
            console.error('Error saving disciplinary action:', error);
            toast.error('Failed to save disciplinary action');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this action?')) {
            try {
                await api.delete(`/employee/disciplinary-action/${id}/`);
                toast.success('Disciplinary action deleted successfully');
                fetchActions();
            } catch (error) {
                console.error('Error deleting disciplinary action:', error);
                toast.error('Failed to delete disciplinary action');
            }
        }
    };

    const getActionName = (id) => {
        const type = actionTypes.find(a => a.id === id);
        return type ? type.title : id;
    }


    return (
        <Box sx={{ p: 3 }}>
            <ViewToolBar
                searchPlaceholder="Search actions..."
                onSearch={setSearchTerm}
                onViewChange={setViewMode}
                viewMode={viewMode}
                onCreate={() => handleOpen()}
                createLabel="New Action"
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
                                <TableCell>Action Type</TableCell>
                                <TableCell>Employees</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>Start Date</TableCell>
                                <TableCell>Duration</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredActions.map((action) => (
                                <TableRow key={action.id} hover>
                                    <TableCell>{action.action_type || getActionName(action.action)}</TableCell>
                                    <TableCell>
                                        {action.employee_id.map(emp => (
                                            <div key={emp.id || emp}>{emp.employee_first_name} {emp.employee_last_name}</div>
                                        ))}
                                    </TableCell>
                                    <TableCell>{action.description}</TableCell>
                                    <TableCell>{action.start_date}</TableCell>
                                    <TableCell>
                                        {action.unit_in === 'days' ? `${action.days} Days` : `${action.hours} Hours`}
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton size="small" color="primary" onClick={() => handleOpen(action)}>
                                            <Edit />
                                        </IconButton>
                                        <IconButton size="small" color="error" onClick={() => handleDelete(action.id)}>
                                            <Delete />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {filteredActions.length === 0 && !loading && (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">No disciplinary actions found</TableCell>
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
                        {filteredActions.map((action, index) => (
                            <Grid item xs={12} sm={6} md={4} key={action.id} component={motion.div}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.2, delay: index * 0.05 }}
                            >
                                <Box sx={{
                                    p: 3,
                                    bgcolor: 'white',
                                    borderRadius: 4,
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    border: '1px solid #f1f5f9',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                    '&:hover': {
                                        transform: 'translateY(-8px)',
                                        boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
                                        borderColor: 'primary.main'
                                    },
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                                }}>
                                    <Typography variant="h6" fontWeight="bold" sx={{ color: '#1e293b', mb: 1.5 }}>
                                        {action.action_type || getActionName(action.action)}
                                    </Typography>
                                    <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {action.employee_id.map(emp => (
                                            <Chip
                                                key={emp.id || emp}
                                                label={`${emp.employee_first_name} ${emp.employee_last_name}`}
                                                size="small"
                                                sx={{ borderRadius: '6px', bgcolor: '#f1f5f9', fontWeight: 500 }}
                                            />
                                        ))}
                                    </Box>
                                    <Typography variant="body2" color="textSecondary" sx={{ mb: 2, flexGrow: 1, minHeight: '3em' }}>
                                        {action.description}
                                    </Typography>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, p: 1, bgcolor: '#f8fafc', borderRadius: 2 }}>
                                        <Box>
                                            <Typography variant="caption" display="block" color="textSecondary">Start Date</Typography>
                                            <Typography variant="body2" fontWeight="600">{action.start_date}</Typography>
                                        </Box>
                                        <Box sx={{ textAlign: 'right' }}>
                                            <Typography variant="caption" display="block" color="textSecondary">Duration</Typography>
                                            <Typography variant="body2" fontWeight="600" color="error.main">
                                                {action.unit_in === 'days' ? `${action.days} Days` : `${action.hours} Hours`}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #f1f5f9', pt: 2, gap: 1 }}>
                                        <IconButton size="small" onClick={() => handleOpen(action)} title="Edit"><Edit /></IconButton>
                                        <IconButton size="small" color="error" onClick={() => handleDelete(action.id)} title="Delete"><Delete /></IconButton>
                                    </Box>
                                </Box>
                            </Grid>
                        ))}
                    </AnimatePresence>
                </Grid>
            )}

            <Dialog open={openModal} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>{editingId ? 'Edit Action' : 'New Disciplinary Action'}</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <FormControl fullWidth required>
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
                        <Grid item xs={12}>
                            <FormControl fullWidth required>
                                <InputLabel>Action Type</InputLabel>
                                <Select
                                    name="action"
                                    value={formData.action}
                                    onChange={handleChange}
                                    label="Action Type"
                                >
                                    {actionTypes.map(type => (
                                        <MenuItem key={type.id} value={type.id}>{type.title}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Start Date"
                                name="start_date"
                                type="date"
                                value={formData.start_date}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                                required
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth required>
                                <InputLabel>Unit In</InputLabel>
                                <Select
                                    name="unit_in"
                                    value={formData.unit_in}
                                    onChange={handleChange}
                                    label="Unit In"
                                >
                                    <MenuItem value="days">Days</MenuItem>
                                    <MenuItem value="hours">Hours</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            {formData.unit_in === 'days' ? (
                                <TextField
                                    fullWidth
                                    label="Days"
                                    name="days"
                                    type="number"
                                    value={formData.days}
                                    onChange={handleChange}
                                />
                            ) : (
                                <TextField
                                    fullWidth
                                    label="Hours (HH:MM)"
                                    name="hours"
                                    value={formData.hours}
                                    onChange={handleChange}
                                />
                            )}
                        </Grid>

                        <Grid item xs={12}>
                            <Button
                                variant="outlined"
                                component="label"
                                startIcon={<AttachFile />}
                                fullWidth
                            >
                                Upload Attachment
                                <input
                                    type="file"
                                    hidden
                                    name="attachment"
                                    onChange={handleChange}
                                />
                            </Button>
                            {formData.attachment && <Typography variant="caption">{formData.attachment.name}</Typography>}
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
                                required
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

export default DisciplinaryActions;
