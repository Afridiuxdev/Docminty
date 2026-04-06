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
  
  // Need to extract the filename generation logic. It is usually inside handleDownload.
  // We can look for download("someType", template, form, "SomeFilename.pdf")
  const downloadMatch = content.match(/download\((.*?),\s*template,\s*form,\s*(.*?)\)/);
  if (!downloadMatch) {
      console.log('Skipping ' + file + ' due to no download match');
      continue;
  }
  const docTypeStr = downloadMatch[1];
  const filenameStr = downloadMatch[2];
  
  // ensure generateBlob is extracted from useDownloadPDF
  content = content.replace(/const { download, downloading } = useDownloadPDF\(\);/, 'const { download, generateBlob, downloading } = useDownloadPDF();');
  
  // Let's replace the try block in handleSave
  // Specifically:
  // "await documentsApi.save(payload);"
  // with:
  // "payload.file = await generateBlob(docType, template, form, filename);"
  const typeParam = docTypeStr;
  const nameParam = filenameStr;
  
  const originalSaveCall = /await documentsApi\.save\(payload\);/g;
  const newSaveCall = `
            const pendingToast = toast.loading("Saving document...");
            payload.file = await generateBlob(${typeParam}, template, form, ${nameParam});
            await documentsApi.save(payload);
            toast.dismiss(pendingToast);
`;
  if (content.match(originalSaveCall)) {
      content = content.replace(originalSaveCall, newSaveCall.trim());
      fs.writeFileSync(file, content, 'utf8');
      console.log('Updated ' + file);
  } else {
      console.log('Save call not found in ' + file);
  }
}
