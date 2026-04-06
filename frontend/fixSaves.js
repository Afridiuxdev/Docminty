const fs = require('fs');
const path = require('path');

const apps = [
  'quotation', 'receipt', 'proforma-invoice', 'purchase-order', 'packing-slip', 'payment-voucher', 'rent-receipt',
  'salary-slip', 'experience-letter', 'resignation-letter', 'job-offer-letter',
  'certificate', 'internship-certificate'
];

apps.forEach(app => {
  const p = path.join('c:/Users/admin/Documents/DocMintyC/docminty/src/app', app, 'page.jsx');
  if (!fs.existsSync(p)) return;
  
  let code = fs.readFileSync(p, 'utf8');
  let changed = false;

  // 1. Check/add useAuth import
  if (!code.includes('useAuth')) {
    code = code.replace(/import { useState[^}]* } from "react";/, match => match + '\nimport { useAuth } from "@/contexts/AuthContext";');
    if (!code.includes('useAuth')) {
       code = 'import { useAuth } from "@/contexts/AuthContext";\n' + code;
    }
    changed = true;
  }

  // 2. Extract user in main component
  const exportMatch = code.match(/export default function \w+\(\) \{/);
  if (exportMatch && !code.includes('const { user } = useAuth();')) {
    code = code.replace(exportMatch[0], exportMatch[0] + '\n  const { user } = useAuth();');
    changed = true;
  }

  // 3. Wrap button
  const startIdx = code.indexOf('<button onClick={handleSave}');
  if (startIdx !== -1) {
    const endIdx = code.indexOf('</button>', startIdx) + 9;
    const buttonCode = code.slice(startIdx, endIdx);
    
    // Check if it's already wrapped
    const beforeStr = code.slice(startIdx - 20, startIdx);
    if (!beforeStr.includes('user && (')) {
      const wrapped = '{user && (\n' + buttonCode + '\n)}';
      code = code.substring(0, startIdx) + wrapped + code.substring(endIdx);
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(p, code);
    console.log(app, 'updated');
  } else {
    console.log(app, 'no changes');
  }
});
