"use client";
import { useEffect, useState } from "react";
import { authApi, getAccessToken } from "@/api/auth";

// Maps the hook's internal key names to the actual user profile value
const PROFILE_SOURCE = (u) => ({
  fromName:       u.company || u.name,
  companyName:    u.company || u.name,
  orgName:        u.company || u.name,
  fromAddress:    u.address,
  companyAddress: u.address,
  orgAddress:     u.address,
  fromCity:       u.city,
  companyCity:    u.city,
  orgCity:        u.city,
  fromState:      u.state,
  companyState:   u.state,
  orgState:       u.state,
  fromPhone:      u.phone,
  companyPhone:   u.phone,
  orgPhone:       u.phone,
  fromEmail:      u.email,
  companyEmail:   u.email,
  orgEmail:       u.email,
  fromGSTIN:      u.gstin,
  companyGSTIN:   u.gstin,
  companyGst:     u.gstin,
  fromWebsite:    u.website,
  companyWebsite: u.website,
  orgWebsite:     u.website,
});

/**
 * Auto-fills form fields from the logged-in user's profile.
 * @param {Object}   form      Current form state
 * @param {Function} setForm   Form state setter
 * @param {string}   plan      User plan (kept for API compat, no longer gates sync)
 * @param {Object}   fieldMap  Optional override: { profileKey: "formFieldName" }
 *                             e.g. { fromName: "landlordName" } maps profile company/name → landlordName
 */
export function useProfileSync(form, setForm, plan, fieldMap = {}) {
  const [synced, setSynced] = useState(false);
  const hasMappings = Object.keys(fieldMap).length > 0;

  useEffect(() => {
    const isPro = plan === "PRO" || plan === "ENTERPRISE";
    if (!isPro) return;

    const isLoggedIn = !!getAccessToken();

    // hasData: check standard name fields + any custom-mapped name field
    const mappedNameField = fieldMap.fromName || fieldMap.companyName || fieldMap.orgName;
    const hasData =
      form.fromName || form.companyName || form.orgName ||
      (mappedNameField && form[mappedNameField]);

    if (!isLoggedIn || synced || hasData) return;

    authApi.me()
      .then((res) => {
        const u = res.data?.data;
        if (!u) return;

        setForm((prev) => {
          const next = { ...prev };
          const src = PROFILE_SOURCE(u);

          // Default mappings — only writes to fields that actually exist in the form
          Object.entries(src).forEach(([key, value]) => {
            if (next[key] !== undefined && value) next[key] = value;
          });

          // Custom fieldMap overrides — e.g. { fromName: "landlordName" }
          if (hasMappings) {
            Object.entries(fieldMap).forEach(([profileKey, formKey]) => {
              const value = src[profileKey];
              if (next[formKey] !== undefined && value) next[formKey] = value;
            });
          }

          // Logo from profile
          if (u.logo) next.logo = u.logo;

          return next;
        });

        setSynced(true);
      })
      .catch((err) => console.error("Profile sync failed:", err));
  }, [synced, form.fromName, form.companyName, form.orgName, setForm]);

  return { synced };
}
