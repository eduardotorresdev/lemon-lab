// ./public/electron.js
const path = require('path');
const fs = require('fs/promises');

const { app, BrowserWindow, Menu, ipcMain, dialog } = require('electron');
const isDev = require('electron-is-dev');

function setMainMenu(win, projects = []) {
    const template = [
        {
            role: 'appmenu',
            submenu: [
                {
                    label: 'Abrir uma nova simulação',
                    click: () => win.webContents.send('open-project-file')
                },
                {
                    label: 'Simulações recentes',
                    submenu: projects.map(project => ({
                        label: project.name,
                        click: () => win.webContents.send('open-project', project.hash)
                    }))
                },
                { type: 'separator' },
                {
                    label: 'Fechar simulação ativa',
                    click: () => {
                        win.webContents.send('close-current-simulation')
                    }
                },
                { type: 'separator' },
                {
                    label: 'Encerrar @lemon-lab',
                    click: () => {
                        ipcMain.emit('close')
                    }
                },
            ]
        },
        {
            label: 'Simulação',
            submenu: [
                {
                    label: 'Reproduzir', click: () => {
                        win.webContents.send('player-change-state', 'play')
                    }
                },
                {
                    label: 'Pausar', click: () => {
                        win.webContents.send('player-change-state', 'pause')
                    }
                },
                {
                    label: 'Aumentar velocidade', click: () => {
                        win.webContents.send('player-change-state', 'speedUp')
                    }
                },
                {
                    label: 'Diminuir velocidade', click: () => {
                        win.webContents.send('player-change-state', 'speedDown')
                    }
                },
                {
                    label: 'Reiniciar', click: () => {
                        win.webContents.send('player-change-state', 'restart')
                    }
                },
            ]
        },
        {
            label: 'Ajuda',
            submenu: [
                {
                    label: 'Sobre o projeto',
                    click: () => win.webContents.send('show-about')
                }
            ]
        }
    ];
    Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

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
    setMainMenu(win);
    win.loadURL(
        isDev
            ? 'http://localhost:8080'
            : `file://${path.join(__dirname, '../dist/index.html')}`
    );

    if (isDev) {
        win.webContents.openDevTools({ mode: 'detach' });
    }
    win.webContents.on('new-window', function (e, url) {
        e.preventDefault();
        require('electron').shell.openExternal(url);
    });
    ipcMain.on('projects', (event, projects) => {
        setMainMenu(win, projects);
    })
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
