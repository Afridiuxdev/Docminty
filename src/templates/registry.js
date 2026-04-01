// Template Registry - maps document type + template name to import
// Free users get "Classic" only. Pro users get all templates.

export const TEMPLATE_REGISTRY = {
  invoice: {
    Classic:   { name: "Classic",   pro: false, description: "Clean professional GST invoice",        accent: "#0D9488", preview: "clean"     },
    Minimal:   { name: "Minimal",   pro: false, description: "Ultra-clean minimal lines & typography", accent: "#111827", preview: "minimal"   },
    Modern:    { name: "Modern",    pro: true,  description: "Two-tone modern design with sidebar",    accent: "#6366F1", preview: "sidebar"   },
    Corporate: { name: "Corporate", pro: true,  description: "Formal corporate letterhead style",      accent: "#1E3A5F", preview: "corporate" },
    Elegant:   { name: "Elegant",   pro: true,  description: "Gold accent luxury design",              accent: "#D97706", preview: "elegant"   },
  },
  quotation: {
    Classic:   { name: "Classic",   pro: false, description: "Standard quotation format",              accent: "#0D9488", preview: "clean"     },
    Minimal:   { name: "Minimal",   pro: false, description: "Clean minimal quote layout",              accent: "#111827", preview: "minimal"   },
    Modern:    { name: "Modern",    pro: true,  description: "Modern with validity badge",              accent: "#6366F1", preview: "sidebar"   },
    Corporate: { name: "Corporate", pro: true,  description: "Formal corporate quote style",            accent: "#1E3A5F", preview: "corporate" },
    Elegant:   { name: "Elegant",   pro: true,  description: "Premium elegant quotation",               accent: "#D97706", preview: "elegant"   },
  },
  salary: {
    Classic:   { name: "Classic",   pro: false, description: "Standard payslip format",                accent: "#0D9488", preview: "clean"     },
    Minimal:   { name: "Minimal",   pro: false, description: "Clean minimal salary slip",               accent: "#111827", preview: "minimal"   },
    Modern:    { name: "Modern",    pro: true,  description: "Modern dark header payslip",              accent: "#6366F1", preview: "sidebar"   },
    Corporate: { name: "Corporate", pro: true,  description: "Corporate HR payslip style",              accent: "#1E3A5F", preview: "corporate" },
    Elegant:   { name: "Elegant",   pro: true,  description: "Premium elegant payslip",                 accent: "#D97706", preview: "elegant"   },
  },
  certificate: {
    Classic:   { name: "Classic",   pro: false, description: "Traditional border certificate",          accent: "#0D9488", preview: "clean"     },
    Minimal:   { name: "Minimal",   pro: false, description: "Ultra clean line certificate",             accent: "#111827", preview: "minimal"   },
    Modern:    { name: "Modern",    pro: true,  description: "Modern minimal certificate",               accent: "#6366F1", preview: "modern"    },
    Royal:     { name: "Royal",     pro: true,  description: "Royal gold ornamental design",             accent: "#D97706", preview: "royal"     },
    Elegant:   { name: "Elegant",   pro: true,  description: "Elegant ribbon-style certificate",         accent: "#7C3AED", preview: "elegant"   },
  },
  experience: {
    Classic:   { name: "Classic",   pro: false, description: "Standard experience letter",              accent: "#0D9488", preview: "clean"     },
    Minimal:   { name: "Minimal",   pro: false, description: "Clean minimal letter format",              accent: "#111827", preview: "minimal"   },
    Modern:    { name: "Modern",    pro: true,  description: "Modern sidebar accent letter",             accent: "#6366F1", preview: "sidebar"   },
    Corporate: { name: "Corporate", pro: true,  description: "Formal corporate letterhead",              accent: "#1E3A5F", preview: "corporate" },
    Elegant:   { name: "Elegant",   pro: true,  description: "Premium elegant letter design",            accent: "#D97706", preview: "elegant"   },
  },
  receipt: {
    Classic:   { name: "Classic",   pro: false, description: "Standard receipt format",                 accent: "#0D9488", preview: "clean"     },
    Minimal:   { name: "Minimal",   pro: false, description: "Clean minimal receipt layout",             accent: "#111827", preview: "minimal"   },
    Modern:    { name: "Modern",    pro: true,  description: "Modern sidebar receipt",                   accent: "#6366F1", preview: "sidebar"   },
    Corporate: { name: "Corporate", pro: true,  description: "Formal corporate receipt style",           accent: "#1E3A5F", preview: "corporate" },
    Elegant:   { name: "Elegant",   pro: true,  description: "Premium elegant receipt",                  accent: "#D97706", preview: "elegant"   },
  },
  resignation: {
    Classic:   { name: "Classic",   pro: false, description: "Standard resignation letter",              accent: "#0D9488", preview: "clean"     },
    Minimal:   { name: "Minimal",   pro: false, description: "Clean minimal letter format",              accent: "#111827", preview: "minimal"   },
    Modern:    { name: "Modern",    pro: true,  description: "Modern sidebar accent letter",              accent: "#6366F1", preview: "sidebar"   },
    Corporate: { name: "Corporate", pro: true,  description: "Formal corporate letter style",             accent: "#1E3A5F", preview: "corporate" },
    Elegant:   { name: "Elegant",   pro: true,  description: "Premium elegant letter design",             accent: "#D97706", preview: "elegant"   },
  },
  jobOffer: {
    Classic:   { name: "Classic",   pro: false, description: "Standard offer letter format",             accent: "#0D9488", preview: "clean"     },
    Minimal:   { name: "Minimal",   pro: false, description: "Clean minimal offer letter",                accent: "#111827", preview: "minimal"   },
    Modern:    { name: "Modern",    pro: true,  description: "Modern sidebar offer letter",               accent: "#6366F1", preview: "sidebar"   },
    Corporate: { name: "Corporate", pro: true,  description: "Formal corporate offer letter",             accent: "#1E3A5F", preview: "corporate" },
    Elegant:   { name: "Elegant",   pro: true,  description: "Premium elegant offer letter",              accent: "#D97706", preview: "elegant"   },
  },
  internship: {
    Classic:   { name: "Classic",   pro: false, description: "Traditional internship certificate",       accent: "#0D9488", preview: "clean"     },
    Minimal:   { name: "Minimal",   pro: false, description: "Clean modern internship cert",              accent: "#111827", preview: "minimal"   },
    Modern:    { name: "Modern",    pro: true,  description: "Modern header certificate",                 accent: "#6366F1", preview: "modern"    },
    Royal:     { name: "Royal",     pro: true,  description: "Royal border certificate style",            accent: "#D97706", preview: "royal"     },
    Elegant:   { name: "Elegant",   pro: true,  description: "Elegant sidebar certificate",               accent: "#7C3AED", preview: "elegant"   },
  },
};

export function getTemplates(docType) {
  return TEMPLATE_REGISTRY[docType] || {};
}

export function getFreeTemplate(docType) {
  const templates = TEMPLATE_REGISTRY[docType] || {};
  return Object.keys(templates).find(k => !templates[k].pro) || "Classic";
}

export async function loadTemplate(docType, templateName) {
  const key = docType + "_" + templateName;
  switch (key) {
    case "invoice_Classic":   return (await import("./invoice/Classic")).default;
    case "invoice_Minimal":   return (await import("./invoice/Minimal")).default;
    case "invoice_Modern":    return (await import("./invoice/Modern")).default;
    case "invoice_Corporate": return (await import("./invoice/Corporate")).default;
    case "invoice_Elegant":   return (await import("./invoice/Elegant")).default;
    case "quotation_Classic":   return (await import("./quotation/Classic")).default;
    case "quotation_Minimal":   return (await import("./quotation/Minimal")).default;
    case "quotation_Modern":    return (await import("./quotation/Modern")).default;
    case "quotation_Corporate": return (await import("./quotation/Corporate")).default;
    case "quotation_Elegant":   return (await import("./quotation/Elegant")).default;
    case "salary_Classic":   return (await import("./salary/Classic")).default;
    case "salary_Minimal":   return (await import("./salary/Minimal")).default;
    case "salary_Modern":    return (await import("./salary/Modern")).default;
    case "salary_Corporate": return (await import("./salary/Corporate")).default;
    case "salary_Elegant":   return (await import("./salary/Elegant")).default;
    case "certificate_Classic":   return (await import("./certificate/Classic")).default;
    case "certificate_Minimal":   return (await import("./certificate/Minimal")).default;
    case "certificate_Modern":    return (await import("./certificate/Modern")).default;
    case "certificate_Royal":     return (await import("./certificate/Royal")).default;
    case "certificate_Elegant":   return (await import("./certificate/Elegant")).default;
    case "experience_Classic":   return (await import("./experience/Classic")).default;
    case "experience_Minimal":   return (await import("./experience/Minimal")).default;
    case "experience_Modern":    return (await import("./experience/Modern")).default;
    case "experience_Corporate": return (await import("./experience/Corporate")).default;
    case "experience_Elegant":   return (await import("./experience/Elegant")).default;
    case "resignation_Classic":   return (await import("./resignation/Classic")).default;
    case "resignation_Minimal":   return (await import("./resignation/Minimal")).default;
    case "resignation_Modern":    return (await import("./resignation/Modern")).default;
    case "resignation_Corporate": return (await import("./resignation/Corporate")).default;
    case "resignation_Elegant":   return (await import("./resignation/Elegant")).default;
    case "jobOffer_Classic":   return (await import("./job-offer/Classic")).default;
    case "jobOffer_Minimal":   return (await import("./job-offer/Minimal")).default;
    case "jobOffer_Modern":    return (await import("./job-offer/Modern")).default;
    case "jobOffer_Corporate": return (await import("./job-offer/Corporate")).default;
    case "jobOffer_Elegant":   return (await import("./job-offer/Elegant")).default;
    case "internship_Classic":   return (await import("./internship/Classic")).default;
    case "internship_Minimal":   return (await import("./internship/Minimal")).default;
    case "internship_Modern":    return (await import("./internship/Modern")).default;
    case "internship_Royal":     return (await import("./internship/Royal")).default;
    case "internship_Elegant":   return (await import("./internship/Elegant")).default;
    default: return (await import("./invoice/Classic")).default;
  }
}
