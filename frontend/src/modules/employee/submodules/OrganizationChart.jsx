
import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, IconButton } from '@mui/material';
import { Refresh } from '@mui/icons-material';
import api from '../../../services/api';
import { toast } from 'react-toastify';
import ReactFlow, {
    Background,
    Controls,
    MiniMap,
    useNodesState,
    useEdgesState,
    Handle,
    Position
} from 'reactflow';
import 'reactflow/dist/style.css';


const CustomNode = ({ data }) => {
    return (
        <div style={{
            padding: '12px 24px',
            borderRadius: '16px',
            background: 'white',
            minWidth: '180px',
            textAlign: 'center',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            border: '1px solid #f1f5f9',
            position: 'relative',
            fontFamily: "'Inter', sans-serif"
        }}>
            <Handle type="target" position={Position.Top} style={{ background: '#3b82f6', width: '8px', height: '8px' }} />
            <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: '#eff6ff',
                color: '#3b82f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 10px auto',
                fontSize: '18px'
            }}>
                {data.name.charAt(0)}
            </div>
            <div style={{ fontWeight: 700, fontSize: '14px', color: '#1e293b' }}>{data.name}</div>
            <div style={{ color: '#64748b', fontSize: '12px', marginTop: '2px', fontWeight: 500 }}>{data.role}</div>
            <Handle type="source" position={Position.Bottom} style={{ background: '#3b82f6', width: '8px', height: '8px' }} />
        </div>
    );
};

const nodeTypes = {
    custom: CustomNode,
};


const OrganizationChart = () => {
    const [employees, setEmployees] = useState([]);
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);


    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const response = await api.get('/employee/employees/');
            const data = response.data.results || response.data;
            setEmployees(data);
            buildChartData(data);
        } catch (error) {
            console.error('Error fetching employees for org chart:', error);
            toast.error('Failed to load organization chart');
        }
    };

    const buildChartData = (emps) => {
        // Simple hierarchy builder. 
        // 1. Identify root (managers of managers or no manager)
        // 2. BFS/DFS to layout

        // Map ID to employee
        const empMap = {};
        emps.forEach(e => empMap[e.id] = { ...e, children: [] });

        const roots = [];

        // Build tree
        emps.forEach(e => {
            // Check reporting manager
            // Note: backend 'reporting_manager_id' might be nested or direct ID. Assuming check needed.
            const managerId = e.employee_work_info?.reporting_manager_id?.id || e.employee_work_info?.reporting_manager_id;

            if (managerId && empMap[managerId]) {
                empMap[managerId].children.push(empMap[e.id]);
            } else {
                roots.push(empMap[e.id]);
            }
        });

        // Convert to React Flow Nodes/Edges
        const newNodes = [];
        const newEdges = [];
        let y = 0;

        const traverse = (node, x, y, level) => {
            newNodes.push({
                id: node.id.toString(),
                type: 'custom',
                data: {
                    name: `${node.employee_first_name} ${node.employee_last_name}`,
                    role: node.employee_work_info?.job_position_id?.job_position || 'Employee'
                },
                position: { x: x, y: y },
            });

            if (node.children.length > 0) {
                const width = node.children.length * 200;
                let startX = x - width / 2 + 100;

                node.children.forEach((child, index) => {
                    newEdges.push({
                        id: `e${node.id}-${child.id}`,
                        source: node.id.toString(),
                        target: child.id.toString(),
                        type: 'smoothstep'
                    });
                    traverse(child, startX + index * 200, y + 150, level + 1);
                });
            }
        }

        // Just visualize first root for now for simplicity, or handle multiple roots spaced out
        if (roots.length > 0) {
            // Basic layout: just putting roots next to each other
            roots.forEach((root, idx) => {
                traverse(root, idx * 400, 0, 0);
            });
        }

        setNodes(newNodes);
        setEdges(newEdges);
    };

    return (
        <Box sx={{ height: 'calc(100vh - 150px)', width: '100%', p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h5">Organization Chart</Typography>
                <IconButton onClick={fetchEmployees}><Refresh /></IconButton>
            </Box>
            <Box sx={{ height: 'calc(100vh - 200px)', width: '100%', border: '1px solid #f1f5f9', borderRadius: 4, overflow: 'auto', bgcolor: '#f8fafc' }}>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    nodeTypes={nodeTypes}
                    fitView
                    panOnScroll
                    selectionOnDrag
                    panOnDrag
                    attributionPosition="bottom-right"
                >
                    <Background color="#aaa" gap={16} />
                    <Controls />
                    <MiniMap />
                </ReactFlow>
            </Box>
        </Box>
    );
};

export default OrganizationChart;
