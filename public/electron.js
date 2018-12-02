/* eslint-disable global-require */
const { app, BrowserWindow, shell, ipcMain } = require('electron');

const path = require('path');
const isDev = require('electron-is-dev');

let mainWindow;
let introWindow;
let appReady = false;

const createWindow = () => {
    mainWindow = new BrowserWindow({
        minWidth: 1280,
        show: false,
        frame: false,
        titleBarStyle: 'hidden',
        webPreferences: {
            nodeIntegration: false,
            preload: path.join(__dirname, 'preload.js'),
        },
        minHeight: 860,
        height: 860,
        width: 1280,
    });

    introWindow = new BrowserWindow({
        // backgroundColor: '#394b59',
        transparent: true,
        show: true,
        resizable: false,
        alwaysOnTop: true,
        frame: false,
        titleBarStyle: 'hidden',
        webPreferences: {
            nodeIntegration: false,
            preload: path.join(__dirname, 'preload.js'),
        },
        height: 136,
        width: 300,
    });

    introWindow.loadURL(
        isDev ? 'http://localhost:3000/intro.html' : `file://${path.join(__dirname, '../build/intro.html')}`
    );
    mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);

    if (isDev) {
        const {
            default: installExtension,
            REACT_DEVELOPER_TOOLS,
            REDUX_DEVTOOLS,
        } = require('electron-devtools-installer');

        installExtension(REACT_DEVELOPER_TOOLS)
            .then(name => {
                console.info(`Added Extension: ${name}`);
            })
            .catch(err => {
                console.info('An error occurred: ', err);
            });

        installExtension(REDUX_DEVTOOLS)
            .then(name => {
                console.info(`Added Extension: ${name}`);
            })
            .catch(err => {
                console.info('An error occurred: ', err);
            });
    }

    mainWindow.once('ready-to-show', () => {
        ipcMain.on('open-external-window', (event, arg) => {
            shell.openExternal(arg);
        });
    });

    introWindow.on('close', () => {
        if (!appReady) {
            app.quit();
        }
    });
};

app.on('ready', () => {
    createWindow();
});

app.on('window-all-closed', () => {
    app.quit();
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});

ipcMain.on('load-page', (event, arg) => {
    mainWindow.loadURL(arg);
});

ipcMain.on('open-main-window', () => {
    appReady = true;
    introWindow.close();
    mainWindow.show();
});
