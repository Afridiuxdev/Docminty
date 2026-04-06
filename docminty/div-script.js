const fs = require('fs');
const lines = fs.readFileSync('src/app/page.jsx', 'utf8').split('\n');

let d = 0;
let output = [];
for (let i = 680; i < 770; i++) {
    let l = lines[i];
    let o = (l.match(/<div/g) || []).length;
    let c = (l.match(/<\/div/g) || []).length;
    let delta = o - c;
    d += delta;
    output.push(`${i + 1} | O:${o} C:${c} Δ:${delta} Σ:${d} | ${l.trim()}`);
}

fs.writeFileSync('div-debug.txt', output.join('\n'));
