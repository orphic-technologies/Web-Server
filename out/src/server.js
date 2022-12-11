"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const browserSync = require("browser-sync");
class Server {
    static start(rootPath, port, isSync, proxy = "", ui = null) {
        // get browserSync instance.
        let bs;
        if (!browserSync.has("vscode-preview-server")) {
            bs = browserSync.create("vscode-preview-server");
        }
        else {
            bs = browserSync.get("vscode-preview-server");
        }
        let options;
        if (proxy === "") {
            options = {
                server: {
                    baseDir: rootPath,
                    directory: true
                },
                open: false,
                port: port,
                codeSync: isSync
            };
        }
        else {
            options = {
                proxy: proxy,
                serveStatic: ["."]
            };
        }
        if (ui.port && ui.weinrePort) {
            options.ui = {
                port: ui.port,
                weinre: {
                    port: ui.weinrePort
                }
            };
        }
        bs.init(options, (err) => {
            if (err) {
                console.log(err);
                bs.notify("Error is occured.");
            }
        });
    }
    static stop() {
        if (browserSync.has("vscode-preview-server")) {
            browserSync.get("vscode-preview-server").exit();
        }
    }
    static reload(fileName) {
        if (browserSync.has("vscode-preview-server")) {
            browserSync.get("vscode-preview-server").reload(fileName);
        }
    }
}
exports.Server = Server;
//# sourceMappingURL=server.js.map