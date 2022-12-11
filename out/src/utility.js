"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const opener = require("opener");
class Utility {
    static getUriOfActiveEditor() {
        const fileName = vscode_1.window.activeTextEditor.document.fileName;
        const options = vscode_1.workspace.getConfiguration("previewServer");
        const port = options.get("port");
        const proxy = options.get("proxy");
        const space = this.checkSpace();
        let relativePath = vscode_1.workspace.asRelativePath(fileName);
        if (space === Space.File) {
            let paths = relativePath.split("\\");
            relativePath = paths[paths.length - 1];
        }
        else if (space === Space.Workspace) {
            relativePath = vscode_1.workspace.asRelativePath(fileName, false);
        }
        if (proxy === "") {
            return vscode_1.Uri.parse(`http://localhost:${port}/${relativePath}`);
        }
        let uri = vscode_1.Uri.parse(`http://${proxy}`);
        let host = uri.authority.split(":")[0];
        return vscode_1.Uri.parse(`http://${host}:3000/${uri.path}`);
    }
    static setRandomPort() {
        const options = vscode_1.workspace.getConfiguration("previewServer");
        let port = options.get("port");
        if (!port) {
            // dynamic ports (49152–65535)
            port = Math.floor(Math.random() * 16383 + 49152);
            options.update("port", port, false)
                .then(() => {
                vscode_1.window.showInformationMessage(`change previewServer.port setting to ${port}`);
            });
        }
    }
    static openBrowser(browsers) {
        const url = decodeURIComponent(Utility.getUriOfActiveEditor().toString());
        browsers.forEach((browser) => {
            opener([browser, url]);
        });
    }
    /**
     * When vscode.workspace.rootPath is undefined (When we use `open file`, this value will be undefined),
     * we use filepath without file name.
     * @param relativePath
     */
    static getOpenFilePath(relativePath) {
        let paths = relativePath.split("\\");
        // remove file name.
        paths.pop();
        return paths.join("\\");
    }
    static checkSpace() {
        const folders = vscode_1.workspace.workspaceFolders;
        if (folders === undefined) {
            return Space.File;
        }
        else if (folders.length === 1) {
            return Space.Folder;
        }
        else {
            return Space.Workspace;
        }
    }
}
exports.Utility = Utility;
var Space;
(function (Space) {
    Space[Space["File"] = 0] = "File";
    Space[Space["Folder"] = 1] = "Folder";
    Space[Space["Workspace"] = 2] = "Workspace";
})(Space = exports.Space || (exports.Space = {}));
//# sourceMappingURL=utility.js.map