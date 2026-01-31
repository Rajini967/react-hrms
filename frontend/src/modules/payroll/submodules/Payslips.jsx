import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { motion } from 'framer-motion';
import { FaFileInvoiceDollar, FaDownload, FaEnvelope, FaSearch } from 'react-icons/fa';

const Payslips = () => {
    const [payslips, setPayslips] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPayslips = async () => {
            try {
                const response = await api.get('/payroll/payslip/');
                setPayslips(response.data.results || response.data || []);
            } catch (error) {
                console.error("Error fetching payslips:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPayslips();
    }, []);

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading payslips...</div>;

    return (
        <div style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b' }}>Employee Payslips</h2>
                    <p style={{ color: '#64748b', marginTop: '0.25rem' }}>Review and distribute monthly salary statements</p>
                </div>
                <div style={{ position: 'relative' }}>
                    <FaSearch style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input
                        type="text"
                        placeholder="Search employee..."
                        style={{ padding: '0.75rem 1rem 0.75rem 2.8rem', borderRadius: '12px', border: '1px solid #e2e8f0', width: '250px' }}
                    />
                </div>
            </div>

            <div style={{ backgroundColor: '#fff', borderRadius: '24px', border: '1px solid #eef2f6', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #eef2f6' }}>
                            <th style={{ padding: '1.25rem', textAlign: 'left', color: '#64748b', fontWeight: 600 }}>Employee</th>
                            <th style={{ padding: '1.25rem', textAlign: 'left', color: '#64748b', fontWeight: 600 }}>Period</th>
                            <th style={{ padding: '1.25rem', textAlign: 'left', color: '#64748b', fontWeight: 600 }}>Gross Pay</th>
                            <th style={{ padding: '1.25rem', textAlign: 'left', color: '#64748b', fontWeight: 600 }}>Deductions</th>
                            <th style={{ padding: '1.25rem', textAlign: 'left', color: '#64748b', fontWeight: 600 }}>Net Pay</th>
                            <th style={{ padding: '1.25rem', textAlign: 'right', color: '#64748b', fontWeight: 600 }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payslips.map((slip, idx) => (
                            <motion.tr
                                key={slip.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: idx * 0.05 }}
                                style={{ borderBottom: '1px solid #f1f5f9' }}
                            >
                                <td style={{ padding: '1.25rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
                                            <FaFileInvoiceDollar size={16} />
                                        </div>
                                        <span style={{ fontWeight: 600, color: '#1e293b' }}>{slip.employee_name || 'Employee #' + slip.employee_id}</span>
                                    </div>
                                </td>
                                <td style={{ padding: '1.25rem', color: '#64748b' }}>{slip.start_date} - {slip.end_date}</td>
                                <td style={{ padding: '1.25rem', color: '#444' }}>{slip.gross_pay || '0.00'}</td>
                                <td style={{ padding: '1.25rem', color: '#ef4444' }}>-{slip.deduction || '0.00'}</td>
                                <td style={{ padding: '1.25rem', fontWeight: 800, color: 'var(--primary-color)' }}>{slip.net_pay || '0.00'}</td>
                                <td style={{ padding: '1.25rem', textAlign: 'right' }}>
                                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                                        <button style={{ padding: '0.5rem', borderRadius: '10px', background: '#f1f5f9', border: 'none', color: '#64748b', cursor: 'pointer' }} title="Download PDF"><FaDownload /></button>
                                        <button style={{ padding: '0.5rem', borderRadius: '10px', background: '#f1f5f9', border: 'none', color: '#64748b', cursor: 'pointer' }} title="Send via Email"><FaEnvelope /></button>
                                    </div>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
                {payslips.length === 0 && (
                    <div style={{ padding: '4rem', textAlign: 'center', color: '#94a3b8' }}>
                        No payslips generated for this period.
                    </div>
                )}
            </div>
        </div>
    );
};

export default Payslips;
