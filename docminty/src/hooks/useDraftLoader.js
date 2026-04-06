"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

/**
 * Custom hook to load a draft/saved document from localStorage into a generator.
 * @param {Function} setForm - Form state setter
 * @param {Function} onDownload - Optional callback if the action was "download"
 */
export function useDraftLoader(setForm, onDownload) {
    const [draftLoaded, setDraftLoaded] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [docMetaData, setDocMetaData] = useState(null);

    useEffect(() => {
        try {
            const draftStr = localStorage.getItem("docminty_draft");
            if (draftStr) {
                const data = JSON.parse(draftStr);
                
                setForm(prev => ({
                    ...prev,
                    ...data
                }));

                if (data.editMode) {
                    setIsEditMode(true);
                }

                if (data.docId) {
                    setDocMetaData({
                        id: data.docId,
                        viewMode: data.viewMode || false,
                        autoDownload: data.autoDownload || false
                    });
                } else if (data.editMode === false) {
                     // This was a duplicate
                     toast.success("Document duplicated successfully, you can now modify it.");
                }

                if (data.autoDownload && onDownload) {
                    // Slight delay to allow PDF viewer to generate
                    setTimeout(() => {
                        onDownload();
                    }, 1000);
                }

                // Clear the draft so we don't accidentally load it again if we refresh
                localStorage.removeItem("docminty_draft");
                setDraftLoaded(true);
            }
        } catch (e) {
            console.error("Draft load error:", e);
            localStorage.removeItem("docminty_draft");
        }
    }, [setForm, onDownload]);

    return { draftLoaded, isEditMode, docMetaData };
}
