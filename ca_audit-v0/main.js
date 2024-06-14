const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
// contextBridge.exposeInMainWorld('electronAPI', {
//   fetch: window.fetch
// });


function createWindow () {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  mainWindow.loadFile('login.html');
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// IPC handlers to read and write user data
ipcMain.handle('get-users', async () => {
  const data = fs.readFileSync(path.join(__dirname, 'users.json'));
  return JSON.parse(data);
});

ipcMain.handle('save-users', async (event, users) => {
  fs.writeFileSync(path.join(__dirname, 'users.json'), JSON.stringify(users, null, 2));
});

ipcMain.handle('check-admin', async (event, credentials) => {
  const data = fs.readFileSync(path.join(__dirname, 'admins.json'));
  const admins = JSON.parse(data);
  const admin = admins.find(admin => admin.username === credentials.username && admin.password === credentials.password);
  return admin !== undefined;
});

// IPC handlers to interact with JSON file
ipcMain.handle('read-clients', async () => {
  try {
    const data = fs.readFileSync('clients.json', 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading clients.json:', error);
    return [];
  }
});

ipcMain.handle('get-audits', async () => {
  try {
    
    const data = fs.readFileSync('audits.json', 'utf8');
    //console.log(data)
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading clients.json:', error);
    return [];
  }
});

ipcMain.handle('write-client', async (event, client) => {
  try {
    let data = fs.readFileSync('clients.json', 'utf8');
    let clients = JSON.parse(data);
    clients.push(client);
    fs.writeFileSync('clients.json', JSON.stringify(clients, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing to clients.json:', error);
    return false;
  }
});

ipcMain.handle('modify-client', async (event, client) => {
  try {
    let data = fs.readFileSync('clients.json', 'utf8');
    let clients = JSON.parse(data);
    const index = clients.findIndex(c => c.name === client.name);
    if (index !== -1) {
      clients[index] = client;
      fs.writeFileSync('clients.json', JSON.stringify(clients, null, 2), 'utf8');
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error modifying clients.json:', error);
    return false;
  }
});


ipcMain.handle('save-json', async (event, jsonString,client,audit) => {
  const dirPath = path.join(__dirname,'Data',client,audit);
  

  // Create the directory if it doesn't exist
  fs.mkdirSync(dirPath, { recursive: true });
  const filePath = path.join(dirPath, 'dropdownValues.json');
  // Save the JSON file
  fs.writeFileSync(filePath, jsonString, 'utf-8');

  return filePath;
});


ipcMain.handle('get-data-json', async (event, jsonString,client,audit) => {
  const dirPath = path.join(__dirname,'Data',client,audit);
  

  // Create the directory if it doesn't exist
  
  const filePath = path.join(dirPath);
  // Save the JSON file
  console.log(filePath);
  const data = fs.readFileSync(path.join(filePath,'dropdownValues.json'));
  //console.log(data)
  return JSON.parse(data);
});



// // Read the JSON file
// const dataPath = path.join(__dirname, 'acceptance-checklist.json');
// const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// // Function to generate HTML
// function generateHTML(data) {
//   let html = `
//     <!DOCTYPE html>
//     <html lang="en">
//     <head>
//       <meta charset="UTF-8">
//       <meta name="viewport" content="width=device-width, initial-scale=1.0">
//       <title>Client Continuance Checklist</title>
//       <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
//     </head>
//     <body class="bg-gray-100 p-8">
//       <div class="container mx-auto bg-white p-8 rounded shadow-md">
//         <h1 class="text-2xl font-bold mb-4">Client Continuance Checklist</h1>
//         <textarea class="w-full p-4 mb-8 border border-gray-300 rounded" rows="10" readonly>${data.legend}</textarea>
//         <div class="overflow-x-auto">
//           <table class="table-auto w-full">
//             <thead>
//               <tr>
//                 ${data.table.headers.map(header => `<th class="px-4 py-2 border">${header}</th>`).join('')}
//               </tr>
//             </thead>
//             <tbody>
//               ${data.table.data.map(row => `
//                 <tr>
//                   <td class="border px-4 py-2">${row['S NO']}</td>
//                   <td class="border px-4 py-2">${row['CRITERIA']}</td>
//                   <td class="border px-4 py-2">${row['REMARKS']}</td>
//                 </tr>`).join('')}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </body>
//     </html>
//   `;
//   return html;
// }

// // Write the HTML to a file
// const htmlContent = generateHTML(data);
// fs.writeFileSync(path.join(__dirname, 'index.html'), htmlContent, 'utf8');
// console.log('HTML file generated successfully.');
