const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src', 'app');

function findFiles(dir, filesList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      findFiles(fullPath, filesList);
    } else if (fullPath.endsWith('page.jsx') && !fullPath.includes('dashboard') && !fullPath.includes('login') && !fullPath.includes('signup')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('documentsApi.save')) {
        filesList.push(fullPath);
      }
    }
  }
  return filesList;
}

const filesToUpdate = findFiles(srcDir);

for (const file of filesToUpdate) {
  let content = fs.readFileSync(file, 'utf8');
  
  // Re-write catch block to ignore limit error toasts
  if (content.includes('catch { toast.error("Save failed"); }')) {
     content = content.replace('catch { toast.error("Save failed"); }', 'catch (err) { if (err.message !== "PLAN_LIMIT_REACHED") toast.error("Save failed"); }');
     fs.writeFileSync(file, content, 'utf8');
     console.log('Fixed catch block in ' + file);
  }
}
