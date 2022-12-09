// ./public/electron.js
const path = require('path');
const fs = require('fs/promises');

const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const isDev = require('electron-is-dev');

function createWindow() {
    const win = new BrowserWindow({
        width: 1280,
        height: 720,
        transparent: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            preload: path.join(__dirname, "preload.js") // use a preload script
        },
        frame: false,
    });

    win.loadURL(
        isDev
            ? 'http://localhost:8080'
            : `file://${path.join(__dirname, '../build/index.html')}`
    );

    if (isDev) {
        win.webContents.openDevTools({ mode: 'detach' });
    }

    ipcMain.on('close', () => app.quit())
    ipcMain.on('maximize', () => win.isMaximized() ? win.unmaximize() : win.maximize())
    ipcMain.on('minimize', () => win.minimize())
    ipcMain.handle('import-file', async (event) => {
        const result = await dialog.showOpenDialog({
            properties: ['openFile'],
            filters: [
                { name: 'JSON', extensions: ['json'] },
            ]
        });

        if (result.canceled) {
            return {
                error: false,
                message: 'Nenhum arquivo foi selecionado',
                file: null
            }
        } else {
            const filePath = result.filePaths[0];

            try {
                const response = await fs.readFile(filePath, { encoding: 'utf8' });

                const file = JSON.parse(response);

                return {
                    error: false,
                    message: 'Arquivo selecionado com sucesso',
                    file,
                    filePath,
                    fileName: path.basename(filePath)
                };
            } catch (error) {
                console.log(error);
                return {
                    error: true,
                    message: 'Houve um erro ao carregar o arquivo solicitado',
                    file: null
                };
            }
        }
    })
    ipcMain.handle('get-file', async (event, filePath) => {
        try {
            const response = await fs.readFile(filePath, { encoding: 'utf8' });

            const file = JSON.parse(response);

            return {
                error: false,
                message: 'Arquivo carregado com sucesso',
                file
            };
        } catch (error) {
            console.log(error);
            return {
                error: true,
                message: 'Houve um erro ao carregar o arquivo solicitado',
                file: null
            };
        }
    })
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
