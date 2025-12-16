import React from 'react';
import PositionForm from './PositionForm';

export default function PositionAdd({ position, onBack, onCreated }) {
    const handleSave = async (formData) => {
        // POST a backend aquí.
        if (onCreated) onCreated(formData);
        if (onBack) onBack();
    };

    return <PositionForm mode="create" position={position} onSave={handleSave} onBack={onBack} />;
};