import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserCircle, FaEnvelope, FaPhone, FaBuilding, FaUserTag, FaSearch, FaFilter, FaPlus, FaArrowRight, FaCheck } from 'react-icons/fa';
import ViewToolBar from '../../../components/common/ViewToolBar';
import Tesseract from 'tesseract.js';

import AddEmployeeWizard from './AddEmployeeWizard';

const EmployeeDirectory = ({ onViewProfile }) => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('grid');
    const [isAddingEmployee, setIsAddingEmployee] = useState(false);

    // Wizard State
    const [currentStep, setCurrentStep] = useState(1);
    const [createdEmployeeId, setCreatedEmployeeId] = useState(null);

    // Form Data - Expanded Based on Image 2
    const [personalData, setPersonalData] = useState({
        badge_id: '',
        employee_first_name: '',
        employee_last_name: '',
        email: '',
        phone: '',
        address: '',
        house_no: '',
        street: '',
        district: '',
        country: '',
        state: '',
        city: '',
        zip: '',
        dob: '',
        gender: 'male',
        qualification: '',
        experience: 0,
        marital_status: 'single',
        children: 0,
        emergency_contact: '',
        emergency_contact_name: '',
        emergency_contact_relation: '',
        aadhaar_number: '',
        aadhaar_full_name: '',
        aadhaar_dob: '',
        aadhaar_address: '',
        pan_number: '',
        pan_full_name: '',
        passport_number: '',
        passport_expiry: '',
        passport_issue_date: '',
        passport_nationality: '',
        driving_license: '',
        employee_profile: null,
        aadhaar_document: null,
        pan_document: null,
        passport_document: null,
        driving_license_document: null,
        resume_document: null,
        nationality: 'Indian',
    });

    // Form Data - Step: Work (Will be created after personal)
    const [workData, setWorkData] = useState({
        company_id: '',
        department_id: '',
        job_position_id: '',
        job_role_id: '',
        work_type_id: '',
        employee_type_id: '',
        shift_id: '',
        reporting_manager_id: '',
        date_joining: new Date().toISOString().split('T')[0],
        basic_salary: 0,
    });

    // Form Data - Step: Bank
    const [bankData, setBankData] = useState({
        bank_name: '',
        account_number: '',
        branch: '',
        ifsc_code: '',
        city: '',
        country: '',
    });

    // Real Auto-fill Logic using OCR
    const handleAutoFill = async (file, type) => {
        if (!file) return;

        console.log(`Processing ${type} document with OCR...`);

        if (type === 'aadhaar') {
            try {
                // Perform OCR
                const { data: { text } } = await Tesseract.recognize(file, 'eng', {
                    logger: m => console.log(m.status, Math.round(m.progress * 100) + '%')
                });

                console.log("OCR Results:", text);

                // 1. Extract Aadhaar Number (XXXX XXXX XXXX)
                const aadhaarRegex = /(\d{4}\s\d{4}\s\d{4})|(\d{12})/;
                const aadhaarMatch = text.match(aadhaarRegex);

                // 2. Extract Date of Birth (DD/MM/YYYY)
                const dobRegex = /(\d{2}[\/\-]\d{2}[\/\-]\d{4})/;
                const dobMatch = text.match(dobRegex);

                // 3. Extract Gender
                const genderRegex = /(Male|Female|MALE|FEMALE)/i;
                const genderMatch = text.match(genderRegex);

                // 4. Extract Name (Heuristic: usually line before DOB or above Aadhaar number)
                const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 2);
                let extractedName = "";

                for (let i = 0; i < lines.length; i++) {
                    const line = lines[i];
                    // Skip if line contains specific keywords
                    if (line.match(/Government of India/i) || line.match(/Unique Identification/i) || line.match(/Enrollment/i)) continue;

                    // If we find DOB line, name is often the previous line
                    if (line.match(/DOB|Birth|Year/i)) {
                        if (i > 0) extractedName = lines[i - 1];
                        break;
                    }

                    // If we find Aadhaar number and haven't found name yet
                    if (line.match(aadhaarRegex) && !extractedName) {
                        if (i > 1) extractedName = lines[i - 1];
                        break;
                    }
                }

                // Clean up name (remove common OCR artifacts)
                extractedName = extractedName.replace(/[0-9:;|]/g, '').trim();

                // Format DOB for HTML date input (DD/MM/YYYY -> YYYY-MM-DD)
                let formattedDob = "";
                if (dobMatch) {
                    const parts = dobMatch[0].split(/[\/\-]/);
                    if (parts.length === 3) {
                        // Check if it's DD/MM/YYYY or YYYY/MM/DD
                        if (parts[0].length === 4) {
                            formattedDob = `${parts[0]}-${parts[1]}-${parts[2]}`;
                        } else {
                            formattedDob = `${parts[2]}-${parts[1]}-${parts[0]}`;
                        }
                    }
                }

                // 5. Extract Address and PIN (Heuristic: Look for PIN code and Address keyword)
                const pinRegex = /\b\d{6}\b/;
                const pinMatch = text.match(pinRegex);

                let address = "";
                const addressIndex = text.search(/Address|To:/i);
                if (addressIndex !== -1) {
                    address = text.substring(addressIndex).split('\n').slice(0, 4).join(', ');
                }

                setPersonalData(prev => ({
                    ...prev,
                    aadhaar_number: aadhaarMatch ? aadhaarMatch[0] : prev.aadhaar_number,
                    aadhaar_full_name: extractedName || prev.aadhaar_full_name,
                    employee_first_name: extractedName ? extractedName.split(' ')[0] : prev.employee_first_name,
                    employee_last_name: extractedName ? extractedName.split(' ').slice(1).join(' ') : prev.employee_last_name,
                    dob: formattedDob || prev.dob,
                    gender: genderMatch ? genderMatch[0].toLowerCase() : prev.gender,
                    zip: pinMatch ? pinMatch[0] : prev.zip,
                    address: address || prev.address
                }));

            } catch (error) {
                console.error("Aadhaar OCR Error:", error);
            }
        } else if (type === 'pan') {
            try {
                const { data: { text } } = await Tesseract.recognize(file, 'eng');
                const panRegex = /[A-Z]{5}[0-9]{4}[A-Z]{1}/;
                const panMatch = text.match(panRegex);

                setPersonalData(prev => ({
                    ...prev,
                    pan_number: panMatch ? panMatch[0] : prev.pan_number,
                    pan_full_name: (prev.employee_first_name + ' ' + (prev.employee_last_name || '')).toUpperCase()
                }));
            } catch (error) {
                console.error("PAN OCR Error:", error);
            }
        } else if (type === 'passport') {
            // Simplified for now, can be expanded like Aadhaar
            setPersonalData(prev => ({
                ...prev,
                passport_number: "AUTO-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
            }));
        } else if (type === 'driving_license' || type === 'resume') {
            // Logic for other documents can be added here
            console.log(`OCR extraction for ${type} is not fully implemented yet.`);
        }
    };

    const handleFileChange = (e, field) => {
        const file = e.target.files[0];
        setPersonalData(prev => ({ ...prev, [field]: file }));

        // Trigger auto-fill if it's one of the specified documents
        if (field === 'aadhaar_document') handleAutoFill(file, 'aadhaar');
        if (field === 'pan_document') handleAutoFill(file, 'pan');
        if (field === 'passport_document') handleAutoFill(file, 'passport');
        if (field === 'driving_license_document') handleAutoFill(file, 'driving_license');
        if (field === 'resume_document') handleAutoFill(file, 'resume');
    };

    // Choices
    const [companies, setCompanies] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [jobPositions, setJobPositions] = useState([]);
    const [jobRoles, setJobRoles] = useState([]);
    const [workTypes, setWorkTypes] = useState([]);
    const [employeeTypes, setEmployeeTypes] = useState([]);
    const [shifts, setShifts] = useState([]);
    const [managers, setManagers] = useState([]);

    const fetchEmployees = async () => {
        try {
            const response = await api.get('/employee/employees/');
            setEmployees(response.data.results || response.data || []);
        } catch (error) {
            console.error("Error fetching employees:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchChoices = async () => {
        try {
            const [comp, dept, pos, roles, wTypes, eTypes, sfts, emps] = await Promise.all([
                api.get('/base/companies/'),
                api.get('/base/departments/'),
                api.get('/base/job-positions/'),
                api.get('/base/job-roles/'),
                api.get('/base/worktypes/'),
                api.get('/employee/employee-type/'),
                api.get('/base/employee-shift/'), // Assuming this endpoint exists, verify later
                api.get('/employee/employees/'),
            ]);
            setCompanies(comp.data.results || comp.data || []);
            setDepartments(dept.data.results || dept.data || []);
            setJobPositions(pos.data.results || pos.data || []);
            setJobRoles(roles.data.results || roles.data || []);
            setWorkTypes(wTypes.data.results || wTypes.data || []);
            setEmployeeTypes(eTypes.data.results || eTypes.data || []);
            setShifts(sfts.data.results || sfts.data || []);
            setManagers(emps.data.results || emps.data || []);
        } catch (error) {
            console.error("Error fetching choices:", error);
        }
    };

    useEffect(() => {
        fetchEmployees();
        fetchChoices();
    }, []);

    const filteredEmployees = employees.filter(emp =>
        (emp.employee_first_name + ' ' + (emp.employee_last_name || '')).toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );


    const handleEmployeeCreate = async (e) => {
        if (e) e.preventDefault();
        const data = new FormData();
        Object.keys(personalData).forEach(key => {
            if (personalData[key] !== null && personalData[key] !== undefined) {
                data.append(key, personalData[key]);
            }
        });

        try {
            const res = await api.post('/employee/employees/', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setCreatedEmployeeId(res.data.id);
            setCurrentStep(8);
        } catch (error) {
            console.error(error);
            alert("Error creating employee. Check mandatory fields and email uniqueness.");
        }
    };

    const handleCreateWork = async (e) => {
        e.preventDefault();
        try {
            await api.post('/employee/employee-work-information/', { ...workData, employee_id: createdEmployeeId });
            setCurrentStep(9);
        } catch (error) {
            alert("Error saving work info.");
        }
    };

    const handleCreateBank = async (e) => {
        e.preventDefault();
        try {
            await api.post('/employee/employee-bank-details/', { ...bankData, employee_id: createdEmployeeId });
            setIsAddingEmployee(false);
            resetWizard();
            fetchEmployees();
        } catch (error) {
            alert("Error saving bank details. Employee created but bank details failed.");
            setIsAddingEmployee(false); // Close anyway
            fetchEmployees();
        }
    };

    const resetWizard = () => {
        setCreatedEmployeeId(null);
        setCurrentStep(1);
        setPersonalData({
            badge_id: '',
            employee_first_name: '',
            employee_last_name: '',
            email: '',
            phone: '',
            address: '',
            country: '',
            state: '',
            city: '',
            zip: '',
            dob: '',
            gender: 'male',
            qualification: '',
            experience: 0,
            marital_status: 'single',
            children: 0,
            emergency_contact: '',
            emergency_contact_name: '',
            emergency_contact_relation: '',
            aadhaar_number: '',
            aadhaar_full_name: '',
            aadhaar_dob: '',
            aadhaar_address: '',
            pan_number: '',
            pan_full_name: '',
            passport_number: '',
            passport_expiry: '',
            passport_issue_date: '',
            passport_nationality: '',
            driving_license: '',
            employee_profile: null,
            aadhaar_document: null,
            pan_document: null,
            passport_document: null,
            driving_license_document: null,
            resume_document: null,
            nationality: 'Indian',
            house_no: '',
            street: '',
            district: '',
        });
        setWorkData({
            company_id: '',
            department_id: '',
            job_position_id: '',
            job_role_id: '',
            work_type_id: '',
            employee_type_id: '',
            shift_id: '',
            reporting_manager_id: '',
            date_joining: new Date().toISOString().split('T')[0],
            basic_salary: 0,
        });
        setBankData({
            bank_name: '',
            account_number: '',
            branch: '',
            ifsc_code: '',
            city: '',
            country: '',
        });
    };

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading directory...</div>;

    if (isAddingEmployee) {
        return (
            <AddEmployeeWizard
                onCancel={() => setIsAddingEmployee(false)}
                personalData={personalData}
                setPersonalData={setPersonalData}
                workData={workData}
                setWorkData={setWorkData}
                bankData={bankData}
                setBankData={setBankData}
                handleEmployeeCreate={handleEmployeeCreate}
                handleCreateWork={handleCreateWork}
                handleCreateBank={handleCreateBank}
                handleFileChange={handleFileChange}
                currentStep={currentStep}
                setCurrentStep={setCurrentStep}
                companies={companies}
                departments={departments}
                jobPositions={jobPositions}
                workTypes={workTypes}
                managers={managers}
            />
        );
    }

    return (
        <div style={{ padding: '1rem' }}>
            <ViewToolBar
                searchPlaceholder="Search employees..."
                onSearch={setSearchTerm}
                onViewChange={setViewMode}
                viewMode={viewMode}
                onCreate={() => setIsAddingEmployee(true)}
                createLabel="Add Employee"
                showFilter={true}
                showGroup={true}
                showActions={true}
            />

            {/* List View */}
            {viewMode === 'list' && (
                <div className="overflow-x-auto rounded-xl border border-gray-200">
                    <table className="w-full text-left bg-white">
                        <thead className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold">
                            <tr>
                                <th className="px-6 py-4">Employee</th>
                                <th className="px-6 py-4">Job Position</th>
                                <th className="px-6 py-4">Department</th>
                                <th className="px-6 py-4">Email</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredEmployees.map((emp) => (
                                <tr key={emp.id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => onViewProfile(emp.id)}>
                                    <td className="px-6 py-4 flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
                                            {emp.employee_profile ? (
                                                <img src={emp.employee_profile} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <FaUserCircle className="text-gray-400 text-2xl" />
                                            )}
                                        </div>
                                        <div className="font-semibold text-slate-800">{emp.employee_first_name} {emp.employee_last_name}</div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600 font-medium">{emp.job_position_name || '-'}</td>
                                    <td className="px-6 py-4 text-slate-600">{emp.department_name || '-'}</td>
                                    <td className="px-6 py-4 text-slate-500">{emp.email}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${emp.is_active ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${emp.is_active ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                            {emp.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-primary hover:text-blue-700 font-medium text-sm">View</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredEmployees.length === 0 && (
                        <div className="p-8 text-center text-gray-500">No employees found.</div>
                    )}
                </div>
            )}

            {/* Grid View */}
            {viewMode === 'grid' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                    {filteredEmployees.map((emp, idx) => (
                        <motion.div
                            key={emp.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.05 }}
                            whileHover={{ y: -5, boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}
                            style={{
                                backgroundColor: '#fff',
                                borderRadius: '24px',
                                padding: '1.75rem',
                                border: '1px solid #eef2f6',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                textAlign: 'center',
                                cursor: 'pointer',
                                position: 'relative',
                                transition: 'all 0.3s'
                            }}
                            onClick={() => onViewProfile(emp.id)}
                        >
                            <div style={{
                                width: '84px',
                                height: '84px',
                                borderRadius: '50%',
                                backgroundColor: '#f1f5f9',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'var(--primary-color)',
                                marginBottom: '1rem',
                                border: '4px solid #fff',
                                boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
                                overflow: 'hidden'
                            }}>
                                {emp.employee_profile ? <img src={emp.employee_profile} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <FaUserCircle size={64} />}
                            </div>

                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.25rem' }}>
                                {emp.employee_first_name} {emp.employee_last_name}
                            </h3>
                            <p style={{ color: 'var(--primary-color)', fontWeight: 600, fontSize: '0.875rem', marginBottom: '1rem' }}>
                                {emp.job_position_name || 'Employee'}
                            </p>

                            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem', paddingTop: '1.25rem', borderTop: '1px solid #f8fafc' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#64748b', fontSize: '0.85rem' }}>
                                    <FaEnvelope size={14} /> <span>{emp.email}</span>
                                </div>
                            </div>

                            <button style={{ marginTop: '1.5rem', width: '100%', padding: '0.65rem', borderRadius: '12px', background: 'var(--primary-color)', color: '#fff', border: 'none', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' }}>View Profile</button>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default EmployeeDirectory;
