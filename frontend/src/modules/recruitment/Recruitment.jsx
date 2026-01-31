import React, { useState } from 'react';
import { FaChartPie, FaBriefcase, FaUserTie, FaLayerGroup, FaPollH } from 'react-icons/fa';
import ModuleLayout from '../../components/common/ModuleLayout';
import JobOpenings from './submodules/JobOpenings';
import CandidateTracking from './submodules/CandidateTracking';
import PipelineStages from './submodules/PipelineStages';
import ModulePlaceholder from '../../components/common/ModulePlaceholder';

import RecruitmentOverview from './submodules/RecruitmentOverview';

const Recruitment = () => {
    const [activeSub, setActiveSub] = useState('overview'); // Changed default to overview

    const subModules = [
        { id: 'overview', name: 'Overview', icon: <FaChartPie /> },
        { id: 'jobs', name: 'Job Openings', icon: <FaBriefcase /> },
        { id: 'candidates', name: 'Candidates', icon: <FaUserTie /> },
        { id: 'stages', name: 'Pipeline Stages', icon: <FaLayerGroup /> },
        { id: 'surveys', name: 'Surveys', icon: <FaPollH /> },
    ];

    const renderContent = () => {
        switch (activeSub) {
            case 'overview': return <RecruitmentOverview />;
            case 'jobs': return <JobOpenings />;
            case 'candidates': return <CandidateTracking />;
            case 'stages': return <PipelineStages />;
            case 'surveys': return <ModulePlaceholder name="Survey Templates" description="Create candidate feedback surveys and interview questionnaires." />;
            default: return null;
        }
    };

    return (
        <ModuleLayout
            title="Recruitment"
            subModules={subModules}
            activeSubModule={activeSub}
            onSubModuleChange={setActiveSub}
        >
            {renderContent()}
        </ModuleLayout>
    );
};

export default Recruitment;
