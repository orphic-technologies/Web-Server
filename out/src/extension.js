"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const browserContentProvider_1 = require("./browserContentProvider");
const server_1 = require("./server");
const utility_1 = require("./utility");
const nls = require("vscode-nls");
const localize = nls.config({ locale: process.env.VSCODE_NLS_CONFIG })();
const provider = new browserContentProvider_1.BrowserContentProvider();
function activate(context) {
    const options = vscode.workspace.getConfiguration("previewServer");
    const ignoreNotification = options.get("ignoreNotification");
    // start web server
    startServer();
    // provider settings.
    const registration = vscode.workspace.registerTextDocumentContentProvider("preview", provider);
    vscode.workspace.onDidChangeTextDocument((e) => {
        if (e.document === vscode.window.activeTextEditor.document) {
            const previewUri = utility_1.Utility.getUriOfActiveEditor();
            provider.update(previewUri);
        }
    });
    // When configuration is changed, resume web server.
    vscode.workspace.onDidChangeConfiguration(() => {
        const settings = vscode.workspace.getConfiguration("previewServer")
            .get("isWatchConfiguration");
        if (settings) {
            resumeServer();
            if (!ignoreNotification) {
                vscode.window.showInformationMessage(localize("resumeServer.text", "Resume the Web Server."));
            }
        }
    });
    // When file is saved, reload browser.
    vscode.workspace.onDidSaveTextDocument((e) => {
        server_1.Server.reload(e.fileName);
    });
    let disposable = vscode.commands.registerCommand("extension.preview", () => {
        // set ViewColumn
        let viewColumn;
        if (vscode.window.activeTextEditor.viewColumn < 3) {
            viewColumn = vscode.window.activeTextEditor.viewColumn + 1;
        }
        else {
            viewColumn = 1;
        }
        const panel = vscode.window.createWebviewPanel("preview-server", "Preview", viewColumn, {
            enableScripts: true,
            retainContextWhenHidden: true
        });
        panel.webview.html = provider.provideTextDocumentContent();
    });
    let disposable2 = vscode.commands.registerCommand("extension.launch", () => {
        const uri = utility_1.Utility.getUriOfActiveEditor();
        const options = vscode.workspace.getConfiguration("previewServer");
        const browsers = options.get("browsers");
        const ignoreDefaultBrowser = options.get("ignoreDefaultBrowser");
        if (browsers === null && !ignoreDefaultBrowser) {
            return vscode.env.openExternal(uri);
        }
        else if (browsers !== null && !ignoreDefaultBrowser) {
            utility_1.Utility.openBrowser(browsers);
            return vscode.env.openExternal(uri);
        }
        else if (browsers !== null && ignoreDefaultBrowser) {
            return utility_1.Utility.openBrowser(browsers);
        }
        else {
            return vscode.window.showErrorMessage(localize("launchError.text", "You should set browser option or change ignoreDefultBrowser to true."));
        }
    });
    let disposable3 = vscode.commands.registerCommand("extension.stop", () => {
        server_1.Server.stop();
        if (!ignoreNotification) {
            vscode.window.showInformationMessage(localize("stopServer.text", "Stop the Web Server successfully."));
        }
    });
    let disposable4 = vscode.commands.registerCommand("extension.resume", () => {
        resumeServer();
        if (!ignoreNotification) {
            vscode.window.showInformationMessage(localize("resumeServer.text2", "Resume the Web Server."));
        }
    });
    let disposable5 = vscode.commands.registerCommand("extension.ui", () => {
        let port = 3001;
        const ui = vscode.workspace.getConfiguration("previewServer").get("ui");
        if (ui.port) {
            port = ui.port;
        }
        const uri = vscode.Uri.parse(`http://localhost:${port}`);
        return vscode.env.openExternal(uri);
    });
    context.subscriptions.push(vscode.workspace.onDidChangeWorkspaceFolders(() => resumeServer()));
    context.subscriptions.push(disposable, disposable2, disposable3, disposable4, disposable5, registration);
}
exports.activate = activate;
function startServer() {
    utility_1.Utility.setRandomPort();
    const options = vscode.workspace.getConfiguration("previewServer");
    const port = options.get("port");
    const proxy = options.get("proxy");
    const isSync = options.get("sync");
    const ignoreNotification = options.get("ignoreNotification");
    const ui = options.get("ui");
    const startupProject = options.get("startupProject");
    const space = utility_1.Utility.checkSpace();
    let rootPath = "";
    if (space === utility_1.Space.File) {
        rootPath = utility_1.Utility.getOpenFilePath(vscode.window.activeTextEditor.document.fileName);
    }
    else if (space === utility_1.Space.Folder || (space === utility_1.Space.Workspace && !startupProject)) {
        rootPath = vscode.workspace.workspaceFolders[0].uri.fsPath;
    }
    else {
        for (let folder of vscode.workspace.workspaceFolders) {
            const workspaceName = vscode.workspace.getWorkspaceFolder(folder.uri).name;
            if (workspaceName === startupProject) {
                rootPath = folder.uri.fsPath;
                break;
            }
        }
        if (rootPath === "" && !ignoreNotification) {
            vscode.window.showErrorMessage(localize("startupProjectError.text", "startupProject option is null or invalide value."));
        }
    }
    server_1.Server.start(rootPath, port, isSync, proxy, ui);
}
function resumeServer() {
    server_1.Server.stop();
    startServer();
}
function deactivate() {
    server_1.Server.stop();
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map