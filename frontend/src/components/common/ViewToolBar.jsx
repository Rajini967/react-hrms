import React, { useState } from 'react';
import { Box, Button, TextField, IconButton, ButtonGroup, InputAdornment, Menu, MenuItem } from '@mui/material';
import { Search, FilterList, ViewList, ViewModule, MoreVert, Add, GroupWork } from '@mui/icons-material';

const ViewToolBar = ({
    onSearch,
    onFilter,
    onViewChange,
    onAction,
    onCreate,
    viewMode, // 'list' | 'grid'
    searchPlaceholder = "Search...",
    showCreate = true,
    createLabel = "Create",
    showFilter = true,
    showGroup = true,
    showActions = true,
}) => {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleActionClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleActionClose = (action) => {
        setAnchorEl(null);
        if (action && onAction) onAction(action);
    };

    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1 }}>
                {/* Search */}
                <TextField
                    placeholder={searchPlaceholder}
                    size="small"
                    onChange={(e) => onSearch && onSearch(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search color="action" />
                            </InputAdornment>
                        ),
                    }}
                    sx={{ bgcolor: 'white', borderRadius: 1, minWidth: '300px' }}
                />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {/* View Toggle */}
                {onViewChange && (
                    <ButtonGroup variant="outlined" sx={{ bgcolor: 'white' }}>
                        <Button
                            variant={viewMode === 'list' ? 'contained' : 'outlined'}
                            onClick={() => onViewChange('list')}
                            sx={{ px: 1 }}
                        >
                            <ViewList />
                        </Button>
                        <Button
                            variant={viewMode === 'grid' ? 'contained' : 'outlined'}
                            onClick={() => onViewChange('grid')}
                            sx={{ px: 1 }}
                        >
                            <ViewModule />
                        </Button>
                    </ButtonGroup>
                )}

                {/* Filter */}
                {showFilter && (
                    <Button
                        variant="outlined"
                        startIcon={<FilterList />}
                        onClick={onFilter}
                        sx={{ bgcolor: 'white', color: '#64748b', borderColor: '#e2e8f0', textTransform: 'none' }}
                    >
                        Filter
                    </Button>
                )}

                {/* Group By */}
                {showGroup && (
                    <Button
                        variant="outlined"
                        startIcon={<GroupWork />}
                        // onClick={onGroup}
                        sx={{ bgcolor: 'white', color: '#64748b', borderColor: '#e2e8f0', textTransform: 'none' }}
                    >
                        Group By
                    </Button>
                )}

                {/* Actions Dropdown */}
                {showActions && (
                    <>
                        <Button
                            variant="outlined"
                            endIcon={<MoreVert />}
                            onClick={handleActionClick}
                            sx={{ bgcolor: 'white', color: '#64748b', borderColor: '#e2e8f0', textTransform: 'none' }}
                        >
                            Actions
                        </Button>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={() => handleActionClose()}
                        >
                            <MenuItem onClick={() => handleActionClose('export')}>Export</MenuItem>
                            <MenuItem onClick={() => handleActionClose('archive')}>Archive</MenuItem>
                            <MenuItem onClick={() => handleActionClose('delete')}>Delete</MenuItem>
                        </Menu>
                    </>
                )}

                {/* Create Button */}
                {showCreate && (
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={onCreate}
                        sx={{
                            background: 'linear-gradient(45deg, #2563eb 30%, #3b82f6 90%)',
                            color: 'white',
                            textTransform: 'none',
                            fontWeight: 600,
                            boxShadow: '0 4px 6px rgba(37, 99, 235, 0.2)'
                        }}
                    >
                        {createLabel}
                    </Button>
                )}
            </Box>
        </Box>
    );
};

export default ViewToolBar;
