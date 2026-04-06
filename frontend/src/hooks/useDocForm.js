"use client";
import { useState } from "react";

export function useDocForm(initialState) {
    const [formData, setFormData] = useState(initialState);

    const updateField = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const updateNested = (section, field, value) => {
        setFormData((prev) => ({
            ...prev,
            [section]: { ...prev[section], [field]: value },
        }));
    };

    const resetForm = () => setFormData(initialState);

    return { formData, updateField, updateNested, resetForm, setFormData };
}