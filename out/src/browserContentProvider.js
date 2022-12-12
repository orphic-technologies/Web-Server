"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const utility_1 = require("./utility");
class BrowserContentProvider {
    constructor() {
        this._onDidChange = new vscode.EventEmitter();
    }
    provideTextDocumentContent() {
        const editor = vscode.window.activeTextEditor;
        const uri = utility_1.Utility.getUriOfActiveEditor();
        if (editor.document.languageId !== "html") {
            return `
				<body>
					Active editor doesn't show a HTML document
				</body>`;
        }
        return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="X-UA-Compatible" content="ie=edge">
            <title>Preview</title>
            <style>iframe { position: absolute; right: 0; bottom: 0; left: 0; top: 0; border: 0; background-color: white } </style>
        </head>
        <body>
            <iframe src="${uri}" frameBorder="0" width="100%" height="100%" />
        </body>
        </html>`;
    }
    get onDidChange() {
        return this._onDidChange.event;
    }
    update(uri) {
        this._onDidChange.fire(uri);
    }
}
exports.BrowserContentProvider = BrowserContentProvider;
//# sourceMappingURL=browserContentProvider.js.map