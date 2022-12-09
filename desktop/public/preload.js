const {
    ipcRenderer,
    contextBridge
} = require("electron");

const os = {
    darwin: 'mac',
    win32: 'win',
    linux: 'linux'
}

contextBridge.exposeInMainWorld(
    'electron',
    {
        system: () => os[process.platform],
        maximize: () => ipcRenderer.send('maximize'),
        minimize: () => ipcRenderer.send('minimize'),
        quit: () => ipcRenderer.send('close'),
        importFile: () => new Promise(async (resolve, reject) => {
            const response = await ipcRenderer.invoke('import-file');

            if(response.error)
                reject(response)

            resolve(response)
        }),
        getFile: (filePath) => new Promise(async (resolve, reject) => {
            const response = await ipcRenderer.invoke('get-file', filePath);

            if(response.error)
                reject(response)

            resolve(response)
        })
    }
)