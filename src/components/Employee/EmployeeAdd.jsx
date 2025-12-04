import React from 'react';
import EmployeeForm from './EmployeeForm';

export default function EmployeeAdd({ employee, onBack, onCreated }) {
    const handleSave = async (formData) => {
        // En un flujo real harías POST a tu backend aquí.
        if (onCreated) onCreated(formData);
        if (onBack) onBack();
    };

    return <EmployeeForm mode="create" employee={employee} onSave={handleSave} onCancel={onBack} />;
};