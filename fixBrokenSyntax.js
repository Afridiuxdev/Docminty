const fs = require('fs');

const apps = ['quotation', 'proforma-invoice', 'purchase-order', 'packing-slip'];

apps.forEach(app => {
    const file = `c:/Users/admin/Documents/DocMintyC/docminty/src/app/${app}/page.jsx`;
    if(!fs.existsSync(file)) return;
    
    let content = fs.readFileSync(file, 'utf8');

    const searchStrs = [
        "\n}) {\n  const update =",
        "\n}) {\n    const update ="
    ];

    let startIdx = -1;
    for (const str of searchStrs) {
        startIdx = content.indexOf(str);
        if (startIdx !== -1) break;
    }
    
    if (startIdx !== -1) {
        let endIdx = content.indexOf("\n\nfunction ", startIdx);
        if (endIdx === -1) endIdx = content.indexOf("\n\nexport default ", startIdx);
        if (endIdx === -1) endIdx = content.indexOf("\nfunction ", startIdx);
        
        if (endIdx !== -1) {
            content = content.substring(0, startIdx) + content.substring(endIdx);
            fs.writeFileSync(file, content);
            console.log("Fixed syntax in", app);
        } else {
            console.log("Could not find end of broken block for", app);
        }
    } else {
        console.log("Broken block not found in", app);
    }
});
