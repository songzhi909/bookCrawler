'use strict';
const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

let mainWindow;

// adds debug features like hotkeys for triggering dev tools and reload
// require('electron-debug')();

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800
  });

  win.loadURL(`file://${__dirname}/static/index.html`);
  // win.openDevTools();
  win.on('close', () => {
    mainWindow = null;
  });

  return win;
}

app.on('ready', () => {
  mainWindow = createWindow();
});

app.on('activate', () => {
  if(!mainWindow) {
    mainWindow = createWindow();
  }
});

app.on('window-all-closed', () => {
  if(process.platform !== 'darwin') {
    app.quit();
  }
});




const crawl = require('./lib/crawl');
crawl.bindListener();

// var _url = 'http://www.yousuu.com/booklist?s=digest';
// crawl.crawlBookRanks(_url);