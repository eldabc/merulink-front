import React from 'react';
import DepartmentForm from './DepartmentForm';

export default function DepartmentAdd({ department, onBack, onCreated }) {
    const handleSave = async (formData) => {
        // POST a backend aquí.
        if (onCreated) onCreated(formData);
        if (onBack) onBack();
    };

    return <DepartmentForm mode="create" department={department} onSave={handleSave} onBack={onBack} />;
};