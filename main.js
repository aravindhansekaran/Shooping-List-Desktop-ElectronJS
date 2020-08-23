const electron = require('electron')
const url = require('url')
const path = require('path')

const {app, BrowserWindow, Menu, ipcMain} = electron

let mainWindow
let addWindow

app.on('ready', () => {
    
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        }
    })
    
    mainWindow.loadURL(url.format({
        pathname : path.join(__dirname, 'mainWindow.html'),
        protocol : 'file:',
        slashes : true
    }))

    mainWindow.on('closed', () => {
        app.quit()
    })

    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate)

    Menu.setApplicationMenu(mainMenu)

})

createAddWindow = () => {
    addWindow = new BrowserWindow({
        width : 300,
        height : 200,
        title : 'Add Item',
        webPreferences: {
            nodeIntegration: true
        }
    })

    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'addWindow.html'),
        protocol: 'file:',
        slashes: true
    }))

    addWindow.on('close', () => {
        addWindow = null
    })
}

ipcMain.on('item:add', (event, item) => {
    mainWindow.webContents.send('item:add', item)
    addWindow.close()
})

const mainMenuTemplate = [
    {
        label : 'File',
        submenu : [
            {
                label : 'Add Item',
                click(){
                    createAddWindow()
                }
            },
            {
                label : 'Clear Item',
                click(){
                    mainWindow.webContents.send('item:clear')
                }
            },
            {
                label : 'Quit',
                accelerator : process.platform == 'win32' ? 'Ctrl+Q' : 'Command+Q',
                click(){
                    app.quit()
                }
            }
        ]
    },
    {
        label : 'Help'
    }
]


if (process.platform == 'darwin'){
    mainMenuTemplate.unshift({})
}

if(process.env.NODE_ENV !== 'production'){
    mainMenuTemplate.push({
        label : 'Dev Tools',
        submenu : [
            {
                label: 'Toggle DevTools',
                accelerator : process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools()
                }
            },
            {
                role : 'reload'
            }
        ]
    })
}