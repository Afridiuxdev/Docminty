"use client";
import { useEffect, useState } from "react";
import { authApi } from "@/api/auth";

/**
 * Custom hook to sync user profile data to generator forms.
 * @param {Object} form - Current form state
 * @param {Function} setForm - Function to update form state
 * @param {String} plan - User subscription plan (uppercase)
 */
export function useProfileSync(form, setForm, plan) {
    const [synced, setSynced] = useState(false);

    useEffect(() => {
        // Only sync if:
        // 1. User is Pro or Enterprise
        // 2. We haven't synced yet in this session
        // 3. The form is still empty (checks different possible name fields)
        const isPro = plan === "PRO" || plan === "ENTERPRISE";
        const hasData = form.fromName || form.companyName || form.orgName;
        if (!isPro || synced || hasData) return;

        authApi.me()
            .then(res => {
                const u = res.data.data;
                if (!u) return;

                setForm(prev => {
                    const next = { ...prev };
                    
                    // Names
                    if (next.fromName !== undefined) next.fromName = u.company || u.name || prev.fromName;
                    if (next.companyName !== undefined) next.companyName = u.company || u.name || prev.companyName;
                    if (next.orgName !== undefined) next.orgName = u.company || u.name || prev.orgName;

                    // Address
                    if (next.fromAddress !== undefined) next.fromAddress = u.address || prev.fromAddress;
                    if (next.companyAddress !== undefined) next.companyAddress = u.address || prev.companyAddress;
                    if (next.orgAddress !== undefined) next.orgAddress = u.address || prev.orgAddress;

                    // City
                    if (next.fromCity !== undefined) next.fromCity = u.city || prev.fromCity;
                    if (next.companyCity !== undefined) next.companyCity = u.city || prev.companyCity;
                    if (next.orgCity !== undefined) next.orgCity = u.city || prev.orgCity;

                    // State
                    if (next.fromState !== undefined) next.fromState = u.state || prev.fromState;
                    if (next.companyState !== undefined) next.companyState = u.state || prev.companyState;
                    if (next.orgState !== undefined) next.orgState = u.state || prev.orgState;

                    // Phone
                    if (next.fromPhone !== undefined) next.fromPhone = u.phone || prev.fromPhone;
                    if (next.companyPhone !== undefined) next.companyPhone = u.phone || prev.companyPhone;
                    if (next.orgPhone !== undefined) next.orgPhone = u.phone || prev.orgPhone;

                    // Email
                    if (next.fromEmail !== undefined) next.fromEmail = u.email || prev.fromEmail;
                    if (next.companyEmail !== undefined) next.companyEmail = u.email || prev.companyEmail;
                    if (next.orgEmail !== undefined) next.orgEmail = u.email || prev.orgEmail;

                    // GSTIN
                    if (next.fromGSTIN !== undefined) next.fromGSTIN = u.gstin || prev.fromGSTIN;
                    if (next.companyGSTIN !== undefined) next.companyGSTIN = u.gstin || prev.companyGSTIN;

                    // Website
                    if (next.companyWebsite !== undefined) next.companyWebsite = u.website || prev.companyWebsite;
                    if (next.orgWebsite !== undefined) next.orgWebsite = u.website || prev.orgWebsite;

                    // Global elements
                    next.logo = u.logo || localStorage.getItem("docminty_logo") || prev.logo;
                    next.signature = u.signature || localStorage.getItem("docminty_signature") || prev.signature;

                    return next;
                });
                
                setSynced(true);
            })
            .catch(err => console.error("Profile sync failed:", err));
    }, [plan, synced, form.fromName, form.companyName, form.orgName, setForm]);

    return { synced };
}
