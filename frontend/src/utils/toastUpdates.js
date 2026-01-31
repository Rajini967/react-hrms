// This script contains the toast notification update pattern for all settings submodules

const toastUpdates = {
    imports: `import useToast from '../../../hooks/useToast';
import Toast from '../../../components/common/Toast';`,

    hookUsage: `const { toasts, showToast, removeToast } = useToast();`,

    createSuccess: (entityName) => `showToast('${entityName} created successfully!', 'success');`,
    updateSuccess: (entityName) => `showToast('${entityName} updated successfully!', 'success');`,
    deleteSuccess: (entityName) => `showToast('${entityName} deleted successfully!', 'success');`,
    error: (message) => `showToast(${message}, 'error');`,

    toastContainer: `
            {/* Toast Notifications */}
            <AnimatePresence>
                {toasts.map(toast => (
                    <Toast
                        key={toast.id}
                        message={toast.message}
                        type={toast.type}
                        onClose={() => removeToast(toast.id)}
                        duration={toast.duration}
                    />
                ))}
            </AnimatePresence>`
};

// Entity names for each submodule
const entityNames = {
    'CandidateRejectReason': 'Reject reason',
    'LinkedinIntegration': 'LinkedIn account',
    'Companies': 'Company',
    'Departments': 'Department',
    'JobPositions': 'Job position',
    'JobRoles': 'Job role'
};

export default toastUpdates;
