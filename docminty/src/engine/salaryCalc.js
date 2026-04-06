// Salary calculation engine — PF, TDS, net pay

export function calculateSalary(data) {
    const basic = parseFloat(data.basic) || 0;
    const hra = parseFloat(data.hra) || 0;
    const da = parseFloat(data.da) || 0;
    const conveyance = parseFloat(data.conveyance) || 0;
    const medical = parseFloat(data.medical) || 0;
    const otherAllowances = parseFloat(data.otherAllowances) || 0;

    // Gross salary
    const grossSalary = basic + hra + da + conveyance + medical + otherAllowances;

    // Deductions
    const pfRate = 0.12; // 12% of basic
    const employeePF = Math.min(basic * pfRate, 1800); // capped at ₹1800
    const employerPF = Math.min(basic * pfRate, 1800);
    const professionalTax = getProfessionalTax(grossSalary);
    const incomeTax = parseFloat(data.incomeTax) || 0;
    const otherDeductions = parseFloat(data.otherDeductions) || 0;
    const esi = grossSalary <= 21000 ? grossSalary * 0.0075 : 0; // ESI if salary <= 21000

    const totalDeductions = employeePF + professionalTax +
        incomeTax + otherDeductions + esi;

    const netSalary = grossSalary - totalDeductions;

    return {
        basic,
        hra,
        da,
        conveyance,
        medical,
        otherAllowances,
        grossSalary: grossSalary.toFixed(2),
        employeePF: employeePF.toFixed(2),
        employerPF: employerPF.toFixed(2),
        professionalTax: professionalTax.toFixed(2),
        incomeTax: incomeTax.toFixed(2),
        esi: esi.toFixed(2),
        otherDeductions: otherDeductions.toFixed(2),
        totalDeductions: totalDeductions.toFixed(2),
        netSalary: netSalary.toFixed(2),
    };
}

function getProfessionalTax(grossSalary) {
    // Maharashtra PT slabs (most common)
    if (grossSalary <= 7500) return 0;
    if (grossSalary <= 10000) return 175;
    return 200;
}