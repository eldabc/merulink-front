import React from 'react';
import SubDepartmentForm from './SubDepartmentForm';

export default function SubDepartmentAdd({ subDepartment, onBack, onCreated }) {
    const handleSave = async (formData) => {
        // POST a backend aquí.
        if (onCreated) onCreated(formData);
        if (onBack) onBack();
    };

    return <SubDepartmentForm mode="create" department={subDepartment} onSave={handleSave} onBack={onBack} />;
};