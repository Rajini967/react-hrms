
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
    Chip
} from '@mui/material';
import { Add, Edit, Delete, Refresh } from '@mui/icons-material';
import api from '../../../services/api';
import { toast } from 'react-toastify';
import ViewToolBar from '../../../components/common/ViewToolBar';
import { motion, AnimatePresence } from 'framer-motion';

const BASED_ON_OPTIONS = [
    { value: 'after', label: 'After (Days)' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
];

const WEEK_DAYS = [
    { value: 'monday', label: 'Monday' },
    { value: 'tuesday', label: 'Tuesday' },
    { value: 'wednesday', label: 'Wednesday' },
    { value: 'thursday', label: 'Thursday' },
    { value: 'friday', label: 'Friday' },
    { value: 'saturday', label: 'Saturday' },
    { value: 'sunday', label: 'Sunday' },
];

const DAY_DATES = Array.from({ length: 31 }, (_, i) => ({ value: (i + 1).toString(), label: (i + 1).toString() }));
DAY_DATES.push({ value: 'last', label: 'Last Day' });


const RotatingShiftAssign = ({ employeeId }) => {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('list');
    const [openModal, setOpenModal] = useState(false);
    const [employees, setEmployees] = useState([]);
    const [rotatingShifts, setRotatingShifts] = useState([]);
    const [formData, setFormData] = useState({
        employee_id: '',
        rotating_shift_id: '',
        start_date: new Date().toISOString().split('T')[0],
        based_on: 'after',
        rotate_after_day: 7,
        rotate_every_weekend: 'monday',
        rotate_every: '1'
    });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchAssignments();
        fetchEmployees();
        fetchRotatingShifts();
    }, []);

    const fetchAssignments = async () => {
        try {
            const url = employeeId
                ? `/base/rotating-shift-assigns/?employee_id=${employeeId}`
                : '/base/rotating-shift-assigns/';
            const response = await api.get(url);
            const data = response.data.results || response.data;
            setAssignments(data);
        } catch (error) {
            console.error('Error fetching assignments:', error);
            toast.error('Failed to load assignments');
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

    const fetchRotatingShifts = async () => {
        try {
            const response = await api.get('/base/rotating-shifts/');
            const data = response.data.results || response.data;
            setRotatingShifts(data);
        } catch (error) {
            console.error('Error fetching rotating shifts:', error);
        }
    };


    const handleOpen = (assignment = null) => {
        if (assignment) {
            setEditingId(assignment.id);
            setFormData({
                employee_id: assignment.employee_id,
                rotating_shift_id: assignment.rotating_shift_id,
                start_date: assignment.start_date,
                based_on: assignment.based_on,
                rotate_after_day: assignment.rotate_after_day,
                rotate_every_weekend: assignment.rotate_every_weekend,
                rotate_every: assignment.rotate_every
            });
        } else {
            setEditingId(null);
            setFormData({
                employee_id: '',
                rotating_shift_id: '',
                start_date: new Date().toISOString().split('T')[0],
                based_on: 'after',
                rotate_after_day: 7,
                rotate_every_weekend: 'monday',
                rotate_every: '1'
            });
        }
        setOpenModal(true);
    };

    const handleClose = () => {
        setOpenModal(false);
        setEditingId(null);
    };

    const filteredAssignments = assignments.filter(a =>
        getEmployeeName(a.employee_id).toLowerCase().includes(searchTerm.toLowerCase()) ||
        (a.rotating_shift_name || '').toLowerCase().includes(searchTerm.toLowerCase())
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
                await api.put(`/base/rotating-shift-assigns/${editingId}/`, formData);
                toast.success('Assignment updated successfully');
            } else {
                await api.post('/base/rotating-shift-assigns/', formData);
                toast.success('Assignment created successfully');
            }
            handleClose();
            fetchAssignments();
        } catch (error) {
            console.error('Error saving assignment:', error);
            toast.error('Failed to save assignment');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this assignment?')) {
            try {
                await api.delete(`/base/rotating-shift-assigns/${id}/`);
                toast.success('Assignment deleted successfully');
                fetchAssignments();
            } catch (error) {
                console.error('Error deleting assignment:', error);
                toast.error('Failed to delete assignment');
            }
        }
    };

    const getEmployeeName = (id) => {
        const emp = employees.find(e => e.id === id);
        return emp ? `${emp.employee_first_name} ${emp.employee_last_name}` : id;
    }

    const getRotatingShiftName = (id) => {
        const shift = rotatingShifts.find(s => s.id === id);
        return shift ? shift.name : id;
    }

    return (
        <Box sx={{ p: employeeId ? 0 : 3 }}>
            {!employeeId && (
                <ViewToolBar
                    searchPlaceholder="Search assignments..."
                    onSearch={setSearchTerm}
                    onViewChange={setViewMode}
                    viewMode={viewMode}
                    onCreate={() => handleOpen()}
                    createLabel="Assign Shift"
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
                                <TableCell>Rotating Shift</TableCell>
                                <TableCell>Start Date</TableCell>
                                <TableCell>Based On</TableCell>
                                <TableCell>Details</TableCell>
                                <TableCell>Next Switch</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredAssignments.map((assignment) => (
                                <TableRow key={assignment.id} hover>
                                    <TableCell>{getEmployeeName(assignment.employee_id)}</TableCell>
                                    <TableCell>{assignment.rotating_shift_name}</TableCell>
                                    <TableCell>{assignment.start_date}</TableCell>
                                    <TableCell>
                                        <Chip label={(assignment.based_on || '').toUpperCase()} size="small" />
                                    </TableCell>
                                    <TableCell>{assignment.rotate}</TableCell>
                                    <TableCell>{assignment.next_change_date}</TableCell>
                                    <TableCell align="right">
                                        <IconButton size="small" color="primary" onClick={() => handleOpen(assignment)}>
                                            <Edit />
                                        </IconButton>
                                        <IconButton size="small" color="error" onClick={() => handleDelete(assignment.id)}>
                                            <Delete />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {filteredAssignments.length === 0 && !loading && (
                                <TableRow>
                                    <TableCell colSpan={7} align="center">No assignments found</TableCell>
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
                        {filteredAssignments.map((assignment, index) => (
                            <Grid item xs={12} sm={6} md={4} key={assignment.id} component={motion.div}
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
                                    <Typography variant="h6" fontWeight="bold" sx={{ color: '#1e293b' }}>
                                        {getEmployeeName(assignment.employee_id)}
                                    </Typography>
                                    <Typography variant="body2" color="primary" fontWeight="600" sx={{ mb: 2 }}>
                                        {assignment.rotating_shift_name}
                                    </Typography>

                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2, flexGrow: 1 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 600 }}>Start Date</Typography>
                                            <Typography variant="body2" sx={{ fontWeight: 500 }}>{assignment.start_date}</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 600 }}>Next Change</Typography>
                                            <Typography variant="body2" sx={{ fontWeight: 500 }}>{assignment.next_change_date}</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                                            <Chip label={`Based On: ${assignment.based_on}`} size="small" variant="outlined" sx={{ borderRadius: '6px' }} />
                                        </Box>
                                    </Box>

                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #f1f5f9', pt: 2, mt: 2, gap: 1 }}>
                                        <IconButton size="small" onClick={() => handleOpen(assignment)} title="Edit"><Edit /></IconButton>
                                        <IconButton size="small" color="error" onClick={() => handleDelete(assignment.id)} title="Delete"><Delete /></IconButton>
                                    </Box>
                                </Box>
                            </Grid>
                        ))}
                    </AnimatePresence>
                </Grid>
            )}

            <Dialog open={openModal} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>{editingId ? 'Edit Assignment' : 'New Assignment'}</DialogTitle>
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
                                <InputLabel>Rotating Shift</InputLabel>
                                <Select
                                    name="rotating_shift_id"
                                    value={formData.rotating_shift_id}
                                    onChange={handleChange}
                                    label="Rotating Shift"
                                >
                                    {rotatingShifts.map((shift) => (
                                        <MenuItem key={shift.id} value={shift.id}>
                                            {shift.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
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
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth required>
                                <InputLabel>Based On</InputLabel>
                                <Select
                                    name="based_on"
                                    value={formData.based_on}
                                    onChange={handleChange}
                                    label="Based On"
                                >
                                    {BASED_ON_OPTIONS.map(option => (
                                        <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Conditional Fields based on 'based_on' */}
                        {formData.based_on === 'after' && (
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Rotate After (Days)"
                                    name="rotate_after_day"
                                    type="number"
                                    value={formData.rotate_after_day}
                                    onChange={handleChange}
                                    required
                                />
                            </Grid>
                        )}

                        {formData.based_on === 'weekly' && (
                            <Grid item xs={12}>
                                <FormControl fullWidth required>
                                    <InputLabel>Rotate Every Weekend</InputLabel>
                                    <Select
                                        name="rotate_every_weekend"
                                        value={formData.rotate_every_weekend}
                                        onChange={handleChange}
                                        label="Rotate Every Weekend"
                                    >
                                        {WEEK_DAYS.map(day => (
                                            <MenuItem key={day.value} value={day.value}>{day.label}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        )}

                        {formData.based_on === 'monthly' && (
                            <Grid item xs={12}>
                                <FormControl fullWidth required>
                                    <InputLabel>Rotate Every Month</InputLabel>
                                    <Select
                                        name="rotate_every"
                                        value={formData.rotate_every}
                                        onChange={handleChange}
                                        label="Rotate Every Month"
                                    >
                                        {DAY_DATES.map(date => (
                                            <MenuItem key={date.value} value={date.value}>{date.label}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        )}

                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained" color="primary">
                        {editingId ? 'Update' : 'Assign'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default RotatingShiftAssign;
