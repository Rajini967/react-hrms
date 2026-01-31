import React, { useState } from 'react';
import { FaBoxOpen, FaUserTag, FaTags, FaTools, FaHandHolding } from 'react-icons/fa';
import ModuleLayout from '../../components/common/ModuleLayout';
import AssetInventory from './submodules/AssetInventory';
import AssetCategories from './submodules/AssetCategories';
import AssetAllocations from './submodules/AssetAllocations';
import AssetRequests from './submodules/AssetRequests';
import ModulePlaceholder from '../../components/common/ModulePlaceholder';

const Assets = () => {
    const [activeSub, setActiveSub] = useState('inventory');

    const subModules = [
        { id: 'inventory', name: 'Asset Inventory', icon: <FaBoxOpen /> },
        { id: 'allocations', name: 'Allocations', icon: <FaUserTag /> },
        { id: 'categories', name: 'Asset Categories', icon: <FaTags /> },
        { id: 'requests', name: 'Asset Requests', icon: <FaHandHolding /> },
        { id: 'maintenance', name: 'Maintenance', icon: <FaTools /> },
    ];

    const renderContent = () => {
        switch (activeSub) {
            case 'inventory': return <AssetInventory />;
            case 'allocations': return <AssetAllocations />;
            case 'categories': return <AssetCategories />;
            case 'requests': return <AssetRequests />;
            case 'maintenance': return <ModulePlaceholder name="Maintenance & Repair" description="Schedule regular servicing, track repair history, and manage equipment warranty information." />;
            default: return null;
        }
    };

    return (
        <ModuleLayout
            title="Asset Management"
            subModules={subModules}
            activeSubModule={activeSub}
            onSubModuleChange={setActiveSub}
        >
            {renderContent()}
        </ModuleLayout>
    );
};

export default Assets;
